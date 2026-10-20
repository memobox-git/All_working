# python-for-de-deck: extraction notes

Source: the SPA route renders a full-viewport `<iframe src="/resources/python-for-de-deck.html">`, a self-contained static
deck (title "Python for Data Engineering — Stackle"). It was parsed from `https://stackle.io/resources/python-for-de-deck.html`.
The site header and footer are hidden on this route. The page is not in the library. There are no images and no speaker notes (`layout.speakerNotes: null`).

## 1. Structure
- Top bar: "Stackle · Python for DE" (left), slide counter "current / total" for the current part (right).
- Left sidebar (`parts[].sidebar`): 3 collapsible parts, each holding sections. A section has a number ("01"…"21") or an icon,
  and either links straight to a slide or expands into `items`. Each item links to a `slide` and optionally a `codeTab`.
- Stage: one slide at a time (max 900x560, rounded card). Bottom bar: "← Prev", one dot per slide in the part, "Next →".
- Slide types (`slides[].type`):
  - `cover`: eyebrow, title (`titleHtml` keeps the line break and italic second line), subtitle, chips.
  - `section`: eyebrow, title, description, big `sectionNumber`.
  - `code`: dark slide. Left list of tabs (`sidebarTitle` + tab labels), top bar shows `file` and `heading`, one snippet visible.
  - `content`: blocks = `grid` (2/3/4 columns) of `card` (label, title, html) and `stack` columns, plus `callout`,
    `label` (small uppercase heading) and inline `code`.
  - `pipeline`: two horizontal flow diagrams (box → box) with a sub-caption under each box.
- `tone` values (amber/blue/green/violet/red) come from class names. The live CSS overrides them all to monochrome.

## 2. Interactions
- Prev/Next, ArrowRight/ArrowDown and ArrowLeft/ArrowUp move within the CURRENT PART only. They do not wrap into the next
  part, and Next is disabled on a part's last slide. Parts 2 and 3 can only be reached from the sidebar.
- Dots jump within the part. Clicking a part header only toggles collapse. Clicking a section header toggles its items
  (or navigates, if it has no items). A sidebar item goes to its slide and switches the code tab. Prev/Next re-syncs the
  sidebar highlight.
- Code-slide tabs: clicking one shows that snippet. All code is Python (`.env` snippets are Python comments).
- No URL state: reloading always returns to Part 1, slide 1. There are no API calls or downloads.

## 3. Counts
- 3 parts, 27 slides (Part 1: 11, Part 2: 8, Part 3: 8). There are 15 code slides with 56 tabbed snippets (26/20/10), plus
  1 inline snippet on the Module 18 slide. 5 content slides, 3 covers, 3 section slides, 1 pipeline slide.

## 4. Doubts and bugs
- In Part 2 the slide order is Module 19 → 21 (pandas) → 20 (Snowflake), but the sidebar links for "Snowflake Connection"
  and "pandas for DE" pointed to each other's slide. The JSON uses the intended slide and keeps `originalNavSlide`.
- Missing content: the sidebar lists "Comprehensions" (Section 07) and the projects "Order Validator" and "Revenue Tracker"
  (Section 09), but their slides only cover the 4 data structures and the Mini ETL project.
- Numbering jumps from Section 09 (Part 1) to Module 15 (Part 2). There are no modules 10–14.
- The first item of each section (e.g. "# Comments") does not switch tabs. The "print()" item highlights the wrong tab.
- Code samples contained a real-looking Snowflake account (now replaced with `ORGNAME-ACCOUNTNAME`) and user "chris" (m19-a, m19-c, m20-d)
  and Spotify artist IDs. Review them before republishing.
- No category or SEO description exists on the old site. `seo.description` reuses the cover subtitle.
