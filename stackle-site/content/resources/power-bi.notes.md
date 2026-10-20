# power-bi: extraction notes

Source: `powerBiModules` array plus the `PowerBiResourcePage` component in the main bundle. I evaluated the JSX
with a mock runtime to get exact text, then checked it line by line against the live page, rendered once per lesson
(26/26 lessons match, ignoring whitespace). The page is a self-contained "course reader". The global site navbar
and footer are hidden on this route, and the page has its own full-screen layout.
Screenshots of every lesson and UI state are in
`/tmp/claude-0/-home-user-All-working/df524b4a-79ce-5043-8169-78cd529f7371/scratchpad/extract/interactive/shots/`
(`power-bi__NN-<lessonId>.png`, `power-bi__state-*.png`, `power-bi__block-*.png`).

## 1. Structure / layout
- Desktop (lg and up, 1024px or wider): a fixed left sidebar, 320px wide, plus a main column. The main column has a
  64px sticky header bar and a scrollable `<article>` (max 900px wide) that shows ONE lesson at a time.
- Sidebar, top to bottom:
  1. "← Resources" link (/resources).
  2. Brand block: a yellow square holding 3 rising bars (Power BI mark), "Power BI", and the tagline
     "Practical learning path".
  3. Search input ("Search lessons").
  4. Curriculum nav ("Power BI curriculum"): 9 module groups. Each group has a lucide icon and an uppercase label
     such as "01 · FOUNDATIONS". Under it are lesson buttons, each with a 2-digit global number, the title and, for
     lessons before the current one, a check icon.
  5. Footer: "Course progress", "{n}/26", and a 4px progress bar.
- Header bar: on the left, the module label (accent colour, uppercase) above the lesson title (both truncate).
  On the right (sm and up): an outline button "Copy DAX" and a yellow button "Download .dax".
- Article, in order:
  1. Meta line "LESSON 01 · 8 MIN".
  2. H1 lesson title, then a divider.
  3. Lesson blocks (see schema).
  4. Mobile only (below sm): full-width "Copy all DAX" and "Download measures" buttons.
  5. Prev/next nav: a 2-column grid with "Previous"/"Next" over the lesson title. On the last lesson the Next cell
     becomes "Complete / Back to resources" → /resources. On lesson 1 the Previous cell is an empty box.
- Mobile (below lg): the sidebar is hidden. A hamburger in the header ("Open curriculum") opens a left drawer
  (`min(90vw,360px)`) with the same sidebar content, an X close button and a dimmed backdrop (click it to close).
- Theme: always dark. The tokens are hsl:
  - page `0 0% 4%`, surface `0 0% 7%`, elevated `0 0% 10%`, border `0 0% 18%`
  - text `0 0% 98%`, muted `0 0% 65%`
  - accent cyan `188 86% 43%`, Power BI yellow `50 89% 51%` (on-yellow text `0 0% 8%`)
- Active lesson button: filled yellow with dark text.

## 2. Interactions (rebuild exactly)
- **Lesson routing**: the current lesson comes from the query string `?lesson=<lessonId>`. If it is missing or
  unknown, the page shows lesson 1. Clicking a sidebar lesson or Prev/Next calls
  `setSearchParams({lesson:id},{replace:true})`, which replaces the history entry instead of pushing a new one. It
  also closes the mobile drawer. Every lesson can be deep-linked, e.g. `/resources/power-bi?lesson=dax-context`.
- **Scroll bug to fix**: the code calls `window.scrollTo(top, smooth)`, but the scroll container is the
  `<article>`, so the scroll position stays where it was when the lesson changes (tested: scrollTop 1357 → 1287).
  The rebuild should reset the article/page scroll to the top on every lesson change.
- **Search**: filters the sidebar only. It is a case-insensitive substring match on lesson **titles** and does not
  search lesson content. Modules with no matching lessons are hidden. Global lesson numbers stay unchanged; for
  example, "dax" shows only 13 "DAX fundamentals" and 20 "Build the DAX measures". If nothing matches, the sidebar
  shows "No lessons match your search.". The search does not change the current lesson.
- **Progress**: there is no stored progress. The value is `(currentIndex+1)/26`, so the bar width is that
  percentage, animated with `transition: width 300ms`. Lessons before the current index show a check mark.
  Nothing is saved to localStorage.
- **Copy DAX** / **Copy all DAX**: does a GET on the .dax file, then `navigator.clipboard.writeText(text)`. The label
  switches to a check icon and "Copied" for 1800 ms, then reverts. The copy is 2273 characters (the whole file).
- **Download .dax** / **Download measures**: a plain `<a download>` link to the .dax file.
  - Old URL: `/resources/hr-analytics-measures.dax`
  - New URL: `/resources/power-bi/hr-analytics-measures.dax`
  - Add a redirect if the old URL had links pointing to it.
- Hover only: buttons and lesson rows lighten to `elevated`. Nothing else animates. There are no quizzes, charts,
  live API calls, gates or forms.
- `document.title` = "Learn Power BI | Stackle Resources".

## 3. JSON schema (blocks inside `modules[].lessons[].blocks`)
Inline text uses a small Markdown subset: `**bold**`, `*em*`, `` `code` ``, `[label](url)`. Literal `[ ] _ *`
are backslash-escaped, e.g. `\[Name\]` and `\_Measures`.
- `lede` {text}: the large intro sentence. Every lesson has exactly one, and it comes first.
- `heading` {level:2, text}
- `paragraph` {text}
- `list` {ordered, items[]}
- `callout` {title, text}: a box with a left accent border and a small uppercase cyan title.
- `code` {language: "dax" | "powerquery-m", code}. The old site had no language label and no syntax highlighting.
  It was a plain `<pre>`.
- `table` {head[], rows[][]}: the first column is bold. Headers are uppercase muted text.
- `cards` {columns, items[{title,text}]}: a grid of surface cells separated by 1px borders.
- `practice` {items[]}: a yellow-bordered box titled "PRACTICE" with an `<ol>`.
- `takeaways` {items[]}: "KEY TAKEAWAYS" with cyan square bullets. Every lesson has one, and it comes last.
- Single-use blocks:
  - `tiles` {variant:"headline"}: 3 big-word tiles in lesson 1.
  - `steps`: 01 to 05 Connect/Transform/Model/Visualize/Share tiles in lesson 2.
  - `icon-grid` {icon:"database"}: lesson 3.
  - `checklist-grid`: lesson 6.
  - `feature-cards` {items[{badge? | label? | number?, title, text, highlight?}]}: lessons 4, 5, 9 and 19.
    `highlight` = yellow tint (lesson 4 "Recommended").
  - `diagram` {diagram:"relationship", from, fromCardinality, to, toCardinality, label}: lesson 10. It draws a
    Department box (yellow border), then "1 ──── *" with "one to many" under it, then an Employee box (cyan border).
- `modules[].icon` = lucide icon name. `lesson.number` = the global lesson number. `lesson.minutes` comes from
  `duration`.
- `downloads[0].content` holds the full .dax text, so the copy button can work without a fetch.

## 4. Counts
9 modules, 26 lessons, 252 minutes in total. The lessons contain:
- 66 H2 headings, 20 paragraphs and 22 lists
- 21 tables and 5 card grids
- 12 code samples (10 DAX, 2 Power Query M)
- 10 callouts, 6 practice boxes and 26 takeaway lists
- 9 single-use visual blocks (tiles, steps, icon-grid, checklist-grid, 4 feature-cards, the relationship diagram)

The modules are:
1. Foundations (3 lessons)
2. Setup (2)
3. Power Query (3)
4. Data modeling (4)
5. DAX (3)
6. Visualization (3)
7. HR project (3)
8. Publish & govern (3)
9. Career (2)

There is one downloadable file: `hr-analytics-measures.dax`, with 13 measures, 2 calculated columns and 1 Calendar
table. The
old site has no images inside the lessons. The listing card image was saved as `card.jpg` (1200×912).

There is no dataset with sample rows, no chart with real values and no quiz anywhere on the page. The HR dataset is
described only in tables: table name, grain and key fields (lesson 19), and the visual type to field mapping is
given in prose and lists (lessons 16 and 21).

## 5. Doubts / issues
- **Double numbering**: Practice items contain "1. ", "2. " inside an `<ol>` that also shows decimal markers, so
  the live page reads "1. 1. Write down…". I kept the text verbatim; the rebuild should either drop the prefixes or
  use an unnumbered list.
- **Doubled backslashes**: the Power Query M sample shows `"C:\\data\\hr.xlsx"`. M strings do not escape
  backslashes, so this was probably meant to be `C:\data\hr.xlsx`. Kept verbatim.
- **The .dax file says it is a reconstruction**: its header reads "Reconstructed from the measure names… The
  original DAX… could not be read". It also disagrees with the lessons:
  - the promotion threshold is >=4 in the file but >=3 in lessons 19/20;
  - salary uses `Employee[Salary]` in the file but `Employee[MonthlyIncome]` in the lessons;
  - the file uses `PerformanceRating`/`Calendar` tables where the lessons use `Performance`/`Date`;
  - measure names differ (`Avg_Salary` vs `Average_Salary`, `Retrenched%`, `Due for Promotion %`).
- **Unsourced statistic**: lesson 1 says "roughly 60% … 25% … 15%" of effort, with no source.
- **Counts that do not add up** in lesson 26:
  - the lede says interviews "cluster around six themes", but there are four sections;
  - the practice item says "the twelve questions above", but there are 13 (4 + 4 table rows + 5 list items).
- **No real SEO copy**: the old page only had the generic site meta description. I copied `summary` and
  `seo.description` verbatim from lesson 1's lede.
- **Listing card stats**: they show likes 0 and views "New", which are placeholder stats.
- **Page title**: "title" uses the listing-card title; the page itself shows only "Power BI" in its sidebar.
