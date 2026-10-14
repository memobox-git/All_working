# Monday and Wednesday posts, aligned with YouTube videos

Rule: on Mondays and Wednesdays, the LinkedIn post goes with that day's YouTube video. The post gives the core of the video in full, so it works for people who never click. The video link goes in the **first comment**, not the post body (links in the body cut reach).

Each post is tied to a video, not a date. If you publish a different video that day, use that video's post.

| Day | Video (script in `stackle-video/scripts/`) | Post below |
|---|---|---|
| Mon Oct 19 | AI Product Manager Roadmap 2026 (`ai-pm-roadmap.md`) | A |
| Wed Oct 21 | AI Concepts Explained: 20 Terms (`ai-concepts-one-project.md`) | B |
| Mon Oct 26 | AI Solutions Architect Roadmap (`ai-solutions-architect-roadmap.md`) | C |
| Wed Oct 28 | Claude Motion Tutorial (`claude-motion-editing.md`) | D |

**Visual:** a 45-60 second clip cut from the video, uploaded to LinkedIn directly (vertical or square, captions on). If there's no clip, post text-only.

**First comment, right after posting:** "Full video: [YouTube link]"

Before filming any of these: the intro in all four scripts says "more than two hundred thousand people follow me on LinkedIn". Change it to your real number.

---

## A · AI Product Manager Roadmap

Facts are from the video's sources: Dice job ads posted Aug-Oct 2026 (the $304K is Toast, Principal PM, Vision AI) and Levels.fyi. The cost math is an example, as in the video.

```
An AI product manager job posted this fall pays up to $304,000 in base salary.
It isn't at an AI lab. It's at a restaurant software company. 👇

I went through US AI PM job ads posted from August to October. Base pay:
→ Entry (associate, new grad): about $120K to $185K
→ Senior: about $130K to $210K
→ Lead and principal: $140K up to $304K

The same seven skills kept showing up:
1. How LLMs work: tokens, context windows, hallucinations
2. RAG, agents and fine-tuning, and which one a problem needs
3. Evals: testing the AI on real questions before launch
4. Trade-offs between quality, speed and cost
5. Enough SQL to pull your own numbers, plus A/B tests
6. Prototypes people can click, built with tools like Cursor or Claude Code
7. Specs, with a section on what the AI must never do

Skill 4 is the job in one example. Say every answer costs 1 cent and you get a million questions a day. That's $3.65M a year. A bigger model at 10x the price is $36.5M. Is "a bit smarter" worth $33M more? Someone has to make that call.

Two things most AI PM roadmaps get wrong:
→ "No coding needed." One senior AI PM job makes every applicant take a 60-minute coding test.
→ Evals come last. A new grad AI PM job asks for evaluation frameworks using precision and recall.

Nobody hires potential. They hire proof.

I walk through all five phases, with a test at the end of each, in my new YouTube video. Link in the first comment.
```

---

## B · 20 AI concepts

Definitions are the one-line versions of the video's own definitions.

```
Every AI meeting uses the same 20 terms.
This is each one in a single line, in the order they build on each other. 👇

Inside the model
1. LLM: a program that predicts the next piece of text, over and over
2. Token: a chunk of text, about 3/4 of a word. You pay for every one.
3. Embedding: a list of numbers that captures what text means
4. Transformer: the design behind almost every LLM, built on attention

How it was trained
5. Pre-training: reading huge amounts of text and guessing the next token
6. Fine-tuning: extra training on examples you choose
7. Reinforcement learning: try, get a score, do more of what scored well
8. Reasoning model: works through the steps before it answers
9. Hallucination: confident and false, because likely isn't the same as true

What you send it
10. Context window: the most text it can work with at once
11. Prompt: your instructions plus the question
12. RAG: find the right documents and add them to the prompt
13. Vector database: finds text with the same meaning, not just the same words

How it takes action
14. Tool calling: the model asks, your code runs it
15. MCP: one standard plug between AI apps and tools
16. Agent: a model using tools in a loop until the job is done
17. Context engineering: choosing what the model sees at every step

How you ship it
18. Evals: tests for your AI, on questions with known answers
19. Distillation: training a small model to copy a big one
20. Quantization: storing the model's numbers in fewer bits so it needs less memory

If you can say each of these in one sentence, you can follow any AI conversation in the room.

Data tests check your data. Evals check your AI.

The full video has an example and the math for every term. Link in the first comment.
```

---

## C · AI Solutions Architect Roadmap

Before posting: the script asks you to confirm the pay ranges on the employers' own sites, because they came from job-board copies. If the video changes, change the numbers here to match. The Gartner figures are from Gartner press releases (Jun 25, 2025 and Jul 29, 2024).

```
AI Solutions Architect job postings pay up to $356,000 in base salary.
Almost none of them are for beginners. 👇

The job in one line: an AI engineer builds the system. An AI Solutions Architect decides what the system should be before anyone writes code. Which problem, which design, what it costs each month, and how you'll know it works.

Companies need that badly. Gartner predicts over 40% of agentic AI projects will be canceled by the end of 2027, because of rising costs, unclear business value and weak risk controls. None of those is a bad model. Every one is a design problem.

Base pay from real postings:
→ First level: about $115K to $170K
→ Specialist: about $150K to $240K
→ Senior and principal: about $210K to $356K

The roadmap has four phases, and each one ends with proof you can show:
1. Engineering foundation → a small app running on one cloud
2. Building with AI → a RAG app with an eval report, scored before and after you improve it
3. Architecture → a cost estimate, a security plan and two decision records
4. The business side → a one-page business case that turns the design into dollars

Data engineers have an edge here. Gartner named poor data quality as a top reason generative AI projects get dropped after the first test. If you build pipelines, you already own the part most AI projects get wrong.

The title follows the work. Start doing the work first.

The full roadmap is in my new YouTube video. Link in the first comment.
```

---

## D · Claude Motion

Facts from the video's sources (Anthropic, Descript and CapCut pages, Oct 2026). This is the post most likely to get lower reach, because Claude explainers have done 120-260 impressions on your profile. It's framed around showing a project you built, not the tool.

```
Claude can now turn a report, a chart or an idea into a short animated video.
For engineers, the best use is showing a project you built. 👇

Claude Motion came out on October 8. It doesn't use a video generation model. Claude writes code that moves your own text, charts and images across the screen. That means you can change one word or one number without rebuilding the whole video. It also means it can't film a person.

Right now it's in beta, on the Team and Enterprise plans only.

A good prompt is a four-line brief:
→ who will watch
→ where it will play
→ how long it is
→ what shape it is: 16:9 for YouTube, 9:16 for a phone

Then attach your real numbers, and read every word and number before you post. Your name is on it.

The animation has no voice and no captions, so finish it in an editor:
→ Descript: send it straight from Claude, cut by editing the text, remove filler words, add captions
→ CapCut: split, switch to 9:16, zoom with keyframes, auto captions

Your resume lists tools. A 30-second video shows a working project.

I made one start to finish in my new YouTube video. Link in the first comment.
```
