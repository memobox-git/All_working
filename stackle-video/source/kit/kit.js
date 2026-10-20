// Shared kit for Stackle's page-style videos (intro, mid-video asks, outro):
// a quiet page that fills in as Chris talks. One paused GSAP timeline keyed to
// the voiceover word cues (window.VO, from make-cues.js), so window.render(t)
// always produces the same frame for the same t.
// A page loads its cues, gsap, DrawSVGPlugin, this file, then its own scene
// script, which sets window.DURATION, builds the timeline and calls finish().
gsap.registerPlugin(DrawSVGPlugin);
// portrait layout for TikTok, Reels and Shorts when the frame is taller than wide
if (innerHeight > innerWidth) document.documentElement.classList.add('tall');

const OFF = VO.offset;                       // voice starts this far into the video
window.SFX = [];                             // sound cues, read by mix.js

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const WORDS = VO.words.filter(w => !w.w.startsWith('['));
function wi(word, n = 0) {
  let k = 0;
  for (let i = 0; i < WORDS.length; i++) if (norm(WORDS[i].w) === norm(word) && k++ === n) return i;
  throw Error('no cue: ' + word + ' #' + n);
}
const at = (word, n = 0) => WORDS[wi(word, n)].s + OFF;
const atEnd = (word, n = 0) => WORDS[wi(word, n)].e + OFF;
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
function box(sel) {
  // layout position, ignoring entrance offsets and tilts set on the element or its parents
  const el = $(sel), saved = [];
  for (let e = el; e && e !== document.body; e = e.parentElement) { saved.push([e, e.style.transform]); e.style.transform = 'none'; }
  const r = el.getBoundingClientRect();
  saved.forEach(([e, v]) => { e.style.transform = v; });
  return r;
}

const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
let pencils = 0;
function sfx(t, file, gain = 1) { window.SFX.push({ t: +t.toFixed(3), file, gain }); }
const pencil = (t, gain = .5) => sfx(t, `pencil_${(pencils++ % 2) + 1}`, gain);

// ------------------------------------------------------------ pen strokes
const f1 = v => v.toFixed(1);
function smooth(pts) {
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}
function line(x0, y0, x1, y1, seed, amp = 2, bow = 0) {
  const r = rng(seed), n = 7, len = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / len, ny = (x1 - x0) / len, pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, off = Math.sin(u * Math.PI) * bow + (r() - .5) * 2 * amp * (i > 0 && i < n ? 1 : .3);
    pts.push([x0 + (x1 - x0) * u + nx * off, y0 + (y1 - y0) * u + ny * off]);
  }
  return smooth(pts);
}
function rect(x, y, w, h, seed, amp = 1.6, n = 5) {
  // one continuous stroke that runs a little past where it started, like a pen;
  // n points per side keep the corners tight on wide boxes
  const r = rng(seed), j = s => (r() - .5) * s;
  const c = [[x + j(6), y + j(6)], [x + w + j(6), y + j(6)], [x + w + j(6), y + h + j(6)], [x + j(6), y + h + j(6)]];
  const pts = [];
  for (let s = 0; s < 4; s++) {
    const a = c[s], b = c[(s + 1) % 4];
    for (let i = 0; i < n; i++) { const u = i / n; pts.push([a[0] + (b[0] - a[0]) * u + (i ? j(amp * 2) : 0), a[1] + (b[1] - a[1]) * u + (i ? j(amp * 2) : 0)]); }
  }
  pts.push([c[0][0] + (c[1][0] - c[0][0]) * .1, c[0][1] + (c[1][1] - c[0][1]) * .1 + 3]);
  return smooth(pts);
}
function loop(cx, cy, rx, ry, seed) {
  const r = rng(seed), start = -2.4 + r() * .3, pts = [];
  for (let i = 0; i <= 44; i++) {
    const a = start + i / 44 * Math.PI * 2.16, k = 1 + (r() - .5) * .04 + i * .0025;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts);
}
function svgPath(svg, d, cls) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  if (cls) p.setAttribute('class', cls);
  svg.appendChild(p);
  return p;
}
function draw(svg, d, cls, t, dur = .5, sound = true) {
  const p = svgPath(svg, d, cls);
  tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'power1.inOut' }, t);
  if (sound) pencil(t);
  return p;
}

// ------------------------------------------------------------ motion
const rise = (el, t, dur = .6, y = 18) => tl.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: dur }, t);
const write = (el, t, dur = .9) => tl.fromTo(el, { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% 0% -30% 0%)', duration: dur, ease: 'power1.inOut' }, t);
function scene(sel, a, b) {
  tl.set(sel, { autoAlpha: 1 }, a);
  if (b == null) return;
  tl.to(sel, { opacity: 0, y: -16, duration: .35, ease: 'power1.in' }, b - .35);
  tl.set(sel, { autoAlpha: 0 }, b);
  sfx(b - .3, 'paper_1', .35);
}
function words(el, firstWord, n = 0) {
  // wrap each word and show it on its own spoken cue
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const i0 = wi(firstWord, n);
  $$(`#${el.id} .w`).forEach((w, k) => rise(w, WORDS[i0 + k].s + OFF - .05, .45, 12));
  return $$(`#${el.id} .w`);
}


function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'), d = g.createImageData(512, 512), r = rng(5);
  for (let i = 0; i < d.data.length; i += 4) { const v = 150 + r() * 105; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  $('#grain').style.backgroundImage = `url(${c.toDataURL()})`;
}

function finish() {
  // two scenes can end together; keep one sound per moment
  window.SFX = window.SFX.filter((c, i, all) => all.findIndex(d => d.t === c.t && d.file === c.file) === i);
  window.render = t => { tl.seek(t, false); };
  window.render(0);
  window.READY = true;
}
