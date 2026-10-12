// Builds scene scripts into .excalidraw files, sizing text with the real font.
// Usage: node excali/build.js excali/scenes/portfolio.js [more scenes...]
//   -> excali/scenes/portfolio.excalidraw (open it at excalidraw.com, or render it)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'player.html'));
  for (const arg of process.argv.slice(2)) {
    const src = path.resolve(arg);
    const { elements } = require(src);
    const measured = await page.evaluate(els => window.measure(els), elements);
    const out = src.replace(/\.js$/, '.excalidraw');
    fs.writeFileSync(out, JSON.stringify({
      type: 'excalidraw', version: 2, source: 'https://stackle.io',
      elements: measured, appState: { viewBackgroundColor: '#FAF8F1', gridSize: null }, files: {},
    }, null, 1));
    console.log('wrote', out, measured.length, 'elements');
  }
  await browser.close();
})();
