# Cuts the presenter out of a photo and bakes the intro look into it:
# warm grade, amber rim light on the edges, a fade where the photo is cropped,
# and a separate soft glow layer that sits behind the cutout.
# Usage: python make-portrait.py <photo> <out-dir> [model]
# Needs: pip install "rembg[cpu]" pillow numpy
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from rembg import new_session, remove

src, out_dir = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else 'birefnet-portrait'
H = 960                                   # cutout height in the 1080p frame

photo = Image.open(src).convert('RGB')
cut = remove(photo, session=new_session(model), post_process_mask=True)
cut = cut.crop(cut.getchannel('A').getbbox())
cut = cut.resize((round(cut.width * H / cut.height), H), Image.LANCZOS)

rgb, a = cut.convert('RGB'), cut.getchannel('A')
rgb = ImageEnhance.Contrast(rgb).enhance(1.06)
rgb = ImageEnhance.Color(rgb).enhance(0.92)
px = np.asarray(rgb).astype(np.float32)
px = px * np.array([1.04, 1.0, 0.93])          # nudge toward the amber palette
alpha = np.asarray(a).astype(np.float32) / 255

# rim light: the outer few pixels of the silhouette, brightest on the left and top
inner = np.asarray(a.filter(ImageFilter.MinFilter(13)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255
edge = np.clip(alpha - inner, 0, 1)
h, w = alpha.shape
side = np.clip(1.25 - np.linspace(0, 1, w)[None, :] * .9 - np.linspace(0, 1, h)[:, None] * .35, 0, 1)
rim = (edge * side)[..., None] * .85
px = px * (1 - rim) + np.array([255, 196, 120]) * rim

# fade out where the photo is cropped at the bottom
fade = np.clip((h - np.arange(h)) / (h * .26), 0, 1)[:, None]
alpha = alpha * fade
Image.fromarray(np.dstack([np.clip(px, 0, 255), alpha * 255]).astype(np.uint8), 'RGBA').save(f'{out_dir}/portrait.png', optimize=True)

# glow layer: a blurred amber silhouette, padded so the blur is not clipped
pad = 120
sil = Image.new('L', (w + pad * 2, h + pad * 2), 0)
sil.paste(Image.fromarray((alpha * 255).astype(np.uint8)), (pad, pad))
glow = sil.filter(ImageFilter.GaussianBlur(46))
g = np.asarray(glow).astype(np.float32) / 255 * .9
Image.fromarray(np.dstack([np.full_like(g, 245), np.full_like(g, 158), np.full_like(g, 11), g * 255]).astype(np.uint8), 'RGBA').save(f'{out_dir}/portrait-glow.png', optimize=True)
print('portrait', w, 'x', h, '-> glow pad', pad)
