# FDE Roadmap 2026: motion graphics

These are the full-screen graphics for the script in `stackle-video/scripts/fde-roadmap-2026.md`. Every file is 1920x1080 at 30 fps, uses Plus Jakarta Sans, and uses white text with blue #2F7CF6 highlights on a black #07090D background.

## How the timing works

- Each graphic is timed to your voiceover at 150 words a minute. Every beat appears on the word it belongs to.
- Each file runs 1.5 seconds past the end of its paragraph and holds on the last frame. Trim the tail or let it sit under your pause.
- The timing follows the 9-minute script. Each graphic's re-timing (`ts` or `tmap`) is stored in `stackle-video/source/fde/manifest.json`, so the HTML scenes keep their original beat order.
- If you read slower or faster, stretch or squeeze the clip in the editor. The beats stay in order.
- Graphics 2 and 37 re-time your existing intro and call-to-action animations to this script's lines. The originals in `stackle-video/graphics/` are unchanged.

## Order of the video

Total graphics time: 8.7 minutes.

| # | File | Section | Length | Voiceover starts with |
|---|---|---|---|---|
| 1 | `g01-hook.mp4` | Hook | 22.5s | Job postings for forward deployed engineers in the United ... |
| | **On camera, scene 1 of 6** | Promise | | |
| 2 | `g02-intro.mp4` | Intro | 25.3s | If you are new here, I am Chris. I ... |
| 3 | `g03-part1-title.mp4` | Part 1: What the job is | 6.9s | Before the skills, you need a clear picture of ... |
| 4 | `g04-what-is-fde.mp4` | Part 1: What the job is | 20.1s | A forward deployed engineer, or FDE, is a software ... |
| 5 | `g05-palantir-origin.mp4` | Part 1: What the job is | 8.9s | The role started at Palantir, and Shyam Sankar, the ... |
| 6 | `g06-devs-deltas.mp4` | Part 1: What the job is | 12.1s | Palantir split its engineers into Devs, who built the ... |
| 7 | `g07-llm-limits.mp4` | Part 1: What the job is | 18.1s | The FDE idea spread when AI companies began selling ... |
| 8 | `g08-mit-study.mp4` | Part 1: What the job is | 16.5s | In 2025, an MIT study found that about ninety-five ... |
| 9 | `g09-who-hires.mp4` | Part 1: What the job is | 13.7s | So AI companies started hiring FDEs. OpenAI built an ... |
| 10 | `g10-bank-example.mp4` | Part 1: What the job is | 18.1s | Here is what the work looks like at a ... |
| 11 | `g11-accountability.mp4` | Part 1: What the job is | 6.9s | An FDE is judged by the customer's result, not ... |
| 12 | `g12-four-jobs.mp4` | Part 1: What the job is | 23.7s | The focus on results is also what separates an ... |
| 13 | `g13-read-postings.mp4` | Part 1: What the job is | 10.5s | Some companies use the FDE title for consulting work, ... |
| | **On camera, scene 2 of 6** | Who the job suits | | |
| 14 | `g14-pay-hype.mp4` | Part 2: Pay, experience, travel | 12.9s | Some videos say this job pays a million dollars ... |
| 15 | `g15-salary-ranges.mp4` | Part 2: Pay, experience, travel | 18.1s | Real job posts are clearer, with base salaries from ... |
| 16 | `g16-experience.mp4` | Part 2: Pay, experience, travel | 13.7s | Experience matters more than most roadmaps admit. Only twelve ... |
| 17 | `g17-timeline.mp4` | Part 2: Pay, experience, travel | 13.3s | So for most people, FDE is a second or ... |
| 18 | `g18-travel.mp4` | Part 2: Pay, experience, travel | 8.1s | The job also comes with travel, up to half ... |
| | **On camera, scene 3 of 6** | Why the roadmap starts with code and data | | |
| 19 | `g19-five-phases.mp4` | Part 3: The roadmap | 8.9s | The five phases are software foundations, data and cloud, ... |
| 20 | `g20-phase1-foundations.mp4` | Part 3: Phase 1, software foundations | 19.3s | Phase one is software foundations. Learn Python, which appears ... |
| 21 | `g21-git-typescript.mp4` | Part 3: Phase 1, software foundations | 7.3s | Add Git to track your code, and basic TypeScript ... |
| 22 | `g22-phase2-pipeline.mp4` | Part 3: Phase 2, data and cloud | 18.5s | Phase two is data and cloud. At a real ... |
| 23 | `g23-docker-cloud.mp4` | Part 3: Phase 2, data and cloud | 12.9s | Then learn Docker, which packs your code so it ... |
| 24 | `g24-access-control.mp4` | Part 3: Phase 2, data and cloud | 9.3s | Finish phase two with access control, so each person ... |
| 25 | `g25-phase3-applied-ai.mp4` | Part 3: Phase 3, applied AI | 14.5s | Phase three is applied AI, which means building with ... |
| 26 | `g26-rag.mp4` | Part 3: Phase 3, applied AI | 14.5s | Next, learn RAG, short for retrieval-augmented generation. The system ... |
| 27 | `g27-agents.mp4` | Part 3: Phase 3, applied AI | 8.9s | Then learn agents, which are AI systems that take ... |
| 28 | `g28-mcp.mp4` | Part 3: Phase 3, applied AI | 11.3s | Agents connect to tools through MCP, the Model Context ... |
| 29 | `g29-evals.mp4` | Part 3: Phase 3, applied AI | 11.7s | Last, learn evals, which are test questions with known ... |
| 30 | `g30-phase4-discovery.mp4` | Part 3: Phase 4, customer skills | 10.5s | Phase four is customer skills, starting with discovery, which ... |
| 31 | `g31-scoping-tradeoffs-writing.mp4` | Part 3: Phase 4, customer skills | 9.3s | Then learn to scope a small first version, explain ... |
| 32 | `g32-practice.mp4` | Part 3: Phase 4, customer skills | 10.5s | You can practice these skills now by volunteering for ... |
| 33 | `g33-phase5-proof.mp4` | Part 3: Phase 5, proof of work | 16.5s | Phase five is proof of work. Build each project ... |
| 34 | `g34-two-projects.mp4` | Part 3: Phase 5, proof of work | 16.5s | Two projects are enough to start. The first is ... |
| 35 | `g35-interview.mp4` | Part 4: The interview | 15.7s | The last step is the interview. It still includes ... |
| | **On camera, scene 4 of 6** | The decomposition interview | | |
| 36 | `g36-decomposition.mp4` | Part 4: The interview | 15.3s | So if you are asked to cut emergency room ... |
| | **On camera, scene 5 of 6** | Your turn | | |
| 37 | `g37-cta.mp4` | Call to action | 20.1s | If you want help planning your path into an ... |
| | **On camera, scene 6 of 6** | Comment question and goodbye | | |

## Values on screen that are examples, not data

- Graphic 29 shows the scores 91 and 93 and a 100-question test as an example. Change or remove them if you prefer.
- Graphic 31 labels the slider ends "cheaper" and "faster answers", and shows a sample update note.
- Graphic 26 shows the sample question "How many days off do I have left?".

## On-screen labels I wrote or shortened

Most on-screen text uses the script's own words. These labels are mine, so check them:

- **1:** "Up 1,000%+ from last year", "Median advertised salary", "2026 (Jan–Jul)"
- **4:** "Most developers", "one client"
- **5:** "Where the job came from", "thirteenth employee"
- **7:** "How the idea spread", "A Palantir idea", "An LLM can", "On its own, it cannot"
- **8:** "Blamed: how the tools fit into daily work"
- **9:** "FDEs committed", "Also hiring for the role"
- **10:** "The model on its own"
- **11:** "Not finished" and "Finished"
- **13:** "consulting?", "setup work?", "Writing real code?", "Owning a real result?"
- **14:** "Rare" and "Typical"
- **17:** "First job" and "Second or third job"
- **18:** the weekday calendar
- **22:** "Get access", "Fix the errors", "Move everything", "One clean place"
- **24:** "patient record", "wrong person", "another client", "Logins", "Permissions"
- **25:** "your app", "A good prompt says"
- **26:** "not from memory", "Answer, based on the leave policy"
- **28:** "A tool, built once", "AI app"
- **30:** "We need a chatbot", "The real problem"
- **31:** "cheaper"
- **32:** "Month 1–3", "Proof"
- **34:** "Approve" and "Reject"
- **35:** "plus rounds that test"
- **36:** "A big, vague problem", "Asks first / do well", "Jumps to a tool / struggle"

## Changing the colours

The colours for this video live in one file, `stackle-video/source/fde/theme.css`, and every graphic reads from it. Two palettes are ready to use:

- `theme-black.css`: black background, white text, blue highlights. This is the current palette.
- `theme-white.css`: white background, black text, blue highlights.

To switch palettes, copy one of them over `theme.css` and re-render. Your channel's original intro and call-to-action animations keep the amber Stackle palette from `stackle-video/source/base.css`.

## Editing the graphics

The source is in `stackle-video/source/fde/`, with one HTML file per graphic. Beats are set with `data-in` times in seconds. To re-render after a change:

```bash
cd stackle-video/source
npm install
NODE_PATH=$(npm root -g) node render-all.js fde/manifest.json 4          # all graphics
NODE_PATH=$(npm root -g) node render-all.js fde/manifest.json 1 15       # only graphic 15
NODE_PATH=$(npm root -g) node snap.js fde/g15-salary-ranges.html /tmp/g15 10 38   # stills at 10s and 38s
```

You need Playwright (with Chromium) and ffmpeg installed.
