# OBIE: Build Plan

**OBIE: One Business, Infinite Employees.** An AI team for one-person businesses. Stackle is customer number one.

## How to use this file

1. Paste **Prompt 0** into Claude Code first. It becomes the project's `CLAUDE.md`, so every later step follows the same rules.
2. Then paste **one prompt at a time**, in order.
3. After each prompt, test on your phone before moving on. Each prompt ends by asking Claude to tell you how to test it.

---

## Before you start (about 10 minutes)

Have these ready:

- **Supabase:** a new project. You need its URL, anon key and service role key.
- **Anthropic API key**
- **Transcription API key:** pick one provider (ElevenLabs, Deepgram or OpenAI). It sits behind one file, so you can swap it later.
- **Vercel account**, connected to wherever the code lives
- **A domain:** optional on Day 1

---

## Prompt 0: Project brief (save as CLAUDE.md)

```
You are building OBIE (One Business, Infinite Employees): an app where a one-person business gets a team of AI agents that run its sales, marketing, customers, product and operations. I am the founder and I test everything from my phone.

CORE IDEAS
- OBIE: the agent the owner talks to first, and the face of the product. OBIE chats by voice or text, learns the business, builds the Business Profile, recommends the team, and stays pinned at the top of the sidebar as the front desk ("OBIE, add an Instagram agent").
- Stacks: the business areas. Defaults are Sales, Marketing, Product, Customers and Operations. OBIE can suggest custom stacks (for example Community or Podcast), and the owner can ask OBIE to create one anytime.
- Three agent levels:
  - Main agent: one per stack. Only main agents and OBIE appear in the sidebar.
  - Subagents: one per area inside a stack. They live inside channels.
  - Nano agents: do exactly ONE task, then disappear. This rule is never overridden.
- Channels: every major goal gets its own channel. Agents post the plan, status updates and approval requests there. Nano agent chatter goes in threads, not the main channel.
- Tasks form a dependency graph (depends_on). A task starts automatically when everything it depends on is done. Agents never poll each other.
- Approvals: anything sent, posted or published in the owner's name, and anything that spends money, needs the owner's approval first.
- Credits: every action costs credits. Show the estimate before running, reserve credits on approval, and refund failed tasks and redos. Every workspace gets 100 daily credits.
- Points: agents earn points for approved, on-time work. More points means more autonomy later.
- One owner per workspace, but put workspace_id on every table from day one.

TECH
- Next.js (App Router) + TypeScript + Tailwind
- Supabase: Postgres, Auth, Storage, Realtime. Row-level security on every table.
- Deploy on Vercel.
- Anthropic API models:
  - claude-sonnet-5-5: main agents, planning, writing
  - claude-haiku-5-5: nano jobs, classification, routing
  - claude-opus-5-5: only for rare deep planning
- Transcription lives behind one file (lib/transcribe.ts) so the provider can be swapped.
- Log every model call: tokens, cost, which agent made it.

DESIGN RULES
- Mobile-first. I build and test from my phone.
- Font: Plus Jakarta Sans everywhere.
- Colors: white, blue, black, yellow. No gold, no burgundy, no black-and-gold look.
- No emojis anywhere in the UI.
- Never use the word "candidate" anywhere in the product.
- Layout like Slack, but cleaner and calmer.
- OBIE's look: a glossy blue orb with a friendly face and a small yellow star above it. The star is a status light: steady when idle, sparkling while working. Main agents are smaller orbs with initials. Nano agents are tiny dots that appear, do their task and fade out.

WORKING RULES
- Build in small steps. After each step, tell me exactly how to test it on my phone.
- Secrets go in environment variables only. Never commit keys.
- Database changes go in migration files.
- If something is unclear, make a sensible choice, tell me in one line, and keep going.
```

---

## Day 1: Version 1 core

### Prompt 1: Set up the app

```
Create the OBIE app: Next.js (App Router, TypeScript, Tailwind) with Supabase clients for server and browser. Load Plus Jakarta Sans with next/font. Set up color tokens (white, blue, black, yellow) for light and dark mode. Make a simple home page with the OBIE name, the line "One Business, Infinite Employees", and a "Get started" button. Add .env.example listing every key we will need. Deploy to Vercel and give me the URL. Tell me exactly what to paste where.
```

### Prompt 2: Database

```
Create the database as migration files, with row-level security so only the workspace owner can read or write. Enable the ltree extension. Tables:

- workspaces: id, name, owner_id, created_at
- business_profiles: workspace_id, data (jsonb), confirmed_at
- blueprints: id, pack, stack, role, level (main / sub / nano), description, default_model, tools (jsonb), is_custom, created_by
- agents: id, workspace_id, blueprint_id, name, stack, level, parent_id, path (ltree, like sales.1.2), points, status
- channels: id, workspace_id, name, goal, deadline, owner_agent_id, status
- messages: id, workspace_id, channel_id, dm_agent_id, thread_id, author_type (user / agent), author_agent_id, kind (text / plan / status / approval / voice), body, created_at
- tasks: id, workspace_id, channel_id, agent_id, title, input (jsonb), output (jsonb), depends_on (uuid[]), status (waiting / ready / running / done / failed), deadline, credits_estimate, credits_used
- approvals: id, workspace_id, task_id, summary, status (pending / approved / rejected), created_at
- credit_ledger: id, workspace_id, amount, reason, task_id, created_at, plus a balance view
- voice_notes: id, workspace_id, storage_path, transcript, duration_seconds, created_at
- agent_runs: id, workspace_id, agent_id, task_id, model, input_tokens, output_tokens, cost_usd, path (ltree), started_at, ended_at

Turn on Realtime for messages, tasks and approvals. Apply the migrations and tell me how to check they worked.
```

### Prompt 3: Login and workspace

```
Add login with email magic link and Google. On first login, create the user's workspace and send them straight to OBIE. On later logins, open the workspace. Test on my phone end to end.
```

### Prompt 4: Mic and transcription

```
Add voice input to every text box: the OBIE chat, DMs and channels.
- A mic button: tap to start, tap to stop. Also support hold-to-talk.
- Show the recording time and a cancel button.
- Record in the browser. It must work on iPhone Safari and Android Chrome.
- Upload the audio to Supabase Storage, then call /api/transcribe, which uses lib/transcribe.ts.
- Put the transcript into the text box so I can edit it before sending.
- Save the audio and transcript in voice_notes.
- While recording, OBIE's orb pulses so it's clear OBIE is listening.
Test: I record 20 seconds on my phone and see the text appear.
```

### Prompt 5: OBIE onboarding

```
Build OBIE's onboarding as a full-screen chat (voice or text).
- OBIE says hello, explains it will ask a few questions, and asks if that's okay.
- Then it asks one question at a time:
  1. What do you sell, and at what price?
  2. Who buys it?
  3. Where do customers find you?
  4. Where do you talk to customers? (LinkedIn, WhatsApp, Slack, Instagram, email, Meetup, other)
  5. What's your goal, and by when?
  6. How many hours a week do you have?
  7. What eats most of your time right now?
- If the user pastes a website or LinkedIn URL, OBIE reads it and fills in what it can.
- OBIE asks a follow-up only when an answer is vague.
- When done, OBIE shows the Business Profile as an editable card. The user confirms, and it is saved to business_profiles.
Use claude-sonnet-5-5 with structured output for the profile.
```

### Prompt 6: Your team

```
Seed the blueprints table with this catalog (pack: "Courses and Coaching", plus core agents):

- Sales: Inbound, Booking, Call Prep, Follow-up, Close, Pipeline
- Marketing: Strategy, Content, Social Media (with platform agents for YouTube, LinkedIn, Instagram, TikTok, Facebook, X), Ads, Nurture, Community
- Customers: Onboarding, Support, Homework and Feedback, Reviews
- Product: Course Builder, Materials
- Operations: Payments, Files, Scheduling
- OBIE

Nano agents are not seeded. They are created per task.

Build the recommender. It reads the Business Profile and picks stacks and agents with simple rules. Examples: sells through calls → Booking, Call Prep and Follow-up. Uses LinkedIn → LinkedIn platform agent. Doesn't use Instagram → no Instagram agent. If the business needs an area the defaults don't cover, OBIE suggests a custom stack (for example Community for someone who runs meetups).

Show a "Your recommended team" screen: one reason per agent, an on/off toggle for each, and estimated weekly credits.

When the user taps Build, agents appear one by one as small orbs with a calm animation. The user can rename each one. Save them to agents with paths like sales, sales.1, sales.1.2.

Also let the user ask OBIE for a custom stack anytime ("I want a Podcast stack that finds guests and preps episodes"). OBIE designs it on screen: one main agent, 3 to 5 subagents, what each does and what it needs. The user reviews and taps Build. Save it as a custom blueprint (is_custom = true). If it overlaps an existing stack, OBIE says so and suggests adding an agent there instead.
```

### Prompt 7: The workspace (Slack-style)

```
Build the main screen like Slack:
- Left sidebar: Needs you (with a count), Agents (OBIE pinned at the top, then main agents only), Channels.
- Center: the open conversation.
- Threads open on the right on desktop, and as a bottom sheet on the phone.
- DM OBIE or any main agent.
- Avatars: OBIE is the blue orb with the yellow star. Main agents are smaller orbs with initials. Nano agents show as small dots in threads. No emojis.
- Status pills: Waiting, Working, Done, Stuck.
- Everything updates live with Supabase Realtime.
- On the phone, the sidebar is a drawer.
```

### Prompt 8: Agents that actually work

```
When I DM a main agent with a goal:
1. If there's no deadline, it asks for one.
2. It creates a channel named after the goal.
3. It posts the plan: which subagents are involved, and the tasks as a dependency graph, each with a credit estimate.
4. It posts an approval card with the total credits.

When I approve:
- A worker picks tasks whose dependencies are all done.
- It runs each one as a nano agent: one task, one model call, given only the context that task needs. Use claude-haiku-5-5 for simple jobs and claude-sonnet-5-5 for writing.
- It saves the output and posts a short status in that subagent's thread.
- Then it unlocks the next tasks.

Anything that would send, post or publish creates an approval instead of acting. On Day 1, agents produce drafts and outputs only.

The worker lives at /api/worker. Trigger it after every change, and from a Vercel Cron every minute as a backup. Log every model call in agent_runs with tokens and cost.
```

### Prompt 9: Credits, approvals and points

```
Credits:
- 1 credit = $0.0015 of model cost. Convert from agent_runs cost.
- A new workspace gets 2,500 starter credits plus 100 daily credits. Daily credits reset at the user's local midnight and are used first.
- Show the balance in the header.
- Before any plan runs, show the estimate. Reserve credits on approval, release what's left when it finishes, and refund failed tasks and redos.

Needs you page: every pending approval, with Approve, Edit and Reject.

Points:
- +1 for an approved task
- +1 bonus if it was on time
- -1 for a rejected one
- A group's points are the sum of its agents' points.
Show a small leaderboard.
```

### Prompt 10: Board, Profile, Connectors, Settings

```
Add four pages:
- Board: every task across all channels, with its deadline, status and what it's waiting on.
- Profile: edit the Business Profile.
- Connectors: cards for Google Calendar, Gmail (send), Google Drive, Slack, WhatsApp, LinkedIn and Stripe. Mark all "Coming soon" for now. Each card should already follow the setup-card pattern: steps, a connect button, a status.
- Settings: cloud or local (placeholder), default deadline (7 days), approval mode (draft only for now), notifications.
```

### Prompt 11: Test it as Stackle

```
Walk me through a full test on my phone:
1. Sign up.
2. Talk to OBIE by voice as Stackle.
3. Build the team.
4. DM the Marketing agent: "Draft 5 LinkedIn posts about getting hired as a data engineer, by Friday."
5. Approve the plan.
6. Watch the channel and threads fill in.
7. Approve the drafts in Needs you.
Fix anything that breaks. Then give me a short list: what works, what's rough, and what's next.
```

---

## Day 2: Agents with their own computers

Modeled on OpenAI's Dots: every main agent gets its own cloud computer, memory and approval gates, and you can watch its browser. Nano tasks stay plain model calls, so they stay fast and cheap.

### Prompt 12: Agent computers

```
Give each main agent its own cloud computer, the way OpenAI's Dots work, using Claude Managed Agents.
- Each main agent (and OBIE) becomes a Managed Agent with its own instructions, its stack's tools, and a memory store that keeps what it learns about my business between sessions.
- Nano tasks stay plain model calls. Only tasks marked "needs computer" (browse, run code, make files) run inside their main agent's session, as a helper that ends when the task is done.
- Every tool that sends, posts, publishes or spends is set to always ask. Each pause becomes an approval card in Needs you, and my answer goes back to the session.
- Stream the session's activity into the agent's channel thread so I can watch it work. Add Pause and Stop.
- Give every session a spend cap that matches the credits reserved for the plan, and log its cost in agent_runs.
- Save the agent and session ids in a new table (agent_computers) with workspace_id and row-level security.
Test: I ask the Marketing agent to research 5 competitors' LinkedIn pages and watch the steps appear in the thread.
```

### Prompt 13: Watch the browser

```
Let me see and control the browser an agent is using.
- Use a hosted cloud browser with a live view (for example Browserbase or E2B Desktop; pick one and tell me why in one line). Each main agent gets its own saved browser profile, so it stays logged in to the sites I log it into.
- The agent drives the browser with Claude's computer use toolset, and OBIE runs each action on the cloud browser.
- In the channel, a Watch button opens the live browser: a right-hand panel on desktop, a full-screen sheet on the phone.
- Take over pauses the agent and gives me the mouse and keyboard (for logins, captchas, or fixing something). Hand back resumes the agent.
- Before any click that submits, sends, posts, buys or deletes, the agent stops and asks for approval, with a screenshot of what it is about to do.
- The agent never types or stores passwords. I log in myself during Take over.
- Show the browser's running cost next to the Watch button.
Test: on my phone, I open Watch, see the agent browsing, tap Take over, log in to LinkedIn, tap Hand back, and the agent carries on.
```

---

## Version 2 (next)

- **Inbox:** LinkedIn, WhatsApp, Instagram and email through Unipile, Slack through its own API, contacts merged into one person, and an Inbox agent that sorts messages and drafts replies.
- **Real connectors:** Google Calendar, Gmail send, Drive (file-level access), Slack, Stripe.
- **OBIE Pages:** hosted landing and sales pages with forms that feed the Sales agent, a free subdomain, and custom domains.
- **OBIE Book, Forms and Links:** booking, forms, link-in-bio and short links.
- **Live call transcription:** the call copilot, with live notes and suggested answers.
- **Model router:** cheaper models for short-form writing, Batch API for overnight work, plain code for simple jobs.
- **OBIE Code:** a built-in repo, with every agent change saved as a commit.
- **Billing:** Free, $19, $99 and $499 plans with Stripe, and add-on credit packs.

## Version 3 (after that)

- **Marketplace page** with the "Switch to OBIE" flow and a running "you save $X a month" counter.
- **OBIE Sign, Pay, Mail and Post:** e-sign, checkout and invoices, email and newsletters, social scheduling.
- **Auto-replies earned per question type,** with a 60-second undo window.
- **More industry packs:** E-commerce, Local Services, Professional Services, Freelance, Creator.
- **Local mode:** agents that work with files on the owner's own computer.

---

## Order after traction

Nothing below is built yet. The founder decides when to start, based on waitlist signups. Build in this order: guardrails, then connections, then always-on agents, then agent computers (Day 2).

## Guardrails and evals (must ship before Connections go live)

**Guardrails**
- **Self-check before Needs you.** A cheap model checks each draft against a rubric before it reaches the owner: no made-up facts or stats, no prices or promises the owner didn't set, matches the brand voice, no banned words ("candidate"), no emojis where they aren't allowed. A draft that fails is redone automatically, for free.
- **Runaway limits.** A maximum number of tasks per plan, a maximum number of retries per task, and a daily credit cap per workspace.
- **Prompt-injection safety.** Text from websites, emails or files is always treated as data, never as instructions.
- **Send limits** once Connections exist (for example, a maximum number of emails per day).
- **A "Pause all agents" switch.**
- **An audit trail** of who approved what, and when.

**Evals**
- **Agent report card** on each agent's profile, built from data we already have: approvals, rejections, edits, on-time rate, and cost per task from `agent_runs`.
- **20 golden Stackle tasks**, scored by a judge model against the same rubric before every release. If quality drops, the release is blocked.
- **Weekly summary from OBIE.**

## Always-on agents

The worker and the every-minute cron already keep approved work running after the owner closes the app. These items go further:

1. **Routines.** A schedule per agent, for example "Every Monday at 9am, Marketing drafts this week's posts." Store them in a `routines` table and run them from the existing every-minute cron.
2. **Triggers.** Wake an agent when something happens: a new email, a form or waitlist signup, a payment, a booking, a lead reply. These come through the Connections platform (Composio triggers and webhooks), so they depend on Connections.
3. **Watchers.** Cheap periodic checks (for example, hourly "any new reviews or replies?") that use the small model and escalate only when they find something.
4. **Memory between wake-ups.** The agent's notes, the owner's preferences and past work, stored in the database.
5. **Long jobs.** On-demand agent computers (Day 2, Managed Agents), never left running idle. Like OpenAI Dots, an agent's computer keeps its state (files, browser sign-ins) between wake-ups, and nothing runs while it's idle.
6. **Reaching the owner anytime.** Push notifications, WhatsApp, SMS or email for Needs you items, with quiet hours.
7. **Guardrails first.** This needs the daily caps, send limits and pause switch from the section above.
8. **Self-scheduled wake-ups.** An agent can set its own follow-up, for example "check on Friday whether the lead replied". Store these in the same `routines` table with `source = 'agent'`, and list them on a "Scheduled" page where the owner can see and cancel them.

## From Dots and Duet

1. **Daily briefing** (first in line after traction). Every morning OBIE sends a short summary: what came in, what the agents finished, what needs the owner today, and what's due. It can be read in the app or played as audio in OBIE's voice through ElevenLabs, and sent by push or email. It's built from tasks, approvals and channels, so it needs no Connections at first.
2. **Proactive "needs attention" items** from connected apps, using watchers and triggers once Connections exist.
3. **OBIE Cloud apps.** Agents build small web apps and pages (forms, calculators, booking, client portals) and host them on the owner's custom domain.
4. **A Finance agent** in Operations: simple revenue and cash forecasts from Stripe or a spreadsheet, as drafts.
5. **A power setting** to choose the model per agent, hidden under Settings.
