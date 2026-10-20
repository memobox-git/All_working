// Builds the soundtrack: the voiceover over the beat from make-music.py,
// which dips under the voice, normalised to YouTube loudness (-14 LUFS).
// Usage: node mix.js <video.cues.json> <music.wav> <out.wav>
// MUSIC=0 node mix.js ... gives a voice-only soundtrack.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [cuesFile, music, out] = process.argv.slice(2);
const { duration, offset } = JSON.parse(fs.readFileSync(cuesFile, 'utf8'));

// music level: the beat sits about 10 dB under the voice once the mix is normalised
const MUSIC = Number(process.env.MUSIC ?? .21);
const ff = args => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status) throw new Error('ffmpeg failed:\n' + r.stderr.split('\n').slice(-8).join('\n'));
};
const fmt = 'aformat=sample_rates=48000:channel_layouts=stereo';
const D = duration.toFixed(3);

const graph = [
  `[0:a]${fmt},highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120:makeup=1.4,adelay=${Math.round(offset * 1000)}:all=1,apad=whole_dur=${D},asplit=2[vo][key]`,
  `[1:a]${fmt},atrim=0:${D},volume=${MUSIC}[bedraw]`,
  `[bedraw][key]sidechaincompress=threshold=0.04:ratio=2.5:attack=80:release=900[bed]`,
  `[vo][bed]amix=inputs=2:normalize=0:dropout_transition=0,atrim=0:${D},alimiter=limit=0.9:level=0[mix]`,
];
const raw = out.replace(/\.wav$/, '') + '.raw.wav';
ff(['-i', path.join(__dirname, 'audio', 'vo.mp3'), '-i', music, '-filter_complex', graph.join(';'), '-map', '[mix]', '-c:a', 'pcm_s24le', raw]);

// two-pass loudness normalisation
const probe = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
const m = JSON.parse(probe.stderr.match(/\{[\s\S]*\}/)[0]);
ff(['-i', raw, '-af', `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`, '-ar', '48000', '-c:a', 'pcm_s24le', out]);
fs.rmSync(raw);
console.log(`wrote ${out}: input ${m.input_i} LUFS -> -14 LUFS`);
