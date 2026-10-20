# linkedin-bible: extraction notes

Source: lazy chunk `https://stackle.io/assets/LinkedInBiblePage-CM4G-HWq.js` (data array evaluated as-is), checked
against the rendered page. Thumbnail: `/resources/_thumbs/linkedin-bible.jpg`. The page itself has no images.

## 1. Structure
- Hero (compact): eyebrow badge "Stackle Career Resources" (the original had a book emoji), H1 "The LinkedIn Bible", subtitle.
- Tab bar with 7 chapter tabs. The tab label is the short `tabLabel` (Profile, DMs, Job Seeking, Employer Sourcing,
  Networking, Comments, Sales Navigator). The original also showed a decorative emoji per tab, which has been dropped. Chapter 01 is open by default.
- Each chapter: "Chapter NN" eyebrow, H2 `title`, `subtitle`, then `intro` as a blockquote, then numbered sections.
- Each section renders in this fixed order: `title` (H3, with its number), `body`, `subsections` (small uppercase H4 plus bullet list),
  a "Tips" box (arrow bullets), `table`, `templates` (dark boxes with a label and a Copy button).
- `bodyStyle`: "paragraph" when the body has 1 item (no bullet). When it has 2 or more items, the original rendered every item as a bullet,
  including lead-in sentences like "Three questions your DM must answer:" and "Before hitting send, ask:".
- Example lists marked with cross/check emojis became `{kind: "bad"|"good", label, text}` (Profile §3, Comments §2).
- Subsection pairs that read as do/avoid lists ("What makes a great LinkedIn photo"/"What to avoid", "Do"/"Don't")
  carry no marker in the source. Only their titles say so.
- The "Common Mistakes to Avoid" section in chapter 01 has no number (`number: null`).

## 2. Interactions
- Tabs (Radix Tabs): client-side switch. The tab state is not in the URL.
- Template Copy button: `navigator.clipboard.writeText(text)`. The label shows "Copied" for 2 s.
- Hero has framer-motion fade/slide-in on load. There are no API calls, gates or downloads.

## 3. Counts
- 7 chapters with 11/7/8/8/9/8/10 sections (61 in all), 31 subsections, 76 tips, 13 tables, 14 copyable templates,
  6 good/bad example items. Nothing is missing. Every chapter's content is hard-coded in the chunk.

## 4. Doubts
- No page-specific SEO on the old site: the document title and meta are the site-wide defaults
  ("Stackle - Connect with Expert Instructors & Learn New Skills"). `seo` was filled from the H1 and subtitle.
- Library category is "Interview Prep" and the badge is "NEW", although the content is general LinkedIn and career advice.
- Unsourced statistics: "LinkedIn says profiles with photos get 21x more views"; "posts with salary get 40% more
  applicants"; "Up to 70% of jobs are never publicly posted"; "Referrals increase ... by 3–4x"; "~30% lower
  acceptance rate"; DM/InMail open rates "~20–35%" / "~15–25%"; "screening questions ... filter 80% of applicants";
  "warm intros are 5–10x higher"; "Tuesday–Thursday perform best".
- Possibly outdated: Sales Navigator prices (~$99/mo Core, ~$149/mo Advanced, 50 InMails/month); "Creator mode ON"
  in the checklist (LinkedIn retired Creator Mode in 2024); "Post up to 1 job for free at a time".
- Some "Tips" boxes hold lists that are not really tips (Featured §8 = things to feature; Networking §6 = coffee-chat
  questions; Networking §8 = triggers). This matches the source and has been kept as is.
