// Graphic 9: start in a job next to data engineering, then move across.
const { scene, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Side door', at: 0 });
s.say('Three jobs are more open to beginners: data analyst, product analyst, who studies how people use an app, and analytics engineer, who builds clean tables for the rest of the team.');
s.text({ x: 960, y: 140, text: 'More open to beginners', size: 84 });
['Data analyst', 'Product analyst', 'Analytics engineer'].forEach((name, i) => {
  s.rect({ x: 120, y: 280 + i * 220, w: 560, h: 170, round: true, sw: 3, fill: i === 0 ? C.soft : C.paper, fillStyle: 'solid', dur: 0.4, gap: 0 });
  s.text({ x: 400, y: 365 + i * 220, text: name, size: 48, dur: 0.6 });
});
s.say('Those jobs already use SQL, statistics and charts every day, which is half the work of a data scientist.');
s.text({ x: 420, y: 950, text: 'SQL + statistics + charts = half the work', size: 34, stroke: C.amber });
s.say('Think of this path as the side door into a building when the front door is locked.');
s.rect({ x: 1300, y: 420, w: 500, h: 220, round: true, sw: 4, fill: C.gold, fillStyle: 'solid', dur: 0.5 });
s.text({ x: 1550, y: 530, text: 'Data scientist', size: 56 });
[[700, 365], [700, 585], [700, 805]].forEach(([x, y]) =>
  s.arrow({ pts: [[x, y], [1000, (y + 530) / 2], [1290, 530]], stroke: C.amber, sw: 3, curve: true, dur: 0.4, gap: 0 }));
s.text({ x: 1550, y: 690, text: 'the side door', size: 44, stroke: C.amber });
s.say('After a year or two, you move across inside the same company.');
s.text({ x: 1040, y: 330, text: 'a year or two', size: 44, stroke: C.amber });
s.text({ x: 1040, y: 385, text: 'same company', size: 38, stroke: C.grey });
s.say('A move inside a company is much easier than a new hire from outside, because the team already trusts your work.');
d.person(s, { x: 1450, y: 820, size: 130 });
d.person(s, { x: 1600, y: 820, size: 130 });
d.check(s, { x: 1730, y: 800, size: 70 });
s.text({ x: 1560, y: 950, text: 'the team already trusts your work', size: 38 });
s.end();

module.exports = s;
