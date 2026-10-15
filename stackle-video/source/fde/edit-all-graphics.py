# Version 4 of the FDE video: no on-camera footage at all. The twin's voice runs the whole way
# (same soundtrack as version 3), and the six on-camera lines get their own motion graphics,
# with each beat mapped to the spoken word.
# Usage: python3 edit4.py camera-graphics | final
import json, os, re, subprocess, sys
SP = '/tmp/claude-0/-home-user-All-working/7bd9d8a4-9175-5617-901d-8569546f116a/scratchpad'
REPO = '/home/user/All_working/stackle-video'
B3 = f'{SP}/v2/build3'           # version 3: soundtrack, plan and the 37 graphics
OUT = f'{SP}/v2/build4'
os.makedirs(OUT, exist_ok=True)
WORDS = json.load(open(f'{SP}/heygen/v3/camera-words.json'))
SCENES = {1: 'c01-opening', 2: 'c02-who-it-suits', 3: 'c03-roadmap-start', 4: 'c04-decomposition-intro', 5: 'c05-your-turn', 6: 'c06-sign-off'}
# beat -> the words it lands on
BEATS = {
    1: {1: 'what a', 2: 'what the job', 3: 'the skills', 4: 'how the interview'},
    2: {1: 'the job really', 2: 'solving problems', 3: 'explaining technical', 4: 'if you prefer', 5: 'quiet weeks', 6: 'either way'},
    3: {1: "here's the", 2: 'most', 3: 'but after', 4: 'i start with', 5: "that's where"},
    4: {1: 'decomposition', 2: 'palantir', 3: 'where you break', 4: 'small pieces', 5: 'i have interviewed', 6: 'the ones who'},
    5: {1: 'one thing', 2: 'find one person', 3: 'talk to them', 4: 'write a', 5: 'because that page'},
    6: {1: 'tell me', 2: 'thank you'},
}
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())

def when(words, phrase):
    ws = [norm(w[2]) for w in words]
    seq = [norm(x) for x in phrase.split()]
    for k in range(len(ws)):
        if ws[k:k + len(seq)] == seq: return words[k][0]
    raise KeyError(phrase)

def camera_graphics():
    plan = json.load(open(f'{B3}/plan.json'))
    jobs = []
    for b in plan:
        if b['kind'] != 'c': continue
        n, words = b['n'], WORDS[f"C{b['n']}"]
        tmap = [[0, 0.6, 0, 0.6]] + [[k, k + 0.9, max(0.15, when(words, p) - 0.1), max(0.15, when(words, p) - 0.1) + 0.9] for k, p in BEATS[n].items()]
        jobs.append({'scene': f'{REPO}/source/fde/{SCENES[n]}.html', 'out': f'{OUT}/c{n}.mp4', 'secs': b['dur'], 'timing': {'tmap': tmap}})
    json.dump(jobs, open(f'{OUT}/jobs.json', 'w'), indent=1)
    open(f'{OUT}/render.js', 'w').write(f"""
const {{ renderScene }} = require('{REPO}/source/render.js');
const jobs = require('{OUT}/jobs.json');
(async () => {{ let i = 0; await Promise.all([0, 1, 2].map(async () => {{ while (i < jobs.length) {{ const j = jobs[i++]; await renderScene(j.scene, j.out, j.secs, 30, j.timing); }} }})); }})();
""")
    env = dict(os.environ, NODE_PATH=subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    subprocess.run(['node', f'{OUT}/render.js'], check=True, env=env)

def final():
    plan = json.load(open(f'{B3}/plan.json'))
    files = [f"{B3}/g{b['n']:02d}.mp4" if b['kind'] == 'g' else f"{OUT}/c{b['n']}.mp4" for b in plan]
    open(f'{OUT}/list.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/list.txt', '-c', 'copy', f'{OUT}/video-only.mp4'], check=True)
    out = f'{SP}/v2/FDE-Roadmap-2026-all-graphics-1080p.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', f'{OUT}/video-only.mp4', '-i', f'{B3}/voice.wav', '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], check=True)
    print('wrote', out)

if __name__ == '__main__':
    {'camera-graphics': camera_graphics, 'final': final}[sys.argv[1]]()
