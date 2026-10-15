# Version 3 of the FDE video: Chris's HeyGen digital twin voices the whole script.
# Every graphic plays over the twin's voice (HeyGen speech, with word timings), and the twin
# delivers all six on-camera scenes. Graphic beats are timed to the twin's words.
# Usage: python3 edit3.py plan | check | audio | camera | graphics | final
import json, os, re, subprocess, sys, difflib
import numpy as np

SP = '/tmp/claude-0/-home-user-All-working/7bd9d8a4-9175-5617-901d-8569546f116a/scratchpad'
V2 = f'{SP}/v2'
HG = f'{SP}/heygen'
V3 = f'{HG}/v3'
REPO = '/home/user/All_working/stackle-video'
OUT = f'{V2}/build3'
FPS = 30
os.makedirs(OUT, exist_ok=True)
SCRIPT = json.load(open(f'{SP}/hormozi/v7.json'))     # the final script, in running order
CAMERA = {k: f'{V3}/{k}.mp4' for k in ('C1', 'C2', 'C3', 'C4', 'C6')}
CAMERA['C5'] = f'{HG}/c5-avatar.mp4'
EXTRA = {14: 0.6, 33: 0.6, 35: 0.8}       # a short visual beat after these lines, so the last card can land

quant = lambda x: round(x * FPS) / FPS

def run(cmd): subprocess.run(cmd, check=True)

def clip_len(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                                capture_output=True, text=True).stdout)

def load48(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def plan():
    order = SCRIPT['ORDER']
    blocks, t = [], 0.0
    for i, k in enumerate(order):
        nxt = order[i + 1] if i + 1 < len(order) else None
        if k.startswith('C'):
            speech = clip_len(CAMERA[k])
            dur = quant(speech + (0.25 if nxt else 0.6))           # hold the last frame for a beat
            blocks.append({'kind': 'c', 'n': int(k[1:]), 'start': round(t, 4), 'dur': dur, 'speech': round(speech, 3), 'src': CAMERA[k], 'words': []})
        else:
            n = int(k[1:])
            wav = f'{V3}/tts/{k}.wav'
            speech = clip_len(wav)
            words = [[w['start'], w['end'], w['word']] for w in json.load(open(f'{V3}/tts/{k}.json')) if w['word'] != '<start>']
            gap = (0.35 if nxt and nxt.startswith('G') else 0.25) + EXTRA.get(n, 0.0)
            blocks.append({'kind': 'g', 'n': n, 'start': round(t, 4), 'dur': quant(speech + gap), 'speech': round(speech, 3), 'src': wav, 'words': words})
        t += blocks[-1]['dur']
    json.dump(blocks, open(f'{OUT}/plan.json', 'w'), indent=1)
    print(f'{len(blocks)} blocks, {t:.1f} s ({int(t // 60)}:{t % 60:04.1f})')

def audio():
    blocks = json.load(open(f'{OUT}/plan.json'))
    sr = 48000
    fade = int(0.01 * sr)
    out = np.zeros(int(round((blocks[-1]['start'] + blocks[-1]['dur']) * sr)), dtype=np.float32)
    for b in blocks:
        x = load48(b['src'])[:int(round(b['dur'] * sr))]
        x[:fade] *= np.linspace(0, 1, fade); x[-fade:] *= np.linspace(1, 0, fade)
        a = int(round(b['start'] * sr))
        out[a:a + len(x)] += x
    out.tofile(f'{OUT}/voice.f32')
    pre = ['-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', f'{OUT}/voice.f32']
    chain = 'highpass=f=75,acompressor=threshold=-21dB:ratio=2:attack=8:release=180:makeup=1.5'
    r = subprocess.run(['ffmpeg', '-y', '-hide_banner'] + pre + ['-af', chain + ',loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    run(['ffmpeg', '-y', '-v', 'error'] + pre + ['-af', f'{chain},{ln},aresample=48000', '-ac', '2', '-c:a', 'pcm_s16le', f'{OUT}/voice.wav'])
    print('voice.wav', round(len(out) / sr, 2), 's')

def camera():
    # the twin's look has a caption baked into its footage, so every scene is framed as a close-up above it
    for b in json.load(open(f'{OUT}/plan.json')):
        if b['kind'] != 'c': continue
        nfr = int(round(b['dur'] * FPS))
        run(['ffmpeg', '-y', '-v', 'error', '-i', b['src'], '-an', '-frames:v', str(nfr),
             '-vf', f'crop=1422:800:249:0,scale=1920:1080,fps={FPS},tpad=stop_mode=clone:stop_duration=2,format=yuv420p',
             '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', f"{OUT}/cam{b['n']}.mp4"])
        print('wrote camera scene', b['n'], nfr, 'frames')

# ---- graphics: beats land on the twin's words
STOP = set('a an the and or of to in on at for is are be it its this that with by as so you your if than then which what who they their we i'.split())
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())

def warp_for(n, bw, speech):
    vo9 = json.load(open(f'{V2}/vo9.json'))[str(n)].split()
    a = [norm(w) for w in vo9]
    b = [norm(w[2]) for w in bw]
    anchors = [[0.0, 0.0]]
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            i, j = blk.a + k, blk.b + k
            if blk.size < 2 and a[i] in STOP: continue
            x, y = 0.6 + i / 2.5, bw[j][0]
            if x > anchors[-1][0] + 0.05 and y > anchors[-1][1] + 0.05: anchors.append([round(x, 3), round(y, 3)])
    vend = 0.6 + len(a) / 2.5
    if (anchors[-1][0] - 0.6) * 2.5 >= 0.8 * len(a) and vend > anchors[-1][0] + 0.05 and speech > anchors[-1][1] + 0.05:
        anchors.append([round(vend, 3), round(speech, 3)])
    return anchors

def wordtime(bw, text, nth=0):
    """Block time of the start of the nth match of a word sequence ("a|b" tries a, then b)."""
    ws = [norm(w[2]) for w in bw]
    for alt in text.split('|'):
        seq = [norm(x) for x in alt.split()]
        hits = [k for k in range(len(ws)) if ws[k:k + len(seq)] == seq]
        if len(hits) > nth: return bw[hits[nth]][0]
    raise KeyError(f'not in block: {text}  ({" ".join(ws)[:200]})')

def timing_for(b, man):
    n, bw = b['n'], b['words']
    W = lambda p, k=0: wordtime(bw, p, k)
    if n == 1:
        t25, t12, t26, t52 = W('2025'), W('twelve hundred'), W('2026'), W('fifty-two hundred|fiftytwo hundred')
        t7, tm = W('seven times'), W('median salary')
        return {'tmap': [[0, 0.5, 0, 0.5], [0.8, 1.3, 0.9, 1.4], [1.6, 2.1, t25, t12], [2.4, 3.3, t26, t52], [4.6, 4.6, t7, t7], [9.2, 9.4, tm, tm + 0.2]]}
    if n == 14:
        return {'tmap': [[0, 3.2, 0, 1.4], [3.4, 3.6, W('seen videos'), W('a million') - 0.3], [8.6, 8.6, W('only true'), W('only true')],
                         [15.4, 15.4, W('most of that money'), W('most of that money')], [20.2, 23.2, W('stock') - 0.1, W('stock') + 0.5]]}
    if n == 15:
        tm = W('do the math')
        return {'tmap': [[0.2, 0.6, 0.2, 0.6], [5.6, 6.4, 0.9, 1.1], [15.8, 16.0, 1.7, 1.9], [20.2, 20.4, 2.5, 2.7], [40, 41, tm - 0.4, tm],
                         [42, 42, W('the median fde'), W('the median fde')], [43, 43, W('median software'), W('median software')],
                         [44, 44, W('minus'), W('minus')], [45, 45, W('five years'), W('five years')], [46, 46, W('what would it'), W('what would it')]]}
    if n == 26:
        tf, tl, tt, ta = W('finds the right documents'), W('like a leave policy'), W('then the model'), W('answers from')
        return {'tmap': [[0.4, 0.6, 0.2, 0.4], [3.0, 3.0, W('just means'), W('just means')], [4.6, 5.2, tf - 0.4, tf + 0.2],
                         [7.0, 7.6, tt - 0.4, tt + 0.2], [10.2, 10.6, ta - 0.4, ta], [13.0, 13.0, W('a lot of retrieval'), W('a lot of retrieval')],
                         [14.6, 15.8, tf + 0.5, tf + 1.3], [19.0, 19.0, tl + 0.2, tl + 0.2], [22.4, 22.4, ta + 0.3, ta + 0.3]]}
    if n == 29:
        tl = W("let's say you change")
        return {'tmap': [[0.4, 0.6, 0.2, 0.4], [4.6, 5.6, 1.4, 2.4], [10.2, 12.4, W('test questions') - 0.4, W('known answers')],
                         [15.8, 15.8, W('after every change'), W('after every change')], [19.8, 19.8, W('prove'), W('prove')],
                         [22.6, 23.8, tl - 0.3, W('one line')], [27.4, 27.4, W('hundred test'), W('hundred test')],
                         [30.0, 31.2, W('score goes up'), W('score goes up') + 1.2], [32.6, 32.6, W('customers trust'), W('customers trust')]]}
    if n == 30:
        return {'tmap': [[0.4, 0.6, 0.2, 0.4], [3.0, 3.0, W('which means you ask'), W('which means you ask')],
                         [7.8, 9.0, W('discovery just means') - 0.2, W('discovery just means') + 0.6],
                         [13.4, 15.6, W('manager asks') - 0.8, W('chatbot')], [17.8, 18.6, W('a few questions'), W('a few questions') + 0.6],
                         [20.2, 21.8, W('learn the staff'), W('right form') - 0.4]]}
    if n == 37:
        tl, tj = W("the link's|the links|the link"), W('and if you want')
        return {'tmap': [[0.1, 0.3, 0.1, 0.3], [8.4, 8.4, tl, tl], [11.2, 11.6, tj - 0.3, tj + 0.1],
                         [19.8, 19.8, W('data engineering'), W('data engineering')], [20.8, 20.8, W('ai engineering'), W('ai engineering')]]}
    return {'ts': man.get('ts'), 'tmap': man.get('tmap'), 'twarp': warp_for(n, bw, b['speech'])}

def cue_times(html):
    s = open(html).read()
    ts = [float(x) for x in re.findall(r'data-(?:in|out|cin|bin|hin|draw|glow|glowout|type)="([0-9.]+)"', s)]
    for mv in re.findall(r'data-mv="([0-9.]+) ([0-9.]+)', s): ts += [float(mv[0]), float(mv[1])]
    return sorted(set(ts))

def tmap_py(x, t):
    if t.get('tmap'):
        for o0, o1, n0, n1 in t['tmap']:
            if o0 <= x <= o1: y = n0 + (x - o0) * (n1 - n0) / ((o1 - o0) or 1); break
        else: return None
    else: y = x * (t.get('ts') or 1)
    m = t.get('twarp')
    if not m: return y
    if y <= m[0][0]: return m[0][1] + (y - m[0][0])
    for (p, q), (r, u) in zip(m, m[1:]):
        if y <= r: return q + (y - p) * (u - q) / ((r - p) or 1)
    return m[-1][1] + (y - m[-1][0])

def check():
    man = {j['graphic']: j for j in json.load(open(f'{REPO}/source/fde/manifest.json'))}
    for b in json.load(open(f'{OUT}/plan.json')):
        if b['kind'] != 'g': continue
        t = timing_for(b, man[b['n']])
        cues = [y for y in (tmap_py(x, t) for x in cue_times(f"{REPO}/source/{man[b['n']]['scene']}")) if y is not None]
        late = [round(y, 1) for y in cues if y > b['dur'] - 0.4]
        print(f"G{b['n']:>2} dur {b['dur']:5.1f} speech {b['speech']:5.1f} anchors {len(t.get('twarp') or []) - 1:2d} last cue {max(cues):5.1f}  late {late}")

def graphics(only=None):
    man = {j['graphic']: j for j in json.load(open(f'{REPO}/source/fde/manifest.json'))}
    jobs = [{'scene': f"{REPO}/source/{man[b['n']]['scene']}", 'out': f"{OUT}/g{b['n']:02d}.mp4", 'secs': b['dur'], 'timing': timing_for(b, man[b['n']])}
            for b in json.load(open(f'{OUT}/plan.json')) if b['kind'] == 'g' and (not only or b['n'] in only)]
    json.dump(jobs, open(f'{OUT}/graphics-jobs.json', 'w'), indent=1)
    open(f'{OUT}/render-graphics.js', 'w').write(f"""
const {{ renderScene }} = require('{REPO}/source/render.js');
const jobs = require('{OUT}/graphics-jobs.json');
(async () => {{
  let i = 0;
  await Promise.all(Array.from({{ length: 3 }}, async () => {{
    while (i < jobs.length) {{ const j = jobs[i++]; await renderScene(j.scene, j.out, j.secs, {FPS}, j.timing); }}
  }}));
}})();
""")
    env = dict(os.environ, NODE_PATH=subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    subprocess.run(['node', f'{OUT}/render-graphics.js'], check=True, env=env)

def final():
    blocks = json.load(open(f'{OUT}/plan.json'))
    files = [f"{OUT}/g{b['n']:02d}.mp4" if b['kind'] == 'g' else f"{OUT}/cam{b['n']}.mp4" for b in blocks]
    open(f'{OUT}/video-list.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/video-list.txt', '-c', 'copy', f'{OUT}/video-only.mp4'])
    out = f'{V2}/FDE-Roadmap-2026-avatar-1080p.mp4'
    run(['ffmpeg', '-y', '-v', 'error', '-i', f'{OUT}/video-only.mp4', '-i', f'{OUT}/voice.wav', '-map', '0:v', '-map', '1:a',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out])
    print('wrote', out)

if __name__ == '__main__':
    step = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    {'plan': plan, 'check': check, 'audio': audio, 'camera': camera, 'final': final,
     'graphics': lambda: graphics([int(x) for x in sys.argv[2:]] or None)}[step]()
