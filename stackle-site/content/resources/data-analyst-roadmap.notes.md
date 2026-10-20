# data-analyst-roadmap: notes

Source: bundle data (`stepDatabase`, `phases`, `salaryData`, `DataAnalystRoadmapPage`, `DemoRenderer`).
I clicked all 17 step rows on the live page (Learn and Demo tabs). Every checklist item, link, embed and example matched the bundle exactly.
The layout is the same template as ai-engineer-roadmap, with a different accent and different copy.

## 1. Structure (top to bottom)
1. Hero: a badge ("Free Career Guide · Updated for 2026"), the 2-line H1 "The Data Analyst / Career Roadmap", and the lead
   (`leadMd` keeps **Power BI** and **Tableau** in bold). 3 CTAs: "Explore the Roadmap ↓" (`#phases`),
   "FREE Analyst Masterclass" (Meetup events page) and "Book a Call".
2. `stack` ("// 00 — THE FIELD"): 6 icon boxes joined by arrows (Excel > SQL > Python > Power BI > Tableau > Storytelling) and a caption.
3. `salaryTable` ("// 01 — CAREER PROGRESSION"): a 4-column table with 5 rows and a footnote.
4. `roles` ("// ROLES & COMPENSATION", heading "Where Data Analysts Land"): 6 cards and a footnote.
5. `roadmap` ("// 02 — YOUR JOURNEY"): a vertical timeline of 5 phases. Each phase has a STEP | CATEGORY table with clickable rows.
   The old page shows `fullTitle` and the salary with its 💰 or 🎯 emoji.
6. `cta`: an offer card (badge "Live Cohort · Next Start", the price $997, 6 features, 2 buttons and "15 founding seats" text), an "or" divider,
   and the bundle card ($1,497) with "Explore Resume Marketing →" (`/services/resume-marketing`) and "Connect on LinkedIn".
7. Lesson drawer: tabs **Learn** (Learning Checklist, Free Resources, **"Watch"** with embedded youtube-nocookie players and links)
   and **Demo** (example and the footnote "Part of the Retail Sales Performance capstone — your running project across all 7 phases.").

## 2. Interactions
- Step row click: opens the drawer. The checkboxes are not saved. Videos are lazy-loaded iframes.
- No API calls, search, filters or gates. Reveal-on-scroll animations only.

## 3. Counts
- 5 phases (Phase 0–4), 17 topics, 17 lessons, all complete. Totals: 94 checklist items, 37 resources, 21 videos.
  Examples: 8 code (sql, python, dax, json, text), 5 tables, 3 flow diagrams, 1 ladder.
- Salary table: 5 rows. Role cards: 6. Stack items: 6.
- Images: none on the page. `card.jpg` is the old /resources index thumbnail.

## 4. Conventions
Same as data-engineering-roadmap and ai-engineer-roadmap (`icon` fields, `*Md` Markdown fields, an inferred `resources[].kind`, and `linkCheck` as QA metadata from 2026-10-20).

## 5. Doubts
- Salary figures, none with a source, and they contradict each other. The table says Phase 1 is $65k–$90k but the phase card says $55K–$90K.
  The table says Phase 2 is $90k–$135k but the card says $80K–$150K. The role cards run from $60K–$85K to $140K–$200K.
  The ladder goes up to "Head of Analytics $180k – $280k+". "Target $120k+ offer". "FAANG + top fintech pay 30–60% above".
- Unsupported claims: "10× more open jobs than qualified analysts in 2026", "Excel is still the #1 BI tool in the world",
  "SQL powers 100% of dashboards", "the two BI tools that 90% of job postings ask for", "Two certs cover 90% of analyst jobs".
  "15 founding seats · most-popular cohort" was copied from the AI page.
- The heading says "The 7 Phases to Senior Data Analyst" and the copy says "across all 7 phases", but there are only 5 phases.
- Offer details may be out of date: $997 or 3 × $367, and the bundle at $1,497 or 3 × $499. The Power BI vs Tableau table gives $10/user/mo and $75/user/mo (Creator),
  and the certification prices may also be out of date.
- Broken links (404): "Chandoo — Pivot Tables" and "SQLBI — Star Schema for BI". 4 links could not be verified because bot protection blocked the check (Glassdoor, Tableau x2, Gartner).
- Videos: 10 of 21 are unavailable on YouTube. 6 more open a different video than their label says. For example,
  "Excel Crash Course — Leila Gharani" opens a freeCodeCamp video, "Power BI Full Course — Microsoft" opens Avi Singh,
  and "How to land a Data Analyst job in 2026" opens a freeCodeCamp Data Science course. See `linkCheck`.
- The card image is AI-generated and has garbled text ("Pare accds", "Pcdiwager").
