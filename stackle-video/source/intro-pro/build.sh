#!/usr/bin/env bash
# Renders the Stackle channel intro: picture, soundtrack, final MP4.
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/stackle-intro.mp4}; shift || true
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 0.6
node ../render-pro.js index.html "${OUT%.mp4}.picture.mp4" "$@"
node mix.js "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav"
ffmpeg -hide_banner -loglevel error -y -i "${OUT%.mp4}.picture.mp4" -i "${OUT%.mp4}.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "${OUT%.mp4}.picture.mp4" "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav"
echo "done: $OUT"
