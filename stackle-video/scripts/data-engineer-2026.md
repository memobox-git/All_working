# How to Become a Data Engineer in 2026 and 2027

**Spoken words: 1,665 · about 11 minutes at 150 words a minute**
**Screen time: 64% full-screen Excalidraw graphics. You are on screen for 36%: 24% on camera and 11% with a card beside you.**

Status: draft for Chris to review. Numbers were checked on 12 October 2026 (see the research brief). The two marked "check before filming" need one look in a browser.

---

## Research brief

### Videos we compared

Chrome was not connected to this session, so the research used web search. The network blocked YouTube pages, so **no transcript could be read for any video**. Content comes from each creator's own blog post, video description, or a written summary of the video. View counts were mostly not available.

| # | Creator | Title | Link | Date | Views | Length |
|---|---|---|---|---|---|---|
| 1 | Data with Baraa (about 504K subscribers) | How I'd Learn Data Engineering in 2026 From Zero to Senior | youtube.com/watch?v=1nVGaNbvuXg | about Jan 2026 | not found | not found |
| 2 | Data with Baraa | Data Engineer Roadmap: Built From 22,000 Real Job Ads | youtube.com/watch?v=kIk8tj0rbo0 | Sep 2026 | not found | not found |
| 3 | Darshil Parmar (about 216K subscribers) | Only Data Engineering Roadmap You Need 2026 | youtube.com/watch?v=4ifxQ_th07U | Feb 2026 | about 27K | not found |
| 4 | Darshil Parmar | Complete Roadmap To Get a Data Engineering Job in 2026 | youtube.com/watch?v=fc-kbzm3kzA | Aug 2026 | about 22K | not found |
| 5 | Luke Barousse | How I Would Learn to be a Data Engineer | youtube.com/watch?v=_-DzZeixu0w | about May 2026 | not found | not found |
| 6 | Joe Reis with Zach Wilson | What It Actually Takes to Be a Data Engineer in 2026 | youtube.com/watch?v=3y1LPo-2rVg | about May 2026 | not found | not found |
| 7 | Joe Reis with Chris Gambill | Breaking Into Data Engineering in 2026 | youtube.com/watch?v=0_nFLy_TufQ | Apr 2026 | not found | about 47 min |

We also used the data science video you pasted (Maggie, about 11 minutes) for structure only. No sentences, hooks or examples were copied.

### What all of them cover (our script covers each one)

- SQL first, then Python aimed at pipeline work.
- Concepts before tools.
- Data modeling and warehouses (star schema).
- Spark or Databricks, plus Airflow.
- Pick one cloud or one stack, not all of them.
- An end-to-end project, then a "get hired" step: CV, LinkedIn, GitHub.

### Where they are wrong, out of date, or disagree

- **Cloud timing.** Darshil puts AWS before the first job, while Baraa puts the cloud after it. Our script puts the cloud before the first job, as phase four.
- **Kafka timing.** Darshil says to wait until after the offer, and Baraa puts Kafka at junior level. Our script says "learn it later".
- **Degrees.** Baraa's analysis of 22,000 job ads from about 100 countries says about half name no degree, but his method is not shown. The 365 Data Science study of US job ads (April 2026) says about one in four do not mention education. We use the US study and say it is US data.
- **Certifications.** Baraa's roadmap includes a certification step, but his own job-ad data says only 7% of ads mention one. We leave certifications out.
- **Old numbers.** Many videos still quote the US Bureau of Labor Statistics 2024–34 projections. These were replaced by the 2025–35 projections on 27 August 2026. Our script uses no BLS projection.
- **Syntax first.** The beginner roadmaps teach syntax first. Zach Wilson argues that AI now writes routine SQL and Spark, so reading and checking code matters more. Our script says this directly.

### Gaps, and the angle we take

1. **What a hiring manager checks.** No video covers this well. We use Chris's experience from more than 200 interviews (the card "What I check").
2. **How AI changed the daily work.** Only the Reis and Wilson episode covers it. We show the assistant workflow, the 2026 survey numbers, and why SQL matters more for checking the work.
3. **Data for AI.** RAG and vector databases barely appear in other videos. We explain the pipeline behind a document assistant in plain words.
4. **The side door.** Viewers keep asking whether data engineering is an entry-level job. We answer that directly and show the analyst or analytics engineer path.
5. **The interview loop as it works now.** We give the five stages, how to explain a design choice, and STAR with a number.

### Sources for every number

| Number in the script | Source | Period | Checked |
|---|---|---|---|
| About $160,000: the middle of the US pay range for a data engineer ($160,500) | Robert Half 2027 Salary Guide, roberthalf.com/us/en/job-details/data-engineer | Projected 2027 salaries, page from Sept 2026 | Publisher page as indexed by search. **Check before filming.** |
| (Backup) Data engineer median total pay $159,000 | Levels.fyi, levels.fyi/t/software-engineer/title/data-engineer | Read 12 Oct 2026 | Publisher page as indexed |
| Data engineer is one of the three tech job titles with the most postings | Dice, "The Great Disconnect" hiring report, Q3 2026 | Data pulled July 2026 | Publisher page as indexed |
| About three in four data engineer postings mention a bachelor's degree (74%), and about one in four do not mention education (26%) | 365 Data Science, data engineer job outlook study, 365datascience.com/career-advice/data-engineer-job-outlook-2025/ | Dated 23 April 2026 | Publisher page as indexed |
| 83% of developers use at least one AI tool | Stack Overflow Developer Survey 2026, survey.stackoverflow.co/2026/ai | Published 6 Oct 2026 | Publisher page as indexed |
| 71% of data teams worry wrong data from AI can reach the people who rely on it | dbt Labs, 2026 State of Analytics Engineering report | Published 14 April 2026 | Publisher page as indexed |
| Referrals: about 1% of applications, about 17% of hires | Ashby Talent Trends report on referrals, ashbyhq.com/talent-trends-report/reports/referrals | Hires data to Q1 2026 | Publisher page as indexed. **Check before filming.** |

"Publisher page as indexed" means the figure was read from the publisher's own page through a search engine. The page was not opened directly, because this environment blocks those sites.

Numbers we chose **not** to use:
- The BLS 2024–34 projections, which are out of date.
- The Dice 2024 salary report, which is out of date.
- The "referred people are 4x more likely to be hired" claim, which has no traceable source.
- The World Economic Forum "big data specialists grow 110%" figure, which comes only from press coverage.

---

## Script

Labels: **Graphic N, full screen** means the graphic fills the screen while you keep talking. **Card beside you** means you stay on screen with a card next to you. **On camera** means only you. *(pause)* means a one-second pause, where a graphic starts or ends.

### Hook

**[Graphic 1, full screen: $160,500 and the job postings fact]** *(pause)*

A data engineer in the United States earns about one hundred sixty thousand dollars a year at the middle of the pay range, and data engineer is one of the three tech job titles with the most job postings. *(pause)*

**[On camera]**

Still, many people who try to become a data engineer take far too long, because they learn the skills in the wrong order and build projects that no hiring manager wants to see.

### Promise

**[On camera]**

In this video I am going to show you how to become a data engineer in 2026 and 2027. You will learn if you need a degree, which skills to learn and in which order, how AI changed the work, the first job that makes the move easier, the projects that get callbacks, and how the interviews work.

### Intro

**[Intro graphic, full screen: the existing Stackle intro]** *(pause)*

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn. *(pause)*

### Part 1: Do you need a degree?

**[On camera]**

A computer science degree is not a hard requirement for data engineering, but a degree still helps.

**[Graphic 2, full screen: four job postings, three with a degree]** *(pause)*

A 2026 study of data engineer job postings in the United States found that about three in four postings mention a bachelor's degree. About one in four do not mention education at all. *(pause)*

**[Card beside you: "What I check"]** *(pause)*

A job posting asks for a degree, but the interview tests skills. When I interview engineers, I check three things. Can you write SQL that gives the right answer on messy data? Can you build a pipeline that runs every day without you? Can you explain what you built to a person who does not code? *(pause)*

**[On camera]**

A background in computer science, math or engineering makes the first phase faster, because you already think in clear steps. A background like that does not decide who gets the offer.

### Part 2: The skills, in order

**[Graphic 3, full screen: the five phases]** *(pause)*

Data engineering skills build on each other, so the order matters. There are five phases: SQL and Python, data modeling, pipelines, cloud, and AI. Each phase uses the one before it.

**[Graphic 4, full screen: SQL]**

The first phase starts with SQL, which stands for Structured Query Language. It is how you ask a database for data. Start with joins, which combine two tables, such as orders and customers. Next come aggregations, which add up rows, such as total sales for each month. Then learn window functions, which compare a row with the rows around it, such as today's sales against yesterday's. SQL is tested in almost every data engineering interview.

**[Graphic 5, full screen: Python]**

Python is the second half of the first phase. Learn the core language first: variables, loops, functions and error handling. Then learn to read files and to call an API, which is how one program asks another program for data, such as a weather app asking a weather service for today's forecast. A library called pandas, or a newer one called Polars, helps you clean tables of data in Python.

**[Graphic 6, full screen: data modeling]**

The second phase is data modeling, which means deciding how to store data so that people can get answers fast. The most common design is the star schema. A fact table in the middle holds events, such as every order. Dimension tables around it describe those events, such as the customer, the product and the date. Practice on a cloud data warehouse, a database built for analysis, such as Snowflake, BigQuery or Databricks. Then learn dbt, a tool that turns your SQL into tested, reusable steps.

**[Graphic 7, full screen: pipelines]**

The third phase is the data pipeline. It moves data from where it is created to where it is used, and cleans it on the way. A batch pipeline runs on a schedule, such as every night at two in the morning. An orchestrator, such as Airflow or Dagster, starts each step in the right order and tries again when a step fails. Add data quality tests, such as a check that no order has a negative price. When the data is too big for one computer, learn Apache Spark. Later, learn Apache Kafka for streaming data that arrives every second, such as card payments.

**[Graphic 8, full screen: cloud, then back to the five phases with AI circled]**

The fourth phase is the cloud. Pick one provider, Amazon Web Services, Microsoft Azure or Google Cloud, and learn three parts of it: storage, where your files live; compute, the machines that run your code; and permissions, which decide who can see what. Also learn Git, which tracks every change in your code, and Docker, which packages a program so it runs the same on every computer. *(pause)*

### Part 3: How AI changed the work

**[On camera]**

The fifth phase is AI, and AI changed the work of data engineers in two ways.

The first change is how you write code. Most engineers now work with a coding assistant, such as GitHub Copilot, Cursor or Claude Code. An assistant can write the first draft of a query or a pipeline step in seconds.

**[Graphic 9, full screen: how you write code, 83% then 71%]** *(pause)*

In the 2026 Stack Overflow survey, eighty-three percent of developers said they use at least one AI tool. You still read every line, because the result can run and still give the wrong answer. In a 2026 survey by dbt Labs, seventy-one percent of data teams said they worry that wrong data from AI can reach the people who rely on it. This is why SQL and data modeling matter more now, not less. You need them to check the work. *(pause)*

**[On camera]**

The second change is what you build. Companies want AI assistants that answer questions from their own documents, such as a support assistant that answers from a company's help pages. That needs a data pipeline.

**[Graphic 10, full screen: what you build]** *(pause)*

A pipeline for an AI assistant collects the documents, splits them into small pieces, and turns each one into an embedding. An embedding is a list of numbers that captures what the text means, so text with a similar meaning gets similar numbers. These lists go into a vector database, which finds the pieces closest in meaning to a question. This setup is called RAG, which stands for retrieval-augmented generation. *(pause)*

**[On camera]**

A small RAG project in your portfolio shows a hiring manager that you know how the job looks in 2026 and 2027.

### Part 4: The side door

**[On camera]**

Data engineering is often not an entry-level job, so your first job in data may have a different title.

**[Graphic 11, full screen: the side door]** *(pause)*

Three jobs are more open to beginners: data analyst, analytics engineer, and business intelligence developer, a person who builds reports and dashboards. An analytics engineer builds clean tables for analysts with SQL and dbt, which is already half of the work of a data engineer. After twelve to eighteen months, you move across inside the same company. A move inside a company is much easier than a new hire from outside, because the team already trusts your work. *(pause)*

**[Card beside you: "Your past industry counts"]** *(pause)*

Your past industry also counts. If you worked in healthcare, banking or retail, apply to data teams in that industry first. A person who already knows what an insurance claim or a stock trade is needs less training, and hiring managers notice that. *(pause)*

### Part 5: Projects that get callbacks

**[Graphic 12, full screen: copied projects crossed out]** *(pause)*

Projects copied from a course get skipped. A hiring manager has seen the same taxi-trip pipeline and the same spreadsheet loaded once into a database many times, so a copy says nothing about you.

**[Graphic 13, full screen: a strong project]**

A strong project pulls real data that changes every day. It runs on a schedule, tests itself, and ends in a table or a dashboard that someone could use.

**[Graphic 14, full screen: the four questions]**

Every project should answer four questions. What problem does it solve? Why does that problem matter to a business? What did you build, and why did you choose that design? What can someone do now that they could not do before? The last question matters most, because a pipeline that runs tells no one what to do on Monday morning.

**[Graphic 15, full screen: build in a field you know, then the whole board]**

Build in a field you already know. A nurse can build a pipeline on public health data. A person from marketing can track campaign results. A person from finance can load daily market prices. *(pause)*

**[Card beside you: "3 projects"]** *(pause)*

Aim for three projects. Give each a README, the first page of the project, written for a manager who does not code, with a diagram of the pipeline. Then post a short write-up of each one on LinkedIn. *(pause)*

### Part 6: The interviews

**[Graphic 16, full screen: the five stages]** *(pause)*

A data engineering interview usually has five stages. The first stage is a call with a recruiter. Then come a coding test in SQL and Python, a data modeling session, a pipeline design session, and a conversation about how you work with people. *(pause)*

**[On camera]**

Practice SQL every week, not only the week before an interview. Sites such as StrataScratch, DataLemur and LeetCode have questions that companies have asked.

**[Card beside you: "Explain your reasons"]** *(pause)*

In the design sessions, explain your reasons out loud, not only your answer. Do not say, "I used an incremental load." Say, "I used an incremental load, which moves only the rows that changed, because the table grows by ten million rows a day and a full reload would take hours." *(pause)*

**[Graphic 17, full screen: the STAR method]** *(pause)*

For questions about past work, use the STAR method: the situation, the task, the action you took, and the result. Always end with a number. "My pipeline cut the delay of the daily sales report from six hours to forty minutes" sounds very different from "my pipeline worked well." *(pause)*

**[On camera]**

Before you apply to a company, check if you know someone who works there, or someone who knows a person there.

**[Graphic 18, full screen: referrals, then the whole board]** *(pause)*

A referral means a person inside a company recommends you. Hiring data from Ashby, which makes hiring software, shows that referrals are about one percent of applications but about seventeen percent of hires. *(pause)*

### Your turn

**[On camera]**

Here is one thing to do this week. Pick one public dataset from a field you know, and write the answers to the four questions before you write any code.

### Call to action

**[On camera]**

If you want help with your plan, book a free fifteen-minute career call with me. The link is in the description. If you want the full path, with projects and interview practice, the Stackle Data Engineering Masterclass takes you from SQL to a job-ready portfolio in ten weeks.

Tell me in the comments which phase you are in right now.

**[End screen: the existing Stackle CTA graphic, 11 seconds]**

---

## Graphics list

Rendered files are in `stackle-video/graphics/de-2026/`. Each one is timed to this script at 150 words a minute, and gets retimed to your real recording.

| # | File | What it shows | Length |
|---|---|---|---|
| 1 | 01-hook.mp4 | $160,500, the middle of the US pay range, and data engineer as a top-3 tech job title by postings | 18 s |
| Intro | intro.mp4 (existing) | Chris's intro facts | 17.8 s |
| 2 | 02-degree.mp4 | Four job postings: about 3 in 4 mention a degree, about 1 in 4 do not | 15 s |
| Card A | card-a-checks.mov (transparent) | "What I check": SQL on messy data, a pipeline that runs without you, explaining it to a person who does not code | 24 s |
| 3–8 | 03-skills.mp4 | One board: the five phases, then SQL, Python, data modeling (star schema), pipelines and cloud, then back to the five phases with AI circled | 2:58 |
| 9 | 04-ai-1.mp4 | How you write code: 83% use an AI tool, "runs and still gives the wrong answer", 71% of data teams worry, SQL and modeling check the work | 33 s |
| 10 | 04-ai-2.mp4 | The RAG pipeline: documents, small pieces, embeddings, vector database, question | 30 s |
| 11 | 05-side-door.mp4 | Data analyst, analytics engineer and BI developer lead to data engineer in 12 to 18 months | 33 s |
| Card B | card-b-industries.mov (transparent) | Healthcare, banking, retail: less training needed | 19 s |
| 12–15 | 06-portfolio.mp4 | One board: copied projects crossed out, a strong project, the four questions, build in your field, then the whole board | 1:07 |
| Card C | card-c-projects.mov (transparent) | 3 projects: README, diagram, LinkedIn write-up | 17 s |
| 16 | 07-interviews-1.mp4 | The five interview stages | 18 s |
| Card D | card-d-reasons.mov (transparent) | "Explain your reasons": the short answer crossed out, the full answer checked | 22 s |
| 17 | 07-interviews-2.mp4 | The STAR method, ending with a number | 20 s |
| 18 | 07-interviews-3.mp4 | Referrals: 1% of applications, 17% of hires, then the whole board | 18 s |
| End | cta.mp4 (existing) | Free call, then the masterclass | 11 s |

The cards are transparent QuickTime files. Put them over your camera shot. The card sits on the right, so stand left of centre for those parts.

### How to film and edit with these graphics

1. Record the whole script in one take. Pause for one second at each *(pause)* mark.
2. Send the recording. Each graphic is built from the script's own sentences, so the graphics can be retimed to your real voice and rendered again. The drawing then lands on the words you say.
3. In the edit, a graphic replaces your camera shot from its first *(pause)* to the next one. Cards go on top of your camera shot instead.
4. To change a graphic yourself, open its `.excalidraw` file at excalidraw.com, then ask for a re-render.

**On-screen labels that shorten the script** (all the others use the script's own words):
- "What I check": "SQL that is right on messy data", "a pipeline that runs every day without you", "explain it to a person who does not code"
- Cloud: "storage: where files live", "compute: runs your code", "permissions: who sees what"
- "SQL + dbt = half the work", "the team already trusts your work", "less training needed"
- "What did you build, and why that design?", "What can someone do now?"
- "Kafka (later): every second", "Spark: too big for one computer", "Docker: runs the same on every computer"
- "README for a manager who does not code", "a short write-up on LinkedIn"

**On-screen labels that are not in the script:** "a question" and "closest pieces" (RAG graphic), "[0.12, -0.40, 0.88, ...]" (a sample embedding), "Mon / Tue / Wed" (window functions), "today's forecast?" (API example), "hiring manager", "you", "someone there" (referral graphic).

---

## Things I added that you did not give me: please check

- **"When I interview engineers, I check three things..."** These are written in your voice. Change them to the three things you actually check.
- **"Many people who try to become a data engineer take far too long, because they learn the skills in the wrong order..."** This is presented as your observation.
- **"Data engineering is often not an entry-level job"** and **"after twelve to eighteen months, you move across"**. These are opinions with no survey behind them. Keep them only if they match what you have seen.
- **"An analytics engineer's work is already half of a data engineer's work."** This is an opinion.
- **"SQL is tested in almost every data engineering interview."** This is based on your experience and on interview guides from Amazon and Exponent, not on a statistic.
- **The masterclass line** ("from SQL to a job-ready portfolio in ten weeks") comes from the masterclass page address. Confirm the wording.
- **Examples:** the incremental load example, the "six hours to forty minutes" STAR result, the taxi-trip pipeline, and the support assistant on a company's help pages are all invented examples, not real cases.

---

## Title

**How to Become a Data Engineer in 2026 and 2027 (Full Roadmap)** (61 characters)

Other choice: **Data Engineer Roadmap 2026: How to Become a Data Engineer** (58 characters)

## Description

A data engineer in the United States earns about $160,000 a year at the middle of the pay range, and data engineer is one of the three tech job titles with the most job postings. In this video I show you how to become a data engineer in 2026 and 2027: if you need a degree, which skills to learn and in which order, how AI changed the work, the first job that makes the move easier, the projects that get callbacks, and how the interviews work.

Chapters
0:00 Data engineer pay and demand
0:00 Do you need a degree?
0:00 The skills, in order: SQL and Python
0:00 Data modeling
0:00 Data pipelines
0:00 Cloud
0:00 How AI changed the work
0:00 The side door into data engineering
0:00 Projects that get callbacks
0:00 The interviews
0:00 Your next step

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks

Sources
- Robert Half 2027 Salary Guide, data engineer: https://www.roberthalf.com/us/en/job-details/data-engineer
- Dice hiring report, Q3 2026: https://www.dice.com/hiring/recruitment/reports/the-great-disconnect-tech-job-growth-vs-candidate-frustration
- 365 Data Science, data engineer job outlook (April 2026): https://365datascience.com/career-advice/data-engineer-job-outlook-2025/
- Stack Overflow Developer Survey 2026, AI: https://survey.stackoverflow.co/2026/ai
- dbt Labs, 2026 State of Analytics Engineering: https://www.getdbt.com/blog/new-dbt-labs-report-finds-ai-driven-acceleration-is-outpacing-trust-and-governance
- Ashby, referrals report: https://www.ashbyhq.com/talent-trends-report/reports/referrals

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
