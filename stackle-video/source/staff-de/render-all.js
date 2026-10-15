// Renders the Senior to Staff Data Engineer graphics into ../../graphics/staff-de/
//   g##-*.html  -> g##-*.mp4 (1920x1080, 30 fps), g##-*.png (final frame), g##-*-stepN.png (one per data-steps time)
//   c#-*.html   -> c#-*.png (transparent card that sits beside Chris)
// Usage: node render-all.js [filter] [--stills]   e.g. node render-all.js g08 --stills (skips the MP4s)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '../../graphics/staff-de');
const FPS = 30;
const args = process.argv.slice(2);
const stillsOnly = args.includes('--stills');
const filter = args.find(a => !a.startsWith('--')) || '';
const scenes = fs.readdirSync(__dirname).filter(f => /^g\d\d-.*\.html$/.test(f))
  .map(f => ({ name: f.replace('.html', ''), url: 'file://' + path.join(__dirname, f) }));
// Graphic 4 is the roadmap image itself, animated.
scenes.push({ name: 'g04-roadmap', url: 'file://' + path.resolve(__dirname, '../roadmap-staff-de.html') + '?wide' });
const cards = fs.readdirSync(__dirname).filter(f => /^c\d-.*\.html$/.test(f));

async function open(browser, url, scale = 1) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  await page.goto(url);
  await page.waitForSelector('body[data-ready]');
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function renderScene(browser, { name, url }) {
  const page = await open(browser, url);
  const { dur, steps } = await page.evaluate(() => ({
    dur: +document.body.dataset.dur,
    steps: (document.body.dataset.steps || '').split(',').filter(Boolean).map(Number),
  }));
  await page.evaluate(t => window.render(t), dur);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  for (const [i, s] of steps.entries()) {
    await page.evaluate(t => window.render(t), s);
    await page.screenshot({ path: `${OUT}/${name}-step${i + 1}.png` });
  }
  if (stillsOnly) { await page.close(); console.log(`${name}: stills only`); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', `${OUT}/${name}.mp4`],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(dur * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
  console.log(`${name}: ${dur}s, ${steps.length} step stills`);
}

async function renderCard(browser, file) {
  const page = await open(browser, 'file://' + path.join(__dirname, file), 2);
  await (await page.$('body')).screenshot({ path: `${OUT}/${file.replace('.html', '.png')}`, omitBackground: true });
  await page.close();
  console.log(file.replace('.html', '.png'));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const jobs = [
    ...scenes.filter(s => s.name.includes(filter)).map(s => () => renderScene(browser, s)),
    ...cards.filter(c => c.includes(filter)).map(c => () => renderCard(browser, c)),
  ];
  const workers = Array.from({ length: 4 }, async () => { while (jobs.length) await jobs.shift()(); });
  await Promise.all(workers);
  await browser.close();
})();
