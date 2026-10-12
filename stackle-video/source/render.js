// Renders HTML motion graphics frame by frame and pipes them to ffmpeg.
// Usage: node render.js <scene.html|scene.excalidraw> <out.mp4> [seconds|auto] [fps]
// An .excalidraw scene plays through excali/player.html and "auto" uses its own length.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [scene, out, secs = 'auto', fpsArg] = process.argv.slice(2);
  const fps = Number(fpsArg || 30);
  const excali = scene.endsWith('.excalidraw');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + (excali ? path.join(__dirname, 'excali/player.html') : path.resolve(scene)));
  await page.evaluate(() => document.fonts.ready);
  if (excali) await page.evaluate(s => window.load(s), JSON.parse(fs.readFileSync(scene, 'utf8')));
  const length = secs === 'auto' ? await page.evaluate(() => window.duration) : Number(secs);
  const frames = Math.round(length * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', out, frames, 'frames');
})();
