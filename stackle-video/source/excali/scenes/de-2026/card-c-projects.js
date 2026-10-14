// Card beside Chris (transparent): three projects and how to present them.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.say('Three real projects beat ten copied ones.');
s.rect({ x: 1060, y: 120, w: 780, h: 840, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1450, y: 220, text: '3 projects', size: 70, stroke: C.amber });
s.say('Give each a README, the first page of the project, with a diagram of the pipeline, so that someone outside tech understands it in one minute.');
const items = ['a README anyone\ngets in one minute', 'a diagram of the pipeline'];
items.forEach((label, i) => {
  d.check(s, { x: 1160, y: 380 + i * 180, size: 70 });
  s.text({ x: 1230, y: 380 + i * 180, text: label, size: 46, align: 'left', gap: 1 });
});
s.say('Then share each one on LinkedIn, because work that nobody sees cannot get you a callback.');
d.check(s, { x: 1160, y: 740, size: 70 });
s.text({ x: 1230, y: 740, text: 'shared on LinkedIn', size: 46, align: 'left' });
s.end();

module.exports = s;
