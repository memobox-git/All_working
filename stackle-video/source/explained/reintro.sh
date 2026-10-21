#!/usr/bin/env bash
# Swaps a changed channel intro (../intro-pro) into both finished cuts of an
# episode without re-rendering the page. The page is blank under the intro,
# so the stretch it covers is cut down (or padded) to the new intro's length,
# the new intro is laid over it, and the soundtrack and .srt are rebuilt from
# the new timeline. Run it once per episode, after rebuilding the intro and
# before anything else regenerates the episode's timeline.json.
# Usage: reintro.sh <episode-dir>
set -euo pipefail
KIT=$(cd "$(dirname "$0")" && pwd)
EP=$(cd "$1" && pwd)
cd "$EP"
SLUG=$(node -p "require('./episode.json').slug")
OLD_D=$(node -p "require('./timeline.json').insert.duration")
node "$KIT/make-cues.js" .
read -r A NEW_D <<< "$(node -p "const i = require('./timeline.json').insert; i.start + ' ' + i.duration")"
DF=$(node -p "Math.round(($OLD_D - $NEW_D) * 30)")
if [ "$DF" -le 0 ]; then echo "the intro is not shorter ($OLD_D s -> $NEW_D s): rebuild the episode with build.sh instead"; exit 1; fi
K0=$(node -p "Math.ceil($A * 30 - 1e-6)")          # the first frame the intro covers
B=$(node -p "$A + $NEW_D")
for CUT in landscape vertical; do
  OUT=../../graphics/$SLUG.mp4; [ $CUT = vertical ] && OUT=../../graphics/$SLUG-vertical.mp4
  BASE=${OUT%.mp4}
  INTRO=$(node -p "require('./timeline.json').insert.$CUT")
  FRAMES=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")
  DUR=$(node -p "($FRAMES - $DF) / 30")
  echo "{\"duration\": $DUR}" > "$BASE.reintro.cues.json"
  if [ "$(node -p "require('./episode.json').music !== false")" = true ]; then
    python3 "$KIT/make-music.py" "$DUR" "$BASE.music.wav" .; MUSIC=$BASE.music.wav
  else MUSIC=none; fi
  node "$KIT/mix.js" . "$BASE.reintro.cues.json" "$MUSIC" "$BASE.wav"
  # the page before the intro, then the page from where the old intro would have ended, with the new intro on top
  ffmpeg -hide_banner -loglevel error -y -i "$OUT" -i "$INTRO" -i "$BASE.wav" -filter_complex \
    "[0:v]split=2[p0][p1];[p0]trim=end_frame=$K0,setpts=PTS-STARTPTS[a];[p1]trim=start_frame=$((K0 + DF)),setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[page];[1:v]setpts=PTS-STARTPTS+$A/TB[iv];[page][iv]overlay=eof_action=pass:enable='between(t,$A,$B)'[v]" \
    -map '[v]' -map 2:a -c:v libx264 -preset medium -crf 15 -pix_fmt yuv420p -r 30 -c:a aac -b:a 320k -movflags +faststart "$BASE.reintro.mp4"
  mv "$BASE.reintro.mp4" "$OUT"
  rm -f "$BASE.reintro.cues.json" "$BASE.music.wav" "$BASE.wav"
  echo "done: $OUT ($FRAMES -> $((FRAMES - DF)) frames)"
done
node "$KIT/make-srt.js" . "../../graphics/$SLUG.srt"
