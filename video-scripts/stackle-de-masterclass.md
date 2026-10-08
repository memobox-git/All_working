# Stackle Data Engineering Masterclass: video scripts

Target length is 60–90 s per video. Word counts cover voiceover (VO) only, timed at about 150 words a minute.
Every video ends on the same end card: **stackle.io** and a **Book a call** button.
`[date]` is the cohort start date. Fill it in before recording.

Week videos follow this order: Hook → Intro → Recorded basics → Live build → How AI is used → What you ship → Next week.

---

## 1. Hero: the whole masterclass in 90 seconds

**Use:** course page hero (plays muted on hover), YouTube, ad cuts. **Captions burned in.**
**VO length:** about 85 s

| Time | On screen | VO |
|---|---|---|
| 0:00–0:03 | Full-screen text, no VO: **AI writes the first draft.** | *(silent)* |
| 0:03–0:06 | Text: **You learn the judgment that gets you hired.** | "You learn the judgment that gets you hired." |
| 0:06–0:15 | AI assistant writing SQL fast. Then a reviewer's red underline on one line. | "AI can write SQL, Python and pipeline code in seconds. Hiring teams still need someone who can tell when it's wrong." |
| 0:15–0:25 | Title card: Stackle Data Engineering Masterclass · 10 weeks | "That's what the Stackle Data Engineering Masterclass teaches. Ten weeks. You watch recorded basics before class, then build live every Monday and Wednesday." |
| 0:25–0:45 | One pipeline diagram filling in, a block per week: SQL → Python → dbt + Snowflake → Data quality + CI/CD → AWS + Iceberg → Spark + Databricks → Kafka → Airflow | "Every week you ship a project, and each one plugs into the last: SQL, Python, dbt on Snowflake, data quality and CI/CD, AWS and Iceberg, Spark on Databricks, Kafka, and Airflow. By week eight, it's one working pipeline." |
| 0:45–0:52 | Split screen: AI suggestion on the left, student's edit on the right | "An AI assistant sits in every build, and you learn to review what it gives you." |
| 0:52–1:03 | Student dataset → agent layer → Demo Day stage | "In weeks nine and ten, you build a capstone on your own dataset with an AI agent, present it at Demo Day, and prep for interviews." |
| 1:03–1:15 | Chris on camera. Lower third: **Chris · Data engineer, 10+ years · 200+ senior technical interviews** | "I'm Chris. I've been a data engineer for over ten years, and I've run more than two hundred senior technical interviews from the hiring side." |
| 1:15–1:28 | Text: **10 weeks · $1,499 · Starts [date]**, then end card | "Next cohort starts [date]. Ten weeks, fourteen ninety-nine. Book a call at stackle.io." |

**Clip pull:** 0:00–0:15 as a standalone "AI writes the first draft" teaser.

---

## 2. Who is a data engineer in the AI era?

**VO length:** about 85 s

| Time | On screen | VO |
|---|---|---|
| 0:00–0:05 | Text: **AI writes pipelines now. So what does a data engineer do?** | "AI can draft a pipeline in a minute. So what's left for a data engineer? The part that matters." |
| 0:05–0:14 | Simple animation: source → pipeline → dashboard, with a check mark | "A data engineer moves data from where it's created to where people use it, and makes sure it's right when it gets there." |
| 0:14–0:30 | Two stat cards. **72%** prioritize AI-assisted coding. **71%** worry about wrong data reaching stakeholders. Source: dbt Labs 2026 survey | "In the dbt Labs 2026 survey, 72% of data teams prioritize AI-assisted coding. And 71% worry about wrong data reaching stakeholders. Both are true at once. AI speeds up the writing. Someone still has to own the result." |
| 0:30–0:48 | Bar chart: Pipelines 74% · SQL 71% · Python 71% · AWS 44% · Data quality 43% · Data modeling 38%. Source: InterviewStack, 6,877 postings, May 2026 | "Here's what employers ask for. InterviewStack looked at 6,877 job postings in May 2026. Pipelines: 74%. SQL: 71%. Python: 71%. AWS: 44%. Data quality: 43%. Data modeling: 38%." |
| 0:48–1:05 | Three numbered points appear one at a time | "So be ready for three things. Know the fundamentals well enough to spot a wrong answer. Review AI output like it came from a new hire. And explain your decisions out loud." |
| 1:05–1:20 | Chris on camera, then end card | "I've sat on the hiring side of more than two hundred senior interviews. The people who get the offer can explain why. That's what we train. Book a call at stackle.io." |

**Clip pull:** 0:30–0:48 (the skills bar chart) works as a standalone "what employers want" post.

---

## 3. Data engineer vs AI engineer vs data scientist vs data analyst

**Course-neutral. Reused across all Stackle masterclasses.** No course details, price or cohort date.
**VO length:** about 65 s

| Time | On screen | VO |
|---|---|---|
| 0:00–0:04 | Four role cards, face down. Text: **Four data jobs. Four different questions.** | "Four data jobs. Four different questions." |
| 0:04–0:14 | Card flips: **Data analyst · What happened?** | "Data analyst: what happened? They query data, build dashboards, and explain the numbers to the business." |
| 0:14–0:24 | Card flips: **Data scientist · What will happen, and why?** | "Data scientist: what will happen, and why? They use statistics and models to predict and to test ideas." |
| 0:24–0:34 | Card flips: **Data engineer · Can we trust the data, and is it on time?** | "Data engineer: can we trust the data, and is it there on time? They build the pipelines and models everyone else depends on." |
| 0:34–0:44 | Card flips: **AI engineer · How do we put AI into the product?** | "AI engineer: how do we put AI into the product? They connect language models to data and tools, and make them reliable." |
| 0:44–0:54 | Venn overlap: SQL, Python, AI tools | "They overlap. All four use SQL. Most use Python. And all four now work with AI in their tools. So the tools won't tell you which job is yours. The question will." |
| 0:54–1:05 | Four cards in a row, one word under each: answer · prediction · data · AI feature. Then end card | "The difference is what they own. Analysts own the answer. Scientists own the prediction. Engineers own the data. AI engineers own the AI feature. Pick the question you want to answer every day." |

---

## 4. Week 1: SQL

**VO length:** about 65 s

| Beat | On screen | VO |
|---|---|---|
| Hook | An AI-written query with a join that duplicates rows. A revenue total is visibly too high. Text: **AI wrote this. Is it right?** | "AI wrote this query in five seconds. It runs. It's also wrong. Week one is about catching that." |
| Intro | Title: **Week 1 · SQL** | "Welcome to week one of the Stackle Data Engineering Masterclass: SQL. SQL is still the language of data work, and it's the first thing an interviewer will test." |
| Recorded basics | Chapter list: SQL fundamentals · Snowflake | "Before class, you watch the recorded basics: SQL from the ground up, and how Snowflake works." |
| Live build | Screen capture: CTE, then window function | "Then we go live, Monday and Wednesday. CTEs and window functions, the tools behind most real business questions. And we review AI-written SQL together, line by line, until you can see where it breaks." |
| How AI is used | AI draft beside student's corrected version | "Your AI assistant drafts the queries. You check the joins, the filters and the numbers before anything counts." |
| What you ship | Checklist: 10 business questions, each with a check mark | "You ship answers to ten business questions, each one checked. Not just a query that runs, but a number you can stand behind." |
| Next week | Teaser: **Week 2 · Python** | "Next week, we take that data into Python and build your first pipeline." |

---

## 5. Week 2: Python

**VO length:** about 60 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Text: **Tests first. Then let AI write the code.** | "Here's the order that keeps AI honest. Write the test first. Then let it draft the code. If the code passes, you know why. If it fails, you know where." |
| Intro | Title: **Week 2 · Python** | "Welcome to week two: Python." |
| Recorded basics | Chapter list: Python · Git | "In the recorded basics, you learn Python for data work, and Git, so every change is tracked." |
| Live build | Diagram: API → Python → Snowflake. Then a failing test turns green | "Live, we build a pipeline that pulls from an API and loads into Snowflake. Tests first. The AI drafts. You review it, fix it, and open a pull request, the way a real team works." |
| How AI is used | AI draft, then test results | "The assistant writes the first version. Your tests decide if it's good enough. And the pull request is where you explain what you changed and why." |
| What you ship | GitHub pull request page | "You ship a tested pipeline, with a pull request behind it. This is the first piece of the pipeline you'll keep building on for the rest of the course." |
| Next week | Teaser: **Week 3 · Data modeling + dbt** | "Next week, we model that data with dbt." |

---

## 6. Week 3: Data modeling + dbt on Snowflake

**VO length:** about 70 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Text: **One row per… what?** | "One row per what? If you can't answer that, your numbers will drift, and nobody will know why the dashboard changed." |
| Intro | Title: **Week 3 · Data modeling + dbt on Snowflake** | "Week three: data modeling and dbt on Snowflake." |
| Recorded basics | Chapter list (topics TBC) | "The recorded basics cover the foundations before class, so live time goes to building." |
| Live build | Grain diagram → changing record history → dbt lineage graph | "Live, we start with grain: what one row actually means. Then history: how to keep track when records change. Then dbt tests and lineage, so you can see where every number comes from." |
| How AI is used | AI-generated model next to a student's design doc | "AI can generate models fast. It doesn't know your business grain. You make the design call, AI helps write the SQL, and the tests check it." |
| What you ship | Bronze → silver → gold layers, plus a design doc | "You ship bronze, silver and gold models, plus a design doc that explains your choices. That doc is interview material." |
| Next week | Teaser: **Week 4 · Data quality + CI/CD** | "Next week, we make the pipeline refuse bad data." |

---

## 7. Week 4: Data quality, testing, CI/CD

**VO length:** about 75 s

| Beat | On screen | VO |
|---|---|---|
| Hook | A red X appears on a GitHub Actions run. Text: **Break it on purpose.** | "This week, we break the pipeline on purpose, and make sure it catches itself." |
| Intro | Title: **Week 4 · Data quality, testing, CI/CD** | "Week four: data quality, testing and CI/CD." |
| Recorded basics | Chapter list (topics TBC) | "The recorded basics come first, so live time goes to building." |
| Live build | Tests → data contract → GitHub Actions workflow. Then a missing column, a null and a duplicate, each one caught | "Live, we add tests and data contracts, then wire them into GitHub Actions so every change gets checked. Then we break things: a missing column, a null, a duplicate. And we watch the pipeline catch every one." |
| Stat | **71%** worry about wrong data reaching stakeholders. Source: dbt Labs 2026 survey | "In the dbt Labs 2026 survey, 71% of data teams worry about wrong data reaching stakeholders. This week is how you stop it." |
| How AI is used | AI suggests tests. Student adds a business rule | "AI helps write tests and contracts. You decide what bad data means." |
| What you ship | Pipeline run: bad batch **blocked** | "You ship a pipeline that blocks bad data before anyone sees it. In an interview, that's the difference between 'I built a pipeline' and 'I built one people can trust.'" |
| Next week | Teaser: **Week 5 · AWS + lakehouse** | "Next week: the cloud, with AWS and the lakehouse." |

---

## 8. Week 5: Cloud + lakehouse on AWS

**VO length:** about 60 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Two identical queries side by side, two cost meters climbing at different speeds (illustrative, no figures). Text: **Same query. Different bill.** | "Same data. Same query. A very different bill. The cloud rewards people who understand how it works." |
| Intro | Title: **Week 5 · Cloud + lakehouse on AWS** | "Week five: cloud and lakehouse on AWS." |
| Recorded basics | Chapter list: S3 · IAM · Compute | "The recorded basics cover S3 for storage, IAM for access, and your compute options." |
| Live build | Cost breakdown → CSV converted to Parquet → Iceberg table | "Live, we work through cost: what you pay for, and how your choices change the bill. We store data as Parquet, a format built for analytics. Then we build an Iceberg table, an open table format that more than one engine can read." |
| How AI is used | AI-written IAM policy with an over-broad permission highlighted | "AI can write an IAM policy in seconds. You check that it grants only what's needed, because an access mistake in the cloud is the kind that gets noticed." |
| What you ship | Snowflake worksheet querying the Iceberg table | "You ship an Iceberg table on AWS, queried from Snowflake. Your data lives in one place, and the tools come to it. That's the lakehouse idea, working on your own project." |
| Next week | Teaser: **Week 6 · Spark + Databricks** | "Next week: Spark and Databricks." |

---

## 9. Week 6: Spark + Databricks

**VO length:** about 60 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Progress bar crawling. Text: **It works. It's just slow.** | "Your pipeline works. It's just slow. This week, you find out why." |
| Intro | Title: **Week 6 · Spark + Databricks** | "Week six: Spark and Databricks." |
| Recorded basics | Chapter list (topics TBC) | "The recorded basics come first, so live time goes to building." |
| Live build | PySpark notebook → query plan → before/after timing | "Live, we build a PySpark pipeline on Databricks. Then we read the query plan: Spark's own description of what it's about to do. That's where the slow parts show up. Then we make it faster, measuring before and after every change." |
| How AI is used | AI suggests three optimizations. The query plan shows only one helped | "AI will suggest optimizations. Some help. Some do nothing. The query plan and your measurements tell you which ones actually helped." |
| What you ship | Before/after numbers card (the student's own numbers) | "You ship a PySpark pipeline with before-and-after numbers. 'I made it faster' is a claim. Numbers are a story you can tell in an interview." |
| Next week | Teaser: **Week 7 · Kafka** | "Next week: streaming with Kafka." |

---

## 10. Week 7: Kafka

**VO length:** about 60 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Event stream: one message arrives late, another arrives twice. Text: **Late. And twice.** | "In streaming, messages show up late. Some show up twice. Your table still has to be right." |
| Intro | Title: **Week 7 · Kafka** | "Week seven: Kafka." |
| Recorded basics | Chapter list (topics TBC) | "The recorded basics come first, so live time goes to building." |
| Live build | Producer → topic → consumer → table, with late and duplicate events flagged | "Live, we build a streaming project from scratch. Then we deal with the hard parts head on. What do you do with a message that arrives after its window has closed? How do you make sure a duplicate doesn't get counted twice? These are the questions that separate a demo from a real system." |
| How AI is used | AI-scaffolded consumer. Student adds the duplicate-handling rule | "AI can scaffold a consumer quickly. You decide what happens when the same event arrives twice." |
| What you ship | Table row count ticking up live | "You ship a live stream landing in a table: correct, even when the messages aren't." |
| Next week | Teaser: **Week 8 · Airflow** | "Next week, Airflow ties it all together." |

---

## 11. Week 8: Airflow

**VO length:** about 65 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Clock at 2:00 a.m. Text: **Does it run while you sleep?** | "Your pipeline works when you run it. Does it work at 2 a.m., while you're asleep?" |
| Intro | Title: **Week 8 · Airflow** | "Week eight: Airflow." |
| Recorded basics | Chapter list (topics TBC) | "The recorded basics come first, so live time goes to building." |
| Live build | Airflow DAG connecting every earlier project. Then a retry, a backfill and an alert | "Live, we orchestrate everything you've built so far. Retries for when things fail. Backfills for when you need to rerun history. Alerts, so you hear about problems before your stakeholders do." |
| How AI is used | AI-drafted DAG. Student edits retry and alert settings | "AI drafts the DAGs. You decide what retries, what waits, and who gets alerted. Those calls are judgment, and they're exactly what an interviewer will ask you about." |
| What you ship | Airflow calendar showing scheduled runs, all green | "You ship your project, running on a schedule. SQL, Python, dbt, quality checks, the cloud, Spark and streaming, now one pipeline that runs without you." |
| Next week | Teaser: **Weeks 9–10 · Capstone** | "Next: the capstone. Your data, your pipeline." |

---

## 12. Week 9: Capstone 1

**VO length:** about 70 s

| Beat | On screen | VO |
|---|---|---|
| Hook | The course dataset swaps out for the student's own. Text: **Your data. Your pipeline.** | "For eight weeks, you've built on our data. Now you bring your own. Something you care about, and something you can talk about in an interview." |
| Intro | Title: **Week 9 · Capstone, part 1** | "Week nine: capstone, part one." |
| Recorded basics | Chapter list: Capstone brief · Data for AI | "The recorded basics cover the capstone brief, and Data for AI: how to prepare data that AI systems can use." |
| Live build | Three tiles: Design review · Build clinic · Agent layer | "Live, there's a design review, where you defend your plan. A build clinic, where we get you unblocked. And the agent layer, where you add an AI agent on top of your pipeline." |
| How AI is used | Agent answering a question from the student's pipeline | "This week, AI isn't just helping you write code. It's part of what you build." |
| What you ship | Student's pipeline diagram, end to end | "You ship a working pipeline on your own dataset, with an AI agent on top. Everything you've learned, applied to a problem you chose." |
| Next week | Teaser: **Week 10 · Demo Day** | "Next week: Demo Day." |

---

## 13. Week 10: Capstone 2, Demo Day + hiring prep

**VO length:** about 75 s

| Beat | On screen | VO |
|---|---|---|
| Hook | Montage of first-draft AI code from week 1, cut to the finished capstone. Text: **Demo Day.** | "Ten weeks ago, AI wrote your first draft. Now you show what you did with it." |
| Intro | Title: **Week 10 · Capstone, part 2** | "Week ten: capstone, part two." |
| Live: Monday | **Monday · Demo Day**. Student presenting | "Monday is Demo Day. You present your project live." |
| Live: Wednesday | **Wednesday · Hiring prep**. Story outline: decision → what broke → fix | "Wednesday is hiring prep. We turn your project into an interview story: the decisions you made, what broke, and how you fixed it." |
| Credibility | Chris on camera. Lower third: **200+ senior technical interviews** | "I've run more than two hundred senior technical interviews from the hiring side. This is the story that works." |
| How AI is used | Slide: Where AI helped · Where I overruled it | "You'll explain where AI helped, and where you overruled it." |
| What you ship | Three items: Public project · Recorded demo · Interview story | "You ship a public project, a recorded demo, and an interview story you can tell. Three things you can send to a hiring manager the day the course ends." |
| Close | **Next cohort: [date]**, then end card | "The next cohort starts [date]. Book a call at stackle.io." |

---

## Notes and open decisions

1. **Basics not in the brief.** The brief doesn't give recorded-basics topics for weeks 3, 4, 6, 7 and 8. Those scripts use a generic line ("The recorded basics come first…") and their on-screen lists are marked *TBC*. Replace them once the topics are fixed. Week 10 has no basics beat.
2. **Week numbering.** Videos 4–13 map to weeks 1–10 in brief order, with Airflow as week 8 and the capstone in weeks 9–10.
3. **The "trust priority 66% → 83%" stat is unused.** The brief doesn't say who rose from 66% to 83%, or over what period. Add it to video 2 or 7 once the exact wording is confirmed.
4. **Stats are quoted only as given.** Each stat names its source on screen.
5. **Employer.** No employer is named anywhere. Chris's credentials appear in videos 1, 2 and 13.
6. **Captions.** Burned-in captions are required for video 1. They're also recommended for all marketing clips, since social feeds autoplay muted.
7. **Longer cuts.** To make longer tutorials, extend the live-build beat. Keep the hook and the ship beat as they are.
