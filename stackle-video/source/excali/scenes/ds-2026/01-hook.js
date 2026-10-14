// Graphic 1: the pay number and the job growth number.
const { scene, COLORS: C } = require('../../kit');
const { PAY, GROWTH } = require('./facts');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Hook', at: 0 });
s.say(PAY.line);
s.text({ x: 960, y: 140, text: 'Data scientist, United States', size: 64, stroke: C.grey, dur: 0.8 });
s.text({ x: 960, y: 330, text: PAY.big, size: 210, stroke: C.amber, dur: 1.2 });
s.line({ pts: [[560, 450], [960, 462], [1360, 448]], stroke: C.amber, sw: 5, curve: true, dur: 0.4 });
s.text({ x: 960, y: 530, text: PAY.small, size: 46 });
s.text({ x: 960, y: 600, text: PAY.source, size: 30, stroke: C.grey });
s.say(GROWTH.line);
s.rect({ x: 460, y: 700, w: 1000, h: 240, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.5 });
[50, 80, 115, 150].forEach((h, i) =>
  s.rect({ x: 540 + i * 50, y: 880 - h, w: 34, h, fill: C.gold, fillStyle: 'hachure', stroke: C.ink, sw: 2, dur: 0.15, gap: 0 }));
s.arrow({ pts: [[530, 840], [620, 790], [740, 720]], stroke: C.green, sw: 4, curve: true, dur: 0.4 });
s.text({ x: 1080, y: 770, text: GROWTH.big, size: 80, stroke: C.green });
s.text({ x: 1080, y: 845, text: GROWTH.small, size: 38 });
s.text({ x: 1060, y: 900, text: GROWTH.source, size: 24, stroke: C.grey });
s.end();

module.exports = s;
