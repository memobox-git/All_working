"""Builds the video's timeline from Chris's narration.

The narration was generated in 12 chunks (chunkNN.mp3) and transcribed with
word timings (wordsNN.json, ElevenLabs Scribe). plan.json says which script
paragraphs each chunk holds and how many transcript words each script word
became (spans: "xAI" is read as "x A I"), so every script word gets a start
time on the joined narration.

The video is a run of slots, one per visual. A VOICE slot is a graphic that
plays under the voice; a CAMERA slot is one of the lines Chris says to camera,
shown as a full-screen kinetic graphic (scenes-premium.js). Each slot starts a beat before its first word and ends where the
next one starts, on a frame boundary, so the slots add up to the audio.

Writes timeline.json (for build-video.sh), timing.js (window.SLOTS, for the
scenes) and narration.wav (the joined voice).
Usage: python3 timeline.py
"""
import json, os, re, subprocess

FPS = 30
GAP = 0.7        # silence between chunks; the chunks already break at paragraphs
LEAD = 0.3       # a slot starts this long before its first word
TAIL = 1.5       # the last slot holds this long after the last word

# visual for each paragraph, in order; paragraphs that share a visual share a slot
VISUAL = [
    (['1', '2'], 'r01'), (['3'], 'p3'), (['4'], 'p4'), (['5'], 'p5'), (['6'], '02'),
    (['7'], 'p7'), (['8'], '03'), (['9'], 'r09'), (['10'], 'p10'), (['11'], '05'), (['12'], 'r12'),
    (['13'], 'p13'), (['14'], 'r14'), (['15'], '08'), (['15b'], 'r15b'), (['16'], '09'),
    (['17'], 'p17'), (['18'], 'r18'), (['19'], 'r19'), (['20'], 'r20'), (['21'], 'r21'),
    (['22'], 'p22'), (['23'], '12'), (['24', '25'], '13'), (['26'], 'p26'), (['27'], 'p27'),
    (['28'], 'r28'), (['29'], 'r29'), (['30'], 'r30'), (['31'], 'p31'), (['32'], 'r32'),
    (['33'], 'p33'), (['34'], '17'), (['35'], 'p35'), (['36'], '18'), (['37'], 'p37'),
    (['38'], 'r38'), (['39'], 'p39'), (['40'], 'r40'), (['41'], 'r41'), (['42'], '20'),
    (['43'], 'p43'), (['44'], 'r44'), (['45'], 'p45'), (['46'], '22'), (['47'], 'r47'),
    (['48'], 'r48'), (['49'], '23'), (['50'], 'p50'), (['51'], 'p51'), (['52'], '24'),
    (['53', '54'], '25'), (['55'], 'p55'), (['56'], 'p56'), (['57'], 'p57'), (['58'], 'p58'),
]

here = os.path.dirname(os.path.abspath(__file__))
os.chdir(here)
plan = json.load(open('plan.json'))
paras = {p['id']: p for p in plan['paras']}
norm = lambda s: re.sub(r"[^a-z0-9$¢']", '', s.lower())

def duration(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

# word times on the joined narration
offset, chunk_at = 0.0, []
for c in plan['chunks']:
    f = 'chunk%02d.mp3' % c['chunk']
    chunk_at.append((f, offset))
    toks = [w for w in json.load(open('words%02d.json' % c['chunk'])) if w['type'] == 'word' and w['text'] != '[pause]']
    k = 0
    for pid in c['ids']:
        p = paras[pid]
        words = p['text'].split()
        assert len(words) == len(p['spans']), pid
        p['words'] = []
        for w, n in zip(words, p['spans']):
            p['words'].append([norm(w), round(offset + toks[k]['start'], 3)])
            k += n
        p['start'] = p['words'][0][1]
        p['end'] = round(offset + toks[k - 1]['end'], 3)
    assert k == len(toks), c['chunk']
    offset += duration(f) + GAP
total_audio = offset - GAP

frame = lambda t: round(t * FPS)
slots = []
for ids, scene in VISUAL:
    first = paras[ids[0]]
    slots.append({'paras': ids, 'scene': scene, 'kind': 'camera' if scene == 'cam' or scene[0] == 'p' else 'voice',
                  'f0': 0 if not slots else frame(first['start'] - LEAD)})
end_frame = frame(paras['58']['end'] + TAIL)
for i, s in enumerate(slots):
    s['f1'] = slots[i + 1]['f0'] if i + 1 < len(slots) else end_frame
    s['t0'], s['dur'] = s['f0'] / FPS, (s['f1'] - s['f0']) / FPS
    s['words'] = [[w, round(t - s['t0'], 3)] for pid in s['paras'] for w, t in paras[pid]['words']]
    s['text'] = ' '.join(paras[pid]['text'] for pid in s['paras'])
    s['id'] = '%02d-%s-%s' % (i + 1, s['kind'], '+'.join(s['paras']))
    assert s['dur'] > 1, s['id']

json.dump({'fps': FPS, 'frames': end_frame, 'duration': end_frame / FPS, 'audio': total_audio,
           'chunks': chunk_at, 'slots': slots}, open('timeline.json', 'w'), indent=1)
open('timing.js', 'w').write('window.SLOTS = ' + json.dumps(
    [{k: s[k] for k in ('id', 'scene', 'paras', 'dur', 'text', 'words')} for s in slots]) + ';\n')

# the joined narration: each chunk placed at its offset, padded to the video's length
inputs, filt = [], []
for i, (f, t) in enumerate(chunk_at):
    inputs += ['-i', f]
    filt.append('[%d:a]aresample=48000,adelay=%d:all=1[a%d]' % (i, round(t * 1000), i))
filt.append(''.join('[a%d]' % i for i in range(len(chunk_at))) +
            'amix=inputs=%d:normalize=0,apad,atrim=0:%.4f[out]' % (len(chunk_at), end_frame / FPS))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt),
                       '-map', '[out]', '-ac', '1', '-ar', '48000', 'narration.wav'])

voice = sum(s['dur'] for s in slots if s['kind'] == 'voice')
print('%d slots, %.1f s (%d:%02d); voice graphics %.1f s, camera %.1f s' % (
    len(slots), end_frame / FPS, end_frame // FPS // 60, end_frame // FPS % 60, voice, end_frame / FPS - voice))
for s in slots:
    print('%-22s %-5s %7.2f %6.2f' % (s['id'], s['scene'], s['t0'], s['dur']))
