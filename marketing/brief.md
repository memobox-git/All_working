# Stackle marketing brief

Every marketing agent reads this file first. It holds the facts, the plan and the Notion details that all five agents share. When this file and a skill disagree, this file wins, because it is newer. When Chris says something different in the conversation, Chris wins.

## Who we market

- **Chris** (Crispus Roshan), founder of **Stackle** (stackle.io). The YouTube channel is "Stackle - Your Career Lab".
- 10+ years in data engineering. Has run 200+ technical interviews from the hiring side, for companies in banking, healthcare, automotive and financial exchanges. This is his edge.
- About **13,000 LinkedIn followers** (checked 15 October 2026). The `stackle-script` skill still says 200,000 in the intro. That number is out of date. Write "more than twelve thousand people follow me on LinkedIn" and mark it for Chris to confirm.
- Meetup community: about 3,900 members. One free Claude workshop drew 511 people.
- Chris lives on **Pacific time**. Every date and time in the plan is Pacific (America/Los_Angeles).
- Never mention Chris's employer, his internal work, or any "at [company]" framing. Company names are fine only as interview targets or examples.

For anything else about Chris, use only the facts in the `stackle-linkedin-posts` and `stackle-script` skills. If a piece needs a fact that is not there, leave a placeholder for Chris (see "Things only Chris can fill" below). Never invent it.

## Who we talk to

A data analyst, tester or junior engineer with 2 to 7 years of experience who wants to become a data engineer or an AI engineer.

- **India:** works at an IT services company and wants a product company or a GCC.
- **USA:** an analyst who wants to become an engineer, worried about layoffs, often on a visa.

## What we sell, and the path to it

Short or LinkedIn post → long YouTube video → free guide (the DE roadmap) → free 15-minute career call → Masterclass (Data Engineering or AI Engineering). Stackle also sells a resume service and interview prep.

The number that matters is **calls booked**, not subscribers.

## Channel split

- **YouTube long videos:** data engineering, AI engineering and careers. Five shows: The Free Course, Real Interview, Across the Table, Explained for Data Engineers, The Plan.
- **YouTube Shorts:** 14 a week, in the series listed in the content plan.
- **LinkedIn:** data engineering and careers only. One post a day at 8am Pacific. No AI tutorials, AI listicles or tool comparisons.
- **TikTok and Reels:** AI. The "AI term in 30 seconds" Shorts also go here.

## Cadence (edit this section to change the weekly output)

| What | How many | When (Pacific) |
|---|---|---|
| Long videos | 3 a week | Monday, Wednesday, Friday |
| Shorts | 14 a week | 2 every day |
| LinkedIn posts | 1 a day | 8am |

Film one week ahead, publish the week after. So the Monday pack is for **next** week.

## The plans to follow

| File | What it gives you |
|---|---|
| `stackle-video/plan/content-plan.md` | The five shows, the idea bank (numbered), the Shorts series mix, the first four weeks, the weekly loop |
| `reports/AI data career YouTube growth.md` | Why the plan looks like this: winning formats, title proof lines, positioning, the funnel |
| `stackle-video/shorts/topic-bank.md` | 60 Shorts topics, each copied from a Short that already worked |
| `stackle-video/shorts/week-01.md` | 14 finished Shorts: the format to copy, and topics already used |
| `stackle-video/scripts/` | Long-video scripts that are already written |
| `research_notes/AI data career YouTube growth/` | The raw channel research behind the report |

## Skills that hold the writing rules

| Skill | Used by |
|---|---|
| `stackle-script` | YouTube Writer, Shorts Writer (sentence rules, banned words, intro, labels, description links) |
| `stackle-linkedin-posts` | LinkedIn Writer |
| `hormozi-style` (in `skills/hormozi-style/`) | Only when Chris asks for the Hormozi voice |

Load a skill with the Skill tool. Its name may show as `anthropic-skills:stackle-script`. If the Skill tool can't find it, read the file directly: `~/.claude/skills/synced/*/stackle-script/SKILL.md` (the same for `stackle-linkedin-posts`).

**Research in the cloud:** the `stackle-script` skill asks for research in Chris's Chrome. Scheduled runs have no Chrome. Use web search and web fetch instead, and say so in the research brief. Do not stop to ask.

## Rules for every agent

1. Drafts only. Never post, publish, send or schedule anything on any platform.
2. Never invent a person, a quote, an interview story, a question Chris was asked, a result or a number.
3. Every number needs a source. Give the source in the draft's "Things to check" list.
4. Never use the word "candidate". Say "people", "engineers", "job seekers" or "you".
5. Describe ChatGPT, Gemini and other products on their own merits. Never frame them against Claude.
6. No repeats. Before choosing a topic, search Notion for it. A repeated LinkedIn topic dropped from 1,557 to 202 impressions.

### Things only Chris can fill

When a draft needs a real detail from Chris, write a highlighted placeholder in the Notion page, like this:

`<span color="yellow_bg">CHRIS: the exact question the interviewer asked</span>`

When a draft makes a hiring-side claim that Chris must confirm, highlight it the same way and start it with `CHECK:`. Then tick **Needs Chris** on the row.

## Notion: where every draft goes

**Stackle Content Calendar**
- Database: https://app.notion.com/p/d6cac3f3e73542a99cd46d88a11fa9c9
- Data source (use this as the parent when creating rows): `collection://9fd39285-8bb5-4ad8-95a5-dfcd9009f6e2`
- Chris reviews in the view "Agent drafts to review".

Fetch the data source once before writing, to see the exact property names. Read `notion://docs/enhanced-markdown-spec` (with the Notion fetch tool) before writing page content.

| Property | What to put |
|---|---|
| Title | The video title, the Short's hook line, or the LinkedIn hook |
| Status | `Idea` for a planned topic, `Scripted` for a finished draft |
| Format | `Long Form`, `Short Form` or `LinkedIn Post` |
| Pillar | `Data Engineering`, `AI Engineering`, `Career`, `Claude Tools` or `Hot Take` |
| Publish Date | The Pacific date it goes out (`date:Publish Date:start`, `date:Publish Date:is_datetime` = 0) |
| Agent | `Marketing Lead`, `Researcher`, `YouTube Writer`, `Shorts Writer` or `LinkedIn Writer` |
| Needs Chris | `__YES__` if the page has any CHRIS or CHECK placeholder, else `__NO__` |
| Topic | One line on what the piece is about. For a Short, also name its series and its long video |
| Subtitle | Long videos: the angle in one line |
| Thumbnail Title | Long videos: the bold thumbnail text |
| Notes | Word count and minutes, the setup or shot, and anything Chris should know before filming or posting |

The full draft goes in the **page body**, not in the "Script" property.

In page bodies, write script labels in bold without square brackets (for example **Graphic 1, full screen**), because Notion treats square brackets as link syntax. Escape any other square bracket as `\[` and `\]`.

**Rows you may change:** only rows where Agent is set and Status is `Idea` or `Scripted`. Never edit a row Chris made (Agent is empty), never touch a row at `Recorded`, `Edited`, `Scheduled` or `Published`, and never delete a row.
