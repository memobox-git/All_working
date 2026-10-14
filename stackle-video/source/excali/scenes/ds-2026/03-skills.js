// Graphics 3 to 6: the four phases. An overview shot, one zone per topic
// below it, then back to the overview with the AI phase circled.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

const card = (z, { x, y, w, h, fill = C.paper, dur = 0.5 }) =>
  z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur, gap: 0.05 });
const title = (z, text, sub, subColor = C.amber) => {
  z.text({ x: 960, y: 130, text, size: 92, dur: 0.8 });
  if (sub) z.text({ x: 960, y: 215, text: sub, size: 46, stroke: subColor, dur: 0.8 });
};

// Overview: four boxes in order
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Four phases', at: 0 });
s.say('Data science skills build on each other, like cooking.');
s.text({ x: 960, y: 190, text: 'The order matters', size: 92 });
s.line({ pts: [[640, 262], [960, 270], [1280, 260]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });
s.say('You learn to use a knife before you cook a full meal, so the order matters.');
s.say('There are four phases: Python and SQL, statistics, machine learning, and AI.');
const phases = ['Python\nand SQL', 'Statistics', 'Machine\nlearning', 'AI'];
phases.forEach((name, i) => {
  const x = 120 + i * 440;
  card(s, { x, y: 470, w: 360, h: 190, dur: 0.3 });
  s.text({ x: x + 180, y: 425, text: String(i + 1), size: 52, stroke: C.amber, dur: 0.1, gap: 0 });
  s.text({ x: x + 180, y: 565, text: name, size: 52, dur: 0.35, gap: 0 });
  if (i < 3) s.arrow({ pts: [[x + 366, 565], [x + 434, 565]], stroke: C.amber, sw: 3, dur: 0.15, gap: 0 });
});

const Z = i => shift(s, (i - 2) * 2100, 1400);

// Zone 1: Python
let z = Z(0);
s.say('Phase one is Python and SQL.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Python' });
s.say('Python is the main language of data science.');
title(z, '1 · Python', 'the main language of data science');
d.laptop(z, { x: 420, y: 520, size: 420 });
s.say('Learn the basics first, then pandas, a library that cleans and reshapes tables.');
card(z, { x: 900, y: 320, w: 880, h: 110 });
z.text({ x: 1340, y: 375, text: 'the basics first', size: 46 });
d.table(z, { x: 1010, y: 540, w: 170, h: 120 });
z.text({ x: 1130, y: 540, text: 'pandas: cleans and\nreshapes tables', size: 44, align: 'left' });
s.say('Then learn Matplotlib or Seaborn, which turn numbers into charts.');
[60, 110, 80, 150].forEach((h, i) =>
  z.rect({ x: 940 + i * 42, y: 820 - h, w: 30, h, fill: C.gold, fillStyle: 'hachure', stroke: C.ink, sw: 2, dur: 0.15, gap: 0 }));
z.line({ pts: [[925, 822], [1110, 822]], sw: 2, dur: 0.2 });
z.text({ x: 1130, y: 760, text: 'Matplotlib or Seaborn:\nnumbers into charts', size: 44, align: 'left' });

// Zone 2: SQL
z = Z(1);
s.say('SQL, which stands for Structured Query Language, is how you ask a database a question.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'SQL' });
title(z, '1 · SQL', 'Structured Query Language');
d.db(z, { x: 960, y: 360, size: 110 });
z.text({ x: 1060, y: 360, text: 'ask a database a question', size: 40, stroke: C.grey, align: 'left' });
s.say('If Python is your kitchen, SQL is the grocery store, because it is where you get the ingredients.');
z.text({ x: 960, y: 480, text: 'Python = your kitchen   ·   SQL = the grocery store', size: 42, stroke: C.amber });
s.say('Learn joins, which connect two tables, and aggregations, which add things up, like total sales for each month.');
const topics = [['Joins', 'connect two tables'], ['Aggregations', 'total sales each month'],
  ['Window functions', 'compare nearby rows'], ['Subqueries', 'a question inside\na question']];
topics.forEach(([name, label], i) => {
  if (i === 2) s.say('Then learn window functions, which compare a row with the rows next to it, and subqueries, which put one question inside another.');
  const x = 80 + i * 450;
  card(z, { x, y: 560, w: 410, h: 340, dur: 0.4 });
  z.text({ x: x + 205, y: 615, text: name, size: 44, stroke: C.amber, dur: 0.4 });
  if (i === 0) { d.table(z, { x: x + 120, y: 730, w: 120, h: 90 }); d.table(z, { x: x + 290, y: 730, w: 120, h: 90 }); }
  if (i === 1) [50, 80, 40, 100].forEach((h, k) =>
    z.rect({ x: x + 125 + k * 45, y: 780 - h, w: 32, h, fill: C.gold, fillStyle: 'hachure', stroke: C.ink, sw: 2, dur: 0.12, gap: 0 }));
  if (i === 2) ['Mon', 'Tue', 'Wed'].forEach((day, k) => {
    z.rect({ x: x + 40 + k * 115, y: 690, w: 100, h: 70, sw: 2, fill: k === 2 ? C.soft : C.paper, fillStyle: 'solid', dur: 0.15, gap: 0 });
    z.text({ x: x + 90 + k * 115, y: 725, text: day, size: 30, dur: 0.1, gap: 0 });
  });
  if (i === 3) {
    z.rect({ x: x + 95, y: 680, w: 220, h: 120, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.25, gap: 0 });
    z.rect({ x: x + 150, y: 710, w: 110, h: 60, round: true, sw: 2, fill: C.soft, fillStyle: 'solid', dur: 0.2, gap: 0 });
    z.text({ x: x + 205, y: 740, text: '?', size: 40, dur: 0.1, gap: 0 });
  }
  z.text({ x: x + 205, y: 845, text: label, size: 34 });
});
s.say('Even if the job is all about models, expect a SQL test in the interview.');
z.text({ x: 960, y: 1000, text: 'Expect a SQL test in the interview', size: 46, stroke: C.red });

// Zone 3: statistics
z = Z(2);
s.say('Phase two is statistics, which tells you if a result is real or just luck.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Statistics' });
title(z, '2 · Statistics');
z.text({ x: 960, y: 215, text: 'real, or just luck?', size: 46, stroke: C.amber });
s.say('If you flip a coin ten times and get seven heads, is the coin broken?');
z.ellipse({ x: 300, y: 330, w: 180, h: 180, stroke: C.amber, fill: C.gold, fillStyle: 'solid', sw: 3, dur: 0.5 });
z.text({ x: 390, y: 420, text: 'H', size: 80, dur: 0.3 });
z.text({ x: 390, y: 590, text: '7 heads in 10 flips', size: 42 });
z.text({ x: 390, y: 650, text: 'is the coin broken?', size: 42, stroke: C.red });
s.say('That is exactly the question it answers.');
const stats = [
  ['Learn distributions, which describe the shape your data makes.', 'distributions:\nthe shape of your data'],
  ['Learn hypothesis testing, which is a fair way to check a claim.', 'hypothesis testing:\na fair way to check a claim'],
  ['A p-value tells you how surprising a result would be if nothing had changed.', 'p-value: how surprising,\nif nothing changed'],
  ['A confidence interval gives you a range where the true number probably sits.', 'confidence interval: where\nthe true number probably sits'],
];
stats.forEach(([line, label], i) => {
  s.say(line);
  const x = 760 + (i % 2) * 560, y = 290 + Math.floor(i / 2) * 200;
  card(z, { x, y, w: 520, h: 170, dur: 0.35 });
  z.text({ x: x + 260, y: y + 85, text: label, size: 33 });
});
s.say('Then practice A/B testing.');
card(z, { x: 760, y: 700, w: 1080, h: 200, fill: C.soft });
z.text({ x: 900, y: 800, text: 'A/B test', size: 50 });
s.say('Show half your users a green button and half a blue button, and measure which one gets more clicks.');
z.rect({ x: 1060, y: 750, w: 200, h: 100, round: true, sw: 3, fill: '#b2f2bb', fillStyle: 'solid', stroke: C.green, dur: 0.3 });
z.text({ x: 1160, y: 800, text: 'A', size: 50 });
z.rect({ x: 1300, y: 750, w: 200, h: 100, round: true, sw: 3, fill: '#a5d8ff', fillStyle: 'solid', stroke: '#1971c2', dur: 0.3 });
z.text({ x: 1400, y: 800, text: 'B', size: 50 });
z.text({ x: 1670, y: 800, text: 'more\nclicks?', size: 40, stroke: C.amber });
s.say('Interviewers love statistics questions, because the answers show how you think.');
z.text({ x: 960, y: 1000, text: 'Interviewers love statistics questions', size: 46, stroke: C.red });

// Zone 4: machine learning
z = Z(3);
s.say('Phase three is machine learning, which means teaching a computer to find patterns in past data so it can guess about new data.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Machine learning' });
title(z, '3 · Machine learning', 'find patterns in past data, guess about new data');
s.say('Your email spam filter is machine learning.');
z.rect({ x: 170, y: 340, w: 300, h: 200, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.4 });
z.line({ pts: [[170, 340], [320, 450], [470, 340]], sw: 3, dur: 0.3 });
z.text({ x: 320, y: 600, text: 'spam filter', size: 46, stroke: C.amber });
s.say('It learned from millions of emails that people marked as spam.');
z.text({ x: 320, y: 670, text: 'learned from millions\nof emails', size: 36 });
s.say('Start with supervised learning, where every example comes with the right answer.');
card(z, { x: 640, y: 290, w: 1200, h: 360 });
z.text({ x: 680, y: 345, text: 'Supervised: every example has the answer', size: 44, stroke: C.amber, align: 'left' });
s.say('Linear regression predicts a number, like the price of a house.');
z.text({ x: 700, y: 425, text: 'linear regression → a number (house price)', size: 38, align: 'left' });
s.say('Logistic regression predicts yes or no, like whether a customer will cancel.');
z.text({ x: 700, y: 495, text: 'logistic regression → yes or no (will they cancel?)', size: 38, align: 'left' });
s.say('Then learn decision trees, which ask a chain of yes-or-no questions, and random forests and gradient boosting, which combine many trees into one stronger model.');
z.text({ x: 700, y: 575, text: 'decision trees · random forests · gradient boosting', size: 38, align: 'left' });
s.say('After that, learn unsupervised learning, where there is no answer key.');
card(z, { x: 640, y: 690, w: 1200, h: 230 });
z.text({ x: 680, y: 745, text: 'Unsupervised: no answer key', size: 44, stroke: C.amber, align: 'left' });
s.say('K-means puts similar customers into groups, and PCA shrinks many columns into a few.');
z.text({ x: 700, y: 820, text: 'k-means → groups of similar customers', size: 38, align: 'left' });
z.text({ x: 700, y: 880, text: 'PCA → many columns into a few', size: 38, align: 'left' });
s.say('The main library for all of this is scikit-learn.');
z.rect({ x: 140, y: 800, w: 360, h: 110, round: true, sw: 3, fill: C.soft, fillStyle: 'solid', dur: 0.4 });
z.text({ x: 320, y: 855, text: 'scikit-learn', size: 46 });

// Zone 5: grading a model
z = Z(4);
s.say('Then learn how to grade a model.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Grading a model' });
title(z, 'Grading a model');
s.say('Accuracy alone can fool you.');
z.text({ x: 960, y: 215, text: 'accuracy alone can fool you', size: 46, stroke: C.red });
s.say('Think of a test for a rare disease where only one person in a hundred is sick.');
for (let i = 0; i < 100; i++)
  z.ellipse({ x: 150 + (i % 10) * 46, y: 300 + Math.floor(i / 10) * 46, w: 30, h: 30, sw: 2,
    stroke: i === 57 ? C.red : C.grey, fill: i === 57 ? C.red : 'transparent', fillStyle: 'solid', dur: 0.03, gap: 0 });
z.text({ x: 360, y: 810, text: '1 in 100 is sick', size: 42 });
s.say('A model that says nobody is sick is ninety-nine percent accurate, and it is useless.');
z.text({ x: 1100, y: 330, text: 'model: "nobody is sick"', size: 44, align: 'left' });
z.text({ x: 1100, y: 420, text: '99% accurate', size: 64, stroke: C.amber, align: 'left' });
z.text({ x: 1100, y: 500, text: 'and useless', size: 50, stroke: C.red, align: 'left' });
d.cross(z, { x: 1600, y: 420, size: 70 });
s.say('That is why you learn precision, which tells you how many of your yes answers were right, and recall, which tells you how many of the real yes cases you found.');
z.rect({ x: 900, y: 580, w: 920, h: 90, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3 });
z.text({ x: 1360, y: 625, text: 'precision: how many yes answers were right', size: 36 });
z.rect({ x: 900, y: 690, w: 920, h: 90, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3, gap: 1.5 });
z.text({ x: 1360, y: 735, text: 'recall: how many real yes cases you found', size: 36 });
s.say('AUC is a single score for how well your predictions separate yes from no.');
z.rect({ x: 900, y: 800, w: 920, h: 90, round: true, sw: 2, fill: C.soft, fillStyle: 'solid', dur: 0.3 });
z.text({ x: 1360, y: 845, text: 'AUC: how well it separates yes from no', size: 36 });
s.say('Later, take a first look at deep learning, the kind of machine learning behind image and speech tools, with PyTorch or TensorFlow.');
z.text({ x: 960, y: 980, text: 'Later: deep learning with PyTorch or TensorFlow', size: 40, stroke: C.grey });
s.say('It is not needed for most first jobs.');

// Back to the overview, AI next
s.settle();
s.wait(0.5);
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Four phases again' });
s.ellipse({ x: 1430, y: 430, w: 450, h: 270, stroke: C.red, sw: 4, rough: 2, dur: 0.7 });
s.end();

module.exports = s;
