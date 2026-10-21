#!/usr/bin/env bash
# Rebuilds only the soundtrack of a finished cut and swaps it into the MP4,
# keeping the picture as it is (no re-render). Use it after changing the
# sound settings in episode.json, such as "music": false.
# Usage: remix.sh <episode-dir> [vertical]
set -euo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
EP=$(cd "$1" && pwd); shift
cd "$EP"
SLUG=$(node -p "require('./episode.json').slug")
OUT=../../graphics/$SLUG.mp4
if [ "${1:-}" = vertical ]; then OUT=../../graphics/$SLUG-vertical.mp4; fi
BASE=${OUT%.mp4}
node "$KIT/make-cues.js" .
# the picture's length, as render-pro.js would have reported it
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$OUT")
echo "{\"duration\": $DUR}" > "$BASE.remix.cues.json"
if [ "$(node -p "require('./episode.json').music !== false")" = true ]; then
  python3 "$KIT/make-music.py" "$DUR" "$BASE.music.wav" .; MUSIC=$BASE.music.wav
else MUSIC=none; fi
node "$KIT/mix.js" . "$BASE.remix.cues.json" "$MUSIC" "$BASE.wav"
ffmpeg -hide_banner -loglevel error -y -i "$OUT" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$BASE.remix.mp4"
mv "$BASE.remix.mp4" "$OUT"
rm -f "$BASE.remix.cues.json" "$BASE.music.wav" "$BASE.wav"
echo "done: $OUT (new soundtrack, same picture)"
