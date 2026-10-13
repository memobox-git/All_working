// Graphic 2: how many data engineer job postings mention a degree.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { DEGREE } = require('./facts');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Degree', at: 0 });
s.say(DEGREE.line);
s.text({ x: 960, y: 140, text: 'Data engineer job posts', size: 80 });
s.line({ pts: [[560, 210], [960, 218], [1360, 208]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });
[0, 1, 2, 3].forEach(i => {
  const x = 330 + i * 420;
  d.doc(s, { x, y: 470, size: 230, dur: 0.5 });
  if (i < 3) s.ellipse({ x: x - 70, y: 520, w: 140, h: 70, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.3 });
});
[0, 1, 2].forEach(i => s.text({ x: 330 + i * 420, y: 555, text: 'degree', size: 32, dur: 0.3, gap: 0.05 }));
s.text({ x: 750, y: 710, text: 'about 3 in 4', size: 64, stroke: C.amber });
s.text({ x: 750, y: 785, text: DEGREE.yes, size: 40 });
s.say(DEGREE.line2);
s.ellipse({ x: 1450, y: 300, w: 300, h: 360, stroke: C.green, sw: 4, rough: 2, dur: 0.6 });
s.text({ x: 1590, y: 710, text: 'about 1 in 4', size: 64, stroke: C.green });
s.text({ x: 1590, y: 785, text: DEGREE.no, size: 40 });
s.text({ x: 960, y: 950, text: DEGREE.source, size: 30, stroke: C.grey });
s.end();

module.exports = s;
