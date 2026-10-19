#!/usr/bin/env bash
# Joins the rendered picture and soundtrack with the channel intro cut in at the
# splice point. Each part is its own input, so ffmpeg never buffers the
# minutes of picture that wait behind the intro.
# Usage: ./join.sh <picture.mp4> <soundtrack.wav> <out.mp4> [crf]
set -euo pipefail
cd "$(dirname "$0")"
PIC=$1; WAV=$2; OUT=$3; CRF=${4:-21}
INTRO=../../graphics/stackle-intro.mp4
S=$(node splice.js)
F=0.25
SF=$(echo "$S - $F" | bc)
ffmpeg -hide_banner -loglevel error -y \
  -t "$S" -i "$PIC" -t "$S" -i "$WAV" -i "$INTRO" -ss "$S" -i "$PIC" -ss "$S" -i "$WAV" -filter_complex "\
[0:v]setpts=PTS-STARTPTS,setsar=1,fade=t=out:st=$SF:d=$F[v0];\
[1:a]asetpts=PTS-STARTPTS,afade=t=out:st=$SF:d=$F[a0];\
[2:v]fps=30,format=yuv420p,setsar=1,setpts=PTS-STARTPTS[v1];\
[2:a]aformat=sample_rates=48000:channel_layouts=stereo,asetpts=PTS-STARTPTS[a1];\
[3:v]setpts=PTS-STARTPTS,setsar=1,fade=t=in:d=$F[v2];\
[4:a]asetpts=PTS-STARTPTS,afade=t=in:d=$F[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map '[v]' -map '[a]' -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart "$OUT"
echo "joined $OUT (intro cut in at ${S}s)"
