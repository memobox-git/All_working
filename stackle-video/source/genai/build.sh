#!/usr/bin/env bash
# Renders "20 Gen AI Concepts You Actually Need". See ../explained/build.sh for the options:
#   ./build.sh                 landscape (YouTube) + .srt
#   ./build.sh vertical        vertical (TikTok, Reels, Shorts)
exec "$(dirname "$0")/../explained/build.sh" "$(dirname "$0")" "$@"
