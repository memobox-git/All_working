// Graphics 12 to 15: the portfolio. Four shots on one board, then the whole board.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

const card = (z, x, y, w, h, fill = C.paper) => z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur: 0.5, gap: 0.05 });
const underline = (z, x1, x2, y) => z.line({ pts: [[x1, y], [(x1 + x2) / 2, y + 8], [x2, y - 2]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });

// Shot 1: projects that get skipped
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Skipped', at: 0 });
s.say('Projects copied from a course get skipped.');
s.text({ x: 960, y: 150, text: 'Copied from a course: skipped', size: 84 });
underline(s, 460, 1460, 222);
s.say('A hiring manager has seen the same taxi-trip pipeline and the same spreadsheet loaded once into a database many times, so a copy says nothing about you.');
card(s, 300, 310, 600, 440);
s.rect({ x: 470, y: 400, w: 160, h: 70, round: true, sw: 3, fill: C.gold, fillStyle: 'solid', dur: 0.3, gap: 0 });
s.rect({ x: 410, y: 460, w: 280, h: 100, round: true, sw: 3, fill: C.gold, fillStyle: 'solid', dur: 0.3, gap: 0 });
s.ellipse({ x: 445, y: 535, w: 60, h: 60, sw: 3, fill: C.ink, fillStyle: 'solid', dur: 0.2, gap: 0 });
s.ellipse({ x: 595, y: 535, w: 60, h: 60, sw: 3, fill: C.ink, fillStyle: 'solid', dur: 0.2, gap: 0 });
s.text({ x: 600, y: 680, text: 'taxi-trip pipeline', size: 50 });
card(s, 1020, 310, 600, 440);
d.doc(s, { x: 1180, y: 490, size: 150, dur: 0.5 });
s.arrow({ pts: [[1260, 490], [1370, 490]], sw: 3, dur: 0.3 });
d.db(s, { x: 1450, y: 490, size: 110 });
s.text({ x: 1320, y: 680, text: 'spreadsheet loaded once', size: 44 });
for (const x of [300, 1020]) {
  s.line({ pts: [[x + 90, 340], [x + 510, 620]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.05 });
  s.line({ pts: [[x + 510, 340], [x + 90, 620]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.1 });
}
s.text({ x: 960, y: 880, text: 'A copy says nothing about you.', size: 60, stroke: C.red });
s.say('Think of a cover song.');
s.say('It shows that you can follow along, but it does not show what you can make.');

// Shot 2: what a strong project does
let z = shift(s, 2100, 0);
s.say('A strong project pulls real data that changes every day.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Strong project' });
z.text({ x: 960, y: 150, text: 'A strong project', size: 84 });
underline(z, 650, 1270, 222);
const steps = [['real data that\nchanges every day', 'clock'], ['runs on\na schedule', 'clock'],
  ['tests itself', 'check'], ['a table or dashboard\nsomeone could use', 'person']];
steps.forEach(([label, icon], i) => {
  if (i === 1) s.say('It runs on a schedule, tests itself, and ends in a table or a dashboard that someone could use.');
  const x = 70 + i * 460;
  card(z, x, 380, 400, 400, i === 3 ? C.soft : C.paper);
  if (icon === 'clock') d.clock(z, { x: x + 200, y: 500, size: 110 });
  if (icon === 'check') d.check(z, { x: x + 200, y: 500, size: 100 });
  if (icon === 'person') d.person(z, { x: x + 200, y: 500, size: 130 });
  z.text({ x: x + 200, y: 660, text: label, size: 36, dur: 0.6 });
  if (i < 3) z.arrow({ pts: [[x + 405, 580], [x + 455, 580]], stroke: C.amber, sw: 3, dur: 0.2 });
});

// Shot 3: the four questions
z = shift(s, 0, 1300);
s.say('Every project should answer four questions.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Four questions' });
z.text({ x: 960, y: 150, text: 'Every project answers 4 questions', size: 84 });
underline(z, 340, 1580, 222);
const questions = [
  ['What problem does it solve?', 'What problem does it solve?'],
  ['Why does that problem matter to a business?', 'Why does it matter\nto a business?'],
  ['What did you build, and why did you choose that design?', 'What did you build,\nand why that design?'],
  ['What can someone do now that they could not do before?', 'What can someone\ndo now?'],
];
questions.forEach(([line, label], i) => {
  s.say(line);
  const bx = 80 + (i % 2) * 940, by = 300 + Math.floor(i / 2) * 270;
  card(z, bx, by, 820, 210);
  z.ellipse({ x: bx + 34, y: by + 57, w: 96, h: 96, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.3, gap: 0 });
  z.text({ x: bx + 82, y: by + 105, text: String(i + 1), size: 58, dur: 0.2, gap: 0.05 });
  z.text({ x: bx + 170, y: by + 105, text: label, size: 46, align: 'left' });
});
s.say('The last question matters most.');
s.say('A pipeline that runs does not tell anyone what to do next.');
z.ellipse({ x: 990, y: 548, w: 900, h: 270, stroke: C.red, sw: 4, rough: 2, dur: 0.7 });
z.text({ x: 960, y: 940, text: 'A pipeline that runs does not tell anyone what to do next.', size: 44, stroke: C.amber });

// Shot 4: build in a field you know
z = shift(s, 2100, 1300);
s.say('Build in a field you already know.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Your field' });
z.text({ x: 960, y: 150, text: 'Build in a field you already know', size: 84 });
underline(z, 380, 1540, 222);
const fields = [
  ['If you worked in logistics, build a pipeline that tracks deliveries.', 'Logistics', 'track deliveries'],
  ['If you worked in a hospital, track how long patients wait.', 'Hospital', 'patient wait times'],
  ['If you worked in a bank, load daily card transactions.', 'Banking', 'daily card transactions'],
];
fields.forEach(([line, role, data], i) => {
  s.say(line);
  const cx = 360 + i * 600;
  card(z, cx - 250, 330, 500, 560, i === 0 ? C.soft : C.paper);
  d.person(z, { x: cx, y: 470, size: 150 });
  z.text({ x: cx, y: 620, text: role, size: 56, stroke: C.amber });
  z.arrow({ pts: [[cx, 680], [cx, 750]], sw: 3, dur: 0.2 });
  z.text({ x: cx, y: 810, text: data, size: 44 });
});

// Pull back to the whole board
s.settle();
s.wait(0.6);
s.frame({ x: -110, y: -3, w: 4240, h: 2385, name: 'Whole board', dur: 1.8 });
s.end();

module.exports = s;
