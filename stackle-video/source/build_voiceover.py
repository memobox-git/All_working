"""Builds the voiceover for claude-videos.html and the time map that syncs
the scenes to it.

Usage: python3 build_voiceover.py
Writes voiceover/voiceover.wav and claude-videos.timing.js, then prints the
video length to pass to render.js.

Each scene has one ElevenLabs clip (voice "Luis - Chill, Warm,
Conversational", model eleven_v4). Long pauses inside a clip are shortened,
the clips are laid end to end, and every scene is stretched or squeezed so
its animation lines up with its line of narration.
"""
import json
import re
import subprocess

import numpy as np

SR = 48000
GAP = 0.6   # seconds between one scene's line and the next
LEAD = 0.35  # a scene starts fading in this long before its line

# t_in / t_out: the scene's window on the HTML's own timeline.
# sync: (HTML time, time in the raw clip) pairs that should land together,
#       e.g. a step lighting up as its sentence starts.
# tail: how long the scene holds after its line ends.
SCENES = [
    dict(clip="s1.mp3", t_in=0.0, t_out=6.2, tail=0.25,
         text="Here are three ways to make videos with Claude.",
         sync=[(0.6, 0.0)]),
    dict(clip="s2.mp3", t_in=6.4, t_out=17.0, tail=0.6,
         text="First, the big idea. Claude doesn't film anything. It writes the video as code, "
              "so you can change any word or number, then export an MP4.",
         sync=[(6.9, 2.50), (8.4, 5.10), (10.2, 7.36), (12.7, 9.80)]),
    dict(clip="s3.mp3", t_in=17.2, t_out=23.3, tail=0.3,
         text="You can use Claude Motion, Claude Code, or connectors.",
         sync=[(18.3, 0.55), (18.7, 1.73), (19.1, 2.73)]),
    dict(clip="s4.mp3", t_in=23.5, t_out=47.5, tail=0.5,
         text="Option one is Claude Motion, right in the Claude app. Start a chat, or pick a Motion "
              "template. Tell it who it's for, where it'll play, and how long. Ask for changes in "
              "plain English. Then export an MP4. It's in beta on Team and Enterprise plans.",
         sync=[(24.6, 4.35), (29.5, 7.60), (35.5, 12.04), (41.5, 14.72)]),
    dict(clip="s5.mp3", t_in=47.7, t_out=66.4, tail=0.5,
         text="Option two is Claude Code, for full control. Pick a framework like Remotion. Add its "
              "skill. Describe your scenes, and Claude writes the code. Then render it and tweak. "
              "That's how this video was made.",
         sync=[(48.8, 3.92), (53.0, 6.27), (57.5, 7.94), (62.0, 11.47)]),
    dict(clip="s6.mp3", t_in=66.6, t_out=77.3, tail=0.9,
         text="Option three is connectors. Hook up tools like Descript, HeyGen or ElevenLabs, and "
              "Claude drives them for you, including voiceovers like this one.",
         sync=[(68.2, 2.67), (70.6, 6.76), (72.0, 8.90)]),
    dict(clip="s7.mp3", t_in=77.5, t_out=86.3, tail=0.6,
         text="Whichever you pick, give it the basics: length, topic, audience, where it plays, "
              "and your own assets. Then refine it one scene at a time.",
         sync=[(78.4, 1.66), (79.3, 3.25), (79.9, 4.16), (80.5, 5.14), (81.1, 6.23),
               (81.7, 7.42), (82.7, 9.47)]),
    dict(clip="s8.mp3", t_in=86.5, t_out=92.4, tail=2.2,
         text="Describe it, refine it, export it.",
         sync=[(86.8, 0.0), (87.4, 1.14), (88.0, 2.25)]),
]
END = 93.0  # last frame of the HTML timeline


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1",
                          "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def silences(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                          "silencedetect=noise=-40dB:d=0.22", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(s) for s in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(s) for s in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(starts, ends))


def tighten(path):
    """Trims the ends and shortens long pauses (1.2 s -> 0.5 s, 0.4 s -> 0.3 s).
    Returns the audio and (raw time, new time) knots for remap()."""
    x = decode(path)
    win = SR // 100
    rms = np.sqrt(np.mean(x[: len(x) // win * win].reshape(-1, win) ** 2, axis=1))
    loud = np.nonzero(rms > 10 ** (-50 / 20))[0]
    on = max(loud[0] / 100 - 0.03, 0)
    off = min((loud[-1] + 1) / 100 + 0.08, len(x) / SR)
    keep, a = [], on
    for s, e in silences(path):
        if s <= on + 0.05 or e >= off - 0.05:
            continue
        q = min(e - s, 0.2 + 0.25 * (e - s))
        if e - s - q > 0.02:
            keep.append((a, s + q * 0.45))
            a = e - q * 0.55
    keep.append((a, off))
    fade = int(0.012 * SR)
    ramp = np.linspace(0, 1, fade, dtype=np.float32)
    parts, knots, t = [], [], 0.0
    for a, b in keep:
        seg = x[int(a * SR):int(b * SR)].copy()
        seg[:fade] *= ramp
        seg[-fade:] *= ramp[::-1]
        parts.append(seg)
        knots += [(a, t), (b, t + len(seg) / SR)]
        t += len(seg) / SR
    return np.concatenate(parts), knots


def remap(knots, t):
    xs, ys = zip(*knots)
    return float(np.interp(t, xs, ys))


def loudnorm(src, dst):
    """Two-pass EBU R128 normalisation to -16 LUFS, the usual level for web video."""
    f = "loudnorm=I=-16:TP=-1.5:LRA=11"
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", src, "-af",
                          f + ":print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = json.loads(err[err.rindex("{"):])
    f += (f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f, "-ar", str(SR),
                    "-c:a", "pcm_s16le", dst], check=True)


def main():
    warp, clips, t = [(0.0, 0.0)], [], 0.4
    for sc in SCENES:
        audio, knots = tighten("voiceover/" + sc["clip"])
        c0, c1 = t, t + len(audio) / SR
        warp.append((max(c0 - LEAD, 0.01), sc["t_in"]))
        warp += [(c0 + remap(knots, raw), html) for html, raw in sc["sync"]]
        warp.append((c1 + sc["tail"], sc["t_out"]))
        clips.append((c0, audio))
        t = c1 + sc["tail"] + GAP
    total = warp[-1][0] + 0.5
    warp.append((total, END))
    for (a, p), (b, q) in zip(warp, warp[1:]):
        assert b > a and q >= p, f"time map out of order near {a:.2f}s"

    mix = np.zeros(int(total * SR) + 1, np.float32)
    for c0, audio in clips:
        i = int(c0 * SR)
        mix[i:i + len(audio)] += audio
    raw = "voiceover/.mix.f32"
    mix.tofile(raw)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1",
                    "-i", raw, "voiceover/.mix.wav"], check=True)
    loudnorm("voiceover/.mix.wav", "voiceover/voiceover.wav")
    subprocess.run(["rm", raw, "voiceover/.mix.wav"], check=True)

    with open("claude-videos.timing.js", "w") as f:
        f.write("// Generated by build_voiceover.py: [video time, scene time] pairs that sync\n"
                "// the scenes to the voiceover. Delete this file to play the original timing.\n")
        f.write("window.WARP = " + json.dumps([[round(a, 3), round(b, 3)] for a, b in warp]) + ";\n")
        f.write(f"window.DURATION = {total:.2f};\n")
    for sc, (c0, audio) in zip(SCENES, clips):
        print(f"{sc['clip']}  starts {c0:6.2f}s  {len(audio) / SR:5.2f}s")
    print(f"total {total:.2f}s")


if __name__ == "__main__":
    main()
