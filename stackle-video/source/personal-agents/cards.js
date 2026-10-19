// Renders the "card beside you" overlays as transparent 1920x1080 PNGs.
// The card sits on the right third, so Chris stays visible on the left.
// Usage: node cards.js <out-dir>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CARDS = [
  ['01-your-task', '<div class="tag">Your task</div><div class="t" style="margin-top:26px">An interview for a data engineering job, next week</div>'],
  ['02-rules-file', '<div class="num grad">1</div><div class="t">The rules file</div><div class="s mono cyan">CLAUDE.md · AGENTS.md</div>'],
  ['03-memory-file', '<div class="num grad">2</div><div class="t">The memory file</div><div class="s mono cyan">memory.md</div>'],
  ['04-folders', '<div class="num grad">3</div><div class="t">Folders</div><div class="s">career · learning · money</div>'],
  ['05-free-call', '<div class="tag">Free</div><div class="t" style="margin-top:26px">15-minute career call</div><div class="s">First link in the description</div>'],
  ['06-proactive', '<div class="tag">It acts before you ask</div><div style="margin-top:24px"><div class="row"><b>01</b>A new job that matches you</div><div class="row"><b>02</b>A recruiter waiting 2 days</div><div class="row"><b>03</b>An interview tomorrow</div></div>'],
  ['07-theyre-new', '<div class="num grad">1</div><div class="t">They\'re new</div>'],
  ['08-control', '<div class="num grad">2</div><div class="t">Control</div>'],
  ['09-lock-in', '<div class="num grad">3</div><div class="t">Lock-in</div>'],
  ['10-one-rule', '<div class="tag">One rule for your agent</div><div class="t" style="margin-top:26px">“Ask me before you send, buy, or delete anything.”</div>'],
];

(async () => {
  const out = process.argv[2];
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const tab = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [name, inner] of CARDS) {
    await tab.goto('file://' + path.resolve(__dirname, 'card.html'));
    await tab.evaluate(html => (document.getElementById('card').innerHTML = html), inner);
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: path.join(out, `card-${name}.png`), omitBackground: true });
  }
  await browser.close();
  console.log('wrote', CARDS.length, 'cards to', out);
})();
