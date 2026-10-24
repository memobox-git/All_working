"""Stackle's own background music: five tracks written note by note and synthesised here
from plain waveforms. No samples, loops or presets from anywhere else, so every sound is
ours and free to use in any video.

  rise      inspiring   92 BPM   piano and strings that build to a big chorus
  momentum  fast        128 BPM  four-on-the-floor beat, plucks and a hook, for Shorts
  still     very slow   60 BPM   felt piano and warm pads, no drums
  focus     lo-fi       84 BPM   dusty beat, Rhodes and vinyl, for long tutorials
  pulse     curious     100 BPM  marimba pattern and ticking drums, for interviews

Each track is a seamless loop: the last bar runs straight back into the first, so it can
sit under a video of any length. Mastered to -14 LUFS, the level YouTube plays at.
Usage: python3 -I compose.py [name ...]     (no names: all five)
Writes tracks/<name>.mp3, and tracks/<name>.wav for editing (not committed)."""
import json, os, subprocess, sys, wave
import numpy as np

SR = 48000
TAIL = 10                                    # seconds after the loop for releases and reverb, folded onto the start
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tracks')
rng = np.random.default_rng(0)


# ------------------------------------------------------------ building blocks
def ts(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.uniform(-1, 1, int(d * SR))
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def side(n): return 0. if n < 48 else float(np.clip((n - 62) / 40, -.35, .35))   # bass centred, high notes a little right


def band(x, lo=None, hi=None):
    """Soft-edged FFT filter; lo and hi in Hz, either may be None. It wraps round, so a loop stays seamless."""
    f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1)
    g = np.ones_like(f)
    if lo: g /= 1 + (lo / f) ** 4
    if hi: g /= 1 + (f / hi) ** 4
    if x.ndim == 2: g = g[:, None]
    return np.fft.irfft(np.fft.rfft(x, axis=0) * g, len(x), axis=0)


def sweep(x, fc, width=.7):
    """A band-pass whose centre moves through the sound: fc(p) is the centre in Hz at p = 0..1."""
    n, M, H = len(x), 1024, 256
    win = np.hanning(M)
    pad = np.concatenate([np.zeros(M), x, np.zeros(M)])
    y, norm_ = np.zeros_like(pad), np.zeros_like(pad)
    f = np.maximum(np.fft.rfftfreq(M, 1 / SR), 1)
    for s in range(0, len(pad) - M, H):
        mask = np.exp(-.5 * (np.log2(f / fc(np.clip((s - M / 2) / n, 0, 1))) / width) ** 2)
        y[s:s + M] += np.fft.irfft(np.fft.rfft(pad[s:s + M] * win) * mask, M) * win
        norm_[s:s + M] += win ** 2
    return (y / np.maximum(norm_, 1e-3))[M:M + n]


def stereo(x, pan=0.):
    if x.ndim == 2: return x
    return np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], 1) * 2 ** .5


def env(d, a=.005, r=.2, dec=None, s=1.):
    """Attack over a seconds, an optional fall towards level s (time constant dec), held to d, then a release over r."""
    t = ts(d + r)
    e = np.minimum(1, t / a)
    if dec: e = e * (s + (1 - s) * np.exp(-t / dec))
    return e * np.clip(1 - (t - d) / r, 0, 1) ** 2


def fade(x, d=.01):
    """Fades out the last d seconds, so a sound cut short doesn't click."""
    n = min(len(x), int(d * SR))
    x[len(x) - n:] *= np.linspace(1, 0, n)
    return x


# ------------------------------------------------------------ oscillators
SAW = lambda k: 1 / k
SQUARE = lambda k: (k % 2) / k
TRI = lambda k: (k % 2) / k ** 2
_tables = {}


def table(f0, shape=SAW, fc=None, size=4096):
    """One cycle of a band-limited wave for a note at f0 Hz: no harmonics above hearing, so nothing
    aliases, and fc rolls the rest off softly, like a low-pass filter."""
    key = (round(f0, 3), shape, fc)
    if key not in _tables:
        k = np.arange(1, max(2, int(20000 / f0)) + 1)
        a = shape(k) / (np.sqrt(1 + (k * f0 / fc) ** 4) if fc else 1)
        _tables[key] = (a[:, None] * np.sin(2 * np.pi * k[:, None] * np.arange(size) / size)).sum(0)
    return _tables[key]


def osc(tab, f, d, ph=0.):
    """Plays a wavetable for d seconds at f Hz: a number, or an array with one value per sample."""
    n = int(d * SR)
    f = np.full(n, float(f)) if np.isscalar(f) else f[:n]
    p = (ph + np.cumsum(f) / SR) % 1 * len(tab)
    i = p.astype(int)
    fr = p - i
    return tab[i] * (1 - fr) + tab[(i + 1) % len(tab)] * fr


# ------------------------------------------------------------ instruments
_piano = {}


def piano(n, d, v=.6, felt=0.):
    """A struck string: slightly sharp partials that die away faster the higher they are, two strings
    a hair apart so the note shimmers, a soft hammer knock, and the damper after d seconds.
    felt (0..1) softens the hammer, for the close, muffled sound of a felt piano."""
    v = round(min(1, v) * 20) / 20
    key = (n, round(d, 2), v, felt)
    if key in _piano: return _piano[key]
    f0, t = midi(n), ts(d + .6)
    B = 2.5e-4 * 2 ** ((n - 60) / 18)          # string stiffness: how far the upper partials go sharp
    rate = .3 + f0 / 600                       # how fast the fundamental fades, per second
    soft = (1 - v) * .6 + felt * .8
    x = np.zeros(len(t))
    for k in range(1, 40):
        fk = k * f0 * np.sqrt(1 + B * k * k)
        if fk > 12000: break
        a = k ** -1.1 * np.exp(-(k - 1) * soft * .45) * (abs(np.sin(np.pi * k / 8)) + .08)
        if a < 1e-3: continue
        rk = rate * (1 + .15 * (k - 1) ** 1.2)
        m = min(len(t), int(np.log(.4 * a / 2e-5) / rk * SR) + 1)
        tk, ph = t[:m], rng.random() * 6.28
        w = np.sin(2 * np.pi * fk * tk + ph)
        if k <= 10: w = .5 * (w + np.sin(2 * np.pi * fk * 1.0004 * tk + ph))
        x[:m] += a * w * (.6 * np.exp(-3 * rk * tk) + .4 * np.exp(-rk * tk))
    knock = band(noise(.08), 200, 2500 + 2500 * v) * np.exp(-ts(.08) * 70) * .03 * (1 - .7 * felt) * (.5 + v)
    x[:len(knock)] += knock
    x *= np.minimum(1, t / (.0015 + .004 * felt)) * np.where(t > d, np.exp(-(t - d) * (10 + f0 / 80)), 1)
    _piano[key] = fade(x * v ** 1.3, .03)
    return _piano[key]


def rhodes(n, d, v=.5):
    """An electric piano by FM: a sine bent by a second sine, harder and brighter the harder the
    key is hit, with a short metallic tine at the start and a little valve-amp warmth."""
    f, t = midi(n), ts(d + .4)
    bend = (.8 + 2.2 * v) * np.exp(-t * 3) + .7
    x = np.sin(2 * np.pi * f * t + bend * np.sin(2 * np.pi * f * t))
    if f * 14 < 18000: x += .12 * v * np.sin(2 * np.pi * f * 14 * t) * np.exp(-t * 40)
    amp = np.exp(-t * (.5 + f / 900)) * np.minimum(1, t / .002) * np.where(t > d, np.exp(-(t - d) * 12), 1)
    return fade(np.tanh(1.6 * v * x * amp + .1) - np.tanh(.1), .03)


def pad(notes, d, a=.6, r=1.2, fc=2500, shape=SAW, voices=3, spread=.1, vib=0.):
    """Held chord: each note several slightly detuned voices spread across the stereo field.
    vib adds a slow vibrato that fades in, which makes it sing like strings."""
    t = ts(d + r)
    out = np.zeros((len(t), 2))
    for n in notes:
        tab = table(midi(n), shape, fc)
        for j in range(voices):
            u = j / (voices - 1) * 2 - 1 if voices > 1 else 0
            f = midi(n + spread * u)
            if vib: f = f * (1 + vib * np.sin(2 * np.pi * (4.8 + .4 * j) * t + rng.random() * 6) * np.minimum(1, t / .8))
            out += stereo(osc(tab, f, d + r, rng.random()), .75 * u)
    return out * env(d, a, r)[:, None] / np.sqrt(voices * len(notes))


def sub(n, d, a=.02, r=.15):
    """A round low note: a sine with a touch of its octave and twelfth, so small speakers still hear it."""
    f, t = midi(n), ts(d + r)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)) * env(d, a, r)


def bass(n, d, fc=600, low=.5, bite=0., shape=SAW, a=.004, r=.04):
    """Synth bass: a filtered wave and a sine, low adds the octave below, bite a bright edge on the attack."""
    f, t = midi(n), ts(d + r)
    x = osc(table(f, shape, fc), f, d + r) * .6 + np.sin(2 * np.pi * f * t) * .6 + low * np.sin(np.pi * f * t)
    if bite: x += osc(table(f, shape, fc * 5), f, d + r) * bite * np.exp(-t * 20)
    return x * env(d, a, r)


def pluck(n, d=.25, bright=5000, dark=700, dec=14, shape=SAW):
    """A plucked synth note: starts bright and closes down, like a filter snapping shut."""
    f, t = midi(n), ts(d)
    m = np.exp(-t * dec)
    x = osc(table(f, shape, bright), f, d) * m + osc(table(f, shape, dark), f, d) * (1 - m)
    return fade(x * np.exp(-t * 6) * np.minimum(1, t / .002))


def lead(n, d, fc=3200):
    """The hook's voice: a saw and a square a few cents apart, with vibrato that comes in late."""
    f, t = midi(n), ts(d + .1)
    vib = f * (1 + .005 * np.sin(2 * np.pi * 5.5 * t) * np.clip((t - .15) / .3, 0, 1))
    x = osc(table(f, SAW, fc), vib, d + .1) * .55 + osc(table(f, SQUARE, fc), vib * 1.004, d + .1) * .45
    return x * env(d, .004, .1, dec=.18, s=.55)


# struck bars and bells: (partial ratio, level, how much faster it fades than the fundamental)
MARIMBA = ((1, 1, 1), (3.93, .3, 3.5), (9.2, .08, 8))
BELL = ((1, 1, 1), (2.76, .5, 1.8), (5.4, .3, 2.6), (8.93, .15, 3.4))
KALIMBA = ((1, 1, 1), (5.9, .18, 5), (12.4, .05, 9))


def mallet(n, kind=MARIMBA, d=1.6, rate=None, click=.1):
    f, t = midi(n), ts(d)
    r0 = rate or 2 + f / 300
    x = sum(a * np.sin(2 * np.pi * f * p * t) * np.exp(-t * r0 * k) for p, a, k in kind if f * p < 18000)
    hit = band(noise(.03), 800, 6000) * np.exp(-ts(.03) * 250) * click
    x[:len(hit)] += hit
    return fade(x * np.minimum(1, t / .001), .05)


# ------------------------------------------------------------ drums
def kick(f=48, drop=130, dec=6.5, click=.3, drive=1.8, d=.5):
    t = ts(d)
    body = np.sin(2 * np.pi * np.cumsum(f + drop * np.exp(-t * 32)) / SR) * np.exp(-t * dec)
    return fade(np.tanh(drive * (body + band(noise(d), 2500, 9000) * np.exp(-t * 320) * click)) / np.tanh(drive))


def snare(tone=190, dec=22, lo=1500, hi=9000, d=.3):
    t = ts(d)
    return fade(np.sin(2 * np.pi * tone * t) * np.exp(-t * 30) * .6 + band(noise(d), lo, hi) * np.exp(-t * dec))


def clap():
    t, n, x = ts(.32), noise(.32), 0
    for k, off in enumerate((0, .011, .023)):
        x = x + n * np.where(t >= off, np.exp(-(t - off) * (70 if k < 2 else 16)), 0)
    return fade(band(x, 900, 5500))


def hat(open_=False, lo=7500):
    t = ts(.45 if open_ else .08)
    return fade(band(noise(len(t) / SR), lo) * np.exp(-t * (8 if open_ else 70)))


def shaker(d=.1):
    t = ts(d)
    return band(noise(d), 4500, 12000) * np.sin(np.pi * t / d) ** 3


def rim():
    t = ts(.08)
    return fade(np.sin(2 * np.pi * 1750 * t) * np.exp(-t * 90) * .6 + band(noise(.08), 2000, 7000) * np.exp(-t * 120))


def tom(n, d=.7):
    f, t = midi(n), ts(d)
    body = np.sin(2 * np.pi * np.cumsum(f * (1 + .6 * np.exp(-t * 20))) / SR) * np.exp(-t * 5)
    return fade(body + band(noise(d), 300, 3000) * np.exp(-t * 40) * .3)


def crash(d=2.6):
    t = ts(d)
    return np.stack([band(noise(d), 4000) * np.exp(-t * 1.8) for _ in range(2)], 1)


def swell(d=1.):
    """A cymbal played backwards, rising into the beat it is placed before."""
    return crash()[::-1][-int(d * SR):]


def boom():
    t = ts(1.4)
    return np.sin(2 * np.pi * np.cumsum(32 + 55 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.6) + band(noise(1.4), None, 2500) * np.exp(-t * 14) * .5


def riser(d):
    return sweep(noise(d), lambda u: 400 * 20 ** u) * np.linspace(0, 1, int(d * SR)) ** 2


# ------------------------------------------------------------ effects
def hall(rt=2.5, pre=.02, tone=3500, seed=9):
    """A stereo reverb impulse: different noise on each side, fading to -60 dB in rt seconds and
    losing its highs faster than its lows, the way a real room does."""
    r, n, p = np.random.default_rng(seed), int(rt * 1.2 * SR), int(pre * SR)
    t = np.arange(n) / SR
    ir = np.zeros((p + n, 2))
    for c in range(2):
        nz = r.standard_normal(n)
        ir[p:, c] = (band(nz, None, tone) * np.exp(-6.9 * t / rt) + band(nz, tone) * .5 * np.exp(-6.9 * t / (rt * .4))) * np.minimum(1, t / .03)
    return ir / np.sqrt((ir ** 2).sum() / 2)


def reverb(x, ir):
    m = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.stack([np.fft.irfft(np.fft.rfft(x[:, c], m) * np.fft.rfft(ir[:, c], m), m)[:len(x)] for c in range(2)], 1)


def echo(x, delay, fb=.35, n=5, hi=5000):
    """Ping-pong delay: repeats that bounce left and right, each a little quieter and darker."""
    y, tap, k = np.zeros_like(x), x.mean(1), int(delay * SR)
    for j in range(1, n + 1):
        tap = band(tap, 150, hi) * fb
        y[j * k:, j % 2] += tap[:len(x) - j * k]
    return y


def chorus(x, rate=.7, depth=.0025, base=.012, mix=.5):
    i, y = np.arange(len(x)), np.empty_like(x)
    for c in range(2):
        lag = (base + depth * np.sin(2 * np.pi * rate * i / SR + c * np.pi / 2)) * SR
        y[:, c] = x[:, c] * (1 - mix) + np.interp(i - lag, i, x[:, c]) * mix
    return y


def looped(hz, n):
    """The nearest frequency to hz that repeats a whole number of times in n samples, so a wobble loops too."""
    return max(1, round(hz * n / SR)) * SR / n


def wow(x):
    """Tape wow and flutter: the pitch drifts a few cents, slowly, and repeats exactly over the loop."""
    n = len(x)
    i = np.arange(n)
    lag = (.0025 + .0018 * np.sin(2 * np.pi * looped(.45, n) * i / SR) + .00008 * np.sin(2 * np.pi * looped(5.3, n) * i / SR)) * SR
    return np.stack([np.interp(i - lag, i, x[:, c], period=n) for c in range(2)], 1)


def vinyl(n):
    """Crackle and hiss that repeat seamlessly every n samples."""
    x = band(rng.standard_normal((n, 2)), 2000, 8000) * .15
    for p in rng.integers(0, n, n * 6 // SR):
        idx = (p + np.arange(48)) % n
        x[idx, rng.integers(2)] += rng.uniform(-1, 1, 48) * np.exp(-np.arange(48) / 8) * rng.exponential(.6)
    return band(x, 800, 9000)


def norm(x, db):
    """Scales a stem so its level while it plays (silence ignored) is db dBFS RMS."""
    h = SR // 20
    fr = np.sqrt(np.mean(x[:len(x) // h * h].reshape(-1, h, 2) ** 2, axis=(1, 2)))
    on = fr > fr.max() * .03
    return x * 10 ** (db / 20) / np.sqrt(np.mean(fr[on] ** 2))


# ------------------------------------------------------------ the loop
class Song:
    """A loop being written: buses of stereo sound, with room after the end for the tails."""

    def __init__(self, bpm, bars, seed):
        global rng
        rng = np.random.default_rng(seed)
        _piano.clear()
        self.beat, self.N = 60 / bpm, int(round(bars * 240 / bpm * SR))
        self.buses, self.kicks = {}, []

    def at(self, bar, beat=0.): return (bar * 4 + beat) * self.beat

    def put(self, bus, x, t, gain=1., pan=0., jitter=0.):
        """Adds a sound to a bus at t seconds, nudged by up to about jitter seconds so it sounds played.
        Anything before 0 lands at the end of the loop."""
        if bus not in self.buses: self.buses[bus] = np.zeros((self.N + TAIL * SR, 2))
        track, x = self.buses[bus], stereo(x, pan) * gain
        i = int(round((t + (rng.normal(0, jitter) if jitter else 0)) * SR))
        if i < 0:
            m = min(-i, len(x))
            track[self.N + i:self.N + i + m] += x[:m]
            x, i = x[-i:], 0
        x = x[:len(track) - i]
        track[i:i + len(x)] += x

    def bus(self, name): return self.buses.get(name, np.zeros((self.N + TAIL * SR, 2)))

    def pump(self, depth=.6, speed=9):
        """A gain curve that dips under every kick in self.kicks and recovers: the side-chain pump."""
        g = np.ones(self.N + TAIL * SR)
        for k in self.kicks:
            seg = g[int(k * SR):int(k * SR) + SR // 2]
            seg *= 1 - depth * np.exp(-np.arange(len(seg)) / SR * speed)
        return g[:, None]

    def finish(self, mix, name, post=None, lufs=-14.):
        """Folds the tails back onto the start, so the loop is seamless, then masters and writes it."""
        x = mix[:self.N].copy()
        x[:len(mix) - self.N] += mix[self.N:]
        x = band(x, 25)
        if post: x = post(x)
        master(x, name, lufs)


# ------------------------------------------------------------ mastering
def loudness(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-',
                        '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], input=x.astype('<f4').tobytes(), capture_output=True)
    e = p.stderr.decode()
    return float(json.loads(e[e.rindex('{'):e.rindex('}') + 1])['input_i'])


def limit(x, ceil):
    """Brick-wall limiter: a gain from the peaks of each 2.5 ms block, looking 5 ms ahead and
    recovering over about 120 ms. It wraps round, so the start of the loop knows about the end."""
    h = SR // 400
    nb = -(-len(x) // h)
    pk = np.pad(np.abs(x).max(1), (0, nb * h - len(x))).reshape(nb, h).max(1)
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    need = np.minimum(need, np.minimum(np.roll(need, -1), np.roll(need, -2)))
    g, e, rel = np.empty(nb), 1., np.exp(-1 / (400 * .12))
    for _ in range(2):
        for i in range(nb):
            e = min(need[i], 1 - (1 - e) * rel)
            g[i] = e
    gs = np.repeat(g, h)[:len(x)]
    c = np.cumsum(np.concatenate([gs[-h:], gs]))
    return x * ((c[h:] - c[:-h]) / h)[:, None], 20 * np.log10(g.min())


def master(x, name, lufs):
    for _ in range(3):
        x, gr = limit(x * 10 ** ((lufs - loudness(x)) / 20), 10 ** (-1.5 / 20))
    os.makedirs(OUT, exist_ok=True)
    wav, mp3 = os.path.join(OUT, name + '.wav'), os.path.join(OUT, name + '.mp3')
    pcm = np.clip(x + (rng.random(x.shape) - rng.random(x.shape)) / 32768, -1, 1)     # dithered to 16 bits
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.round(pcm * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '192k',
                    '-metadata', f'title={name.title()}', '-metadata', 'artist=Stackle',
                    '-metadata', 'comment=Original music by Stackle, synthesised in compose.py', mp3], check=True)
    print(f'wrote {mp3}: {len(x) / SR:.1f}s loop, {loudness(x):.1f} LUFS, '
          f'peak {20 * np.log10(np.abs(x).max()):.1f} dBFS, limiter {gr:.1f} dB at most')


# ------------------------------------------------------------ 1. rise: inspiring
def rise():
    """92 BPM, D major. Piano alone, then strings and a heartbeat kick, a lift into a big chorus
    with the hook, and a breakdown that runs back into the start."""
    s = Song(92, 48, 1)
    # bass note, the piano's broken chord (eight 8ths), the strings, and the strings halfway if they move
    D = (38, (57, 62, 64, 66, 69, 66, 64, 62), (62, 66, 69, 74))
    AC = (37, (57, 61, 64, 69, 71, 69, 64, 61), (61, 64, 69, 73))           # A over C#
    Bm = (35, (54, 59, 61, 62, 66, 62, 61, 59), (62, 66, 71, 74))
    G = (31, (55, 59, 62, 64, 67, 64, 62, 59), (62, 67, 71, 74))
    DF = (30,) + D[1:]                                                       # D over F#
    Em = (28, (55, 59, 62, 64, 67, 64, 62, 59), (64, 67, 71, 74))
    Asus = (33, (57, 62, 64, 69, 69, 64, 61, 57), (62, 64, 69, 74), (61, 64, 69, 73))
    A = (33, (57, 61, 64, 69, 71, 69, 64, 61), (61, 64, 69, 73))
    form = [D, AC, Bm, G] * 4 + [G, DF, Em, Asus] * 2 + [D, AC, Bm, G] * 4 + [Bm, G, D, A] * 2
    # tunes as (beat from the start of the phrase, note, beats): the hook is two 4-bar phrases
    HOOK = [(0, 78, 1.5), (1.5, 76, .5), (2, 74, 1), (3, 76, 1), (4, 76, 1.5), (5.5, 74, .5), (6, 73, 1), (7, 69, 1),
            (8, 74, 1.5), (9.5, 73, .5), (10, 71, 1), (11, 74, 1), (12, 71, 1.5), (13.5, 74, .5), (14, 76, 2),
            (16, 78, 1), (17, 81, 1), (18, 78, 1), (19, 76, 1), (20, 76, 2), (22, 74, 1), (23, 76, 1),
            (24, 78, 1.5), (25.5, 76, .5), (26, 74, 2), (28, 71, 1), (29, 74, 1), (30, 73, 2)]
    LIFT = [(0, 74, 2), (2, 71, 2), (4, 74, 2), (6, 78, 2), (8, 79, 2), (10, 78, 1), (11, 76, 1), (12, 76, 2), (14, 73, 2)]
    ECHO = [(0, 74, 3), (4, 71, 3), (8, 69, 3), (12, 73, 3)]
    q = s.beat
    bar = 4 * q
    K, CL, SN, HO, SH = kick(52, 110, 7, .15), clap(), snare(185), hat(True), shaker()
    strings = lambda notes, d, fc=2600: pad(notes, d, .45, .9, fc, SAW, 3, .1, .003)
    for b, ch in enumerate(form):
        root, arp, chord = ch[:3]
        t0 = s.at(b)
        sec = 'intro' if b < 8 else 'verse' if b < 16 else 'lift' if b < 24 else 'chorus' if b < 40 else 'break'
        # piano: left-hand octave and the broken chord, held by the pedal to the end of the bar
        v = {'intro': .4, 'verse': .46, 'lift': .5, 'chorus': .56, 'break': .44}[sec] - (.04 if b >= 44 else 0)
        for n, dv in ((root, -.04), (root + 12, .06)):
            s.put('piano', piano(n, bar + .05, v + dv), t0, 1, side(n), .004)
        for k, n in enumerate(arp):
            s.put('piano', piano(n, bar - k * q / 2 + .05, v * (1.06 if k % 2 == 0 else .94)), t0 + k * q / 2, 1, side(n), .006)
        # strings: in quietly at bar 4, fullest in the chorus, gone by the last bar
        lvl = 0 if b < 4 else .4 if b < 8 else .7 * (47 - b) / 4 if b >= 44 else {'verse': .65, 'lift': .8, 'chorus': 1, 'break': .7}[sec]
        if lvl and len(ch) > 3:
            s.put('strings', strings(chord, bar / 2), t0, lvl)
            s.put('strings', strings(ch[3], bar / 2), t0 + bar / 2, lvl)
        elif lvl:
            s.put('strings', strings(chord + ((chord[-1] + 12,) if sec == 'chorus' else ()), bar), t0, lvl)
        if sec == 'chorus': s.put('strings', strings((root + 12,), bar, 1200), t0, .7)
        # bass: long notes in the verse and lift, driving 8ths in the chorus
        if sec in ('verse', 'lift'): s.put('bass', sub(root, bar - .05), t0, .9)
        if sec == 'chorus':
            for k in range(8): s.put('bass', sub(root, q * .42), t0 + k * q / 2, 1 if k % 2 else .8)
        # drums: a heartbeat in the verse, a backbeat in the lift, four on the floor in the chorus
        if sec == 'verse':
            for j in (0, 2): s.put('drums', K, t0 + j * q, .5)
        if sec in ('verse', 'lift', 'chorus'):
            for j in range(16): s.put('perc', SH, t0 + j * q / 4, .55 if j % 2 == 0 else .3, -.35, .003)
        if sec == 'lift':
            for j in (0, 2) + ((2.5,) if b % 2 else ()): s.put('drums', K, t0 + j * q, .65 if j != 2.5 else .45)
            for j in (1, 3): s.put('drums', CL, t0 + j * q, .5)
            for j in range(4): s.put('perc', HO, t0 + (j + .5) * q, .12, .3)
            if b == 23:
                for j in range(8): s.put('drums', SN, t0 + 2 * q + j * q / 4, .12 + .05 * j)
                s.put('drums', swell(1.6), s.at(24) - 1.6, .3)
        if sec == 'chorus':
            for j in range(4):
                s.put('drums', K, t0 + j * q, .8)
                s.kicks.append(t0 + j * q)
                s.put('perc', HO, t0 + (j + .5) * q, .2, .25)
            for j in (1, 3):
                s.put('drums', CL, t0 + j * q, .6)
                s.put('drums', SN, t0 + j * q, .25)
            if b in (24, 32): s.put('drums', crash(), t0, .35)
            if b == 31:
                for j, n in enumerate((52, 52, 48, 48, 45, 45, 41, 41)): s.put('drums', tom(n), t0 + 2 * q + j * q / 4, .5, -.4 + .11 * j)
        if b == 40:
            s.put('drums', crash(), t0, .3)
            s.put('drums', boom(), t0, .5)
    # the tunes: the hook twice in the chorus (doubled an octave down, with bells, the second time)
    for start in (24, 32):
        for beat, n, d in HOOK:
            t = s.at(start, beat)
            s.put('piano', piano(n, d * q + .3, .64), t, 1.1, side(n), .003)
            if start == 32:
                s.put('piano', piano(n - 12, d * q + .3, .5), t, .8, side(n - 12), .003)
                s.put('bells', mallet(n + 12, BELL, 2.5, .9), t, .5, .2)
    for start in (16, 20):
        for beat, n, d in LIFT:
            s.put('piano', piano(n, d * q + .3, .56), s.at(start, beat), 1, side(n), .003)
            s.put('bells', mallet(n + 12, BELL, 2.5, .9), s.at(start, beat), .35, .2)
    for beat, n, d in ECHO: s.put('piano', piano(n, d * q, .46), s.at(40, beat), 1, side(n), .003)

    p = s.pump(.3, 6)
    piano_ = norm(band(s.bus('piano'), 55, 11000), -16)
    strings_ = norm(band(s.bus('strings'), 110, 7000), -21) * p
    bass_ = norm(s.bus('bass'), -22) * p
    bells = norm(s.bus('bells'), -31)
    drums = norm(band(s.bus('drums'), 30), -20)
    perc = norm(s.bus('perc'), -32)
    wet = reverb(piano_ * .45 + strings_ * .6 + bells + drums * .2 + perc * .3, hall(2.8, .03, 3500))
    s.finish(piano_ + strings_ + bass_ + bells + drums + perc + wet * .32, 'rise')


# ------------------------------------------------------------ 2. momentum: fast
def momentum():
    """128 BPM, F minor. A groove that starts at full speed, a lift with the hook an octave down,
    a big drop, a short break and build, and a second drop that runs back into the groove."""
    s = Song(128, 48, 2)
    # bass note, the stab chord, the arpeggio's four notes
    CH = [(41, (65, 68, 72), (65, 68, 72, 77)),     # F minor
          (37, (65, 68, 73), (61, 65, 68, 73)),     # D flat
          (44, (63, 68, 72), (63, 68, 72, 75)),     # A flat
          (39, (63, 67, 70), (63, 67, 70, 75))]     # E flat
    # the hook, one bar per chord: (16th, note, 16ths)
    HOOK = [[(0, 72, 2), (3, 72, 2), (6, 75, 2), (8, 72, 2), (10, 70, 2), (12, 68, 2), (14, 70, 2)],
            [(0, 68, 2), (3, 68, 2), (6, 72, 2), (8, 68, 2), (10, 65, 2), (12, 65, 2), (14, 68, 2)],
            [(0, 72, 2), (3, 72, 2), (6, 75, 2), (8, 77, 2), (10, 75, 2), (12, 72, 2), (14, 75, 2)],
            [(0, 70, 2), (3, 70, 2), (6, 67, 2), (8, 70, 2), (10, 72, 2), (12, 70, 2), (14, 67, 2)]]
    ARP = (0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 2, 1)
    q = s.beat
    x16 = q / 4
    K, CL, SN, HC, HO = kick(), clap(), snare(200, 25), hat(), hat(True)
    for b in range(48):
        root, stab, arp = CH[b % 4]
        t0 = s.at(b)
        sec = 'groove' if b < 8 else 'lift' if b < 16 else 'drop' if b < 32 else 'break' if b < 36 else 'build' if b < 40 else 'drop'
        drop = sec == 'drop'
        # drums
        if sec != 'break':
            for j in range(4):
                if b == 15 and j >= 2: continue
                s.put('drums', K, t0 + j * q, 1)
                s.kicks.append(t0 + j * q)
        if sec in ('groove', 'lift', 'drop'):
            for j in (1, 3):
                s.put('drums', CL, t0 + j * q, .6)
                s.put('drums', SN, t0 + j * q, .3)
            for j in range(16): s.put('hats', HC, t0 + j * x16, (.5, .2, .35, .2)[j % 4], .25, .002)
            for j in range(4): s.put('hats', HO, t0 + (j + .5) * q, .3 if drop else .22, -.2)
        if sec == 'build':
            for j in range(16): s.put('hats', HC, t0 + j * x16, .3, .25, .002)
        if b in (14, 15, 38, 39):                       # snare rolls into the drops: 8ths, then 16ths
            for j in range(0, 16, 2 if b % 2 == 0 else 1):
                s.put('drums', SN, t0 + j * x16, .15 + .3 * (j / 16 + b % 2) / 2)
        if b in (12, 36): s.put('fx', riser(16 * q), t0, 1)
        if b in (16, 24, 40):
            s.put('drums', crash(), t0, .4)
            s.put('drums', boom(), t0, .6)
        if b == 32: s.put('drums', crash(), t0, .3)
        # bass: offbeat 8ths, galloping 16ths in the drops
        if sec in ('groove', 'lift', 'build'):
            for j in range(4): s.put('bass', bass(root, q * .42, 700, .45, .6), t0 + (j + .5) * q, 1)
        if drop:
            for j in range(4):
                for k in (1, 2, 3):
                    s.put('bass', bass(root + (12 if j == 3 and k == 3 else 0), x16 * .8, 800, .45, .7), t0 + j * q + k * x16, (.8, .9, 1)[k - 1])
        # arpeggio: 16ths throughout
        for j in range(16):
            s.put('arp', pluck(arp[ARP[j]], .2, 5000, 700, 16), t0 + j * x16, 1 if j % 4 == 0 else .7, -.3 if j % 2 else .3)
        # chords: short offbeat stabs in the groove and lift, a wide held chord from the drop on
        if sec in ('groove', 'lift'):
            for j in range(4): s.put('stabs', pad(stab, q * .3, .003, .08, 3500, SAW, 5, .15), t0 + (j + .5) * q, 1)
        else:
            s.put('chords', pad(stab + (stab[0] - 12,), 4 * q, .01, .3, 4500 if drop else 1600, SAW, 7, .2), t0, 1 if drop else .6)
        # the hook: an octave down in the lift and break, full in the drops, doubled up in the second half of each drop
        if sec in ('lift', 'drop', 'break'):
            sh = 0 if drop else -12
            for k16, n, l in HOOK[b % 4]:
                s.put('lead', lead(n + sh, l * x16 * .9), t0 + k16 * x16, 1 if drop else .7)
                if 24 <= b < 32 or b >= 40: s.put('lead', lead(n + 12, l * x16 * .9, 4500), t0 + k16 * x16, .35)

    p = s.pump(.75, 8)
    drums = norm(band(s.bus('drums'), 30, 15000), -17)
    hats = norm(band(s.bus('hats'), 3000, 12000), -31)
    bass_ = norm(band(s.bus('bass'), 30, 5000), -19) * p
    chords = norm(band(s.bus('chords'), 200, 12000), -22) * p
    stabs = norm(band(s.bus('stabs'), 250), -23) * p
    arp = norm(band(s.bus('arp'), 300), -24) * s.pump(.3, 8)
    lead_ = norm(s.bus('lead'), -20)
    fx = norm(s.bus('fx'), -30)
    dly = echo(lead_ * .4 + arp * .5, 3 * q / 4, .35, 5)
    wet = reverb(chords * .3 + lead_ * .3 + arp * .3 + stabs * .3 + drums * .1, hall(1.8, .02, 4000))
    s.finish(drums + hats + bass_ + chords + stabs + arp + lead_ + fx + dly * .5 + wet * .25, 'momentum')


# ------------------------------------------------------------ 3. still: very slow
def still():
    """60 BPM, C major, no drums. Warm pads and a soft low piano, then a felt-piano melody, a lift
    with a gentle pulse, and a last pass that thins back out to the start."""
    s = Song(60, 32, 3)
    # two bars a chord: bass note, the pad, two quiet high notes for the opening
    A = [(41, (57, 60, 64, 67), (76, 79)),     # F major 9
         (40, (55, 59, 62, 67), (74, 71)),     # E minor 7
         (38, (53, 57, 60, 64), (76, 72)),     # D minor 9
         (36, (52, 55, 59, 62), (74, 71))]     # C major 9
    B = [(33, (55, 59, 60, 64), (76, 71)),     # A minor 9
         (41, (57, 60, 64, 69), (72, 76)),     # F major 7
         (40, (55, 60, 64, 67), (79, 76)),     # C over E
         (43, (55, 57, 62, 67), (74, 69))]     # G sus2
    MEL_A = [(0, 69, 2), (2, 72, 2), (4, 76, 4), (8, 74, 2), (10, 71, 2), (12, 67, 4),
             (16, 69, 2), (18, 72, 1), (19, 74, 1), (20, 76, 4), (24, 74, 2), (26, 71, 2), (28, 67, 2), (30, 64, 2)]
    MEL_B = [(0, 71, 2), (2, 72, 2), (4, 76, 4), (8, 69, 2), (10, 67, 2), (12, 72, 4),
             (16, 67, 2), (18, 64, 2), (20, 72, 2), (22, 74, 2), (24, 74, 4), (28, 71, 2), (30, 69, 2)]
    q = s.beat
    for c, (root, chord, high) in enumerate(A + A + B + A):
        t0, d, part = s.at(2 * c), 8 * q, c // 4
        s.put('pad', pad(chord, d, 2.5, 3, 1100, SAW, 3, .08), t0, 1)
        s.put('pad', pad(tuple(n + 12 for n in chord[2:]), d, 3, 3, 3000, TRI, 2, .05), t0, .4)
        s.put('low', piano(root, d + .5, .4, .7), t0, 1, -.2, .004)
        s.put('low', piano(root + 12, d + .5, .32, .7), t0 + .08, .7, -.1, .004)
        s.put('sub', sub(root, d, 1.5, 2), t0, 1)
        if part == 0 or c == 15:
            for j, n in enumerate(high): s.put('keys', piano(n, 3.5, .3, .6), t0 + j * 4 * q + .5, 1, side(n), .01)
        if part == 2:
            for j in range(16): s.put('keys', piano(chord[-1] + 12, q * .45, .22, .6), t0 + j * q / 2, .6, .3, .006)
            s.put('bells', mallet(high[0] + 12, BELL, 4, .6), t0 + 2 * q, 1, .3)
            s.put('cello', pad((root + 12,), d, 2, 3, 900, SAW, 3, .06, .003), t0, 1)
    for start, mel, up, v in ((8, MEL_A, 0, .45), (16, MEL_B, 0, .45), (24, MEL_A, 12, .3)):
        for beat, n, d in mel:
            if start == 24 and beat >= 24: break
            s.put('keys', piano(n + up, d * q + 1.5, v, .6), s.at(start, beat), 1, side(n + up), .01)

    pad_ = norm(band(s.bus('pad'), 90, 6000), -20)
    low = norm(band(s.bus('low'), 30, 3000), -21)
    keys = norm(band(s.bus('keys'), 80, 6000), -19)
    sub_ = norm(s.bus('sub'), -27)
    bells = norm(s.bus('bells'), -32)
    cello = norm(band(s.bus('cello'), 60, 2000), -25)
    wet = reverb(pad_ * .5 + low * .4 + keys * .6 + bells + cello * .5, hall(4.5, .04, 2500))

    def air(x):
        """A breath of high, soft noise that swells and falls twice over the loop."""
        n = len(x)
        swell_ = 1 + .5 * np.sin(2 * np.pi * looped(2 * SR / n, n) * np.arange(n) / SR)
        return x + norm(band(rng.standard_normal((n, 2)), 3000, 9000) * swell_[:, None], -46)
    s.finish(pad_ + low + keys + sub_ + bells + cello + wet * .45, 'still', air)


# ------------------------------------------------------------ 4. focus: lo-fi
def focus():
    """84 BPM, F major. A dusty swung beat, Rhodes chords and a kalimba tune, with tape wobble and
    vinyl crackle; calm enough to sit under hours of tutorial."""
    s = Song(84, 48, 4)
    # bass note, the Rhodes chord, and the chord for the second hit if it changes
    F9, Dm9, Gm9, C9 = (41, (57, 60, 64, 67)), (38, (53, 57, 60, 64)), (43, (53, 57, 58, 62)), (36, (52, 58, 62, 67))
    Bb9, Am7, C9s = (46, (57, 60, 62, 65)), (45, (55, 60, 64, 69)), (36, (58, 62, 65, 67), (58, 62, 64, 69))
    A, B = [F9, Dm9, Gm9, C9], [Bb9, Am7, Gm9, C9s]
    form = A * 5 + B * 2 + A * 2 + B * 2 + A    # intro, beat, tune, lift, beat, lift, beat
    MEL_A = [(0, 76, 1), (1, 72, .5), (1.5, 74, .5), (2, 69, 1.5), (4, 72, .5), (4.5, 74, .5), (5, 77, 1), (6.5, 76, .5), (7, 74, 1),
             (8, 74, 1.5), (9.5, 72, .5), (10, 70, 1), (11, 69, 1), (12, 67, 1), (13, 70, .5), (13.5, 72, .5), (14, 74, 2)]
    MEL_B = [(0, 77, 1.5), (1.5, 76, .5), (2, 74, 2), (4, 72, 1), (5, 76, 1), (6, 79, 1), (7, 76, 1),
             (8, 74, 1.5), (9.5, 70, .5), (10, 72, 1), (11, 69, 1), (12, 70, 2), (14, 67, 1), (15, 64, 1)]
    q = s.beat
    swing = lambda k: k / 4 + (.06 if k % 2 else 0)      # k-th 16th of the bar, the offbeat ones a little late
    K, SN, HC = kick(50, 70, 9, .1, 1.2), snare(175, 18, 1200, 6000), hat(False, 6000)
    for b, ch in enumerate(form):
        root, chord = ch[:2]
        t0, intro = s.at(b), b < 4
        # Rhodes: a rolled chord on the one, a softer one on the and of three
        for k, n in enumerate(chord): s.put('keys', rhodes(n, 2.3 * q, .5), t0 + k * .014, 1, side(n), .006)
        for k, n in enumerate(ch[-1]): s.put('keys', rhodes(n, 1.3 * q, .38), s.at(b, 2.5) + k * .012, 1, side(n), .006)
        if not intro:
            for beat, n, d in ((0, root, 1.4), (2.5, root, .4), (3, root + 7, .9)):
                s.put('bass', bass(n, d * q, 900, 0, 0, TRI, .012, .08), s.at(b, beat), 1, 0, .006)
        # drums: in the intro they sound as if through a wall
        bus = 'far' if intro else 'drums'
        for k in (0, 10) + ((7,) if b % 4 == 3 else ()): s.put(bus, K, s.at(b, swing(k)), .9, 0, .004)
        for k in (4, 12): s.put(bus, SN, s.at(b, swing(k)) + .012, .7, .05, .004)
        if b % 2: s.put(bus, SN, s.at(b, swing(15)), .18, .05, .004)
        for k in range(0, 16, 2): s.put(bus, HC, s.at(b, swing(k)), .5 if k % 4 == 0 else .35, .3, .004)
        if b % 4 in (1, 3):
            for k in (7, 15): s.put(bus, HC, s.at(b, swing(k)), .2, .3, .004)
    for start, mel in ((12, MEL_A), (16, MEL_A), (20, MEL_B), (24, MEL_B), (36, MEL_B), (40, MEL_B)):
        for beat, n, d in mel: s.put('tune', mallet(n, KALIMBA, 2, 3.5, .05), s.at(start, beat), .9, .15, .008)

    keys = chorus(s.bus('keys'), .5, .0018)
    trem = .12 * np.sin(2 * np.pi * 3.2 * np.arange(len(keys)) / SR)
    keys = norm(band(keys * np.stack([1 + trem, 1 - trem], 1), 60, 7000), -18)
    bass_ = norm(band(s.bus('bass'), 30, 2000), -20)
    drums = norm(np.tanh(norm(band(s.bus('drums'), 35, 7500), -12) * 1.5), -19)
    far = norm(band(s.bus('far'), 40, 600), -26)
    tune = norm(band(s.bus('tune'), 200, 8000), -22)
    wet = reverb(keys * .35 + tune * .5 + drums * .1, hall(2, .02, 3000))

    def tape(x):
        x = band(wow(x), None, 10500)
        return x + norm(vinyl(len(x)), -42)
    s.finish(keys + bass_ + drums + far + tune + wet * .3, 'focus', tape)


# ------------------------------------------------------------ 5. pulse: curious
def pulse():
    """100 BPM, A minor. A marimba pattern over a held bass note and ticking hats, a piano motif,
    a lift where the harmony moves, and a fade back to the pattern alone."""
    s = Song(100, 48, 5)
    # bass note, the pad, the marimba's notes (three that cycle, one for the last 16th)
    Am = (33, (57, 60, 64, 71), (64, 69, 72, 71))
    FA = (33, (57, 60, 65, 69), (65, 69, 72, 76))     # F over A
    DA = (33, (57, 62, 65, 69), (65, 69, 74, 72))     # D minor over A
    Esus = (28, (57, 59, 64, 71), (64, 69, 71, 76))
    E = (28, (56, 59, 64, 68), (64, 68, 71, 76))
    F = (29, (53, 57, 60, 64), (65, 69, 72, 76))
    G = (31, (55, 59, 62, 67), (67, 71, 74, 72))
    Em = (28, (55, 59, 62, 64), (64, 67, 71, 74))
    Am7 = (33, (57, 60, 64, 67), (64, 69, 72, 71))
    A, B = [Am, Am, FA, FA, DA, DA, Esus, E], [F, G, Em, Am7] * 2
    form = A + A + B + A + B + A
    MOTIF = [(0, 76, 2), (2, 74, 1), (3, 72, 1), (4, 71, 4), (8, 72, 2), (10, 69, 2), (12, 76, 4),
             (16, 74, 2), (18, 77, 2), (20, 76, 2), (22, 74, 2), (24, 71, 2), (26, 69, 2), (28, 68, 2), (30, 71, 2)]
    LINE = [(0, 72, 4), (4, 74, 4), (8, 71, 4), (12, 76, 4)]
    PAT = (0, 1, 2) * 5 + (3,)                       # threes against the 4/4, so the accent keeps moving
    q = s.beat
    x16 = q / 4
    K, RM, HC, SH = kick(46, 70, 7, .08, 1.3), rim(), hat(False, 8000), shaker(.07)
    for b, (root, chord, mar) in enumerate(form):
        t0 = s.at(b)
        sec = 'open' if b < 8 else 'motif' if b < 16 else 'lift' if b < 24 else 'deep' if b < 32 else 'lift' if b < 40 else 'close'
        for j, i in enumerate(PAT):
            acc = j % 3 == 0 or j == 15
            s.put('marimba', mallet(mar[i], MARIMBA, 1.2), t0 + j * x16, .9 if acc else .55, -.3 + .2 * i, .003)
            if sec == 'deep': s.put('marimba', mallet(mar[i] + 12, MARIMBA, .8), t0 + j * x16, .3 if acc else .18, .4, .003)
        s.put('pad', pad(chord, 4 * q, .8, 1.2, 2200 if sec == 'deep' else 1300, SAW, 3, .1), t0, 1)
        if b >= 4:
            for j in range(8): s.put('bass', bass(root + 12, q * .4, 450, .6, .8), t0 + j * q / 2, 1 if j % 2 == 0 else .7)
        # ticking hats throughout; kick and rim from bar 8 until four bars from the end
        for j in range(16): s.put('perc', HC, t0 + j * x16, .4 if j % 4 == 0 else .25 if j % 2 == 0 else .15, .3, .002)
        if 8 <= b < 44:
            for beat in (0, 2.5): s.put('drums', K, s.at(b, beat), .8)
            for beat in (1, 3): s.put('drums', RM, s.at(b, beat), .5, -.15)
        if sec in ('lift', 'deep'):
            for j in range(8): s.put('perc', SH, t0 + j * q / 2, .3, -.35, .003)
        if sec == 'deep' and b % 2:
            s.put('drums', tom(45), s.at(b, 3), .5, -.3)
            s.put('drums', tom(41), s.at(b, 3.5), .55, .3)
        if b in (16, 24, 32): s.put('drums', swell(1.5), t0 - 1.5, .3)
        if b == 24:
            s.put('drums', boom(), t0, .5)
            s.put('drums', crash(), t0, .25)
    for start in (8, 24):
        for beat, n, d in MOTIF: s.put('piano', piano(n, d * q + .5, .5), s.at(start, beat), 1, side(n), .004)
    for start in (16, 20, 32, 36):
        for beat, n, d in LINE: s.put('strings', pad((n, n - 12), d * q, .5, 1, 2400, SAW, 3, .1, .004), s.at(start, beat), 1)

    marimba = norm(band(s.bus('marimba'), 150, 9000), -19)
    pad_ = norm(band(s.bus('pad'), 120, 5000), -23)
    bass_ = norm(band(s.bus('bass'), 30, 3000), -21)
    perc = norm(band(s.bus('perc'), 2500, 11000), -33)
    drums = norm(s.bus('drums'), -21)
    piano_ = norm(s.bus('piano'), -20)
    strings = norm(band(s.bus('strings'), 150, 7000), -22)
    dly = echo(piano_ * .5, 3 * q / 4, .3, 4)
    wet = reverb(marimba * .25 + pad_ * .5 + piano_ * .5 + strings * .5 + drums * .15, hall(2.6, .03, 3000))
    s.finish(marimba + pad_ + bass_ + perc + drums + piano_ + strings + dly * .4 + wet * .3, 'pulse')


TRACKS = {'rise': rise, 'momentum': momentum, 'still': still, 'focus': focus, 'pulse': pulse}

if __name__ == '__main__':
    for name in sys.argv[1:] or TRACKS:
        TRACKS[name]()
