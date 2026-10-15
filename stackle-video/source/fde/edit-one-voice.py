# Version 5 of the FDE video: one voice from start to finish. Every line, including the six that
# were on camera, is HeyGen speech in Chris's cloned voice, and the whole video is motion graphics.
# Reuses version 3's 37 graphics (their lines and timings are unchanged) and version 4's six scenes.
# Usage: python3 edit5.py plan | audio | scenes | final
import json, os, shutil, subprocess, sys
sys.argv_saved = sys.argv; sys.argv = [sys.argv[0], 'noop']
import importlib; edit3 = importlib.import_module("edit-avatar"); edit4 = importlib.import_module("edit-all-graphics")
sys.argv = sys.argv_saved
SP, V3, B3 = edit3.SP, edit3.V3, edit3.OUT
OUT = f'{SP}/v2/build5'
os.makedirs(OUT, exist_ok=True)

def plan():
    order = edit3.SCRIPT['ORDER']
    blocks, t = [], 0.0
    for i, k in enumerate(order):
        nxt = order[i + 1] if i + 1 < len(order) else None
        wav = f'{V3}/tts/{k}.wav'
        speech = edit3.clip_len(wav)
        words = [[w['start'], w['end'], w['word']] for w in json.load(open(f'{V3}/tts/{k}.json')) if w['word'] != '<start>']
        n = int(k[1:])
        if k.startswith('C'): gap = 0.25 if nxt else 0.8
        else: gap = (0.35 if nxt and nxt.startswith('G') else 0.25) + edit3.EXTRA.get(n, 0.0)
        blocks.append({'kind': k[0].lower(), 'n': n, 'start': round(t, 4), 'dur': edit3.quant(speech + gap), 'speech': round(speech, 3), 'src': wav, 'words': words})
        t += blocks[-1]['dur']
    json.dump(blocks, open(f'{OUT}/plan.json', 'w'), indent=1)
    # the graphics' lines are unchanged, so version 3's renders fit as long as their lengths match
    old = {b['n']: b['dur'] for b in json.load(open(f'{B3}/plan.json')) if b['kind'] == 'g'}
    bad = [b['n'] for b in blocks if b['kind'] == 'g' and abs(old[b['n']] - b['dur']) > 1e-6]
    print(f'{len(blocks)} blocks, {t:.1f} s ({int(t // 60)}:{t % 60:04.1f}); graphics needing a re-render: {bad}')

def audio():
    edit3.OUT = OUT
    edit3.audio()

def scenes():
    jobs = []
    for b in json.load(open(f'{OUT}/plan.json')):
        if b['kind'] != 'c': continue
        tmap = [[0, 0.6, 0, 0.6]]
        for k, p in edit4.BEATS[b['n']].items():
            t0 = max(0.15, edit4.when(b['words'], p) - 0.1)
            tmap.append([k, k + 0.9, t0, t0 + 0.9])
        jobs.append({'scene': f"{edit3.REPO}/source/fde/{edit4.SCENES[b['n']]}.html", 'out': f"{OUT}/c{b['n']}.mp4", 'secs': b['dur'], 'timing': {'tmap': tmap}})
    json.dump(jobs, open(f'{OUT}/jobs.json', 'w'), indent=1)
    js = open(f'{edit4.OUT}/render.js').read().replace(edit4.OUT, OUT)
    open(f'{OUT}/render.js', 'w').write(js)
    env = dict(os.environ, NODE_PATH=subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    subprocess.run(['node', f'{OUT}/render.js'], check=True, env=env)

def final():
    plan = json.load(open(f'{OUT}/plan.json'))
    files = [f"{B3}/g{b['n']:02d}.mp4" if b['kind'] == 'g' else f"{OUT}/c{b['n']}.mp4" for b in plan]
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/list.txt', '-c', 'copy', f'{OUT}/video-only.mp4'], check=True)
    out = f'{SP}/v2/FDE-Roadmap-2026-one-voice-1080p.mp4'
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', f'{OUT}/video-only.mp4', '-i', f'{OUT}/voice.wav', '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], check=True)
    print('wrote', out)

if __name__ == '__main__':
    {'plan': plan, 'audio': audio, 'scenes': scenes, 'final': final}[sys.argv[1]]()
