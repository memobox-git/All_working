"""An original, soft lo-fi music bed for the video, made from scratch so there
is nothing to license and nothing for YouTube's Content ID to claim.

32 bars at 76 bpm in C major (about 101 s), built to loop without a seam:
- an electric piano (FM synthesis) on each chord, strummed and humanised;
- a warm pad and a round bass under it;
- soft kick, rim and shaker with a little swing (they drop out for 4 bars);
- a light room reverb and a touch of vinyl crackle.

Writes a 48 kHz stereo WAV loop. mix.sh loops it under the narration.
Usage: python3 bed.py out.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
BPM = 76
BEAT = 60 / BPM
BAR = 4 * BEAT
BARS = 32
SWING = 0.58          # where the off-beat eighth lands, as a fraction of the beat

midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# (bass, chord voicing) per bar; A is IV–iii–ii–I, B leans on the vi
A = [(41, [57, 60, 64, 67]), (40, [55, 59, 62, 64]), (38, [53, 57, 60, 64]), (36, [52, 55, 59, 62])]
B = [(33, [60, 64, 67, 71]), (41, [57, 60, 64, 67]), (38, [53, 57, 60, 64]), (43, [55, 60, 62, 67])]
SONG = A + A + B + B + A + A + B + A[:3] + [(43, [55, 59, 62, 67])]   # last bar leads back to the top
assert len(SONG) == BARS
NO_DRUMS = set(range(16, 20))

L = int(BARS * BAR * SR)
N = 2 * L            # render two passes; keep the second, so reverb tails wrap around the loop


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)


def place(buf, sig, t, pan=0.0):
    i = int(round(t * SR))
    if i < 0:
        sig, i = sig[-i:], 0
    if i >= N:
        return
    sig = sig[:N - i]
    buf[0, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    buf[1, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def ep(f, dur, vel):
    """A Rhodes-like electric piano note: 1:1 FM with a decaying index, plus a soft tine."""
    t = np.arange(int((dur + 1.2) * SR)) / SR
    decay = 1.8 * (220 / f) ** 0.35
    env = (1 - np.exp(-t / 0.004)) * np.exp(-t / decay) * np.clip(1 - (t - dur) / 1.2, 0, 1) ** 2
    index = vel * (1.1 * np.exp(-t / 0.4) + 0.2)
    s = np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * f * t))
    s += 0.04 * vel * np.exp(-t / 0.05) * np.sin(2 * np.pi * 14 * f * t)
    return 0.22 * vel * env * s


def pad(f, dur):
    """Three detuned soft saws, slow in and out."""
    t = np.arange(int((dur + 1.5) * SR)) / SR
    env = np.clip(t / 1.2, 0, 1) * np.clip(1 - (t - dur) / 1.5, 0, 1)
    s = np.zeros_like(t)
    for cents, ph in ((-7, 0.3), (0, 1.1), (7, 2.0)):
        fd = f * 2 ** (cents / 1200)
        for k in range(1, 7):
            s += np.sin(2 * np.pi * k * fd * t + ph * k) / k
    return 0.012 * env * s


def bass(f, dur):
    t = np.arange(int((dur + 0.3) * SR)) / SR
    env = (1 - np.exp(-t / 0.008)) * np.exp(-t / 0.9) * np.clip(1 - (t - dur) / 0.3, 0, 1)
    return 0.30 * env * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t))


def kick():
    t = np.arange(int(0.45 * SR)) / SR
    ph = 2 * np.pi * np.cumsum(46 + 85 * np.exp(-t / 0.03)) / SR
    return 0.45 * np.exp(-t / 0.16) * np.sin(ph)


rng_noise = np.random.default_rng(7)


def rim():
    t = np.arange(int(0.25 * SR)) / SR
    noise = bp(rng_noise.standard_normal(len(t)), 900, 3500)
    return 0.10 * np.exp(-t / 0.07) * noise + 0.06 * np.exp(-t / 0.04) * np.sin(2 * np.pi * 185 * t)


def shaker():
    t = np.arange(int(0.12 * SR)) / SR
    return 0.025 * (1 - np.exp(-t / 0.006)) * np.exp(-t / 0.035) * bp(rng_noise.standard_normal(len(t)), 4500, 9000)


keys = np.zeros((2, N))     # through the reverb
pads = np.zeros((2, N))
dry = np.zeros((2, N))      # bass and drums, kept mostly dry
K, R, S = kick(), rim(), shaker()

for i in range(2 * BARS + 1):          # one extra bar: its early, humanised notes cross the loop point
    b = i % BARS
    rng = np.random.default_rng(1000 + b)          # same humanising on both passes
    t0 = i * BAR
    root, chord = SONG[b]
    h = lambda: rng.normal(0, 0.007)
    # electric piano: a strummed hit on 1, a lighter one on the "and" of 3
    for k, m in enumerate(chord):
        place(keys, ep(midi(m), 2.4 * BEAT, 0.85 + rng.normal(0, 0.06)), t0 + k * 0.018 + h(), pan=-0.25 + 0.17 * k)
    for k, m in enumerate(chord[1:]):
        place(keys, ep(midi(m), 1.2 * BEAT, 0.5 + rng.normal(0, 0.05)), t0 + (2 + SWING) * BEAT + k * 0.014 + h(), pan=0.2 - 0.15 * k)
    for m in chord[:3]:
        place(pads, pad(midi(m), BAR), t0, pan=rng.uniform(-0.5, 0.5))
    place(dry, bass(midi(root + 12), 1.6 * BEAT), t0 + h())
    place(dry, bass(midi(root + 12), 0.9 * BEAT) * 0.7, t0 + (2 + SWING) * BEAT + h())
    if b in NO_DRUMS:
        continue
    for beat in range(4):
        for half in (0, 1):
            pos = beat + (SWING if half else 0)
            place(dry, S * (0.8 if half else 1.0) * (1 + rng.normal(0, 0.15)), t0 + pos * BEAT + h(), pan=0.3)
    for pos in (0, 2 + SWING):
        place(dry, K * (1 + rng.normal(0, 0.05)), t0 + pos * BEAT)
    for pos in (1, 3):
        place(dry, R * (1 + rng.normal(0, 0.08)), t0 + pos * BEAT + 0.012, pan=-0.1)

keys += np.stack([lp(c, 1200) for c in pads])

# a small warm room: stereo decaying noise, darkened, with a short pre-delay
rt = np.arange(int(2.4 * SR)) / SR
ir = np.stack([lp(rng_noise.standard_normal(len(rt)) * np.exp(-rt / 0.5), 3500) for _ in range(2)])
ir = np.concatenate([np.zeros((2, int(0.015 * SR))), ir], axis=1)
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
wet = np.stack([fftconvolve(keys[c], ir[c])[:N] for c in range(2)])
mix = keys + 0.35 * wet + dry + 0.08 * np.stack([fftconvolve(dry[c], ir[c])[:N] for c in range(2)])

# vinyl: a faint hiss and sparse crackle, repeating with the loop so the seam is clean
crackle = np.zeros(L)
idx = rng_noise.integers(0, L, int(L / SR * 6))
crackle[idx] = rng_noise.uniform(-1, 1, len(idx)) ** 3
crackle = hp(np.tile(crackle, 2), 1500) * 0.05 + hp(lp(np.tile(rng_noise.standard_normal(L), 2), 6000), 800) * 0.0015
mix += crackle

mix = np.stack([hp(lp(c, 5500), 35) for c in mix])
mix = np.tanh(1.3 * mix / np.abs(mix).max()) / np.tanh(1.3)

loop = mix[:, L:2 * L]
loop = loop / np.abs(loop).max() * 10 ** (-1 / 20)
wavfile.write(sys.argv[1], SR, (loop.T * 32767).astype(np.int16))
print('wrote %s: %.1f s loop' % (sys.argv[1], L / SR))
