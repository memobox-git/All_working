// Renders transparent 1080x1920 PNG overlays for a list-style Short:
// a fixed top title, and one point label ("pill") per point.
// Usage: node short-overlays.js <spec.json> <out-dir>
// spec.json: { "titleSmall": "3 reasons NOT to become a", "titleBig": "Data Engineer",
//              "pills": [["#1", "Fixing what broke"], ["#2", "Quiet work"]] }
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const font = w => 'file://' + path.resolve(__dirname,
  `node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${w}-normal.woff2`);

const page = body => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:PJS;font-weight:600;src:url(${font(600)})}
@font-face{font-family:PJS;font-weight:800;src:url(${font(800)})}
*{margin:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent;font-family:PJS,sans-serif}
.title{position:absolute;top:190px;left:0;right:0;text-align:center;
  text-shadow:0 4px 18px rgba(0,0,0,.75),0 0 3px rgba(0,0,0,.9)}
.small{color:#FAF8F1;font-weight:600;font-size:54px;line-height:1.15}
.big{color:#F59E0B;font-weight:800;font-size:104px;line-height:1.05}
.pill{position:absolute;top:1360px;left:50%;transform:translateX(-50%);white-space:nowrap;
  background:rgba(30,28,29,.88);border:3px solid #F59E0B;border-radius:60px;
  padding:16px 40px;font-size:46px;font-weight:600;color:#FAF8F1}
.pill b{color:#F59E0B;font-weight:800;margin-right:16px}
</style></head><body>${body}</body></html>`;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

(async () => {
  const [specFile, outDir] = process.argv.slice(2);
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const shots = [['title.png', `<div class="title"><div class="small">${esc(spec.titleSmall)}</div>` +
    `<div class="big">${esc(spec.titleBig)}</div></div>`]];
  spec.pills.forEach(([n, t], i) =>
    shots.push([`pill-${i + 1}.png`, `<div class="pill"><b>${esc(n)}</b>${esc(t)}</div>`]));
  for (const [name, body] of shots) {
    await tab.setContent(page(body));
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: path.join(outDir, name), omitBackground: true });
  }
  await browser.close();
  console.log('wrote', shots.length, 'overlays to', outDir);
})();
