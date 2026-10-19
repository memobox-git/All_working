// Stackle channel intro: a quiet page that fills in as Chris talks.
// One paused GSAP timeline keyed to the voiceover word cues in cues.js, so
// window.render(t) always produces the same frame for the same t.
gsap.registerPlugin(DrawSVGPlugin);

const OFF = VO.offset;                       // voice starts this far into the video
const END = OFF + VO.duration + 2;           // hold the end card, then fade to paper
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

  const S2 = at('for', 0) - .35;            // "for more than 10 years"
  const S3 = at('i', 1) + .02;              // "I have interviewed"
  const S4 = at('so', 0) - .05;             // "So I know exactly"
  const S5 = at('i', 3) + .02;              // "I have also sat"
  const S6 = at('today') - .02;
  const S7 = at('more', 2) - .02;           // "More than 13,000"
  const S8 = at('on', 2) - .05;             // "On this channel"
  const S9 = at('so', 1) - .02;             // "So let's get into it"
  const LOCK = atEnd('it') + .1;

  // S1 · photo, note, name ------------------------------------------------
  scene('#s1', 0, S2);
  const tHi = at('hi'), tChris = at('chris');
  draw($('#s1-frame'), rect(4, 4, 592, 730, 3), null, tHi - .2, 1);
  tl.fromTo('#s1-photo img', { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: .9 }, tHi + .1);
  write('#s1-note', tHi, 1.1);
  const note = box('#s1-note'), ph = box('#s1-photo');
  const a0 = [note.left - 18, note.top + note.height * .55], a1 = [ph.right + 26, note.bottom + 70];
  const shaft = draw($('#s1-ink'), line(a0[0], a0[1], a1[0], a1[1], 7, 1, 22), 'red', tHi + 1, .35, false);
  const ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
  const head = ['M', a1[0] - Math.cos(ang - .5) * 24, a1[1] - Math.sin(ang - .5) * 24, 'L', a1[0], a1[1], 'L', a1[0] - Math.cos(ang + .5) * 24, a1[1] - Math.sin(ang + .5) * 24].map(v => typeof v === 'number' ? f1(v) : v).join(' ');
  draw($('#s1-ink'), head, 'red', tHi + 1.33, .2);
  rise('#s1-my', at('my') - .08);
  rise('#s1-name', tChris - .12, .6, 24);
  const nm = box('#s1-name');
  draw($('#s1-ink'), line(nm.left + 8, nm.bottom - 14, nm.right - 40, nm.bottom - 24, 11, 1.5, 7), 'red', tChris + .25, .45);
  rise('#s1-meta', tChris + .45);

  // S2 · 10 years ------------------------------------------------------------
  scene('#s2', S2, S3);
  rise('#s2-pre', S2 + .05);
  rise('#s2-big', S2 + .2, .6, 24);
  rise('#s2-sub', S2 + .4);
  const ten = box('#s2-10');
  draw($('#s2-ink'), loop(ten.left + ten.width / 2 + 8, ten.top + ten.height * .55, ten.width / 2 + 58, ten.height * .4, 5), 'red', at('10') - .05, .6);

  // S3 · 200+ engineers, four industries ---------------------------------
  scene('#s3', S3, S4);
  rise('#s3-pre', S3 + .05);
  rise('#s3-big', at('200') - .3, .6, 24);
  rise('#s3-for', at('for', 1) - .05);
  [['#i1', 'healthcare'], ['#i2', 'banking'], ['#i3', 'automotive'], ['#i4', 'financial']].forEach(([sel, w]) => {
    const t = at(w) - .1;
    rise(`${sel}`, t, .45, 12);
    tl.fromTo(`${sel} svg path`, { drawSVG: '0%' }, { drawSVG: '100%', duration: .35, ease: 'power1.inOut' }, t + .1);
    pencil(t + .1, .4);
  });

  // S4 · hired vs rejected ----------------------------------------------------
  scene('#s4', S4, S5);
  rise('#s4-pre', S4 + .05);
  words($('#s4-a'), 'what', 0);
  words($('#s4-b'), 'and', 1);
  const hi = box('#s4-a .w:last-child'), rj = box('#s4-b .w:last-child');
  draw($('#s4-ink'), line(hi.left + 4, hi.bottom - 8, hi.right - 30, hi.bottom - 14, 13, 1.5, 5), 'red', at('hired', 0) + .25, .4);
  draw($('#s4-ink'), line(rj.left - 10, rj.top + rj.height * .55, rj.right - 10, rj.top + rj.height * .5, 17, 2.5, -3), 'red', at('rejected') + .3, .4);
  tl.to('#s4-b .w:last-child', { color: '#A1A1A6', duration: .4 }, at('rejected') + .4);

  // S5 · the other side of the table, then the offers ----------------------
  scene('#s5', S5, S6);
  rise('#s5-pre', S5 + .05);
  const big5 = $('#s5-big');
  big5.innerHTML = 'the other side of the table.'.split(' ').map((w, k) => `<span class="w" id="s5w${k}">${w}</span>`).join(' ');
  const iThe = wi('the', 0);
  $$('#s5-big .w').forEach((w, k) => rise(w, WORDS[iThe + k].s + OFF - .05, .45, 12));
  const o1 = box('#s5w1'), o2 = box('#s5w2');
  draw($('#s5-ink'), line(o1.left + 4, o1.bottom - 6, o2.right - 6, o2.bottom - 12, 19, 1.5, 6), 'red', at('other') + .2, .45);
  const tWith = at('with');
  tl.to(['#s5-pre', '#s5-big', '#s5-ink'], { opacity: 0, y: -16, duration: .35, ease: 'power1.in' }, tWith - .05);
  rise('#s5-offer', at('offers') + .05, .6, 20);
  const cards = $('#s5-cards'), fan = [[1060, -5], [1275, 1], [1490, 6]];
  cards.innerHTML = fan.map(([x, r], i) => `<div class="card" style="left:${x}px;transform:rotate(${r}deg)"><svg>
    <path class="f" d="${rect(3, 3, 324, 424, 30 + i)}"/>
    <path class="h" d="${line(40, 62, 170 - i * 18, 62, 40 + i, .8)}"/>
    <path class="l" d="${line(40, 120, 286, 120, 50 + i, .8)}"/><path class="l" d="${line(40, 160, 266, 160, 60 + i, .8)}"/>
    <path class="l" d="${line(40, 200, 280, 200, 70 + i, .8)}"/><path class="l" d="${line(40, 240, 200, 240, 80 + i, .8)}"/>
    <path class="c" d="${loop(82, 360, 32, 32, 90 + i)}"/><path class="c" d="M65 360 L78 373 L101 344"/></svg></div>`).join('');
  const tCards = at('multiple') - .1;
  $$('.card').forEach((c, i) => {
    rise(c, tCards + i * .18, .6, 26);
    tl.fromTo(c.querySelectorAll('path.c'), { drawSVG: '0%' }, { drawSVG: '100%', duration: .45, ease: 'power1.inOut', stagger: .2 }, at('same') - .05);
  });
  sfx(tCards, 'paper_2', .35);
  pencil(at('same'), .55);
  write('#s5-same', at('same') - .2, .9);

  // S6 · Stackle --------------------------------------------------------------
  scene('#s6', S6, S7);
  rise('#s6-pre', S6 + .05);
  rise('#s6-word', at('stackle') - .12, .6, 24);
  write('#s6-sub', at('your', 0) - .05, .9);
  const de = box('#pill-de');
  $('#s6-and').style.left = `${de.right + 34}px`;
  $('#pill-ai').style.left = `${de.right + 34 + box('#s6-and').width + 34}px`;
  ['#pill-de', '#pill-ai'].forEach((sel, i) => {
    const t = i ? at('ai') - .1 : at('data', 1) - .1, b = box(sel);
    tl.fromTo(`${sel}`, { opacity: 0 }, { opacity: 1, duration: .4 }, t);
    draw($(`${sel} svg`), rect(3, 3, b.width - 6, b.height - 6, 100 + i, 1.2), null, t, .6);
  });
  rise('#s6-and', at('and', 2) - .05, .4, 8);

  // S7 · community numbers -----------------------------------------------------
  scene('#s7', S7, S8);
  const cols = [['#c1', S7 + .05, at('13000'), 13000], ['#c2', at('nearly') - .1, at('4000'), 4000], ['#c3', at('and', 3) - .05, at('500'), 500]];
  cols.forEach(([sel, tIn, tNum, n], i) => {
    rise(sel, tIn, .6, 20);
    counter(`${sel}-n`, n, tIn + .1, tNum + .35);
    if (i) draw($('#s7-ink'), line(170 + i * 590 - 50, 330, 170 + i * 590 - 46, 650, 120 + i, 1.2), 'thin', tIn - .15, .45);
  });

  // S8 · the mission -----------------------------------------------------------
  scene('#s8', S8, S9);
  rise('#s8-pre', S8 + .05);
  words($('#s8-line'), 'i', 6);
  const h2 = box('#s8-line .w:last-child');
  draw($('#s8-ink'), line(h2.left + 4, h2.bottom - 10, h2.right - 34, h2.bottom - 16, 23, 1.5, 6), 'red', at('hired', 1) + .2, .4);
  tl.to(['#s8-pre', '#s8-line', '#s8-ink'], { opacity: 0, y: -16, duration: .3, ease: 'power1.in' }, at('no') - .3);
  rise('#s8-nf', at('no') - .05, .5, 20);
  rise('#s8-jw', at('just') - .05, .5, 20);

  // S9 · so let's get into it, then the end card ----------------------------
  scene('#s9', S9, null);
  words($('#s9-go'), 'so', 1);
  tl.to('#s9-go', { opacity: 0, y: -16, duration: .35, ease: 'power1.in' }, LOCK);
  rise('#s9-end', LOCK + .3, .7, 20);
  sfx(LOCK + .3, 'paper_1', .35);
  tl.to('#s9-end', { opacity: 0, duration: .5, ease: 'power1.in' }, END - .55);
  sfx(0, 'bed', 1);

  window.render = t => { tl.seek(t, false); drawCounters(t); };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(build));
