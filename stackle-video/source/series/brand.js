// The series mark: a stopwatch whose blue arc fills toward two minutes and
// whose hand keeps ticking. Used in the lockups, the HUD and the roadmap;
// story.js calls drawMarks(t) from render(t).
const marks = $$('svg.smark').map(svg => {
  svg.innerHTML = '<rect x="-15" y="-101" width="30" height="16" rx="5" fill="#0B1220"/>' +
    '<path d="M0 -86V-74M52 -58l10 -10" stroke="#0B1220" stroke-width="11" stroke-linecap="round"/>' +
    '<circle r="66" fill="#fff" stroke="#0B1220" stroke-width="12"/>' +
    '<path class="arc" fill="none" stroke="#017CEE" stroke-width="12" stroke-linecap="round"/>' +
    '<path class="hand" d="M0 6V-40" stroke="#0B1220" stroke-width="10" stroke-linecap="round"/>' +
    '<circle r="9" fill="#0B1220"/>';
  return { arc: svg.querySelector('.arc'), hand: svg.querySelector('.hand') };
});
function drawMarks(t) {
  const k = .08 + .84 * ((t / 12) % 1), a = k * Math.PI * 2, r = 46;
  const d = `M0 ${-r}A${r} ${r} 0 ${k > .5 ? 1 : 0} 1 ${(Math.sin(a) * r).toFixed(2)} ${(-Math.cos(a) * r).toFixed(2)}`;
  for (const m of marks) {
    m.arc.setAttribute('d', d);
    m.hand.setAttribute('transform', `rotate(${(Math.floor(t * 2) * 15) % 360})`);
  }
}
