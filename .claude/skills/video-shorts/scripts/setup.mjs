#!/usr/bin/env node
// One-time setup: checks tools, creates .env, finds your voice + avatar IDs, installs the renderer.
// Safe to re-run any time.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as el from './lib/elevenlabs.mjs';
import {ENV_PATH, loadEnv, outputDir, REMOTION_DIR, SKILL_DIR} from './lib/env.mjs';
import * as hg from './lib/heygen.mjs';
import {has, run} from './lib/media.mjs';

const ok = (m) => console.log(`✔ ${m}`);
const bad = (m) => console.log(`✘ ${m}`);
let problems = 0;

// 1. Tools
const major = Number(process.versions.node.split('.')[0]);
major >= 18 ? ok(`Node ${process.versions.node}`) : (bad(`Node ${process.versions.node}: need 18+ (nodejs.org)`), problems++);
for (const t of ['ffmpeg', 'ffprobe']) {
	has(t) ? ok(t) : (bad(`${t} not found. Mac: brew install ffmpeg · Windows: winget install ffmpeg`), problems++);
}

// 2. .env
if (!fs.existsSync(ENV_PATH)) {
	fs.copyFileSync(path.join(SKILL_DIR, 'templates/env.template'), ENV_PATH);
	ok(`Created ${ENV_PATH}`);
} else ok(`Found ${ENV_PATH}`);
loadEnv();

const setEnv = (name, value) => {
	let text = fs.readFileSync(ENV_PATH, 'utf8');
	const re = new RegExp(`^${name}=.*$`, 'm');
	text = re.test(text) ? text.replace(re, `${name}=${value}`) : `${text.trimEnd()}\n${name}=${value}\n`;
	fs.writeFileSync(ENV_PATH, text);
	process.env[name] = value;
};

const missingKeys = ['ELEVENLABS_API_KEY', 'HEYGEN_API_KEY'].filter((k) => !process.env[k]);
if (missingKeys.length) {
	bad(`Add ${missingKeys.join(' and ')} to the .env file, save it, then run setup again.`);
	// Open the file for the user.
	const opener = process.platform === 'darwin' ? ['open', ['-t', ENV_PATH]] : process.platform === 'win32' ? ['notepad', [ENV_PATH]] : ['xdg-open', [ENV_PATH]];
	spawnSync(opener[0], opener[1], {stdio: 'ignore', detached: true});
	problems++;
}

// 3. Voice ID
if (process.env.ELEVENLABS_API_KEY) {
	try {
		const voices = await el.listVoices();
		const cloned = voices.filter((v) => v.category === 'cloned' || v.category === 'professional');
		if (process.env.ELEVENLABS_VOICE_ID) {
			const v = voices.find((x) => x.id === process.env.ELEVENLABS_VOICE_ID);
			v ? ok(`Voice: ${v.name}`) : (bad(`ELEVENLABS_VOICE_ID not found in your account`), problems++);
		} else if (cloned.length === 1) {
			setEnv('ELEVENLABS_VOICE_ID', cloned[0].id);
			ok(`Voice: found your cloned voice "${cloned[0].name}" and saved it`);
		} else {
			bad('Pick your voice and paste its ID into ELEVENLABS_VOICE_ID:');
			for (const v of cloned.length ? cloned : voices) console.log(`    ${v.id}  ${v.name} (${v.category})`);
			problems++;
		}
	} catch (e) {
		bad(`ElevenLabs: ${e.message}`);
		problems++;
	}
}

// 4. Avatar ID
if (process.env.HEYGEN_API_KEY) {
	try {
		const {avatars, talkingPhotos} = await hg.listAvatars();
		const all = [...avatars, ...talkingPhotos];
		if (process.env.HEYGEN_AVATAR_ID) {
			const a = all.find((x) => x.id === process.env.HEYGEN_AVATAR_ID);
			if (a) {
				if (a.type !== (process.env.HEYGEN_AVATAR_TYPE || 'avatar')) setEnv('HEYGEN_AVATAR_TYPE', a.type);
				ok(`Avatar: ${a.name} (${a.type})`);
			} else {
				bad('HEYGEN_AVATAR_ID not found in your account');
				problems++;
			}
		} else {
			// HeyGen's list includes public stock avatars; yours are usually the talking photos or the few custom ones.
			bad('Pick YOUR avatar and paste its ID into HEYGEN_AVATAR_ID (run again afterwards):');
			for (const a of all.slice(0, 60)) console.log(`    ${a.id}  ${a.name} (${a.type})`);
			if (all.length > 60) console.log(`    …and ${all.length - 60} more (stock avatars). Your own avatar ID is also shown in HeyGen → Avatars.`);
			problems++;
		}
	} catch (e) {
		bad(`HeyGen: ${e.message}`);
		problems++;
	}
}

// 5. Output folder + renderer
fs.mkdirSync(outputDir(), {recursive: true});
ok(`Videos will be saved in ${outputDir()}`);
if (!fs.existsSync(path.join(REMOTION_DIR, 'node_modules'))) {
	console.log('… installing the video renderer (one time, ~1 min)');
	run('npm', ['install', '--no-audit', '--no-fund'], {cwd: REMOTION_DIR, shell: process.platform === 'win32'});
}
ok('Renderer installed');

console.log(problems ? `\n${problems} thing(s) to fix above, then run setup again.` : '\nAll set. Ask Claude: "make a short about <your idea>".');
process.exit(problems ? 1 : 0);
