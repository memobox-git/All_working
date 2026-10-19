"""Measures each highlighted quote from the captures themselves.

grab.js saves every page twice: clean, and with the quote highlighted by the
browser. The pixels that differ between the two are exactly the highlight, so
their line boxes are where the animation's highlighter must go, even if the
page re-flowed after the browser reported its own boxes.
Usage: python3 lines.py sources     (rewrites sources.json and sources.js)
"""
import json, os, sys
from PIL import Image, ImageChops

d = sys.argv[1]
meta = json.load(open(os.path.join(d, 'sources.json')))
for name, m in meta.items():
    hl = os.path.join(d, name + '-hl.png')
    if not os.path.exists(hl):
        continue
    a = Image.open(os.path.join(d, name + '.png')).convert('RGB')
    b = Image.open(hl).convert('RGB')
    # highlighter yellow in the marked capture, where the clean capture is not yellow
    ra, ga, ba = a.split(); rb, gb, bb = b.split()
    yellow_b = ImageChops.multiply(ImageChops.multiply(rb.point(lambda v: 255 if v > 225 else 0), gb.point(lambda v: 255 if v > 200 else 0)), bb.point(lambda v: 255 if v < 150 else 0))
    yellow_a = ImageChops.multiply(ImageChops.multiply(ra.point(lambda v: 255 if v > 225 else 0), ga.point(lambda v: 255 if v > 200 else 0)), ba.point(lambda v: 255 if v < 150 else 0))
    diff = ImageChops.subtract(yellow_b, yellow_a)
    w, h = diff.size
    px = diff.load()
    rows = [y for y in range(h) if any(px[x, y] for x in range(0, w, 2))]
    lines, start, prev = [], None, None
    for y in rows + [None]:
        if y is not None and prev is not None and y - prev <= 3:
            prev = y
            continue
        if start is not None:
            band = diff.crop((0, start, w, prev + 1))
            box = band.getbbox()
            if box and prev - start >= 8:      # ignore stray pixels
                lines.append([box[0] // 2, start // 2, (box[2] - box[0]) // 2, (prev - start + 1) // 2])
        start = prev = y
    m['lines'] = lines
    print(name, lines)
json.dump(meta, open(os.path.join(d, 'sources.json'), 'w'), indent=1)
open(os.path.join(d, 'sources.js'), 'w').write('window.SOURCES = ' + json.dumps(meta, indent=1) + ';\n')
