// Builds the soundtrack from <episode>/timeline.json (make-cues.js): the
// voiceover (<episode>/audio/vo.mp3, split around the channel intro when the
// intro plays mid-voice), the comment ask (../explained/audio/cta.wav), and
// the beat from make-music.py, which dips under the voice. It is normalised
// to YouTube loudness (-14 LUFS), then the channel intro's own sound (already
// at -14 LUFS) goes in where the intro plays.
// Usage: node mix.js <episode-dir> <video.cues.json> <music.wav> <out.wav>
// MUSIC=0 node mix.js ... gives a soundtrack without the beat.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [dir, cuesFile, music, out] = process.argv.slice(2);
const { duration } = JSON.parse(fs.readFileSync(cuesFile, 'utf8'));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));

// music level: the beat sits about 10 dB under the voice once the mix is normalised
const MUSIC = Number(process.env.MUSIC ?? .21);
const ff = args => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status) throw new Error('ffmpeg failed:\n' + r.stderr.split('\n').slice(-8).join('\n'));
};
const fmt = 'aformat=sample_rates=48000:channel_layouts=stereo';
const D = duration.toFixed(3);
const ms = s => Math.round(s * 1000);
const voice = 'highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120:makeup=1.4';

// the voice pieces: [input, trim start, trim end, where it goes]
const inputs = ['-i', path.join(dir, 'audio', 'vo.mp3'), '-i', music];
const pieces = [];
const ins = T.insert;
if (ins && ins.cut != null) {
  const resume = ins.resumeAt ?? ins.cut;     // a stretch between the two can be left out ("resume" in episode.json)
  pieces.push([0, 0, ins.cut, T.offset], [0, resume, null, T.offset + resume + ins.shift]);
} else pieces.push([0, 0, null, T.offset]);
if (T.cta) {
  inputs.push('-i', path.join(__dirname, 'audio', 'cta.wav'));
  pieces.push([2, 0, null, T.cta.start]);
}
const graph = pieces.map(([i, a, b, at], k) =>
  `[${i}:a]${fmt},atrim=start=${a}${b != null ? ':end=' + b : ''},asetpts=PTS-STARTPTS,${voice},adelay=${ms(at)}:all=1,apad=whole_dur=${D}[v${k}]`);
graph.push(`${pieces.map((_, k) => `[v${k}]`).join('')}amix=inputs=${pieces.length}:normalize=0:dropout_transition=0,asplit=2[vo][key]`);
graph.push(`[1:a]${fmt},atrim=0:${D},volume=${MUSIC}[bedraw]`);
graph.push(`[bedraw][key]sidechaincompress=threshold=0.04:ratio=2.5:attack=80:release=900[bed]`);
graph.push(`[vo][bed]amix=inputs=2:normalize=0:dropout_transition=0,atrim=0:${D},alimiter=limit=0.9:level=0[mix]`);
const raw = out.replace(/\.wav$/, '') + '.raw.wav';
ff([...inputs, '-filter_complex', graph.join(';'), '-map', '[mix]', '-c:a', 'pcm_s24le', raw]);

// two-pass loudness normalisation
const probe = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
const m = JSON.parse(probe.stderr.match(/\{[\s\S]*\}/)[0]);
const norm = ins ? out.replace(/\.wav$/, '') + '.norm.wav' : out;
ff(['-i', raw, '-af', `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`, '-ar', '48000', '-c:a', 'pcm_s24le', norm]);
fs.rmSync(raw);

// the channel intro's own voice and sound, where it plays
if (ins) {
  ff(['-i', norm, '-i', path.resolve(dir, ins.landscape), '-filter_complex',
    `[1:a]${fmt},adelay=${ms(ins.start)}:all=1,apad=whole_dur=${D}[intro];[0:a][intro]amix=inputs=2:normalize=0:dropout_transition=0,atrim=0:${D},alimiter=limit=0.89:level=0[mix]`,
    '-map', '[mix]', '-ar', '48000', '-c:a', 'pcm_s24le', out]);
  fs.rmSync(norm);
}
console.log(`wrote ${out}: input ${m.input_i} LUFS -> -14 LUFS` + (ins ? `, intro at ${ins.start}s` : ''));
