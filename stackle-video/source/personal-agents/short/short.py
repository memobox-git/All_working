"""Builds the YouTube Short from Chris's narration of the full video.

The Short reuses four stretches of the same ElevenLabs read, so it costs no
new credits and sounds the same: the hook, "how does it actually do that?",
the heartbeat, and "while you sleep". Each stretch keeps its word timings, so
the vertical scene (short.js) cues to the words the same way the full video
does, and the captions light up word by word.

Writes short-timing.js (window.SLOTS, one slot) and short.wav.
Usage: python3 short/short.py      (after vo/timeline.py)
"""
import json, os, subprocess

FPS = 30
# paragraph, start and end on the joined narration (seconds), silence after
SEGMENTS = [('1', 0.00, 19.40, 0.25), ('33', 511.30, 516.10, 0.30), ('34', 520.60, 548.00, 0.30), ('38', 618.62, 621.40, 1.80)]

here = os.path.dirname(os.path.abspath(__file__))
vo = os.path.join(here, '..', 'vo')
T = json.load(open(os.path.join(vo, 'timeline.json')))
paras = {p['id']: p for p in json.load(open(os.path.join(vo, 'plan.json')))['paras']}

# every word of every paragraph: (as written, normalised, time on the narration)
words = {}
for s in T['slots']:
    i = 0
    for pid in s['paras']:
        txt = paras[pid]['text'].split()
        words[pid] = [(txt[k], s['words'][i + k][0], s['t0'] + s['words'][i + k][1]) for k in range(len(txt))]
        i += len(txt)

cursor, cue, shown, filt = 0.0, [], [], []
for n, (pid, a, b, gap) in enumerate(SEGMENTS):
    for raw, w, t in words[pid]:
        if a <= t < b:
            cue.append([w, round(cursor + t - a, 3)])
            shown.append([raw, round(cursor + t - a, 3)])
    filt.append(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st={b - a - 0.03:.3f}:d=0.03,adelay={round(cursor * 1000)}:all=1[s{n}]')
    cursor += b - a + gap
frames = round(cursor * FPS)
dur = frames / FPS
filt.append(''.join(f'[s{n}]' for n in range(len(SEGMENTS))) + f'amix=inputs={len(SEGMENTS)}:normalize=0,apad,atrim=0:{dur:.4f}[out]')
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(vo, 'narration.wav'), '-filter_complex', ';'.join(filt),
                       '-map', '[out]', '-ac', '1', '-ar', '48000', os.path.join(here, 'short.wav')])
slot = {'id': 'short', 'scene': 'short', 'paras': [s[0] for s in SEGMENTS], 'dur': dur, 'text': ' '.join(w for w, _ in shown), 'words': cue, 'shown': shown}
open(os.path.join(here, 'short-timing.js'), 'w').write('window.SLOTS = ' + json.dumps([slot]) + ';\n')
print(f'short: {dur:.2f} s, {len(cue)} words')
print(' '.join(f'{w}@{t:.1f}' for w, t in shown))
