// Real-source scenes in the light look (real.html?g=r01): the companies' own
// launch pages and launch footage, framed and highlighted. Same engine as the
// dark scenes; `text` is the line Chris says over each one.

const LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

// A browser window showing a captured page. crop = [top, height] in page px.
function browser(name, { left, top, width, crop = [0, 900], url, parent = stage }) {
  const src = SOURCES[name];
  const s = width / 1440;
  const vh = Math.round(crop[1] * s);
  const el = add(`<div class="browser" style="left:${left}px;top:${top}px;width:${width}px">
    <div class="bar"><i></i><i></i><i></i><div class="url">${LOCK}${url || src.url.replace(/^https:\/\//, '').replace(/\/$/, '')}</div></div>
    <div class="view" style="width:${width}px;height:${vh}px"><div class="cam"><img src="sources/${name}.png" style="width:1440px;height:900px"></div></div></div>`, parent);
  const cam = el.querySelector('.cam');
  gsap.set(cam, { x: 0, y: -crop[0] * s, scale: s });
  const marks = src.lines.map(([x, y, w, h]) => {
    const m = add(`<div class="mark" style="left:${x - 4}px;top:${y - 3}px;width:${w + 8}px;height:${h + 6}px"></div>`, cam);
    gsap.set(m, { scaleX: 0 });
    return m;
  });
  const view = { w: width, h: vh };
  return {
    el, cam, marks, s,
    // sweep the highlighter across each line in turn
    sweep(t, per = 0.45) { marks.forEach((m, i) => tl.to(m, { scaleX: 1, duration: per, ease: 'power1.inOut' }, t + i * per)); },
    // move the camera so the quote fills the window
    zoom(t, z = 2, dur = 1.1) {
      const L = src.lines; if (!L.length) return;
      const x0 = Math.min(...L.map(l => l[0])), x1 = Math.max(...L.map(l => l[0] + l[2]));
      const y0 = Math.min(...L.map(l => l[1])), y1 = Math.max(...L.map(l => l[1] + l[3]));
      const S = s * z;
      let X = view.w / 2 - ((x0 + x1) / 2) * S, Y = view.h / 2 - ((y0 + y1) / 2) * S;
      X = Math.min(0, Math.max(view.w - 1440 * S, X)); Y = Math.min(0, Math.max(view.h - 900 * S, Y));
      tl.to(cam, { x: X, y: Y, scale: S, duration: dur, ease: 'power3.inOut' }, t);
    },
  };
}
// A browser window framed on one part of a captured page, rect = [x, y, w, h]
// in page px, so a headline or a quote fills the window and stays readable.
function shot(name, rect, { left, top, width, height, url, parent = stage }) {
  const src = SOURCES[name];
  const [x, y, w, h] = rect, s = Math.min(width / w, height / h);
  const el = add(`<div class="browser" style="left:${left}px;top:${top}px;width:${width}px">
    <div class="bar"><i></i><i></i><i></i><div class="url">${LOCK}${url || src.url.replace(/^https:\/\//, '').replace(/\/$/, '')}</div></div>
    <div class="view" style="width:${width}px;height:${height}px"><div class="cam"><img src="sources/${name}.png" style="width:1440px;height:900px"></div></div></div>`, parent);
  const cam = el.querySelector('.cam');
  gsap.set(cam, { x: width / 2 - (x + w / 2) * s, y: height / 2 - (y + h / 2) * s, scale: s });
  const marks = src.lines.map(([mx, my, mw, mh]) => {
    const m = add(`<div class="mark" style="left:${mx - 4}px;top:${my - 3}px;width:${mw + 8}px;height:${mh + 6}px"></div>`, cam);
    gsap.set(m, { scaleX: 0 });
    return m;
  });
  return { el, sweep(t, per = 0.45) { marks.forEach((m, i) => tl.to(m, { scaleX: 1, duration: per, ease: 'power1.inOut' }, t + i * per)); } };
}
// Real launch footage (clips/) or a launch still (clips/stills/) in a frame,
// labelled with who made it. `from` is how far into the clip it starts at t0.
function tile(src, t0, { left, top, width, height, label, from = 0, still = false, labelTop = false, parent = stage }) {
  const el = add(`<div class="clip" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px"><img>${label ? `<div class="pill dark" style="position:absolute;left:16px;${labelTop ? 'top' : 'bottom'}:16px;height:48px;font-size:22px">${label}</div>` : ''}</div>`, parent);
  const img = el.querySelector('img');
  if (still) {
    img.src = `clips/stills/${src}.jpg`;
    tl.fromTo(img, { scale: 1 }, { scale: 1.08, duration: 8, ease: 'none' }, t0);
  } else CLIP(img, src, t0 - from);
  return el;
}
function phoneClip(name, t0, { left, top, width, parent = stage }) {
  const k = width / 368, H = Math.round(790 * k);
  const el = add(`<div class="clip" style="left:${left}px;top:${top}px;width:${width}px;height:${H}px;border:0;border-radius:${50 * k}px;background:#fff">
    <img style="position:absolute;width:${960 * k}px;height:${836 * k}px;left:${-296 * k}px;top:${-22 * k}px"></div>`, parent);
  CLIP(el.querySelector('img'), name, t0);
  return { el, k, H };
}
const chip = (html, l, t, cls = 'dark', parent = stage) => add(`<div class="pill ${cls} abs" style="left:${l}px;top:${t}px">${html}</div>`, parent);

// ---------- r01: cold open (paragraphs 1 and 2) ----------
// One idea on screen at a time: who this is for, the four launches, what a
// personal agent is (in Meta's own words), then the promise.
scene('r01', {
  text: `If you use ChatGPT or Claude every week, and you want to move into AI engineering, here's something you can't ignore. In the last five months, Google, xAI, Meta and OpenAI have each launched a personal AI agent, which is an AI that keeps working even after you close the app. In this video I am going to explain, in plain English, what a personal agent really is, how it works under the hood, and whether you should use one, build one, or skip it.`,
  build(at) {
    // 1. who this is for
    const A = add('<div class="abs" style="inset:0"></div>');
    const pillx = (t, extra = '') => `<span class="pill ${extra}" style="height:96px;font-size:60px;padding:0 36px;vertical-align:middle;margin:0 6px">${t}</span>`;
    const r1 = add(`<div class="abs h1 center" style="left:0;right:0;top:250px;font-size:80px">You use <span class="p1">${pillx('ChatGPT')}</span> or <span class="p2">${pillx('Claude')}</span> <span class="w1">every week</span></div>`, A);
    const r2 = add(`<div class="abs h1 center" style="left:0;right:0;top:450px;font-size:80px">You want to move into <span class="p3">${pillx('AI engineering', 'blue')}</span></div>`, A);
    IN(r1, 0, { y: 30, duration: 0.5 });
    POP(r1.querySelector('.p1'), at('chatgpt'));
    POP(r1.querySelector('.p2'), at('claude'));
    FADE(r1.querySelector('.w1'), at('every week'));
    IN(r2, at('and you want'), { y: 30 });
    POP(r2.querySelector('.p3'), at('ai engineering'));
    OUT(A, at("here's something") - 0.2, { y: -40 });
    const B = add(`<div class="abs h1 center" style="left:0;right:0;top:380px;font-size:96px">Here’s something you <span style="position:relative;display:inline-block;isolation:isolate"><span class="hl abs" style="inset:6px -10px;background:var(--hl);border-radius:8px;z-index:-1"></span>can’t ignore.</span></div>`);
    IN(B, at("here's something") - 0.1, { y: 30 });
    gsap.set(B.querySelector('.hl'), { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(B.querySelector('.hl'), { scaleX: 1, duration: 0.45, ease: 'power1.inOut' }, at("can't ignore"));
    OUT(B, at('in the last') - 0.25, { y: -40 });

    // 2. four companies, their own launch footage, each as it's named
    const C = add('<div class="abs" style="inset:0"></div>');
    const head = add('<div class="abs h2" style="left:150px;top:36px;font-size:56px">In the last <span style="color:var(--blue)">five months</span></div>', C);
    IN(head, at('in the last'), { x: -30, y: 0 });
    const W = 790, H = 444, X = [150, 980], Y = [125, 595];
    [['spark-mac', 0, 'Google · Gemini Spark · May 19', 'google'],
     ['grok-meet', 1.2, 'xAI · Grok Bot · Aug 11', 'xai'],
     ['muse-intro', 2.4, 'Meta · Muse · Sep 8', 'meta'],
     ['dots-feedback', 0, 'OpenAI · dots · Sep 29', 'openai', true]].forEach(([src, from, label, cue, still], i) => {
      const t = tile(src, at(cue), { left: X[i % 2], top: Y[i >> 1], width: W, height: H, label, from, still, parent: C });
      IN(t, at(cue), { y: 50, scale: 0.96, duration: 0.5 });
    });
    const four = add('<div class="pill blue abs" style="left:760px;top:540px;height:84px;font-size:38px;padding:0 40px;box-shadow:0 20px 50px rgba(37,99,235,.25)"><span class="dot"></span>Personal AI agents</div>', C);
    POP(four, at('personal ai agent') - 0.15, { scale: 1.3 });
    OUT(C, at('which is') - 0.1, { y: -40 });

    // 3. what that means: Google's agent finishing a job on a locked phone, and Meta's own words
    const D = add('<div class="abs" style="inset:0"></div>');
    const def = add(`<div class="abs center" style="left:0;right:0;top:70px">
      <div class="h1" style="font-size:80px;line-height:1.15">An AI that <span class="k1" style="position:relative;display:inline-block;isolation:isolate"><span class="hl abs" style="inset:6px -8px;background:var(--hl);border-radius:8px;z-index:-1"></span>keeps working</span><br>even after you <span class="k2" style="position:relative;display:inline-block;isolation:isolate"><span class="hl abs" style="inset:6px -8px;background:var(--hl);border-radius:8px;z-index:-1"></span>close the app</span></div></div>`, D);
    IN(def, at('which is'), { y: 30 });
    def.querySelectorAll('.hl').forEach(h => gsap.set(h, { scaleX: 0, transformOrigin: '0 50%' }));
    tl.to(def.querySelector('.k1 .hl'), { scaleX: 1, duration: 0.4, ease: 'power1.inOut' }, at('keeps working'));
    tl.to(def.querySelector('.k2 .hl'), { scaleX: 1, duration: 0.4, ease: 'power1.inOut' }, at('close the app'));
    const g = tile('spark-notify', at('keeps working') - 0.2, { left: 150, top: 340, width: 800, height: 450, label: 'Google · Spark, on a locked phone', parent: D });
    IN(g, at('keeps working') - 0.2, { y: 40 });
    const Q = add('<div class="abs" style="inset:0"></div>', D);
    const q = shot('meta-muse-quote', [50, 395, 560, 110], { left: 1010, top: 450, width: 760, height: 180, parent: Q });
    chip('Meta’s launch post · Sep 8, 2026', 985, 420, 'dark', Q);
    IN(Q, at('even after') - 0.2, { x: 40, y: 0 });
    q.sweep(at('close the app'), 0.6);
    OUT(D, at('in this video') - 0.25, { y: -40 });

    // 4. the promise
    const E = add('<div class="abs" style="inset:0"></div>');
    const h = add('<div class="abs h1" style="left:310px;top:110px;font-size:84px">In this video</div>', E);
    IN(h, at('in this video'), { x: -30, y: 0 });
    FADE(add('<div class="abs body muted" style="left:314px;top:220px;font-size:36px">In plain English</div>', E), at('plain english'));
    [['1', 'What a personal agent really is', 'what a personal'], ['2', 'How it works under the hood', 'how it works'], ['3', 'Use one, build one, or skip it', 'whether']].forEach(([n, t, c], i) => {
      const r = add(`<div class="card abs" style="left:310px;top:${330 + i * 180}px;width:1300px;height:150px;display:flex;align-items:center;gap:40px;padding:0 50px">
        <div style="width:84px;height:84px;border-radius:24px;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:800">${n}</div>
        <div class="h2" style="font-size:54px">${t}</div></div>`, E);
      IN(r, at(c), { x: -50, y: 0 });
    });
  },
});

// ---------- r15b: real launch demos of "it messages you first" (new line, after paragraph 15) ----------
scene('r15b', {
  text: `And this isn't a made-up example. When Google launched Spark, it showed this exact idea: Spark saw a t-ball game on the calendar and added the snacks to a shopping cart. And Meta showed Muse finding a field trip form in an email and filling it out before anyone asked.`,
  build(at) {
    const tag = chip('<span class="dot"></span>Real launch demos', 120, 80, 'blue');
    IN(tag, 0.1, { x: -30, y: 0 });
    // Google's demo
    const G = add('<div class="abs" style="inset:0"></div>');
    const g = add(`<div class="clip" style="left:120px;top:180px;width:1100px;height:619px"><img></div>`, G);
    CLIP(g.querySelector('img'), 'spark-notify', at('when google') + 0.2);
    const gl = add(`<div class="abs" style="left:1290px;top:300px;width:520px">
      <div class="pill dark">Google · Gemini Spark</div>
      <div class="h3" style="margin-top:28px">Saw the game on the calendar, and added the snacks to the cart</div>
      <div class="body muted" style="margin-top:18px;font-size:24px">Launch demo, 19 May 2026</div></div>`, G);
    IN(g, at('when google'), { y: 50 });
    IN(gl, at('saw a'), { x: 30, y: 0 });
    OUT(G, at('and meta') - 0.2, { x: -120 });
    // Meta's demo
    const M = add('<div class="abs" style="inset:0"></div>');
    const ph = phoneClip('muse-fieldtrip', at('and meta') + 0.2, { left: 260, top: 150, width: 400, parent: M });
    const ml = add(`<div class="abs" style="left:800px;top:330px;width:900px">
      <div class="pill dark">Meta · Muse</div>
      <div class="h2" style="margin-top:30px">Found the form in an email, and filled it out before anyone asked</div>
      <div class="body muted" style="margin-top:20px;font-size:24px">Launch demo, 8 Sep 2026</div></div>`, M);
    IN(ph.el, at('and meta'), { x: 120, y: 0 });
    IN(ml, at('finding'), { x: 30, y: 0 });
    FADE(add('<div class="credit" style="left:120px;top:1030px">Footage: Google and Meta launch posts</div>'), 0.4);
  },
});

// ---------- r47: the one rule, on Muse's real approval screen (paragraph 47) ----------
scene('r47', {
  text: `So give your agent one rule: ask me before you send, buy, or delete anything. It costs you a few seconds, and it can save you from a really bad day.`,
  build(at) {
    const L = 300, T = 100, t0 = 0.5;
    const ph = phoneClip('muse-allow', t0, { left: L, top: T, width: 400 });
    IN(ph.el, 0.1, { y: 50 });
    const k = ph.k;                          // the dialog sits at x 313-647, y 305-670 in Meta's frame
    const ring = add(`<div class="ring" style="left:${L + (313 - 296) * k - 8}px;top:${T + (305 - 22) * k - 8}px;width:${334 * k + 16}px;height:${365 * k + 16}px"></div>`);
    POP(ring, t0 + 2.6, { scale: 1.12 });
    OUT(ring, t0 + 5.3);
    FADE(add(`<div class="credit" style="left:${L}px;top:${T + ph.H + 16}px">Footage: Meta, “Introducing Muse”, 8 Sep 2026</div>`), 0.4);
    const rule = add(`<div class="card abs" style="left:900px;top:230px;width:860px;padding:50px 56px">
      <div class="pill blue"><span class="dot"></span>One rule for your agent</div>
      <div class="h2" style="margin-top:34px">“Ask me before you send, buy, or delete anything.”</div></div>`);
    IN(rule, at('ask me'), { x: 40, y: 0 });
    const asks = add(`<div class="card abs" style="left:900px;top:640px;width:860px;padding:34px 56px;display:flex;gap:26px;align-items:center">
      <div style="width:64px;height:64px;border-radius:18px;background:#EFF5FF;display:flex;align-items:center;justify-content:center;flex:none">
        <svg viewBox="0 0 24 24" width="36" fill="none" stroke="#2563EB" stroke-width="2"><path d="m5 12 5 5 9-10"/></svg></div>
      <div><div class="body muted" style="font-size:26px">Muse already asks first:</div><div class="h3">“Allow Muse to send this email?”</div></div></div>`);
    IN(asks, t0 + 2.9, { x: 40, y: 0 });
  },
});
