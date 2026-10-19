"""Writes the background music for the Airflow explainer: a calm, original
score (warm pad, soft electric piano, sub bass, room reverb) in D major at
70 BPM. No drums and no samples, so there is nothing to license.
The home chord takes the last bar and rings out to the very end.
Usage: python3 make-music.py <seconds> <out.wav>
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 70
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

# two bars per chord: Dmaj9, Bm9, Gmaj9, A6sus
PROG = [
    (38, [57, 61, 64, 66, 69]),
    (35, [54, 57, 61, 62, 66]),
    (31, [55, 59, 62, 66, 69]),
    (33, [57, 59, 62, 64, 66]),
]
# notes the piano picks from over each chord (upper register)
LEAD = [
    [69, 73, 76, 78, 81],
    [66, 69, 73, 74, 78],
    [67, 71, 74, 78, 79],
    [69, 71, 74, 76, 78],
]
# piano rhythm per bar, in eighth notes: (position, index into LEAD, velocity)
PATTERNS = [
    [(0, 0, .55), (3, 2, .38), (4, 3, .45), (6, 1, .36)],
    [(0, 1, .5), (2, 3, .34), (5, 4, .4), (7, 2, .3)],
    [(0, 2, .52), (3, 4, .36), (6, 3, .4)],
    [(0, 0, .5), (2, 2, .32), (4, 1, .42), (5, 3, .3), (7, 4, .28)],
]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, cutoff):
    """One-pole low-pass, run in blocks so it stays fast in numpy."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    prev = np.zeros(x.shape[1:]) if x.ndim > 1 else 0.0
    # keep a^-block well inside float range
    block = int(np.clip(300 / (2 * np.pi * cutoff / SR), 16, 4096))
    powers = a ** np.arange(1, block + 1)
    for s in range(0, len(x), block):
        seg = x[s:s + block] * (1 - a)
        n = len(seg)
        # y[n] = a^n * prev + sum_k a^(n-k) seg[k], done with a scaled cumsum
        scale = a ** -np.arange(n, dtype=float)
        if seg.ndim > 1:
            scale = scale[:, None]
            p = powers[:n, None]
        else:
            p = powers[:n]
        out = np.cumsum(seg * scale, axis=0) / scale + p * prev
        y[s:s + n] = out
        prev = out[-1]
    return y


def pan(sig, p):
    """Equal-power pan, p from -1 (left) to 1 (right)."""
    th = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(th), sig * np.sin(th)], axis=1)


def pad_note(f, dur, attack=2.2, release=2.8):
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for det in (-6, 0, 6):                       # three voices, a few cents apart
        fd = f * 2 ** (det / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        for h in range(1, 7):                    # soft, saw-like spectrum
            sig += np.sin(2 * np.pi * fd * h * t + ph * h) / h ** 1.7
    env = np.minimum(1, t / attack) ** 2
    env *= np.where(t > dur, np.exp(-(t - dur) / (release / 4)), 1)
    lfo = 1 + .08 * np.sin(2 * np.pi * rng.uniform(.07, .13) * t + rng.uniform(0, 6))
    return sig * env * lfo / 3


def piano_note(f, vel, dur=4.5):
    """FM electric piano: bright on the attack, mellow as it decays."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    index = (1.1 + 1.6 * vel) * np.exp(-t / .55)
    mod = np.sin(2 * np.pi * f * t) * index
    body = np.sin(2 * np.pi * f * t + mod)
    tine = np.sin(2 * np.pi * f * 7.02 * t) * np.exp(-t / .03) * .06
    env = np.minimum(1, t / .004) * np.exp(-t / 1.7)
    env *= np.minimum(1, (dur - t) / .3)
    trem = 1 + .05 * np.sin(2 * np.pi * 4.6 * t)
    return (body + tine) * env * trem * vel


def bass_note(f, dur, release=1.5):
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * f * t) + .18 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / .35) * np.where(t > dur, np.exp(-(t - dur) / (release / 4)), 1)
    return sig * env


def reverb_ir(seconds=3.2, rt60=2.6, predelay=.022):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal((n, 2))
    decay = np.exp(-6.91 * t / rt60)[:, None]
    ir = lowpass(noise, 5200) * decay
    ir = lowpass(ir, 2600) * .6 + ir * .4           # high end dies away faster
    ir = np.concatenate([np.zeros((int(predelay * SR), 2)), ir])
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def convolve(x, ir):
    n = len(x) + len(ir) - 1
    size = 1 << (n - 1).bit_length()
    out = np.empty((len(x), 2))
    for ch in range(2):
        X = np.fft.rfft(x[:, ch], size)
        H = np.fft.rfft(ir[:, ch], size)
        out[:, ch] = np.fft.irfft(X * H, size)[:len(x)]
    return out


def add(buf, sig, start):
    s = int(round(start * SR))
    if s < 0:                                    # notes that began before the video did
        sig, s = sig[-s:], 0
    e = min(len(buf), s + len(sig))
    if e > s:
        buf[s:e] += sig[:e - s]


def main(seconds, out):
    total = int(seconds * SR)
    pad = np.zeros((total, 2))
    keys = np.zeros((total, 2))
    bass = np.zeros((total, 2))

    # Chords are laid out backwards from the end: the home chord gets the
    # last bar, so it lands on the closing title, the A chord comes before
    # it, and so on back past the start of the video (two bars per chord).
    final = seconds - .4 - BAR
    chords = [(final, seconds - final, 0)]       # (start, length, chord)
    s, ci = final, 0
    while s > 0:
        s -= 2 * BAR
        ci = (ci - 1) % len(PROG)
        chords.append((s, 2 * BAR, ci))
    chords.reverse()

    for start, length, ci in chords:
        root, voicing = PROG[ci]
        for k, m in enumerate(voicing):
            add(pad, pan(pad_note(hz(m), length + .25), (k / (len(voicing) - 1) - .5) * .7), start - .2)
        add(bass, pan(bass_note(hz(root), length), 0), start)

    bar = 0
    for start, length, ci in chords[:-1]:
        for b0 in (start, start + BAR):
            bar += 1
            if b0 < 2.5:                         # pad alone for the opening
                continue
            pat = PATTERNS[(bar + bar // 8) % len(PATTERNS)]
            for pos, idx, vel in pat:
                tt = b0 + pos * BEAT / 2 + rng.normal(0, .008)
                v = vel * rng.uniform(.85, 1.05)
                add(keys, pan(piano_note(hz(LEAD[ci][idx]), v), rng.uniform(-.45, .45)), tt)
    # a single resolving dyad on the home chord, then let it ring
    for m, v in ((LEAD[0][0] - 12, .42), (LEAD[0][0], .36)):
        add(keys, pan(piano_note(hz(m), v, 7), -.1), final + .02)
    bars = 2 * len(chords) - 1

    pad = lowpass(pad, 1900)
    ir = reverb_ir()
    mix = (pad * .5 + convolve(pad, ir) * .32
           + keys * .32 + convolve(keys, ir) * .2
           + lowpass(bass, 220) * .24)

    t = np.arange(total) / SR
    mix *= np.minimum(1, t / 1.2)[:, None]                      # fade in
    mix *= np.clip((seconds - t) / 3.5, 0, 1)[:, None] ** 1.5    # fade out
    mix = np.tanh(mix / np.max(np.abs(mix)) * 1.1) / np.tanh(1.1) * .89

    pcm = (mix * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'wrote {out}: {seconds:.2f}s, {bars} bars at {BPM} BPM')


if __name__ == '__main__':
    main(float(sys.argv[1]), sys.argv[2])
