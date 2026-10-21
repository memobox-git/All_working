// RAG Short: the timeline. One full-screen scene per script line, with a cut
// between lines, and every picture placed on a spoken word from the voice
// transcript (words.js, written by build.sh). The page follows render-pro.js's
// contract: window.render(t), DURATION, READY, and SFX (the pops and whooshes
// mix.py lays under the voice).

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
// One scene per script line. The hook pushes in slowly, then the framing
// alternates between a punch-in and a wide shot, each with a slow drift.
const LINES = [];
for (let i = 0, k = 0; i < LINE_WORDS.length; k += LINE_WORDS[i++]) LINES.push({ w0: k, s: i ? W[k].s - .05 : 0 });
LINES.forEach((L, i) => {
  L.e = i + 1 < LINES.length ? LINES[i + 1].s : END;
  L.f = i === 0 ? { z0: 1, z1: 1.05, x: 0 } : i % 2 ? { z0: 1.07, z1: 1.09, x: -10 } : { z0: 1, z1: 1.02, x: 8 };
  if (i) tl.set('#s' + (i + 1), { visibility: 'visible' }, L.s);   // scene 1 is on from the first frame (style.css)
  if (i + 1 < LINE_WORDS.length) tl.set('#s' + (i + 1), { visibility: 'hidden' }, L.e);
});
const stage = $('#stage');
function drawCam(t) {
  const L = LINES.find(L => t < L.e) || LINES[LINES.length - 1];
  const k = clamp((t - L.s) / (L.e - L.s)), z = L.f.z0 + (L.f.z1 - L.f.z0) * (L === LINES[0] ? gsap.parseEase('sine.inOut')(k) : k);
  const x = L.f.x + 4 * Math.sin(t * .8) + 2 * Math.sin(t * 2.1 + .4), y = 3 * Math.sin(t * .9 + 1) + 1.5 * Math.sin(t * 1.7);
  stage.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(.15 * Math.sin(t * .55)).toFixed(3)}deg) scale(${z.toFixed(4)})`;
}

// ---------------------------------------------------------------- background
// warm and soft: a cream gradient, slow colour fields and a faint dot grid
const bg = $('#bg').getContext('2d');
function blob(x, y, r, c) {
  const g = bg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(251,246,239,0)');
  bg.fillStyle = g; bg.fillRect(x - r, y - r, r * 2, r * 2);
}
function drawBg(t) {
  const g = bg.createLinearGradient(0, 0, 0, 1920);
  g.addColorStop(0, '#FFF8F0'); g.addColorStop(1, '#F1EEF9');
  bg.fillStyle = g; bg.fillRect(0, 0, 1080, 1920);
  blob(820 + 120 * Math.sin(t * .13), 380 + 80 * Math.cos(t * .11), 620, 'rgba(255,196,140,0.22)');
  blob(220 + 100 * Math.cos(t * .1), 1150 + 90 * Math.sin(t * .12), 640, 'rgba(160,170,255,0.18)');
  blob(700, 1650 + 60 * Math.sin(t * .15), 520, 'rgba(120,220,190,0.12)');
  bg.fillStyle = 'rgba(120,100,80,0.07)';
  const oy = 44 - (t * 6) % 44;
  for (let y = oy - 44; y < 1920; y += 44) for (let x = 22; x < 1080; x += 44) bg.fillRect(x - 1.5, y - 1.5, 3, 3);
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

// ---------------------------------------------------------------- helpers
const IN = { autoAlpha: 1, y: 0, scale: 1, rotation: 0 };
function pop(sel, t, sfx = 'pop') {
  tl.fromTo(sel, { autoAlpha: 0, scale: .5, y: 40, rotation: -6 }, { ...IN, duration: .55, ease: 'back.out(1.9)', immediateRender: false }, t);
  if (sfx) SFX.push({ t, k: sfx });
}
function rise(sel, t, { st = 0, y = 50, sfx = 'whoosh' } = {}) {
  tl.fromTo(sel, { autoAlpha: 0, y, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, stagger: st, immediateRender: false }, t);
  if (sfx) SFX.push({ t, k: sfx });
}
const fade = (sel, t, d = .3) => tl.to(sel, { autoAlpha: 0, y: -20, duration: d, ease: 'power2.in' }, t);
const tick = t => SFX.push({ t, k: 'tick' });
const L = i => LINES[i];

// 1 · "Your company's AI chatbot isn't dumb."
tl.fromTo('#chat1', { scale: .96 }, { scale: 1, duration: .8, ease: 'power2.out' }, 0);   // solid on the first frame (the cover)
pop('#smart', at('dumb') - .25);

// 2 · "It just never read your documents."
pop('#bot2', L(1).s, null);
tl.fromTo('#wire2', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, immediateRender: false }, at('never') - .1);
pop('#p-files', at('read') - .05);
pop('#nox2', at('documents') - .15);
rise('#never', at('documents') + .1, { y: 20, sfx: null });

// 3 · "Ask it your refund policy, and it'll confidently make one up."
rise('#chat3', L(2).s, { y: 40, sfx: null });
rise('#q3', at('ask') - .05, { y: 20 });
rise('#a3', at('confidently') - .35, { y: 20, sfx: null });
tl.fromTo('#stamp', { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power4.in', immediateRender: false }, at('up') - .15);
SFX.push({ t: at('up') + .12, k: 'pop' });

// 4 · "And the fix isn't a bigger model."
rise('#model', L(3).s, { y: 30, sfx: null });
tl.to('#model', { scale: 1.32, duration: .5, ease: 'back.out(1.6)' }, at('bigger') - .15);
pop('#bigger', at('bigger') - .1);
pop('#bigx', at('model') - .05);
tl.to('#model', { x: 8, duration: .05, yoyo: true, repeat: 5, ease: 'none' }, at('model') + .15);

// 5 · "It's a trick called RAG."
pop('#p-robot', at('trick') - .1);
tl.fromTo('#rag span', { autoAlpha: 0, y: 80, scale: .6 }, { ...IN, duration: .5, stagger: .09, ease: 'back.out(2)', immediateRender: false }, at('rag') - .2);
SFX.push({ t: at('rag') - .2, k: 'whoosh' });
rise('#ragsub', at('rag') + .3, { y: 14, sfx: null });

// 6 · "Think of it like an open-book exam."
rise('#exam', L(5).s, { y: 40, sfx: null });
pop('#p-book', at('openbook') - .1);
rise('#ob', at('exam') - .05, { y: 20, sfx: null });

// 7 · "Before the model answers, it searches your documents,"
rise(['#k7', '#docs .doc'], L(6).s, { st: .06, y: 40 });
const docs = $$('#docs .doc'), lens = $('#lens');
const tLens0 = at('searches') - .35, tLens1 = L(6).e - .15;
tl.fromTo(lens, { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .3, immediateRender: false }, tLens0);
const DOCPTS = docs.map(d => [d.offsetLeft + d.offsetParent.offsetLeft + d.offsetWidth / 2, d.offsetTop + d.offsetParent.offsetTop + d.offsetHeight / 2]);
const LENSPATH = [0, 1, 3, 2, 4, 5].map(i => DOCPTS[i]);

// 8 · "grabs the three paragraphs that match the question best,"
rise('#qp8', L(7).s, { y: 30, sfx: null });
pop('#pa1', at('three') - .1, 'tick');
pop('#pa2', at('paragraphs') + .05, 'tick');
pop('#pa3', at('match') - .05, 'tick');

// 9 · "and reads them first."
rise('#prompt', L(8).s, { y: 40 });
rise(['#pc1', '#pc2', '#pc3'], L(8).s + .15, { st: .12, y: 16, sfx: null });
pop('#p-robot2', at('reads') - .1);

// 10 · "Behind the scenes, every paragraph is turned into numbers that capture its meaning, and stored in a vector database."
rise('#pa10', L(9).s, { y: 40 });
rise('#down10', at('turned') - .1, { y: -20, sfx: null });
tl.set('#vec10', { autoAlpha: 1 }, at('numbers') - .25);
tl.fromTo('#vec10', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .8, ease: 'none', immediateRender: false }, at('numbers') - .25);
tick(at('numbers'));
rise('#mean10', at('meaning') - .3, { y: 20, sfx: null });
fade(['#pa10', '#down10', '#mean10'], at('stored') - .25);
tl.to('#vec10', { y: -300, duration: .5, ease: 'power3.inOut' }, at('stored') - .25);
pop('#p-db', at('vector') - .15);
const fly = $('#fly10'), dots = Array.from({ length: 7 }, () => { const d = document.createElement('i'); d.className = 'fd'; fly.appendChild(d); return d; });
dots.forEach((d, i) => tl.fromTo(d, { x: 220 + i * 105, y: 360, opacity: 0, scale: .6 },
  { keyframes: [{ opacity: 1, duration: .1 }, { x: 540 + (i - 3) * 30, y: 1010, scale: .4, duration: .55, ease: 'power2.in' }, { opacity: 0, duration: .08 }], immediateRender: false }, at('database') - .25 + i * .06));

// 11 · "So it finds the right paragraph even when you use different words."
rise('#map', L(10).s, { y: 40 });
const svg = $('#mapl'), NS = 'http://www.w3.org/2000/svg';
const DOTS = [[330, 340, '#F79009'], [290, 300, '#F79009'], [380, 300, '#F79009'], [260, 380, '#F79009'], [360, 400, '#F79009'],
  [650, 600, '#7A5AF8'], [700, 650, '#7A5AF8'], [610, 680, '#7A5AF8'], [720, 560, '#7A5AF8'], [660, 720, '#7A5AF8'],
  [230, 690, '#0E9384'], [300, 740, '#0E9384'], [200, 780, '#0E9384'], [280, 820, '#0E9384'],
  [690, 230, '#017CEE'], [740, 300, '#017CEE'], [640, 280, '#017CEE'], [770, 200, '#017CEE']];
const dotEls = DOTS.map(([x, y, c]) => { const e = document.createElementNS(NS, 'circle'); e.setAttribute('cx', x); e.setAttribute('cy', y); e.setAttribute('r', 15); e.setAttribute('fill', c); e.setAttribute('stroke', '#fff'); e.setAttribute('stroke-width', 5); svg.appendChild(e); return e; });
tl.fromTo(dotEls, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .35, stagger: .025, ease: 'back.out(3)', immediateRender: false }, L(10).s + .2);
const Q = [430, 470];
const qd = document.createElementNS(NS, 'rect');
for (const [k, v] of Object.entries({ x: -22, y: -22, width: 44, height: 44, rx: 10, fill: '#0E9384', stroke: '#fff', 'stroke-width': 6 })) qd.setAttribute(k, v);
svg.appendChild(qd);
const link = document.createElementNS(NS, 'path');
link.setAttribute('d', `M${Q[0]} ${Q[1]}L330 340`); link.setAttribute('stroke', '#0E9384'); link.setAttribute('stroke-width', 6); link.setAttribute('stroke-dasharray', '14 12'); link.setAttribute('fill', 'none'); link.setAttribute('opacity', 0);
svg.insertBefore(link, svg.firstChild);
const ring = document.createElementNS(NS, 'circle');
for (const [k, v] of Object.entries({ cx: 330, cy: 340, r: 34, fill: 'none', stroke: '#F79009', 'stroke-width': 6, opacity: 0 })) ring.setAttribute(k, v);
svg.appendChild(ring);
rise('#lb-q', L(10).s + .4, { y: 20, sfx: null });
tl.fromTo(qd, { attr: { transform: 'translate(820 880) rotate(45) scale(.4)' }, opacity: 0 },
  { attr: { transform: `translate(${Q[0]} ${Q[1]}) rotate(45) scale(1)` }, opacity: 1, duration: .7, ease: 'power3.inOut', immediateRender: false }, at('finds') - .4);
tl.to(link, { attr: { opacity: 1 }, duration: .3 }, at('right') - .1);
tl.fromTo(ring, { attr: { r: 20, opacity: 0 } }, { attr: { r: 40, opacity: 1 }, duration: .4, immediateRender: false }, at('right') - .05);
pop('#lb-ref', at('paragraph', 1) - .1, 'tick');
rise('#same', at('different') - .15, { y: 20, sfx: null });

// 12 · "That's why the answer comes back with a source you can click."
rise('#chat12', L(11).s, { y: 40 });
rise('#a12', at('answer') - .25, { y: 20, sfx: null });
pop('#src12', at('source') - .15, 'tick');
const srcEl = $('#src12'); gsap.set('#tap12', { left: srcEl.offsetLeft + srcEl.offsetWidth * .35 - 40, top: srcEl.offsetTop + srcEl.offsetHeight / 2 - 40 });
tl.fromTo('#tap12', { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: .25, immediateRender: false }, at('click') - .3);
tl.to('#src12', { scale: .93, duration: .1, yoyo: true, repeat: 1 }, at('click') - .05);
tl.to('#tap12', { autoAlpha: 0, duration: .3 }, at('click') + .35);
rise('#pdf12', at('click') + .05, { y: 60 });

// 13 · "And when the policy changes, you just update the document. No retraining."
rise('#pdf13', L(12).s, { y: 40, sfx: null });
tl.to('#pdf13', { x: 8, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, at('changes') - .05);
const tUpd = at('update') - .05;
tick(tUpd);
rise('#retrain', at('no') - .15, { y: 30, sfx: null });
tl.to('#strike', { scaleX: 1, duration: .35, ease: 'power2.out' }, at('retraining') + .05);
SFX.push({ t: at('retraining') + .05, k: 'pop' });

// 14 · "If you want to get into AI engineering, this is the first thing to learn."
rise('#path', L(13).s, { y: 40 });
rise(['#st1', '#st2', '#st3', '#st4'], L(13).s + .3, { st: .14, y: 20, sfx: null });
tl.fromTo('#st1', { boxShadow: '0 0 0 0px rgba(18,183,106,0)' }, { boxShadow: '0 0 0 18px rgba(18,183,106,.22)', duration: .4, yoyo: true, repeat: 1, immediateRender: false }, at('first', 1) - .1);
tick(at('first', 1));

// 15 · "Follow, and next I'll explain AI agents."
pop('#p-wave', at('follow') - .15);
rise('#next', at('next') - .15, { y: 30, sfx: null });
rise('#follow', at('agents') - .1, { y: 30, sfx: null });
tl.to('#follow', { scale: .92, duration: .12, yoyo: true, repeat: 1 }, at('agents') + .6);
SFX.push({ t: at('agents') + .6, k: 'tick' });

// ---------------------------------------------------------------- per-frame extras
const s13 = $('#s13'), msize = $('#msize'), props = $$('.prop');
function drawExtras(t) {
  // the lens sweeps over the documents, lighting each one it passes
  if (t >= tLens0 && t < tLens1 + .3) {
    const u = clamp((t - tLens0) / (tLens1 - tLens0)) * (LENSPATH.length - 1), i = Math.min(LENSPATH.length - 2, Math.floor(u)), f = gsap.parseEase('sine.inOut')(u - i);
    const [x0, y0] = LENSPATH[i], [x1, y1] = LENSPATH[i + 1];
    lens.style.left = (x0 + (x1 - x0) * f).toFixed(1) + 'px'; lens.style.top = (y0 + (y1 - y0) * f).toFixed(1) + 'px';
    docs.forEach((d, j) => d.classList.toggle('lit', [0, 1, 3, 2, 4, 5].indexOf(j) <= Math.round(u)));
  }
  s13.classList.toggle('done', t >= tUpd);
  msize.textContent = t >= at('bigger') - .15 ? '700B parameters' : '70B parameters';
  props.forEach((p, i) => { p.style.translate = `0 ${(8 * Math.sin(t * 2.2 + i)).toFixed(2)}px`; });
  link.style.strokeDashoffset = (-t * 30).toFixed(1);
}

window.render = t => { tl.seek(t, false); drawBg(t); drawCam(t); drawCaps(t); drawExtras(t); };
Promise.all([document.fonts.ready, ...$$('img').map(i => i.decode())]).then(() => { window.render(0); window.READY = true; });
