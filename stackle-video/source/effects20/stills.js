// Grabs stills from the edit without rendering the whole video, to check the look.
// Usage: node stills.js <out-dir> [seconds ...]
// With no seconds it takes one still from the intro, the middle of each effect,
// and each part of the ending, then lays them out on one contact sheet (sheet.jpg).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [dir, ...times] = process.argv.slice(2);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  const ts = times.length ? times.map(Number) : await page.evaluate(() => [
    T[0] * .6, ...SEG.map(s => s.a + (s.b - s.a) * .6),
    ...ENDING.map(p => p.a + Math.min(1.4, (Math.min(p.b, DURATION) - p.a) * .7)),
  ]);
  const files = [];
  for (const [k, t] of ts.entries()) {
    await page.evaluate(t => window.render(t), t);
    const file = path.join(dir, `${String(k).padStart(2, '0')}-${t.toFixed(2)}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 85 });
    files.push(file);
  }
  await browser.close();
  if (!times.length) {
    const inputs = files.flatMap(f => ['-i', f]);
    const cols = 7, rows = Math.ceil(files.length / cols);
    const scaled = files.map((_, i) => `[${i}]scale=270:-1,drawtext=text='${i}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6[s${i}]`).join(';');
    const pads = Array.from({ length: rows * cols - files.length }, (_, i) => `color=black:s=270x480:d=1[p${i}]`).join(';');
    const all = [...files.map((_, i) => `[s${i}]`), ...Array.from({ length: rows * cols - files.length }, (_, i) => `[p${i}]`)].join('');
    const layout = Array.from({ length: rows * cols }, (_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join('|');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex',
      `${scaled}${pads ? ';' + pads : ''};${all}xstack=inputs=${rows * cols}:layout=${layout}`, '-frames:v', '1', path.join(dir, 'sheet.jpg')]);
  }
  console.log(`wrote ${files.length} stills to ${dir}`);
})();
