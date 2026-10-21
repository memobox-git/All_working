"""The Short's sound: the voice, a soft pop when a prop lands, a light whoosh
when a card slides in and a tick on each highlight. No music. Loudness goes
to -14 LUFS at the end (build.sh). The sounds are synthesised here.
Usage: python3 mix.py <picture.cues.json> <vo.mp3> <out.wav>"""
import json
import subprocess
import sys
import wave

import numpy as np

SR = 48000
OFF = .1                     # the voice starts this far in (short.js)
cues, vo, out = sys.argv[1:4]
meta = json.load(open(cues))
dur = meta['duration']
rng = np.random.default_rng(7)

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def pop():                   # a soft, round bloop with a quick downward pitch
    t = np.arange(int(SR * .12)) / SR
    f = 620 * np.exp(-t / .05) + 240
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .035) * .35

def whoosh():                # filtered noise that swells and fades
    n = int(SR * .32)
    x = np.convolve(rng.standard_normal(n), np.ones(24) / 24, 'same')
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    return x * env * .5

def tick():                  # a small, dry click
    t = np.arange(int(SR * .04)) / SR
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t / .006) * .22

SOUNDS = {'pop': pop(), 'whoosh': whoosh(), 'tick': tick()}
mix = np.zeros(int(SR * dur) + SR)
v = load(vo)
i0 = int(OFF * SR)
mix[i0:i0 + len(v)] += v[:len(mix) - i0]
for c in meta['sfx']:
    s = SOUNDS[c['k']] * .5
    a = int(c['t'] * SR)
    mix[a:a + len(s)] += s[:max(0, len(mix) - a)]
mix = mix[:int(SR * dur)]
mix /= max(1, np.abs(mix).max() / .95)
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('wrote', out)
