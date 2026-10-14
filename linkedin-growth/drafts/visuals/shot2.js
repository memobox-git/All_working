// usage: node shot2.js page.html out.png width height
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, out, w, h] = [process.argv[2], process.argv[3], Number(process.argv[4]), Number(process.argv[5])];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + path.resolve(src));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out });
  await b.close();
})();
