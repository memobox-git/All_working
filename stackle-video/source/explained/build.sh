#!/usr/bin/env bash
# Renders one cut of an "Explained in 2 minutes" episode: picture, music,
# soundtrack, final MP4, with the channel intro laid in where the timeline
# puts it. Each episode folder has an episode.json (output name, opening card,
# intro, voice offset, comment ask, music cue words) and a build.sh that
# calls this.
# Usage: build.sh <episode-dir> [vertical] [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
#   landscape (default): 1920x1080 for YouTube, plus an .srt caption file next to the video
#   vertical:            1080x1920 for TikTok, Reels and Shorts, with the captions burned in
# Both also save their first frame (the opening card) as <out>-thumbnail.jpg.
set -euo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
EP=$(cd "$1" && pwd); shift
cd "$EP"
SLUG=$(node -p "require('./episode.json').slug")
PAGE=index.html; OUT=../../graphics/$SLUG.mp4; SIZE=1920x1080
if [ "${1:-}" = vertical ]; then
  PAGE=vertical.html; OUT=../../graphics/$SLUG-vertical.mp4; SIZE=1080x1920; shift
fi
if [ $# -gt 0 ] && [[ $1 != --* ]]; then OUT=$1; shift; fi
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node "$KIT/make-cues.js" .
node ../render-pro.js "$PAGE" "$BASE.picture.mp4" --width "${SIZE%x*}" --height "${SIZE#*x}" "$@"
DUR=$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(process.argv[1])).duration))" "$BASE.picture.cues.json")
if [ "$(node -p "require('./episode.json').music !== false")" = true ]; then
  python3 "$KIT/make-music.py" "$DUR" "$BASE.music.wav" .; MUSIC=$BASE.music.wav
else MUSIC=none; fi
node "$KIT/mix.js" . "$BASE.picture.cues.json" "$MUSIC" "$BASE.wav"
INTRO=$(node -p "const t = require('./timeline.json'); t.insert ? [t.insert.start, t.insert.start + t.insert.duration, t.insert['$([ "$PAGE" = index.html ] && echo landscape || echo vertical)']].join(' ') : ''")
if [ -n "$INTRO" ]; then
  read -r IN_A IN_B IN_FILE <<< "$INTRO"
  # the channel intro over the (blank) stretch of page the timeline keeps for it
  ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$IN_FILE" -i "$BASE.wav" -filter_complex \
    "[1:v]setpts=PTS-STARTPTS+$IN_A/TB[iv];[0:v][iv]overlay=eof_action=pass:enable='between(t,$IN_A,$IN_B)'[v]" \
    -map '[v]' -map 2:a -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -r 30 -c:a aac -b:a 320k -movflags +faststart "$OUT"
else
  ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "$OUT"
fi
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.music.wav" "$BASE.wav"
node "$KIT/make-thumb.js" "$PAGE" "$SIZE" "$BASE-thumbnail.jpg"
if [ "$PAGE" = index.html ]; then node "$KIT/make-srt.js" . "$BASE.srt"; fi
echo "done: $OUT"
