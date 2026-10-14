// Card beside Chris (transparent): explain your reasons, not only your answer.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.say('In the machine learning case, explain your reasons out loud, not only your answer.');
s.rect({ x: 1000, y: 100, w: 860, h: 880, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1430, y: 190, text: 'Explain your reasons', size: 60, stroke: C.amber });
s.say('Do not say, "I used logistic regression."');
d.bubble(s, { x: 1400, y: 330, w: 680, h: 110 });
s.text({ x: 1400, y: 322, text: '"I used logistic regression."', size: 40 });
d.cross(s, { x: 1790, y: 330, size: 56 });
s.say('Say, "I used logistic regression, because the manager needed to see which things push customers to cancel, and this model shows that clearly."');
d.bubble(s, { x: 1400, y: 640, w: 720, h: 330, fill: C.soft });
s.text({ x: 1400, y: 630, text: '"I used logistic regression,\nbecause the manager needed\nto see which things push\ncustomers to cancel, and this\nmodel shows that clearly."', size: 38, dur: 4 });
d.check(s, { x: 1800, y: 900, size: 64 });
s.say('The first one tells me what you did.');
s.text({ x: 1560, y: 430, text: 'what you did', size: 34, stroke: C.amber });
s.say('The second one tells me how you think.');
s.text({ x: 1560, y: 860, text: 'how you think', size: 34, stroke: C.amber });
s.end();

module.exports = s;
