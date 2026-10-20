// The scenes the first cut was missing, in the light look (video.html), plus
// the blank camera slots. Same engine as the others: `text` is the line Chris
// says, cues are words from it, and real pages and footage come from
// sources/ and clips/.

const FOLDER_SVG = '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#60A5FA" stroke="#3B82F6" stroke-width="1.2"/></svg>';
const DOC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z" fill="#F9FAFB"/><path d="M14 3v4h4"/></svg>';
const PDF_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z" fill="#FFF1F3"/><path d="M14 3v4h4M9 14h6"/></svg>';
const svgi = (name, size = 28, color = 'currentColor') => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

// a row grows in, so the rows under it move down
const GROW = (el, t) => tl.from(el, { height: 0, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, t);
function FLASH(row, t) {
  const f = add('<div class="flash"></div>', row);
  tl.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t);
}
function MARK(row, t) {
  const m = add('<div class="mk"></div>', row);
  gsap.set(m, { scaleX: 0 });
  tl.to(m, { scaleX: 1, duration: 0.45, ease: 'power1.inOut' }, t);
}
const credit = (text, l, t, parent = stage) => add(`<div class="credit" style="left:${l}px;top:${t}px">${text}</div>`, parent);

function finder({ left, top, width, height, title, parent = stage }) {
  const el = add(`<div class="finder" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px">
    <div class="fbar"><i></i><i></i><i></i><span>${title}</span></div><div class="rows"></div></div>`, parent);
  const rows = el.querySelector('.rows');
  const row = (name, { depth = 0, kind = 'doc', note = '', warn = false } = {}) => add(`<div class="frow" style="padding-left:${26 + depth * 42}px">
      <span class="fi">${kind === 'folder' ? FOLDER_SVG : kind === 'pdf' ? PDF_SVG : DOC_SVG}</span><span class="fn${kind === 'folder' ? '' : ' mono'}">${name}</span>${note ? `<span class="fnote${warn ? ' warn' : ''}">${note}</span>` : ''}</div>`, rows);
  return { el, row };
}
function editor({ left, top, width, height, file, size = 28, term = false, parent = stage }) {
  const el = add(`<div class="win${term ? ' term' : ''}" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px">
    <div class="bar"><i></i><i></i><i></i><span>${file}</span></div><div class="code" style="font-size:${size}px"></div></div>`, parent);
  const code = el.querySelector('.code');
  let n = 0;
  // returns the line's text span; its parent is the whole line
  const line = (html, cls = '') => add(`<div class="ln">${term ? '' : `<span class="no">${++n}</span>`}<span class="tx ${cls}">${html}</span></div>`, code).querySelector('.tx');
  return { el, code, line };
}
function numHead(n, title, t, { left = 120, top = 70, parent = stage } = {}) {
  const el = add(`<div class="abs" style="left:${left}px;top:${top}px;display:flex;align-items:center;gap:24px"><div class="numb">${n}</div><div class="h2" style="font-size:58px">${title}</div></div>`, parent);
  IN(el, t, { x: -30, y: 0 });
  return el;
}
function rulesFile(ed) {
  return [ed.line('<span class="h"># How I work</span>'), ed.line('- Use simple English.'), ed.line('- Save every job post in applications/.'), ed.line('- Ask me before you send anything.')];
}

// ---------- r09: the chatbot run (paragraph 9) ----------
scene('r09', {
  text: `So you paste in the job post and your resume, and you ask, "What will they ask me?" And in a few seconds, you get a really good list of questions for that one job.`,
  build(at) {
    const W = add(`<div class="chatwin" style="left:300px;top:70px;width:1320px;height:940px">
      <div class="cbar"><i></i><i></i><i></i><span>Chatbot · New chat</span></div>
      <div class="msgs"></div>
      <div class="cin"><span class="atts" style="display:flex;gap:12px"></span><span class="ph">Ask anything</span><span class="tx"></span><div class="send">↑</div></div></div>`);
    IN(W, 0.05, { y: 40 });
    const cin = W.querySelector('.cin'), atts = cin.querySelector('.atts');
    const att = (name, color) => `<span class="att"><span class="ab" style="background:${color}">${svgi('doc', 22, '#fff')}</span>${name}</span>`;
    const a1 = add(att('job-post.txt', '#2563EB'), atts), a2 = add(att('resume.pdf', '#E11D48'), atts);
    POP(a1, at('job post')); POP(a2, at('resume'));
    tl.to(cin.querySelector('.ph'), { autoAlpha: 0, width: 0, duration: 0.1 }, at('job post'));
    const q = 'What will they ask me?';
    TYPE(cin.querySelector('.tx'), at('you ask'), q, 28);
    const send = at('and in a few') - 0.1;
    OUT([atts, cin.querySelector('.tx')], send, { duration: 0.12 });
    const msgs = W.querySelector('.msgs');
    IN(add(`<div class="you"><div style="display:flex;gap:12px;margin-bottom:14px">${att('job-post.txt', '#2563EB')}${att('resume.pdf', '#E11D48')}</div>${q}</div>`, msgs), send, { y: 30, duration: 0.4 });
    const bot = add('<div class="bot"><div class="lead"></div><ol class="qs" style="margin-top:8px"></ol></div>', msgs);
    const lead = 'Here are the questions they will likely ask for this data engineering role:';
    TYPE(bot.querySelector('.lead'), send + 0.5, lead, 80);
    ['Walk me through a data pipeline you built, end to end.', 'Write a SQL query to find duplicate transactions.', 'How would you handle late-arriving data in a daily job?',
      'Batch or streaming for fraud alerts, and why?', 'How do you check data quality before it reaches reports?']
      .forEach((s, i) => FADE(add(`<li>${s}</li>`, bot.querySelector('.qs')), send + 1.5 + i * 0.32, { y: 8 }));
    POP(add('<div class="pill blue" style="align-self:flex-start"><span class="dot"></span>For this one job</div>', msgs), at('that one job'));
  },
});

// ---------- r12: the career folder (paragraph 12) ----------
scene('r12', {
  text: `So let's say you've made a folder called career, with your resume, every job you applied to, and notes from every interview. Now you ask the same question. First, it saves the job post in your applications folder. Second, it reads your old notes, sees you ran out of time on the SQL question in two of your last three interviews, and puts SQL practice at the top. And third, it updates a file called memory.md, so next time it starts from everything it knows today.`,
  build(at) {
    FADE(chip("<span class=\"dot\"></span>Let's say", 110, 40, 'blue'), 0.1);
    const F = finder({ left: 110, top: 120, width: 700, height: 860, title: 'career' });
    IN(F.el, at('folder called'), { y: 40 });
    const r = {};
    r.career = F.row('career', { kind: 'folder' });
    r.resume = F.row('resume.pdf', { depth: 1, kind: 'pdf' });
    r.apps = F.row('applications', { depth: 1, kind: 'folder' });
    r.a1 = F.row('fintech-analytics.md', { depth: 2 });
    r.a2 = F.row('retail-data-eng.md', { depth: 2 });
    r.a3 = F.row('bank-data-engineer.md', { depth: 2, note: 'new' });
    r.notes = F.row('interview-notes', { depth: 1, kind: 'folder' });
    r.n1 = F.row('aug-14-fintech.md', { depth: 2 });
    r.n2 = F.row('sep-02-retail.md', { depth: 2, note: 'SQL: out of time', warn: true });
    r.n3 = F.row('sep-30-insurer.md', { depth: 2, note: 'SQL: out of time', warn: true });
    r.mem = F.row('memory.md', { depth: 1 });
    gsap.set([r.n2, r.n3].map(x => x.querySelector('.fnote')), { autoAlpha: 0 });
    GROW(r.resume, at('resume')); GROW(r.apps, at('every job')); GROW(r.a1, at('every job') + 0.2); GROW(r.a2, at('every job') + 0.35);
    GROW(r.notes, at('notes from')); [r.n1, r.n2, r.n3].forEach((x, i) => GROW(x, at('notes from') + 0.2 + i * 0.15));
    GROW(r.mem, at('notes from') + 0.8);

    const T = editor({ left: 860, top: 120, width: 950, height: 860, file: 'DIY agent · ~/career', size: 26, term: true });
    IN(T.el, at('now you ask') - 0.2, { x: 40, y: 0 });
    const ask = T.line('', 'p');
    TYPE(ask, at('the same question') - 0.1, '> What will they ask me?', 40);
    const step = (html, t, cls = '') => { const l = T.line(html, cls); FADE(l.parentElement, t, { y: 10 }); return l; };
    step('<span class="ok">●</span> Saved the job post', at('first'));
    step('  applications/bank-data-engineer.md', at('first') + 0.3, 'note');
    GROW(r.a3, at('applications folder') - 0.2); FLASH(r.a3, at('applications folder') + 0.2);
    step('<span class="ok">●</span> Read 3 interview notes', at('second'));
    [r.n1, r.n2, r.n3].forEach((x, i) => FLASH(x, at('reads your old') + i * 0.15));
    step('  SQL: out of time in 2 of the last 3', at('ran out of time'), 'note');
    MARK(r.n2, at('two of your')); MARK(r.n3, at('two of your') + 0.25);
    [r.n2, r.n3].forEach((x, i) => FADE(x.querySelector('.fnote'), at('two of your') + 0.3 + i * 0.25));
    step('<span class="ok">●</span> Made your prep plan', at('puts sql'));
    const plan = add('<div style="position:relative;height:180px;margin:6px 30px 10px 58px"></div>', T.code);
    FADE(plan, at('puts sql') + 0.1);
    const item = (txt, i, hl) => add(`<div class="abs" style="left:0;right:0;top:${i * 58}px;height:50px;display:flex;align-items:center;padding:0 18px;border-radius:10px;${hl ? 'background:rgba(255,228,92,.22);border-left:4px solid #FFE45C;color:#FFF7C2' : 'color:#CBD5E1'}">${txt}</div>`, plan);
    const p1 = item('Python projects', 0), p2 = item('System design', 1), p3 = item('SQL practice, timed', 2, true);
    tl.to(p3, { y: -116, duration: 0.7, ease: 'power3.inOut' }, at('at the top') - 0.1);
    tl.to([p1, p2], { y: 58, duration: 0.7, ease: 'power3.inOut' }, at('at the top') - 0.1);
    step('<span class="ok">●</span> Updated memory.md', at('and third'));
    FLASH(r.mem, at('memorymd')); MARK(r.mem, at('memorymd') + 0.2);
    step('  Next time, it starts from here', at('next time'), 'note');
  },
});

// ---------- r18: the rules file (paragraph 18) ----------
scene('r18', {
  text: `Number one is the rules file. A rules file just means a plain text file with your rules in it, and the agent reads it at the start of every task. In Claude Code, it's called CLAUDE.md, and many other tools read one called AGENTS.md, which more than sixty thousand projects use. The .md part just means plain text.`,
  build(at) {
    const A = add('<div class="abs" style="inset:0"></div>');
    numHead(1, 'The rules file', 0.1, { parent: A });
    const ed = editor({ left: 980, top: 230, width: 820, height: 380, file: 'CLAUDE.md', parent: A });
    IN(ed.el, 0.3, { x: 40, y: 0 });
    rulesFile(ed).forEach((l, i) => FADE(l.parentElement, at('plain text file') + i * 0.18, { y: 8 }));
    const pt = (t, txt, ic, top) => IN(add(`<div class="abs h3" style="left:120px;top:${top}px;width:780px;display:flex;gap:24px;align-items:center"><span class="numb" style="width:64px;height:64px;border-radius:18px;background:#EFF5FF;color:var(--blue);box-shadow:none">${svgi(ic, 34)}</span>${txt}</div>`, A), t, { x: -30, y: 0 });
    pt(at('plain text file'), 'A plain text file with your rules', 'doc', 300);
    pt(at('the start of'), 'Read at the start of every task', 'check', 420);
    OUT(A, at('in claude code') - 0.25, { y: -30 });

    const B = add('<div class="abs" style="inset:0"></div>');
    const doc = browser('claude-memory', { left: 200, top: 110, width: 1520, crop: [150, 700], parent: B });
    chip('Claude Code docs', 170, 80, 'dark', B);
    IN(B, at('in claude code') - 0.1, { y: 60 });
    doc.zoom(at('claudemd') - 0.2, 1.75, 1);
    doc.sweep(at('claudemd') + 0.7, 0.45);
    const C = add('<div class="abs" style="inset:0"></div>');
    const am = browser('agents-md', { left: 520, top: 300, width: 1240, crop: [0, 560], parent: C });
    chip('agents.md', 490, 270, 'dark', C);
    tl.from(C, { x: 1500, duration: 0.7, ease: 'power3.out' }, at('many other tools'));
    am.zoom(at('agentsmd') + 0.1, 1.9, 0.9);
    am.sweep(at('sixty thousand'), 0.5);
    POP(chip('60k+ projects', 1460, 240, 'blue', C), at('sixty thousand') + 0.2, { scale: 1.3 });
    OUT([B, C], at('the md part') - 0.25, { y: -30 });

    const D = add(`<div class="abs" style="left:0;right:0;top:330px;display:flex;justify-content:center;align-items:center;gap:60px">
      <div class="card" style="width:260px;height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
        <div style="width:120px">${DOC_SVG}</div><div class="mono" style="font-size:52px;font-weight:600;color:var(--blue)">.md</div></div>
      <div class="h1" style="color:var(--muted)">=</div><div class="h1">plain text</div></div>`);
    IN(D, at('the md part'), { y: 40 });
  },
});

// ---------- r19: one rule, said once (paragraph 19) ----------
scene('r19', {
  text: `So let's say you tell it once, "Keep my cover letters under two hundred words, and never start with 'I am writing to apply.'" The agent writes that rule into the file, and every cover letter after that follows it. To be clear, you say it once, and it sticks.`,
  build(at) {
    FADE(chip("<span class=\"dot\"></span>Let's say", 120, 90, 'blue'), 0.1);
    const b = add('<div class="bub me" style="left:120px;top:190px;width:760px"><div class="who">You</div><span class="tx"></span></div>');
    IN(b, at('you tell'), { x: -30, y: 0 });
    const said = 'Keep my cover letters under 200 words, and never start with “I am writing to apply.”';
    TYPE(b.querySelector('.tx'), at('keep my'), said, said.length / Math.max(1.5, at('the agent') - at('keep my') - 0.3));
    const ed = editor({ left: 960, top: 150, width: 840, height: 470, file: 'CLAUDE.md', size: 27 });
    IN(ed.el, 0.2, { x: 40, y: 0 });
    rulesFile(ed);
    const nl = ed.line('', '');
    const hl = add('<div class="add"></div>', nl.parentElement);
    FADE(hl, at('writes that'));
    TYPE(nl, at('writes that') + 0.1, '- Cover letters: under 200 words. Never start with “I am writing to apply.”', 60);
    ['Bank', 'Fintech', 'Insurer'].forEach((co, i) => {
      const c = add(`<div class="card abs" style="left:${960 + i * 286}px;top:680px;width:266px;padding:26px 26px">
        <div style="font-size:22px;font-weight:700;color:var(--muted)">Cover letter</div><div style="font-size:34px;font-weight:800;margin-top:4px">${co}</div>
        <div style="margin-top:18px;display:flex;flex-direction:column;gap:10px;font-size:22px;font-weight:700;color:#15803D">
          <div style="display:flex;gap:10px;align-items:center">${svgi('check', 26)}${[186, 172, 194][i]} words</div>
          <div style="display:flex;gap:10px;align-items:center">${svgi('check', 26)}New opening</div></div></div>`);
      IN(c, at('every cover') + i * 0.25, { y: 40 });
    });
    const s = add('<div class="abs h1" style="left:120px;top:640px;width:760px;font-size:84px">Say it once.<br><span style="color:var(--blue)">It sticks.</span></div>');
    IN(s, at('you say it'), { y: 30 });
  },
});

// ---------- r20: the memory file (paragraph 20) ----------
scene('r20', {
  text: `Number two is the memory file, usually called memory.md. It holds the facts that change, like the jobs you applied to and what went wrong in each interview. Put simply, the rules file says how to work, and the memory file says what's true right now.`,
  build(at) {
    numHead(2, 'The memory file', 0.1);
    const ed = editor({ left: 120, top: 200, width: 980, height: 600, file: 'memory.md', size: 27 });
    IN(ed.el, at('memorymd') - 0.2, { y: 40 });
    const L = [
      ['<span class="h">## Applications</span>', 'jobs you applied'], ['- Bank · Data Engineer: interview 21 Oct', 'jobs you applied'], ['- Fintech · Analytics Engineer: no reply yet', 'jobs you applied'],
      ['', 'what went wrong'], ['<span class="h">## Interviews</span>', 'what went wrong'], ['- Retail, 2 Sep: ran out of time on SQL', 'what went wrong'], ['- Insurer, 30 Sep: ran out of time on SQL', 'what went wrong'],
    ];
    const seen = {};
    L.forEach(([h, c]) => { const k = (seen[c] = (seen[c] || 0) + 1) - 1; FADE(ed.line(h).parentElement, at(c) + k * 0.2, { y: 8 }); });
    const card = (top, file, txt, t) => IN(add(`<div class="card abs" style="left:1180px;top:${top}px;width:620px;height:250px;padding:40px 44px">
      <div class="mono" style="font-size:34px;font-weight:600;color:var(--blue)">${file}</div><div class="h2" style="margin-top:14px;font-size:54px">${txt}</div></div>`), t, { x: 40, y: 0 });
    card(200, 'CLAUDE.md', 'How to work', at('rules file says'));
    card(500, 'memory.md', 'What’s true right now', at('memory file says'));
  },
});

// ---------- r21: folders (paragraph 21) ----------
scene('r21', {
  text: `And number three is folders. Each part of your life gets its own folder, like career, learning and money, with its own rules and memory. And you don't build any of this by hand. You tell the agent what you want, and it writes and sorts the files for you.`,
  build(at) {
    numHead(3, 'Folders', 0.1);
    const F = finder({ left: 120, top: 190, width: 760, height: 800, title: 'My files' });
    IN(F.el, 0.3, { y: 40 });
    const kids = [];
    let course, learnMem;
    ['career', 'learning', 'money'].forEach(name => {
      const f = F.row(name, { kind: 'folder' });
      GROW(f, at(name));
      const a = F.row('CLAUDE.md', { depth: 1 }), b = F.row('memory.md', { depth: 1 });
      kids.push(a, b);
      if (name === 'learning') { course = F.row('aws-course.md', { depth: 1, note: 'new' }); learnMem = b; }
    });
    kids.forEach((k, i) => GROW(k, at('its own rules') + i * 0.12));
    GROW(course, at('writes and sorts') + 0.2); FLASH(course, at('writes and sorts') + 0.6);
    const upd = add('<span class="fnote">updated</span>', learnMem);
    POP(upd, at('writes and sorts') + 0.9); FLASH(learnMem, at('writes and sorts') + 0.9);
    const hand = add(`<div class="abs h3" style="left:980px;top:230px;display:flex;align-items:center;gap:20px"><span style="width:56px;height:56px;border-radius:50%;background:#FFF1F3;color:var(--red);display:flex;align-items:center;justify-content:center">${svgi('x', 32)}</span>You don't build this by hand</div>`);
    IN(hand, at("you don't build"), { x: 30, y: 0 });
    const b = add('<div class="bub me" style="left:980px;top:380px;width:800px"><div class="who">You</div>I signed up for an AWS course. Track it, and the deadlines.</div>');
    IN(b, at('you tell'), { x: 30, y: 0 });
    const T = editor({ left: 980, top: 640, width: 800, height: 200, file: 'DIY agent', size: 25, term: true });
    IN(T.el, at('writes and sorts') - 0.1, { y: 30 });
    FADE(T.line('<span class="ok">●</span> Created learning/aws-course.md').parentElement, at('writes and sorts') + 0.3);
    FADE(T.line('<span class="ok">●</span> Updated learning/memory.md').parentElement, at('writes and sorts') + 0.8);
  },
});

// ---------- r29: Muse turns a goal into a plan (paragraph 29) ----------
scene('r29', {
  text: `So let's say you open Muse and tell it your goal, "Get a data engineering job in six months." It asks how many hours a week you have and what you already know, then turns the goal into a plan with steps for each week. A DIY agent can do this too, but you'd have to know to ask. Muse just does it.`,
  build(at) {
    const ph = phoneClip('muse-japan', 0.2, { left: 140, top: 100, width: 380 });
    IN(ph.el, 0.05, { y: 50 });
    FADE(credit('Meta’s launch demo: Muse<br>turns a trip into a plan', 140, 100 + ph.H + 14), 0.4);
    FADE(chip("<span class=\"dot\"></span>Let's say", 620, 100, 'blue'), 0.3);
    const b1 = add('<div class="bub me" style="left:1000px;top:190px;width:800px"><div class="who">You</div>Get a data engineering job in six months.</div>');
    IN(b1, at('tell it your goal'), { y: 30 });
    const b2 = add('<div class="bub ai" style="left:620px;top:380px;width:900px"><div class="who" style="color:var(--blue)">Personal agent</div>How many hours a week do you have? And what do you already know?</div>');
    IN(b2, at('it asks'), { y: 30 });
    OUT([b1, b2], at('turns the goal') - 0.1, { y: -40 });
    const plan = add(`<div class="card abs" style="left:620px;top:190px;width:1180px;padding:40px 48px">
      <div style="display:flex;align-items:center;gap:18px"><div class="h3">Your 6-month plan</div><div class="pill blue" style="margin-left:auto">8 hours a week</div></div><div class="wk" style="margin-top:22px"></div></div>`);
    IN(plan, at('turns the goal'), { y: 40 });
    [['Weeks 1–4', 'SQL and Python, the parts jobs ask for'], ['Weeks 5–8', 'dbt and a data warehouse'], ['Weeks 9–14', 'Build one real pipeline project'], ['Weeks 15–26', 'Apply to 5 jobs a week, practise interviews']].forEach(([w, d], i) => {
      const r = add(`<div style="display:flex;align-items:center;gap:26px;padding:16px 0;border-top:1.5px solid var(--line)"><div class="mono" style="width:200px;font-size:26px;color:var(--blue)">${w}</div><div style="font-size:32px;font-weight:700">${d}</div></div>`, plan.querySelector('.wk'));
      IN(r, at('steps for each') + i * 0.3, { x: 30, y: 0 });
    });
    const c1 = add(`<div class="abs" style="left:620px;top:780px;display:flex;gap:20px">
      <div class="pill" style="height:72px;font-size:30px">DIY agent: only if you know to ask</div></div>`);
    IN(c1, at('a diy agent'), { y: 20 });
    POP(add('<div class="pill dark abs" style="left:620px;top:880px;height:72px;font-size:30px">Personal agent: does it on its own</div>'), at('muse just'));
  },
});

// ---------- r30: what Muse saves about you (paragraph 30) ----------
scene('r30', {
  text: `And here's the part I find really interesting. If you look at what Muse saves about you, it's plain text files, the same kind we just talked about, with names like memory.md. So personal agents aren't magic. They're the same system, already set up for you.`,
  build(at) {
    const A = add('<div class="abs" style="inset:0"></div>');
    const pg = browser('meta-muse-memory', { left: 240, top: 120, width: 1440, crop: [250, 560], parent: A });
    chip('Meta · Sep 8, 2026', 210, 90, 'dark', A);
    IN(A, 0.1, { y: 50 });
    pg.zoom(at('what muse saves') - 0.2, 2.1, 1);
    pg.sweep(at('what muse saves') + 0.7, 0.6);
    OUT(A, at("it's plain text") - 0.2, { y: -40 });
    const M = add(`<div class="card abs" style="left:150px;top:160px;width:720px;height:560px;padding:44px 48px">
      <div class="pill dark">Muse</div><div class="h3" style="margin-top:26px">Keeps what it learns in plain text files</div>
      <div class="files" style="display:flex;gap:26px;margin-top:40px"></div>
      <div class="body muted" style="margin-top:40px;font-size:24px">Markdown files, as reported by WIRED, Oct 2026</div></div>`);
    IN(M, at("it's plain text"), { y: 40 });
    for (let i = 0; i < 3; i++) POP(add(`<div style="width:140px;height:170px;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:110px">${DOC_SVG}</div><div class="mono" style="font-size:28px;color:var(--blue)">.md</div></div>`, M.querySelector('.files')), at("it's plain text") + 0.3 + i * 0.12);
    const eq = add('<div class="abs h1" style="left:915px;top:380px;color:var(--muted)">=</div>');
    POP(eq, at('the same kind'));
    const D = add(`<div class="card abs" style="left:1050px;top:160px;width:720px;height:560px;padding:44px 48px">
      <div class="pill blue">Your DIY folder</div><div class="h3" style="margin-top:26px">The same kind of files</div><div class="fr" style="margin-top:30px"></div></div>`);
    IN(D, at('the same kind'), { y: 40 });
    const fr = (n, kind = 'doc') => add(`<div class="frow" style="padding-left:6px"><span class="fi">${kind === 'folder' ? FOLDER_SVG : DOC_SVG}</span><span class="fn mono">${n}</span></div>`, D.querySelector('.fr'));
    fr('career', 'folder'); fr('CLAUDE.md'); const mem = fr('memory.md');
    MARK(mem, at('names like') + 0.2);
    const h = add(`<div class="abs h2 center" style="left:0;right:0;top:800px">Not magic. The same system, <span class="ash" style="position:relative;display:inline-block"><span class="mk2 abs" style="inset:4px -8px;background:var(--hl);border-radius:6px;z-index:-1"></span>already set up</span> for you.</div>`);
    IN(h, at("aren't magic"), { y: 30 });
    const mk = h.querySelector('.mk2');
    gsap.set(mk, { scaleX: 0, transformOrigin: '0 50%' });
    tl.to(mk, { scaleX: 1, duration: 0.5, ease: 'power1.inOut' }, at('already set up'));
  },
});

// ---------- r32: it acts before you ask (paragraph 32) ----------
scene('r32', {
  text: `A personal agent can tell you when a job that matches you is posted, remind you when a recruiter has waited two days for your reply, or, like we saw earlier, message you the night before an interview.`,
  build(at) {
    const ph = phoneClip('muse-rel', 0.2, { left: 160, top: 100, width: 380 });
    IN(ph.el, 0.05, { y: 50 });
    FADE(credit('Meta’s launch demo: Muse<br>starts the conversation', 160, 100 + ph.H + 14), 0.4);
    FADE(chip('<span class="dot"></span>It acts before you ask', 680, 120, 'blue'), 0.2);
    [['A new job that matches you: Data Engineer, posted an hour ago.', 'a job that'],
     ['A recruiter has waited 2 days for your reply. Want a draft?', 'remind you'],
     ['Your interview is tomorrow at 10. Practice round tonight?', 'message you the']].forEach(([t, c], i) => {
      const n = add(`<div class="notif" style="left:680px;top:${230 + i * 240}px;width:1100px">
        <div class="ap">${svgi('bell', 36, '#fff')}</div><div><div class="nh">Personal agent<span style="margin-left:auto">now</span></div><div class="nt">${t}</div></div></div>`);
      IN(n, at(c), { y: -30, scale: 0.96 });
    });
  },
});

// ---------- r40: they're new (paragraph 40) ----------
scene('r40', {
  text: `Number one is that personal agents are very new. Muse launched six weeks ago, and Google's agent already has a new name. So they change fast, and they can do less than a good DIY setup.`,
  build(at) {
    numHead(1, 'They’re new', 0.1);
    const L = add('<div class="abs" style="inset:0"></div>');
    const m = browser('meta-muse-top', { left: 90, top: 230, width: 850, crop: [200, 560], parent: L });
    chip('Sep 8, 2026 · six weeks ago', 64, 200, 'dark', L);
    IN(L, at('muse launched'), { y: 50 });
    m.zoom(at('muse launched') + 0.3, 1.4, 0.9);
    m.sweep(at('muse launched') + 1, 0.35);
    const R = add('<div class="abs" style="inset:0"></div>');
    const g = browser('gemini-task-rename', { left: 980, top: 230, width: 850, crop: [380, 560], parent: R });
    chip('Oct 12, 2026 · Spark is now “Task”', 954, 200, 'dark', R);
    IN(R, at("google's agent"), { y: 50 });
    g.zoom(at("google's agent") + 0.3, 1.4, 0.9);
    g.sweep(at('a new name'), 0.4);
    IN(add('<div class="pill blue abs" style="left:90px;top:700px;height:76px;font-size:32px"><span class="dot"></span>They change fast</div>'), at('change fast'), { y: 20 });
    IN(add('<div class="pill abs" style="left:90px;top:810px;height:76px;font-size:32px">They can do less than a good DIY setup</div>'), at('do less'), { y: 20 });
  },
});

// ---------- r41: control (paragraph 41) ----------
scene('r41', {
  text: `Number two is control. With a DIY agent, you organise everything the way you think. With a personal agent, everyone gets the same system.`,
  build(at) {
    numHead(2, 'Control', 0.1);
    const F = finder({ left: 120, top: 180, width: 780, height: 820, title: 'DIY agent · your way' });
    IN(F.el, at('with a diy'), { y: 40 });
    [['career', 'folder'], ['learning', 'folder'], ['money', 'folder'], ['side-project', 'folder'], ['interview-stories.md'], ['ideas-for-later.md'], ['how-i-like-to-work.md']]
      .forEach(([n, k], i) => GROW(F.row(n, { kind: k || 'doc' }), at('organise everything') + i * 0.18));
    const R = add(`<div class="card abs" style="left:980px;top:180px;width:820px;height:820px;padding:40px 46px"><div class="pill dark">Personal agent · the same for everyone</div></div>`);
    IN(R, at('with a personal'), { y: 40 });
    ['You', 'Alex', 'Priya', 'Sam', 'Maria', 'Ken'].forEach((n, i) => {
      const p = add(`<div class="mini" style="left:${60 + (i % 3) * 250}px;top:${110 + Math.floor(i / 3) * 345}px"><div class="bar1"></div><div class="bar2"></div><div class="bar2" style="width:60%"></div><div class="blk"></div><div class="bar2"></div><div class="nm">${n}</div></div>`, R);
      POP(p, at('everyone gets') + i * 0.1);
    });
  },
});

// ---------- r44: read the claims carefully (paragraph 44) ----------
scene('r44', {
  text: `And read the claims carefully. Today, Meta says Muse doesn't share your data with its ad systems. The line you may have heard, that not even Meta can see your data, is about a new version coming later this year. To be clear, that's a promise, not how it works today.`,
  build(at) {
    FADE(chip('<span class="dot"></span>Read the claims carefully', 120, 40, 'blue'), 0.1);
    const L = add('<div class="abs" style="inset:0"></div>');
    const a = browser('meta-muse-today', { left: 240, top: 150, width: 1440, crop: [200, 700], parent: L });
    chip('TODAY · how Muse works now', 210, 120, 'dark', L);
    IN(L, 0.15, { y: 50 });
    a.zoom(at('today meta') - 0.1, 2, 1);
    a.sweep(at('ad systems') - 0.5, 0.5);
    tl.to(L, { x: -1900, duration: 0.7, ease: 'power3.in' }, at('not even meta') - 0.8);
    const R = add('<div class="abs" style="inset:0"></div>');
    const b = browser('meta-muse-later', { left: 240, top: 150, width: 1440, crop: [200, 700], parent: R });
    chip('LATER THIS YEAR · a new version', 210, 120, 'dark', R);
    tl.from(R, { x: 1900, duration: 0.7, ease: 'power3.out' }, at('not even meta') - 0.4);
    b.zoom(at('not even meta') + 0.2, 2.4, 1);
    b.sweep(at('not even meta') + 1, 0.5);
    const st = add('<div class="stamp" style="left:1240px;top:720px;transform:rotate(-8deg);font-size:64px">A PROMISE</div>');
    POP(st, at('promise'), { scale: 1.8 });
    FADE(credit('Source: Meta, “Introducing Muse”, 8 Sep 2026', 240, 1020), 0.4);
  },
});

// ---------- r48: run it yourself (paragraph 48) ----------
scene('r48', {
  text: `And if privacy matters most, you can run an open-source agent like OpenClaw or Hermes Agent on your own computer. But it takes real work to set up, and the most powerful models don't run on a normal laptop.`,
  build(at) {
    const gh = browser('openclaw-github', { left: 100, top: 130, width: 1120, crop: [0, 900] });
    IN(gh.el, 0.1, { y: 50 });
    gh.zoom(at('openclaw') + 0.1, 1.9, 1);
    gh.sweep(at('openclaw') + 0.9, 0.5);
    const pill = (html, top, t, cls = 'blue') => IN(add(`<div class="pill ${cls} abs" style="left:1290px;top:${top}px;height:72px;font-size:30px">${html}</div>`), t, { x: 30, y: 0 });
    pill('<span class="dot"></span>If privacy matters most', 140, 0.2, 'dark');
    pill('Open source: OpenClaw', 250, at('openclaw'));
    pill('Hermes Agent', 345, at('hermes agent'));
    pill('Runs on your own computer', 440, at('your own computer'));
    const warn = (txt, top, t) => IN(add(`<div class="card abs" style="left:1290px;top:${top}px;width:540px;padding:30px 34px;display:flex;gap:22px;align-items:flex-start">
      <span style="flex:none;width:52px;height:52px;border-radius:14px;background:#FFFBEB;color:#B45309;display:flex;align-items:center;justify-content:center">${svgi('bolt', 30)}</span><div class="h3" style="font-size:34px">${txt}</div></div>`), t, { y: 30 });
    warn('Takes real work to set up', 570, at('real work'));
    warn('The most powerful models don’t run on a normal laptop', 740, at('most powerful'));
  },
});

// ---------- camera slots: blank, labelled, Chris's footage goes on top ----------
const CAM_NOTES = {
  4: 'Your name and the three facts appear beside you',
  7: 'Overlay: cards/card-01-your-task.png',
  27: 'Optional mid-roll. Overlay: cards/card-05-free-call.png',
  31: 'Overlay: cards/card-06-proactive.png',
};
scene('cam', {
  text: '',
  build() {
    document.body.classList.add('camslot');
    const id = SLOT ? SLOT.paras[0] : '?';
    const text = SLOT ? SLOT.text : '';
    add(`<div class="camcard"><div class="cl"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3z"/></svg>CAMERA · LINE ${id}</div>
      <div class="cq" style="font-size:${text.length > 330 ? 30 : 36}px">“${text}”</div>
      ${CAM_NOTES[id] ? `<div class="cn">${CAM_NOTES[id]}</div>` : ''}</div>`);
  },
});
