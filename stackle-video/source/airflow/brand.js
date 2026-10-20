// Airflow's mark for the episode: a four-blade pinwheel in the title
// lockups and the HUD (a nod to Airflow's logo, drawn from scratch).
// scene.js and vertical.js turn it in render(t).
const BLADES = ['#017CEE', '#00B2D6', '#12B76A', '#F04438'];
const wheels = $$('svg.wheel').map(svg => {
  svg.innerHTML = '<g>' + BLADES.map((c, i) =>
    `<path d="M0 0C-12-30-10-66 8-94 34-80 50-50 44-22 30-8 14-2 0 0Z" fill="${c}" transform="rotate(${i * 90})"/>`
  ).join('') + '<circle r="10" fill="#fff"/><circle r="4.5" fill="#0B1220"/></g>';
  return svg.firstChild;
});
