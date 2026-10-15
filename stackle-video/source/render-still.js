// Renders an HTML page to a PNG at 2x.
// Usage: node render-still.js <page.html[?query]> <out.png> <width> <height>
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [scene, out, w, h] = process.argv.slice(2);
  const [file, query = ''] = scene.split('?');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(file) + (query ? '?' + query : ''));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('body[data-ready]');
  await page.screenshot({ path: out, type: 'png' });
  await browser.close();
  console.log('wrote', out);
})();
