// Saves still frames of a scene for checking layouts without rendering video.
// Usage: node snap.js <scene.html> <out-prefix> <t1> [t2 ...]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [scene, prefix, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(scene));
  await page.evaluate(() => document.fonts.ready);
  for (const t of times) {
    await page.evaluate(x => window.render(x), Number(t));
    await page.screenshot({ path: `${prefix}-${t}.png` });
  }
  await browser.close();
})();
