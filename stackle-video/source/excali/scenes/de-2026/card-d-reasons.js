// Card beside Chris (transparent): explain your reasons, not only your answer.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.say('In the design sessions, the why matters more than the what.');
s.rect({ x: 1000, y: 100, w: 860, h: 880, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1430, y: 190, text: 'Explain the why', size: 60, stroke: C.amber });
s.say('A weak answer is, "I used an incremental load."');
d.bubble(s, { x: 1400, y: 330, w: 680, h: 110 });
s.text({ x: 1400, y: 322, text: '"I used an incremental load."', size: 40 });
d.cross(s, { x: 1790, y: 330, size: 56 });
s.say('A strong answer is, "I used an incremental load, which moves only the rows that changed, because the table grows by ten million rows a day and a full reload would take hours."');
d.bubble(s, { x: 1400, y: 640, w: 720, h: 330, fill: C.soft });
s.text({ x: 1400, y: 630, text: '"I used an incremental load,\nwhich moves only the rows\nthat changed, because the table\ngrows by ten million rows a day\nand a full reload would take hours."', size: 38, dur: 4 });
d.check(s, { x: 1800, y: 900, size: 64 });
s.say('The first one tells me what you did.');
s.text({ x: 1560, y: 430, text: 'what you did', size: 34, stroke: C.amber });
s.say('The second one tells me how you think.');
s.text({ x: 1560, y: 860, text: 'how you think', size: 34, stroke: C.amber });
s.end();

module.exports = s;
