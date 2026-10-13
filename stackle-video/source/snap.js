// Saves still frames of a scene for checking layouts without rendering video.
// Usage: node snap.js <scene.html> <out-prefix> <t1> [t2 ...]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [scene, prefix, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  // optional re-timing from the environment: TS=0.5 or TMAP='[[0,10,0,5]]'
  if (process.env.TS || process.env.TMAP) await page.addInitScript(t => { window.TS = t.ts; window.TMAP = t.tmap; }, { ts: process.env.TS ? +process.env.TS : undefined, tmap: process.env.TMAP ? JSON.parse(process.env.TMAP) : undefined });
  await page.goto('file://' + path.resolve(scene));
  await page.evaluate(() => document.fonts.ready);
  for (const t of times) {
    await page.evaluate(x => window.render(x), Number(t));
    await page.screenshot({ path: `${prefix}-${t}.png` });
  }
  await browser.close();
})();
