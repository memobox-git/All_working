"""Cuts the person out of every frame: writes one greyscale mask per frame
(white = person). Usage:
  python3 -I matte.py <frames-dir> <masks-dir> [--model birefnet|modnet] [--step N]
--step N runs the model on every Nth frame and blends the masks in between,
which is N times faster and fine for a person sitting still.
Models are downloaded once into ~/.cache/effects20 (both MIT/Apache-2.0)."""
import os, sys, glob, time, urllib.request
import numpy as np, cv2, onnxruntime as ort

MODELS = {
    # name: (repo, file, input size); modnet keeps the frame's shape with the short side
    # at this size, birefnet needs a square. birefnet is cleaner but about 25s a frame on CPU.
    'modnet': ('Xenova/modnet', 'onnx/model.onnx', 640),
    'birefnet': ('onnx-community/BiRefNet_lite-ONNX', 'onnx/model.onnx', 1024),
}
MEAN, STD = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])


def session(name):
    repo, file, size = MODELS[name]
    path = os.path.expanduser(f'~/.cache/effects20/{repo.split("/")[1]}-{os.path.basename(file)}')
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        print('downloading', repo)
        urllib.request.urlretrieve(f'https://huggingface.co/{repo}/resolve/main/{file}', path)
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = os.cpu_count()
    return ort.InferenceSession(path, opts, providers=['CPUExecutionProvider']), size


def predict(sess, size, img, square):
    h, w = img.shape[:2]
    k = size / min(h, w)
    dims = (size, size) if square else (round(w * k / 32) * 32, round(h * k / 32) * 32)
    x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), dims, interpolation=cv2.INTER_AREA) / 255.0
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    inp = sess.get_inputs()[0]
    x = x.astype(np.float16 if 'float16' in inp.type else np.float32)
    out = sess.run(None, {inp.name: x})[-1][0, 0].astype(np.float32)
    if out.min() < 0 or out.max() > 1:  # BiRefNet returns logits
        out = 1 / (1 + np.exp(-out))
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC).clip(0, 1)


def masks(frames, sess, size, square, step):
    """Yields one mask per frame, in order. The model runs on every step-th frame;
    the frames in between get a blend of the two masks around them."""
    keys = sorted(set(list(range(0, len(frames), step)) + [len(frames) - 1]))
    t0, prev = time.time(), None
    for n, i in enumerate(keys):
        m = predict(sess, size, cv2.imread(frames[i]), square)
        if prev is None:
            yield m
        else:
            a, ma = prev
            for j in range(a + 1, i + 1):
                f = (j - a) / (i - a)
                yield ma * (1 - f) + m * f
        prev = (i, m)
        if n % 20 == 0:
            print(f'{n + 1}/{len(keys)} key frames, {time.time() - t0:.0f}s', flush=True)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    model = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'modnet'
    step = int(sys.argv[sys.argv.index('--step') + 1]) if '--step' in sys.argv else 1
    os.makedirs(dst, exist_ok=True)
    frames = sorted(glob.glob(os.path.join(src, '*.jpg')))
    sess, size = session(model)

    def write(i, prev, cur, nxt):
        # average with the neighbours to stop the edge flickering, then pull the edge in a
        # little so no halo of the old background shows against a new one
        m = ((0.5 * cur + 0.25 * (prev + nxt) - 0.12) / 0.8).clip(0, 1)
        cv2.imwrite(os.path.join(dst, os.path.basename(frames[i])), (m * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])

    t0, win = time.time(), []
    for i, m in enumerate(masks(frames, sess, size, model == 'birefnet', step)):
        win.append(m)
        if len(win) == 2 and i == 1:
            write(0, win[0], win[0], win[1])
        if len(win) == 3:
            write(i - 1, *win)
            win.pop(0)
    if len(frames) == 1:
        write(0, win[0], win[0], win[0])
    elif win:
        write(len(frames) - 1, win[-2], win[-1], win[-1])
    print(f'wrote {len(frames)} masks to {dst} in {time.time() - t0:.0f}s')


if __name__ == '__main__':
    main()
