#!/usr/bin/env bash
# Renders "Apache Airflow, explained": picture, music, soundtrack, final MP4.
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/airflow-explained.mp4}; shift || true
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 1.0
node ../render-pro.js index.html "$BASE.picture.mp4" "$@"
DUR=$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(process.argv[1])).duration))" "$BASE.picture.cues.json")
python3 make-music.py "$DUR" "$BASE.music.wav"
node mix.js "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
echo "done: $OUT"
