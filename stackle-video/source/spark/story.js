// Apache Spark, explained: the story, shared by both cuts. index.html
// (1920×1080) and vertical.html (1080×1920, with captions) have the same
// elements; their stylesheets lay them out, and this file reads positions
// back from the page, so one timeline drives both. Shared helpers (cues,
// timeline, icons, background, opening card) are in ../explained/common.js,
// the mark in brand.js, the captions in ../explained/captions.js.

const V = BH > BW;                                  // the vertical cut
const FIELDS = V ? [
  t => [860 + Math.sin(t * .05) * 160, 320 + Math.cos(t * .04) * 120, 820, 'rgba(226,90,28,0.05)'],
  t => [160 + Math.cos(t * .035) * 120, 1480, 760, 'rgba(247,144,9,0.04)'],
  t => [720, 1900 + Math.sin(t * .045) * 70, 650, 'rgba(1,124,238,0.03)'],
] : [
  t => [1500 + Math.sin(t * .05) * 260, 160 + Math.cos(t * .04) * 90, 950, 'rgba(226,90,28,0.05)'],
  t => [260 + Math.cos(t * .035) * 160, 980, 820, 'rgba(247,144,9,0.04)'],
  t => [1150, 1160 + Math.sin(t * .045) * 70, 700, 'rgba(1,124,238,0.03)'],
];
// one colour per partition (and per task)
const PC = ['#017CEE', '#7A5AF8', '#12B76A', '#F79009', '#DD2590', '#0E9384', '#E25A1C', '#6172F3'];

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
const line = ([x1, y1], [x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`;
function draw(el, t, d = .6) {
  tl.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, t);
}
const comp = (sel, t, st = 0) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, stagger: st }, t);
const pop = (sel, t, st = 0) => tl.fromTo(sel, { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2.4)', stagger: st }, t);
// fly an absolutely placed element (left/top 0) from one box to another
function fly(el, a, b, t, d = .7) {
  tl.fromTo(el, { x: a.x, y: a.y, autoAlpha: 0, scale: .7 }, { x: b.x, y: b.y, autoAlpha: 1, scale: 1, duration: d, ease: 'power3.inOut', immediateRender: false }, t);
}

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
// a file size, growing on a log scale from a to b bytes
function bytes(k, a = 48e6, b = 2e12) {
  const n = Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * k);
  return n < 1e9 ? `${Math.round(n / 1e6)} MB` : n < 1e12 ? `${(n / 1e9).toFixed(n < 1e10 ? 1 : 0)} GB` : `${(n / 1e12).toFixed(1).replace('.0', '')} TB`;
}

// ---------------------------------------------------------------- HUD
const CHAPTERS = [[0, 'The problem'], [at('spark', 1) - .3, 'What it is'], [at("here's") - .3, 'The core idea'],
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
// landscape: in with "Spark is …"; vertical: as soon as the opening card clears
tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .7, ease: 'power1.out' }, V ? OFF - .2 : at('spark', 1) - .3);
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

// ---------------------------------------------------------------- S1 · the file that is too big
function S1() {
  const sc = $('#s1'), svg = $('#s1-links');
  const tEnd = at('spark', 1) - .3;                     // "Spark is …", after the channel intro
  show('#s1', 0, tEnd + .5);

  // the laptop opens a file of a million orders, in a second (landscape: centred at first)
  const home = box($('#laptop'), sc), shift = V ? 0 : BW / 2 - home.cx;
  gsap.set('#laptop', { x: shift });
  rise('#laptop', OFF - .35, { y: 30, d: 1 });
  rise('#p-small .trow', at('opens') - .1, { y: 10, d: .4, st: .07 });
  rise('#rows', at('million') - .1, { y: 8, d: .4 });
  pop('#loaded', at('second') - .05);

  // every order, ever: two terabytes
  const tEvery = at('every') - .1, tTera = at('terabytes') + .3;
  tl.to('#p-small', { autoAlpha: 0, duration: .35 }, tEvery);
  tl.fromTo('#p-big', { autoAlpha: 0 }, { autoAlpha: 1, duration: .35 }, tEvery + .1);
  tl.fromTo('#p-big .big-file', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5 }, tEvery + .15);
  tl.to('#fname-t', { color: '#B54708', duration: .3 }, tEvery);
  // … it doesn't fit in memory
  const tRam = at("doesn't") - .2, tMem = at('memory') + .1;
  rise('#ram', tRam, { y: 14, d: .5 });
  tl.fromTo('#ram-fill', { width: '0%' }, { width: '100%', duration: tMem - tRam - .2, ease: 'power1.in' }, tRam + .2);
  tl.to('#ram-fill', { backgroundColor: '#F04438', duration: .25 }, tMem - .25);
  pop('#oom', tMem);
  // … and one machine would take all night
  const tProg = at('machine') - .3, tNight = at('night') - .1;
  rise('#prog', tProg, { y: 14, d: .5 });
  pop('#eta', tNight);

  // so teams split the work across many machines
  const tSplit = at('split') - .2;
  // landscape: the laptop moves aside, a little smaller, to make room for the machines
  const LS = V ? 1 : .8;
  if (!V) tl.to('#laptop', { x: 0, scale: LS, transformOrigin: '0 0', duration: 1, ease: 'power3.inOut' }, tSplit);
  comp(['#m1', '#m2', '#m3', '#m4'], at('across') - .25, .1);
  const scr0 = box($('.screen'), sc), scr = { cx: home.x + (scr0.cx - home.x) * LS, cy: home.y + (scr0.cy - home.y) * LS };
  const slots = $$('.mslots i').map(el => box(el, sc));
  const tFly = at('machines') - .2;
  slots.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = 'slice'; el.textContent = '250 GB';
    el.style.cssText = `--pc:${PC[i]};width:${b.w}px;height:${b.h}px`;
    $('#slices').appendChild(el);
    const a = { x: scr.cx - b.w / 2 + (i - 3.5) * 12, y: scr.cy - b.h / 2 + 40 };
    fly(el, a, b, tFly + i * .08, .8);
  });
  tl.to('#p-big', { opacity: .35, duration: .5 }, tFly + .3);

  // … with Apache Spark, in the middle of it all
  tl.fromTo('#sbar', { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .9, ease: 'back.out(1.6)' }, at('apache') - .15);
  const bar = box($('#sbar'), sc), tSpoke = at('spark') - .1;
  ['#m1', '#m2', '#m3', '#m4'].forEach((sel, i) => {
    const m = box($(sel), sc);
    // landscape: out of the bar's right end, so no line crosses the laptop
    const a = V ? exitPt(bar, m.cx, m.cy, 6) : [bar.r + 6, bar.cy + (i - 1.5) * 18];
    const p = svgEl(svg, 'path', { class: 'spoke', d: line(a, exitPt(m, a[0], a[1], 6)) });
    draw(p, tSpoke + i * .08, .45);
    flow(svg, p, tSpoke + .4 + i * .08, tEnd, PC[i * 2], { v: 170, gap: 46 });
  });
  tl.to('#s1', { autoAlpha: 0, duration: .5, ease: 'power2.in' }, tEnd);

  const fsize = $('#fsize'), big = $('#bigsize'), ramT = $('#ram-t'), progT = $('#prog-t'), progF = $('#prog-fill'), fname = $('#fname-t');
  let lastF = '', lastP = '';
  return t => {
    if (t > tEnd + .6) return;
    const k = smooth(tEvery, tTera, t);
    const f = t < tEvery ? '48 MB' : bytes(k);
    if (f !== lastF) { fsize.textContent = f; big.textContent = f; lastF = f; }
    const name = t < tEvery ? 'orders.csv' : 'all_orders/';
    if (fname.textContent !== name) fname.textContent = name;
    ramT.textContent = t < tMem ? `${Math.min(16, Math.round(16 * clamp((t - tRam - .2) / (tMem - tRam - .2)))) } / 16 GB` : '16 / 16 GB';
    // the progress bar crawls: 0.4% in a few seconds, so all night
    const pr = .4 * clamp((t - tProg - .3) / 4);
    const ps = pr.toFixed(1) + '%';
    if (ps !== lastP) { progT.textContent = ps; progF.style.width = Math.max(.6, pr) + '%'; lastP = ps; }
  };
}

// ---------------------------------------------------------------- S2 · what it is
function S2() {
  const t0 = at('spark', 1), tStart = at('started');
  show('#s2', t0 - .35, at("here's") - .1);
  tl.fromTo('#mark2', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'expo.out' }, t0 - .3);
  tl.fromTo('#wm2a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, t0 - .2);
  tl.fromTo('#wm2b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, t0 - .05);
  if (V) {
    rise('#chip1', at('opensource') - .15, { y: 24 });
    rise('#chip2', at('machines', 1) - .3, { y: 24 });
    leave(['#chip1', '#chip2'], tStart - .45, { st: .05 });
  } else {
    cueWords($('#def'), ['An', '<em>open-source</em>', 'engine', 'for', 'processing', 'large', 'amounts', 'of', 'data',
      '<span class="mk">across</span>', '<span class="mk">many</span>', '<span class="mk">machines.</span>'], 'an');
    tl.to('#def .mk', { backgroundSize: '100% 100%', duration: .5, ease: 'power2.out', stagger: .15 }, at('machines', 1) + .2);
    leave('#def', tStart - .45);
  }
  // you write Python or SQL, and Scala, Java and R work too
  [['#lg-py', 'python'], ['#lg-sql', 'sql'], ['#lg-sc', 'scala'], ['#lg-ja', 'java'], ['#lg-r', 'r']]
    .forEach(([sel, w]) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .9 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(2)' }, at(w) - .12));
  leave('#langs', tStart - .4, { y: '-=24' });

  // where it came from
  rise('#s2-tag', tStart - .15, { y: 12 });
  rise('.tl-track', tStart - .1, { y: 0, d: .6 });
  rise('#tn1', at('berkeley') - .3, { y: 24 });
  tl.to('#tl-fill', { scaleX: .5, duration: .7, ease: 'power2.inOut' }, at('opensourced') - .35);
  rise('#tn2', at('opensourced') - .15, { y: 24 });
  tl.to('#tl-fill', { scaleX: 1, duration: .8, ease: 'power2.inOut' }, at('became') - .1);
  rise('#tn3', at('toplevel') - .1, { y: 24 });
  tl.to('#tn3 .dot', { backgroundColor: '#E25A1C', scale: 1.2, duration: .45 }, at('2014') - .1);
  leave(['#lock2', '#s2-tag', '#tline'], at("here's") - .5, { y: '-=30', d: .5, st: .04 });
}

// ---------------------------------------------------------------- S3 · the core idea
function S3() {
  const sc = $('#s3');
  const tIn = at("here's"), tOut = at('now', 1) - .35;
  show('#s3', tIn - .3, at('now', 1) + .4);
  rise('#s3-tag', tIn - .1, { y: 12 });

  // the table, cut into partitions
  const parts = PC.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'part';
    el.innerHTML = `<b>P${i}</b><u></u><u style="width:80%"></u><u style="width:62%"></u><span class="pbar"><i></i></span><span class="pdone" data-icon="check"></span>`;
    el.querySelector('.pdone').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS.check}</svg>`;
    el.style.left = (V ? 120 + (i % 4) * 215 : 172 + i * 200) + 'px';
    if (V) el.style.top = (350 + Math.floor(i / 4) * 160) + 'px';
    $('#parts').appendChild(el);
    return el;
  });
  const tTable = at('spark', 2) - .3, tCut = at('partitions') - .2;
  // closed up, the eight look like one grey table
  const gx = V ? 20 : 24, gy = V ? 20 : 0;
  parts.forEach((el, i) => {
    const col = V ? i % 4 : i, row = V ? Math.floor(i / 4) : 0, nc = V ? 4 : 8, nr = V ? 2 : 1;
    gsap.set(el, { x: -(col - (nc - 1) / 2) * gx, y: -(row - (nr - 1) / 2) * gy, '--pc': '#98A2B3' });
    tl.to(el, { x: 0, y: 0, duration: .7, ease: 'power3.inOut' }, tCut + i * .03);
    tl.to(el, { '--pc': PC[i], duration: .4 }, tCut + .2 + i * .03);
  });
  tl.fromTo(parts, { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, immediateRender: true }, tTable);
  tl.fromTo('#parts .part b', { opacity: 0 }, { opacity: 1, duration: .3, stagger: .04 }, tCut + .3);
  rise('#parts-label', tTable + .1, { y: 10, d: .5 });

  // the steps, typed into daily_sales.py, while nothing runs
  rise('#code', at('steps') - .45, { y: 20, d: .6 });
  const type = (sel, t, d = .7) => {
    const n = $(sel).textContent.length;
    tl.fromTo(sel, { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)', duration: d, ease: `steps(${n})` }, t);
  };
  type('#ln1', at('steps') - .1, .9);
  type('#ln2', at('dataframe') - .1, .4);
  type('#ln3', at('filter') - .15, .7);
  type('#ln4', at('group') - .15, .55);
  type('#ln5', at('sum') - .1, .45);
  rise('#status', at("doesn't", 1) - .2, { y: 12, d: .5 });
  // … it writes a plan
  rise('#plan-h', at('writes') - .3, { y: 10, d: .4 });
  tl.fromTo('#plan .pb', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .14 }, at('writes') - .1);
  tl.to('#plan-h', { color: '#E25A1C', duration: .3 }, at('plan') - .1);
  // … and runs it only when you ask for a result, like saving the output
  type('#ln6', at('saving') - .15, .8);
  const tSolid = at('output') - .05, tRun = at('then') - .1;
  const pbs = $$('#plan .pb');
  // then one task per partition runs, all at the same time
  const bars = parts.map((el, i) => ({ el, bar: el.querySelector('.pbar i'), done: el.querySelector('.pdone'),
    t0: at('task') - .1 + i * .05, d: 1.6 + hash(i, 4) * .4, last: -1 }));
  const tDone = Math.max(...bars.map(b => b.t0 + b.d));
  bars.forEach(b => tl.fromTo(b.done, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2.5)', immediateRender: false }, b.t0 + b.d));

  leave(['#s3-tag', '#code', '#plan', '#status', '#parts', '#parts-label'], tOut, { y: '-=24', st: .03 });

  const status = $('#status'), statusT = $('#status-t'), label = $('#parts-label');
  let lastS = '';
  return t => {
    if (t < tIn - .5 || t > tOut + 1) return;
    pbs.forEach((el, i) => { const on = t >= tSolid + i * .08; if (el.classList.contains('solid') !== on) el.classList.toggle('solid', on); });
    const s = t < tRun ? 'idle' : t < tDone ? 'run' : 'done';
    const txt = s === 'idle' ? 'Nothing runs yet' : s === 'run' ? '8 tasks, all at once' : '8 of 8 tasks done';
    if (txt !== lastS) { statusT.textContent = txt; status.className = 'status' + (s === 'idle' ? '' : ' ' + s); lastS = txt; }
    for (const b of bars) {
      const k = clamp((t - b.t0) / b.d);
      if (k !== b.last) { b.bar.style.width = (k * 100).toFixed(2) + '%'; b.last = k; }
    }
    const lt = t < tCut + .2 ? '<b>orders</b> · 2 TB' : '<b>8 partitions</b> · one task each';
    if (label.innerHTML !== lt) label.innerHTML = lt;
  };
}

// ---------------------------------------------------------------- S4 · the architecture
function S4() {
  const sc = $('#s4'), svg = $('#s4-links');
  const tIn = at('now', 1), tEnd = at('team') - .9;
  show('#s4', tIn - .3, at('team') - .2);
  rise('#s4-title', tIn - .1, { y: 20, d: .9 });
  leave('#s4-title', at('driver') - .75, { y: '-=36', d: .6 });

  // the driver runs your code and turns the plan into tasks
  comp('#drv', at('driver') - .25);
  tl.fromTo('#mini i', { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .08 }, at('plan', 1) - .3);
  const drv = box($('#drv'), sc);
  const cw = V ? 78 : 96, ch = V ? 42 : 44, gap = 10;
  const grid = i => ({ x: drv.x + (V ? 10 : 10) + (i % 4) * (cw + gap), y: drv.b + (V ? 16 : 18) + Math.floor(i / 4) * (ch + gap) });
  const tasks = PC.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'task'; el.innerHTML = `task ${i}<i></i>`;
    el.style.cssText = `--pc:${c}`;
    $('#tasks').appendChild(el);
    return { el, bar: el.querySelector('i'), i };
  });
  const tTasks = at('tasks') - .15;
  tasks.forEach(({ el, i }) => fly(el, { x: drv.cx - cw / 2, y: drv.cy - ch / 2 }, grid(i), tTasks + i * .06, .55));

  // the cluster manager (Kubernetes, YARN or Spark's own) …
  comp('#mgr', at('cluster') - .25);
  pop('#op-k8s', at('kubernetes') - .1);
  pop('#op-yarn', at('yarn') - .1);
  pop('#op-sa', at('yarn') + .2);
  const mgr = box($('#mgr'), sc);
  // … gives the driver executors on worker machines
  const tGive = at('gives') - .2;
  if (!V) {
    const p = svgEl(svg, 'path', { class: 'wire', d: line([mgr.x - 6, mgr.cy + 16], [drv.r + 6, drv.cy + 16]) });
    draw(p, tGive, .5);
    flow(svg, p, tGive + .4, tEnd, '#E25A1C', { v: 160, gap: 60 });
    rise('#dm-note', tGive + .2, { y: 8, d: .5 });
  }
  comp(['#w1', '#w2', '#w3'], at('executors') - .3, .12);
  const W = ['#w1', '#w2', '#w3'].map(s => box($(s), sc));
  const busY = V ? 578 : 430, tWire = at('worker') - .3;
  W.forEach((w, i) => {
    const p = svgEl(svg, 'path', { class: 'wire', d: `M${mgr.cx} ${mgr.b + 4}V${busY}H${w.cx}V${w.y - 4}` });
    draw(p, tWire + i * .1, .6);
  });
  tl.to('#s4-links .wire', { opacity: .45, duration: .5 }, at('executors', 1) + .5);

  // executors run the tasks: three, three and two
  const slots = ['#w1', '#w2', '#w3'].map(s => $$(`${s} .eslots i`).map(el => box(el, sc)));
  const home = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]];
  const tRunT = at('executors', 1) - .1;
  const place = (b, w, h) => ({ x: b.cx - w / 2, y: b.cy - h / 2 });
  home.forEach(([w, s], i) => fly(tasks[i].el, grid(i), place(slots[w][s], cw, ch), tRunT + i * .06, .7));
  // … and keep data in memory, so it's fast
  const tMem = at('memory', 1) - .1, tFast = at('fast') - .1;
  pop('#s4 .zap', tFast, .08);

  // if one executor dies, the driver re-runs just its tasks on another one
  const tDie = at('dies') - .15, tRe = at('reruns') - .1;
  pop('#w2 .xb', tDie);
  tl.to('#w2', { x: 6, duration: .05, yoyo: true, repeat: 5, ease: 'none' }, tDie);
  const moves = [[3, 2, 2], [4, 2, 3], [5, 0, 3]];          // task → worker, slot
  moves.forEach(([i, w, s], k) => tl.to(tasks[i].el, { x: place(slots[w][s], cw, ch).x, y: place(slots[w][s], cw, ch).y, duration: .75, ease: 'power3.inOut' }, tRe + k * .14));
  // … rebuilding the lost pieces from the plan
  const tRb = at('rebuilding') - .15;
  pop('#rb-note', tRb);
  tl.to('#mini i', { backgroundColor: '#E25A1C', color: '#fff', duration: .25, stagger: .07, yoyo: true, repeat: 1 }, at('plan', 2) - .4);
  [W[0], W[2]].forEach(w => {
    const p = svgEl(svg, 'path', { class: 'dash', d: line([drv.cx + (w.cx - drv.cx) * .15, drv.b + 4], [w.cx, w.y - 6]), opacity: 0 });
    tl.to(p, { attr: { opacity: 1 }, duration: .4 }, tRb + .1);
    tl.to(p, { attr: { opacity: 0 }, duration: .4 }, at('results') - .3);
    DASHES.push(p);
  });
  tl.to('#rb-note', { autoAlpha: 0, duration: .35 }, at('results') - .3);

  // then the results land in storage
  const tRes = at('results') - .3, tLand = at('land') - .1;
  comp('#bkt', tRes);
  const bkt = box($('#bkt'), sc);
  [[0, '#12B76A'], [2, '#12B76A'], [0, '#12B76A']].forEach(([w, c], k) => {
    const el = document.createElement('div');
    el.className = 'task'; el.textContent = 'result'; el.style.cssText = `--pc:${c}`;
    $('#tasks').appendChild(el);
    const a = place(W[w], cw, ch), b = { x: bkt.r - 16 - (3 - k) * (cw + 10), y: bkt.cy - ch / 2 };
    fly(el, a, b, tLand + k * .12, .7);
  });
  leave('#s4 > *:not(.links)', tEnd, { y: '-=20', d: .5 });
  tl.to('#s4-links', { autoAlpha: 0, duration: .5 }, tEnd);

  // per-task state: [start running, how long] (re-run ones start again on their new executor)
  const RUN = tasks.map(({ i }) => {
    const land = tRunT + i * .06 + .7;
    if (i >= 3 && i <= 5) return { runs: [[land, 6.5], [tRe + (i - 3) * .14 + .8, 2.6]], lost: [tDie, tRe + (i - 3) * .14 + .4] };
    return { runs: [[land, 5 + hash(i, 9) * 1.2]], lost: null };
  });
  const mems = $$('#s4 .mem'), w2 = $('#w2'), bktT = $('#bkt-t');
  return t => {
    if (t < tIn - .5 || t > tEnd + .8) return;
    DASHES.forEach(p => { p.style.strokeDashoffset = (-t * 24).toFixed(2); });
    mems.forEach((m, i) => { const on = t >= tMem + i * .1 && !(i === 1 && t >= tDie); if (m.classList.contains('on') !== on) m.classList.toggle('on', on); });
    const down = t >= tDie;
    if (w2.classList.contains('down') !== down) w2.classList.toggle('down', down);
    tasks.forEach(({ el, bar }, i) => {
      const R = RUN[i];
      const lost = R.lost && t >= R.lost[0] && t < R.lost[1];
      let k = 0;
      for (const [s, d] of R.runs) if (t >= s) k = clamp((t - s) / d);
      if (R.lost && t >= R.lost[0] && t < R.runs[1][0]) k = 0;
      if (el.classList.contains('lost') !== lost) el.classList.toggle('lost', lost);
      bar.style.width = (k * 100).toFixed(1) + '%';
      el.style.backgroundColor = k >= 1 ? `color-mix(in srgb, ${PC[i]} 14%, #fff)` : '#fff';
    });
    const bt = t < tLand + .8 ? 'waiting for results' : 'written: 8 of 8 tasks';
    if (bktT.textContent !== bt) bktT.textContent = bt;
  };
}
const DASHES = [];

// ---------------------------------------------------------------- S5 · in short + close
function S5() {
  show('#s5', at('team') - .5, null);
  rise('#s5-tag', at('team') - .25, { y: 12 });
  cueWords($('#quote'), ['<span class="qm">“</span>We', 'use', 'Spark.<span class="qm">”</span>'], 'we');
  [['#ta1', at('means') - .3], ['#ta2', at('they') - .3], ['#ta3', at('splits') - .35]].forEach(([sel, t]) => {
    rise(sel, t, { y: 22 });
    tl.fromTo(`${sel} .tick`, { scale: .3 }, { scale: 1, duration: .7, ease: 'back.out(2.4)' }, t + .1);
  });
  leave(['#s5-tag', '#quote', '#ta1', '#ta2', '#ta3'], at("that's") - .35, { y: '-=24', st: .04 });
  tl.fromTo('#mark5', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, at("that's") + .05);
  tl.fromTo('#wm5a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('apache', 2) - .1);
  tl.fromTo('#wm5b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('spark', 6) - .1);
  rise('#lock5-sub', at('spark', 6) + .45, { y: 12, d: 1 });
  rise('#credit', at('spark', 6) + .9, { y: 8, d: 1 });
  tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);
}

document.fonts.ready.then(() => requestAnimationFrame(build));
