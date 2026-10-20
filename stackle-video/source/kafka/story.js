// Apache Kafka, explained: the story, shared by both cuts. index.html
// (1920×1080) and vertical.html (1080×1920, with captions) have the same
// elements; their stylesheets lay them out, and this file reads positions
// back from the page, so one timeline drives both. Only the background
// fields and the camera moves differ per cut. Shared helpers (cues, timeline,
// icons, background, opening card) are in ../explained/common.js, the mark in
// brand.js, the captions in ../explained/captions.js.

const V = BH > BW;                                  // the vertical cut
const FIELDS = V ? [
  t => [860 + Math.sin(t * .05) * 160, 320 + Math.cos(t * .04) * 120, 820, 'rgba(1,124,238,0.055)'],
  t => [160 + Math.cos(t * .035) * 120, 1480, 760, 'rgba(122,90,248,0.04)'],
  t => [720, 1900 + Math.sin(t * .045) * 70, 650, 'rgba(18,183,106,0.03)'],
] : [
  t => [1500 + Math.sin(t * .05) * 260, 160 + Math.cos(t * .04) * 90, 950, 'rgba(1,124,238,0.055)'],
  t => [260 + Math.cos(t * .035) * 160, 980, 820, 'rgba(122,90,248,0.04)'],
  t => [1150, 1160 + Math.sin(t * .045) * 70, 700, 'rgba(18,183,106,0.03)'],
];

// ---------------------------------------------------------------- helpers
const NS = 'http://www.w3.org/2000/svg';
function svgEl(parent, tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}
// an element's box relative to `root`, from offsets (they ignore transforms)
function box(el, root) {
  let x = el.offsetLeft, y = el.offsetTop, p = el.offsetParent;
  while (p && p !== root) { x += p.offsetLeft + p.clientLeft; y += p.offsetTop + p.clientTop; p = p.offsetParent; }
  const w = el.offsetWidth, h = el.offsetHeight;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
}
// where the line from a box's centre toward (x, y) leaves the box
function exitPt(b, x, y, pad = 0) {
  const dx = x - b.cx, dy = y - b.cy;
  const s = Math.min(dx ? (b.w / 2 + pad) / Math.abs(dx) : Infinity, dy ? (b.h / 2 + pad) / Math.abs(dy) : Infinity);
  return [b.cx + dx * s, b.cy + dy * s];
}
// an S-curve that leaves and arrives horizontally ('h') or vertically ('v')
function curve([x1, y1], [x2, y2], dir) {
  if (dir === 'h') { const m = (x2 - x1) / 2; return `M${x1} ${y1}C${x1 + m} ${y1} ${x2 - m} ${y2} ${x2} ${y2}`; }
  const m = (y2 - y1) / 2;
  return `M${x1} ${y1}C${x1} ${y1 + m} ${x2} ${y2 - m} ${x2} ${y2}`;
}
const line = ([x1, y1], [x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`;
function draw(el, t, d = .6) {
  tl.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, t);
}
function pulse(sel, t) {
  tl.fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, immediateRender: false }, t);
  tl.to(sel, { autoAlpha: 0, duration: .5 }, t + .45);
}
const comp = (sel, t, st = 0) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, stagger: st }, t);

// little dots that keep running along a connection between t0 and t1
const FLOWS = [];
function flow(svg, path, t0, t1, color, { v = 150, gap = 56, n = 3, r = 5 } = {}) {
  const len = path.getTotalLength();
  const dots = Array.from({ length: n }, () => svgEl(svg, 'circle', { r, fill: color, opacity: 0 }));
  FLOWS.push({ path, len, t0, t1, v, gap, dots });
}
function drawFlows(t) {
  for (const f of FLOWS) {
    const fade = clamp((f.t1 - t) / .3);
    f.dots.forEach((el, k) => {
      const s = (t - f.t0) * f.v - k * f.gap, cyc = f.len + f.gap;
      const p = s - Math.floor(s / cyc) * cyc;
      const on = s >= 0 && p <= f.len && fade > 0;
      el.setAttribute('opacity', on ? (Math.min(1, p / 14, (f.len - p) / 14) * fade).toFixed(3) : 0);
      if (!on) return;
      const q = f.path.getPointAtLength(p);
      el.setAttribute('cx', q.x.toFixed(2));
      el.setAttribute('cy', q.y.toFixed(2));
    });
  }
}

// ---------------------------------------------------------------- HUD
const CHAPTERS = [[0, 'The problem'], [at('kafka', 1) - .3, 'What it is'], [at("here's") - .3, 'The core idea'],
  [at('now', 1) - .3, 'Architecture'], [at('team') - .6, 'In short']];
let lastChap = -1;
function drawHud(t) {
  if (!V) $('#hud-prog').style.width = (100 * clamp(t / END)).toFixed(3) + '%';
  let k = 0;
  CHAPTERS.forEach(([s], i) => { if (t >= s) k = i; });
  if (k !== lastChap) {
    $('#hud-num').textContent = String(k + 1).padStart(2, '0');
    $('#hud-chap').textContent = CHAPTERS[k][1];
    lastChap = k;
  }
}
// landscape: in with "Kafka is …"; vertical: as soon as the opening card clears
tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .7, ease: 'power1.out' }, V ? OFF - .2 : at('kafka', 1) - .3);
tl.to('#hud', { autoAlpha: 0, duration: .6, ease: 'power1.in' }, at("that's") - .3);

// The scenes need the laid-out page (positions come from it), so they are
// built once the fonts are in.
let drawScene = () => {};
function build() {
  const draws = [S1(), S2(), S3(), S4(), S5()];
  drawScene = t => draws.forEach(d => d && d(t));
  window.render = t => {
    tl.seek(t, false);
    drawBg(t, FIELDS); drawMarks(t); drawHud(t); drawScene(t); drawFlows(t); drawCta(t);
    if (V) drawCaptions(t);
  };
  window.render(0);
  window.READY = true;
}

// ---------------------------------------------------------------- S1 · one tap, many services
function S1() {
  const sc = $('#s1'), svg = $('#s1-links');
  show('#s1', 0, at('streaming', 1) + .2);
  rise('#phone', OFF - .35, { y: 30, d: 1 });

  // the tap on "order"
  const tPress = at('order') - .05;
  tl.fromTo('#touch', { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'power2.out', immediateRender: false }, at('tap') - .35);
  tl.to('#ph-btn', { scale: .93, backgroundColor: '#0062C4', duration: .12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, tPress);
  tl.fromTo('#tap-ring', { autoAlpha: .9, scale: .8 }, { autoAlpha: 0, scale: 2.6, duration: .8, ease: 'power2.out', immediateRender: false }, tPress + .05);
  tl.to('#touch', { autoAlpha: 0, scale: .8, duration: .3 }, tPress + .3);

  // … becomes an event, which pops out of the phone
  const bPhone = box($('#phone'), sc), bEvt = box($('#evt'), sc);
  tl.fromTo('#evt', { autoAlpha: 0, x: bPhone.cx - bEvt.cx, y: bPhone.cy - bEvt.cy, scale: .4 },
    { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .9, ease: 'expo.out' }, at('becomes') - .15);
  tl.to('#evt', { borderColor: '#2E90FA', boxShadow: '0 1px 2px rgba(16,24,40,.04),0 14px 36px -10px rgba(1,124,238,.4)', duration: .4 }, at('event') - .1);

  // payments, the warehouse and analytics all need it
  const SV = [['#sv-pay', at('payment')], ['#sv-wh', at('warehouse')], ['#sv-an', at('analytics')]];
  const fans = SV.map(([sel, t]) => {
    const b = box($(sel), sc);
    const p = svgEl(svg, 'path', { class: 'fan', d: V ? curve([bEvt.cx, bEvt.b], [b.cx, b.y], 'v') : curve([bEvt.r, bEvt.cy], [b.x, b.cy], 'h') });
    draw(p, t - .4, .6);
    comp(sel, t - .2);
    return p;
  });
  // … right now: a copy races down every line at once
  const tPk = at('right') - .1;
  const pkts = fans.map(() => svgEl(svg, 'circle', { r: 8, fill: '#017CEE', opacity: 0 }));
  SV.forEach(([sel]) => pulse(`${sel} .ring`, tPk + .5));

  // wiring every service to every other one: spaghetti
  const tWire = at('wiring') - .15;
  tl.to(['#evt', ...fans], { autoAlpha: 0, duration: .4 }, tWire);
  comp('#sv-mail', at('every', 1) - .25);
  comp('#sv-fraud', at('other') - .3);
  const NODES = ['#phone', '#sv-mail', '#sv-pay', '#sv-wh', '#sv-an', '#sv-fraud'].map(s => box($(s), sc));
  const mesh = [];
  for (let i = 0; i < NODES.length; i++) for (let j = i + 1; j < NODES.length; j++) {
    const a = exitPt(NODES[i], NODES[j].cx, NODES[j].cy, 4), b = exitPt(NODES[j], NODES[i].cx, NODES[i].cy, 4);
    mesh.push({ a, b, amp: (hash(i, j) - .5) * 2 * (90 + 90 * hash(j, i)), ph: hash(i + 7, j) * 6.3,
      t0: tWire + .25 + mesh.length * .13, el: svgEl(svg, 'path', { class: 'mesh' }) });
  }
  const M = { vis: 1, wob: .12, red: 0 };
  tl.to(M, { wob: .45, red: 1, duration: .5, ease: 'power2.out' }, at('spaghetti') - .1);
  tl.to(M, { vis: 0, duration: .6, ease: 'power2.in' }, at('put') - .5);
  const grey = '#98A2B3', red = '#F04438';

  // … so a lot of companies put Apache Kafka in the middle
  tl.fromTo('#kbar', { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .9, ease: 'back.out(1.6)' }, at('apache') - .15);
  const bBar = box($('#kbar'), sc);
  const OUT = [['#sv-mail', '#DD2590'], ['#sv-pay', '#7A5AF8'], ['#sv-wh', '#F79009'], ['#sv-an', '#0E9384'], ['#sv-fraud', '#F04438']];
  const tSpoke = at('middle') - .35, tS1End = at('streaming', 1) - .3;
  const spoke = (from, to) => {
    const p = svgEl(svg, 'path', { class: 'spoke', d: line(exitPt(from, to.cx, to.cy, 6), exitPt(to, from.cx, from.cy, 6)) });
    return p;
  };
  const sIn = spoke(NODES[0], bBar);                    // the shop app writes in
  draw(sIn, tSpoke, .45);
  flow(svg, sIn, tSpoke + .4, tS1End, '#017CEE', { v: 190, gap: 48 });
  OUT.forEach(([sel, c], i) => {                          // everyone else reads out
    const p = spoke(bBar, box($(sel), sc));
    draw(p, tSpoke + .08 * (i + 1), .45);
    flow(svg, p, tSpoke + .5 + .08 * i, tS1End, c, { v: 190, gap: 48 });
  });

  // "Kafka is …": the hub steps back and up to make room for the definition
  tl.to('#s1', { scale: V ? .7 : .6, y: V ? -90 : -150, duration: 1.1, ease: 'power3.inOut' }, at('kafka', 1) - .25);
  tl.to('#s1', { autoAlpha: 0, duration: .5, ease: 'power2.in' }, tS1End);

  return t => {
    pkts.forEach((el, i) => {
      const k = clamp((t - tPk) / .55), q = fans[i].getPointAtLength(fans[i].getTotalLength() * gsap.parseEase('power1.inOut')(k));
      el.setAttribute('cx', q.x.toFixed(2)); el.setAttribute('cy', q.y.toFixed(2));
      el.setAttribute('opacity', k > 0 && k < 1 ? Math.min(1, k * 6, (1 - k) * 6).toFixed(3) : 0);
    });
    const col = gsap.utils.interpolate(grey, red, M.red);
    for (const m of mesh) {
      const k = gsap.parseEase('power2.out')(clamp((t - m.t0) / .5)) * M.vis;
      if (k <= 0) { m.el.setAttribute('opacity', 0); continue; }
      const [x1, y1] = m.a, [x2, y2] = m.b, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
      const nx = -dy / L, ny = dx / L, w = m.amp * (1 + M.wob * Math.sin(t * 2.2 + m.ph));
      m.el.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)}C${(x1 + dx / 3 + nx * w).toFixed(1)} ${(y1 + dy / 3 + ny * w).toFixed(1)} ` +
        `${(x1 + dx * 2 / 3 - nx * w).toFixed(1)} ${(y1 + dy * 2 / 3 - ny * w).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
      const len = m.el.getTotalLength();
      m.el.style.strokeDasharray = `${(len * k).toFixed(1)} ${len.toFixed(1)}`;
      m.el.setAttribute('stroke', col);
      m.el.setAttribute('opacity', (.85 * Math.min(1, k * 3)).toFixed(3));
    }
  };
}

// ---------------------------------------------------------------- S2 · what it is
function S2() {
  const sc = $('#s2');
  show('#s2', at('kafka', 1) - .3, at("here's") - .1);
  if (V) {
    rise('#chip1', at('opensource') - .15, { y: 24 });
    rise('#chip2', at('streaming') - .1, { y: 24 });
    leave(['#chip1', '#chip2'], at('streaming', 1) - .45, { st: .05 });
  } else {
    cueWords($('#def'), ['An', '<em>open-source</em>', 'platform', 'for', '<span class="mk">streaming</span>', '<span class="mk">events.</span>'], 'an', 2);
    tl.to('#def .mk', { backgroundSize: '100% 100%', duration: .55, ease: 'power2.out', stagger: .3 }, at('events') + .2);
    leave('#def', at('streaming', 1) - .45);
  }

  // streaming vs a nightly batch
  rise('#s2-tag', at('streaming', 1) - .05, { y: 12 });
  rise('#ln1', at('streaming', 1) + .1, { y: 34, d: .9 });
  rise('#ln2', at('nightly') - .4, { y: 34, d: .9 });
  leave(['#s2-tag', '#ln1', '#ln2'], at('started') - .5, { y: '-=30', st: .05 });
  const T0 = at('streaming', 1) - 3.5;
  const lanes = ['#tr1', '#tr2'].map((sel, li) => {
    const tr = $(sel), W = tr.clientWidth, H = tr.clientHeight;
    const evs = Array.from({ length: 30 }, (_, k) => {
      const el = document.createElement('i'); el.className = 'ev'; tr.appendChild(el);
      return { el, t0: T0 + k * .42 + hash(k, 3) * .2 };
    });
    return { evs, W, H, batch: li === 1, gate: W - 112 - 3 };
  });
  const v = (lanes[0].W - 108) / 1.4, wait = $('#wait');
  let lastWait = -1;

  // where it came from
  rise('#s2-tag2', at('linkedin') - .55, { y: 12 });
  rise('.tl-track', at('linkedin') - .55, { y: 0, d: .6 });
  rise('#tn1', at('linkedin') - .35, { y: 24 });
  tl.to('#tl-fill', V ? { scaleY: 1, duration: .9, ease: 'power2.inOut' } : { scaleX: 1, duration: .9, ease: 'power2.inOut' }, at('became') - .3);
  rise('#tn2', at('toplevel') - .15, { y: 24 });
  tl.to('#tn2 .dot', { backgroundColor: '#017CEE', scale: 1.2, duration: .45 }, at('2012') - .1);
  leave(['#s2-tag2', '#tline'], at("here's") - .5, { y: '-=30', d: .5 });

  return t => {
    if (t < T0 || t > at("here's")) return;
    let queued = 0;
    for (const L of lanes) L.evs.forEach((e, k) => {
      let x = 54 + (t - e.t0) * v, o = 1;
      if (t < e.t0) o = 0;
      else if (L.batch) {
        // the batch lane: everything waits at the gate for 2 AM
        const slot = L.gate - 26 - k * 40;
        if (x >= slot) { x = slot; queued++; }
        if (slot < 70) o = 0;
      } else o = Math.min(1, (x - 54) / 30, (L.W - 54 - x) / 30);
      e.el.style.opacity = Math.max(0, o).toFixed(3);
      e.el.style.transform = `translate(${x.toFixed(2)}px,0)`;
    });
    if (queued !== lastWait) { wait.textContent = `${queued} waiting`; lastWait = queued; }
  };
}

// ---------------------------------------------------------------- S3 · the core idea
function S3() {
  const sc = $('#s3');
  show('#s3', at("here's") - .3, at('now', 1) + .5);
  rise('#s3-tag', at("here's") - .1, { y: 12 });
  comp('#prod', at('producers') - .25);
  rise(['#topic', '#log'], at('topic') - .25, { y: 20, st: .08 });
  tl.to('#topic b', { backgroundSize: '100% 100%', duration: .5, ease: 'power2.out' }, at('named') - .05);
  tl.to('#topic b', { scale: 1.08, duration: .2, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at('orders') - .05);
  rise('#keep', at('keeps') - .15, { y: 12 });

  // producers append to the end of the log
  const slots = $$('#log .slot'), cells = slots.map(s => s.querySelector('.cell')), offs = slots.map(s => s.querySelector('.off'));
  const times = [0, 1, 2, 3, 4, 5].map(k => at('topic') + .2 + k * .16)
    .concat([at('new') + .05, at('end') + .1, at('keeps') + .2, at('choose') + .1, at('pace'), at('number')]).slice(0, slots.length - 1);
  const bProd = box($('#prod'), sc), from = [bProd.cx, bProd.b];
  const fly = times.map((tk, k) => {
    const el = document.createElement('i'); el.className = 'fly'; $('#flyers').appendChild(el);
    const b = box(cells[k], sc);
    return { el, tk, x: b.x, y: b.y, cx: b.cx, w: b.w, h: b.h };
  });
  times.forEach((tk, k) => tl.fromTo(cells[k], { scale: 1.14 }, { scale: 1, duration: .45, ease: 'back.out(3)', immediateRender: false }, tk));

  // consumers read at their own pace, each keeping its own offset
  const CONS = [
    { el: $('#cA'), c: '#0E9384', steps: [[at('log', 1) - .1, 2], [at('place') - .1, 3]], base: 1 },
    { el: $('#cB'), c: '#DD2590', steps: [[at('own') - .1, 7], [at('number') - .1, 8]], base: 6 },
  ];
  CONS.forEach(c => { c.out = c.el.querySelector('p b'); c.last = -1; c.w = c.el.offsetWidth; });
  rise('#cA', at('consumers') - .25, { y: 20 });
  rise('#cB', at('consumers') - .05, { y: 20 });
  tl.to('#cA p b', { backgroundColor: '#0E9384', color: '#fff', duration: .3 }, at('offset') - .1);
  tl.to('#cB p b', { backgroundColor: '#DD2590', color: '#fff', duration: .3 }, at('offset') - .1);
  const x0 = box(cells[0], sc).cx, pitch = box(cells[1], sc).x - box(cells[0], sc).x, slotX = k => x0 + k * pitch;
  const tShowOff = at('consumers') + .3;

  leave(['#s3-tag', '#prod', '#topic', '#keep', '#log', '#flyers', '#cA', '#cB'], at('now', 1) - .35, { y: '-=24', st: .03 });

  return t => {
    if (t < at("here's") - .5 || t > at('now', 1) + .6) return;
    cells.forEach((el, k) => {
      const on = k < times.length && t >= times[k];
      if (el.classList.contains('on') !== on) el.classList.toggle('on', on);
    });
    for (const f of fly) {
      const k = clamp((t - f.tk + .5) / .5);
      if (k <= 0 || k >= 1) { f.el.style.opacity = 0; continue; }
      const u = gsap.parseEase('power2.inOut')(k);
      // a quadratic arc from the producer down into the slot
      const cx = f.cx, cy = from[1];
      const x = (1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * cx + u * u * f.cx;
      const y = (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * cy + u * u * (f.y + f.h / 2);
      const s = .45 + .55 * u;
      f.el.style.opacity = Math.min(1, k * 5).toFixed(3);
      f.el.style.transform = `translate(${(x - f.w / 2).toFixed(2)}px,${(y - f.h / 2).toFixed(2)}px) scale(${s.toFixed(3)})`;
    }
    const at_ = new Map();
    for (const c of CONS) {
      let p = c.base;
      for (const [ts, to] of c.steps) p += (to - p) * gsap.parseEase('power2.inOut')(clamp((t - ts) / .45));
      c.el.style.left = (slotX(p) - c.w / 2).toFixed(2) + 'px';
      const n = Math.round(p);
      if (n !== c.last) { c.out.textContent = n; c.last = n; }
      if (t >= tShowOff) at_.set(n, c.c);
    }
    offs.forEach((el, k) => {
      const c = at_.get(k) || '';
      if (el.dataset.c !== c) { el.dataset.c = c; el.classList.toggle('at', !!c); el.style.setProperty('--oc', c); }
    });
  };
}

// ---------------------------------------------------------------- S4 · the architecture
function S4() {
  const W = $('#world'), under = $('#s4-under'), over = $('#s4-over');
  const tEnd = at('when') - .45;
  show('#s4', at('now', 1) - .3, at('when') + .6);
  rise('#s4-title', at('now', 1) - .1, { y: 20, d: .9 });
  leave('#s4-title', at('cluster') - .75, { y: '-=36', d: .6 });

  const cam = V ? { x: 540, y: 640, z: 1.08 } : { x: 960, y: 510, z: 1.3 };
  const camTo = (t, x, y, z, d = 1.4) => tl.to(cam, { x, y, z, duration: d, ease: 'power2.inOut' }, t);
  const MOVES = V
    ? [[at('cluster') - .5, 540, 640, 1.04, 1.6], [at('topic', 2) - .5, 540, 600, 1.04], [at('copied') - .6, 540, 640, 1.04],
      [at('consumers', 1) - .6, 540, 700, 1], [at('controllers') - .6, 540, 680, 1, 1.5]]
    : [[at('cluster') - .5, 960, 520, 1.12, 1.6], [at('topic', 2) - .5, 960, 450, 1.08], [at('copied') - .6, 960, 510, 1.14],
      [at('consumers', 1) - .6, 960, 610, 1.06], [at('controllers') - .6, 960, 545, 1, 1.5]];
  MOVES.forEach(m => camTo(...m));
  const HALF = V ? [540, 458] : [960, 540];

  // a cluster is a group of servers called brokers
  tl.fromTo('#cl', { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: .8 }, at('cluster') - .25);
  comp(['#b1', '#b2', '#b3'], at('servers') - .1, .12);

  // the partition copies: [chip, partition, leader?]
  const P = ['P0', 'P1', 'P2'], PC = ['#017CEE', '#7A5AF8', '#12B76A'];
  const CHIPS = { 'b1-l': 0, 'b1-r': 1, 'b2-l': 1, 'b2-r': 2, 'b3-l': 2, 'b3-r': 0 };
  for (const id in CHIPS) {
    const el = $('#' + id);
    el.querySelector('b').textContent = P[CHIPS[id]];
    el.style.setProperty('--pc', PC[CHIPS[id]]);
  }
  const bx = sel => box($(sel), W);

  // each topic is split into partitions, spread across the brokers
  rise('#tbar', at('topic', 2) - .2, { y: 16 });
  const tSplit = at('split') - .1, tSpread = at('spread') - .15;
  tl.to('#ts0', { x: V ? -14 : -26, borderRadius: 18, duration: .5, ease: 'power3.out' }, tSplit);
  tl.to('#ts1', { borderRadius: 18, duration: .5, ease: 'power3.out' }, tSplit);
  tl.to('#ts2', { x: V ? 14 : 26, borderRadius: 18, duration: .5, ease: 'power3.out' }, tSplit);
  tl.to('.tseg b', { opacity: 1, duration: .3, stagger: .1 }, at('partitions') - .25);
  tl.to('.tb-name', { autoAlpha: 0, duration: .3 }, tSpread);
  const full = {};                                             // when each chip fills
  ['b1-l', 'b2-l', 'b3-l'].forEach((id, i) => {
    const s = bx('#ts' + i), c = bx('#' + id), t = tSpread + i * .12;
    tl.to('#ts' + i, { x: c.cx - s.cx, y: c.cy - s.cy, scale: .85, duration: .8, ease: 'power3.inOut' }, t);
    tl.to('#ts' + i, { autoAlpha: 0, duration: .15 }, t + .68);
    full[id] = t + .7;
  });

  // so many machines share the load
  const tLoad = at('machines') - .3, tCtl = at('controllers') - .4, tFail = at('fails') - .1;
  const wr = ['b1-l', 'b2-l', 'b3-l'].map((id, i) => {
    const c = bx('#' + id), b = bx('#b' + (i + 1));
    const p = svgEl(under, 'path', { class: 'wr', id: 'w' + i, d: line([c.cx, b.y - 96], [c.cx, b.y - 6]) });
    draw(p, tLoad + i * .1, .5);
    flow(under, p, tLoad + .4, i === 1 ? tFail : tCtl, PC[i], { v: 120, gap: 40 });
    return p;
  });
  tl.to(wr, { autoAlpha: 0, duration: .4 }, tCtl);
  const loads = [1, 2, 3].map(n => $('#ld' + n));

  // every partition is copied to other brokers
  const tCopy = at('copied') - .15;
  [['b1-l', 'b3-r'], ['b2-l', 'b1-r'], ['b3-l', 'b2-r']].forEach(([a, b], i) => {
    const s = bx('#' + a), d = bx('#' + b), t = tCopy + i * .15;
    const g = document.createElement('div');
    g.className = 'gh'; g.style.cssText = `--pc:${PC[CHIPS[a]]};width:${s.w}px;height:${s.h}px`;
    g.innerHTML = `<b>${P[CHIPS[a]]}</b>`; $('#ghosts').appendChild(g);
    tl.fromTo(g, { x: s.x, y: s.y, autoAlpha: 0 }, { autoAlpha: .9, duration: .15, immediateRender: false }, t);
    tl.to(g, { x: d.x, y: d.y, duration: .75, ease: 'power3.inOut' }, t);
    tl.to(g, { autoAlpha: 0, duration: .15 }, t + .7);
    gsap.set(g, { x: s.x, y: s.y });
    full[b] = t + .72;
  });

  // … so if one fails, the data is still there
  tl.fromTo('#b2 .xb', { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2.5)', immediateRender: false }, tFail);
  tl.to('#b2', { x: 6, duration: .05, yoyo: true, repeat: 5, ease: 'none' }, tFail);
  const tPromote = at('still') - .2;
  tl.fromTo('#b1-r', { boxShadow: '0 0 0 0px rgba(122,90,248,0)' }, { boxShadow: '0 0 0 12px rgba(122,90,248,.22)', duration: .35, yoyo: true, repeat: 1, immediateRender: false }, tPromote);

  // consumers join a group; each partition goes to one member
  tl.fromTo('#cg', { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: .8 }, at('consumers', 1) - .3);
  comp(['#k1', '#k2'], at('join') - .3, .15);
  comp('#k3', at('adding') - .25);
  const asg = (chip, k) => {
    const c = bx('#' + chip), br = bx('#' + chip.slice(0, 2)), kb = bx('#' + k);
    return curve([c.cx, br.b + 2], [kb.cx, kb.y - 4], 'v');
  };
  const tA = at('partition', 1) - .3, tReb = at('consumers', 2) - .35;
  const ASG = [['b1-l', 'k1', 0, tA], ['b1-r', 'k2', 1, tA + .2], ['b3-l', 'k2', 2, tA + .4], ['b3-l', 'k3', 2, tReb + .3]];
  const asgEls = ASG.map(([chip, k, p, t], i) => {
    const el = svgEl(under, 'path', { class: 'asg', d: asg(chip, k), stroke: PC[p] });
    draw(el, t, .6);
    flow(under, el, t + .5, i === 2 ? tReb : tEnd, PC[p], { v: 130, gap: 44, r: 4.5 });
    return el;
  });
  tl.to(asgEls[2], { drawSVG: '0%', duration: .4, ease: 'power2.in' }, tReb);
  // which partitions each consumer reads, shown on its card
  const TAGS = [[tA + .5, { k1: [0] }], [tA + .7, { k1: [0], k2: [1] }], [tA + .9, { k1: [0], k2: [1, 2] }], [tReb + .8, { k1: [0], k2: [1], k3: [2] }]];
  const tagEls = ['k1', 'k2', 'k3'].map(k => $(`#${k} .tags`));
  let lastTags = -1;

  // and a few controllers, running KRaft, keep track of which broker leads each partition
  comp('#ctl', at('controllers') - .3);
  tl.to('#ctl .tab', { color: '#017CEE', borderColor: '#84CAFF', duration: .3 }, at('kraft') - .1);
  // dashed lines, so they fade in (drawSVG would replace the dashes) and then march toward the leaders
  const tLead = at('leads') - .3, act = bx('#cn2'), ctl = bx('#ctl');
  const leads = ['b1-l', 'b1-r', 'b3-l'].map((id, i) => {
    const c = bx('#' + id), br = bx('#' + id.slice(0, 2));
    const el = svgEl(over, 'path', { class: 'lead', d: line([act.cx + (c.cx - act.cx) * .12, ctl.b], [c.cx, br.y - 4]) });
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, ease: 'power1.out' }, tLead + i * .15);
    tl.fromTo(`#${id} .crown`, { autoAlpha: 0, scale: .3 }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2.6)', immediateRender: false }, tLead + .35 + i * .15);
    return el;
  });
  tl.to('#world', { autoAlpha: 0, duration: .6, ease: 'power2.in' }, tEnd);

  const chipEls = Object.keys(CHIPS).map(id => ({ id, el: $('#' + id), label: $(`#${id} span`), last: '' }));
  const b2 = $('#b2');
  return t => {
    W.style.transform = `translate(${HALF[0]}px,${HALF[1]}px) scale(${cam.z.toFixed(5)}) translate(${(-cam.x).toFixed(3)}px,${(-cam.y).toFixed(3)}px)`;
    if (t < at('now', 1) - .5 || t > tEnd + .7) return;
    leads.forEach(el => { el.style.strokeDashoffset = (-t * 24).toFixed(2); });
    for (const c of chipEls) {
      // empty → leader or replica → (P1's replica on broker 1) promoted to leader
      let s = t >= (full[c.id] ?? Infinity) ? (c.id.endsWith('l') ? 'ps full' : 'ps rep full') : (c.id.endsWith('l') ? 'ps' : 'ps rep');
      if (c.id === 'b1-r' && t >= tPromote) s = 'ps full';
      if (s !== c.last) { c.el.className = s; c.label.textContent = s === 'ps full' ? 'leader' : 'replica'; c.last = s; }
    }
    const down = t >= tFail;
    if (b2.classList.contains('down') !== down) { b2.classList.toggle('down', down); b2.querySelector('.st em').textContent = down ? 'offline' : 'online'; }
    loads.forEach((el, i) => {
      const k = smooth(tLoad, tLoad + .9, t), extra = i !== 1 ? 14 * smooth(tFail, tFail + .8, t) : 0;
      const dead = i === 1 ? 1 - smooth(tFail, tFail + .4, t) : 1;
      el.style.width = (k * dead * (54 + extra + 7 * Math.sin(t * 2.3 + i * 1.7) + 4 * Math.sin(t * 5.1 + i))).toFixed(2) + '%';
    });
    let ti = -1;
    TAGS.forEach(([ts], i) => { if (t >= ts) ti = i; });
    if (ti !== lastTags) {
      tagEls.forEach((el, j) => {
        const ps = ti < 0 ? [] : TAGS[ti][1]['k' + (j + 1)] || [];
        el.innerHTML = ps.map(p => `<i style="--pc:${PC[p]}">${P[p]}</i>`).join('');
      });
      lastTags = ti;
    }
  };
}

// ---------------------------------------------------------------- S5 · in short + close
function S5() {
  show('#s5', at('when') - .2, null);
  rise('#s5-tag', at('team') - .25, { y: 12 });
  cueWords($('#quote'), ['<span class="qm">“</span>We', 'use', 'Kafka.<span class="qm">”</span>'], 'we');
  [['#ta1', at('services') - .3], ['#ta2', at('publish') - .35], ['#ta3', at('anyone') - .35]].forEach(([sel, t]) => {
    rise(sel, t, { y: 22 });
    tl.fromTo(`${sel} .tick`, { scale: .3 }, { scale: 1, duration: .7, ease: 'back.out(2.4)' }, t + .1);
  });
  leave(['#s5-tag', '#quote', '#ta1', '#ta2', '#ta3'], at("that's") - .35, { y: '-=24', st: .04 });
  tl.fromTo('#mark5', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, at("that's") + .05);
  tl.fromTo('#wm5a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('apache', 2) - .1);
  tl.fromTo('#wm5b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('kafka', 5) - .1);
  rise('#lock5-sub', at('kafka', 5) + .45, { y: 12, d: 1 });
  rise('#credit', at('kafka', 5) + .9, { y: 8, d: 1 });
  tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);
}

document.fonts.ready.then(() => requestAnimationFrame(build));
