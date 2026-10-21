// Spark's mark for the episode: an eight-point orange spark (a nod to the
// star in Spark's logo, drawn from scratch) that turns slowly and glints.
// Used in the title lockups, the Spark bar and the HUD; story.js calls
// drawMarks(t) from render(t).
const SPARK_PTS = Array.from({ length: 16 }, (_, i) => {
  const a = -Math.PI / 2 + i * Math.PI / 8, r = i % 2 ? 30 : (i % 4 ? 70 : 92);
  return [Math.cos(a) * r, Math.sin(a) * r];
});
const SPARK_D = 'M' + SPARK_PTS.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
const marks = $$('svg.smark').map(svg => {
  svg.innerHTML = `<g class="sm-rot"><path d="${SPARK_D}" fill="#E25A1C" stroke="#E25A1C" stroke-width="10" stroke-linejoin="round"/>` +
    `<circle r="17" fill="#fff"/></g><circle class="sm-glint" r="9" fill="#FDB022" opacity="0"/>`;
  return { rot: svg.querySelector('.sm-rot'), glint: svg.querySelector('.sm-glint') };
});
function drawMarks(t) {
  for (const m of marks) {
    m.rot.setAttribute('transform', `rotate(${(Math.sin(t * .7) * 9).toFixed(2)})`);
    // a glint runs out along one ray and fades, every 1.6 s
    const k = (t % 1.6) / 1.6, a = -Math.PI / 2 + Math.floor(t / 1.6) % 4 * Math.PI / 2, r = 20 + k * 70;
    m.glint.setAttribute('cx', (Math.cos(a) * r).toFixed(2));
    m.glint.setAttribute('cy', (Math.sin(a) * r).toFixed(2));
    m.glint.setAttribute('opacity', (Math.min(1, k * 6, (1 - k) * 4) * .9).toFixed(3));
  }
}
