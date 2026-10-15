# Senior to Staff Data Engineer, My 15-Week Plan: script

**Word count (spoken):** about 2,430 words | **Estimated length:** about 16 minutes at 150 words a minute (about 14 with the cuts listed at the end)
**Style:** Alex Hormozi's real speaking style, as in your last four scripts (style checker: median sentence 12 words, 8% short, 21% long, all inside the target bands):
- Flowing medium sentences linked with "and so", "because" and "which is", with short lines to land each point.
- Numbered points. Each one is a rule, then the reason, then a "let's say" example.
- Terms are defined as "X just means Y".
- The math is said out loud, step by step.
- Contractions throughout, except the intro, which matches the text in intro.mp4.
**Built from:** your LinkedIn post (the plan, the targets, the build-versus-design line, "I'm in week 4", the closing question) and your voice note (Meta, the target companies, GitHub projects for DSA and Kafka, the resume, the stories).
**Research date:** 15 October 2026
**Roadmap image:** `stackle-video/graphics/roadmap-staff-de.png` (4:5, for the LinkedIn post) and `stackle-video/graphics/roadmap-staff-de-16x9.png` (Graphic 4 in the video). Source: `stackle-video/source/roadmap-staff-de.html`.

---

## Research brief

### How the research was done
Claude in Chrome isn't connected in a cloud session, so the research used yt-dlp and web search. YouTube blocked its normal watch page, so the metadata came through its embedded player instead. **Views, upload dates, lengths and subscriber counts below are real, taken on 15 October 2026.** Transcripts were read for all eight main videos. Two very long ones were only partly read: Ankit Bansal's 13-hour course (intro, chapters, the Python section and a keyword scan) and the Ryan Peterman podcast (about 35 of 67 minutes). In total, 707 top comments were read across the eight videos. Pay comes from Levels.fyi and from the job postings themselves, which were fetched from each company's own job board on the same day.

### Creators and videos flagged

| Creator | Channel (subscribers) | Title | Link | Views | Uploaded | Length | Transcript |
|---|---|---|---|---|---|---|---|
| Evan King | Hello Interview (264K) | How to Prepare for System Design Interviews w/ Meta Staff Engineer | youtube.com/watch?v=Ru54dxzCyD0 | 334,932 | 21 May 2025 | 18:27 | Yes |
| Baraa Khatib Salkini | Data with Baraa (508K) | Data Engineer Roadmap: Built From 22,000 Real Job Ads | youtube.com/watch?v=kIk8tj0rbo0 | 152,230 | 7 Sep 2026 | 23:25 | Yes |
| Steve Huynh | A Life Engineered (201K) | I Coached an AWS Engineer Senior to Staff (Live) | youtube.com/watch?v=QbFgSk70Or0 | 88,294 | 25 May 2026 | 49:38 | Yes |
| Ankit Bansal | Ankit Bansal (188K) | Ultimate Data Engineering Interview Prep in 13 Hours | youtube.com/watch?v=TiEhLLU2YpA | 87,499 | 11 Jun 2026 | 13:21:12 | Partly |
| Ryan Peterman with Zach Wilson | Ryan Peterman (112K) | Job Hopping to Staff at Airbnb by Age 26 | youtube.com/watch?v=-ZuewJWJtCo | 73,098 | 1 Nov 2024 | 1:06:41 | Partly |
| Darshil Parmar | Darshil Parmar (216K) | Only Data Engineering Roadmap You Need 2026 | youtube.com/watch?v=4ifxQ_th07U | 68,983 | 23 Feb 2026 | 24:25 | Yes |
| Jay Feng | Jay Feng / Interview Query (59.3K) | What's Happening in Big Tech Interviews in 2026 (FAANG) | youtube.com/watch?v=jXXOI01IuPs | 50,631 | 21 Jul 2025 | 11:27 | Yes |
| Afaque Ahmad | Afaque Ahmad (36.8K) | How Much DSA Do You Need To Crack Data Engineering Interviews? | youtube.com/watch?v=hCJK_cUQEDM | 27,827 | 10 Jan 2026 | 12:16 | Yes |

Big channels that rank for these searches but weren't picked, because their videos are from 2020 to 2024 or aren't about data engineering: ByteByteGo (1.12M views, 2023), Jordan has no life (133K, 2024), Seattle Data Guy (60K and 92K, 2021), and The Pragmatic Engineer (744K, 2020).

**What the numbers say:**
- **General system design prep gets the most views.** Hello Interview's video (335K) gets more views than any data engineering video on senior or staff.
- **Senior-to-staff content for data engineers is a small, open niche.** The closest videos sit at 73K to 88K views, and neither is about data engineering. DataExpert's own "promoted after senior" video has 15K views.
- **The human angle gets the most comments.** On Steve Huynh's coaching video, the most-liked comments say staff interviews feel "performative" (273 likes) and are about "packaging answers" (196 likes).

### What all of them cover (our script covers these too)
- SQL and Python come first.
- Spark is the core processing tool.
- Data modeling matters.
- System design matters at senior level and above.
- Communication and working across teams matter more the higher you go.
- AI is treated as an extra that helps you stand out, not as a core skill.

### Where they are wrong, out of date, or disagree
- **They don't agree on what staff means.** Steve Huynh says it's the size of the stakes in your stories. Laurent Charignon (on Ryan Peterman's show) says staff engineers find the problem themselves. Zach Wilson credits interviewing and negotiating. Baraa's ladder skips the staff level entirely and goes from senior to data architect. Our script uses Chris's build-versus-design line and backs it with a primary source: Dropbox's published staff data engineer level.
- **They disagree on how much DSA a data engineer needs.** Afaque says easy to medium problems are enough for 80 to 90% of data engineer roles, and only platform and infrastructure roles need software-engineer-level DSA. Ankit says basic Python covers 90 to 95% of interviews. One of Darshil's viewers asks why he doesn't teach DSA at all. Our script settles it by role: pure data engineer jobs are lighter, but two of Chris's three target jobs have "software engineer" in the title.
- **Pay numbers from different creators measure different things.** Baraa's $165K for a senior is posted job-ad pay, which is mostly base. Zach's $550K to $600K is all-cash or total pay from 2018 to 2021. On Levels.fyi, Meta's senior data engineers average about $219K base but about $355K in total pay. **Chris's post says "$220K" with no label, which only holds up as base salary.** The script now says "base salary" every time.
- **Out of date or unsourced:**
  - Jay Feng's "Gartner 89%" is 86% in Gartner's own April 2020 release, and his other hiring numbers come from conversations, not sources.
  - Zach's claim that data engineer jobs will double has no source.
  - Zach's zettabyte figures come from a 2021 forecast.
- **The AI-assisted coding round is missing from every one of these videos.** Meta confirmed in July 2025 that it was testing coding interviews where you can use an AI assistant. None of the data engineering videos mention it. Our script adds one practice round for it.

### What viewers asked for in the comments
- "Could you pls make a video on system design for data engineers. That also confuses a lot" (Afaque). It was asked for again and again, and no one covers it. Our script names three data-specific designs.
- "could you please explain few realtime issues and solutions in interview perspective" (Baraa). This is Chris's debugging category.
- "This is what tech-interviews should have been. Scenario based questions, debugging..." (Jay Feng, 33 likes).
- "Can you please make a video on how we use AI (Gen AI) as data engineer?" (Afaque).
- "it is highly recommended that you have at least 30+ unique stories" (Steve Huynh). Our script answers this with ten deep stories, each told from three angles.
- "Amazon doesn't have a "staff" level tho, is he is L5 or L6?" (Steve Huynh). The script doesn't cover this. See the gaps in "Things I added" at the end.
- "Would love it if you can make a video or post on HOW to get the interviews in the first place" (Afaque). The script doesn't cover this either.

### Gaps, and the angle our script takes
1. **A dated, week-by-week plan with numbers, for someone who is already senior.** Every data engineering roadmap on YouTube starts from zero.
2. **Real postings, matched to the plan.** No creator shows real staff postings with their pay and maps each requirement to a week. The script also points out that two of the three jobs are titled "software engineer, data infrastructure", which means a search for "data engineer" misses them.
3. **Debugging as its own prep category,** which viewers ask for and no one covers.
4. **AI infrastructure for data engineers,** framed as the way to stand out, not as a requirement. This matches Baraa's job-ad data, which shows few data engineer ads ask for AI skills yet.
5. **Data-specific system design,** which viewers ask for and Hello Interview's list (all app designs) doesn't cover.
6. **Resume lines and stories at staff level,** with a "let's say" before-and-after.

### Source for every number and fact in the script
| Number or fact in script | Source | Date |
|---|---|---|
| Senior data engineer at Meta: average base salary about $220K | Levels.fyi, Meta data engineer, E5 average base $219,152, 15 submissions. Average total pay at E5 is $354,582, which the script doesn't use. levels.fyi/companies/meta/salaries/software-engineer/title/data-engineer | Pulled 15 Oct 2026 |
| Staff-level data jobs at AI companies: $350K–$400K base, and some pay more | Posted base ranges. Anthropic Data Engineer, Product: $320,000–$405,000 (job-boards.greenhouse.io/anthropic/jobs/5448481008). Anthropic Staff+ Software Engineer, Data Infrastructure: $405,000–$485,000 (job-boards.greenhouse.io/anthropic/jobs/5114768008). OpenAI Software Engineer, Data Infrastructure: $266K–$445K plus equity (jobs.ashbyhq.com/openai/f763c6b3-5167-4a67-b691-4c3fa2c44156) | Fetched 15 Oct 2026 |
| Dropbox staff data engineer: "I set the multi-year, multi-team technical and data strategy" | Dropbox career framework, IC5 Staff Data Engineer: dropbox.github.io/dbx-career-framework/ic5_staff_data_engineer.html | No date shown |
| A senior owns one team's goals for six months to a year | Dropbox IC4 Data Engineer: "I own and deliver semi-annual/annual goals for my team." dropbox.github.io/dbx-career-framework/ic4_data_engineer.html | No date shown |
| The data engineer coding round is often lighter (lists and dictionaries) | Meta's Data Engineering Onsite Interview Guide (2022), which covers dictionaries, lists, sets and strings. The same point is made by Afaque Ahmad and Ankit Bansal (above). | Mar 2022 |
| Kafka, Spark and Kubernetes definitions | kafka.apache.org/intro, spark.apache.org, kubernetes.io/docs/concepts/overview | Current |
| A 2025 study of 131 people found about 6.5 hours a week of prep | Survey paper on arXiv, 2507.02068 (arxiv.org/abs/2507.02068): "approximately 6.5 hours per week (mdn=4)". The sample is small and self-selected. | 2 Jul 2025 |
| Meta has started testing AI-assisted coding interviews | 404 Media report, confirmed by Meta, July 2025, as covered by Business Today: businesstoday.in/technology/news/story/meta-to-test-job-applicants-with-ai-assisted-coding-interviews-amid-ai-expansion-plans-487200-2025-07-31 | 31 Jul 2025 |
| Anthropic posting: $405,000–$485,000, "10+ years", "set technical direction for a team, not just execute within it", "petabyte-scale" | job-boards.greenhouse.io/anthropic/jobs/5114768008 | Updated 21 Aug 2026 |
| OpenAI posting: $266K–$445K plus equity, "largest Spark compute fleets", "Kafka and Flink", "debugging large-scale distributed systems" | jobs.ashbyhq.com/openai/f763c6b3-5167-4a67-b691-4c3fa2c44156 | Posted 27 Jun 2024, still listed 15 Oct 2026 |
| Google posting: $207K–$300K plus a 20% bonus target and equity, LLM training data pipelines, "hundreds of billions of documents", 2 years of people management | google.com/about/careers/applications/jobs/results/82921090560467654-staff-software-engineer-ai-foundry-data-quality-and-training-data | No date shown, live 15 Oct 2026 |
| Searching Google careers for "staff data engineer" returns zero results | Google careers search | 15 Oct 2026 |
| What all three postings ask for | The three postings above, plus Anthropic's Data Engineer, Product posting | 15 Oct 2026 |
| Amazon: each interviewer typically asks two or three behavioral questions | amazon.jobs/content/en/how-we-hire/sde-ii-interview-prep | Live 15 Oct 2026 |

---

## Script

### Opening

**[On camera]**

I'm a senior data engineer at Meta, where the average base salary at my level is about two hundred twenty thousand dollars a year. The staff-level data jobs I'm going after at AI companies pay three hundred fifty to four hundred thousand in base salary, and some pay more. So I'm studying for that jump right now. In this video, I'm going to show you my fifteen-week plan, the three real jobs I'm preparing for, how I'm rewriting my resume for them, and how I'm getting my interview stories ready. You can copy all of it.

**[Card beside you: "Senior data engineer, Meta: about $220K base" → "Staff data jobs at AI companies: $350K–$400K+ base"]**

### Intro

**[PAUSE] [Intro motion graphic, full screen: intro-blue.mp4]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[PAUSE]**

### Part 1: Why staff is a different job

**[On camera]**

So let's start with why this jump is so big, because staff isn't the same job with a bigger number. After years on the hiring side, the simplest way I can put it is this. Senior gets you hired for what you can build. Staff gets you hired for what you can design.

**[PAUSE] [Graphic 1, full screen: "Senior: hired for what you can build" beside "Staff: hired for what you can design"]**

A senior data engineer takes a hard problem and builds it well, like a pipeline that moves a billion rows a day without breaking. A staff data engineer decides how all the pipelines should fit together, across many teams, before anyone writes the code.

**[PAUSE] [Graphic 2, full screen: Dropbox career framework, "Staff Data Engineer: I set the multi-year, multi-team technical and data strategy"]**

And you don't have to take my word for it. Dropbox publishes its engineering levels online, and its staff data engineer level says, "I set the multi-year, multi-team technical and data strategy." Multi-year and multi-team are the words that matter there. A senior engineer usually owns one team's goals for the next six months to a year.

**[PAUSE]**

**[Card beside you: "3 teams, 3 copies of the same customer data"]**

So let's say three teams each build their own copy of the same customer data. A senior engineer builds a really good copy for their own team. A staff engineer notices there are three copies. They design one shared table, and they get all three teams to agree to use it. And so the hard part isn't the code anymore. It's the decision.

**[PAUSE] [Graphic 3, full screen: "#1 System design", "#2 Coding", "How I stand out: data + AI infrastructure"]**

My plan follows the same idea, so it has a clear order of priorities. Number one is system design, because that's the skill that changes the most between senior and staff. Number two is coding, because you still have to pass the coding rounds. Nobody gets to skip those. And the way I plan to stand out is data and AI infrastructure. The AI companies are hiring data engineers to build the pipelines that feed their models, and I'll show you three of those jobs later.

**[PAUSE]**

### Part 2: The fifteen-week plan

**[PAUSE] [Graphic 4, full screen: the 15-week roadmap (roadmap-staff-de-16x9.png)]**

So here's the plan. It runs fifteen weeks, from September twenty-first to January third. Right now, I'm in week four. I've split the plan into four blocks.

**[PAUSE]**

#### Block one: The coding base (weeks 1 and 2)

**[Card beside you: "Weeks 1–2: Python, SQL, DSA"]**

Block one is the coding base, in weeks one and two. That's Python, SQL, and DSA. DSA just means data structures and algorithms, which are the coding puzzles big companies still ask, like merging a list of meetings that overlap. For pure data engineer jobs, the coding round is often lighter, with more lists and dictionaries than hard puzzles. But two of my three target jobs have "software engineer" in the title, so I'm preparing for the harder version. And because coding fades fast when you stop, I keep doing a few problems every week until the end.

#### Block two: Data systems (weeks 3 to 9)

**[PAUSE] [Graphic 5, full screen: weeks 3 to 9 highlighted on the roadmap, one line under each: "Kafka: moves events between systems as they happen", "Spark: splits huge data jobs across many machines", "Data architecture: how the whole platform fits together", "AWS: Amazon's cloud", "Kubernetes: runs your programs and restarts them when they crash"]**

Block two is data systems, in weeks three to nine. It's the biggest block, at seven weeks. Weeks three and four are distributed systems and Kafka. A distributed system just means many machines working as one, so if one machine dies, the work keeps going. Kafka is a tool that moves streams of events between systems as they happen, like every click on a website.

Weeks five and six are Spark, which is a tool that processes huge amounts of data by splitting the work across many machines. Weeks seven and eight are data architecture. Data architecture is how you design the whole platform: where data lands, how it's organised, and who gets to use it. Week nine is AWS and Kubernetes. AWS is Amazon's cloud. Kubernetes runs your programs across many machines and restarts them when they crash.

**[PAUSE]**

**[On camera]**

Block two gets seven weeks because staff design questions are built from exactly these pieces. Let's say an interviewer asks you to design a platform that takes in a million events a second. You need Kafka, Spark, and the architecture in your head at the same time. If one piece is weak, the whole design falls apart.

#### Block three: AI (weeks 10 to 12)

**[PAUSE] [Graphic 6, full screen: weeks 10 to 12 highlighted, with "ML basics: how models learn from data", "AI engineering: building products on top of large language models", "AI infrastructure: the data systems that feed and serve the model"]**

Block three is AI, in weeks ten to twelve. Week ten is machine learning basics, which is how models learn from data, like an inbox that learns which emails are spam. Week eleven is AI engineering. AI engineering means building products on top of large language models, which are the models behind ChatGPT, Claude, and Gemini. Week twelve is AI infrastructure, and this is where a data engineer really fits in. AI infrastructure just means the data systems around the model: the pipelines that feed it, the systems that serve it, and the checks that stop bad data from reaching it.

**[PAUSE]**

#### Block four: Getting ready to perform (weeks 13 to 15)

**[Card beside you: "Week 13: Debugging", "Weeks 14–15: Interview mode"]**

Block four is getting ready to perform, in weeks thirteen to fifteen. Week thirteen is debugging. Debugging practice means learning how you find and fix a broken system, like a pipeline that ran fine yesterday and is three hours late today. Weeks fourteen and fifteen are interview mode. Interview mode means full mock interviews, out loud, with a timer running. And I'm adding one practice round where I'm allowed to use AI, because some big companies, Meta included, have started testing coding interviews where you can use an AI assistant.

**[On camera]**

Now, fifteen weeks is tight. If something slips, I'm fine stretching the plan to twenty. The order matters more than the dates.

### Part 3: The numbers I'm aiming for

**[PAUSE] [Graphic 7, full screen: the six targets: "120–150 DSA problems", "40–50 advanced SQL problems", "15+ system designs", "20+ debugging scenarios", "10 stories from my own work", "1 real project: a distributed AI platform"]**

By January third, here's what I want done. That's one hundred twenty to one hundred fifty DSA problems and forty to fifty advanced SQL problems. It's fifteen or more system designs and twenty or more debugging scenarios. And it's ten stories from my own work, plus one real project, which is a distributed AI platform.

**[PAUSE]**

**[PAUSE] [Graphic 8, full screen: the weekly math, labelled "Let's say", one line at a time: "150 DSA ÷ 15 weeks = 10 a week = 2 a weekday", "45 SQL ÷ 15 weeks = 3 a week", "15 designs ÷ 15 weeks = 1 a week", "2 problems × 45 minutes = 1.5 hours a day = 7.5 hours a week", then "Average prep time in a 2025 study: about 6.5 hours a week, in total"]**

The targets sound like a lot, so let's do the math. A hundred fifty DSA problems over fifteen weeks is ten a week. That's two a day on weekdays. Forty-five SQL problems is three a week, and fifteen system designs is one a week. Now let's say a DSA problem takes you forty-five minutes. Two a day is an hour and a half, which is seven and a half hours a week on DSA alone. For comparison, a 2025 study of one hundred thirty-one people preparing for tech interviews found the average was about six and a half hours a week, in total. So yes, this plan is more than most people do. That's the point.

**[PAUSE]**

**[On camera]**

But look at which number matters most. It's not the hundred fifty problems. It's the fifteen system designs, because from the hiring side, the design round is usually what decides if you come in at senior or at staff. And they're data designs, not app designs. Think of a metrics platform a whole company trusts, rerunning a year of old data without breaking today's numbers, or handling events that show up three days late.

The twenty debugging scenarios are the ones most people skip. I think that's a mistake, because a staff engineer is the person the team calls when production breaks.

### Part 4: Building it in public

**[On camera]**

Now here's the part most people skip. I'm not just going to study DSA and Kafka. I'm going to build a project for each one and put it on GitHub. And so at the end, I have a portfolio anyone can open, not just a list of things I studied.

**[PAUSE] [Graphic 9, full screen: GitHub repos stacking up week by week: "dsa-practice", "kafka-events", "spark-jobs", then arrows from all three into "distributed-ai-platform"]**

Number one is the DSA repo. Every problem I solve goes in, with a short note on the pattern it uses. That way the repo shows the habit, not just the answers. Number two is the Kafka project. It's a small system that streams events, handles the same event arriving twice, and keeps running when a machine fails. The Spark work goes in the same way.

**[PAUSE]**

**[PAUSE] [Graphic 10, full screen: the distributed AI platform, built up one box at a time: "Kafka brings data in as it happens" → "Spark cleans and processes it" → "The AI layer turns it into something a model can search and answer from", all inside a box labelled "Running on Kubernetes"]**

Then all the pieces join into one real project, the distributed AI platform. Kafka brings data in as it happens. Spark cleans and processes it. The AI layer turns that data into something a model can search and answer from. And all of it runs on Kubernetes. So by January, my GitHub isn't fifteen random folders. It's one system I can walk an interviewer through, and that's exactly what a staff design round asks for.

**[PAUSE]**

### Part 5: The three jobs, and my resume

**[On camera]**

Next is the resume. I'm not writing it for "staff data engineer" in general. I'm writing it for three real jobs that are open right now, so let me show you them. The pay ranges are copied straight from the postings. They're base salary, which just means the pay before stock and bonus.

**[PAUSE] [Graphic 11, full screen: the Anthropic posting: "Staff+ Software Engineer, Data Infrastructure", "$405,000–$485,000 base salary", with three lines highlighted: "10+ years ... building data infrastructure", "Can set technical direction for a team, not just execute within it", "petabyte-scale data"]**

The first job is at Anthropic. It's called Staff Plus Software Engineer, Data Infrastructure, and the base salary is four hundred five to four hundred eighty-five thousand dollars a year. It asks for ten or more years building data infrastructure. And it says you should be able to "set technical direction for a team, not just execute within it." That one line is the difference between senior and staff, and the company wrote it down for you.

**[PAUSE] [Graphic 12, full screen: the OpenAI posting: "Software Engineer, Data Infrastructure", "$266K–$445K + equity", with three lines highlighted: "some of the largest Spark compute fleets in production", "streaming platforms on Kafka and Flink", "debugging large-scale distributed systems"]**

The second job is at OpenAI, and it's called Software Engineer, Data Infrastructure. The salary range is two hundred sixty-six to four hundred forty-five thousand, with equity on top. The posting talks about running some of the largest Spark systems in production, and streaming on Kafka and Flink. Flink is another streaming tool. The posting also asks for experience debugging large distributed systems. So this one job covers weeks three to six and week thirteen of my plan.

**[PAUSE] [Graphic 13, full screen: the Google posting: "Staff Software Engineer, AI Foundry Data Quality and Training Data", "$207K–$300K + 20% bonus target + equity", with three lines highlighted: "training data pipelines for Large Language Models", "hundreds of billions of documents", "2 years of experience in a people management, supervision/team leadership role"]**

The third job is at Google. It's called Staff Software Engineer, AI Foundry Data Quality and Training Data. The base is two hundred seven to three hundred thousand, plus a twenty percent bonus target and equity. The job is building the pipelines that clean training data for large language models, across hundreds of billions of documents. That's the AI infrastructure week of my plan. It also asks for two years of leading people. So read every line of a posting before you apply.

**[PAUSE]**

**[On camera]**

And notice something about those titles. Two of the three jobs aren't called "data engineer" at all. At the staff level, a lot of data jobs are called "software engineer, data infrastructure." If you only search for "data engineer," you'll miss them. In fact, if you search Google's careers site for "staff data engineer" right now, you get zero results.

**[PAUSE] [Graphic 14, full screen: what all three postings ask for, each mapped to the plan: "Python + SQL → weeks 1–2", "Spark and distributed processing → weeks 3–6", "Pipelines at huge scale + data modeling + data quality → weeks 7–8", "Cloud + Kubernetes → week 9", "Data for AI → weeks 10–12", "Debugging and reliability → week 13", "Setting direction + working across teams → your stories"]**

Now put the three postings side by side. They all want Python and SQL, Spark or something like it, pipelines built for huge scale, data modeling, data quality, and data for AI. And they all want someone who sets technical direction and works well with other teams. Every one of those maps to a week of the plan. The last one maps to your stories, and I'll get to those in a minute.

**[PAUSE]**

**[On camera]**

So here's how I'm rewriting my resume, in three rules.

**[Card beside you: "1 Match every requirement with proof", "2 Show the decision, not just the build", "3 Put the GitHub at the top"]**

Number one is to match every requirement with proof. If a posting asks for experience designing large data systems, I need a line that shows a system I designed, how big it was, and what changed because of it. If a requirement has no proof, that's a gap. And the plan has a week for it.

Number two is to show the decision, not just the build. A senior resume line says what you built. A staff resume line says what you decided, and who it changed things for.

**[PAUSE] [Graphic 15, full screen, labelled "Let's say": "Senior line: Built a Spark pipeline that processes 2 TB a day" then "Staff line: Designed a shared data model used by 4 teams, which removed 3 duplicate pipelines"]**

So let's say your resume says, "Built a Spark pipeline that processes two terabytes a day." That's a good senior line. A staff line sounds more like, "Designed a shared data model used by four teams, which removed three duplicate pipelines." It's the same engineer with the same skills. But the second line shows the decision and the reach.

**[PAUSE]**

Number three is to put the GitHub link right at the top. The projects from part four are proof that anyone can open and check.

### Part 6: Getting your stories right

**[On camera]**

And the last part is the one I think most people miss, which is getting your stories right. Every big company has a behavioral round. A behavioral round just means the interview where they ask about things you've actually done, like "Tell me about a time you disagreed with another team." And these questions take up a big part of the day. Amazon's own interview guide says each interviewer will typically ask two or three of them.

At staff level, the stories carry even more weight, because so much of the job is influence. And so I'm writing ten stories from my own work before I talk to a single recruiter.

**[PAUSE] [Graphic 16, full screen: the five parts of a story: "1 The situation", "2 The decision", "3 The trade-off", "4 The result", "5 What I'd do differently"]**

Every story gets the same five parts: the situation, the decision I made, the trade-off, the result, and what I'd do differently. A weak story is about what happened. A strong story is about what you decided, and why.

**[PAUSE]**

**[PAUSE] [Graphic 17, full screen: a grid of 10 stories × 5 question types, "Conflict", "Failure", "Influence", "Unclear problem", "Hard technical call", with ticks showing each story covers 2 or 3 types]**

And here's the trick. Each story should answer two or three different questions. Let's say you have a story about a pipeline that kept failing, and you had to convince another team to change their data. That one story answers "Tell me about a failure." It answers "Tell me about a conflict." And it answers "Tell me about a time you influenced people who don't report to you." So ten good stories can cover almost anything they ask. You'll hear people say you need thirty stories. I'd rather have ten deep ones that I can tell from three angles.

**[PAUSE]**

### Your turn

**[On camera]**

So here's your one task for this week. Write down one story from your own work, using those five parts. It'll take about thirty minutes. Most people won't do it. They think they'll remember the story in the interview, and then they ramble. If you write it down now, you're already ahead of them.

### Call to action

**[PAUSE] [CTA motion graphic, full screen: cta-blue.mp4]**

If you want help building your own plan, book a free fifteen-minute career call with me. The link is in the description. And if you want a structured path with real projects and feedback, the Stackle Data Engineering Masterclass is linked there too.

**[PAUSE]**

**[On camera]**

I'm in week four right now. Tell me in the comments: which week of this plan would be the hardest for you?

---

## Graphics list

1. **Graphic 1:** "Senior: hired for what you can build" beside "Staff: hired for what you can design".
2. **Graphic 2:** the Dropbox career framework, Staff Data Engineer: "I set the multi-year, multi-team technical and data strategy". Highlight "multi-year" and "multi-team".
3. **Graphic 3:** "#1 System design", "#2 Coding", "How I stand out: data + AI infrastructure".
4. **Graphic 4:** the 15-week roadmap, `stackle-video/graphics/roadmap-staff-de-16x9.png`. Reuse the timeline part, with the current block highlighted, at the start of each block in Part 2 (Graphics 5 and 6 are built this way).
5. **Graphic 5:** weeks 3 to 9 highlighted on the roadmap, with one line under each:
   - Kafka: moves events between systems as they happen
   - Spark: splits huge data jobs across many machines
   - Data architecture: how the whole platform fits together
   - AWS: Amazon's cloud
   - Kubernetes: runs your programs and restarts them when they crash
6. **Graphic 6:** weeks 10 to 12 highlighted, with "ML basics: how models learn from data", "AI engineering: building products on top of large language models" and "AI infrastructure: the data systems that feed and serve the model".
7. **Graphic 7:** the six targets: 120–150 DSA problems, 40–50 advanced SQL problems, 15+ system designs, 20+ debugging scenarios, 10 stories from my own work, 1 real project: a distributed AI platform. The bottom half of the roadmap image already has this layout.
8. **Graphic 8:** the weekly math, labelled "Let's say", one line at a time as Chris says it:
   - 150 DSA ÷ 15 weeks = 10 a week = 2 a weekday
   - 45 SQL ÷ 15 weeks = 3 a week
   - 15 designs ÷ 15 weeks = 1 a week
   - 2 problems × 45 minutes = 1.5 hours a day = 7.5 hours a week
   - Average prep time in a 2025 study: about 6.5 hours a week, in total
9. **Graphic 9:** GitHub repos stacking up week by week: "dsa-practice", "kafka-events", "spark-jobs", then arrows from all three into "distributed-ai-platform".
10. **Graphic 10:** the distributed AI platform, built one box at a time: "Kafka brings data in as it happens" → "Spark cleans and processes it" → "The AI layer turns it into something a model can search and answer from", all inside a box labelled "Running on Kubernetes".
11. **Graphic 11:** a screenshot of the Anthropic posting, "Staff+ Software Engineer, Data Infrastructure", "$405,000–$485,000". Highlight "10+ years ... building data infrastructure", "Can set technical direction for a team, not just execute within it" and "petabyte-scale".
12. **Graphic 12:** a screenshot of the OpenAI posting, "Software Engineer, Data Infrastructure", "$266K – $445K • Offers Equity". Highlight "some of the largest Spark compute fleets in production", "streaming platforms on Kafka and Flink" and "debugging large-scale distributed systems".
13. **Graphic 13:** a screenshot of the Google posting, "Staff Software Engineer, AI Foundry Data Quality and Training Data", "$207,000–$300,000 + 20% bonus target + equity". Highlight "training data pipelines for Large Language Models", "hundreds of billions of documents" and "2 years of experience in a people management, supervision/team leadership role".
14. **Graphic 14:** what all three postings ask for, each mapped to the plan:
    - Python + SQL → weeks 1–2
    - Spark and distributed processing → weeks 3–6
    - Pipelines at huge scale + data modeling + data quality → weeks 7–8
    - Cloud + Kubernetes → week 9
    - Data for AI → weeks 10–12
    - Debugging and reliability → week 13
    - Setting direction + working across teams → your stories
15. **Graphic 15:** labelled "Let's say": "Senior line: Built a Spark pipeline that processes 2 TB a day", then "Staff line: Designed a shared data model used by 4 teams, which removed 3 duplicate pipelines".
16. **Graphic 16:** the five parts of a story: 1 The situation, 2 The decision, 3 The trade-off, 4 The result, 5 What I'd do differently.
17. **Graphic 17:** a grid of 10 stories against five question types (Conflict, Failure, Influence, Unclear problem, Hard technical call), with ticks showing that each story covers two or three types.

**Cards beside you:**
- Opening: "Senior data engineer, Meta: about $220K base" → "Staff data jobs at AI companies: $350K–$400K+ base".
- "3 teams, 3 copies of the same customer data".
- "Weeks 1–2: Python, SQL, DSA".
- "Week 13: Debugging", "Weeks 14–15: Interview mode".
- The three resume rules: "1 Match every requirement with proof", "2 Show the decision, not just the build", "3 Put the GitHub at the top".

**Intro and CTA:** use `intro-blue.mp4` and `cta-blue.mp4` in `stackle-video/graphics/`. They are your usual intro and CTA animations, re-rendered in blue, white and yellow to match this video. The amber originals (`intro.mp4`, `cta.mp4`) are unchanged for your other videos. The roadmap images are in the same folder.

**Rendered graphics files** are in `stackle-video/graphics/staff-de/`. Every graphic is 1920×1080 and uses the Stackle video template from the intro and CTA (the faint grid, the slowly turning dashed ring, the spaced capital labels, pill chips and the brand bottom-left) in blue, white and yellow instead of brown, black and gold, with Plus Jakarta Sans. Each one comes three ways:
- `gNN-name.mp4`: the animated version, 30 fps, 6.5 to 13 seconds. The build-in finishes about 2 seconds before the end, so the editor can freeze the last frame for as long as Chris talks.
- `gNN-name.png`: the final frame as a still.
- `gNN-name-stepN.png`: one still per beat, for the graphics that build up as Chris speaks (Graphics 3, 5 to 13, and 15 to 17). Use these to cut on his words instead of letting the animation run.

| Graphic | File |
|---|---|
| 1 | g01-build-vs-design |
| 2 | g02-dropbox-staff-level |
| 3 | g03-priorities |
| 4 | g04-roadmap (the roadmap image, with the bars growing in) |
| 5 | g05-block-two-data-systems |
| 6 | g06-block-three-ai |
| 7 | g07-targets |
| 8 | g08-weekly-math |
| 9 | g09-github-repos |
| 10 | g10-ai-platform |
| 11 | g11-job-anthropic |
| 12 | g12-job-openai |
| 13 | g13-job-google |
| 14 | g14-postings-to-plan |
| 15 | g15-resume-lines |
| 16 | g16-story-parts |
| 17 | g17-story-grid |

The cards beside Chris are transparent PNGs (at 2x), to place on the right of the frame: `c1-opening-pay.png`, `c2-three-teams.png`, `c3-weeks-1-2.png`, `c4-weeks-13-15.png` and `c5-resume-rules.png`.

The source for every graphic is in `stackle-video/source/staff-de/`, one HTML file each. To change a word or a timing, edit the file and run `node render-all.js g08` (or `node render-all.js g08 --stills` for the PNGs only) from that folder.

**Take screenshots of the postings on the day you film.** Pay ranges and postings change, and the OpenAI posting first went up in June 2024.

**On-screen labels I shortened or made up (please check):**
- The one-line definitions on Graphics 5 and 6, which are shortened from the script.
- The legend on the roadmap image: "Coding + interviews", "Data systems", "AI".
- "How I stand out" on Graphic 3. Your post says "Data and AI infrastructure is how I stand out."
- The question types on Graphic 17.
- "Average prep time in a 2025 study" on Graphic 8.
- The repo names on Graphic 9, which are placeholders until you create the repos. The DSA repo line is shortened to "Every problem I solve, with a note on the pattern".
- The small labels at the top of each graphic, such as "Senior vs staff", "My priorities", "Job 1 of 3", "From the posting" and "In my plan", and the headings "Every project goes on GitHub", "Two resume lines" and "Each story answers 2 or 3 questions".
- "Where a data engineer really fits in" on Graphic 6, and "131 people, all prep, in total" on Graphic 8.
- On the cards: "Base salary, US", "own copy", "All 3 teams agree to use it", "The coding base", "Find and fix a broken system" and "One practice round where AI is allowed".
- "Story 2" to "Story 10" on Graphic 17, and which question types each one ticks. They show the idea, not your real stories.

All other on-screen text uses the script's words or quotes the postings exactly. The quotes on Graphics 11 to 13 are copied from the postings, with "…" where words are left out.

---

## Title

**Senior to Staff Data Engineer: My Exact 15-Week Plan** (52 characters)

Alternatives:
- "Staff Data Engineer Roadmap: My 15-Week Plan (Copy It)" (54 characters)
- "From Senior Data Engineer at Meta to Staff: My 15-Week Plan" (59 characters), if you want Meta in the title.

## Description

I'm a senior data engineer at Meta, and I'm studying to move up to staff. The staff-level data jobs I'm going after pay $350K–$400K or more in base salary. In this video, I show you my 15-week plan, the three real jobs I'm preparing for at Anthropic, OpenAI and Google, how I'm rewriting my resume for them, and how I'm getting my interview stories ready.

**Chapters**
0:00 Senior to staff: the pay and the plan
--:-- Why staff is a different job
--:-- The 15-week plan
--:-- Block 1: The coding base
--:-- Block 2: Data systems
--:-- Block 3: AI
--:-- Block 4: Debugging and interview mode
--:-- The numbers I'm aiming for
--:-- Building it in public on GitHub
--:-- The three jobs I'm preparing for
--:-- How I'm rewriting my resume
--:-- Getting your stories right
--:-- Your task this week

**Book a free 15-minute career call:** https://calendar.app.google/2HjLnF1HSov9m5Gk9
**Stackle Data Engineering Masterclass:** https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks

**Sources**
- Levels.fyi, Meta data engineer pay by level (pulled 15 Oct 2026): https://www.levels.fyi/companies/meta/salaries/software-engineer/title/data-engineer
- Anthropic, Staff+ Software Engineer, Data Infrastructure: https://job-boards.greenhouse.io/anthropic/jobs/5114768008
- Anthropic, Data Engineer, Product: https://job-boards.greenhouse.io/anthropic/jobs/5448481008
- OpenAI, Software Engineer, Data Infrastructure: https://jobs.ashbyhq.com/openai/f763c6b3-5167-4a67-b691-4c3fa2c44156
- Google, Staff Software Engineer, AI Foundry Data Quality and Training Data: https://www.google.com/about/careers/applications/jobs/results/82921090560467654-staff-software-engineer-ai-foundry-data-quality-and-training-data
- Dropbox career framework, Staff Data Engineer: https://dropbox.github.io/dbx-career-framework/ic5_staff_data_engineer.html
- Amazon, SDE II interview prep (behavioral questions): https://www.amazon.jobs/content/en/how-we-hire/sde-ii-interview-prep
- Interview prep time survey (arXiv, 2025): https://arxiv.org/abs/2507.02068
- Meta tests AI-assisted coding interviews (Business Today, 31 Jul 2025): https://www.businesstoday.in/technology/news/story/meta-to-test-job-applicants-with-ai-assisted-coding-interviews-amid-ai-expansion-plans-487200-2025-07-31

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab

---

## Things I added that you did not give me (please check)

1. **The pay is framed as base salary everywhere, including on the roadmap image.** Levels.fyi shows Meta senior data engineers averaging about $219K base but about $355K in total pay (E5), and staff (E6) averaging about $527K in total pay. "$220K" only works as base salary. If you meant total pay, the numbers need to change, because $350K–$400K would be about what a Meta senior already makes in total. For the LinkedIn post, I'd write "Senior Data Engineer: $220K base".
2. **Naming Meta, and naming Anthropic and OpenAI as targets.** You asked for this, so it's in the hook. Your own script rules say never to name your employer, so before posting, check Meta's policy on outside activity and social media. Also keep internal systems, project names and numbers out of the stories and resume examples on screen. If you'd rather say "a big tech company", change the first sentence and the opening card, and drop "Meta included" in Block four.
3. **"The staff-level data jobs I'm going after at AI companies pay three hundred fifty to four hundred thousand in base salary, and some pay more."** This is supported by the posted ranges (Anthropic $320K–$405K and $405K–$485K, OpenAI $266K–$445K). The Google role pays less in base ($207K–$300K plus bonus and equity), which is why the line says "at AI companies".
4. **The three jobs are real and open as of 15 October 2026, but check them again on the day you film.** The OpenAI posting first went up in June 2024, and Google's page shows no posting date. The Google role also asks for two years of people management. The script points this out rather than claiming you have it.
5. **Lines in your voice that need your OK:**
   - "After years on the hiring side, the simplest way I can put it is this."
   - "From the hiring side, the design round is usually what decides if you come in at senior or at staff."
   - "A staff engineer is the person the team calls when production breaks."
   - "If something slips, I'm fine stretching the plan to twenty." (You said "15 to 20 weeks" in your note.)
   - "I'm writing ten stories from my own work before I talk to a single recruiter."
   - "I'd rather have ten deep ones that I can tell from three angles."
   - "I'm adding one practice round where I'm allowed to use AI."
6. **Examples I made up**, all as "let's say" or general examples, with no invented people:
   - the three teams with three copies of customer data;
   - the merging-meetings DSA problem;
   - the "billion rows a day" pipeline and the "million events a second" design question;
   - the three data designs (metrics platform, rerunning a year of data, late events);
   - the resume before-and-after lines;
   - the failing-pipeline story.
7. **The project details are my suggestion, not yours.** The repo names, the Kafka project (duplicates and machine failures), and the shape of the distributed AI platform (Kafka → Spark → AI layer, on Kubernetes) need your OK. Change them to match what you actually build.
8. **The five story parts** (situation, decision, trade-off, result, what I'd do differently) and "each story answers two or three questions" are my framework.
9. **Estimates, not sources:** 45 minutes per DSA problem and 30 minutes to write one story.
10. **The intro keeps the interviews sentence,** because this is a career video.
11. **The roadmap image:** I couldn't see your $120K to $200K image, so I built it from your description: white, blue, black and yellow, Plus Jakarta Sans, and joinstackle.com in the footer. Your script skill's colours are amber and charcoal, but your request wins. I added a "build vs design" line and the priority strip to the image. If you can share the old image, I'll match it more closely.
12. **What the research says the plan doesn't cover yet.** Each would make a good follow-up video in a "week 4 of 15" series:
    - how to get the interview (referrals, recruiters, asking for the staff loop);
    - how "staff" maps across companies (Amazon has no staff title; its L7 is principal);
    - whether staff is worth it, which is a loud thread in the comments.
13. **The holidays.** Weeks 14 and 15 (interview mode) fall on 21 December to 3 January.
14. **Length:** about 16 minutes. To get to about 14, cut these, in this order:
    - the "Block two gets seven weeks" paragraph (about 60 words);
    - the prep-time study comparison on Graphic 8 (about 45 words);
    - the "thirty stories" line (about 25 words);
    - the Dropbox paragraph and Graphic 2 (about 75 words);
    - the Google zero-results line (about 25 words);
    - the AI-assisted round line (about 35 words).
