// Writes an .srt caption file from the voiceover word timings, to upload with
// the landscape video (YouTube indexes real captions; the vertical cut has its
// captions burned in instead). Each sentence becomes one caption, split in two
// until every caption fits in 42 characters: at the comma or dash nearest the
// middle when there is one, never right after a small word like "a" or "the".
// Usage: node make-srt.js <transcript.json> <out.srt> [offset-seconds]
const fs = require('fs');

const [src, out, offArg] = process.argv.slice(2);
const OFF = Number(offArg || 1);
const MAX = 42;
const words = JSON.parse(fs.readFileSync(src, 'utf8')).words.filter(w => w.type === 'word' && !w.text.startsWith('['));
const text = ws => ws.map(w => w.text).join(' ');
const SMALL = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'at', 'on', 'and', 'or', 'for', 'is', 'it', 'its', 'their', 'your', 'each', 'with']);

// sentences, also cut at long pauses
const sentences = [];
let cur = [];
words.forEach((w, i) => {
  cur.push(w);
  const next = words[i + 1];
  if (!next || /[.?!]["”]?$/.test(w.text) || next.start - w.end > .6) { sentences.push(cur); cur = []; }
});

function split(ws) {
  if (text(ws).length <= MAX || ws.length < 2) return [ws];
  let best = 1, bestScore = Infinity;
  for (let i = 1; i < ws.length; i++) {
    const left = ws.slice(0, i), right = ws.slice(i), last = left[left.length - 1].text;
    let score = Math.abs(text(left).length - text(right).length);
    if (/[,;:]["”]?$/.test(last) || last === '—' || right[0].text === '—') score -= 20;
    if (SMALL.has(last.toLowerCase())) score += 25;
    if (score < bestScore) { bestScore = score; best = i; }
  }
  return [...split(ws.slice(0, best)), ...split(ws.slice(best))];
}
const cues = sentences.flatMap(split).map(ws => ({ start: ws[0].start, end: ws[ws.length - 1].end, text: text(ws) }));

const ts = s => {
  const ms = Math.round(s * 1000), p = (n, k = 2) => String(n).padStart(k, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const srt = cues.map((c, i) => {
  const next = cues[i + 1];
  const end = Math.min(c.end + .4, next ? next.start - .02 : Infinity);
  return `${i + 1}\n${ts(c.start + OFF)} --> ${ts(end + OFF)}\n${c.text}\n`;
}).join('\n');
fs.writeFileSync(out, srt);
console.log(`wrote ${out}: ${cues.length} captions`);
