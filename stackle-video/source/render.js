// Renders HTML motion graphics frame by frame and pipes them to ffmpeg.
// Usage: node render.js <scene.html> <out.mp4> <seconds> [fps]
// Frames whose animation state has not changed reuse the previous screenshot, so holds render fast.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

async function renderScene(scene, out, secs, fps = 30, timing = {}) {
  const frames = Math.round(Number(secs) * fps);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  if (timing.ts || timing.tmap) await page.addInitScript(t => { window.TS = t.ts; window.TMAP = t.tmap; }, timing);
  await page.goto('file://' + path.resolve(scene));
  await page.evaluate(() => document.fonts.ready);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  let prevSig = null, buf = null, shots = 0;
  for (let i = 0; i < frames; i++) {
    const sig = await page.evaluate(t => {
      window.render(t);
      let s = '';
      document.querySelectorAll('[style]').forEach(e => { s += e.getAttribute('style'); });
      document.querySelectorAll('[data-count],[data-type]').forEach(e => { s += e.textContent; });
      return s;
    }, i / fps);
    if (sig !== prevSig) { buf = await page.screenshot({ type: 'png' }); prevSig = sig; shots++; }
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', out, frames, 'frames,', shots, 'drawn');
}

module.exports = { renderScene };
if (require.main === module) {
  const [scene, out, secs, fpsArg] = process.argv.slice(2);
  renderScene(scene, out, secs, Number(fpsArg || 30));
}
