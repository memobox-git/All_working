const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.resolve(process.argv[2]) + '#static');
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.render(1));
  await p.screenshot({ path: process.argv[3] });
  await b.close();
})();
