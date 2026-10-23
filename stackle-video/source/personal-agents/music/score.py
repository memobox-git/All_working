"""The video's background music: an original, soft lo-fi score, made from
scratch so there is nothing to license and nothing for YouTube's Content ID to
claim. It runs the full length of the video and follows it, instead of looping.

76 bpm, C major. The band:
- an electric piano (FM synthesis), strummed and humanised;
- a warm pad and a round bass;
- soft kick, rim and shaker with a little swing;
- a light room reverb and a touch of vinyl crackle.

The arrangement comes from vo/timeline.json. Each section starts on the bar
nearest the line that opens it:
- the drums drop out for the sincere and serious lines (who Chris is, the
  mid-roll, privacy, the risk);
- the piano gets busier for the big sections;
- it turns dark and muffled for the night shot;
- it ends on one long chord.

Writes a 48 kHz stereo WAV; mix.sh lays it under the video.
Usage: python3 score.py out.wav
"""
import json, os, sys
import numpy as np
from scipy.signal import butter, sosfilt, oaconvolve
from scipy.io import wavfile

SR = 48000
BPM = 76
BEAT = 60 / BPM
BAR = 4 * BEAT
SWING = 0.58          # where the off-beat eighth lands, as a fraction of the beat

here = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(here, '../vo/timeline.json')))
DUR = T['duration']
N = int(DUR * SR)
BARS = int(np.ceil(DUR / BAR))

# section styles: drums, piano rhythm, dark
FULL = dict(drums=True, ep='full')
SOFT = dict(drums=False, ep='soft')
BUSY = dict(drums=True, ep='busy')
DARK = dict(drums=False, ep='soft', dark=True)
# the paragraph that opens each section, and its style
SECTIONS = [
    ('1', FULL),     # the hook
    ('3', SOFT),     # why this video, who Chris is, his honest take
    ('6', FULL),     # the plan, then Part 1
    ('14', BUSY),    # the personal agent arrives
    ('16', FULL),
    ('17', SOFT),    # "let me show you how a DIY agent works inside"
    ('18', FULL),    # Part 2
    ('24', BUSY),    # the bigger example
    ('26', SOFT),    # recap and the mid-roll
    ('28', FULL),    # Part 3
    ('33', SOFT),    # "the part most videos skip"
    ('34', FULL),
    ('37', DARK),    # the night shot: laptop closed
    ('38', FULL),
    ('43', SOFT),    # privacy and the risk
    ('47', FULL),    # the one rule
    ('52', BUSY),    # the pipeline, your turn
    ('55', SOFT),    # "most people will never make the folder"
    ('56', FULL),    # the calls to action
]
start = {p: s['t0'] for s in T['slots'] for p in s['paras'][:1]}
plan = [None] * BARS
for k, (pid, style) in enumerate(SECTIONS):
    b0 = int(round(start[pid] / BAR))
    b1 = int(round(start[SECTIONS[k + 1][0]] / BAR)) if k + 1 < len(SECTIONS) else BARS
    for b in range(b0, b1):
        plan[b] = (style, b - b0)
FINAL = int((DUR - 5.5) // BAR)          # the last bar that starts at least 5.5 s before the end: one long chord

midi = lambda m: 440 * 2 ** ((m - 69) / 12)
# (bass, chord voicing): A is IV–iii–ii–I, B leans on the vi and ends on V
A = [(41, [57, 60, 64, 67]), (40, [55, 59, 62, 64]), (38, [53, 57, 60, 64]), (36, [52, 55, 59, 62])]
B = [(33, [60, 64, 67, 71]), (41, [57, 60, 64, 67]), (38, [53, 57, 60, 64]), (43, [55, 60, 62, 67])]
TONIC = (36, [52, 55, 59, 62, 67])


def chord_for(style, j):
    """Bar j of a section: soft sections stay on A; the others go A, A, B, A in 4-bar phrases."""
    prog = A if style['ep'] == 'soft' else [A, A, B, A][(j // 4) % 4]
    return prog[j % 4]


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


# piano hits per bar: (beat, which chord notes, length in beats, velocity)
RHYTHM = {
    'full': [(0, slice(None), 2.4, 0.85), (2 + SWING, slice(1, None), 1.2, 0.5)],
    'soft': [(0, slice(None), 3.6, 0.7)],
    'busy': [(0, slice(None), 1.4, 0.85), (1 + SWING, slice(1, None), 0.9, 0.42), (3, slice(1, None), 1.0, 0.55)],
}

keys = np.zeros((2, N), np.float32)     # through the reverb
dark = np.zeros((2, N), np.float32)     # through the reverb, muffled first
pads = np.zeros((2, N), np.float32)
dry = np.zeros((2, N), np.float32)      # bass and drums
K, R, S = kick(), rim(), shaker()

for b in range(min(FINAL + 1, BARS)):
    style, j = plan[b]
    rng = np.random.default_rng(1000 + b)
    t0 = b * BAR
    h = lambda: rng.normal(0, 0.007)
    if b == FINAL:                       # the last chord rings out to the end
        root, chord = TONIC
        for k, m in enumerate(chord):
            place(keys, ep(midi(m), DUR - t0 - 1.0, 0.75), t0 + k * 0.03, pan=-0.3 + 0.15 * k)
        for m in chord[:3]:
            place(pads, pad(midi(m), DUR - t0 - 1.5), t0)
        place(dry, bass(midi(root + 12), 3.0) * 0.8, t0)
        place(dry, K, t0)
        break
    root, chord = chord_for(style, j)
    tone = dark if style.get('dark') else keys
    for beat, notes, length, vel in RHYTHM[style['ep']]:
        for k, m in enumerate(chord[notes]):
            place(tone, ep(midi(m), length * BEAT, vel + rng.normal(0, 0.05)), t0 + beat * BEAT + k * 0.016 + h(), pan=-0.25 + 0.17 * k)
    for m in chord[:3]:
        place(dark if style.get('dark') else pads, pad(midi(m), BAR), t0, pan=rng.uniform(-0.5, 0.5))
    if style['drums']:
        place(dry, bass(midi(root + 12), 1.6 * BEAT), t0 + h())
        place(dry, bass(midi(root + 12), 0.9 * BEAT) * 0.7, t0 + (2 + SWING) * BEAT + h())
        for beat in range(4):
            for half in (0, 1):
                place(dry, S * (0.8 if half else 1.0) * (1 + rng.normal(0, 0.15)), t0 + (beat + (SWING if half else 0)) * BEAT + h(), pan=0.3)
        for pos in (0, 2 + SWING):
            place(dry, K * (1 + rng.normal(0, 0.05)), t0 + pos * BEAT)
        for pos in (1, 3):
            place(dry, R * (1 + rng.normal(0, 0.08)), t0 + pos * BEAT + 0.012, pan=-0.1)
    else:
        place(dry, bass(midi(root + 12), 3.4 * BEAT) * 0.75, t0 + h())

keys += np.stack([lp(c, 1200) for c in pads]).astype(np.float32)
keys += np.stack([lp(c, 650) for c in dark]).astype(np.float32)
del pads, dark

# a small warm room: stereo decaying noise, darkened, with a short pre-delay
rt = np.arange(int(2.4 * SR)) / SR
ir = np.stack([lp(rng_noise.standard_normal(len(rt)) * np.exp(-rt / 0.5), 3500) for _ in range(2)])
ir = np.concatenate([np.zeros((2, int(0.015 * SR))), ir], axis=1)
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
mix = np.empty((2, N))
for c in range(2):
    mix[c] = keys[c] + 0.35 * oaconvolve(keys[c], ir[c])[:N] + dry[c] + 0.08 * oaconvolve(dry[c], ir[c])[:N]
del keys, dry

# vinyl: a faint hiss and sparse crackle
crackle = np.zeros(N)
idx = rng_noise.integers(0, N, int(DUR * 6))
crackle[idx] = rng_noise.uniform(-1, 1, len(idx)) ** 3
mix += hp(crackle, 1500) * 0.05 + hp(lp(rng_noise.standard_normal(N), 6000), 800) * 0.0015

mix = np.stack([hp(lp(c, 5500), 35) for c in mix])
peak = np.abs(mix).max()
mix = np.tanh(1.3 * mix / peak) / np.tanh(1.3) * 10 ** (-1 / 20)
wavfile.write(sys.argv[1], SR, (mix.T * 32767).astype(np.int16))
print('wrote %s: %.1f s, %d bars, %d sections' % (sys.argv[1], DUR, BARS, len(SECTIONS)))
