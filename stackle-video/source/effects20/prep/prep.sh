#!/usr/bin/env bash
# Turns the raw talking-head video (and an optional screen recording) into what
# the edit reads: frames, cut-outs of the person, word timings, the empty room,
# a face crop and meta.js. Everything goes in ../work/, which git ignores.
# Usage: prep/prep.sh <raw-video> [screen-recording]
# The person is cut out on every 2nd frame and blended between; MATTE_STEP=1 does every frame (slower).
set -euo pipefail
RAW=$(realpath "$1"); SCREEN=${2:+$(realpath "$2")}
cd "$(dirname "$0")/.."
FPS=30
W=work
rm -rf $W && mkdir -p $W/frames $W/person
echo "1/6 frames"
ffmpeg -hide_banner -loglevel error -i "$RAW" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=$FPS" -q:v 2 $W/frames/%05d.jpg
ffmpeg -hide_banner -loglevel error -i "$RAW" -vn -ac 2 -ar 48000 $W/voice.wav
echo "2/6 cutting the person out"
python3 -I prep/matte.py $W/frames $W/masks --step ${MATTE_STEP:-2}
echo "3/6 cut-outs"
# four encoders at once, each on a quarter of the frames
N=$(ls $W/frames | wc -l); Q=$(( (N + 3) / 4 ))
for k in 0 1 2 3; do
  ffmpeg -hide_banner -loglevel error -start_number $((k * Q + 1)) -framerate $FPS -i $W/frames/%05d.jpg \
    -start_number $((k * Q + 1)) -framerate $FPS -i $W/masks/%05d.jpg -frames:v $Q \
    -filter_complex "[1]format=gray[m];[0][m]alphamerge" -c:v libwebp -quality 85 -compression_level 0 \
    -f image2 -start_number $((k * Q + 1)) $W/person/%05d.webp &
done
wait
echo "4/6 word timings"
python3 -I prep/transcribe.py $W/voice.wav $W/transcript.json
node ../kit/make-cues.js $W/transcript.json 0 $W/cues.js
if [ -n "${SCREEN:-}" ]; then
  echo "5/6 screen recording"
  mkdir -p $W/screen
  ffmpeg -hide_banner -loglevel error -i "$SCREEN" -vf "fps=$FPS,scale=1000:-2" -q:v 3 $W/screen/%05d.jpg
fi
echo "6/6 room, face and meta"
python3 -I prep/plate.py $W $FPS
