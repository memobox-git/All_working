# Week 1 drafts (Oct 15-21, 2026)

How to use: read each post once (30 seconds), check the one line marked "Check", paste, post. Every claim is either a public fact (source given) or a fact you already gave me. Nothing about your life is made up.

## Thu Oct 15 · Before & After · READY

Visual: two-row image. Top row "Before" in grey with the first bullet. Bottom row "After (example)" in your accent color with the second bullet. Header with your face and handle.

Check: the line "The second bullet gives me three questions to ask you" is in your voice. Make sure it's true for how you interview.

```
Most data engineering resume bullets list tools.
The ones that get read show what changed. 👇

Before:
"Built ETL pipelines using Spark, Airflow and Snowflake."

This tells me what you touched. It doesn't tell me what happened.

After (example):
"Rebuilt the nightly sales pipeline in Spark and Airflow. Runtime went from 6 hours to 40 minutes, so finance had numbers before their 9 AM meeting."

What changed:

The problem
→ which pipeline, and why anyone cared

The tools
→ still there, but now they support the result

The number
→ 6 hours to 40 minutes is something an interviewer can ask about

Who it helped
→ finance, not "the business"

Use your real numbers. Made-up numbers fall apart at the first follow-up question.

I've run 200+ data engineering interviews. The second bullet gives me three questions to ask you. The first gives me none.
```

---

## Fri Oct 16 · What Big Tech Expects · READY (check one fact)

Source: Meta, "Data Engineer, Product Analytics (University Grad)", posted June 13, 2026 (Bellevue, Menlo Park, New York). Text read from a job-board mirror of the posting: https://resumegeni.com/jobs/data-engineer-product-analytics-university-grad-at-meta-bellevue-wa-menlo-park-ca-new-york-ny
Before posting, open metacareers.com, search "Data Engineer University Grad", and confirm the three AI lines are still there. The original metacareers link now returns 404, so the role may be closed; the post says "posted in June", so it stays accurate either way.

Visual: 4:5 cheat-sheet image. Title "What Meta expects from an entry-level data engineer (2026)". Left column "The work": 3 boxes. Right column "New on the list": 3 boxes in your accent color. Your face and handle in the header. Footer: "Source: Meta job post, June 2026".

```
Meta posted an entry-level data engineer role in June. It asks for SQL, Python and databases, then lists 3 AI skills. 👇

The role is Data Engineer, Product Analytics (University Grad), working across Facebook, Instagram, WhatsApp and Threads.

The day-to-day work hasn't changed:

Decide what to log
→ work out which data a business question needs, and make sure it gets collected

Build pipelines in production
→ design, build and launch ETL on your own

Own the SLA
→ commit to when your data lands, and keep that promise

The new part is in the qualifications:

Use AI to redesign how work gets done
→ and show the impact, like time saved or better quality

Practice responsible AI
→ risk checks, bias checks, accuracy reviews

Keep your AI skills current
→ they name prompt and context engineering, and agent orchestration

I've run 200+ data engineering interviews. If I were hiring for this role, I'd ask one question: tell me about a workflow you changed with AI.

What won't pass:
→ "I use AI tools every day."

What will:
→ one real workflow, what the AI did, how you checked its output, and the number that moved.

SQL is still the floor. AI is now on the list.
```

---

## Profile rewrite (do this before Friday's post goes out)

**Headline** (front-loaded: mobile shows about the first 100 characters):
```
Data & AI Engineering Careers | 200+ data engineering interviews from the hiring side | Founder, Stackle
```

**About: first 3 lines** (what shows before "see more"):
```
I've sat on the hiring side of 200+ data engineering interviews, across banking, healthcare, automotive and financial exchanges.

I post what actually decides those interviews, and how data engineers move into AI engineering.

Founder of Stackle: free meetups (3,900+ members), masterclasses and resume reviews. Links in Featured.
```

**Banner** (1584x396):
- Line 1: `Data & AI engineering interviews, from the hiring side`
- Line 2: `200+ interviews run · 10+ years in data engineering · 3,900-member meetup`

**Featured, in this order:**
1. The next free event (LinkedIn Event page)
2. The "Across the Table" newsletter (once the first edition is out)
3. The free data engineering roadmap: https://stackle.io/resources/data-engineering-roadmap
4. Your Amazon interview post (37,031 impressions)

**Settings:** Visibility → Followers → turn on "Make follow primary".

**Newsletter setup** (Creator tools → Newsletter):
- Name: `Across the Table`
- Description: `One real data engineering interview question a week, and what the person across the table is actually listening for.`
- Frequency: Weekly

---

---

## Sat Oct 17 · Newsletter #1 · READY

Set up the newsletter first (name and description are in the profile section above). LinkedIn publishes the first edition as a post and invites all your followers and connections.

Title: `3 rounds at a healthcare startup, and how to prepare for each`

```
Across the Table is a weekly note on data engineering interviews from someone who has sat on both sides: 200+ interviews run from the hiring side, and my own loops at places like Amazon and Airbnb.

This week: a healthcare startup I interviewed with ran its data engineering loop in 3 rounds. An assessment, a pair programming session, and a behavioral round with the lead for data engineering and AI.

Each round tests something different, so each one needs different prep.

Round 1: The assessment

This is where they check the basics without anyone watching. Usually SQL, some Python, and a small data modeling or pipeline task.

What not to do: rush to code the moment the timer starts.

What to do instead:
→ Read the prompt twice and write down your assumptions in a comment.
→ Get a correct answer first, then make it clean.
→ Test the edge cases they didn't mention: nulls, duplicates, late data.

Round 2: Pair programming

Here they watch how you think. The code matters less than the conversation.

What not to do: go silent for ten minutes and then show a finished answer.

What to do instead:
→ Say what you're about to do before you do it.
→ Ask one clarifying question early. It shows you think about requirements, not just syntax.
→ When you get stuck, say what you're checking. Being stuck isn't the problem. Being stuck in silence is.

Round 3: Behavioral with the lead for data and AI

When the person across the table leads data and AI, this round is about trust. Would they let you own the data their models depend on?

Prepare three real stories:
→ A pipeline that broke, how you found out, and what you changed so it couldn't happen the same way again.
→ A time you pushed back on a request, and what happened.
→ A workflow you changed with AI, how you checked the output, and the number that moved.

That last one is new. Even Meta's entry-level data engineer job post now asks for it.

The assessment shows what you know. The pair round shows how you think. The last round shows whether they'd trust you with their data.

See you next week across the table.
Chris
```

---

## Sun Oct 18 · Founder story / Live announcement · READY (needs the Event link)

Before posting: create the LinkedIn Event for Thu Oct 22 (Live mock interview) and put it in Featured. Fill in the time.


```
A free workshop I ran on Claude drew 511 people.
This Thursday I'm trying something different. 👇

A live mock data engineering interview, out in the open.

One volunteer. One real interview question. 30 minutes.

I'll ask the question the way I would on the hiring side, let them answer, and then walk through what I'd write in my notes: what worked, what I'd probe, and what would decide the round.

I've run 200+ of these behind closed doors. This one, everyone gets to watch.

Thursday, Oct 22 at [time] ET. Free. The link is in my Featured section.
```

---

## Mon Oct 19 · Across the Table · READY

Visual: text-only, or one real photo of you.

Check: this is written as something you watch for in interviews. Make sure it's true for you.

```
I've run 200+ data engineering interviews.
One small word always gets a follow-up from me: "we". 👇

"We built a streaming pipeline."
"We moved the warehouse to Snowflake."
"We cut costs by 40%."

Good projects. But I still don't know what you did.

What not to do:
→ tell the whole story in "we" and hope I fill in the gaps

What to do instead:

Use "we" for the setup
→ "Our team was moving 2 TB a day into Snowflake."

Use "I" for your decisions
→ "I chose to partition by event date, because most queries filtered on it."

Give the reason
→ the "because" is what shows judgment

Say what you'd change
→ "If I did it again, I'd add data quality checks before the load, not after."

Your team built the pipeline. The interview is about what you did inside it.
```

---

## Tue Oct 20 · Money & offers · READY

Source: Levels.fyi job-family pages, US median total compensation, read Oct 14, 2026 (details and URLs in `source-facts.md`, section B6, and Google in B2).

Visual: three horizontal bars, one per title, each labelled with its dollar figure and number of reports. Source line at the bottom: "Levels.fyi, US median total comp, Oct 2026".

```
On Levels.fyi, the median AI engineer in the US makes $151K a year.
The median data engineer makes $159K. 👇

US median total compensation, October 2026:

Data engineer
→ $159K, from 1,189 reports

AI engineer
→ $151K, from 334 reports

Machine learning engineer
→ $280K, from 1,065 reports

Google shows the same order: data engineer $280K, AI engineer $260K, machine learning engineer $354K.

So if you're a data engineer looking at AI:

Don't switch for the title
→ on these numbers, the title alone pays less than the job you already have

Look at the work behind the bigger number
→ machine learning engineers build and run models in production, and their median is $121K higher

Bring AI into the role you have
→ Meta's and Apple's data engineer job posts now list AI skills as requirements

AI on your skills is showing up in job posts. AI in your job title isn't showing up in pay.
```

---

## Wed Oct 21 · Inside the Interview · READY

Visual: clean star-schema diagram. Center: fact_bookings. Around it: dim_listing, dim_host, dim_guest, dim_date, dim_location. Your face and handle in the header.

Check: the post says Airbnb asked you this in an interview last year (true, from what you told me) and then teaches how to approach it. It doesn't claim what you answered or how it went.

```
Airbnb asked me to design their data warehouse in an interview last year.
Most people start drawing tables. That's step 4. 👇

The requirement: design a warehouse that lets Airbnb answer questions about its business.

Before any tables, I'd want to know which questions. So the full walk:

1. Ask what they need to answer
→ nights booked, occupancy, revenue per listing, cancellations, host performance

2. Name the core things in the business
→ listings, hosts, guests, bookings, reviews, payments

3. Pick the grain
→ one row per booking, or one row per booked night? Occupancy questions need nights.

4. Then draw the tables
→ a bookings fact table in the middle; listing, host, guest, date and location around it

5. Handle things that change
→ a listing's price and a host's status change over time, so keep history instead of overwriting it

6. Say how data gets in
→ booking events in near real time, payments and reviews in batches, with a clear owner for each feed

7. Say how you'd know it's right
→ checks on row counts and duplicates, and a promised time the tables are ready each morning

Steps 1 to 3 are where the interview is decided. Anyone can draw a star schema. Not everyone asks what it's for.
```
