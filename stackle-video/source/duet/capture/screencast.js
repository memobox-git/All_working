// Records claude.com's Claude Duet page in real time: scrolls to the phone demo, then holds
// while the demo plays. The page is zoomed (--dsf) so the capture is sharper than 1080p.
// usage: node screencast.js <frames-dir> <out.mp4> --dsf 1.5 --start 950 --to 1390 --scroll 4 --hold 100
//   demo:  --dsf 1.5 --start 950 --to 1390 --scroll 4 --hold 100   -> duet-demo-2880.mp4
//   hero:  --dsf 1.5 --start 0 --to 900 --scroll 7 --hold 4         -> duet-hero-2880.mp4
const { chromium } = require('playwright');
const fs = require('fs');
const { spawnSync } = require('child_process');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? Number(argv[i + 1]) : d; };
(async () => {
  const [dir, mp4] = argv; fs.mkdirSync(dir, { recursive: true });
  const dsf = opt('dsf', 2), y0 = opt('start', 700) * dsf, y1 = opt('to', 1400) * dsf, scrollS = opt('scroll', 3), hold = opt('hold', 75);
  const b = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const p = await b.newPage({ viewport: { width: Math.round(1920 * dsf), height: Math.round(1080 * dsf) }, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  await p.goto('https://claude.com/product/claude-duet', { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await p.addStyleTag({ content: 'header, nav, [class*="readcrumb" i], [class*="toast" i], [class*="opover" i], [class*="cookie" i], [id*="onetrust" i], [class*="Banner" i] { visibility: hidden !important; } html { scroll-behavior: auto !important; zoom: ' + dsf + '; }' });
  await p.evaluate(y => scrollTo(0, y), y0);
  await p.waitForTimeout(1500);
  const cdp = await p.context().newCDPSession(p);
  const frames = [];
  cdp.on('Page.screencastFrame', async f => {
    const i = frames.length; frames.push(f.metadata.timestamp);
    fs.writeFileSync(`${dir}/f${String(i).padStart(5, '0')}.jpg`, Buffer.from(f.data, 'base64'));
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1, maxWidth: Math.round(1920 * dsf), maxHeight: Math.round(1080 * dsf) });
  const t0 = Date.now();
  await p.evaluate(([a, b, ms]) => new Promise(res => { const s = performance.now(); const tick = () => { const k = Math.min(1, (performance.now() - s) / ms); const e = 0.5 - 0.5 * Math.cos(Math.PI * k); scrollTo(0, a + (b - a) * e); k < 1 ? requestAnimationFrame(tick) : res(); }; requestAnimationFrame(tick); }), [y0, y1, scrollS * 1000]);
  await p.waitForTimeout(hold * 1000);
  await cdp.send('Page.stopScreencast');
  await p.waitForTimeout(500);
  fs.writeFileSync(`${dir}/times.json`, JSON.stringify(frames));
  console.log('frames', frames.length, 'secs', ((Date.now() - t0) / 1000).toFixed(1), 'fps', (frames.length / ((frames[frames.length - 1] - frames[0]) || 1)).toFixed(1));
  await b.close();
  // the screencast's frames arrive unevenly: hold each one for its real duration, then resample to 30 fps
  const list = frames.map((t, i) => `file 'f${String(i).padStart(5, '0')}.jpg'\nduration ${((frames[i + 1] ?? t + 0.05) - t).toFixed(4)}`).join('\n')
    + `\nfile 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(`${dir}/list.txt`, list);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`, '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '16', require('path').resolve(mp4)], { cwd: dir, stdio: 'inherit' });
})();
