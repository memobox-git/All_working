#!/bin/sh
PAGE=${PAGE:-board.html}
# render.sh <query-string-or-empty> <out.png> [scale]: screenshot $PAGE at 1080x1350 (x scale)
CH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)
S=${3:-1}
timeout 60 "$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1080,1600 --force-device-scale-factor=$S --virtual-time-budget=4000 \
  --screenshot="$2.full.png" "file://$(pwd)/$PAGE$1" >/dev/null 2>&1
python3 -c "
from PIL import Image; import sys
im=Image.open('$2.full.png'); s=$S
im.crop((0,0,int(1080*s),int(1350*s))).save('$2'); print('$2', im.size)
"
rm -f "$2.full.png"
