// Pilot scene: the portfolio part of the "break into data" video.
// Shot 1 crosses out tutorial projects, shot 2 gives the four questions,
// then the camera pulls back to show the whole board.
const { scene, COLORS: C } = require('../kit');
const s = scene();

s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Shot 1', at: 0 });
s.at(0.4);

// Shot 1: projects that get skipped
s.text({ x: 960, y: 160, text: 'Projects that get skipped', size: 84, dur: 1.0 });
s.line({ pts: [[520, 228], [960, 236], [1400, 226]], stroke: C.amber, sw: 4, curve: true, dur: 0.5 });
s.wait(0.3);

s.rect({ x: 330, y: 320, w: 560, h: 440, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.9 });
s.line({ pts: [[480, 530], [740, 530], [700, 600], [520, 600], [480, 530]], sw: 3, dur: 0.8 });
s.line({ pts: [[610, 530], [610, 380]], sw: 3, dur: 0.3 });
s.line({ pts: [[618, 392], [700, 510], [618, 510], [618, 392]], stroke: C.amber, sw: 3, dur: 0.5 });
s.line({ pts: [[440, 630], [500, 614], [560, 630], [620, 614], [680, 630], [740, 614], [780, 630]], stroke: '#1971c2', sw: 3, curve: true, dur: 0.6 });
s.text({ x: 610, y: 700, text: 'Titanic survival', size: 54 });
s.wait(0.2);

s.rect({ x: 1030, y: 320, w: 560, h: 440, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.9 });
for (const [dx, dy] of [[0, -58], [58, 0], [0, 58], [-58, 0]])
  s.ellipse({ x: 1310 + dx - 42, y: 470 + dy - 42, w: 84, h: 84, stroke: C.amber, fill: C.soft, sw: 3, dur: 0.35, gap: 0.05 });
s.ellipse({ x: 1285, y: 445, w: 50, h: 50, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.3 });
s.line({ pts: [[1310, 570], [1298, 605], [1312, 640]], stroke: C.green, sw: 3, curve: true, dur: 0.3 });
s.text({ x: 1310, y: 700, text: 'Iris flowers', size: 54 });
s.wait(0.4);

for (const x of [330, 1030]) {
  s.line({ pts: [[x + 90, 360], [x + 470, 640]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.05 });
  s.line({ pts: [[x + 470, 360], [x + 90, 640]], stroke: C.red, sw: 7, dur: 0.25, gap: 0.15 });
}
s.text({ x: 960, y: 880, text: 'Copied from a tutorial  =  no callback', size: 56, stroke: C.red, dur: 1.0 });
s.wait(0.8);
s.arrow({ pts: [[1640, 980], [1900, 1060], [2160, 1020]], stroke: C.amber, sw: 4, curve: true, dur: 0.6, gap: 0 });

// Shot 2: four questions, down and to the right on the same board
const X = 2100, Y = 640;
s.frame({ x: X, y: Y, w: 1920, h: 1080, name: 'Shot 2', dur: 1.6 });
s.text({ x: X + 960, y: Y + 160, text: 'Every project answers 4 questions', size: 84, dur: 1.1 });
s.line({ pts: [[X + 340, Y + 228], [X + 960, Y + 236], [X + 1580, Y + 226]], stroke: C.amber, sw: 4, curve: true, dur: 0.5 });
s.wait(0.2);

const questions = [
  'What problem did\nyou solve?', 'Why does it matter\nto the business?',
  'What did you find?', 'What should someone\ndo differently?',
];
questions.forEach((q, i) => {
  const bx = X + 80 + (i % 2) * 940, by = Y + 300 + Math.floor(i / 2) * 270;
  s.rect({ x: bx, y: by, w: 820, h: 210, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.6, gap: 0.05 });
  s.ellipse({ x: bx + 34, y: by + 57, w: 96, h: 96, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.35, gap: 0 });
  s.text({ x: bx + 82, y: by + 105, text: String(i + 1), size: 58, dur: 0.25, gap: 0.05 });
  s.text({ x: bx + 170, y: by + 105, text: q, size: 48, align: 'left', gap: 0.35 });
});

s.ellipse({ x: X + 990, y: Y + 548, w: 900, h: 270, stroke: C.red, sw: 4, rough: 2, dur: 0.8 });
s.text({ x: X + 960, y: Y + 940, text: 'An accuracy score does not tell anyone what to do next.', size: 50, stroke: C.amber, dur: 1.4 });
s.wait(1.2);

// Pull back to the whole board
s.frame({ x: 180, y: -260, w: 3960, h: 2228, name: 'Whole board', dur: 1.8 });

module.exports = s;
