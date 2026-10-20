# tableau-interview-questions: extraction notes

Source: lazy chunk `/assets/TableauInterviewQuestionsPage-CcQiucQv.js` (not in the main bundle; fetched by GET),
array `k` (answers are HTML in `answerHtml`) + image map `N`. Cross-checked against the live page with every
answer expanded: 285/285 match (whitespace-insensitive), apart from the code blocks noted below.

## 1. Structure (top to bottom)
1. Hero: eyebrow "Stackle Career Resources" (decorative emoji dropped), H1 in two lines ("285+ Tableau Interview" /
   "Questions & Answers"), summary, 4 stats (285+ Questions, 16 Categories, 70% Practical, 50+ FAANG Qs),
   search box ("Search questions…") with a "Take Quiz" button next to it.
2. Filter row: "Filter:" + All, Theory Only, Practical Only, Easy, Medium, Hard, FAANG.
3. 16 category sections (header: emoji icon (dropped), title, "N Questions" badge), accordion cards
   ("Q{n}", question, Type chip, Difficulty chip). Answers hidden until clicked.
4. Q35-Q59 (chart types) show a "Visual Example:" image under the answer (`visualExample`, 800x512 JPGs).
5. CTA card ("Become a Data Engineer in 10 Weeks" -> /resources/data-engineering-roadmap), footer (dropped),
   fixed bottom-right counter "{shown} / {total} questions".

## 2. Interactions
- Accordion, search and filters behave exactly like the SQL page: multi-open accordion; search = case-insensitive
  substring on question text only, ANDed with the single-select filter; empty categories hidden; FAANG = question
  starts with "[" (`faang: true`).
- IMPORTANT: the live page strips every `<pre>` block from answers before rendering
  (`answerHtml.replace(/<pre>[\s\S]*?<\/pre>/g, "")`), so none of the 122 code blocks are visible on the old site.
  They are kept in the JSON (`codeBlocksShownOnOldSite: false`); decide whether to show them. For Q35-Q59 the code
  block is an ASCII sketch of the chart (`language: "text", kind: "ascii-sketch"`), replaced live by the image.
- "Take Quiz" opens a modal quiz (client-only, details in `quiz`): 15 random questions; 4 options = first 120 chars
  of the correct answer's plain text + 3 random other answers' first 120 chars, shuffled, lettered A-D; click locks
  the choice (green check correct / red X wrong), "Next Question" / "See Results"; header shows "n / 15" and
  "Score: x" with a progress bar; result screen: "Quiz Complete!", "You scored x/15", "% correct", bar,
  message by threshold (>=80, >=50, else; decorative emojis dropped), Retry / Close. No API calls anywhere.

## 3. JSON shape
Same as sql-interview-questions.json, plus block type `list {ordered, items[]}`, optional `visualExample
{label, src, originalUrl, alt, width, height}` per question, and `quiz`. Code languages: tableau (calc language) 89,
text 26, sql 3, shell 1 (tabcmd), javascript 1, http 1, python 1.

## 4. Counts
- 285 questions in 16 categories, all 285 with answers (none missing).
- Theory 91 / Practical 194; Easy 85 / Medium 121 / Hard 79; FAANG 52 (all in category 16).
- Blocks: 437 paragraphs, 122 code, 74 tips (all "Stackle Tip"), 73 lists. 25 visual-example images.
- Files in public/resources/tableau-interview-questions/: 25 chart JPGs (hash suffix removed from names) + card.jpg
  (resource-index card, from /assets/tableau-interview-DMB-sWJw.jpg).

## 5. Fixes applied (vs. source/live)
- Q106: malformed HTML (first `<pre>` never closed) swallowed the paragraph "And for the previous year:" on the live
  page; split into code / paragraph / code as clearly intended.
- Q257, Q259, Q267, Q282: question text contained literal `<code>` tags (shown as raw text live); tags removed.
- Q46, Q47, Q54: Markdown backticks in list items converted to `<code>`.
- `<br/>` inside code blocks converted to newlines.

## 6. Doubts
- The 25 chart images are AI-generated with garbled labels ("REVEUE", "TOTAL4"...) and some don't match the chart
  type (waterfall-chart.jpg is a plain bar chart). Consider replacing them.
- Stat "70% Practical" is hard-coded; real share is 68% (194/285). SEO description says "260+" vs 285 in the H1.
- "[Amazon]/[Meta]/..." labels are unverifiable claims that these are real interview questions.
- "$150K+ roles" is an unsourced salary claim; CTA "Data Engineering Masterclass" links to the free roadmap page.
- `listing` likes 167 / views "6.1k" are hard-coded numbers, not real metrics.
- Some answers may be technically shaky (e.g. Q188 claims the standard Join dialog supports `<>`, `<`, `>`
  operators "for most spatial and localized database connections"); not reviewed for accuracy.
