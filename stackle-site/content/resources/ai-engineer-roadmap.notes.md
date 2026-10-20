# ai-engineer-roadmap: notes

Source: bundle data (`stepDatabase$1`, `phases$1`, `salaryData$1`, `AIEngineerRoadmapPage`, `DemoRenderer$1`).
I clicked all 27 step rows on the live page (Learn and Demo tabs). Every checklist item, link, embed and example matched the bundle exactly.

## 1. Structure (top to bottom)
1. Hero: a badge ("Free Career Guide · Updated for 2026"), a 2-line H1, the lead, and 3 CTAs:
   "Explore the Roadmap ↓" (`#phases`), "FREE AI Roadmap Webinar" (Meetup) and "Book a Call".
2. `stack` ("// 00 — THE FIELD"): heading, intro, then 6 icon boxes joined by pulsing arrows (Prompt > LLM API > RAG > Tools > Evals > Deploy), with a mono caption under them.
3. `salaryTable` ("// 01 — CAREER PROGRESSION"): a 4-column table with 8 rows (Phase 0–7) and a footnote. The stage pill shows the stage name plus `stageIcon`.
4. `roles` ("// ROLES & COMPENSATION"): 6 cards (level pill, title, salary, skill chips) and a footnote.
5. `roadmap` ("// 02 — YOUR JOURNEY"): heading, `introMd`, `runningExampleMd`, then a vertical timeline. Each phase has an emoji circle, the tag,
   `fullTitle` (the old page shows the full title), the salary line (shown with a 💰 or 🎯 emoji), the description, skill chips,
   and a STEP | CATEGORY table whose rows are clickable (each row shows the emoji, the step title and a chevron).
6. `cta`: a dark offer card (badge "Founding Cohort · June 8", 2-line heading, body, the price $1,297 with its note, 6 ticked features, 2 buttons,
   a 4-emoji avatar stack and "15 founding seats" text), an "or" divider, then the bundle card ($1,797) with
   "Explore Resume Marketing →" (`/services/resume-marketing`, which is the same page as `/career`) and "Connect on LinkedIn".
7. Lesson drawer: the same right-side sheet as the DE page. Tabs: **Learn** (Learning Checklist, Free Resources,
   **"Watch"**: each video is an embedded `youtube-nocookie.com/embed/<id>` player with a link underneath) and **Demo**
   (example and the footnote "Part of the AI Career Advisor capstone — your running project across all 7 phases.").

## 2. Interactions
- Step row click: opens the lesson drawer. The checkboxes are not saved. Videos are lazy-loaded iframes. Any video URL without
  a YouTube id would be skipped silently (all 28 have one).
- No live API calls, filters, search or gating. Reveal-on-scroll fade-up animations only.

## 3. Counts
- 8 phases (Phase 0–7), 27 topics, 27 lessons, all complete. Totals: 147 checklist items, 60 resources, 28 videos.
  Examples: 17 code, 5 tables, 4 flow diagrams, 1 ladder.
- Salary table: 8 rows. Role cards: 6. Stack items: 6.
- Images: none on the page. `card.jpg` is the old /resources index thumbnail.

## 4. Conventions
Same as data-engineering-roadmap: decorative emojis go into `icon` fields, and `*Md` fields hold inline Markdown (**bold**, *italic*).
`resources[].kind` is inferred from the URL. `linkCheck` is QA metadata from 2026-10-20, not page content.

## 5. Doubts
- Salary figures, none with a source: the table ($110k–$150k up to $300k–$550k, "Target $200k+ offer"),
  the role cards ($110K–$550K), the phase bands, the career ladder (up to "$450k–$900k+") and "Compensation reaches $500K+ at staff level".
  Also "FAANG + frontier labs (Anthropic / OpenAI) often pay 30–50% above the upper bound".
- Unsupported claims: the SEO description says "Built by a Meta engineer with 7 FAANG offers". Also "Today demand is 10× supply",
  "The role didn't exist 3 years ago", "RAG is the #1 most-asked-for AI feature at every company" and "15 founding seats · most-popular cohort".
- Stale or offer details: "Founding Cohort · June 8" (no year), $1,297 or 3 × $467, and the bundle at $1,797 or 3 × $599. The Meetup link is a generic events list.
- The heading says "The 7 Phases to Senior AI Engineer" and "across all 7 phases", but there are 8 phases (0–7).
- Videos: 24 of 28 point to the same video, Karpathy's "[1hr Talk] Intro to Large Language Models" (zjkBMFhNj_g),
  whatever the label says (for example "Rise of the AI Engineer — swyx" or "Evals are all you need — Hamel"). These are placeholders. Only
  "Intro to LLMs — Karpathy", "Intro to LLMs (1hr)", "Transformers explained — 3Blue1Brown" and "Git & GitHub Crash Course" are correct.
- Links: "Braintrust / LangSmith" goes to docs.braintrust.dev, which I could not reach (proxy tunnel failed), and has no LangSmith link.
  "Stackle Resume Builder" links to `/` (no such tool). "Latent Space Discord" goes to the latent.space homepage.
- The example tables (production metrics, $72K/yr savings, a job tracker with Anthropic/OpenAI statuses) are illustrative.
  Certification prices may be out of date.
