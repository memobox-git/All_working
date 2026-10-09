#!/usr/bin/env node
// Builds a finished short from <project>/shotlist.json:
//   narration (ElevenLabs) → avatar (HeyGen, green screen → keyed) → clips → music + SFX
//   → Remotion render per format → loudness normalize → captions.srt + cost.json
//
// Usage: node build.mjs <project-dir> [--formats=9x16,16x9] [--mock]
// Every paid step is cached in <project>/assets/cache.json, so re-running after an edit
// only pays for what changed.
import fs from 'node:fs';
import path from 'node:path';
import * as el from './lib/elevenlabs.mjs';
import {expandHome, loadEnv, outputDir, REMOTION_DIR, requireEnv} from './lib/env.mjs';
import * as hg from './lib/heygen.mjs';
import {chromaKey, duration, hash, loudnorm, run, writeSrt} from './lib/media.mjs';
import {normalize, SFX, wordsOf} from './lib/shotlist.mjs';

loadEnv();
const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`));
const MOCK = Boolean(flag('mock'));
const FORMATS = (flag('formats')?.split('=')[1] ?? '9x16,16x9').split(',');
const FPS = 30;
const SIZES = {'9x16': [1080, 1920], '16x9': [1920, 1080]};

const projectArg = args.find((a) => !a.startsWith('--'));
if (!projectArg) {
	console.error('Usage: node build.mjs <project-dir> [--formats=9x16,16x9] [--mock]');
	process.exit(1);
}
const PROJECT = path.resolve(expandHome(projectArg));
const ASSETS = path.join(PROJECT, 'assets');
fs.mkdirSync(path.join(ASSETS, 'clips'), {recursive: true});
fs.mkdirSync(path.join(ASSETS, 'sfx'), {recursive: true});

const log = (...m) => console.log('▸', ...m);
const cachePath = path.join(ASSETS, 'cache.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const saveCache = () => fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
const cached = (key, file) => cache[key] && fs.existsSync(path.join(ASSETS, file));

const usage = {ttsChars: 0, avatarSeconds: 0, musicSeconds: 0, sfxCount: 0, sttSeconds: 0};

const sl = normalize(JSON.parse(fs.readFileSync(path.join(PROJECT, 'shotlist.json'), 'utf8')));
const narrated = sl.shots.filter((s) => s.say);
const needsAvatar = sl.shots.some((s) => s.say && !s.clip);

if (!MOCK) {
	const need = [];
	if (narrated.length) need.push('ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID');
	if (needsAvatar) need.push('HEYGEN_API_KEY', 'HEYGEN_AVATAR_ID');
	if (sl.music) need.push('ELEVENLABS_API_KEY');
	requireEnv(...new Set(need));
}

// ── 1. Narration ────────────────────────────────────────────────────────────
let voiceWords = [];
let voiceDuration = 0;
const narration = narrated.map((s) => s.say.trim()).join(' ');
if (narrated.length) {
	const key = hash('voice', narration, process.env.ELEVENLABS_VOICE_ID, sl.voice, process.env.ELEVENLABS_MODEL, MOCK);
	if (cached(key, 'voice.mp3')) {
		log('Narration: cached');
		voiceWords = cache[key].words;
	} else if (MOCK) {
		log('Narration: MOCK (silent, synthetic timings)');
		voiceWords = wordsOf(narration).map((text, i) => ({text, start: 0.2 + i * 0.38, end: 0.2 + i * 0.38 + 0.32}));
		const len = voiceWords.at(-1).end + 0.4;
		run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(len), '-c:a', 'libmp3lame', path.join(ASSETS, 'voice.mp3')]);
		cache[key] = {words: voiceWords};
	} else {
		log(`Narration: ElevenLabs (${narration.length} chars)…`);
		voiceWords = await el.tts({
			text: narration,
			voiceId: process.env.ELEVENLABS_VOICE_ID,
			settings: sl.voice,
			outFile: path.join(ASSETS, 'voice.mp3'),
		});
		usage.ttsChars += narration.length;
		cache[key] = {words: voiceWords};
	}
	saveCache();
	voiceDuration = duration(path.join(ASSETS, 'voice.mp3'));
	cache.voiceKey = key;
}

// ── 2. Avatar ───────────────────────────────────────────────────────────────
if (needsAvatar) {
	const key = hash('avatar', cache.voiceKey, process.env.HEYGEN_AVATAR_ID, MOCK);
	if (cached(key, 'avatar.webm')) {
		log('Avatar: cached');
	} else {
		const raw = path.join(ASSETS, 'avatar-green.mp4');
		if (MOCK) {
			log('Avatar: MOCK green-screen stand-in');
			run('ffmpeg', [
				'-y', '-v', 'error', '-f', 'lavfi', '-i', `color=c=0x00FF00:s=1080x1920:r=${FPS}:d=${voiceDuration}`,
				'-vf', 'drawbox=x=390:y=420:w=300:h=360:color=0xd9b38c:t=fill,drawbox=x=240:y=800:w=600:h=1120:color=0x334466:t=fill',
				'-c:v', 'libx264', '-pix_fmt', 'yuv420p', raw,
			]);
		} else {
			log('Avatar: uploading narration to HeyGen…');
			const assetId = await hg.uploadAudio(path.join(ASSETS, 'voice.mp3'));
			const videoId = await hg.generateAvatarVideo({audioAssetId: assetId});
			log(`Avatar: rendering on HeyGen (video ${videoId}) — usually a few minutes…`);
			const url = await hg.waitForVideo(videoId, {onTick: (s) => process.stdout.write(`  …${s}\r`)});
			await hg.download(url, raw);
			usage.avatarSeconds += voiceDuration;
		}
		log('Avatar: keying out green screen…');
		chromaKey(raw, path.join(ASSETS, 'avatar.webm'));
		cache[key] = true;
		saveCache();
	}
}

// ── 3. Timeline: slice narration into shots at word boundaries ─────────────
const frames = (sec) => Math.round(sec * FPS);
const words = [...voiceWords];
const narratedBounds = [];
{
	let wi = 0;
	for (const s of narrated) {
		const n = wordsOf(s.say).length;
		narratedBounds.push({first: words[wi], last: words[Math.min(wi + n, words.length) - 1], from: wi, to: wi + n});
		wi += n;
	}
	if (wi !== words.length) console.warn(`⚠ word count mismatch: shot list ${wi}, narration ${words.length}; timing may drift`);
}

let narrIndex = 0;
const shots = [];
for (const s of sl.shots) {
	const base = {
		id: s.id,
		layout: s.layout,
		graphic: s.graphic,
		punchIn: s.punchIn,
		pipCorner: s.pipCorner,
		lowerThird: s.lowerThird,
	};
	if (s.graphic?.kind === 'image') {
		const src = path.resolve(PROJECT, expandHome(s.graphic.src));
		const dest = `images/${path.basename(src)}`;
		fs.mkdirSync(path.join(ASSETS, 'images'), {recursive: true});
		if (path.resolve(ASSETS, dest) !== src) fs.copyFileSync(src, path.join(ASSETS, dest));
		base.graphic = {...s.graphic, src: dest};
	}

	let clip = null;
	if (s.clip) {
		const src = path.resolve(PROJECT, expandHome(s.clip));
		const name = `clips/${hash(src, fs.statSync(src).size)}${path.extname(src)}`;
		if (!fs.existsSync(path.join(ASSETS, name))) fs.copyFileSync(src, path.join(ASSETS, name));
		const from = s.clipFrom ?? 0;
		const to = s.clipTo ?? duration(path.join(ASSETS, name));
		clip = {type: 'clip', src: name, from, to, muted: Boolean(s.say)};
	}

	if (s.say) {
		const b = narratedBounds[narrIndex];
		const next = narratedBounds[narrIndex + 1];
		const start = narrIndex === 0 ? 0 : (narratedBounds[narrIndex - 1].last.end + b.first.start) / 2;
		const end = next ? (b.last.end + next.first.start) / 2 : voiceDuration;
		const fromF = frames(start);
		const durationInFrames = Math.max(1, frames(end) - fromF);
		const from = fromF / FPS;
		shots.push({
			...base,
			presenter: clip ?? {type: 'avatar'},
			durationInFrames,
			voice: {from, to: from + durationInFrames / FPS},
			words: words.slice(b.from, b.to).map((w) => ({text: w.text, start: w.start - from, end: w.end - from})),
			_sfx: s.sfx,
		});
		narrIndex++;
	} else {
		// Real footage with its own audio. Captions come from ElevenLabs speech-to-text.
		let clipWords = [];
		if (sl.captions !== 'none' && !MOCK) {
			const key = hash('stt', clip.src, clip.from, clip.to);
			if (!cache[key]) {
				log(`Transcribing clip ${s.id} for captions…`);
				const seg = path.join(ASSETS, `${s.id}-seg.mp3`);
				run('ffmpeg', ['-y', '-v', 'error', '-ss', String(clip.from), '-to', String(clip.to), '-i', path.join(ASSETS, clip.src), '-vn', '-ac', '1', seg]);
				try {
					cache[key] = await el.transcribe(seg);
					usage.sttSeconds += clip.to - clip.from;
				} catch (e) {
					console.warn(`⚠ transcription failed, clip ${s.id} will have no captions: ${e.message}`);
					cache[key] = [];
				}
				fs.rmSync(seg, {force: true});
				saveCache();
			}
			clipWords = cache[key];
		}
		shots.push({
			...base,
			presenter: clip,
			durationInFrames: Math.max(1, frames(clip.to - clip.from)),
			voice: null,
			words: clipWords,
			_sfx: s.sfx,
		});
	}
}
const totalSeconds = shots.reduce((n, s) => n + s.durationInFrames, 0) / FPS;
log(`Timeline: ${shots.length} shots, ${totalSeconds.toFixed(1)}s`);

// ── 4. Sound effects (shared cache across videos) ──────────────────────────
const sfxCache = path.join(outputDir(), '.sfx-cache');
fs.mkdirSync(sfxCache, {recursive: true});
let prevKind = null;
for (const shot of shots) {
	let name = shot._sfx;
	// Default: whoosh whenever the on-screen graphic changes.
	if (name === undefined) name = shot.graphic && shot.graphic.kind !== prevKind && prevKind !== null ? 'whoosh' : null;
	prevKind = shot.graphic?.kind ?? 'none';
	delete shot._sfx;
	if (!name) continue;
	const cachedFile = path.join(sfxCache, `${name}${MOCK ? '-mock' : ''}.mp3`);
	if (!fs.existsSync(cachedFile)) {
		if (MOCK) {
			run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'sine=f=880:d=0.15', cachedFile]);
		} else {
			log(`SFX: generating "${name}"…`);
			await el.soundEffect({prompt: SFX[name], seconds: name === 'riser' ? 2 : 1, outFile: cachedFile});
			usage.sfxCount++;
		}
	}
	fs.copyFileSync(cachedFile, path.join(ASSETS, 'sfx', `${name}.mp3`));
	shot.sfx = `sfx/${name}.mp3`;
}

// ── 5. Music ────────────────────────────────────────────────────────────────
let music = null;
if (sl.music) {
	const seconds = Math.ceil(totalSeconds) + 2;
	const key = hash('music', sl.music.prompt, seconds, MOCK);
	if (cached(key, 'music.mp3')) {
		log('Music: cached');
	} else if (MOCK) {
		log('Music: MOCK tone');
		run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `sine=f=220:d=${seconds}`, '-af', 'volume=0.3', path.join(ASSETS, 'music.mp3')]);
	} else {
		log(`Music: ElevenLabs (${seconds}s) "${sl.music.prompt}"…`);
		await el.music({prompt: sl.music.prompt, seconds, outFile: path.join(ASSETS, 'music.mp3')});
		usage.musicSeconds += seconds;
	}
	cache[key] = true;
	saveCache();
	music = {src: 'music.mp3', volume: sl.music.volume};
}

// ── 6. Render each format ──────────────────────────────────────────────────
if (!fs.existsSync(path.join(REMOTION_DIR, 'node_modules'))) {
	log('Installing renderer (first run only)…');
	run('npm', ['install', '--no-audit', '--no-fund'], {cwd: REMOTION_DIR});
}
// Cloud containers ship Playwright's Chromium; use it instead of letting Remotion download one.
const preinstalledBrowser = () => {
	const root = '/opt/pw-browsers';
	if (!fs.existsSync(root)) return null;
	const dir = fs.readdirSync(root).find((d) => d.startsWith('chromium_headless_shell-'));
	const exe = dir && path.join(root, dir, 'chrome-linux', 'headless_shell');
	return exe && fs.existsSync(exe) ? exe : null;
};
const outputs = [];
for (const fmt of FORMATS) {
	const [width, height] = SIZES[fmt] ?? (() => { throw new Error(`Unknown format ${fmt}`); })();
	const timeline = {
		fps: FPS,
		width,
		height,
		theme: sl.theme,
		captions: sl.captions,
		voiceSrc: narrated.length ? 'voice.mp3' : null,
		avatarSrc: needsAvatar ? 'avatar.webm' : null,
		music,
		shots,
	};
	const propsFile = path.join(PROJECT, `timeline-${fmt}.json`);
	fs.writeFileSync(propsFile, JSON.stringify(timeline, null, 2));
	const raw = path.join(PROJECT, `render-${fmt}.mp4`);
	const final = path.join(PROJECT, `${sl.slug ?? path.basename(PROJECT)}-${fmt}.mp4`);
	log(`Rendering ${fmt} (${width}x${height})…`);
	const extra = [];
	const browser = process.env.REMOTION_BROWSER_EXECUTABLE || preinstalledBrowser();
	if (browser) extra.push(`--browser-executable=${browser}`);
	if (process.env.REMOTION_IGNORE_CERT_ERRORS === '1') extra.push('--ignore-certificate-errors');
	run('npx', [
		'remotion', 'render', 'src/index.ts', 'Short', raw,
		`--props=${propsFile}`, `--public-dir=${ASSETS}`, '--codec=h264', '--crf=18', '--log=warn', ...extra,
	], {cwd: REMOTION_DIR});
	loudnorm(raw, final);
	fs.rmSync(raw, {force: true});
	outputs.push(final);
}

// ── 7. Captions file + cost log ────────────────────────────────────────────
const absWords = [];
let t0 = 0;
for (const s of shots) {
	for (const w of s.words) absWords.push({text: w.text, start: t0 + w.start, end: t0 + w.end});
	t0 += s.durationInFrames / FPS;
}
writeSrt(absWords, path.join(PROJECT, 'captions.srt'));

// Rough USD estimates; override rates in .env to match your plan.
const rate = (name, d) => Number(process.env[name] ?? d);
const cost = {
	usage,
	estimateUSD: {
		narration: +((usage.ttsChars / 1000) * rate('COST_ELEVENLABS_PER_1K_CHARS', 0.3)).toFixed(2),
		avatar: +((usage.avatarSeconds / 60) * rate('COST_HEYGEN_PER_MIN', 1.0)).toFixed(2),
		music: +((usage.musicSeconds / 60) * rate('COST_ELEVENLABS_MUSIC_PER_MIN', 0.8)).toFixed(2),
		sfx: +(usage.sfxCount * rate('COST_ELEVENLABS_PER_SFX', 0.02)).toFixed(2),
		transcription: +((usage.sttSeconds / 3600) * rate('COST_ELEVENLABS_STT_PER_HOUR', 0.4)).toFixed(2),
	},
	note: 'Only steps that actually ran this time are counted (cached steps cost nothing). Rates are estimates.',
	mock: MOCK,
};
cost.estimateUSD.total = +Object.values(cost.estimateUSD).reduce((a, b) => a + b, 0).toFixed(2);
fs.writeFileSync(path.join(PROJECT, 'cost.json'), JSON.stringify(cost, null, 2));

console.log(`\n✔ Done${MOCK ? ' (MOCK — placeholder voice/avatar/music)' : ''}`);
for (const o of outputs) console.log(`  ${o}`);
console.log(`  ${path.join(PROJECT, 'captions.srt')}`);
console.log(`  Estimated cost this run: $${cost.estimateUSD.total}`);
