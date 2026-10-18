# Stackle Content Engine

One place for every content idea, how much each one matters, where it should go, and when it goes out. Three cloud schedulers keep it fed with news.

**The page:** https://claude.ai/artifact/7yBhATBNqb6nnuj57fPPec (private to Chris until shared)

| Tab | What it shows |
|---|---|
| News radar | What the schedulers found, ranked. P0 items are already on the calendar; P1 items wait for **Plan it**. Also: items bumped to make room, big news that was skipped and why, and a log of every scan. |
| Idea bank | All ideas (100 seed topics plus everything the schedulers add). Filter by pillar, audience, tier and status. Open one to rescore it, see its channel plan, put it on the calendar, or have Claude write a first draft for any channel. |
| Calendar | Four channels-by-days weeks. Long videos Mon/Wed/Fri, 2 Shorts a day, LinkedIn weekdays, X daily, email Thursday, WhatsApp Tue/Sat. Dashed blue slots are held for radar news. Lock a slot once it is filmed. |
| How scoring works | The formula, the tiers, worked examples (the Tesla car vs the Anthropic data tool), a slider to try any headline, the channel playbook and the scheduler times. |

## How a topic gets its priority

Every idea gets five scores from 0 to 5:

| Score | Weight | Question |
|---|---|---|
| Audience fit | 30% | Does it help data engineers, data analysts, AI career switchers or solo business owners? |
| Chris's edge | 20% | Can Chris teach or demo it better than others (data engineer, 200+ interviews)? |
| Urgency | 20% | 5 = launched in the last 24 hours, 1 = evergreen. News loses half its urgency every 3 days. |
| Demand | 15% | Is anyone talking about it (Hacker News, X, search, proven formats)? |
| Business value | 15% | Does it move people toward Stackle (sign-ups, the call, the Masterclass)? |

`score = 100 × (0.30 fit + 0.20 edge + 0.20 urgency + 0.15 demand + 0.15 business) ÷ 5`

| Tier | Rule | What happens |
|---|---|---|
| P0 · Drop everything | News only: score 75+, fit 4+, urgency still 4+ | Goes on the calendar at once: X within 6h, LinkedIn 24h, Short 48h, long video 3–7 days out if it can carry one, plus email and WhatsApp if readers can use it today |
| P1 · Next up | Score 82+ | First in line for open slots |
| P2 · Backlog | Score 65–81 | One short take for news; waits its turn for evergreen |
| P3 · Mention only | Below 65, or fit 0–1 | A quote-post or a line in the email |
| Skip | Fit 0–1 and edge 0–1 | Never stored; listed under "Seen and skipped" |

The fit gate is what keeps hot but off-niche news (a new Tesla) from taking a slot, while a launch your audience can use at work (an Anthropic data tool) jumps the queue.

## The three schedulers

They run as Claude Code scheduled tasks on Chris's account, each in a fresh cloud session, and write straight into the page's database.

| Name | When (Pacific) | Looks for |
|---|---|---|
| Launch Radar | 5:48 am, 9:48 am, 1:48 pm, 5:48 pm, 9:48 pm daily | AI model and tool launches (Anthropic, OpenAI, Google, Meta, Microsoft, Databricks, Snowflake, dbt, GitHub). Puts P0s on the calendar. Push notification. |
| Daily Pulse | 6:49 am daily | The data stack, the data and AI job market, AI for small business, and what data people are arguing about. Can add evergreen ideas from recurring debates. Push notification. |
| Weekly Planner | Sundays 4:46 pm | Archives stale news, fills the next 14 days of open slots, adds 5 evergreen ideas from the week's themes, writes the week's brief and Thursday email outline. Push and email. |

Sources: official newsrooms, fresh web search and the Hacker News API. **X (Twitter) needs an API key.** Without one the schedulers skip X. To turn it on, add an `X_BEARER_TOKEN` environment variable to this cloud environment (environment menu in the session title bar, then Edit; use Network secrets where it is offered). Every new run picks it up.

### Changing a scheduler

The prompts live in `schedulers/`: one file per scheduler plus `shared-rules.md`, which all three use. After editing, print the full prompt and paste it into the scheduled task (or ask Claude to update it):

```bash
node content-engine/scripts/scheduler-prompt.mjs launch-radar
```

If you change a scoring weight or tier cutoff, change it in `engine.js` (the page), `schedulers/shared-rules.md` (the schedulers) and this README.

## Files

| Path | What it is |
|---|---|
| `engine.js` | Scoring, tiers, channel routing and the calendar cadence. Used by the page and the build script. |
| `page/index.html` | The Content Engine page, published with `engine.js` beside it. |
| `data/ideas.json` | The 100 seed topics with their raw scores. Topics marked `plan` come from `stackle-video/plan/content-plan.md`. |
| `scripts/build-seed.mjs` | Turns the seed topics into database documents and lays out the first four weeks of the calendar. |
| `scripts/scheduler-prompt.mjs` | Prints a scheduler's full prompt. |
| `schedulers/` | The scheduler prompts. |

## Database layout

`ideas/<id>`, `slots/<date>_<channel>_<n>`, `runs/<scheduler>-<time>`, `briefs/<monday>`, `meta/settings`. Field by field: `schedulers/shared-rules.md`.
