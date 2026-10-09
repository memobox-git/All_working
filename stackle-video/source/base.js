// Shared timeline engine. Elements declare timing with attributes:
//   data-in="1.2"  data-out="5"  (seconds)  data-fx="up|left|scale|fade"
//   data-count="200000" data-cin="1.5"  -> number counts up over 1.2s
//   data-bar="0.8" data-bin="2"           -> width grows to 80% over 1s
const ease = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const D = 0.55;
window.render = t => {
  document.querySelectorAll('[data-in]').forEach(el => {
    const a = +el.dataset.in, b = el.dataset.out ? +el.dataset.out : 1e9;
    const p = ease((t - a) / D) * (1 - ease((t - b) / (D * 0.7)));
    const fx = el.dataset.fx || 'up';
    const off = 1 - p;
    const tf = fx === 'left' ? `translateX(${-80 * off}px)`
      : fx === 'scale' ? `scale(${0.85 + 0.15 * p})`
      : fx === 'fade' ? 'none' : `translateY(${50 * off}px)`;
    el.style.opacity = p;
    el.style.transform = tf;
  });
  document.querySelectorAll('[data-count]').forEach(el => {
    const p = ease((t - +el.dataset.cin) / 1.2);
    el.textContent = Math.round(+el.dataset.count * p).toLocaleString('en-US') + (el.dataset.suffix || '');
  });
  document.querySelectorAll('[data-bar]').forEach(el => {
    el.style.width = (100 * +el.dataset.bar * ease((t - +el.dataset.bin) / 1)) + '%';
  });
  document.querySelectorAll('[data-spin]').forEach(el => {
    el.style.transform = `rotate(${t * +el.dataset.spin}deg)`;
  });
};
