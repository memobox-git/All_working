// Renders single frames to check the look without a full render.
// usage: node stills.js <out-dir> t1 t2 ...   (prints any word cues the scene could not find)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [dir, ...times] = process.argv.slice(2);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ args: ['--disable-lcd-text'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.error('page error:', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'index.html'));
  await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const missing = await p.evaluate(() => window.MISSING);
  if (missing.length) console.log('missing cues:', missing);
  for (const t of times) {
    await p.evaluate(t => window.render(t), Number(t));
    await p.screenshot({ path: path.join(dir, `t${String(Number(t).toFixed(1)).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 80 });
  }
  await b.close();
})();
