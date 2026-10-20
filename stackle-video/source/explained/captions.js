// Word-by-word captions for the vertical cuts, from the voiceover timings:
// short pages of a few words (up to four, 24 characters, a new page at
// punctuation or a pause), the word being spoken on a blue pill, the words
// still to come in grey. The page goes in #caps; call drawCaptions(t) from
// render(t). Load after common.js.
const RAW = VO.words.filter(w => !w.w.startsWith('['));
const CAPW = [];
RAW.forEach((w, i) => {
  if (!/[a-z0-9]/i.test(w.w)) return;                       // the em dashes
  const next = RAW[i + 1];
  CAPW.push({
    text: w.w.replace(/["“”]/g, '').replace(/[.,:;]+$/, ''),
    brk: /[.,:;?!]["”]?$/.test(w.w) || (next && next.w === '—'),
    s: w.s + OFF, e: w.e + OFF,
  });
});
const PAGES = [];
for (let i = 0, page = null; i < CAPW.length; i++) {
  const w = CAPW[i], prev = page && page.words[page.words.length - 1];
  const chars = page ? page.words.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length : 0;
  if (!page || page.words.length >= 4 || chars > 24 || w.s - prev.e > .45) PAGES.push(page = { words: [] });
  page.words.push(w);
  if (w.brk) page = null;
}
PAGES.forEach((p, i) => {
  const last = p.words[p.words.length - 1], next = PAGES[i + 1];
  p.s = p.words[0].s - .08;
  p.e = next ? Math.min(next.words[0].s - .08, last.e + .7) : last.e + 1.2;
  p.el = document.createElement('div');
  p.el.className = 'cp';
  p.el.innerHTML = p.words.map(w => `<span class="cw">${w.text}</span>`).join(' ');
  $('#caps').appendChild(p.el);
  p.spans = [...p.el.children];
  p.on = false;
});
function drawCaptions(t) {
  for (const p of PAGES) {
    const on = t >= p.s && t < p.e;
    if (on !== p.on) { p.el.style.visibility = on ? 'visible' : 'hidden'; p.on = on; }
    if (!on) continue;
    const k = 1 - Math.pow(1 - clamp((t - p.s) / .16), 3);
    p.el.style.opacity = k.toFixed(3);
    p.el.style.transform = `translateY(-50%) scale(${(.9 + .1 * k).toFixed(4)})`;
    p.words.forEach((w, j) => {
      const until = j + 1 < p.words.length ? p.words[j + 1].s : p.e;
      const c = t >= until ? 'cw past' : t >= w.s - .02 ? 'cw now' : 'cw';
      if (p.spans[j].className !== c) p.spans[j].className = c;
    });
  }
}
