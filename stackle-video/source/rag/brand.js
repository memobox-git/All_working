// RAG's mark for the episode: a page of text under a magnifying glass, with
// a blue highlight that keeps finding one line after another. Used in the
// title lockups and the HUD; story.js calls drawMarks(t) from render(t).
const MARK_LINES = [[-38, 16], [-12, 26], [14, 4]];             // [y, right end] of each text line
const marks = $$('svg.kmark').map(svg => {
  svg.innerHTML =
    '<rect class="scan" x="-44" y="-48" width="0" height="20" rx="10" fill="#017CEE" opacity=".22"/>' +
    '<path d="M-58 -84H14L48 -50V84H-58Z" fill="none" stroke="#0B1220" stroke-width="10" stroke-linejoin="round"/>' +
    '<path d="M14 -84V-50H48" fill="none" stroke="#0B1220" stroke-width="10" stroke-linejoin="round"/>' +
    MARK_LINES.map(([y, r]) => `<path d="M-36 ${y}H${r}" stroke="#0B1220" stroke-width="9" stroke-linecap="round"/>`).join('') +
    '<path d="M52 64 80 92" stroke="#0B1220" stroke-width="14" stroke-linecap="round"/>' +
    '<circle cx="30" cy="42" r="31" fill="#fff" stroke="#0B1220" stroke-width="11"/>' +
    '<path class="found" d="M16 42H44" stroke="#017CEE" stroke-width="9" stroke-linecap="round"/>';
  return svg.querySelector('.scan');
});
function drawMarks(t) {
  // the highlight sweeps along each line in turn, 0.8 s a line
  const k = ((t / .8) % 3 + 3) % 3, i = Math.floor(k), u = k - i, [y, r] = MARK_LINES[i];
  const w = (r + 44 + 8) * Math.min(1, u * 1.6), o = .26 * Math.min(1, (1 - u) * 5);
  for (const el of marks) { el.setAttribute('y', y - 10); el.setAttribute('width', w.toFixed(2)); el.setAttribute('opacity', o.toFixed(3)); }
}
