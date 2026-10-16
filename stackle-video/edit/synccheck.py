"""Measure lip-sync offset at camera moments: where does the audio come from in the source,
and where does the picture come from? Usage: python synccheck.py <edl.json> <src.mp4> <src16k.wav> <final.mp4>"""
import json, subprocess, sys, wave, numpy as np
edl, src, srcwav, final = sys.argv[1:5]
FPS = 30
def pcm(path):
    w = wave.open(path); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32), w.getframerate()
S, sr = pcm(srcwav)
F = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', final, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-']), np.int16).astype(np.float32)
def frames(path, t0, dur):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', f'{max(t0,0):.3f}', '-i', path, '-t', f'{dur:.3f}',
                                   '-vf', 'scale=64:36,format=gray', '-r', str(FPS), '-f', 'rawvideo', '-'])
    return np.frombuffer(raw, np.uint8).reshape(-1, 36 * 64).astype(np.float32)
blocks = json.load(open(edl))['blocks']
t, probes = 0.0, []
for i, b in enumerate(blocks):
    for s, e in b['segs']:
        fs, fe = round(s * FPS), round(e * FPS); d = (fe - fs) / FPS
        if b['visual'] == 'cam' and d > 2.5:
            probes.append((i, t + d / 2, fs / FPS + d / 2))
        t += d
probes = probes[::max(1, len(probes) // 9)]
print(' final_t  expected_src  audio_src  video_src  offset(video-audio)')
for i, tf, ts in probes:
    w = F[int(tf * sr):int((tf + 1.5) * sr)]
    lo = int((ts - 4) * sr); seg = S[lo:lo + int(9.5 * sr)]
    cc = np.correlate(seg - seg.mean(), w - w.mean(), 'valid')
    ta = (lo + int(np.argmax(cc))) / sr
    fv = frames(final, tf, 1 / FPS)[0]
    cand = frames(src, ts - 4, 8)
    tv = ts - 4 + int(np.argmin(np.abs(cand - fv).mean(1))) / FPS
    print(f'{tf:8.2f} {ts:12.2f} {ta:10.2f} {tv:10.2f} {tv - ta:+10.3f}s')
