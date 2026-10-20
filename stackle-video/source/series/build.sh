#!/usr/bin/env bash
# Renders the series intro, "Explained in 2 Minutes" (episode 00). See ../explained/build.sh for the options:
#   ./build.sh                 landscape (YouTube) + .srt
#   ./build.sh vertical        vertical (TikTok, Reels, Shorts)
exec "$(dirname "$0")/../explained/build.sh" "$(dirname "$0")" "$@"
