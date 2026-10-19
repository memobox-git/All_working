# Build an AI Agent: Script

**Title:** How to Build an AI Agent in Python (and What Isn't an Agent)

**Spoken words:** about 2,480 · **Estimated length:** about 16 to 17 minutes at 150 words a minute

**Type:** Explainer plus a live build. It explains what an AI agent is and the two things that get called agents but aren't, then builds a real agent in Python with no framework. The same question and the same real data run through all three: one AI call, a workflow, and the agent.

**Style:** Alex Hormozi's real speaking style (see `skills/hormozi-style`), like the 5 Levels of AI Agents script: "In this video I am going to...", numbered points, "X just means Y", one "let's say" calculation done out loud, and a short line to land each part. Sentences are medium length, with contractions, and the English stays simple.

**Research date:** 19 October 2026

**The code:** `stackle-video/code/build-an-ai-agent/`, with a README that has the setup steps. It needs an Anthropic API key. The data is about 3 million real New York taxi trips from January 2024, which are free from the city's Taxi and Limousine Commission (TLC). `get_data.py` downloads them.

### Before filming

1. **Run the three files for real, in order, with the same question.** Lines marked [check against your run] describe what the run should show. A model doesn't give the same answer twice, so if your run is different, change the line to match what happened.
2. **The hook depends on the workflow's run.** Run `step2_workflow.py` two or three times. If the query it writes already leaves out zones with very few trips, use the backup lines below for the hook and Graphic 6.
3. **Run `agent.py` two or three times** and film the clearest run. Then update Graphics 13, 14, 15 and 16 with its real steps, numbers and cost.
4. **Never film your API key.** Set it before you start recording.
5. **Use a large terminal font** and a dark editor theme, so the screen recordings match the Stackle colours.
6. **The model is Claude Opus 5.5.** To make each run cheaper, switch `MODEL` to `claude-sonnet-5-5` and change the price line at the bottom of `agent.py` to $2 and $10. Then change the cost lines in the script too.

**Backup lines, if the workflow's query is already careful:**

- **Hook:** "The New York taxi zone with the biggest average tip in January 2024 had one taxi ride in the whole month. And if your AI only gets to run one query, it can hand you that as the answer."
- **Graphic 6 paragraph:** "And when I run the workflow, the query looks careful. It guessed a rule to leave out small zones, and the answer looks fine. But the AI picked that rule before it saw a single row, and if the guess had been wrong, nothing in the workflow could notice. Here's what the same question gives you without that rule: the top zone is Charleston/Tottenville, with fifty-eight dollars and seventy-five cents, from one taxi ride."

---

## Research brief

### How the research was done

Chrome was not connected in this cloud session, so the research used yt-dlp and web search, the same way as the 5 Levels of AI Agents script. YouTube was searched for six phrases: "build an AI agent", "how to build an AI agent", "build AI agent from scratch python", "AI agent tutorial for beginners", "what is an AI agent and what is not" and "build your first AI agent". Eight videos were picked: the most-viewed builds, the newest, and the biggest AI and data-engineering creators. All eight transcripts were read in full, and top comments were read for four of them. YouTube rate-limited the normal client, so everything came through yt-dlp's embedded-player client. The numbers are exact yt-dlp output from 19 October 2026. YouTube rounds subscriber counts.

The pure explainers from the 5 Levels video (Jeff Su, IBM, Tina Huang, Vendasta, codebasics, and Tech With Tim's "AI Agents Explained") were left out on purpose, so that this brief covers building.

### The videos

| # | Creator | Subscribers | Title | Link | Views | Uploaded | Length |
|---|---|---|---|---|---|---|---|
| 1 | Futurepedia (with AI Agent Lab) | 760K | From Zero to Your First AI Agent in 25 Minutes (No Coding) | youtube.com/watch?v=EH5jx5qPabU | 4,413,980 | 21 May 2025 | 25:57 |
| 2 | KodeKloud | 473K | Don't learn AI Agents without Learning these Fundamentals | youtube.com/watch?v=ZaPbP9DwBOE | 1,363,976 | 21 Oct 2025 | 56:39 |
| 3 | Tech With Tim | 2.1M | Build an AI Agent From Scratch in Python - Tutorial for Beginners | youtube.com/watch?v=bTMPwUgLZf0 | 962,449 | 14 Mar 2025 | 34:19 |
| 4 | Google Cloud Tech (Smitha Kolan) | 1.46M | AI agents explained: Build your first agent in 8 minutes | youtube.com/watch?v=Zqno_vux6d8 | 581,822 | 10 Jun 2026 | 8:29 |
| 5 | Dave Ebbelaar | 301K | Building AI Agents in Pure Python - Beginner Course | youtube.com/watch?v=bZzyPscbtI8 | 468,828 | 1 Feb 2025 | 46:44 |
| 6 | freeCodeCamp.org (Lane Wagner, Boot.dev) | 11.9M | Guide to Agentic AI – Build a Python Coding Agent with Gemini | youtube.com/watch?v=YtHdaXuOAks | 322,049 | 3 Sep 2025 | 2:14:23 |
| 7 | Cal Hyslop | 30.2K | I Wish Someone Had Explained What an 'AI Agent' Actually Is (in under 7 Minutes) | youtube.com/watch?v=orx8LLG1_hI | 297,037 | 14 Aug 2026 | 6:57 |
| 8 | Tech With Tim | 2.1M | Building AI Agents in Pure Python - Beginner Course | youtube.com/watch?v=c9AnqCeyxbI | 233,296 | 30 Aug 2026 | 37:24 |

### How each one is built

| # | What it builds | Tools used | When the first agent works | How it defines an agent |
|---|---|---|---|---|
| 1 | A 5 a.m. trail-run recommender that sends an email | n8n with no code, OpenAI's gpt-4o-mini, calendar, weather and air-quality APIs | about 24:00, after two errors | "a system that can reason, plan, and take actions on its own" (0:33) |
| 2 | A company document assistant, shown in hosted labs | LangChain, LangGraph, ChromaDB, MCP | about 48:00 | "autonomy, memory, and tools" (7:00) |
| 3 | A research assistant that saves a .txt file | LangChain with Claude or GPT | first tool call at about 28:30 | not defined |
| 4 | A blog writer with checker agents that retry up to three times | Google's Agent Development Kit (ADK) | about 7:30 | "doesn't just answer, it can decide and take action" (0:20) |
| 5 | A calendar assistant, plus chaining, routing and guardrail patterns | OpenAI SDK, GPT-4o, no framework | first tool call at about 13:00. It never shows a loop where the model picks the next step | avoids the word: "AI agents or rather AI systems" (0:30) |
| 6 | A coding agent that fixes a calculator bug | Google's Gemini SDK, no framework | about 2:06:30 | "it can do things within a loop" (5:30) |
| 7 | Nothing. Three questions to test whether something is an agent | — | — | "Can it keep going without you?" and two more questions |
| 8 | A 160-line coding agent that builds a snake game | OpenAI SDK, GPT-5 mini, no framework | about 27:00 | "We have a model, we have tools, and then we have a loop." (0:30) |

### What all of them cover (our script covers all of it)
- An agent is a model plus tools working toward a goal, compared with a chatbot that gives one answer.
- The model only writes text. Your code runs the tool and sends the result back (said directly in #5, #6 and #8).
- The agent's memory is the list of messages you send each time.
- Setup basics: an API key, a name and description for each tool, and a system prompt.

### Where they are wrong, out of date, or disagree
- **The published code no longer runs.** The repo for #3 (962K views) is set to `claude-3-5-sonnet-20241022`, which Anthropic retired on 28 October 2025. #2 uses Claude 3 Sonnet, retired on 21 July 2025 (Anthropic model deprecations page). The research also found announced shutdown dates for OpenAI's GPT-4o (#1, #5) and the GPT-5 mini snapshot (#8), but I could not confirm those on OpenAI's own page, so the script doesn't use them. That is why our script puts the model name on one line and says why.
- **Old library calls.** #3 uses LangChain's `AgentExecutor`, which LangChain v1 moved to a legacy package, and viewers point this out in the comments.
- **Wrong numbers in #2:** "1 million tokens is roughly 7,500 words" (3:02). By the video's own ratio of three-quarters of a word per token, it is about 750,000 words. #2 also says MCP was "released back in November 2022" (49:01), but Anthropic launched it in November 2024.
- **They disagree on what counts as an agent:**
  - #1 says a scheduled AI summary is "still not an agent" (1:00).
  - #7 calls a scheduled news brief an agent (3:50).
  - #5 calls a prompt chain "what you could call an agent system" (30:30), while the Anthropic article it is based on calls that a workflow.

  Our one question, "who decides the next step?", settles all three, and the script says plainly that running on a schedule doesn't make something an agent.
- **"From scratch" means different things.** #3 says "from scratch" and uses LangChain. #8 means no framework at all.
- **The loop has no stop rule in #8.** It can loop "an indefinite amount of time". #6 stops at 20 steps. Anthropic recommends stopping conditions such as a maximum number of steps. Our agent stops at 15.

### What viewers said in the comments
- **"Is this really an agent?"** On #3: "Definitely the term 'from scratch' has shifted in meaning over time" (384 likes), and "What makes this an ai agent versus a workflow?"
- **Cost worries:** "the number one bottleneck becomes token cost" (194 likes, #2), and "How much did it cost to use that API…?" (#8). Nobody shows a real cost. #1 says "costs under a penny" and #3 says "1 cent at most", and both are guesses.
- **Too fast:** "Guy is faster than flash" (87 likes, #2).
- **Asked for:** guardrails and security, memory, RAG and MCP.
- **Liked:** no hype, and real errors shown and fixed on screen.

### The gaps, and our angle
- **No data task.** None of the eight queries a real database. The closest are a 3-record JSON file (#5) and a fake in-memory database (#2).
- **No safety for data.** Nobody uses a read-only database or asks before writing. Only #6 has a step limit.
- **No real cost.** Nobody prints what a run actually cost.
- **No side-by-side test.** Nobody builds the same task as a workflow and then as an agent, even though the creators disagree on where the line is.
- **Our angle:** one data question, real public data, and the same question run three ways (one call, a workflow and an agent), so the viewer sees the workflow give a wrong answer and the agent catch it. The agent is built by hand in about 120 lines, with the safety rules in the database itself, a step limit, a yes/no before saving, and the real cost printed at the end.

### Source for every number and fact in the script

| Fact in script | Source | Date |
|---|---|---|
| About 3 million trips (2,964,624) in January 2024 | TLC Trip Record Data, `yellow_tripdata_2024-01.parquet`, counted with DuckDB | counted 19 Oct 2026 |
| Charleston/Tottenville: 1 trip, $58.75 average tip. New Dorp/Midland Beach: 2 trips, $21.81. Great Kills: 1 trip, $18.58 | Same file. Average `tip_amount` by pickup zone, all payment types, joined to the TLC zone list | counted 19 Oct 2026 |
| Cash tips aren't recorded | TLC yellow taxi data dictionary: "Cash tips are not included." | 18 Mar 2025 |
| About 15% of trips paid in cash (439,191 of 2,964,624, or 14.8%) | Same file, `payment_type = 2` | counted 19 Oct 2026 |
| JFK: $12.39 average tip over 103,470 card trips. LaGuardia: $10.26 over 75,208 | Same file, card payments only (`payment_type = 1`), zones with at least 1,000 card trips. The agent picks its own rule, so its numbers can differ slightly | counted 19 Oct 2026 |
| Agents are LLMs using tools in a loop, based on what comes back | Anthropic, "Building effective agents": agents "are typically just LLMs using tools based on environmental feedback in a loop" | 19 Dec 2024 |
| A workflow follows steps written in code | Same article: workflows are "orchestrated through predefined code paths" | 19 Dec 2024 |
| Use the simplest solution that works | Same article: "finding the simplest solution possible, and only increasing complexity when needed" | 19 Dec 2024 |
| A stop rule, such as a maximum number of steps | Same article: "stopping conditions (such as a maximum number of iterations)" | 19 Dec 2024 |
| The model never runs your code. Your code runs the tool and sends the result back | Anthropic, "Tool use with Claude": Claude "returns a structured call that your application executes" | checked 19 Oct 2026 |
| OpenAI and Google models can call tools too | OpenAI, "Function calling" guide; Google, "Function calling with the Gemini API" | checked 19 Oct 2026 |
| Anthropic's Python library has a tool runner that handles the loop | Anthropic, "Tool use with Claude" (Tool Runner) | checked 19 Oct 2026 |
| Popular tutorials broke because their model was retired | Tech With Tim's repo uses `claude-3-5-sonnet-20241022`, retired 28 Oct 2025 (Anthropic model deprecations page) | checked 19 Oct 2026 |
| Claude Opus 5.5 costs $4 per million tokens in and $20 per million out | Anthropic, Claude API pricing page | checked 19 Oct 2026 |
| 40,000 tokens in and 4,000 out, about 24¢ | A "let's say" example, not a measured run. 40,000 × $4 ÷ 1,000,000 = $0.16, and 4,000 × $20 ÷ 1,000,000 = $0.08. Replace it with your run's numbers | — |
| About 120 lines of Python | `agent.py` and `tools.py`, counting lines of code without comments | counted 19 Oct 2026 |
| `DELETE FROM trips` fails in read-only mode | Tested on DuckDB 1.5.6: "Cannot execute statement of type "DELETE" on database "taxi" which is attached in read-only mode!" | tested 19 Oct 2026 |

### Lines Chris should check
- **The interviews sentence in the intro.** This is a tool video, so keep it or cut it.
- **The GitHub and interview line near the end** is about your experience, so confirm it.
- **Every [check against your run] line,** especially the hook (see "Before filming", point 2).
- **Zapier, n8n, LangGraph, CrewAI and the Claude Agent SDK** are named as examples.
- **Which masterclass to name** in the call to action, and its link.
- **The refusal fallback in the code.** Each API call has two extra lines, `fallbacks="default"` and its `betas` entry. If Claude declines a request, they retry it on another Claude model. You can delete them to make the code on screen shorter, but then a declined request just stops.
- **The thinking-updates setting** in `agent.py` (`display: "updates"` and its beta flag) prints the agent's short notes between steps, like "Checking the payment types." The run is much easier to follow on screen with it, so keep it.

---

## Script

### Hook

**[On camera]**

I asked an AI where taxi drivers in New York get the best tips, and it told me about a neighborhood where the average tip is fifty-eight dollars. That neighborhood had one taxi ride in the whole month. [check against your run]

### Promise

**[On camera]**

In this video I am going to show you what an AI agent really is, and what it isn't. Then we're going to build an agent in Python, from scratch, with no framework. And we'll give it that same question, so you can watch it catch that mistake by itself.

### Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

**[Graphic 1, full screen]** The plan, five boxes: "1. What an agent is", "2. What is not an agent", "3. Build it in 4 parts", "4. Run it" and "5. Three safety rules". Under them: "The question: Where do taxi drivers in New York get the best tips?" and "The data: 2,964,624 real taxi trips, January 2024".

*[pause]*

So here's the plan. First, what an agent is. Second, the two things that aren't agents, and I'll build both so you can see where they break. Then we build the real thing in four parts, we run it, and I'll give you three safety rules so it can't break anything. And the whole way through, we use one question and real data: almost three million New York taxi trips from January 2024, which the city gives away for free.

*[pause]*

### Part 1: What an AI agent is

**[Card beside you]** An AI agent decides its own next step, uses a tool to take it, and keeps going until the job is done.

An AI agent just means an AI that decides its own next step, uses a tool to take that step, and keeps going until the job is done. Anthropic, the company behind Claude, describes agents as LLMs that use tools in a loop, based on what comes back each time. An LLM, or large language model, just means the AI model that reads and writes text, like the ones inside ChatGPT, Claude and Gemini.

If you think about it, that's exactly what you do when your manager asks you a data question. You look at the tables. You run a query. You see something weird in the result, so you run another query. And you only answer when you trust the numbers. Nobody gives you those steps in advance, right? You decide them as you go.

**[Graphic 2, full screen]** The loop: "Question" → "The model picks a tool" → "Your code runs the tool" → "The result goes back to the model", with an arrow back to "The model picks a tool", and a way out: "No tool needed? Answer."

*[pause]*

And so an agent works the same way, in a loop. The model reads the question and picks a tool. Your code runs it and sends the result back. Then the model reads the result and picks the next tool, or it decides it's done and answers. That loop is the whole idea.

*[pause]*

**[On camera]**

So an agent isn't a smarter model. It's the same model, with tools and a loop.

### Part 2: What is not an AI agent

**[On camera]**

Now, a lot of things get called agents that aren't, so let me show you the two most common ones. I'm going to build both of them, because watching them fail is the fastest way to understand what an agent fixes.

**[Card beside you]** Not an agent, number one: one question, one answer.

Number one is a single call. A single call just means you send the model one question, and it sends back one answer. That's how most people use AI every day, and it's useful. But nothing happens after the answer.

**[Graphic 3, full screen]** Screen recording: `step1_one_call.py`, the whole file.

*[pause]*

The first file is about fifteen lines of code. I connect to the model, I send my question, and I print whatever comes back.

*[pause]*

**[Graphic 4, full screen]** Screen recording: the run. General advice about airports and Manhattan, and a SQL query with table names the model guessed.

So I run the single call, and the model tells me tips are usually higher at the airports and in Manhattan, and it even writes me a SQL query, with table names it guessed. [check against your run] That sounds smart, right? But it never saw my data. It's answering from what it learned in training, and it can't run the query either.

*[pause]*

**[On camera]**

So a single call can explain things. It just can't look at anything.

**[Card beside you]** Not an agent, number two: a workflow.

Number two is a workflow, which just means steps that you write in code, where the AI fills in some of them. Tools like Zapier and n8n build the same thing with no code, and it still counts as a workflow when one step uses AI.

**[Graphic 5, full screen]** Screen recording: `step2_workflow.py`, with each step highlighted in turn: "Step 1 (code): get the tables" → "Step 2 (AI): write one query" → "Step 3 (code): run it" → "Step 4 (AI): explain the result".

*[pause]*

So here's my workflow. My code gets the list of tables, the AI writes one SQL query, my code runs that query, and the AI explains the result. That's four steps, in the same order, every single time.

*[pause]*

**[Graphic 6, full screen]** The real result table: "Charleston/Tottenville | 1 trip | $58.75", "New Dorp/Midland Beach | 2 trips | $21.81" and "Great Kills | 1 trip | $18.58", with a red circle around the trips column.

And when I run the workflow, the query works, and the top answer is Charleston/Tottenville, with an average tip of fifty-eight dollars and seventy-five cents. The AI explains it to me with total confidence. [check against your run] But look at this column. That average comes from one taxi ride. One passenger left a big tip, and my workflow just told me it's the best place in New York to drive a taxi. That's not an answer. That's luck.

*[pause]*

**[On camera]**

And the AI didn't do anything dumb here. It did exactly the four steps I gave it. There was no step where it could look at the result and say, "Wait, that's weird." I never wrote one.

**[Card beside you]** Who decides the next step? Your code: it's a workflow. The AI: it's an agent.

And so here's the one question that tells them apart: who decides the next step? If it's your code, it's a workflow. If it's the AI, it's an agent. And running on a schedule doesn't change the answer. An AI summary that lands in your inbox every morning is still a workflow, if your code decided every step.

**[On camera]**

Workflows aren't bad, by the way. Anthropic's advice is to find the simplest solution that works, and only add more when you need it. So if you know the steps in advance, like a report that runs every morning, a workflow is cheaper and it does the same thing every time. You build an agent when you can't know the steps in advance, like a question where the data might surprise you.

### Part 3: Build the agent in four parts

**[Graphic 7, full screen]** Four boxes: "1. The model", "2. The tools", "3. The instructions" and "4. The loop". Under them: "agent.py + tools.py, about 120 lines of Python, no framework".

*[pause]*

So let's build the real thing. An agent has four parts: the model, the tools, the instructions, and the loop. The whole agent is about a hundred and twenty lines of Python, and the code is linked in the description, so you don't need to type along.

*[pause]*

#### Number one: the model

**[Graphic 8, full screen]** Screen recording: the top of `agent.py`, with `client = anthropic.Anthropic()` and `MODEL = "claude-opus-5-5"` highlighted.

*[pause]*

Number one is the model, which is the AI that does the thinking. I'm using Claude Opus 5.5 through Anthropic's API, and an API just means the way your code talks to their AI. You can build this same agent with OpenAI or Google too, because they also let the AI call tools, which is the next part. These two lines connect to Claude. Your key, which works like a password, stays in your computer's settings instead of the code.

*[pause]*

**[On camera]**

And notice that the model's name sits on one line. AI companies retire old models, and some of the most popular agent tutorials from last year don't run anymore, because the model they used was switched off. So when that happens to you, you change one line and you're done.

#### Number two: the tools

**[Graphic 9, full screen]** Screen recording: `tools.py`. The three functions, `list_tables`, `run_sql` and `save_report`, then the `TOOLS` list with each description highlighted.

*[pause]*

Number two is the tools. A tool just means a normal Python function, plus a short description that tells the model what the function does. My agent gets three. The first one, called list_tables, shows every table and column, with notes from the city's official data dictionary, which is the document that explains what each column means. The second, run_sql, runs one SQL query and sends back up to fifty rows. And the third, save_report, saves a report as a file, but only after it asks me.

*[pause]*

**[On camera]**

And here's the part most people miss: the model never runs your code. It sends back a message that basically says, "Please use run_sql with this query." Then your code calls the function and hands back the result. So you decide what the agent can touch, because it can only use the tools you give it.

#### Number three: the instructions

**[Graphic 10, full screen]** Screen recording: the `INSTRUCTIONS` text in `agent.py`, with "Check the data before you trust it" highlighted.

*[pause]*

Number three is the instructions. The instructions are a short message that tells the agent its job and its rules, and the model reads them at every step. Mine say: you're a data analyst agent, start by reading the tables, check the data before you trust it, show the numbers behind your answer and what you left out, and save a short report at the end.

*[pause]*

**[On camera]**

Notice that I didn't tell the agent how to check the data. I never said, "Remove the zones with fewer than a thousand trips." I gave it the goal, not the steps, and that's the difference between writing instructions for an agent and writing a workflow.

#### Number four: the loop

**[Graphic 11, full screen]** Screen recording: the `for step in range(...)` loop in `agent.py`, with four parts highlighted one at a time: "Ask the model", "No tool call? Stop", "Run the tools" and "Send the results back".

*[pause]*

Number four is the loop, and the loop is what turns a chatbot into an agent. First, we send the model the question, the tools, and everything that's been said so far. That list of messages is the agent's memory. Then we check one thing: did the model ask for a tool? If it didn't, the agent has decided it's done, so we stop. If it did, we run what it asked for, add the results to the list, and go around again.

*[pause]*

**[Graphic 12, full screen]** Screen recording: the `except` block in the loop, with the comment "Send the error back, so the agent can read it and fix its own mistake" highlighted.

*[pause]*

There's one small thing in this loop that matters a lot. When a query fails, the program doesn't crash. We send the error message back to the model. So if the agent writes a column name that doesn't exist, it reads the error, fixes the query, and tries again, the same way you would.

*[pause]*

**[On camera]**

And so the whole agent is just a model, three tools, a few lines of instructions, and a loop.

### Part 4: Run it

**[Graphic 13, full screen]** Screen recording of the full run, sped up, with a label on each step: "Read the tables", "Check the payment types", "Cash tips are not recorded", "Count the trips in each zone", "Leave out the tiny zones", "Answer" and "Ask before saving".

*[pause]*

So let's give the agent the same question: where do taxi drivers in New York get the best tips? And now I'm just going to watch.

The agent starts by listing the tables, and it reads the notes. Then it checks how people paid. And it finds something I never told it about: the notes say cash tips aren't recorded, and about fifteen percent of the rides were paid in cash, so almost all of those show a tip of zero. So it decides to use card payments only. Then it counts the trips in each zone, sees that some zones have just one or two trips, and leaves those out. Nobody told it that. [check against your run]

*[pause]*

**[Graphic 14, full screen]** The agent's answer: "JFK Airport: $12.39 average tip, 103,470 card trips" and "LaGuardia Airport: $10.26 average tip, 75,208 card trips". Under them: "Left out: cash trips (tips not recorded) and zones with very few trips".

*[pause]*

And then the agent answers. JFK Airport has the best tips, at about twelve dollars and forty cents on average, across more than a hundred thousand card trips, and LaGuardia comes next, at about ten dollars and twenty-five cents. And it tells me exactly what it left out and why. [check against your run]

*[pause]*

**[Graphic 15, full screen]** Screen recording: "The agent wants to save reports/best-tips.md", the report, and "Save it? (y/n)".

*[pause]*

At the end, the agent wants to save its report, so it stops and asks me first. I type "y", and the file is saved. [check against your run]

*[pause]*

**[On camera]**

So both runs had the same model, the same question, and the same data. The workflow gave me one lucky taxi ride. The agent gave me an answer I'd actually trust, because it was allowed to look at what it found and decide what to do next.

### What it costs

**[Graphic 16, full screen]** The last line of the run: "Steps | tokens in | tokens out | cost". Then the math, line by line, with a small "Let's say" label: "40,000 tokens in × $4 per million = 16¢" → "4,000 tokens out × $20 per million = 8¢" → "About 24¢ a run". Source line: "Claude Opus 5.5 prices, Anthropic, October 2026".

*[pause]*

Now, every step costs money, so let's do the math. A token just means a small piece of a word, and you pay for every one you send and every one you get back. At the end of each run, my agent prints how many it used. [check against your run]

So let's say a run sends forty thousand tokens in and gets four thousand back. Claude Opus 5.5 costs four dollars for every million going in, which comes to sixteen cents. It's twenty dollars for every million coming out, which adds eight more. And so the whole run comes to about twenty-four cents.

*[pause]*

**[On camera]**

Is twenty-four cents worth it for a question that could take you an hour of SQL? Easily. Is it worth it to run every time somebody opens a dashboard, thousands of times a day? Probably not. That's a job for a workflow.

### Part 5: Three safety rules

**[Card beside you]** Three safety rules: 1. Put the limits in the system, not the prompt. 2. Set a step limit. 3. Ask before acting.

An agent can act on its own, which means it can also make mistakes on its own. And so here are the three safety rules I built into this agent.

Number one is to put the limits in the system, not in the prompt. I could write "never delete anything" in the instructions, but that's a request, and a model can get a request wrong. So instead, the database opens in read-only mode, which means the agent can read the data but never change it. File access is switched off too, and the settings are locked. It doesn't matter what SQL the agent writes, because it can't change the data or touch any other file on my computer. A prompt asks. A setting enforces.

**[Graphic 17, full screen]** Screen recording: the `duckdb.connect` lines in `tools.py`, then a test query, `DELETE FROM trips`, and the error it gets back: "Cannot execute statement of type DELETE … read-only mode".

*[pause]*

Number two is to set a step limit. My loop stops after fifteen steps, no matter what. So if the agent ever gets stuck going around in circles, it can't keep spending your money all night. Anthropic recommends a stop rule like this too.

*[pause]*

Number three is to ask before acting. Reading data is safe, so the agent can do that on its own. But saving a file is an action, so it has to ask me first. In a real agent, that means anything that sends, buys, deletes or changes something.

**[On camera]**

So the agent decides the steps, but you decide the limits.

### Frameworks

**[On camera]**

Now, you've probably heard of frameworks like LangGraph, CrewAI, or the Claude Agent SDK. A framework just means a library that gives you a ready-made agent, and they save you time on bigger projects. But inside, each one runs a version of this same loop, with more features on top. Anthropic's Python library even has a tool runner that handles the loop for you. I wanted you to build it once by hand, so it never feels like magic again.

### Your turn

**[Graphic 18, full screen]** Three steps to copy: "1. Download the code (link in the description)", "2. Point it at your own data" and "3. Ask one question you'd normally answer with SQL. Then check its numbers yourself."

*[pause]*

**[On camera]**

So here's what I want you to do this week. Download the code from the description and run it on the taxi data first. Then point it at your own data, like a CSV from one of your projects or a public dataset, and change the first line of the instructions to describe it. Ask it one question you'd normally answer with SQL. And then check its numbers yourself, because that's how you learn when to trust an agent and when not to. Most people will save this video and never open the code. If you run it once and break it once, you'll understand agents better than most people who talk about them.

**[On camera]** *(Chris to confirm.)*

And if you put your agent on GitHub with your own data and a short README, which is the page that explains what you built, you have something real to talk about in an interview. When I interview engineers, the projects that stand out are the ones where the person can explain why they built it a certain way, like why the database is read-only.

### Call to action

**[On camera]**

If you want help planning your move into AI engineering, the first link in the description books a free fifteen-minute call with me.

**[On camera]** *(Chris to confirm which masterclass to name.)*

And if you want to learn to build agents like this step by step, the Stackle AI Engineering Masterclass is linked in the description too.

**[On camera]**

And tell me in the comments: what data would you point your first agent at?
---

## Graphics list

There are 18 full-screen graphics. Eleven of them are screen recordings of the code or the terminal, so record those first, in one session, with a large terminal font.

1. **The plan:** five boxes, "1. What an agent is", "2. What is not an agent", "3. Build it in 4 parts", "4. Run it" and "5. Three safety rules". Under them: "The question: Where do taxi drivers in New York get the best tips?" and "The data: 2,964,624 real taxi trips, January 2024".
2. **The loop:** "Question" → "The model picks a tool" → "Your code runs the tool" → "The result goes back to the model", an arrow back to "The model picks a tool", and a way out: "No tool needed? Answer."
3. **Screen recording:** `step1_one_call.py`, the whole file.
4. **Screen recording:** the single call's run, showing general advice and a SQL query with guessed table names.
5. **Screen recording:** `step2_workflow.py`, with each step highlighted in turn: "Step 1 (code): get the tables" → "Step 2 (AI): write one query" → "Step 3 (code): run it" → "Step 4 (AI): explain the result".
6. **The workflow's result table:** "Charleston/Tottenville | 1 trip | $58.75", "New Dorp/Midland Beach | 2 trips | $21.81" and "Great Kills | 1 trip | $18.58", with a red circle around the trips column. Use the rows from your own run if they differ.
7. **The four parts:** "1. The model", "2. The tools", "3. The instructions" and "4. The loop". Under them: "agent.py + tools.py, about 120 lines of Python, no framework".
8. **Screen recording:** the top of `agent.py`, with `client = anthropic.Anthropic()` and `MODEL = "claude-opus-5-5"` highlighted.
9. **Screen recording:** `tools.py`. The three functions, then the `TOOLS` list with each description highlighted.
10. **Screen recording:** the `INSTRUCTIONS` text in `agent.py`, with "Check the data before you trust it" highlighted.
11. **Screen recording:** the loop in `agent.py`, with four parts highlighted one at a time: "Ask the model", "No tool call? Stop", "Run the tools" and "Send the results back".
12. **Screen recording:** the `except` block, with the comment "Send the error back, so the agent can read it and fix its own mistake" highlighted.
13. **Screen recording:** the agent's full run, sped up, with a label on each step: "Read the tables", "Check the payment types", "Cash tips are not recorded", "Count the trips in each zone", "Leave out the tiny zones", "Answer" and "Ask before saving". Change the labels to match your run.
14. **The agent's answer:** "JFK Airport: $12.39 average tip, 103,470 card trips" and "LaGuardia Airport: $10.26 average tip, 75,208 card trips". Under them: "Left out: cash trips (tips not recorded) and zones with very few trips". Use the agent's own numbers if they differ.
15. **Screen recording:** "The agent wants to save reports/best-tips.md", the report, and "Save it? (y/n)".
16. **The cost:** the last line of the run, "Steps | tokens in | tokens out | cost". Then the math, line by line, with a small "Let's say" label: "40,000 tokens in × $4 per million = 16¢" → "4,000 tokens out × $20 per million = 8¢" → "About 24¢ a run". Source line: "Claude Opus 5.5 prices, Anthropic, October 2026". Swap in the numbers from your run.
17. **Screen recording:** the `duckdb.connect` lines in `tools.py`, then `DELETE FROM trips` and the error it gets back: "Cannot execute statement of type DELETE … read-only mode".
18. **Your turn:** "1. Download the code (link in the description)", "2. Point it at your own data" and "3. Ask one question you'd normally answer with SQL. Then check its numbers yourself."

**Cards beside you:** the agent definition; "Not an agent, number one: one question, one answer"; "Not an agent, number two: a workflow"; "Who decides the next step? Your code: it's a workflow. The AI: it's an agent."; and the three safety rules.

**Shortened on-screen labels:** the agent definition card, the "Who decides the next step?" card, the safety rules card, the step labels in Graphics 5, 11 and 13, and the math lines in Graphic 16. Every number matches the script.

**Style:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1. Use the dark theme in the terminal and code editor so the screen recordings match.

**Thumbnail ideas:**
1. Chris pointing at a terminal that shows "1 trip | $58.75" circled in red, with "AI GOT IT WRONG" in large text, and a smaller "the agent didn't".
2. "BUILD AN AI AGENT" in large text, the four boxes (model, tools, instructions, loop) behind Chris, and "No framework" in a small amber tag.

## Shorts to cut from this video

1. **"One taxi ride"** (hook, Graphic 6, and the "That's not an answer. That's luck." line): why a one-step AI answer can be confidently wrong.
2. **"Who decides the next step?"** The single call, the workflow and the agent in under 45 seconds.
3. **"A prompt asks. A setting enforces."** Safety rule number one and the `DELETE` error on screen.
4. **"What an agent costs"** The token math from Graphic 16.

---

## YouTube title

How to Build an AI Agent in Python (and What Isn't an Agent)

(60 characters.) Other options: "Build an AI Agent From Scratch in Python (No Framework)" (55) or "AI Agent Tutorial: What an Agent Is and Isn't, and How to Build It" (66).

## YouTube description

I asked an AI where taxi drivers in New York get the best tips, and it told me about a neighborhood with one taxi ride in the whole month. In this video, I show you what an AI agent really is, the two things people call agents that aren't, and then I build a real agent in Python, from scratch, that catches that mistake by itself.

Chapters
0:00 The AI answer that came from one taxi ride
0:00 What an AI agent is
0:00 Not an agent: a single call
0:00 Not an agent: a workflow
0:00 Build the agent: the model
0:00 Build the agent: the tools
0:00 Build the agent: the instructions
0:00 Build the agent: the loop
0:00 Running the agent on 3 million taxi trips
0:00 What one run costs
0:00 Three safety rules
0:00 Your turn

The code from the video: [link to add]

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle AI Engineering Masterclass: [link to add]
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks

Sources
- NYC Taxi and Limousine Commission, TLC Trip Record Data (yellow taxi trips, January 2024): https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page
- TLC yellow taxi data dictionary (18 March 2025): https://www.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_yellow.pdf
- Building effective agents (Anthropic, 2024): https://www.anthropic.com/engineering/building-effective-agents
- Claude API pricing (Anthropic): https://platform.claude.com/docs/en/about-claude/pricing
- Tool use with Claude (Anthropic): https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
