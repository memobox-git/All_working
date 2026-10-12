// Helpers for writing Excalidraw scenes in code. Every element is a real
// Excalidraw element, so the built file opens in excalidraw.com for editing.
// Elements draw one after another unless given "at"; "dur" sets draw time.
const COLORS = {
  ink: '#1E1C1D', amber: '#BA7517', gold: '#F59E0B', cream: '#FAF8F1',
  soft: '#F6D8A2', paper: '#FFF4E0', red: '#e03131', green: '#2f9e44', grey: '#8a857a',
};

function scene() {
  const elements = [];
  let clock = 0;

  const base = (type, p) => ({
    id: `${type}-${elements.length + 1}`, type, x: p.x || 0, y: p.y || 0, width: p.w || 0, height: p.h || 0,
    angle: 0, strokeColor: p.stroke || COLORS.ink, backgroundColor: p.fill || 'transparent',
    fillStyle: p.fillStyle || 'hachure', strokeWidth: p.sw || 2, strokeStyle: 'solid', roughness: p.rough ?? 1,
    opacity: 100, groupIds: [], frameId: null, roundness: p.round ? { type: 3 } : null,
    seed: 1000 + ((elements.length + 1) * 7919) % 90000, version: 1, versionNonce: elements.length + 1,
    isDeleted: false, boundElements: null, updated: 1, link: null, locked: false,
  });

  const add = (el, p, dur) => {
    const at = p.at ?? clock;
    el.customData = { at, dur: p.dur ?? dur };
    if (p.out !== undefined) el.customData.out = p.out;
    clock = at + el.customData.dur + (p.gap ?? 0.15);
    elements.push(el);
    return el;
  };

  const linear = (type, p, dur) => {
    const pts = p.pts.map(([x, y]) => [x - p.pts[0][0], y - p.pts[0][1]]);
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    const el = {
      ...base(type, { ...p, x: p.pts[0][0], y: p.pts[0][1] }),
      width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys),
      points: pts, lastCommittedPoint: null, startBinding: null, endBinding: null,
      startArrowhead: null, endArrowhead: type === 'arrow' ? 'arrow' : null,
      roundness: p.curve ? { type: 2 } : null,
    };
    return add(el, p, dur);
  };

  return {
    elements,
    get t() { return clock; },
    wait(s) { clock += s; },
    at(s) { clock = s; },
    frame: p => add({ ...base('frame', p), name: p.name || null }, p, p.at === 0 ? 0 : 1.4),
    rect: p => add(base('rectangle', p), p, 0.9),
    ellipse: p => add(base('ellipse', p), p, 0.7),
    diamond: p => add(base('diamond', p), p, 0.8),
    line: p => linear('line', p, 0.6),
    arrow: p => linear('arrow', p, 0.7),
    // x, y is the anchor: the centre of the text when align is "center".
    // build.js measures the text with the real font and sets its box.
    text: p => {
      const el = add({
        ...base('text', { ...p, w: 0, h: 0 }), text: p.text, originalText: p.text, fontSize: p.size || 48,
        fontFamily: 5, textAlign: p.align || 'center', verticalAlign: 'top', containerId: null,
        autoResize: true, lineHeight: 1.25,
      }, p, Math.max(0.4, p.text.length * 0.03));
      el.customData.anchor = { x: el.x, y: el.y, valign: p.valign || 'middle' };
      return el;
    },
  };
}

module.exports = { scene, COLORS };
