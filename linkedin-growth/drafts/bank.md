# Post bank (ready posts not yet scheduled)

## "If I had to prepare from scratch" · Inside the Interview / AI-career · READY

Modelled on a post Chris shared: Naresh Edagotti (48,254 followers), "If I had to prepare for AI Engineering interviews from scratch today…". It got 419 reactions on Sep 21, 2026, about 3.6x his recent posts (median ~115). The structure is borrowed; the facts are Chris's own (2019 loop, 2021 big tech job, 200+ interviews).

Visual: text-only, or one real photo of you.

Check: the four questions are written as the kind you ask on the hiring side. Make sure they sound like you.

Optional last line (course post): "This is the exact order we follow in the Stackle masterclass. Link in my Featured section."

```
If I had to prepare for a big tech data engineering interview from scratch, I'd do it very differently than I did in 2019. 👇

My first big tech loop that year didn't go as planned. I changed how I prepared and landed my first big tech job in 2021. Since then I've sat on the hiring side of 200+ data engineering interviews.

This is the prep plan I'd follow if I were starting today. Four steps, in this order.

Knowing data engineering and passing a data engineering interview are two different skills. The first is about tools. The second is about decisions.

The questions that decide the round sound like this:
"How would you backfill two years of data without breaking today's dashboards?"
"This job used to run in 20 minutes. Now it takes 3 hours. What do you check first?"
"How do you make this pipeline safe to run twice?"
"What breaks first when the data grows 10x?"

No course answers those for you. So:

1. Get SQL to boring
→ window functions, deduplication, joins on messy keys, timed, until syntax stops being the problem

2. Own one pipeline end to end
→ one project you can defend line by line, with the "because" ready for every choice

3. Model out loud
→ start with the questions the business needs answered, then the grain, then the tables

4. Prepare three real stories
→ something that broke and what you changed, a time you pushed back, and a workflow you changed with AI and how you checked its output

Courses teach you the tools. Interviews test your decisions.
```

---

## "Data Pipeline Maturity Stack" · Mastery map · READY (visual done)

The style Chris pointed to with his examples:
- Abhisek Sahu, "SQL is easy to start. Mastering it is a different story.": 1,435 reactions on 179k followers.
- Aiswarya Venkitesh's Databricks roadmap: 616 on 77k.
- Jean Lee's Python mind map: 377 on 69k.

Each of those did far better than the author's other recent posts. What they share:
- A two-line contrast hook.
- Levels or steps, one line each.
- A big designed visual (animated GIF) that *is* the content.
- A reframe at the end.
- No credentials, no personal story.

Visual: `visuals/pipeline.gif` (animated, levels build bottom to top), `visuals/pipeline.png` (static), `visuals/pipeline.mp4`. Source: `visuals/pipeline-maturity-stack.html`. Add `?photo=<your headshot path>` to swap the "C" badge for your face, then re-render with `node gif.js`.

```
Anyone can build a data pipeline.
Building one that survives production is a different story.

A script on your laptop moves data once. A production pipeline keeps moving it correctly when the source is late, the job fails at 2 AM, and someone needs last year reprocessed.

This is how pipeline skills actually progress:

→ Level 1: Scripts
Pull data from an API or file, transform it in Python or SQL, load it into a table.

→ Level 2: Scheduling
Run it every day with Airflow or cron, and know when it didn't run.

→ Level 3: Idempotency
Rerun any day safely, without creating duplicates.

→ Level 4: Incremental loads
Process only what changed, with watermarks and MERGE.

→ Level 5: Data quality
Check row counts, nulls, duplicates and freshness before anyone sees the data.

→ Level 6: Backfills and late data
Reprocess two years of history without breaking today's dashboards.

→ Level 7: Observability and SLAs
Lineage, alerts, and a promised time the data is ready.

Most tutorials stop at Level 2.
Most interviews start at Level 3.

Which level are you at right now?
```
