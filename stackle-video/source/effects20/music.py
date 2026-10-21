"""Writes the soundtrack for the 20-effect edit and mixes it with the voice.
The beat is built bar by bar on the edit's own timing: a build-up over the intro,
one bar per effect so every switch lands on a downbeat, and a lighter half-time
groove under the call to action. The sound effects are the cues the page lists.
The music ducks under the voice. Everything is synthesised here, so it is free to use.
Usage: python3 -I music.py <work-dir>
Reads timing.json (from timing.js) and voice.wav; writes soundtrack.wav at -14 LUFS."""
import json, os, subprocess, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(20)
work = sys.argv[1]
TM = json.load(open(os.path.join(work, 'timing.json')))
D = TM['duration']
N = int((D + 1) * SR)                      # a second of room for tails
music, sfx = np.zeros((N, 2)), np.zeros((N, 2))


# ------------------------------------------------------------ building blocks
def ts(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.uniform(-1, 1, int(d * SR))
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def saw(f, t, ph=0.): return 2 * ((f * t + ph) % 1) - 1


def band(x, lo=None, hi=None):
    """Soft-edged FFT filter; lo and hi in Hz, either may be None."""
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
    y, norm = np.zeros_like(pad), np.zeros_like(pad)
    f = np.maximum(np.fft.rfftfreq(M, 1 / SR), 1)
    for s in range(0, len(pad) - M, H):
        mask = np.exp(-.5 * (np.log2(f / fc(np.clip((s - M / 2) / n, 0, 1))) / width) ** 2)
        y[s:s + M] += np.fft.irfft(np.fft.rfft(pad[s:s + M] * win) * mask, M) * win
        norm[s:s + M] += win ** 2
    return (y / np.maximum(norm, 1e-3))[M:M + n]


def put(track, x, t, gain=1., pan=0.):
    """Adds a sound into a track at t seconds; pan from -1 (left) to 1 (right)."""
    i = int(round(t * SR))
    if i < 0: x, i = x[-i:], 0
    x = x[:max(0, len(track) - i)]
    if not len(x): return
    if x.ndim == 1: x = np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], 1) * 2 ** .5
    track[i:i + len(x)] += x * gain


# ------------------------------------------------------------ instruments
def kick():
    t = ts(.45)
    body = np.sin(2 * np.pi * np.cumsum(48 + 130 * np.exp(-t * 32)) / SR) * np.exp(-t * 6.5)
    return np.tanh(1.8 * (body + band(noise(.45), 2500, 9000) * np.exp(-t * 320) * .3))


def clap():
    t, n, x = ts(.32), noise(.32), 0
    for k, off in enumerate((0, .011, .023)):
        x = x + n * np.where(t >= off, np.exp(-(t - off) * (70 if k < 2 else 16)), 0)
    return band(x, 900, 5500)


def snare():
    t = ts(.25)
    return np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .6 + band(noise(.25), 1500, 9000) * np.exp(-t * 22)


def hat(open_=False):
    t = ts(.4 if open_ else .07)
    return band(noise(len(t) / SR), 7500) * np.exp(-t * (9 if open_ else 75))


def crash():
    t = ts(2.4)
    return np.stack([band(noise(2.4), 4500) * np.exp(-t * 2), band(noise(2.4), 4500) * np.exp(-t * 2)], 1)


def boom():
    t = ts(1.4)
    return np.sin(2 * np.pi * np.cumsum(32 + 55 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.6) + band(noise(1.4), None, 2500) * np.exp(-t * 14) * .5


def supersaw(notes, d):
    """Detuned saw chord, wider in stereo, for one bar."""
    t, out = ts(d), np.zeros((int(d * SR), 2))
    for n in notes:
        for c, dets in enumerate(((-.15, -.05, .08), (-.08, .05, .15))):
            for det in dets:
                out[:, c] += saw(midi(n + det), t, rng.random())
    return out / (3 * len(notes))


def bass(n, d):
    t = ts(d)
    x = np.sin(2 * np.pi * midi(n - 12) * t) * .75 + band(saw(midi(n), t), None, 900) * .45
    return x * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .02)


def pluck(n, d=.24):
    t = ts(d)
    return (saw(midi(n), t) * .6 + np.sin(2 * np.pi * midi(n) * t) * .4) * np.exp(-t * 15) * np.minimum(1, t / .002)


# A minor: Am, F, C, G; pad voicings, bass roots and arpeggio notes
CHORDS = [((57, 60, 64, 69), 45), ((53, 57, 60, 65), 41), ((55, 60, 64, 67), 48), ((55, 59, 62, 67), 43)]
ARP = [0, 1, 2, 1, 0, 1, 2, 3]


# ------------------------------------------------------------ arrangement
pad, bassline, arp, kicks = np.zeros((N, 2)), np.zeros((N, 2)), np.zeros((N, 2)), []
K, CL, SN, HC, HO = kick(), clap(), snare(), hat(), hat(True)


def bar(a, b, chord, full=True, half=False, fill=False):
    q = (b - a) / 4
    notes, root = CHORDS[chord]
    put(pad, supersaw(notes, b - a + .05), a, .16 if full else .12)
    for j in range(4):
        t = a + j * q
        if not half or j in (0, 2):
            put(music, K, t, .9); kicks.append(t)
        if (not half and j in (1, 3)) or (half and j == 2): put(music, CL, t, .5)
        for h in range(4 if full else 2):
            put(music, HC, t + h * q / (4 if full else 2), (.2 if h % 2 else .12) * (1 if full else .8), (-.3 if h % 2 else .3))
        if full: put(music, HO, t + q / 2, .07, .2)
        if half: put(bassline, bass(root, q * .95), t, .35)
        else: put(bassline, bass(root, q / 2 * .9), t + q / 2, .5)
        if full:
            for s in range(2):
                put(arp, pluck(notes[ARP[(j * 2 + s) % 8] % 4] + 12), t + s * q / 2, .1, (-.4 if s else .4))
                put(arp, pluck(notes[ARP[(j * 2 + s + 1) % 8] % 4] + 12), t + s * q / 2 + q / 4, .07, (.4 if s else -.4))
    if fill:
        for s in range(4):
            put(music, SN, a + 3 * q + s * q / 4, .2 + .1 * s)


intro, effects, ending = TM['intro'], TM['effects'], TM['ending']

# intro: rising noise, a swelling filtered chord and a drum roll into the drop
rise = noise(intro)
rise = sweep(rise, lambda p: 300 * (7000 / 300) ** p) * np.linspace(0, 1, len(rise)) ** 2
put(music, rise, 0, .5)
swell = band(supersaw(CHORDS[3][0], intro), None, 900) * np.linspace(.2, 1, int(intro * SR))[:, None]
put(pad, swell, 0, .22)
roll = [intro - k * .125 for k in range(1, 9)] + [intro - 1 - k * .25 for k in range(1, 5)]
for t in roll:                               # 8ths, then 16ths in the last second, louder towards the drop
    if t > .2: put(music, SN, t, .1 + .25 * (1 - (intro - t) / 2))
rev = crash()[::-1][-int(.9 * SR):]
put(music, rev, intro - .9, .35)

# the 20 effects: one bar each, crash and boom on the first, a fill every fourth
for i, (a, b) in enumerate(effects):
    if i % 4 == 0: put(music, crash(), a, .32)
    bar(a, b, i % 4, full=i >= 4, fill=i % 4 == 3 and i < 19)
put(music, boom(), intro, .7)

# the ending: lighter half-time bars under the voice, a last hit on the follow
e0, end = ending[0]['a'], D
put(music, crash(), e0, .25)
for k, chord in enumerate((0, 1, 3)):
    a = e0 + k * 2.0
    if a < end - .3: bar(a, min(end, a + 2.0), chord, full=False, half=True)
follow = next((p['a'] for p in ending if p['part'] == 'follow'), None)
if follow:
    put(music, crash(), follow, .35); put(music, boom(), follow, .6)
    put(pad, supersaw(CHORDS[0][0], end - follow + .6) * np.exp(-ts(end - follow + .6) * 2.5)[:, None], follow, .2)

# side-chain: pad and bass dip under every kick, which gives the pump
pump = np.ones(N)
for k in sorted(kicks):
    i = int(k * SR)
    seg = pump[i:i + int(.5 * SR)]
    seg *= 1 - .75 * np.exp(-np.arange(len(seg)) / SR * 9)
music += band(pad, None, 3200) * pump[:, None] + bassline * pump[:, None] + band(arp, None, 4500)
music = band(music, 30)


# ------------------------------------------------------------ sound effects
def whoosh(d=.45, lo=250, hi=3000):
    p = np.linspace(0, 1, int(d * SR))
    return sweep(noise(d), lambda u: lo * (hi / lo) ** np.sin(np.pi * u)) * np.sin(np.pi * p) ** 2 * 1.6


def pop():
    t = ts(.12)
    return np.sin(2 * np.pi * np.cumsum(350 + 900 * np.exp(-t * 60)) / SR) * np.exp(-t * 40)


def tick():
    t = ts(.04)
    return (np.sin(2 * np.pi * 2600 * t) + .3 * np.sin(2 * np.pi * 5200 * t)) * np.exp(-t * 160)


def key():
    t = ts(.03)
    return band(noise(.03), 1800, 6000) * np.exp(-t * 260) + np.sin(2 * np.pi * 160 * t) * np.exp(-t * 300) * .5


def hit():
    t = ts(1.0)
    return np.sin(2 * np.pi * np.cumsum(35 + 70 * np.exp(-t * 9)) / SR) * np.exp(-t * 4) + band(noise(1.0), None, 4000) * np.exp(-t * 18) * .6


def riser(d=1.6):
    p = np.linspace(0, 1, int(d * SR))
    return sweep(noise(d), lambda u: 400 * 20 ** u) * p ** 2 * 1.4


def suck(d=.45):
    p = np.linspace(0, 1, int(d * SR))
    return sweep(noise(d), lambda u: 300 * 16 ** u) * p ** 3 * 1.8


def ding():
    t = ts(1.2)
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * r) for f, a, r in ((1568, 1, 3.5), (3136, .35, 5), (4704, .15, 7))) * .6


def clunk():
    t = ts(.18)
    return np.sin(2 * np.pi * 95 * t) * np.exp(-t * 35) + band(noise(.18), None, 600) * np.exp(-t * 40) * .8 + band(noise(.18), 3000) * np.exp(-t * 400) * .4


def shutter():
    t, x = ts(.2), np.zeros(int(.2 * SR))
    for off in (0, .07):
        i = int(off * SR)
        x[i:] += band(noise(.2 - off), 2500)[:len(x) - i] * np.exp(-t[:len(x) - i] * 220)
    return x + band(noise(.2), 900, 3000) * np.exp(-t * 30) * .25


def shimmer():
    t = ts(1.0)
    x = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in (2093, 2637, 3136, 4186)) / 4
    return x * (1 - np.exp(-t * 12)) * np.exp(-t * 3) * (.75 + .25 * np.sin(2 * np.pi * 11 * t))


def zap():
    t = ts(.2)
    return band(np.sign(np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t * 9) + 150) / SR)) * np.exp(-t * 14), None, 5000) * .6


def crack():
    t, x = ts(.35), band(noise(.35), 1200) * np.exp(-ts(.35) * 70)
    for k in range(28):
        i = int(rng.uniform(0, .3) * SR)
        x[i:i + 60] += rng.uniform(-1, 1, len(x[i:i + 60])) * np.exp(-i / SR * 6) * .7
    return x


def shatter():
    d = 1.2
    t, x = ts(d), np.zeros((int(d * SR), 2))
    x += band(noise(d), 2000)[:, None] * np.exp(-t * 7)[:, None] * .5
    for k in range(46):
        at, f = rng.uniform(0, .9) ** 1.6, rng.uniform(2500, 7500)
        tt = ts(.25)
        ping = np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(25, 60)) * rng.uniform(.2, .6)
        i, pan = int(at * SR), rng.uniform(-.8, .8)
        seg = x[i:i + len(ping)]
        seg += np.stack([ping[:len(seg)] * (1 - pan) / 2, ping[:len(seg)] * (1 + pan) / 2], 1) * 2
    return x


def beep():
    t = ts(.12)
    return np.sin(2 * np.pi * 1000 * t) * np.minimum(1, t / .005) * np.minimum(1, (.12 - t) / .01) * .5


def focus():
    t = ts(.12)
    return band(noise(.12), 2000) * np.exp(-t * 300) * .6 + band(noise(.12), 2500, 4000) * np.exp(-t * 25) * .2


def thud():
    t = ts(.3)
    return np.sin(2 * np.pi * 80 * t) * np.exp(-t * 20) + band(noise(.3), None, 800) * np.exp(-t * 30) * .5


def send():
    return np.concatenate([whoosh(.18, 900, 5000) * .7, pop()])


MAKE = {'whoosh': whoosh, 'swish': lambda: whoosh(.22, 1500, 6000), 'pop': pop, 'tick': tick, 'key': key, 'hit': hit,
        'riser': riser, 'suck': suck, 'ding': ding, 'clunk': clunk, 'shutter': shutter, 'shimmer': shimmer, 'zap': zap,
        'crack': crack, 'shatter': shatter, 'beep': beep, 'focus': focus, 'thud': thud, 'send': send}
LEVEL = {'whoosh': .5, 'swish': .5, 'pop': .45, 'tick': .3, 'key': .35, 'hit': .7, 'riser': .4, 'suck': .5, 'ding': .35,
         'clunk': .6, 'shutter': .6, 'shimmer': .3, 'zap': .35, 'crack': .6, 'shatter': .7, 'beep': .35, 'focus': .5,
         'thud': .6, 'send': .45}
for c in TM['sfx']:
    put(sfx, MAKE[c['kind']](), c['t'], LEVEL[c['kind']] * c['gain'], rng.uniform(-.25, .25))


# ------------------------------------------------------------ mix: voice on top, music ducked under it
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(work, 'voice.wav'), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                     capture_output=True, check=True).stdout
voice = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
voice = np.pad(voice, ((0, max(0, N - len(voice))), (0, 0)))[:N]
hop = SR // 100
lvl = 20 * np.log10(np.sqrt(np.mean(voice[:len(voice) // hop * hop].reshape(-1, hop, 2) ** 2, axis=(1, 2))) + 1e-9)
talk = np.clip((lvl + 45) / 15, 0, 1)
env, e = np.zeros_like(talk), 0.
for i, v in enumerate(talk):               # quick to duck (30 ms), slow to come back (350 ms)
    e += (v - e) * (1 - np.exp(-1 / (3 if v > e else 35)))
    env[i] = e
duck = 1 - .6 * np.repeat(env, hop)
duck = np.pad(duck, (0, N - len(duck)), constant_values=1)[:N]

talking = np.pad(np.repeat(talk > .5, hop), (0, N))[:N]
speech = voice[talking]
v_rms = np.sqrt(np.mean(speech ** 2)) if len(speech) else .1
m_rms = np.sqrt(np.mean(music[int(intro * SR):int(TM['effects'][-1][1] * SR)] ** 2))
voice *= .12 / v_rms                       # about -18 dBFS while talking
music *= .065 / m_rms                      # music about 5 dB under the voice before ducking
sfx *= .5
bed = music * duck[:, None] + sfx
mix = voice + bed
mix[int(D * SR) - int(.6 * SR):int(D * SR)] *= np.linspace(1, 0, int(.6 * SR))[:, None] ** 2
mix = np.tanh(mix[:int(D * SR)] / .95) * .95

with wave.open(os.path.join(work, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
# two-pass loudness normalisation to -14 LUFS, the level TikTok, Reels and Shorts play at
mixed, out = os.path.join(work, 'mix.wav'), os.path.join(work, 'soundtrack.wav')
spec = 'loudnorm=I=-14:TP=-1.5:LRA=11'
probe = subprocess.run(['ffmpeg', '-hide_banner', '-i', mixed, '-af', spec + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(probe[probe.rindex('{'):probe.rindex('}') + 1])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mixed, '-af', f"{spec}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
                f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
                '-ar', str(SR), '-c:a', 'pcm_s16le', out], check=True)
os.remove(mixed)
over = 20 * np.log10(np.sqrt(np.mean(voice[talking] ** 2)) / np.sqrt(np.mean(bed[talking] ** 2)))
print(f'wrote {out}: {D:.1f}s, {len(TM["sfx"])} sound effects, voice {over:.1f} dB over the music while talking')
