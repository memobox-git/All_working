// The Short (short.html?slot=1): the hook, the four real launches, "how does
// it do that?", the heartbeat, and "while you sleep". Same engine and the same
// real footage as the full video, laid out for a 1080x1920 phone screen,
// with captions that light up each word as Chris says it.

// highlighter sweep under a word or phrase made with <span class="mk"><i></i>…</span>
function SWEEP(el, t) {
  el.querySelectorAll('.mk>i').forEach((m, k) => {
    gsap.set(m, { scaleX: 0 });
    tl.to(m, { scaleX: 1, duration: 0.4, ease: 'power1.inOut' }, (Array.isArray(t) ? t[k] : t));
  });
}

// captions: up to three words at a time, the word being said highlighted
function captions(shown) {
  const chunks = [];
  let cur = [];
  shown.forEach(([w, t], i) => {
    cur.push([w, t]);
    if (cur.length === 3 || /[,.?!:]$/.test(w) || i === shown.length - 1) { chunks.push(cur); cur = []; }
  });
  chunks.forEach((c, k) => {
    const end = k + 1 < chunks.length ? chunks[k + 1][0][1] - 0.04 : SLOT.dur;
    const el = add(`<div class="cap">${c.map(([w]) => `<span class="cw">${w.replace(/[,.:;]$/, '')}</span>`).join(' ')}</div>`);
    gsap.set(el, { autoAlpha: 0 });
    tl.set(el, { autoAlpha: 1 }, Math.max(0, c[0][1] - 0.04));
    tl.set(el, { autoAlpha: 0 }, end);
    [...el.children].forEach((span, j) => {
      gsap.set(span, { backgroundColor: 'rgba(255,228,92,0)' });
      tl.set(span, { backgroundColor: 'rgba(255,228,92,1)' }, c[j][1] - 0.04);
      if (j + 1 < c.length) tl.set(span, { backgroundColor: 'rgba(255,228,92,0)' }, c[j + 1][1] - 0.04);
    });
  });
}

const group = () => add('<div class="abs" style="inset:0"></div>');

scene('short', {
  text: '',
  build(at) {
    // 1. who it's for
    const A = group();
    const pills = add(`<div class="abs center" style="left:0;right:0;top:280px;display:flex;justify-content:center;gap:28px">
      <span class="p1 pill" style="height:130px;font-size:68px;padding:0 44px">ChatGPT</span><span class="p2 pill" style="height:130px;font-size:68px;padding:0 44px">Claude</span></div>`, A);
    POP(pills.querySelector('.p1'), at('chatgpt')); POP(pills.querySelector('.p2'), at('claude'));
    FADE(add('<div class="abs center big" style="left:0;right:0;top:470px;font-size:92px">every week</div>', A), at('every week'), { y: 20 });
    POP(add('<div class="abs center" style="left:0;right:0;top:680px"><span class="pill blue" style="height:140px;font-size:66px;padding:0 50px">→ AI engineering</span></div>', A), at('ai engineering'));
    OUT(A, at("here's something") - 0.15, { y: -40 });
    const B = add(`<div class="abs center big" style="left:40px;right:40px;top:330px">Here’s something you <span class="mk"><i></i>can’t ignore</span></div>`);
    IN(B, at("here's something") - 0.1, { y: 30 });
    SWEEP(B, at("can't ignore"));
    OUT(B, at('in the last') - 0.2, { y: -40 });

    // 2. the four launches, each one's own footage as it's named
    const C = group();
    IN(add('<div class="abs center h1" style="left:0;right:0;top:170px;font-size:78px">In the last <span style="color:var(--blue)">5 months</span></div>', C), at('in the last'), { y: 20 });
    const names = add('<div class="abs" style="left:60px;right:60px;top:900px;display:flex;justify-content:center;gap:18px"></div>', C);
    FADE(names, at('in the last') + 0.3);
    [['spark-mac', 0, 'Google · Gemini Spark', 'google', 'Google'], ['grok-meet', 1.2, 'xAI · Grok Bot', 'xai', 'xAI'],
     ['muse-intro', 2.4, 'Meta · Muse', 'meta', 'Meta'], ['dots-feedback', 0, 'OpenAI · dots', 'openai', 'OpenAI', true]].forEach(([src, from, label, cue, co, still]) => {
      const t = tile(src, at(cue), { left: 60, top: 320, width: 960, height: 540, label, from, still, parent: C });
      FADE(t, at(cue), { scale: 0.97, duration: 0.25 });
      const n = add(`<span class="pill" style="height:76px;font-size:38px">${co}</span>`, names);
      tl.from(n, { autoAlpha: 0.25, duration: 0.2 }, at(cue));
      tl.to(n, { backgroundColor: '#2563EB', borderColor: '#2563EB', color: '#fff', duration: 0.2 }, at(cue));
    });
    POP(add('<div class="abs center" style="left:0;right:0;top:1010px"><span class="pill dark" style="height:84px;font-size:42px;padding:0 36px">Each launched a personal AI agent</span></div>', C), at('launched'));
    OUT(C, at('which is') - 0.1, { y: -40 });

    // 3. what that means: Google's agent finishing a job on a locked phone
    const D = group();
    const def = add(`<div class="abs center h1" style="left:40px;right:40px;top:170px;font-size:80px;line-height:1.15">An AI that <span class="mk"><i></i>keeps working</span><br>after you <span class="mk"><i></i>close the app</span></div>`, D);
    IN(def, at('which is'), { y: 30 });
    SWEEP(def, [at('keeps working'), at('close the app')]);
    IN(tile('spark-notify', at('keeps working') - 0.2, { left: 60, top: 480, width: 960, height: 540, label: 'Google · Spark, on a locked phone', parent: D }), at('keeps working') - 0.2, { y: 40 });
    OUT(D, at('now how') - 0.2, { y: -40 });

    // 4. how does it do that?
    const E = group();
    POP(add('<div class="abs" style="left:420px;top:230px;width:240px;height:240px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:170px;font-weight:800;box-shadow:0 30px 70px rgba(37,99,235,.3)">?</div>', E), at('now how'));
    IN(add('<div class="abs center big" style="left:40px;right:40px;top:540px;font-size:96px">How does it<br>do that?</div>', E), at('now how') + 0.2, { y: 30 });
    IN(add('<div class="abs center h3" style="left:60px;right:60px;top:820px;font-size:48px;color:var(--muted)">It isn’t thinking about you all day</div>', E), at('because it'), { y: 20 });
    OUT(E, at('most personal') - 0.2, { y: -40 });

    // 5. a timer and triggers
    const F = group();
    const card = (top, ic, title, sub, t) => IN(add(`<div class="card abs" style="left:60px;top:${top}px;width:960px;height:220px;display:flex;align-items:center;gap:36px;padding:0 50px">
      <div class="badge" style="width:120px;height:120px;border-radius:32px">${icon(ic)}</div><div><div class="h2" style="font-size:66px">${title}</div><div class="body muted" style="font-size:34px">${sub}</div></div></div>`, F), t, { x: -40, y: 0 });
    card(330, 'cal', 'A timer', 'Wakes it every so often', at('timer'));
    card(600, 'bolt', 'Triggers', 'Wake it right away', at('triggers'));
    OUT(F, at('openclaw') - 0.2, { y: -40 });

    // 6. OpenClaw's own docs page
    const G = group();
    const doc = shot('openclaw-heartbeat', [380, 180, 660, 300], { left: 60, top: 330, width: 960, height: 600, parent: G });
    chip('OpenClaw docs · a free, open-source agent', 40, 300, 'dark', G);
    IN(G, at('openclaw'), { y: 50 });
    doc.sweep(at('heartbeat') - 0.2, 0.5);
    OUT(G, at('a heartbeat just') - 0.2, { y: -40 });

    // 7. the heartbeat: every 30 minutes, three checks
    const H = group();
    IN(add('<div class="abs center h1" style="left:0;right:0;top:160px;font-size:80px">The heartbeat</div>', H), at('a heartbeat just'), { y: 20 });
    const xs = [170, 400, 630, 860];
    let d = 'M60 330';
    xs.forEach(x => (d += `H${x - 30}l12 -10l14 -70l14 130l12 -60l8 10`));
    d += 'H1020';
    const svg = add(`<svg class="wires" style="width:1080px;height:1920px"><path class="wire" style="stroke-width:6" d="${d}"/></svg>`, H);
    DRAW(svg.firstChild, at('a heartbeat just'), 2);
    ['8:00', '8:30', '9:00', '9:30'].forEach((tm, i) => FADE(add(`<div class="abs mono muted center" style="left:${xs[i] - 60}px;top:420px;width:120px;font-size:30px">${tm}</div>`, H), at('every thirty') + i * 0.1));
    POP(add('<div class="abs center" style="left:0;right:0;top:480px"><span class="pill blue" style="height:72px;font-size:36px">Every 30 minutes, by default</span></div>', H), at('every thirty'));
    const step = (top, n, txt, t) => { const el = add(`<div class="card stepcard" style="top:${top}px"><div class="n">${n}</div><div class="t">${txt}</div></div>`, H); IN(el, t, { x: -40, y: 0 }); return el; };
    step(590, 1, 'Reads a short checklist', at('reads a short'));
    step(750, 2, 'Looks at your email and calendar', at('looks at'));
    const q = step(910, 3, 'Anything worth telling you right now?', at('asks one'));
    tl.to(q, { borderColor: '#2563EB', boxShadow: '0 0 0 6px rgba(37,99,235,.15), 0 24px 60px rgba(37,99,235,.18)', duration: 0.3 }, at('is anything'));
    OUT(H, at('if yes') - 0.2, { y: -40 });

    // 8. yes: it messages you (Muse, for real); no: back to sleep
    const I = group();
    IN(tile('muse-training', at('if yes') - 0.2, { left: 60, top: 200, width: 960, height: 540, label: 'Meta · Muse messages first', from: 2.2, zoom: 1.8, origin: '40% 42%', parent: I }), at('if yes') - 0.2, { y: 40 });
    const yes = add(`<div class="abs" style="left:60px;top:790px;display:flex;align-items:center;gap:24px"><span class="pill blue" style="height:96px;font-size:48px;padding:0 36px">Yes → it messages you</span></div>`, I);
    POP(yes, at('if yes'));
    const no = add(`<div class="abs" style="left:60px;top:920px;display:flex;align-items:center;gap:24px"><span class="pill" style="height:96px;font-size:48px;padding:0 36px;gap:18px"><span style="width:50px;display:flex">${icon('moon')}</span>No → back to sleep</span></div>`, I);
    POP(no, at('if not'));
    OUT(I, at('so the agent') - 0.2, { y: -40 });

    // 9. while you sleep, and where the full video is
    const J = group();
    POP(add(`<div class="abs moon" style="left:440px;top:200px;width:200px;color:#6366F1">${icon('moon')}</div>`, J), at('so the agent'));
    const end = add('<div class="abs center big" style="left:40px;right:40px;top:450px;font-size:92px">It keeps working<br><span class="mk"><i></i>while you sleep</span></div>', J);
    IN(end, at('so the agent') + 0.1, { y: 30 });
    SWEEP(end, at('while you sleep'));
    const brand = add(`<div class="abs center" style="left:0;right:0;top:760px">
      <div class="pill dark" style="height:84px;font-size:38px;padding:0 36px">Full video: Personal AI agents, explained</div>
      <div class="mono" style="margin-top:22px;font-size:30px;letter-spacing:.2em;color:var(--blue)">STACKLE · YOUR CAREER LAB</div></div>`, J);
    IN(brand, at('while you sleep') + 0.4, { y: 30 });

    captions(SLOT.shown);
  },
});
