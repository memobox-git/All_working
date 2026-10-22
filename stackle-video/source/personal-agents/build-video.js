// Renders the whole narrated video from vo/timeline.json: each slot is its
// scene rendered with render-pro.js at the slot's exact length (the camera
// lines are kinetic graphics, scenes-premium.js). A slot whose scene is 'cam'
// is a still, labelled placeholder card instead.
// Then the slots are joined and laid over the narration (vo/narration.wav).
// Finished slots are kept, so a stopped build resumes where it left off.
// Usage: node build-video.js [out-dir] [--sub 2] [--only 8,11]
//   (run vo/timeline.py first; out-dir defaults to graphics/personal-agents/full)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const out = path.resolve(argv[0] && !argv[0].startsWith('--') ? argv[0] : path.join(__dirname, '../../graphics/personal-agents/full'));
const sub = opt('sub', '2');
const only = opt('only', '') ? opt('only').split(',').map(Number) : null;
const T = JSON.parse(fs.readFileSync(path.join(__dirname, 'vo/timeline.json')));
const page = path.join(__dirname, 'video.html');
const dir = path.join(out, 'slots');
fs.mkdirSync(dir, { recursive: true });
const ff = (...a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });

(async () => {
  const files = [];
  let browser;
  for (const [i, s] of T.slots.entries()) {
    const n = i + 1, file = path.join(dir, `${s.id}.mp4`);
    files.push(file);
    if (fs.existsSync(file) || (only && !only.includes(n))) continue;
    const frames = s.f1 - s.f0;
    console.log(`== slot ${n}/${T.slots.length} ${s.id} (${s.scene}, ${frames} frames)`);
    if (s.scene !== 'cam') {           // a scene to render; 'cam' is a blank card for Chris's own shot
      execFileSync('node', [path.join(__dirname, '../render-pro.js'), `${page}?slot=${n}`, file, '--sub', sub, '--workers', '4'], { stdio: 'inherit' });
      fs.rmSync(file.replace(/\.mp4$/, '.cues.json'), { force: true });
    } else {
      browser = browser || await chromium.launch({ args: ['--disable-lcd-text'] });
      const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
      await p.goto(`file://${page}?slot=${n}`);
      await p.waitForFunction(() => window.READY === true);
      const png = file.replace(/\.mp4$/, '.png');
      await p.screenshot({ path: png });
      await p.close();
      ff('-loop', '1', '-framerate', String(T.fps), '-i', png, '-frames:v', String(frames), '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '15', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', String(T.fps), file);
      fs.rmSync(png);
    }
  }
  if (browser) await browser.close();
  if (only) return;

  const list = path.join(dir, 'list.txt');
  fs.writeFileSync(list, files.map(f => `file '${path.basename(f)}'`).join('\n'));
  const joined = path.join(dir, 'joined.mp4');
  ff('-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined);
  const final = path.join(out, 'personal-agents-full.mp4');
  ff('-i', joined, '-i', path.join(__dirname, 'vo/narration.wav'), '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',   // crf 22 keeps it under GitHub's 100 MB
    '-t', String(T.duration), '-movflags', '+faststart', final);
  fs.rmSync(joined);
  console.log(`wrote ${final}: ${T.slots.length} slots, ${T.duration.toFixed(1)} s`);
})();
