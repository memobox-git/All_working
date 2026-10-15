// Extends the shared timeline engine (../base.js) for the Senior to Staff graphics.
//   data-hl="1.6"    yellow highlight sweeps across the text from 1.6s
//   data-draw="2"    SVG path (with pathLength="1") draws itself from 2s
//   data-grow="1"    element grows from the left (scaleX 0 -> 1) from 1s
//   .weekstrip[data-range="3-9"][data-color="blue"][data-now="4"]  15-week strip
// The body declares data-dur (total seconds) and optional data-steps (seconds, comma separated),
// which the renderer uses for the MP4 length and the step stills.
const ease2 = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

document.querySelectorAll('.weekstrip').forEach(el => {
  const [a, b] = el.dataset.range.split('-').map(Number);
  const now = +(el.dataset.now || 0);
  el.innerHTML = Array.from({ length: 15 }, (_, i) => {
    const w = i + 1, on = w >= a && w <= (b || a);
    return `<div class="wk${on ? ' on ' + (el.dataset.color || 'blue') : ''}${w === now ? ' now' : ''}">${w}</div>`;
  }).join('') + (now ? `<div class="here" style="left:${((now - 0.5) / 15) * 100}%">I’m here</div>` : '');
});

const baseRender = window.render;
window.render = t => {
  baseRender(t);
  document.querySelectorAll('[data-hl]').forEach(el => {
    el.style.backgroundSize = `${100 * ease2((t - +el.dataset.hl) / 0.6)}% 100%`;
  });
  document.querySelectorAll('[data-draw]').forEach(el => {
    el.style.strokeDasharray = '1';
    el.style.strokeDashoffset = String(1 - ease2((t - +el.dataset.draw) / 0.8));
  });
  document.querySelectorAll('[data-grow]').forEach(el => {
    el.style.transformOrigin = 'left center';
    el.style.transform = `scaleX(${ease2((t - +el.dataset.grow) / 0.9)})`;
  });
};
window.render(+(document.body.dataset.preview || 99));
// Pages with data-manual-ready set data-ready themselves once their own layout is done.
if (!document.body.hasAttribute('data-manual-ready')) document.fonts.ready.then(() => { document.body.dataset.ready = '1'; });
