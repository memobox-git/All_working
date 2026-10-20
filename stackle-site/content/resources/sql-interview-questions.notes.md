# sql-interview-questions: extraction notes

Source: `SqlInterviewQuestionsPage` + `CATEGORIES` array in the main bundle (answers are HTML strings in `answerHtml`),
cross-checked against the live page with every answer expanded (295/295 match, whitespace-insensitive).

## 1. Structure (top to bottom)
1. Hero: eyebrow badge "Stackle Career Resources" (had a decorative chart emoji), H1 in two lines
   (`heading.lines`: "295+ SQL Interview" / "Questions & Answers"), summary paragraph, 4 stats
   (295+ Questions, 21 Categories, 70% Practical, 3 Difficulty Levels), search box ("Search questions…").
2. Filter row: label "Filter:" + 7 pill buttons (All, Theory Only, Practical Only, Easy, Medium, Hard, FAANG).
3. 21 category sections in source order (note the order interleaves "1B/2B/3B/6B ... Continued" sections:
   1-12, 1B, 2B, 3B, 13, 14, 15, 16, 6B, 17). Each header: emoji icon (dropped), title, "N Questions" badge.
4. Each question is an accordion card: "Q{n}" chip, question text, Type chip, Difficulty chip, chevron.
   Answer hidden until clicked.
5. CTA card ("Become a Data Engineer in 10 Weeks" -> /resources/data-engineering-roadmap), footer (dropped),
   fixed bottom-right counter "{shown} / {total} questions".

## 2. Interactions
- Accordion: clicking a card toggles its answer; several can be open at once (state = Set of question ids).
- Search: case-insensitive substring match on question text only (not answers), combined (AND) with the filter.
  Categories with 0 matches are hidden; category badge shows the filtered count.
- Filters are single-select. FAANG = question text starts with "[" (stored as `faang: true`).
- Counter updates live with the number of visible questions. No API calls, no gating, no downloads.
- Category `color` values exist in the data but are not used by the render code (dropped).

## 3. JSON shape
`categories[] -> { id, number, name, title, questions[] -> { n, question, type, difficulty, faang, company, answer.blocks[] } }`.
Block types: `paragraph {html}`, `code {language, source}`, `tip {label, html}`. `html` is an inline subset only
(`<strong> <em> <code> <br>`, entities escaped). Code `source` is raw text with real newlines. `company` is parsed
from "[Meta] ..." or "Meta interview: ..." prefixes (informational; `faang` mirrors the live filter).

## 4. Counts
- 295 questions in 21 categories, all 295 with answers (none missing).
- Theory 33 / Practical 262; Easy 36 / Medium 99 / Hard 160; FAANG filter matches 12.
- Answer blocks: 291 code (all SQL), 100 paragraphs, 53 tips ("Stackle Tip" x52, "Why it matters" x1).
- Images: none in content; `card.jpg` = the resource-index card image (from /assets/sql-interview-DkQnNUQu.jpg).

## 5. Fixes applied (vs. live)
- Q73 and Q92: the source HTML contains Cloudflare email-obfuscation links, so the live page shows
  "[email protected]". Decoded to the intended literals `'USER@EMAIL.COM'` and `'john@co.com'`.

## 6. Doubts
- Stat "70% Practical" is hard-coded; the real share is 89% (262/295).
- SEO description says "300+" questions; H1 says 295+ (computed from data).
- FAANG filter only catches the 12 "[Company]" questions (Q113-124). Q251-260 ("Meta interview: ...") are
  company-labelled but excluded; several labels are not FAANG (Uber, Stripe, Airbnb, DoorDash, Salesforce, TikTok...).
- Company attributions ("[Meta]", "Google interview:") are unverifiable claims that these are real interview questions.
- "$150K+ roles" (summary, CTA) is an unsourced salary claim. CTA says "Data Engineering Masterclass" / "10 Weeks"
  but links to the free /resources/data-engineering-roadmap page, not a course.
- Resource-index card data (`listing`): likes 421 / views "22.7k" are hard-coded numbers, not real metrics.
- Live page `<meta description>` duplicates: the site-wide default plus the Helmet one; `seo` uses the Helmet values.
