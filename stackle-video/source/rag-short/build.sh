#!/usr/bin/env bash
# Renders the RAG Short (1080x1920) with its sound and an .srt.
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags, e.g. --sub 1 for a fast draft]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:-../../graphics/rag-short-demo.mp4}; [ $# -gt 0 ] && shift
BASE=${OUT%.mp4}
export NODE_PATH=${NODE_PATH:-$(npm root -g)}
node make-words.js
node ../render-pro.js index.html "$BASE.picture.mp4" --width 1080 --height 1920 "$@"
python3 mix.py "$BASE.picture.cues.json" audio/vo.mp3 "$BASE.wav"
ffmpeg -hide_banner -loglevel error -y -i "$BASE.picture.mp4" -i "$BASE.wav" -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
rm -f "$BASE.picture.mp4" "$BASE.picture.cues.json" "$BASE.wav"
node -e "
const W = require('fs').readFileSync('words.js', 'utf8'); eval(W.replace(/window\./g, 'global.'));
const off = .1, f = s => new Date(Math.max(0, s + off) * 1000).toISOString().slice(11, 23).replace('.', ',');
let out = '', n = 0, g = [];
const flush = () => { if (g.length) { out += ++n + '\n' + f(g[0].s) + ' --> ' + f(g[g.length - 1].e) + '\n' + g.map(x => x.w).join(' ') + '\n\n'; g = []; } };
WORDS.forEach(w => { g.push(w); if (/[.,?!]$/.test(w.w) || g.length >= 6) flush(); }); flush();
require('fs').writeFileSync('$BASE.srt', out);"
echo "done: $OUT"
