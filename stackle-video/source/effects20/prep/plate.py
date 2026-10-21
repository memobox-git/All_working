"""Reads the frames and masks and writes:
  work/plate.jpg   the room with the person removed (for the dolly zoom)
  work/avatar.jpg  a square crop of the face (profile tag, comment box)
  work/meta.js     frame count, fps, where the face is, and whether there is a screen recording
Usage: python3 -I plate.py <work-dir> <fps>"""
import os, sys, glob, json
import numpy as np, cv2

work, fps = sys.argv[1], float(sys.argv[2])
frames = sorted(glob.glob(os.path.join(work, 'frames', '*.jpg')))
masks = sorted(glob.glob(os.path.join(work, 'masks', '*.jpg')))
pick = np.linspace(0, len(frames) - 1, min(40, len(frames))).astype(int)

# the room: per pixel, the median of the frames where the person isn't covering it,
# worked at half size (it is shown soft anyway); the spots the person always covers are painted in
stack, cover = [], []
for i in pick:
    img = cv2.resize(cv2.imread(frames[i]), (540, 960), interpolation=cv2.INTER_AREA).astype(np.float32)
    m = cv2.resize(cv2.imread(masks[i], 0), (540, 960)) > 40
    m = cv2.dilate(m.astype(np.uint8), np.ones((25, 25), np.uint8)) > 0
    img[m] = np.nan
    stack.append(img)
    cover.append(m)
plate = np.nanmedian(np.stack(stack), axis=0)
hole = np.isnan(plate[..., 0]).astype(np.uint8)
plate = np.nan_to_num(plate).clip(0, 255).astype(np.uint8)
plate = cv2.inpaint(plate, hole, 12, cv2.INPAINT_TELEA)
plate = cv2.GaussianBlur(cv2.resize(plate, (1080, 1920), interpolation=cv2.INTER_CUBIC), (0, 0), 2)
cv2.imwrite(os.path.join(work, 'plate.jpg'), plate, [cv2.IMWRITE_JPEG_QUALITY, 90])

# the face: top of the head from the average mask, head width a little below it
avg = np.mean([cv2.imread(masks[i], 0) for i in pick], axis=0) > 127
rows = np.where(avg.sum(1) > 20)[0]
top = int(rows[0]) if len(rows) else 500
def width_at(y):
    xs = np.where(avg[min(y, avg.shape[0] - 1)])[0]
    return (int(xs[0]), int(xs[-1])) if len(xs) else (340, 740)
x0, x1 = width_at(top + 160)
head_w = max(200, x1 - x0)
face = {'x': (x0 + x1) // 2, 'y': int(top + head_w * 0.62), 'w': head_w, 'top': top}

mid = cv2.imread(frames[len(frames) // 2])
s = int(head_w * 1.5)
cx, cy = face['x'], face['y']
crop = mid[max(0, cy - s // 2):cy + s // 2, max(0, cx - s // 2):cx + s // 2]
cv2.imwrite(os.path.join(work, 'avatar.jpg'), cv2.resize(crop, (256, 256), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 90])

screen = len(glob.glob(os.path.join(work, 'screen', '*.jpg')))
meta = {'fps': fps, 'frames': len(frames), 'face': face, 'screenFrames': screen}
open(os.path.join(work, 'meta.js'), 'w').write('// Written by prep/plate.py; do not edit by hand.\nwindow.META = ' + json.dumps(meta) + ';\n')
print('meta', meta)
