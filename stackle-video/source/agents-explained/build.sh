#!/usr/bin/env bash
# Renders "AI Agents Explained": picture, soundtrack, then the channel intro
# (graphics/stackle-intro.mp4) cut in after the promise, before "Number one".
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
# VOICE_ONLY=1 leaves out the music and sound effects; INTRO=0 leaves out the channel intro.
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/ai-agents-explained.mp4}; shift || true
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 0.6
node ../render-pro.js index.html "$BASE.picture.mp4" "$@"
node mix.js "$BASE.picture.cues.json" "$BASE.wav" ${VOICE_ONLY:+--voice-only}
if [ "${INTRO:-1}" = 0 ]; then
  ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
else
  ./join.sh "$BASE.picture.mp4" "$BASE.wav" "$OUT"
fi
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.wav"
echo "done: $OUT"
