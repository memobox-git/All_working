// Kafka's mark for the episode: a hub with four linked nodes (a nod to
// Kafka's logo, drawn from scratch), with events running out along the
// links. Used in the title lockups, the Kafka bar and the HUD; story.js
// calls drawMarks(t) from render(t).
const MARK_NODES = [[-18, -66, 15], [-18, 66, 15], [50, -38, 15], [50, 38, 15]];
const marks = $$('svg.kmark').map(svg => {
  svg.innerHTML = MARK_NODES.map(([x, y]) => `<path d="M-18 0L${x} ${y}" stroke="#0B1220" stroke-width="10" stroke-linecap="round"/>`).join('') +
    MARK_NODES.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#0B1220" stroke-width="10"/>`).join('') +
    '<circle cx="-18" cy="0" r="25" fill="#fff" stroke="#0B1220" stroke-width="11"/>' +
    '<g class="kdots">' + MARK_NODES.map(() => '<circle r="5.5" fill="#017CEE"/>').join('') + '</g>';
  return [...svg.querySelectorAll('.kdots circle')];
});
function drawMarks(t) {
  for (const dots of marks) dots.forEach((el, i) => {
    const [x, y, r] = MARK_NODES[i], len = Math.hypot(x + 18, y), u0 = 25 / len, u1 = 1 - r / len;
    const k = ((t * .9 + i * .27) % 1 + 1) % 1, u = u0 + (u1 - u0) * k;
    el.setAttribute('cx', (-18 + (x + 18) * u).toFixed(2));
    el.setAttribute('cy', (y * u).toFixed(2));
    el.setAttribute('opacity', Math.min(1, k * 8, (1 - k) * 8).toFixed(3));
  });
}
