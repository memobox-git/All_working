# Reverse Engineer Anything (REA) vs a Pipeline With No Source Code: Script

**Spoken words:** about 1,970 · **Estimated length:** about 13.1 minutes at 150 words a minute. The result slots will add about 1 minute once filled, so plan for about 14 minutes.

**Type:** Test video about a tool. The interviews sentence is left out of the intro, as in earlier tool videos. Say if you want it back.

**Research date:** 21 October 2026

**How to read this script**

- Every paragraph has a label: **On camera**, **Card beside you**, or **Graphic N, full screen**. A screen recording counts as a graphic, as in the Claude Motion script.
- *[pause]* means stop for one second, because a graphic starts or ends there.
- `[[RESULT …]]` marks a line to fill in after the test. Send Claude the `rules.md` files, the times and the compare output, and Claude will write these lines and score the rules.
- **Keep one** marks a choice between verdict lines. Keep the one that matches the result and delete the others.
- Each scene starts with a **Direction** note for the shoot and the edit. The full shoot plan is in `plan.md`.

---

## Research brief

### How the research was done

Claude in Chrome was not connected, because this ran in a cloud session. So the research used YouTube search (yt-dlp) and web search. YouTube's bot check blocked the normal web client. A mobile client got through, so **all ten flagged videos below have a real transcript, upload date and view count, checked on 21 October 2026.** The top 60 comments were read for Low Level, Nick Saraev and Rob Shocks, and the top comments for Nate Herk and Abhishek Veeramalla. REA facts come from the official GitHub page. Language and database facts come from Microsoft, Python, PostgreSQL and DuckDB documentation. The DuckDB rounding behaviour was also tested directly, on DuckDB 2.0.0.

No data engineering channel has made an REA video yet. The closest creator to the Stackle audience is Abhishek Veeramalla (DevOps, India). A search for legacy-code videos found one adjacent hit: Anthropic's "Claude Code modernizes a legacy COBOL codebase" ([link](https://www.youtube.com/watch?v=OwMu0pyYZBc), 109,799 views). It shows that people want to see AI working on old code.

### Creators and videos flagged

| # | Creator | Subscribers | Title | Link | Views | Uploaded | Length | Transcript |
|---|---|---|---|---|---|---|---|---|
| 1 | Low Level | 1.18M | I Tested The Viral Reverse Engineering Repo | youtube.com/watch?v=qFEuYUfauNY | 2,932,187 | 16 Oct 2026 | 16:20 | Read, plus 60 comments |
| 2 | Nick Saraev | 564K | I Tested The Viral Github Repo That Reverse Engineers Anything | youtube.com/watch?v=dAzs_rU6080 | 1,604,223 | 10 Oct 2026 | 10:46 | Read, plus 60 comments |
| 3 | Rob Shocks | 58.8K | The Fastest-Rising Repo on GitHub Is a Little Scary REA | youtube.com/watch?v=OMobTlfjb8s | 493,106 | 9 Oct 2026 | 9:09 | Read, plus 60 comments |
| 4 | Eric Tech | 88.5K | How To Use REA To Clone Any Software In Minutes | youtube.com/watch?v=FnB9tHKBJXQ | 350,249 | 11 Oct 2026 | 9:02 | Read |
| 5 | Nate Herk | 1.08M | I Tested the Viral Reverse Engineer Anything Skill. What You Need to Know. | youtube.com/watch?v=rL5tw6h78zo | 210,609 | 13 Oct 2026 | 14:58 | Read, plus comments |
| 6 | Cloud X Berry | 66.9K | Reverse Engineer Anything (REA) Explained: The Software Industry Will Never Be the Same | youtube.com/watch?v=gjCBASA-1as | 157,506 | 14 Oct 2026 | 19:10 | Read |
| 7 | Better Stack | 236K | Everything is Open Source Now (Reverse Engineer Anything) | youtube.com/watch?v=jtfpCGsbSJU | 142,456 | 12 Oct 2026 | 4:52 | Read |
| 8 | Nate B Jones | 326K | Your Vibe-Coded App Can Look Right And Fall Apart After Launch. REA Shows You How Real Teams Build. | youtube.com/watch?v=PseF3LyXQ04 | 90,925 | 15 Oct 2026 | 22:37 | Read |
| 9 | Abhishek Veeramalla | 674K | This opensource project is scary \| Reverse Engineer Anything | youtube.com/watch?v=q99pjyJQXa8 | 50,360 | 19 Oct 2026 | 13:16 | Read, plus comments |
| 10 | Moe Lueker | 49.2K | How to ACTUALLY Use REA: I used Reverse Engineer Anything on My Own App and Put It Online | youtube.com/watch?v=wpV92IBwG88 | 18,263 | 19 Oct 2026 | 11:51 | Read |

**What the numbers say**

- **The two biggest videos are tests, not tutorials.** Low Level (2.9M) and Nick Saraev (1.6M) both use "I Tested" titles and show a rebuild next to the original app.
- **Every test rebuilds an app and judges it by eye:** Mac Preview (#2), the GNOME calculator (#1), an app with a hidden unlock code (#3), Wispr Flow (#4), a Loom-style recorder (#5), the author's own reader app (#10).
- **Two creators raced an agent with REA against one without it** (#2, #5), and Better Stack (#7) skipped REA and used Claude alone. Each was a single informal run, and none of them scored the results.

### What all of them cover (the script covers these too)

- REA is not a decompiler. REA connects an agent, through MCP and a skill, to tools that already existed: Ghidra, Hopper and IDA.
- REA does not give back the original source code. The agent gets pseudo code, the evidence for each finding, and a list of what it could not work out.
- Install it with `npx rea-agents setup`.
- None of this was impossible before. REA removes the time and skill it used to take.
- The legal and safety warnings: only use REA on software you own or may examine, and watch out for fake copies.

### What viewers said in the comments

- **"If it's open source, it almost 100% has seen it in its training data"** (494 likes, on Low Level's calculator test). The script answers this: our job was written for the video, so no model has seen it.
- **"You can easily start the video at 3:00, won't lose anything"** (937 likes, Low Level). So our hook lands in under 30 seconds, the promise and intro are done by about 1:25, and there is no sponsor or preamble.
- **"Ai can reverse engineer an entire app now and i still can't reverse engineer the code i wrote last week"** (422 likes, Low Level). The inherited-code problem is something viewers already feel. Part 2 opens on it.
- **"Your not hyping anything up for engagement and your actually being honest"** (440 likes, Nick Saraev). Viewers reward honest results, so the script keeps every verdict, including a loss for REA.
- **"Sir, i have older version desktop app made with visual basic … can i decode this app using REA"** (Abhishek Veeramalla). This is our exact use case, asked by someone in the Indian tech audience.
- **"The enterprise elephant in the room is compliance and IP leak"** (Abhishek Veeramalla). Part 4 tells viewers to ask their security team before using REA at work.
- Right-to-repair jokes dominate ("Finally our HP printer will accept 3rd party ink!", 2,100 likes on Nick's video and 3,200 on Low Level's). They are off-topic for us.

### Where they are wrong, out of date, or disagree

- **The Adobe clones did not use REA.** Nick Saraev puts the "Photoshop suite" next to REA. A comment with 152 likes on his video corrects him: ArtCraft "was entirely from software descriptions and videos of the software". Low Level says the group behind the clones does not claim to have used REA, and Better Stack describes them as rebuilt from public specs and from watching the apps. **The script does not mention the Adobe clones.**
- **Star counts are all different, because each video was made on a different day.** Eric Tech says "over 60,000", Cloud X Berry 42,000, Nate Herk 192,000, Moe Lueker 210,000, and Abhishek "300k". The GitHub page showed **355.7k on 21 October**. The script gives no star count, and Nick points out that star counts say nothing about what a tool can do.
- **Node.js version:** Eric Tech says you need version 24 or higher. REA's README says 22.19 or higher, 24.11 or higher, or 26 and up. Only the SQLite target needs 24.15. The script follows the README.
- **"Clone any software":** Eric Tech and Abhishek say REA can rebuild anything. Low Level and Nate B Jones point out that code running on a company's servers is never visible. The script promises nothing beyond what we test.
- **With REA or without it?** Nick: the plain agent finished first, but the REA version looked closer to the original. Nate Herk: the plain agent "always finished first", and the REA one had "much better results". Better Stack ported a game with Claude alone. Moe Lueker: a plain agent "can totally do the job" on simple tasks. All four are single, unscored runs. **Our test is the first one scored against a written answer key.**
- **Low Level tested an open-source program** (the GNOME calculator). He says so himself. His viewers point out that the model may already know its code from training.
- **Ghidra "since 2019"** (Nick, Low Level) is right. The NSA released it to the public on 5 March 2019.

### Gaps, and the angle our script takes

1. **No data angle.** Nobody has pointed REA at a data job. Ours is a nightly job that loads a table, which is the kind of thing data engineers inherit.
2. **No answer key.** Every other test is judged by eye ("it looks the same"). Ours has seven written rules in a sealed envelope, scored one by one, with false rules counted too.
3. **No hidden rules that only live in the code.** Rob Shocks' vault had one hidden rule. Ours has rules you can see in the data and rules you can only find in the code. That difference is the lesson.
4. **No check of the output.** Better Stack and Cloud X Berry say agents do best when their work can be tested. Nobody showed that test. Ours is a parallel run with a row-by-row compare, the check that data engineers use to sign off a migration.
5. **A trap no other video covers:** C# and SQL round a half differently, so a rebuild can be off by one cent on some rows. The trap is real, documented, and easy to show.
6. **What we do not try to beat:** Low Level's explanation of compilers and decompilers is the best on YouTube, and it runs about four minutes. Ours is a 60-word version with one example, because our viewers need the idea, not the assembly.

### Source for every number and fact in the script

| Fact | Source | Checked |
|---|---|---|
| REA is free and open source (MIT), and REA-authored code is MIT licensed | github.com/morluto/rea | 21 Oct 2026 |
| REA connects agents such as Claude Code and Codex to Ghidra, Hopper and IDA. ".NET assemblies" need no extra tool ("None (static only)") | REA README, supported targets table | 21 Oct 2026 |
| REA can read a SQLite file's tables, columns, indexes, views and triggers | REA README, supported targets table | 21 Oct 2026 |
| Results include "the evidence and limitations behind each conclusion" | REA README | 21 Oct 2026 |
| Install with `npx rea-agents setup`; needs Node.js 22.x (22.19 or higher), 24.x (24.11 or higher), or 26+ | REA README | 21 Oct 2026 |
| Setup shows the proposed changes and asks for approval | REA README ("review the proposed changes, and approve them"); Rob Shocks and Eric Tech show the same on screen | 21 Oct 2026 |
| Official sources: github.com/morluto/rea, rea.tools, npm package rea-agents. "A similar repository name or copied README does not establish that a download is official." | REA README | 21 Oct 2026 |
| A fake copy with a trojan was reported on 13 October 2026 (Microsoft Defender flagged it in the Wacatac family) | pasqualepillitteri.it fact-check, which cites a report on the official repository. This is a single secondary source, so the script says "was reported" | 21 Oct 2026 |
| Use REA only on software you own or are authorized to examine | REA README ("analysis of software you own or are authorized to examine") | 21 Oct 2026 |
| Ghidra is free and open source, made by the NSA, and was released to the public on 5 March 2019 at the RSA Conference | github.com/NationalSecurityAgency/ghidra; Wikipedia "Ghidra"; SC Media and Hackread reports from 2019 | 21 Oct 2026 |
| Ghidra names functions it cannot identify "FUN_" plus an address | Ghidra's default naming; Rob Shocks shows the same in his stripped-binary demo | 21 Oct 2026 |
| MCP is an open standard from Anthropic for connecting AI assistants to the systems where data lives (25 November 2024) | anthropic.com/news/model-context-protocol | 21 Oct 2026 |
| C# compiles to CIL, and the compiler also produces metadata that describes the types and members | learn.microsoft.com/dotnet/standard/managed-execution-process | 21 Oct 2026 |
| Native AOT compiles to native code ahead of time, with no JIT when the app runs | learn.microsoft.com/dotnet/core/deploying/native-aot | 21 Oct 2026 |
| `Math.Round(Decimal, Int32)` "rounds midpoint values to the nearest even number" by default | learn.microsoft.com/dotnet/api/system.math.round | 21 Oct 2026 |
| PostgreSQL `round(numeric, int)`: "Ties are broken by rounding away from zero" | postgresql.org/docs/current/functions-math.html | 21 Oct 2026 |
| DuckDB `round(2.125::DECIMAL(10,3), 2)` returns 2.13, and `round_even` returns 2.12 | Tested on DuckDB 2.0.0; duckdb.org numeric functions page (round_even uses "half to even") | 21 Oct 2026 |
| Python `round()`: ties go "toward the even choice" | docs.python.org/3/library/functions.html | 21 Oct 2026 |
| The seven rules, the test files and the build settings | Our own test kit (`plan.md`) | — |
| All `[[RESULT]]` numbers | Our own test, to be filled in | — |

---

## Scene 1 · Hook (0:00 to 0:30)

> **Direction.** Cold open on the screen recording. No logo, and no music for the first three seconds. Cut to Chris holding the sealed envelope on "answer key". Add a soft paper-tap sound when the envelope comes up.

**[Graphic 1, full screen, screen recording]** The test folder in a terminal. `ls` shows three files: `nightly_orders`, `orders_20261019.csv` and `warehouse.db`. A red label slides in: "Source code: deleted".

*[pause]*

The viral GitHub repo REA says it can reverse engineer anything. So I gave it the worst thing a data engineer can inherit: a nightly data job with no source code.

*[pause]*

**[On camera, holding the envelope]**

I wrote the job myself and hid seven business rules inside it. One rule changes money by one cent, and another one fails without telling anyone. The answer key is in this envelope, and the AI never gets to see it.

## Scene 2 · Promise and intro (0:30 to 1:25)

> **Direction.** Medium shot, on camera. Put the envelope down on the desk, where it stays in view until Scene 5. Show one picture for each fact in the intro (ten years, Stackle, LinkedIn).

**[On camera]**

In this video I am going to race Claude Code on its own against Claude Code with REA, and score both of them on those seven rules. Then each one will rebuild the job, and I will check every row its new job writes against the old job. By the end, you will know where REA helps a data engineer, where it does not, and the one check that makes any rebuild safe.

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

**[Card beside you]** Part 1: What REA is. Part 2: The test. Part 3: The results. Part 4: How to use it at work.

The video has four parts: what REA is, the test, the results round by round, and how I would use REA on a real data team.

*[pause]*

## Scene 3 · Part 1: What REA is (1:25 to 3:50)

> **Direction.** Mostly graphics. Calm pace. Music low. Graphic 3 builds one box at a time, in step with the words.

**[Graphic 2, full screen]** On the left, "Source code", with a few readable C# lines. An arrow labelled "compiler" points to the right box, "Program", which shows rows of bytes. On the way, "comments" and "names" fall off and fade. A second arrow, labelled "reverse engineering", points back from right to left.

*[pause]*

Reverse engineering means working out how a program works when all you have is the finished program. When an engineer writes code, a tool called a compiler turns that source code into a file the computer can run. The comments are lost on the way, and in many languages the names of things are lost too. A mechanic who opens an engine with no manual is doing the same kind of work.

*[pause]*

**[Graphic 3, full screen]** "You" → "Claude Code or Codex" → "REA" → three boxes: "Ghidra (free)", "Hopper", "IDA". An arrow comes back to the agent, labelled "evidence + what it could not work out".

*[pause]*

REA, short for Reverse Engineer Anything, is a free, open-source project on GitHub. It does not take programs apart by itself. Instead, it gives an AI coding agent, such as Claude Code or Codex, access to the tools that reverse engineers already use. The free one is Ghidra, which the United States National Security Agency released in 2019. For some software, such as .NET programs, REA needs no extra tool at all.

REA plugs into the agent through MCP, the Model Context Protocol, an open standard from Anthropic that lets an AI agent use outside tools. The same standard lets Claude read the issues in your GitHub project. With REA connected, Claude Code can open a program, ask a question, check the answer, and ask the next one.

*[pause]*

**[On camera]**

REA does not give you back the original source code, because nothing can. Instead, the agent writes pseudo code, which is a readable guess at what the program does. Each finding comes with its evidence, and REA also lists what it could not work out. Keep that list in mind, because the guesses are where a rebuild goes wrong.

*[pause]*

**[Graphic 4, full screen]** An install card: `npx rea-agents setup` · "Node.js 22.19 or newer". Underneath, "Official:" github.com/morluto/rea · npm "rea-agents". On the right, a fake "REA.exe" download with a red "Not official" stamp.

*[pause]*

To install REA, you run one command, npx rea-agents setup, with Node.js version 22.19 or newer. The setup shows every change it plans to make and asks before it makes them.

Download REA only from the official GitHub page, morluto slash rea, or the npm package rea-agents. A fake copy with malware inside was reported in the first week.

*[pause]*

**[On camera]**

Use REA only on software you own or have permission to examine, and run it in a separate user account, because REA runs with your permissions. The job in this test is a program I wrote, so I am allowed to take it apart.

## Scene 4 · Part 2: The test (3:50 to 6:10)

> **Direction.** Start on camera, with the envelope on the desk. Tap it on "on this card". Graphics 6 and 8 stay on screen long enough to read. Graphic 7 is the real prompt being typed, sped up.

**[On camera]** *(Chris to confirm this line.)*

Data engineers meet this problem at work. A job runs every night and feeds the morning reports, but the person who wrote the job has left, and nobody can find the source code for the version that is running. I have met jobs like this in banking and in financial exchanges, and they always had rules that no document mentioned.

*[pause]*

**[Graphic 5, full screen]** "orders_20261019.csv" → "nightly_orders (C#)" → "fact_orders table in warehouse.db (SQLite)". Four small labels on the middle box: "reads", "cleans", "converts money", "loads".

*[pause]*

For this test, I built a nightly data job of my own. The job is a small C# program that runs from the command line. Every night, the job reads a CSV file of orders, cleans it, converts the money to US dollars, and loads a table in SQLite. SQLite is a database that lives in a single file on your computer.

*[pause]*

**[On camera, envelope on the desk]**

I hid seven business rules inside the job, and I wrote all seven on this card before I deleted the source code. Because I wrote the job for this video, no AI model has seen its code before. That matters, because some REA tests use open-source apps, and a model may already know those apps from its training.

*[pause]*

**[Graphic 6, full screen]** Two cards: "A: Claude Code" and "B: Claude Code + REA". Under both: "Same model · same prompt · same computer · same tools". Between them: "Only difference: REA".

*[pause]*

The test has two contestants. Contestant A is Claude Code on its own. Contestant B is Claude Code with REA. Both use the same AI model, the same prompt, and the same computer with the same tools installed, so the only difference is REA.

**[Graphic 7, full screen, screen recording]** The test folder, then the prompt being typed in each terminal.

Each contestant gets a folder with the program, one day of input, and the table the program made from that input. The prompt asks for every business rule the job applies, including rules this day of data never triggers, with the evidence for each rule and how sure the agent is.

*[pause]*

**[Graphic 8, full screen]** Three cards. "Round 1: normal .NET build. Names kept." "Round 2: machine code. Names stripped." "Round 3: rebuild, then check every row."

*[pause]*

The test has three rounds. The first uses a normal build of the program, and the second uses a much harder build of the same job. In the third, each contestant rebuilds the job in Python and SQL, and I check the new job's output against the old job, row by row.

*[pause]*

**[On camera]**

A rule only counts if the agent describes it exactly enough to produce the right rows. I also count every rule an agent claims that is not true.

## Scene 5 · Part 3: The results (6:10 to 11:40, with the result lines)

> **Direction.** This is the payoff, so pick up the pace. Speed-ramp the agent runs 8 to 20 times, with a timer for each contestant, and drop to normal speed whenever an agent finds a rule. The small scoreboard sits in the top corner from Graphic 10 to the end of the video. Play a short "tick" sound for each rule. Open the envelope on camera, filmed from the front and close up on your hands. Turn the music off for Graphics 14 and 15.

### Round 1

**[Graphic 9, full screen, screen recording]** Round 1, both terminals side by side, sped up, each with its own timer.

*[pause]*

Round one is the normal .NET build. C# compiles to an in-between language called CIL, the Common Intermediate Language, which keeps the names of the classes and methods. Free tools can turn CIL back into readable code, so this build is the easy one.

`[[RESULT 1: who finished first, and how many minutes each contestant took. One sentence each.]]`

`[[RESULT 2: what each contestant did that was different. One or two sentences. For example, which tool each one used to read the program.]]`

*[pause]*

**[Graphic 10, full screen]** Scoreboard after round 1. "A: [[x]]/7 · false rules: [[n]]" and "B: [[x]]/7 · false rules: [[n]]". No rule names yet.

*[pause]*

After round one, Claude Code on its own has `[[x]]` of seven rules, and Claude Code with REA has `[[x]]` of seven. `[[RESULT 3, only if any: which contestant claimed rules that are not true, and how many.]]`

**[On camera]** **Keep one:**

- *(Both scored high.)* When the names are still inside the program, the agent hardly needs help. Both contestants read the job almost like source code.
- *(REA scored higher.)* REA's tools found `[[n]]` more rules in round one, because `[[the reason, from the session]]`.
- *(REA scored lower.)* REA was slower in round one and found less, because `[[the reason, from the session]]`.

### Round 2

**[Graphic 11, full screen, screen recording]** Round 2, side by side, sped up. Cut in the Ghidra window if an agent opens the program there, showing the stripped function names (for example "FUN_" plus an address).

*[pause]*

Round two uses the same job, compiled straight to machine code with a .NET option called Native AOT, with the names stripped out. Machine code is the raw instructions a processor runs, so round two is much harder to read.

`[[RESULT 4: who finished first, and how many minutes each took.]]`

`[[RESULT 5: what each contestant did with the stripped program. For example, whether it opened the program in Ghidra, and how it found its way through functions with no names.]]`

*[pause]*

**[Graphic 12, full screen]** Scoreboard after round 2, the same layout as Graphic 10.

*[pause]*

After round two, Claude Code on its own has `[[x]]` of seven rules, and Claude Code with REA has `[[x]]` of seven.

### The answer key

**[On camera, opening the envelope]**

Now it is time to open the answer key and go through the seven rules one by one.

*[pause]*

**[Graphic 13, full screen]** The seven rules, one row at a time, each with two tick columns, A and B, for round 2. Rows 2, 5 and 7 carry a small "only in the code" tag.

*[pause]*

Rule one: when the same order appears more than once, the job keeps the newest version.

Rule two: the job drops every order placed before the first of July, 2019.

Rule three: the job drops test accounts, which are customer IDs that start with a capital T, S, T.

Rule four: region code zero seven is reported as EMEA, which stands for Europe, the Middle East and Africa, even though the lookup table inside the job says Asia Pacific.

Rule five: the job converts every amount to US dollars with exchange rates written into the code, and then rounds it to the cent.

Rule six: orders placed on a Saturday or a Sunday count toward the next Monday.

Rule seven: if a file has fewer than one hundred rows, the job loads nothing and still reports success.

*[pause]*

**[On camera]**

Some of the seven rules show up in the data. When you compare the input file with the output table, you can watch the duplicates disappear and the test accounts vanish. Other rules hide in the code. The exact cutoff date, the exact rates, and the small-file rule never show up in a normal day of data, so an agent can only find them by reading the program.

`[[RESULT 6: which rules each contestant missed in round 2. One sentence each.]]`

*[pause]*

**[Graphic 14, full screen]** "2.125" in the middle. Left branch: "C# Math.Round → 2.12 (a half goes to the even number)". Right branch: "PostgreSQL and DuckDB ROUND → 2.13 (a half goes away from zero)". Along the bottom: "1 cent on this row".

*[pause]*

Rule five has a trap inside it. In C#, the Math dot Round function sends a half to the nearest even number by default, so two point one two five becomes two point one two. PostgreSQL and DuckDB send a half away from zero instead, so they give two point one three. Python's round function also picks the even number, so the trap only catches a rebuild that does its rounding in SQL.

One cent on one row looks harmless. Across a whole table, those cents make the totals in the new report disagree with the old one, and the people who use the report will ask why.

*[pause]*

**[Graphic 15, full screen]** A two-day strip. Monday: "2,000 rows → loaded → Run complete". Tuesday: "40 rows → nothing loaded → Run complete". Next to it, a report marked "Updated today" that still shows Monday's numbers.

*[pause]*

Rule seven is the most dangerous rule. When a file arrives with only part of the data, the job loads nothing and still reports success. The table keeps yesterday's numbers, so the morning report looks normal and is wrong. A normal day never has fewer than one hundred rows, so only reading the code can find rule seven.

`[[RESULT 7: who found the rounding part of rule five, and who found rule seven. One sentence.]]`

*[pause]*

### Round 3

**[Graphic 16, full screen]** "Same input file" splits into two lines: "Old job → old table" and "New job → new table". Both lines meet at "Compare every row". The result box says "0 differences = they match".

*[pause]*

In round three, each contestant rebuilt the job from its own rules, and I ran a parallel run. A parallel run means running the old job and the new job on the same input and comparing every row of their output. Checking two bank statements line by line is the same idea.

**[Graphic 17, full screen, screen recording]** The compare query in DuckDB, then its output for each contestant.

The row-by-row check is two short queries. The first query finds rows that the old job wrote and the new job did not. The second query finds rows that the new job wrote and the old job did not. When both come back empty, the two jobs agree on that file.

I ran the check on two fresh files that neither agent had seen. The first file is full of edge cases, such as amounts that land exactly on a half cent, duplicates in the wrong order, and orders exactly at the cutoff time. The second file has only forty rows, to test rule seven.

*[pause]*

**[Graphic 18, full screen]** The final scoreboard. For each contestant: "Rules found, round 1", "Rules found, round 2", "False rules", "Wrong rows, edge-case file", "Wrong rows, 40-row file", "Minutes", "Cost".

*[pause]*

`[[RESULT 8: the wrong rows for each contestant on each file, and the main cause of the wrong rows. Two to four sentences.]]`

## Scene 6 · Part 4: How to use it at work (11:40 to 13:10)

> **Direction.** On camera, slower and more personal. The card goes up on "Here is how I would use REA". No music.

**[On camera]** **Keep one verdict:**

- *(REA won the hard round.)* REA earned its place when the program was raw machine code with no names. On the normal .NET build, Claude Code on its own was close behind, because the names did most of the work.
- *(Tie.)* On this job, REA did not change the score. Claude Code on its own found its own tools and got just as far. `[[One sentence on anything REA still did better, such as clearer evidence, if the sessions show it.]]`
- *(REA lost.)* On this job, REA was slower and found less. The repo is useful, but its popularity does not prove that it is the right tool for every program.

*[pause]*

**[Card beside you]** "Use REA: compiled job, source lost · old tool that writes a file you must load · a SQLite file with no documentation." "Skip REA: you have the source code · the license forbids it · your security team has not agreed."

Here is how I would use REA on a data team. Use it when the program is the only thing left, such as a compiled job with lost source code, or an old desktop tool whose output you now have to load. REA can also open a SQLite database and list its tables, columns and indexes, which helps when an app hands you a data file with no documentation.

Do not use REA when you have the source code, because the source code is the real answer. Before you use it at work, ask your security team, because the agent sends what it reads to an AI model. Never point it at software whose license forbids it.

*[pause]*

**[On camera]**

The biggest lesson from this test is not about REA. An agent's list of rules is a set of good guesses until the data proves it. The parallel run turned those guesses into facts, and `[[RESULT 9: what the row-by-row check caught that the rule list missed, in one clause]]`. You can use the same check with any agent, any tool and any migration.

**[On camera]** *(Chris to confirm. This is the one hiring line the rules allow near the end.)*

When I review a data engineer's resume, a migration that was proved with a row-by-row check says more than a long list of tools.

## Scene 7 · Your turn (13:10 to 13:35)

> **Direction.** On camera, direct to the lens.

**[On camera]**

Here is your task for this week. Pick one pipeline from your own projects, and ask Claude Code to list its business rules without reading your notes. Check the list against what you know, and count the rules it missed. Then write one comparison query that checks your old output against a new run, row by row.

## Scene 8 · Call to action (13:35 to 14:05)

> **Direction.** On camera. Put the "Book a free call" card up on the first line, and the masterclass card on the second.

**[On camera]**

If you want help choosing a project like this for your resume, the first link in the description books a free fifteen-minute call with me.

If you want to learn to build and test pipelines step by step, the Stackle Data Engineering Masterclass teaches it in ten weeks. The link is in the description.

Tell me in the comments: what is the oldest job you have had to understand with no documentation?

---

## Graphics list

Graphics 1, 7, 9, 11 and 17 are screen recordings from the test day (`plan.md`, section 5). The rest are built as HTML and rendered with `stackle-video/source/render.js`.

1. **Hook (screen recording):** the test folder in a terminal. `ls` shows `nightly_orders`, `orders_20261019.csv` and `warehouse.db`. A red label: "Source code: deleted".
2. **Compile and reverse:** "Source code" → "compiler" → "Program". "Comments" and "names" fall off. A "reverse engineering" arrow points back.
3. **How REA works:** "You" → "Claude Code or Codex" → "REA" → "Ghidra (free)", "Hopper", "IDA". The return arrow: "evidence + what it could not work out".
4. **Install safely:** `npx rea-agents setup` · "Node.js 22.19 or newer" · "Official:" github.com/morluto/rea · npm "rea-agents". A fake "REA.exe" with a "Not official" stamp.
5. **The job:** "orders_20261019.csv" → "nightly_orders (C#)" → "fact_orders table in warehouse.db (SQLite)", with "reads", "cleans", "converts money" and "loads".
6. **Contestants:** "A: Claude Code" and "B: Claude Code + REA" · "Same model · same prompt · same computer · same tools" · "Only difference: REA".
7. **The prompt (screen recording):** the test folder, then the prompt being typed in each terminal.
8. **Three rounds:** "Round 1: normal .NET build. Names kept." "Round 2: machine code. Names stripped." "Round 3: rebuild, then check every row."
9. **Round 1 (screen recording):** both terminals side by side, sped up, with timers.
10. **Scoreboard after round 1:** "A: x/7 · false rules: n" and "B: x/7 · false rules: n".
11. **Round 2 (screen recording):** both terminals, plus Ghidra's "FUN_" function names if an agent opens Ghidra.
12. **Scoreboard after round 2:** the same layout as Graphic 10.
13. **The answer key:** seven rows with A and B ticks for round 2. Rows 2, 5 and 7 tagged "only in the code".
14. **The one-cent trap:** "2.125" → "C# Math.Round → 2.12 (a half goes to the even number)" and "PostgreSQL and DuckDB ROUND → 2.13 (a half goes away from zero)" · "1 cent on this row".
15. **The silent failure:** Monday "2,000 rows → loaded → Run complete". Tuesday "40 rows → nothing loaded → Run complete". A report marked "Updated today" that shows Monday's numbers.
16. **Parallel run:** "Same input file" → "Old job → old table" and "New job → new table" → "Compare every row" → "0 differences = they match".
17. **The compare (screen recording):** the DuckDB query and its output for each contestant.
18. **Final scoreboard:** rules found in rounds 1 and 2, false rules, wrong rows on each file, minutes and cost, for each contestant.

**Cards beside you:** the four parts (Scene 2); "Use REA / Skip REA" (Scene 6); "Book a free call" and the masterclass (Scene 8).

**The small corner scoreboard** runs from Graphic 10 to the end of the video.

**Shortened on-screen labels (not word for word from the script):** the card titles, the Graphic 3 return arrow, the Graphic 6 line "Same model · same prompt · same computer · same tools", the Graphic 8 round cards, the Graphic 13 tag "only in the code", the Graphic 15 strip, and the Graphic 16 result box. Every number on screen matches the script.

**Style for all graphics:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

---

## YouTube title

Reverse Engineer Anything (REA) vs a Pipeline With No Source Code

Other options are in `plan.md`.

## YouTube description

The viral GitHub repo REA says it can reverse engineer anything, so I gave it a nightly data job with no source code and seven hidden business rules. In this video I race Claude Code on its own against Claude Code with REA, score both on a sealed answer key, and check their rebuilt pipelines row by row. You will see where REA helps a data engineer, where it does not, and the one check that makes any rebuild safe.

Chapters
0:00 The job with no source code
0:00 What REA is and how to install it safely
0:00 The test: two contestants, three rounds
0:00 Round 1: a normal .NET build
0:00 Round 2: machine code with no names
0:00 The answer key: 7 hidden rules
0:00 The one-cent rounding trap
0:00 Round 3: the row-by-row check
0:00 How I would use REA on a data team
0:00 Your task for this week

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks

Sources
- REA (official repository, README, supported targets and safe-download warning): https://github.com/morluto/rea
- Ghidra (NSA, free and open source): https://github.com/NationalSecurityAgency/ghidra
- Model Context Protocol (Anthropic, 25 November 2024): https://www.anthropic.com/news/model-context-protocol
- How .NET compiles code to CIL with metadata: https://learn.microsoft.com/dotnet/standard/managed-execution-process
- Native AOT: https://learn.microsoft.com/dotnet/core/deploying/native-aot/
- Math.Round rounds midpoints to the nearest even number by default: https://learn.microsoft.com/dotnet/api/system.math.round
- PostgreSQL round breaks ties away from zero: https://www.postgresql.org/docs/current/functions-math.html
- Python round sends ties to the even choice: https://docs.python.org/3/library/functions.html#round
- Report of a fake REA copy with a trojan: https://pasqualepillitteri.it/en/news/23845/rea-reverse-engineer-anything-github-true-false

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab

---

## Facts, examples and lines added for Chris to check

- **The intro has no interviews sentence,** because this is a tool video. Say if you want it back.
- **LinkedIn followers:** the script says "more than thirteen thousand", as in your recent scripts. Use the real count on the day you film.
- **Two lines from your own experience to confirm:** "I have met jobs like this in banking and in financial exchanges…" (Scene 4) and "When I review a data engineer's resume…" (Scene 6). Cut either one if it is not true for you.
- **The examples were added by Claude:** the mechanic with no manual (reverse engineering), reading GitHub issues (MCP), and two bank statements (the parallel run).
- **"A fake copy with malware inside was reported in the first week"** comes from one fact-check article, which cites a report on the official repository. REA's own README carries the warning about copies. If you want to stay fully safe, say "REA's own page warns about fake copies" instead.
- **rea.tools** is also an official source, according to the README. The script names only the GitHub page and npm, to keep the line short. The graphic matches the script.
- **The rules, the files and the traps** are our own design (`plan.md`, sections 3 and 4). If the kit changes, the script's rule lines change with it.
- **The result slots and verdict lines** must be filled from the real test. Nothing in the results is written yet, and no score is guessed.
- **The title** puts the search phrase first. Two more options are in `plan.md`.
