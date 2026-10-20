"""Renders the parts of a video listed in a cut list, joined in order.

Usage: python render.py <video> <cuts.json> <out.mp4> [--jobs N]
cuts.json holds {"keep": [[start, end, "note"], ...]} in seconds of the source.
Each kept range is re-encoded with a 20 ms audio fade at both ends, so the
joins don't click, then the pieces are joined without re-encoding.
"""
import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

src, cuts, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
jobs = int(sys.argv[sys.argv.index("--jobs") + 1]) if "--jobs" in sys.argv else 2
keep = json.loads(cuts.read_text())["keep"]
work = out.parent / (out.stem + "-parts")
work.mkdir(parents=True, exist_ok=True)
FADE = 0.02


def piece(i, rng):
    start, end = rng[0], rng[1]
    dur = end - start
    part = work / f"{i:04d}.mp4"
    if part.exists():
        return part
    af = f"afade=t=in:st=0:d={FADE},afade=t=out:st={max(dur - FADE, 0):.3f}:d={FADE}"
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", str(src), "-t", f"{dur:.3f}",
        "-af", af, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-r", "30", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        str(part.with_suffix(".tmp.mp4"))], check=True)
    part.with_suffix(".tmp.mp4").rename(part)
    return part


with ThreadPoolExecutor(jobs) as pool:
    parts = list(pool.map(lambda a: piece(*a), enumerate(keep)))
listing = work / "list.txt"
listing.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
                "-c", "copy", "-movflags", "+faststart", str(out)], check=True)
total = sum(r[1] - r[0] for r in keep)
print(f"wrote {out}: {len(keep)} pieces, {int(total // 60)}:{total % 60:04.1f}")
