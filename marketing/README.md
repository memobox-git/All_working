# Stackle marketing team

Five Claude agents that run Chris's marketing: YouTube long videos, Shorts and LinkedIn. They write drafts only. Nothing gets posted until Chris posts it.

| Agent | What it does | File |
|---|---|---|
| **Marketing Lead** | Chris talks to it. It plans the week, hands each job to the right specialist, checks the results and reports back | `.claude/skills/marketing/SKILL.md` |
| Researcher | Finds the top creators on a topic, what they got wrong, and our angle; scouts what's breaking out | `.claude/agents/stackle-researcher.md` |
| YouTube Writer | Titles, thumbnails, description and the full filming script | `.claude/agents/stackle-youtube-writer.md` |
| Shorts Writer | 14 Shorts a week with edit notes | `.claude/agents/stackle-shorts-writer.md` |
| LinkedIn Writer | Plans the week's posts and writes each one | `.claude/agents/stackle-linkedin-writer.md` |

All five read `marketing/brief.md` first: the facts about Chris, the audience, the cadence, the rules and the Notion details. The writing rules come from the `stackle-script` and `stackle-linkedin-posts` skills.

## Where the drafts go

Notion, in the **Stackle Content Calendar**, in the view **Agent drafts to review**.

- **Status** `Idea` is a planned topic. `Scripted` is a finished draft. From there Chris moves it on as usual (Recorded, Edited, Scheduled, Published).
- **Needs Chris** is ticked when a draft has something only Chris can fill in. Those parts are highlighted yellow in the page, starting with CHRIS or CHECK.
- **Agent** says which agent made the row. The agents never touch rows Chris made, never touch anything past `Scripted`, and never delete rows.

## What runs by itself (Pacific time)

| When | What |
|---|---|
| Every Monday, 4:50am | **Weekly pack** for next week: 3 long videos (research, package and script), 14 Shorts, and 7 LinkedIn topics |
| Every day, 6:50am | **LinkedIn post** for that morning's 8am slot |

Both run inside one Claude Code session, "Stackle marketing agents (scheduled runs)", which has this repo on the `claude/building-agents-75r4jg` branch and the Notion connection. Open that session to see each run's full report. Each run ends with a phone notification that links to the new drafts and lists what needs Chris. The daily run skips the notification when the post was already written.

## Asking for something yourself

Open Claude Code on this repo (on the web or in the Claude app) and type `/marketing` with what you want:

- `/marketing write a LinkedIn post about my Airbnb data warehouse interview`
- `/marketing script the RAG video for Friday`
- `/marketing 5 Shorts from the rejection video`
- `/marketing what's working on YouTube in my niche right now?`
- `/marketing weekly` (runs the Monday pack now)

## Changing how it works

- **More or fewer videos, Shorts or posts, or different days:** edit the Cadence table in `marketing/brief.md`.
- **Voice and writing rules:** update the `stackle-script` or `stackle-linkedin-posts` skill. Every agent loads them on each run.
- **Facts about you:** edit "Who we market" in `marketing/brief.md`.
