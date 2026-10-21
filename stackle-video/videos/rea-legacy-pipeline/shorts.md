# REA Shorts

Four Shorts. **A** rides the trend now, before the test. **B** and **C** teach the two traps in the test and work on their own, so they keep running after the trend fades. **D** is the score reveal, cut from the long video.

Shot numbers refer to `stackle-video/research/shots/shot-list.md`. Facts and sources are the same as in the research brief in `script.md`.

| Short | Post | Shot | Words | Length |
|---|---|---|---|---|
| A. REA for data engineers | Thu 22 Oct, this week, while REA is trending | 2: numbered list with a fixed top title | 140 | about 56 s |
| B. The one-cent bug | Wed 28 Oct | 3: board that fills in | 133 | about 53 s |
| C. The job that says success | Thu 29 Oct | 1: close-up talking head, plus one graphic | 125 | about 50 s |
| D. Who found the 7 rules? | Fri 30 Oct | 11: screen walkthrough with you visible | about 120 once filled | about 50 s |

All four: hook text on screen from the first frame, captions at chest height, the fixed title at the top for the whole Short, and an ending on the payoff, not on "subscribe". Post on YouTube Shorts, Reels and TikTok, with the long video as the related video on YouTube.

---

## Short A: REA for data engineers (post now)

**Shot:** 2, numbered list with a fixed top title. Seated, with the mic in frame. Film three extra 3-second clips: your hands typing, the terminal, and you at the desk from the side.
**Needs:** you alone, one take. No test results needed.
**Fixed title:** "REA for data engineers"

| Time | Chris says | On screen |
|---|---|---|
| 0:00 | Everyone is using the viral repo REA to clone apps. Here are three things a data engineer would use it for. | Hook text: "Everyone is cloning apps with REA". The fixed title appears. |
| 0:07 | REA lets Claude Code work out how a program works without its source code. | A small diagram: Claude Code → REA → "a program with no source code". |
| 0:13 | Number one: a nightly job with lost source code. Ask for every business rule it applies, with evidence. | Label "#1 Lost source code". Extra clip: the terminal. |
| 0:20 | Number two: an app that hands you a SQLite file with no documentation. REA can list its tables, columns and indexes. | Label "#2 Mystery SQLite file". A table list pops in. |
| 0:28 | Number three: prove the rebuild. Run the old job and the new job on the same file and compare every row, because the agent's rules are guesses until the data agrees. | Label "#3 Compare every row". Two tables side by side, with a tick. |
| 0:41 | Install REA only from the official GitHub page or npm, and only use it on software you own. | "github.com/morluto/rea · npm: rea-agents" |
| 0:48 | I hid seven rules in a job I wrote, and I'm testing REA on it this week. | You hold up the sealed "ANSWER KEY" envelope. End. |

---

## Short B: The one-cent bug

**Shot:** 3, a board that fills in. Use the shot 1 framing, a little wider, with the phone locked. The board is a two-column table: "C#" on the left and "SQL" on the right.
**Needs:** you alone. Build the board template once.
**Fixed title:** "The one-cent migration bug"

| Time | Chris says | On screen |
|---|---|---|
| 0:00 | Round two point one two five to two decimal places. C# says two point one two. SQL says two point one three. | Hook text: "2.125 → 2.12 or 2.13?" The empty board appears, then "2.12" drops under C# and "2.13" under SQL. |
| 0:08 | In C#, the Math dot Round function sends a half to the nearest even number by default. This is called banker's rounding. | "Math.Round: half → even" fills in under C#. |
| 0:15 | PostgreSQL and DuckDB send a half away from zero instead. | "ROUND: half → away from zero" fills in under SQL. |
| 0:19 | Python's round function sends a half to the even number, the same way C# does. | A small "Python = C#" tag. |
| 0:25 | So when you move an old C# job into SQL, a few rows can come out one cent off, and the new report stops matching the old one. | Two totals that differ by a few cents, with the difference in red. |
| 0:36 | Pick the rounding rule on purpose. DuckDB has a function called round even. Then compare every row of the old output with the new one. | "round_even()" and a "compare every row" tick. |
| 0:44 | One cent on one row is how a migration loses trust. | Payoff line, big and centred. End. |

Sources: Microsoft's Math.Round page, PostgreSQL's math functions page, DuckDB's numeric functions page (also tested on DuckDB 2.0.0), and Python's round() documentation. The links are in `script.md`.

---

## Short C: The job that says success

**Shot:** 1, close-up talking head. Seated, framed from the top of the head to the chest. Pop in Graphic 15 from the long video at 0:15.
**Needs:** you alone, one take.
**Fixed title:** "The most dangerous data job"

| Time | Chris says | On screen |
|---|---|---|
| 0:00 | The most dangerous data job is not the one that crashes. The most dangerous one fails and says success. | Hook text: "It failed. It said success." |
| 0:07 | I built a nightly job with one hidden rule: if a file has fewer than one hundred rows, load nothing, and still print "Run complete". | The rule appears as a line of code. |
| 0:16 | On a bad night, a file arrives with forty rows. The job loads nothing, the table keeps yesterday's numbers, and the morning report looks normal. | Graphic 15: Monday loaded; Tuesday "40 rows → nothing loaded → Run complete"; a report marked "Updated today" with Monday's numbers. |
| 0:26 | Nobody gets an alert, because the job reported success. | Zoom in on "Run complete". |
| 0:30 | Two checks catch it. Log how many rows each run loads, and alert when a run loads zero. Then check that the newest date in the table is today. | A checklist: "Rows loaded > 0" and "Newest date = today". |
| 0:41 | A green tick only means the job finished. A green tick does not mean the data is right. | Payoff line, big and centred. End. |

---

## Short D: Who found the 7 rules? (after filming)

**Shot:** 11, screen walkthrough with you in a corner. Cut it from the long video's Graphics 13 and 18 and from the envelope opening.
**Needs:** the test results. Claude fills in the `[[RESULT]]` lines with the long video.
**Fixed title:** "Claude Code vs Claude Code + REA"

| Time | Chris says | On screen |
|---|---|---|
| 0:00 | I hid seven business rules in a data job and deleted the source code. Then I asked Claude Code to find them, with REA and without it. | Hook text: "7 hidden rules. No source code." The envelope. |
| 0:09 | `[[RESULT: round 2 score for each contestant, one sentence.]]` | The scoreboard from Graphic 12. |
| 0:16 | `[[RESULT: the rule that both missed, or that only one found, with one sentence on why it was hard.]]` | Graphic 13, with that row highlighted. |
| 0:28 | `[[RESULT: what the row-by-row check showed, in one sentence.]]` | Graphic 18. |
| 0:38 | `[[RESULT: one-line verdict, matching the long video.]]` | Payoff line. End. The long video is set as the related video. |
