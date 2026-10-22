# Breakdown: "How to Become an AI Engineer - 12-Week Roadmap + Free Resources"

Jam With AI (Shirin Khosravi Jam) · https://youtu.be/MTt0CeDNvKE · checked on 22 October 2026

This is the closest rival to idea #19 in `stackle-video/plan/content-plan.md` ("Data Engineer to AI Engineer: What to Learn First (90-Day Plan)"), which is planned for week 4. It went up two days before this check.

**How it was read.** The title, views, likes, chapters and description came from yt-dlp. The full auto-caption transcript came through as well, so every quote below is from the video. The video file itself was blocked (HTTP 403), so the visual notes come from YouTube's storyboard frames. `jamwithai-MTt0CeDNvKE-frames.jpg` shows 0:00–2:03 (top) and 6:11–8:15 (bottom), one frame about every 5 seconds. `jamwithai-MTt0CeDNvKE-thumbnail.jpg` is the thumbnail.

## The numbers

| Uploaded | Length | Views | Likes | Comments | Channel subscribers |
|---|---|---|---|---|---|
| 20 Oct 2026 | 13:41 | 11,622 | 298 (2.6%) | 12 | 10,800 |

The channel has only 4 long videos. The other 3 went up in August and September 2026 and have about 40K, 37K and 30K views (rounded figures from the channel list). So this one is on the channel's usual pace and is not an outlier yet. What stands out is the channel: 4 videos and 10.8K subscribers. The format works without an audience behind it.

## What's in it, week by week

The intro runs from 0:00 to 2:24. Then each week gets 30 to 90 seconds.

| Week | Starts | What she teaches | Project | Main resource |
|---|---|---|---|---|
| 1 | 2:24 | Python basics, uv, Git and GitHub, HTTP and JSON, unit and integration tests | **1. News summarizer**: paste articles into a CSV, read it with pandas, make one OpenAI call | Dave Ebbelaar, Corey Schafer |
| 2 | 3:52 | CI with GitHub Actions. Classic ML is optional (regression, trees, overfitting, precision and recall) | — | GitHub Skills, Microsoft ML for Beginners |
| 3 | 4:56 | SQL. Run PostgreSQL locally and store the summaries there instead of the CSV | Project 1 moves to Postgres | SQLBolt |
| 4 | 5:27 | How LLMs work: weights, training, inference, transformers, tokens, embeddings, context windows | — | Karpathy, Hugging Face LLM course |
| 5 | 6:46 | Optional LoRA fine-tune. Prompt vs context vs training | — | Unsloth notebooks |
| 6 | 7:32 | RAG: chunking, embeddings, hybrid search, answers with sources, a local LLM, pgvector | **2. Basic RAG app** (Streamlit) | Her own beginner RAG repo and two Substack posts |
| 7 | 9:00 | FastAPI: validation, async, routers, dependency injection, login vs permissions, migrations, a streaming UI | Project 2 gets an API | Corey Schafer's FastAPI series |
| 8 | 10:07 | Docker, Compose, Cloud Run. Config, secrets, logs, health checks, cost limits, timeouts | Project 2 is deployed | TechWorld with Nana, Corey Schafer |
| 9 | 10:59 | Continuous delivery that runs "AI test questions" before each release | **3. Production agent** ("23 production tools") | Her production agentic RAG course |
| 10 | 12:04 | Agent memory, and long-term memory for each user | Project 3 | Her memory video, LangChain |
| 11 | 12:45 | MCP, and AI system design (caching, rate limiting) | Project 3 | freeCodeCamp, Hugging Face, her system design video |
| 12 | 13:17 | Voice agents and LLMOps (observability) | **4. Observable Job Agent** | Her own repo |

## What it does well (copy these)

1. **Proof in the first 10 seconds.** "I'm now an engineering manager leading a team of engineers to build such solutions." By 0:51 she adds shipped agents and "over 10,000 stars on GitHub". The thumbnail says the same thing in a yellow marker sticker: "I do this job!"
2. **Projects, not a watch list.** At 0:16 she says "This is not just about watching videos and tutorials, but you will build four hands-on projects", and names all four.
3. **One project that keeps growing.** "Keep improving the same RAG app as you learn." Weeks 7–9 add an API, login, Docker and CI/CD to the same app. The viewer ends with one deep portfolio project instead of five toy ones.
4. **She scopes the job before teaching it.** At 1:12 she splits applied AI engineering (apps built on model APIs) from LLM infrastructure (hosting models, fine-tuning, vLLM, Kubernetes), then picks the first one. That clears up the most common confusion before it can lose anyone.
5. **The whole plan on one screen.** At about 2:00 a grid shows all 12 weeks. After that, a bar at the bottom of the screen always shows "Week N · Project N", so the viewer knows where they are.
6. **The description is the product.** Every week has its links, more than 30 in total. Most come from bigger, trusted creators (Karpathy, Corey Schafer, freeCodeCamp, Hugging Face). That makes the video worth saving.
7. **The roadmap points to her other videos.** Weeks 9, 10 and 11 send viewers to her 3 earlier videos, and weeks 6, 9 and 12 send them to her GitHub repos. The roadmap is a hub that feeds the rest of the channel.
8. **Honest about cost and pace.** "If programming is new to you, allow some more time." "Running APIs or cloud services can cost extra, but you can always set budgets."
9. **Real engineering details most roadmaps skip.** Keyword search alongside vector search "when you have a need for exact matches like product codes or medicine names" (8:27). pgvector instead of a separate vector database. "Evaluate retrieval and generation stage of RAG separately." "Being signed in should not mean being able to retrieve every document" (9:36). "Test an unavailable model service just to see what goes wrong" (10:46).

**How it looks.** It cuts between a face cam in a dark room lit purple and pink, and full-screen cards every few seconds. There are three card types: dark cards with a headline and a list that builds ("Four projects. Real practice."), a big stat card ("Roughly 2×"), and cream cards with simple hand-drawn diagrams ("Train a small adapter.", "MCP connects your app to its tools."). Most linked resources get a screenshot. It ends on "Build. Test. Ship." The thumbnail has big two-line text, a purple "Resources included" pill, the face on the right, and a navy background with a cyan headline. **Watch out:** that is close to the Stackle intro's navy, blue and cyan palette, so a Stackle thumbnail for this topic should look different.

## Where it's weak (the openings for Stackle)

1. **There is no hiring step.** It ends at week 12 with "best of luck". At 13:00 she mentions "the next phase of your interview practice", but that phase never comes. There are no job titles, no resume, no interview rounds and no pay. This is exactly where Chris has the edge: 200+ interviews from the hiring side.
2. **Evals are a footnote.** They get one line in week 6 and one line in week 9 ("run your AI test questions"). They never get a week, and no eval tool is named. The content plan (#33) calls evals the skill AI teams hire for.
3. **It's written for beginners.** Weeks 1, 2, 3, 8 and 9 (Python, Git, tests, CI, SQL, Docker, CD) are mostly things a working data engineer already does. That's 5 of the 12 weeks. For Stackle's audience, the new material is closer to 7 weeks.
4. **It skips the data work.** Loading documents takes one line. A data engineer's real edge in AI is everything around that line: getting the documents in, cleaning them, chunking as a pipeline, keeping the index fresh when the sources change, metadata, and who is allowed to see which document. To a data engineer, a RAG app is a data pipeline. None of this is in the video.
5. **A few confusing lines.** Week 5 (7:10): "This exercise is optional, but it is not relevant yet, so compare models and improve your evaluation instead." At 1:57 she promises "six phases across 12 weeks" but never names them. Week 9 has two chapters. There are no hours per week, so "12 weeks" can't be checked against a real schedule.
6. **Two different experience numbers.** On camera she says "more than 2 years working hands-on in AI engineering". The description says "9+ years of experience building and deploying AI/ML applications". Both can be true (she came from data science), but side by side they read oddly. Chris should use one clear number.

## The stat it uses

"LinkedIn reported in August 2026 that US AI job posts on its platform had roughly doubled since 2023" (1:03). A search found Staffing Industry Analysts' coverage of that LinkedIn research, so the claim holds up. The search summary also gives a typical advertised AI salary of about $177,000, roughly double the typical non-AI posting. The article itself returned 403, so check that salary figure before using it on camera.
Source: https://www.staffingindustry.com/news/global-daily-news/ai-job-postings-doubled-since-2023-with-men-taking-most-roles

## What this means for idea #19

The lane for a general AI engineer roadmap is now crowded. The lane for **data engineers** is still open, and this video shows exactly what to leave out.

**Suggested angle:** start from the standard roadmap and cross out what a data engineer already knows. Then spend the saved weeks on the three things this video skips: RAG as a data pipeline, evals, and getting hired.

**Title ideas**
- Data Engineer to AI Engineer in 90 Days (You Already Know Half of It)
- The AI Engineer Roadmap for Data Engineers: Skip These 5 Weeks
- I Interviewed 200+ Engineers. Here's How a Data Engineer Becomes an AI Engineer in 90 Days

**Hook idea.** "Every AI engineer roadmap starts with Python, Git, SQL and Docker. If you're a data engineer, you already do that every day. Here's what you actually need to learn, and what I check when I interview AI engineers."

**A 13-week shape (about 90 days)**

| Weeks | Focus | Why |
|---|---|---|
| 1–2 | LLM basics and the model API | The only real gap in the foundations |
| 3–5 | RAG as a data pipeline: ingest, clean, chunk, embed, refresh, permissions | A data engineer's strength, and the video skips it |
| 6–7 | Evals, before agents | The skill AI teams hire for; the video gives it two lines |
| 8–10 | Agents, tools, MCP, memory | Same as the video, aimed at data use cases |
| 11–13 | Getting hired: job titles to search, resume rewrite, interview rounds, what Chris checks | The video has no hiring step |

**Copy from it:** one project that grows all the way through; the plan grid on screen early, with a "Week N" bar after it; resources in the description week by week; a link in each week to our own videos (#28 Python for AI, #29 RAG, #30 Vector Databases, #31 Agents, #32 MCP, #33 Evals) so the roadmap becomes the channel's hub; a proof sticker on the thumbnail, for example "I hire for this" (her sticker says "I do this job!").

**Don't copy:** the beginner weeks, the vague "six phases", and the "best of luck" ending. End on the hiring phase and the Stackle asks in `stackle-video/source/asks/`.
