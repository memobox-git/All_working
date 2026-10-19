#!/usr/bin/env bash
# Renders "AI Agents Explained": picture, soundtrack, then the channel intro
# (graphics/stackle-intro.mp4) cut in after the promise, before "Number one".
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/ai-agents-explained.mp4}; shift || true
BASE=${OUT%.mp4}
INTRO=../../graphics/stackle-intro.mp4
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-cues.js audio/vo.transcript.json 0.6
node ../render-pro.js index.html "$BASE.picture.mp4" "$@"
node mix.js "$BASE.picture.cues.json" "$BASE.wav"
S=$(node splice.js)
F=0.25
ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -i "$INTRO" -filter_complex "\
[0:v]trim=0:$S,setpts=PTS-STARTPTS,fade=t=out:st=$(echo "$S - $F" | bc):d=$F[v0];\
[1:a]atrim=0:$S,asetpts=PTS-STARTPTS,afade=t=out:st=$(echo "$S - $F" | bc):d=$F[a0];\
[2:v]fps=30,format=yuv420p,setpts=PTS-STARTPTS[v1];\
[2:a]aformat=sample_rates=48000:channel_layouts=stereo,asetpts=PTS-STARTPTS[a1];\
[0:v]trim=start=$S,setpts=PTS-STARTPTS,fade=t=in:d=$F[v2];\
[1:a]atrim=start=$S,asetpts=PTS-STARTPTS,afade=t=in:d=$F[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map '[v]' -map '[a]' -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.wav"
echo "done: $OUT (intro cut in at ${S}s)"
