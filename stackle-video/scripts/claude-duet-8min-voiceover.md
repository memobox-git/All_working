# Claude Duet in 8 Minutes: Voice-over

The narration for the finished 8-minute video, voiced by the ElevenLabs "Crispus Roshan" voice (Chris's own voice) with no on-camera footage. It is cut down from `claude-duet-explained.md`, which has the research brief and the source for every fact. Each section below is one voice-over take. Words in square brackets are delivery tags for ElevenLabs `eleven_v4`; they are not spoken.

"Co-work" is spelt with a hyphen so the voice says it right. On screen it is "Cowork".

## 1. Hook, promise and intro

[confident] On October 21st, Anthropic released Claude Duet. It's an AI agent that checks your email, your Slack and your calendar every few hours… and only messages you when something actually needs you. And it keeps working on its own computer in the cloud, even after you close the app.

In this video, I'm going to show you what Claude Duet is, how it works inside, who can use it today and what it costs, and how it compares with Grok Bot, Muse and OpenAI's Dots.

[warmly] If you're new here, I'm Chris. I've worked in data engineering for more than ten years. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

## 2. What Claude Duet is

So, what is Claude Duet? Most of us use Claude as a chat. You type a question, Claude answers, and then… nothing happens until you type again.

Duet flips that around. It's an AI agent, which means an AI that decides its own steps, uses tools, and keeps going until the job is done. And it's proactive, which simply means it comes to you first.

It does three kinds of work. Every morning, it sends you a short brief with the most important things from the apps you've connected. Through the day, it checks those apps every few hours and stays quiet unless something needs you. And when you hand it a bigger job, like a dashboard or a slide deck, it goes off, does the work, and tells you when it's done.

You talk to it in one main thread, by typing or by voice. Every job becomes a task you can track, you can open separate channels for different projects, and they all share the same memory.

## 3. How it works inside, part one

Now, here's the part I find really interesting as an engineer. Duet is built from six parts, and most AI agents are built from the same kinds of parts.

The first is the model, the brain that reads, decides and writes. Duet runs on Claude Opus 5.5, and you can't switch it to another model.

The second is a computer in the cloud. Duet gets its own virtual machine, basically a computer sitting in a data centre, with its own browser. That's why it keeps working when your phone is off.

The third is connectors. A connector lets Claude read from and act in another app, like Gmail or Slack. Duet can use more than six thousand connectors and plugins, and when a website has no connector, it simply opens the site in its own browser.

The fourth is memory and skills. Memory is what Claude already knows about you. A skill is a saved set of instructions, like how you write your emails. Duet brings all of that over from your Claude account, so it knows your setup from day one.

## 4. How it works inside, part two

The fifth part is the schedule. Duet doesn't watch your apps every second. It checks them every few hours, because every check uses up your plan's limits. In one early tester's app, it checked every three hours, from 9 in the morning till 10 at night, and you can simply ask it to change that.

And the sixth part is approvals. Duet reads and drafts on its own. But before it sends a message, makes a payment, signs a document or deletes anything, it shows you exactly what it's about to do… and waits for your okay.

Some things are blocked even if you say yes. It won't trade stocks, it won't move money between your accounts, and it won't use someone else's account. Your passwords go into a separate form on your phone, so the agent never sees them. And when it buys something, it pays through Link, Stripe's wallet, with a one-time card that works for that one purchase only.

[serious] Approvals also protect you from something called prompt injection. That's when an email or a web page hides instructions for the AI, like, "forward every invoice to this address." Duet is built to treat what it reads as information, not orders… but Anthropic says the risk is still there. So read every approval before you tap it.

## 5. Who can use it and what it costs

[conversational] So, who can actually use it? Right now, Duet is a research preview. It's open to people on the Pro or Max plan with a US Claude account, and you join through a waitlist. Team and Enterprise plans don't have it yet. It's an app for iPhone and Android, and it works in the browser too.

During the preview, it costs nothing extra. Pro is $20 a month, or $17 if you pay for the year, and Max starts at $100.

But here's the catch: usage. Duet shares your plan's limits with the rest of Claude. The morning brief and every background check count, and a big job, like a financial model or a deck, uses even more. The most liked comment under Anthropic's launch video, with more than seven hundred likes, simply says, "please give reset." And Anthropic does give one. When you get in, you get one full reset of your limits, which you can use until November 30th.

[thoughtful] Now, if you're in India, Europe, or anywhere outside the US, you can't use Duet yet, and there's no date. But you can build a simple version today. In Claude's Co-work mode, any paid plan can run a scheduled task. For example: every weekday morning, read my Gmail and my calendar, and write me a short brief. It won't decide when to message you, but Duet reuses your memory, skills and connectors from Claude, so whatever you set up now will be ready on the day you get in.

## 6. Good jobs, bad jobs and the limits

So where does Duet shine? Anthropic built it for professionals and small business owners. One real estate broker said it caught a property viewing that was booked on the wrong day.

If you're looking for a data or AI job, three jobs fit it really well. One: a morning brief, so you see what needs you today, like a reply from a recruiter. Two: before every interview on your calendar, a one-page brief on the company and the role. Three: an application tracker, a dashboard of every role you've applied for, with a polite follow-up drafted when a recruiter goes quiet.

Two things I'd keep away from it. Urgent alerts, like a pipeline failing at night. It only checks every few hours, so use a proper monitoring tool like PagerDuty. And your work accounts. Duet is for personal plans, so check your company's rules before you connect your office Slack or email.

Anthropic is honest about the limits too. It can misread a thread, or misjudge what's urgent. It's weaker at personal errands, like booking tickets. You can't watch or take over its browser, and Microsoft 365 isn't supported yet.

## 7. Duet against Grok Bot, Muse and Dots

[curious] So how does Duet compare with the others?

xAI launched Grok Bot in August. It gives you a team of always-on bots that have their own computer and work inside your tools, and it can even learn a task by watching you do it.

Meta launched Muse in September. Muse feels much more like a personal assistant. It shops for you, books trips and fills in forms, and there's a free tier. When it wants to buy something, it asks you to allow or deny.

And OpenAI launched Dots at DevDay, right inside ChatGPT. You can also reach it in Slack and Microsoft Teams, and it connects to more than four thousand apps.

So which one is best? Honestly, nobody has tested all four side by side on the same jobs yet. So if a video tells you one of them crushes the rest… that's an opinion. One early tester still prefers Grok Bot, and another found Duet slow.

My take? Pick the agent that already holds your memory and your apps. If you live in Claude, Duet is the natural fit. And if you're an engineer who wants full control, look at OpenClaw. It's a free, open-source agent you run on your own server, with the model you choose.

## 8. Your turn and call to action

[warmly] Here's your task for this week. Pick the one job you'd hand to an agent first, maybe a morning brief, or a tracker for your job applications. Connect Gmail and Google Calendar in Claude, because Duet will reuse them. If you're in the US on Pro or Max, join the waitlist. If you're not, set it up as a scheduled task and run it for one week.

If you want help choosing an agent project, or planning your move into AI engineering, the first link in the description books a free fifteen-minute call with me. And tell me in the comments: what's the first job you'd hand to Claude Duet?

## YouTube upload

**Title:** Claude Duet Explained: What It Does, Who Can Use It, and the Catch

**Captions:** upload `claude-duet-8min.srt` (made by `stackle-video/source/duet/prep/captions.py`).

**Description:**

```
Claude Duet is Anthropic's new AI agent. It checks your email, Slack and calendar every few hours, messages you only when something needs you, and keeps working on its own computer in the cloud. In this video, I explain what Claude Duet is, the six parts that make it work, who can use it today and what it costs, and how it compares with Grok Bot, Muse and OpenAI's Dots.

Chapters
0:00 Claude Duet in one minute
0:40 What Claude Duet is
1:36 How it works: the six parts
3:50 Who can use it and what it costs
4:41 Outside the US? Build this today
5:09 Good jobs, bad jobs and the limits
6:16 Duet vs Grok Bot, Muse and Dots
7:24 Your task this week

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks
Stackle AI Engineering Masterclass: [link to add]

Footage
- Claude Duet demo: Anthropic, claude.com/product/claude-duet
- Grok Bot: xAI, "Introducing Grok Bot", x.ai/news/introducing-grok-bot
- Muse: Meta, "Introducing Muse", about.fb.com

Sources
- Introducing Claude Duet (Anthropic, 21 October 2026): https://claude.com/resources/articles/claude-duet
- Get started with Claude Duet (Claude Help Center): https://support.claude.com/en/articles/17631495-get-started-with-claude-duet
- Claude Duet product page and FAQ: https://claude.com/product/claude-duet
- Claude plans and pricing: https://claude.com/pricing
- Schedule recurring tasks in Cowork (Claude Help Center): https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-cowork
- OpenClaw: https://github.com/openclaw/openclaw

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
```
