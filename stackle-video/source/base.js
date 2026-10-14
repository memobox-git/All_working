// Shared timeline engine. Elements declare timing with attributes:
//   data-in="1.2"  data-out="5"  (seconds)  data-fx="up|down|left|right|scale|pop|fade"
//   data-count="200000" data-cin="1.5"  -> number counts up over 1.2s (data-prefix, data-suffix, data-cdur)
//   data-bar="0.8" data-bin="2"           -> width grows to 80% over 1s (data-bdur)
//   data-h="0.6" data-hin="2"             -> height grows to 60% over 1s (data-hdur)
//   data-draw="2" data-ddur="0.8"         -> SVG stroke draws itself from t=2
//   data-glow="3" data-glowout="9"        -> sets --g from 0 to 1 (and back) for CSS colour changes
//   data-type="4" data-tps="30"           -> types its text out from t=4, 30 characters a second
//   data-mv="3 5 400 0"                   -> moves by (400px, 0px) between t=3 and t=5
const clamp = x => Math.min(Math.max(x, 0), 1);
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
const back = x => { x = clamp(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const D = 0.55;
// Optional re-timing, set per render: window.TS scales every cue time,
// window.TMAP maps cue times through [oldStart, oldEnd, newStart, newEnd] segments
// (a cue outside every segment never fires). Animation lengths stay the same.
// window.TWARP then bends the result through [[from, to], ...] anchor points, which lines
// the beats up with a recorded voiceover (straight lines past the first and last anchor).
const warp = (m, x) => {
  if (x <= m[0][0]) return m[0][1] + (x - m[0][0]);
  for (let i = 1; i < m.length; i++) if (x <= m[i][0]) { const [a, b] = m[i - 1], [c, d] = m[i]; return b + (x - a) * (d - b) / ((c - a) || 1); }
  const [a, b] = m[m.length - 1]; return b + (x - a);
};
const tm0 = x => {
  x = +x;
  const m = window.TMAP;
  if (m) { for (const [o0, o1, n0, n1] of m) if (x >= o0 && x <= o1) return n0 + (x - o0) * (n1 - n0) / ((o1 - o0) || 1); return 1e6; }
  return x * (window.TS || 1);
};
const tm = x => { const y = tm0(x); return window.TWARP && y < 1e5 ? warp(window.TWARP, y) : y; };
window.render = t => {
  document.querySelectorAll('[data-in]').forEach(el => {
    const a = tm(el.dataset.in), b = el.dataset.out ? tm(el.dataset.out) : 1e9;
    const p = ease((t - a) / D) * (1 - ease((t - b) / (D * 0.7)));
    const fx = el.dataset.fx || 'up';
    const off = 1 - p;
    const tf = fx === 'left' ? `translateX(${-80 * off}px)`
      : fx === 'right' ? `translateX(${80 * off}px)`
      : fx === 'down' ? `translateY(${-50 * off}px)`
      : fx === 'scale' ? `scale(${0.85 + 0.15 * p})`
      : fx === 'pop' ? `scale(${t < b ? 0.5 + 0.5 * back((t - a) / D) : 0.85 + 0.15 * p})`
      : fx === 'fade' ? 'none' : `translateY(${50 * off}px)`;
    el.style.opacity = p;
    el.style.transform = tf;
  });
  document.querySelectorAll('[data-count]').forEach(el => {
    const p = ease((t - tm(el.dataset.cin)) / +(el.dataset.cdur || 1.2));
    el.textContent = (el.dataset.prefix || '') + Math.round(+el.dataset.count * p).toLocaleString('en-US') + (el.dataset.suffix || '');
  });
  document.querySelectorAll('[data-bar]').forEach(el => {
    el.style.width = (100 * +el.dataset.bar * ease((t - tm(el.dataset.bin)) / +(el.dataset.bdur || 1))) + '%';
  });
  document.querySelectorAll('[data-h]').forEach(el => {
    el.style.height = (100 * +el.dataset.h * ease((t - tm(el.dataset.hin)) / +(el.dataset.hdur || 1))) + '%';
  });
  document.querySelectorAll('[data-draw]').forEach(el => {
    const len = el.getTotalLength ? el.getTotalLength() : 1000;
    const p = ease((t - tm(el.dataset.draw)) / +(el.dataset.ddur || 0.8));
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.strokeDashoffset = String(len * (1 - p));
  });
  document.querySelectorAll('[data-glow]').forEach(el => {
    const b = el.dataset.glowout ? tm(el.dataset.glowout) : 1e9;
    const g = ease((t - tm(el.dataset.glow)) / 0.45) * (1 - ease((t - b) / 0.45));
    el.style.setProperty('--g', g.toFixed(3));
  });
  document.querySelectorAll('[data-type]').forEach(el => {
    if (el.dataset.full === undefined) el.dataset.full = el.textContent;
    const n = Math.max(0, Math.floor((t - tm(el.dataset.type)) * +(el.dataset.tps || 30)));
    el.textContent = el.dataset.full.slice(0, n);
  });
  document.querySelectorAll('[data-mv]').forEach(el => {
    let [a, b, dx, dy] = el.dataset.mv.split(' ').map(Number); a = tm(a); b = tm(b);
    const p = ease((t - a) / (b - a));
    el.style.transform = `translate(${dx * p}px, ${dy * p}px)`;
  });
  document.querySelectorAll('[data-spin]').forEach(el => {
    el.style.transform = `rotate(${t * +el.dataset.spin}deg)`;
  });
};
