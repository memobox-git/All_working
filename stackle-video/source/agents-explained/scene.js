// AI Agents Explained.
// One paused GSAP timeline plus a few per-frame draws, so window.render(t)
// always produces the same frame for the same t. Every cue is a phrase from
// the voiceover (cues.js); cue() searches forward from the previous cue, so
// the edit below reads in script order.
gsap.registerPlugin(DrawSVGPlugin);

const OFF = VO.offset;
const END = OFF + VO.duration + 3.2;
window.DURATION = END;
window.SFX = [];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const norm = s => s.toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9']/g, '');
const WORDS = VO.words.filter(w => !w.w.startsWith('[') && norm(w.w));
const TOK = WORDS.map(w => norm(w.w));

let cursor = 0;
function find(phrase) {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = cursor; i <= TOK.length - p.length; i++) {
    if (p.every((w, k) => TOK[i + k] === w)) return [i, i + p.length - 1];
  }
  throw Error(`no cue "${phrase}" after word ${cursor} (${TOK.slice(cursor, cursor + 8).join(' ')})`);
}
const cue = phrase => { const [i] = find(phrase); cursor = i + 1; return WORDS[i].s + OFF; };
const cueEnd = phrase => { const [i, j] = find(phrase); cursor = j + 1; return WORDS[j].e + OFF; };
// look ahead without moving the cursor
const peek = phrase => { const c = cursor, t = cue(phrase); cursor = c; return t; };

function hash(a, b) {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
const cam = { z: 1, x: 0, y: 0, punch: 0, shake: 0, glow: .7, boost: 0, loop: 0, react: 0, lp: 0, rp: 0 };

function sfx(t, file, gain = 1) { window.SFX.push({ t: +t.toFixed(3), file, gain }); }
function scene(sel, a, b) {
  tl.set(sel, { autoAlpha: 1 }, a);
  tl.fromTo(sel, { opacity: 0, scale: .975 }, { opacity: 1, scale: 1, duration: .45, ease: 'power2.out', immediateRender: false }, a);
  if (b != null) {
    tl.to(sel, { opacity: 0, scale: 1.02, duration: .32, ease: 'power2.in' }, b - .32);
    tl.set(sel, { autoAlpha: 0 }, b);
  }
}
function pop(sel, t, from = { y: 40 }, dur = .6) {
  tl.fromTo(sel, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: dur, ease: 'expo.out', immediateRender: false }, t);
}
const hide = sel => tl.set(sel, { opacity: 0 }, 0);
function on(sel, t, cls) { tl.set(sel, { attr: { class: cls } }, t); }
function impact(t, k = 1, file = 'impact_2', gain = .7) {
  tl.fromTo(cam, { shake: k }, { shake: 0, duration: .6, ease: 'power3.out', immediateRender: false }, t);
  tl.fromTo(cam, { punch: .035 * k }, { punch: 0, duration: .7, ease: 'expo.out', immediateRender: false }, t);
  tl.fromTo('#flash', { opacity: .32 * k }, { opacity: 0, duration: .55, ease: 'power2.out', immediateRender: false }, t);
  if (file) sfx(t, file, gain);
}
function whoosh(t, file = 'whoosh_1', gain = .6) {
  tl.set('#streak', { top: 540, opacity: 1 }, t);
  tl.fromTo('#streak', { x: 0 }, { x: 2600, duration: .45, ease: 'power2.inOut', immediateRender: false }, t);
  tl.set('#streak', { opacity: 0 }, t + .46);
  tl.to(cam, { boost: '+=0.3', duration: .8, ease: 'power2.inOut' }, t - .1);
  sfx(t - .1, file, gain);
}
const blip = (t, n = 1, g = .3) => sfx(t, 'blips_' + n, g);
function words(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="tw">${w}</span>`).join(' ');
  return [...el.querySelectorAll('.tw')];
}
function maskWords(el) {
  el.innerHTML = el.innerHTML.trim().split(/\s+(?![^<]*>)/).map(w => `<span class="wm"><span class="wi">${w}</span></span>`).join(' ');
  return [...el.querySelectorAll('.wi')];
}
const svgEl = (tag, attrs) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
function node(parent, x, y, html, cls = 'nd') {
  const d = document.createElement('div');
  d.className = cls; d.innerHTML = html;
  Object.assign(d.style, { left: x + 'px', top: y + 'px' });
  parent.appendChild(d);
  gsap.set(d, { xPercent: -50, yPercent: -50 });
  return d;
}
function edge(svg, d, cls = 'edge') { const p = svgEl('path', { d, class: cls }); svg.appendChild(p); return p; }

// ---------------------------------------------------------------- background
const bg = $('#bg').getContext('2d');
const R = rng(23);
const PARTS = Array.from({ length: 150 }, () => ({ x: (R() - .5) * 2.6, y: (R() - .5) * 1.6, z: R(), s: .5 + R() * 1.8, tw: R() * 6.28, hot: R() < .16 }));
const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
{ const g = sprite.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(225,240,255,1)'); r.addColorStop(.18, 'rgba(34,211,238,.85)'); r.addColorStop(.45, 'rgba(79,139,255,.22)'); r.addColorStop(1, 'rgba(79,139,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); }
function orb(x, y, r, c) {
  const g = bg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
  bg.fillStyle = g; bg.fillRect(x - r, y - r, r * 2, r * 2);
}
function drawBg(t) {
  const travel = t * .03 + cam.boost;
  const base = bg.createRadialGradient(960, 470, 0, 960, 540, 1250);
  base.addColorStop(0, '#141d38'); base.addColorStop(.55, '#0a1022'); base.addColorStop(1, '#04060d');
  bg.globalCompositeOperation = 'source-over';
  bg.fillStyle = base; bg.fillRect(0, 0, 1920, 1080);
  bg.globalCompositeOperation = 'lighter';
  orb(960 + Math.sin(t * .17) * 460, 430 + Math.cos(t * .13) * 140, 950, `rgba(79,139,255,${.1 * cam.glow})`);
  orb(260 + Math.cos(t * .11) * 220, 930, 760, 'rgba(99,102,241,.08)');
  orb(1700, 160 + Math.sin(t * .09) * 90, 640, 'rgba(34,211,238,.05)');
  for (const p of PARTS) {
    const z = ((p.z - travel) % 1 + 1) % 1, sc = 1 / (.12 + z * 1.3);
    const x = 960 + p.x * 620 * sc, y = 540 + p.y * 620 * sc;
    if (x < -80 || x > 2000 || y < -80 || y > 1160) continue;
    const s = p.s * sc * (p.hot ? 3 : 1.5);
    const a = clamp(z * 3) * clamp((1 - z) * 4) * (.4 + .6 * Math.sin(t * 1.3 + p.tw) ** 2) * (p.hot ? .4 : .6);
    bg.globalAlpha = a; bg.drawImage(sprite, x - s, y - s, s * 2, s * 2);
  }
  bg.globalAlpha = 1;
  bg.globalCompositeOperation = 'source-over';
}

// ---------------------------------------------------------------- overlays
const camEl = $('#cam');
function drawCam(t) {
  const sx = cam.shake * 12 * (Math.sin(t * 93) + .6 * Math.sin(t * 141 + 1.3));
  const sy = cam.shake * 9 * (Math.sin(t * 87 + 2.1) + .6 * Math.sin(t * 133));
  const x = cam.x + Math.sin(t * .29) * 8 + sx, y = cam.y + Math.cos(t * .21) * 6 + sy;
  const z = cam.z * (1 + .01 * Math.sin(t * .23)) * (1 + cam.punch);
  camEl.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${z.toFixed(4)})`;
}
const CHAPTERS = [];
let hudEnd = END;
function drawHud(t) {
  let c = CHAPTERS[0];
  for (const ch of CHAPTERS) if (t >= ch[0]) c = ch;
  const num = $('#hud-num'), chap = $('#hud-chap');
  if (num.textContent !== c[1]) { num.textContent = c[1]; chap.textContent = c[2]; }
  $('#hud-prog').style.width = (clamp(t / hudEnd) * 100).toFixed(2) + '%';
}
const grain = $('#grain');
function drawGrain(t) {
  const f = Math.floor(t * 30);
  grain.style.backgroundPosition = `${Math.floor(hash(f, 1) * 256)}px ${Math.floor(hash(f, 2) * 256)}px`;
}
function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), d = g.createImageData(256, 256), r = rng(5);
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  grain.style.backgroundImage = `url(${c.toDataURL()})`;
}
// dots that travel along a path while their scene is up
const runners = [];
function runner(path, dot, key) { runners.push({ path, dot, key, len: path.getTotalLength() }); }
function drawRunners() {
  for (const r of runners) {
    const p = r.path.getPointAtLength((((cam[r.key] % 1) + 1) % 1) * r.len);
    r.dot.setAttribute('cx', p.x.toFixed(1)); r.dot.setAttribute('cy', p.y.toFixed(1));
  }
}

// ---------------------------------------------------------------- the edit
function build() {
  makeGrain();
  gsap.set('.lp, .au-lab', { xPercent: -50, yPercent: -50 });
  gsap.set('.au-lab', { yPercent: 0 });
  gsap.set('.au-card', { xPercent: -50 });

  // chapter cards
  const chapData = [['01', 'NUMBER ONE', 'What an agent actually is'], ['02', 'NUMBER TWO', 'The four parts'], ['03', 'NUMBER THREE', 'How much freedom you give it'], ['04', 'NUMBER FOUR', 'The five patterns'], ['05', 'NUMBER FIVE', 'The three frameworks']];
  $('#chapters').innerHTML = chapData.map(([n, tag, h], i) =>
    `<section class="scene chap" id="c${i + 1}"><div class="num">${n}</div><div class="tx"><div class="tag">${tag}</div><h1 id="c${i + 1}-h">${h}</h1></div></section>`).join('');
  function chapter(i, a, b) {
    const sel = `#c${i}`;
    scene(sel, a, b);
    tl.fromTo(`${sel} .num`, { x: -160, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'expo.out', immediateRender: false }, a);
    tl.fromTo(`${sel} .tag`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, immediateRender: false }, a + .12);
    const ws = maskWords($(`${sel}-h`));
    tl.fromTo(ws, { yPercent: 110 }, { yPercent: 0, duration: .55, ease: 'expo.out', stagger: .06, immediateRender: false }, a + .2);
    whoosh(a - .05, 'whoosh_' + (1 + (i % 4)), .55);
    impact(a + .15, .5, 'impact_2', .35);
  }

  // ---- hook ---------------------------------------------------------------
  const T0 = OFF - .3;
  tl.to('#black', { opacity: 0, duration: .5, ease: 'none' }, 0);
  const tTitle = peek('story of ai agents');
  scene('#s-hook', T0, tTitle - .05);
  pop('#hk-bot', cue('chatbot') - .1, { x: -80 });
  sfx(OFF, 'whoosh_2', .4);
  const bub = words($('#hk-bubble'));
  const tB0 = cue('how to fix'), tB1 = peek('an ai agent');
  bub.forEach((w, k) => tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: .12, ease: 'none', immediateRender: false }, tB0 + (tB1 - tB0 - .2) * k / bub.length));
  blip(tB0, 2, .2);
  pop('#hk-agent', cue('an ai agent') - .1, { x: 80 });
  sfx(peek('agent') - .1, 'whoosh_3', .4);
  [['#hk-a1', 'opens'], ['#hk-a2', 'finds'], ['#hk-a3', 'writes the fix'], ['#hk-approve', 'approve']].forEach(([s, w], k) => {
    const t = cue(w) - .05; pop(s, t, { x: 30 }, .45); blip(t, 1 + (k % 4), .28);
  });
  const tGap = cue('that gap');
  tl.fromTo('#hk-gap', { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: .5, ease: 'expo.out', immediateRender: false }, tGap);
  tl.to('#hk-bot', { x: -60, opacity: .55, duration: .6 }, tGap);
  tl.to('#hk-agent', { x: 60, duration: .6 }, tGap);
  sfx(tTitle - 1.62, 'riser', .5);

  // ---- title --------------------------------------------------------------
  const tPromise = peek('in this video');
  scene('#s-title', tTitle, tPromise - .05);
  cue('story of ai agents');
  tl.fromTo('#ti-big', { scale: 1.25, opacity: 0, letterSpacing: '.08em' }, { scale: 1, opacity: 1, letterSpacing: '-.04em', duration: .8, ease: 'expo.out', immediateRender: false }, tTitle);
  tl.fromTo('#ti-sub', { opacity: 0, letterSpacing: '1.2em' }, { opacity: 1, letterSpacing: '.5em', duration: .9, ease: 'expo.out', immediateRender: false }, tTitle + .15);
  impact(tTitle, 1.1, 'impact_1', .7);

  // ---- promise ------------------------------------------------------------
  const tC1 = peek('number one');
  scene('#s-promise', tPromise, tC1 - .02);       // the channel intro is spliced in here
  cue('in this video');
  pop('#pr-head', tPromise + .1, { y: 20 });
  [['#pr1', 'actually is'], ['#pr2', 'four parts'], ['#pr3', 'five patterns'], ['#pr4', 'three frameworks']].forEach(([s, w], k) => {
    const t = cue(w) - .1; pop(s, t, { y: 50, scale: .96 }); blip(t, 1 + k, .25);
  });
  const tWarn = cue('one framework');
  tl.to('.pr-item', { opacity: .35, duration: .4 }, tWarn);
  pop('#pr-warn', tWarn, { y: 60 });
  const tStamp = cue('no longer maintained');
  tl.fromTo('#pr-stamp', { scale: 2.2, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -8, duration: .35, ease: 'back.out(2)', immediateRender: false }, tStamp);
  impact(tStamp + .1, .9, 'impact_2', .6);

  // ---- 01 what an agent is ------------------------------------------------
  const tSteps = peek('the first step');
  chapter(1, cue('number one'), tSteps);
  CHAPTERS.push([0, '00', 'INTRO'], [tC1, '01', 'WHAT IT IS']);
  const tC2 = peek('number two');
  scene('#s-steps', tSteps, tC2 - .02);
  pop('#st-rules', cue('the first step') - .1, { y: 80 });
  hide(['#st-llm', '#st-agent', '#st-unk', '#st-touch', '#st-think', '#st-do']);
  const tUnk = cue('nobody planned');
  pop('#st-unk', tUnk - .2, { x: 40 }); blip(tUnk, 4, .3);
  const tLlm = cue('the second step');
  tl.to('#st-rules', { opacity: .4, duration: .4 }, tLlm);
  pop('#st-llm', tLlm - .1, { y: 80 }); sfx(tLlm - .15, 'whoosh_2', .35);
  [['#st-v1', 'read'], ['#st-v2', 'reason'], ['#st-v3', 'write']].forEach(([s, w], k) => { const t = cue(w) - .05; pop(s, t, { x: 30 }, .4); blip(t, 1 + k, .2); });
  const tTouch = cue("can't touch");
  pop('#st-touch', tTouch, { scale: 1.3 }, .35); impact(tTouch + .1, .5, 'impact_2', .35);
  const tAgent = cue('the third step');
  tl.to('#st-llm', { opacity: .4, duration: .4 }, tAgent);
  pop('#st-agent', tAgent - .1, { y: 80 }); sfx(tAgent - .15, 'whoosh_3', .35);
  tl.fromTo('#st-ring', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut', immediateRender: false }, cue('running in a loop') - .1);
  const tLook = cue('looks at');
  [['#st-l1', tLook], ['#st-l2', cue('decides')], ['#st-l3', cue('takes it')], ['#st-l4', cue('checks what happened')]].forEach(([s, t], k) => { pop(s, t - .05, { scale: .6 }, .4); blip(t, 1 + k, .22); });
  tl.fromTo(cam, { loop: 0 }, { loop: 9, duration: tC2 - tLook, ease: 'none', immediateRender: false }, tLook);
  const tThink = cue('thinking part');
  tl.to(['#st-rules'], { opacity: .25, duration: .4 }, tThink);
  tl.to('#st-llm', { opacity: 1, duration: .3 }, tThink);
  pop('#st-think', tThink, { y: 30 }); blip(tThink, 3, .3);
  const tDo = cue('doing part');
  pop('#st-do', tDo, { y: 30 }); impact(tDo, .6, 'impact_2', .4);

  // ---- 02 the four parts --------------------------------------------------
  const tParts = peek('the model is the brain');
  chapter(2, cue('number two'), tParts);
  CHAPTERS.push([tC2, '02', 'FOUR PARTS']);
  const tC3 = peek('number three');
  scene('#s-parts', tParts, tC3 - .02);
  hide(['#pt1', '#pt2', '#pt3', '#pt4', '.mini-pt', '#inc', '.inc-row']);
  [['#pt1', 'the model is the brain'], ['#pt2', 'tools are the hands'], ['#pt3', 'memory is'], ['#pt4', 'the loop is']].forEach(([s, w], k) => {
    const t = cue(w) - .1; pop(s, t, { y: 70 }); sfx(t, 'whoosh_' + (1 + k), .3);
    on(s, t, 'pt glass lit');
    if (k) on(['#pt1', '#pt2', '#pt3'][k - 1], t, 'pt glass');
  });
  const tInc = cue("let's say a pipeline");
  on('#pt4', tInc, 'pt glass');
  tl.to(['#pt1', '#pt2', '#pt3', '#pt4'], { opacity: 0, y: -40, duration: .35, stagger: .04, ease: 'power2.in' }, tInc - .3);
  tl.fromTo('.mini-pt', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .06, ease: 'expo.out', immediateRender: false }, tInc + .05);
  pop('#inc', tInc + .1, { x: 80 });
  impact(cue('fails') + .05, .7, 'impact_2', .45);
  [['#ir1', '#mp1', 'reads the error'], ['#ir2', '#mp2', 'a tool pulls'], ['#ir3', '#mp3', 'memory remembers'], ['#ir4', '#mp4', 'the loop keeps']].forEach(([r, m, w], k) => {
    const t = cue(w) - .05; pop(r, t, { x: 30 }, .45); blip(t, 1 + k, .25);
    on(m, t, 'mini-pt glass lit');
    if (k) on(['#mp1', '#mp2', '#mp3'][k - 1], t, 'mini-pt glass');
  });
  const tPass = cue('test passes');
  on('#mp4', tPass + .6, 'mini-pt glass');
  tl.set('#inc-st-t', { textContent: 'FIXED' }, tPass);
  tl.set('#inc-st', { color: '#34D399' }, tPass);
  tl.set('#inc-st i', { background: '#34D399', boxShadow: '0 0 16px #34D399' }, tPass);
  tl.set('#inc-res', { textContent: '✓ PIPELINE GREEN', color: '#34D399', background: 'rgba(52,211,153,.1)', border: '2px solid #34D399' }, tPass);
  pop('#inc-res', tPass, { scale: .9 }, .4); blip(tPass, 4, .3);
  const tAway = cue('take away');
  tl.to(['#mp3', '#ir3'], { opacity: .15, duration: .4 }, tAway);
  const tFall = cue('falls apart');
  tl.set('#inc-st-t', { textContent: 'FAILED' }, tFall);
  tl.set('#inc-st', { color: '#F43F5E' }, tFall);
  tl.set('#inc-st i', { background: '#F43F5E', boxShadow: '0 0 16px #F43F5E' }, tFall);
  tl.set('#inc-res', { textContent: '✕ IT FALLS APART', color: '#F43F5E', background: 'rgba(244,63,94,.1)', border: '2px solid #F43F5E' }, tFall);
  tl.to('#inc', { rotation: -1.2, y: 14, duration: .5, ease: 'back.out(3)' }, tFall);
  impact(tFall, 1, 'impact_1', .55);

  // ---- 03 autonomy --------------------------------------------------------
  const tAuto = peek('autonomy just means');
  chapter(3, cue('number three'), tAuto);
  CHAPTERS.push([tC3, '03', 'AUTONOMY']);
  const tLanes = peek("then there's how");
  scene('#s-auto', tAuto, tLanes - .02);
  hide(['.au-card', '#me1', '#me2', '#au-rule', '#au-track']);
  pop('#au-head', tAuto, { y: 30 });
  pop('#au-track', tAuto + .4, { y: 20 });
  const knob = (p, t, d = .7) => {
    tl.to('#au-knob', { left: p + '%', duration: d, ease: 'power3.inOut' }, t);
    tl.to('#au-fill', { width: p + '%', duration: d, ease: 'power3.inOut' }, t);
  };
  tl.set('#au-knob', { left: '0%' }, 0); tl.set('#au-fill', { width: '0%' }, 0);
  const tLow = cue('at the low end');
  pop('#au-c1', tLow, { y: 40 }); blip(tLow, 1, .25);
  const tMid = cue('in the middle');
  knob(50, tMid - .1); pop('#au-c2', tMid, { y: 40 }); blip(tMid, 2, .25);
  tl.to('#au-c1', { opacity: .45, duration: .3 }, tMid);
  const tHigh = cue('at the high end');
  knob(100, tHigh - .1); pop('#au-c3', tHigh, { y: 40 }); blip(tHigh, 3, .25);
  tl.to('#au-c2', { opacity: .45, duration: .3 }, tHigh);
  const tMess = cue('messier');
  tl.set('#me1-b', { width: '0%' }, 0); tl.set('#me2-b', { width: '0%' }, 0);
  pop(['#me1', '#me2'], tMess - .3, { y: 30 });
  tl.fromTo('#me1-b', { width: '30%' }, { width: '92%', duration: .9, immediateRender: false }, tMess);
  tl.fromTo('#me2-b', { width: '85%' }, { width: '85%', duration: .1, immediateRender: false }, tMess);
  const tHard = cue('harder to predict');
  tl.to('#me2-b', { width: '22%', duration: .9 }, tHard);
  sfx(tHard, 'blips_4', .25);
  const tRule = cue('honest advice');
  tl.to(['#me1', '#me2'], { opacity: 0, duration: .3 }, tRule - .1);
  const tLeast = cue('least freedom');
  knob(50, tLeast - .2, .8);
  tl.to(['#au-c1', '#au-c3'], { opacity: .3, duration: .3 }, tLeast);
  tl.to('#au-c2', { opacity: 1, duration: .3 }, tLeast);
  pop('#au-rule', tLeast + .1, { y: 40, scale: .95 });
  impact(tLeast + .2, .6, 'impact_2', .4);

  // ---- 03b linear vs parallel ---------------------------------------------
  const tC4 = peek('number four');
  scene('#s-lanes', tLanes, tC4 - .02);
  cue("then there's how");
  // build the two lanes
  const s1 = $('#ln-svg1'), s2 = $('#ln-svg2'), L1 = $('#ln-lin'), L2 = $('#ln-par');
  s1.setAttribute('viewBox', '0 0 1620 260'); s2.setAttribute('viewBox', '0 0 1620 400');
  const linNames = ['check orders', 'check users', 'check payments'];
  const lin = linNames.map((n, i) => node(L1, 300 + i * 520, 160, n, 'nd'));
  const linW = [edge(s1, 'M440,160 H680'), edge(s1, 'M960,160 H1200')];
  const pStart = node(L2, 160, 230, 'start', 'nd'), pEnd = node(L2, 1440, 230, 'combine', 'nd');
  const par = linNames.map((n, i) => node(L2, 800, 120 + i * 110, n, 'nd'));
  const parW = [];
  par.forEach((_, i) => { const y = 120 + i * 110; parW.push(edge(s2, `M235,230 C450,230 450,${y} 650,${y}`), edge(s2, `M950,${y} C1150,${y} 1150,230 1340,230`)); });
  $('#ln-t1').textContent = '3 CALLS · IN A ROW'; $('#ln-t2').textContent = '3 CALLS · AT ONCE';
  hide([L1, L2, '#ln-cost', ...lin, ...par, pStart, pEnd]);
  tl.set([...linW, ...parW], { drawSVG: '0%' }, 0);
  const tLin = cue('linear means');
  pop(L1, tLin - .4, { y: 40 });
  lin.forEach((b, i) => { const t = tLin + .2 + i * .55; pop(b, t, { scale: .8 }, .4); on(b, t, 'nd on'); if (i) { on(lin[i - 1], t, 'nd'); tl.to(linW[i - 1], { drawSVG: '100%', duration: .35 }, t - .3); } blip(t, 1 + i, .22); });
  const tPar = cue('parallel means');
  on(lin[2], tPar, 'nd');
  pop(L2, tPar - .3, { y: 40 });
  pop(pStart, tPar + .1, { scale: .8 }, .4);
  const tSame = cue('same time');
  tl.to(parW.filter((_, i) => i % 2 === 0), { drawSVG: '100%', duration: .4 }, tSame - .35);
  par.forEach(b => { pop(b, tSame - .05, { scale: .8 }, .4); on(b, tSame, 'nd on'); });
  blip(tSame, 4, .3);
  const tComb = cue('combined');
  tl.to(parW.filter((_, i) => i % 2 === 1), { drawSVG: '100%', duration: .4 }, tComb - .4);
  par.forEach(b => on(b, tComb, 'nd'));
  pop(pEnd, tComb - .05, { scale: .8 }, .4); on(pEnd, tComb, 'nd on');
  const tPay = cue('you pay');
  pop('#ln-cost', tPay - .1, { y: 30 });
  tl.fromTo('#ln-cost .coin', { scale: 0 }, { scale: 1, duration: .35, ease: 'back.out(2.5)', stagger: .12, immediateRender: false }, tPay + .1);
  sfx(tPay + .1, 'blips_2', .3);

  // ---- 04 patterns --------------------------------------------------------
  const tPat = peek('pattern one');
  chapter(4, cue('number four'), tPat);
  CHAPTERS.push([tC4, '04', 'PATTERNS']);
  const tC5 = peek('number five');
  scene('#s-pat', tPat, tC5 - .02);
  const rail = $('#pa-rail');
  const names = ['ReAct', 'Reflection', 'Plan and execute', 'Multi-agent', 'Swarm'];
  rail.innerHTML = names.map((n, i) => `<div class="pa-it" id="ri${i + 1}"><span class="n">${i + 1}</span>${n}</div>`).join('');
  tl.fromTo('.pa-it', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .5, stagger: .07, ease: 'expo.out', immediateRender: false }, tPat);
  tl.set('.pa', { autoAlpha: 0 }, 0);
  const starts = ['pattern one', 'pattern two', 'pattern three', 'pattern four', 'pattern five'].map(peekAll());
  function peekAll() { let c = cursor; return p => { const s = cursor; cursor = c; const t = cue(p); c = cursor; cursor = s; return t; }; }
  starts.forEach((t, i) => {
    const sel = `#pa${i + 1}`, end = i < 4 ? starts[i + 1] : tC5 - .02;
    tl.set(sel, { autoAlpha: 1 }, t - .1);
    tl.fromTo(sel, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .5, ease: 'expo.out', immediateRender: false }, t - .1);
    if (i < 4) { tl.to(sel, { opacity: 0, x: -40, duration: .25, ease: 'power2.in' }, end - .35); tl.set(sel, { autoAlpha: 0 }, end - .1); }
    on(`#ri${i + 1}`, t - .1, 'pa-it on');
    if (i) on(`#ri${i}`, t - .1, 'pa-it done');
    sfx(t - .15, 'whoosh_' + (1 + (i % 4)), .3);
  });
  // diagrams live in each panel, drawn in panel coordinates
  const panelSvg = sel => { const s = svgEl('svg', { class: 'dg', viewBox: '0 0 1070 660' }); $(sel).appendChild(s); return s; };
  const pill = (sel, x, y, text, kind) => { const p = document.createElement('div'); p.className = 'pill ' + kind; p.textContent = text; Object.assign(p.style, { left: x + 'px', top: y + 'px' }); $(sel).appendChild(p); return p; };
  // P1 ReAct
  {
    const sv = panelSvg('#pa1');
    const path = edge(sv, 'M200,290 L535,290 L870,290 C870,410 200,410 200,290');
    const dot = svgEl('circle', { r: 11, fill: '#22D3EE', style: 'filter:drop-shadow(0 0 10px #22D3EE)' }); sv.appendChild(dot);
    const n = [node($('#pa1'), 200, 290, 'THINK'), node($('#pa1'), 535, 290, 'ACT'), node($('#pa1'), 870, 290, 'OBSERVE')];
    const log = document.createElement('div'); log.className = 'logl'; Object.assign(log.style, { position: 'absolute', left: '60px', top: '440px' });
    log.innerHTML = '<div id="lg1"><b>thought</b> the job failed, read the logs</div><div id="lg2"><b>action</b> get_logs("orders_daily")</div><div id="lg3"><b>observation</b> cast error on order_ts</div>';
    $('#pa1').appendChild(log);
    const go = pill('#pa1', 760, 60, 'START HERE', 'good');
    runner(path, dot, 'react');
    hide([...n, '#lg1', '#lg2', '#lg3', go, path, dot]);
    tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', opacity: 1, duration: .9, ease: 'power2.inOut', immediateRender: false }, cue('short for'));
    const tTh = cue('the agent thinks'), tAc = cue('takes one action'), tOb = cue('looks at the result');
    [[n[0], '#lg1', tTh], [n[1], '#lg2', tAc], [n[2], '#lg3', tOb]].forEach(([nd, lg, t], k) => {
      pop(nd, t - .05, { scale: .7 }, .4); pop(lg, t, { x: 20 }, .4); on(nd, t, 'nd on'); if (k) on(n[k - 1], t, 'nd'); blip(t, 1 + k, .22);
    });
    const tAgain = cue('thinks again');
    tl.to(dot, { opacity: 1, duration: .2 }, tAgain);
    on(n[2], tAgain, 'nd');
    tl.fromTo(cam, { react: 0 }, { react: 6, duration: starts[1] - tAgain, ease: 'none', immediateRender: false }, tAgain);
    const tGo = cue('where you should start');
    pop(go, tGo, { scale: 1.4 }, .35); impact(tGo + .1, .5, 'impact_2', .35);
  }
  // P2 Reflection
  {
    const mk = (x, html, id) => { const d = document.createElement('div'); d.className = 'doc'; d.id = id; d.innerHTML = html; Object.assign(d.style, { left: x + 'px', top: '200px', width: '300px' }); $('#pa2').appendChild(d); return d; };
    const sql = 'SELECT region,<br>&nbsp;&nbsp;SUM(amount)<br>FROM orders';
    const d1 = mk(48, `<div class="dim">DRAFT</div>${sql}`, 'rf1');
    const d2 = mk(385, `<div class="dim">CHECK</div>SELECT region,<br>&nbsp;&nbsp;SUM(amount)<br><span class="bad">FROM orders</span><br><span class="no">✕ no GROUP BY</span>`, 'rf2');
    const d3 = mk(722, `<div class="dim">FIXED</div>${sql}<br><span class="ok">GROUP BY region ✓</span>`, 'rf3');
    const good = pill('#pa2', 300, 520, 'A SECOND LOOK CATCHES REAL MISTAKES', 'good');
    hide([d1, d2, d3, good]);
    [[d1, 'first draft'], [d2, 'checks its own work'], [d3, 'fixes it']].forEach(([d, w], k) => { const t = cue(w) - .1; pop(d, t, { y: 40 }); blip(t, 1 + k, .22); });
    tl.to(d3, { borderColor: '#34D399', boxShadow: '0 0 40px rgba(52,211,153,.3)', duration: .3 }, peek('great for sql'));
    const tCatch = cue('catches real mistakes');
    pop(good, tCatch - .2, { scale: .9 }, .4);
  }
  // P3 Plan and execute
  {
    const plan = document.createElement('div'); plan.className = 'plan'; $('#pa3').appendChild(plan);
    const steps = ['pull the failed run', 'read the logs', 'patch the transform', 'rerun the tests'];
    plan.innerHTML = steps.map((s, i) => `<div class="pl" id="pl${i + 1}"><span class="bx" id="plx${i + 1}"></span><span>${i + 1}. ${i === 2 ? '<span id="pl3a">' + s + '</span><span id="pl3b" style="display:none"></span>' : s}</span></div>`).join('');
    $('#pl3b').outerHTML = '';
    const p3n = document.createElement('div'); p3n.className = 'pl'; p3n.id = 'pl3n'; Object.assign(p3n.style, { position: 'absolute', left: '0', right: '0', top: '0' });
    $('#pl3').style.position = 'relative'; p3n.innerHTML = '<span class="bx" id="plx3n"></span><span>3. cast order_ts first</span>'; $('#pl3').appendChild(p3n);
    Object.assign(p3n.style, { margin: '-1.5px', background: '#101831', borderColor: 'rgba(34,211,238,.6)' });
    const planner = node($('#pa3'), 820, 280, 'PLANNER<br><span class="dim" style="font-size:22px">runs once</span>', 'nd lead');
    const rp = pill('#pa3', 700, 400, 'RE-PLAN', 'warn');
    const cheap = pill('#pa3', 640, 520, 'BIG THINKING ONCE = CHEAPER', 'good');
    hide(['.pl', planner, rp, cheap, p3n]);
    const tPlan = cue('writes the whole plan');
    pop(planner, tPlan - .3, { scale: .8 }, .45);
    tl.fromTo('#pa3 .pl:not(#pl3n)', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .45, stagger: .12, ease: 'expo.out', immediateRender: false }, tPlan);
    const tick = (id, t, ok = true) => { tl.set(id, { textContent: ok ? '✓' : '✕', color: ok ? '#34D399' : '#F43F5E', borderColor: ok ? '#34D399' : '#F43F5E' }, t); blip(t, ok ? 1 : 4, .22); };
    const tRun = cue('one by one');
    tick('#plx1', tRun - .3); tick('#plx2', tRun + .2);
    const tFail = cue('if a step fails');
    tick('#plx3', tFail + .2, false);
    tl.to('#pl3', { borderColor: '#F43F5E', duration: .2 }, tFail + .2);
    const tNew = cue('new plan');
    pop(rp, tNew - .5, { scale: 1.3 }, .35);
    tl.to(p3n, { opacity: 1, duration: .3 }, tNew - .1);
    tick('#plx3n', tNew + .4); tick('#plx4', tNew + .8);
    const tCheap = cue('cheaper');
    pop(cheap, tCheap - .2, { scale: .9 }, .4);
  }
  // P4 Multi-agent
  {
    const sv = panelSvg('#pa4');
    const lead = node($('#pa4'), 535, 250, 'LEAD AGENT', 'nd lead');
    const sp = [[200, 'SQL WRITER'], [535, 'CHECKER'], [870, 'SUMMARY']].map(([x, n]) => node($('#pa4'), x, 480, n));
    const ed = [200, 535, 870].map(x => edge(sv, `M535,285 C535,380 ${x},370 ${x},445`));
    hide([lead, ...sp]); tl.set(ed, { drawSVG: '0%' }, 0);
    const tLead = cue('a lead agent');
    pop(lead, tLead - .1, { scale: .7 }, .45); blip(tLead, 1, .25);
    tl.to(ed, { drawSVG: '100%', duration: .6, stagger: .1 }, cue('splits the job'));
    [[0, 'writes the query'], [1, 'checks it'], [2, 'writes the summary']].forEach(([i, w]) => { const t = cue(w) - .1; pop(sp[i], t, { y: 30, scale: .8 }, .4); on(sp[i], t, 'nd on'); if (i) on(sp[i - 1], t, 'nd'); blip(t, 2 + i, .22); });
  }
  // P5 Swarm
  {
    const sv = panelSvg('#pa5');
    const P = [[535, 250, 'TRIAGE'], [835, 400, 'SQL'], [535, 550, 'DOCS'], [235, 400, 'REVIEW']];
    const mesh = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) mesh.push(edge(sv, `M${P[i][0]},${P[i][1]} L${P[j][0]},${P[j][1]}`, 'edge dash'));
    const nds = P.map(([x, y, n]) => node($('#pa5'), x, y, n));
    // the token sits in its own layer above the node boxes
    const tok = svgEl('circle', { r: 13, fill: '#22D3EE', style: 'filter:drop-shadow(0 0 14px #22D3EE)', cx: P[0][0], cy: P[0][1] - 44 }); panelSvg('#pa5').appendChild(tok);
    const noboss = pill('#pa5', 470, 380, 'NO LEAD', 'warn');
    const dbg = pill('#pa5', 720, 130, 'HARDEST TO DEBUG', 'warn');
    const last = pill('#pa5', 760, 560, 'USE IT LAST', 'info');
    hide([...nds, tok, noboss, dbg, last]); tl.set(mesh, { drawSVG: '0%' }, 0);
    tl.fromTo(nds, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .45, stagger: .08, ease: 'back.out(2)', immediateRender: false }, starts[4] + .3);
    tl.to(mesh, { drawSVG: '100%', duration: .6, stagger: .05 }, starts[4] + .6);
    const tBoss = cue('no boss');
    pop(noboss, tBoss - .1, { scale: 1.4 }, .35); impact(tBoss, .4, 'impact_2', .3);
    const tHand = cue('hand the task');
    tl.to(noboss, { opacity: 0, duration: .3 }, tHand);
    tl.to(tok, { opacity: 1, duration: .2 }, tHand);
    const hops = [1, 3, 2, 0, 1];
    on(nds[0], tHand, 'nd on');
    hops.forEach((h, k) => {
      const t = tHand + .3 + k * .55, prev = k ? hops[k - 1] : 0;
      tl.to(tok, { attr: { cx: P[h][0], cy: P[h][1] - 44 }, duration: .4, ease: 'power2.inOut' }, t);
      on(nds[prev], t + .2, 'nd'); on(nds[h], t + .35, 'nd on');
      blip(t + .35, 1 + (k % 4), .15);
    });
    const tDbg = cue('hardest one to debug');
    tl.to(mesh, { stroke: 'rgba(244,63,94,.6)', duration: .4 }, tDbg);
    pop(dbg, tDbg, { scale: 1.3 }, .35);
    pop(last, cue('save it for last') - .1, { y: 20 }, .4);
  }

  // ---- 05 frameworks ------------------------------------------------------
  const tFw1 = peek('lets you draw');
  chapter(5, cue('number five'), tFw1 - .2);
  CHAPTERS.push([tC5, '05', 'FRAMEWORKS']);
  const tFw2 = peek('lets you describe');
  scene('#s-fw1', tFw1 - .2, tFw2 - .3);
  {
    const st = $('#fw1-stage'), sv = $('#fw1-svg'); sv.setAttribute('viewBox', '0 0 950 700');
    const N = { start: [110, 150, 'START'], plan: [330, 150, 'plan'], tool: [580, 150, 'run tool'], chk: [810, 150, 'tests pass?'], ok: [810, 380, '⏸ human approval'], end: [810, 590, 'END'] };
    const nd = {}; for (const k in N) nd[k] = node(st, N[k][0], N[k][1], N[k][2]);
    const E = [edge(sv, 'M165,150 H265'), edge(sv, 'M395,150 H495'), edge(sv, 'M665,150 H715'), edge(sv, 'M810,190 V335'), edge(sv, 'M810,425 V550'), edge(sv, 'M810,110 C810,30 330,30 330,110', 'edge dash')];
    const no = document.createElement('div'); no.className = 'pill warn'; no.textContent = 'no → try again'; Object.assign(no.style, { left: '470px', top: '0px', fontSize: '22px' }); st.appendChild(no);
    const chk = document.createElement('div'); chk.className = 'pill info'; chk.innerHTML = '💾 state saved'; Object.assign(chk.style, { left: '60px', top: '560px' }); st.appendChild(chk);
    hide([...Object.values(nd), no, chk]); tl.set(E, { drawSVG: '0%' }, 0);
    pop('#s-fw1 .fw-head', tFw1 - .2, { x: -40 });
    pop('#fw1-stage', cue('lets you draw'), { x: 60 });
    const tNode = cue('each step is a node');
    tl.fromTo(Object.values(nd), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .4, stagger: .09, ease: 'back.out(2)', immediateRender: false }, tNode);
    blip(tNode, 2, .25);
    const tArr = cue('the arrows');
    tl.to(E, { drawSVG: '100%', duration: .5, stagger: .1 }, tArr);
    tl.to(no, { opacity: 1, duration: .3 }, tArr + .7);
    const tSave = cue('state gets saved');
    pop(chk, tSave - .1, { scale: .8 }, .4); blip(tSave, 4, .25);
    const tPause = cue('pause');
    on(nd.ok, tPause, 'nd on');
    const tHum = cue('human approval');
    tl.to(nd.ok, { scale: 1.12, duration: .3, yoyo: true, repeat: 1 }, tHum);
    const tCtl = cue('need control');
    tl.fromTo('#s-fw1 .tl', { scale: 1 }, { scale: 1.1, duration: .25, yoyo: true, repeat: 1, immediateRender: false }, tCtl);
    impact(tCtl, .4, 'impact_2', .3);
  }
  const tUp = peek("here's the update");
  scene('#s-fw2', tFw2 - .3, tUp - .1);
  {
    pop('#s-fw2 .fw-head', tFw2 - .3, { x: -40 });
    hide(['.role', '.role .goal', '.role p']);
    cue('lets you describe');
    [['#ro1', 'researcher'], ['#ro2', 'writer'], ['#ro3', 'reviewer']].forEach(([s, w], k) => { const t = cue(w) - .15; pop(s, t, { y: 60 }); blip(t, 1 + k, .25); });
    const tGoal = cue('its own goal');
    tl.to(['.role .goal', '.role p'], { opacity: 1, duration: .35, stagger: .05 }, tGoal - .3);
    const tFast = cue('fastest way');
    tl.fromTo('#s-fw2 .tl', { scale: 1 }, { scale: 1.1, duration: .25, yoyo: true, repeat: 1, immediateRender: false }, tFast);
    impact(tFast, .4, 'impact_2', .3);
  }
  const tWeek = peek("here's what i'd do");
  scene('#s-fw3', tUp - .1, tWeek - .05);
  {
    hide(['#fw-old', '#fw-stamp', '#up-arrow', '#fw-new', '.fw3']);
    cue("here's the update");
    const tAg = cue('autogen');
    pop('#fw-old', tAg - .2, { x: -60 }); sfx(tAg - .25, 'whoosh_2', .35);
    const tNo = cue('no longer maintained');
    tl.fromTo('#fw-stamp', { scale: 2.2, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -8, duration: .35, ease: 'back.out(2)', immediateRender: false }, tNo);
    impact(tNo + .1, 1, 'impact_1', .55);
    tl.to('#fw-old h3', { opacity: .4, duration: .4 }, tNo + .2);
    const tMs = cue('start with');
    tl.set('#up-arrow', { opacity: 1 }, tMs);
    tl.fromTo('#up-path', { drawSVG: '0%' }, { drawSVG: '100%', duration: .4, immediateRender: false }, tMs);
    tl.fromTo('#up-head', { drawSVG: '0%' }, { drawSVG: '100%', duration: .25, immediateRender: false }, tMs + .3);
    pop('#fw-new', cue('agent framework') - .3, { x: 60 }); sfx(peek('python') - 1, 'whoosh_3', .35);
    tl.fromTo('#fw-new .chip', { scale: 0 }, { scale: 1, duration: .35, ease: 'back.out(2.5)', stagger: .3, immediateRender: false }, cue('python') - .1);
    const tToday = cue('starting today');
    tl.fromTo('.fw3', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .55, stagger: .12, ease: 'expo.out', immediateRender: false }, tToday - .3);
    sfx(tToday - .3, 'blips_1', .25);
    impact(cue('that one instead'), .5, 'impact_2', .35);
  }

  // ---- this week ----------------------------------------------------------
  const tCta = peek('if this helped');
  scene('#s-week', tWeek, tCta - .05);
  CHAPTERS.push([tWeek, '✓', 'YOUR NEXT STEP']);
  {
    const grid = $('#wk-grid');
    grid.innerHTML = Array.from({ length: 10 }, () => '<div class="vt"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>').join('');
    hide(['.wk', '.vt', '#wk-built']);
    cue("here's what i'd do");
    [['#wk1', 'boring task'], ['#wk2', 'agent for it'], ['#wk3', 'with just'], ['#wk4', 'two tools']].forEach(([s, w], k) => {
      const t = cue(w) - .3; pop(s, t, { x: -40 }, .45); blip(t, 1 + k, .22);
      tl.set(`${s}-x`, { textContent: '✓', borderColor: '#34D399' }, t + .35);
    });
    const tWatch = cue('will watch');
    tl.fromTo('.vt', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, stagger: .05, ease: 'back.out(2)', immediateRender: false }, tWatch);
    sfx(tWatch, 'blips_3', .25);
    tl.to('.vt', { opacity: .25, duration: .4 }, cue('never build one'));
    const tB = cue('if you build one');
    pop('#wk-built', tB, { scale: .85 }, .5);
    impact(cue('already ahead'), .8, 'impact_1', .5);
  }

  // ---- CTA ----------------------------------------------------------------
  scene('#s-cta', tCta, null);
  {
    cue('if this helped');
    hide(['#cta-sub', '#cta-q', '#cta-word']);
    const tSub = cue('subscribe');
    pop('#cta-sub', tSub - .25, { scale: .7 }, .5);
    tl.to('#cta-sub', { scale: .94, duration: .1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, tSub + .35);
    impact(tSub + .35, .6, 'impact_2', .4);
    pop('#cta-q', cue('comments') - .2, { y: 40 });
    const tLast = cueEnd('build first');
    pop('#cta-word', tLast - .3, { y: 30 });
    sfx(tLast - .3, 'whoosh_4', .4);
    tl.to('#black', { opacity: 1, duration: .6, ease: 'none' }, END - .6);
  }
  hudEnd = tCta;
  tl.fromTo('#hud', { opacity: 0 }, { opacity: 1, duration: .6, immediateRender: false }, tPromise);
  tl.to('#hud', { opacity: 0, duration: .4 }, tCta);
  hide('#hud');

  window.render = t => {
    tl.seek(t, false);
    drawRunners(); drawCam(t); drawHud(t); drawGrain(t); drawBg(t);
  };
  window.SPLICE = tC1 - .02;
  window.MARKS = { tTitle, tPromise, tC1, tSteps, tC2, tParts, tC3, tAuto, tLanes, tC4, tPat, starts, tC5, tFw1, tFw2, tUp, tWeek, tCta };
  window.render(0);
  window.READY = true;
}

document.fonts.ready.then(() => requestAnimationFrame(() => { try { build(); } catch (e) { console.error(e); window.BUILD_ERROR = String(e && e.stack || e); throw e; } }));
