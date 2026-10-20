#!/usr/bin/env bash
# Downloads the official launch footage (if missing) and cuts the clips the
# scenes use into JPEG frames, so render(t) can step through them exactly.
# Footage and frames are rebuilt from here, so neither is committed.
set -euo pipefail
cd "$(dirname "$0")"
SRC=../../footage/official
mkdir -p "$SRC" clips

# name                 url (official launch posts, see sources.json for pages)
while read -r name url; do
  [ -s "$SRC/$name.mp4" ] || curl -sSL --max-time 300 -o "$SRC/$name.mp4" "$url"
done <<'EOF'
meta-muse-sizzle https://about.fb.com/wp-content/uploads/2026/09/Introducing-Muse_Sizzle-Video.mp4
meta-muse-fieldtrip https://about.fb.com/wp-content/uploads/2026/09/Muse_FieldTrip.mp4
meta-muse-japan https://about.fb.com/wp-content/uploads/2026/09/Muse_Japan.mp4
meta-muse-relationships https://about.fb.com/wp-content/uploads/2026/09/Muse_Relationships.mp4
meta-muse-shopping https://about.fb.com/wp-content/uploads/2026/09/Muse_Shopping.mp4
openai-dots-intro https://videos.ctfassets.net/kftzwdyauwt9/6uzdRgJTUrxfMVNLKLtBie/284aabbc7cb186d0c351b574e6a25bdb/dots-intro-updated-o-light.mp4
google-spark-ui https://storage.googleapis.com/gweb-uniblog-publish-prod/original_videos/UI_Gemini_GeminiSpark_v16.mp4
google-daily-brief https://storage.googleapis.com/gweb-uniblog-publish-prod/original_videos/SimpleUI_UI_Gemini_Daily_Brief_v60_1_B5QMIn7.mp4
google-macos https://storage.googleapis.com/gweb-uniblog-publish-prod/original_videos/Gemini_MacOS_v36_short_gsMVdKO.mp4
EOF

# clip                 source               start  length  width
cut() {
  local name=$1 src=$2 ss=$3 len=$4 w=$5
  [ -s "clips/$name/f00001.jpg" ] && return
  mkdir -p "clips/$name"
  ffmpeg -v error -y -ss "$ss" -t "$len" -i "$SRC/$src.mp4" -vf "fps=30,scale=$w:-2:flags=lanczos" -q:v 2 "clips/$name/f%05d.jpg"
}
cut muse-sizzle      meta-muse-sizzle     12    8     1920
cut spark-notify     google-spark-ui      0     6.9   1600
cut muse-fieldtrip   meta-muse-fieldtrip  0     19    960
cut muse-allow       meta-muse-fieldtrip  19.5  7.5   960
cut muse-japan       meta-muse-japan      0     24.5  960
cut muse-shopping    meta-muse-shopping   0     25.7  960
cut daily-brief      google-daily-brief   0     17.6  1600
cut muse-rel         meta-muse-relationships 0  18.4  960

# frame counts for core.js
{
  echo 'window.CLIP_FRAMES = {'
  for d in clips/*/; do n=$(basename "$d"); echo "  '$n': $(ls "$d" | grep -c jpg),"; done
  echo '};'
} > clips/frames.js
echo "clips ready: $(ls -d clips/*/ | wc -l)"
