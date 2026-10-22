// The camera lines. Where Chris filmed a line, his lip-synced take
// (camera/lipsync.py) fills the frame, with a light card or two over it. Where
// he didn't, or his take stops early, the line is told in graphics instead.
// Scene ids: f<line> is all face, c<line> is graphics (with his face first,
// when he filmed the start of the line).

// his take, full frame, with a slow push-in; hidden outside FACES[line].from-to
function face(line, parent = stage) {
  const F = FACES[line];
  const el = add('<div class="abs" style="inset:0;overflow:hidden;background:#EDE6D6"><img style="width:1920px;height:1080px;display:block"></div>', parent);
  const img = el.querySelector('img');
  CLIP(img, 'face-' + line, F.from);
  tl.fromTo(img, { scale: 1 }, { scale: 1.05, duration: SLOT.dur, ease: 'none', transformOrigin: '50% 40%' }, 0);
  if (F.from > 0) { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, F.from); }
  if (!F.full) tl.set(el, { autoAlpha: 0 }, F.to);
  return el;
}
const afterFace = line => FACES[line].to;

// a white card over his shot, lower left, where the wall is
function lower(html, t, out, { left = 80, top = 830, width = 620 } = {}) {
  const el = add(`<div class="card abs" style="left:${left}px;top:${top}px;width:${width}px;padding:26px 32px;border-left:8px solid var(--blue)">${html}</div>`);
  IN(el, t, { x: -40, y: 0 });
  if (out) OUT(el, out, { x: -40 });
  return el;
}
const big = (html, top, t, parent = stage, size = 96) => {
  const el = add(`<div class="abs center h1" style="left:120px;right:120px;top:${top}px;font-size:${size}px;line-height:1.1">${html}</div>`, parent);
  IN(el, t, { y: 30 });
  return el;
};
// a highlighter under part of a line: <span class="hlw"><i></i>text</span>
function hl(el, t) {
  el.querySelectorAll('.hlw>i').forEach((m, k) => {
    gsap.set(m, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(m, { scaleX: 1, duration: 0.4, ease: 'power1.inOut' }, Array.isArray(t) ? t[k] : t);
  });
}
const H = txt => `<span class="hlw" style="position:relative;display:inline-block;isolation:isolate"><i style="position:absolute;inset:6px -10px;background:var(--hl);border-radius:10px;z-index:-1"></i>${txt}</span>`;

// ---------- line 3 ----------
scene('f3', {
  text: `Because every launch demo looks amazing, but almost nobody shows you what's actually different from the chat app you already have. And if you want to build AI for a living, you need to know how these things work, not just what they look like.`,
  build(at) {
    face('3');
    lower('<div class="h3" style="font-size:38px">How they work,<br><span style="color:var(--blue)">not just how they look</span></div>', at('you need to know'));
  },
});

// ---------- line 4: who Chris is ----------
scene('c4', {
  text: `If you are new here, I am Chris. I have worked in data engineering for more than ten years. Today I run Stackle, where I teach data and AI engineering. And more than five hundred people signed up for my free Claude workshop.`,
  build(at) {
    const intro = big('If you’re new here…', 420, 0.1);
    OUT(intro, FACES['4'].from, { duration: 0.01 });
    face('4');
    lower(`<div class="h2" style="font-size:56px">Chris</div><div class="body muted" style="font-size:30px">Data and AI engineering · Stackle</div>`, at('i am chris') + 0.1, afterFace('4') - 0.3);
    const fact = (txt, top, t) => { const el = add(`<div class="card abs" style="left:1360px;top:${top}px;width:480px;padding:24px 30px;display:flex;gap:18px;align-items:center">
      <span style="flex:none;width:52px;height:52px;border-radius:14px;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center">${svgi('check', 30)}</span><div class="h3" style="font-size:34px">${txt}</div></div>`);
      IN(el, t, { x: 40, y: 0 }); OUT(el, afterFace('4') - 0.3, { x: 40 }); };
    fact('10+ years in data engineering', 140, at('ten years'));
    fact('Runs Stackle', 290, at('stackle'));
    fact('Teaches data and AI engineering', 440, at('teach'));
    // after his take: the workshop
    const W = add('<div class="abs" style="inset:0"></div>');
    const n = add('<div class="abs center" style="left:0;right:0;top:250px;font-size:220px;font-weight:800;letter-spacing:-.04em;color:var(--blue)">0</div>', W);
    COUNT(n, at('five hundred') - 0.2, 500, { dur: 1.2, fmt: v => Math.round(v) + (v > 499 ? '+' : '') });
    FADE(n, afterFace('4'));
    big('people signed up for my <span style="color:var(--blue)">free Claude workshop</span>', 560, at('signed up'), W, 68);
  },
});

// ---------- line 5 ----------
scene('f5', {
  text: `And to be honest with you, I use a do-it-yourself AI agent for my own work every week, and there are still things I won't let it touch. So I'll show you what's real, what's hype, and the one risk most videos skip.`,
  build(at) {
    face('5');
    const row = add('<div class="abs" style="left:80px;top:850px;display:flex;gap:18px"></div>');
    [['What’s real', "what's real", ''], ['What’s hype', "what's hype", ''], ['The one risk most videos skip', 'the one risk', 'dark']].forEach(([t, c, cls]) =>
      POP(add(`<div class="pill ${cls}" style="height:80px;font-size:36px;padding:0 32px;box-shadow:0 14px 40px rgba(17,24,39,.15)">${t}</div>`, row), at(c)));
  },
});

// ---------- line 7: the task ----------
scene('f7', {
  text: `So let's say you have an interview next week, for a data engineering job at a bank. I'm going to give that same task to all three kinds of AI.`,
  build(at) {
    face('7');
    const c = add(`<div class="card abs" style="left:1300px;top:150px;width:540px;padding:34px 38px">
      <div class="pill blue"><span class="dot"></span>Your task</div>
      <div class="h3" style="margin-top:20px;font-size:40px">An interview for a data engineering job, next week</div></div>`);
    IN(c, at('an interview') - 0.1, { x: 40, y: 0 });
    const k = add('<div class="abs" style="left:1300px;top:520px;display:flex;flex-direction:column;gap:14px"></div>');
    ['Chatbot', 'DIY agent', 'Personal agent'].forEach((t, i) => POP(add(`<div class="pill" style="height:70px;font-size:32px;box-shadow:0 10px 30px rgba(17,24,39,.12)">${i + 1} · ${t}</div>`, k), at('all three') + i * 0.15));
  },
});

// ---------- line 10 ----------
scene('f10', {
  text: `Now, you might be thinking, doesn't ChatGPT remember me now? And the answer is yes. ChatGPT, Claude and Gemini all have a memory feature. But the app decides what to save, and it does nothing until you open it and type. Keep that in mind, because that's the gap the other two fill.`,
  build(at) {
    face('10');
    const row = add('<div class="abs" style="left:80px;top:150px;display:flex;gap:16px"></div>');
    ['ChatGPT', 'Claude', 'Gemini'].forEach((t, i) => POP(add(`<div class="pill" style="height:70px;font-size:32px;box-shadow:0 10px 30px rgba(17,24,39,.12)">${t}</div>`, row), at('chatgpt claude') + i * 0.2));
    OUT(row, at('keep that in mind'));
    lower('<div class="h3" style="font-size:38px">They all have memory</div>', at('all have a memory'), at('but the app') - 0.1);
    lower('<div class="body muted" style="font-size:28px">But the app…</div><div class="h3" style="font-size:36px">decides what to save, and waits until you type</div>', at('but the app'), at('keep that in mind'));
    lower('<div class="h3" style="font-size:38px">The gap the other two fill</div>', at('the gap'));
  },
});

// ---------- line 13 ----------
scene('f13', {
  text: `And so the DIY agent remembers, and it keeps your files in order. But you still have to start every task yourself.`,
  build(at) {
    face('13');
    lower('<div class="h3" style="font-size:38px">Remembers, and keeps your files in order</div>', at('remembers'), at('but you still') - 0.1);
    lower('<div class="h3" style="font-size:38px">But <span style="color:var(--blue)">you</span> start every task</div>', at('but you still'));
  },
});

// ---------- line 17: then it's just text files ----------
scene('c17', {
  text: `Now, before personal agents, let me show you how a DIY agent works inside, because personal agents work the same way. And honestly, it's just text files.`,
  build(at) {
    face('17');
    const t = afterFace('17');
    const pair = add(`<div class="abs" style="left:0;right:0;top:260px;display:flex;justify-content:center;align-items:center;gap:50px">
      <div class="card" style="width:520px;padding:40px;display:flex;gap:24px;align-items:center"><div class="badge">${icon('folder')}</div><div class="h2" style="font-size:54px">DIY agent</div></div>
      <div class="h1" style="color:var(--muted)">=</div>
      <div class="card" style="width:600px;padding:40px;display:flex;gap:24px;align-items:center"><div class="badge">${icon('bell')}</div><div class="h2" style="font-size:54px">Personal agent</div></div></div>`);
    IN(pair, t, { y: 30 });
    big('They work the same way', 500, t + 0.2, stage, 72);
    const files = add('<div class="abs" style="left:0;right:0;top:700px;display:flex;justify-content:center;gap:40px"></div>');
    ['CLAUDE.md', 'memory.md', 'notes.md'].forEach((n, i) => POP(add(`<div class="card" style="padding:22px 30px;display:flex;gap:16px;align-items:center"><span style="width:44px;display:flex">${DOC_SVG}</span><span class="mono" style="font-size:32px;color:var(--blue)">${n}</span></div>`, files), at('just text files') + i * 0.12));
    POP(add('<div class="abs center" style="left:0;right:0;top:880px"><span class="pill dark" style="height:76px;font-size:36px">It’s just text files</span></div>'), at('just text files') + 0.4);
  },
});

// ---------- lines 22 and 26 ----------
scene('f22', {
  text: `So let me show you two ways this pays off.`,
  build(at) {
    face('22');
    POP(add('<div class="abs" style="left:80px;top:850px"><span class="pill dark" style="height:84px;font-size:40px;padding:0 36px">2 ways it pays off</span></div>'), at('two ways'));
  },
});
scene('f26', {
  text: `So a DIY agent remembers what you give it, keeps it in order, and does the boring work across your apps.`,
  build(at) {
    face('26');
    const col = add('<div class="abs" style="left:80px;top:620px;display:flex;flex-direction:column;gap:16px"></div>');
    [['Remembers what you give it', 'remembers'], ['Keeps it in order', 'keeps it in'], ['Does the boring work across your apps', 'boring work']].forEach(([t, c]) =>
      IN(add(`<div class="card" style="padding:20px 28px;display:flex;gap:16px;align-items:center"><span style="flex:none;width:46px;height:46px;border-radius:12px;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center">${svgi('check', 28)}</span><span class="h3" style="font-size:34px">${t}</span></div>`, col), at(c), { x: -40, y: 0 }));
  },
});

// ---------- line 27: the free call ----------
function callCard(t, parent = stage, top = 300) {
  const c = add(`<div class="card abs" style="left:410px;top:${top}px;width:1100px;padding:50px 60px;display:flex;gap:44px;align-items:center">
    <div class="badge" style="width:150px;height:150px;border-radius:40px">${icon('cal')}</div>
    <div><div class="h2" style="font-size:66px">Free 15-minute call</div><div class="body muted" style="font-size:36px;margin-top:8px">with Chris · first link in the description</div></div></div>`, parent);
  IN(c, t, { y: 40 });
  return c;
}
scene('c27', {
  text: `By the way, if you're trying to move into data or AI engineering and you're not sure what to learn first, the first link in the description books a free fifteen-minute call with me.`,
  build(at) {
    face('27');
    big('Not sure what to learn first?', 360, afterFace('27'));
    OUT(stage.lastChild, at('the first link') - 0.2, { y: -40 });
    callCard(at('the first link'));
    POP(add('<div class="abs center" style="left:0;right:0;top:640px"><span class="pill blue" style="height:76px;font-size:36px">↓ First link in the description</span></div>'), at('description'));
  },
});

// ---------- line 31: proactive ----------
scene('c31', {
  text: `But the big difference is that personal agents are proactive out of the box, which means they act before you ask.`,
  build(at) {
    face('31');
    const t = afterFace('31');
    const h = big(`Personal agents are ${H('proactive')}`, 280, t);
    hl(h, at('proactive'));
    POP(add('<div class="abs center" style="left:0;right:0;top:450px"><span class="pill" style="height:76px;font-size:36px">Out of the box</span></div>'), at('out of the box'));
    const n = add(`<div class="notif" style="left:510px;top:620px;width:900px"><div class="ap">${svgi('bell', 36, '#fff')}</div>
      <div><div class="nh">Personal agent<span style="margin-left:auto">now</span></div><div class="nt">It acts before you ask</div></div></div>`);
    IN(n, at('they act'), { y: -30 });
  },
});

// ---------- line 33 ----------
scene('c33', {
  text: `Now, how does it actually do that? Because it isn't thinking about you all day. And this is the part most videos skip, so let me make it clear.`,
  build(at) {
    POP(add('<div class="abs" style="left:840px;top:110px;width:240px;height:240px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:170px;font-weight:800;box-shadow:0 30px 70px rgba(37,99,235,.3)">?</div>'), at('how does'));
    big('How does it actually do that?', 420, at('how does') + 0.2);
    const no = add(`<div class="abs center" style="left:0;right:0;top:600px"><span class="pill red" style="height:80px;font-size:38px;padding:0 36px">It isn’t thinking about you all day</span></div>`);
    POP(no, at("isn't thinking"));
    const s = big(`The part most videos ${H('skip')}`, 760, at('the part most'), stage, 64);
    hl(s, at('skip'));
  },
});

// ---------- line 35: can't I just set up a scheduled task? ----------
scene('c35', {
  text: `And you might be thinking, can't I just set up a scheduled task? And the answer is yes, and it's closer than you think. ChatGPT's scheduled tasks can now run every hour, and some start when a new email arrives. So the real difference isn't a magic brain that watches you all day. It's two things. The agent remembers what it already told you, and it decides on its own whether something is worth your time.`,
  build(at) {
    const A = add('<div class="abs" style="inset:0"></div>');
    const q = add('<div class="bub me" style="left:420px;top:250px;width:1080px;font-size:56px;text-align:center"><div class="who">You might be thinking</div>“Can’t I just set up a scheduled task?”</div>', A);
    IN(q, at("can't i"), { y: 30 });
    const y = big(`Yes. And it’s ${H('closer than you think')}.`, 620, at('the answer is yes'), A, 72);
    hl(y, at('closer than'));
    OUT(A, at("chatgpt's scheduled") - 0.2, { y: -40 });
    // ChatGPT's own docs
    const B = add('<div class="abs" style="inset:0"></div>');
    const doc = browser('chatgpt-tasks', { left: 240, top: 120, width: 1440, crop: [60, 520], parent: B });
    chip('ChatGPT docs · Scheduled tasks', 210, 90, 'dark', B);
    IN(B, at("chatgpt's scheduled") - 0.1, { y: 50 });
    doc.zoom(at("chatgpt's scheduled") + 0.4, 1.6, 1);
    doc.sweep(at('some start'), 0.6);
    const tags = add('<div class="abs" style="left:240px;top:760px;display:flex;gap:18px"></div>', B);
    POP(add(`<div class="pill blue" style="height:80px;font-size:38px;gap:16px"><span style="width:40px;display:flex">${icon('cal')}</span>Every hour</div>`, tags), at('every hour'));
    POP(add(`<div class="pill blue" style="height:80px;font-size:38px;gap:16px"><span style="width:40px;display:flex">${icon('mail')}</span>When a new email arrives</div>`, tags), at('new email'));
    OUT(B, at('so the real') - 0.2, { y: -40 });
    // not a magic brain: two things
    const C = add('<div class="abs" style="inset:0"></div>');
    const m = add(`<div class="abs center" style="left:0;right:0;top:120px"><span class="h2" style="font-size:64px;position:relative;display:inline-block">Not a magic brain watching you<span class="strike" style="position:absolute;left:-10px;right:-10px;top:52%;height:8px;border-radius:4px;background:var(--red)"></span></span></div>`, C);
    IN(m, at('so the real'), { y: 30 });
    tl.from(m.querySelector('.strike'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.45 }, at('magic brain') + 0.5);
    IN(add('<div class="abs h2" style="left:240px;top:300px;font-size:60px">It’s two things:</div>', C), at("it's two"), { x: -30, y: 0 });
    const two = (n, txt, top, t) => IN(add(`<div class="card abs" style="left:240px;top:${top}px;width:1440px;height:200px;display:flex;align-items:center;gap:40px;padding:0 50px">
      <div class="numb" style="width:100px;height:100px;font-size:56px;border-radius:28px">${n}</div><div class="h2" style="font-size:58px">${txt}</div></div>`, C), t, { x: -40, y: 0 });
    two(1, 'It remembers what it already told you', 420, at('the agent remembers'));
    two(2, 'It decides if something is worth your time', 660, at('it decides'));
  },
});

// ---------- line 37 ----------
scene('c37', {
  text: `And the last question is, how does it keep working when your laptop is closed?`,
  build(at) {
    const lap = add(`<div class="abs" style="left:650px;top:150px;width:620px;height:420px">
      <div class="lid abs" style="left:60px;top:0;width:500px;height:320px;border-radius:20px;background:linear-gradient(170deg,#1C2745,#0E1528);border:3px solid rgba(17,24,39,.2);transform-origin:50% 100%"><div class="abs" style="inset:18px;border-radius:10px;background:#0A1022"></div></div>
      <div class="abs" style="left:0;top:320px;width:620px;height:30px;border-radius:6px 6px 18px 18px;background:#2A3554"></div></div>`);
    IN(lap, 0.1, { y: 30 });
    tl.to(lap.querySelector('.lid'), { scaleY: 0.05, duration: 0.9, ease: 'power2.in' }, at('laptop is closed') - 0.3);
    POP(add('<div class="abs pill dark" style="left:860px;top:640px;height:56px;font-size:28px">The last question</div>'), at('the last'));
    big('How does it keep working when your laptop is closed?', 730, at('how does'), stage, 66);
  },
});

// ---------- line 39 ----------
scene('c39', {
  text: `So if personal agents do all of this for you, why would anyone still build a DIY setup? There are three reasons.`,
  build(at) {
    const lead = add(`<div class="abs center" style="left:0;right:0;top:150px;display:flex;justify-content:center;gap:24px;align-items:center">
      <div class="badge">${icon('bell')}</div><div class="h2" style="font-size:56px;color:var(--muted)">Personal agents do all of this for you…</div></div>`);
    IN(lead, 0.15, { y: 20 });
    big('Why would anyone still build a DIY setup?', 300, at('why would'), stage, 84);
    const row = add('<div class="abs" style="left:0;right:0;top:600px;display:flex;justify-content:center;gap:50px"></div>');
    [1, 2, 3].forEach((n, i) => POP(add(`<div class="numb" style="width:170px;height:170px;font-size:96px;border-radius:44px">${n}</div>`, row), at('three reasons') + i * 0.2));
    FADE(add('<div class="abs center h3" style="left:0;right:0;top:820px;font-size:48px">Three reasons</div>'), at('three reasons') + 0.5);
  },
});

// ---------- line 43: privacy ----------
scene('c43', {
  text: `Now, privacy. My honest view is this: whatever you give an agent, assume the company behind it can see it. So I don't give any agent my passwords or bank details, or things about other people they never agreed to share.`,
  build(at) {
    IN(add(`<div class="abs" style="left:160px;top:110px;display:flex;align-items:center;gap:26px"><div class="badge" style="width:110px;height:110px;border-radius:30px">${icon('lock')}</div><div class="h1" style="font-size:90px">Privacy</div></div>`), at('privacy'), { x: -30, y: 0 });
    const v = add(`<div class="card abs" style="left:160px;top:300px;width:1600px;padding:40px 50px">
      <div class="body muted" style="font-size:30px">My honest view</div>
      <div class="h2" style="font-size:60px;margin-top:10px">Whatever you give an agent, ${H('assume the company can see it')}</div></div>`);
    IN(v, at('my honest'), { y: 30 });
    hl(v, at('assume the company'));
    IN(add('<div class="abs h3" style="left:160px;top:600px;font-size:44px">What I never give any agent:</div>'), at("i don't give"), { x: -30, y: 0 });
    [['Passwords', 'passwords'], ['Bank details', 'bank details'], ['Other people’s private things', 'other people']].forEach(([t, c], i) =>
      IN(add(`<div class="card abs" style="left:${160 + i * 545}px;top:700px;width:510px;height:150px;display:flex;align-items:center;gap:22px;padding:0 30px">
        <span style="flex:none;width:64px;height:64px;border-radius:50%;background:#FFF1F3;color:var(--red);display:flex;align-items:center;justify-content:center">${svgi('x', 36)}</span><span class="h3" style="font-size:40px">${t}</span></div>`), at(c), { y: 30 }));
  },
});

// ---------- line 45: the risk ----------
scene('c45', {
  text: `But here's the risk most videos skip. An agent that reads your email can also read an email that someone wrote to trick it.`,
  build(at) {
    POP(add('<div class="abs center" style="left:0;right:0;top:110px"><span class="pill red" style="height:84px;font-size:40px;padding:0 36px"><span class="dot"></span>The risk most videos skip</span></div>'), at('the risk'));
    const inbox = add(`<div class="card abs" style="left:360px;top:280px;width:1200px;padding:20px 0"></div>`);
    IN(inbox, at('an agent that'), { y: 40 });
    const mail = (from, sub, bad) => add(`<div style="display:flex;align-items:center;gap:24px;padding:24px 40px;border-top:1.5px solid var(--line)${bad ? ';background:#FFF7F8' : ''}">
      <span style="width:48px;color:${bad ? 'var(--red)' : 'var(--muted)'};display:flex">${icon('mail')}</span>
      <div style="flex:1"><div style="font-size:26px;font-weight:700;color:var(--muted)">${from}</div><div class="h3" style="font-size:38px">${sub}</div></div>
      ${bad ? '<span class="pill red flag" style="height:60px;font-size:28px">Written to trick your agent</span>' : ''}</div>`, inbox);
    mail('Recruiter, the bank', 'Interview confirmed for Thursday');
    mail('Job alerts', '3 new data engineering roles');
    const bad = mail('Unknown sender', 'Quick question about your application', true);
    POP(bad.querySelector('.flag'), at('to trick'));
    tl.to(bad, { boxShadow: 'inset 0 0 0 4px #E11D48', duration: 0.3 }, at('someone wrote'));
  },
});

// ---------- line 50: dots already hands work over ----------
scene('c50', {
  text: `And I think this gap will close. OpenAI's dots can already hand work to its Work and Codex agents. So over time, I expect you'll get both in one place.`,
  build(at) {
    big('This gap will close', 200, at('this gap'), stage, 84);
    OUT(stage.lastChild, at("openai's dots") - 0.2, { y: -40 });
    const B = add('<div class="abs" style="inset:0"></div>');
    const doc = browser('openai-dots-codex', { left: 240, top: 120, width: 1440, crop: [280, 360], parent: B });
    chip('OpenAI · Introducing dots', 210, 90, 'dark', B);
    IN(B, at("openai's dots"), { y: 50 });
    doc.zoom(at('can already') - 0.2, 1.7, 1);
    doc.sweep(at('hand work'), 0.5);
    const flow = add(`<div class="abs" style="left:0;right:0;top:620px;display:flex;justify-content:center;align-items:center;gap:30px">
      <span class="pill dark" style="height:84px;font-size:40px">dots</span><span class="arrow">→</span>
      <span class="pill blue w1" style="height:84px;font-size:40px">ChatGPT Work</span><span class="pill blue w2" style="height:84px;font-size:40px">Codex</span></div>`, B);
    IN(flow, at('hand work'), { y: 30 });
    OUT(B, at('so over time') - 0.2, { y: -40 });
    const both = add(`<div class="abs" style="left:0;right:0;top:300px;display:flex;justify-content:center;align-items:center;gap:40px">
      <div class="card" style="padding:40px 50px;display:flex;gap:22px;align-items:center"><div class="badge">${icon('folder')}</div><div class="h2" style="font-size:52px">DIY agent</div></div>
      <div class="h1" style="color:var(--blue)">+</div>
      <div class="card" style="padding:40px 50px;display:flex;gap:22px;align-items:center"><div class="badge">${icon('bell')}</div><div class="h2" style="font-size:52px">Personal agent</div></div></div>`);
    IN(both, at('so over time'), { y: 30 });
    big('Both in one place, over time', 620, at('both in one'), stage, 72);
  },
});

// ---------- line 51: the advice ----------
scene('c51', {
  text: `But if you want to work in AI engineering, here's my honest advice. Build the DIY version, even if you end up using a personal agent.`,
  build(at) {
    POP(add('<div class="abs center" style="left:0;right:0;top:170px"><span class="pill blue" style="height:76px;font-size:36px"><span class="dot"></span>If you want to work in AI engineering</span></div>'), at('if you want'));
    FADE(add('<div class="abs center body muted" style="left:0;right:0;top:330px;font-size:40px">My honest advice</div>'), at('my honest'));
    const b = big(`${H('Build the DIY version')}`, 420, at('build the diy'), stage, 110);
    hl(b, at('build the diy') + 0.3);
    FADE(add('<div class="abs center h3" style="left:0;right:0;top:640px;font-size:48px;color:var(--muted)">even if you end up using a personal agent</div>'), at('even if'), { y: 20 });
  },
});

// ---------- line 55 ----------
scene('c55', {
  text: `Most people will watch this and never make the folder. But if you make it once, you'll understand agents better than most of the people talking about them.`,
  build(at) {
    const f = add(`<div class="abs" style="left:780px;top:120px;width:360px;color:#60A5FA">${FOLDER_SVG.replace('<svg', '<svg width="360" height="360"')}</div>`);
    POP(f, at('make the folder') - 0.2);
    FADE(add('<div class="abs center mono" style="left:0;right:0;top:420px;font-size:48px;color:var(--blue)">career/</div>'), at('make the folder'));
    const a = add('<div class="abs center h2" style="left:0;right:0;top:530px;font-size:62px;color:var(--muted)">Most people never make the folder</div>');
    IN(a, at('most people'), { y: 20 });
    OUT(a, at('but if you') - 0.1);
    const b = big(`Make it once, and you’ll ${H('understand agents')} better than most`, 530, at('but if you'), stage, 70);
    hl(b, at('understand agents'));
  },
});

// ---------- lines 56–58: the call to action ----------
scene('c56', {
  text: `If you want help planning your move into data or AI engineering, the first link in the description books a free fifteen-minute call with me.`,
  build(at) {
    big('Planning your move into data or AI engineering?', 140, at('if you want'), stage, 72);
    callCard(at('the first link'), stage, 420);
    POP(add('<div class="abs center" style="left:0;right:0;top:760px"><span class="pill blue" style="height:76px;font-size:36px">↓ First link in the description</span></div>'), at('description'));
  },
});
scene('c57', {
  text: `And if you want to learn to build agents like this step by step, the Stackle AI Engineering Masterclass is linked there too.`,
  build(at) {
    big('Learn to build agents like this, step by step', 150, at('if you want'), stage, 72);
    const c = add(`<div class="card abs" style="left:410px;top:420px;width:1100px;padding:50px 60px;display:flex;gap:44px;align-items:center;border:3px solid var(--blue)">
      <div class="badge" style="width:150px;height:150px;border-radius:40px">${icon('agent')}</div>
      <div><div class="mono" style="font-size:28px;letter-spacing:.2em;color:var(--blue)">STACKLE</div><div class="h2" style="font-size:64px;margin-top:6px">AI Engineering Masterclass</div><div class="body muted" style="font-size:34px;margin-top:6px">Linked in the description</div></div></div>`);
    IN(c, at('the stackle'), { y: 40 });
  },
});
scene('c58', {
  text: `And tell me in the comments: would you let an AI message you first? Yes or no, and why?`,
  build(at) {
    const box = add(`<div class="card abs" style="left:360px;top:220px;width:1200px;padding:44px 50px">
      <div style="display:flex;gap:20px;align-items:center"><span style="width:64px;height:64px;border-radius:50%;background:#E5E7EB;display:flex"></span><div class="h3" style="font-size:34px;color:var(--muted)">Add a comment…</div></div>
      <div class="h2 q" style="font-size:62px;margin-top:34px;min-height:150px"></div>
      <div style="display:flex;gap:20px;margin-top:20px"><span class="pill blue yes" style="height:84px;font-size:42px;padding:0 44px">Yes</span><span class="pill no" style="height:84px;font-size:42px;padding:0 44px">No</span><span class="pill why" style="height:84px;font-size:42px;padding:0 44px">…and why?</span></div></div>`);
    IN(box, at('tell me'), { y: 40 });
    TYPE(box.querySelector('.q'), at('would you'), 'Would you let an AI message you first?', 30);
    POP(box.querySelector('.yes'), at('yes')); POP(box.querySelector('.no'), at('no')); POP(box.querySelector('.why'), at('why'));
    FADE(add('<div class="abs center mono" style="left:0;right:0;top:800px;font-size:30px;letter-spacing:.24em;color:var(--blue)">STACKLE · YOUR CAREER LAB</div>'), at('yes') + 0.4);
  },
});
