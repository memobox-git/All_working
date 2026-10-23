"""The video's background music: an original, bright and upbeat score, made
from scratch so there is nothing to license and nothing for YouTube's Content
ID to claim. It runs the full length of the video and follows it, instead of
looping.

112 bpm, C major, I–V–vi–IV with a chord every two bars. The band:
- a plucky synth arpeggio in sixteenths, with a ping-pong echo;
- a soft pad and a bouncing eighth-note bass;
- a soft four-on-the-floor kick, claps on 2 and 4, off-beat hats;
- a gentle sidechain pump on the pad, arpeggio and bass, so it breathes with
  the kick.

The arrangement comes from vo/timeline.json. Each section starts on the bar
nearest the line that opens it:
- the drums drop out and the arpeggio halves for the sincere and serious
  lines (who Chris is, the mid-roll, privacy, the risk);
- shakers and a high arpeggio come in for the big sections;
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
BPM = 112
BEAT = 60 / BPM
BAR = 4 * BEAT
STEP = BEAT / 4       # a sixteenth

here = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(here, '../vo/timeline.json')))
DUR = T['duration']
N = int(DUR * SR)
BARS = int(np.ceil(DUR / BAR))

# section styles: drums, arpeggio, extras, dark
FULL = dict(drums=True, arp=16)
SOFT = dict(drums=False, arp=8)
BUSY = dict(drums=True, arp=16, busy=True)
DARK = dict(drums=False, arp=8, dark=True)
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
# (bass, chord voicing), a chord every two bars: I–V–vi–IV, and vi–IV–I–V for the soft sections
UP = [(36, [55, 60, 64, 67]), (43, [55, 59, 62, 67]), (45, [57, 60, 64, 67]), (41, [57, 60, 65, 69])]
SOFTPROG = UP[2:] + UP[:2]
TONIC = (36, [55, 60, 62, 64, 67])
ARP = [0, 2, 1, 3, 2, 4, 3, 1, 0, 2, 1, 3, 2, 4, 3, 4]     # indexes into the chord plus its octave


def chord_for(style, j):
    prog = SOFTPROG if style['arp'] == 8 else UP
    return prog[(j // 2) % 4]


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
    if buf.ndim == 1:
        buf[i:i + len(sig)] += sig
        return
    buf[0, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    buf[1, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def pluck(f, vel, dur=0.32, decay=1.0):
    """A soft synth pluck: saw-like harmonics, the high ones dying first."""
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * k * f * t) / k * np.exp(-t * (8 + 6 * k) / decay) for k in range(1, 8))
    return 0.10 * vel * (1 - np.exp(-t / 0.002)) * s * np.clip(1 - t / dur, 0, 1) ** 0.5


def pad(f, dur):
    """Three detuned soft saws, slow in and out."""
    t = np.arange(int((dur + 1.0) * SR)) / SR
    env = np.clip(t / 0.6, 0, 1) * np.clip(1 - (t - dur) / 1.0, 0, 1)
    s = np.zeros_like(t)
    for cents, ph in ((-8, 0.3), (0, 1.1), (8, 2.0)):
        fd = f * 2 ** (cents / 1200)
        for k in range(1, 7):
            s += np.sin(2 * np.pi * k * fd * t + ph * k) / k
    return 0.009 * env * s


def bass(f, dur, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    env = (1 - np.exp(-t / 0.005)) * np.exp(-t / 0.14) * np.clip(1 - t / dur, 0, 1) ** 0.3
    return 0.22 * vel * env * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.15 * np.sin(6 * np.pi * f * t))


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    ph = 2 * np.pi * np.cumsum(50 + 90 * np.exp(-t / 0.025)) / SR
    return 0.28 * np.exp(-t / 0.14) * np.sin(ph)


rng_noise = np.random.default_rng(7)


def clap():
    t = np.arange(int(0.3 * SR)) / SR
    env = sum(np.exp(-np.clip(t - d, 0, None) / 0.008) * (t >= d) for d in (0, 0.009, 0.018)) / 3 + 0.5 * np.exp(-t / 0.09)
    return 0.11 * env * bp(rng_noise.standard_normal(len(t)), 900, 2600)


def hat(decay=0.025, amp=0.05):
    t = np.arange(int(0.12 * SR)) / SR
    return amp * np.exp(-t / decay) * bp(rng_noise.standard_normal(len(t)), 7000, 11000)


keys = np.zeros((2, N), np.float32)     # pad and arpeggio: pumped, through the reverb
arp = np.zeros(N, np.float32)           # the arpeggio's echo send
dark = np.zeros((2, N), np.float32)     # muffled, for the night shot
low = np.zeros((2, N), np.float32)      # bass: pumped, dry
drums = np.zeros((2, N), np.float32)
pump = np.ones(N, np.float32)
K, C, H, SH = kick(), clap(), hat(), hat(0.018, 0.016)
duck = (1 - 0.32 * np.exp(-np.arange(int(BEAT * SR)) / (0.11 * SR))).astype(np.float32)

for b in range(min(FINAL + 1, BARS)):
    style, j = plan[b]
    rng = np.random.default_rng(1000 + b)
    t0 = b * BAR
    if b == FINAL:                       # the last chord rings out to the end
        root, chord = TONIC
        for k, m in enumerate(chord):
            place(keys, pluck(midi(m), 0.9, DUR - t0 - 0.5, decay=6), t0 + k * 0.025, pan=-0.4 + 0.2 * k)
        for m in chord[:3]:
            place(keys, pad(midi(m), DUR - t0 - 1.5), t0)
        place(low, bass(midi(root), 2.5, 0.8), t0)
        place(drums, K, t0)
        break
    root, chord = chord_for(style, j)
    notes = chord + [chord[1] + 12]
    tone = dark if style.get('dark') else keys
    every = 16 // style['arp']
    for s in range(0, 16, every):
        m = notes[ARP[s]]
        vel = (1.0 if s % 4 == 0 else 0.72) * (1.25 if every == 2 else 1.0) * (1 + rng.normal(0, 0.05))
        p = pluck(midi(m + 12), vel)
        place(tone, p, t0 + s * STEP, pan=0.35 if s % 2 else -0.35)
        if not style.get('dark'):
            place(arp, p, t0 + s * STEP)
        if style.get('busy') and s % 4 == 0:
            place(tone, pluck(midi(m + 24), 0.35), t0 + s * STEP, pan=-0.2)
    if j % 2 == 0:                       # a pad per chord
        for m in chord[:3]:
            place(tone, pad(midi(m), 2 * BAR) * (1.0 if style['drums'] else 1.6), t0, pan=rng.uniform(-0.5, 0.5))
    if not style['drums']:
        for q in range(4):               # a soft pulse on the beat keeps it moving
            place(low, bass(midi(root), 0.9 * BEAT, 0.55), t0 + q * BEAT)
        continue
    for e in range(8):                   # bass in eighths, the off-beats pushed
        place(low, bass(midi(root), 0.9 * BEAT / 2, 1.0 if e % 2 else 0.6), t0 + e * BEAT / 2)
    for q in range(4):
        i = int(round((t0 + q * BEAT) * SR))
        seg = pump[i:i + len(duck)]
        seg[:] = np.minimum(seg, duck[:len(seg)])
        place(drums, K * (1 + rng.normal(0, 0.03)), t0 + q * BEAT)
        place(drums, H * (1 + rng.normal(0, 0.1)), t0 + (q + 0.5) * BEAT, pan=0.25)
        if q in (1, 3):
            place(drums, C * (1 + rng.normal(0, 0.05)), t0 + q * BEAT, pan=-0.05)
    if style.get('busy'):
        for s in range(16):
            place(drums, SH * (1.0 if s % 2 else 0.6), t0 + s * STEP, pan=-0.3)

keys *= pump
low *= pump
keys += np.stack([lp(c, 600) for c in dark]).astype(np.float32)
del dark

# the arpeggio's ping-pong echo: a dotted eighth, darkened
d = int(0.75 * BEAT * SR)
echo = np.zeros((2, N), np.float32)
src = lp(arp, 3000).astype(np.float32)
for k in range(1, 5):
    echo[k % 2, k * d:] += src[:N - k * d] * 0.38 ** k
del arp, src

# a small bright room
rt = np.arange(int(1.8 * SR)) / SR
ir = np.stack([lp(rng_noise.standard_normal(len(rt)) * np.exp(-rt / 0.38), 5000) for _ in range(2)])
ir = np.concatenate([np.zeros((2, int(0.012 * SR))), ir], axis=1)
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
mix = np.empty((2, N))
for c in range(2):
    mix[c] = (keys[c] + 0.6 * echo[c] + 0.28 * oaconvolve(keys[c], ir[c])[:N]
              + low[c] + drums[c] + 0.06 * oaconvolve(drums[c], ir[c])[:N])
del keys, echo, low, drums

mix = np.stack([hp(lp(c, 9000), 30) for c in mix])
peak = np.abs(mix).max()
mix = np.tanh(1.3 * mix / peak) / np.tanh(1.3) * 10 ** (-1 / 20)
wavfile.write(sys.argv[1], SR, (mix.T * 32767).astype(np.int16))
print('wrote %s: %.1f s at %d bpm, %d bars, %d sections' % (sys.argv[1], DUR, BPM, BARS, len(SECTIONS)))
