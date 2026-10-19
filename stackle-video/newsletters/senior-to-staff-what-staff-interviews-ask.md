# Newsletter: What staff data interviews really ask

## Subject line options

1. $220K to $400K: what staff data interviews really ask
2. Meta's staff data loop starts with the round most people prep last
3. I checked my staff plan against 230 real interview write-ups
4. The round my 15-week staff plan was missing
5. Staff data interviews: 4 things my plan didn't cover

## Preview text

My plan covered SQL, data modeling and system design. It missed the round Meta asks in every full-stack interview.

## Body

Hi, it's Chris.

I recently shared my 15-week plan to go from senior to staff data engineer. The reason is the pay gap. At Meta, senior data engineers average about $219K in base pay, according to Levels.fyi. The three staff-level jobs I'm preparing for list these base salary ranges in their postings:

**Anthropic**, Staff+ Software Engineer, Data Infrastructure
→ $405K to $485K

**OpenAI**, Software Engineer, Data Infrastructure
→ $266K to $445K, plus equity

**Google**, Staff Software Engineer, AI Foundry Data Quality and Training Data
→ $207K to $300K, plus bonus and equity

A plan is easy to write. So before going further, I checked mine against what staff interviews actually ask. We went through about 230 public interview write-ups from 2024 to 2026, mostly on Blind and LeetCode Discuss, plus Reddit threads, YouTube interviews and prep sites. They covered Meta, Google, Amazon, Netflix, Airbnb, Uber, Databricks, Snowflake, Stripe, OpenAI and Anthropic.

One thing to know first. Each write-up is one person's experience, and only a few come from staff loops. No company publishes a staff data engineer interview guide. So read this as a strong sample, not a rulebook.

### What the plan got right

SQL, data modeling, pipeline design, debugging and Spark all match what people reported. A few real questions:

**Amazon**
→ "Implement row_number() without using window functions."

**Uber**
→ Find drivers who didn't take a trip in their first 7 days after signup. Then make it fast as the data grows.

**Airbnb**
→ Design a model for cumulative booking metrics, with first and last booking times. Then defend every choice.

**LinkedIn, staff level**
→ Design an experimentation platform, and the data pipeline behind it.

**Uber**
→ How does Spark behave when you join two big datasets without enough resources, and how would you fix it?

### What changes at staff

At Meta, people reported that the technical questions for staff are the same as for senior. What changes is the leadership signal, and it comes early.

**Meta IC6**
→ A 30-minute leadership round sits inside the first screen. One person who missed it was offered IC5 instead, or a 6-month wait to try again.

**Meta Senior+**
→ One rejection reason was that the project's impact "wasn't big enough", plus a weak answer on mentoring.

**Google L6**
→ Two system design rounds in one reported loop.

**Databricks staff**
→ An architecture interview comes first and decides the rest of the loop. Then come project and behavioral rounds.

So at staff, the behavioral round isn't the easy round at the end. It decides your level.

### The 4 gaps in my plan

**1. Product sense and metrics**
→ Meta asks it in every full-stack round. One real question: "How would you measure monetization for a gaming product, and how would you verify that a broken feature was actually fixed?" My plan had nothing for this.

**2. DSA beyond arrays**
→ Trees, graphs, intervals and simple dynamic programming came up at Uber, Airbnb, LinkedIn and DoorDash. One DoorDash staff screen expected a hard problem solved in 25 minutes.

**3. Concurrency**
→ Anthropic asked people to build a web crawler, then make it multithreaded. Databricks has a whole round on it. This matters if you apply for "software engineer, data infrastructure" roles.

**4. One project, told in depth**
→ Databricks, Netflix and Anthropic asked people to walk through one project in depth: the numbers, the trade-offs, and what changed because of it.

### What I over-prepared for

Weeks 10 to 12 cover RAG, AI agents and serving large language models. No write-up showed these asked in a data engineering loop at these companies, not even at OpenAI or Anthropic. Kubernetes, in week 9, didn't come up at all. These are still useful on the job. But if interviews are your goal, this is where to cut time.

### If you're following the plan

**Start your stories in week 1**
→ Not week 15. Write the 10 stories and one project deep dive early, and practise them every week.

**Add product sense**
→ 15 to 20 cases: define a metric, explain a metric drop, pick the segments to check.

**Widen your DSA**
→ Add trees, graphs, intervals and 1-D dynamic programming.

**Add concurrency if you're applying to AI labs**
→ Locks, queues, thread pools, and a multithreaded web crawler.

**Practise against the clock**
→ Meta's screen was reported as 5 SQL and 5 Python questions, with 25 minutes for each set.

### Free: the whole plan and 1,100 questions

The Notion page I study from is open to everyone. It has all 15 weeks, the system designs, the debugging scenarios, the behavioral questions and the architecture diagrams.

[Link: Notion study plan]

It also links to a question bank: 1,100 interview questions across 11 topics, plus 95 questions from real interviews, each linked to its source. There's a PDF with tick boxes too.

[Link: Question bank]

At staff, the round most people prep last is the one that decides your level.

Which of the four gaps is the hardest for you? Hit reply and tell me.

Chris
Stackle
