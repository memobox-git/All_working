# REA on a legacy data pipeline: plan and direction

**The video in one line:** Chris hides seven business rules inside a nightly data job he wrote, deletes the source code, and tests whether Claude Code finds them better with REA (Reverse Engineer Anything) or without it. Then each agent rebuilds the job, and a row-by-row comparison shows whose rebuild is right.

**Show:** Explained for Data Engineers, with the "I tested it" format the trend made popular. It fills the 20% "AI stories tied to the viewer's job" slot in `stackle-video/plan/content-plan.md`.

**Files in this folder**

| File | What it holds |
|---|---|
| `plan.md` | This file: the package, the test, the test kit, how to run and film it, the schedule |
| `script.md` | The research brief, then the full script scene by scene, with direction, the graphics list, the title and the description |
| `shorts.md` | One Short to post now while REA is trending, and three Shorts to cut after filming |

---

## 1. Why this video, and why now

- **The trend is big.** The top REA videos have 2.9M (Low Level), 1.6M (Nick Saraev), 493K (Rob Shocks) and 350K (Eric Tech) views. All of them went up between 9 and 19 October 2026. The full list is in the research brief in `script.md`.
- **Nobody has made a data engineering REA video.** Every test so far rebuilds an app (Mac Preview, a calculator, a screen recorder, a voice app) and judges it by eye. None of them scores the agent against a written answer key, and none of them checks the data.
- **Our version has its own proof.** It has a sealed answer key, code that no AI model has seen, two contestants, a harder second round, and a row-by-row check at the end. The row-by-row check teaches the skill data engineers actually get hired for: proving that a migration is right.
- **It ages better than the trend.** "Reverse engineer anything" will fade. "Rebuild a legacy pipeline with no source code" and "the rounding bug that breaks migrations" keep getting searched.

**Timing:** the trend peaked between 9 and 16 October. Post the trend Short (`shorts.md`, Short A) this week, and publish the long video by **Tuesday 27 October**.

---

## 2. The package

### Titles (pick one)

| # | Title | Characters |
|---|---|---|
| 1 | **Reverse Engineer Anything (REA) vs a Pipeline With No Source Code** (recommended: the search phrase comes first, and it states the problem) | 65 |
| 2 | REA Reverse Engineer Anything: Can It Find 7 Hidden Pipeline Rules? | 67 |
| 3 | I Tested the Viral REA Repo on a Data Pipeline With No Source Code | 66 |

### Thumbnails (pick one)

1. **The envelope (recommended).** Chris holds a sealed envelope stamped "ANSWER KEY". Behind him is a terminal that shows `source code: DELETED`. Big text: **"7 HIDDEN RULES"**.
2. **The scoreboard.** Two columns, "Claude Code" and "Claude Code + REA", each with a big "?/7". Text: **"WHO FOUND THEM?"** After the test, swap in the real scores if the gap is dramatic.
3. **The one-cent bug.** "$2.12 ≠ $2.13" in huge type, with the 2 and the 3 circled in red. Text: **"THE BUG AI MISSED"**. Use this one only if an agent really did miss the rounding rule.

Stackle style: Plus Jakarta Sans, amber #F59E0B on dark charcoal #1E1C1D.

### Pinned comment

> I hid 7 business rules in a nightly job and deleted the source code. Which rule do you think is the hardest for an AI to find? Mine's in the video at [timestamp]. Free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9

---

## 3. The test

### The rules of the game

1. **Two contestants.** A: Claude Code on its own. B: Claude Code with REA. Both use the same Claude model, the same permission mode, the same prompt and the same computer, with the same tools installed (including Ghidra). The only difference is REA.
2. **Three rounds.**
   - **Round 1, easy:** the job as a normal .NET build (a `.dll` file of CIL, the intermediate language, which keeps class and method names).
   - **Round 2, hard:** the same job compiled to machine code with Native AOT, with the names stripped out.
   - **Round 3, rebuild:** each contestant rebuilds the job in Python and SQL (DuckDB) from its own Round 2 rule list. Chris then runs the old job and both rebuilds on fresh files that no agent has seen, and compares the tables row by row.
3. **Scoring.**
   - A rule scores 1 point only if the description is exact enough to produce the right rows. For example, "converts to USD" without the rounding rule does not score rule 5.
   - Write down any **false rule** an agent claims. A false rule is a mistake, and the scoreboard shows it.
   - A true extra rule that is not in the answer key gets noted but does not score.
   - Write down the minutes and, where Claude Code shows it, the token use or cost for every session.
4. **Fairness.**
   - Chris wrote the job for this video, so no model has seen the code.
   - Run every session in its own fresh copy of the test folder, **outside this repository**, so that no agent can find the answer key.
   - Neither agent is told the rules, the number of rules, or the traps.

### The answer key (do not show the agents)

The job is `nightly_orders`, a small C# console program. It reads one CSV file of orders and **replaces** the `fact_orders` table in the SQLite file `warehouse.db`. It applies the rules in this order:

| # | Rule | Exact behaviour | Can you see it in a normal day of data? |
|---|---|---|---|
| 7 | **Small-file guard** (checked first) | If the file has fewer than 100 data rows, the job loads nothing, leaves the table as it was, prints the same `Run complete` message as a normal run, and exits with code 0 | **No.** Only in the code |
| 1 | **Keep the newest version** | When an `order_id` appears more than once, keep the row with the latest `updated_at`. The row order in the file does not matter | Yes: duplicates disappear |
| 2 | **Cutoff date** | Drop orders whose `order_ts` is before `2019-07-01 00:00:00` | Partly. You can see old rows disappear, but only the code gives the exact date |
| 3 | **Test accounts** | Drop rows whose `customer_id` starts with `TST`. Case-sensitive, so `tst-…` rows stay | Partly. The case rule is only in the code |
| 4 | **Region fix** | The lookup inside the program maps `07` to `APAC`, but a later line forces `07` to `EMEA` | Yes in the output, but only the code shows the override |
| 5 | **Currency and rounding** | Fixed rates in the code: USD 1.00, EUR 1.08, GBP 1.27, INR 0.012. `amount_usd = Math.Round(amount * rate, 2)` on `decimal` values. .NET's default rounding sends a half to the nearest even cent, so 2.125 becomes 2.12 | Hard. The rates can be estimated, but the rounding mode only shows on rare midpoint rows |
| 6 | **Weekend dates** | Orders placed on a Saturday or a Sunday get the next Monday as `business_date`. Every other order uses its own date | Yes |

`7` is listed first because the job checks it first. On screen, the rules are still numbered 1 to 7 as in the script.

---

## 4. The test kit

Claude can build this in about an hour: the C# source, the data generator, the compare query and the build commands. Chris then builds the two programs on his Mac, because the `.dll` and the Native AOT program must be built on the machine that runs them.

### The data

Input CSV columns: `order_id, customer_id, order_ts, region_code, currency, amount, updated_at`

| File | Rows | What is in it | Used for |
|---|---|---|---|
| `orders_20261019.csv` | about 5,000 | A Monday file: orders from Friday 16 to Monday 19 October. About 3% duplicates, about 1% `TST` accounts, about 10% region `07`, a mix of currencies, about 1% rows where .NET's rounding and SQL's rounding disagree, and about 2% late corrections of old orders, including some before July 2019 | The sample both agents get in Rounds 1 and 2 |
| `warehouse.db` | — | The table the old job produced from `orders_20261019.csv` | The sample output both agents get |
| `holdout_20261026.csv` | about 2,000 | Heavier edge cases: about 5% rounding midpoints, duplicates where the newest version comes **first** in the file, cutoff boundary times (`2019-06-30 23:59:59` and `2019-07-01 00:00:00`), lowercase `tst-` accounts, and weekend orders | Round 3 only. No agent sees it |
| `holdout_20261027.csv` | 40 | A normal-looking but small file | Round 3 only. The old job should skip it |

### The two builds

- **Round 1 (`round1/`):** `dotnet build -c Release`. Ship only the `.dll`, the app launcher and the `runtimeconfig.json`. **Delete the `.pdb` file**, because it holds source paths and variable names.
- **Round 2 (`round2/`):** set `PublishAot`, `StripSymbols` and `StackTraceSupport=false` in the project file. Run `dotnet publish -r osx-arm64 -c Release` and delete the `.dSYM` folder. Then check that the names are gone with `strings nightly_orders | grep -E "Region|Dedupe|Cutoff|Weekend"`. If method names still show up, rename the methods to neutral names (`Step1` to `Step7`) for this build only. The text values (`TST`, `2019-07-01`, `Run complete`) stay in the program, as they would in a real job.
- **The answer key** stays in the kit's source folder, which is never copied into a test folder. Print the seven rules on one card and seal it in the envelope for filming.

### The compare query (Round 3, on screen)

The old job and each rebuild run on `holdout_20261026.csv`. Snapshot each table, then run each job on `holdout_20261027.csv` and snapshot again. Compare each pair of snapshots in DuckDB:

```sql
INSTALL sqlite; LOAD sqlite;
ATTACH 'old.db' AS old (TYPE sqlite);
ATTACH 'new.db' AS new (TYPE sqlite);

-- rows the old job wrote that the rebuild did not
SELECT 'missing in new' AS problem, * FROM (
  SELECT * FROM old.fact_orders EXCEPT SELECT * FROM new.fact_orders)
UNION ALL
-- rows the rebuild wrote that the old job did not
SELECT 'extra in new', * FROM (
  SELECT * FROM new.fact_orders EXCEPT SELECT * FROM old.fact_orders);
```

An empty result means the two jobs agree on that file.

---

## 5. Running the test (film day 1, about half a day)

### Before you start

- [ ] Install REA only from the official sources: `npx rea-agents setup` (the npm package `rea-agents`), the GitHub page `github.com/morluto/rea`, or `rea.tools`. You need Node.js 22.19 or newer.
- [ ] Install Ghidra and a 64-bit Java JDK, so that both contestants have the same tools. Skip Hopper and IDA.
- [ ] Use a separate macOS user or a virtual machine for the test. It keeps your name, email and other files off the screen recordings, and it keeps the agents away from your own files.
- [ ] Give contestant A its own Claude Code settings folder, so it cannot see REA. For example, start it with `CLAUDE_CONFIG_DIR=~/.claude-plain claude` and log in once. The easier option: run all of A's sessions before you install REA.
- [ ] **Proof shot:** ask each session "Do you have REA available?" and record the answer before the test starts.
- [ ] Set the terminal font to 18pt or larger, use a dark theme, and show a clock or timer on screen.

### The prompts

**Rounds 1 and 2** use the same prompt for both contestants. Contestant B gets one extra first line.

> *(B only)* Use REA, Reverse Engineer Anything, for this investigation.
>
> This folder holds a nightly data job, `nightly_orders`, one day of its input, `orders_20261019.csv`, and the table it produced, in `warehouse.db`. The source code is lost. I wrote this program myself, and I own it.
>
> List every business rule the job applies to the data, including rules this input file never triggers. For each rule, give the evidence and say whether you saw it, inferred it, or could not confirm it. Write the list to `rules.md`.

**Round 3** (each contestant, in a fresh session, with only its own Round 2 `rules.md` and the sample input):

> Using only `rules.md`, rebuild this job in Python, with the SQL in DuckDB. The rebuild must read a CSV file in the same format and replace the same `fact_orders` table, with the same columns and types, in a SQLite file. Do not run or open the original program.

### What to record

| Session | Screen recording | Write down |
|---|---|---|
| 1A, 1B (side by side) | Both terminals, the full run | Minutes, cost or tokens, `rules.md` |
| 2A, 2B (side by side) | Both terminals, plus Ghidra if an agent opens it | Minutes, cost or tokens, `rules.md` |
| 3A, 3B | Each rebuild running, then your compare query and its output | Mismatched rows on each holdout file |
| Proof shots | "Do you have REA available?", the folder listing with no source code, the envelope being sealed | — |

**Then send Claude** the four `rules.md` files, the times, the costs and the compare output. Claude will score them against the answer key, fill every `[[RESULT]]` slot in `script.md`, and pick the verdict lines that match.

---

## 6. Filming direction (film day 2, about 45 minutes)

- **Set:** the usual long-video desk setup, a medium shot, looking into the lens. Keep a laptop open at the edge of the frame, showing the terminal.
- **Prop:** the sealed "ANSWER KEY" envelope. Show it in the hook, put it on the desk for Part 2, and open it on camera in Part 3. Film the opening twice: once from the front, and once close up on your hands.
- **Delivery:** one take per scene. Pause for one second at every *[pause]* mark, because a graphic starts or ends there. For the result lines, look at the camera, not the notes, and let each score land before you go on.
- **Energy:** the scene 4 results are the payoff, so give them a slightly faster pace. The rounding and silent-failure explanations should be calm and slow, because that is where people learn the most.
- **B-roll to grab on the same day:** typing the prompt; the `ls` of the test folder; the Ghidra window; the DuckDB compare output, with the empty result and with mismatched rows; the `Run complete` message on the 40-row file; a simple report that still shows yesterday's numbers (Claude can build a mock).

### Edit notes

- **No slow start.** A comment with 937 likes on Low Level's video says you can skip his first three minutes. The hook must land in under 30 seconds, and the promise and intro must be done by about 1:25.
- **Agent runs:** speed-ramp them, 8 to 20 times faster, with a timer in the corner for each contestant. Slow down to normal speed when an agent finds a rule.
- **Scoreboard:** keep a small scoreboard in the top corner from the start of Round 1 to the end of the video. Play a short sound each time a rule is ticked.
- **Music:** low and steady under the agent runs. No music under the rounding and silent-failure explanations.
- **Graphics:** build them as HTML in the Stackle style and render them with `stackle-video/source/render.js`, as with earlier videos. The full list is at the end of `script.md`.

---

## 7. Schedule

| Day | Work | Who |
|---|---|---|
| Wed 21 Oct | Plan, research and script (this folder) | Claude |
| Thu 22 Oct | Film and post Short A. Claude builds the test kit; Chris builds the two programs | Chris, Claude |
| Fri 23 Oct | Run the test and record it (section 5) | Chris |
| Sat 24 Oct | Claude fills in the results and renders the graphics. Chris films the talking parts | Claude, Chris |
| Sun 25 – Mon 26 Oct | Edit | Editor |
| Tue 27 Oct | Publish the long video, post the LinkedIn post and pin the comment | Chris |
| Wed 28 – Fri 30 Oct | Post Shorts B, C and D from `shorts.md` | Chris |

---

## 8. Risks and what to do

| Risk | What to do |
|---|---|
| Both contestants score 7 of 7 in Round 1 | That is a real result: when names survive, the agent hardly needs help. Round 2 and Round 3 still decide the winner. The script already has this branch |
| REA scores lower than Claude Code alone | Keep it. Honest results are why viewers trust a test video. A comment with 440 likes on Nick Saraev's video thanks him for "not hyping anything up". The verdict lines in the script cover this branch |
| An agent refuses, calling it a security task | The prompt already says "I wrote this program myself, and I own it". If it still refuses, record the refusal and say so in the video |
| REA setup fails (a viewer under Abhishek Veeramalla's video reports a Hopper install error) | Use Ghidra, not Hopper. Install Ghidra and the JDK the day before, and test REA on a tiny program first |
| The runs cost a lot | Write the cost down and say it in the video. Moe Lueker's REA run used about 56 million tokens, about $28.60 at API prices, and viewers value that number |
| Names stay in the Native AOT build | Rename the methods to `Step1` to `Step7` for the Round 2 build only, and check again with `strings` |
| A screen recording shows private data | Use a separate macOS user. Check every recording before it goes to the editor |

---

## 9. After publishing

- **Shorts:** B (the one-cent bug) and C (the job that reports success when it fails) work on their own and keep the long video getting views after the trend ends. D (the score reveal) links to the long video.
- **LinkedIn:** post the one-cent bug as a text post with the graphic, and link the video in the post body on launch day.
- **Lead magnet (optional):** publish the test kit without the answer key as a challenge ("find all 7 rules"), and send the answer key by email. It turns viewers into email subscribers, like the free guides the growth report recommends.
- **Double-down rule:** if the video beats 3 times the channel average within 7 days, make part 2 by pointing REA at a different legacy target, such as an old Visual Basic program or a SQLite file from an app. A viewer under Abhishek Veeramalla's REA video asked exactly that about a Visual Basic app.
