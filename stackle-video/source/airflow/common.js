// Shared by both cuts of "Apache Airflow, explained": the landscape video
// (index.html + scene.js) and the vertical TikTok cut (vertical.html +
// vertical.js). Cue lookup, the paused timeline and its helpers, icons,
// the pinwheel, the background and straight connector edges.
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
  branch: '<circle cx="6" cy="5.5" r="2.3"/><circle cx="6" cy="18.5" r="2.3"/><circle cx="18" cy="8" r="2.3"/><path d="M6 7.8v8.4M18 10.3c0 4-5 4.2-10.6 6.6"/>',
  flow: '<rect x="3" y="3.5" width="7" height="7" rx="1.8"/><rect x="14" y="13.5" width="7" height="7" rx="1.8"/><path d="M10 7h3.5a3 3 0 0 1 3 3v3.5"/>',
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
// White, with soft colour fields (each cut places its own) and a dot grid
// that drifts upward and fades out toward the edges.
const bg = $('#bg').getContext('2d');
const BW = bg.canvas.width, BH = bg.canvas.height;
function blob(x, y, r, c) {
  const g = bg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(255,255,255,0)');
  bg.fillStyle = g; bg.fillRect(x - r, y - r, r * 2, r * 2);
}
function drawBg(t, fields) {
  bg.globalAlpha = 1;
  bg.fillStyle = '#fff'; bg.fillRect(0, 0, BW, BH);
  for (const f of fields) blob(...f(t));
  const sp = 40, oy = sp - (t * 5) % sp;
  bg.fillStyle = '#98A2B3';
  for (let y = oy - sp; y < BH + sp; y += sp) for (let x = 20; x < BW; x += sp) {
    const a = .2 * (1 - smooth(.3, 1.05, Math.hypot((x - BW / 2) / (BW / 2), (y - BH / 2) / (BH * 5 / 9))));
    if (a < .006) continue;
    bg.globalAlpha = a; bg.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
  }
  bg.globalAlpha = 1;
}

// ---------------------------------------------------------------- connectors
// straight edges with a chevron head: [x1, y1, x2, y2]
function edgeSvg(id, [x1, y1, x2, y2]) {
  const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1), s = 9, w = 7.5;
  const hp = (sx, sy) => `${x2 - dx * s + sx} ${y2 - dy * s + sy}`;
  return `<path class="edge" id="${id}" d="M${x1} ${y1} L${x2} ${y2}"/>` +
    `<path class="head" id="${id}h" d="M${hp(-dy * w, dx * w)} L${x2} ${y2} L${hp(dy * w, -dx * w)}"/>`;
}
function drawEdge(ids, t, d = .6) {
  tl.fromTo(ids.map(i => '#' + i), { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: 'power2.inOut', stagger: .15 }, t);
  tl.to(ids.map(i => `#${i}h`), { opacity: 1, duration: .25, stagger: .15 }, t + d - .15);
}
