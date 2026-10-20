// The comment ask that closes every episode: "So, what should I explain
// next? Tell me in the comments below, and it could be the next episode."
// The question rises word by word, and a comment box types out a few ideas
// until "comments" presses its button. Episodes get it from the timeline
// (VO.cta, set by "cta": true in episode.json), right after the closing title;
// the series intro calls ctaScene() itself on its own words.
// Load after common.js; it adds its own scene to the page (styles in cta.css).
const CTA_IDEAS = ['dbt', 'Apache Iceberg', 'Apache Flink', 'DuckDB'];

function ctaScene(i0, { tEnd = END } = {}) {
  // the line's words, in order: So, what should I explain next? Tell me in the comments below, …
  const W = k => WORDS[i0 + k].s + OFF;
  const iOf = (word, from = 0) => { for (let k = from; i0 + k < WORDS.length; k++) if (norm(WORDS[i0 + k].w) === word) return k; throw Error('no cta cue: ' + word); };
  const kWhat = iOf('what'), kNext = iOf('next'), kTell = iOf('tell'), kComments = iOf('comments');

  const sec = document.createElement('section');
  sec.className = 'scene'; sec.id = 'cta';
  sec.innerHTML = `
    <div class="kicker" id="cta-tag">Your turn</div>
    <div class="cta-q" id="cta-q">${WORDS.slice(i0 + kWhat, i0 + kNext + 1).map((w, k) => `<span class="wm"><span class="wi">${k ? w.w : w.w[0].toUpperCase() + w.w.slice(1)}</span></span>`).join(' ')}</div>
    <div class="cbox" id="cbox">
      <div class="c-row"><span class="c-av"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/></svg></span>
        <div class="c-in"><span class="c-ph" id="c-ph">Add a comment…</span><span id="c-text"></span><i class="caret" id="caret"></i></div></div>
      <div class="c-act"><span class="c-hint">Which tool should be next?</span><span class="c-btn" id="c-btn">Comment</span></div>
    </div>
    <div class="cta-credit">Explained in 2 minutes · Stackle</div>`;
  $('#stage').appendChild(sec);

  const t0 = W(0);
  show('#cta', t0 - .35, null);
  if ($('#s5')) tl.to('#s5', { autoAlpha: 0, duration: .45, ease: 'power2.in' }, t0 - .5);
  rise('#cta-tag', t0 - .25, { y: 12 });
  $$('#cta-q .wi').forEach((w, k) => tl.fromTo(w, { yPercent: 115 }, { yPercent: 0, duration: .6, ease: 'expo.out' }, W(kWhat + k) - .06));
  tl.fromTo('#cbox', { autoAlpha: 0, y: 30, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8 }, W(kTell) - .3);
  rise('.cta-credit', W(kTell) + .2, { y: 8 });
  const tPress = W(kComments) + .1;
  tl.to('#c-btn', { backgroundColor: '#017CEE', color: '#fff', duration: .25 }, tPress);
  tl.to('#c-btn', { scale: .92, duration: .1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, tPress + .25);
  tl.to('#cbox', { borderColor: '#84CAFF', boxShadow: '0 1px 2px rgba(16,24,40,.04),0 18px 44px -12px rgba(1,124,238,.35)', duration: .4 }, tPress);
  tl.to('#cta', { autoAlpha: 0, duration: .5, ease: 'power2.in' }, tEnd - .6);

  // typing: each idea is typed, held, and deleted for the next
  const tType = W(kTell) + .3, text = $('#c-text'), ph = $('#c-ph'), caret = $('#caret');
  const steps = [];
  let t = tType;
  CTA_IDEAS.forEach(s => { steps.push([t, s]); t += s.length / 14 + .9 + s.length / 40 + .15; });
  let last = null;
  return tNow => {
    if (tNow < t0 - .5 || tNow > tEnd) return;
    let s = '';
    for (const [ts, idea] of steps) {
      const type = idea.length / 14, hold = .9, del = idea.length / 40;
      const u = tNow - ts;
      if (u < 0) break;
      if (u < type) s = idea.slice(0, Math.ceil(u * 14));
      else if (u < type + hold) s = idea;
      else if (u < type + hold + del) s = idea.slice(0, Math.max(0, idea.length - Math.ceil((u - type - hold) * 40)));
      else s = '';
    }
    if (s !== last) { text.textContent = s; ph.style.display = s || tNow >= tType ? 'none' : ''; last = s; }
    caret.style.opacity = tNow >= tType && Math.floor(tNow * 2.4) % 2 === 0 ? 1 : 0;
  };
}

// episodes: the ask follows the closing title on its own (draw it from render(t) with drawCta(t))
const drawCta = VO.cta ? ctaScene(VO.cta.i0) : () => {};
