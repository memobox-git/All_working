#!/usr/bin/env bash
# Renders the Stackle channel intro: picture, soundtrack, final MP4.
# Usage: ./build.sh [vertical] [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
#   landscape (default): 1920x1080, ../../graphics/stackle-intro.mp4
#   vertical:            1080x1920, ../../graphics/stackle-intro-vertical.mp4 (TikTok, Reels, Shorts)
set -euo pipefail
cd "$(dirname "$0")"
PAGE=index.html; OUT=../../graphics/stackle-intro.mp4; SIZE=(--width 1920 --height 1080)
if [ "${1:-}" = vertical ]; then PAGE=vertical.html; OUT=../../graphics/stackle-intro-vertical.mp4; SIZE=(--width 1080 --height 1920); shift; fi
if [ $# -gt 0 ] && [[ $1 != --* ]]; then OUT=$1; shift; fi
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 0.6
node ../render-pro.js "$PAGE" "${OUT%.mp4}.picture.mp4" "${SIZE[@]}" "$@"
node mix.js "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav"
ffmpeg -hide_banner -loglevel error -y -i "${OUT%.mp4}.picture.mp4" -i "${OUT%.mp4}.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "${OUT%.mp4}.picture.mp4" "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav"
echo "done: $OUT"
