# The 5 Levels of AI Agents: Script

**Title:** AI Agents Explained Simply: The 5 Levels of AI

**Spoken words:** about 900 · **Estimated length:** about 6 minutes at 150 words a minute

**Type:** Simple concept video for a general audience. Five levels of AI, one task, and the same pattern for every level: what it is, what it does with the task, and what it can't do.

**Research date:** 17 October 2026

### Before filming
1. **Run the task on each level for real.** If what happens is different from the script, change the line to match. The lines to check are marked [check against your run].
2. **Use a sample resume,** not a real person's.
3. **For Level 1, switch web search off,** because most chat apps search the web by themselves now.

---

## Research brief

### How the research was done
Chrome was not connected in this cloud session, so the research used yt-dlp and web search. YouTube was searched for five phrases ("AI agents explained", "what are AI agents", "levels of AI agents", "AI agents for beginners" and "AI agents clearly explained"), and the eight biggest or newest explainers were picked. All eight transcripts were read in full, plus the 150 top comments on the biggest video. Numbers were pulled on 17 October 2026.

### The videos

| # | Creator | Subscribers | Title | Link | Views | Uploaded | Length |
|---|---|---|---|---|---|---|---|
| 1 | Jeff Su | 1.93M | AI Agents, Clearly Explained | youtube.com/watch?v=FwOTs4UxQS4 | 5,445,678 | 8 Apr 2025 | 10:09 |
| 2 | Futurepedia | not shown | From Zero to Your First AI Agent in 25 Minutes (No Coding) | youtube.com/watch?v=EH5jx5qPabU | 4,405,838 | 21 May 2025 | 25:57 |
| 3 | IBM Technology (Maya Murad) | 1.82M | What are AI Agents? | youtube.com/watch?v=F8NKVhkZZWI | 1,789,596 | 15 Jul 2024 | 12:28 |
| 4 | Tina Huang | 1.35M | AI Agents Fundamentals In 21 Minutes | youtube.com/watch?v=qU3fmidNbJE | 1,617,372 | 16 Feb 2025 | 21:27 |
| 5 | Vendasta | 53K | AI Agents Explained Like You're 5 | youtube.com/watch?v=wazHMMaiDEA | 869,710 | 25 Sep 2024 | 7:10 |
| 6 | codebasics | 1.58M | Generative AI vs AI agents vs Agentic AI | youtube.com/watch?v=O2gerCxEXvc | 710,893 | 30 Jun 2025 | 10:09 |
| 7 | Tech With Tim | 2.1M | AI Agents Explained - What Is an AI Agent and how to build one? (Real Examples, Not Hype) | youtube.com/watch?v=ZvDkJsKE80k | 459,478 | 16 Jul 2026 | 21:34 |
| 8 | Jeff Su | 1.93M | Personal Agents, Clearly Explained | youtube.com/watch?v=HdI_aYzgJIg | 169,202 | 13 Oct 2026 | 15:20 |

### What the research says
- **Simple wins.** The biggest video, Jeff Su's, is 10 minutes and uses three levels (LLM, AI workflow, AI agent). Its top comment (1,600 likes) is happy to find "a tech video that isn't either AI slop or a bloody college course".
- **Viewers want one real example.** One comment asks for the video "on a case study basis... We understand actual examples better". Jeff Su uses a different example at every level. Our script uses one task the whole way through.
- **What all of them cover:** an agent uses tools, decides its own steps, and keeps going until the job is done. A fixed workflow is not an agent, even when it uses AI. Our script covers both.
- **Where they get it wrong:**
  - Tech With Tim says a chatbot "can't search the web" (1:10), but most chat apps can now. That is why our script has a separate level for the chatbot with tools.
  - Futurepedia calls a scheduled email "definitely not an agent" (1:12), then calls the same kind of thing an agent (8:38). Our one question, "who decides the next step?", clears this up.
- **Our angle:** five levels instead of three, the same job-search task at every level, and one question to tell a real agent from a renamed chatbot.

### Source for every fact in the script
| Fact in script | Source | Date |
|---|---|---|
| An agent decides its own steps, uses tools, and keeps going until the job is done | Anthropic, "Building effective agents" (agents "dynamically direct their own processes and tool usage"); Anthropic, "Effective context engineering for AI agents" ("LLMs autonomously using tools in a loop") | 19 Dec 2024; 29 Sep 2025 |
| An automation follows steps a person set up | Same Anthropic post: workflows follow "predefined code paths" | 19 Dec 2024 |
| A team of agents: a lead agent splits the work between helper agents | Anthropic, "How we built our multi-agent research system" | 13 Jun 2025 |
| More agents cost more (one agent uses about 4 times the tokens of a chat, a team about 15 times) | Same Anthropic post | 13 Jun 2025 |
| Some AI apps can run a task on a schedule | OpenAI Help Center, "Tasks in ChatGPT", help.openai.com/en/articles/10291617 | checked 17 Oct 2026 |
| Have the agent ask before risky steps | Anthropic, "Building effective agents" (agents "pause for human feedback at checkpoints") | 19 Dec 2024 |

### Lines Chris should check
- **The interviews sentence in the intro.** The script rules say to ask before using it in a concept video. Keep it or cut it.
- **"The people who stand out sound like themselves"** near the end is your experience, so confirm it.
- **Zapier and n8n** are named at Level 3 as examples.
- **Which masterclass** to name in the call to action.

---

## Script

### Hook

**[Graphic 1, full screen]** Cold open, about 10 seconds: the Level 4 agent at work, sped up, ending on its list of five jobs.

*[pause]*

**[On camera]**

A chatbot tells you what to do. An AI agent does it for you.

### Promise

**[On camera]**

In this video I am going to show you the five levels of AI, from a simple chatbot to a team of agents. I'll give all five the same task, so you can see exactly what each one does, and what makes an agent different.

### Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

### The five levels

**[Graphic 2, full screen]** Five boxes: "Level 1: Chatbot", "Level 2: Chatbot with tools", "Level 3: Automation", "Level 4: Agent" and "Level 5: Team of agents". Under them, the task: "Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each."

*[pause]*

So there are five levels: a chatbot, a chatbot with tools, an automation, an agent, and a team of agents. And every level gets the same task: find me five jobs I should apply to this week, and tell me what to change in my resume for each.

*[pause]*

### Level 1: Chatbot

**[Card beside you]** Level 1. A chatbot just means an AI you type to, and it answers from what it already knows.

Level one is the chatbot. A chatbot just means an AI you type to, and it answers from what it already knows.

**[Graphic 3, full screen]** Screen recording with web search off: the task goes in, and the answer comes out.

*[pause]*

Most chat apps can search the web now, so for this test I turned search off. Then I gave it the task. The chatbot can't find this week's jobs, because it only knows what it learned months ago. So it gives me general tips instead. [check against your run]

*[pause]*

**[On camera]**

So a chatbot is good for writing and explaining. But it can't see what's happening today.

### Level 2: Chatbot with tools

**[Card beside you]** Level 2. A tool just means something the AI can use, like web search or a file you upload.

Level two is the chatbot with tools. A tool just means something the AI can use, like web search or a file you upload.

**[Graphic 4, full screen]** Screen recording with search on and the resume uploaded: five real job links appear.

*[pause]*

So I turn search on, and I upload my resume. Now it finds five real jobs with real links. That's much better. But I still open every link, I check every job, and I ask every next question. [check against your run]

*[pause]*

**[On camera]**

So a chatbot with tools gives you better answers. But you still do the work, one question at a time.

### Level 3: Automation

**[Card beside you]** Level 3. An automation just means steps a person sets up once, and they run the same way every time.

Level three is automation. An automation just means steps a person sets up once, and they run the same way every time. You can build one with no code, in tools like Zapier or n8n.

**[Graphic 5, full screen]** Four boxes in a row: "8 a.m. every day" → "Read job alert emails" → "AI scores each job against your resume" → "Add to a spreadsheet".

*[pause]*

Let's say I set up an automation for my job search. Every morning at eight, it reads my job alert emails. The AI scores each one against my resume, and the automation puts them in a spreadsheet. I don't type anything.

*[pause]*

**[On camera]**

But an automation only follows the steps I set. If a job asks for something new, like a portfolio link, the automation can't work out what to do. It just skips that job.

### Level 4: Agent

**[Card beside you]** Level 4. An AI agent just means an AI that decides its own steps and keeps going until the job is done.

Level four is the agent. An AI agent just means an AI that decides its own steps, uses tools, and keeps going until the job is done. You give it the goal, and it works out the steps.

**[Graphic 6, full screen]** The cold-open run, slowed down, with a label on each step: "Search job sites", "Open each post", "Compare with the resume", "Job closed? Find another" and "Write the plan".

*[pause]*

So I give the agent the same task. It searches job sites. It opens each post and reads it against my resume. If a job is closed, it skips it and finds another one. Then it gives me five jobs, and what to change in my resume for each. Nobody told it those steps. [check against your run]

*[pause]*

**[On camera]**

And that's the big difference. At levels one to three, a person decides the next step. At level four, the AI decides.

### Level 5: Team of agents

**[Card beside you]** Level 5. A team of agents just means one lead agent that splits the work between helper agents.

Level five is a team of agents. That just means one lead agent splits the work and gives each part to a helper agent. And a team like this can run on a schedule, without you starting it.

**[Graphic 7, full screen]** A clock at 8 a.m. A lead agent with three helpers: "Find new jobs", "Check each job against your resume" and "Double-check the work". An arrow points to "Your morning report".

*[pause]*

Let's say I set my task to run every morning. One helper finds new jobs. Another helper checks each one against my resume. And a third one checks the work, so a closed job or a low salary gets caught. At eight, the report is waiting for me.

*[pause]*

**[On camera]**

So a team of agents can do bigger jobs. But more agents cost more money, so use a team only when one agent isn't enough.

### The five levels in one picture

**[Graphic 8, full screen]** The five boxes again, each with one line: "Chatbot: answers", "Chatbot with tools: answers with real information", "Automation: follows your steps", "Agent: decides its own steps" and "Team of agents: splits big jobs and runs on its own".

*[pause]*

So here are the five levels again. A chatbot answers. A chatbot with tools answers with real information. An automation follows your steps. An agent decides its own steps. And a team of agents splits big jobs and runs on its own.

*[pause]*

**[Card beside you]** Who decides the next step?

So when an app says it's an "agent", ask one question: who decides the next step? If a person does, it's not an agent. If the AI does, it is.

### One rule

**[On camera]**

And one rule when you use an agent: make it ask you before it sends, buys, or deletes anything.

**[On camera]** *(Chris to confirm.)*

And please don't let an agent apply to jobs for you. Let it find the jobs and tell you what to fix. Then you write the application, and you press send. From the hiring side, the people who stand out sound like themselves, not like an AI.

### Your turn

**[Graphic 9, full screen]** The task to copy: "Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each. Show me the link for each job. Ask me before you fill in or send anything."

*[pause]*

**[On camera]**

So here's your task for this week. Give this exact task to an AI app that has an agent mode. It's in the description too. Then check every link it gives you.

### Call to action

**[On camera]**

If you want help planning your next move into AI, the first link in the description books a free fifteen-minute call with me.

**[On camera]** *(Chris to confirm which masterclass to name.)*

And if you want to learn to build agents step by step, the Stackle AI Engineering Masterclass is linked in the description too.

**[On camera]**

And tell me in the comments: which level of AI do you use most right now, one, two, three, four or five?

---

## Graphics list

There are 9 full-screen graphics. Graphic 2, the five boxes, is built once and reused at the start of each level with that level's box lit, and again as Graphic 8 with one line under each box.

1. **Cold open:** the Level 4 agent at work, sped up, ending on its list of five jobs.
2. **The five boxes:** "Level 1: Chatbot", "Level 2: Chatbot with tools", "Level 3: Automation", "Level 4: Agent" and "Level 5: Team of agents", with the task underneath.
3. **Level 1:** screen recording with web search off.
4. **Level 2:** screen recording with search on and the resume uploaded, showing five real job links.
5. **Level 3:** "8 a.m. every day" → "Read job alert emails" → "AI scores each job against your resume" → "Add to a spreadsheet".
6. **Level 4:** the cold-open run, slowed down, labelled "Search job sites", "Open each post", "Compare with the resume", "Job closed? Find another" and "Write the plan".
7. **Level 5:** a clock at 8 a.m., a lead agent with three helpers ("Find new jobs", "Check each job against your resume" and "Double-check the work"), and an arrow to "Your morning report".
8. **The five levels in one picture:** the five boxes, each with its one line from the script.
9. **The task to copy,** word for word.

**Cards beside you:** one for each level with its "just means" line, and "Who decides the next step?".

**Shortened on-screen labels:** the step labels in Graphics 5, 6 and 7. Everything else uses the script's words.

**Style:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

**Thumbnail ideas:**
1. The five boxes with "LEVEL 4: AGENT" lit, Chris pointing at it, and "5 LEVELS OF AI" in large text.
2. "CHATBOT vs AGENT", with a chat bubble on the left and a finished list of five jobs on the right.

---

## YouTube title

AI Agents Explained Simply: The 5 Levels of AI

(46 characters.) Other options: "What Is an AI Agent? The 5 Levels, Explained Simply" (51) or "AI Agents Explained: I Gave One Task to 5 Levels of AI" (54).

## YouTube description

A chatbot tells you what to do. An AI agent does it for you. In this video, I show you the five levels of AI, from a simple chatbot to a team of agents, and I give all five the same task so you can see exactly what makes an agent different.

Chapters
0:00 Chatbot vs agent
0:00 Level 1: Chatbot
0:00 Level 2: Chatbot with tools
0:00 Level 3: Automation
0:00 Level 4: Agent
0:00 Level 5: Team of agents
0:00 The five levels in one picture
0:00 Your task for this week

The task from the video, to copy:
Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each. Show me the link for each job. Ask me before you fill in or send anything.

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks
Stackle AI Engineering Masterclass: [link to add]

Sources
- Building effective agents (Anthropic, 2024): https://www.anthropic.com/engineering/building-effective-agents
- How we built our multi-agent research system (Anthropic, 2025): https://www.anthropic.com/engineering/multi-agent-research-system

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
