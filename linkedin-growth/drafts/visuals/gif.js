const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const [scene, outdir, nframes] = [process.argv[2], process.argv[3], Number(process.argv[4] || 48)];
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.resolve(scene));
  await p.evaluate(() => document.fonts.ready);
  for (let i = 0; i <= nframes; i++) {
    await p.evaluate(t => window.render(t), i / nframes);
    await p.screenshot({ path: path.join(outdir, `f${String(i).padStart(3, '0')}.png`) });
  }
  await b.close();
})();
