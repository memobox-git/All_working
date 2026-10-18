# The 5 Levels of AI Agents: Script

**Title:** The 5 Levels of AI Agents (Explained Simply)

**Spoken words:** about 1,250 · **Estimated length:** about 8 to 9 minutes at 150 words a minute

**Type:** Simple concept video for a general audience. Five levels of AI, the same task at every level.

**Style:** Alex Hormozi's real speaking style (see `skills/hormozi-style`), like the AI PM script: "In this video I am going to...", then each level as a numbered point. Each point is a short rule, then why, then a "let's say" example, then one short line to land it. Sentences flow like someone talking to a friend, with "And so", "right?" and "just means". The words stay simple.

**Research date:** 17 October 2026

### Before filming
1. **Run the task on each level for real.** If what happens is different from the script, change the line to match. Those lines are marked [check against your run].
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
- **Our angle:** five levels instead of three, the same job-search task at every level, the cost maths out loud, and one question to tell a real agent from a fake one.

### Source for every number and fact in the script
| Fact in script | Source | Date |
|---|---|---|
| Gartner thinks only about 130 of the thousands of companies selling AI agents are real ("agent washing") | Gartner press release, "Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027", gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027. The page blocks our tools (403), so the wording comes from the search index and coverage that quotes it (Silicon.eu, Outlook Business). | 25 Jun 2025 |
| An agent decides its own steps, uses tools, and keeps going until the job is done | Anthropic, "Building effective agents" (agents "dynamically direct their own processes and tool usage"); Anthropic, "Effective context engineering for AI agents" ("LLMs autonomously using tools in a loop") | 19 Dec 2024; 29 Sep 2025 |
| An automation follows steps a person set up | Same Anthropic post: workflows follow "predefined code paths" | 19 Dec 2024 |
| A team of agents: a lead agent splits the work between helper agents | Anthropic, "How we built our multi-agent research system" | 13 Jun 2025 |
| One agent uses about 4 times the tokens of a chat, a team about 15 times | Same Anthropic post | 13 Jun 2025 |
| The "one cent a chat" price is a "let's say" number, not a real price. 15 cents × 365 days = $54.75, about $55 a year | Worked out in the script | — |
| Some AI apps can run a task on a schedule | OpenAI Help Center, "Tasks in ChatGPT", help.openai.com/en/articles/10291617 | checked 17 Oct 2026 |
| Have the agent ask before risky steps | Anthropic, "Building effective agents" (agents "pause for human feedback at checkpoints") | 19 Dec 2024 |

### Lines Chris should check
- **The interviews sentence in the intro.** The script rules say to ask before using it in a concept video. Keep it or cut it.
- **"The people who stood out sounded like themselves"** near the end is your experience, so confirm it.
- **The friend who hasn't read the news** at Level 1 is my comparison.
- **Zapier and n8n** are named at Level 3 as examples.
- **Which masterclass** to name in the call to action.

---

## Script

### Hook

**[On camera]**

Almost every AI app calls itself an agent right now, and most of them aren't. Gartner, the research firm, thinks only about one hundred thirty of the thousands of companies selling AI agents are the real thing.

### Promise

**[On camera]**

In this video I am going to show you the five levels of AI, from a simple chatbot all the way to a team of agents. And I'm going to give every level the same task, so you can see exactly what each one does, and you can tell a real agent from a fake one in about five seconds.

### Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

**[Graphic 1, full screen]** Five boxes: "Level 1: Chatbot", "Level 2: Chatbot with tools", "Level 3: Automation", "Level 4: Agent" and "Level 5: Team of agents". Under them, the task: "Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each."

*[pause]*

So here's the task I'm giving all five levels: find me five jobs I should apply to this week, and tell me what to change in my resume for each one. Most of you have done this by hand, and it takes forever, right? So let's see which level can actually do it for you.

*[pause]*

### Level 1: The chatbot

**[Card beside you]** Level 1: The chatbot. It answers from what it already knows.

Level one is the chatbot. A chatbot just means an AI you type to, and it answers from what it already learned. If you think about it, it's like asking a really smart friend who hasn't read the news in months. They know a lot, but they don't know what happened this week.

**[Graphic 2, full screen]** Screen recording with web search off: the task goes in, and general tips come out.

*[pause]*

So let's say I switch web search off and give it my task. It can't see a single job posted this week, so it gives me general tips, like "update your skills section" and "search on LinkedIn". [check against your run] That's not wrong, but it's not what I asked for either.

*[pause]*

**[On camera]**

And so a chatbot is great at explaining things. It just can't see your world.

### Level 2: The chatbot with tools

**[Card beside you]** Level 2: The chatbot with tools. It can look things up.

Level two is the chatbot with tools. A tool just means something the AI can use besides its own memory, like web search, or a file you upload. Most chat apps do this by themselves now.

**[Graphic 3, full screen]** Screen recording with search on and the resume uploaded: five real job links appear.

*[pause]*

So I switch search back on, upload my resume, and give it the same task. Now it comes back with five real jobs and real links, which is a big jump, right? But then I'm the one opening every link, checking if the job is still open, comparing it with my resume, and typing the next question. [check against your run]

*[pause]*

**[On camera]**

So the chatbot found the information. But I'm still doing the work.

### Level 3: Automation

**[Card beside you]** Level 3: Automation. It follows the steps you set.

Level three is automation. An automation just means steps you set up once, and they run the same way every time. You can build one with no code, in tools like Zapier or n8n.

**[Graphic 4, full screen]** Four boxes in a row: "8 a.m. every day" → "Read job alert emails" → "AI scores each job against your resume" → "Add to a spreadsheet".

*[pause]*

So let's say I set one up for my job search. Every morning at eight, it reads my job alert emails, the AI scores each one against my resume, and it drops them into a spreadsheet. I wake up, and the list is just there. That's great, and it's cheap, because it does the exact same thing every day.

*[pause]*

**[On camera]**

But it only does the steps I gave it. So if a job asks for something new, like a portfolio link, the automation doesn't stop and think about it. It just skips that job, or it breaks. And so the AI is doing one step in the middle, but I'm still the one who decided every step.

### Level 4: The agent

**[Card beside you]** Level 4: The agent. It decides its own steps.

Level four is the agent, and this is where everything changes. An AI agent just means an AI that decides its own steps, uses tools, and keeps going until the job is done. You don't give it steps. You give it a goal.

**[Graphic 5, full screen]** The agent's real run, with a label on each step: "Search job sites", "Open each post", "Compare with the resume", "Job closed? Find another" and "Write the plan".

*[pause]*

So I give the agent the same task, plus one rule: ask me before you fill in or send anything. And then I just watch. It searches a few job sites. It opens each post and reads it against my resume. When a job is already closed, it skips it and goes looking for another one. And at the end, it gives me five jobs and exactly what to change in my resume for each. [check against your run]

*[pause]*

**[On camera]**

Nobody told it those steps. At levels one, two and three, a person decides the next step. At level four, the AI does. That's the difference.

### Level 5: A team of agents

**[Card beside you]** Level 5: A team of agents. It splits the work and runs on its own.

Level five is a team of agents. A team of agents just means one lead agent that splits a big job into pieces and hands each piece to a helper agent. And you can set it to run on a schedule, so you don't even have to start it.

**[Graphic 6, full screen]** A clock at 8 a.m. A lead agent with three helpers: "Find new jobs", "Check each job against your resume" and "Double-check the work". An arrow points to "Your morning report".

*[pause]*

So let's say I set my task to run every morning. One helper finds new jobs, another compares them with my resume, and a third checks the work, so it catches a job that's already closed or pays too little. And at eight in the morning, the report is just sitting there waiting for me.

*[pause]*

**[Graphic 7, full screen]** The maths, line by line, with a small "Let's say" label: "1 chat = 1¢" → "1 agent = about 4×, so 4¢" → "A team = about 15×, so 15¢" → "Every day for a year: 15¢ × 365 = about $55". Source line: "Anthropic, 2025".

But more agents means more cost, so let's do the math. Anthropic, the company behind Claude, found that one agent uses about four times as many tokens as a normal chat, and a team uses around fifteen times as many. A token just means a small piece of a word, and you pay for every one. So let's say one chat costs you one cent. One agent is four cents, and the team is fifteen cents. Run that every morning for a year, and that's roughly fifty-five dollars. Is that worth it to find the right job? Probably. Is it worth it to plan your lunch? Probably not.

*[pause]*

**[On camera]**

So use the lowest level that gets the job done.

### The five levels

**[Graphic 8, full screen]** The five boxes again, each with one line: "Chatbot: answers from what it knows", "Chatbot with tools: looks things up", "Automation: follows your steps", "Agent: decides its own steps" and "Team of agents: splits the work and runs on its own".

*[pause]*

So that's the five levels. The chatbot answers from what it knows. The chatbot with tools can look things up. The automation follows your steps. The agent decides its own steps. And the team of agents splits the work and runs on its own.

*[pause]*

**[Card beside you]** Who decides the next step?

And so the next time an app tells you it's an agent, ask one question: who decides the next step? If you do, it's not an agent. If the AI does, it is. That's it.

### One rule

**[On camera]**

And if you use an agent, give it one rule: ask me before you send, buy, or delete anything. Because an AI that can act on its own can also make a mistake on its own, and you want to catch that before it happens, not after.

**[On camera]** *(Chris to confirm.)*

And please don't let an agent apply to jobs for you. I've interviewed more than two hundred engineers, and the people who stood out sounded like themselves, not like everyone else. So let the agent find the jobs and tell you what to fix. Then you write the application, and you press send.

### Your turn

**[Graphic 9, full screen]** The task to copy: "Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each. Show me the link for each job. Ask me before you fill in or send anything."

*[pause]*

**[On camera]**

So here's what I want you to do this week. Open any AI app that has an agent mode, and give it this exact task. It's in the description too. Then check every link it gives you. Most people will watch this and never try it. The people who try it once will understand agents better than anyone who only watched.

### Call to action

**[On camera]**

If you want help planning your next move into AI, the first link in the description books a free fifteen-minute call with me.

**[On camera]** *(Chris to confirm which masterclass to name.)*

And if you want to learn to build agents step by step, the Stackle AI Engineering Masterclass is linked in the description too.

**[On camera]**

And tell me in the comments: which level of AI do you use most right now, one, two, three, four or five?

---

## Graphics list

There are 9 full-screen graphics. Graphic 1, the five boxes, is built once and reused at the start of each level with that level's box lit, and again as Graphic 8 with one line under each box.

1. **The five boxes:** "Level 1: Chatbot", "Level 2: Chatbot with tools", "Level 3: Automation", "Level 4: Agent" and "Level 5: Team of agents", with the task underneath.
2. **Level 1:** screen recording with web search off.
3. **Level 2:** screen recording with search on and the resume uploaded, showing five real job links.
4. **Level 3:** "8 a.m. every day" → "Read job alert emails" → "AI scores each job against your resume" → "Add to a spreadsheet".
5. **Level 4:** the agent's real run, labelled "Search job sites", "Open each post", "Compare with the resume", "Job closed? Find another" and "Write the plan".
6. **Level 5:** a clock at 8 a.m., a lead agent with three helpers ("Find new jobs", "Check each job against your resume" and "Double-check the work"), and an arrow to "Your morning report".
7. **The maths:** "1 chat = 1¢" → "1 agent = about 4×, so 4¢" → "A team = about 15×, so 15¢" → "Every day for a year: 15¢ × 365 = about $55". A small "Let's say" label so nobody reads one cent as a real price, and the source line "Anthropic, 2025".
8. **The five levels:** the five boxes, each with its one line from the script.
9. **The task to copy,** word for word.

**Cards beside you:** one for each level, word for word from the script, and "Who decides the next step?".

**Shortened on-screen labels:** the step labels in Graphics 4, 5 and 6, and the maths lines in Graphic 7. Every number matches the script.

**Style:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

**Thumbnail ideas:**
1. The five boxes with "LEVEL 4: AGENT" lit, Chris pointing at it, and "5 LEVELS OF AI" in large text.
2. "MOST AI AGENTS ARE FAKE", with Chris and the five boxes behind him.

---

## YouTube title

The 5 Levels of AI Agents (Explained Simply)

(44 characters.) Other options: "AI Agents Explained Simply: The 5 Levels of AI" (46) or "Most AI Agents Are Fake: The 5 Levels Explained" (47).

## YouTube description

Almost every AI app calls itself an agent right now, and most of them aren't. In this video, I show you the five levels of AI, from a simple chatbot to a team of agents, and I give every level the same task, so you can see exactly what each one does and tell a real agent from a fake one.

Chapters
0:00 Most AI agents aren't agents
0:00 Level 1: The chatbot
0:00 Level 2: The chatbot with tools
0:00 Level 3: Automation
0:00 Level 4: The agent
0:00 Level 5: A team of agents
0:00 The one question to ask
0:00 Your task for this week

The task from the video, to copy:
Find me 5 jobs I should apply to this week, and tell me what to change in my resume for each. Show me the link for each job. Ask me before you fill in or send anything.

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks
Stackle AI Engineering Masterclass: [link to add]

Sources
- Agent washing (Gartner, June 2025): https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
- Building effective agents (Anthropic, 2024): https://www.anthropic.com/engineering/building-effective-agents
- How we built our multi-agent research system (Anthropic, 2025): https://www.anthropic.com/engineering/multi-agent-research-system

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
