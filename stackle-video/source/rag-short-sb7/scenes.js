// RAG Short, StoryBrand (SB7) version: the scenes, each picture placed on a
// spoken word. The viewer is the hero, Chris the guide, RAG the plan. Runs on
// ../rag-short/short-core.js.

// 1 · the character and what they want
tl.fromTo('#chat1', { scale: .96 }, { scale: 1, duration: .8, ease: 'power2.out' }, 0);
pop('#goal', at('best') - .3);

// 2 · the external problem
rise('#chat3', L(1).s, { y: 40, sfx: null });
rise('#q3', L(1).s + .1, { y: 20, sfx: null });
rise('#a3', at('sixty') - .3, { y: 20 });
tl.fromTo('#stamp', { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power4.in', immediateRender: false }, at('days') - .05);
SFX.push({ t: at('days') + .23, k: 'pop' });
pop('#real30', at('thirty') - .15, 'tick');

// 3 · the internal problem
tl.fromTo('#boss', { autoAlpha: 0, y: -120 }, { autoAlpha: 1, y: 0, duration: .55, ease: 'back.out(1.6)', immediateRender: false }, at('explaining') - .2);
SFX.push({ t: at('explaining') - .2, k: 'tick' });
SFX.push({ t: at('explaining') - .05, k: 'tick' });
tl.to('#boss', { x: 8, duration: .05, yoyo: true, repeat: 5, ease: 'none' }, at('boss') - .05);

// 4 · the philosophical problem
rise('#bad', at('up') - .35, { y: 30 });
rise('#good', at('show') - .15, { y: 30 });

// 5 · the guide: empathy, then authority
rise('#getit', L(4).s, { y: 30, sfx: null });
rise('#guide', at('spent') - .25, { y: 40 });
rise('#g1', at('ten') - .15, { y: 14, sfx: 'tick' });
rise('#g2', at('engineering') + .1, { y: 14, sfx: 'tick' });
pop('#fix5', at('fix') - .15);

// 6 · the plan
rise('#plan', L(5).s, { y: 40 });
rise(['#p1', '#p2', '#p3'], at('three') - .1, { st: .14, y: 20, sfx: null });
[0, 1, 2].forEach(i => tick(at('three') - .1 + i * .14));

// 7 · step 1: store the meaning
pop('#sb1', L(6).s, null);
rise('#pa10', at('turn') - .1, { y: 40 });
rise('#down10', at('into') - .1, { y: -20, sfx: null });
tl.set('#vec10', { autoAlpha: 1 }, at('numbers') - .25);
tl.fromTo('#vec10', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'none', immediateRender: false }, at('numbers') - .25);
tick(at('numbers'));
rise('#mean10', at('meaning') - .3, { y: 20, sfx: null });
fade(['#pa10', '#down10', '#mean10'], at('store') - .2);
tl.to('#vec10', { y: -300, duration: .45, ease: 'power3.inOut' }, at('store') - .2);
pop('#p-db', at('vector') - .15);
const fly = $('#fly10'), dots = Array.from({ length: 7 }, () => { const d = document.createElement('i'); d.className = 'fd'; fly.appendChild(d); return d; });
dots.forEach((d, i) => tl.fromTo(d, { x: 220 + i * 105, y: 360, opacity: 0, scale: .6 },
  { keyframes: [{ opacity: 1, duration: .08 }, { x: 540 + (i - 3) * 30, y: 1010, scale: .4, duration: .45, ease: 'power2.in' }, { opacity: 0, duration: .08 }], immediateRender: false }, at('database') - .25 + i * .05));

// 8 · step 2: find the best three
pop('#sb2', L(7).s, null);
rise('#qp8', at('question') - .15, { y: 30, sfx: null });
pop('#pa1', at('three', 1) - .1, 'tick');
pop('#pa2', at('paragraphs') + .05, 'tick');
pop('#pa3', at('match') - .05, 'tick');

// 9 · step 3: answer with sources
pop('#sb3', L(8).s, null);
rise('#prompt', at('give') - .1, { y: 40 });
rise(['#pc1', '#pc2', '#pc3'], at('paragraphs', 1) - .1, { st: .1, y: 16, sfx: null });
rise('#ans9', at('answers') - .2, { y: 50 });
tl.fromTo('#src9', { scale: 1 }, { scale: 1.08, duration: .15, yoyo: true, repeat: 1, immediateRender: false }, at('sources') - .05);
tick(at('sources'));

// 10 · failure
tl.fromTo('#tint10', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, immediateRender: false }, L(9).s);
rise('#model', L(9).s, { y: 30, sfx: null });
tl.to('#model', { scale: 1.15, duration: .4, ease: 'back.out(1.6)' }, at('bigger') - .15);
rise('#a10', at('still') - .3, { y: 20, sfx: null });
tl.fromTo('#stamp10', { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: .28, ease: 'power4.in', immediateRender: false }, at('up', 1) - .1);
SFX.push({ t: at('up', 1) + .18, k: 'pop' });

// 11 · success
rise('#chat12', L(10).s, { y: 40 });
rise('#a12', at('answer', 1) - .25, { y: 20, sfx: null });
pop('#src12', at('link') - .2, 'tick');
const srcEl = $('#src12');
gsap.set('#tap12', { left: srcEl.offsetLeft + srcEl.offsetWidth * .35 - 40, top: srcEl.offsetTop + srcEl.offsetHeight / 2 - 40 });
tl.fromTo('#tap12', { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: .25, immediateRender: false }, at('proof') - .3);
tl.to('#src12', { scale: .93, duration: .1, yoyo: true, repeat: 1 }, at('proof') - .05);
tl.to('#tap12', { autoAlpha: 0, duration: .3 }, at('proof') + .3);
rise('#pdf12', at('proof') + .05, { y: 60 });

// 12 · success, and it stays right
rise('#pdf13', L(11).s, { y: 40, sfx: null });
tl.to('#pdf13', { x: 8, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, at('changes') - .05);
const tUpd = at('update') - .05;
tick(tUpd);
rise('#retrain', at('no') - .15, { y: 30, sfx: null });
tl.to('#strike', { scaleX: 1, duration: .35, ease: 'power2.out' }, at('retraining') + .05);
SFX.push({ t: at('retraining') + .05, k: 'pop' });

// 13 · the call to action
pop('#p-wave', at('follow') - .15);
pop('#learn', at('learn') - .1, 'tick');
rise('#next', at('next') - .15, { y: 30, sfx: null });
rise('#follow', at('agents') - .1, { y: 30, sfx: null });
tl.to('#follow', { scale: .92, duration: .12, yoyo: true, repeat: 1 }, at('agents') + .5);
SFX.push({ t: at('agents') + .5, k: 'tick' });

// ---------------------------------------------------------------- per-frame extras
const s12 = $('#s12'), props = $$('.prop');
start(t => {
  s12.classList.toggle('done', t >= tUpd);
  props.forEach((p, i) => { p.style.translate = `0 ${(8 * Math.sin(t * 2.2 + i)).toFixed(2)}px`; });
});
