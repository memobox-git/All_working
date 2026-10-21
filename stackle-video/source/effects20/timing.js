// Writes work/timing.json for music.py: where the intro, each effect and each part
// of the ending start, and the sound cues, read from the edit without rendering it.
// Usage: node timing.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  const timing = await page.evaluate(() => ({
    duration: DURATION, intro: T[0], effects: SEG.map(s => [s.a, s.b]),
    ending: ENDING.map(({ part, a, b }) => ({ part, a, b: Math.min(b, DURATION) })), sfx: window.SFX,
  }));
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'work/timing.json'), JSON.stringify(timing, null, 1));
  console.log(`wrote work/timing.json: ${timing.effects.length} effects, ${timing.sfx.length} sound cues`);
})();
