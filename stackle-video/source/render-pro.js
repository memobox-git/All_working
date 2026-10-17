// Renders an HTML motion graphic to MP4 with real motion blur, split across
// parallel browser pages. Each output frame averages several sub-frames
// spread over half a frame interval (a 180-degree shutter).
// Work is cut into chunks kept in <out>.parts/, so a stopped render resumes
// where it left off when run again.
// The page must set window.READY, window.DURATION and window.render(t).
// Usage: node render-pro.js <scene.html> <out.mp4> [--fps 30] [--sub 4] [--workers 4] [--chunk 45] [--from 0] [--to DURATION]
// Also writes <out>.cues.json (duration, voice offset, sound cues) for mix.js.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? Number(argv[i + 1]) : d; };
const [scene, out] = argv;
const fps = opt('fps', 30), sub = opt('sub', 4), workers = opt('workers', 4), chunk = opt('chunk', 45), shutter = 0.5;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await page.goto('file://' + path.resolve(scene));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  const cdp = await page.context().newCDPSession(page);
  // the DevTools capture is several times faster than page.screenshot for full-HD frames
  const shot = async () => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95 })).data, 'base64');
  return { page, shot };
}

function encoder(file) {
  const vf = sub > 1 ? ['-vf', `tmix=frames=${sub},select='not(mod(n+1\\,${sub}))',setpts=N/(${fps}*TB)`] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps * sub), '-i', '-',
    ...vf, '-r', String(fps), '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-f', 'mp4', file],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error('ffmpeg exit ' + c)) : res())));
  return { ff, done };
}

(async () => {
  const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
  const probe = await openPage(browser);
  const meta = await probe.page.evaluate(() => ({ duration: window.DURATION, offset: window.VO && window.VO.offset, sfx: window.SFX || [] }));
  await probe.page.close();
  fs.writeFileSync(out.replace(/\.mp4$/, '') + '.cues.json', JSON.stringify(meta, null, 1));

  const from = opt('from', 0), to = opt('to', meta.duration);
  const total = Math.round((to - from) * fps);
  const parts = out.replace(/\.mp4$/, '') + '.parts';
  fs.mkdirSync(parts, { recursive: true });
  const chunks = [];
  for (let a = 0, k = 0; a < total; a += chunk, k++) chunks.push({ k, a, b: Math.min(total, a + chunk), file: path.join(parts, `c${String(k).padStart(4, '0')}.mp4`) });
  const todo = chunks.filter(c => !fs.existsSync(c.file));
  console.log(`${total} frames in ${chunks.length} chunks, ${chunks.length - todo.length} already done`);
  const started = Date.now();
  let doneFrames = 0;
  const left = todo.reduce((n, c) => n + c.b - c.a, 0);

  await Promise.all(Array.from({ length: workers }, async () => {
    const { page, shot } = await openPage(browser);
    for (let c; (c = todo.shift());) {
      const tmp = c.file + '.tmp';
      const { ff, done } = encoder(tmp);
      for (let n = c.a; n < c.b; n++) {
        for (let k = 0; k < sub; k++) {
          const t = Math.max(0, from + n / fps + (sub > 1 ? (k / (sub - 1) - 0.5) * shutter / fps : 0));
          await page.evaluate(t => window.render(t), t);
          const buf = await shot();
          if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        }
        doneFrames++;
      }
      ff.stdin.end();
      await done;
      fs.renameSync(tmp, c.file);
      const s = (Date.now() - started) / 1000;
      console.log(`chunk ${c.k + 1}/${chunks.length} done, ${doneFrames}/${left} frames, ${s.toFixed(0)}s elapsed, ~${(s / doneFrames * (left - doneFrames)).toFixed(0)}s left`);
    }
    await page.close();
  }));
  await browser.close();

  const list = path.join(parts, 'list.txt');
  fs.writeFileSync(list, chunks.map(c => `file '${path.basename(c.file)}'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' })
    .on('close', c => (c ? rej(new Error('concat failed')) : res())));
  fs.rmSync(parts, { recursive: true, force: true });
  console.log(`wrote ${out}: ${total} frames at ${fps}fps (${sub} sub-frames each) in ${((Date.now() - started) / 1000).toFixed(0)}s`);
})();
