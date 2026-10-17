// Stackle channel intro.
// One paused GSAP timeline plus a few per-frame draws, so window.render(t)
// always produces the same frame for the same t. Timing comes from the
// voiceover word cues in cues.js; swap the take, regenerate cues, re-render.
gsap.registerPlugin(SplitText, DrawSVGPlugin, CustomEase);

const OFF = VO.offset;                       // voice starts this far into the video
const END = OFF + VO.duration + 2.4;         // hold the logo, then cut
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

// deterministic helpers
function hash(a, b) {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
const cam = { z: 1, x: 0, y: 0, rx: 0, ry: 0, rz: 0, punch: 0, shake: 0, ca: 0, boost: 0, net: 0, glow: .7, grid: 0, pipe: 0 };

function sfx(t, file, gain = 1) { window.SFX.push({ t: +t.toFixed(3), file, gain }); }
function show(sel, a, b) {
  tl.set(sel, { autoAlpha: 1 }, a);
  if (b != null) tl.set(sel, { autoAlpha: 0 }, b);
}
function impact(t, k = 1, file = 'impact_1', gain = 1) {
  tl.fromTo(cam, { shake: k }, { shake: 0, duration: .7, ease: 'power3.out', immediateRender: false }, t);
  tl.fromTo(cam, { ca: k }, { ca: 0, duration: .4, ease: 'power2.out', immediateRender: false }, t);
  tl.fromTo(cam, { punch: .05 * k }, { punch: 0, duration: .8, ease: 'expo.out', immediateRender: false }, t);
  tl.fromTo('#flash', { opacity: .5 * k }, { opacity: 0, duration: .6, ease: 'power2.out', immediateRender: false }, t);
  if (file) sfx(t, file, gain);
}
function whoosh(t, file = 'whoosh_1', y = 540, gain = .8) {
  tl.set('#streak', { top: y, opacity: 1 }, t);
  tl.fromTo('#streak', { x: 0 }, { x: 2600, duration: .5, ease: 'power2.inOut', immediateRender: false }, t);
  tl.set('#streak', { opacity: 0 }, t + .51);
  tl.to(cam, { boost: '+=0.35', duration: .9, ease: 'power2.inOut' }, t - .1);
  sfx(t - .12, file, gain);
}

// scramble-decode text, monospace so the width never jumps
const scr = [];
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
function scramble(sel, t0, dur = .8) {
  const el = $(sel);
  scr.push({ el, text: el.dataset.scramble, t0, dur });
  tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: .15, ease: 'none' }, t0);
  sfx(t0, 'blips_3', .35);
}
function drawScramble(t) {
  const f = Math.floor(t * 30);
  for (const s of scr) {
    const p = (t - s.t0) / s.dur, n = s.text.length;
    let out = '';
    for (let i = 0; i < n; i++) {
      const c = s.text[i], appear = (i / n) * .5, settle = .35 + (i / n) * .65;
      if (p < appear || c === ' ') out += ' ';
      else if (p >= settle) out += c;
      else out += GLYPHS[Math.floor(hash(i + 31 * n, f) * GLYPHS.length)];
    }
    if (s.el.textContent !== out) s.el.textContent = out;
  }
}

// counters
const ctr = [];
function counter(sel, to, t0, t1, ease = 'power3.out') {
  ctr.push({ el: $(sel), to, t0, t1, e: gsap.parseEase(ease), last: null });
}
function drawCounters(t) {
  for (const c of ctr) {
    const v = Math.round(c.to * c.e(clamp((t - c.t0) / (c.t1 - c.t0))));
    const s = v.toLocaleString('en-US');
    if (s !== c.last) { c.el.textContent = s; c.last = s; }
  }
}

// words that rise out of a mask on their own cue
function maskWords(el) {
  el.innerHTML = el.innerHTML.trim().split(/\s+/).map(w => `<span class="wm"><span class="wi">${w}</span></span>`).join(' ');
  return $$(`#${el.id} .wi`);
}

// ---------------------------------------------------------------- background
const bg = $('#bg').getContext('2d');
const R = rng(11);
const PARTS = Array.from({ length: 170 }, () => ({ x: (R() - .5) * 2.6, y: (R() - .5) * 1.6, z: R(), s: .5 + R() * 1.8, tw: R() * 6.28, hot: R() < .18 }));
const NODES = Array.from({ length: 64 }, () => ({ x: 80 + R() * 1760, y: 90 + R() * 900, ph: R() * 6.28 }));
const EDGES = [];
NODES.forEach((a, i) => NODES.forEach((b, j) => { if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 250) EDGES.push([i, j]); }));
const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
{ const g = sprite.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(225,240,255,1)'); r.addColorStop(.18, 'rgba(34,211,238,.85)'); r.addColorStop(.45, 'rgba(79,139,255,.22)'); r.addColorStop(1, 'rgba(79,139,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); }

function orb(x, y, r, c) {
  const g = bg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
  bg.fillStyle = g; bg.fillRect(x - r, y - r, r * 2, r * 2);
}
function drawBg(t) {
  const travel = t * .045 + cam.boost;
  const base = bg.createRadialGradient(960, 470, 0, 960, 540, 1250);
  base.addColorStop(0, '#16203d'); base.addColorStop(.55, '#0b1124'); base.addColorStop(1, '#04060d');
  bg.globalCompositeOperation = 'source-over';
  bg.fillStyle = base; bg.fillRect(0, 0, 1920, 1080);
  bg.globalCompositeOperation = 'lighter';
  orb(960 + Math.sin(t * .21) * 420, 430 + Math.cos(t * .17) * 130, 950, `rgba(79,139,255,${.12 * cam.glow})`);
  orb(260 + Math.cos(t * .13) * 220, 930, 760, 'rgba(99,102,241,.09)');
  orb(1700, 160 + Math.sin(t * .11) * 90, 640, 'rgba(34,211,238,.05)');

  // perspective floor grid that flows toward the camera
  if (cam.grid > 0) {
    const hy = 690, vx = 960 + Math.sin(t * .31) * 30;
    bg.lineWidth = 1.2;
    for (let k = -26; k <= 26; k++) {
      const xb = vx + k * 150;
      const g = bg.createLinearGradient(0, hy, 0, 1080);
      g.addColorStop(0, 'rgba(79,139,255,0)'); g.addColorStop(1, `rgba(79,139,255,${.16 * cam.grid})`);
      bg.strokeStyle = g; bg.beginPath(); bg.moveTo(vx + k * 6, hy); bg.lineTo(xb + (xb - vx) * 1.2, 1080); bg.stroke();
    }
    const fr = (travel * 6) % 1;
    for (let i = 0; i < 16; i++) {
      const z = 16 - i - fr, y = hy + 1400 / (z + 3.2) - 1400 / 19.2;
      if (y > 1080) continue;
      const a = clamp((y - hy) / 390) * .2 * cam.grid;
      bg.strokeStyle = `rgba(79,139,255,${a})`; bg.beginPath(); bg.moveTo(0, y); bg.lineTo(1920, y); bg.stroke();
    }
    const hg = bg.createLinearGradient(0, hy - 60, 0, hy + 60);
    hg.addColorStop(0, 'rgba(79,139,255,0)'); hg.addColorStop(.5, `rgba(79,139,255,${.12 * cam.grid})`); hg.addColorStop(1, 'rgba(79,139,255,0)');
    bg.fillStyle = hg; bg.fillRect(0, hy - 60, 1920, 120);
  }

  // network constellation for the community scene
  if (cam.net > 0.01) {
    bg.lineWidth = 1;
    for (const [i, j] of EDGES) {
      const a = NODES[i], b = NODES[j];
      const pulse = .5 + .5 * Math.sin(t * 2 + a.ph + b.ph);
      bg.strokeStyle = `rgba(79,139,255,${.13 * cam.net * pulse})`;
      bg.beginPath(); bg.moveTo(a.x, a.y); bg.lineTo(b.x, b.y); bg.stroke();
    }
    for (const n of NODES) {
      const s = 10 + 6 * Math.sin(t * 1.7 + n.ph);
      bg.globalAlpha = .55 * cam.net; bg.drawImage(sprite, n.x - s, n.y - s, s * 2, s * 2);
    }
    bg.globalAlpha = 1;
  }

  // drifting dust and bokeh, moving toward the camera
  for (const p of PARTS) {
    const z = ((p.z - travel) % 1 + 1) % 1, sc = 1 / (.12 + z * 1.3);
    const x = 960 + p.x * 620 * sc - cam.x * .3, y = 540 + p.y * 620 * sc - cam.y * .3;
    if (x < -80 || x > 2000 || y < -80 || y > 1160) continue;
    const s = p.s * sc * (p.hot ? 3.4 : 1.7);
    const a = clamp(z * 3) * clamp((1 - z) * 4) * (.45 + .55 * Math.sin(t * 1.3 + p.tw) ** 2) * (p.hot ? .5 : .8);
    bg.globalAlpha = a; bg.drawImage(sprite, x - s, y - s, s * 2, s * 2);
  }
  bg.globalAlpha = 1;
  bg.globalCompositeOperation = 'source-over';
}

// ---------------------------------------------------------------- overlays
const camEl = $('#cam');
function drawCam(t) {
  const sx = cam.shake * 16 * (Math.sin(t * 93) + .6 * Math.sin(t * 141 + 1.3));
  const sy = cam.shake * 12 * (Math.sin(t * 87 + 2.1) + .6 * Math.sin(t * 133));
  const x = cam.x + Math.sin(t * .31) * 10 + sx, y = cam.y + Math.cos(t * .23) * 7 + sy;
  const z = cam.z * (1 + .012 * Math.sin(t * .27)) * (1 + cam.punch);
  camEl.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${z.toFixed(4)}) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotate(${(cam.rz + Math.sin(t * .19) * .22).toFixed(3)}deg)`;
  const ca = cam.ca;
  camEl.style.filter = ca > .03 ? `drop-shadow(${(ca * 7).toFixed(1)}px 0 0 rgba(255,50,90,.5)) drop-shadow(${(-ca * 7).toFixed(1)}px 0 0 rgba(40,200,255,.45))` : 'none';
}
const CHAPTERS = [];
function drawHud(t) {
  let c = CHAPTERS[0];
  for (const ch of CHAPTERS) if (t >= ch[0]) c = ch;
  const num = $('#hud-num'), chap = $('#hud-chap');
  if (num.textContent !== c[1]) { num.textContent = c[1]; chap.textContent = c[2]; }
  $('#hud-prog').style.width = (clamp(t / (END - 2.4)) * 100).toFixed(2) + '%';
}
const grain = $('#grain');
function drawGrain(t) {
  const f = Math.floor(t * 30);
  grain.style.backgroundPosition = `${Math.floor(hash(f, 1) * 256)}px ${Math.floor(hash(f, 2) * 256)}px`;
}
function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), d = g.createImageData(256, 256), r = rng(5);
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  grain.style.backgroundImage = `url(${c.toDataURL()})`;
}

// ---------------------------------------------------------------- builders
function buildStack(svg) {
  const plates = [['#1B2440', '#141B33', '#0F1529', 'rgba(79,139,255,.85)'], ['#F1F5FF', '#CBD5E8', '#A9B6D0', null], ['#4F8BFF', '#1E40AF', '#1E3A8A', null]];
  svg.innerHTML = plates.map((c, i) => {
    const y = 140 - i * 34;
    return `<g class="plate"><polygon points="30,${y} 100,${y + 40} 100,${y + 54} 30,${y + 14}" fill="${c[1]}"/>` +
      `<polygon points="100,${y + 40} 170,${y} 170,${y + 14} 100,${y + 54}" fill="${c[2]}"/>` +
      `<polygon points="100,${y - 40} 170,${y} 100,${y + 40} 30,${y}" fill="${c[0]}"${c[3] ? ` stroke="${c[3]}" stroke-width="2.5"` : ''}/></g>`;
  }).join('');
  return [...svg.querySelectorAll('.plate')];
}
function sparkPaths(seed) {
  const r = rng(seed), n = 22, pts = [];
  let v = 8;
  for (let i = 0; i < n; i++) { v += 1 + r() * 5 * (i / n + .4); pts.push([i * 442 / (n - 1), v]); }
  const max = pts[n - 1][1];
  const P = pts.map(([x, y]) => [x, 76 - y / max * 70]);
  let d = `M${P[0][0]},${P[0][1].toFixed(1)}`;
  for (let i = 1; i < n; i++) {
    const [x0, y0] = P[i - 1], [x1, y1] = P[i], mx = (x0 + x1) / 2;
    d += ` C${mx.toFixed(1)},${y0.toFixed(1)} ${mx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return { line: d, area: d + ' L442,80 L0,80 Z' };
}

let pipe = null;
function drawPipe(t) {
  if (!pipe || cam.pipe <= 0) { if (pipe) pipe.dots.forEach(d => d.setAttribute('opacity', 0)); return; }
  pipe.dots.forEach((d, i) => {
    const u = ((t * .55 + i / pipe.dots.length) % 1);
    d.setAttribute('cx', (pipe.x0 + u * (pipe.x1 - pipe.x0)).toFixed(1));
    d.setAttribute('opacity', (cam.pipe * Math.sin(u * Math.PI)).toFixed(3));
  });
}

// ---------------------------------------------------------------- the edit
function build() {
  makeGrain();

  // layout measurements first, before any tween moves things
  const dotR = $('#s9-dotchar').getBoundingClientRect(), lockR = $('#s9-lock').getBoundingClientRect();
  const dotX = dotR.left + dotR.width * .5, dotY = dotR.top + dotR.height * .72;
  const flyOrigin = `${dotX - lockR.left}px ${dotY - lockR.top}px`;
  const pr = $('#s6-pipe').getBoundingClientRect(), pa = $('#pill-de').getBoundingClientRect(), pb = $('#pill-ai').getBoundingClientRect();
  const px0 = pa.right - pr.left + 18, px1 = pb.left - pr.left - 18;
  const nameR = $('#s1-name').getBoundingClientRect(), ruleR = $('#s1-line').getBoundingClientRect();
  Object.assign($('#s1-burst').style, { left: `${nameR.left + nameR.width / 2}px`, top: `${nameR.top + nameR.height / 2}px` });
  Object.assign($('#flare').style, { left: `${ruleR.left + 440}px`, top: `${ruleR.top + 2}px` });

  // timing landmarks (seconds of video)
  const S2 = at('i', 0) + .75;           // hold the name a beat into the next line
  const S3 = at('i', 1) + .02;           // "I have interviewed"
  const S4 = at('so', 0) - .05;          // "So I know exactly"
  const S5 = at('i', 3) + .02;           // "I have also sat"
  const S6 = at('today') - .02;
  const S7 = at('more', 2) - .02;        // "More than 13,000"
  const S8 = at('on', 2) - .05;          // "On this channel"
  const S9 = at('so', 1) - .02;          // "So let's get into it"
  const LOCK = atEnd('it') + .06;
  CHAPTERS.push([0, '01', 'HELLO'], [S2, '02', 'EXPERIENCE'], [S3, '03', 'HIRING'], [S4, '04', 'INSIGHT'],
    [S5, '05', 'THE OTHER SIDE'], [S6, '06', 'STACKLE'], [S7, '07', 'COMMUNITY'], [S8, '08', 'THE MISSION']);

  // whole-piece moves
  tl.to(cam, { glow: 1, duration: END, ease: 'none' }, 0);
  tl.fromTo('#black', { opacity: 1 }, { opacity: 0, duration: .7, ease: 'power2.out' }, 0);
  tl.fromTo(cam, { z: 1.12 }, { z: 1, duration: 2.6, ease: 'expo.out' }, 0);
  tl.fromTo(cam, { grid: 0 }, { grid: 1, duration: 1.8, ease: 'power2.out' }, .1);
  whoosh(.05, 'whoosh_4', 540, .9);
  tl.fromTo('#flare', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, .15);
  tl.to('#flare', { opacity: 0, duration: 1.2, ease: 'power2.in' }, at('chris') - .9);
  tl.fromTo('#flare', { scaleX: 1.6, opacity: .9 }, { scaleX: 2.6, opacity: 0, duration: 1, ease: 'expo.out', immediateRender: false }, at('chris') + .04);
  tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .6 }, S2);
  tl.to('#hud', { autoAlpha: 0, duration: .3 }, S9);
  sfx(0, 'bed', 1);

  // S1 · name ---------------------------------------------------------------
  show('#s1', .2, S2 + .5);
  scramble('#s1-tag', at('hi') - .05, 1.1);
  tl.fromTo('#s1-myname', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, at('my') - .08);
  const nameChars = SplitText.create('#s1-name', { type: 'chars', mask: 'chars' }).chars;
  const tChris = at('chris');
  tl.fromTo(nameChars, { yPercent: 115, rotation: 6 }, { yPercent: 0, rotation: 0, duration: .9, ease: 'expo.out', stagger: .045 }, tChris - .14);
  impact(tChris + .04, 1, 'impact_1', 1);
  tl.fromTo('#s1-burst', { scale: .3, opacity: 1 }, { scale: 4.2, opacity: 0, duration: 1.1, ease: 'expo.out', immediateRender: false }, tChris + .04);
  tl.fromTo('#s1-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.out' }, tChris + .1);
  // the portrait rises in on "Hi" and pulses with the name
  const tHi = at('hi');
  tl.fromTo('#s1-disc', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, tHi - .2);
  tl.fromTo('#s1-ring', { scale: .6, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, tHi);
  tl.to('#s1-ring', { rotation: 50, duration: S2 - tHi - 1.6, ease: 'none' }, tHi + 1.6);
  tl.fromTo('#s1-img', { y: 170, opacity: 0, scale: 1.05 }, { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'expo.out' }, tHi + .05);
  tl.fromTo('#s1-glow', { opacity: 0 }, { opacity: .42, duration: 1.2 }, tHi + .3);
  tl.fromTo('#s1-photo', { scale: 1 }, { scale: 1.04, duration: S2 - tHi, ease: 'none' }, tHi);
  sfx(tHi + .02, 'whoosh_3', .35);
  tl.fromTo('#s1-glow', { opacity: .95 }, { opacity: .42, duration: .9, ease: 'power2.out', immediateRender: false }, tChris + .04);
  tl.fromTo('#s1-disc', { scale: 1.12 }, { scale: 1, duration: .9, ease: 'expo.out', immediateRender: false }, tChris + .04);
  tl.to('#s1-photo', { x: 300, opacity: 0, duration: .45, ease: 'power2.in' }, S2 - .3);
  scramble('#s1-full', tChris + .3, .7);
  scramble('#s1-role', tChris + .45, .7);
  tl.to('#s1-wrap', { scale: 1.55, opacity: 0, duration: .5, ease: 'power2.in' }, S2 - .08);
  whoosh(S2 - .05, 'whoosh_1', 540, .8);

  // S2 · 10+ years ----------------------------------------------------------
  show('#s2', S2, S3 + .5);
  const segG = $('#s2-segs');
  for (let i = 0; i < 10; i++) {
    const a0 = (-90 + i * 36 + 2) * Math.PI / 180, a1 = (-90 + (i + 1) * 36 - 2) * Math.PI / 180, r = 270;
    segG.insertAdjacentHTML('beforeend', `<path class="seg" d="M${(r * Math.cos(a0)).toFixed(1)},${(r * Math.sin(a0)).toFixed(1)} A${r},${r} 0 0 1 ${(r * Math.cos(a1)).toFixed(1)},${(r * Math.sin(a1)).toFixed(1)}"/>`);
  }
  tl.fromTo('#s2-ring', { scale: .7, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .9, ease: 'expo.out' }, S2);
  tl.fromTo('#s2-dash', { rotation: 0 }, { rotation: 90, duration: S3 - S2 + .5, ease: 'none', svgOrigin: '0 0' }, S2);
  const t10 = at('10');
  counter('#s2-count', 10, S2 + .1, t10 + .12, 'power2.inOut');
  const segs = $$('#s2-segs .seg');
  // light each segment as the counter passes its number
  const inv = p => { let lo = 0, hi = 1; const e = gsap.parseEase('power2.inOut'); for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; e(m) < p ? lo = m : hi = m; } return lo; };
  segs.forEach((s, i) => {
    const ts = S2 + .1 + inv((i + 1) / 10) * (t10 + .12 - S2 - .1);
    tl.to(s, { stroke: '#4F8BFF', duration: .18, ease: 'none' }, ts - .1);
  });
  sfx(S2 + .15, 'blips_1', .45);
  tl.set(segs, { filter: 'drop-shadow(0 0 14px rgba(79,139,255,.9))' }, t10 + .1);
  impact(t10 + .1, .45, 'impact_2', .45);
  scramble('#s2-tag', S2 + .15, .6);
  tl.fromTo('#s2-years', { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'expo.out' }, S2 + .25);
  tl.fromTo('#s2-h', { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'expo.out' }, S2 + .4);
  tl.to('#s2', { x: -340, opacity: 0, duration: .5, ease: 'power2.in' }, S3 - .2);
  whoosh(S3 - .1, 'whoosh_3', 540, .8);

  // S3 · 200+ engineers, four industries -----------------------------------
  show('#s3', S3, S4 + .4);
  tl.fromTo('#s3-a', { x: 340, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: 'expo.out' }, S3);
  const grid = $('#s3-grid');
  grid.innerHTML = Array.from({ length: 200 }, () => '<svg class="people" viewBox="0 0 30 36"><circle cx="15" cy="9" r="7"/><path d="M2 36c0-8.5 5.8-13.5 13-13.5S28 27.5 28 36z"/></svg>').join('');
  const people = $$('#s3-grid svg');
  scramble('#s3-tag', S3 + .05, .7);
  const t200 = at('200');
  counter('#s3-count', 200, S3 + .15, t200 + .35, 'power2.inOut');
  tl.fromTo(people, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(2.2)', stagger: { grid: [10, 20], from: 'start', amount: 1.1 } }, S3 + .1);
  tl.to(people, { fill: '#4F8BFF', duration: .25, ease: 'none', stagger: { grid: [10, 20], from: 'start', amount: 1.1 } }, S3 + .35);
  sfx(S3 + .2, 'blips_2', .4);
  tl.fromTo('#s3-label', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, at('engineers', 0) - .05);
  const tFor = at('for', 1);
  tl.to('.s3-head', { scale: .6, y: -110, transformOrigin: '0% 0%', duration: .8, ease: 'power3.inOut' }, tFor - .35);
  tl.to('#s3-grid', { scale: .6, y: -150, opacity: .45, transformOrigin: '100% 0%', duration: .8, ease: 'power3.inOut' }, tFor - .35);
  scramble('#s3-for', tFor, .6);
  [['#ic1', 'healthcare'], ['#ic2', 'banking'], ['#ic3', 'automotive'], ['#ic4', 'financial']].forEach(([sel, w], i) => {
    const t = at(w) - .12;
    tl.fromTo(sel, { rotationX: -95, y: 60, opacity: 0, transformPerspective: 1200 }, { rotationX: 0, y: 0, opacity: 1, duration: .75, ease: 'back.out(1.4)' }, t);
    tl.fromTo(`${sel} svg *`, { drawSVG: '0%' }, { drawSVG: '100%', duration: .8, ease: 'power2.inOut', stagger: .06 }, t + .1);
    tl.fromTo(sel, { boxShadow: '0 0 0 rgba(79,139,255,0)' }, { boxShadow: '0 0 60px rgba(79,139,255,.35)', duration: .25, yoyo: true, repeat: 1 }, t + .3);
    sfx(t + .05, 'whoosh_2', .35);
  });
  tl.to('.icard', { rotationX: 70, y: 120, opacity: 0, duration: .45, ease: 'power2.in', stagger: .05 }, S4 - .3);
  tl.to('#s3-a', { y: -120, opacity: 0, duration: .45, ease: 'power2.in' }, S4 - .3);
  whoosh(S4 - .08, 'whoosh_2', 540, .8);

  // S4 · hired vs rejected -------------------------------------------------
  show('#s4', S4, S5 + .3);
  scramble('#s4-tag', S4 + .05, .8);
  tl.fromTo('#s4-roll', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' }, at('what', 0) - .1);
  const tHired = at('hired', 0);
  tl.fromTo('#s4-hired', { scale: 1.9, rotation: -9, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: .45, ease: 'power4.out' }, tHired - .05);
  impact(tHired + .02, .9, 'impact_2', .8);
  tl.to('#s4-roll', { y: -130, duration: .5, ease: 'power3.inOut' }, at('and', 1) - .15);
  const tRej = at('rejected');
  tl.fromTo('#s4-rej', { scale: 1.9, rotation: 8, opacity: 0 }, { scale: 1, rotation: 3, opacity: 1, duration: .45, ease: 'power4.out' }, tRej - .05);
  impact(tRej + .02, .7, 'impact_2', .6);
  tl.fromTo('#s4-strike', { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, tRej + .3);
  tl.to('#s4-hired', { scale: 1.06, duration: .5, ease: 'power2.out' }, tRej + .35);
  tl.to('#s4-rej', { opacity: .55, duration: .5 }, tRej + .6);
  tl.to('#s4', { rotationY: -60, x: -200, opacity: 0, transformPerspective: 1600, duration: .5, ease: 'power2.in' }, S5 - .25);
  whoosh(S5 - .1, 'whoosh_4', 540, .8);

  // S5 · the other side of the table ---------------------------------------
  show('#s5', S5, S6 + .3);
  tl.fromTo('#s5', { rotationY: 60, x: 200, transformPerspective: 1600 }, { rotationY: 0, x: 0, duration: .7, ease: 'expo.out' }, S5);
  scramble('#s5-tag', S5 + .05, .7);
  // fade the faces, never the 3D container: opacity on it would flatten the flip
  tl.fromTo('#s5-flip', { y: 40, transformPerspective: 2600 }, { y: 0, duration: .6 }, S5 + .15);
  tl.fromTo('#s5-flip .face', { opacity: 0 }, { opacity: 1, duration: .5 }, S5 + .15);
  const hWords = maskWords($('#s5-h'));
  const iThe = wi('the', 0);
  hWords.forEach((w, k) => tl.fromTo(w, { yPercent: 110 }, { yPercent: 0, duration: .55, ease: 'expo.out' }, WORDS[iThe + k].s + OFF - .08));
  const tOther = at('other');
  tl.to('#s5-flip', { rotationY: 180, duration: .7, ease: 'power3.inOut' }, tOther - .14);
  sfx(tOther, 'whoosh_3', .6);
  const tWith = at('with');
  tl.to(['#s5-tag', '#s5-flip', '#s5-h'], { y: -140, duration: .4, ease: 'power2.in', stagger: .04 }, tWith + .06);
  tl.to(['#s5-tag', '#s5-flip .face', '#s5-h'], { opacity: 0, duration: .35, ease: 'power2.in', stagger: .04 }, tWith + .06);
  const offers = $('#s5-offers');
  const fan = [[-390, 30, -12], [-130, 0, -4], [130, 0, 4], [390, 30, 12]];
  offers.innerHTML = fan.map((_, i) => `<div class="offer"><div class="seal"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9"/></svg></div>
    <div class="ot">OFFER OF EMPLOYMENT</div><div class="co" style="width:${[230, 190, 250, 210][i]}px"></div>
    <div class="ln" style="width:92%"></div><div class="ln" style="width:78%"></div><div class="ln" style="width:86%"></div><div class="ln" style="width:55%"></div>
    <div class="sig">SIGNATURE</div><div class="ring"></div></div>`).join('');
  const cards = $$('.offer');
  const tOffers = at('offers');
  cards.forEach((c, i) => {
    const [x, y, r] = fan[i];
    tl.fromTo(c, { x: x * .2, y: 1250, rotation: r * 3 }, { x, y, rotation: r, duration: .8, ease: 'expo.out' }, tOffers + .1 + i * .15);
    sfx(tOffers + .1 + i * .15, 'whoosh_2', .3);
  });
  tl.fromTo('#s5-cap1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, at('multiple'));
  const tSame = at('same');
  tl.fromTo('#s5-cap2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, tSame - .1);
  tl.to('.offer .ring', { opacity: 1, duration: .2 }, tSame);
  tl.to(cards, { y: '-=24', duration: .35, ease: 'power2.out', yoyo: true, repeat: 1 }, tSame);
  impact(tSame + .02, .5, 'impact_2', .5);
  tl.to(cards, { y: -900, rotation: (i) => fan[i][2] * 2.5, duration: .55, ease: 'power3.in', stagger: .04 }, S6 - .35);
  tl.to('#s5-cap', { opacity: 0, y: -60, duration: .4, ease: 'power2.in' }, S6 - .3);
  whoosh(S6 - .1, 'whoosh_1', 540, .8);

  // S6 · Stackle -------------------------------------------------------------
  show('#s6', S6, S7 + .4);
  scramble('#s6-tag', S6 + .05, .6);
  const plates = buildStack($('#s6-stack'));
  plates.forEach((p, i) => tl.fromTo(p, { y: -280, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'back.out(1.9)' }, S6 + .3 + i * .17));
  sfx(S6 + .3, 'blips_1', .4);
  const tSt = at('stackle');
  tl.fromTo('#s6-word', { clipPath: 'inset(-20% 100% -20% 0%)', x: -40 }, { clipPath: 'inset(-20% 0% -20% 0%)', x: 0, duration: .7, ease: 'expo.out' }, tSt - .06);
  impact(tSt, 1.1, 'impact_3', 1);
  tl.fromTo('#s6-rays', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, tSt);
  tl.fromTo('#s6-rays', { rotation: 0 }, { rotation: 40, duration: S7 - tSt + .5, ease: 'none' }, tSt);
  tl.fromTo('#s6-sub', { letterSpacing: '1.4em', opacity: 0 }, { letterSpacing: '.6em', opacity: 1, duration: 1.1, ease: 'expo.out' }, at('your', 0) - .05);
  $('#pipe-path').setAttribute('d', `M${px0} 60 L${px1} 60`);
  const tDE = at('data', 1), tAI = at('ai');
  tl.fromTo('#pill-de', { x: -160, opacity: 0 }, { x: 0, opacity: 1, duration: .7, ease: 'expo.out' }, tDE - .08);
  sfx(tDE - .08, 'whoosh_2', .35);
  tl.fromTo('#pipe-path', { drawSVG: '0%' }, { drawSVG: '100%', duration: .9, ease: 'power2.inOut' }, tDE + .3);
  tl.fromTo(cam, { pipe: 0 }, { pipe: 1, duration: .5 }, tDE + .7);
  tl.fromTo('#pill-ai', { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: .7, ease: 'expo.out' }, tAI - .08);
  sfx(tAI - .08, 'whoosh_2', .35);
  tl.to('#s6-rays', { opacity: .35, duration: 1 }, tAI);
  tl.to('#s6', { scale: .78, opacity: 0, duration: .5, ease: 'power2.in' }, S7 - .25);
  tl.to(cam, { pipe: 0, duration: .3 }, S7);
  whoosh(S7 - .1, 'whoosh_3', 540, .8);

  // S7 · community -----------------------------------------------------------
  show('#s7', S7, S8 + .4);
  scramble('#s7-tag', S7 + .05, .7);
  tl.to(cam, { net: 1, duration: 1.4, ease: 'power2.out' }, S7);
  tl.to(cam, { grid: .35, duration: 1 }, S7);
  const stats = [['#st1', S7, at('13000'), 13000, 11], ['#st2', at('nearly') - .1, at('4000'), 4000, 23], ['#st3', at('and', 3) - .05, at('500'), 500, 37]];
  stats.forEach(([sel, tIn, tNum, n, seed], i) => {
    const sp = sparkPaths(seed);
    $(`${sel} .spark .line`).setAttribute('d', sp.line);
    $(`${sel} .spark .area`).setAttribute('d', sp.area);
    tl.fromTo(sel, { rotationY: -35, y: 90, opacity: 0, transformPerspective: 1600 }, { rotationY: 0, y: 0, opacity: 1, duration: .8, ease: 'expo.out' }, tIn);
    sfx(tIn, 'whoosh_2', .4);
    counter(`${sel}-n`, n, tIn + .15, tNum + .4, 'power3.inOut');
    sfx(tIn + .2, i === 1 ? 'blips_4' : 'blips_1', .35);
    tl.fromTo(`${sel} .spark .line`, { drawSVG: '0%' }, { drawSVG: '100%', duration: tNum + .4 - tIn, ease: 'power3.inOut' }, tIn + .15);
    tl.fromTo(`${sel} .spark .area`, { opacity: 0 }, { opacity: .9, duration: .6 }, tNum);
    tl.to(`${sel} .hl`, { opacity: 1, duration: .3 }, tIn + .1);
    tl.to(sel, { scale: 1.035, duration: .4 }, tNum);
    if (i > 0) {
      const prev = stats[i - 1][0];
      tl.to(`${prev} .hl`, { opacity: 0, duration: .3 }, tIn);
      tl.to(prev, { scale: 1, opacity: .6, duration: .4 }, tIn);
    }
  });
  tl.to(['#st1', '#st2'], { opacity: 1, duration: .5 }, at('500') + .5);
  tl.to(['#st1 .hl', '#st2 .hl', '#st3 .hl'], { opacity: 1, duration: .3, stagger: .08 }, at('500') + .5);
  tl.to('.stat', { z: 500, opacity: 0, duration: .5, ease: 'power2.in', stagger: .05 }, S8 - .3);
  tl.to(cam, { net: 0, grid: 1, duration: .6 }, S8 - .3);
  whoosh(S8 - .1, 'whoosh_4', 540, .8);

  // S8 · mission -------------------------------------------------------------
  show('#s8', S8, S9);
  scramble('#s8-tag', S8 + .05, .7);
  const line = $('#s8-line');
  const raw = ['I', 'teach', 'you', 'the', 'skills', 'that', '<em>actually</em>', 'get', 'you', '<span class="hl"><i id="s8-mark"></i>hired.</span>'];
  line.innerHTML = raw.map(w => `<span class="wm"><span class="wi">${w}</span></span>`).join(' ');
  const lw = $$('#s8-line .wi');
  const i0 = wi('channel') + 1;
  lw.forEach((w, k) => tl.fromTo(w, { yPercent: 110 }, { yPercent: 0, duration: .5, ease: 'expo.out' }, WORDS[i0 + k].s + OFF - .06));
  const tH2 = at('hired', 1);
  tl.fromTo('#s8-mark', { scaleX: 0 }, { scaleX: 1, duration: .26, ease: 'power3.out' }, tH2 - .04);
    impact(tH2 + .05, .45, 'impact_2', .4);
  const tNo = at('no'), tJust = at('just');
  tl.set(['#s8-tag', '#s8-line'], { autoAlpha: 0 }, tNo - .02);
  tl.set('#s8-nf', { autoAlpha: 1 }, tNo - .02);
  tl.fromTo('#s8-nf', { scale: 1.35 }, { scale: 1, duration: .5, ease: 'expo.out' }, tNo - .02);
  impact(tNo, 1.1, 'impact_2', .9);
  tl.set('#s8-nf', { autoAlpha: 0 }, tJust - .02);
  tl.set('#s8-jw', { autoAlpha: 1 }, tJust - .02);
  tl.fromTo('#s8-jw', { scale: 1.35 }, { scale: 1, duration: .5, ease: 'expo.out' }, tJust - .02);
  impact(tJust, 1.2, 'impact_1', .8);
  sfx(LOCK, 'riser', .9);              // mix.js lines the riser's peak up with the cue

  // S9 · so let's get into it + lockup -------------------------------------
  show('#s9', S9, null);
  const goWords = maskWords($('#s9-go'));
  const iSo = wi('so', 1);
  goWords.forEach((w, k) => tl.fromTo(w, { yPercent: 110 }, { yPercent: 0, duration: .32, ease: 'expo.out' }, WORDS[iSo + k].s + OFF - .05));
  tl.fromTo(cam, { z: 1 }, { z: 1.08, duration: LOCK - S9, ease: 'power1.in', immediateRender: false }, S9);
  tl.to('#s9-go', { scale: 1.4, opacity: 0, duration: .22, ease: 'power2.in' }, LOCK - .18);
  tl.set(cam, { z: 1 }, LOCK);
  const p9 = buildStack($('#s9-stack'));
  tl.fromTo(p9, { y: -60, scale: .2, opacity: 0, transformOrigin: '50% 50%' }, { y: 0, scale: 1, opacity: 1, duration: .6, ease: 'back.out(2.2)', stagger: .06 }, LOCK);
  tl.fromTo('#s9-word', { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: .7, ease: 'expo.out' }, LOCK + .05);
  impact(LOCK, 1.4, 'impact_4', 1);
  tl.fromTo('#s9-lock', { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, LOCK);
  scramble('#s9-meta', LOCK + .3, .8);
  // fly through the blue full stop into the video
  const tFly = END - .95;
  tl.to('#s9-lock', { scale: 42, x: 960 - dotX, y: 540 - dotY, transformOrigin: flyOrigin, duration: .75, ease: 'power4.in' }, tFly);
  tl.fromTo('#s9-dot', { scale: 0 }, { scale: 48, duration: .32, ease: 'power2.in', immediateRender: false }, tFly + .38);
  sfx(tFly + .1, 'whoosh_4', .9);
  tl.to('#black', { opacity: 1, duration: .2, ease: 'none' }, END - .2);

  // pipe dots between the two pills (positions need laid-out fonts)
  $('#pipe-dots').innerHTML = Array.from({ length: 7 }, () => '<circle r="7" cy="60" fill="#22D3EE" opacity="0" style="filter:drop-shadow(0 0 8px #4F8BFF)"/>').join('');
  pipe = { x0: px0, x1: px1, dots: $$('#pipe-dots circle') };

  window.render = t => {
    tl.seek(t, false);
    drawScramble(t); drawCounters(t); drawPipe(t); drawCam(t); drawHud(t); drawGrain(t); drawBg(t);
  };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(build));
