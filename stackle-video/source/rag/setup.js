// Episode settings the shared kit reads: the icons this episode adds to the
// set in common.js, the ideas its comment box types out (cta.js), and, while
// the page shows preview captions, longer caption lines than the vertical
// cuts use (captions.js). Load before common.js.
window.EXTRA_ICONS = {
  bot: '<rect x="4" y="7.5" width="16" height="12" rx="3.5"/><path d="M12 7.5V4.2"/><circle cx="12" cy="3.6" r=".6"/><circle cx="9" cy="13.5" r="1.2"/><circle cx="15" cy="13.5" r="1.2"/><path d="M2 12.5v3M22 12.5v3"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  sparkle: '<path d="M11 3.5l1.9 5.6 5.6 1.9-5.6 1.9L11 18.5l-1.9-5.6L3.5 11l5.6-1.9z"/><path d="M19 3.5v3.5M17.25 5.25h3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5z"/><path d="M12 6.5v13"/>',
  bookc: '<path d="M5.5 4.5h11a2 2 0 0 1 2 2V20h-11a2 2 0 0 1-2-2z"/><path d="M5.5 18a2 2 0 0 1 2-2h11"/>',
  scissors: '<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4 20 17M8.2 15.6 20 7"/>',
  refresh: '<path d="M19.5 10.5A7.8 7.8 0 0 0 5.6 7.2L4 9"/><path d="M4 4.5V9h4.5"/><path d="M4.5 13.5a7.8 7.8 0 0 0 13.9 3.3L20 15"/><path d="M20 19.5V15h-4.5"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
  hash: '<path d="M9 4.5 7 19.5M17 4.5 15 19.5M4.5 9h16M3.5 15h16"/>',
  msg: '<path d="M4 5.5h16v10.5H9.5L4 20z"/><path d="M8 9.5h8M8 12.5h5"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  chev: '<path d="m9 5 7 7-7 7"/>',
};
window.CTA_IDEAS = ['MCP', 'AI agents', 'Vector databases', 'LangGraph'];
window.CAP_PAGE = { words: 8, chars: 46 };
