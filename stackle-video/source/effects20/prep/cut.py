"""Cuts a raw take down to the parts worth keeping, in order, and writes where
the cuts land so the edit can switch effects exactly on them (hiding the jump).
Usage: python3 -I cut.py <raw-video> <keep.json> <out.mp4>
keep.json is a list of [start, end] seconds in the raw take, e.g. the intro, one
piece per effect name, and the best take of the call to action. Writes <out.mp4>
and <out>.cuts.json, which prep.sh picks up when it sits next to the video."""
import json, subprocess, sys

raw, keep_file, out = sys.argv[1], sys.argv[2], sys.argv[3]
keep = json.load(open(keep_file))
v = ''.join(f'[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];' for i, (a, b) in enumerate(keep))
# a 12 ms fade at each end stops the audio clicking at the cuts
au = ''.join(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b - a - 0.015:.3f}:d=0.015[a{i}];'
             for i, (a, b) in enumerate(keep))
cat = ''.join(f'[v{i}][a{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=1:a=1[v][a]'
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-filter_complex', v + au + cat,
                '-map', '[v]', '-map', '[a]', '-r', '30', '-c:v', 'libx264', '-preset', 'fast', '-crf', '14', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '256k', out], check=True)
cuts, t = [], 0.0
for a, b in keep:
    cuts.append(round(t, 3))
    t += b - a
json.dump(cuts[1:], open(out.rsplit('.', 1)[0] + '.cuts.json', 'w'))
print(f'{len(keep)} pieces, {t:.2f}s')
