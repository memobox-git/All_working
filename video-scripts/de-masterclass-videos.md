# Stackle Data Engineering Masterclass: 13 video scripts

Brief: course page videos (hero + curriculum), also cut for YouTube and marketing clips. Each video runs 60 to 90 seconds, which at Chris's 150 words a minute means 150 to 225 spoken words.

How to read this file:
- Each spoken paragraph is a blockquote (`>`). The label above it says how it is filmed.
- **[pause]** marks a one-second pause where a graphic starts or ends.
- On-screen text in a graphic uses the exact words of the script unless it says "label".
- Visuals: Plus Jakarta Sans, amber #F59E0B on charcoal #1E1C1D (or amber #BA7517 on cream #FAF8F1).
- `[date]` is the cohort start date. Fill it in before filming.

---

## Research brief

### How the research was done
This session runs in a cloud container, and Chris's Chrome (Claude in Chrome) is not reachable from it. Following section 2 of the rules, the fallback was web search. **YouTube transcripts, view counts and upload dates could not be read**, so the creator table below lists who leads each topic, not verified view numbers. Before filming, open the videos below in Chrome, sort by views, and check the hooks against ours.

### Creators and videos flagged

| Creator / channel | Video or focus | Link | Views / date / length |
|---|---|---|---|
| Codebasics | "Data Engineer Roadmap 2026, How I'd learn Data Engineering in 2026" | youtube.com/@codebasics | One third-party tracker shows about 48K views; not verified on YouTube |
| Clever Studies | "[2026] Data Engineering RoadMap" | youtube.com (uploaded 5 Jan 2026) | Not available |
| Data with Zach (Zach Wilson) | Long-form data engineering lessons, AI and SQL commentary | youtube.com/@EcZachly_ | Not available |
| Seattle Data Guy | Practitioner takes on Airflow, Spark, SQL, architecture | youtube.com/@SeattleDataGuy | Not available |
| Darshil Parmar | Project-based AWS and GCP pipelines | youtube.com/@DarshilParmar | Not available |
| Data with Baraa | SQL and data warehouse projects | youtube.com/@DataWithBaraa | Not available |

### What all of them cover (our scripts cover this too)
- Start with SQL and Python, then data modeling, one cloud, orchestration and version control.
- Prove skills with two to four real projects.
- The four roles (analyst, scientist, data engineer, AI engineer) answer different questions and use different tools.

### Where they are wrong, out of date, or disagree
- Job-post studies disagree a lot. SQL and Python show up in 69% to 94% of posts depending on the study and how keywords are matched. Our scripts use one study only (InterviewStack) and name it every time.
- Many roadmaps still treat AI as one extra tool at the end. The 2026 dbt Labs survey shows teams already use AI to write code; the gap is checking it. That gap is our angle.
- Older role-comparison videos describe the AI engineer as a "machine learning engineer who trains models". In 2026 most AI engineer work builds products on top of existing large language models.

### Gaps and our angle
- **Gap:** creators teach the tool, then mention AI. Nobody shows, week by week, where AI writes the draft and where the engineer has to judge it.
- **Our angle:** "AI writes the first draft. You learn the judgment that gets you hired." Every week video has a "how AI is used" paragraph that names the one judgment the engineer makes.
- **Chris's edge:** two hundred plus interviews from the hiring side, used once per video in the intro, and in the hiring-prep video.

### Sources for every number
| Number | Source | Status |
|---|---|---|
| 72% prioritize AI-assisted coding | dbt Labs, *State of Analytics Engineering 2026*, released 14 April 2026, https://www.getdbt.com/resources/state-of-analytics-engineering-2026 | Verified |
| 71% worry about hallucinated or incorrect data reaching stakeholders | Same report and dbt Labs press release, https://www.getdbt.com/blog/new-dbt-labs-report-finds-ai-driven-acceleration-is-outpacing-trust-and-governance | Verified |
| Trust as a priority rose from 66% to 83% | Same report | Verified |
| Pipelines 74%, SQL 71%, Python 71%, AWS 44%, data quality 43%, data modeling 38% (6,877 postings, May 2026) | InterviewStack | **Not found by web search. Chris, please send the link so it can go in the descriptions.** |
| Snowflake can query Iceberg tables cataloged in AWS Glue | Snowflake docs, https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-aws-glue | Verified (supports the week 5 project) |

Note on wording: the dbt Labs respondents are data practitioners and leaders, so the scripts say "data professionals", not "companies".

---

## Video 1. Hero: the whole masterclass in 90 seconds

**Words:** 225 spoken. **Time:** about 90 seconds.
Plays muted on hover: burn in captions for every line.

**Opening text card, full screen, 0:00 to 0:03, no voice:**
"AI writes the first draft. You learn the judgment that gets you hired."
**[pause]**

**On camera**
> AI can now write the first draft of a data pipeline, but a company still needs a person who can tell when that draft is wrong. In this video I am going to show you the whole Stackle Data Engineering Masterclass in ninety seconds.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** two big numbers, 72% and 71%, with the dbt Labs 2026 source line.
> In a 2026 survey by dbt Labs, seventy-two percent of data professionals made AI-assisted coding a priority. Seventy-one percent worried that wrong data would reach the people who use it.
**[pause]**

**[pause] Graphic 2, full screen:** a ten-week timeline with "Recorded basics" before each week and "Live: Monday + Wednesday".
> The masterclass runs for ten weeks. Before each week, you watch short recorded lessons on the basics. Then we meet live every Monday and Wednesday to build.
**[pause]**

**[pause] Graphic 3, full screen:** one pipeline that grows week by week: SQL, Python, dbt + Snowflake, data quality, AWS, Spark, Kafka, Airflow.
> Each week adds one piece to the same pipeline, from SQL and Python to dbt, AWS, Spark, Kafka and Airflow. An AI assistant helps in every build, and you learn to check its work.
**[pause]**

**[pause] Graphic 4, full screen:** "Weeks 9–10: Capstone on your own dataset + AI agent → Demo Day → Hiring prep".
> In weeks nine and ten, you build a capstone project on your own dataset with an AI agent. Then you present your project at Demo Day and prepare for interviews.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> The next cohort starts on [date], and the price is one thousand four hundred ninety-nine dollars. Book a free fifteen-minute call at stackle.io to see if it fits you.

**Graphics**
1. 72% and 71%, dbt Labs State of Analytics Engineering 2026.
2. Ten-week timeline, recorded basics plus live Monday and Wednesday.
3. One pipeline growing through the eight tool weeks.
4. Capstone, Demo Day, hiring prep.

---

## Video 2. Who is a data engineer in the AI era

**Words:** 225 spoken. **Time:** about 90 seconds.

**On camera**
> Seventy-four percent of data engineering job posts from May 2026 asked for people who can build pipelines. In this video I am going to explain what a data engineer does now that AI writes code, and what to be ready for.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** a card payment flowing into a bank report, labelled "pipeline".
> A data engineer builds pipelines, the steps that move data from where it is created to where people use it. For example, when you pay with a card, a pipeline carries that payment into the bank's reports.
**[pause]**

**[pause] Graphic 2, full screen:** "AI-assisted coding: 72%", dbt Labs 2026.
> AI assistants now write the first draft of SQL and Python in seconds. In a 2026 dbt Labs survey, seventy-two percent of data professionals made AI-assisted coding a priority.
**[pause]**

**Card beside you:** SQL 71% · Python 71% · AWS 44%
> The core skills have not gone away. SQL and Python each still appear in seventy-one percent of job posts, and AWS appears in forty-four.

**On camera**
> In interviews, I now ask engineers to find the mistake in code. Be ready to explain why your pipeline is right.

**On camera**
> This week, ask an AI assistant to write one SQL query and find one thing you would change. To plan your own path, book a free fifteen-minute call at stackle.io. Tell me in the comments which skill you trust AI with least.

**Graphics**
1. Card payment to bank report, labelled "pipeline".
2. dbt Labs 2026: 72% AI-assisted coding.
Card: InterviewStack, SQL 71%, Python 71%, AWS 44%.

---

## Video 3. Data engineer vs AI engineer vs data scientist vs data analyst (course-neutral)

**Words:** 225 spoken. **Time:** about 90 seconds.
Course-neutral: no week numbers, no price, CTA points to all Stackle masterclasses.

**On camera**
> A data analyst, a data scientist, a data engineer and an AI engineer can use the same data, but each role answers a different question. In this video I am going to show you what each role does.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** four columns, one per role, filling in as each is named. Column 1: "Data analyst: What happened?"
> A data analyst explains what already happened, such as last month's best-selling products. The main tools are SQL and dashboards.

**Graphic 1 continues.** Column 2: "Data scientist: What will happen?"
> A data scientist predicts what may happen next, such as which customers may cancel. The main tools are Python and statistics.

**Graphic 1 continues.** Column 3: "Data engineer: Is the data there and correct?"
> A data engineer builds pipelines that bring clean data to everyone else, such as loading each day's sales into one table. The main tools are SQL, Python and the cloud.

**Graphic 1 continues.** Column 4: "AI engineer: Can we build a product on a model?"
> An AI engineer builds products on large language models, the systems behind ChatGPT, Claude and Gemini. One example is a support chatbot that reads company documents before it answers.
**[pause]**

**On camera**
> If you like explaining numbers, start with analysis. If you like building systems, look at data or AI engineering.

**On camera**
> This week, read five job posts for your role and note the top three tools. Then book a free fifteen-minute call at stackle.io to plan your next phase. Tell me in the comments which role you want.

**Graphics**
1. Four-column role table, one question and one example per role, filling in as each role is named.

---

## Video 4. Week 1: SQL

**Words:** 224 spoken. **Time:** about 90 seconds.

**On camera**
> An AI assistant can write a SQL query in seconds, and the query can still return the wrong answer. In this video I am going to show you what you learn and build in week one of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Recorded basics: SQL + Snowflake".
> Before class, you watch recorded lessons on SQL, the language people use to ask questions of a database. You also learn Snowflake, a cloud data warehouse that stores data and runs SQL on it.
**[pause]**

**[pause] Graphic 2, full screen:** a long query split into three named CTE blocks, then a table showing each day's sales next to the day before.
> On Monday and Wednesday, we build live. You learn CTEs, or common table expressions, which break a long query into small named steps. You learn window functions, which compare each row with nearby rows, such as today's sales against yesterday's.
**[pause]**

**Card beside you:** "Check the joins · Check the filters · Check the totals"
> The AI assistant writes a first draft of each query, and your job is to review it. You check the joins, the filters and the totals against numbers you already trust.

**[pause] Graphic 3, full screen:** "Ship: 10 business questions, answered and checked".
> By the end of week one, you ship checked answers to ten business questions. These SQL queries become the first part of your course pipeline.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to Python and Git. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Recorded basics: SQL + Snowflake.
2. CTE blocks and a window function result.
3. Ship: 10 business questions, answered and checked.
Card: check the joins, filters, totals.

---

## Video 5. Week 2: Python

**Words:** 223 spoken. **Time:** about 89 seconds.

**On camera**
> AI can write a Python pipeline in a minute, but a pipeline without tests can break and nobody will notice. In this video I am going to show you what you learn and build in week two of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Recorded basics: Python + Git".
> Before class, you watch recorded lessons on Python, the main language data engineers use to move data. You also learn Git, which saves every version of your code.
**[pause]**

**[pause] Graphic 2, full screen:** API → Python → Snowflake, with a row of green test ticks above the arrow.
> In the live sessions, you build a pipeline that pulls data from an API and loads it into Snowflake. An API lets one program ask another for data, like a weather app getting the forecast. You write tests first, small checks such as "every row has a date".
**[pause]**

**Card beside you:** "Tests first → AI drafts → Pull request → Review"
> The AI assistant drafts the code until your tests pass. You open a pull request, which asks to add your change to the shared code, and review the AI's work there.

**[pause] Graphic 3, full screen:** "Ship: a tested pipeline".
> By the end of week two, you ship a tested pipeline that loads fresh data into your week one tables.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to data modeling and dbt. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Recorded basics: Python + Git.
2. API → Python → Snowflake with tests.
3. Ship: a tested pipeline.
Card: tests first, AI drafts, pull request, review.

---

## Video 6. Week 3: Data modeling + dbt on Snowflake

**Words:** 223 spoken. **Time:** about 89 seconds.

**On camera**
> Two reports can read the same data and still show different totals, because nobody decided what one row means. In this video I am going to show you what you learn and build in week three of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Recorded basics: data modeling + dbt".
> Before class, you watch recorded lessons on data modeling, how you design tables so numbers are easy to trust. You also learn dbt, a tool that turns SQL files into tested tables in Snowflake.
**[pause]**

**[pause] Graphic 2, full screen:** three panels: "Grain: one row = one order", "History: old city kept when a customer moves", "Lineage: map of which table feeds which".
> In the live sessions, you decide the grain, which is what one row stands for, such as one order. You keep history, so an old value stays when a customer moves city. You add dbt tests and read the lineage, a map of which table feeds which.
**[pause]**

**Card beside you:** "You choose the grain. AI drafts the model. You check it."
> The AI assistant drafts the dbt models, and you check that it kept the grain you chose.

**[pause] Graphic 3, full screen:** Bronze (raw) → Silver (cleaned) → Gold (ready for reports), plus a design doc icon.
> By the end of week three, you ship bronze, silver and gold models, which hold raw, cleaned and report-ready data. You also write a design doc that explains your choices.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to data quality and testing. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Recorded basics: data modeling + dbt.
2. Grain, history, lineage panels.
3. Bronze → silver → gold, plus design doc.
Card: grain first, AI drafts, you check.

---

## Video 7. Week 4: Data quality, testing, CI/CD

**Words:** 223 spoken. **Time:** about 89 seconds.

**On camera**
> In a 2026 survey by dbt Labs, seventy-one percent of data professionals said they worry that wrong data will reach the people who use it. In this video I am going to show you what you learn and build in week four of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Recorded basics: data testing + CI/CD".
> Before class, you watch recorded lessons on data testing and on CI/CD, or continuous integration and continuous delivery, which tests every code change automatically before it goes live.
**[pause]**

**[pause] Graphic 2, full screen:** a contract card (column, type, can be empty?) and a GitHub Actions run with a red X on bad data.
> In the live sessions, you write tests and data contracts. A data contract is a written agreement about the shape of the data, such as which columns must exist. You set up GitHub Actions, which runs your tests on every code change. Then we break the pipeline on purpose, and your checks catch it.
**[pause]**

**Card beside you:** "AI suggests tests. You decide which failures matter."
> The AI assistant suggests tests for each table. You decide which failures matter, and you add the tests it missed.

**[pause] Graphic 3, full screen:** bad rows stopped at a gate before the gold tables.
> By the end of week four, you ship a pipeline that blocks bad data before it reaches the gold tables.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to the cloud with AWS. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Recorded basics: data testing + CI/CD.
2. Data contract card and a failing GitHub Actions run.
3. Bad data stopped before the gold tables.
Card: AI suggests tests, you decide.

---

## Video 8. Week 5: Cloud + lakehouse on AWS

**Words:** 221 spoken. **Time:** about 88 seconds.

**On camera**
> Forty-four percent of data engineering job posts ask for AWS, and a cloud bill can grow fast when nobody watches it. In this video I am going to show you what you learn and build in week five of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** three icons: "S3: storage", "IAM: who can open what", "Compute: machines that run code".
> Before class, you watch recorded lessons on three AWS basics. S3 is Amazon's storage for files. IAM decides who can open what. Compute is the machines that run your code.
**[pause]**

**[pause] Graphic 2, full screen:** a row-based file and a column-based Parquet file side by side, then Parquet files wrapped in an "Iceberg table" box.
> In the live sessions, you learn how the cloud bill works and how to keep it small. You learn Parquet, a file format that stores data by column, so a query reads only the columns it needs. Then you learn Apache Iceberg, a table format that turns a folder of Parquet files into a table with history.
**[pause]**

**Card beside you:** "AI drafts the permissions. You check they are not too wide."
> The AI assistant drafts your IAM permissions. You check that they give access only to what the pipeline needs.

**[pause] Graphic 3, full screen:** S3 + Iceberg table → Snowflake query result.
> By the end of week five, you ship an Iceberg table stored on S3 that you query from Snowflake.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to Spark and Databricks. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. S3, IAM, compute.
2. Row file vs Parquet, then Parquet wrapped as an Iceberg table.
3. Iceberg table on S3 queried from Snowflake.
Card: AI drafts permissions, you check.

---

## Video 9. Week 6: Spark + Databricks

**Words:** 211 spoken. **Time:** about 84 seconds.

**On camera**
> A slow data job costs money every time it runs, and the fix can start with one screen called the query plan. In this video I am going to show you what you learn and build in week six of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** one large dataset split across many machines.
> Before class, you watch recorded lessons on Apache Spark, a tool that splits large data work across many machines. You also learn Databricks, a cloud platform that runs Spark for you.
**[pause]**

**[pause] Graphic 2, full screen:** a query plan with one step highlighted, then the same plan with the filter moved earlier.
> In the live sessions, you build a pipeline in PySpark, which is Spark written in Python. You read the query plan, which lists the steps Spark will take. Then you make the job faster, for example by filtering data early so less of it moves between machines.
**[pause]**

**Card beside you:** "AI suggests the speedup. You measure it."
> The AI assistant suggests ways to speed up the job. You measure each suggestion before you keep it.

**[pause] Graphic 3, full screen:** "Before: X minutes · After: Y minutes" (label; Chris fills in real numbers from the class build).
> By the end of week six, you ship a PySpark pipeline with real before and after numbers.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to streaming data with Kafka. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Dataset split across many machines.
2. Query plan, before and after moving the filter.
3. Before and after timings (label, real numbers needed).
Card: AI suggests, you measure.

---

## Video 10. Week 7: Kafka

**Words:** 218 spoken. **Time:** about 87 seconds.

**On camera**
> Data from a phone app can arrive late, out of order, or twice, and a streaming pipeline has to handle all three. In this video I am going to show you what you learn and build in week seven of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** a ride app sending location messages every few seconds into Kafka.
> Before class, you watch recorded lessons on Apache Kafka, a system that carries a constant stream of messages between programs. For example, a ride app can send each driver's location every few seconds.
**[pause]**

**[pause] Graphic 2, full screen:** a timeline with one message landing after its window closed, and one message arriving twice but counted once.
> In the live sessions, you build a streaming project. You learn to handle late messages, which arrive after the time they belong to has passed. You also learn to handle duplicate messages, so an event sent twice is counted once.
**[pause]**

**Card beside you:** "AI writes the consumer. You test it with late and duplicate messages."
> The AI assistant writes the code that reads the stream. You test that code with late and duplicate messages that the draft did not plan for.

**[pause] Graphic 3, full screen:** messages flowing into a table that updates live.
> By the end of week seven, you ship a live stream that lands in a table.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you move on to Airflow and run the whole project on a schedule. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Ride app messages into Kafka.
2. Late message and duplicate message on a timeline.
3. Live stream into a table.
Card: AI writes the consumer, you test it.

---

## Video 11. Week 8: Airflow

**Words:** 205 spoken. **Time:** about 82 seconds.

**On camera**
> A real pipeline runs every night while the team is asleep, so it has to recover from failures on its own. In this video I am going to show you what you learn and build in week eight of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** tasks in boxes connected in order, with a clock.
> Before class, you watch recorded lessons on Apache Airflow, a tool that runs tasks in the right order on a schedule.
**[pause]**

**[pause] Graphic 2, full screen:** the weeks 1–7 pieces as Airflow tasks; one task fails, retries, and turns green; a calendar fills in past days for a backfill; a phone shows an alert.
> In the live sessions, you use Airflow to run everything you built so far. You add retries, which run a failed task again on their own. You learn backfills, which rerun past days, such as rebuilding last month after a bug fix. You also set alerts that tell you when something fails.
**[pause]**

**Card beside you:** "AI drafts the workflow. You set the retries and alerts."
> The AI assistant drafts the workflow file. You decide how many retries each task gets and who gets the alert.

**[pause] Graphic 3, full screen:** "Ship: the whole project running on a schedule".
> By the end of week eight, you ship your whole project running on a schedule.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you start your capstone on your own dataset. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Tasks in order with a clock.
2. The full project as Airflow tasks, with retry, backfill and alert.
3. Ship: the whole project on a schedule.
Card: AI drafts the workflow, you set retries and alerts.

---

## Video 12. Week 9: Capstone 1

**Words:** 222 spoken. **Time:** about 89 seconds.

**On camera**
> For eight weeks, you build a pipeline on data we give you, and in week nine, you build one on data you choose. In this video I am going to show you how the capstone project starts in the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Recorded basics: the capstone brief + Data for AI".
> Before class, you watch the capstone brief, which explains what your project must include. You also learn data for AI, which is how to prepare clean, well-described data that an AI model can use safely.
**[pause]**

**[pause] Graphic 2, full screen:** three panels: "Design review", "Build clinic", "Agent layer".
> In the live sessions, you present your plan in a design review and get feedback before you build. In the build clinic, you bring what is stuck and we fix it together. Then you add an agent layer, which is an AI agent that answers questions using your tables.
**[pause]**

**Card beside you:** "The agent answers. You check it against your gold tables."
> The AI agent is part of your product this week. You test its answers against your gold tables to catch when it is wrong.

**[pause] Graphic 3, full screen:** "Ship: a pipeline on your own dataset".
> By the end of week nine, you ship a working pipeline on your own dataset.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> Next week, you present your project at Demo Day and prepare for interviews. Book a free fifteen-minute call at stackle.io to join the next cohort.

**Graphics**
1. Capstone brief + data for AI.
2. Design review, build clinic, agent layer.
3. Ship: a pipeline on your own dataset.
Card: the agent answers, you check it.

---

## Video 13. Week 10: Capstone 2, Demo Day and hiring prep

**Words:** 199 spoken. **Time:** about 80 seconds.

**On camera**
> A finished project helps you get hired only when you can show it and explain it in an interview. In this video I am going to show you the last week of the Stackle Data Engineering Masterclass.

**On camera**
> If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers from the hiring side.

**[pause] Graphic 1, full screen:** "Monday: Demo Day", a screen with a student's pipeline and an audience.
> On Monday, you present your capstone at Demo Day. You show the pipeline running, explain one design choice, and answer questions about it.
**[pause]**

**[pause] Graphic 2, full screen:** "Wednesday: hiring prep", a resume, a project link and an interview question card.
> On Wednesday, we prepare you for hiring. You turn your project into a short interview story: the problem, what you built, what broke, and how you fixed it. I share what I listen for after more than two hundred interviews.
**[pause]**

**Card beside you:** "AI asks the practice questions. You learn which answers pass."
> The AI assistant runs practice interview questions with you. I tell you which answers would pass a real interview and which ones need work.

**[pause] Graphic 3, full screen:** three items: "Public project · Recorded demo · Interview story".
> By the end of week ten, you ship a public project, a recorded demo, and an interview story you can tell with confidence.
**[pause]**

**On camera, end card:** stackle.io + "Book a call" + "Next cohort: [date]"
> The next cohort starts on [date]. Book a free fifteen-minute call at stackle.io, and we will plan your ten weeks together.

**Graphics**
1. Monday: Demo Day.
2. Wednesday: hiring prep.
3. Public project, recorded demo, interview story.
Card: AI asks practice questions, you learn which answers pass.

---

## YouTube titles and descriptions

Every description follows the same pattern: hook + promise, chapters (times to fill after the edit), links, sources, then the exact links line. Chapters for the week videos are the same, so they are written once here:

```
0:00 Hook
0:00 Who I am
0:00 Recorded basics
0:00 Live build
0:00 How AI is used
0:00 What you ship
0:00 Next week
```

Links block (item 3) for every video:

```
Free 15-minute call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks
```

Last line for every video, exactly:

```
Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
```

| # | Title (under 70 characters) | Description opening (hook + promise) | Chapters | Sources |
|---|---|---|---|---|
| 1 | Data Engineering Masterclass in 90 Seconds: AI + Judgment | AI can write the first draft of a data pipeline, but a company still needs someone who can tell when it is wrong. This video shows the whole 10-week Stackle Data Engineering Masterclass in 90 seconds. | 0:00 Hook · Who I am · Why AI changes the job · How the 10 weeks work · The pipeline you build · Capstone and Demo Day · Book a call | dbt Labs, State of Analytics Engineering 2026 |
| 2 | Data Engineer in the AI Era: What the Job Is in 2026 | 74% of data engineering job posts ask for pipeline skills. This video explains what a data engineer does now that AI writes code, and what to be ready for. | 0:00 Hook · Who I am · What a data engineer does · What AI changed · Skills job posts ask for · What interviews test now · Your turn | dbt Labs 2026; InterviewStack, 6,877 postings, May 2026 (link needed) |
| 3 | Data Engineer vs AI Engineer vs Data Scientist vs Data Analyst | Four data roles can work with the same data and answer different questions. This video shows what each role does, with one example each, so you can pick yours. | 0:00 Hook · Who I am · Data analyst · Data scientist · Data engineer · AI engineer · How to choose and your turn | None needed |
| 4 | SQL for Data Engineers: CTEs, Window Functions and AI Review | An AI assistant can write SQL in seconds, and the query can still be wrong. This is week 1 of the Stackle Data Engineering Masterclass. | Week chapters | — |
| 5 | Python Data Pipeline: API to Snowflake With Tests and Git | AI can write a Python pipeline in a minute, but without tests it can break silently. This is week 2 of the masterclass. | Week chapters | — |
| 6 | Data Modeling and dbt on Snowflake: Bronze, Silver, Gold | Two reports can read the same data and show different totals. This is week 3: grain, history, dbt tests and lineage. | Week chapters | — |
| 7 | Data Quality Testing and CI/CD for Data Pipelines | 71% of data professionals worry wrong data will reach the people who use it. This is week 4: tests, contracts and GitHub Actions. | Week chapters | dbt Labs 2026 |
| 8 | AWS Lakehouse for Data Engineers: S3, Parquet and Iceberg | 44% of data engineering job posts ask for AWS. This is week 5: S3, IAM, cost, Parquet and Iceberg queried from Snowflake. | Week chapters | InterviewStack (link needed); Snowflake docs, Iceberg + AWS Glue |
| 9 | Spark and Databricks: Read the Query Plan, Make It Faster | A slow data job costs money every run. This is week 6: PySpark, query plans and before/after numbers. | Week chapters | — |
| 10 | Kafka Streaming for Data Engineers: Late and Duplicate Data | Streaming data arrives late, out of order, or twice. This is week 7: a live Kafka stream into a table. | Week chapters | — |
| 11 | Airflow for Data Engineers: Retries, Backfills and Alerts | A real pipeline runs at night with nobody watching. This is week 8: Airflow retries, backfills and alerts. | Week chapters | — |
| 12 | Data Engineering Capstone Project With an AI Agent | For eight weeks you build on our data; in week 9 you build on yours. This is the capstone: design review, build clinic and an AI agent layer. | Week chapters | — |
| 13 | Data Engineering Demo Day and Interview Prep | A project gets you hired only when you can show it and explain it. This is week 10: Demo Day and hiring prep. | 0:00 Hook · Who I am · Demo Day · Hiring prep · How AI is used · What you ship · Book a call | — |

---

## Things Chris needs to check

**Added facts, examples and names that were not in the brief**
- Recorded basics for weeks 3, 4, 6, 7, 8 (the brief gave no basics for these): data modeling + dbt; data testing + CI/CD; Spark + Databricks; Kafka; Airflow.
- Examples: card payment to bank report (video 2); products sold, customers who may cancel, support chatbot (video 3); weather app API (video 5); customer moving city (video 6); ride app locations (video 10); rebuilding last month after a bug fix (video 11).
- "How AI is used" lines for every week, including the IAM permissions check (week 5), measuring each speedup (week 6), testing the agent against gold tables (week 9) and AI-run practice interview questions (week 10). Confirm each matches how the class actually runs.
- Video 2: "In interviews, I now ask engineers to find the mistake in a piece of code." This is written in your voice. Confirm it is true for you, or change it.
- Video 9 graphic 3 needs real before and after timings from the class build.

**Numbers I could not verify**
- All InterviewStack percentages (videos 2 and 8). Web search did not find the study. Send the link and I will add it to the sources. If it cannot be linked, the nearest checkable figure is a 943-post Glassdoor study with Python at 70% and SQL at 69%.

**Questions**
- Intro length: every video carries the three-sentence intro (about 25 words, 10 seconds). On the course page, where a viewer watches several videos in a row, you may want it only in videos 1 to 3. Should the week videos drop it?
- Interviews sentence in tool videos (weeks 1 to 8): rule 4 says to ask. It is kept in because the course sells hiring judgment. Keep or cut?
- The hero video says the price aloud. Keep the price in the voice, or show it only on screen?
- Comment questions are in videos 2 and 3 only. Add one to the week videos for their YouTube cuts?
