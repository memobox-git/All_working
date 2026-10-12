// Saves one sheet with every camera shot of every scene, each as it looks just
// before the camera moves on, for a quick review.
// Usage: node excali/storyboard.js <sheet.png> <scene.excalidraw...>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const [out, ...scenes] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, 'player.html'));
  const tiles = [];
  for (const file of scenes) {
    const scene = JSON.parse(fs.readFileSync(file, 'utf8'));
    const duration = await page.evaluate(s => window.load(s).then(() => window.duration), scene);
    const shots = scene.elements.filter(e => e.type === 'frame' && e.name !== 'End')
      .sort((a, b) => a.customData.at - b.customData.at);
    const marks = shots.length ? shots.map((f, i) => [f.name, (shots[i + 1]?.customData.at ?? duration) - 0.05])
      : [[null, duration]];
    for (const [name, t] of marks) {
      await page.evaluate(t => window.render(t), t);
      const shot = await page.screenshot({ type: 'jpeg', quality: 80 });
      const label = path.basename(file, '.excalidraw') + (name ? ' · ' + name : '');
      tiles.push({ name: label, src: 'data:image/jpeg;base64,' + shot.toString('base64') });
    }
  }
  const sheet = await browser.newPage({ viewport: { width: 1920, height: 400 } });
  await sheet.setContent(`<style>body{margin:0;padding:24px;background:#1E1C1D;font:22px sans-serif;color:#FAF8F1;
    display:grid;grid-template-columns:repeat(3,1fr);gap:24px}img{width:100%;display:block;border-radius:6px}
    p{margin:8px 0 0}</style>` + tiles.map(t => `<div><img src="${t.src}"><p>${t.name}</p></div>`).join(''));
  await sheet.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log('wrote', out, tiles.length, 'shots');
})();
