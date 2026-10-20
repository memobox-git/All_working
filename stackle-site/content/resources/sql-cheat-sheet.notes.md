# sql-cheat-sheet: extraction notes

The "SQL Essentials Cheat Sheet" exists only as a card in the library (`/resources`). There is no page:
`/resources/sql-cheat-sheet` renders the site 404 ("Page Not Found"). The card is a `<button>`, not a link
(the `href` in its data is "#download" and is unused), and it opens an email-gate dialog.

## 1. Structure
- Card: badge "FREE PDF", cover thumbnail (`/resources/_thumbs/sql-cheat-sheet.png`, 1080x1080, the artwork says
  "SQL CHEAT SHEET / SQL Quick Start Guide"), title, category "Cheat Sheets", a download icon instead of an arrow.
- Dialog "Download Free SQL Resource": a resource box ("SQL Resource", description, "PDF Format • 2 Pages • FREE"),
  an "Email Address" input, and a full-width button "Download SQL Resource". After success it swaps to "Download Started!".
- PDF content (`pdfContent`): "SQL Cheat Sheet" in 10 numbered sections, each a short block of SQL lines.

## 2. Interactions (from bundle `ResourceDownloadDialog`; the gate was NOT submitted)
- Validates the email with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. On failure it shows a toast "Invalid Email". Pressing Enter in the input submits.
- Sends `POST https://wvdwisoaotkuyvcyybps.supabase.co/functions/v1/download-cheat-sheet` with header
  `Content-Type: application/json` and body `{"email": <email>, "cheatSheetName": "SQL Cheat Sheet", "userAgent": navigator.userAgent}`.
- Authorization header bug: the code builds `Bearer ${promise}`, so the header sent is the literal
  `Bearer [object Promise]`. This works only because the function is deployed with verify_jwt=false.
- On 2xx: it reads `response.blob()`, triggers a download named `SQL-Cheat-Sheet.pdf`, shows a toast "Success!" ("Your SQL Cheat
  Sheet is downloading now. Check your email for future updates!"), then resets and closes the dialog after 2 s.
  On error it shows a toast "Download Failed" ("Something went wrong. Please try again.").
- While the request runs, the button label is "Preparing Download..." with a pulsing icon.
- The function presumably logs to `public.cheat_sheet_downloads` (id, email, cheat_sheet_name, downloaded_at,
  ip_address, user_agent, created_at).
- The PDF itself is PUBLIC, with no gate needed: Supabase storage bucket `cheat-sheets` (public) holds
  `sql-cheat-sheet.pdf` (3,530 bytes, 2 pages, ReportLab, uploaded 2025-10-02). It was found with a read-only metadata query on
  `storage.objects` and downloaded with a plain GET to `public/resources/sql-cheat-sheet/sql-cheat-sheet.pdf`.

## 3. Counts
- 1 PDF, 2 pages, 10 sections (Basics, Filtering, Sorting, Aggregations, Joins, Subqueries, Set Operations, DDL, DML,
  Window Functions), 27 lines of SQL or keywords.

## 4. Doubts
- Not verified that the edge function returns this exact storage file: its source could not be read (the Supabase MCP
  get_edge_function call errored). The "2 Pages" claim in the dialog matches.
- The card shows "34.1k views", but `cheat_sheet_downloads` holds only 6 rows (2025-10-02 → 2026-06-03, aggregate count only;
  no emails were read). The view count is hard-coded.
- Names differ across surfaces: "SQL Essentials Cheat Sheet" (card), "SQL Resource" (dialog), "SQL Cheat Sheet" (PDF), "SQL Quick
  Start Guide" (cover art).
- "Check your email for future updates": no evidence that any email is sent.
- The PDF is very basic (generic `table`/`employees` examples, and some sections only list keywords). It may not justify a gate.
