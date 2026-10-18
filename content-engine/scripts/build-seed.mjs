// Builds the seed documents for the Content Engine page's database.
//
//   node content-engine/scripts/build-seed.mjs <out-dir>
//
// Writes <out-dir>/ideas/<id>.json, <out-dir>/slots/<id>.json and
// <out-dir>/meta/settings.json (one file per document, ready for
// ArtifactData batch writes), then prints the tier spread and the calendar.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const E = require(join(here, '..', 'engine.js'));

const out = process.argv[2];
if (!out) { console.error('usage: build-seed.mjs <out-dir>'); process.exit(1); }

const NOW = new Date('2026-10-18T12:00:00-07:00');
const nowIso = NOW.toISOString();
const seed = JSON.parse(readFileSync(join(here, '..', 'data', 'ideas.json'), 'utf8')).ideas;

const ideas = seed.map((s) => {
  const [fit, edge, urgency, demand, business] = s.scores;
  const doc = {
    title: s.title,
    angle: s.angle,
    pillar: s.pillar,
    icp: s.icp,
    kind: 'evergreen',
    scores: { fit, edge, urgency, demand, business },
    depth: s.depth,
    actionable: !!s.actionable,
    effort: s.effort,
    proof: s.proof || '',
    note: s.note || '',
    plan: s.plan || '',
    status: s.status || 'idea',
    source: { type: 'seed' },
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  const ev = E.evaluate(doc, NOW.getTime());
  doc.score = ev.score;
  doc.tier = ev.tier;
  return { id: s.id, doc, ev };
});
const byId = Object.fromEntries(ideas.map((i) => [i.id, i]));

// ---- the first four weeks (publish dates), from content-plan.md section 4 ----
const WEEKS = ['2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09'];
const LONG = [
  ['s001', 's002', 's062'],
  ['s052', 's025', 's063'],
  ['s026', 's004', 's064'],
  ['s031', 's005', 's071'],
];
// Week 1 Shorts are already scripted in stackle-video/shorts/week-01.md.
const WEEK1_SHORTS = ['s073', 's029', 's007', 's019', 's011', 's014', 's044'];
const WEEK1_NOTE = { s073: 'week-01 S01 + S02', s029: 'week-01 S04', s007: 'week-01 S09', s019: 'week-01 S13', s011: 'week-01 S11' };

const slots = [];
const used = new Set(LONG.flat());
const put = (date, channel, n, ideaId, note) => {
  slots.push({ id: E.slotId(date, channel, n), doc: { date, channel, n, ideaId, note: note || '', locked: false, by: 'seed', at: nowIso } });
  used.add(ideaId);
};

const hasChannel = (i, c) => i.ev.channels.some((x) => x.c === c);
const rank = (list) => list.sort((a, b) => b.ev.score - a.ev.score);

const shortPool = rank(ideas.filter((i) => i.doc.depth <= 2 && hasChannel(i, 'short') && !LONG.flat().includes(i.id)));
const linkedinPool = rank(ideas.filter((i) => i.doc.depth <= 2 && hasChannel(i, 'linkedin')));
const TUESDAY_ICP = ['switch', 'solo', 'da', 'solo'];

WEEKS.forEach((wk, w) => {
  const mon = E.parseYmd(wk);
  const day = (k) => E.ymd(E.addDays(mon, k));
  // Long videos Mon/Wed/Fri, each with its launch post on LinkedIn and an X thread.
  [0, 2, 4].forEach((k, j) => {
    const id = LONG[w][j];
    put(day(k), 'long', 1, id);
    put(day(k), 'linkedin', 1, id, 'Launch-day post for the video');
    put(day(k), 'x', 1, id, 'Thread version of the video');
  });
  // Tuesday LinkedIn: a standalone post, rotating the audience.
  const want = TUESDAY_ICP[w];
  const tue = linkedinPool.find((i) => !used.has(i.id) && i.doc.icp.includes(want)) || linkedinPool.find((i) => !used.has(i.id));
  if (tue) put(day(1), 'linkedin', 1, tue.id);
  // WhatsApp Tuesday: Monday's video drop.
  put(day(1), 'whatsapp', 1, LONG[w][0], 'New video drop + one tip from it');
  // Thursday email: the weekly roundup.
  put(day(3), 'email', 1, 's090', 'Weekly roundup: radar picks + this week’s videos');
  // One standalone Short a day; the second daily Short is a cut from the latest long video.
  let lastPillar = null;
  for (let k = 0; k < 7; k++) {
    let pick;
    if (w === 0) pick = byId[WEEK1_SHORTS[k]];
    else pick = shortPool.find((i) => !used.has(i.id) && i.doc.pillar !== lastPillar) || shortPool.find((i) => !used.has(i.id));
    if (!pick) break;
    lastPillar = pick.doc.pillar;
    put(day(k), 'short', 1, pick.id, WEEK1_NOTE[pick.id] ? 'Scripted: ' + WEEK1_NOTE[pick.id] : '');
  }
});

slots.forEach((s) => {
  const i = byId[s.doc.ideaId];
  if (i && i.doc.status === 'idea') i.doc.status = 'scheduled';
});

// ---- write ----
const write = (rel, data) => {
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2));
};
ideas.forEach((i) => write(`ideas/${i.id}.json`, i.doc));
slots.forEach((s) => write(`slots/${s.id}.json`, s.doc));
write('meta/settings.json', { ...E.DEFAULT_SETTINGS, timezone: 'America/Los_Angeles', updatedAt: nowIso });

// ---- report ----
const spread = {};
ideas.forEach((i) => { spread[i.ev.tier] = (spread[i.ev.tier] || 0) + 1; });
console.log('ideas', ideas.length, 'slots', slots.length);
console.log('tiers', spread);
const hist = {};
ideas.forEach((i) => { const b = Math.floor(i.ev.score / 5) * 5; hist[b] = (hist[b] || 0) + 1; });
console.log('score histogram', hist);
console.log('top 10');
rank([...ideas]).slice(0, 10).forEach((i) => console.log(' ', i.ev.score, i.ev.tier, i.id, i.doc.title));
console.log('calendar');
slots.sort((a, b) => a.id.localeCompare(b.id)).forEach((s) => console.log(' ', s.id, byId[s.doc.ideaId].doc.title.slice(0, 70)));
