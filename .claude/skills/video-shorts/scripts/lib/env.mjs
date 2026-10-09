// Loads .env from the repo root (the folder containing .git) without extra dependencies.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REMOTION_DIR = path.join(SKILL_DIR, 'remotion');

export const findRepoRoot = () => {
	let dir = SKILL_DIR;
	while (dir !== path.dirname(dir)) {
		if (fs.existsSync(path.join(dir, '.git'))) return dir;
		dir = path.dirname(dir);
	}
	return process.cwd();
};

export const ENV_PATH = path.join(findRepoRoot(), '.env');

export const loadEnv = () => {
	if (fs.existsSync(ENV_PATH)) {
		for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
			const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
			if (!m) continue;
			let v = m[2];
			if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
			// Real environment variables win over the file.
			if (process.env[m[1]] === undefined || process.env[m[1]] === '') process.env[m[1]] = v;
		}
	}
	return process.env;
};

export const expandHome = (p) => (p && p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p);

export const outputDir = () => path.resolve(expandHome(process.env.OUTPUT_DIR || '~/Desktop/shorts'));

export const requireEnv = (...names) => {
	const missing = names.filter((n) => !process.env[n]);
	if (missing.length) {
		throw new Error(
			`Missing ${missing.join(', ')} in ${ENV_PATH}.\n` +
				`Run: node ${path.relative(process.cwd(), path.join(SKILL_DIR, 'scripts/setup.mjs'))}`,
		);
	}
};
