// Apache Airflow, explained: a 95-second explainer on a white canvas.
// One paused GSAP timeline plus a few per-frame draws, so window.render(t)
// always produces the same frame for the same t. Timing comes from the
// voiceover word cues in cues.js; swap the take, regenerate cues, re-render.
gsap.registerPlugin(DrawSVGPlugin);

const OFF = VO.offset;                       // voice starts this far into the video
const END = OFF + VO.duration + 2.6;         // hold the closing title, then fade to white
window.DURATION = END;
window.SFX = [];                             // no sound effects: mix.js lays the music under the voice

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

// deterministic helpers
function hash(a, b) {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };

const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

function show(sel, a, b) {
  tl.set(sel, { autoAlpha: 1 }, a);
  if (b != null) tl.set(sel, { autoAlpha: 0 }, b);
}
function rise(sel, t, { y = 26, d = .8, st = 0, ease = 'power3.out' } = {}) {
  tl.fromTo(sel, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: d, ease, stagger: st }, t);
}
function leave(sel, t, { y = '-=20', d = .55, st = 0 } = {}) {
  tl.to(sel, { autoAlpha: 0, y, duration: d, ease: 'power2.in', stagger: st }, t);
}
// words that rise out of a mask, each on its own spoken cue
function cueWords(el, raw, firstWord, n = 0) {
  el.innerHTML = raw.map(w => `<span class="wm"><span class="wi">${w}</span></span>`).join(' ');
  const i0 = wi(firstWord, n);
  $$(`#${el.id} .wi`).forEach((w, k) =>
    tl.fromTo(w, { yPercent: 115 }, { yPercent: 0, duration: .6, ease: 'expo.out' }, WORDS[i0 + k].s + OFF - .06));
}

// ---------------------------------------------------------------- icons
const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  order: '<circle cx="5" cy="12" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/><path d="M7.4 12h2.2M14.4 12h2.2"/>',
  alert: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.2M12 17h.01"/>',
  task: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M10 10h4v4h-4zM9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M8 17.2h2"/>',
  send: '<path d="M3 12h6"/><path d="M9 12c3.5 0 4-5.5 8.5-5.5M9 12h8.5M9 12c3.5 0 4 5.5 8.5 5.5"/><path d="m15.8 4.6 2 1.9-2 1.9M15.8 10.1l2 1.9-2 1.9M15.8 15.6l2 1.9-2 1.9"/>',
  server: '<rect x="3.5" y="4" width="17" height="7" rx="2"/><rect x="3.5" y="13" width="17" height="7" rx="2"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>',
  db: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  monitor: '<rect x="3" y="4" width="18" height="12.5" rx="2.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  warehouse: '<path d="M3 20.5V9l9-5 9 5v11.5"/><path d="M7 20.5v-8h10v8M7 16.5h10"/>',
};
$$('[data-icon]').forEach(el => {
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[el.dataset.icon]}</svg>`;
});

// a four-blade pinwheel: a nod to Airflow's logo, drawn from scratch
const BLADES = ['#017CEE', '#00B2D6', '#12B76A', '#F04438'];
const wheels = $$('svg.wheel').map(svg => {
  svg.innerHTML = '<g>' + BLADES.map((c, i) =>
    `<path d="M0 0C-12-30-10-66 8-94 34-80 50-50 44-22 30-8 14-2 0 0Z" fill="${c}" transform="rotate(${i * 90})"/>`
  ).join('') + '<circle r="10" fill="#fff"/><circle r="4.5" fill="#0B1220"/></g>';
  return svg.firstChild;
});

// ---------------------------------------------------------------- background
const bg = $('#bg').getContext('2d');
function blob(x, y, r, c) {
  const g = bg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(255,255,255,0)');
  bg.fillStyle = g; bg.fillRect(x - r, y - r, r * 2, r * 2);
}
function drawBg(t) {
  bg.globalAlpha = 1;
  bg.fillStyle = '#fff'; bg.fillRect(0, 0, 1920, 1080);
  blob(1500 + Math.sin(t * .05) * 260, 160 + Math.cos(t * .04) * 90, 950, 'rgba(1,124,238,0.055)');
  blob(260 + Math.cos(t * .035) * 160, 980, 820, 'rgba(0,178,214,0.045)');
  blob(1150, 1160 + Math.sin(t * .045) * 70, 700, 'rgba(18,183,106,0.03)');
  // a dot grid that drifts upward and fades out toward the edges
  const sp = 40, oy = sp - (t * 5) % sp;
  bg.fillStyle = '#98A2B3';
  for (let y = oy - sp; y < 1080 + sp; y += sp) for (let x = 20; x < 1920; x += sp) {
    const a = .2 * (1 - smooth(.3, 1.05, Math.hypot((x - 960) / 960, (y - 540) / 600)));
    if (a < .006) continue;
    bg.globalAlpha = a; bg.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
  }
  bg.globalAlpha = 1;
}

// ---------------------------------------------------------------- HUD
const CHAPTERS = [[0, 'The problem'], [at('airflow', 1) - .3, 'What it is'], [at('you') - .3, 'DAGs'],
  [at('now') - .3, 'Architecture'], [at('team') - .6, 'In short']];
let lastChap = -1;
function drawHud(t) {
  $('#hud-prog').style.width = (100 * clamp(t / END)).toFixed(3) + '%';
  let k = 0;
  CHAPTERS.forEach(([s], i) => { if (t >= s) k = i; });
  if (k !== lastChap) {
    $('#hud-num').textContent = String(k + 1).padStart(2, '0');
    $('#hud-chap').textContent = CHAPTERS[k][1];
    lastChap = k;
  }
}
tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .8, ease: 'power1.out' }, at('airflow', 1) - .3);
tl.to('#hud', { autoAlpha: 0, duration: .6, ease: 'power1.in' }, at("that's") - .3);

// ---------------------------------------------------------------- S1 · the morning run
show('#s1', 0, at('something', 1) + .3);
const COLS = 32, ROWS = 12;
$('#s1-grid').innerHTML = '<i></i>'.repeat(COLS * ROWS);
const T0 = at('thousands') - .1;
const FAIL = { r: 4, c: 21, t: at('fails') - .05 };
const runCells = $$('#s1-grid i').map((el, k) => {
  const r = Math.floor(k / COLS), c = k % COLS;
  const t1 = T0 + c * .05 + hash(r, c) * .35;
  return { el, r, c, t1, t2: t1 + .3 + hash(c + 50, r) * .45, fail: r === FAIL.r && c === FAIL.c, last: '' };
});
function drawRuns(t) {
  for (const c of runCells) {
    let s = t < c.t1 ? '' : t < c.t2 ? 'run' : 'ok';
    if (c.fail && t >= c.t1) s = t < FAIL.t ? 'run' : 'bad';  // the one that hangs, then fails
    if (s !== c.last) { c.el.className = s; c.last = s; }
  }
}
rise('#s1-clock', at('morning') - .3, { y: 20, d: 1.1 });
rise('#s1-sub', at('before') - .1, { y: 12 });
tl.fromTo('#s1-grid i', { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.6)',
  stagger: { each: .0028, grid: [ROWS, COLS], from: 'center' } }, at('anyone') - .3);
leave(['#s1-clock', '#s1-sub'], at('something') - .45, { d: .6 });
tl.to('#s1-runs', { y: -160, scale: .8, duration: 1.2, ease: 'power3.inOut' }, at('something') - .45);
rise('#q1', at('when') - .15);
rise('#q2', at('in') - .1);
rise('#q3', at('what', 1) - .1);
tl.fromTo('#s1-ring', { opacity: .9, scale: .7 }, { opacity: 0, scale: 2.4, duration: 1.1, ease: 'power2.out', repeat: 1, immediateRender: false }, FAIL.t);
tl.to('#q3', { borderColor: '#FDA29B', boxShadow: '0 1px 2px rgba(16,24,40,.04),0 14px 36px -10px rgba(240,68,56,.28)', duration: .5 }, FAIL.t);
leave(['#s1-runs', '#q1', '#q2', '#q3'], at('companies') - .2, { y: '-=30', d: .7, st: .05 });

// ---------------------------------------------------------------- S2 · what it is
show('#s2', at('something', 1) - .3, at('you') - .1);
tl.fromTo('#wheel2', { autoAlpha: 0, scale: .4, rotation: -160 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.8, ease: 'expo.out' }, at('apache') - .3);
tl.fromTo('#wm2a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('apache') - .1);
tl.fromTo('#wm2b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('airflow') - .1);
tl.to('#lock2', { y: -128, scale: .74, duration: 1.2, ease: 'power3.inOut' }, at('airflow', 1) - .2);
cueWords($('#def'), ['An', '<em>open-source</em>', 'tool', 'for', '<span class="mk">orchestrating</span>', '<span class="mk">workflows.</span>'], 'an');
tl.to('#def .mk', { backgroundSize: '100% 100%', duration: .55, ease: 'power2.out', stagger: .3 }, at('workflows') + .25);
leave(['#lock2', '#def'], at('orchestrating', 1) - .5, { y: '-=30', d: .6, st: .06 });

rise('#s2-tag', at('orchestrating', 1) - .05, { y: 12 });
rise('#rc1', at('task') - .3, { y: 40, d: .9 });
rise('#rc2', at('time') - .3, { y: 40, d: .9 });
rise('#rc3', at('order', 1) - .3, { y: 40, d: .9 });
leave(['#s2-tag', '#rc1', '#rc2', '#rc3'], at('started') + .05, { y: '-=30', st: .05 });

rise('#s2-tag2', at('airbnb') + .15, { y: 12 });
rise('.tl-track', at('airbnb') + .15, { y: 0, d: .6 });
rise('#tn1', at('2014') - .5, { y: 24 });
tl.to('#tl-fill', { scaleX: .5, duration: 1, ease: 'power2.inOut' }, at('today') - .55);
rise('#tn2', at('today') - .05, { y: 24 });
tl.to('#tl-fill', { scaleX: 1, duration: .9, ease: 'power2.inOut' }, at('toplevel') - .65);
rise('#tn3', at('toplevel') - .1, { y: 24 });
tl.to('#tn3 .dot', { backgroundColor: '#017CEE', scale: 1.2, duration: .45 }, at('project') - .1);
leave(['#s2-tag2', '#tline'], at('you') - .5, { y: '-=30', d: .5 });

// ---------------------------------------------------------------- S3 · DAGs
show('#s3', at('you') - .3, at('now') + .6);
const K = s => `<span class="k">${s}</span>`, F = s => `<span class="f">${s}</span>`, S = s => `<span class="s">${s}</span>`;
const D = s => `<span class="d">${s}</span>`, N = s => `<span class="n">${s}</span>`;
const CODE = [
  `${K('from')} datetime ${K('import')} datetime`,
  `${K('from')} airflow.sdk ${K('import')} dag, task`,
  ``,
  `${D('@dag')}(schedule=${S('"@daily"')},`,
  `     start_date=datetime(${N('2026')}, ${N('1')}, ${N('1')}))`,
  `${K('def')} ${F('orders_pipeline')}():`,
  ``,
  `    ${D('@task')}`,
  `    ${K('def')} ${F('extract')}():`,
  `        ${K('return')} get_orders()`,
  ``,
  `    ${D('@task')}`,
  `    ${K('def')} ${F('transform')}(orders):`,
  `        ${K('return')} clean(orders)`,
  ``,
  `    ${D('@task')}`,
  `    ${K('def')} ${F('load')}(rows):`,
  `        write_to_warehouse(rows)`,
  ``,
  `    load(transform(extract()))`,
  ``,
  `orders_pipeline()`,
];
$('#code-body').insertAdjacentHTML('beforeend', CODE.map((l, i) => `<div class="ln"><span class="no">${i + 1}</span>${l}</div>`).join(''));
const LH = 31, PADT = 24;
rise('#code', at('you') - .25, { y: 30, d: 1 });
tl.fromTo('#code-body .ln', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .45, stagger: .065, ease: 'power2.out' }, at('write') - .1);
tl.set('#code-hl', { top: PADT + 3 * LH, height: 3 * LH }, 0);
const band = (t, from, n) => tl.to('#code-hl', { autoAlpha: 1, top: PADT + from * LH, height: n * LH, duration: .5, ease: 'power3.inOut' }, t);
band(at('dag') - .15, 3, 3);
band(at('extract') - .15, 7, 3);
band(at('transform') - .15, 11, 3);
band(at('load') - .15, 15, 3);
band(at('dependencies') - .25, 19, 1);
tl.to('#code-hl', { autoAlpha: 0, duration: .5 }, at('succeed') + .3);

tl.fromTo('.dl b', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .9, stagger: .08, ease: 'expo.out' }, at('dag') - .1);
[['#dl1', 'directed'], ['#dl2', 'acyclic'], ['#dl3', 'graph']].forEach(([id, w]) => {
  tl.to(`${id} b`, { color: '#0B1220', duration: .35 }, at(w) - .05);
  rise(`${id} span`, at(w) - .05, { y: 10, d: .6 });
});

const s3 = $('#s3-links');
// straight edges with a chevron head: [x1, y1, x2, y2]
function edgeSvg(id, [x1, y1, x2, y2]) {
  const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1), s = 9, w = 7.5;
  const hp = (sx, sy) => `${x2 - dx * s + sx} ${y2 - dy * s + sy}`;
  return `<path class="edge" id="${id}" d="M${x1} ${y1} L${x2} ${y2}"/>` +
    `<path class="head" id="${id}h" d="M${hp(-dy * w, dx * w)} L${x2} ${y2} L${hp(dy * w, -dx * w)}"/>`;
}
const S3E = { e1: [1162, 652, 1262, 652], e2: [1497, 652, 1597, 652], e3: [1715, 718, 1715, 758] };
s3.innerHTML = Object.entries(S3E).map(([k, v]) => edgeSvg(k, v)).join('') + '<circle id="pkt1" r="6" fill="#12B76A"/><circle id="pkt2" r="6" fill="#12B76A"/>';
function drawEdge(ids, t, d = .6) {
  tl.fromTo(ids.map(i => '#' + i), { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: 'power2.inOut', stagger: .15 }, t);
  tl.to(ids.map(i => `#${i}h`), { opacity: 1, duration: .25, stagger: .15 }, t + d - .15);
}
rise('#n-extract', at('extract') - .2, { y: 24 });
rise('#n-transform', at('transform') - .2, { y: 24 });
rise('#n-load', at('load') - .2, { y: 24 });
drawEdge(['e3'], at('warehouse') - .3, .4);
rise('#wh', at('warehouse') - .1, { y: 14 });
drawEdge(['e1', 'e2'], at('arrows') - .1);
gsap.set('#dep-label', { xPercent: -50 });
rise('#dep-label', at('dependencies') - .1, { y: 8 });

const RUNS = [
  ['#n-extract', [[at('only') - .1, 'running'], [at('after'), 'success']]],
  ['#n-transform', [[at('after') + .2, 'running'], [at('before', 1) - .1, 'success']]],
  ['#n-load', [[at('before', 1) + .1, 'running'], [at('succeed') + .25, 'success']]],
].map(([sel, sched]) => ({ el: $(sel), dot: $(`${sel} .sd`), label: $(`${sel} .node-s span`), sched, last: '' }));
const PKTS = [[$('#pkt1'), S3E.e1, at('after') - .1], [$('#pkt2'), S3E.e2, at('before', 1) - .25]];
function drawStates(t) {
  for (const n of RUNS) {
    let s = 'queued';
    for (const [ts, st] of n.sched) if (t >= ts) s = st;
    if (s !== n.last) { n.el.classList.remove('running', 'success'); if (s !== 'queued') n.el.classList.add(s); n.label.textContent = s; n.last = s; }
    n.dot.style.transform = s === 'running' ? `scale(${1 + .3 * Math.sin(t * 9)})` : '';
  }
  // a packet of data hops along the edge when the upstream task succeeds
  for (const [el, [x1, y1, x2], t0] of PKTS) {
    const k = clamp((t - t0) / .45);
    el.setAttribute('cx', x1 + (x2 - x1) * gsap.parseEase('power1.inOut')(k));
    el.setAttribute('cy', y1);
    el.setAttribute('opacity', k > 0 && k < 1 ? Math.min(1, k * 6, (1 - k) * 6) : 0);
  }
}
leave(['#code', '.dl', '.node', '#wh', '#dep-label', '#s3-links'], at('now') - .3, { y: '-=24', st: .03 });

// ---------------------------------------------------------------- S4 · architecture
show('#s4', at('now') - .3, at('so', 2) + .9);
rise('#s4-title', at('now') - .15, { y: 20, d: .9 });
leave('#s4-title', at('processor') - .6, { y: '-=36', d: .6 });

const camW = { x: 450, y: 560, z: 1.45 };
const camTo = (t, x, y, z, d = 1.4) => tl.to(camW, { x, y, z, duration: d, ease: 'power2.inOut' }, t);
camTo(at('saves') - .2, 700, 640, 1.3);
camTo(at('scheduler') - .5, 960, 640, 1.2);
camTo(at('executor') - .6, 1180, 640, 1.2);
camTo(at('every', 1) - .3, 960, 565, 1, 1.6);
camTo(at('see') - .6, 960, 335, 1.85, 1.5);
camTo(at('so', 2) - .35, 960, 560, 1.05, 1);
function drawWorld() {
  $('#world').style.transform = `translate(960px,540px) scale(${camW.z.toFixed(5)}) translate(${(-camW.x).toFixed(3)}px,${(-camW.y).toFixed(3)}px)`;
}

const comp = (sel, t) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8 }, t);
comp('#c-proc', at('dag', 2) - .15);
comp('#c-files', at('python', 1) - .25);
comp('#c-db', at('metadata') - .3);
comp('#c-sched', at('scheduler') - .25);
comp('#c-exec', at('executor') - .3);
comp('#c-work', at('workers') - .3);
comp('#c-ui', at('web') - .25);

function focus(sel, a, b) {
  tl.fromTo(`${sel} .ring`, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, immediateRender: false }, a);
  tl.to(`${sel} .ring`, { autoAlpha: 0, duration: .5 }, b);
}
focus('#c-proc', at('dag', 2) - .1, at('python', 1) - .2);
focus('#c-files', at('python', 1) - .2, at('saves'));
focus('#c-db', at('metadata') - .2, at('scheduler') - .3);
focus('#c-sched', at('scheduler') - .3, at('executor') - .4);
focus('#c-exec', at('executor') - .4, at('workers') - .3);
focus('#c-work', at('workers') - .3, at('every', 1) - .2);
focus('#c-db', at('goes') - .15, at('web') - .3);
focus('#c-ui', at('web') - .3, at('so', 2) - .3);

const S4E = {
  a1: [402, 560, 497, 560], a2: [650, 627, 650, 762], a3: [1255, 627, 1255, 762], a3b: [1285, 762, 1285, 628],
  a4: [1422, 560, 1517, 560], a5: [1670, 627, 1670, 749], a6: [1518, 830, 1423, 830],
  a7: [950, 762, 950, 378], a7b: [970, 378, 970, 762],
};
$('#s4-links').innerHTML = Object.entries(S4E).map(([k, v]) => edgeSvg(k, v)).join('') + '<g id="dots"></g>';
drawEdge(['a1'], at('files') - .15);
drawEdge(['a2'], at('saves') - .05, .7);
drawEdge(['a3', 'a3b'], at('checks') - .1);
drawEdge(['a4'], at('hands'));
drawEdge(['a5'], at('sends') - .05);
drawEdge(['a6'], at('goes') - .15);
drawEdge(['a7', 'a7b'], at('sits') - .15, .7);
const labels = $$('#world .arrow-label');
[at('saves') + .5, at('database', 1), at('workers') + .2, at('back') + .2, at('top')].forEach((t, i) => rise(labels[i], t, { y: 6, d: .5 }));

// little dots that keep flowing along each connection once it exists
const STATE_C = ['#2E90FA', '#12B76A', '#12B76A', '#98A2B3', '#12B76A', '#F04438'];
const FLOWS = [
  ['a1', '#F79009', at('files') + .4], ['a2', '#7A5AF8', at('saves') + .6], ['a3', '#017CEE', at('checks') + .5],
  ['a3b', '#444CE7', at('checks') + .7], ['a4', '#017CEE', at('hands') + .5], ['a5', '#0E9384', at('sends') + .5],
  ['a6', null, at('goes') + .4], ['a7', '#444CE7', at('sits') + .5], ['a7b', '#DD2590', at('sits') + .9],
].map(([k, color, t0]) => {
  const [x1, y1, x2, y2] = S4E[k], len = Math.hypot(x2 - x1, y2 - y1);
  const dots = Array.from({ length: 3 }, () => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', 4.5); $('#dots').appendChild(c); return c;
  });
  return { x1, y1, x2, y2, len, color, t0, dots };
});
function drawFlows(t) {
  const gap = 52, v = 70;
  for (const f of FLOWS) f.dots.forEach((el, k) => {
    const s = (t - f.t0) * v - k * gap;
    const cyc = Math.floor(s / (f.len + gap)), p = s - cyc * (f.len + gap);
    const on = t >= f.t0 && s >= 0 && p <= f.len;
    el.setAttribute('opacity', on ? Math.min(1, p / 14, (f.len - p) / 14).toFixed(3) : 0);
    if (!on) return;
    const u = p / f.len;
    el.setAttribute('cx', (f.x1 + (f.x2 - f.x1) * u).toFixed(2));
    el.setAttribute('cy', (f.y1 + (f.y2 - f.y1) * u).toFixed(2));
    el.setAttribute('fill', f.color || STATE_C[(cyc * 3 + k) % STATE_C.length]);
  });
}

tl.fromTo('#ready', { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2.2)' }, at('ready') - .1);
tl.to('#ready', { autoAlpha: 0, scale: .8, duration: .4 }, at('executor', 1));
[['#p-queued', 'queued'], ['#p-running', 'running', 1], ['#p-success', 'success'], ['#p-failed', 'failed']].forEach(([sel, w, n = 0]) =>
  tl.fromTo(sel, { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, at(w, n) - .1));
tl.to('#c-db', { scale: 1.025, duration: .25, yoyo: true, repeat: 1, ease: 'power2.inOut' }, at('database', 2) - .1);

// workers chew through tasks once they are "doing the actual work"
const WT = at('actual') - .4, bars = [$('#wb1'), $('#wb2'), $('#wb3')];
function drawWorkers(t) {
  bars.forEach((b, i) => {
    const p = t < WT ? 0 : ((t - WT) * (.42 + i * .09) + i * .31) % 1.2;
    b.style.width = (100 * Math.min(1, p)).toFixed(2) + '%';
  });
}

// the web UI: runs fill in, one task fails, a click retries it
const mini = $('#mini');
mini.innerHTML = '<i></i>'.repeat(27);
const miniCells = $$('#mini i');
const BAD = { r: 2, c: 6 }, tSee = at('see') - .15, tClick = at('click') - .12;
function drawMini(t) {
  miniCells.forEach((el, k) => {
    const r = Math.floor(k / 9), c = k % 9;
    let s = t < tSee + c * .08 + r * .03 ? '' : 'ok';
    if (s && r === BAD.r && c === BAD.c) s = t < tClick ? 'bad' : t < tClick + .6 ? 'run' : 'ok';
    if (el.className !== s) el.className = s;
  });
}
rise('#logs', at('read') - .15, { y: 10, d: .6 });
// everything but the UI steps back while the camera is on it
tl.to(['#c-files', '#c-proc', '#c-sched', '#c-exec', '#c-work', '#c-db'], { opacity: .3, duration: .8, ease: 'power1.inOut' }, at('see') - .5);
tl.set('#log-bad', { display: 'none' }, tClick + .6);
tl.set('#log-ok', { display: 'inline' }, tClick + .6);
tl.to('#logs', { autoAlpha: 0, duration: .4 }, at('so', 2) - .5);

// ---------------------------------------------------------------- S5 · in short + close
show('#s5', at('so', 2) - .1, null);
rise('#s5-tag', at('team') - .25, { y: 12 });
cueWords($('#quote'), ['<span class="qm">“</span>We', 'use', 'Airflow.<span class="qm">”</span>'], 'we');
[['#ta1', at('pipelines', 1) - .25], ['#ta2', at('schedule') - .4], ['#ta3', at('breaks') - .45]].forEach(([sel, t]) => {
  rise(sel, t, { y: 22 });
  tl.fromTo(`${sel} .tick`, { scale: .3 }, { scale: 1, duration: .7, ease: 'back.out(2.4)' }, t + .1);
});
leave(['#s5-tag', '#quote', '#ta1', '#ta2', '#ta3'], at("that's") - .35, { y: '-=24', st: .04 });
tl.fromTo('#wheel5', { autoAlpha: 0, scale: .4, rotation: -160 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.8, ease: 'expo.out' }, at("that's") + .05);
tl.fromTo('#wm5a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('apache', 2) - .1);
tl.fromTo('#wm5b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('airflow', 3) - .1);
rise('#lock5-sub', at('airflow', 3) + .45, { y: 12, d: 1 });
rise('#credit', at('airflow', 3) + .9, { y: 8, d: 1 });
tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);

function build() {
  // the cursor needs the failed cell's position in world space; offsets ignore transforms
  const cell = miniCells[BAD.r * 9 + BAD.c], card = $('#c-ui');
  const cx = card.offsetLeft + card.clientLeft + cell.offsetLeft + cell.offsetWidth / 2;
  const cy = card.offsetTop + card.clientTop + cell.offsetTop + cell.offsetHeight / 2;
  gsap.set('#ripple', { left: cx, top: cy });
  // the arrow's tip sits at (7, 3.5) in the 36px cursor
  tl.fromTo('#cursor', { autoAlpha: 0, x: cx + 170, y: cy + 190 }, { autoAlpha: 1, x: cx + 120, y: cy + 140, duration: .4, ease: 'power2.out' }, at('retry') - .6);
  tl.to('#cursor', { x: cx - 7, y: cy - 3.5, duration: 1, ease: 'power2.inOut' }, at('retry') - .25);
  tl.to('#cursor', { scale: .82, duration: .1, yoyo: true, repeat: 1, transformOrigin: '20% 10%', ease: 'power1.inOut' }, tClick - .05);
  tl.fromTo('#ripple', { autoAlpha: .9, scale: .6 }, { autoAlpha: 0, scale: 2.8, duration: .8, ease: 'power2.out', immediateRender: false }, tClick);
  tl.to('#cursor', { autoAlpha: 0, duration: .4 }, at('so', 2) - .5);
  tl.to('#world', { autoAlpha: 0, duration: .6, ease: 'power2.in' }, at('so', 2) - .35);

  window.render = t => {
    tl.seek(t, false);
    wheels.forEach(g => g.setAttribute('transform', `rotate(${(t * 9).toFixed(3)})`));
    drawBg(t); drawHud(t); drawRuns(t); drawStates(t); drawFlows(t); drawWorkers(t); drawMini(t); drawWorld();
  };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(build));
