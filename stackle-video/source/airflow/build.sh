#!/usr/bin/env bash
# Renders "Apache Airflow, explained": picture, music, soundtrack, final MP4.
# Usage: ./build.sh [vertical] [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
#   landscape (default): 1920x1080 for YouTube, plus an .srt caption file next to the video
#   vertical:            1080x1920 for TikTok, Reels and Shorts, with the captions burned in
set -euo pipefail
cd "$(dirname "$0")"
PAGE=index.html; OUT=../../graphics/airflow-explained.mp4; SIZE=()
if [ "${1:-}" = vertical ]; then
  PAGE=vertical.html; OUT=../../graphics/airflow-explained-vertical.mp4; SIZE=(--width 1080 --height 1920); shift
fi
if [ $# -gt 0 ] && [[ $1 != --* ]]; then OUT=$1; shift; fi
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 1.0
node ../render-pro.js "$PAGE" "$BASE.picture.mp4" ${SIZE[@]+"${SIZE[@]}"} "$@"
DUR=$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(process.argv[1])).duration))" "$BASE.picture.cues.json")
python3 make-music.py "$DUR" "$BASE.music.wav"
node mix.js "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
if [ "$PAGE" = index.html ]; then node make-srt.js audio/vo.transcript.json "$BASE.srt" 1.0; fi
echo "done: $OUT"
