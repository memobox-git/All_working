// Writes a silent stand-in voiceover for an episode whose script is not
// recorded yet: <episode>/audio/vo.mp3 (silence) and vo.transcript.json, with
// estimated word timings in the ElevenLabs transcript format. The scenes can
// then be built and previewed with the usual build.sh before the voice
// exists. Recording the real take overwrites both files.
// The words are read from the script's quoted paragraphs ("> …" lines; the
// "*(…)*" stage notes are skipped). Timing: each word takes a base time plus
// a little per letter, with pauses at commas and full stops, fitted to the
// real Kafka take.
// Usage: node make-placeholder-vo.js <episode-dir> <script.md>
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const [dir, script] = process.argv.slice(2).map(p => path.resolve(p));
const md = fs.readFileSync(script, 'utf8').split('## Script')[1].split(/\n## /)[0];
const paras = md.split('\n').filter(l => l.startsWith('> ') && !l.startsWith('> *(')).map(l => l.slice(2).trim()).filter(Boolean);

const r3 = x => Math.round(x * 1000) / 1000;
const SPOKEN = { '2020': 'twenty twenty' };       // say numbers as words, for their length
const words = [];
let t = 0;
paras.forEach(p => {
  for (const w of p.split(/\s+/)) {
    if (/^\[[a-z]+\]$/.test(w)) { words.push({ text: w, type: 'word', start: r3(t), end: r3(t + .05) }); t += .06; continue; }
    const say = SPOKEN[w.replace(/[^\w]/g, '')] ?? w;
    // start to next start, fitted to the Kafka take: .114 s + .038 s a letter, + .17 s after a comma, + .42 s after a full stop
    const step = .114 + .0383 * say.replace(/[^a-z]/gi, '').length + (/[.?!]["”]?$/.test(w) ? .422 : /[,;:]["”]?$/.test(w) ? .173 : 0);
    words.push({ text: w, type: 'word', start: r3(t), end: r3(t + step * .85) });
    t += step;
  }
  t += .15;
});
const end = words[words.length - 1].end;

fs.mkdirSync(path.join(dir, 'audio'), { recursive: true });
fs.writeFileSync(path.join(dir, 'audio', 'vo.transcript.json'), JSON.stringify({
  placeholder: true, note: 'Estimated timings for a silent preview. Replace with the recorded take and its eleven_scribe_v1 transcript.',
  word_count: words.filter(w => !w.text.startsWith('[')).length, spoken_duration_secs: end, words,
}, null, 1));
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(end + .5),
  '-c:a', 'libmp3lame', '-b:a', '64k', path.join(dir, 'audio', 'vo.mp3')], { stdio: 'inherit' });
if (ff.status) process.exit(ff.status);
console.log(`wrote a silent stand-in: ${words.length} words, ${end.toFixed(1)}s`);
