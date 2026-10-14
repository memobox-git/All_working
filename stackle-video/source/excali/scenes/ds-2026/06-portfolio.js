// Graphics 10 to 12: the portfolio. Three shots on one board, then the whole board.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

const card = (z, x, y, w, h, fill = C.paper) => z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur: 0.5, gap: 0.05 });
const underline = (z, x1, x2, y) => z.line({ pts: [[x1, y], [(x1 + x2) / 2, y + 8], [x2, y - 2]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });

// Graphic 10: tutorial projects get skipped
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Skipped', at: 0 });
s.say('Projects copied from a tutorial get skipped.');
s.text({ x: 960, y: 150, text: 'Copied from a tutorial: skipped', size: 84 });
underline(s, 440, 1480, 222);
s.say('The Titanic survival model and the Iris flower model are the two most famous beginner datasets, and hiring managers have seen them many times.');
card(s, 330, 310, 560, 440);
s.line({ pts: [[480, 520], [740, 520], [700, 590], [520, 590], [480, 520]], sw: 3, dur: 0.6 });
s.line({ pts: [[610, 520], [610, 370]], sw: 3, dur: 0.25 });
s.line({ pts: [[618, 382], [700, 500], [618, 500], [618, 382]], stroke: C.amber, sw: 3, dur: 0.4 });
s.line({ pts: [[440, 620], [500, 604], [560, 620], [620, 604], [680, 620], [740, 604], [780, 620]], stroke: '#1971c2', sw: 3, curve: true, dur: 0.5 });
s.text({ x: 610, y: 690, text: 'Titanic survival', size: 54 });
card(s, 1030, 310, 560, 440);
for (const [dx, dy] of [[0, -58], [58, 0], [0, 58], [-58, 0]])
  s.ellipse({ x: 1310 + dx - 42, y: 460 + dy - 42, w: 84, h: 84, stroke: C.amber, fill: C.soft, sw: 3, dur: 0.25, gap: 0.03 });
s.ellipse({ x: 1285, y: 435, w: 50, h: 50, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.25 });
s.line({ pts: [[1310, 560], [1298, 595], [1312, 630]], stroke: C.green, sw: 3, curve: true, dur: 0.25 });
s.text({ x: 1310, y: 690, text: 'Iris flowers', size: 54 });
for (const x of [330, 1030]) {
  s.line({ pts: [[x + 90, 350], [x + 470, 630]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.05 });
  s.line({ pts: [[x + 470, 350], [x + 90, 630]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.1 });
}
s.text({ x: 960, y: 850, text: 'hiring managers have seen them many times', size: 52, stroke: C.red });
s.say('Think of a cover song.');
s.say('It shows that you can follow along, but it does not show what you can make.');

// Graphic 11: the four questions
let z = shift(s, 2100, 0);
s.say('Every project should answer four questions.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Four questions' });
z.text({ x: 960, y: 150, text: 'Every project answers 4 questions', size: 84 });
underline(z, 340, 1580, 222);
const questions = [
  ['Who has the problem?', 'Who has\nthe problem?'],
  ['What does the problem cost them?', 'What does it\ncost them?'],
  ['What did the data show?', 'What did the\ndata show?'],
  ['What should they do now?', 'What should they\ndo now?'],
];
questions.forEach(([line, label], i) => {
  s.say(line);
  const bx = 80 + (i % 2) * 940, by = 300 + Math.floor(i / 2) * 270;
  card(z, bx, by, 820, 210);
  z.ellipse({ x: bx + 34, y: by + 57, w: 96, h: 96, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.3, gap: 0 });
  z.text({ x: bx + 82, y: by + 105, text: String(i + 1), size: 58, dur: 0.2, gap: 0.05 });
  z.text({ x: bx + 170, y: by + 105, text: label, size: 46, align: 'left' });
});
s.say('The last question matters most, because a manager pays for decisions, not for accuracy scores.');
z.ellipse({ x: 990, y: 548, w: 900, h: 270, stroke: C.red, sw: 4, rough: 2, dur: 0.7 });
z.text({ x: 960, y: 940, text: 'A manager pays for decisions, not for accuracy scores.', size: 46, stroke: C.amber });

// Graphic 12: build in a field you know
z = shift(s, 1050, 1300);
s.say('Build in a field you already know.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Your field' });
z.text({ x: 960, y: 150, text: 'Build in a field you already know', size: 84 });
underline(z, 380, 1540, 222);
const fields = [
  ['If you worked in retail, predict which products will sell out.', 'Retail', 'which products\nwill sell out'],
  ['In a hospital, predict which patients will miss appointments.', 'Hospital', 'which patients will\nmiss appointments'],
  ['In sales, find which leads will turn into customers.', 'Sales', 'which leads will\nturn into customers'],
];
fields.forEach(([line, role, data], i) => {
  s.say(line);
  const cx = 360 + i * 600;
  card(z, cx - 250, 330, 500, 560, i === 0 ? C.soft : C.paper);
  d.person(z, { x: cx, y: 470, size: 150 });
  z.text({ x: cx, y: 620, text: role, size: 56, stroke: C.amber });
  z.arrow({ pts: [[cx, 680], [cx, 740]], sw: 3, dur: 0.2 });
  z.text({ x: cx, y: 810, text: data, size: 40 });
});

// Pull back to the whole board
s.settle();
s.wait(0.6);
s.frame({ x: -110, y: -3, w: 4240, h: 2385, name: 'Whole board', dur: 1.8 });
s.end();

module.exports = s;
