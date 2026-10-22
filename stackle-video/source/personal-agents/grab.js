// Captures real public pages for the "source" shots, the way Jeff Su shows
// launch posts and news: the page with cookie banners removed, scrolled to
// the quote, saved twice (clean, and with the quote highlighted by the
// browser's own highlighter), plus the box of each highlighted line so the
// animation can zoom in and sweep the highlight across the exact words.
// Usage: node grab.js <out-dir> [name ...]   (writes <name>.png, <name>-hl.png, sources.json)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SPECS = [
  { name: 'google-spark-top', url: 'https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/', domain: 'blog.google', top: true, quote: 'delivering proactive, 24/7 help' },
  { name: 'google-spark-quote', url: 'https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/', domain: 'blog.google', quote: 'Spark keeps working in the background even when you close your laptop or lock your phone.' },
  { name: 'xai-grokbot-top', url: 'https://x.ai/news/introducing-grok-bot', domain: 'x.ai', top: true, quote: 'keep working 24/7.' },
  { name: 'meta-muse-top', url: 'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/', domain: 'about.fb.com', top: true, quote: 'The World’s First Personal AI Agent Built for Everyone' },
  { name: 'meta-muse-quote', url: 'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/', domain: 'about.fb.com', quote: 'Muse keeps working after people close the app' },
  { name: 'meta-muse-today', url: 'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/', domain: 'about.fb.com', quote: 'Muse doesn’t share a person’s conversations or the data in their VM with Meta’s ad systems.' },
  { name: 'meta-muse-later', url: 'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/', domain: 'about.fb.com', quote: 'so not even Meta can access it.' },
  { name: 'openai-dots-top', url: 'https://openai.com/index/introducing-dots/', domain: 'openai.com', top: true, quote: 'always-on agents' },
  { name: 'openclaw-github', url: 'https://github.com/openclaw/openclaw', domain: 'github.com', top: true, quote: 'The AI that really does things.' },
  { name: 'openclaw-heartbeat', url: 'https://docs.openclaw.ai/gateway/heartbeat', domain: 'docs.openclaw.ai', top: true, quote: 'surface anything that needs attention without spamming you' },
  { name: 'claude-memory', url: 'https://code.claude.com/docs/en/memory', domain: 'code.claude.com', quote: 'You write these files in plain text; Claude reads them at the start of every session.' },
  { name: 'agents-md', url: 'https://agents.md/', domain: 'agents.md', top: true, quote: 'used by over 60k open-source projects.' },
  { name: 'meta-muse-memory', url: 'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/', domain: 'about.fb.com', quote: 'Muse remembers what matters to a person' },
  { name: 'chatgpt-tasks', url: 'https://learn.chatgpt.com/docs/automations', domain: 'learn.chatgpt.com', quote: 'Run tasks on a schedule or from supported app events in ChatGPT' },
  { name: 'openai-dots-codex', url: 'https://openai.com/index/introducing-dots/', domain: 'openai.com', quote: 'When you ask your dot to start or manage tasks in Codex or ChatGPT Work' },
  { name: 'gemini-task-rename', url: 'https://9to5google.com/2026/10/12/gemini-spark-task-redesign/', domain: '9to5google.com', top: true, quote: 'Gemini ‘Task’ redesign integrates Spark into the main chat app' },
];

// runs in the page: find `quote` across text nodes, scroll to it, return line boxes
function locate({ quote, top }) {
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && el.offsetHeight < 520 &&
        /cookie|consent|we use|join|pull up a chair|ask molty|sign up for/i.test(el.innerText || '')) el.remove();
  }
  // lazy-loading spinners would sit in the middle of the shot
  for (const el of document.querySelectorAll('[role=progressbar], [class*=spinner], [class*=loader], [class*=loading]')) el.style.visibility = 'hidden';
  const fold = c => (/[‐-―−]/.test(c) ? '-' : /[‘’]/.test(c) ? "'" : /\s/.test(c) ? ' ' : c);
  const chars = []; let s = '';
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.parentElement && n.parentElement.getClientRects().length && !/SCRIPT|STYLE|NOSCRIPT/.test(n.parentElement.tagName) ? 1 : 2) });
  for (let n; (n = w.nextNode());) {
    for (let i = 0; i < n.data.length; i++) {
      const c = fold(n.data[i]);
      if (c === ' ' && s.endsWith(' ')) continue;
      s += c; chars.push([n, i]);
    }
  }
  const want = [...quote].map(fold).join('').replace(/ +/g, ' ');
  const at = s.indexOf(want);
  if (at < 0) return { found: false };
  const r = document.createRange();
  r.setStart(chars[at][0], chars[at][1]);
  const [en, ei] = chars[at + want.length - 1];
  r.setEnd(en, ei + 1);
  if (top) window.scrollTo(0, 0);
  else { (r.startContainer.parentElement).scrollIntoView({ block: 'center' }); }
  window.__range = r;
  return { found: true };
}
function boxes() {
  const lines = [];
  for (const q of window.__range.getClientRects()) {
    if (q.width < 2) continue;
    const l = lines.find(b => Math.abs(b[1] - q.y) < 6);
    if (l) { const x2 = Math.max(l[0] + l[2], q.x + q.width); l[0] = Math.min(l[0], q.x); l[2] = x2 - l[0]; l[3] = Math.max(l[3], q.height); }
    else lines.push([q.x, q.y, q.width, q.height]);
  }
  return lines.map(b => b.map(v => Math.round(v)));
}

(async () => {
  const out = process.argv[2];
  const only = process.argv.slice(3);
  fs.mkdirSync(out, { recursive: true });
  const metaFile = path.join(out, 'sources.json');
  const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile)) : {};
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
  for (const s of SPECS) {
    if (only.length && !only.includes(s.name)) continue;
    const p = await ctx.newPage();
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(2500);
    const res = await p.evaluate(locate, s);
    await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready);   // the clean and marked captures must share one layout
    await p.waitForTimeout(1500);
    await p.screenshot({ path: path.join(out, s.name + '.png') });
    let lines = [];
    if (res.found) {
      lines = await p.evaluate(boxes);
      await p.addStyleTag({ content: '::highlight(q){background-color:#FFE45C;color:#111}' });
      await p.evaluate(() => CSS.highlights.set('q', new Highlight(window.__range)));
      await p.waitForTimeout(200);
      await p.screenshot({ path: path.join(out, s.name + '-hl.png') });
    }
    meta[s.name] = { url: s.url, domain: s.domain, quote: s.quote, captured: new Date().toISOString().slice(0, 10), lines };
    console.log(s.name, res.found ? 'found' : 'QUOTE NOT FOUND', JSON.stringify(lines));
    await p.close();
  }
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
  fs.writeFileSync(path.join(out, 'sources.js'), 'window.SOURCES = ' + JSON.stringify(meta, null, 1) + ';\n'); // for file:// pages
  await b.close();
})();
