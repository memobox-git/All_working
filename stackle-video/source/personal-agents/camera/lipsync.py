"""Puts Chris's camera takes on the narration, lip-synced.

Chris filmed his camera lines in one recording (footage/chris/personal-ai.mp4),
with retakes, speaking each line himself. The video keeps the ElevenLabs
narration, so his picture has to follow it: for each line this matches his
words (camera/takes-words.json, ElevenLabs Scribe) to the script's words
(vo/timeline.json), and retimes his take between matched words, so his mouth
moves on the same words as the voice.

Each line gets a frame sequence in clips/face-<line>/ (30 fps, frame 1 at
`from` in its slot), played by the scenes in scenes-camera.js. Lines he didn't
reach end at `to`, and the scene cuts to graphics there.
Writes clips/face-*/, camera/faces.js (window.FACES) and refreshes clips/frames.js.
Usage: python3 camera/lipsync.py
"""
import difflib, json, os, re, shutil, subprocess

FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
VIDEO = os.path.join(ROOT, '..', '..', 'footage', 'chris', 'personal-ai.mp4')

# line: (his take, start and end in his recording), and the script word
# where his take stops (None = he said the whole line); `start` is the word
# his face starts on, when the line opens on a graphic
TAKES = {
    '3': ((34.92, 52.20), None),
    '4': ((77.68, 85.44), 'and more than', 'i am chris'),
    '5': ((95.04, 110.24), None),
    '7': ((130.90, 138.46), None),
    '10': ((142.80, 163.10), None),
    '13': ((164.88, 172.08), None),
    '17': ((181.12, 187.60), 'agents work the same'),
    '22': ((194.36, 196.34), None),
    '26': ((200.68, 209.38), None),
    '27': ((217.66, 220.34), "and you're not sure"),
    '31': ((231.08, 232.26), 'that personal agents'),
}
MIN_RATE, MAX_RATE = 0.55, 2.0      # how much faster or slower his take may play

norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower().replace('-', ''))
SAME = {'stackroom': 'stackle', 'cloud': 'claude', '10': 'ten', 'protective': 'proactive'}

T = json.load(open(os.path.join(ROOT, 'vo', 'timeline.json')))
slots = {s['paras'][0]: (i + 1, s) for i, s in enumerate(T['slots']) if len(s['paras']) == 1}
his_all = [w for w in json.load(open(os.path.join(HERE, 'takes-words.json')))['words'] if w['type'] == 'word']


def find(words, phrase):
    p = phrase.split()
    for i in range(len(words) - len(p) + 1):
        if [w for w, _ in words[i:i + len(p)]] == p:
            return i
    raise ValueError(phrase)


faces = {}
for line, spec in TAKES.items():
    (ha, hb), stop = spec[0], spec[1]
    n, slot = slots[line]
    words = slot['words']                                   # [norm, time in slot]
    i0 = find(words, spec[2]) if len(spec) > 2 else 0
    i1 = find(words, stop) if stop else len(words)
    fa = 0.0 if i0 == 0 else max(0.0, words[i0][1] - 0.15)
    fb = slot['dur'] if stop is None else words[i1][1] - 0.05
    his = [w for w in his_all if ha - 0.01 <= w['start'] <= hb]
    hn = [SAME.get(norm(w['text']), norm(w['text'])) for w in his]
    sn = [w for w, _ in words[i0:i1]]

    # anchors: the moments his word and the voice's word start together
    anchors = []
    for tag, a1, a2, b1, b2 in difflib.SequenceMatcher(None, hn, sn, autojunk=False).get_opcodes():
        if tag == 'equal' or (tag == 'replace' and a2 - a1 == b2 - b1):
            anchors += [(words[i0 + b1 + k][1], his[a1 + k]['start']) for k in range(a2 - a1)]
    # his last word ends where the voice's last covered word ends
    last_end = his[-1]['end']
    anchors.append((min(fb, words[i1 - 1][1] + (last_end - his[-1]['start'])), last_end))
    anchors.sort()
    kept = [anchors[0]]
    for t, s in anchors[1:]:                                # keep the speed believable
        dt, ds = t - kept[-1][0], s - kept[-1][1]
        if dt > 0.04 and MIN_RATE <= ds / dt <= MAX_RATE:
            kept.append((t, s))
    # before the first word and after the last, he plays at normal speed
    kept = [(fa, kept[0][1] - (kept[0][0] - fa))] + kept + [(fb, kept[-1][1] + (fb - kept[-1][0]))]

    def src(t):
        for (t1, s1), (t2, s2) in zip(kept, kept[1:]):
            if t <= t2:
                return s1 + (s2 - s1) * (t - t1) / max(t2 - t1, 1e-6)
        return kept[-1][1]

    frames = round((fb - fa) * FPS)
    times = [max(0.0, src(fa + k / FPS)) for k in range(frames)]
    lo, hi = min(times), max(times) + 0.1
    tmp = os.path.join(ROOT, 'clips', f'.src-{line}')
    out = os.path.join(ROOT, 'clips', f'face-{line}')
    for d in (tmp, out):
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(d)
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-ss', f'{lo:.3f}', '-i', VIDEO, '-t', f'{hi - lo:.3f}',
                           '-vf', f'fps={FPS}', '-q:v', '3', os.path.join(tmp, 'f%05d.jpg')])
    have = len(os.listdir(tmp))
    for k, s in enumerate(times):
        j = min(have, max(1, 1 + round((s - lo) * FPS)))
        os.link(os.path.join(tmp, f'f{j:05d}.jpg'), os.path.join(out, f'f{k + 1:05d}.jpg'))
    shutil.rmtree(tmp)
    faces[line] = {'slot': n, 'from': round(fa, 3), 'to': round(fb, 3), 'full': stop is None and fa == 0, 'anchors': len(kept)}
    print(f'line {line:>3} slot {n:>2}: face {fa:5.2f}-{fb:5.2f} s of {slot["dur"]:5.2f}, {len(kept)} anchors, take {ha}-{hb}')

open(os.path.join(HERE, 'faces.js'), 'w').write('window.FACES = ' + json.dumps(faces) + ';\n')
clips = os.path.join(ROOT, 'clips')
with open(os.path.join(clips, 'frames.js'), 'w') as f:
    f.write('window.CLIP_FRAMES = {\n')
    for d in sorted(os.listdir(clips)):
        p = os.path.join(clips, d)
        if os.path.isdir(p) and d != 'stills' and not d.startswith('.'):
            f.write(f"  '{d}': {len([x for x in os.listdir(p) if x.endswith('.jpg')])},\n")
    f.write('};\n')
