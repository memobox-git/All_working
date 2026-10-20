// Saves the first frame of a cut (its opening card) as the thumbnail image.
// Usage: node make-thumb.js <page.html> <WxH> <out.jpg>
const { chromium } = require('playwright');
const path = require('path');

const [page, size, out] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
(async () => {
  const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
  const tab = await browser.newPage({ viewport: { width, height } });
  tab.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await tab.goto('file://' + path.resolve(page));
  await tab.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  await tab.evaluate(() => window.render(0));
  await tab.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await browser.close();
  console.log('wrote', out);
})();
