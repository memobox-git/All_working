"""Writes YouTube captions (SRT) from the voice-over's word timings, using the script's own
spelling (Whisper writes "10" and "GrokBot"; the captions say what the script says).
Usage: python3 captions.py <work-dir> <voiceover.md> <out.srt>"""
import json, re, sys
work, script, out = sys.argv[1:4]
words = json.load(open(f'{work}/words.json'))
# the script's words, section by section, without the delivery tags
text = open(script).read()
secs = [re.sub(r'\[[^\]]*\]', '', s.split('\n', 1)[1]).split() for s in re.split(r'^## ', text, flags=re.M)[1:]]
secs = [[w for w in s if w.strip()] for s in secs]

def fmt(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}'.replace(',1000', ',999')

cues = []
for n, script_words in enumerate(secs, 1):
    timed = [w for w in words if w['sec'] == n]
    if not timed: continue
    a, b = timed[0]['s'], timed[-1]['e']
    # spread the script's words over the section by the timed words' rhythm
    k = len(script_words); per = [timed[min(len(timed) - 1, round(i * (len(timed) - 1) / max(1, k - 1)))] for i in range(k)]
    line, t0 = [], None
    for i, (w, tw) in enumerate(zip(script_words, per)):
        if t0 is None: t0 = tw['s']
        line.append(w)
        nxt = script_words[i + 1] if i + 1 < k else ''
        full = len(' '.join(line + [nxt])) > 42                      # the next word would not fit
        stop = w[-1] in '.?!' and len(' '.join(line)) >= 12        # a sentence ends, and the line is not tiny
        if nxt and (full or stop):
            cues.append((t0, tw['e'], ' '.join(line))); line, t0 = [], None
    if line: cues.append((t0, b, ' '.join(line)))
with open(out, 'w') as f:
    for i, (a, b, t) in enumerate(cues, 1):
        b = max(b, a + 0.8)
        if i < len(cues): b = min(b, cues[i][0] - 0.02)
        f.write(f'{i}\n{fmt(a)} --> {fmt(b)}\n{t.replace("Co-work", "Cowork")}\n\n')
print(len(cues), 'captions')
