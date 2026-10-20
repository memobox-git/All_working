# Personal AI Agents: Recording Script

**CAMERA** lines are where your face is on screen: about 707 words, about 4.7 minutes (including the optional mid-roll). **VOICE** lines play over graphics or footage, so only your voice is used: about 1856 words, about 12.4 minutes.

The paragraph numbers match the numbered script. Line 15b is new and needs your OK.

## Two ways to record

1. **Easiest: film the whole script in one take, in order, on camera.** Pause one second between paragraphs. Your face is used only on the CAMERA lines; the VOICE lines get covered by the graphics. One sitting, about 18 minutes of reading, and your voice stays the same all the way through.
2. **Least time on camera: film only the CAMERA lines** (the list at the end), and record the VOICE lines as audio, with the same mic, whenever suits you. Your ElevenLabs professional clone, "Crispus Roshan", could read the VOICE lines instead, but your real voice and the clone will sound slightly different at every cut, and a realistic AI voice may need YouTube's "altered or synthetic content" box ticked. Your real voice is better.

**Screen recordings still needed from you:** only line 9 (a ChatGPT or Claude chat on your screen). Everything marked "I build this" comes from me.

---


## Intro

**1. VOICE** · Cold open: the four real launch posts (r01) — ready

If you use ChatGPT or Claude every week, and you want to move into AI engineering, here's something you can't ignore. In the last five months, Google, xAI, Meta and OpenAI have each launched a personal AI agent, which is an AI that keeps working even after you close the app.

**2. VOICE** · Cold open continues: "In this video" cards (r01) — ready

In this video I am going to explain, in plain English, what a personal agent really is, how it works under the hood, and whether you should use one, build one, or skip it.

**3. CAMERA**

Because every launch demo looks amazing, but almost nobody shows you what's actually different from the chat app you already have. And if you want to build AI for a living, you need to know how these things work, not just what they look like.

**4. CAMERA** · Your name and the three facts appear beside you

If you are new here, I am Chris. I have worked in data engineering for more than ten years. Today I run Stackle, where I teach data and AI engineering. And more than five hundred people signed up for my free Claude workshop.

**5. CAMERA**

And to be honest with you, I use a do-it-yourself AI agent for my own work every week, and there are still things I won't let it touch. So I'll show you what's real, what's hype, and the one risk most videos skip.

**6. VOICE** · The plan (g02) — ready

So here's the plan. First, I'll give one task to three kinds of AI. Then I'll show you how a DIY agent works inside, because personal agents work the same way. Then, how personal agents message you first. And at the end, which one I'd pick.


## Part 1: Three kinds of AI, one task

**7. CAMERA** · Card: "Your task" (card-01) — ready

So let's say you have an interview next week, for a data engineering job at a bank. I'm going to give that same task to all three kinds of AI.

**8. VOICE** · Chatbot column (g03) — ready

Number one is the chatbot. A chatbot just means the normal chat window in ChatGPT, Claude or Gemini. You type, it answers, and the conversation is the whole job.

**9. VOICE** · SCREEN RECORDING: paste a job post and resume into ChatGPT or Claude (you record your screen)

So you paste in the job post and your resume, and you ask, "What will they ask me?" And in a few seconds, you get a really good list of questions for that one job.

**10. CAMERA**

Now, you might be thinking, doesn't ChatGPT remember me now? And the answer is yes. ChatGPT, Claude and Gemini all have a memory feature. But the app decides what to save, and it does nothing until you open it and type. Keep that in mind, because that's the gap the other two fill.

**11. VOICE** · DIY agent column (g05) — ready

Number two is the do-it-yourself agent, like Claude Code or Codex. A DIY agent just means an AI that works inside a folder of files you give it. It can read those files, change them, and add new ones. It's called do-it-yourself because you build that folder on your own.

**12. VOICE** · The career folder (I build this from a demo folder)

So let's say you've made a folder called career, with your resume, every job you applied to, and notes from every interview. Now you ask the same question. First, it saves the job post in your applications folder. Second, it reads your old notes, sees you ran out of time on the SQL question in two of your last three interviews, and puts SQL practice at the top. And third, it updates a file called memory.md, so next time it starts from everything it knows today.

**13. CAMERA**

And so the DIY agent remembers, and it keeps your files in order. But you still have to start every task yourself.

**14. VOICE** · Personal agent column (g07) — ready

Number three is the personal agent, like Meta's Muse, OpenAI's dots or xAI's Grok Bot. To put it simply, a personal agent is a DIY agent that comes ready to use, keeps running all the time, and can start the conversation instead of waiting for you.

**15. VOICE** · The phone message (g08) — ready

So let's say it's the evening before your interview, and your phone buzzes. "Your interview with the bank is tomorrow at ten. Last time, you ran out of time on the SQL question. Want a fifteen-minute practice round tonight?" You didn't ask for that. It saw the event in your calendar, connected it to your notes, and offered to help. And that's what people mean by proactive.

**15b. VOICE** · NEW LINE. Google and Meta's real launch demos (r15b) — ready

And this isn't a made-up example. When Google launched Spark, it showed this exact idea: Spark saw a t-ball game on the calendar and added the snacks to a shopping cart. And Meta showed Muse finding a field trip form in an email and filling it out before anyone asked.

**16. VOICE** · One line each (g09) — ready

So in a nutshell, the chatbot answers when you ask. The DIY agent remembers, in files. And the personal agent remembers, and messages you first.


## Part 2: How a DIY agent works

**17. CAMERA**

Now, before personal agents, let me show you how a DIY agent works inside, because personal agents work the same way. And honestly, it's just text files.

**18. VOICE** · Your real rules file from your repo (I build this)

Number one is the rules file. A rules file just means a plain text file with your rules in it, and the agent reads it at the start of every task. In Claude Code, it's called CLAUDE.md, and many other tools read one called AGENTS.md, which more than sixty thousand projects use. The .md part just means plain text.

**19. VOICE** · The rule being added (I build this)

So let's say you tell it once, "Keep my cover letters under two hundred words, and never start with 'I am writing to apply.'" The agent writes that rule into the file, and every cover letter after that follows it. To be clear, you say it once, and it sticks.

**20. VOICE** · The memory file (I build this)

Number two is the memory file, usually called memory.md. It holds the facts that change, like the jobs you applied to and what went wrong in each interview. Put simply, the rules file says how to work, and the memory file says what's true right now.

**21. VOICE** · The folders (I build this)

And number three is folders. Each part of your life gets its own folder, like career, learning and money, with its own rules and memory. And you don't build any of this by hand. You tell the agent what you want, and it writes and sorts the files for you.

**22. CAMERA**

So let me show you two ways this pays off.

**23. VOICE** · The learning file and 20 job posts (g12) — ready

Let's say your learning folder knows you've finished SQL and Python, and you've saved twenty job posts. You ask, "What should I learn next?" A chatbot gives you the same list it gives everyone. But the DIY agent reads all twenty posts and takes away what you already know. Let's say fourteen of them ask for dbt, a tool for cleaning data with SQL, and you haven't started it. Now you know exactly what to learn next.

**24. VOICE** · Opening of the connectors graphic (g13) — ready

Now a bigger example. You type one sentence, "Follow up on my job applications." And because the agent has connectors, it can pull everything together. A connector just means a safe link between the AI and an app, like Gmail or your calendar.

**25. VOICE** · Connectors (g13) — ready

First, it searches Gmail for the applications you sent in the last three weeks that got no reply. Second, it writes a short follow-up to each recruiter, by name, but it doesn't send them. Third, it updates your job tracker in Google Sheets. And fourth, it puts a reminder in your calendar to check again next Friday. That's three different apps, all for one job, and you didn't have to explain any of it.

**26. CAMERA**

So a DIY agent remembers what you give it, keeps it in order, and does the boring work across your apps.

**27. CAMERA** · OPTIONAL mid-roll. Card: free call (card-05) — ready

By the way, if you're trying to move into data or AI engineering and you're not sure what to learn first, the first link in the description books a free fifteen-minute call with me.


## Part 3: Personal agents

**28. VOICE** · Ready out of the box (g14) — ready

Okay, now personal agents. With a personal agent like Muse, you don't make the folder, and you don't write the rules file. You just start talking.

**29. VOICE** · Meta's own Muse demos (I build this from the launch footage)

So let's say you open Muse and tell it your goal, "Get a data engineering job in six months." It asks how many hours a week you have and what you already know, then turns the goal into a plan with steps for each week. A DIY agent can do this too, but you'd have to know to ask. Muse just does it.

**30. VOICE** · Muse's saved files (needs a Muse account; if you have none, I'll swap this line for Meta's own wording)

And here's the part I find really interesting. If you look at what Muse saves about you, it's plain text files, the same kind we just talked about, with names like memory.md. So personal agents aren't magic. They're the same system, already set up for you.

**31. CAMERA**

But the big difference is that personal agents are proactive out of the box, which means they act before you ask.

**32. VOICE** · Real proactive demos: Muse Japan trip, Google Daily Brief (I build this)

A personal agent can tell you when a job that matches you is posted, remind you when a recruiter has waited two days for your reply, or, like we saw earlier, message you the night before an interview.

**33. CAMERA**

Now, how does it actually do that? Because it isn't thinking about you all day. And this is the part most videos skip, so let me make it clear.

**34. VOICE** · The heartbeat (g17) plus the real OpenClaw docs page — ready

Most personal agents use a timer, and many also use triggers. OpenClaw, a free open-source agent, calls its timer a heartbeat. A heartbeat just means the agent wakes up every so often, every thirty minutes by default. Each time, it reads a short checklist, looks at your email and calendar, and asks one question: is anything worth telling this person right now? If yes, it messages you. If not, it goes back to sleep. And a trigger just means something that wakes it right away, like a new email.

**35. CAMERA**

And you might be thinking, can't I just set up a scheduled task? And the answer is yes, and it's closer than you think. ChatGPT's scheduled tasks can now run every hour, and some start when a new email arrives. So the real difference isn't a magic brain that watches you all day. It's two things. The agent remembers what it already told you, and it decides on its own whether something is worth your time.

**36. VOICE** · The maths (g18) — ready

But checking often costs money, so let's do the math. Every thirty minutes is forty-eight checks a day, and about one thousand four hundred and forty a month. Let's say each check costs one cent. That's about fourteen dollars a month, even on days when nothing happens. And that's why a good agent keeps its checklist short.

**37. CAMERA**

And the last question is, how does it keep working when your laptop is closed?

**38. VOICE** · The cloud computer (g19) — ready

A personal agent keeps working because it doesn't run on your laptop. Muse, dots, Grok Bot and Google's agent each run on their own computer in the cloud, which just means a computer in a data center that's switched on all the time. So the agent can keep working while you sleep.


## Part 4: Why build a DIY agent anyway

**39. CAMERA**

So if personal agents do all of this for you, why would anyone still build a DIY setup? There are three reasons.

**40. VOICE** · The real 9to5Google rename article and Muse launch date (I build this)

Number one is that personal agents are very new. Muse launched six weeks ago, and Google's agent already has a new name. So they change fast, and they can do less than a good DIY setup.

**41. VOICE** · Control (I build this)

Number two is control. With a DIY agent, you organise everything the way you think. With a personal agent, everyone gets the same system.

**42. VOICE** · Lock-in (g20) — ready

And number three is lock-in. Lock-in just means it gets harder to leave. The more a personal agent learns about you, the harder it is to switch. But a DIY folder is just text files, so you can open it in Claude Code today and a different tool tomorrow, and lose nothing.


## Part 5: Privacy, and the risk most videos skip

**43. CAMERA** · Your own words

Now, privacy. My honest view is this: whatever you give an agent, assume the company behind it can see it. So I don't give any agent my passwords or bank details, or things about other people they never agreed to share.

**44. VOICE** · Meta's real privacy wording, highlighted (I build this in the real style)

And read the claims carefully. Today, Meta says Muse doesn't share your data with its ad systems. The line you may have heard, that not even Meta can see your data, is about a new version coming later this year. To be clear, that's a promise, not how it works today.

**45. CAMERA**

But here's the risk most videos skip. An agent that reads your email can also read an email that someone wrote to trick it.

**46. VOICE** · Prompt injection (g22) — ready

Prompt injection just means hiding instructions for the AI inside normal-looking text. OWASP, a group that tracks software security risks, puts it at number one on its list for AI apps. And it isn't only email. When researchers checked the add-on skills people shared for OpenClaw, about one in eight were malicious.

**47. VOICE** · Muse's real approval screen (r47) — ready

So give your agent one rule: ask me before you send, buy, or delete anything. It costs you a few seconds, and it can save you from a really bad day.

**48. VOICE** · The real OpenClaw GitHub page (I build this)

And if privacy matters most, you can run an open-source agent like OpenClaw or Hermes Agent on your own computer. But it takes real work to set up, and the most powerful models don't run on a normal laptop.


## Part 6: Which one should you pick?

**49. VOICE** · Pick this if (g23) — ready

So which one should you pick? If you only need answers now and then, skip the agents. A chatbot is enough, and that's fine. If you want the easiest start, and you're okay with your memory living in one company's app, try a personal agent. And if you want power, control, and the freedom to switch tools, build a DIY agent.

**50. CAMERA**

And I think this gap will close. OpenAI's dots can already hand work to its Work and Codex agents. So over time, I expect you'll get both in one place.

**51. CAMERA**

But if you want to work in AI engineering, here's my honest advice. Build the DIY version, even if you end up using a personal agent.

**52. VOICE** · Agent vs data pipeline (g24) — ready

Because if you look closely, a personal agent is a data pipeline with an AI in the middle. The heartbeat is a scheduler, like Airflow, which is a tool that runs data jobs on a schedule. The memory files are the state you save between runs. The connectors pull data from other systems. And the run history is your logs. So if you know data engineering, you already know half of it. And when you can explain how those pieces fit together, you'll talk about agents in an interview like someone who has built one.


## Your turn

**53. VOICE** · Your turn (g25) — ready

So here's what I want you to do this week. Make one folder called career, with one file called memory.md, and write five lines: the job you want, the skills you have, the skill you're learning, the jobs you applied to, and one thing that went wrong in your last interview. Then open a DIY agent like Claude Code or Codex, and tell it, "Read memory.md before every task, and update it when something changes."

**54. VOICE** · Your turn (g25) — ready

And to make it proactive, add one scheduled task in an app that can read your files, like Claude: "Every weekday at eight, read my memory file, and only message me if something needs me today." Now you've built a small personal agent yourself. The exact words are in the description.

**55. CAMERA**

Most people will watch this and never make the folder. But if you make it once, you'll understand agents better than most of the people talking about them.


## Call to action

**56. CAMERA**

If you want help planning your move into data or AI engineering, the first link in the description books a free fifteen-minute call with me.

**57. CAMERA**

And if you want to learn to build agents like this step by step, the Stackle AI Engineering Masterclass is linked there too.

**58. CAMERA**

And tell me in the comments: would you let an AI message you first? Yes or no, and why?


---

## Your CAMERA lines only

If you film only your face, these are the lines, in order.

**3.** Because every launch demo looks amazing, but almost nobody shows you what's actually different from the chat app you already have. And if you want to build AI for a living, you need to know how these things work, not just what they look like.

**4.** If you are new here, I am Chris. I have worked in data engineering for more than ten years. Today I run Stackle, where I teach data and AI engineering. And more than five hundred people signed up for my free Claude workshop.

**5.** And to be honest with you, I use a do-it-yourself AI agent for my own work every week, and there are still things I won't let it touch. So I'll show you what's real, what's hype, and the one risk most videos skip.

**7.** So let's say you have an interview next week, for a data engineering job at a bank. I'm going to give that same task to all three kinds of AI.

**10.** Now, you might be thinking, doesn't ChatGPT remember me now? And the answer is yes. ChatGPT, Claude and Gemini all have a memory feature. But the app decides what to save, and it does nothing until you open it and type. Keep that in mind, because that's the gap the other two fill.

**13.** And so the DIY agent remembers, and it keeps your files in order. But you still have to start every task yourself.

**17.** Now, before personal agents, let me show you how a DIY agent works inside, because personal agents work the same way. And honestly, it's just text files.

**22.** So let me show you two ways this pays off.

**26.** So a DIY agent remembers what you give it, keeps it in order, and does the boring work across your apps.

**27.** By the way, if you're trying to move into data or AI engineering and you're not sure what to learn first, the first link in the description books a free fifteen-minute call with me.

**31.** But the big difference is that personal agents are proactive out of the box, which means they act before you ask.

**33.** Now, how does it actually do that? Because it isn't thinking about you all day. And this is the part most videos skip, so let me make it clear.

**35.** And you might be thinking, can't I just set up a scheduled task? And the answer is yes, and it's closer than you think. ChatGPT's scheduled tasks can now run every hour, and some start when a new email arrives. So the real difference isn't a magic brain that watches you all day. It's two things. The agent remembers what it already told you, and it decides on its own whether something is worth your time.

**37.** And the last question is, how does it keep working when your laptop is closed?

**39.** So if personal agents do all of this for you, why would anyone still build a DIY setup? There are three reasons.

**43.** Now, privacy. My honest view is this: whatever you give an agent, assume the company behind it can see it. So I don't give any agent my passwords or bank details, or things about other people they never agreed to share.

**45.** But here's the risk most videos skip. An agent that reads your email can also read an email that someone wrote to trick it.

**50.** And I think this gap will close. OpenAI's dots can already hand work to its Work and Codex agents. So over time, I expect you'll get both in one place.

**51.** But if you want to work in AI engineering, here's my honest advice. Build the DIY version, even if you end up using a personal agent.

**55.** Most people will watch this and never make the folder. But if you make it once, you'll understand agents better than most of the people talking about them.

**56.** If you want help planning your move into data or AI engineering, the first link in the description books a free fifteen-minute call with me.

**57.** And if you want to learn to build agents like this step by step, the Stackle AI Engineering Masterclass is linked there too.

**58.** And tell me in the comments: would you let an AI message you first? Yes or no, and why?
