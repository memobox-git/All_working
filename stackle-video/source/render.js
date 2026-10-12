// Renders HTML motion graphics frame by frame and pipes them to ffmpeg.
// Usage: node render.js <scene.html|scene.excalidraw> <out.mp4> [seconds|auto] [fps]
// An .excalidraw scene plays through excali/player.html and "auto" uses its own length.
// A .mov output keeps the background transparent (QuickTime Animation), for cards beside Chris.
// A scene with cuts (frames marked customData.cut) renders one numbered clip per part.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [scene, out, secs = 'auto', fpsArg] = process.argv.slice(2);
  const fps = Number(fpsArg || 30);
  const excali = scene.endsWith('.excalidraw');
  const transparent = out.endsWith('.mov');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + (excali ? path.join(__dirname, 'excali/player.html') : path.resolve(scene)));
  await page.evaluate(() => document.fonts.ready);
  if (excali) await page.evaluate(({ s, t }) => window.load(s, { transparent: t }),
    { s: JSON.parse(fs.readFileSync(scene, 'utf8')), t: transparent });
  const length = secs === 'auto' ? await page.evaluate(() => window.duration) : Number(secs);
  const codec = transparent ? ['-c:v', 'qtrle', '-pix_fmt', 'argb']
    : ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart'];
  const cuts = excali ? JSON.parse(fs.readFileSync(scene, 'utf8')).elements
    .filter(e => e.type === 'frame' && e.customData?.cut).map(e => e.customData.at).sort((a, b) => a - b) : [];
  const bounds = [0, ...cuts, length];
  for (let c = 0; c < bounds.length - 1; c++) {
    const file = cuts.length ? out.replace(/(\.\w+)$/, `-${c + 1}$1`) : out;
    const first = Math.round(bounds[c] * fps), last = Math.round(bounds[c + 1] * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
      '-i', '-', ...codec, file], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = first; i < last; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'png', omitBackground: transparent });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('wrote', file, last - first, 'frames');
  }
  await browser.close();
})();
