// RAG, explained: the story. index.html (1920×1080) lays the elements out,
// and this file reads positions back from the page. Shared helpers (cues,
// timeline, icons, background, opening card, edges) are in
// ../explained/common.js, the mark in brand.js. Until the voice is recorded,
// the page also shows the words along the bottom (#caps, from
// ../explained/captions.js) and a preview badge; both go when #caps does.

const V = BH > BW;                                  // the vertical cut (not made yet)
const FIELDS = [
  t => [1500 + Math.sin(t * .05) * 260, 160 + Math.cos(t * .04) * 90, 950, 'rgba(1,124,238,0.055)'],
  t => [260 + Math.cos(t * .035) * 160, 980, 820, 'rgba(122,90,248,0.04)'],
  t => [1150, 1160 + Math.sin(t * .045) * 70, 700, 'rgba(247,144,9,0.03)'],
];
const CAPS = !!$('#caps');

// ---------------------------------------------------------------- helpers
const NS = 'http://www.w3.org/2000/svg';
function svgEl(parent, tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}
// an element's box relative to `root`, from offsets (they ignore transforms)
function box(el, root) {
  let x = el.offsetLeft, y = el.offsetTop, p = el.offsetParent;
  while (p && p !== root) { x += p.offsetLeft + p.clientLeft; y += p.offsetTop + p.clientTop; p = p.offsetParent; }
  const w = el.offsetWidth, h = el.offsetHeight;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
}
function pulse(sel, t) {
  tl.fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, immediateRender: false }, t);
  tl.to(sel, { autoAlpha: 0, duration: .5 }, t + .45);
}
const comp = (sel, t, st = 0) => tl.fromTo(sel, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, stagger: st }, t);
const pop = (sel, t, from = .4) => tl.fromTo(sel, { autoAlpha: 0, scale: from }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2.4)', immediateRender: false }, t);
// edges from common.js's edgeSvg, added to an svg layer; returns the path elements
function edges(svg, list) {
  svg.insertAdjacentHTML('beforeend', list.map(([id, pts]) => edgeSvg(id, pts)).join(''));
  return Object.fromEntries(list.map(([id]) => [id, svg.querySelector('#' + id)]));
}

// little dots that keep running along a connection between t0 and t1
const FLOWS = [];
function flow(svg, path, t0, t1, color, { v = 150, gap = 56, n = 3, r = 5 } = {}) {
  const len = path.getTotalLength();
  const dots = Array.from({ length: n }, () => svgEl(svg, 'circle', { r, fill: color, opacity: 0 }));
  FLOWS.push({ path, len, t0, t1, v, gap, dots });
}
function drawFlows(t) {
  for (const f of FLOWS) {
    const fade = clamp((f.t1 - t) / .3);
    f.dots.forEach((el, k) => {
      const s = (t - f.t0) * f.v - k * f.gap, cyc = f.len + f.gap;
      const p = s - Math.floor(s / cyc) * cyc;
      const on = s >= 0 && p <= f.len && fade > 0;
      el.setAttribute('opacity', on ? (Math.min(1, p / 14, (f.len - p) / 14) * fade).toFixed(3) : 0);
      if (!on) return;
      const q = f.path.getPointAtLength(p);
      el.setAttribute('cx', q.x.toFixed(2));
      el.setAttribute('cy', q.y.toFixed(2));
    });
  }
}

// ---------------------------------------------------------------- HUD
const CHAPTERS = [[0, 'The problem'], [at('rag', 1) - .3, 'What it is'], [at("here's") - .3, 'The core idea'],
  [at('now') - .3, 'Architecture'], [at('when', 2) - .4, 'In short']];
let lastChap = -1;
function drawHud(t) {
  $('#hud-prog').style.width = (100 * clamp(t / END)).toFixed(3) + '%';
  let k = 0;
  CHAPTERS.forEach(([s], i) => { if (t >= s) k = i; });
  if (k !== lastChap) {
    $('#hud-num').textContent = String(k + 1).padStart(2, '0');
    $('#hud-chap').textContent = CHAPTERS[k][1];
    lastChap = k;
  }
}
tl.fromTo('#hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: .7, ease: 'power1.out' }, at('rag', 1) - .3);
tl.to('#hud', { autoAlpha: 0, duration: .6, ease: 'power1.in' }, at("that's", 1) - .3);
if (CAPS) tl.to('#pv-badge', { autoAlpha: 0, duration: .01 }, 0).to('#pv-badge', { autoAlpha: 1, duration: .3 }, CARD);

// The scenes need the laid-out page (positions come from it), so they are
// built once the fonts are in.
let drawScene = () => {};
function build() {
  const draws = [S1(), S2(), S3(), S4(), S5()];
  drawScene = t => draws.forEach(d => d && d(t));
  window.render = t => {
    tl.seek(t, false);
    drawBg(t, FIELDS); drawMarks(t); drawHud(t); drawScene(t); drawFlows(t); drawCta(t);
    if (CAPS) drawCaptions(t);
  };
  window.render(0);
  window.READY = true;
}

// ---------------------------------------------------------------- S1 · the chatbot that has never seen the policy
function S1() {
  const sc = $('#s1'), svg = $('#s1-links');
  show('#s1', 0, at('stands') + .8);
  rise('#chat', OFF - .35, { y: 30, d: 1 });

  // "Ask a chatbot about your company's refund policy": the question types in, then sends
  const Q = "What's our refund policy?", tType = at('ask') + .05, tTyped = at('policy') + .2, tSend = at('policy') + .4;
  tl.fromTo('#m-q', { autoAlpha: 0, y: 16, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(1.8)', immediateRender: false }, tSend);
  tl.to('#chat .send', { scale: .88, duration: .1, yoyo: true, repeat: 1 }, tSend - .1);
  const bChat = box($('#chat'), sc), bModel = box($('#model'), sc), bDoc = box($('#doc'), sc), y = bModel.cy;
  const E = edges(svg, [['e-cm', [bChat.r + 6, y, bModel.x - 8, y]], ['e-md', [bModel.r + 8, y, bDoc.x - 8, y]], ['e-ok', [bDoc.x - 8, y, bModel.r + 8, y]]]);
  E['e-md'].classList.add('dash');
  E['e-ok'].classList.add('ok'); $('#e-okh').classList.add('ok');
  comp('#model', tSend + .05);
  drawEdge(['e-cm'], tSend);

  // "It's never seen it": the policy is there, but the model can't reach it
  const tNever = at("it's") - .2;
  comp('#doc', tNever);
  tl.fromTo('#e-md', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, at('seen') - .3);
  pop('#nolink', at('seen'));
  rise('#lockt', at('seen') + .15, { y: 10 });

  // "So it either says it doesn't know …"
  show('#m-dots', at('either') - .1, at("doesn't") - .1);
  rise('#m-no', at("doesn't") - .1, { y: 12, d: .5 });
  // "… or worse, it makes one up, and sounds completely sure"
  leave('#m-no', at('worse') - .1, { y: '-=10', d: .35 });
  rise('#m-fake', at('makes') - .1, { y: 12, d: .5 });
  tl.fromTo('#stamp', { autoAlpha: 0, scale: 1.8, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 8, duration: .35, ease: 'power4.in', immediateRender: false }, at('completely') - .1);
  tl.to('#m-fake', { x: 5, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, at('completely') + .25);
  tl.to('#doc-mark', { backgroundSize: '100% 100%', duration: .5 }, at('sure') - .1);

  // "The fix isn't a bigger model."
  const tBig = at('bigger') - .15, tCross = at('model') - .05, tHand = at('handing') - .15;
  tl.to('#model', { scale: 1.28, duration: .5, ease: 'back.out(2)' }, tBig);
  pop('#model .xb', tCross);
  tl.to('#model', { x: 6, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, tCross + .1);
  tl.to('#model', { scale: 1, duration: .5, ease: 'power3.inOut' }, tHand - .3);
  tl.to('#model .xb', { autoAlpha: 0, duration: .25 }, tHand - .3);

  // "It's handing it the right page before it answers."
  tl.to(['#nolink', '#e-md', '#lockt'], { autoAlpha: 0, duration: .3 }, tHand);
  const fp = $('#fly-page'), fw = fp.offsetWidth, fh = fp.offsetHeight;
  const P0 = [bDoc.cx - fw / 2, bDoc.cy - fh / 2 + 30], P1 = [bModel.cx - fw / 2, bModel.cy - fh / 2], P2 = [bChat.cx - fw / 2, bChat.y + 300];
  tl.fromTo(fp, { x: P0[0], y: P0[1], autoAlpha: 0, scale: .6, rotation: 0 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: .35, immediateRender: false }, tHand);
  tl.to(fp, { x: P1[0], y: P1[1] - 40, rotation: 4, duration: .7, ease: 'power2.inOut' }, tHand + .3);
  tl.to(fp, { x: P1[0], y: P1[1], scale: .4, autoAlpha: 0, duration: .35, ease: 'power2.in' }, tHand + 1);
  drawEdge(['e-ok'], at('right') - .1, .5);
  tl.fromTo('#model', { boxShadow: '0 0 0 0px rgba(18,183,106,0)' }, { boxShadow: '0 0 0 14px rgba(18,183,106,.2)', duration: .35, yoyo: true, repeat: 1, immediateRender: false }, tHand + 1.1);
  leave(['#m-fake'], at('before') - .1, { y: '-=10', d: .35 });
  rise('#m-real', at('answers') - .2, { y: 12, d: .6 });

  // "That's what RAG does.": everything gives way to the title, which holds through the channel intro
  const tTitle = at("that's") - .1;
  tl.to(['#chat', '#model', '#doc', '#s1-links'], { autoAlpha: 0, scale: .92, duration: .5, ease: 'power2.in', stagger: .04 }, tTitle);
  tl.set('#lock1', { autoAlpha: 1 }, tTitle + .3);
  tl.fromTo('#lock1 .kmark', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'expo.out' }, tTitle + .3);
  tl.fromTo('#lock1 .word', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, at('rag') - .15);
  leave('#lock1', at('stands') - .4, { y: '-=50', d: .35 });

  const typed = $('#typed'), caret = $('#ch-caret'), mh = $('#model-h');
  let lastN = -1, lastM = '';
  return t => {
    if (t > at('stands') + 1) return;
    const n = t < tSend ? Math.round(Q.length * clamp((t - tType) / (tTyped - tType))) : 0;
    if (n !== lastN) { typed.textContent = Q.slice(0, n); lastN = n; }
    caret.style.opacity = (t > tType - .4 && t < tSend) || Math.floor(t * 2.2) % 2 ? 1 : 0;
    const m = t >= tBig && t < tHand ? 'Bigger model' : 'Model';
    if (m !== lastM) { mh.textContent = m; lastM = m; }
    $$('#m-dots i').forEach((d, k) => { d.style.transform = `translateY(${(-5 * Math.max(0, Math.sin(t * 9 - k * .9))).toFixed(2)}px)`; });
  };
}

// ---------------------------------------------------------------- S2 · what it is
function S2() {
  show('#s2', at('stands') - .3, at("here's") - .1);
  // R · A · G, then what each letter stands for
  tl.fromTo('.lt b', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .12 }, at('stands'));
  const tRA = at('retrievalaugmented');
  [['#lt1 span', tRA - .1], ['#lt2 span', tRA + .4], ['#lt3 span', at('generation') - .1]].forEach(([sel, t]) => rise(sel, t, { y: 18, d: .6 }));
  // retrieve, augment, generate
  [['#st1', at('retrieve')], ['#st2', at('augment')], ['#st3', at('generate')]].forEach(([sel, t], i) => {
    comp(sel, t - .25);
    pulse(`${sel} .ring`, t + .25);
    if (i) rise('#chev' + i, t - .45, { y: 0, d: .4 });
  });
  leave(['.letters', '.step', '.chev'], at('comes') - .55, { y: '-=30', d: .5 });

  // where it came from
  rise('#s2-tag2', at('comes') - .25, { y: 12 });
  rise('.tl-track', at('comes') - .2, { y: 0, d: .6 });
  rise('#tn1', at('2020') - .3, { y: 24 });
  tl.to('#tl-fill', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, at('paper') - .2);
  rise('#tn2', at('today') - .2, { y: 24 });
  tl.to('#tn2 .dot', { backgroundColor: '#017CEE', scale: 1.2, duration: .45 }, at('first') - .1);
  leave(['#s2-tag2', '#tline'], at("here's") - .5, { y: '-=30', d: .5 });
}

// ---------------------------------------------------------------- S3 · the core idea
function S3() {
  show('#s3', at("here's") - .3, at('now') + .5);
  rise('#s3-tag', at("here's") - .1, { y: 12 });
  // "A model only knows what it saw in training, and that stops at a cutoff date."
  comp('#train', at('model', 1) - .3);
  tl.to('#tr-fill', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, at('knows') - .2);
  rise('#tr-src span', at('saw') - .1, { y: 10, st: .12, d: .5 });
  pop('#tr-flag', at('cutoff') - .15, .6);
  rise('.outside > *', at('date') - .2, { y: 14, st: .12, d: .55 });
  // "RAG doesn't retrain the model."
  leave(['#s3-tag', '#train', '#outside'], at('rag', 2) - .35, { y: '-=24', st: .04 });
  comp('#retrain', at('rag', 2) - .05);
  tl.to('#strike', { scaleX: 1, duration: .4, ease: 'power2.out' }, at('retrain') + .1);
  tl.to('#retrain', { x: 6, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, at('retrain') + .45);
  leave('#retrain', at('looks') - .45, { y: '-=20', d: .4 });
  // "It looks up the right text when the question comes in, and puts it in the prompt."
  comp('#prompt', at('looks') - .25);
  rise('#pr-look', at('text') - .2, { y: 10, d: .5 });
  tl.fromTo('#pr-c', { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: .7, ease: 'power3.out' }, at('puts') - .1);
  tl.to('#pr-look', { opacity: .35, duration: .4 }, at('puts'));
  // "Like an open-book exam, instead of answering from memory."
  tl.to('#prompt', { x: -320, scale: .9, duration: .9, ease: 'power3.inOut' }, at('like') - .3);
  comp('#ex1', at('openbook') - .15);
  comp('#ex2', at('instead') - .1);
  leave(['#prompt', '#ex1', '#ex2'], at('now') - .45, { y: '-=24', st: .04 });
}

// ---------------------------------------------------------------- S4 · the architecture
function S4() {
  const W = $('#world'), under = $('#s4-under'), over = $('#s4-over');
  const tEnd = at('when', 2) - .45;
  show('#s4', at('now') - .3, at('when', 2) + .6);
  rise('#s4-title', at('now') - .1, { y: 20, d: .9 });
  leave('#s4-title', at('two') - .55, { y: '-=36', d: .55 });

  // the camera: both lanes, then each part as it is named, then the whole picture again
  const cam = { x: 960, y: 540, z: 1 };
  const camTo = (t, x, y, z, d = 1.3) => tl.to(cam, { x, y, z, duration: d, ease: 'power2.inOut' }, t);
  [[at('first', 1) - .3, 600, 330, 1.42], [at('stores') - .7, 930, 470, 1.13, 1.4], [at('second') - .5, 640, 735, 1.4],
    [at('database', 1) - .9, 1180, 560, 1.22], [at('those') - .6, 1390, 560, 1.18], [at('when', 1) - .5, 960, 535, 1, 1.4]]
    .forEach(m => camTo(...m));

  // "There are two pipelines."
  tl.fromTo('#ln-a', { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: .8 }, at('two') - .2);
  tl.fromTo('#ln-b', { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: .8 }, at('two') + .15);
  // while the camera is in close, a soft white band keeps the HUD readable over the diagram
  tl.to('#hud-fade', { opacity: 1, duration: .6 }, at('first', 1) - .3);
  tl.to('#hud-fade', { opacity: 0, duration: .6 }, at('when', 1) - .2);
  const bx = sel => box($(sel), W);
  const B = Object.fromEntries(['n-docs', 'n-chunks', 'n-emb', 'n-q', 'n-qe', 'n-db', 'n-prompt', 'n-llm', 'n-ans'].map(id => [id, bx('#' + id)]));
  const yA = B['n-docs'].cy, yB = B['n-q'].cy, xR = B['n-prompt'].cx;
  const E = edges(under, [
    ['a1', [B['n-docs'].r + 6, yA, B['n-chunks'].x - 8, yA]], ['a2', [B['n-chunks'].r + 6, yA, B['n-emb'].x - 8, yA]],
    ['a3', [B['n-emb'].r + 6, yA, B['n-db'].x - 8, yA]],
    ['b1', [B['n-q'].r + 6, yB, B['n-qe'].x - 8, yB]], ['b2', [B['n-qe'].r + 6, yB, B['n-db'].x - 8, yB]],
    ['c1', [B['n-db'].r + 6, B['n-prompt'].y + 120, B['n-prompt'].x - 8, B['n-prompt'].y + 120]],
    ['c2', [xR, B['n-prompt'].b + 6, xR, B['n-llm'].y - 8]], ['c3', [xR, B['n-llm'].b + 6, xR, B['n-ans'].y - 8]],
  ]);

  // ① "The first one runs ahead of time. It splits your documents into small chunks …"
  comp('#n-docs', at('ahead') - .25);
  rise('#n-docs .fl', at('ahead') - .05, { y: 10, st: .1, d: .5 });
  drawEdge(['a1'], at('splits') - .2, .45);
  comp('#n-chunks', at('splits'));
  tl.fromTo('.ck', { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2.2)', stagger: .1 }, at('chunks') - .3);
  // "… turns each chunk into an embedding, a list of numbers that captures its meaning …"
  drawEdge(['a2'], at('turns') - .2, .45);
  comp('#n-emb', at('turns'));
  tl.fromTo('#vecs .vr', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .14 }, at('embedding') - .2);
  tl.fromTo('#vecs .vr span', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .5, stagger: .14, ease: 'none' }, at('embedding') - .15);
  tl.to('#vr2 span', { backgroundColor: 'rgba(1,124,238,.12)', duration: .3 }, at('numbers') - .1);
  // "… and stores them in a vector database."
  drawEdge(['a3'], at('stores') - .2, .45);
  comp('#n-db', at('stores') - .05);
  flow(under, E.a3, at('stores') + .3, at('second'), '#017CEE', { v: 160, gap: 40 });

  // the map of meaning: a dot per chunk, one colour per source
  const map = $('#map'), MW = map.clientWidth, MH = map.clientHeight, mb = bx('#map');
  const K = { refunds: '#F79009', hr: '#7A5AF8', faq: '#0E9384' };
  const DOTS = [
    [.25, .23, 'refunds'], [.36, .27, 'refunds', 'refund-policy.pdf · §2'], [.2, .32, 'refunds', 'refund-policy.pdf · §1'], [.45, .4, 'refunds'],
    [.3, .42, 'refunds'], [.47, .22, 'refunds'], [.17, .26, 'refunds'], [.37, .36, 'faq', 'faq.md · returns'],
    [.66, .58, 'hr'], [.77, .62, 'hr'], [.71, .69, 'hr'], [.6, .66, 'hr'], [.83, .55, 'hr'], [.73, .76, 'hr'], [.62, .75, 'hr'],
    [.27, .8, 'faq'], [.4, .86, 'faq'], [.33, .92, 'faq'], [.5, .81, 'faq'], [.2, .87, 'faq'],
    [.82, .27, 'hr'], [.86, .38, 'faq'], [.7, .16, 'hr'], [.14, .6, 'faq'], [.88, .88, 'hr'], [.55, .52, 'refunds'],
  ].map(([u, v, k, label], i) => {
    const el = document.createElement('i'); el.className = 'pt'; el.style.setProperty('--k', K[k]);
    el.style.left = (u * MW).toFixed(1) + 'px'; el.style.top = (v * MH).toFixed(1) + 'px';
    map.appendChild(el);
    return { el, x: u * MW, y: v * MH, k, label, i };
  });
  const tDots = at('vector') - .2;
  DOTS.forEach((d, i) => tl.fromTo(d.el, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2.6)', immediateRender: false }, tDots + (i % 13) * .07 + (i >= 13 ? .45 : 0)));

  // ② "The second one runs on every question. The question becomes an embedding too …"
  comp('#n-q', at('every') - .3);
  drawEdge(['b1'], at('becomes') - .3, .45);
  comp('#n-qe', at('becomes') - .05);
  // "… and the database finds the chunks closest in meaning."
  drawEdge(['b2'], at('database', 1) - .45, .55);
  const QP = [.31, .31], qx = mb.x + QP[0] * MW, qy = mb.y + QP[1] * MH;
  const qpt = document.createElement('i'); qpt.className = 'qpt'; $('#flyers').appendChild(qpt);
  const rip = document.createElement('i'); rip.className = 'ripple'; $('#flyers').appendChild(rip);
  const qeb = B['n-qe'], tFind = at('finds') - .25;
  tl.fromTo(qpt, { x: qeb.cx, y: qeb.cy + 50, rotation: 45, autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .25, immediateRender: false }, tFind - .5);
  tl.to(qpt, { x: qx, y: qy, duration: .85, ease: 'power2.inOut' }, tFind - .4);
  tl.fromTo(rip, { x: qx, y: qy, autoAlpha: .9, scale: 1 }, { autoAlpha: 0, scale: 9, duration: 1, ease: 'power2.out', immediateRender: false }, tFind + .5);
  gsap.set(qpt, { x: qx, y: qy, rotation: 45 }); gsap.set(rip, { x: qx, y: qy });
  const near = DOTS.map(d => ({ d, r: Math.hypot(d.x - QP[0] * MW, d.y - QP[1] * MH) })).sort((a, b) => a.r - b.r).slice(0, 3).map(o => o.d);
  const tNear = at('closest') - .15, ml = $('#map-l');
  const nearLines = near.map((d, i) => {
    const p = svgEl(ml, 'path', { class: 'near', d: `M${QP[0] * MW} ${QP[1] * MH}L${d.x} ${d.y}`, opacity: 0 });
    tl.to(p, { attr: { opacity: 1 }, duration: .3 }, tNear + i * .12);
    return p;
  });
  near.forEach((d, i) => tl.to(d.el, { scale: 1.35, duration: .3, ease: 'back.out(3)' }, tNear + i * .12));

  // "Those chunks go into the prompt …"
  comp('#n-prompt', at('those') - .35);
  drawEdge(['c1'], at('those') - .1, .4);
  const tChips = at('go') - .2;
  const chips = near.map((d, i) => {
    const el = document.createElement('div'); el.className = 'chip'; el.style.setProperty('--k', K[d.k]);
    el.innerHTML = `<b>${i + 1}</b>${d.label || 'refund-policy.pdf · §3'}`;
    $('#flyers').appendChild(el);
    const s = bx('#sl' + (i + 1));
    tl.fromTo(el, { x: mb.x + d.x - 20, y: mb.y + d.y - 25, scale: .25, autoAlpha: 0 }, { x: s.x, y: s.y, scale: 1, autoAlpha: 1, duration: .85, ease: 'power3.inOut', immediateRender: false }, tChips + i * .16);
    gsap.set(el, { x: s.x, y: s.y });
    return el;
  });
  // "… and the model answers from them, with sources."
  drawEdge(['c2'], at('model', 3) - .4, .35);
  comp('#n-llm', at('model', 3) - .2);
  pulse('#n-llm .ring', at('answers', 1));
  drawEdge(['c3'], at('answers', 1) + .1, .35);
  comp('#n-ans', at('them', 1) - .2);
  rise('#n-ans .src', at('sources') - .2, { y: 8, d: .5 });

  // "And when the policy changes, you re-index that one document, and the next answer is right."
  const tChange = at('policy', 1) - .1, tRe = at('reindex') - .05, tFix = at('next') - .1;
  pop('#upd', tChange);
  tl.to('#f1', { backgroundColor: '#FFFAEB', duration: .3 }, tChange);
  pop('#stale', at('changes') + .15);
  const reSteps = [['#f1', tRe], ['#ck2', tRe + .45], ['#vr2', tRe + .9]];
  reSteps.forEach(([sel, t]) => {
    tl.fromTo(sel, { boxShadow: '0 0 0 0px rgba(247,144,9,0)' }, { boxShadow: '0 0 0 6px rgba(247,144,9,.35)', duration: .3, yoyo: true, repeat: 1, immediateRender: false }, t);
  });
  [['a1', tRe + .1], ['a2', tRe + .55], ['a3', tRe + 1]].forEach(([id, t]) => flow(over, E[id], t, t + E[id].getTotalLength() / 220 + .05, '#F79009', { v: 220, n: 1, r: 7 }));
  const reDots = near.filter(d => d.k === 'refunds');
  reDots.forEach(d => tl.fromTo(d.el, { boxShadow: '0 0 0 0px rgba(247,144,9,0)' }, { boxShadow: '0 0 0 9px rgba(247,144,9,.4)', duration: .3, yoyo: true, repeat: 1, immediateRender: false }, tRe + 1.4));
  tl.to('#stale', { autoAlpha: 0, duration: .25 }, tFix);
  tl.fromTo('#n-ans', { boxShadow: '0 0 0 0px rgba(18,183,106,0)' }, { boxShadow: '0 0 0 12px rgba(18,183,106,.2)', duration: .35, yoyo: true, repeat: 1, immediateRender: false }, tFix + .2);
  tl.to('#upd', { autoAlpha: 0, duration: .3 }, tFix + .4);

  tl.to(['#world'], { autoAlpha: 0, duration: .6, ease: 'power2.in' }, tEnd);

  const ans = $('#n-ans'), days = $('#ab-days'), v2 = $('#vr2-n'), V2 = ['[ 0.31, 0.07, −0.52, … ]', '[ 0.27, 0.12, −0.47, … ]'];
  let last = '';
  return t => {
    W.style.transform = `translate(960px,540px) scale(${cam.z.toFixed(5)}) translate(${(-cam.x).toFixed(3)}px,${(-cam.y).toFixed(3)}px)`;
    if (t < at('now') - .5 || t > tEnd + .7) return;
    const old = t >= at('changes') + .15 && t < tFix, fixed = t >= tFix, reEmb = t >= tRe + 1;
    const s = `${old}${fixed}${reEmb}`;
    if (s !== last) {
      ans.classList.toggle('old', old);
      days.textContent = fixed ? '14 days' : '30 days';
      v2.textContent = V2[reEmb ? 1 : 0];
      last = s;
    }
    nearLines.forEach(p => { p.style.strokeDashoffset = (-t * 18).toFixed(2); });
  };
}

// ---------------------------------------------------------------- S5 · in short + close
function S5() {
  show('#s5', at('when', 2) - .2, null);
  rise('#s5-tag', at('job') - .4, { y: 12 });
  comp('#job', at('job') - .3);
  tl.to('#hl', { backgroundSize: '100% 100%', duration: .5, ease: 'power2.out' }, at('rag', 3) - .1);
  tl.fromTo('#hl b', { scale: 1 }, { scale: 1.12, duration: .2, yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false }, at('rag', 3));
  leave(['#s5-tag', '#job'], at('means') - .1, { y: '-=24', st: .04 });
  rise('#s5-tag2', at('both') - .3, { y: 12 });
  [['#ta1', at('get') - .3], ['#ta2', at('get', 1) - .3], ['#ta3', at('every', 1) - .3]].forEach(([sel, t]) => {
    rise(sel, t, { y: 22 });
    tl.fromTo(`${sel} .tick`, { scale: .3 }, { scale: 1, duration: .7, ease: 'back.out(2.4)' }, t + .1);
  });
  leave(['#s5-tag2', '#ta1', '#ta2', '#ta3'], at("that's", 1) - .35, { y: '-=24', st: .04 });
  tl.fromTo('#mark5', { autoAlpha: 0, scale: .4, rotation: -90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.6, ease: 'expo.out' }, at("that's", 1) + .05);
  tl.fromTo('#wm5b', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, at('rag', 4) - .1);
  rise('#lock5-sub', at('rag', 4) + .45, { y: 12, d: 1 });
  rise('#credit', at('rag', 4) + .9, { y: 8, d: 1 });
  tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);
}

document.fonts.ready.then(() => requestAnimationFrame(build));
