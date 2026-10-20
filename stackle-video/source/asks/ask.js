// Mid-video asks: "Quick pause", a question, the offer in a hand-drawn card,
// then "Link in the description". Each page (call.html, de.html, ai.html) sets
// window.ASK; the copy, and the spoken word each part appears on, live below.
// Built on ../kit/kit.js; timing follows the voiceover word cues.
const ASKS = {
  call: {
    question: 'Not sure what your next career move should be?',
    photo: true,
    title: '<span class="mk">Free</span> 15-minute career call', sub: 'with Chris',
    card: ['book'], titleAt: ['free'], subAt: ['with'], mark: { kind: 'loop', at: ['free'] },
  },
  de: {
    question: 'Want to become a data engineer?',
    title: 'Data Engineering Masterclass', sub: 'Job-ready in <span class="mk">10</span> weeks',
    card: ['join'], titleAt: ['data', 1], subAt: ['get'], mark: { kind: 'loop', at: ['10'] },
  },
  ai: {
    question: 'Want to become an AI engineer?',
    title: 'AI Engineering Masterclass', sub: 'The skills companies <span class="mk">hire for</span>',
    card: ['join'], titleAt: ['ai', 1], subAt: ['learn'], mark: { kind: 'underline', at: ['hire'] },
  },
};
const ASK = ASKS[window.ASK];
const END = OFF + VO.duration + 1;           // hold the link line, then cut back to the video
window.DURATION = END;

document.body.insertAdjacentHTML('afterbegin', `<section class="scene" id="ask">
  <div class="at hand" id="note">Quick pause</div>
  <div class="at big" id="q">${ASK.question}</div>
  <div id="card">${ASK.photo ? '<div class="photo"><img src="../kit/img/chris.jpg" alt="Chris"><svg id="photo-frame"></svg></div>' : ''}
    <div><div class="big title">${ASK.title}</div><div class="sub">${ASK.sub}</div></div></div>
  <div class="at hand" id="link">Link in the description</div>
  <svg class="ink" id="ink"></svg>
</section>`);

function build() {
  makeGrain();
  const ink = $('#ink');
  scene('#ask', 0, null);
  sfx(.05, 'paper_1', .35);

  // "Quick pause", with a pause sign drawn after it
  write('#note', at('quick') - .05, .6);
  const n = box('#note'), px = n.right + 30, py = n.top + n.height * .3, ph = n.height * .42;
  draw(ink, line(px, py, px + 2, py + ph, 31, .6), 'red', at('pause') - .05, .2);
  draw(ink, line(px + 22, py, px + 24, py + ph, 32, .6), 'red', at('pause') + .1, .2, false);

  // the question, word by word
  words($('#q'), ASK.question.split(' ')[0]);

  // the offer card: frame first, then the title and the line under it
  const tCard = at(...ASK.card) - .1, c = box('#card');
  draw(ink, rect(c.left, c.top, c.width, c.height, 41, .8, Math.round(c.width / 80)), null, tCard, .6);
  if (ASK.photo) {
    const p = $('#card .photo');
    draw($('#photo-frame'), rect(3, 3, p.offsetWidth - 6, p.offsetHeight - 6, 43, 1), null, tCard + .2, .45, false);
    tl.fromTo('#card .photo img', { opacity: 0 }, { opacity: 1, duration: .5 }, tCard + .3);
  }
  rise('#card .title', at(...ASK.titleAt) - .1, .5, 16);
  rise('#card .sub', at(...ASK.subAt) - .1, .5, 12);
  const m = box('#card .mk'), tm = at(...ASK.mark.at);
  if (ASK.mark.kind === 'loop') draw(ink, loop(m.left + m.width / 2 + 2, m.top + m.height * .54, m.width / 2 + 14, m.height * .56, 47), 'red', tm, .5);
  else draw(ink, line(m.left + 2, m.bottom - 2, m.right - 6, m.bottom - 8, 49, 1.2, 4), 'red', tm, .4);

  // "Link in the description", with an arrow down to it
  write('#link', at('link') - .1, .8);
  const l = box('#link'), ax = l.right + 40, ay = l.top + l.height * .25;
  draw(ink, line(ax, ay, ax + 14, ay + 110, 51, 1, -10), 'red', at('description') - .05, .35, false);
  draw(ink, `M${f1(ax - 8)},${f1(ay + 84)} L${f1(ax + 14)},${f1(ay + 112)} L${f1(ax + 34)},${f1(ay + 80)}`, 'red', at('description') + .3, .2);

  tl.to('#ask', { opacity: 0, duration: .25, ease: 'power1.in' }, END - .25);
  sfx(0, 'bed', 1);
  finish();
}

document.fonts.ready.then(() => requestAnimationFrame(build));
