// Graphics 7 and 8: how AI changed the work. Chris introduces each change on
// camera, so each graphic is its own clip.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const { AI_STAT } = require('./facts');
const s = scene();

const box = (z, x, y, w, h, fill = C.paper) => z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur: 0.4, gap: 0.05 });

// Graphic 7: how you work
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'How you work', at: 0 });
s.say(AI_STAT.line);
s.text({ x: 960, y: 140, text: '1 · How you work', size: 88, dur: 0.8 });
d.laptop(s, { x: 420, y: 430, size: 360, dur: 0.8 });
s.text({ x: 1400, y: 400, text: AI_STAT.big, size: 150, stroke: C.amber, dur: 0.6 });
s.text({ x: 1400, y: 530, text: AI_STAT.small, size: 38 });
s.text({ x: 1400, y: 590, text: AI_STAT.source, size: 28, stroke: C.grey });
s.say('But treat an assistant like a smart new intern.');
d.person(s, { x: 260, y: 790, size: 150 });
s.text({ x: 360, y: 760, text: 'a smart new intern', size: 44, stroke: C.amber, align: 'left' });
s.say('The intern works fast, and you still check every piece of work before it goes to your boss.');
s.text({ x: 360, y: 830, text: 'fast, and you check\nevery piece of work', size: 38, align: 'left' });
s.say('So statistics and SQL matter more now, not less.');
s.say('They are how you check the work.');
box(s, 1040, 740, 760, 170, C.soft);
s.text({ x: 1420, y: 825, text: 'statistics + SQL:\nhow you check the work', size: 44 });
d.check(s, { x: 1750, y: 825, size: 70 });

// Graphic 8: classic model or LLM
s.cut();
const z = shift(s, 0, 1300);
s.say('Use a classic model when your data is a table of numbers.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Classic model or LLM', dur: 1 });
z.text({ x: 960, y: 130, text: '2 · Classic model or LLM?', size: 88, dur: 0.8 });
box(z, 100, 240, 820, 600);
z.text({ x: 510, y: 300, text: 'a table of numbers', size: 50, stroke: C.amber });
d.table(z, { x: 510, y: 420, w: 260, h: 150 });
z.text({ x: 510, y: 560, text: '→ classic model', size: 48 });
s.say('If you want to predict which customers will cancel, a model like gradient boosting is faster, cheaper and easier to check.');
z.text({ x: 510, y: 650, text: '"which customers will cancel?"', size: 38 });
z.text({ x: 510, y: 740, text: 'faster · cheaper · easier to check', size: 38, stroke: C.green });
s.say('Use an LLM when your data is messy text.');
box(z, 1000, 240, 820, 600);
z.text({ x: 1410, y: 300, text: 'messy text', size: 50, stroke: C.amber });
[0, 1, 2].forEach(i => d.doc(z, { x: 1330 + i * 40, y: 410 + i * 20, size: 140, dur: 0.3 }));
z.text({ x: 1410, y: 560, text: '→ LLM', size: 48 });
s.say('If you want to sort ten thousand support emails by topic, an LLM can do it in minutes.');
z.text({ x: 1410, y: 650, text: '"sort 10,000 support emails by topic"', size: 38 });
z.text({ x: 1410, y: 740, text: 'in minutes', size: 38, stroke: C.green });
s.say('LLMs work with embeddings, which are lists of numbers that capture what text means, and vector databases, which find the text closest in meaning to a question.');
box(z, 260, 890, 1400, 120, C.soft);
z.text({ x: 960, y: 950, text: 'embeddings: numbers for meaning  ·  vector database: finds the closest text', size: 36 });
s.end();

module.exports = s;
