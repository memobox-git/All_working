// Graphic 1: the pay number and the job postings fact.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { PAY } = require('./facts');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Hook', at: 0 });
s.say(PAY.line);
s.text({ x: 960, y: 140, text: 'Data engineer, United States', size: 64, stroke: C.grey, dur: 0.8 });
s.text({ x: 960, y: 330, text: PAY.big, size: 210, stroke: C.amber, dur: 1.2 });
s.line({ pts: [[560, 450], [960, 462], [1360, 448]], stroke: C.amber, sw: 5, curve: true, dur: 0.4 });
s.text({ x: 960, y: 530, text: PAY.small, size: 46 });
s.text({ x: 960, y: 600, text: PAY.source, size: 30, stroke: C.grey });
s.wait(1.2);
s.rect({ x: 460, y: 700, w: 1000, h: 220, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.5 });
d.laptop(s, { x: 600, y: 810, size: 170, dur: 0.6 });
s.text({ x: 1090, y: 795, text: PAY.second, size: 44 });
s.text({ x: 1090, y: 885, text: PAY.secondSource, size: 28, stroke: C.grey });
s.end();

module.exports = s;
