---
name: planner
description: Chris's daily planning check-in and goal reviews. Use when Chris types /planner, asks what to do today, wants to plan or prioritize, review a week, month, quarter or year, or set a goal or a reminder.
argument-hint: "[today | week | month | quarter | year | add <task or goal>]"
---

Follow `planner/README.md`. The argument picks what to run:

- **none or `today`:** the daily check-in. Read `planner/GOALS.md`, `planner/TASKS.md`, the last 3 entries in `planner/log.md` and today's Google Calendar (cris@stackle.io). Show yesterday in one line, then the proposed top 3, each tied to a week goal or a deadline. Ask Chris to confirm or change it.
- **`week`, `month`, `quarter`, `year`:** that review. Score each goal at that level (done, on track, behind, dropped), then propose the next period's goals.
- **`add …`:** put the task in `planner/TASKS.md`, or the goal in `planner/GOALS.md` as a DRAFT, and ask which level and date it belongs to.

When Chris agrees:

1. Update `GOALS.md`, `TASKS.md` and today's entry in `log.md`.
2. For each newly agreed goal with a date, add an all-day "Due: …" event on Google Calendar with the reminder lead time from the README, and write "reminder set" next to the goal.
3. Commit and push.

Keep the reply short enough to read on a phone.
