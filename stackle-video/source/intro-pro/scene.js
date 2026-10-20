// Stackle channel intro: Chris's photo card, then Stackle and what it teaches.
// Built on ../kit/kit.js; timing follows the voiceover word cues in cues.js.
const END = OFF + VO.duration + .8;          // a beat after the last word, then cut to the video
window.DURATION = END;

// ------------------------------------------------------------ the edit
function build() {
  makeGrain();

  const S3 = at('now') - .1;                // "Now I run Stackle"

  // the photo: drawn on first, then held beside the name and the numbers
  scene('#photo', 0, S3);
  const pf = $('#s1-photo');
  draw($('#s1-frame'), rect(4, 4, pf.offsetWidth - 8, pf.offsetHeight - 8, 3), null, .1, .75);
  tl.fromTo('#s1-photo img', { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: .8 }, .3);

  // S1 · Hi, I'm Chris -------------------------------------------------------
  scene('#s1', 0, S3);
  const tHi = at('hi'), tChris = at('chris');
  write('#s1-note', tHi - .1, .45);
  const note = box('#s1-note'), ph = box('#s1-photo');
  const a0 = [note.left - 18, note.top + note.height * .55], a1 = [ph.right + 26, note.top + note.height * .55 + 60];
  draw($('#s1-ink'), line(a0[0], a0[1], a1[0], a1[1], 7, 1, 18), 'red', tHi + .3, .3, false);
  const ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
  const head = ['M', a1[0] - Math.cos(ang - .5) * 24, a1[1] - Math.sin(ang - .5) * 24, 'L', a1[0], a1[1], 'L', a1[0] - Math.cos(ang + .5) * 24, a1[1] - Math.sin(ang + .5) * 24].map(v => typeof v === 'number' ? f1(v) : v).join(' ');
  draw($('#s1-ink'), head, 'red', tHi + .58, .15);
  rise('#s1-my', at("i'm") - .08);
  rise('#s1-name', tChris - .12, .55, 24);
  const nm = box('#s1-name');
  draw($('#s1-ink'), line(nm.left + 8, nm.bottom - 14, nm.right - 40, nm.bottom - 24, 11, 1.5, 7), 'red', tChris + .2, .4);
  rise('#s1-meta', tChris + .35);

  // S2 · 10+ years, 200+ engineers -------------------------------------------
  scene('#s2', 0, S3);
  rise('#st-a', at('over') - .1, .55, 20);
  const ten = box('#st-10');
  draw($('#s2-ink'), loop(ten.left + ten.width / 2 + 4, ten.top + ten.height * .55, ten.width / 2 + 40, ten.height * .44, 5), 'red', at('10') - .05, .5);
  rise('#st-b', at('interviewed') - .1, .55, 20);
  const two = box('#st-200');
  draw($('#s2-ink'), line(two.left + 6, two.bottom + 8, two.right - 20, two.bottom + 2, 13, 1.5, 5), 'red', at('200') + .1, .4);

  // S3 · Stackle and what it teaches ----------------------------------------
  scene('#s3', S3, null);
  rise('#s3-pre', S3 + .05);
  rise('#s3-word', at('stackle') - .12, .55, 24);
  rise('#s3-teach', at('where') - .08);
  const line3 = $('#s3-line');
  line3.innerHTML = line3.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const i0 = wi('teach') + 1;
  $$('#s3-line .w').forEach((w, k) => rise(w, WORDS[i0 + k].s + OFF - .05, .4, 12));
  const hired = box('#s3-line .w:last-child');
  draw($('#s3-ink'), line(hired.left + 4, hired.bottom - 6, hired.right - 26, hired.bottom - 12, 23, 1.5, 6), 'red', at('hired') + .15, .35);

  tl.to('#s3', { opacity: 0, duration: .25, ease: 'power1.in' }, END - .25);
  sfx(0, 'bed', 1);
  finish();
}

document.fonts.ready.then(() => requestAnimationFrame(build));
