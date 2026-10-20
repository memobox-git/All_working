#!/usr/bin/env bash
# Renders a mid-video ask: picture, soundtrack, final MP4.
# Usage: ./build.sh <call|de|ai> [out.mp4] [extra render-pro.js flags, e.g. --size 1080x1920]
set -euo pipefail
cd "$(dirname "$0")"
ASK=$1; shift
OUT=${1:-../../graphics/stackle-ask-$ASK.mp4}; shift || true
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node ../kit/make-cues.js "audio/$ASK.transcript.json" 0.4 "cues/$ASK.js"
node ../render-pro.js "$ASK.html" "${OUT%.mp4}.picture.mp4" "$@"
node ../kit/mix.js "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav" "audio/$ASK.mp3"
ffmpeg -hide_banner -loglevel error -y -i "${OUT%.mp4}.picture.mp4" -i "${OUT%.mp4}.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "${OUT%.mp4}.picture.mp4" "${OUT%.mp4}.picture.cues.json" "${OUT%.mp4}.wav"
echo "done: $OUT"
