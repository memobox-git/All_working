# _index (resource library, /resources): extraction notes

Source: `ResourcesPage` in the main bundle (hard-coded array `sr` and tabs `ir`), checked against the live page
with Playwright (tabs clicked, search typed, dialog opened but not submitted).

## 1. Structure
- Header: eyebrow "Stackle / Resource library" (CSS uppercases it), H1 "Practical guides for your next career move.",
  intro "Roadmaps, interview preparation, and hands-on references built for modern data and AI roles.", and a search
  input on the right (sr-only label "Search resources", placeholder "Search the library").
- A sticky tab bar (pills): Discover, Roadmaps, Interview Prep, Interactive, AI Tools, Cheat Sheets.
- Collection header: eyebrow "Curated collection", H2 "All resources" (Discover) or the tab name, and a count "N resource(s)" on the right.
- Grid of 1/2/3 columns of cards. Each card: image (box 1024x768 with object-cover), uppercase badge top-left, title, an icon
  (arrow-up-right, or download for the PDF), category on the left and "<views> views" on the right.

## 2. Interactions
- Tabs filter by `category` exactly. The tab is local state and not in the URL. "AI Tools" shows the empty state
  "No resources in this category yet." (0 items).
- Search: case-insensitive substring match on title OR category. It is written to `?q=` (history replace) and combines with the tab.
- Cards 1–8 are SPA links. Card 9 (SQL cheat sheet) is a button that opens the email-gate dialog (see
  `sql-cheat-sheet.notes.md`). Two library routes exist but are NOT listed: `/resources/de-masterclass-cheatsheet`
  and `/resources/python-for-de-deck`.

## 3. Counts
- 9 cards: Roadmaps 3, Interview Prep 3, Interactive 2, AI Tools 0, Cheat Sheets 1. Badges: POPULAR 1, NEW 4,
  FAANG 1, INTERACTIVE 1, FREE PDF 1, and none on Tableau. 9 thumbnails were downloaded to `public/resources/_thumbs/`.

## 4. Doubts
- View counts are hard-coded strings in the bundle (and look made up): data-engineering-roadmap 12k, ai-engineer-roadmap
  8.4k, data-analyst-roadmap 5.8k, sql-interview-questions 22.7k, tableau-interview-questions 6.1k, linkedin-bible 3.2k,
  power-bi "New", apache-spark-architecture "New" (renders as "New views"), sql-cheat-sheet 34.1k. For comparison, the
  cheat sheet's download log holds only 6 rows.
- Hidden `likes` (not rendered): 248, 189, 142, 421, 167, 98, 0, 0, 612, all with author "Stackle". They are stored in
  `unverifiedStats` and not shown on the page.
- No page-specific SEO: the old site serves the site-wide title "Stackle - Connect with Expert Instructors & Learn New
  Skills", so `seo` is null.
- Data ids differ from URL slugs (e.g. id "de-roadmap" vs slug "data-engineering-roadmap"). The JSON keeps both.
- Thumbnails have mixed sizes and aspect ratios (853x377 PNG, 1024x1024, 1024x768, 1200x912, 1080x1080), all cropped to 4:3.
