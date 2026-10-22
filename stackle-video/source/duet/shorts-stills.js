// Single frames of a Short, to check the look: node shorts-stills.js <id> <out-dir> t1 t2 ...
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [id, dir, ...times] = process.argv.slice(2);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ args: ['--disable-lcd-text'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('page error:', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'shorts.html') + '?s=' + id);
  await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const missing = await p.evaluate(() => window.MISSING);
  if (missing.length) console.log(id, 'missing cues:', missing);
  for (const t of times) {
    await p.evaluate(t => window.render(t), Number(t));
    await p.screenshot({ path: path.join(dir, `${id}-${String(Number(t).toFixed(1)).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 80 });
  }
  await b.close();
})();
