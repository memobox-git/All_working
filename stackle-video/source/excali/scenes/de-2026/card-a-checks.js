// Card beside Chris (transparent): the three things checked in an interview.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.say('A job posting asks for a degree, but the interview tests skills.');
s.rect({ x: 1060, y: 120, w: 780, h: 840, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1450, y: 220, text: 'What I check', size: 64, stroke: C.amber });
s.say('When I interview engineers, I check three things.');
const checks = [
  ['Can you write SQL that gives the right answer on messy data?', 'SQL that is right\non messy data'],
  ['Can you build a pipeline that runs every day without you?', 'a pipeline that runs\nevery day without you'],
  ['Can you explain what you built to a person who does not code?', 'explain it to a person\nwho does not code'],
];
checks.forEach(([line, label], i) => {
  s.say(line);
  d.check(s, { x: 1160, y: 380 + i * 200, size: 70 });
  s.text({ x: 1230, y: 380 + i * 200, text: label, size: 46, align: 'left' });
});
s.end();

module.exports = s;
