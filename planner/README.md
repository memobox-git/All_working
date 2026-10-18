# Chris's planner

One place for what matters this year, down to what to do today. Chris and Claude talk every morning, pick today's top 3, and keep the goals current.

## The files

| File | What's in it |
|---|---|
| [`GOALS.md`](GOALS.md) | The goal ladder: year, quarter, month, week, today |
| [`TASKS.md`](TASKS.md) | Everything else on the plate: active, waiting on, someday, done |
| [`log.md`](log.md) | One short entry per day: the top 3, what got done, what moved |

## The ladder

Every goal hangs off the one above it. If a task doesn't move a goal, it waits.

| Level | How many | Set at | Checked at |
|---|---|---|---|
| Year | 3 | Yearly review (20 Dec) | Every quarterly review |
| Quarter | 3–5 | Quarterly review (28th of Dec, Mar, Jun, Sep) | Every monthly review |
| Month | 3–5 | Monthly review (last day of the month) | Every Sunday |
| Week | 3–5 | Weekly review (Sunday, 5 pm) | Every morning |
| Today | 3 | Daily check-in (8 am) | The next morning |

Each goal has a "done when" and a due date. "Grow the channel" is not a goal. "10,000 subscribers by 31 Dec" is.

## Start a check-in

Type `/planner` in any Claude Code session on this repo. Add `week`, `month`, `quarter` or `year` for a review, or `add …` to drop in a new task or goal. Plain words work too: "what should I do today?"

## The daily check-in (about 10 minutes)

1. **Look back.** What got done yesterday, what didn't, and why.
2. **Look ahead.** Today's calendar, deadlines in the next 7 days, anything waiting on someone else.
3. **Pick the top 3.** Each one moves a week goal or meets a hard deadline.
4. **Park the rest.** Everything else goes in `TASKS.md` and waits.

How the work gets ranked:

1. Hard deadlines and promises to other people.
2. Work that moves a quarter goal, starting with the goal furthest behind.
3. Work that unblocks someone else (an editor, a designer).
4. Everything else.

If a goal slips two weeks in a row, Claude says so, and we change the plan or drop the goal.

## The reviews

- **Weekly (Sunday, 5 pm, 30 min):** score this week's goals, set next week's, block the big work on the calendar.
- **Monthly (last day, 6 pm, 45 min):** score the month, set next month's goals.
- **Quarterly (28th of Dec, Mar, Jun, Sep, 6 pm, 1 hour):** score the quarter, set the next one.
- **Yearly (20 Dec, 10 am, 90 min):** score the year, set next year's 3.

The yearly review comes first, then the quarter, then the month, so each level is set from the one above it.

## Reminders

- **The rhythm** is in Google Calendar (cris@stackle.io): the daily check-in and the four reviews, each with a pop-up.
- **Each dated goal** gets an all-day "Due:" event on its due date. The pop-up comes 1 day ahead for a week goal, 3 days ahead for a month goal, and 2 weeks ahead for a quarter or year goal.
- **The morning draft:** a scheduled task at 7:45 am Pacific has Claude read these files and today's calendar and draft the top 3, so it is ready at 8.

## Rules for Claude

- Read `GOALS.md`, `TASKS.md` and the last 3 entries in `log.md` before suggesting anything.
- Propose, and let Chris decide. Nothing becomes a goal until Chris agrees to it.
- After each check-in, update the three files, then commit and push.
- When Chris agrees to a goal with a date, add its calendar reminder and write "reminder set" next to it.
- Keep it short. The check-in takes 10 minutes, not 30.
