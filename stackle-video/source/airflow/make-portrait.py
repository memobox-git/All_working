"""Cuts the presenter out of a photo for the opening card (the thumbnail):
background removed, cropped to the person, a light grade so skin and clothes
sit well on white, and a fade where the photo is cut off at the bottom.
Usage: python3 make-portrait.py <photo> <out.png> [model]
Needs: pip install "rembg[cpu]" (the first run downloads the model)
"""
import sys

import numpy as np
from PIL import Image, ImageEnhance
from rembg import new_session, remove

src, out = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else 'birefnet-portrait'

photo = Image.open(src).convert('RGB')
cut = remove(photo, session=new_session(model))
cut = cut.crop(cut.getchannel('A').getbbox())

rgb, a = cut.convert('RGB'), cut.getchannel('A')
rgb = ImageEnhance.Brightness(rgb).enhance(1.05)
rgb = ImageEnhance.Contrast(rgb).enhance(1.05)
rgb = ImageEnhance.Color(rgb).enhance(0.96)

# fade out the bottom quarter, where the photo is cropped
alpha = np.asarray(a).astype(np.float32) / 255
h = alpha.shape[0]
alpha *= np.clip((h - np.arange(h)) / (h * .24), 0, 1)[:, None]
Image.fromarray(np.dstack([np.asarray(rgb), (alpha * 255).astype(np.uint8)]), 'RGBA').save(out, optimize=True)
print('portrait', cut.width, 'x', cut.height, '->', out)
