// Small hand-drawn icons built from plain Excalidraw shapes.
// Each takes the scene, a centre point and a size, plus optional colours and timing.
const { COLORS: C } = require('./kit');

// Points along the lower half of an ellipse, left to right.
const lowerArc = (cx, cy, rx, ry, n = 6) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI - (Math.PI * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

module.exports = {
  // Database: a cylinder.
  db(s, { x, y, size = 120, stroke = C.ink, fill = C.soft, dur = 0.9 }) {
    const w = size, h = size * 1.15, eh = w * 0.32, left = x - w / 2, top = y - h / 2;
    const t = dur / 4;
    s.ellipse({ x: left, y: top, w, h: eh, stroke, fill, sw: 3, dur: t, gap: 0 });
    s.line({ pts: [[left, top + eh / 2], [left, top + h - eh / 2]], stroke, sw: 3, dur: t, gap: 0 });
    s.line({ pts: lowerArc(x, top + h - eh / 2, w / 2, eh / 2), stroke, sw: 3, curve: true, dur: t, gap: 0 });
    s.line({ pts: [[left + w, top + h - eh / 2], [left + w, top + eh / 2]], stroke, sw: 3, dur: t });
    s.line({ pts: lowerArc(x, top + h * 0.45, w / 2, eh / 2), stroke, sw: 2, curve: true, dur: t });
  },

  // Cloud: a scalloped outline.
  cloud(s, { x, y, size = 200, stroke = C.ink, dur = 0.9 }) {
    const rx = size / 2, ry = size * 0.28, bumps = 7, pts = [];
    for (let k = 0; k < bumps; k++) {
      const a = (2 * Math.PI * k) / bumps + Math.PI / 2;
      const bx = x + rx * Math.cos(a) * 0.82, by = y + ry * Math.sin(a) * 0.82, rb = size * 0.17;
      for (let j = -2; j <= 2; j++) {
        const b = a + (j * Math.PI) / 4.5;
        pts.push([bx + rb * Math.cos(b), by + rb * Math.sin(b) * 0.85]);
      }
    }
    pts.push(pts[0]);
    s.line({ pts, stroke, sw: 3, curve: true, dur });
  },

  // Person: a head and shoulders.
  person(s, { x, y, size = 120, stroke = C.ink, fill = C.soft, dur = 0.7 }) {
    const r = size * 0.22;
    s.ellipse({ x: x - r, y: y - size / 2, w: r * 2, h: r * 2, stroke, fill, sw: 3, dur: dur * 0.45, gap: 0 });
    s.line({
      pts: [[x - size * 0.42, y + size / 2], [x - size * 0.36, y + size * 0.12], [x, y - size * 0.02],
        [x + size * 0.36, y + size * 0.12], [x + size * 0.42, y + size / 2]],
      stroke, sw: 3, curve: true, dur: dur * 0.55,
    });
  },

  check(s, { x, y, size = 60, stroke = C.green, dur = 0.3 }) {
    s.line({ pts: [[x - size * 0.45, y], [x - size * 0.1, y + size * 0.35], [x + size * 0.5, y - size * 0.4]], stroke, sw: 5, dur });
  },

  cross(s, { x, y, size = 60, stroke = C.red, dur = 0.3 }) {
    const d = size * 0.4;
    s.line({ pts: [[x - d, y - d], [x + d, y + d]], stroke, sw: 5, dur: dur / 2, gap: 0 });
    s.line({ pts: [[x + d, y - d], [x - d, y + d]], stroke, sw: 5, dur: dur / 2 });
  },

  // Laptop with lines of code on the screen.
  laptop(s, { x, y, size = 220, stroke = C.ink, dur = 1 }) {
    const w = size, h = size * 0.62, left = x - w / 2, top = y - h / 2 - size * 0.06;
    s.rect({ x: left, y: top, w, h, stroke, fill: C.paper, fillStyle: 'solid', round: true, sw: 3, dur: dur * 0.35, gap: 0 });
    s.line({ pts: [[left - w * 0.1, top + h + size * 0.04], [left + w * 1.1, top + h + size * 0.04]], stroke, sw: 3, dur: dur * 0.15, gap: 0 });
    [[0.12, 0.55, C.amber], [0.2, 0.7, stroke], [0.2, 0.45, stroke], [0.12, 0.6, C.amber]].forEach(([dx, len, col], i) =>
      s.line({ pts: [[left + w * dx, top + h * (0.22 + i * 0.17)], [left + w * (dx + len * 0.75), top + h * (0.22 + i * 0.17)]],
        stroke: col, sw: 3, dur: dur * 0.12, gap: 0 }));
    s.wait(0.15);
  },

  // Speech bubble, used for AI assistants.
  bubble(s, { x, y, w = 260, h = 140, stroke = C.ink, fill = C.paper, dur = 0.8 }) {
    const left = x - w / 2, top = y - h / 2;
    s.rect({ x: left, y: top, w, h, stroke, fill, fillStyle: 'solid', round: true, sw: 3, dur: dur * 0.7, gap: 0 });
    s.line({ pts: [[left + w * 0.22, top + h - 2], [left + w * 0.12, top + h + h * 0.35], [left + w * 0.38, top + h - 2]], stroke, sw: 3, dur: dur * 0.3 });
  },

  // Clock showing two o'clock.
  clock(s, { x, y, size = 120, stroke = C.ink, dur = 0.7 }) {
    s.ellipse({ x: x - size / 2, y: y - size / 2, w: size, h: size, stroke, fill: C.paper, fillStyle: 'solid', sw: 3, dur: dur * 0.6, gap: 0 });
    s.line({ pts: [[x, y], [x, y - size * 0.34]], stroke, sw: 3, dur: dur * 0.2, gap: 0 });
    s.line({ pts: [[x, y], [x + size * 0.2, y - size * 0.12]], stroke: C.amber, sw: 4, dur: dur * 0.2 });
  },

  // Small table: a header row and a few rows.
  table(s, { x, y, w = 160, h = 120, rows = 3, stroke = C.ink, head = C.soft, dur = 0.6 }) {
    const left = x - w / 2, top = y - h / 2, rh = h / (rows + 1);
    s.rect({ x: left, y: top, w, h: rh, stroke, fill: head, fillStyle: 'solid', sw: 2, dur: dur * 0.3, gap: 0 });
    s.rect({ x: left, y: top, w, h, stroke, sw: 2, dur: dur * 0.4, gap: 0 });
    for (let i = 2; i <= rows; i++)
      s.line({ pts: [[left, top + rh * i], [left + w, top + rh * i]], stroke, sw: 1, dur: dur * 0.3 / rows, gap: 0 });
    s.wait(0.1);
  },

  // Page with a few lines of text.
  doc(s, { x, y, size = 140, stroke = C.ink, dur = 0.8 }) {
    const w = size * 0.78, h = size, left = x - w / 2, top = y - h / 2;
    s.rect({ x: left, y: top, w, h, stroke, fill: C.paper, fillStyle: 'solid', sw: 3, dur: dur * 0.5, gap: 0 });
    [0.25, 0.45, 0.65].forEach(f =>
      s.line({ pts: [[left + w * 0.18, top + h * f], [left + w * 0.82, top + h * f]], stroke, sw: 2, dur: dur * 0.16, gap: 0 }));
    s.wait(0.15);
  },
};
