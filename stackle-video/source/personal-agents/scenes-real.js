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
function phoneClip(name, t0, { left, top, width, parent = stage }) {
  const k = width / 368, H = Math.round(790 * k);
  const el = add(`<div class="clip" style="left:${left}px;top:${top}px;width:${width}px;height:${H}px;border:0;border-radius:${50 * k}px;background:#fff">
    <img style="position:absolute;width:${960 * k}px;height:${836 * k}px;left:${-296 * k}px;top:${-22 * k}px"></div>`, parent);
  CLIP(el.querySelector('img'), name, t0);
  return { el, k, H };
}
const chip = (html, l, t, cls = 'dark', parent = stage) => add(`<div class="pill ${cls} abs" style="left:${l}px;top:${t}px">${html}</div>`, parent);

// ---------- r01: cold open, the four launch posts say the same thing ----------
scene('r01', {
  text: `If you use ChatGPT or Claude every week, and you want to move into AI engineering, here's something you can't ignore. In the last five months, Google, xAI, Meta and OpenAI have each launched a personal AI agent, which is an AI that keeps working even after you close the app. In this video I am going to explain, in plain English, what a personal agent really is, how it works under the hood, and whether you should use one, build one, or skip it.`,
  build(at) {
    // opening seconds: Meta's own launch footage, full frame
    const open = add(`<div class="clip" style="left:150px;top:90px;width:1620px;height:911px"><img></div>`);
    CLIP(open.querySelector('img'), 'muse-sizzle', 0);
    add(`<div class="credit" style="left:150px;top:1018px">Footage: Meta, “Introducing Muse”, 8 Sep 2026</div>`, open.parentElement);
    const credit0 = stage.lastChild;
    FADE(open, 0, { scale: 0.97 });
    OUT([open, credit0], at('in the last') - 0.3, { scale: 0.96 });

    const tag = chip('<span class="dot"></span>In the last five months', 140, 100, 'blue');
    IN(tag, at('in the last'), { x: -30, y: 0 });
    const posts = [
      ['google-spark-top', [130, 540], 'May 19 · Google', 'google', -2],
      ['xai-grokbot-top', [40, 540], 'Aug 11 · xAI', 'xai', 1.5],
      ['meta-muse-top', [80, 540], 'Sep 8 · Meta', 'meta', -1],
      ['openai-dots-top', [250, 540], 'Sep 29 · OpenAI', 'openai', 2],
    ];
    const grid = [[150, 200], [990, 200], [150, 630], [990, 630]];
    const cards = posts.map(([name, crop, label, cue, rot], i) => {
      const wrap = add(`<div class="abs" style="left:${300 + i * 70}px;top:${210 + i * 64}px;width:1060px;height:440px"></div>`);
      const b = browser(name, { left: 0, top: 0, width: 1060, crop, parent: wrap });
      const c = chip(label, -18, -26, 'dark', wrap);
      gsap.set(wrap, { rotation: rot, transformOrigin: '50% 50%' });
      tl.from(wrap, { autoAlpha: 0, y: 260, rotation: rot * 3, duration: 0.55, ease: 'back.out(1.4)' }, at(cue));
      // spread into a grid, then highlight each post's own words
      tl.to(wrap, { left: grid[i][0], top: grid[i][1], rotation: 0, scale: 0.755, transformOrigin: '0 0', duration: 0.8, ease: 'power3.inOut' }, at('launched') + i * 0.05);
      b.sweep(at('launched') + 0.9 + i * 0.55, 0.3);
      return wrap;
    });
    OUT(cards, at('keeps working') - 0.35, { scale: 0.7, y: 40, stagger: 0.04 });
    OUT(tag, at('keeps working') - 0.35);

    // the quotes, word for word
    const q1 = add('<div class="abs" style="inset:0"></div>');
    const meta = browser('meta-muse-quote', { left: 240, top: 70, width: 1440, crop: [0, 900], parent: q1 });
    chip('Meta · Sep 8, 2026', 210, 44, 'dark', q1);
    IN(q1, at('keeps working') - 0.3, { y: 60 });
    meta.zoom(at('keeps working') - 0.1, 2.1, 0.9);
    meta.sweep(at('keeps working') + 0.7, 0.5);
    const q2 = add('<div class="abs" style="inset:0"></div>');
    const goog = browser('google-spark-quote', { left: 240, top: 70, width: 1440, crop: [0, 900], parent: q2 });
    chip('Google · May 19, 2026', 210, 44, 'dark', q2);
    tl.from(q2, { x: 1900, duration: 0.7, ease: 'power3.out' }, at('close the app') - 0.2); // fully off screen until then
    goog.zoom(at('close the app'), 1.9, 0.9);
    goog.sweep(at('close the app') + 0.8, 0.5);
    OUT(q1, at('close the app') + 0.6);
    OUT(q2, at('in this video') + 0.4, { scale: 0.96 });

    // the promise
    add('<div class="abs" style="left:310px;top:200px"><div class="pill blue"><span class="dot"></span>In this video</div></div>');
    FADE(stage.lastChild, at('in this video') + 0.6);
    [['1', 'What a personal agent really is', 'plain english'], ['2', 'How it works under the hood', 'how it works'], ['3', 'Use one, build one, or skip it', 'whether']].forEach(([n, t, c], i) => {
      const r = add(`<div class="card abs" style="left:310px;top:${300 + i * 180}px;width:1300px;height:150px;display:flex;align-items:center;gap:40px;padding:0 50px">
        <div style="width:84px;height:84px;border-radius:24px;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:800">${n}</div>
        <div class="h2" style="font-size:54px">${t}</div></div>`);
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
    const ph = phoneClip('muse-fieldtrip', at('and meta') + 0.2, { left: 260, top: 110, width: 400, parent: M });
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
