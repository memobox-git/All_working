// Prints the full prompt for one scheduler: its own file plus the shared rules.
//
//   node content-engine/scripts/scheduler-prompt.mjs launch-radar
//
// Paste the output into the scheduled task when you change a scheduler file.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'schedulers');
const name = process.argv[2];
const names = ['launch-radar', 'daily-pulse', 'weekly-planner'];
if (!names.includes(name)) { console.error('usage: scheduler-prompt.mjs ' + names.join('|')); process.exit(1); }

process.stdout.write(readFileSync(join(dir, name + '.md'), 'utf8').trim() + '\n\n' + readFileSync(join(dir, 'shared-rules.md'), 'utf8').trim() + '\n');
