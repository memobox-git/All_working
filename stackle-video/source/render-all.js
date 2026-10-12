// Renders every scene in a manifest, a few at a time.
// Usage: node render-all.js <manifest.json> [workers] [graphic numbers...]
const fs = require('fs');
const path = require('path');
const { renderScene } = require('./render');

(async () => {
  const [manifest, workersArg, ...only] = process.argv.slice(2);
  let jobs = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  if (only.length) jobs = jobs.filter(j => only.includes(String(j.graphic)));
  const workers = Number(workersArg || 4);
  for (const j of jobs) fs.mkdirSync(path.dirname(j.out), { recursive: true });
  let next = 0;
  const run = async () => {
    while (next < jobs.length) {
      const j = jobs[next++];
      const t0 = Date.now();
      await renderScene(j.scene, j.out, j.seconds, 30);
      console.log(`  graphic ${j.graphic} done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  };
  await Promise.all(Array.from({ length: workers }, run));
})();
