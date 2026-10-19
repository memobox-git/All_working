// Builds the soundtrack: the voiceover plus the sound design cued by the scene
// (window.SFX, saved by render-pro.js as <video>.cues.json), ducks the bed under
// the voice and normalises to YouTube loudness (-14 LUFS). Sound effects are
// shared with the channel intro (../intro-pro/audio/sfx).
// Usage: node mix.js <video.cues.json> <out.wav>
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VO = path.join(__dirname, 'audio', 'vo.mp3');
const SFX = path.join(__dirname, '..', 'intro-pro', 'audio', 'sfx');
const [cuesFile, out] = process.argv.slice(2);
const { duration, offset, sfx } = JSON.parse(fs.readFileSync(cuesFile, 'utf8'));

// level of each kind of sound before the per-cue gain; quieter than the intro,
// because this runs for minutes, not seconds
const LEVEL = { impact: .3, whoosh: .28, blips: .4, riser: .4, bed: .14 };
// seconds into the file where the hit lands, so the hit sits on the cue
const LEAD = { impact_2: .5, riser: 1.62 };
const ff = args => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status) throw new Error('ffmpeg failed:\n' + r.stderr.split('\n').slice(-8).join('\n'));
};
const fmt = 'aformat=sample_rates=48000:channel_layouts=stereo';
const D = duration.toFixed(3);

const inputs = ['-i', VO, '-stream_loop', '-1', '-i', path.join(SFX, 'bed.mp3')];
const graph = [
  `[0:a]${fmt},highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=1.6,adelay=${Math.round(offset * 1000)}:all=1,apad=whole_dur=${D},asplit=2[vo][key]`,
  `[1:a]${fmt},atrim=0:${D},volume=${LEVEL.bed},afade=t=in:d=1.2,afade=t=out:st=${(duration - 2.5).toFixed(3)}:d=2.5[bedraw]`,
  `[bedraw][key]sidechaincompress=threshold=0.015:ratio=4:attack=40:release=600[bed]`,
];
const labels = ['[vo]', '[bed]'];
sfx.filter(c => c.file !== 'bed').forEach((c, i) => {
  const kind = c.file.replace(/_\d+$/, '');
  const lead = LEAD[c.file] || 0, start = Math.max(0, lead - c.t), delay = Math.max(0, c.t - lead);
  inputs.push('-i', path.join(SFX, c.file + '.mp3'));
  graph.push(`[${i + 2}:a]${fmt},atrim=start=${start.toFixed(3)},asetpts=PTS-STARTPTS,volume=${(LEVEL[kind] * c.gain).toFixed(3)},adelay=${Math.round(delay * 1000)}:all=1[s${i}]`);
  labels.push(`[s${i}]`);
});
graph.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,atrim=0:${D},afade=t=out:st=${(duration - .4).toFixed(3)}:d=0.4,alimiter=limit=0.9:level=0[mix]`);

const raw = out.replace(/\.wav$/, '') + '.raw.wav';
const script = out.replace(/\.wav$/, '') + '.graph.txt';
fs.writeFileSync(script, graph.join(';\n'));
ff([...inputs, '-filter_complex_script', script, '-map', '[mix]', '-c:a', 'pcm_s24le', raw]);
fs.rmSync(script);

// two-pass loudness normalisation
const probe = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
const m = JSON.parse(probe.stderr.match(/\{[\s\S]*\}/)[0]);
ff(['-i', raw, '-af', `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`, '-ar', '48000', '-c:a', 'pcm_s24le', out]);
fs.rmSync(raw);
console.log(`wrote ${out}: ${sfx.length} cues, input ${m.input_i} LUFS -> -14 LUFS`);
