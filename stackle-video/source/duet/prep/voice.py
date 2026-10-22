"""Builds the voice track for the Claude Duet video from one ElevenLabs take per section.
Trims the silence at both ends of each take and places the sections with a short beat
between them. If the voice is longer than the target allows, it is sped up evenly with
Rubber Band (pitch kept), by a percent or two at most. Then finds word timings with Whisper.
Usage: python3 voice.py <work-dir> <target-seconds> take1.mp3 ... take8.mp3
Writes work/voice.wav (48 kHz mono), work/sections.json and work/words.json."""
import json, os, subprocess, sys
import numpy as np

SR = 48000
LEAD, GAP, TAIL = 1.2, 0.75, 3.0        # seconds before the first word, between sections, after the last word
work, target, takes = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
os.makedirs(work, exist_ok=True)


def load(f):
    pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).copy()


def env_db(x, win=0.02):
    n = int(win * SR)
    e = np.sqrt(np.convolve(x ** 2, np.ones(n) / n, 'same') + 1e-12)
    return 20 * np.log10(e)


def trim(x, floor=-48, pad=0.06):
    loud = np.where(env_db(x) > floor)[0]
    a, b = max(0, loud[0] - int(pad * SR)), min(len(x), loud[-1] + int(pad * SR))
    return x[a:b]


def stretch(x, tempo):
    """Speeds a section up by tempo (1.01 = 1% faster) without changing the pitch."""
    pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                          '-af', f'rubberband=tempo={tempo:.5f}:pitchq=quality:transients=smooth', '-f', 'f32le', '-'],
                         input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).copy()


secs = [trim(load(t)) for t in takes]
speech = sum(len(s) for s in secs) / SR
fit = target - LEAD - GAP * (len(secs) - 1) - TAIL
tempo = max(1.0, speech / fit)
if tempo > 1.025: sys.exit(f'voice is {speech:.1f}s, needs {tempo:.3f}x to fit: cut words instead')
if tempo > 1.0: secs = [stretch(s, tempo) for s in secs]
speech = sum(len(s) for s in secs) / SR
print(f'speech {speech:.2f}s at tempo {tempo:.4f}, tail {target - LEAD - GAP * (len(secs) - 1) - speech:.2f}s')

track = np.zeros(int(target * SR), np.float32)
sections, t = [], LEAD
for i, s in enumerate(secs):
    a = int(round(t * SR)); track[a:a + len(s)] = s[:len(track) - a]
    sections.append({'n': i + 1, 'start': round(t, 3), 'end': round(t + len(s) / SR, 3)})
    t += len(s) / SR + GAP
pcm = (np.clip(track, -1, 1) * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                os.path.join(work, 'voice.wav')], input=pcm, check=True)
json.dump({'duration': target, 'sections': sections}, open(os.path.join(work, 'sections.json'), 'w'), indent=1)

# word timings, per section so Whisper never drifts across the gaps
from faster_whisper import WhisperModel
model = WhisperModel('small.en', device='cpu', compute_type='int8')
words = []
for sec, s in zip(sections, secs):
    a16 = np.interp(np.arange(0, len(s), SR / 16000), np.arange(len(s)), s).astype(np.float32)
    segs, _ = model.transcribe(a16, word_timestamps=True, beam_size=5,
                               initial_prompt='Claude Duet, Anthropic, Opus 5.5, Grok Bot, Muse, Dots, Stackle, OpenClaw, PagerDuty, Co-work.')
    for g in segs:
        for w in g.words:
            words.append({'w': w.word.strip(), 's': round(sec['start'] + w.start, 3), 'e': round(sec['start'] + w.end, 3), 'sec': sec['n']})
json.dump(words, open(os.path.join(work, 'words.json'), 'w'))
print(f'{len(words)} words, sections:', [(x["n"], x["start"]) for x in sections])
