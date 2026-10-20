"""Transcribes a video with word timestamps, for planning cuts.

Usage: python transcribe.py <video> <out_dir> [model_dir]
Writes <out_dir>/words.json (every word with start and end, in seconds) and
<out_dir>/transcript.txt (one line per segment, with [mm:ss.s] timecodes).
Needs faster-whisper; the model is small.en on CPU (int8).
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

video, out = Path(sys.argv[1]), Path(sys.argv[2])
model_dir = sys.argv[3] if len(sys.argv) > 3 else None
out.mkdir(parents=True, exist_ok=True)
wav = out / "audio.wav"
if not wav.exists():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)


def tc(t):
    return f"{int(t // 60):02d}:{t % 60:04.1f}"


model = WhisperModel("small.en", device="cpu", compute_type="int8", download_root=model_dir, cpu_threads=4)
# Pass samples, not a path: some PyAV versions reject faster-whisper's own decoder options.
with wave.open(str(wav)) as w:
    audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
# Keep the false starts and fillers in the text: they are what we want to find and cut.
segments, _ = model.transcribe(audio, word_timestamps=True, vad_filter=False, condition_on_previous_text=False,
                               initial_prompt="Um, uh, so, like, you know. I'm a senior data engineer, uh, at Meta.")
words, lines = [], []
for s in segments:
    lines.append(f"[{tc(s.start)}-{tc(s.end)}] {s.text.strip()}")
    words += [{"w": w.word, "s": round(w.start, 2), "e": round(w.end, 2), "p": round(w.probability, 2)} for w in s.words]
    print(lines[-1], flush=True)
(out / "words.json").write_text(json.dumps(words))
(out / "transcript.txt").write_text("\n".join(lines) + "\n")
print("done", len(words), "words")
