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

## SUPERSEDED: "Data Pipeline Maturity Stack" (too close to Abhisek Sahu's post; use "Day 1 vs Day 90" in week-1.md)

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

Visual (stackle.io colours, see CLAUDE.md): `visuals/pipeline.gif` (animated, levels build bottom to top), `visuals/pipeline.png` (static), `visuals/pipeline.mp4`. Source: `visuals/pipeline-maturity-stack.html`. Add `?photo=<your headshot path>` to swap the "C" badge for your face, then re-render with `node gif.js`.

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

---

## AI for data engineers: the 7 layers · Mastery map · READY (visual done; schedule next week, not next to another levels post)

Upload `visuals/ai_layers.gif`. Fallback: `visuals/ai_layers.png`.

```
Learning AI as a data engineer feels overwhelming.
It's 7 layers, and you already work in the first one.

Every AI system you hear about, chatbots, RAG, agents, sits on top of data. Someone has to collect it, clean it, store it and keep it fresh.

This is how it stacks up:

→ Layer 1: Data foundations
SQL, Python, pipelines, data quality. You already do this.

→ Layer 2: Unstructured data
PDFs, docs and tickets, split into chunks with clean metadata.

→ Layer 3: Embeddings and vector search
Turn text into vectors and find similar things fast. pgvector is a good place to start.

→ Layer 4: RAG pipelines
Retrieve the right chunks, hand them to the model, keep the index fresh.

→ Layer 5: Evaluation
A test set and a score, so you know whether a change made answers better or worse.

→ Layer 6: LLMs inside pipelines
Use a model to extract, classify and enrich data at scale, and watch the cost.

→ Layer 7: Agents in production
Models that call tools, with guardrails and monitoring around them.

Most people try to learn AI from the top down.
Data engineers get to build it from the bottom up.

The model is the easy part. The data underneath it is the job.
```

---


How to use: read each post once (30 seconds), check the one line marked "Check", paste, post. Every claim is either a public fact (source given) or a fact you already gave me. Nothing about your life is made up.


---

# Batch: range samples (Oct 14). All facts from `source-facts.md`

## 1 · Data surprise: the missing job title · READY
Visual: three tiles: "Databricks · 895 open roles · 0 titled Data Engineer", "Snowflake · 358 · 0", "Uber · 643 · 0".

```
Databricks has 895 open jobs right now.
Not one of them is titled "Data Engineer." 👇

Snowflake: 358 open roles. Same story.
Uber: 643. Same story.

The work didn't disappear. The title did.

At Databricks, the job that builds their own pipelines is called "Senior Software Engineer (Data Platform)."
At Uber, it's "Software Engineer II, Data Infrastructure": pipelines that stay "correct under retries, reprocessing, and backfills."

That's data engineering. It just says software engineer on the door.

So if your job search is one search box with "data engineer" in it, you're missing roles built for you.

Search for the work instead:
→ data platform
→ data infrastructure
→ analytics engineer
→ Spark, Airflow, dbt, pipelines

Then read the responsibilities, not the title.

The best data engineering jobs don't always say data engineering.
```

## 2 · Money: Amazon L5 to L6 · READY
Visual: two stacked bars (L5 $231K, L6 $334K), each split into base and stock.

```
At Amazon, a data engineer's pay jumps $103K a year from L5 to L6.
Most of that jump isn't salary. 👇

Levels.fyi averages, US, October 2026:

L5: $231K a year
→ $161K base, $69K stock

L6: $334K a year
→ $191K base, $143K stock

Base goes up $30K. Stock goes up $74K.

That changes how you negotiate.

People fight hard for an extra $10K of base. The bigger lever is the level you're hired at, because the level decides the stock.

So before you talk numbers, ask which level the offer is at, and what it would take to be considered for the next one.

Negotiate the level first. The money follows it.
```

## 3 · Job post decode: Anthropic · READY
Visual: quote card with the 3 "how you work" lines highlighted, pay range on top.

```
Anthropic is hiring a data engineer at $320,000 to $405,000.
The skills list is shorter than you'd think. 👇

The role: Data Engineer, Product. San Francisco, New York or Seattle. Posted Oct 9.

What they ask for:
→ SQL and Python, for "accurate, clean data models"
→ dbt pipelines "that turn raw logs into canonical datasets"
→ Airflow and GitHub
→ dashboards that other teams actually use

No vector databases. No model training. No agent frameworks.

The lines that stand out are about how you work:
→ "a sense of when 'good enough' beats perfect"
→ "you take ownership of solving a problem fully, even when that means picking up work beyond your usual scope"
→ "Experience using AI to scale your own productivity and your team's without lowering the quality of the work"

An AI lab paying up to $405K is hiring for fundamentals, ownership and judgment.

If you're waiting to learn one more AI framework before you apply, read the job post first.
```

## 4 · Interview question teardown · READY
Visual: two cards: "Short answer" (grey) vs "Hire answer" (3 parts, blue).

```
"What happens if your pipeline runs twice?"
There's a short answer and a hire answer. 👇

The short answer:
"It's idempotent, so nothing happens."

That's a label, not an answer. The next question is: how?

The hire answer has three parts.

What could go wrong
→ a rerun inserts the same day again and revenue doubles

How you prevent it
→ overwrite that date's partition instead of appending, or MERGE on a unique key

How you know it worked
→ row counts and a duplicate check on the key after every run

Same question. One answer names a concept. The other shows you've cleaned up after a rerun before.

Interviewers aren't checking whether you know the word. They're checking whether you know the 2 AM version of it.
```

## 5 · Hot take: failure modes over tools · READY
Visual: text-only, or a simple "Break it on purpose" checklist card.

```
You don't need another data engineering tool.
You need to know how the ones you have break. 👇

Tools change. Failure modes don't.

Late data.
Duplicate rows after a retry.
A schema change upstream that nobody announced.
A join that quietly multiplies rows.
A job that's fine at 1 million rows and dies at 1 billion.

Every one of these shows up in Airflow, Dagster, dbt, Spark and Snowflake. Learn them once and they carry over to every tool you'll ever use.

So the next time you learn a tool, skip the hello-world. Break it on purpose:
→ run the job twice
→ send it data a day late
→ rename a column upstream
→ give it 100x the rows

What you learn from breaking it is what on-call and interviews actually ask about.

Tools get you the first job. Failure modes get you trusted with the second.
```

## 6 · Money: same title, three banks · READY
Visual: three numbers side by side with the $85K gap called out; source line at the bottom.

```
Same title. Same country. $85K apart.

Data engineer median pay on Levels.fyi (US, October 2026):

JPMorgan Chase: $145K
Capital One: $180K
Goldman Sachs: $230K

All three are banks. All three hire data engineers for similar work.

If you're interviewing in finance, don't benchmark an offer against the job you have. Benchmark it against the same title at two competitors.

It takes five minutes, and it's the most useful number you can bring to a negotiation.

The title tells you what you'll do. The company decides what it's worth.
```
