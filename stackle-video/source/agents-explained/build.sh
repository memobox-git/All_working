#!/usr/bin/env bash
# Renders "AI Agents Explained": picture, soundtrack, then the channel intro
# (graphics/stackle-intro.mp4) cut in after the promise, before "Number one".
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/ai-agents-explained.mp4}; shift || true
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 0.6
node ../render-pro.js index.html "$BASE.picture.mp4" "$@"
node mix.js "$BASE.picture.cues.json" "$BASE.wav"
./join.sh "$BASE.picture.mp4" "$BASE.wav" "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.wav"
echo "done: $OUT"
