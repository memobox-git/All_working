# Senior to Staff Data Engineer, My 15-Week Plan: script

{{HEADER}}

---

{{BRIEF}}

---

## Script

### Opening

**[On camera]**

I'm a senior data engineer at Meta, where the average base salary at my level is about two hundred twenty thousand dollars a year. The staff-level data jobs I'm going after at AI companies pay three hundred fifty to four hundred thousand in base salary, and some pay more. So I'm studying for that jump right now. In this video, I'm going to show you my fifteen-week plan, the three real jobs I'm preparing for, how I'm rewriting my resume for them, and how I'm getting my interview stories ready. You can copy all of it.

**[Card beside you: "Senior data engineer, Meta: about $220K base" → "Staff data jobs at AI companies: $350K–$400K+ base"]**

### Intro

**[PAUSE] [Intro motion graphic, full screen: intro.mp4]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[PAUSE]**

### Part 1: Why staff is a different job

**[On camera]**

So let's start with why this jump is so big, because staff isn't the same job with a bigger number. I've interviewed a lot of engineers, and the simplest way I can put it is this. Senior gets you hired for what you can build. Staff gets you hired for what you can design.

**[PAUSE] [Graphic 1, full screen: "Senior: hired for what you can build" beside "Staff: hired for what you can design"]**

A senior data engineer takes a hard problem and builds it well, like a pipeline that moves a billion rows a day without breaking. A staff data engineer decides how all the pipelines should fit together, across many teams, before anyone writes the code.

**[PAUSE] [Graphic 2, full screen: Dropbox career framework, "Staff Data Engineer: I set the multi-year, multi-team technical and data strategy"]**

And you don't have to take my word for it. Dropbox publishes its engineering levels online, and its staff data engineer level says, "I set the multi-year, multi-team technical and data strategy." Multi-year and multi-team are the words that matter there. A senior engineer usually owns one team's goals for the next six months to a year.

**[PAUSE]**

**[Card beside you: "3 teams, 3 copies of the same customer data"]**

So let's say three teams each build their own copy of the same customer data. A senior engineer builds a really good copy for their own team. A staff engineer notices there are three copies. They design one shared table, and they get all three teams to agree to use it. And so the hard part isn't the code anymore. It's the decision.

**[PAUSE] [Graphic 3, full screen: "#1 System design", "#2 Coding", "How I stand out: data + AI infrastructure"]**

And so my plan has a clear order of priorities. Number one is system design, because that's the skill that changes the most between senior and staff. Number two is coding, because you still have to pass the coding rounds. Nobody gets to skip those. And the way I plan to stand out is data and AI infrastructure. The AI companies are hiring data engineers to build the pipelines that feed their models, and I'll show you three of those jobs later.

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

Block four is getting ready to perform, in weeks thirteen to fifteen. Week thirteen is debugging. Debugging practice means learning how you find and fix a broken system, like a pipeline that ran fine yesterday and is three hours late today. Weeks fourteen and fifteen are interview mode. Interview mode means full mock interviews, out loud, with a timer running.

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

But look at which number matters most. It's not the hundred fifty problems. It's the fifteen system designs, because from the hiring side, the design round is usually what decides if you come in at senior or at staff. And the twenty debugging scenarios are the ones most people skip. I think that's a mistake, because a staff engineer is the person the team calls when production breaks.

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

The first one is at Anthropic. It's called Staff Plus Software Engineer, Data Infrastructure, and the base salary is four hundred five to four hundred eighty-five thousand dollars a year. It asks for ten or more years building data infrastructure. And it says you should be able to "set technical direction for a team, not just execute within it." That one line is the difference between senior and staff, and the company wrote it down for you.

**[PAUSE] [Graphic 12, full screen: the OpenAI posting: "Software Engineer, Data Infrastructure", "$266K–$445K + equity", with three lines highlighted: "some of the largest Spark compute fleets in production", "streaming platforms on Kafka and Flink", "debugging large-scale distributed systems"]**

The second one is at OpenAI, and it's called Software Engineer, Data Infrastructure. The salary range is two hundred sixty-six to four hundred forty-five thousand, with equity on top. The posting talks about running some of the largest Spark systems in production, and streaming on Kafka and Flink. Flink is another streaming tool. The posting also asks for experience debugging large distributed systems. So this one job covers weeks three to six and week thirteen of my plan.

**[PAUSE] [Graphic 13, full screen: the Google posting: "Staff Software Engineer, AI Foundry Data Quality and Training Data", "$207K–$300K + 20% bonus target + equity", with three lines highlighted: "training data pipelines for Large Language Models", "hundreds of billions of documents", "2 years of experience in a people management, supervision/team leadership role"]**

The third one is at Google. It's called Staff Software Engineer, AI Foundry Data Quality and Training Data. The base is two hundred seven to three hundred thousand, plus a twenty percent bonus target and equity. The job is building the pipelines that clean training data for large language models, across hundreds of billions of documents. That's the AI infrastructure week of my plan. It also asks for two years of leading people. So read every line of a posting before you apply.

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

And here's the trick. Each story should answer two or three different questions. Let's say you have a story about a pipeline that kept failing, and you had to convince another team to change their data. That one story answers "Tell me about a failure." It answers "Tell me about a conflict." And it answers "Tell me about a time you influenced people who don't report to you." So ten good stories can cover almost anything they ask.

**[PAUSE]**

### Your turn

**[On camera]**

So here's your one task for this week. Write down one story from your own work, using those five parts. It'll take about thirty minutes. Most people won't do it. They think they'll remember the story in the interview, and then they ramble. If you write it down now, you're already ahead of them.

### Call to action

**[PAUSE] [CTA motion graphic, full screen: cta.mp4]**

If you want help building your own plan, book a free fifteen-minute career call with me. The link is in the description. And if you want a structured path with real projects and feedback, the Stackle Data Engineering Masterclass is linked there too.

**[PAUSE]**

**[On camera]**

I'm in week four right now. Tell me in the comments: which week of this plan would be the hardest for you?

---

{{TAIL}}
