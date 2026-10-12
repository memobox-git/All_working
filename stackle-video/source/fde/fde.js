// Helpers for the FDE roadmap graphics: line icons and the phase bar.
// Loaded before ../base.js. Icons: <i class="ic" data-ic="lock"></i>
const P = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.8 2.9-6 6.5-6s6.5 2.2 6.5 6"/><circle cx="17" cy="9" r="3"/><path d="M16.5 14.2c2.9.3 5 2.3 5 5.8"/>',
  building: '<path d="M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6zM8 21v-8M12 21v-8M16 21v-8"/>',
  office: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
  hospital: '<rect x="3" y="6" width="18" height="15" rx="1"/><path d="M9 6V3h6v3M12 10v6M9 13h6"/>',
  doc: '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5M9 13h7M9 17h7"/>',
  docs: '<path d="M8 5h7l4 4v13H8z"/><path d="M15 5v4h4M5 2h8M5 2v16"/>',
  pdf: '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/><text x="7.6" y="18" font-size="5.6" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">PDF</text>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  sheet: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14.5h18M10 9v11"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  plane: '<path d="M21 15.5 13 11V4.5a1.5 1.5 0 0 0-3 0V11l-8 4.5V17l8-2.2V19l-2.5 1.6V22l4-1 4 1v-1.4L13 19v-4.2l8 2.2z"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>',
  cloud: '<path d="M7 18h10.5a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.4 10.1 4 4 0 0 0 7 18z"/>',
  plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  screen: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="9.5" y="9.5" width="5" height="5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  car: '<path d="M3 16v-4l2.5-5h13L21 12v4zM3 16v2h3v-2M18 16v2h3v-2M3 12h18"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/>',
  cart: '<path d="M3 4h2l2.5 11h11L21 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 3-6 2.5-10.5 5"/>',
  shop: '<path d="M3 9l2-5h14l2 5M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'
};
const PHASES = ['Software foundations', 'Data and cloud', 'Applied AI', 'Customer skills', 'Proof of work'];
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ic]').forEach(el => {
    el.innerHTML = `<svg viewBox="0 0 24 24" ${P}>${ICONS[el.dataset.ic] || ''}</svg>`;
  });
  document.querySelectorAll('.phasebar').forEach(el => {
    const cur = +el.dataset.cur;
    el.innerHTML = PHASES.map((n, i) => `<div class="${i + 1 < cur ? 'done' : i + 1 === cur ? 'cur' : ''}">${i + 1} &middot; ${n}</div>`).join('');
  });
});
