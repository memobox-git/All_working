"""Writes the Claude Duet soundtrack: a calm electronic bed, the interface sounds the scene
cues (window.SFX, saved by render-pro.js in part0.cues.json), and the voice-over, with the
music ducking whenever Chris talks. Everything here is synthesised, so it is free to use.
Usage: python3 music.py <work-dir>     -> work/soundtrack.wav (48 kHz stereo, -14 LUFS)"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
work = sys.argv[1]
rng = np.random.default_rng(11)
cues = json.load(open(os.path.join(work, 'part0.cues.json')))
secs = json.load(open(os.path.join(work, 'sections.json')))
D = secs['duration']
N = int(D * SR)
music, fx = np.zeros((N, 2)), np.zeros((N, 2))
BEAT = 60 / 96
BAR = 4 * BEAT


def ts(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def noise(d): return rng.uniform(-1, 1, int(d * SR))


def band(x, lo=None, hi=None):
    f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1)
    g = np.ones_like(f)
    if lo: g /= 1 + (lo / f) ** 4
    if hi: g /= 1 + (f / hi) ** 4
    if x.ndim == 2: g = g[:, None]
    return np.fft.irfft(np.fft.rfft(x, axis=0) * g, len(x), axis=0)


def put(track, x, t, gain=1., pan=0.):
    i = int(round(t * SR))
    if i >= len(track): return
    if i < 0: x, i = x[-i:], 0
    x = x[:len(track) - i]
    if x.ndim == 1: x = np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], 1) * 2 ** .5
    track[i:i + len(x)] += x * gain


def env(n, a, r, d=None):
    """Attack a, release r (seconds) over n samples."""
    e = np.ones(n); A, R = int(a * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A) if A else 1
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e


# ---------------------------------------------------------------- arrangement
s = {x['n']: x for x in secs['sections']}
END_VO = s[8]['end']
def level(t):
    """How busy the groove is at time t: 0 = pad only, 1 = full."""
    if t < s[2]['start'] - 0.5: return 0.35
    if t < s[8]['start'] - 0.5: return 1.0
    return max(0.0, 1 - (t - s[8]['start']) / 12)

CHORDS = [[53, 57, 60, 64], [57, 60, 64, 67], [50, 53, 57, 60, 64], [46, 50, 53, 57, 60]]   # Fmaj7, Am7, Dm9, Bbmaj9
ROOTS = [41, 45, 38, 46]
SEG = 2 * BAR                                                                            # each chord holds two bars

# pad: detuned saws, soft low-pass, overlapping chords
for k in range(int(D / SEG) + 1):
    t0 = k * SEG; ch = CHORDS[k % 4]; d = SEG + 1.2
    t = ts(d); sig = np.zeros((len(t), 2))
    for m in ch:
        for c, det in ((0, -0.07), (1, 0.07)):
            for v in (-1, 0, 1):
                f = hz(m) * 2 ** ((det + v * 0.05) / 12)
                sig[:, c] += 2 * ((f * t + rng.random()) % 1) - 1
    sig = band(sig, lo=120, hi=1400) * env(len(t), 0.9, 1.2)[:, None] / (len(ch) * 3)
    put(music, sig, t0 - 0.3, 0.55)

# bass: a soft sine on the root, pulsing in eighths
for k in range(int(D / BEAT * 2)):
    t0 = k * BEAT / 2; L = level(t0)
    if L <= 0.05 or t0 > END_VO + 1.5: continue
    root = ROOTS[int(t0 / SEG) % 4]; d = BEAT / 2
    t = ts(d); x = (np.sin(2 * np.pi * hz(root) * t) + 0.25 * np.sin(4 * np.pi * hz(root) * t)) * np.exp(-t * 5) * env(len(t), 0.005, 0.03)
    put(music, x, t0, 0.20 * L)

# arp: plucked chord tones an octave up, ping-ponging left and right
for k in range(int(D / (BEAT / 2))):
    t0 = k * BEAT / 2
    if t0 > END_VO + 2.5: break
    ch = CHORDS[int(t0 / SEG) % 4]; m = ch[[0, 2, 1, 3, 2, 1][k % 6] % len(ch)] + 12
    t = ts(0.5); f = hz(m)
    x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 12)) * np.exp(-t * 7) * env(len(t), 0.003, 0.05)
    put(music, x, t0, 0.075 * (0.6 + 0.4 * level(t0)), pan=0.45 if k % 2 else -0.45)

# drums: kick on 1 and 3, soft clap on 2 and 4, hats on the off-beats; side-chain pump
pump = np.ones(N)
for b in range(int(D / BEAT)):
    t0 = b * BEAT; L = level(t0)
    if L <= 0.05 or t0 > END_VO: continue
    if b % 2 == 0:
        t = ts(0.4); ph = 2 * np.pi * np.cumsum(48 + 70 * np.exp(-t * 30)) / SR
        put(music, np.sin(ph) * np.exp(-t * 9), t0, 0.42 * L)
        i = int(t0 * SR); n = min(int(0.45 * SR), N - i)
        pump[i:i + n] = np.minimum(pump[i:i + n], 1 - 0.32 * L * np.exp(-np.arange(n) / SR / 0.13))
    else:
        x = band(noise(0.18), 900, 3500) * np.exp(-ts(0.18) * 22)
        put(music, x, t0, 0.10 * L)
    if L > 0.5:
        hat = band(noise(0.05), 7000) * np.exp(-ts(0.05) * 70)
        lift = 1.4 if s[7]['start'] <= t0 < s[8]['start'] else 1.0
        put(music, hat, t0 + BEAT / 2, 0.05 * L * lift, pan=0.25)
music *= pump[:, None]

# the opening swell and the closing chord
put(music, band(noise(1.6), 300, 3000) * np.linspace(0, 1, int(1.6 * SR)) ** 2, 0, 0.10)
t = ts(D - END_VO + 1)
fin = sum(np.sin(2 * np.pi * hz(m) * t + rng.random()) for m in [41, 53, 57, 60, 64, 67]) / 6
put(music, fin * env(len(t), 0.4, 2.5), END_VO - 0.3, 0.30)
music *= np.minimum(1, (D - np.arange(N) / SR) / 1.2)[:, None]                         # fade out at the very end

# ---------------------------------------------------------------- interface sounds
def sweep_noise(d, f0, f1, f2, gain):
    t = ts(d); x = noise(d); n = len(x); out = np.zeros(n); M = 2048; H = 512
    win = np.hanning(M); f = np.maximum(np.fft.rfftfreq(M, 1 / SR), 1)
    for a in range(0, n - M, H):
        p = a / n; fc = f0 * (f1 / f0) ** (2 * p) if p < .5 else f1 * (f2 / f1) ** (2 * p - 1)
        mask = np.exp(-.5 * (np.log2(f / fc) / .6) ** 2)
        out[a:a + M] += np.fft.irfft(np.fft.rfft(x[a:a + M] * win) * mask, M) * win
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return out * e * gain / (np.abs(out).max() + 1e-9)

def tone(f, d, decay, gain, f_end=None):
    t = ts(d); fr = f if f_end is None else f * (f_end / f) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * decay) * env(len(t), 0.002, 0.01) * gain

SOUNDS = {
    'whoosh': lambda: sweep_noise(0.9, 250, 3200, 700, 0.30),
    'swoosh': lambda: sweep_noise(0.55, 900, 6000, 2000, 0.22),
    'soft':   lambda: band(noise(0.12), 2500, 9000) * np.exp(-ts(0.12) * 30) * 0.05,
    'pop':    lambda: tone(880, 0.14, 26, 0.16, 560) + np.pad(band(noise(0.006), 3000) * 0.05, (0, int(0.134 * SR))),
    'tick':   lambda: tone(2400, 0.04, 90, 0.10) + np.pad(band(noise(0.006), 4000) * 0.06, (0, int(0.034 * SR))),
    'ding':   lambda: np.pad(tone(1318.5, 1.2, 3.5, 0.10) + tone(2637, 1.2, 6, 0.03), (0, int(0.15 * SR))) + np.pad(tone(1975.5, 1.2, 3.5, 0.09), (int(0.15 * SR), 0)),
    'thud':   lambda: tone(75, 0.45, 9, 0.45, 45) + np.pad(band(noise(0.08), None, 400) * np.exp(-ts(0.08) * 30) * 0.3, (0, int(0.37 * SR))),
    'glitch': lambda: np.repeat(rng.uniform(-1, 1, int(0.32 * SR / 60) + 1), 60)[:int(0.32 * SR)] * np.repeat(rng.random(9) > .3, int(0.32 * SR / 9) + 1)[:int(0.32 * SR)] * 0.07,
    'click':  lambda: tone(1800, 0.03, 120, 0.16),
}
def typing():
    out, t = np.zeros(int(3.6 * SR)), 0.0
    while t < 3.4:
        k = band(noise(0.02), 1500, 7000) * np.exp(-ts(0.02) * 250) * rng.uniform(.04, .07)
        i = int(t * SR); out[i:i + len(k)] += k; t += rng.uniform(0.06, 0.14)
    return out
SOUNDS['typing'] = typing

for c in cues['sfx']:
    x = SOUNDS[c['kind']]()
    put(fx, x, c['t'], c.get('gain', 1), pan=rng.uniform(-.25, .25))

# ---------------------------------------------------------------- voice, ducking, mix
pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(work, 'voice.wav'), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                     capture_output=True, check=True).stdout
vox = np.frombuffer(pcm, np.float32)[:N].astype(float)
vox = np.pad(vox, (0, N - len(vox)))
w = int(0.05 * SR)
rms = np.sqrt(np.convolve(vox ** 2, np.ones(w) / w, 'same'))
active = (rms > 10 ** (-38 / 20)).astype(float)
# smooth: fast attack, slow release
k_rel = np.exp(-1 / (0.45 * SR)); k_att = np.exp(-1 / (0.06 * SR))
g = np.zeros(N); y = 0.0
for i in range(0, N, 64):                                  # coarse loop, then interpolate
    a = active[i]; kk = k_att if a > y else k_rel
    y = a + (y - a) * kk ** 64; g[i:i + 64] = y
duck = 1 - 0.55 * g

music_lvl = 10 ** (-23 / 20) / (np.sqrt(np.mean(music ** 2)) + 1e-9)
mix = music * music_lvl * duck[:, None] + fx * 0.9 + np.stack([vox, vox], 1)
tmp = os.path.join(work, 'mix_raw.wav')
pcm = (np.clip(mix / max(1, np.abs(mix).max()), -1, 1) * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', tmp], input=pcm, check=True)
# two-pass loudness normalisation to YouTube's -14 LUFS
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', af, '-ar', str(SR), os.path.join(work, 'soundtrack.wav')], check=True)
print('soundtrack written; input loudness', m['input_i'], 'LUFS')
