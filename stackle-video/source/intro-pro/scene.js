// Stackle channel intro: a quiet page that fills in as Chris talks.
// One paused GSAP timeline keyed to the voiceover word cues in cues.js, so
// window.render(t) always produces the same frame for the same t.
gsap.registerPlugin(DrawSVGPlugin);
// portrait layout for TikTok, Reels and Shorts when the frame is taller than wide
if (innerHeight > innerWidth) document.documentElement.classList.add('tall');

const OFF = VO.offset;                       // voice starts this far into the video
const END = OFF + VO.duration + .8;          // a beat after the last word, then cut to the video
window.DURATION = END;
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
function rect(x, y, w, h, seed, amp = 1.6) {
  // one continuous stroke that runs a little past where it started, like a pen
  const r = rng(seed), j = s => (r() - .5) * s;
  const c = [[x + j(6), y + j(6)], [x + w + j(6), y + j(6)], [x + w + j(6), y + h + j(6)], [x + j(6), y + h + j(6)]];
  const pts = [];
  for (let s = 0; s < 4; s++) {
    const a = c[s], b = c[(s + 1) % 4];
    for (let i = 0; i < 5; i++) { const u = i / 5; pts.push([a[0] + (b[0] - a[0]) * u + (i ? j(amp * 2) : 0), a[1] + (b[1] - a[1]) * u + (i ? j(amp * 2) : 0)]); }
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

const ctr = [];
function counter(sel, to, t0, t1) { ctr.push({ el: $(sel), to, t0, t1, last: null }); }
function drawCounters(t) {
  const e = gsap.parseEase('power2.out');
  for (const c of ctr) {
    const s = Math.round(c.to * e(clamp((t - c.t0) / (c.t1 - c.t0)))).toLocaleString('en-US');
    if (s !== c.last) { c.el.textContent = s; c.last = s; }
  }
}

function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'), d = g.createImageData(512, 512), r = rng(5);
  for (let i = 0; i < d.data.length; i += 4) { const v = 150 + r() * 105; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  $('#grain').style.backgroundImage = `url(${c.toDataURL()})`;
}

// ------------------------------------------------------------ the edit
function build() {
  makeGrain();

  const S3 = at('now') - .1;                // "Now I run Stackle"

  // the photo: drawn on first, then held beside the name and the numbers
  scene('#photo', 0, S3);
  const pf = $('#s1-photo');
  draw($('#s1-frame'), rect(4, 4, pf.offsetWidth - 8, pf.offsetHeight - 8, 3), null, .1, .75);
  tl.fromTo('#s1-photo img', { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: .8 }, .3);

  // S1 · Hi, I'm Chris -------------------------------------------------------
  scene('#s1', 0, S3);
  const tHi = at('hi'), tChris = at('chris');
  write('#s1-note', tHi - .1, .45);
  const note = box('#s1-note'), ph = box('#s1-photo');
  const a0 = [note.left - 18, note.top + note.height * .55], a1 = [ph.right + 26, note.top + note.height * .55 + 60];
  draw($('#s1-ink'), line(a0[0], a0[1], a1[0], a1[1], 7, 1, 18), 'red', tHi + .3, .3, false);
  const ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
  const head = ['M', a1[0] - Math.cos(ang - .5) * 24, a1[1] - Math.sin(ang - .5) * 24, 'L', a1[0], a1[1], 'L', a1[0] - Math.cos(ang + .5) * 24, a1[1] - Math.sin(ang + .5) * 24].map(v => typeof v === 'number' ? f1(v) : v).join(' ');
  draw($('#s1-ink'), head, 'red', tHi + .58, .15);
  rise('#s1-my', at("i'm") - .08);
  rise('#s1-name', tChris - .12, .55, 24);
  const nm = box('#s1-name');
  draw($('#s1-ink'), line(nm.left + 8, nm.bottom - 14, nm.right - 40, nm.bottom - 24, 11, 1.5, 7), 'red', tChris + .2, .4);
  rise('#s1-meta', tChris + .35);

  // S2 · 10+ years, 200+ engineers -------------------------------------------
  scene('#s2', 0, S3);
  rise('#st-a', at('over') - .1, .55, 20);
  const ten = box('#st-10');
  draw($('#s2-ink'), loop(ten.left + ten.width / 2 + 4, ten.top + ten.height * .55, ten.width / 2 + 40, ten.height * .44, 5), 'red', at('10') - .05, .5);
  rise('#st-b', at('interviewed') - .1, .55, 20);
  const two = box('#st-200');
  draw($('#s2-ink'), line(two.left + 6, two.bottom + 8, two.right - 20, two.bottom + 2, 13, 1.5, 5), 'red', at('200') + .1, .4);

  // S3 · Stackle and what it teaches ----------------------------------------
  scene('#s3', S3, null);
  rise('#s3-pre', S3 + .05);
  rise('#s3-word', at('stackle') - .12, .55, 24);
  rise('#s3-teach', at('where') - .08);
  const line3 = $('#s3-line');
  line3.innerHTML = line3.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const i0 = wi('teach') + 1;
  $$('#s3-line .w').forEach((w, k) => rise(w, WORDS[i0 + k].s + OFF - .05, .4, 12));
  const hired = box('#s3-line .w:last-child');
  draw($('#s3-ink'), line(hired.left + 4, hired.bottom - 6, hired.right - 26, hired.bottom - 12, 23, 1.5, 6), 'red', at('hired') + .15, .35);

  tl.to('#s3', { opacity: 0, duration: .25, ease: 'power1.in' }, END - .25);
  sfx(0, 'bed', 1);
  // two scenes can end together; keep one sound per moment
  window.SFX = window.SFX.filter((c, i, all) => all.findIndex(d => d.t === c.t && d.file === c.file) === i);

  window.render = t => { tl.seek(t, false); drawCounters(t); };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(build));
