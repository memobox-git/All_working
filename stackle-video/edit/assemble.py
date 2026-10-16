"""Frame-exact assembly: every cut lands on a frame boundary and the audio for each clip is
sliced to exactly frames*1600 samples (48 kHz / 30 fps), so picture and sound cannot drift.
Usage: python assemble2.py <edl.json> <src.mp4> <scenes_dir> <work_dir> <out.mp4>"""
import json, os, subprocess, sys, wave, concurrent.futures as cf
import numpy as np
edl, src, scenes, work, out = sys.argv[1:6]
FPS, SR = 30, 48000
SPF = SR // FPS
os.makedirs(work, exist_ok=True)
RENDER = os.path.join(scenes, '..', 'render.js')
V = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-an']

def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def nframes(p):
    return int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0',
        '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', p]).decode().strip())

blocks = json.load(open(edl))['blocks']
plan = []   # per block: list of (frame_start, n_frames)
for b in blocks:
    segs = []
    for s, e in b['segs']:
        fs, fe = round(s * FPS), round(e * FPS)
        segs.append((fs, fe - fs))
    plan.append(segs)

# 1) Audio: one exact PCM track
wav = os.path.join(work, 'src48k.wav')
if not os.path.exists(wav):
    run(['ffmpeg', '-y', '-i', src, '-vn', '-ac', '2', '-ar', str(SR), '-c:a', 'pcm_s16le', wav])
w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32)
fade = int(0.012 * SR); ramp = np.linspace(0, 1, fade)[:, None]
parts = []
for segs in plan:
    for fs, n in segs:
        x = a[fs * SPF:(fs + n) * SPF].copy()
        if len(x) < n * SPF:
            x = np.vstack([x, np.zeros((n * SPF - len(x), 2), np.float32)])
        x[:fade] *= ramp; x[-fade:] *= ramp[::-1]
        parts.append(x)
full = np.vstack(parts)
aout = os.path.join(work, 'audio_exact.wav')
with wave.open(aout, 'wb') as o:
    o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR)
    o.writeframes(np.clip(full, -32768, 32767).astype(np.int16).tobytes())
total_frames = sum(n for segs in plan for _, n in segs)
assert len(full) == total_frames * SPF
print('audio', len(full) / SR, 's; frames', total_frames, flush=True)

# 2) Video: each clip cut to an exact frame count, no audio
def cut(i, j, fs, n):
    p = os.path.join(work, f'v{i:03d}_s{j:02d}.mp4')
    if not os.path.exists(p):
        run(['ffmpeg', '-y', '-ss', f'{fs / FPS:.6f}', '-i', src, '-frames:v', str(n), *V, p])
    return p

def concat(parts, p):
    lst = p + '.txt'
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(x)}'\n" for x in parts))
    run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', p])

with cf.ThreadPoolExecutor(4) as ex:
    futs = [[ex.submit(cut, i, j, fs, n) for j, (fs, n) in enumerate(segs)] for i, segs in enumerate(plan)]
    cams = []
    for i, fl in enumerate(futs):
        p = os.path.join(work, f'v{i:03d}_cam.mp4')
        if not os.path.exists(p):
            concat([f.result() for f in fl], p)
        cams.append(p)

def render(i, name, n):
    p = os.path.join(work, f'v{i:03d}_{name}_r.mp4')
    if not os.path.exists(p):
        env = dict(os.environ, NODE_PATH='/opt/node22/lib/node_modules')
        subprocess.run(['node', RENDER, os.path.join(scenes, name + '.html'), p, f'{(n + 2) / FPS:.6f}'],
                       check=True, env=env, stdout=subprocess.DEVNULL)
    return p

finals = []
with cf.ThreadPoolExecutor(3) as ex:
    jobs = {}
    for i, b in enumerate(blocks):
        kind, _, name = b['visual'].partition(':')
        if kind in ('g', 'card'):
            jobs[i] = ex.submit(render, i, name, sum(n for _, n in plan[i]))
    for i, b in enumerate(blocks):
        kind, _, name = b['visual'].partition(':')
        n = sum(k for _, k in plan[i])
        p = os.path.join(work, f'v{i:03d}_final.mp4')
        finals.append(p)
        if os.path.exists(p):
            continue
        if kind == 'cam':
            run(['ffmpeg', '-y', '-i', cams[i], '-frames:v', str(n), *V, p])
        elif kind == 'g':
            run(['ffmpeg', '-y', '-i', jobs[i].result(), '-frames:v', str(n), *V, p])
        elif kind == 'card':
            run(['ffmpeg', '-y', '-i', cams[i], '-i', jobs[i].result(), '-filter_complex',
                 '[0:v]crop=1152:1080:384:0[l];[1:v]crop=768:1080:1152:0[r];[l][r]hstack[v]',
                 '-map', '[v]', '-frames:v', str(n), *V, p])
        got = nframes(p)
        assert got == n, (i, got, n)
print('blocks verified frame-exact', flush=True)

vid = os.path.join(work, 'video_exact.mp4')
concat(finals, vid)
assert nframes(vid) == total_frames, (nframes(vid), total_frames)
run(['ffmpeg', '-y', '-i', vid, '-i', aout, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
     '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', str(SR),
     '-movflags', '+faststart', out])
print('wrote', out)
