// Personal AI Agents graphics: one page, one scene per graphic (index.html?g=08).
// Each scene is a paused GSAP timeline, so window.render(t) always draws the
// same frame for the same t. Timing comes from the scene's line in the script:
// a word's cue is its position in the paragraph at WPM words a minute. After
// recording, pass ?wpm= to match the real pace, or move individual cues.
gsap.registerPlugin(DrawSVGPlugin);

const Q = new URLSearchParams(location.search);
// ?slot=N plays slot N of the finished video (vo/timing.js): its scene, its
// length, and cues at the times Chris's narration actually says each word
const SLOT = Q.has('slot') ? window.SLOTS[+Q.get('slot') - 1] : null;
const ID = SLOT ? SLOT.scene : Q.get('g') || '01';
const CUE = 0.12;   // with real timing, start a beat before the word is heard
const WPM = +(Q.get('wpm') || 150);
const LEAD = 0.6;   // the graphic is on screen a beat before the first word
const TAIL = 1.6;   // and holds a beat after the last one

const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });

const norm = s => s.toLowerCase().replace(/[^a-z0-9$¢']/g, '');
function speech(text) {
  if (SLOT) {
    const at = (phrase, n = 0) => {
      const p = phrase.split(/\s+/).map(norm), W = SLOT.words;
      for (let i = 0, k = 0; i <= W.length - p.length; i++)
        if (p.every((w, j) => W[i + j][0] === w) && k++ === n) return Math.max(0, W[i][1] - CUE);
      throw Error(`no cue "${phrase}" #${n} in slot ${SLOT.id}`);
    };
    at.end = SLOT.dur;
    return at;
  }
  const words = text.split(/\s+/).filter(Boolean).map(norm);
  const sec = 60 / WPM;
  const at = (phrase, n = 0) => {
    const p = phrase.split(/\s+/).map(norm);
    for (let i = 0, k = 0; i <= words.length - p.length; i++)
      if (p.every((w, j) => words[i + j] === w) && k++ === n) return LEAD + i * sec;
    throw Error(`no cue "${phrase}" #${n} in scene ${ID}`);
  };
  at.end = LEAD + words.length * sec;
  return at;
}

function add(html, parent = stage) {
  const d = document.createElement('div');
  d.innerHTML = html.trim();
  const el = d.firstElementChild;
  parent.appendChild(el);
  return el;
}

const ICON = {
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  server: '<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 16.5h.01"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  agent: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M5 19l2.8-2.8M16.2 7.8 19 5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M12 8v5M12 16h.01"/>',
};
const icon = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${ICON[name]}</svg>`;

// animation helpers, all placed on the one timeline
const IN = (el, t, v = {}) => tl.from(el, { autoAlpha: 0, y: 40, ...v }, t);
const POP = (el, t, v = {}) => tl.from(el, { autoAlpha: 0, scale: 0.82, ease: 'back.out(1.8)', duration: 0.55, ...v }, t);
const FADE = (el, t, v = {}) => tl.from(el, { autoAlpha: 0, duration: 0.5, ...v }, t);
const OUT = (el, t, v = {}) => tl.to(el, { autoAlpha: 0, duration: 0.45, ...v }, t);
const DRAW = (el, t, d = 0.8) => tl.from(el, { drawSVG: '0%', duration: d, ease: 'power2.inOut' }, t);
function COUNT(el, t, to, { dur = 1.1, fmt = v => Math.round(v).toLocaleString('en-US') } = {}) {
  const o = { v: 0 };
  el.textContent = fmt(0);
  tl.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) }, t);
}
function TYPE(el, t, text, cps = 38) {
  const o = { n: 0 };
  el.textContent = '';
  tl.to(o, { n: text.length, duration: text.length / cps, ease: 'none', onUpdate: () => (el.textContent = text.slice(0, Math.round(o.n))) }, t);
}

// Real footage: clips are pre-extracted JPEG frames (see clips.sh), shown in an
// <img> and stepped in render(t), so every frame is exact and repeatable.
const CLIPS = [];
function CLIP(img, name, t0, { fps = 30, rate = 1 } = {}) {
  const n = (window.CLIP_FRAMES || {})[name];
  if (!n) throw Error('clip not extracted: ' + name + ' (run clips.sh)');
  CLIPS.push({ img, name, t0, fps, rate, n, cur: -1 });
  img.src = `clips/${name}/f00001.jpg`;
}
async function syncClips(t) {
  const waits = [];
  for (const c of CLIPS) {
    const k = Math.min(c.n, Math.max(1, 1 + Math.floor((t - c.t0) * c.fps * c.rate)));
    if (k === c.cur) continue;
    c.cur = k;
    c.img.src = `clips/${c.name}/f${String(k).padStart(5, '0')}.jpg`;
    waits.push(c.img.decode().catch(() => {}));
  }
  await Promise.all(waits);
}

function hud(chapter) {
  add(`<div id="hud"><div class="corner c-tl"></div><div class="corner c-tr"></div><div class="corner c-bl"></div><div class="corner c-br"></div>
    <div class="hud-tl"><b>■</b> STACKLE · PERSONAL AI AGENTS</div><div class="hud-tr">${chapter}</div></div>`, document.body);
}

const SCENES = {};
const scene = (id, def) => (SCENES[id] = def);

window.addEventListener('load', async () => {
  const s = SCENES[ID];
  if (!s) throw Error('no scene ' + ID);
  const at = speech(s.text);
  if (s.chapter && !document.body.classList.contains('light')) hud(s.chapter);
  s.build(at);
  window.DURATION = SLOT ? SLOT.dur : +(s.duration || at.end + TAIL).toFixed(2);
  await document.fonts.ready;
  // resolve to nothing: Playwright would try to serialise the timeline
  window.render = async t => { tl.seek(t, false); await syncClips(t); };
  await window.render(0);
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  window.READY = true;
});
