import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';

export const run = (cmd, args, opts = {}) => {
	// npm/npx are .cmd shims on Windows and need a shell there.
	const shell = process.platform === 'win32' && ['npm', 'npx'].includes(cmd);
	const r = spawnSync(cmd, args, {stdio: opts.quiet ? 'pipe' : 'inherit', encoding: 'utf8', shell, ...opts});
	if (r.error) throw r.error;
	if (r.status !== 0) {
		throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})\n${r.stderr ?? ''}`.trim());
	}
	return r.stdout ?? '';
};

export const has = (cmd) => spawnSync(cmd, ['-version'], {stdio: 'ignore'}).status === 0;

export const duration = (file) =>
	Number(
		run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], {quiet: true}).trim(),
	);

export const hash = (...parts) => crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0, 16);

// Turn a green-screen render into a VP9 WebM with an alpha channel (Remotion plays it with `transparent`).
export const chromaKey = (input, output, color = '0x00FF00') => {
	run('ffmpeg', [
		'-y', '-v', 'error', '-i', input,
		'-vf', `chromakey=${color}:0.14:0.06,despill=type=green,format=yuva420p`,
		'-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '5M', '-auto-alt-ref', '0', '-an',
		output,
	]);
};

export const loudnorm = (input, output) => {
	run('ffmpeg', [
		'-y', '-v', 'error', '-i', input,
		'-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k',
		'-movflags', '+faststart', output,
	]);
};

const srtTime = (s) => {
	const ms = Math.max(0, Math.round(s * 1000));
	const p = (n, w = 2) => String(n).padStart(w, '0');
	return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

// words: [{text, start, end}] in absolute video time.
export const writeSrt = (words, file, perLine = 7) => {
	const cues = [];
	for (let i = 0; i < words.length; i += perLine) {
		const g = words.slice(i, i + perLine);
		cues.push(`${cues.length + 1}\n${srtTime(g[0].start)} --> ${srtTime(g[g.length - 1].end)}\n${g.map((w) => w.text).join(' ')}\n`);
	}
	fs.writeFileSync(file, cues.join('\n'));
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
