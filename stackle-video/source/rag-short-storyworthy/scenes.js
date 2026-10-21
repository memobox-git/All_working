// RAG Short, Storyworthy version: the scenes, each picture placed on a spoken
// word. Runs on ../rag-short/short-core.js. Lines 4 to 6 share one scene (the
// slow-down before the moment), with a cut on each line.

// 1 · "Maya's AI support bot just told a customer they can get a refund after sixty days."
tl.fromTo('#s1 .chat', { scale: .97 }, { scale: 1, duration: .8, ease: 'power2.out' }, 0);
rise('#a1', at('sixty') - .35, { y: 20, sfx: 'pop' });

// 2 · "Her company's policy is thirty."
rise('#pol2', L(1).s, { y: 40 });
tl.to('#m30', { backgroundSize: '100% 100%', duration: .45 }, at('thirty') - .1);
pop('#said60', at('thirty') + .2, 'tick');

// 3 · "Maya is sure the fix is a bigger model. So she pays for one."
rise('#model', L(2).s, { y: 30, sfx: null });
tl.to('#model', { scale: 1.32, duration: .5, ease: 'back.out(1.6)' }, at('bigger') - .15);
pop('#bigger', at('pays') - .1);

// 4–6 · "Same question." "Same confident answer." "Sixty days."
rise('#chat4', L(3).s, { y: 30, sfx: null });
rise('#q4', at('same') - .05, { y: 20 });
tl.fromTo('#dots4', { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, immediateRender: false }, at('same', 1) - .1);
tl.to('#dots4', { autoAlpha: 0, duration: .15 }, at('sixty', 1) - .2);
rise('#a4', at('sixty', 1) - .15, { y: 16, sfx: null });
tl.fromTo('#stamp4', { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power4.in', immediateRender: false }, at('days', 1) + .05);
SFX.push({ t: at('days', 1) + .33, k: 'pop' });

// 7 · "And that's when it hits her."
pop('#maya7', L(6).s, null);
pop('#bang', at('hits') - .05);
tl.to('#bang', { rotation: 12, duration: .08, yoyo: true, repeat: 5, ease: 'none' }, at('hits') + .4);

// 8 · "The model isn't dumb. It has never read her refund policy."
pop('#bot2', L(7).s, null);
tl.fromTo('#wire2', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, immediateRender: false }, at('dumb') - .1);
pop('#p-files', at('never') - .15);
pop('#nox2', at('read') - .05);
rise('#never', at('policy', 1) - .1, { y: 20, sfx: null });

// 9 · "So she tries a trick called RAG."
pop('#p-robot', at('trick') - .1);
tl.fromTo('#rag span', { autoAlpha: 0, y: 80, scale: .6 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, stagger: .09, ease: 'back.out(2)', immediateRender: false }, at('rag') - .25);
SFX.push({ t: at('rag') - .25, k: 'whoosh' });
rise('#ragsub', at('rag') + .25, { y: 14, sfx: null });

// 10 · "Before the bot answers, it searches her documents, grabs the three paragraphs that match best, and reads them first."
rise(['#k7', '#docs .doc'], L(9).s, { st: .06, y: 40 });
const docs = $$('#docs .doc'), lens = $('#lens');
const tLens0 = at('searches') - .35, tLens1 = at('grabs') - .2;
tl.fromTo(lens, { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .3, immediateRender: false }, tLens0);
fade(['#k7', '#docs', '#lens'], tLens1);
const DOCPTS = docs.map(d => [d.offsetLeft + d.offsetParent.offsetLeft + d.offsetWidth / 2, d.offsetTop + d.offsetParent.offsetTop + d.offsetHeight / 2]);
const LENSPATH = [0, 1, 3, 2, 4, 5].map(i => DOCPTS[i]);
pop('#pa1', at('three') - .1, 'tick');
pop('#pa2', at('paragraphs') + .05, 'tick');
pop('#pa3', at('best') - .1, 'tick');
rise('#first10', at('reads') - .1, { y: 20, sfx: null });

// 11 · "Every paragraph is stored as numbers that capture its meaning, so it finds the right one even when customers use different words."
rise('#pa10', L(10).s, { y: 40 });
rise('#down10', at('stored') - .1, { y: -20, sfx: null });
tl.set('#vec10', { autoAlpha: 1 }, at('numbers') - .25);
tl.fromTo('#vec10', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'none', immediateRender: false }, at('numbers') - .25);
tick(at('numbers'));
fade(['#pa10', '#down10'], at('capture') - .1);
tl.to('#vec10', { y: -300, duration: .45, ease: 'power3.inOut' }, at('capture') - .1);
pop('#p-db', at('meaning') - .2);
const fly = $('#fly10'), dots = Array.from({ length: 7 }, () => { const d = document.createElement('i'); d.className = 'fd'; fly.appendChild(d); return d; });
dots.forEach((d, i) => tl.fromTo(d, { x: 220 + i * 105, y: 360, opacity: 0, scale: .6 },
  { keyframes: [{ opacity: 1, duration: .08 }, { x: 540 + (i - 3) * 30, y: 1010, scale: .4, duration: .45, ease: 'power2.in' }, { opacity: 0, duration: .08 }], immediateRender: false }, at('meaning') + .05 + i * .05));
fade(['#vec10', '#p-db'], at('so', 2) - .05);
// … then the map of meaning
rise('#map', at('finds') - .3, { y: 40 });
const svg = $('#mapl'), NS = 'http://www.w3.org/2000/svg';
const DOTS = [[330, 340, '#F79009'], [290, 300, '#F79009'], [380, 300, '#F79009'], [260, 380, '#F79009'], [360, 400, '#F79009'],
  [650, 600, '#7A5AF8'], [700, 650, '#7A5AF8'], [610, 680, '#7A5AF8'], [720, 560, '#7A5AF8'], [660, 720, '#7A5AF8'],
  [230, 690, '#0E9384'], [300, 740, '#0E9384'], [200, 780, '#0E9384'], [280, 820, '#0E9384'],
  [690, 230, '#017CEE'], [740, 300, '#017CEE'], [640, 280, '#017CEE'], [770, 200, '#017CEE']];
const dotEls = DOTS.map(([x, y, c]) => { const e = document.createElementNS(NS, 'circle'); e.setAttribute('cx', x); e.setAttribute('cy', y); e.setAttribute('r', 15); e.setAttribute('fill', c); e.setAttribute('stroke', '#fff'); e.setAttribute('stroke-width', 5); svg.appendChild(e); return e; });
tl.fromTo(dotEls, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .3, stagger: .02, ease: 'back.out(3)', immediateRender: false }, at('finds') - .1);
const Q = [430, 470];
const qd = document.createElementNS(NS, 'rect');
for (const [k, v] of Object.entries({ x: -22, y: -22, width: 44, height: 44, rx: 10, fill: '#0E9384', stroke: '#fff', 'stroke-width': 6 })) qd.setAttribute(k, v);
svg.appendChild(qd);
const link = document.createElementNS(NS, 'path');
link.setAttribute('d', `M${Q[0]} ${Q[1]}L330 340`); link.setAttribute('stroke', '#0E9384'); link.setAttribute('stroke-width', 6); link.setAttribute('stroke-dasharray', '14 12'); link.setAttribute('fill', 'none'); link.setAttribute('opacity', 0);
svg.insertBefore(link, svg.firstChild);
const ring = document.createElementNS(NS, 'circle');
for (const [k, v] of Object.entries({ cx: 330, cy: 340, r: 34, fill: 'none', stroke: '#F79009', 'stroke-width': 6, opacity: 0 })) ring.setAttribute(k, v);
svg.appendChild(ring);
rise('#lb-q', at('right') - .2, { y: 20, sfx: null });
tl.fromTo(qd, { attr: { transform: 'translate(820 880) rotate(45) scale(.4)' }, opacity: 0 },
  { attr: { transform: `translate(${Q[0]} ${Q[1]}) rotate(45) scale(1)` }, opacity: 1, duration: .6, ease: 'power3.inOut', immediateRender: false }, at('right') - .3);
tl.to(link, { attr: { opacity: 1 }, duration: .3 }, at('even') - .1);
tl.fromTo(ring, { attr: { r: 20, opacity: 0 } }, { attr: { r: 40, opacity: 1 }, duration: .4, immediateRender: false }, at('even') - .05);
pop('#lb-ref', at('customers') - .1, 'tick');
rise('#same', at('different') - .15, { y: 20, sfx: null });

// 12 · "Now every answer comes with its source."
rise('#chat12', L(11).s, { y: 40 });
rise('#a12', at('answer', 1) - .3, { y: 20, sfx: null });
pop('#src12', at('source') - .2, 'tick');
const srcEl = $('#src12');
gsap.set('#tap12', { left: srcEl.offsetLeft + srcEl.offsetWidth * .35 - 40, top: srcEl.offsetTop + srcEl.offsetHeight / 2 - 40 });
tl.fromTo('#tap12', { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: .25, immediateRender: false }, at('source') + .2);
tl.to('#src12', { scale: .93, duration: .1, yoyo: true, repeat: 1 }, at('source') + .45);
tl.to('#tap12', { autoAlpha: 0, duration: .3 }, at('source') + .8);
rise('#pdf12', at('source') + .5, { y: 60 });

// 13 · "And when the policy changes, she just updates the document. No retraining."
rise('#pdf13', L(12).s, { y: 40, sfx: null });
tl.to('#pdf13', { x: 8, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, at('changes') - .05);
const tUpd = at('updates') - .05;
tick(tUpd);
rise('#retrain', at('no') - .15, { y: 30, sfx: null });
tl.to('#strike', { scaleX: 1, duration: .35, ease: 'power2.out' }, at('retraining') + .05);
SFX.push({ t: at('retraining') + .05, k: 'pop' });

// 14 · "Now, when someone tells Maya they need a bigger model, she asks one question: has it read your documents?"
rise('#b-big', at('bigger', 1) - .3, { y: 20 });
pop('#maya14', at('maya', 1) - .2, null);
rise('#b-ask', at('has', 1) - .15, { y: 30, sfx: 'pop' });
tl.to('#b-big', { opacity: .45, duration: .3 }, at('has', 1) - .15);

// 15 · "Follow. Next, I'll explain AI agents."
pop('#p-wave', at('follow') - .15);
rise('#next', at('next') - .15, { y: 30, sfx: null });
rise('#follow', at('agents') - .1, { y: 30, sfx: null });
tl.to('#follow', { scale: .92, duration: .12, yoyo: true, repeat: 1 }, at('agents') + .6);
SFX.push({ t: at('agents') + .6, k: 'tick' });

// ---------------------------------------------------------------- per-frame extras
const s13 = $('#s13'), msize = $('#msize'), props = $$('.prop');
start(t => {
  if (t >= tLens0 && t < tLens1 + .3) {
    const u = clamp((t - tLens0) / (tLens1 - tLens0)) * (LENSPATH.length - 1), i = Math.min(LENSPATH.length - 2, Math.floor(u)), f = gsap.parseEase('sine.inOut')(u - i);
    const [x0, y0] = LENSPATH[i], [x1, y1] = LENSPATH[i + 1];
    lens.style.left = (x0 + (x1 - x0) * f).toFixed(1) + 'px'; lens.style.top = (y0 + (y1 - y0) * f).toFixed(1) + 'px';
    docs.forEach((d, j) => d.classList.toggle('lit', [0, 1, 3, 2, 4, 5].indexOf(j) <= Math.round(u)));
  }
  s13.classList.toggle('done', t >= tUpd);
  msize.textContent = t >= at('bigger') - .15 ? '700B parameters' : '70B parameters';
  $$('#dots4 i').forEach((d, k) => { d.style.transform = `translateY(${(-7 * Math.max(0, Math.sin(t * 9 - k * .9))).toFixed(2)}px)`; });
  props.forEach((p, i) => { p.style.translate = `0 ${(8 * Math.sin(t * 2.2 + i)).toFixed(2)}px`; });
  link.style.strokeDashoffset = (-t * 30).toFixed(1);
});
