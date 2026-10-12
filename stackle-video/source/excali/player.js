// Plays an Excalidraw scene as a hand-drawn animation.
// Shapes go through rough.js with Excalidraw's own options and seeds, so each
// frame matches what the scene looks like in the Excalidraw editor.
// Timing lives in each element's customData:
//   at   second the element starts drawing     dur  seconds it takes to draw
//   out  second it fades away (optional)
// Frame elements are the camera: at "at" the view glides to that frame over "dur".
const NS = 'http://www.w3.org/2000/svg';
const svg = document.querySelector('svg');
const gen = rough.generator();
const LINE_HEIGHT = 1.25;
const FONT = 'Excalifont';
let items = [], cams = [];
window.duration = 0;

const clamp = x => Math.min(Math.max(x, 0), 1);
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const glide = x => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const node = (tag, attrs, parent) => {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
};

// Excalidraw shrinks the roughness of small shapes so they stay readable.
function roughness(el) {
  const max = Math.max(el.width, el.height), min = Math.min(el.width, el.height);
  if ((min >= 20 && max >= 50) || min >= 15 || el.type === 'line' || el.type === 'arrow') return el.roughness;
  return Math.min(el.roughness / (max < 10 ? 3 : 2), 2.5);
}

function options(el, continuous) {
  const filled = el.backgroundColor && el.backgroundColor !== 'transparent';
  return {
    seed: el.seed, strokeWidth: el.strokeWidth, roughness: roughness(el), stroke: el.strokeColor,
    fill: filled ? el.backgroundColor : undefined, fillStyle: el.fillStyle,
    fillWeight: el.strokeWidth / 2, hachureGap: el.strokeWidth * 4,
    disableMultiStroke: el.strokeStyle !== 'solid', preserveVertices: continuous || el.roughness < 2,
  };
}

function cornerRadius(size) { return size <= 128 ? size * 0.25 : 32; }

function arrowhead(points, sw) {
  const [x2, y2] = points[points.length - 1], [x1, y1] = points[points.length - 2];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const size = Math.min(25 + sw * 2, len * 0.5);
  const back = [x2 - (x2 - x1) / len * size, y2 - (y2 - y1) / len * size];
  const turn = a => {
    const c = Math.cos(a), s = Math.sin(a), dx = back[0] - x2, dy = back[1] - y2;
    return [x2 + dx * c - dy * s, y2 + dx * s + dy * c];
  };
  return [[turn(Math.PI / 9), [x2, y2]], [turn(-Math.PI / 9), [x2, y2]]];
}

function drawables(el) {
  const w = el.width, h = el.height;
  switch (el.type) {
    case 'rectangle': {
      if (!el.roundness) return [gen.rectangle(0, 0, w, h, options(el))];
      const r = cornerRadius(Math.min(w, h));
      return [gen.path(`M ${r} 0 L ${w - r} 0 Q ${w} 0, ${w} ${r} L ${w} ${h - r} Q ${w} ${h}, ${w - r} ${h} ` +
        `L ${r} ${h} Q 0 ${h}, 0 ${h - r} L 0 ${r} Q 0 0, ${r} 0`, options(el, true))];
    }
    case 'ellipse': return [gen.ellipse(w / 2, h / 2, w, h, { ...options(el), curveFitting: 1 })];
    case 'diamond': return [gen.polygon([[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]], options(el))];
    case 'line': case 'arrow': case 'freedraw': {
      const o = { ...options(el), fill: undefined };
      const shaft = el.roundness ? gen.curve(el.points, o) : gen.linearPath(el.points, o);
      if (el.type !== 'arrow' || !el.endArrowhead) return [shaft];
      return [shaft, ...arrowhead(el.points, el.strokeWidth).map(([a, b]) => gen.line(a[0], a[1], b[0], b[1], o))];
    }
  }
  return [];
}

// Turns one element into strokes that draw in order, plus solid fills that fade in.
function buildShape(el, g) {
  const fillG = node('g', {}, g), lineG = node('g', {}, g);
  const outline = [], hatch = [], solid = [];
  for (const d of drawables(el)) {
    for (const set of d.sets) {
      const path = gen.opsToPath(set, 2);
      if (set.type === 'fillPath') {
        solid.push(node('path', { d: path, fill: d.options.fill, stroke: 'none' }, fillG));
        continue;
      }
      const isHatch = set.type === 'fillSketch';
      for (const sub of path.split(/(?=M)/)) {
        const p = node('path', {
          d: sub, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          stroke: isHatch ? d.options.fill : d.options.stroke,
          'stroke-width': isHatch ? d.options.fillWeight : d.options.strokeWidth,
        }, isHatch ? fillG : lineG);
        (isHatch ? hatch : outline).push({ p, len: p.getTotalLength() || 1 });
      }
    }
  }
  const split = hatch.length || solid.length ? 0.6 : 1;
  const phases = [[outline, 0, split], [hatch, split, 1]];
  for (const [list] of phases) for (const s of list) s.p.setAttribute('stroke-dasharray', `${s.len} ${s.len}`);
  return p => {
    for (const [list, a, b] of phases) {
      const total = list.reduce((n, s) => n + s.len, 0);
      let left = total * clamp((p - a) / (b - a));
      for (const s of list) {
        const drawn = Math.min(left, s.len);
        left -= drawn;
        s.p.setAttribute('stroke-dashoffset', s.len - drawn);
        s.p.setAttribute('visibility', drawn > 0 ? 'visible' : 'hidden');
      }
    }
    for (const s of solid) s.setAttribute('opacity', smooth((p - split * 0.6) / (1 - split * 0.6)));
  };
}

// Text appears as if written left to right, one line after another.
function buildText(el, g) {
  const size = el.fontSize, lh = size * LINE_HEIGHT;
  const anchor = { left: 'start', center: 'middle', right: 'end' }[el.textAlign] || 'start';
  const x = el.x + (el.textAlign === 'center' ? el.width / 2 : el.textAlign === 'right' ? el.width : 0);
  const lines = el.text.split('\n').map((line, i) => {
    const clip = node('clipPath', { id: `clip-${el.id}-${i}` }, g);
    const rect = node('rect', { y: el.y + i * lh - size, height: lh + size * 2, width: 0 }, clip);
    const t = node('text', {
      x, y: el.y + i * lh + size * 0.88, 'text-anchor': anchor, fill: el.strokeColor,
      'font-family': FONT, 'font-size': size, 'clip-path': `url(#clip-${el.id}-${i})`,
    }, g);
    t.textContent = line;
    const box = t.getBBox();
    rect.setAttribute('x', box.x - size * 0.2);
    return { rect, width: box.width + size * 0.4 };
  });
  const total = lines.reduce((n, l) => n + l.width, 0) || 1;
  return p => {
    let left = total * p;
    for (const l of lines) { const w = Math.min(left, l.width); left -= w; l.rect.setAttribute('width', w); }
  };
}

// A transparent scene leaves out the background so it can sit beside Chris.
window.load = async (scene, { transparent } = {}) => {
  await document.fonts.load(`40px ${FONT}`);
  if (transparent) document.body.classList.add('transparent');
  svg.replaceChildren();
  items = []; cams = [];
  let clock = 0;
  for (const el of scene.elements.filter(e => !e.isDeleted)) {
    const cd = el.customData || {};
    const at = cd.at ?? clock, dur = cd.dur ?? 1;
    clock = at + dur;
    window.duration = Math.max(window.duration, at + dur);
    if (el.type === 'frame') { cams.push({ at, dur, x: el.x, y: el.y, w: el.width, h: el.height }); continue; }
    const g = node('g', el.type === 'text' ? {} : { transform: `translate(${el.x} ${el.y})` }, svg);
    if (el.opacity !== undefined && el.opacity < 100) g.setAttribute('opacity', el.opacity / 100);
    const draw = el.type === 'text' ? buildText(el, g) : buildShape(el, g);
    items.push({ at, dur, out: cd.out, g, draw, opacity: (el.opacity ?? 100) / 100 });
  }
  cams.sort((a, b) => a.at - b.at);
  window.duration += 2;
  window.render(0);
};

window.render = t => {
  for (const it of items) {
    it.draw(smooth((t - it.at) / Math.max(it.dur, 0.001)));
    if (it.out !== undefined) it.g.setAttribute('opacity', it.opacity * (1 - smooth((t - it.out) / 0.4)));
  }
  let view = cams[0] || { x: 0, y: 0, w: 1920, h: 1080 };
  for (let i = 1; i < cams.length; i++) {
    const c = cams[i];
    if (t < c.at) break;
    const p = glide((t - c.at) / Math.max(c.dur, 0.001));
    view = { x: view.x + (c.x - view.x) * p, y: view.y + (c.y - view.y) * p, w: view.w + (c.w - view.w) * p, h: view.h + (c.h - view.h) * p };
  }
  svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
};

// Sizes text elements with the real font and places them on their anchor point.
window.measure = async elements => {
  await document.fonts.load(`40px ${FONT}`);
  const ctx = document.createElement('canvas').getContext('2d');
  return elements.map(el => {
    if (el.type !== 'text' || !el.customData?.anchor) return el;
    ctx.font = `${el.fontSize}px ${FONT}`;
    const lines = el.text.split('\n');
    const width = Math.max(...lines.map(l => ctx.measureText(l).width));
    const height = lines.length * el.fontSize * LINE_HEIGHT;
    const { x, y, valign } = el.customData.anchor;
    const left = el.textAlign === 'center' ? x - width / 2 : el.textAlign === 'right' ? x - width : x;
    return { ...el, x: left, y: valign === 'middle' ? y - height / 2 : y, width, height };
  });
};
