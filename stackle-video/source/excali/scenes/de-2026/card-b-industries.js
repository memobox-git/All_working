// Card beside Chris (transparent): apply in the industry you know.
const { scene, COLORS: C } = require('../../kit');
const s = scene();

s.say('Your past industry also counts.');
s.rect({ x: 1060, y: 160, w: 780, h: 760, round: true, sw: 3, fill: C.cream, fillStyle: 'solid', dur: 0.6 });
s.text({ x: 1450, y: 260, text: 'Your past industry counts', size: 54, stroke: C.amber });
s.say('If you worked in healthcare, banking or retail, apply to data teams in that industry first.');
['Healthcare', 'Banking', 'Retail'].forEach((name, i) => {
  s.rect({ x: 1140, y: 350 + i * 130, w: 620, h: 100, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3, gap: 0 });
  s.text({ x: 1450, y: 400 + i * 130, text: name, size: 46, gap: 0.3 });
});
s.say('A person who already knows what an insurance claim or a stock trade is needs less training, and hiring managers notice that.');
s.text({ x: 1450, y: 800, text: 'less training needed', size: 46, stroke: C.green });
s.end();

module.exports = s;
