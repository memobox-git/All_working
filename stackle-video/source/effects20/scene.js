// The 20-effect edit. render(t) draws one frame from the footage, the cut-out
// of the person and the spoken word timings, so any frame can be drawn on its
// own and render-pro.js can split the work across pages.
// Each effect starts as its name is said; the ending follows the call to action.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (u, a, b) => clamp((u - a) / (b - a));
const out = x => 1 - (1 - clamp(x)) ** 3;
const inn = x => clamp(x) ** 3;
const io = x => (x = clamp(x), x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const expo = x => (x = clamp(x), x >= 1 ? 1 : 1 - 2 ** (-10 * x));
const back = x => (x = clamp(x), 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2);
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const show = (el, on = true, d = 'block') => { el.style.display = on ? d : 'none'; };

const C = window.CONFIG, FPS = META.fps;
const F = { ...META.face, x: clamp(META.face.x, 240, 840), y: clamp(META.face.y, 520, 1250) };
window.DURATION = META.frames / FPS;
const scene = $('#scene'), foot = $('#foot'), person = $('#person');

const NAMES = ['Orbit', 'Chat Takeover', 'Frame Escape', 'Snap Zoom', 'Checklist Pop', 'Headline Storm', 'Zoom Portal',
  'Growth Curve', 'Studio Reveal', 'B-roll Overlay', 'Paper Cutout', 'Dolly Zoom', 'Magazine Cover', 'Liquid Glass',
  'Zoom Through Cut', 'Green Screen', 'Frame Break', 'Digital Zoom', 'Phone Mockup', 'Checklist'];

// ------------------------------------------------------------ timing from the words
// The names are looked for in the joined-up transcript, so "B roll", "B-roll" and
// "broll" all match. A name Whisper missed is placed between its neighbours.
const WORDS = VO.words.map(w => ({ ...w, n: norm(w.w) }));
const LEAD = .1;                                  // an effect lands just before its name
const said = (() => {
  let text = '', owner = [], pos = 0;
  WORDS.forEach((w, i) => { for (const ch of w.n) { text += ch; owner.push(i); } });
  return NAMES.map(name => {
    for (const key of [norm(name), norm(name.split(/[\s-]/)[0])]) {
      const k = text.indexOf(key, pos);
      if (k >= 0) { pos = k + key.length; return owner[k]; }
    }
    return null;
  });
})();
const T = said.map(i => (i == null ? null : WORDS[i].s));
for (let i = 0; i < T.length; i++) if (T[i] == null) {
  let p = i - 1, q = i + 1;
  while (p >= 0 && T[p] == null) p--;
  while (q < T.length && T[q] == null) q++;
  const tp = p >= 0 ? T[p] : 3, tq = q < T.length ? T[q] : tp + 1.9 * (q - p);
  T[i] = lerp(tp, tq, (i - p) / (q - p));
}
for (let i = 0; i < T.length; i++) T[i] = Math.max(T[i] - LEAD, i ? T[i - 1] + .4 : .5);
const lastWord = said[19] != null ? WORDS[said[19] + 1] : null;
const OUT = Math.min(window.DURATION, Math.max(T[19] + 1, lastWord ? lastWord.s - .05 : T[19] + 1.6));
const SEG = NAMES.map((name, i) => ({ name, a: T[i], b: i < 19 ? T[i + 1] : OUT }));

// The ending follows the call to action: each part starts on its word, and a part
// whose word isn't said is left out. The original's ending says all of them.
const cueAfter = (from, keys, fallback) => {
  const w = WORDS.find(w => w.s >= from && keys.includes(w.n));
  return w ? w.s - .05 : fallback;
};
const PARTS = [['card', ['plus', 'dedicated']], ['drop', ['just', 'drop']], ['prompt', ['enter', 'tell', 'send']],
  ['phone', ['get', 'fully']], ['comment', ['comment']], ['follow', ['follow', 'always', 'stay']]];
const ENDING = [{ part: 'lists', a: OUT }];
for (const [part, keys] of PARTS) {
  const a = cueAfter(OUT + .3, keys, null);
  if (a != null) ENDING.push({ part, a });
}
ENDING.sort((x, y) => x.a - y.a);
ENDING.forEach((p, i) => { p.b = i < ENDING.length - 1 ? ENDING[i + 1].a : window.DURATION + 1; });
const HAS = part => ENDING.some(p => p.part === part);
const THESE = cueAfter(0, ['these'], T[0] - 1);

// ------------------------------------------------------------ footage frames
const pad = n => String(n + 1).padStart(5, '0');
let shown = '';
async function setFrame(n, screenN) {
  const key = n + '/' + screenN;
  if (key === shown) return;
  shown = key;
  const jobs = [];
  const put = (img, src) => { if (!img.src.endsWith(src)) { img.src = src; jobs.push(img.decode().catch(() => {})); } };
  $$('img.live').forEach(i => put(i, `work/frames/${pad(n)}.jpg`));
  $$('img.cut').forEach(i => put(i, `work/person/${pad(n)}.webp`));
  if (META.screenFrames) $$('img.screen').forEach(i => put(i, `work/screen/${pad(screenN % META.screenFrames)}.jpg`));
  await Promise.all(jobs);
}

function cam(s = 1, ox = F.x, oy = F.y, blur = 0) {
  scene.style.transform = s === 1 ? '' : `translate(${ox}px,${oy}px) scale(${s}) translate(${-ox}px,${-oy}px)`;
  scene.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : '';
}

// ------------------------------------------------------------ 01 orbit
const ORB = [['w', 'Aa'], ['k', 'CC'], ['w', '#play', 'var(--red)'], ['k', '#cut'], ['b', '#wave'], ['k', '#star', 'var(--red)'], ['r', '+']];
const OX = F.x, OY = F.y + .1 * F.w, OR = clamp(F.w * 1.8, 330, 470), Or = OR * .36, TILT = -12;
const ringSvg = side => `<svg class="full ring ${side}" viewBox="0 0 1080 1920"><defs><clipPath id="half-${side}">
  <rect x="-2000" y="${side === 'front' ? 0 : -2000}" width="4000" height="2000"/></clipPath></defs>
  <g transform="translate(${OX},${OY}) rotate(${TILT})"><ellipse rx="${OR}" ry="${Or}" fill="none" stroke="rgba(255,255,255,.85)"
  stroke-width="4" stroke-dasharray="14 14" clip-path="url(#half-${side})"/></g></svg>`;
$('#g-orbit').innerHTML = ringSvg('back') + ringSvg('front') + ORB.map(([c, v, col]) =>
  `<div class="orb ${c}">${v.startsWith('#') ? `<svg style="color:${col || 'currentColor'}"><use href="${v}"/></svg>` : v}</div>`).join('');
const ORBS = $$('#g-orbit .orb');

function orbit(u) {
  show($('#g-orbit')); show(person);
  const ca = Math.cos(TILT * Math.PI / 180), sa = Math.sin(TILT * Math.PI / 180), spin = -1 + u * 2.1;
  ORBS.forEach((el, i) => {
    const a = spin + i * 2 * Math.PI / ORBS.length, lx = OR * Math.cos(a), ly = Or * Math.sin(a), depth = (Math.sin(a) + 1) / 2;
    el.style.left = OX + lx * ca - ly * sa + 'px';
    el.style.top = OY + lx * sa + ly * ca + 'px';
    el.style.zIndex = Math.sin(a) > 0 ? 4 : 2;
    el.style.transform = `scale(${back(seg(u, i * .05, i * .05 + .35)) * (.78 + .22 * depth)})`;
  });
  $$('#g-orbit .ring').forEach(r => { r.style.opacity = out(seg(u, 0, .3)); });
  cam(1 + .04 * out(seg(u, 0, 1.5)));
}

// ------------------------------------------------------------ 02 chat takeover
const SLOT = { x: 660, y: 690, w: 320, h: 569 };
$('#chat .user').textContent = C.ask;
function chat(u) {
  show($('#chat'));
  const k = io(seg(u, 0, .45)), att = $('#chat .att');
  Object.assign(att.style, {
    left: lerp(0, SLOT.x, k) + 'px', top: lerp(0, SLOT.y, k) + 'px', width: lerp(1080, SLOT.w, k) + 'px',
    height: lerp(1920, SLOT.h, k) + 'px', borderRadius: lerp(0, 22, k) + 'px',
  });
  $('#chat .att .tag').style.opacity = seg(u, .4, .6);
  const w = out(seg(u, .25, .6)), win = $('#chat .win');
  win.style.opacity = w;
  win.style.transform = `translateY(${(1 - w) * 60}px) scale(${.96 + .04 * w})`;
  $('#chat .user').style.opacity = out(seg(u, .4, .65));
  show($('#chat .typing'), u > .6 && u < 1, 'flex');
  $$('#chat .typing i').forEach((d, i) => { d.style.opacity = .35 + .65 * Math.max(0, Math.sin(u * 12 - i * .9)); });
  $('#chat .onit').style.opacity = u >= 1 ? 1 : 0;
  $$('#chat li').forEach((li, i) => { li.style.opacity = out(seg(u, 1.15 + i * .3, 1.35 + i * .3)); });
  $('#chat .spin').style.transform = `rotate(${u * 540}deg)`;
}

// ------------------------------------------------------------ 03 frame escape
function escape(u) {
  show($('#escape'));
  const k = io(seg(u, .3, .8));
  const B = { x: 140, y: Math.min(1460, F.y + .85 * F.w), w: 800 };
  const r = { x: lerp(70, B.x, k), y: lerp(430, B.y, k), w: lerp(940, B.w, k) };
  r.h = lerp(1420, 1880 - B.y, k);
  const tilt = $('#escape .tilt');
  tilt.style.transformOrigin = `${r.x + r.w / 2}px ${r.y + r.h / 2}px`;
  tilt.style.transform = `rotate(${lerp(2.5, -3, k)}deg)`;
  $('#escape .clip').style.clipPath = `inset(${r.y}px ${1080 - r.x - r.w}px ${1920 - r.y - r.h}px ${r.x}px)`;
  Object.assign($('#escape .border').style, { left: r.x - 16 + 'px', top: r.y - 16 + 'px', width: r.w + 32 + 'px', height: r.h + 32 + 'px' });
  const pop = $('#escape .pop');
  pop.style.clipPath = `inset(0 0 ${1920 - r.y - r.h}px 0)`;
  pop.style.opacity = out(seg(u, .3, .6));
}

// ------------------------------------------------------------ 04 snap zoom
function snap(u, d) {
  cam(1 + .45 * expo(seg(u, 0, .16)) + .05 * seg(u, .16, d), F.x, F.y, u < .16 ? 4 * Math.sin(Math.PI * u / .16) : 0);
}

// ------------------------------------------------------------ 05 checklist pop
function pops(u) {
  show($('#g-pop'));
  $$('#g-pop .pill').forEach((el, i) => {
    const k = back(seg(u, .1 + i * .32, .45 + i * .32));
    el.style.transformOrigin = '85% 50%';
    el.style.transform = `scale(${k})`;
    el.style.opacity = clamp(k * 3);
  });
}

// ------------------------------------------------------------ 06 headline storm
const BANS = [  // words, tag, x, y, tilt, in front of the person
  ['Claude now edits video', 'BREAKING', 140, 445, -6, 0], ['20 effects. One prompt', 'JUST IN', 470, 545, -4, 0],
  ['Editors on notice', 'BREAKING', -30, 650, 7, 1], ['Every word captioned', '', 560, 770, -9, 0],
  ['No timeline needed', 'JUST IN', -40, 880, -8, 0], ['The AI edit is here', '', 600, 995, -12, 1],
  ['One prompt. Done.', 'BREAKING', -60, 1090, 6, 0], ['Made with Claude', '', 640, 1205, -9, 1],
  ['20 effects in one take', 'JUST IN', 590, 1335, -5, 0], ['Claude edits', '', 30, 1445, -6, 1],
];
$('#g-storm').innerHTML = BANS.map(([w, tag, x, y, r, f]) =>
  `<div class="ban" style="left:${x}px;top:${y}px;z-index:${f ? 4 : 2}">${tag ? `<b>${tag}</b>` : ''}${w}</div>`).join('');
function storm(u) {
  show($('#g-storm')); show(person);
  $$('#g-storm .ban').forEach((el, i) => {
    const [, , x, , r] = BANS[i], dir = x < 300 ? -1 : 1, k = expo(seg(u, i * .07, i * .07 + .5));
    el.style.transform = `translateX(${dir * ((1 - k) * 1300 - u * 14)}px) rotate(${r}deg)`;
  });
}

// ------------------------------------------------------------ 07 zoom portal
function portal(u, d) {
  show($('#g-portal'));
  const pop = back(seg(u, 0, .35)), grow = io(seg(u, d - .55, d));
  const cx = lerp(175, 540, grow), cy = lerp(F.y + 30, 960, grow), rad = Math.max(1, lerp(125 * pop, 1150, grow));
  const el = $('.portal'), bw = lerp(8, 0, grow), inner = rad - bw, k = lerp(1.7, 1.2, grow);
  Object.assign(el.style, { left: cx - rad + 'px', top: cy - rad + 'px', width: 2 * rad + 'px', height: 2 * rad + 'px', borderWidth: bw + 'px' });
  $('.portal img').style.transform = `translate(${inner - F.x * k}px,${inner - F.y * k}px) scale(${k})`;
  foot.style.transformOrigin = `${F.x}px ${F.y}px`;
  foot.style.transform = `scale(${1 + .06 * seg(u, 0, d)})`;
  foot.style.filter = `blur(${(9 * seg(u, .3, .8)).toFixed(2)}px)`;
}

// ------------------------------------------------------------ 08 growth curve
const growPath = (() => {
  let d = '';
  for (let i = 0; i <= 60; i++) {
    const x = -10 + i * 1100 / 60, f = clamp(x / 1080);
    const y = 1600 - 1170 * f ** 2.4 + (18 * Math.sin(x / 37) + 12 * Math.sin(x / 13)) * (1 - f * .6);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
})();
$('#g-growth .line').setAttribute('d', growPath);
$('#g-growth .area').setAttribute('d', growPath + 'L1090,1920L-10,1920Z');
let growLen = 0;
function growth(u, d) {
  show($('#bg-growth')); show($('#g-growth')); show(person); show(foot, false);
  const line = $('#g-growth .line');
  growLen = growLen || line.getTotalLength();
  const q = io(seg(u, .1, d - .1)), p = line.getPointAtLength(growLen * q);
  line.style.strokeDasharray = growLen;
  line.style.strokeDashoffset = growLen * (1 - q);
  $('#grow rect').setAttribute('width', p.x);
  const dot = $('#g-growth .dot');
  dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
  $('#g-growth .badge b').textContent = Math.max(1, Math.round(1 + 9 * q ** 2)) + '×';
  $('#g-growth .badge').style.transform = `scale(${back(seg(u, 0, .3))})`;
  cam(1 + .03 * seg(u, 0, d));
}

// ------------------------------------------------------------ 09 studio reveal
function studio(u) {
  show($('#bg-studio')); show($('#g-studio')); show(person); show(foot, false);
  const on = u > .38 ? 1 : u > .22 && u < .27 ? .75 : .15;
  $$('#g-studio .soft').forEach(s => {
    s.style.opacity = .35 + .65 * on;
    s.style.boxShadow = `0 0 ${150 * on}px ${55 * on}px rgba(255,255,255,${(.55 * on).toFixed(2)})`;
  });
  const air = $('#g-studio .onair');
  air.style.opacity = on > .5 ? 1 : .25;
  air.style.boxShadow = on > .5 ? '0 0 40px rgba(238,68,35,.8)' : 'none';
  $('#bg-studio').style.filter = `brightness(${lerp(.45, 1, on)})`;
  person.style.filter = `brightness(${lerp(.55, 1.05, on)})`;
}

// ------------------------------------------------------------ 10 b-roll overlay
$('.tline .thumbs').innerHTML = '<i></i>'.repeat(16);
function broll(u, d) {
  show($('#broll'));
  const k = out(seg(u, 0, .35)), k2 = out(seg(u, .1, .45));
  $('#broll .editor').style.transform = `translateY(${(1 - k) * 120}px)`;
  $('#broll .editor').style.opacity = k;
  $('#broll .tline').style.transform = `translateY(${(1 - k2) * 120}px)`;
  $('#broll .tline').style.opacity = k2;
  $('#broll .head').style.left = lerp(120, 980, seg(u, .2, d)) + 'px';
  show($('#broll .canvas'), !META.screenFrames);
  show($('#broll img.screen'), !!META.screenFrames);
}

// ------------------------------------------------------------ 11 paper cutout
const SHAPES = [  // kind, x, y, size, colour, tilt
  ['star', 60, 560, 200, '#111', -8], ['dot', 760, 560, 300, 'var(--blue)'], ['dot', 860, 1150, 58, '#fff'],
  ['dot', 70, 1190, 36, 'var(--blue)'], ['dot', 985, 990, 28, '#fff'],
  ['bar', 620, 1390, [560, 82], '#111', -18], ['bar', -80, 1310, [440, 64], '#fff', -18],
];
$('#g-paper').innerHTML = SHAPES.map(([kind, x, y, s, col, r]) => kind === 'star'
  ? `<svg class="shape" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px" viewBox="-50 -50 100 100"><polygon fill="${col}" points="${
    Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 21 : 50; return `${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}"/></svg>`
  : kind === 'dot' ? `<div class="shape dot" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${col}"></div>`
  : `<div class="shape" style="left:${x}px;top:${y}px;width:${s[0]}px;height:${s[1]}px;background:${col}"></div>`).join('');
function paper(u) {
  show($('#bg-paper')); show($('#g-paper')); show(person); show(foot, false);
  person.classList.add('sticker');
  const k = out(seg(u, 0, .4));
  person.style.transformOrigin = '540px 1920px';
  person.style.transform = `scale(${lerp(1.07, 1, k)}) rotate(${lerp(-2.5, 0, k)}deg)`;
  $$('#g-paper .shape').forEach((el, i) => {
    const p = back(seg(u, .05 + i * .06, .4 + i * .06)), r = SHAPES[i][5] || 0;
    el.style.transform = `scale(${p}) rotate(${r + (1 - p) * 40}deg)`;
  });
}

// ------------------------------------------------------------ 12 dolly zoom
function dolly(u, d) {
  const plate = $('#plate');
  show(plate); show(person); show(foot, false);
  plate.style.transformOrigin = `${F.x}px ${F.y}px`;
  plate.style.transform = `scale(${lerp(1.45, 1, io(seg(u, 0, d)))})`;
  plate.style.filter = 'blur(1.5px)';
}

// ------------------------------------------------------------ 13 magazine cover
function magazine(u) {
  show($('#bg-mag')); show($('#g-mag')); show(person); show(foot, false);
  const k = out(seg(u, 0, .4));
  cam(lerp(1.06, 1, k));
  const mast = $('#g-mag .mast');
  mast.style.transform = `translateY(${(1 - k) * -40}px)`;
  mast.style.opacity = k;
  $$('#g-mag .l, #g-mag .r, #g-mag .top, #g-mag .code').forEach((el, i) => { el.style.opacity = out(seg(u, .15 + i * .08, .45 + i * .08)); });
  $('#g-mag .seal').style.transform = `scale(${back(seg(u, .45, .8))}) rotate(-12deg)`;
}

// ------------------------------------------------------------ 14 liquid glass
function glass(u, d) {
  show($('#g-glass'));
  const w = 500, h = 320, p = seg(u, 0, d);
  const cx = 540 + 920 * (2 * p - 1) ** 3, cy = F.y + .3 * F.w + 28 * Math.sin(u * 3), x = cx - w / 2, y = cy - h / 2, k = 1.25;
  const lens = $('#g-glass .lens'), s = Math.sin(u * 5), c = Math.cos(u * 4);
  Object.assign(lens.style, {
    left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px',
    borderRadius: `${48 + 8 * s}% ${52 - 8 * s}% ${50 + 6 * c}% ${50 - 6 * c}% / ${55 + 7 * c}% ${45 - 7 * s}% ${50 + 6 * s}% ${50 - 6 * c}%`,
  });
  $('#g-glass .lens img').style.transform = `translate(${w / 2}px,${h / 2}px) scale(${k}) translate(${-cx}px,${-cy}px)`;
}

// ------------------------------------------------------------ 15 zoom-through cut
function through(u, d) {
  const a = Math.min(.42, d * .35);
  if (u < a) { const k = inn(u / a); cam(1 + 1.9 * k, F.x, F.y + .25 * F.w, 14 * k); }
  else { const k = expo(seg(u, a, a + .5)); cam(lerp(1.7, 1, k), F.x, F.y, lerp(8, 0, k)); }
}

// ------------------------------------------------------------ 16 green screen
const skySvg = (() => {
  const r = rng(11);
  let s = '';
  for (let x = -10; x < 1090;) {
    const w = 80 + r() * 120, top = 560 + r() * 380;
    s += `<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${(w + 2).toFixed(0)}" height="${(1920 - top).toFixed(0)}" fill="#0B0A14"/>`;
    for (let wy = top + 24; wy < 1900; wy += 34)
      for (let wx = x + 14; wx < x + w - 14; wx += 26)
        if (r() < .14) s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="9" height="12" fill="#FF5A3C" opacity="${(.45 + r() * .55).toFixed(2)}"/>`;
    x += w;
  }
  const tower = '<rect x="784" y="300" width="8" height="340" fill="#0B0A14"/><ellipse cx="788" cy="650" rx="46" ry="18" fill="#0B0A14"/><rect x="772" y="640" width="32" height="1280" fill="#0B0A14"/><circle cx="788" cy="300" r="5" fill="#FF5A3C"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1E3AC4"/><stop offset=".3" stop-color="#3B3EC2"/><stop offset=".48" stop-color="#8B4BA6"/><stop offset=".6" stop-color="#EE6A6E"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#sky)"/>${tower}${s}</svg>`;
})();
$('#bg-sky').innerHTML = skySvg;
function green(u, d) {
  const sw = d * .45;
  show(u < sw ? $('#bg-green') : $('#bg-sky')); show(person); show(foot, false);
  if (u >= sw && u < sw + 2 / FPS) { show($('#flash')); $('#flash').style.opacity = .8; }
}

// ------------------------------------------------------------ 17 frame break
const canvas = $('#shatter'), ctx = canvas.getContext('2d');
const off = document.createElement('canvas');
off.width = 1080; off.height = 1920;
const octx = off.getContext('2d');
const skyImg = new Image();
skyImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(skySvg);
const HIT = { x: 830, y: Math.min(1250, F.y + 120) };
const SHARDS = [], CRACKS = [];
(() => {
  const r = rng(5), K = 13, RAD = [0, 140, 330, 620, 1000, 1500, 2300];
  const ang = Array.from({ length: K }, (_, j) => (j + (r() - .5) * .5) * 2 * Math.PI / K);
  const P = (j, m) => { const a = ang[j % K], rr = RAD[m] * (m ? .85 + r() * .3 : 0); return [HIT.x + rr * Math.cos(a), HIT.y + rr * Math.sin(a)]; };
  const pts = Array.from({ length: K }, (_, j) => RAD.map((_, m) => P(j, m)));
  for (let j = 0; j < K; j++) for (let m = 0; m < RAD.length - 1; m++) {
    const a = pts[j][m], b = pts[(j + 1) % K][m], c = pts[(j + 1) % K][m + 1], e = pts[j][m + 1];
    for (const tri of m ? [[a, b, c], [a, c, e]] : [[a, c, e]]) {
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, len = Math.hypot(cx - HIT.x, cy - HIT.y) || 1;
      SHARDS.push({ tri, cx, cy, dx: (cx - HIT.x) / len, dy: (cy - HIT.y) / len, v: 650 + r() * 700, spin: (r() - .5) * 2.4,
        tint: ['rgba(47,91,234,.28)', 'rgba(255,120,170,.22)', 'rgba(255,255,255,.18)', 'rgba(0,0,0,0)'][Math.floor(r() * 4)] });
    }
  }
  for (let j = 0; j < K; j++) CRACKS.push(pts[j].slice(0, 4).map(([x, y], m) => [x + (m ? (r() - .5) * 30 : 0), y + (m ? (r() - .5) * 30 : 0)]));
})();
function breakFx(u, d) {
  show(canvas);
  octx.drawImage(skyImg, 0, 0);
  octx.drawImage(person, 0, 0, 1080, 1920);
  ctx.clearRect(0, 0, 1080, 1920);
  const crack = Math.min(.55, d * .35);
  if (u < crack) {
    ctx.drawImage(off, 0, 0);
    const c = out(u / crack);
    ctx.save();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 8;
    CRACKS.forEach(line => {
      ctx.beginPath(); ctx.moveTo(...line[0]);
      for (let m = 1; m < line.length && m - 1 < c * (line.length - 1); m++) {
        const f = clamp(c * (line.length - 1) - (m - 1));
        ctx.lineTo(lerp(line[m - 1][0], line[m][0], f), lerp(line[m - 1][1], line[m][1], f));
      }
      ctx.stroke();
    });
    ctx.restore();
    return;
  }
  const q = seg(u, crack, d);
  SHARDS.forEach(s => {
    const go = q ** 1.3 * s.v, x = s.dx * go, y = s.dy * go + q * q * 500, a = 1 - seg(q, .5, 1);
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(s.cx + x, s.cy + y); ctx.rotate(s.spin * q); ctx.scale(1 + .3 * q, 1 + .3 * q); ctx.translate(-s.cx, -s.cy);
    ctx.beginPath(); ctx.moveTo(...s.tri[0]); ctx.lineTo(...s.tri[1]); ctx.lineTo(...s.tri[2]); ctx.closePath();
    ctx.save(); ctx.clip(); ctx.drawImage(off, 0, 0); ctx.fillStyle = s.tint; ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  });
  cam(lerp(1.08, 1, out(q)));
}

// ------------------------------------------------------------ 18 digital zoom
function digital(u, d, t) {
  show($('#vf'));
  const k1 = seg(u, .1 * d, .3 * d), k2 = seg(u, .45 * d, .62 * d), k3 = seg(u, .85 * d, d);
  const s = lerp(1 + .6 * out(k1) + 1 * out(k2), 1, io(k3));
  const blur = 14 * (1 - seg(u, 0, .25 * d)) + 5 * Math.sin(Math.PI * k2) + 8 * Math.sin(Math.PI * k3);
  cam(s, F.x, F.y + .2 * F.w, blur);
  $('#vf .zoom').textContent = s.toFixed(1) + '×';
  const f = Math.floor(t * FPS);
  $('#vf .tc').textContent = `00:00:${String(Math.floor(f / FPS)).padStart(2, '0')}:${String(f % FPS).padStart(2, '0')}`;
  $('#vf .rec i').style.opacity = Math.floor(t * 2) % 2 ? .25 : 1;
}

// ------------------------------------------------------------ 19 phone mockup
function phone(u) {
  show($('#phone'));
  const dev = $('#phone .device');
  dev.style.transformOrigin = '50% 50%';
  dev.style.transform = `scale(${lerp(1.95, 1, expo(seg(u, 0, .55)))})`;
}

// ------------------------------------------------------------ 20 checklist
$('#check .grid').innerHTML = NAMES.map(n => `<div class="it"><svg><use href="#check"/></svg>${n}</div>`).join('');
$$('#check .it svg').forEach(s => { const i = document.createElement('i'); s.replaceWith(i); i.appendChild(s); s.classList.add('icon'); });
function checklist(u, d) {
  show($('#check'));
  const n = Math.floor(20 * clamp(u / (d * .85)));
  $('#check .count b').textContent = n;
  $$('#check .it').forEach((el, i) => el.classList.toggle('done', i < n));
  $$('#check .it svg').forEach((s, i) => { s.style.opacity = i < n ? 1 : 0; });
}

const FX = [orbit, chat, escape, snap, pops, storm, portal, growth, studio, broll,
  paper, dolly, magazine, glass, through, green, breakFx, digital, phone, checklist];

// ------------------------------------------------------------ header, label, effect list
$('#title .l1').textContent = C.title[0];
$('#title .l2').textContent = C.title[1];
$('#dashes').innerHTML = '<i></i>'.repeat(20);
$('#lists .left').innerHTML = NAMES.slice(0, 10).map(n => `<i>${n}</i>`).join('');
$('#lists .right').innerHTML = NAMES.slice(10).map(n => `<i>${n}</i>`).join('');
$('#outroTitle').textContent = C.outro;
$$('img.avatar').forEach(i => { i.src = 'work/avatar.jpg'; });
$$('.handle').forEach(e => { e.textContent = C.handle; });
$('#profile .n').textContent = C.name;
$('#o-flow .mini').textContent = C.outro;

function title(big) {
  const el = $('#title');
  show(el);
  el.style.fontSize = lerp(40, 96, big) + 'px';
  el.style.top = lerp(150, 250, big) + 'px';
}

function lists(t, from, exit) {
  show($('#lists'));
  const cols = [$('#lists .left'), $('#lists .right')];
  cols.forEach((col, c) => {
    col.style.transform = `translateX(${(c ? 1 : -1) * 380 * inn(exit)}px)`;
    col.style.opacity = 1 - exit;
    $$('i', col).forEach((el, row) => {
      const k = back(seg(t, from + row * .08, from + row * .08 + .3));
      el.style.transform = `scale(${k})`;
      el.style.opacity = clamp(k * 3);
      const j = c * 10 + row;
      el.classList.toggle('hot', t > THESE + j * .04 && t < THESE + j * .04 + .45);
    });
  });
}

function intro(t) {
  const end = T[0];
  title(1 - io(seg(t, end - .4, end)));
  lists(t, .25, seg(t, end - .35, end));
  show($('#lists .more'), false);
}

function hud(t, i) {
  if (i < 0) return;
  if (i < 19) {
    title(0);
    show($('#dashes'), true, 'flex');
    $$('#dashes i').forEach((d, j) => d.classList.toggle('done', j <= i));
  }
  const chip = $('#chip'), u = t - SEG[i].a;
  show(chip, true, 'flex');
  $('#chip .num').textContent = String(i + 1).padStart(2, '0');
  $('#chip .name').textContent = NAMES[i];
  chip.style.transform = `scale(${lerp(.85, 1, back(seg(u, 0, .25)))})`;
}

// ------------------------------------------------------------ ending
function typed(text, from, t, cps) { return text.slice(0, Math.max(0, Math.floor((t - from) * cps))); }

function outro(t) {
  const { part, a, b } = ENDING.findLast(p => t >= p.a) || ENDING[0];
  const ot = $('#outroTitle');
  if (part !== 'follow') {
    show(ot);
    ot.style.transform = `scale(${back(seg(t, OUT, OUT + .3))})`;
  }
  if (part === 'lists') {
    lists(t, OUT + .3, 0);
    const more = $('#lists .more');
    show(more);
    more.style.transform = `scale(${back(seg(t, OUT + 1.5, OUT + 1.8))})`;
  } else if (part === 'card') {
    show($('#o-card'));
    const card = $('#o-card .ocard'), k = out(seg(t, a, a + .4));
    card.style.transform = `translateY(${(1 - k) * 80}px)`;
    card.style.opacity = k;
    $$('#o-card .tags i').forEach((el, i) => { el.style.opacity = out(seg(t, a + .35 + i * .12, a + .55 + i * .12)); });
    $('#o-card .style').style.opacity = out(seg(t, a + 1.3, a + 1.6));
  } else if (part === 'drop' || part === 'prompt' || part === 'phone') {
    show($('#o-flow'));
    const step = ['drop', 'prompt', 'phone'].indexOf(part);
    show($('#o-flow .steps'), HAS('drop'), 'flex');
    $$('#o-flow .steps i').forEach((el, i) => el.classList.toggle('on', i <= step));
    show($('#o-flow .drop'), part === 'drop', 'flex');
    const drop = cueAfter(a, ['drop'], a + .5), land = drop + .35, file = $('#o-flow .file');
    show(file, part === 'drop' && t > drop - .15, 'flex');
    file.style.transform = `translateY(${(1 - back(seg(t, drop - .15, land))) * -700}px)`;
    $('#o-flow .drop').classList.toggle('got', t > land + .1);
    show($('#o-flow .uploaded'), part === 'drop' && t > land + .1);
    const pr = $('#o-flow .prompt');
    show(pr, part === 'prompt', 'flex');
    if (part === 'prompt') {
      const k = out(seg(t, a, a + .35)), from = Math.min(cueAfter(a, ['prompt', 'want'], a + .4), b - .6);
      pr.style.transform = `translateY(${(1 - k) * 80}px)`;
      pr.style.opacity = k;
      const cps = Math.max(22, C.prompt.length / Math.max(.4, b - from - .3));
      const txt = $('.txt', pr), s = typed(C.prompt, from, t, cps);
      txt.textContent = t < from ? 'Tell Claude what you want…' : s;
      txt.className = 'txt' + (t < from ? ' ph' : '');
      $('.caret', pr).style.opacity = Math.floor(t * 2.5) % 2 ? 0 : 1;
      $('.go', pr).style.transform = `scale(${s.length === C.prompt.length ? 1 + .12 * Math.sin(t * 12) : 1})`;
    }
    const ph = $('#o-flow .ophone');
    show(ph, part === 'phone');
    show($('#o-flow .ready'), part === 'phone' && t > a + .5);
    if (part === 'phone') {
      ph.style.transform = `translateY(${(1 - expo(seg(t, a, a + .5))) * 400}px)`;
      const on = t > a + .45;
      $$('#o-flow .ophone .screen > *:not(.island)').forEach(el => { el.style.visibility = on ? 'visible' : 'hidden'; });
      $('#o-flow .minicap').textContent = wordAt(t);
    }
  } else if (part === 'comment') {
    const cm = $('#comment');
    show(cm, true, 'flex');
    cm.style.transform = `translateY(${(1 - out(seg(t, a, a + .35))) * -160}px)`;
    const from = a + .4, cps = Math.max(7, C.comment.length / Math.max(.4, b - from - .5));
    const s = typed(C.comment, from, t, cps), txt = $('.txt', cm);
    txt.textContent = t < from ? 'Add a comment…' : s;
    txt.className = 'txt' + (t < from ? ' ph' : '');
    $('.sent', cm).style.visibility = s.length === C.comment.length && t > from + C.comment.length / cps + .2 ? 'visible' : 'hidden';
  } else {
    const pf = $('#profile');
    show(pf, true, 'flex');
    pf.style.transform = `translateX(-50%) scale(${back(seg(t, a, a + .35))})`;
  }
}

// ------------------------------------------------------------ captions: one word at a time
function wordAt(t) {
  let lo = 0, hi = WORDS.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (WORDS[m].s <= t) { k = m; lo = m + 1; } else hi = m - 1; }
  if (k < 0) return '';
  const w = WORDS[k], next = WORDS[k + 1];
  return t < Math.min(next ? next.s : 1e9, w.e + .6) ? w.w.replace(/^[^\w']+|[^\w']+$/g, '') : '';
}

// ------------------------------------------------------------ one frame
const FXEL = $$('.fx'), HUDEL = ['#title', '#chip', '#dashes', '#lists', '#outroTitle', '#comment', '#profile'].map(s => $(s));
function reset() {
  cam();
  FXEL.forEach(e => { e.style.display = 'none'; });
  HUDEL.forEach(e => { e.style.display = 'none'; });
  foot.style.cssText = '';
  person.style.cssText = '';
  person.className = 'cut full';
}

window.render = async t => {
  const n = clamp(Math.round(t * FPS), 0, META.frames - 1);
  const i = t < T[0] || t >= OUT ? -1 : SEG.findIndex(s => t >= s.a && t < s.b);
  await setFrame(n, Math.max(0, n - Math.round(SEG[9].a * FPS)));
  reset();
  if (t < T[0]) intro(t);
  else if (i >= 0) { const s = SEG[i]; FX[i](t - s.a, s.b - s.a, t); }
  else outro(t);
  hud(t, i);
  const w = wordAt(t);
  $('#cap .s').textContent = w;
  $('#cap .f').textContent = w;
};

(async () => {
  // fonts load only when something visible uses them, so load every weight up front
  await Promise.all([...['500', '600', '700', '800'].map(w => document.fonts.load(`${w} 40px PJS`)), document.fonts.load('500 24px Mono')]);
  await skyImg.decode();
  // the magazine title fills the width, however long the name is
  const mast = $('#g-mag .mast'), g = $('#g-mag');
  mast.innerHTML = '<span></span>';
  mast.firstChild.textContent = C.masthead;
  mast.style.fontSize = '200px';
  g.style.display = 'block';
  mast.style.fontSize = Math.min(330, 200 * 1000 / mast.firstChild.getBoundingClientRect().width) + 'px';
  g.style.display = '';
  await window.render(0);
  window.READY = true;
})();
