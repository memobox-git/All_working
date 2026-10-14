#!/bin/bash
# usage: ./make.sh <name>  -> <name>.png (final frame), <name>.gif, <name>.mp4
set -e
n=$1
node gif.js $n.html fr_$n 100
node shot.js $n.html $n.png
ffmpeg -v error -y -framerate 15 -i fr_$n/f%03d.png -vf "tpad=stop_mode=clone:stop_duration=3,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" $n.gif
ffmpeg -v error -y -framerate 15 -i fr_$n/f%03d.png -vf "tpad=stop_mode=clone:stop_duration=3,format=yuv420p" -c:v libx264 -crf 20 -movflags +faststart $n.mp4
ls -la $n.gif $n.mp4 $n.png
