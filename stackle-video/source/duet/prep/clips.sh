#!/usr/bin/env bash
# Turns the source footage into 30 fps JPEG frames that the scene steps through.
# usage: ./prep/clips.sh <footage-dir> <work-dir>
# <footage-dir> holds the files made by the capture scripts (see README):
#   duet-demo-2880.mp4  duet-hero-2880.mp4  grokbot-launch.mp4
#   Introducing-Muse_Sizzle-Video.mp4  Muse_Shopping.mp4
set -euo pipefail
src=$1; out=$2/clips
mkdir -p "$out"
one() {  # name, file, filter
  local d="$out/$1"
  if [ -f "$d/.done" ]; then echo "$1 already done"; return; fi
  rm -rf "$d"; mkdir -p "$d"
  ffmpeg -y -loglevel error -i "$src/$2" -vf "fps=30,$3" -q:v 3 "$d/%05d.jpg"
  touch "$d/.done"; echo "$1: $(ls "$d" | wc -l) frames"
}
# the phone alone, at the 1.5x capture size (the phone sits at x 1093, y 262 in the 2880x1620 capture)
one duet_phone duet-demo-2880.mp4 "crop=693:1358:1093:262" &
# the whole page around the phone, and the top of the page
one duet_page  duet-demo-2880.mp4 "scale=1920:1080:flags=lanczos" &
one duet_hero  duet-hero-2880.mp4 "scale=1920:1080:flags=lanczos" &
wait
one grok       grokbot-launch.mp4 "scale=1920:1080" &
one muse       Introducing-Muse_Sizzle-Video.mp4 "scale=1920:1080" &
one muse_shop  Muse_Shopping.mp4 "scale=1240:-2:flags=lanczos" &
wait
