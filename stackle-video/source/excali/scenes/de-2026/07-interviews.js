// Graphics 16, 17 and 18: the interview loop, STAR and referrals. Chris is on
// camera between them, so each graphic is its own clip.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { REFERRAL } = require('./facts');
const s = scene();

const card = (z, x, y, w, h, fill = C.paper) => z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur: 0.45, gap: 0.05 });
const underline = (z, x1, x2, y) => z.line({ pts: [[x1, y], [(x1 + x2) / 2, y + 8], [x2, y - 2]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });

// Graphic 16: five stages
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Five stages', at: 0 });
s.say('A data engineering interview usually has five stages.');
s.text({ x: 960, y: 150, text: 'The interview: five stages', size: 84 });
underline(s, 520, 1400, 222);
const stages = [
  ['The first stage is a call with a recruiter.', 'Recruiter call'],
  ['Then come a coding test in SQL and Python,', 'SQL + Python\ncoding'],
  ['a data modeling session,', 'Data modeling'],
  ['a pipeline design session,', 'Pipeline design'],
  ['and a conversation about how you work with people.', 'How you work\nwith people'],
];
stages.forEach(([line, label], i) => {
  s.say(line);
  const x = 60 + i * 366, y = 420;
  card(s, x, y, 320, 300, i === 0 ? C.paper : C.paper);
  s.ellipse({ x: x + 125, y: y - 45, w: 70, h: 70, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.2, gap: 0 });
  s.text({ x: x + 160, y: y - 10, text: String(i + 1), size: 44, dur: 0.15, gap: 0 });
  if (i === 0) d.bubble(s, { x: x + 160, y: y + 110, w: 150, h: 80, dur: 0.4 });
  if (i === 1) d.laptop(s, { x: x + 160, y: y + 110, size: 150, dur: 0.5 });
  if (i === 2) d.table(s, { x: x + 160, y: y + 110, w: 150, h: 100 });
  if (i === 3) {
    d.db(s, { x: x + 95, y: y + 110, size: 60, dur: 0.4 });
    s.arrow({ pts: [[x + 135, y + 110], [x + 185, y + 110]], sw: 2, dur: 0.2 });
    d.db(s, { x: x + 225, y: y + 110, size: 60, dur: 0.4 });
  }
  if (i === 4) { d.person(s, { x: x + 115, y: y + 110, size: 90 }); d.person(s, { x: x + 205, y: y + 110, size: 90 }); }
  s.text({ x: x + 160, y: y + 235, text: label, size: 38 });
  if (i < 4) s.arrow({ pts: [[x + 325, y + 150], [x + 360, y + 150]], stroke: C.amber, sw: 3, dur: 0.2 });
});

// Graphic 17: STAR with a number
s.cut();
let z = shift(s, 2100, 0);
s.say('For questions about past work, use the STAR method: the situation, the task, the action you took, and the result.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'STAR' });
z.text({ x: 960, y: 150, text: 'The STAR method', size: 84 });
underline(z, 650, 1270, 222);
[['S', 'situation'], ['T', 'task'], ['A', 'action'], ['R', 'result']].forEach(([letter, word], i) => {
  const x = 170 + i * 420;
  card(z, x, 300, 320, 200, i === 3 ? C.gold : C.paper);
  z.text({ x: x + 160, y: 370, text: letter, size: 80, dur: 0.2, gap: 0 });
  z.text({ x: x + 160, y: 450, text: word, size: 42, dur: 0.3 });
});
s.say('Always end with a number.');
z.ellipse({ x: 1380, y: 270, w: 380, h: 260, stroke: C.red, sw: 4, rough: 2, dur: 0.6 });
s.say('"My pipeline cut the delay of the daily sales report from six hours to forty minutes" beats "my pipeline worked well" every single time.');
card(z, 120, 610, 1680, 150, C.soft);
z.text({ x: 960, y: 685, text: '"My pipeline cut the delay of the daily sales report\nfrom six hours to forty minutes."', size: 44, dur: 2 });
d.check(z, { x: 1740, y: 685, size: 70 });
card(z, 520, 820, 880, 120);
z.text({ x: 960, y: 880, text: '"My pipeline worked well."', size: 44, stroke: C.grey });
d.cross(z, { x: 1340, y: 880, size: 60 });

// Graphic 18: referrals
s.cut();
z = shift(s, 1050, 1300);
s.say('A referral means a person inside a company recommends you.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Referral' });
z.text({ x: 960, y: 150, text: 'Know someone there?', size: 84 });
underline(z, 600, 1320, 222);
d.person(z, { x: 420, y: 520, size: 200 });
z.text({ x: 420, y: 700, text: 'you', size: 48 });
z.arrow({ pts: [[560, 520], [830, 520]], stroke: C.amber, sw: 3, dur: 0.4 });
d.person(z, { x: 960, y: 520, size: 200, fill: C.gold });
z.text({ x: 960, y: 700, text: 'someone there', size: 48 });
z.arrow({ pts: [[1090, 520], [1360, 520]], stroke: C.amber, sw: 3, dur: 0.4 });
z.rect({ x: 1380, y: 400, w: 380, h: 240, round: true, sw: 4, fill: C.paper, fillStyle: 'solid', dur: 0.5 });
z.text({ x: 1570, y: 520, text: 'hiring\nmanager', size: 52 });
s.say(REFERRAL.line);
z.text({ x: 960, y: 860, text: REFERRAL.big, size: 64, stroke: C.amber, dur: 1.2 });
z.text({ x: 960, y: 950, text: REFERRAL.source, size: 30, stroke: C.grey });

s.settle();
s.wait(0.6);
s.frame({ x: -110, y: -3, w: 4240, h: 2385, name: 'Whole board', dur: 1.8 });
s.end();

module.exports = s;
