// Shared by the long video (scene.js) and the Shorts (shorts.js): word cues, shot transitions,
// clip playback and icons. Needs work/cues.js (window.WORDS, SECTIONS, CLIPFRAMES) loaded first.
const D = window.SECTIONS.duration;
window.DURATION = D;
window.SFX = [];
const FPS = 30;
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
const shots = document.getElementById('shots');
const MISSING = [];

// ---------------------------------------------------------------- word cues
const norm = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]/g, '');
const WORDS = window.WORDS.map(w => ({ ...w, n: norm(w.w) })).filter(w => w.n);
const SEC = n => window.SECTIONS.sections[n - 1];
// Start time of the first word of `phrase` in section `sec` (after time `after`).
function T(sec, phrase, after = 0) {
  const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
  const list = WORDS.filter(w => w.sec === sec && w.s >= after);
  for (let i = 0; i + toks.length <= list.length; i++)
    if (toks.every((t, k) => list[i + k].n === t || list[i + k].n.startsWith(t))) return list[i].s;
  MISSING.push(`${sec}: ${phrase}`);
  return SEC(sec).start;
}
const sfx = (t, kind, gain = 1) => window.SFX.push({ t: +t.toFixed(3), kind, gain });

// ---------------------------------------------------------------- building
function add(html, parent = shots) {
  const d = document.createElement('div'); d.innerHTML = html.trim();
  const el = d.firstElementChild; parent.appendChild(el); return el;
}
const q = (el, s) => el.querySelectorAll(s);
const q1 = (el, s) => el.querySelector(s);
const SHOTS = [];
// Shows a whole shot from tin to tout with a soft blur dissolve.
function shot(el, tin, tout, o = {}) {
  const inD = o.inD ?? 0.7, outD = o.outD ?? 0.55;
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: o.s0 ?? 1.035, filter: 'blur(16px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: inD, ease: 'power2.out' }, tin);
  tl.set(el, { filter: 'none' }, tin + inD);
  if (tout != null) tl.to(el, { autoAlpha: 0, scale: o.s1 ?? 0.985, filter: 'blur(14px)', duration: outD, ease: 'power2.in' }, tout - outD * 0.5);
  SHOTS.push({ el, tin, tout: tout ?? D });
  return el;
}
function rise(targets, t, o = {}) {
  tl.fromTo(targets, { autoAlpha: 0, y: o.y ?? 36, filter: 'blur(8px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: o.d ?? 0.7, stagger: o.st ?? 0.09 }, t);
  if (o.sfx !== false) sfx(t, o.sfx || 'soft');
}
function pop(targets, t, o = {}) {
  tl.fromTo(targets, { autoAlpha: 0, scale: o.from ?? 0.82, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: o.st ?? 0.08 }, t);
  if (o.sfx !== false) sfx(t, 'pop', o.gain ?? 1);
}
const hide = (targets) => gsap.set(targets, { autoAlpha: 0 });
function focusOn(items, i, t) {        // brighten one item of a list, dim the rest
  items.forEach((el, k) => tl.to(el, { opacity: k === i ? 1 : 0.38, duration: 0.45, ease: 'power2.out' }, t));
}
function count(el, to, t, d = 1.2, fmt = n => Math.round(n).toLocaleString('en-US')) {
  const o = { v: 0 };
  tl.fromTo(o, { v: 0 }, { v: to, duration: d, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v); } }, t);
  tl.call(() => {}, null, t); // keep the tween in place on seek
}
// Splits text into words that rise one by one.
function words(text, cls = '') { return text.split(' ').map(w => `<span class="w ${cls}">${w}</span>`).join(' '); }

// ---------------------------------------------------------------- clips
const CLIPS = [];  // segments: { img, name, src, tin, rate }
function clip(img, name, src, tin, rate = 1) { CLIPS.push({ img, name, src, tin, rate }); }
const pad5 = n => String(n).padStart(5, '0');
async function stepClips(t) {
  const byImg = new Map();
  for (const c of CLIPS) { if (!byImg.has(c.img)) byImg.set(c.img, []); byImg.get(c.img).push(c); }
  const jobs = [];
  for (const [img, segs] of byImg) {
    const host = img.closest('.shot'); const sh = SHOTS.find(s => s.el === host);
    if (sh && (t < sh.tin - 0.2 || t > sh.tout + 0.8)) continue;
    let seg = segs[0]; for (const s of segs) if (s.tin <= t) seg = s;
    const n = Math.max(1, Math.min(window.CLIPFRAMES[seg.name], Math.floor((seg.src + Math.max(0, t - seg.tin) * seg.rate) * FPS) + 1));
    const src = `work/clips/${seg.name}/${pad5(n)}.jpg`;
    if (img.dataset.cur !== src) { img.dataset.cur = src; img.src = src; jobs.push(img.decode().catch(() => {})); }
  }
  await Promise.all(jobs);
}

// ---------------------------------------------------------------- icons
const P = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  cloud: '<path d="M17.5 19H8a6 6 0 1 1 1.3-11.9A5 5 0 0 1 19 9.5a4.5 4.5 0 0 1-1.5 9.5z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>',
  brain: '<path d="M12 5a3 3 0 0 0-5.8 1A3 3 0 0 0 4 11a3 3 0 0 0 2 5 3 3 0 0 0 6 1V5zM12 5a3 3 0 0 1 5.8 1A3 3 0 0 1 20 11a3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  chart: '<path d="M3 3v18h18M7 15l4-4 3 3 5-6"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  browser: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  stocks: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  swap: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  thumb: '<path d="M7 10v11H3V10zM7 10l5-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.6 21H7"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>',
};
const ic = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${P[name]}</svg>`;
const icon = (name, tone = '') => `<div class="icon ${tone}">${ic(name)}</div>`;

