// Prints the time (seconds of video) where the channel intro is cut in:
// just before the voiceover says "Number one".
const fs = require('fs');
const path = require('path');
const window = {};
eval(fs.readFileSync(path.join(__dirname, 'cues.js'), 'utf8'));
const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const w = window.VO.words.filter(x => !x.w.startsWith('[') && norm(x.w));
const i = w.findIndex((x, k) => norm(x.w) === 'number' && w[k + 1] && norm(w[k + 1].w) === 'one');
if (i < 0) throw Error('no "number one" in cues.js');
console.log((w[i].s + window.VO.offset - .02).toFixed(3));
