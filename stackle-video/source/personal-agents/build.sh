#!/usr/bin/env bash
# Renders every Personal AI Agents graphic to MP4, plus the side cards as PNGs.
# Usage: ./build.sh [out-dir]          (default: stackle-video/graphics/personal-agents)
#        SUB=1 ./build.sh /tmp/draft   (fast draft, no motion blur)
#        WPM=162 ./build.sh            (retime every graphic to a faster read)
#        ONLY="08 17" ./build.sh       (just these graphics)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=$(realpath -m "${1:-../graphics/personal-agents}")
SUB=${SUB:-2}
WPM=${WPM:-150}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
mkdir -p "$OUT"

declare -A NAME=(
  [01]=cold-open-timeline [02]=the-plan [03]=map-chatbot [05]=map-diy-agent [07]=map-personal-agent
  [08]=phone-message [09]=map-one-line-each [12]=learning-memory-file [13]=connectors
  [14]=map-ready-out-of-the-box [17]=heartbeat [18]=the-maths [19]=cloud-computer [20]=lock-in
  [21]=meta-claims [22]=prompt-injection [23]=pick-this-if [24]=agent-vs-pipeline [25]=your-turn
)
IDS=${ONLY:-$(printf '%s\n' "${!NAME[@]}" | sort | tr '\n' ' ')}

for id in $IDS; do
  file="$OUT/g$id-${NAME[$id]}.mp4"
  echo "== g$id ${NAME[$id]}"
  node render-pro.js "personal-agents/index.html?g=$id&wpm=$WPM" "$file" --sub "$SUB" --workers 4
  rm -f "${file%.mp4}.cues.json"
done
node personal-agents/cards.js "$OUT/cards"
