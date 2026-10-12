// Card beside Chris (transparent): three projects and how to present them.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.say('Aim for three projects.');
s.rect({ x: 1060, y: 120, w: 780, h: 840, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1450, y: 220, text: '3 projects', size: 70, stroke: C.amber });
s.say('Give each a README, the first page of the project, written for a manager who does not code, with a diagram of the pipeline.');
const items = ['README for a manager\nwho does not code', 'a diagram of the pipeline'];
items.forEach((label, i) => {
  d.check(s, { x: 1160, y: 380 + i * 180, size: 70 });
  s.text({ x: 1230, y: 380 + i * 180, text: label, size: 46, align: 'left', gap: 1 });
});
s.say('Then post a short write-up of each one on LinkedIn.');
d.check(s, { x: 1160, y: 740, size: 70 });
s.text({ x: 1230, y: 740, text: 'a short write-up\non LinkedIn', size: 46, align: 'left' });
s.end();

module.exports = s;
