#!/usr/bin/env bash
# Renders "Apache Airflow, explained": picture, music, soundtrack, final MP4.
# Usage: ./build.sh [vertical] [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
#   landscape (default): 1920x1080 for YouTube, plus an .srt caption file next to the video
#   vertical:            1080x1920 for TikTok, Reels and Shorts, with the captions burned in
# Both also save their first frame (the opening card) as <out>-thumbnail.jpg.
set -euo pipefail
cd "$(dirname "$0")"
PAGE=index.html; OUT=../../graphics/airflow-explained.mp4; SIZE=()
if [ "${1:-}" = vertical ]; then
  PAGE=vertical.html; OUT=../../graphics/airflow-explained-vertical.mp4; SIZE=(--width 1080 --height 1920); shift
fi
if [ $# -gt 0 ] && [[ $1 != --* ]]; then OUT=$1; shift; fi
BASE=${OUT%.mp4}
OFFSET=1.8                       # the voice starts after the opening card
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json $OFFSET
node ../render-pro.js "$PAGE" "$BASE.picture.mp4" ${SIZE[@]+"${SIZE[@]}"} "$@"
DUR=$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(process.argv[1])).duration))" "$BASE.picture.cues.json")
python3 make-music.py "$DUR" "$BASE.music.wav" audio/vo.transcript.json $OFFSET
node mix.js "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
node make-thumb.js "$PAGE" "$(node -p "process.argv[1] === 'index.html' ? '1920x1080' : '1080x1920'" "$PAGE")" "$BASE-thumbnail.jpg"
if [ "$PAGE" = index.html ]; then node make-srt.js audio/vo.transcript.json "$BASE.srt" $OFFSET; fi
echo "done: $OUT"
