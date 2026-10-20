// "Explained in 2 Minutes": the series intro (episode 00), shared by both
// cuts like the episodes are (index.html 1920×1080, vertical.html 1080×1920
// with captions). The hook, then the channel intro (laid in by build.sh where
// the timeline pauses the voice), then what every episode does, the first six
// episodes and the hundred to come, the comment ask (../explained/cta.js) and
// "See you in episode one." Shared helpers are in ../explained/common.js.

const V = BH > BW;
const FIELDS = V ? [
  t => [860 + Math.sin(t * .05) * 160, 320 + Math.cos(t * .04) * 120, 820, 'rgba(1,124,238,0.055)'],
  t => [160 + Math.cos(t * .035) * 120, 1480, 760, 'rgba(229,37,27,0.03)'],
  t => [720, 1900 + Math.sin(t * .045) * 70, 650, 'rgba(18,183,106,0.03)'],
] : [
  t => [1500 + Math.sin(t * .05) * 260, 160 + Math.cos(t * .04) * 90, 950, 'rgba(1,124,238,0.055)'],
  t => [260 + Math.cos(t * .035) * 160, 980, 820, 'rgba(229,37,27,0.03)'],
  t => [1150, 1160 + Math.sin(t * .045) * 70, 700, 'rgba(18,183,106,0.03)'],
];
const NS = 'http://www.w3.org/2000/svg';
function svgEl(parent, tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}
function box(el, root) {
  let x = el.offsetLeft, y = el.offsetTop, p = el.offsetParent;
  while (p && p !== root) { x += p.offsetLeft + p.clientLeft; y += p.offsetTop + p.clientTop; p = p.offsetParent; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2, r: x + el.offsetWidth, b: y + el.offsetHeight };
}

// ---------------------------------------------------------------- HUD
const CHAPTERS = [[0, 'The series'], [at("here's") - .3, 'Coming up'], [at('so') - .3, 'Your turn']];
let lastChap = -1;
function drawHud(t) {
  if (!V) $('#hud-prog').style.width = (100 * clamp(t / END)).toFixed(3) + '%';
  let k = 0;
  CHAPTERS.forEach(([s], i) => { if (t >= s) k = i; });
  if (k !== lastChap) {
    $('#hud-num').textContent = String(k + 1).padStart(2, '0');
    $('#hud-chap').textContent = CHAPTERS[k][1];
    lastChap = k;
  }
}
tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .7, ease: 'power1.out' }, at('this') - .3);
tl.to('#hud', { autoAlpha: 0, duration: .6, ease: 'power1.in' }, at('see') - .3);

// ---------------------------------------------------------------- S1 · the hook
show('#s1', CARD - .2, VO.insert.start);
cueWords($('#h1'), ['One', 'data', 'tool.'], 'one');
cueWords($('#h2'), ['<em>Two</em>', '<em>minutes.</em>'], 'two');
cueWords($('#h3'), ['No', '<span class="ff">fluff.</span>'], 'no');
tl.to('#s1', { autoAlpha: 0, duration: .25, ease: 'power1.in' }, VO.insert.start - .25);

// ---------------------------------------------------------------- S2 · what every episode does
show('#s2', at('this') - .3, at("here's") - .1);
tl.fromTo('#mark2', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, at('this') - .2);
tl.fromTo('#wm2a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('explained') - .1);
tl.fromTo('#wm2b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('2') - .1);
tl.to('#lock2', V ? { scale: .64, duration: 1.2, ease: 'power3.inOut' } : { y: -128, scale: .74, duration: 1.2, ease: 'power3.inOut' }, at('every') - .3);
rise('#sub2', at('tool', 1) - .25, { y: 20 });
leave(['#lock2', '#sub2'], at('what') - .55, { y: '-=30', d: .5, st: .05 });
rise('#bt1', at('what') - .3, { y: 40, d: .9 });
rise('#bt2', at('why') - .3, { y: 40, d: .9 });
rise('#bt3', at('how') - .3, { y: 40, d: .9 });
leave(['#bt1', '#bt2', '#bt3'], at('architecture') - .5, { y: '-=30', st: .05 });

// … with the architecture drawn out, step by step
rise('#arch-tag', at('architecture') - .2, { y: 12 });
const AN = ['#an1', '#an2', '#an3', '#an4'];
const tAN = [at('architecture'), at('drawn'), at('step'), at('step', 1)];
AN.forEach((sel, i) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7 }, tAN[i] - .2));
leave(['#arch-tag', ...AN, '#arch-links'], at("here's") - .45, { y: '-=24', st: .04 });

// ---------------------------------------------------------------- S3 · the roadmap
show('#s3', at("here's") - .3, at('so') - .1);
rise('#s3-tag', at("here's") - .1, { y: 12 });
const EP_CUES = [['airflow', 0], ['kafka', 0], ['spark', 0], ['what', 1], ['snowflake', 0], ['databricks', 0]];
EP_CUES.forEach(([w, n], i) => {
  const t = at(w, n) - .2;
  tl.fromTo('#ep' + (i + 1), { autoAlpha: 0, y: 24, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.4)' }, t);
  tl.fromTo(`#ep${i + 1} .tile`, { scale: .4, rotation: -30 }, { scale: 1, rotation: 0, duration: .7, ease: 'back.out(2.2)' }, t + .05);
});
// … and that's just the start: a hundred episodes
const tStart = at('start') - .35, tGo = at('going') - .1, tHundred = at('hundred');
leave('#eps', tStart, { y: '-=20', d: .5 });
$('#grid100').innerHTML = '<i></i>'.repeat(100);
const COLORS = ['#017CEE', '#0B1220', '#F79009', '#7A5AF8', '#00B2D6', '#F04438'];
const tiles = $$('#grid100 i');
tiles.forEach((el, k) => { if (k < 6) el.style.background = COLORS[k]; });
tl.fromTo(tiles.slice(0, 6), { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)', stagger: .06 }, tStart + .25);
tl.fromTo(tiles.slice(6), { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)', stagger: { each: (tHundred - tGo) / 94, from: 'start' } }, tGo);
rise('#count', tStart + .3, { y: 20 });
tl.to(tiles.slice(6), { backgroundColor: '#B2DDFF', duration: .35, stagger: .006 }, tHundred + .25);
leave(['#s3-tag', '#grid100', '#count'], at('so') - .45, { y: '-=24', st: .04 });
function drawCount(t) {
  const k = gsap.parseEase('power1.inOut')(clamp((t - tGo) / (tHundred + .4 - tGo)));
  const n = String(Math.round(6 + 94 * k));
  const el = $('#count-n');
  if (el.textContent !== n) el.textContent = n;
}

// ---------------------------------------------------------------- the comment ask, then S5 · see you in episode one
const drawAsk = ctaScene(wi('so'), { tEnd: at('see') - .05 });
show('#s5', at('see') - .25, null);
tl.fromTo('#mark5', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, at('see') - .2);
tl.fromTo('#wm5a', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('see') - .05);
tl.fromTo('#wm5b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('episode', 2) - .05);
tl.fromTo('#next', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .8 }, at('one', 2) - .1);
rise('#credit', at('one', 2) + .5, { y: 8, d: 1 });
tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);

function build() {
  // the strike through "fluff"
  const ff = $('#h3 .ff'), b = box(ff, $('#s1')), y = b.y + b.h * .56;
  const strike = svgEl($('#s1-ink'), 'path', { class: 'strike', d: `M${b.x - 6} ${y + 4} L${b.r + 4} ${y - 6}` });
  tl.fromTo(strike, { drawSVG: '0%' }, { drawSVG: '100%', duration: .35, ease: 'power2.out' }, WORDS[wi('fluff')].e + OFF - .15);

  // the mini architecture: arrows drawn one step at a time
  const sc = $('#s2'), svg = $('#arch-links');
  const edges = [0, 1, 2].map(i => {
    const a = box($(AN[i]), sc), c = box($(AN[i + 1]), sc);
    const [x1, y1, x2, y2] = V ? [a.cx, a.b + 6, c.cx, c.y - 8] : [a.r + 6, a.cy, c.x - 8, c.cy];
    const id = 'ae' + i;
    svg.insertAdjacentHTML('beforeend', edgeSvg(id, [x1, y1, x2, y2]));
    drawEdge([id], tAN[i + 1] - .35, .45);
    return [x1, y1, x2, y2];
  });
  const dots = edges.map(() => svgEl(svg, 'circle', { r: 6, fill: '#017CEE', opacity: 0 }));
  const tFlow = tAN[3] + .4;

  window.render = t => {
    tl.seek(t, false);
    drawBg(t, FIELDS); drawMarks(t); drawHud(t); drawCount(t); drawAsk(t);
    dots.forEach((el, i) => {
      const [x1, y1, x2, y2] = edges[i], k = ((t - tFlow) * .9 - i * .33) % 1;
      const on = t >= tFlow && k >= 0;
      el.setAttribute('opacity', on ? Math.min(1, k * 8, (1 - k) * 8).toFixed(3) : 0);
      if (on) { el.setAttribute('cx', (x1 + (x2 - x1) * k).toFixed(2)); el.setAttribute('cy', (y1 + (y2 - y1) * k).toFixed(2)); }
    });
    if (V) drawCaptions(t);
  };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(build));
