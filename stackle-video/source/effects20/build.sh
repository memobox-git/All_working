#!/usr/bin/env bash
# Renders the 20-effect edit from what prep/prep.sh made, then lays the voice
# back on, levelled for TikTok, Reels and Shorts (-14 LUFS).
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-work/final.mp4}; shift || true
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node ../render-pro.js index.html "${OUT%.mp4}.picture.mp4" --size 1080x1920 "$@"
ffmpeg -hide_banner -loglevel error -y -i "${OUT%.mp4}.picture.mp4" -i work/voice.wav -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$OUT"
rm -f "${OUT%.mp4}.picture.mp4" "${OUT%.mp4}.picture.cues.json"
echo "done: $OUT"
