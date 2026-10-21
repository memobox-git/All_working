#!/usr/bin/env bash
# Renders the YouTube Short: 1080x1920, about 57 seconds, Chris's narration
# from the full video with word-by-word captions.
# Usage: short/build-short.sh [out-dir]     (default: graphics/personal-agents/short)
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=$(realpath -m "${1:-../graphics/personal-agents/short}")
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
mkdir -p "$OUT"
python3 personal-agents/short/short.py
node render-pro.js "personal-agents/short.html?slot=1" "$OUT/short-video.mp4" --w 1080 --h 1920 --sub "${SUB:-2}" --workers 4
rm -f "$OUT/short-video.cues.json"
ffmpeg -v error -y -i "$OUT/short-video.mp4" -i personal-agents/short/short.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/personal-agents-short.mp4"
rm -f "$OUT/short-video.mp4"
echo "wrote $OUT/personal-agents-short.mp4"
