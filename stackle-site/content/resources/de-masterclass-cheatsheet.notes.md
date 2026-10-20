# de-masterclass-cheatsheet: extraction notes

Source: the SPA route renders a full-viewport `<iframe src="/resources/de-masterclass-cheatsheet.html">`, which is a static,
self-contained HTML file (title "Stackle DE Masterclass — Complete Cheat Sheet"). It was parsed from
`https://stackle.io/resources/de-masterclass-cheatsheet.html`. The site header and footer are hidden on this route. The page is not listed
in the resource library. There are no images (the `og:image` that Lovable injected is a homepage screenshot and was ignored).

## 1. Structure
- Left sticky sidebar: brand "Stackle DE" / "Masterclass Cheat Sheet", then 4 groups (`groups[]`), each with topic links
  (`topics[].navLabel`). Main area shows ONE topic at a time: `title`, `subtitle`, optional filter pills, then `sections`.
- Each section has a small uppercase title, then Q&A rows. Each row is a 2-column grid: left = `question` plus optional `hint`
  plus a level badge (`level`); right = `answer`, which is always visible (no accordion).
- `answer` is a list of blocks in source order: `text` (`html` uses only `<strong>`, `<em>`, `<br>`), `code`
  (`language` + verbatim `code`), `table` (`headers` + `rows`). A coloured table cell is
  `{text, kind}` with kind good (green, e.g. YES/Fast), bad (red, NO/Too slow) or warn (amber, NO*/Slow/Session).
- Badge colours: Basic green, Intermediate blue, Advanced amber, Concept teal, Snowflake pink.

## 2. Interactions
- Sidebar click: shows that topic, hides the others, marks the link active and scrolls to the top. SQL basics is open by default.
  The topic is not in the URL.
- Filter pills exist only on "SQL basics": All / Basic / Intermediate. They hide rows whose badge is not that level.
- There is no search, progress tracking, API call or download.

## 3. Counts
- 4 groups (Core SQL 5, Data Engineering 4, Modern Stack 6, AI + Jobs 2) = 17 topics, 20 sections,
  69 questions, all answered (18 Basic, 37 Intermediate, 8 Advanced, 4 Concept, 2 Snowflake).
  Answer blocks: 35 text, 32 code, 18 tables.

## 4. Doubts
- No summary, intro copy, SEO description or library category exists, so these are set to null. "Cheat Sheets" would fit as the category.
- The code sample "Connect Python to Snowflake" contains what looks like a real Snowflake account locator
  It also appeared in the Python deck. Replaced with the placeholder `ORGNAME-ACCOUNTNAME` in both files.
- Claims: Spark is "100x faster than Hadoop MapReduce for most workloads"; Kafka throughput "Millions msg/sec" vs
  "Thousands/sec" for RabbitMQ/SQS.
- The AI topic hard-codes model id `claude-sonnet-4-20250514` (dated). Its API key placeholder is `YOUR_KEY`.
- Several topic titles differ from their sidebar labels (e.g. "How to read a query" vs "How to read and write a SQL query").
  Both are kept.
