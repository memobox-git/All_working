// Graphics 9 and 10: the two ways AI changed the work. Chris introduces each
// change on camera, so each graphic is its own clip.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { AI_STAT, AI_RISK } = require('./facts');
const s = scene();

const box = (z, x, y, w, h, fill = C.paper) => z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur: 0.4, gap: 0.05 });

// Graphic 9: how you write code
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'How you write code', at: 0 });
s.say(AI_STAT.line);
s.text({ x: 960, y: 140, text: '1 · How you write code', size: 88, dur: 0.8 });
d.laptop(s, { x: 480, y: 470, size: 380, dur: 0.8 });
d.bubble(s, { x: 960, y: 330, w: 420, h: 150, dur: 0.5 });
s.text({ x: 960, y: 320, text: 'first draft\nin seconds', size: 44, dur: 0.6 });
const usage = [
  s.text({ x: 1500, y: 470, text: AI_STAT.big, size: 150, stroke: C.amber, dur: 0.6 }),
  s.text({ x: 1500, y: 600, text: AI_STAT.small, size: 38 }),
  s.text({ x: 1500, y: 660, text: AI_STAT.source, size: 28, stroke: C.grey }),
];
s.say('You still read every line, because the result can run and still give the wrong answer.');
box(s, 220, 800, 700, 150);
s.text({ x: 570, y: 875, text: 'runs, and still gives\nthe wrong answer', size: 42, stroke: C.red });
d.cross(s, { x: 180, y: 875, size: 60 });
s.say(AI_RISK.line);
for (const el of usage) el.customData.out = s.t;
s.wait(0.4);
s.text({ x: 1500, y: 450, text: AI_RISK.big, size: 150, stroke: C.red, dur: 0.6 });
s.text({ x: 1500, y: 595, text: AI_RISK.small, size: 36 });
s.text({ x: 1500, y: 680, text: AI_RISK.source, size: 28, stroke: C.grey });
s.say('This is why SQL and data modeling matter more now, not less.');
s.say('You need them to check the work.');
box(s, 1040, 800, 700, 150, C.soft);
s.text({ x: 1390, y: 875, text: 'SQL + data modeling:\nhow you check the work', size: 42 });
d.check(s, { x: 1790, y: 875, size: 70 });

// Graphic 10: what you build
s.cut();
const z = shift(s, 0, 1300);
s.say('A pipeline for an AI assistant collects the documents, splits them into small pieces, and turns each one into an embedding.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'What you build', dur: 1 });
z.text({ x: 960, y: 130, text: '2 · What you build', size: 88, dur: 0.6 });
z.text({ x: 960, y: 225, text: "an assistant that answers from a company's help pages", size: 42, stroke: C.amber, dur: 0.8 });
[0, 1, 2].forEach(i => d.doc(z, { x: 150 + i * 40, y: 450 + i * 30, size: 150, dur: 0.3 }));
z.text({ x: 190, y: 620, text: 'documents', size: 38 });
z.arrow({ pts: [[300, 480], [400, 480]], sw: 3, dur: 0.3 });
[0, 1, 2, 3].forEach(i => z.rect({ x: 420, y: 380 + i * 52, w: 170, h: 40, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.15, gap: 0 }));
z.text({ x: 505, y: 620, text: 'small pieces', size: 38 });
z.arrow({ pts: [[610, 480], [710, 480]], sw: 3, dur: 0.3 });
box(z, 730, 400, 330, 160);
z.text({ x: 895, y: 480, text: '[0.12, -0.40,\n0.88, ...]', size: 38 });
z.text({ x: 895, y: 620, text: 'embedding', size: 38 });
s.say('An embedding is a list of numbers that captures what the text means, so text with a similar meaning gets similar numbers.');
z.text({ x: 895, y: 690, text: 'similar meaning, similar numbers', size: 34, stroke: C.amber });
s.say('These lists go into a vector database, which finds the pieces closest in meaning to a question.');
z.arrow({ pts: [[1080, 480], [1250, 480]], sw: 3, dur: 0.3 });
d.db(z, { x: 1360, y: 480, size: 150, fill: C.gold });
z.text({ x: 1360, y: 620, text: 'vector database', size: 38 });
d.bubble(z, { x: 1700, y: 330, w: 330, h: 130 });
z.text({ x: 1700, y: 322, text: 'a question', size: 40 });
z.arrow({ pts: [[1600, 420], [1450, 450]], stroke: C.amber, sw: 3, dur: 0.3 });
z.arrow({ pts: [[1450, 530], [1600, 590]], stroke: C.amber, sw: 3, dur: 0.3 });
z.text({ x: 1615, y: 600, text: 'closest pieces', size: 38, stroke: C.amber, align: 'left' });
s.say('This setup is called RAG, which stands for retrieval-augmented generation.');
box(z, 460, 830, 1000, 140, C.soft);
z.text({ x: 960, y: 900, text: 'RAG: retrieval-augmented generation', size: 50 });
s.end();

module.exports = s;
