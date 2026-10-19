# AI Agents Explained: Script

**Title:** AI Agents Explained: What They Are, the 5 Patterns, and the Frameworks to Learn in 2026

**Spoken words:** about 915 · **Length:** 4:48 of voiceover, plus the 47-second channel intro, about 5:36 in total

**Type:** Animated explainer. No filming: Chris's ElevenLabs voice over motion graphics. The project that renders it is at `stackle-video/source/agents-explained/`. There are two cuts in `stackle-video/graphics/`:
- `ai-agents-explained.mp4` (5:39): music, sound effects and the channel intro.
- `ai-agents-explained-voice-only.mp4` (4:52): only Chris's voice and no intro. Chris asked for this one, for his own editing.

**Style:** Hormozi style (see `skills/hormozi-style`): "In this video I am going to...", five numbered points, "X just means Y" definitions, one "let's say" example, and short lines to land each point. Style check: median sentence 13 words, 29% of sentences have 20 words or more, 7% have 5 or fewer. Contractions run at about 2.7 per 100 words.

**Research date:** 19 October 2026

---

## Research brief

### Where this came from
The request was to take the transcript of **Aishwarya Srinivasan, "AI Agents Explained in 14 Minutes (The Complete Guide)"** (youtube.com/watch?v=TZMdEg1ZoIo, 25 March 2026, 13:43, about 69K views on 19 October 2026) and make a video from it.

**The transcript could not be fetched.** YouTube blocks this cloud session at every route: the transcript API (IP blocked), yt-dlp captions (HTTP 429), yt-dlp audio with several clients (403 and "confirm you're not a bot"), headless Chromium (the same bot wall), and public mirrors. Only the video's page loaded, with its description and chapter list.

So this script is **not a rewrite of her words.** It is our own explainer that covers the same ground her chapter list covers:
- the step from rule-based systems to LLMs to agents;
- the parts of an agent;
- the autonomy spectrum;
- linear vs parallel work;
- five patterns (ReAct, Reflection, Plan and Execute, Multi-Agent, Swarm);
- the frameworks.

Every fact was checked on its own (see the sources below), and the example is ours: a data pipeline that fails at 2 a.m., for data engineers.

### Our angle
- **One correction her video doesn't have.** It names LangGraph, CrewAI and AutoGen. AutoGen's own GitHub page now says the project is archived and no longer maintained, and it sends new users to Microsoft Agent Framework. Our video says so, which gives the promise a payoff ("one framework a lot of videos still recommend is no longer maintained").
- **One running example for data engineers:** a failing `orders_daily` pipeline in the hook, in the four parts, and in the ReAct and plan-and-execute diagrams.
- **Shorter:** under five minutes of content against her 14.

### Source for every fact in the script
| Fact in script | Source | Checked |
|---|---|---|
| An agent is a model using tools in a loop, deciding its own next steps | Anthropic, "Building effective agents" (agents "dynamically direct their own processes and tool usage") | 19 Oct 2026 |
| Use the least autonomy that does the job | Same Anthropic post: start simple and add complexity only when needed | 19 Oct 2026 |
| ReAct is short for "reason and act": the model thinks, acts and observes in turns | Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022) | 19 Oct 2026 |
| LangGraph: steps are nodes, edges decide what runs next, state is saved (checkpoints), and it supports pausing for human approval | LangGraph docs; LangGraph 1.0 shipped in October 2025 | 19 Oct 2026 |
| CrewAI: agents defined as roles, each with its own goal | CrewAI docs | 19 Oct 2026 |
| AutoGen is archived, no longer maintained, and new users should start with Microsoft Agent Framework | github.com/microsoft/autogen README: "Project archived and no longer maintained" and "New users should start with Microsoft Agent Framework" | 19 Oct 2026 |
| Microsoft Agent Framework is the direct successor to AutoGen and Semantic Kernel, and works in Python and .NET (Go is in preview) | learn.microsoft.com/en-us/agent-framework/overview (updated 25 Aug 2026) | 19 Oct 2026 |

### Lines Chris should check
- **The interviews line.** Chris confirmed on 19 October 2026 that he has interviewed more than 200 engineers. This take doesn't say it, because the channel intro carried the bio, so adding it means a new voice take.
- **"Plan and execute is often cheaper on long tasks"** is hedged with "often" on purpose. It depends on the model you use for planning.
- **The 2 a.m. pipeline** is a "let's say" example, not a real incident.

---

## Script

The graphic notes match what `source/agents-explained/scene.js` renders. Each cue sits on the spoken word.

### Hook

**[Split screen]** Left: a chatbot card typing advice. Right: an agent card ticking off `open_logs`, the bad column, the fix, then an "Approve fix" button.

A chatbot can tell you how to fix a broken data pipeline. An AI agent opens the logs, finds the bad column, writes the fix, and asks you to approve it. That gap is the whole story of AI agents.

**[Title card]** AI AGENTS / EXPLAINED

### Promise

**[Four cards: 01 what an agent is · 4 parts · 5 patterns · 3 frameworks. Then "FRAMEWORK ??" with a red NO LONGER MAINTAINED stamp]**

In this video I am going to show you what an AI agent actually is, the four parts every agent is built from, the five patterns engineers use to design them, and the three frameworks worth learning right now. And one framework that a lot of agent videos still recommend is no longer maintained, so I'll tell you what to use instead.

### [Channel intro, 47 seconds]

### 1. What an agent actually is

**[Chapter card 01, then three cards stepping up: Rules (code `if file.late: send_alert()`), LLM alone (reads, reasons, writes, "can't touch anything"), Agent (a LOOK, DECIDE, ACT, CHECK loop)]**

Number one is what an agent actually is, and there are three steps to it. The first step is a rule-based system, which just means a person wrote every rule, like "if the file is late, send an alert." It's reliable, but it can't handle anything nobody planned for.

The second step is a large language model on its own. It can read, reason, and write, but it can't touch anything. It answers, and then it stops.

The third step is an agent. An agent just means a language model running in a loop, with tools it can use. It looks at the situation, decides the next step, takes it, checks what happened, and goes again until the job is done. So the model is the thinking part, and the agent is the doing part.

### 2. The four parts

**[Chapter card 02, then four cards: Model (the brain), Tools (the hands: SQL, search, API), Memory, Loop. Then an incident console, "02:00 · orders_daily FAILED", whose rows light up each part]**

Number two is the four parts, because every agent you'll ever build has the same four. The model is the brain, and it makes the decisions. Tools are the hands, like a SQL query, a web search, or an API call. Memory is what it knows so far, both the steps in this run and the things it saved from older runs. And the loop is what keeps it going, and what stops it when the job is done or it hits a limit.

Let's say a pipeline fails at two in the morning. The model reads the error, a tool pulls the logs, memory remembers that this table changed last week, and the loop keeps it working until the test passes. Take away any one of those, and it falls apart.

**[Memory fades out, and the console flips back to FAILED: "IT FALLS APART"]**

### 3. How much freedom you give it

**[Chapter card 03, then an autonomy slider: LOW, MIDDLE, HIGH, with two meters, "handles messy problems" and "easy to predict and test". The knob comes back to MIDDLE on the last line]**

Number three is how much freedom you give it. Autonomy just means how many decisions the agent makes without you. At the low end, you write the steps and the model fills in the blanks. In the middle, the model picks which path to take. And at the high end, it picks the steps, the order, and when to stop. More freedom handles messier problems, but it's harder to predict and harder to test, and so the honest advice is to give it the least freedom that still gets the job done.

**[Two lanes. LINEAR: three checks in a row. PARALLEL: the same three at once, then combined. Coins: "You pay per call"]**

Then there's how the work runs, which is either linear or parallel. Linear means one step after another. Parallel means steps that don't depend on each other run at the same time, like checking three tables at once, and then the results get combined. Parallel is faster, but you pay for every one of those calls. That's the trade.

### 4. The five patterns

**[Chapter card 04, then a rail of the five patterns, with a diagram for each]**

Number four is the five patterns. Pattern one is ReAct, which is short for reason and act. The agent thinks, takes one action, looks at the result, and thinks again, and it's the default for most agents, so it's where you should start.

**[THINK → ACT → OBSERVE loop with a thought / action / observation log, and a START HERE pill]**

Pattern two is reflection, where the agent writes a first draft, then checks its own work and fixes it. It's great for SQL and code, because a second look catches real mistakes.

**[Draft SQL → check (no GROUP BY) → fixed]**

Pattern three is plan and execute. A planner writes the whole plan up front, and then the steps run one by one, and if a step fails, it makes a new plan. Because the big thinking happens once, it's often cheaper on long tasks.

**[A four-step plan ticks off, step 3 fails, RE-PLAN, a new step 3]**

Pattern four is multi-agent, where a lead agent splits the job and hands the pieces to specialists, like one that writes the query, one that checks it, and one that writes the summary.

**[Lead agent → SQL writer, checker, summary]**

Pattern five is the swarm, and in a swarm there's no boss. The agents hand the task to each other, based on who's best for the next step. It's flexible, but it's the hardest one to debug, right? So save it for last.

**[Four agents in a mesh pass a token around. Pills: NO LEAD, HARDEST TO DEBUG, USE IT LAST]**

### 5. The three frameworks

**[Chapter card 05. LangGraph: a graph of START → plan → run tool → tests pass? → human approval → END, with a "no, try again" loop and a "state saved" chip]**

Number five is the three frameworks. LangGraph lets you draw your agent as a graph, where each step is a node, the arrows decide what runs next, and the state gets saved, so you can pause, pick up again, and add a human approval step. Pick it when you need control. That's its strength.

**[CrewAI: three role cards (Researcher, Writer, Reviewer), each with a goal]**

CrewAI lets you describe a team of roles, like a researcher, a writer, and a reviewer, each with its own goal. It's the fastest way to get a working prototype.

**[AutoGen card stamped NO LONGER MAINTAINED, with an arrow to "Microsoft Agent Framework · Python · .NET". Then three cards: LangGraph = control, CrewAI = speed, Agent Framework = replaces AutoGen]**

And here's the update. A lot of videos still tell you to learn AutoGen, but Microsoft's own AutoGen page now says the project is no longer maintained, and it tells new users to start with Microsoft Agent Framework, which works in Python and dot NET. So if you're starting today, learn that one instead.

### Your next step

**[Checklist: one boring weekly task · a ReAct agent · built in LangGraph · just two tools. Ten video tiles dim, and "1 agent built" lights up]**

Here's what I'd do this week. Pick one boring task you do every week, and build a ReAct agent for it in LangGraph, with just two tools. Most people will watch ten videos about agents and never build one, so if you build one, you're already ahead.

### Call to action

**[Subscribe button, "What would you build first?", Stackle wordmark]**

If this helped, subscribe, and tell me in the comments what you'd build first.
