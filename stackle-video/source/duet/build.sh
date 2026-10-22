#!/usr/bin/env bash
# Renders the Claude Duet video: four renderer processes, one per quarter, then the soundtrack and the mux.
# usage: ./build.sh [out.mp4]      (after prep: see README)
set -euo pipefail
cd "$(dirname "$0")"
out=${1:-work/claude-duet-8min.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
D=$(python3 -c "import json; print(json.load(open('work/sections.json'))['duration'])")
N=4
pids=()
for k in $(seq 0 $((N - 1))); do
  a=$(python3 -c "print(round($D * $k / $N, 3))"); b=$(python3 -c "print(round($D * ($k + 1) / $N, 3))")
  [ -f "work/part$k.mp4" ] && continue
  node ../render-pro.js index.html "work/part$k.mp4" --sub 1 --workers 1 --chunk 90 --from "$a" --to "$b" > "work/part$k.log" 2>&1 &
  pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
printf "file 'part%d.mp4'\n" $(seq 0 $((N - 1))) > work/parts.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i work/parts.txt -c copy work/picture.mp4
python3 music.py work                       # writes work/soundtrack.wav
ffmpeg -y -loglevel error -i work/picture.mp4 -i work/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$out"
echo "wrote $out"
