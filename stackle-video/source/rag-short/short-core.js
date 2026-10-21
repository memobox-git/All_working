// The shared core of the vertical Shorts: word cues, one cut per script line,
// the camera, the warm backdrop, the captions and the animation helpers. Each
// Short loads this after its words.js, then its own scenes file, which calls
// start(drawExtras) at the end. The page follows render-pro.js's contract:
// window.render(t), DURATION, READY, and SFX (the pops and whooshes mix.py
// lays under the voice).
// A page can set window.SCENE_OF (one section id per line) to let several
// lines share a scene; by default line n shows section #s<n>.

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
const SCENE_OF = window.SCENE_OF || LINE_WORDS.map((_, i) => 's' + (i + 1));
LINES.forEach((L, i) => {
  L.e = i + 1 < LINES.length ? LINES[i + 1].s : END;
  L.f = i === 0 ? { z0: 1, z1: 1.05, x: 0 } : i % 2 ? { z0: 1.07, z1: 1.09, x: -10 } : { z0: 1, z1: 1.02, x: 8 };
  // a scene comes on with its first line and goes off after its last (scene 1 is on from the first frame: style.css)
  if (i && SCENE_OF[i] !== SCENE_OF[i - 1]) tl.set('#' + SCENE_OF[i], { visibility: 'visible' }, L.s);
  if (i + 1 < LINES.length && SCENE_OF[i] !== SCENE_OF[i + 1]) tl.set('#' + SCENE_OF[i], { visibility: 'hidden' }, L.e);
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

function start(drawExtras = () => {}) {
  window.render = t => { tl.seek(t, false); drawBg(t); drawCam(t); drawCaps(t); drawExtras(t); };
  Promise.all([document.fonts.ready, ...$$('img').map(i => i.decode())]).then(() => { window.render(0); window.READY = true; });
}
