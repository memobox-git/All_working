// Graphic 2: what data scientist job posts ask for.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { DEGREE } = require('./facts');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Degree', at: 0 });
s.say(DEGREE.line);
s.text({ x: 960, y: 140, text: 'Data scientist job posts', size: 80 });
s.line({ pts: [[580, 210], [960, 218], [1340, 208]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });
const xs = [210, 450, 690, 930, 1250, 1590];
xs.forEach(x => d.doc(s, { x, y: 430, size: 200, dur: 0.35 }));
s.say(DEGREE.line2);
xs.slice(0, 4).forEach(x => {
  s.ellipse({ x: x - 100, y: 465, w: 200, h: 80, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.25, gap: 0 });
  s.text({ x, y: 505, text: "master's/PhD", size: 24, dur: 0.2, gap: 0.05 });
});
s.line({ pts: [[120, 620], [570, 630], [1020, 620]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });
s.text({ x: 570, y: 700, text: 'about 2 in 3', size: 64, stroke: C.amber });
s.text({ x: 570, y: 775, text: "master's degree or PhD", size: 40 });
s.ellipse({ x: 1250 - 85, y: 465, w: 170, h: 80, stroke: C.ink, fill: C.paper, fillStyle: 'solid', sw: 2, dur: 0.25 });
s.text({ x: 1250, y: 505, text: "bachelor's", size: 24 });
s.say(DEGREE.line3);
s.ellipse({ x: 1450, y: 300, w: 280, h: 330, stroke: C.green, sw: 4, rough: 2, dur: 0.6 });
s.text({ x: 1590, y: 700, text: 'almost 1 in 5', size: 64, stroke: C.green });
s.text({ x: 1590, y: 775, text: 'no education listed', size: 40 });
s.text({ x: 960, y: 950, text: DEGREE.source, size: 28, stroke: C.grey });
s.end();

module.exports = s;
