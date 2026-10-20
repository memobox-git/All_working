"""Writes the background music for an "Explained in 2 minutes" episode: an
upbeat, original house-pop track at 120 BPM in D major (four-on-the-floor
kick, claps, hats, off-beat bass, plucked chords, a 16th-note arp for the
architecture part). It is synthesised from scratch, so there is nothing to
license.

The bars follow the voiceover, at the words named in the episode's
episode.json ("music"): the full beat drops on the title ("drop"), a crash
marks each of the three chapters after it ("chapters": open hats join from
the first, the arp plays from the second until the third), the drums drop
out for the last line ("break"), and the last chord hits as the voice ends.
A soft pad carries on under the comment ask. The beat is already going on
the very first frame, under the opening card, and it pauses while the
channel intro plays (the intro has its own sound).
Word times come from <episode>/timeline.json (written by make-cues.js).
Usage: python3 make-music.py <seconds> <out.wav> <episode-dir>
"""
import json
import os
import re
import sys
import wave

import numpy as np

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(11)

# one bar per chord, D – A – Bm – G: (bass root, pluck voicing)
PROG = [
    (38, [62, 66, 69, 73]),
    (33, [61, 64, 69, 71]),
    (35, [62, 66, 69, 71]),
    (31, [62, 66, 67, 71]),
]
# chord stabs, in 16th notes within the bar (a 3-3-2 push)
STABS = [0, 3, 6, 8, 11, 14]


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


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def pan(sig, p):
    """Equal-power pan, p from -1 (left) to 1 (right)."""
    th = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(th), sig * np.sin(th)], axis=1)


def env_t(seconds):
    return np.arange(int(seconds * SR)) / SR


# ---------------------------------------------------------------- drums

def kick():
    t = env_t(.4)
    f = 55 + 140 * np.exp(-t / .025)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .22)
    knock = np.sin(2 * np.pi * 130 * t) * np.exp(-t / .04) * .35      # what phone speakers actually play
    click = highpass(rng.standard_normal(len(t)), 2500) * np.exp(-t / .004) * .35
    return np.tanh(2.2 * (body + knock + click)) / np.tanh(2.2)


def clap():
    t = env_t(.4)
    noise = lowpass(highpass(rng.standard_normal(len(t)), 900), 5000)
    env = sum(np.where(t >= d, np.exp(-(t - d) / .006), 0) for d in (0, .011, .022))
    env += .7 * np.where(t >= .03, np.exp(-(t - .03) / .12), 0)
    body = np.sin(2 * np.pi * 210 * t) * np.exp(-t / .03) * .2
    return noise * env * 2.2 + body


def hat(open_=False):
    t = env_t(.4 if open_ else .09)
    noise = highpass(highpass(rng.standard_normal(len(t)), 7000), 7000)
    return noise * np.exp(-t / (.13 if open_ else .022)) * np.minimum(1, t / .001)


def crash():
    t = env_t(2.4)
    noise = highpass(rng.standard_normal(len(t)), 4500)
    shimmer = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in (3210, 4470, 5930, 7340)) * .08
    return (noise + shimmer) * np.exp(-t / .9) * np.minimum(1, t / .002)


def riser(seconds):
    """Filtered noise that opens up and gets louder toward the next downbeat."""
    t = env_t(seconds)
    x = rng.standard_normal(len(t))
    y = np.empty_like(x)
    state, block = 0.0, 256
    for s in range(0, len(x), block):
        k = s / len(x)
        a = np.exp(-2 * np.pi * (300 + 9000 * k ** 2) / SR)
        for i in range(s, min(len(x), s + block)):
            state = a * state + (1 - a) * x[i]
            y[i] = state
    return y * (t / seconds) ** 2.2


# ---------------------------------------------------------------- tonal

def pluck(f, dur=.5):
    """Bright attack that mellows fast: each harmonic decays faster than the last."""
    t = env_t(dur)
    sig = np.zeros(len(t))
    for det in (-7, 7):
        fd = f * 2 ** (det / 1200)
        for h in range(1, 13):
            sig += np.sin(2 * np.pi * fd * h * t) / h ** 1.1 * np.exp(-t * (5 + 2.4 * h))
    return sig * np.minimum(1, t / .003) * np.minimum(1, (dur - t) / .03) / 2


def bass_note(f, dur):
    t = env_t(dur)
    sig = sum(np.sin(2 * np.pi * f * h * t) / h * np.exp(-t * (1.5 + 4 * h)) for h in range(1, 7))
    sig += .8 * np.sin(2 * np.pi * f * t) + .4 * np.sin(4 * np.pi * f * t)
    sig = np.tanh(2.8 * sig)                                           # harmonics so it carries on small speakers
    return sig * np.minimum(1, t / .004) * np.minimum(1, (dur - t) / .02)


def pad_chord(notes, dur):
    t = env_t(dur + .4)
    sig = np.zeros(len(t))
    for m in notes:
        for det in (-9, 0, 9):
            fd = hz(m - 12) * 2 ** (det / 1200)
            for h in range(1, 5):
                sig += np.sin(2 * np.pi * fd * h * t + rng.uniform(0, 6)) / h ** 1.6
    env = np.minimum(1, t / .25) * np.where(t > dur, np.exp(-(t - dur) / .12), 1)
    return sig * env / (3 * len(notes))


def reverb_ir(seconds=2.2, rt60=1.6, predelay=.015):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = lowpass(rng.standard_normal((n, 2)), 6000) * np.exp(-6.91 * t / rt60)[:, None]
    ir = np.concatenate([np.zeros((int(predelay * SR), 2)), ir])
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def convolve(x, ir):
    n = len(x) + len(ir) - 1
    size = 1 << (n - 1).bit_length()
    out = np.empty((len(x), 2))
    for ch in range(2):
        out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch], size) * np.fft.rfft(ir[:, ch], size), size)[:len(x)]
    return out


def add(buf, sig, start, gain=1.0, p=0.0):
    sig = pan(sig, p) if sig.ndim == 1 else sig.copy()
    n = min(len(sig), int(.005 * SR))
    sig[-n:] *= np.linspace(1, 0, n)[:, None]          # no sound ever stops on a click
    s = int(round(start * SR))
    if s < 0:
        sig, s = sig[-s:], 0
    e = min(len(buf), s + len(sig))
    if e > s:
        buf[s:e] += sig[:e - s] * gain


# ---------------------------------------------------------------- arrangement

def cue_times(episode):
    music = json.load(open(os.path.join(episode, 'episode.json')))['music']
    tl = json.load(open(os.path.join(episode, 'timeline.json')))
    norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower())
    words = [w for w in tl['words'] if not w['w'].startswith('[')]

    def at(cue):
        word, n = cue
        hits = [w['s'] for w in words if norm(w['w']) == word]
        return hits[n]
    c1, c2, c3 = (at(cue) for cue in music['chapters'])
    ins = tl.get('insert')
    return {'title': at(music['drop']), 'ch1': c1, 'ch2': c2, 'ch3': c3,
            'last_line': at(music['break']), 'voice_end': tl['voiceEnd'],
            'insert': (ins['start'], ins['start'] + ins['duration']) if ins else None}


def main(seconds, out, episode):
    total = int(seconds * SR)
    drums, bass, keys, pads, sends, fx = (np.zeros((total, 2)) for _ in range(6))
    c = cue_times(episode)

    # downbeats sit on the title, every bar is two seconds
    t0 = c['title'] % BAR
    bar_at = lambda t: int(round((t - t0) / BAR))
    start = lambda b: t0 + b * BAR
    b_title, b_ch1, b_ch2, b_ch3 = (bar_at(c[k]) for k in ('title', 'ch1', 'ch2', 'ch3'))
    b_break = int(np.floor((c['last_line'] - t0) / BAR + 1e-6))     # drums out for the last line
    b_end = max(b_break + 1, bar_at(c['voice_end']))                 # the last chord, as the voice ends
    nbars = int(np.ceil((seconds - t0) / BAR))

    K, C = kick(), clap()
    HATS = [hat() for _ in range(4)]
    OPEN = hat(True)
    CRASH = crash()
    pluck_cache = {}

    def pl(m, dur=.42):
        if (m, dur) not in pluck_cache:
            pluck_cache[(m, dur)] = pluck(hz(m), dur)
        return pluck_cache[(m, dur)]

    kicks = []
    for b in range(-int(np.ceil(t0 / BAR)), nbars):    # from the bar already under way at 0:00
        s = start(b)
        root, voicing = PROG[b % 4]
        if b == b_end:
            root, voicing = PROG[0]
        full = b_title <= b < b_break

        # drums
        if b < b_break:
            beats = 2 if b == b_title - 1 else 4        # kick drops out before the title hits
            for k in range(beats):
                add(drums, K, s + k * BEAT, .9)
                kicks.append(s + k * BEAT)
            for k in range(4):                           # off-beat hats, 16th ghosts once it is full
                add(drums, HATS[(b + k) % 4], s + (k + .5) * BEAT, .32, (-1) ** k * .25)
                if full:
                    add(drums, HATS[(b + k + 1) % 4], s + (k + .25) * BEAT, .1, .3)
                    add(drums, HATS[(b + k + 2) % 4], s + (k + .75) * BEAT, .12, -.3)
            if full:
                add(drums, C, s + BEAT, .55)
                add(drums, C, s + 3 * BEAT, .55)
                add(sends, pan(C, 0) * .55, s + BEAT, .25)
                add(sends, pan(C, 0) * .55, s + 3 * BEAT, .25)
                if b >= b_ch1:
                    add(drums, OPEN, s + 3.5 * BEAT, .16, .2)
                if b + 1 in (b_ch1, b_ch2, b_ch3, b_break):     # a clap roll into the next chapter
                    for k in range(4):
                        add(drums, C, s + (3 + k / 4) * BEAT, .25 + .1 * k)
        if b in (b_title, b_ch1, b_ch2, b_ch3, b_end):
            add(fx, pan(CRASH, 0), s, .3)
        if b == b_end:
            add(drums, K, s, 1.0)
        if b == b_title - 1 or b == b_break:
            add(fx, pan(riser(BAR), .0), s, .22)

        # bass: off-beat 8ths from four bars before the title, one long root to finish
        if b_title - 4 <= b < b_break:
            for k in range(4):
                add(bass, bass_note(hz(root), BEAT * .42), s + (k + .5) * BEAT, .38)
        elif b == b_end:
            add(bass, bass_note(hz(root), BAR * .9), s, .5)

        # plucked chord stabs, the pad underneath, the arp for the architecture
        if b < b_break:
            for pos in STABS:
                for j, m in enumerate(voicing):
                    add(keys, pl(m), s + pos * BEAT / 4, .24, (j / 3 - .5) * .6)
        elif b <= b_end:
            for j, m in enumerate(voicing):
                add(keys, pluck(hz(m), 2.6 if b == b_end else 1.9), s, .2, (j / 3 - .5) * .6)
        else:                                            # after the last chord: a soft bed for the comment ask
            add(keys, pl(voicing[0], 1.2), s, .1)
        add(pads, pad_chord(voicing, BAR), s, .3 if b > b_end else .42 if b >= b_break else .3)
        if b_ch2 <= b < b_ch3:
            arp = [voicing[i % 4] + 12 for i in (0, 1, 2, 3, 2, 1)]
            for k in range(16):
                add(keys, pl(arp[k % 6], .22), s + k * BEAT / 4, .09 + .03 * (k % 4 == 0), np.sin(k * .8) * .5)

    # pump everything tonal from the kick, the classic house sidechain
    pump = np.ones(total)
    for k in kicks:
        i0 = int(round(k * SR))
        idx = np.arange(max(0, i0), min(total, i0 + int(BEAT * SR)))
        pump[idx] = np.minimum(pump[idx], 1 - .55 * np.exp(-(idx - i0) / SR / .1))
    tonal = (bass + keys + pads) * pump[:, None]

    ir = reverb_ir()
    mix = drums + tonal + fx + convolve(keys * .5 + pads * .6 + sends, ir) * .22
    mix = highpass(highpass(mix, 32), 32)                              # nothing useful lives below here

    t = np.arange(total) / SR
    mix *= np.minimum(1, t / .05)[:, None]
    if c['insert']:                                                 # quiet while the channel intro plays
        a, b = c['insert']
        mix *= np.clip(np.maximum((a - .05 - t) / .25, (t - b) / .4), 0, 1)[:, None]
    mix *= np.clip((seconds - t) / 1.8, 0, 1)[:, None] ** 1.3      # fade the last chord out with the picture
    mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) / np.tanh(1.4) * .89

    pcm = (mix * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f'wrote {out}: {seconds:.2f}s at {BPM} BPM; drop {start(b_title):.2f}s, '
          f'crashes at {", ".join(f"{start(b):.2f}" for b in (b_ch1, b_ch2, b_ch3))}s, '
          f'break {start(b_break):.2f}s, last chord {start(b_end):.2f}s')


if __name__ == '__main__':
    main(float(sys.argv[1]), sys.argv[2], sys.argv[3])
