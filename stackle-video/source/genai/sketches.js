// The hand-drawn sketch for each of the 20 concepts, on a 760×520 sheet.
// A sketch is a list of steps; each step is a list of marks, and the steps
// are revealed one after another while the concept's line is spoken
// (story.js). Marks:
//   B(x, y, w, h, text, o)   a box with marker text      T(x, y, text, o)   text
//   L(points, o)             a line (o.arrow for a head)  O(cx, cy, r, o)    a circle
//   D(cx, cy, r, color)      a filled dot                 X(x, y, w, h, html, o)  raw html
// Colours: c1 blue, c2 yellow, c3 pink, c4 green, c5 lilac (CSS variables).
const B = (x, y, w, h, text, o = {}) => ({ k: 'B', x, y, w, h, text, ...o });
const T = (x, y, text, o = {}) => ({ k: 'T', x, y, text, ...o });
const L = (p, o = {}) => ({ k: 'L', p, ...o });
const O = (cx, cy, r, o = {}) => ({ k: 'O', cx, cy, r, ...o });
const D = (cx, cy, r, color) => ({ k: 'D', cx, cy, r, color });
const X = (x, y, w, h, html, o = {}) => ({ k: 'X', x, y, w, h, html, ...o });
const NOTE = (x, y, text, o = {}) => T(x, y, text, { font: 'note', color: 'var(--blue2)', size: 32, ...o });

const SKETCHES = {
  tokens: [
    [B(145, 10, 470, 104, 'unbelievable', { fill: 'var(--c5)', size: 60 })],
    [L([[330, 122], [160, 196]]), L([[380, 122], [380, 196]]), L([[430, 122], [600, 196]]),
      B(70, 200, 170, 96, 'un', { fill: 'var(--c1)', size: 54 }), B(280, 200, 200, 96, 'believ', { fill: 'var(--c2)', size: 54 }), B(520, 200, 170, 96, 'able', { fill: 'var(--c3)', size: 54 })],
    [L([[155, 300], [155, 346]], { w: 3 }), L([[380, 300], [380, 346]], { w: 3 }), L([[605, 300], [605, 346]], { w: 3 }),
      B(90, 350, 130, 60, '582', { fill: '#fff', size: 34, color: 'var(--blue)', r: 10, bw: 3 }), B(310, 350, 140, 60, '21903', { fill: '#fff', size: 34, color: 'var(--blue)', r: 10, bw: 3 }), B(540, 350, 130, 60, '417', { fill: '#fff', size: 34, color: 'var(--blue)', r: 10, bw: 3 })],
    [NOTE(380, 470, 'the model only ever sees the numbers', { anchor: 'middle' })],
  ],
  embed: [
    [L([[60, 470], [60, 30]], { arrow: true, w: 3.5 }), L([[60, 470], [730, 470]], { arrow: true, w: 3.5 }), T(395, 512, 'dim 1', { size: 28, anchor: 'middle' }), T(18, 250, 'dim 2', { size: 28, rot: -90, anchor: 'middle' })],
    [O(235, 175, 120, { dash: true, color: 'var(--blue2)' }), D(180, 130, 10, 'var(--blue2)'), T(200, 140, 'king', { size: 40 }), D(240, 200, 10, 'var(--blue2)'), T(260, 210, 'queen', { size: 40 }), D(180, 260, 10, 'var(--blue2)'), T(200, 270, 'prince', { size: 40 })],
    [O(545, 345, 105, { dash: true, color: '#D6336C' }), D(500, 300, 10, '#D6336C'), T(520, 310, 'car', { size: 40 }), D(540, 360, 10, '#D6336C'), T(560, 370, 'truck', { size: 40 }), D(500, 410, 10, '#D6336C'), T(520, 420, 'bus', { size: 40 })],
    [NOTE(470, 90, 'similar meaning =', { size: 30 }), NOTE(470, 124, 'close in space', { size: 30 }), L([[460, 110], [370, 150]], { arrow: true, w: 2.5, color: 'var(--blue2)' })],
  ],
  attn: [
    [B(10, 330, 80, 70, 'She', { size: 36, fill: '#fff', bw: 3 }), B(100, 330, 70, 70, 'sat', { size: 36, fill: '#fff', bw: 3 }), B(180, 330, 60, 70, 'by', { size: 36, fill: '#fff', bw: 3 }),
      B(250, 330, 76, 70, 'the', { size: 36, fill: '#fff', bw: 3 }), B(336, 330, 110, 70, 'bank', { size: 38, fill: 'var(--c2)', bw: 4 }), B(456, 330, 60, 70, 'of', { size: 36, fill: '#fff', bw: 3 }),
      B(526, 330, 76, 70, 'the', { size: 36, fill: '#fff', bw: 3 }), B(612, 330, 120, 70, 'river', { size: 38, fill: 'var(--c1)', bw: 4 })],
    [L([[380, 324], [210, 230], [50, 324]], { w: 2, color: '#9A9AA0' }), L([[385, 324], [260, 250], [135, 324]], { w: 2, color: '#9A9AA0' }), L([[388, 324], [300, 268], [210, 324]], { w: 2, color: '#9A9AA0' }),
      L([[392, 324], [340, 284], [288, 324]], { w: 2, color: '#9A9AA0' }), L([[396, 324], [440, 284], [486, 324]], { w: 2, color: '#9A9AA0' }), L([[400, 324], [480, 268], [564, 324]], { w: 2, color: '#9A9AA0' })],
    [L([[405, 324], [540, 150], [672, 324]], { w: 7, color: 'var(--blue2)', arrow: true }), NOTE(450, 120, 'river → it’s a riverbank', { size: 32 })],
    [NOTE(380, 470, 'every word checks every other word', { anchor: 'middle' })],
  ],
  llm: [
    [B(30, 10, 700, 96, 'The cat sat on the ____', { fill: '#fff', size: 50 })],
    [T(60, 190, 'mat', { size: 40 }), X(180, 158, 380, 44, '', { bar: 'var(--c4)', pct: 62 }), T(580, 192, '62%', { size: 34, color: 'var(--blue)' }),
      T(60, 260, 'sofa', { size: 40 }), X(180, 228, 380, 44, '', { bar: 'var(--c2)', pct: 18 }), T(580, 262, '18%', { size: 34, color: 'var(--blue)' }),
      T(60, 330, 'floor', { size: 40 }), X(180, 298, 380, 44, '', { bar: 'var(--c3)', pct: 12 }), T(580, 332, '12%', { size: 34, color: 'var(--blue)' })],
    [O(95, 178, 52, { color: 'var(--blue2)', w: 4 }), L([[150, 160], [300, 70]], { arrow: true, w: 3, color: 'var(--blue2)' })],
    [NOTE(380, 440, 'pick one token, add it, and go again', { anchor: 'middle' })],
  ],
  ctx: [
    [...Array.from({ length: 9 }, (_, i) => L([[120, 30 + i * 52], [120 + 520 - (i * 37) % 160, 30 + i * 52]], { w: 6, color: '#C9C2B5' }))],
    [B(90, 128, 590, 210, '', { fill: 'rgba(255,255,255,0)', color: 'var(--blue2)', bw: 6, r: 24 }), T(700, 240, 'in view', { size: 36, color: 'var(--blue2)' })],
    [X(0, 0, 760, 120, '', { shade: true }), X(0, 344, 760, 176, '', { shade: true }), NOTE(380, 500, 'outside the window, the model can’t see it', { anchor: 'middle' })],
  ],
  temp: [
    [L([[160, 300], [200, 190], [300, 120], [380, 105], [460, 120], [560, 190], [600, 300]], { w: 5 }), T(150, 345, 'low', { size: 40, anchor: 'middle' }), T(610, 345, 'high', { size: 40, anchor: 'middle' }),
      X(372, 292, 16, 16, '', { pivot: true })],
    [L([[380, 300], [255, 190]], { w: 6, color: 'var(--blue2)', id: 'needle' }), B(30, 390, 330, 110, '', { fill: 'var(--c1)', bw: 3 }),
      T(195, 432, 'Paris. Paris.', { size: 36, anchor: 'middle' }), T(195, 476, 'Paris.', { size: 36, anchor: 'middle' })],
    [L([[380, 300], [520, 200]], { w: 6, color: '#D6336C' }), B(400, 390, 330, 110, '', { fill: 'var(--c3)', bw: 3 }),
      T(565, 432, 'Paris! City of light.', { size: 33, anchor: 'middle' }), T(565, 476, 'Ah, Paris…', { size: 33, anchor: 'middle' })],
  ],
  prompt: [
    [X(130, 10, 500, 460, '', { sticky: true })],
    [T(170, 90, 'Role:', { size: 40, color: 'var(--blue)', weight: 700 }), T(285, 90, 'a data engineer', { size: 38 })],
    [T(170, 170, 'Task:', { size: 40, color: 'var(--blue)', weight: 700 }), T(285, 170, 'explain this SQL', { size: 38 })],
    [T(170, 250, 'Example:', { size: 40, color: 'var(--blue)', weight: 700 }), T(345, 250, 'like this one', { size: 38 }),
      T(170, 330, 'Format:', { size: 40, color: 'var(--blue)', weight: 700 }), T(325, 330, '3 bullet points', { size: 38 })],
    [O(560, 420, 40, { color: '#2F9E44', w: 4 }), T(560, 434, '✓', { size: 50, color: '#2F9E44', anchor: 'middle', weight: 700 })],
  ],
  fewshot: [
    [B(30, 20, 320, 80, '“great movie”', { fill: '#fff', size: 38, bw: 3 }), L([[360, 60], [430, 60]], { arrow: true }), B(440, 20, 270, 80, 'positive', { fill: 'var(--c4)', size: 40 })],
    [B(30, 140, 320, 80, '“awful plot”', { fill: '#fff', size: 38, bw: 3 }), L([[360, 180], [430, 180]], { arrow: true }), B(440, 140, 270, 80, 'negative', { fill: 'var(--c3)', size: 40 })],
    [B(30, 290, 320, 80, '“it was fine”', { fill: '#fff', size: 38, bw: 3 }), L([[360, 330], [430, 330]], { arrow: true }), B(440, 290, 270, 80, '?', { fill: '#fff', size: 46, dash: true })],
    [B(440, 290, 270, 80, 'neutral', { fill: 'var(--c2)', size: 40 }), NOTE(380, 460, 'the model copies the pattern', { anchor: 'middle' })],
  ],
  halluc: [
    [X(40, 330, 150, 150, '', { robot: true }), X(190, 60, 540, 230, '', { bubble: true }), T(460, 150, 'The Eiffel Tower', { size: 42, anchor: 'middle' }), T(460, 208, 'opened in 1925.', { size: 42, anchor: 'middle' })],
    [X(430, 200, 300, 110, 'MADE UP', { stamp: true })],
    [NOTE(470, 420, '(it opened in 1889)', { size: 36, anchor: 'middle' })],
  ],
  finetune: [
    [B(20, 170, 210, 140, 'base model', { fill: '#fff', size: 38 })],
    [L([[240, 240], [310, 240]], { arrow: true }), X(320, 130, 170, 220, '', { cards: true }), T(405, 390, 'your examples', { size: 32, anchor: 'middle' })],
    [L([[500, 240], [560, 240]], { arrow: true }), B(570, 170, 180, 140, 'tuned', { fill: 'var(--c4)', size: 42 }), X(705, 140, 60, 60, '★', { badge: true })],
    [NOTE(380, 480, 'same model, new habits', { anchor: 'middle' })],
  ],
  rlhf: [
    [B(40, 40, 300, 180, '', { fill: '#fff', bw: 3 }), T(70, 90, 'Answer A', { size: 36, weight: 700 }), L([[70, 130], [300, 130]], { w: 5, color: '#C9C2B5' }), L([[70, 170], [260, 170]], { w: 5, color: '#C9C2B5' }),
      B(420, 40, 300, 180, '', { fill: '#fff', bw: 3 }), T(450, 90, 'Answer B', { size: 36, weight: 700 }), L([[450, 130], [690, 130]], { w: 5, color: '#C9C2B5' }), L([[450, 170], [640, 170]], { w: 5, color: '#C9C2B5' })],
    [X(330, 280, 100, 120, '', { person: true }), B(420, 40, 300, 180, '', { fill: 'rgba(255,255,255,0)', color: '#2F9E44', bw: 6 }), T(640, 206, '✓ picked', { size: 34, color: '#2F9E44', weight: 700, anchor: 'middle' })],
    [X(50, 360, 120, 120, '', { robot: true }), L([[570, 232], [570, 418], [190, 420]], { arrow: true, color: 'var(--blue2)', w: 4 }), NOTE(390, 478, 'the model learns: more like B', { anchor: 'middle', size: 32 })],
  ],
  multi: [
    [B(20, 30, 180, 110, 'Aa', { fill: 'var(--c1)', size: 56 }), X(20, 200, 180, 110, '', { image: true }), X(20, 370, 180, 110, '', { wave: true })],
    [L([[210, 85], [440, 230]], { arrow: true }), L([[210, 255], [440, 255]], { arrow: true }), L([[210, 425], [440, 280]], { arrow: true })],
    [X(460, 150, 260, 220, '', { robot: true, big: true }), NOTE(590, 420, 'one model', { anchor: 'middle', size: 36 })],
  ],
  vdb: [
    [X(110, 10, 540, 470, '', { cylinder: true }), ...[[200, 160], [260, 230], [330, 150], [420, 300], [520, 190], [560, 330], [300, 370], [470, 400], [230, 310], [380, 220], [590, 250], [500, 120]].map(([x, y]) => D(x, y, 9, '#9A9AA0'))],
    [X(400, 222, 46, 46, '★', { star: true })],
    [D(380, 220, 11, 'var(--blue2)'), D(330, 150, 11, 'var(--blue2)'), D(420, 300, 11, 'var(--blue2)'), O(400, 230, 110, { dash: true, color: 'var(--blue2)', w: 4 }),
      NOTE(380, 512, 'nearest = most similar', { anchor: 'middle' })],
  ],
  chunk: [
    [X(40, 10, 260, 470, '', { doc: true })],
    [L([[20, 130], [320, 130]], { dash: true, w: 3, color: '#D6336C' }), L([[20, 250], [320, 250]], { dash: true, w: 3, color: '#D6336C' }), L([[20, 370], [320, 370]], { dash: true, w: 3, color: '#D6336C' }),
      NOTE(334, 140, 'cut', { size: 36, color: '#D6336C' })],
    [B(430, 20, 300, 90, 'chunk 1', { fill: 'var(--c1)', size: 38 }), B(430, 140, 300, 90, 'chunk 2', { fill: 'var(--c2)', size: 38 }), B(430, 260, 300, 90, 'chunk 3', { fill: 'var(--c3)', size: 38 }), B(430, 380, 300, 90, 'chunk 4', { fill: 'var(--c4)', size: 38 })],
  ],
  rag: [
    [B(10, 30, 210, 90, 'question', { fill: '#fff', size: 38 }), L([[230, 75], [290, 75]], { arrow: true }), B(300, 30, 170, 90, 'search', { fill: 'var(--c2)', size: 34 })],
    [L([[385, 130], [385, 180]], { arrow: true }), B(250, 190, 90, 70, '#2', { fill: 'var(--c1)', size: 34 }), B(350, 190, 90, 70, '#7', { fill: 'var(--c1)', size: 34 }), B(450, 190, 90, 70, '#9', { fill: 'var(--c1)', size: 34 }),
      NOTE(560, 236, 'top 3 chunks', { size: 30 })],
    [L([[395, 270], [395, 320]], { arrow: true }), B(300, 330, 190, 90, 'LLM', { fill: 'var(--c5)', size: 44 })],
    [L([[500, 375], [550, 375]], { arrow: true }), B(560, 320, 190, 120, 'answer<br>[1] [2]', { fill: 'var(--c4)', size: 32 }), NOTE(380, 500, 'grounded in your own data', { anchor: 'middle' })],
  ],
  tools: [
    [B(10, 40, 200, 110, 'model', { fill: 'var(--c5)', size: 44 })],
    [L([[220, 95], [290, 95]], { arrow: true }), X(300, 20, 440, 160, '{ "tool": "get_orders",<br>&nbsp;&nbsp;"day": "today" }', { code: true })],
    [L([[520, 190], [520, 260]], { arrow: true }), B(400, 270, 240, 110, 'your code', { fill: 'var(--c2)', size: 38 })],
    [L([[390, 325], [220, 325], [110, 160]], { arrow: true, color: 'var(--blue2)' }), B(60, 360, 280, 90, '42 orders', { fill: 'var(--c4)', size: 40 }), NOTE(520, 470, 'the result goes back to the model', { anchor: 'middle', size: 30 })],
  ],
  agent: [
    [X(320, 190, 120, 120, 'goal', { flag: true }), B(270, 10, 220, 90, 'plan', { fill: 'var(--c1)', size: 46 })],
    [L([[500, 70], [640, 180]], { arrow: true, w: 4 }), B(560, 190, 190, 90, 'act', { fill: 'var(--c2)', size: 46 }), NOTE(570, 305, 'use a tool', { size: 28 })],
    [L([[620, 300], [480, 420]], { arrow: true, w: 4 }), B(260, 400, 220, 90, 'check', { fill: 'var(--c3)', size: 46 })],
    [L([[250, 430], [110, 300], [260, 70]], { arrow: true, w: 4, color: 'var(--blue2)' }), NOTE(20, 230, 'repeat', { size: 32 }), NOTE(20, 262, 'until done', { size: 32 })],
  ],
  mcp: [
    [B(270, 190, 220, 120, 'AI app', { fill: 'var(--c5)', size: 46 })],
    [B(20, 20, 200, 90, 'database', { fill: 'var(--c1)', size: 32 }), L([[220, 90], [300, 190]], { w: 4, dash: true }), T(230, 160, 'MCP', { size: 26, color: 'var(--blue2)', weight: 700 })],
    [B(540, 20, 200, 90, 'GitHub', { fill: 'var(--c2)', size: 38 }), L([[540, 90], [460, 190]], { w: 4, dash: true }), T(490, 160, 'MCP', { size: 26, color: 'var(--blue2)', weight: 700 }),
      B(280, 400, 200, 90, 'Slack', { fill: 'var(--c3)', size: 38 }), L([[380, 320], [380, 395]], { w: 4, dash: true }), T(392, 365, 'MCP', { size: 26, color: 'var(--blue2)', weight: 700 })],
    [NOTE(600, 470, 'one standard plug', { anchor: 'middle', size: 32 })],
  ],
  evals: [
    [X(40, 10, 330, 480, '', { clipboard: true }), T(80, 130, '✓ refund question', { size: 30, color: '#2F9E44' }), T(90, 190, '✗ order status', { size: 30, color: '#D6336C' }),
      T(90, 250, '✓ return policy', { size: 30, color: '#2F9E44' }), T(90, 310, '✗ shipping time', { size: 30, color: '#D6336C' }), T(90, 370, '✓ opening hours', { size: 30, color: '#2F9E44' })],
    [T(560, 150, 'before', { size: 34, anchor: 'middle' }), T(560, 240, '72%', { size: 84, anchor: 'middle', weight: 700, color: '#9A9AA0' })],
    [L([[560, 262], [560, 306]], { arrow: true }), T(560, 352, 'after', { size: 34, anchor: 'middle' }), T(560, 452, '91%', { size: 96, anchor: 'middle', weight: 700, color: '#2F9E44' })],
  ],
  guard: [
    [B(10, 190, 150, 90, 'input', { fill: '#fff', size: 38 }), L([[170, 235], [210, 235]], { arrow: true }), X(220, 175, 100, 120, '', { shield: true })],
    [L([[330, 235], [370, 235]], { arrow: true }), B(380, 190, 130, 90, 'model', { fill: 'var(--c5)', size: 36 }), L([[520, 235], [560, 235]], { arrow: true }), X(570, 175, 100, 120, '', { shield: true }),
      L([[680, 235], [740, 235]], { arrow: true })],
    [B(60, 360, 640, 90, '“my email is jane@…”', { fill: 'var(--c3)', size: 36 }), X(640, 340, 80, 80, '✗', { stamp: true, small: true }), NOTE(380, 490, 'blocked before it leaks', { anchor: 'middle' })],
  ],
};
