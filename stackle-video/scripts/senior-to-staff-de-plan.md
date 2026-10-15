# Senior to Staff Data Engineer, My 15-Week Plan: script

DRAFT, numbers and job postings pending research.

## Script

### Opening

**[On camera]**

A staff data engineer in the US can earn {{STAFF_PAY}} a year, and a senior data engineer earns about {{SENIOR_PAY}}. I'm a senior data engineer at Meta, and I'm studying for that jump right now. In this video, I'm going to show you my exact fifteen-week plan, the three jobs I'm preparing for, how I'm rewriting my resume for them, and how I'm getting my interview stories ready. And you can copy all of it.

### Intro

**[PAUSE] [Intro motion graphic, full screen: intro.mp4]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[PAUSE]**

### Part 1: Why staff is a different job

**[On camera]**

So let's start with why this jump is so big, because staff isn't the same job with a bigger number. I've been on the hiring side for years, and the simplest way I can put it is this. Senior gets you hired for what you can build. Staff gets you hired for what you can design.

**[PAUSE] [Graphic 1, full screen: "Senior: hired for what you can build" beside "Staff: hired for what you can design"]**

A senior data engineer is someone who takes a hard problem and builds it well, like a pipeline that moves a billion rows a day without breaking. A staff data engineer decides how all the pipelines should fit together, across many teams, before anyone writes the code. {{LADDER_QUOTE}}

**[PAUSE]**

**[Card beside you: "3 teams, 3 copies of the same customer data"]**

So let's say three teams each build their own copy of the same customer data. A senior engineer builds a really good copy for their own team. A staff engineer notices there are three copies, designs one shared table all three can use, and gets all three teams to agree on it. And so the work moves from writing the code to making the decision.

**[PAUSE] [Graphic 2, full screen: "#1 System design", "#2 Coding", "How I stand out: data + AI infrastructure"]**

And that's why my plan has a clear order of priorities. Number one is system design, because that's the skill that changes the most between senior and staff. Number two is coding, because you still have to pass the coding rounds, and nobody skips those. And the way I plan to stand out is data and AI infrastructure, because {{AI_INFRA_REASON}}.

**[PAUSE]**

### Part 2: The fifteen-week plan

**[PAUSE] [Graphic 3, full screen: the 15-week roadmap, 16:9 version (roadmap-staff-de-16x9.png)]**

So here's the plan. It runs fifteen weeks, from September twenty-first to January third, and right now I'm in week four. I've split it into four blocks, and I'll take you through them in order.

**[PAUSE]**

#### Block one: The coding base (weeks 1 and 2)

**[Card beside you: "Weeks 1–2: Python, SQL, DSA"]**

Block one is the coding base, in weeks one and two, and it's Python, SQL, and DSA. DSA just means data structures and algorithms, which are the coding puzzles most big companies still ask, like merging a list of meetings that overlap. I put coding first because it fades fast when you stop. And so I start the daily habit in week one, and I keep doing a few problems every week until the end.

#### Block two: Data systems (weeks 3 to 9)

**[PAUSE] [Graphic 4, full screen: weeks 3 to 9 highlighted on the roadmap, with one line under each: "Kafka: moves events between systems as they happen", "Spark: splits huge data jobs across many machines", "Data architecture: how the whole platform fits together", "AWS: Amazon's cloud", "Kubernetes: runs and restarts your programs across many machines"]**

Block two is data systems, in weeks three to nine, and it's the biggest block, at seven weeks. Weeks three and four are distributed systems and Kafka. A distributed system just means many machines working as one, so if one machine dies, the work keeps going. Kafka is a tool that moves streams of events between systems as they happen, like every click on a website.

Weeks five and six are Spark. Spark is a tool that processes huge amounts of data by splitting the work across many machines. Weeks seven and eight are data architecture, which is how you design the whole platform: where data lands, how it's organised, and who gets to use it. And week nine is AWS and Kubernetes. AWS is Amazon's cloud, and Kubernetes is a tool that runs your programs across many machines and restarts them when they crash.

**[PAUSE]**

**[On camera]**

Block two gets seven weeks because this is what staff system design questions are made of. If an interviewer asks you to design a platform that handles a million events a second, you need Kafka, Spark, and the architecture all in your head at the same time.

#### Block three: AI (weeks 10 to 12)

**[PAUSE] [Graphic 5, full screen: weeks 10 to 12 highlighted, with "ML basics: how models learn from data", "AI engineering: building products on top of large language models", "AI infrastructure: the data systems that feed and serve AI"]**

Block three is AI, in weeks ten to twelve. Week ten is machine learning basics, which is how models learn from data, like an inbox that learns which emails are spam. Week eleven is AI engineering, which means building products on top of large language models, the models behind tools like ChatGPT, Claude, and Gemini. And week twelve is AI infrastructure, which is where a data engineer really fits in. AI infrastructure just means the data systems around the model: the pipelines that feed it data, the systems that serve it, and the checks that stop bad data from reaching it.

**[PAUSE]**

#### Block four: Getting ready to perform (weeks 13 to 15)

**[Card beside you: "Week 13: Debugging", "Weeks 14–15: Interview mode"]**

Block four is getting ready to perform, in weeks thirteen to fifteen. Week thirteen is debugging, which means practising how you find and fix a broken system, like a pipeline that ran fine yesterday and is three hours late today. Weeks fourteen and fifteen are interview mode, which means full mock interviews, out loud, with a timer running.

**[On camera]**

And to be honest, fifteen weeks is tight, and if something slips, I'm fine stretching it to twenty. The order matters more than the dates.

### Part 3: The numbers I'm aiming for

**[PAUSE] [Graphic 6, full screen: the six targets: "120–150 DSA problems", "40–50 advanced SQL problems", "15+ system designs", "20+ debugging scenarios", "10 stories from my own work", "1 real project: a distributed AI platform"]**

By January third, here's what I want done. That's one hundred twenty to one hundred fifty DSA problems, forty to fifty advanced SQL problems, fifteen or more system designs, twenty or more debugging scenarios, ten stories from my own work, and one real project, which is a distributed AI platform.

**[PAUSE]**

**[PAUSE] [Graphic 7, full screen: the weekly math, labelled "Let's say": "150 DSA ÷ 15 weeks = 10 a week = 2 a weekday", "45 SQL ÷ 15 weeks = 3 a week", "15 designs ÷ 15 weeks = 1 a week", "2 problems × 45 minutes = 1.5 hours a day"]**

Now those numbers sound like a lot, so let me do the math with you. A hundred fifty DSA problems over fifteen weeks is ten a week, which is two a day on weekdays. Forty-five SQL problems is three a week, and fifteen system designs is one a week. Let's say a DSA problem takes you forty-five minutes. Two a day is an hour and a half, and that's very doable, right? It just has to happen every day.

**[PAUSE]**

**[On camera]**

And look at which number is the highest priority. It's not the hundred fifty problems. It's the fifteen system designs, because that's the skill staff interviews weigh the most. {{DESIGN_WEIGHT_SOURCE}} The twenty debugging scenarios are the ones most people skip, and I think that's a mistake, because a staff engineer is the person a team calls when production breaks.

### Part 4: Building it in public

**[On camera]**

Now here's what I'm doing differently this time. I'm not just going to study DSA and Kafka. I'm going to build a project around each one and put it on GitHub, so at the end I have a portfolio I can show, not just a list of things I studied.

**[PAUSE] [Graphic 8, full screen: GitHub repos stacking up week by week: "dsa-practice", "kafka-events", "spark-jobs", then all three arrows pointing into "distributed-ai-platform"]**

Number one is the DSA repo. Every problem I solve goes in, with a short note on the pattern it uses, so the repo shows the habit, not just the answers. Number two is the Kafka project, which is a small system that streams events, handles the same event arriving twice, and keeps going when a machine fails. And the Spark work goes in the same way.

**[PAUSE]**

**[PAUSE] [Graphic 9, full screen: the distributed AI platform: "Kafka brings data in as it happens" → "Spark cleans and processes it" → "AI layer turns it into something a model can search and answer from" → "All running on Kubernetes"]**

And then the pieces join into the one real project, the distributed AI platform. Kafka brings data in as it happens, and Spark cleans and processes it. The AI layer turns that data into something a model can search and answer from, and all of it runs on Kubernetes. And so by January, my GitHub isn't fifteen random folders. It's one system I can walk an interviewer through, which is exactly what a staff design round asks you to do.

**[PAUSE]**

### Part 5: The three jobs, and my resume

**[On camera]**

Next is the resume, and I didn't want to write it for "staff data engineer" in general. I'm writing it for three real jobs, so let me show you them.

{{JOBS}}

**[PAUSE] [Graphic 13, full screen: what all three postings ask for: {{OVERLAP}}]**

{{OVERLAP_PARAGRAPH}}

**[On camera]**

So here's how I'm rewriting my resume, in three rules.

**[Card beside you: "1 Match every requirement with proof", "2 Show the decision, not just the build", "3 Link the GitHub"]**

Number one is to match every requirement with proof. If a posting asks for experience designing large data systems, my resume needs a line that shows a system I designed, how big it was, and what changed because of it. If a requirement has no line of proof, that's a gap, and the plan has a week for it.

Number two is to show the decision, not just the build. A senior resume line says what you built. A staff resume line says what you decided, and who it changed things for.

**[PAUSE] [Graphic 14, full screen: "Senior line: Built a Spark pipeline that processes 2 TB a day" then "Staff line: Designed a shared data model used by 4 teams, which cut 3 duplicate pipelines and saved $X a month" (labelled "Let's say")]**

So let's say your resume says, "Built a Spark pipeline that processes two terabytes a day." That's a good senior line. A staff line sounds more like, "Designed a shared data model used by four teams, which removed three duplicate pipelines." Same engineer, same skills, but the second line shows the decision and the reach.

**[PAUSE]**

Number three is to link the GitHub. The projects from part four go right at the top, because they prove the skills my day job might not show, like AI infrastructure.

### Part 6: Getting your stories right

**[On camera]**

And the last part is the one I think most people miss, which is getting your stories right. Every big company has a behavioral round. A behavioral round just means the interview where they ask about things you've actually done, like "Tell me about a time you disagreed with another team." {{BEHAVIORAL_SOURCE}}

**[On camera]**

At staff level, these stories carry a lot of weight, because the job is mostly influence. And so I'm writing ten stories from my own work before I talk to a single recruiter.

**[PAUSE] [Graphic 15, full screen: the five parts of a story: "1 The situation", "2 The decision", "3 The trade-off", "4 The result", "5 What I'd do differently"]**

Every story gets the same five parts: the situation, the decision I made, the trade-off, the result, and what I'd do differently. A weak story is about what happened. A strong story is about what you decided and why.

**[PAUSE]**

**[PAUSE] [Graphic 16, full screen: a grid of 10 stories × 5 question types: "Conflict", "Failure", "Influence without authority", "Unclear problem", "Hard technical call", with ticks showing each story covers 2 or 3 types]**

And here's the trick. Each story should answer two or three different questions. Let's say you have a story about a pipeline that kept failing, where you had to convince another team to change their data. That one story answers "Tell me about a failure", "Tell me about a conflict", and "Tell me about influencing without authority." And so ten good stories can cover almost any question they ask.

**[PAUSE]**

### Your turn

**[On camera]**

So here's your one task for this week. Write down one story from your own work using those five parts: the situation, the decision, the trade-off, the result, and what you'd do differently. It'll take you about thirty minutes. Most people won't do it, because they think they'll remember the story in the interview, and then they ramble. If you write it now, you're already ahead.

### Call to action

**[PAUSE] [CTA motion graphic, full screen: cta.mp4]**

If you want help building your own plan, book a free fifteen-minute career call with me, and the link is in the description. And if you want a structured path with real projects and feedback, the Stackle Data Engineering Masterclass is linked there too.

**[PAUSE]**

**[On camera]**

I'm in week four right now. Tell me in the comments, which week of this plan would be the hardest for you?
