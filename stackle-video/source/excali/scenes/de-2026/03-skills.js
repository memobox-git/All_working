// Graphics 3 to 8: the five phases. An overview shot, one zone per phase
// below it, then back to the overview with the AI phase circled.
const { scene, shift, COLORS: C } = require('../../kit');
const d = require('../../doodles');
const s = scene();

const card = (z, { x, y, w, h, fill = C.paper, dur = 0.6 }) =>
  z.rect({ x, y, w, h, round: true, sw: 3, fill, fillStyle: 'solid', dur, gap: 0.05 });

// Overview: five boxes in order
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Five phases', at: 0 });
s.say('Data engineering skills build on each other, like math in school.');
s.say('You cannot learn fractions before you learn to count, so the order matters.');
s.text({ x: 960, y: 190, text: 'The order matters', size: 92 });
s.line({ pts: [[640, 262], [960, 270], [1280, 260]], stroke: C.amber, sw: 4, curve: true, dur: 0.4 });
s.say('There are five phases: SQL and Python, data modeling, pipelines, cloud, and AI.');
const phases = ['SQL and\nPython', 'Data\nmodeling', 'Pipelines', 'Cloud', 'AI'];
phases.forEach((name, i) => {
  const x = 70 + i * 362;
  card(s, { x, y: 470, w: 300, h: 190, dur: 0.25 });
  s.text({ x: x + 150, y: 425, text: String(i + 1), size: 52, stroke: C.amber, dur: 0.1, gap: 0 });
  s.text({ x: x + 150, y: 565, text: name, size: 50, dur: 0.3, gap: 0 });
  if (i < 4) s.arrow({ pts: [[x + 306, 565], [x + 356, 565]], stroke: C.amber, sw: 3, dur: 0.15, gap: 0 });
});

// Zone 1: SQL
const Z = i => ({ x: (i - 2) * 2100 + 0, y: 1400 });
let z = shift(s, Z(0).x, Z(0).y);
s.say('Phase one starts with SQL, which stands for Structured Query Language.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'SQL' });
z.text({ x: 960, y: 130, text: '1 · SQL', size: 92 });
z.text({ x: 960, y: 215, text: 'Structured Query Language', size: 50, stroke: C.amber });
s.say('It is how you ask a database a question.');
d.db(z, { x: 960, y: 380, size: 110 });
z.text({ x: 1180, y: 380, text: 'ask a database a question', size: 40, stroke: C.grey, align: 'left' });
z.arrow({ pts: [[1170, 380], [1030, 380]], stroke: C.grey, sw: 2, dur: 0.3 });
s.say('Think of a database as a giant spreadsheet.');
s.say('You type, "Show me every order from last week," and you get the answer in seconds.');
d.bubble(z, { x: 560, y: 360, w: 560, h: 120 });
z.text({ x: 560, y: 352, text: '"Show me every order\nfrom last week"', size: 34 });
z.arrow({ pts: [[845, 380], [895, 380]], stroke: C.grey, sw: 2, dur: 0.2 });
s.say('Inside SQL, start with joins.');
s.say('A join connects two tables, like matching each order to the customer who placed it.');
card(z, { x: 120, y: 520, w: 520, h: 400 });
z.text({ x: 380, y: 580, text: 'Joins', size: 52, stroke: C.amber });
d.table(z, { x: 260, y: 720, w: 150, h: 110 });
d.table(z, { x: 500, y: 720, w: 150, h: 110 });
z.text({ x: 380, y: 720, text: '+', size: 60 });
z.text({ x: 380, y: 850, text: 'orders + customers', size: 36 });
s.say('Next, learn aggregations, which add things up, such as total sales for each month.');
card(z, { x: 700, y: 520, w: 520, h: 400 });
z.text({ x: 960, y: 580, text: 'Aggregations', size: 52, stroke: C.amber });
[90, 140, 70, 170].forEach((h, i) =>
  z.rect({ x: 830 + i * 70, y: 790 - h, w: 46, h, fill: C.gold, fillStyle: 'hachure', stroke: C.ink, sw: 2, dur: 0.2, gap: 0 }));
z.line({ pts: [[810, 792], [1110, 792]], sw: 2, dur: 0.2 });
z.text({ x: 960, y: 850, text: 'total sales for each month', size: 36 });
s.say("Then learn window functions, which compare a row with the rows next to it, such as today's sales against yesterday's.");
card(z, { x: 1280, y: 520, w: 520, h: 400 });
z.text({ x: 1540, y: 580, text: 'Window functions', size: 52, stroke: C.amber });
['Mon', 'Tue', 'Wed'].forEach((day, i) => {
  z.rect({ x: 1340 + i * 140, y: 680, w: 120, h: 80, sw: 2, fill: i === 2 ? C.soft : C.paper, fillStyle: 'solid', dur: 0.2, gap: 0 });
  z.text({ x: 1400 + i * 140, y: 720, text: day, size: 36, dur: 0.15, gap: 0.05 });
});
z.arrow({ pts: [[1680, 770], [1610, 810], [1540, 770]], stroke: C.amber, sw: 3, curve: true, dur: 0.4 });
z.text({ x: 1540, y: 850, text: "today vs yesterday", size: 36 });
s.say('SQL is tested in almost every data engineering interview.');
z.text({ x: 960, y: 1010, text: 'Tested in almost every data engineering interview', size: 46, stroke: C.red });

// Zone 2: Python
z = shift(s, Z(1).x, Z(1).y);
s.say('Python is the other half of phase one.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Python' });
z.text({ x: 960, y: 130, text: '1 · Python', size: 92 });
d.laptop(z, { x: 400, y: 400, size: 380 });
s.say('If SQL asks the questions, Python does the chores.');
z.text({ x: 400, y: 600, text: 'SQL asks · Python does the chores', size: 36, stroke: C.amber });
s.say('It moves files and cleans messy data.');
s.say('Learn the basics first: variables, loops, functions and error handling.');
z.text({ x: 1240, y: 290, text: 'The basics first', size: 52, stroke: C.amber });
['variables', 'loops', 'functions', 'error handling'].forEach((w, i) => {
  z.rect({ x: 820 + (i % 2) * 430, y: 350 + Math.floor(i / 2) * 110, w: 390, h: 86, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.25, gap: 0 });
  z.text({ x: 1015 + (i % 2) * 430, y: 393 + Math.floor(i / 2) * 110, text: w, size: 44, dur: 0.3, gap: 0.05 });
});
s.say('Then learn to read files and to call an API.');
s.say('An API is how one program asks another program for data, like a weather app asking a weather service for today\'s forecast.');
z.text({ x: 960, y: 690, text: 'Read files  ·  call an API', size: 52, stroke: C.amber });
card(z, { x: 300, y: 770, w: 400, h: 150 });
z.text({ x: 500, y: 845, text: 'weather app', size: 44 });
card(z, { x: 1220, y: 770, w: 400, h: 150 });
z.text({ x: 1420, y: 845, text: 'weather service', size: 44 });
z.arrow({ pts: [[710, 815], [1210, 815]], stroke: C.ink, sw: 3, dur: 0.5 });
z.text({ x: 960, y: 785, text: "today's forecast?", size: 36, stroke: C.grey, dur: 0.4 });
z.arrow({ pts: [[1210, 880], [710, 880]], stroke: C.amber, sw: 3, dur: 0.5 });
s.say('A library called pandas, or a newer one called Polars, helps you clean tables.');
z.text({ x: 960, y: 1010, text: 'pandas or Polars: clean tables', size: 46 });

// Zone 3: data modeling
z = shift(s, Z(2).x, Z(2).y);
s.say('Phase two is data modeling, which means deciding how to store data so people get answers fast.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Data modeling' });
z.text({ x: 960, y: 130, text: '2 · Data modeling', size: 92 });
z.text({ x: 960, y: 215, text: 'store data so people get answers fast', size: 46, stroke: C.amber });
s.say('Think of a kitchen.');
s.say('When every pan has its own place, you cook fast.');
s.say('The most common data model is the star schema.');
z.text({ x: 640, y: 320, text: 'Star schema', size: 56, stroke: C.amber });
s.say('One fact table sits in the middle and holds events, like every order.');
z.rect({ x: 480, y: 560, w: 320, h: 150, round: true, sw: 4, fill: C.gold, fillStyle: 'solid', dur: 0.5 });
z.text({ x: 640, y: 635, text: 'Orders\nfact table', size: 44, dur: 0.5 });
s.say('Dimension tables sit around it and describe those events, like the customer, the product and the date.');
// Each line runs from the edge of the fact table to the edge of a dimension table.
[['Customer', 230, 430, [490, 560], [340, 485]], ['Product', 1050, 430, [790, 560], [940, 485]],
  ['Date', 640, 900, [640, 710], [640, 845]]].forEach(([name, cx, cy, from, to]) => {
  z.line({ pts: [from, to], stroke: C.grey, sw: 2, dur: 0.3, gap: 0 });
  z.rect({ x: cx - 130, y: cy - 55, w: 260, h: 110, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.35, gap: 0 });
  z.text({ x: cx, y: cy, text: name, size: 44, dur: 0.3, gap: 0.1 });
});
s.say('Practice on a cloud data warehouse, which is a database built for analysis, such as Snowflake, BigQuery or Databricks.');
d.db(z, { x: 1540, y: 420, size: 130 });
z.text({ x: 1540, y: 560, text: 'cloud data warehouse', size: 44, stroke: C.amber });
z.text({ x: 1540, y: 630, text: 'Snowflake · BigQuery · Databricks', size: 36 });
s.say('Then learn dbt, a tool that turns your SQL into tested, reusable steps.');
z.rect({ x: 1260, y: 780, w: 560, h: 150, round: true, sw: 3, fill: C.paper, fillStyle: 'solid', dur: 0.4 });
z.text({ x: 1540, y: 855, text: 'dbt: SQL into tested,\nreusable steps', size: 40 });

// Zone 4: pipelines
z = shift(s, Z(3).x, Z(3).y);
s.say('Phase three is the data pipeline.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Pipelines' });
z.text({ x: 960, y: 130, text: '3 · Data pipelines', size: 92 });
s.say('A pipeline works like the water pipes in a city.');
// The flow is drawn while Chris describes the water, then labelled for data.
s.say('Water starts at a lake, gets cleaned at a plant, and comes out of your tap.');
d.db(z, { x: 300, y: 470, size: 120 });
z.arrow({ pts: [[380, 470], [760, 470]], stroke: C.ink, sw: 3, dur: 0.4 });
z.rect({ x: 770, y: 400, w: 380, h: 140, round: true, sw: 3, fill: C.soft, fillStyle: 'solid', dur: 0.4 });
z.text({ x: 960, y: 470, text: 'clean', size: 50 });
z.arrow({ pts: [[1160, 470], [1540, 470]], stroke: C.ink, sw: 3, dur: 0.4 });
d.db(z, { x: 1620, y: 470, size: 120 });
s.say('Data works the same way.');
s.say('It starts where it is created, gets cleaned on the way, and lands where people use it.');
z.text({ x: 300, y: 600, text: 'where it is created', size: 38 });
z.text({ x: 1620, y: 600, text: 'where people use it', size: 38, gap: 1.5 });
s.say('Most pipelines run on a schedule, like every night at two in the morning.');
d.clock(z, { x: 300, y: 790, size: 120 });
z.text({ x: 300, y: 905, text: 'every night at 2 AM', size: 36 });
s.say('An orchestrator, such as Airflow or Dagster, is the manager of the pipeline.');
z.rect({ x: 560, y: 250, w: 800, h: 100, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3 });
z.text({ x: 960, y: 305, text: 'orchestrator: Airflow · Dagster', size: 38, dur: 0.6 });
s.say('It starts each step in the right order, and it tries again when a step fails.');
z.arrow({ pts: [[1110, 545], [1180, 620], [1060, 650], [960, 552]], stroke: C.amber, sw: 3, curve: true, dur: 0.6 });
z.text({ x: 1200, y: 665, text: 'tries again', size: 36, stroke: C.amber, align: 'left' });
s.say('Add data quality tests, like a check that no order has a negative price.');
d.check(z, { x: 560, y: 790, size: 60 });
z.text({ x: 610, y: 790, text: 'test: no negative prices', size: 40, align: 'left' });
s.say('When the data gets too big for one computer, learn Apache Spark.');
z.rect({ x: 1200, y: 740, w: 620, h: 100, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3 });
z.text({ x: 1510, y: 790, text: 'Spark: too big for one computer', size: 38 });
s.say('Later, learn Apache Kafka for events that arrive every second, like card payments.');
z.rect({ x: 1200, y: 870, w: 620, h: 100, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3 });
z.text({ x: 1510, y: 920, text: 'Kafka (later): every second', size: 38 });

// Zone 5: cloud
z = shift(s, Z(4).x, Z(4).y);
s.say('Phase four is the cloud, which just means renting computers from a company instead of buying your own.');
z.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Cloud' });
z.text({ x: 960, y: 130, text: '4 · Cloud', size: 92 });
z.text({ x: 960, y: 215, text: 'renting computers instead of buying your own', size: 44, stroke: C.amber });
d.cloud(z, { x: 560, y: 460, size: 620 });
s.say('Pick one provider, Amazon Web Services, Microsoft Azure or Google Cloud, and learn three parts: storage, where your files live; compute, the machines that run your code; and permissions, which decide who can see what.');
z.text({ x: 560, y: 460, text: 'pick one:\nAWS · Azure\nGoogle Cloud', size: 46 });
['storage: where files live', 'compute: runs your code', 'permissions: who sees what'].forEach((w, i) => {
  z.rect({ x: 1060, y: 300 + i * 120, w: 640, h: 90, round: true, sw: 2, fill: C.paper, fillStyle: 'solid', dur: 0.3, gap: 0 });
  z.text({ x: 1380, y: 345 + i * 120, text: w, size: 40, dur: 0.6, gap: 1.2 });
});
s.say('Also learn Git, which saves every change in your code, like the version history in a Google Doc.');
z.rect({ x: 300, y: 780, w: 600, h: 130, round: true, sw: 3, fill: C.soft, fillStyle: 'solid', dur: 0.4 });
z.text({ x: 600, y: 845, text: 'Git: saves every change', size: 42 });
s.say('Then learn Docker, which packs your program in a box so it runs the same on every computer.');
z.rect({ x: 1020, y: 780, w: 600, h: 130, round: true, sw: 3, fill: C.soft, fillStyle: 'solid', dur: 0.4 });
z.text({ x: 1320, y: 845, text: 'Docker: runs the same\non every computer', size: 42 });

// Back to the overview, AI next
s.settle();
s.wait(0.5);
s.frame({ x: 0, y: 0, w: 1920, h: 1080, name: 'Five phases again' });
s.ellipse({ x: 1495, y: 430, w: 390, h: 270, stroke: C.red, sw: 4, rough: 2, dur: 0.7 });
s.end();

module.exports = s;
