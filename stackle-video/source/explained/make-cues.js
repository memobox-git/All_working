// Lays out an episode's timeline from its episode.json and the ElevenLabs
// transcript of the voiceover (<episode>/audio/vo.transcript.json), so the
// graphics land on the spoken words. Writes:
//   <episode>/cues.js        window.VO for the page (word times relative to the voice start)
//   <episode>/timeline.json  the same in absolute seconds, for make-music.py, mix.js and make-srt.js
//
// The running order:
//   0:00            the opening card (the thumbnail), `card` seconds (default: `offset`)
//   then            the channel intro video ("intro"), if there is one: straight after the card,
//                   or, with "intro": {"after": [word, n]}, after that spoken word; the voice
//                   pauses for it and picks up again afterwards (at "resume": [word, n] if
//                   given, leaving out the words in between)
//   then            the voiceover
//   then            the comment ask ("cta": true), the shared line in ../explained/audio/cta.wav,
//                   a moment after the voice ends
// Usage: node make-cues.js <episode-dir>
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const dir = path.resolve(process.argv[2]);
const ep = JSON.parse(fs.readFileSync(path.join(dir, 'episode.json'), 'utf8'));
const tr = JSON.parse(fs.readFileSync(path.join(dir, 'audio', 'vo.transcript.json'), 'utf8'));
const r3 = x => Math.round(x * 1000) / 1000;
const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const probe = f => Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout);

// the middle of the longest quiet stretch (10 ms windows under -55 dB) of the voice file between t0 and t1
function quietCut(t0, t1) {
  t0 = Math.max(0, t0);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(t0), '-t', String(t1 - t0), '-i', path.join(dir, 'audio', 'vo.mp3'),
    '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], { maxBuffer: 1 << 26 });
  const n = r.stdout.length >> 1, hop = 160;
  let best = [0, 0], run = 0;
  for (let k = 0; k * hop < n; k++) {
    let e = 0;
    for (let j = k * hop; j < Math.min(n, (k + 1) * hop); j++) e += (r.stdout.readInt16LE(j * 2) / 32768) ** 2;
    if (10 * Math.log10(e / hop + 1e-12) < -55) { if (++run > best[1]) best = [k - run + 1, run]; } else run = 0;
  }
  return best[1] ? r3(t0 + (best[0] + best[1] / 2) * .01) : null;
}

const card = Number(ep.card ?? ep.offset);
let offset = Number(ep.offset);
let words = tr.words.filter(w => w.type === 'word').map(w => ({ w: w.text, s: w.start, e: w.end }));
const GAP_IN = .3, GAP_OUT = .35;               // breathing room either side of the intro

let insert = null;
if (ep.intro) {
  const duration = r3(probe(path.resolve(dir, ep.intro.landscape)));
  const it = JSON.parse(fs.readFileSync(path.resolve(dir, ep.intro.transcript), 'utf8'));
  insert = { duration, landscape: ep.intro.landscape, vertical: ep.intro.vertical, cut: null, shift: 0 };
  if (!ep.intro.after) {
    insert.start = card;
    offset = r3(card + duration + GAP_OUT);
  } else {
    // pause the voice after the n-th time it says `word`, and play the intro there
    const find = ([word, n], from = 0) => {
      let k = 0;
      for (let j = from; j < words.length; j++) if (!words[j].w.startsWith('[') && norm(words[j].w) === norm(word) && k++ === n) return j;
      throw Error('no cue for the intro: ' + word + ' #' + n);
    };
    // with "resume": [word, n], the voice picks up again at that word, and the words in between are left out
    const i = find(ep.intro.after), r = ep.intro.resume ? find(ep.intro.resume, i + 1) : i + 1;
    const a = words[i], b = words[r];
    insert.start = r3(offset + a.e + GAP_IN);
    insert.shift = r3(insert.start + duration + GAP_OUT - (offset + b.s));
    // where the voice file is cut: in the quiet between words (the transcript's word edges are
    // approximate, and a word's sound can start a little before its transcribed start)
    insert.cut = quietCut(a.e - .3, words[i + 1].s + .05) ?? r3(a.e + .02);       // the end of the first part
    insert.resumeAt = ep.intro.resume ? quietCut(words[r - 1].e - .3, b.s + .05) ?? r3(words[r - 1].e + .05) : insert.cut;   // and the start of the rest
    words = words.filter((w, j) => j <= i || j >= r).map((w, j) => j > i ? { ...w, s: r3(w.s + insert.shift), e: r3(w.e + insert.shift) } : w);
  }
  // the intro's own words, for the .srt (its voice starts `voiceOffset` seconds into the video)
  insert.words = it.words.filter(w => w.type === 'word' && !w.text.startsWith('['))
    .map(w => ({ w: w.text, s: r3(insert.start + ep.intro.voiceOffset + w.start), e: r3(insert.start + ep.intro.voiceOffset + w.end) }));
}

const duration = words[words.length - 1].e;     // the voiceover, from its first word to its last
let cta = null, end = r3(offset + duration + 2.6);
if (ep.cta) {
  const ct = JSON.parse(fs.readFileSync(path.join(__dirname, 'audio', 'cta.transcript.json'), 'utf8')).words;
  const start = r3(offset + duration + 2.4);    // after "That's …" and a beat on the closing title
  const len = r3(probe(path.join(__dirname, 'audio', 'cta.wav')));
  cta = { start, duration: len, i0: words.filter(w => !w.w.startsWith('[')).length };
  words = words.concat(ct.filter(w => !w.text.startsWith('[')).map(w => ({ w: w.text, s: r3(start - offset + w.start), e: r3(start - offset + w.end) })));
  end = r3(start + len + 1.8);
}

const VO = { offset, duration, card, end, words, insert: insert && { start: insert.start, duration: insert.duration }, cta };
fs.writeFileSync(path.join(dir, 'cues.js'), `// Voiceover word timings (ElevenLabs alignment) and the episode's running order. Generated by make-cues.js; do not edit by hand.
window.VO = ${JSON.stringify(VO)};
`);
fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify({
  offset, card, end, voiceEnd: r3(offset + duration),
  words: words.map(w => ({ ...w, s: r3(w.s + offset), e: r3(w.e + offset) })),
  insert, cta,
}, null, 1));
console.log(`wrote cues.js and timeline.json: ${words.length} words, voice ${offset}s → ${r3(offset + duration)}s, ` +
  (insert ? `intro at ${insert.start}s (${insert.duration}s), ` : '') + (cta ? `comment ask at ${cta.start}s, ` : '') + `end ${end}s`);
