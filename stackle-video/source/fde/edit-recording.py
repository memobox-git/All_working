# Edits Chris's full FDE recording into the final video.
# Camera scenes show the recording; every other line plays his voice over the matching graphic,
# with the graphic's beats re-timed to the moment he says each word.
# Usage: python3 edit-recording.py plan | audio | camera | graphics | final | check
# Inputs (in the working folder V2): the Descript export of the "FDE" recording, its 10 ms loudness
# (db10ms.npy), Whisper word timings of the raw recording (words.json) and of the edited voice
# (build/voice-words.json), and the 9-minute script lines (vo9.json) the graphics were first timed to.
import json, os, re, subprocess, sys, difflib
import numpy as np

SP = '/tmp/claude-0/-home-user-All-working/7bd9d8a4-9175-5617-901d-8569546f116a/scratchpad'
V2 = f'{SP}/v2'
REPO = '/home/user/All_working/stackle-video'
RAW = f'{V2}/fde-v2-raw.mp4'
OUT = f'{V2}/build'
FPS = 30
os.makedirs(OUT, exist_ok=True)

# ---- edit decision list: (kind, number, [(source start, source end), ...]) in seconds of the recording.
# Times are close to the words; snap() moves each edge to the nearest quiet point.
EDL = [
    ('c', 1, [(1.30, 10.85)]),                                       # In this video, I'm going to explain...
    ('g', 1, [(42.92, 44.88), (55.65, 61.85), (62.40, 80.65), (81.00, 86.05)]),
    ('g', 2, [(90.85, 96.60), (100.30, 106.85), (107.55, 111.01)]),    # ends "...data and AI engineering"
    ('g', 3, [(119.05, 123.60)]),
    ('g', 4, [(125.00, 131.35), (132.00, 136.65), (137.78, 141.30), (152.60, 161.45)]),
    ('g', 5, [(165.20, 169.28), (171.12, 175.00)]),
    ('g', 7, [(191.20, 205.30)]),
    ('g', 8, [(221.22, 230.40), (231.75, 241.95)]),
    ('g', 9, [(252.75, 267.80)]),
    ('g', 10, [(270.30, 287.55)]),
    ('g', 11, [(288.35, 293.00)]),
    ('g', 12, [(295.30, 311.95)]),
    ('g', 13, [(315.00, 318.70), (322.05, 327.10)]),
    ('c', 2, [(327.80, 329.05), (337.15, 350.76), (351.24, 355.40)]),   # drops "will be,"
    ('g', 14, [(361.20, 372.60)]),
    ('c', 3, [(413.55, 426.90)]),                                     # last clean start
    ('g', 19, [(434.15, 441.70)]),
    ('g', 20, [(442.65, 451.76), (452.36, 452.95, 0.06), (456.70, 476.60, 0.28)]),   # "...an AI engineer first."
    ('g', 21, [(479.40, 489.55)]),
    ('g', 22, [(510.50, 525.70), (532.80, 548.45)]),
    ('g', 23, [(553.05, 566.80)]),
    ('g', 24, [(569.15, 578.85)]),
    ('g', 25, [(597.45, 616.90)]),
    ('g', 26, [(626.85, 634.10), (635.18, 639.30, 0.0)]),            # drops "leave a,"
    ('g', 27, [(640.55, 648.10)]),
    ('g', 28, [(650.15, 660.10)]),
    ('g', 29, [(660.85, 676.20)]),
    ('g', 30, [(688.62, 694.72), (699.35, 703.95), (709.10, 711.40), (718.60, 725.75), (726.20, 737.50)]),
    ('g', 31, [(739.95, 747.40)]),
    ('g', 32, [(752.70, 763.20)]),
    ('g', 33, [(764.30, 771.55), (772.10, 776.00), (781.95, 788.30)]),
    ('g', 34, [(788.50, 789.80), (792.85, 810.00)]),
    ('g', 35, [(819.55, 837.75)]),
    ('c', 4, [(874.45, 884.25)]),
    ('g', 36, [(928.00, 931.70), (932.65, 943.40), (948.15, 955.15)]),
    ('g', 37, [(970.40, 976.20), (987.35, 989.55), (989.90, 995.35)]),
    ('c', 6, [(1009.60, 1014.15)]),
]
# edges set by hand at measured quiet points (not snapped)
EXTRA = {('g', 14): 1.2, ('g', 33): 0.6, ('g', 35): 0.8}
EXACT = {634.10, 635.18, 451.76, 452.36, 350.76, 351.24, 413.55, 452.95, 44.88, 111.01, 169.28, 171.12, 137.78, 141.30, 221.22, 230.40, 699.35, 711.40}

db = np.load(f'{V2}/db10ms.npy')          # 10 ms loudness of the recording, dB
QUIET, SPEECH = -40.0, -36.0
F = lambda t: int(round(t * 100))

def snap_start(t):
    if t in EXACT: return t
    lo, hi = F(t - 0.30), F(t + 0.06)
    f = lo + int(np.argmin(db[lo:hi]))
    on = f
    while on < hi + 30 and db[on] < SPEECH: on += 1        # first speech after the quiet point
    return max(f, on - 8) / 100                            # keep 80 ms before the first sound

def snap_end(t):
    if t in EXACT: return t
    lo, hi = F(t - 0.06), F(t + 0.30)
    f = lo + int(np.argmin(db[lo:hi]))
    off = f
    while off > lo - 30 and db[off] < SPEECH: off -= 1     # last speech before the quiet point
    return min(f, off + 12) / 100                          # keep 120 ms after the last sound

def split_pauses(s, e, longest, keep):
    """Shortens silent stretches longer than `longest` to `keep` seconds; returns the kept pieces."""
    pieces, a, f = [], s, F(s)
    end = F(e)
    while f < end:
        if db[f] < QUIET:
            g = f
            while g < end and db[g] < QUIET: g += 1
            if (g - f) / 100 > longest and g < end:
                pieces.append((a, f / 100 + keep / 2))
                a = g / 100 - keep / 2
            f = g
        else:
            f += 1
    pieces.append((a, e))
    return [(x, y) for x, y in pieces if y - x > 0.05]

def quant(x): return round(x * FPS) / FPS

def plan():
    words = [w for s in json.load(open(f'{V2}/words.json')) for w in s['words']]
    blocks, t = [], 0.0
    for i, (kind, n, segs) in enumerate(EDL):
        pieces = []
        for si, seg in enumerate(segs):
            s, e = seg[:2]
            s2, e2 = snap_start(s), snap_end(e)
            if si and kind == 'g': pieces.append(('gap', seg[2] if len(seg) > 2 else 0.12))   # a breath of room tone between takes
            pieces += split_pauses(s2, e2, 0.70, 0.40) if kind == 'c' else split_pauses(s2, e2, 0.45, 0.30)
        # every piece a whole number of frames, so picture and sound stay locked
        pieces = [p if p[0] == 'gap' else (p[0], p[0] + quant(p[1] - p[0])) for p in pieces]
        plen = lambda p: p[1] if p[0] == 'gap' else p[1] - p[0]
        dur = sum(plen(p) for p in pieces)
        nxt = EDL[i + 1][0] if i + 1 < len(EDL) else None
        gap = 0.0 if kind == 'c' else (0.30 if nxt == 'g' else 0.20)
        if nxt is None: gap = 0.0
        gap += EXTRA.get((kind, n), 0.0)
        total = quant(dur + gap)
        # where each spoken word lands inside the block
        bw, off = [], 0.0
        for p in pieces:
            if p[0] == 'gap': off += p[1]; continue
            a, b = p
            for w in words:
                if a <= (w[0] + w[1]) / 2 < b: bw.append([round(off + max(w[0], a) - a, 3), round(off + min(w[1], b) - a, 3), w[2].strip()])
            off += b - a
        blocks.append({'kind': kind, 'n': n, 'start': round(t, 4), 'dur': round(total, 4), 'speech': round(dur, 4),
                       'pieces': [list(p) if p[0] == 'gap' else [round(p[0], 3), round(p[1], 3)] for p in pieces], 'words': bw})
        t += total
    json.dump(blocks, open(f'{OUT}/plan.json', 'w'), indent=1)
    print(f'{len(blocks)} blocks, {t:.1f} s ({int(t // 60)}:{t % 60:04.1f})')
    for b in blocks:
        print(f"{'cam' if b['kind'] == 'c' else 'G'}{b['n']:>2}  {b['start']:7.2f}  {b['dur']:6.2f}s  {len(b['pieces'])} pieces  " + ' '.join(w[2] for w in b['words'])[:90])

def run(cmd): subprocess.run(cmd, check=True)

def audio():
    blocks = json.load(open(f'{OUT}/plan.json'))
    sr = 48000
    full = f'{V2}/audio48.f32'
    if not os.path.exists(full):
        run(['ffmpeg', '-y', '-v', 'error', '-i', RAW, '-ac', '1', '-ar', str(sr), '-f', 'f32le', full])
    A = np.fromfile(full, dtype=np.float32)
    tone = A[int(386 * sr):int(397 * sr)]                   # room tone from a silent stretch of the recording
    fade = int(0.012 * sr)
    out = []
    for b in blocks:
        n0 = sum(len(x) for x in out)
        for a, e in b['pieces']:
            if a == 'gap':
                out.append(np.resize(tone, int(round(e * sr)))); continue
            x = A[int(round(a * sr)):int(round(a * sr)) + int(round((e - a) * sr))].copy()
            x[:fade] *= np.linspace(0, 1, fade); x[-fade:] *= np.linspace(1, 0, fade)
            out.append(x)
        want = int(round((b['start'] + b['dur']) * sr)) - sum(len(x) for x in out)
        if want > 0: out.append(np.resize(tone, want) * np.concatenate([np.linspace(0, 1, min(fade, want)), np.ones(max(0, want - fade))])[:want])
    y = np.concatenate(out).astype(np.float32)
    y.tofile(f'{OUT}/voice.f32')
    pre = ['-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', f'{OUT}/voice.f32']
    chain = 'highpass=f=75,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=180:makeup=2'
    r = subprocess.run(['ffmpeg', '-y', '-hide_banner'] + pre + ['-af', chain + ',loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    run(['ffmpeg', '-y', '-v', 'error'] + pre + ['-af', f'{chain},{ln},aresample=48000', '-ac', '2', '-c:a', 'pcm_s16le', f'{OUT}/voice.wav'])
    print('voice.wav', round(len(y) / sr, 2), 's')

def camera():
    blocks = json.load(open(f'{OUT}/plan.json'))
    for b in blocks:
        if b['kind'] != 'c': continue
        for k, (a, e) in enumerate(b['pieces']):
            out = f"{OUT}/cam{b['n']}-{k}.mp4"
            zoom = 'crop=1746:982:87:49,scale=1920:1080,' if k % 2 else ''   # alternate a 1.1x punch-in at each cut
            nfr = int(round((e - a) * FPS))
            run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{a:.3f}', '-i', RAW, '-frames:v', str(nfr), '-an',
                 '-vf', f'{zoom}fps={FPS},format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', out])
            print('wrote', out, nfr, 'frames')

# ---- graphics: line each graphic's beats up with the words he actually said
STOP = set('a an the and or of to in on at for is are be it its this that with by as so you your if than then which what who they their we i'.split())
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())

def warp_for(n, bw, speech):
    vo9 = json.load(open(f'{V2}/vo9.json'))[str(n)].split()
    a = [norm(w) for w in vo9]
    b = [norm(w[2]) for w in bw]
    anchors = [[0.0, 0.0]]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            i, j = blk.a + k, blk.b + k
            if blk.size < 2 and a[i] in STOP: continue
            x, y = 0.6 + i / 2.5, bw[j][0]
            if x > anchors[-1][0] + 0.05 and y > anchors[-1][1] + 0.05: anchors.append([round(x, 3), round(y, 3)])
    vend = 0.6 + len(a) / 2.5
    last_i = (anchors[-1][0] - 0.6) * 2.5
    if last_i >= 0.8 * len(a) and vend > anchors[-1][0] + 0.05 and speech > anchors[-1][1] + 0.05:
        anchors.append([round(vend, 3), round(speech, 3)])
    return anchors

def wordtime(bw, text, nth=0):
    """Block time of the start of the nth match of a word sequence in the block."""
    seq = [norm(x) for x in text.split()]
    ws = [norm(w[2]) for w in bw]
    hits = [k for k in range(len(ws)) if ws[k:k + len(seq)] == seq]
    return bw[hits[nth]][0]

def timing_for(b, man):
    n, bw = b['n'], b['words']
    if n == 1:
        t25, t1200, t26, t5200 = wordtime(bw, '2025'), wordtime(bw, '1200'), wordtime(bw, '2026'), wordtime(bw, '5200')
        t7, tmed = wordtime(bw, '7 times'), wordtime(bw, 'median salary')
        return {'tmap': [[0, 0.5, 0, 0.5], [0.8, 1.3, 0.9, 1.4], [1.6, 2.1, t25, t1200], [2.4, 3.3, t26, t5200],
                         [4.6, 4.6, t7, t7], [9.2, 9.4, tmed, tmed + 0.2]]}
    W = lambda p, k=0: wordtime(bw, p, k)
    if n == 14:   # the strike and the "typical" card land on "that's only true..."
        return {'tmap': [[0, 3.2, 0, 1.4], [3.4, 3.6, W('seen videos'), W('a million') - 0.3], [8.6, 8.6, W('only true'), W('only true')],
                         [15.4, 15.4, W('most of that money'), W('most of that money')],
                         [20.2, 23.2, W('stock') + 0.2, W('stock') + 1.0]]}
    if n == 26:   # flow steps on "finds the right documents", "the model", "answers"; example on "leave policy"
        tf, tl = W('finds the right documents'), W('like a leave policy')
        ta = b['speech'] - 1.3
        return {'tmap': [[0.4, 0.6, 0.2, 0.4], [3.0, 3.0, W('just means'), W('just means')], [4.6, 5.2, tf - 0.4, tf + 0.2],
                         [7.0, 7.6, tl + 0.6, tl + 1.2], [10.2, 10.6, ta - 0.4, ta], [13.0, 13.0, ta + 0.5, ta + 0.5],
                         [14.6, 15.8, tf + 0.5, tf + 1.3], [19.0, 19.0, tl + 0.2, tl + 0.2], [22.4, 22.4, ta + 0.3, ta + 0.3]]}
    if n == 30:   # the chatbot example plays when he tells it
        return {'tmap': [[0.4, 0.6, 0.2, 0.4], [3.0, 3.0, W('which means you ask'), W('which means you ask')],
                         [7.8, 9.0, W('discovery just means') - 0.2, W('discovery just means') + 0.6],
                         [13.4, 15.6, W('manager asks') - 0.8, W('chatbot')], [17.8, 18.6, W('a few questions'), W('a few questions') + 0.6],
                         [20.2, 21.8, W('learn the staff'), W('right form') - 0.4]]}
    if n == 37:   # call card, then masterclass card with both chips; ends there
        tl, tj = W('the link is'), W('and if you want')
        return {'tmap': [[0.1, 0.3, 0.1, 0.3], [8.4, 8.4, tl, tl], [11.2, 11.6, tj - 0.3, tj + 0.1],
                         [19.8, 19.8, W('data'), W('data')], [20.8, 20.8, b['speech'] - 1.5, b['speech'] - 1.5]]}   # the transcript stops at "Data"
    t = {'ts': man.get('ts'), 'tmap': man.get('tmap')}
    if n == 2: t['tmap'] = [[0, 19.1, 0, 19.1]]       # he stops at "data and AI engineering": end on the Stackle beat
    t['twarp'] = warp_for(n, bw, b['speech'])
    return t

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
    blocks = block_words(json.load(open(f'{OUT}/plan.json')))
    man = {j['graphic']: j for j in json.load(open(f'{REPO}/source/fde/manifest.json'))}
    for b in blocks:
        if b['kind'] != 'g': continue
        t = timing_for(b, man[b['n']])
        cues = [y for y in (tmap_py(x, t) for x in cue_times(f"{REPO}/source/{man[b['n']]['scene']}")) if y is not None]
        late = [round(y, 1) for y in cues if y > b['dur'] - 0.4]
        print(f"G{b['n']:>2} dur {b['dur']:5.1f} speech {b['speech']:5.1f} anchors {len(t.get('twarp') or [])-1:2d} last cue {max(cues):5.1f}  late {late}")

def block_words(blocks):
    W = [w for s in json.load(open(f'{OUT}/voice-words.json')) for w in s['words']]
    for b in blocks:
        b['words'] = [[round(w[0] - b['start'], 3), round(w[1] - b['start'], 3), w[2].strip()] for w in W
                      if b['start'] <= (w[0] + w[1]) / 2 < b['start'] + b['dur']]
    return blocks

def graphics(only=None):
    blocks = block_words(json.load(open(f'{OUT}/plan.json')))
    man = {j['graphic']: j for j in json.load(open(f'{REPO}/source/fde/manifest.json'))}
    sys.path.insert(0, REPO)
    jobs = []
    for b in blocks:
        if b['kind'] != 'g' or (only and b['n'] not in only): continue
        t = timing_for(b, man[b['n']])
        jobs.append({'scene': f"{REPO}/source/{man[b['n']]['scene']}", 'out': f"{OUT}/g{b['n']:02d}.mp4", 'secs': b['dur'], 'timing': t})
    json.dump(jobs, open(f'{OUT}/graphics-jobs.json', 'w'), indent=1)
    js = f"""
const {{ renderScene }} = require('{REPO}/source/render.js');
const jobs = require('{OUT}/graphics-jobs.json');
const W = +(process.argv[2] || 3);
(async () => {{
  let i = 0;
  await Promise.all(Array.from({{ length: W }}, async () => {{
    while (i < jobs.length) {{ const j = jobs[i++]; await renderScene(j.scene, j.out, j.secs, {FPS}, j.timing); }}
  }}));
}})();
"""
    open(f'{OUT}/render-graphics.js', 'w').write(js)
    env = dict(os.environ, NODE_PATH=subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    subprocess.run(['node', f'{OUT}/render-graphics.js', '3'], check=True, env=env)

def final():
    blocks = json.load(open(f'{OUT}/plan.json'))
    files = []
    for b in blocks:
        if b['kind'] == 'g': files.append(f"{OUT}/g{b['n']:02d}.mp4")
        else: files += [f"{OUT}/cam{b['n']}-{k}.mp4" for k in range(len(b['pieces']))]
    open(f'{OUT}/video-list.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/video-list.txt', '-c', 'copy', f'{OUT}/video-only.mp4'])
    out = f'{V2}/FDE-Roadmap-2026-final-1080p.mp4'
    run(['ffmpeg', '-y', '-v', 'error', '-i', f'{OUT}/video-only.mp4', '-i', f'{OUT}/voice.wav', '-map', '0:v', '-map', '1:a',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out])
    print('wrote', out)

if __name__ == '__main__':
    step = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    if step in ('plan', 'all'): plan()
    if step in ('audio', 'all'): audio()
    if step in ('camera', 'all'): camera()
    if step in ('graphics', 'all'): graphics([int(x) for x in sys.argv[2:]] or None)
    if step in ('final', 'all'): final()
    if step == 'check': check()
