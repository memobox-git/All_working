// RAG Short: the timeline. Every cut, caption, prop and card is placed on a
// spoken word from the voice transcript (words.js, written by build.sh).
// The page follows render-pro.js's contract: window.render(t), DURATION,
// READY, and SFX (the pops and whooshes mix.py lays under the voice).

const OFF = .1;                                       // the voice starts this far in
const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const W = WORDS.map(w => ({ ...w, s: w.s + OFF, e: w.e + OFF }));
function wi(word, n = 0) {
  for (let i = 0, k = 0; i < W.length; i++) if (norm(W[i].w) === norm(word) && k++ === n) return i;
  throw Error('no cue: ' + word + ' #' + n);
}
const at = (word, n = 0) => W[wi(word, n)].s;
const END = W[W.length - 1].e + 1.4;
window.DURATION = END;
window.SFX = [];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

// ---------------------------------------------------------------- the cuts
// One shot per script line. The hook pushes in slowly, then the framing
// alternates between a punch-in and a wide shot, each with a slow drift.
const LINES = [];
for (let i = 0, k = 0; i < LINE_WORDS.length; k += LINE_WORDS[i++]) LINES.push({ w0: k, s: i ? W[k].s - .05 : 0 });
LINES.forEach((L, i) => { L.e = i + 1 < LINES.length ? LINES[i + 1].s : END; });
const FRAMING = LINES.map((L, i) => i === 0 ? { z0: 1.02, z1: 1.1, x: 0, y: 0 }
  : i % 2 ? { z0: 1.17, z1: 1.2, x: -16, y: 10 } : { z0: 1.03, z1: 1.055, x: 14, y: 0 });
const cam = $('#cam');
function drawCam(t) {
  const i = Math.max(0, LINES.findIndex(L => t < L.e)), L = LINES[i === -1 ? LINES.length - 1 : i], F = FRAMING[LINES.indexOf(L)];
  const k = clamp((t - L.s) / (L.e - L.s)), u = LINES.indexOf(L) === 0 ? gsap.parseEase('sine.inOut')(k) : k;
  const z = F.z0 + (F.z1 - F.z0) * u;
  // a slight handheld drift
  const x = F.x + 5 * Math.sin(t * .8) + 2.5 * Math.sin(t * 2.1 + .4), y = F.y + 4 * Math.sin(t * .9 + 1) + 2 * Math.sin(t * 1.7);
  const r = .22 * Math.sin(t * .55);
  cam.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${z.toFixed(4)})`;
}

// ---------------------------------------------------------------- captions
// 2 to 4 words at a time, a new group after punctuation
const GROUPS = [];
LINES.forEach((L, li) => {
  const last = li + 1 < LINES.length ? LINES[li + 1].w0 : W.length;
  let g = null;
  for (let j = L.w0; j < last; j++) {
    const w = W[j], chars = g ? g.words.join(' ').length + 1 + w.w.length : 0;
    if (!g || g.words.length >= 4 || chars > 22) GROUPS.push(g = { words: [], s: w.s - .05 });
    g.words.push(w.w); g.e = w.e;
    if (/[.,?!]$/.test(w.w) && j + 1 < last) g = null;
  }
});
GROUPS.forEach((g, i) => {
  g.end = i + 1 < GROUPS.length ? Math.min(GROUPS[i + 1].s, g.e + .5) : g.e + .8;
  g.el = document.createElement('div'); g.el.className = 'cp';
  g.el.innerHTML = `<span>${g.words.join(' ')}</span>`;
  $('#caps').appendChild(g.el); g.on = false;
});
function drawCaps(t) {
  for (const g of GROUPS) {
    const on = t >= g.s && t < g.end;
    if (on !== g.on) { g.el.style.visibility = on ? 'visible' : 'hidden'; g.on = on; }
    if (on) { const k = 1 - Math.pow(1 - clamp((t - g.s) / .14), 3); g.el.style.transform = `scale(${(.92 + .08 * k).toFixed(4)})`; g.el.style.opacity = k.toFixed(3); }
  }
}

// ---------------------------------------------------------------- props and cards
function propIn(sel, t) {
  tl.fromTo(sel, { autoAlpha: 0, scale: .5, y: 50, rotation: -8 }, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: .6, ease: 'back.out(1.9)', immediateRender: false }, t);
  SFX.push({ t, k: 'pop' });
}
const propOut = (sel, t) => tl.to(sel, { autoAlpha: 0, scale: .75, y: 30, duration: .28, ease: 'power2.in' }, t);
function cardIn(sel, t) {
  tl.fromTo(sel, { autoAlpha: 0, y: 70, scale: .95 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, immediateRender: false }, t);
  SFX.push({ t, k: 'whoosh' });
}
const cardOut = (sel, t) => tl.to(sel, { autoAlpha: 0, y: -24, duration: .28, ease: 'power2.in' }, t);

// "It just never read your documents."
propIn('#p-files', at('documents') - .15);
propOut('#p-files', at('ask') - .1);
// "Ask it your refund policy, and it'll confidently make one up."
cardIn('#c-chat', at('ask') - .05);
tl.fromTo('#stamp', { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power4.in', immediateRender: false }, at('up') - .12);
SFX.push({ t: at('up') + .14, k: 'pop' });
cardOut('#c-chat', at('and', 1) - .05);
// "It's a trick called RAG."
propIn('#p-robot', at('rag') - .1);
propOut('#p-robot', at('think') - .05);
// "Think of it like an open-book exam."
propIn('#p-book', at('openbook') - .1);
propOut('#p-book', at('before') - .05);
// "Before the model answers, it searches your documents, grabs the three paragraphs …"
cardIn('#c-docs', at('searches') - .15);
const HITS = [['#r2', at('three') - .05], ['#r3', at('paragraphs') + .15], ['#r5', at('match') - .05]];
HITS.forEach(([, t]) => SFX.push({ t, k: 'tick' }));
cardOut('#c-docs', at('behind') - .1);
// "… every paragraph is turned into numbers that capture its meaning, and stored in a vector database."
cardIn('#c-vec', at('paragraph') - .15);
tl.to('#c-vec .nums', { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'none' }, at('numbers') - .1);
cardOut('#c-vec', at('stored') - .15);
propIn('#p-db', at('vector') - .1);
propOut('#p-db', at('so') - .05);
// "So it finds the right paragraph even when you use different words."
cardIn('#c-match', at('finds') - .15);
tl.to('#c-match .q.hl', { backgroundSize: '100% 100%', duration: .5 }, at('different') - .1);
cardOut('#c-match', at("that's") - .05);
// "That's why the answer comes back with a source you can click."
cardIn('#c-ans', at('answer') - .2);
tl.fromTo('#tap', { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: .25, immediateRender: false }, at('click') - .3);
tl.to('#src', { scale: .94, duration: .1, yoyo: true, repeat: 1 }, at('click') - .05);
tl.to('#tap', { autoAlpha: 0, duration: .3 }, at('click') + .3);
SFX.push({ t: at('click') - .05, k: 'tick' });
cardOut('#c-ans', at('and', 4) - .05);
// "And when the policy changes, you just update the document. No retraining."
cardIn('#c-upd', at('policy', 1) - .15);
SFX.push({ t: at('update'), k: 'tick' });
tl.fromTo('#nore', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, at('retraining') - .1);
cardOut('#c-upd', at('if') - .05);
// "Follow, and next I'll explain AI agents."
propIn('#p-wave', at('follow') - .1);
tl.fromTo('#next', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, at('agents') - .35);

const upd = $('#c-upd'), tUpd = at('update') - .05;
const rows = HITS.map(([sel, t]) => ({ el: $(sel), t }));
const props = $$('.prop');
function drawExtras(t) {
  rows.forEach(r => r.el.classList.toggle('on', t >= r.t));
  upd.classList.toggle('done', t >= tUpd);
  // the props float gently while they are up
  props.forEach((p, i) => { p.style.translate = `0 ${(7 * Math.sin(t * 2.2 + i)).toFixed(2)}px`; });
}

window.render = t => { tl.seek(t, false); drawCam(t); drawCaps(t); drawExtras(t); };
Promise.all([document.fonts.ready, ...$$('img').map(i => i.decode())]).then(() => { window.render(0); window.READY = true; });
