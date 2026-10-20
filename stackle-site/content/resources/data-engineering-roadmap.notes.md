# data-engineering-roadmap: notes

Source: bundle data (`stepDatabase$2`, `phases$2`, `foundations`/`pipelineSkills`/`platformGroups`/`coreSkills`, `LiveDataPipeline`).
I clicked all 20 topics on the live page (Learn and Demo tabs). Every checklist item, link and example matched the bundle exactly.

## 1. Structure (top to bottom)
1. Hero: eyebrow, 2-line H1, lead, 2 CTAs (Masterclass `/courses`, Book a Call), 3 stats (05 phases / 20 topics / 01 pipeline).
2. `capabilityMap` ("01 / Capability map"): a technical column with 2 bands (5 numbered foundation cards, 4 pipeline rows) and 2 "choose one" boxes (cloud, managed platform). Beside it, an aside with 6 numbered core skills, then a closing note. Icons are lucide names (`lucide:Braces` etc.).
3. `pipelineDemo` ("// LIVE PIPELINE DEMO"): an interactive layer-by-layer demo (see 2).
4. `roadmap` ("03 / Guided roadmap"): a vertical timeline of 5 phases. Each shows "0N / 05", the tag ("Phase 0"),
   `title` (the old site shows the short title, with the part before "—" removed; `fullTitle` keeps it),
   `salary.text` (emoji removed), description, skill chips, and numbered topic buttons (number, title, category, chevron).
5. `cta`: "Build with guidance" block with the price $1,497, "View the masterclass" (`/courses`) and a "Book a call" text link.
6. Lesson drawer: a right-side sheet (full width on mobile, max-w-xl). The title is the topic emoji plus the title, and `overview` sits under it.
   Tabs: **Learn** (Learning Checklist with checkboxes, Free Resources links, "YouTube Videos" as plain links, not embeds) and
   **Demo** (example title, then the example, then the footnote "Part of the e-commerce orders pipeline...").

## 2. Interactions
- Topic button: opens the drawer for that lesson. Escape, the close button or clicking outside closes it. The checkboxes are uncontrolled and not saved anywhere (they reset each time the drawer opens).
- Live pipeline demo (all of it runs client-side):
  - "Start Pipeline" sends `GET https://dummyjson.com/products?limit=6&skip=<random 0-79>`. The UI shows only `?limit=6`.
  - While loading, the button reads "Fetching..." and the 🌐 "Fetching from DummyJSON API" panel shows "Awaiting API response...".
  - All layers are computed in one go. After that the user reveals them one at a time with "Next: Silver Layer →", then "Next: Gold Layer →",
    then "Next: Consumer Views →". Earlier layers stay visible, so the panels stack up.
  - A row of stage chips (API > Bronze > Silver > Gold > Consumers) shows progress. The current chip is highlighted, done chips are solid and future chips are dimmed.
  - Bronze: the first 3 wrapped records as JSON. Silver: a cleaned table. Gold: an enriched table with status and tier badges.
    Consumers: an Analyst card (SQL plus a result table), a Scientist card (pandas plus a result table), and an Executive dashboard
    (4 KPIs, a bar chart, a donut and an area chart drawn with Recharts, plus a footer). Exact rules and colours are in `pipelineDemo.stages`.
  - From the Bronze stage on, the button reads "Run Again" and fetches a new random page. On error, a red message appears and the demo returns to idle.
- Reveal-on-scroll fade-up animations (framer-motion) on the sections.

## 3. Counts
- 5 phases, 20 topics, 20 lessons, all complete. Totals: 129 checklist items, 54 resources, 32 videos.
  Examples: 14 code (one is a Databricks "notebook"), 3 tables, 3 flow diagrams.
- Capability map: 5 foundation skills, 4 pipeline skills, 2 choice groups of 3 options each, 6 core skills.
- `unlinkedLessons`: 6 more lessons in the bundle that no phase links to, so visitors never saw them
  (Explore Career Path, Career Decision, System Design, Data Governance, Team Leadership, Cost Optimization). Kept for a decision.
- Images: none on the page itself. `card.png` is the thumbnail from the old /resources index, saved to `/resources/data-engineering-roadmap/card.png`.

## 4. Conventions in the JSON
- Decorative emojis are removed from text and kept in `icon` fields. `example.kind` is code | table | flow | ladder (`source` = old renderer key).
- `resources[].kind` is inferred from the URL (the page has no labels). `linkCheck` is QA metadata from my 2026-10-20 check, not page content.

## 5. Doubts
- Salary figures, none with a source: the phase bands $65K–$85K (SQL Developer), $85K–$120K (Data Analyst / ETL Developer),
  $120K–$200K (Data Engineer) and "Target: $150K+ offer". Unlinked lessons add a $65k–$800k career ladder and "$120k–$700k+".
- Unsupported claims: "Apply 25–45 jobs per day, ace 500+ interview questions". SEO: "Built by someone who actually did it."
  Certification prices ($150/$200/$200/$175) and the savings figures in the examples ($12K/mo, $324K/yr) are illustrative or may be out of date.
- Demo honesty: the executive dashboard says "LIVE" and "Real-time", and its "+12.5%" trend is hard-coded.
  The Scientist code says `.median()`, but the result table is computed with the mean.
- Broken links (404): "What is Data Engineering? — AWS" (aws.amazon.com/what-is/data-engineering/) and "OWASP Data Security".
  In an unlinked lesson: "Levels.fyi — DE Salaries".
- Videos: 10 of 32 are unavailable on YouTube. 11 more open a different video than their label says. Examples:
  "Azure Data Engineering — Adam Marczak" opens a Dijkstra's-algorithm video. "Data Security for Engineers" opens a Terraform course.
  "Fireship" labels open an AltexSoft video. "AWS Data Engineer Cert Prep" opens a 2020 Cloud Practitioner course. See `linkCheck.labelMatches`.
- Links that only go to a homepage: "DE vs DA vs DS — Towards Data Science" (homepage only), "Levels.fyi Resume Tips" (homepage),
  "W3Schools SQL Data Modeling" (goes to the CREATE DATABASE page). 9 links could not be verified because bot protection blocked the check (403/429).
- The first example says "Phase 5: You'll design the system at scale", but the page ends at Phase 4. Section kickers skip "02".
- The card image shows an older hero ("The Data Engineering Career Roadmap"). The index card's 248 likes and 12k views are hard-coded.
