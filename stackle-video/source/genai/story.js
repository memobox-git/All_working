// 20 Gen AI Concepts You Actually Need: one notebook page per concept,
// shared by both cuts (index.html 1920×1080, vertical.html 1080×1920 with
// captions). Each page builds as its line is spoken: the number and title on
// "One: tokens", the line word by word (landscape), the sketch step by step
// (sketches.js), then the takeaway. A 1→20 tracker beside the spiral ticks
// each concept off. Shared helpers are in ../explained/common.js.

const V = BH > BW;
const W = BW, H = BH;
const COLORS = ['--c1', '--c2', '--c3', '--c4'];
const NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
// ^ marks a highlighted word in the line
const CONCEPTS = [
  { t: 'Tokens', sk: 'tokens', def: 'Models read text in small pieces called tokens, and ^you ^pay ^per ^token.', take: 'Tokens, not words, are what you pay for.' },
  { t: 'Embeddings', sk: 'embed', def: 'Text becomes a list of numbers, so ^similar ^meanings sit close together.', take: 'Meaning becomes distance.' },
  { t: 'Attention', sk: 'attn', def: 'Every token ^looks ^at ^every ^other ^token to work out what it means.', take: 'Context decides meaning.' },
  { t: 'LLMs', sub: 'large language models', sk: 'llm', def: 'They ^predict ^the ^next ^token, one at a time.', take: 'Next-token prediction, at huge scale.' },
  { t: 'Context window', sk: 'ctx', def: '^How ^much ^text the model can see at once.', take: 'Not in the window? The model can’t use it.' },
  { t: 'Temperature', sk: 'temp', def: 'Low is ^focused and repeatable. High is ^more ^varied.', take: 'Low for facts, high for ideas.' },
  { t: 'Prompting', sk: 'prompt', def: 'Clear instructions, examples and a format ^give ^better ^answers.', take: 'Be specific. Show an example.' },
  { t: 'Few-shot', sk: 'fewshot', def: 'Show a few examples in the prompt, and ^the ^model ^follows ^the ^pattern.', take: 'Examples beat explanations.' },
  { t: 'Hallucinations', sk: 'halluc', def: 'Answers that ^sound ^confident, but are ^made ^up.', take: 'Fluent isn’t the same as true.' },
  { t: 'Fine-tuning', sk: 'finetune', def: 'Train a model further ^on ^your ^own ^examples to change how it behaves.', take: 'It changes behavior more than knowledge.' },
  { t: 'RLHF', sub: 'reinforcement learning from human feedback', sk: 'rlhf', def: 'People rank the answers, and the model ^learns ^what ^they ^prefer.', take: 'Trained on what people prefer.' },
  { t: 'Multimodal', sk: 'multi', def: 'One model that understands ^text, ^images ^and ^audio.', take: 'One model, many inputs.' },
  { t: 'Vector databases', sk: 'vdb', def: 'They store embeddings, and ^find ^the ^closest ^matches fast.', take: 'Search by meaning, not keywords.' },
  { t: 'Chunking', sk: 'chunk', def: 'Split long documents into ^small ^pieces you can search.', take: 'Smaller pieces, better search.' },
  { t: 'RAG', sub: 'retrieval-augmented generation', sk: 'rag', def: '^Retrieve ^the ^right ^chunks first, then answer from them, with sources.', take: 'Answers from your data, with sources.' },
  { t: 'Tool calling', sk: 'tools', def: 'The model asks ^your ^code to run a function, like a database query.', take: 'The model asks, your code acts.' },
  { t: 'Agents', sk: 'agent', def: 'A model in a loop that ^plans, ^uses ^tools and ^checks its own work.', take: 'Tools plus a loop.' },
  { t: 'MCP', sub: 'Model Context Protocol', sk: 'mcp', def: 'An open standard for ^plugging ^tools ^and ^data into AI apps.', take: 'One plug for every tool.' },
  { t: 'Evals', sk: 'evals', def: 'Tests that score the answers, so you know a change made things ^better.', take: 'Measure it before you ship it.' },
  { t: 'Guardrails', sk: 'guard', def: 'Checks on ^what ^goes ^in and ^what ^comes ^out, so the system stays safe.', take: 'Safe in, safe out.' },
];

// ---------------------------------------------------------------- cues
function after(word, from) {
  for (let i = from; i < WORDS.length; i++) if (norm(WORDS[i].w) === word) return i;
  throw Error('no cue: ' + word + ' after ' + from);
}
const tw = i => WORDS[i].s + OFF;                 // a word's start, by index
const STARTS = [];
NUMS.forEach((w, k) => STARTS.push(after(w, k ? STARTS[k - 1] + 1 : wi('one'))));
const I_MID = after('now', STARTS[11]), I_END = after('tokens', STARTS[19]);
const T_START = STARTS.map(tw), T_MID = tw(I_MID), T_END = tw(I_END);
const tNext = k => k === 11 ? T_MID : k === 19 ? T_END : T_START[k + 1];
// the title phrase ends at the first word ending in "." after the number ("One: tokens.")
const titleEnd = k => { let j = STARTS[k] + 1; while (j < WORDS.length - 1 && !/\.["”]?$/.test(WORDS[j].w)) j++; return j; };

// ---------------------------------------------------------------- the paper
(() => {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'), d = g.createImageData(512, 512);
  let s = 5; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < d.data.length; i += 4) { const v = 150 + r() * 105; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
  $('#grain').style.background = `url(${c.toDataURL()})`;
})();
// a hand-drawn line through points (deterministic wobble)
function hand(pts, seed = 1, amp = 2) {
  let s = seed * 9301 + 49297; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647 - .5) * 2 * amp;
  const p = pts.map(([x, y], i) => [x + (i && i < pts.length - 1 ? r() : 0), y + (i && i < pts.length - 1 ? r() : 0)]);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  if (p.length === 2) {
    const [[x0, y0], [x1, y1]] = p;
    return d + ` Q${(x0 + (x1 - x0) / 2 + r()).toFixed(1)} ${(y0 + (y1 - y0) / 2 + r()).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  for (let i = 1; i < p.length - 1; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[i + 1], last = i === p.length - 2;
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${(last ? x1 : (x0 + x1) / 2).toFixed(1)} ${(last ? y1 : (y0 + y1) / 2).toFixed(1)}`;
  }
  return d;
}
function loop(cx, cy, rx, ry, seed = 1) {
  let s = seed * 7919 + 13; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647 - .5);
  const pts = [];
  for (let i = 0; i <= 40; i++) { const a = -2.2 + i / 40 * Math.PI * 2.12, k = 1 + r() * .04; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
}
const NS = 'http://www.w3.org/2000/svg';
const svgOf = (el, w, h) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', `0 0 ${w} ${h}`); el.appendChild(s); return s; };
function path(svg, d, { color = 'var(--ink)', w = 4, dash = false, fill = 'none' } = {}) {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', fill); p.setAttribute('stroke', color); p.setAttribute('stroke-width', w);
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
  if (dash) p.setAttribute('stroke-dasharray', `${w * 2.5} ${w * 2.5}`);
  svg.appendChild(p);
  return p;
}

// the spiral binding
(() => {
  const s = svgOf($('#rings'), 80, H), n = V ? 30 : 17, gap = (H - 80) / n;
  for (let k = 0; k < n; k++) {
    const y = 40 + k * gap + gap / 2;
    path(s, `M58 ${y}m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0`, { color: 'none', w: 0, fill: '#2A2A2E' });
    path(s, `M4 ${y - 11} C 30 ${y - 22}, 62 ${y - 14}, 60 ${y}`, { color: '#26262A', w: 8 });
    path(s, `M8 ${y - 13} C 30 ${y - 21}, 54 ${y - 15}, 55 ${y - 6}`, { color: '#8A8A90', w: 2 });
  }
})();

// the 1→20 tracker
const DOTS = Array.from({ length: 20 }, (_, k) => {
  const d = document.createElement('div');
  d.className = 'dot'; d.textContent = k + 1;
  d.style.background = `var(${COLORS[k % 4]})`;
  $('#track').appendChild(d);
  return d;
});
function placeDots(cur) {
  DOTS.forEach((d, k) => {
    const on = k === cur, size = on ? 46 : 36;
    const [x, y] = V ? [128 + k * 43.5, 214] : [128, 58 + k * 49.5];
    d.style.cssText += `;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;font-size:${on ? 26 : 20}px`;
  });
}
placeDots(-1);
let lastCur = -2;
function drawTracker(t) {
  let cur = -1;
  T_START.forEach((s, k) => { if (t >= s - .35) cur = k; });
  if (t >= T_END - .35) cur = 20;
  if (cur === lastCur) return;
  placeDots(cur);
  DOTS.forEach((d, k) => { d.classList.toggle('on', k === cur); d.classList.toggle('done', k < cur); });
  $('#pageno b').textContent = cur >= 0 && cur < 20 ? cur + 1 : 20;
  lastCur = cur;
}

// ---------------------------------------------------------------- the pages
function renderSketch(host, steps, seed) {
  const svg = svgOf(host, 760, 520), out = [];
  steps.forEach((marks, si) => {
    const els = [];
    marks.forEach((m, mi) => {
      const sd = seed * 100 + si * 10 + mi;
      if (m.k === 'B') {
        const e = document.createElement('div');
        e.className = 'mb';
        e.style.cssText = `left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;font-size:${m.size || 40}px;background:${m.fill || '#fff'};` +
          `border-width:${m.bw || 4}px;border-color:${m.color || 'var(--ink)'};border-radius:${m.r || 18}px;${m.dash ? 'border-style:dashed;' : ''}transform:rotate(${((sd * 37) % 9 - 4) / 6}deg)`;
        e.innerHTML = m.text;
        host.appendChild(e); els.push(e);
      } else if (m.k === 'T') {
        const e = document.createElement('div');
        e.className = 'mt' + (m.font === 'note' ? ' note' : '');
        const size = m.size || 40;
        e.style.cssText = `left:${m.x}px;top:${m.y - size * .82}px;font-size:${size}px;font-weight:${m.weight || 400};color:${m.color || 'var(--ink)'};` +
          `transform:${m.anchor === 'middle' ? 'translateX(-50%) ' : ''}${m.rot ? `rotate(${m.rot}deg)` : ''};transform-origin:50% 50%`;
        e.textContent = m.text;
        host.appendChild(e); els.push(e);
      } else if (m.k === 'L') {
        const p = path(svg, hand(m.p, sd, 1.6), { color: m.color, w: m.w || 4, dash: m.dash });
        p.dataset.draw = m.dash ? '' : '1';
        els.push(p);
        if (m.arrow) {
          const [[x0, y0], [x1, y1]] = m.p.slice(-2), a = Math.atan2(y1 - y0, x1 - x0), s = 16;
          const h = path(svg, `M${x1 - Math.cos(a - .5) * s} ${y1 - Math.sin(a - .5) * s} L${x1} ${y1} L${x1 - Math.cos(a + .5) * s} ${y1 - Math.sin(a + .5) * s}`, { color: m.color, w: m.w || 4 });
          els.push(h);
        }
      } else if (m.k === 'O') {
        const p = path(svg, loop(m.cx, m.cy, m.r, m.r * .92, sd), { color: m.color, w: m.w || 3.5, dash: m.dash });
        p.dataset.draw = m.dash ? '' : '1';
        els.push(p);
      } else if (m.k === 'D') {
        const p = path(svg, `M${m.cx} ${m.cy}m-${m.r} 0a${m.r} ${m.r} 0 1 0 ${m.r * 2} 0a${m.r} ${m.r} 0 1 0-${m.r * 2} 0`, { color: 'none', w: 0, fill: m.color });
        els.push(p);
      } else if (m.k === 'X') {
        const e = document.createElement('div');
        e.className = 'mx';
        e.style.cssText = `left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px`;
        e.innerHTML = widget(m);
        host.appendChild(e); els.push(e);
      }
    });
    out.push(els);
  });
  return out;
}
// the drawn widgets used by the sketches
function widget(m) {
  const box = (html, cls, style = '') => `<div class="${cls}" style="position:absolute;inset:0;${style}">${html}</div>`;
  if (m.bar) return box(`<i style="width:${m.pct}%;background:${m.bar}"></i>`, 'bar');
  if (m.shade) return box('', 'shade');
  if (m.pivot) return box('', '', 'border-radius:50%;background:var(--ink)');
  if (m.sticky) return box('', 'sticky');
  if (m.bubble) return box('', 'bubble');
  if (m.stamp) return box(m.html, 'stamp' + (m.small ? ' small' : ''));
  if (m.badge) return box(m.html, 'badge');
  if (m.star) return box(m.html, 'star');
  if (m.flag) return box(m.html, 'flag');
  if (m.code) return box(m.html, 'code');
  if (m.cards) return box('<i style="left:30px;top:30px;transform:rotate(6deg)"></i><i style="left:15px;top:15px;transform:rotate(-3deg)"></i><i style="left:0;top:0"></i>', 'cards');
  const s = (inner, vb = '0 0 100 100') => `<svg viewBox="${vb}" width="100%" height="100%" style="position:absolute;inset:0" fill="none" stroke="#1D1D1F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  if (m.robot) return s('<rect x="18" y="28" width="64" height="54" rx="16" fill="#E9E3FF"/><path d="M50 28V14"/><circle cx="50" cy="11" r="4" fill="#1D1D1F"/><circle cx="37" cy="52" r="5" fill="#1D1D1F" stroke="none"/><circle cx="63" cy="52" r="5" fill="#1D1D1F" stroke="none"/><path d="M38 68q12 8 24 0"/><path d="M18 50h-8M82 50h8"/>');
  if (m.person) return s('<circle cx="50" cy="22" r="13" fill="#FFF0A3"/><path d="M50 36v34M50 46l-20 14M50 46l22-18M50 70l-16 26M50 70l16 26"/>');
  if (m.image) return s('<rect x="6" y="10" width="88" height="80" rx="10" fill="#CDEFD3"/><path d="M10 80l26-30 18 20 12-12 24 22"/><circle cx="70" cy="30" r="8" fill="#FFF0A3"/>');
  if (m.wave) return s('<rect x="6" y="10" width="88" height="80" rx="10" fill="#FFD3DA"/><path d="M16 50h8M28 36v28M38 24v52M48 40v20M58 30v40M68 42v16M78 34v32M86 50h0"/>');
  if (m.cylinder) return s('<ellipse cx="50" cy="12" rx="44" ry="9" fill="#FBF8F1"/><path d="M6 12v76c0 5 20 9 44 9s44-4 44-9V12"/>', '0 0 100 100" preserveAspectRatio="none');
  if (m.doc) return s('<path d="M8 4h60l24 22v70H8z" fill="#fff"/><path d="M68 4v22h24"/><path d="M20 38h56M20 50h60M20 62h52M20 74h58M20 86h40" stroke="#C9C2B5" stroke-width="3"/>', '0 0 100 100" preserveAspectRatio="none');
  if (m.clipboard) return s('<rect x="6" y="10" width="88" height="88" rx="8" fill="#fff"/><rect x="32" y="4" width="36" height="12" rx="4" fill="#E9E3FF"/>', '0 0 100 100" preserveAspectRatio="none');
  if (m.shield) return s('<path d="M50 6 12 20v26c0 24 16 40 38 48 22-8 38-24 38-48V20z" fill="#CDEFD3"/><path d="m34 50 12 12 22-24"/>');
  return '';
}

const SHEETS = CONCEPTS.map((c, k) => {
  const sec = document.createElement('section');
  sec.className = 'scene page'; sec.id = 'p' + (k + 1);
  const words = c.def.split(' ').map(w => w.startsWith('^') ? `<span class="w hl">${w.slice(1)}</span>` : `<span class="w">${w}</span>`).join(' ');
  sec.innerHTML = `<div class="num" style="background:var(${COLORS[k % 4]})">${k + 1}</div>` +
    `<div class="title">${c.t}</div>${c.sub ? `<div class="sub">${c.sub}</div>` : ''}<svg class="rays" width="${W}" height="${H}" style="position:absolute;left:0;top:0"></svg>` +
    (V ? '' : `<div class="def">${words}</div>`) +
    `<div class="sk"></div><div class="take"><b>★ TAKEAWAY:</b><span>${c.take}</span></div>`;
  $('#pages').appendChild(sec);
  return { sec, c, k };
});

// big numbered circles for "the last 8" (13–20) and the close (1–20, each ticked)
function bigDots(host, from, to, cols, step, size, tick) {
  for (let k = from; k <= to; k++) {
    const d = document.createElement('div'), i = k - from;
    d.className = 'bigdot'; d.innerHTML = k + (tick ? '<i>✓</i>' : '');
    d.style.cssText = `left:${(i % cols) * step}px;top:${Math.floor(i / cols) * step}px;width:${size}px;height:${size}px;background:var(${COLORS[(k - 1) % 4]})`;
    host.appendChild(d);
  }
}
bigDots($('#mid .mdots'), 13, 20, 8, V ? 112 : 124, V ? 92 : 100, false);
bigDots($('#s5 .edots'), 1, 20, 10, V ? 86 : 104, V ? 70 : 84, true);

// ---------------------------------------------------------------- the timeline
// the cover, for the hook
const tMost = at('most'), tStack = at('full'), tLast = at('last'), tJobs = at('jobs'), tTwenty = at('twenty'), tNeed = at('actually');
show('#cover', CARD - .3, VO.insert.start);
tl.fromTo('#cover .cgen', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .7 }, tMost - .1);
tl.to('#cover .cgen em', { backgroundSize: '100% 100%', duration: .5, ease: 'power2.out' }, at('ai') + .1);
tl.fromTo('#cover .ccon', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .7 }, at('ai') + .2);
tl.fromTo('#cover .cbox2', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .6 }, at('stop') - .1);
tl.fromTo('#cover .l2', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, tLast - .1);
tl.fromTo('#cover .cbox2 u', { borderBottomColor: 'rgba(43,89,195,0)' }, { borderBottomColor: 'rgba(43,89,195,1)', duration: .3 }, tJobs);
tl.fromTo('#cover .tape', { autoAlpha: 0, scale: .9, rotation: -4 }, { autoAlpha: 1, scale: 1, rotation: -1.5, duration: .6, ease: 'back.out(2)' }, tStack - .1);
tl.fromTo('#cover .c20', { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(2.2)' }, tTwenty - .1);
tl.fromTo(DOTS, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2.5)', stagger: .045 }, tTwenty);
tl.fromTo('#cover .cneed', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .6 }, tNeed - .1);
tl.fromTo('.pageno', { opacity: 0 }, { opacity: 1, duration: .4 }, T_START[0] - .4);

// the 20 pages
SHEETS.forEach(({ sec, c, k }) => {
  const t0 = T_START[k], t1 = tNext(k), tT = tw(STARTS[k] + 1), jEnd = titleEnd(k);
  const sel = '#' + sec.id;
  show(sel, t0 - .4, t1 - .02);
  tl.fromTo(`${sel} .num`, { autoAlpha: 0, scale: .3, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .5, ease: 'back.out(2.4)' }, t0 - .3);
  tl.fromTo(`${sel} .title`, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: .5, ease: 'power1.inOut' }, tT - .12);
  if (c.sub) tl.fromTo(`${sel} .sub`, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 }, tT + .3);
  // the line, word by word, spread over the spoken words after the title
  const spoken = [];
  for (let j = jEnd + 1; j < WORDS.length && tw(j) < t1 - .05; j++) spoken.push(j);
  const tDefEnd = spoken.length ? WORDS[spoken[spoken.length - 1]].e + OFF : tT + 1;
  if (!V) {
    const ws = $$(`${sel} .def .w`);
    ws.forEach((w, i) => {
      const j = spoken.length ? spoken[Math.min(spoken.length - 1, Math.floor(i * spoken.length / ws.length))] : jEnd;
      tl.fromTo(w, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'power2.out' }, tw(j) - .08);
      if (w.classList.contains('hl')) tl.to(w, { backgroundSize: '100% 100%', duration: .35, ease: 'power2.out' }, tw(j) + .15);
    });
  }
  // the sketch, one step after another while the line is spoken
  const steps = renderSketch($(`${sel} .sk`), SKETCHES[c.sk], k + 1);
  const a = tT + .25, b = Math.max(a + .3, Math.min(tDefEnd - .5, t1 - 1.9));
  steps.forEach((els, si) => {
    const ts = steps.length > 1 ? a + si * (b - a) / (steps.length - 1) : a;
    els.forEach((e, ei) => {
      const te = ts + ei * .05;
      if (e instanceof SVGElement && e.dataset.draw) tl.fromTo(e, { drawSVG: '0%' }, { drawSVG: '100%', duration: .4, ease: 'power1.inOut' }, te);
      else if (e instanceof SVGElement) tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: .3 }, te);
      else tl.fromTo(e, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .35, ease: 'back.out(1.6)' }, te);
    });
  });
  // the takeaway, as the line ends
  const tTake = Math.min(t1 - 1.5, Math.max(tT + 1.6, tDefEnd - .6));
  tl.fromTo(`${sel} .take`, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45 }, tTake);
  // and out, for the next page
  tl.to([`${sel} .num`, `${sel} .title`, `${sel} .sub`, `${sel} .def`, `${sel} .sk`, `${sel} .take`, `${sel} .rays`].filter(s => s.includes('sub') ? c.sub : s.includes('def') ? !V : true),
    { autoAlpha: 0, x: -30, duration: .28, ease: 'power2.in' }, t1 - .32);
});

// "Now the last eight. This is where the jobs are."
show('#mid', T_MID - .3, T_START[12] - .02);
tl.fromTo('#mid .m8', { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(2)' }, T_MID - .1);
tl.fromTo('#mid .mjobs', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5 }, at('where', 1) - .2);
tl.to('#mid .mjobs em', { backgroundSize: '100% 100%', duration: .5, ease: 'power2.out' }, at('jobs', 1));
tl.fromTo('#mid .bigdot', { autoAlpha: 0, scale: .3 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2.4)', stagger: .07 }, T_MID + .25);
tl.to(DOTS.slice(12), { scale: 1.25, duration: .2, yoyo: true, repeat: 1, stagger: .05 }, T_MID + .3);
tl.to(['#mid .m8', '#mid .mjobs', '#mid .bigdot'], { autoAlpha: 0, x: -30, duration: .28, ease: 'power2.in' }, T_START[12] - .32);

// "Tokens to agents: that's the full stack. Save this …"
show('#s5', T_END - .3, null);
tl.fromTo('#s5 .tape', { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(2)' }, T_END - .1);
tl.fromTo('#s5 .e1', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .55 }, at('full', 1) - .2);
tl.fromTo('#s5 .e2', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .55 }, at('save') - .1);
tl.fromTo('#s5 .bigdot', { autoAlpha: 0, scale: .3 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2.4)', stagger: .035 }, at('full', 1) + .2);
tl.fromTo('#s5 .bigdot i', { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: .25, ease: 'back.out(2)', stagger: .04 }, at('all') - .3);
tl.to(DOTS, { scale: 1.2, duration: .18, yoyo: true, repeat: 1, stagger: .03 }, at('all') - .2);
tl.to(['#track', '.pageno'], { autoAlpha: 0, duration: .5 }, END - 1.2);
tl.to('#fade', { opacity: 1, duration: .9, ease: 'power1.in' }, END - .9);

function build() {
  // titles that are too wide for the page shrink to fit, and get marker rays at their end
  const room = V ? 1000 : 1840;
  SHEETS.forEach(({ sec, k }) => {
    const t = sec.querySelector('.title'), w = t.offsetWidth, left = t.offsetLeft;
    const f = Math.min(1, (room - left - 70) / w);
    if (f < 1) t.style.transform = `scale(${f.toFixed(3)})`;
    const x = left + w * f + 26, y = t.offsetTop + t.offsetHeight * f / 2;
    const svg = sec.querySelector('.rays');
    [[[x, y - 34], [x + 26, y - 52]], [[x + 4, y], [x + 36, y]], [[x, y + 34], [x + 26, y + 52]]]
      .forEach((p, i) => path(svg, hand(p, i + 3, .6), { color: 'var(--blue)', w: 5 }));
    // drawn in just after the title
    tl.fromTo(svg.children, { drawSVG: '0%' }, { drawSVG: '100%', duration: .25, ease: 'power1.out', stagger: .07 }, tw(STARTS[k] + 1) + .35);
  });
  window.render = t => {
    tl.seek(t, false);
    drawTracker(t); drawCta(t);
    if (V) drawCaptions(t);
  };
  window.render(0);
  window.READY = true;
}
document.fonts.ready.then(() => requestAnimationFrame(build));
