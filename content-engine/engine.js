/*
 * Stackle Content Engine: scoring, tiers and channel routing.
 *
 * One file, used in two places:
 *   - the Content Engine page loads it as engine.js (window.Engine)
 *   - node scripts require it (module.exports)
 * The same rules are written out in schedulers/shared-rules.md (for the
 * cloud schedulers) and in README.md. Change them here first, then there.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Engine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Each dimension is scored 0-5. Weights add up to 1.
  const WEIGHTS = { fit: 0.30, edge: 0.20, urgency: 0.20, demand: 0.15, business: 0.15 };

  const DIMENSIONS = [
    { key: 'fit', label: 'Audience fit', help: 'How directly it serves data engineers, data analysts, AI career switchers or solo business owners. 0 = none of them care.' },
    { key: 'edge', label: 'Chris’s edge', help: 'Can Chris teach or demo it better than others, as a data engineer who ran 200+ interviews? 0 = no credible angle.' },
    { key: 'urgency', label: 'Urgency', help: '5 = launched in the last 24 hours and the first-mover window is open. 1 = evergreen. News loses half its urgency every 3 days.' },
    { key: 'demand', label: 'Demand', help: 'Proof people want it: buzz on X and Hacker News, search interest, or a format that already broke out.' },
    { key: 'business', label: 'Business value', help: 'Moves people toward Stackle: email and WhatsApp sign-ups, the free call, the Masterclass or bootcamp.' },
  ];

  // News urgency halves every HALF_LIFE_DAYS days after it was published.
  const HALF_LIFE_DAYS = 3;

  const TIERS = {
    P0: { label: 'Drop everything', short: 'P0', rank: 0 },
    P1: { label: 'Next up', short: 'P1', rank: 1 },
    P2: { label: 'Backlog', short: 'P2', rank: 2 },
    P3: { label: 'Mention only', short: 'P3', rank: 3 },
    SKIP: { label: 'Skip', short: 'Skip', rank: 4 },
  };

  const CHANNELS = ['long', 'short', 'linkedin', 'x', 'email', 'whatsapp'];
  const CHANNEL_LABEL = {
    long: 'Long video', short: 'Short', linkedin: 'LinkedIn', x: 'X', email: 'Email', whatsapp: 'WhatsApp',
  };

  const ICP = {
    de: 'Data engineers',
    da: 'Data analysts',
    switch: 'AI switchers & job seekers',
    solo: 'Solo business owners',
  };

  const PILLARS = {
    career: 'Career & jobs',
    interview: 'Interview prep',
    de: 'Data engineering',
    aidata: 'AI for data work',
    aieng: 'AI engineering',
    solo: 'AI for solo business',
    tools: 'AI launches & tools',
    stackle: 'Stackle & community',
  };

  const STATUSES = {
    new: 'New',
    idea: 'Idea',
    scheduled: 'Scheduled',
    drafting: 'Drafting',
    ready: 'Script ready',
    published: 'Published',
    skipped: 'Skipped',
    archived: 'Archived',
  };

  // Which days each channel publishes (0 = Sunday ... 6 = Saturday), how many
  // slots a day, and which slots are held open for the radar's news.
  const DEFAULT_SETTINGS = {
    cadence: {
      long: [1, 3, 5],
      short: [0, 1, 2, 3, 4, 5, 6],
      linkedin: [1, 2, 3, 4, 5],
      x: [0, 1, 2, 3, 4, 5, 6],
      email: [4],
      whatsapp: [2, 6],
    },
    perDay: { long: 1, short: 2, linkedin: 1, x: 1, email: 1, whatsapp: 1 },
    held: {
      x: [0, 2, 4, 6],
      linkedin: [4],
      whatsapp: [6],
    },
  };

  const DAY = 86400000;

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  function num(v) { const n = Number(v); return isFinite(n) ? clamp(n, 0, 5) : 0; }

  function scoresOf(idea) {
    const s = (idea && idea.scores) || {};
    return { fit: num(s.fit), edge: num(s.edge), urgency: num(s.urgency), demand: num(s.demand), business: num(s.business) };
  }

  function ageDays(idea, now) {
    const src = idea && idea.source;
    const t = src && Date.parse(src.published || src.found || '');
    if (!isFinite(t)) return null;
    return Math.max(0, ((now || Date.now()) - t) / DAY);
  }

  // Evergreen ideas keep their urgency. News decays; deep news (depth 3)
  // never drops below 1, because a good tutorial outlives the headline.
  function effectiveUrgency(idea, now) {
    const s = scoresOf(idea);
    if (idea.kind !== 'news') return s.urgency;
    const age = ageDays(idea, now);
    if (age == null) return s.urgency;
    const floor = (idea.depth || 2) >= 3 ? 1 : 0;
    return Math.max(floor, s.urgency * Math.pow(0.5, age / HALF_LIFE_DAYS));
  }

  function score(idea, now) {
    const s = scoresOf(idea);
    const u = effectiveUrgency(idea, now);
    const raw = WEIGHTS.fit * s.fit + WEIGHTS.edge * s.edge + WEIGHTS.urgency * u +
      WEIGHTS.demand * s.demand + WEIGHTS.business * s.business;
    return Math.round((raw / 5) * 100);
  }

  // The off-niche gate comes first: big news that none of the four
  // audiences cares about can never jump the queue, however hot it is.
  // Only fresh news can be P0; it drops to P1 within about a day as its
  // urgency decays below 4.
  function tier(idea, now) {
    const s = scoresOf(idea);
    if (s.fit <= 1 && s.edge <= 1) return 'SKIP';
    if (s.fit <= 1) return 'P3';
    const sc = score(idea, now);
    const u = effectiveUrgency(idea, now);
    if (idea.kind === 'news' && sc >= 75 && u >= 4 && s.fit >= 4) return 'P0';
    if (sc >= 82) return 'P1';
    if (sc >= 65) return 'P2';
    return 'P3';
  }

  // Returns [{c, due, why}]. `due` is hours after the news was found, or
  // null when there is no deadline (evergreen, or the weekly roundup).
  function route(idea, now) {
    const t = tier(idea, now);
    if (t === 'SKIP') return [];
    const s = scoresOf(idea);
    const depth = idea.depth || 2;
    const act = !!idea.actionable;
    const icp = idea.icp || [];
    const career = idea.pillar === 'career' || idea.pillar === 'interview';
    const out = [];
    const add = (c, due, why) => out.push({ c, due, why });

    if (idea.kind === 'news') {
      if (t === 'P0') {
        add('x', 6, 'First take while it is trending');
        add('linkedin', 24, 'What it means for data people and their careers');
        add('short', 48, 'One-point explainer in under 60 seconds');
        if (depth >= 3) add('long', 168, 'Hands-on demo or deep dive within a week');
        add('email', act ? 24 : null, act ? 'Dedicated email: readers can use it today' : 'Lead story in this week’s email');
        if (act) add('whatsapp', 24, 'Alert: try it today');
      } else if (t === 'P1') {
        add('x', 24, 'Quick take with a data angle');
        add('linkedin', 48, 'Opinion post: what changes for your job');
        if (depth >= 2) add('short', 72, 'Explainer Short');
        if (depth >= 3 && s.fit >= 4) add('long', 336, 'Deep dive, if it still matters in two weeks');
        add('email', null, 'In this week’s email roundup');
        if (act) add('whatsapp', 48, 'Share if readers can use it now');
      } else if (t === 'P2') {
        add(career ? 'linkedin' : 'x', 72, 'Short take');
        add('email', null, 'In this week’s email roundup');
      } else {
        add('x', 24, 'Quote-post with one line of context');
        add('email', null, 'One-line mention in the roundup');
      }
      return out;
    }

    if (depth >= 3) add('long', null, 'Full video');
    add('short', null, depth >= 3 ? '3–5 cut-downs from the video' : 'Standalone Short');
    if (career || t === 'P1' || icp.includes('solo')) {
      add('linkedin', null, depth >= 3 ? 'Launch-day post for the video' : 'Text or carousel post');
    }
    if (depth >= 2 && t !== 'P3') add('x', null, 'Thread version');
    if (t === 'P1' || act) add('email', null, act ? 'Send the free resource to the list' : 'Feature in the weekly email');
    if (act) add('whatsapp', null, 'Share the free resource');
    return out;
  }

  // The channel that carries the idea; everything else is repurposing.
  function hero(idea, now) {
    const r = route(idea, now);
    if (!r.length) return null;
    if (idea.kind === 'news') return r[0].c;
    return r.find((x) => x.c === 'long') ? 'long'
      : (r.find((x) => x.c === 'linkedin') && (idea.pillar === 'career' || idea.pillar === 'interview')) ? 'linkedin'
        : r[0].c;
  }

  function evaluate(idea, now) {
    now = now || Date.now();
    return {
      score: score(idea, now),
      tier: tier(idea, now),
      urgencyNow: Math.round(effectiveUrgency(idea, now) * 10) / 10,
      channels: route(idea, now),
      hero: hero(idea, now),
    };
  }

  function mergeSettings(stored) {
    const s = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    if (stored && typeof stored === 'object') {
      ['cadence', 'perDay', 'held'].forEach((k) => {
        if (stored[k] && typeof stored[k] === 'object') Object.assign(s[k], stored[k]);
      });
    }
    return s;
  }

  // ---- dates (local calendar days, Monday-first weeks) ----

  function pad(n) { return String(n).padStart(2, '0'); }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function mondayOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const dow = (x.getDay() + 6) % 7; return addDays(x, -dow); }
  function slotId(date, channel, n) { return date + '_' + channel + '_' + n; }

  // Every cadence cell in a date range: [{id, date, channel, n, held}]
  function cells(fromDate, days, settings) {
    const st = mergeSettings(settings);
    const out = [];
    for (let i = 0; i < days; i++) {
      const d = addDays(fromDate, i);
      const dow = d.getDay();
      const date = ymd(d);
      CHANNELS.forEach((c) => {
        if (!(st.cadence[c] || []).includes(dow)) return;
        const per = st.perDay[c] || 1;
        for (let n = 1; n <= per; n++) {
          const held = n === 1 && (st.held[c] || []).includes(dow);
          out.push({ id: slotId(date, c, n), date, channel: c, n, held });
        }
      });
    }
    return out;
  }

  return {
    WEIGHTS, DIMENSIONS, HALF_LIFE_DAYS, TIERS, CHANNELS, CHANNEL_LABEL, ICP, PILLARS, STATUSES,
    DEFAULT_SETTINGS, scoresOf, ageDays, effectiveUrgency, score, tier, route, hero, evaluate,
    mergeSettings, ymd, parseYmd, addDays, mondayOf, slotId, cells,
  };
});
