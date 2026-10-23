#!/usr/bin/env bash
# Lays the music (score.py) under a finished video, very low: by default the
# music sits at -31 LUFS, about 14 dB under Chris's voice (-17 LUFS). It fades
# in over 1.5 s and out over the last 3 s. The picture is copied, not re-encoded.
# The score is rebuilt whenever score.py or the timeline is newer than it.
# Usage: music/mix.sh in.mp4 out.mp4 [seconds]     (MUSIC_LUFS=-29 for louder)
set -euo pipefail
in=$(realpath "$1") out=$(realpath -m "$2") len=${3:-}
cd "$(dirname "$0")"
lufs=${MUSIC_LUFS:--31}
if ! { [ score.wav -nt score.py ] && [ score.wav -nt ../vo/timeline.json ]; }; then python3 score.py score.wav; fi

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
[ -n "$len" ] && dur=$len
have=$(ffmpeg -hide_banner -i score.wav -af ebur128=framelog=quiet -f null - 2>&1 | awk '/ I:/{v=$2} END{print v}')
gain=$(awk -v a="$lufs" -v b="$have" 'BEGIN{printf "%.2f", a-b}')
fade=$(awk -v d="$dur" 'BEGIN{printf "%.3f", d-3}')

ffmpeg -v error -y -t "$dur" -i "$in" -i score.wav -filter_complex \
  "[1:a]atrim=0:$dur,volume=${gain}dB,afade=t=in:d=1.5,afade=t=out:st=$fade:d=3[m];[0:a][m]amix=inputs=2:normalize=0:duration=first[a]" \
  -map 0:v -map '[a]' -c:v copy -c:a aac -b:a 192k -movflags +faststart "$out"
echo "wrote $out: music at $lufs LUFS (${gain} dB), $dur s"
