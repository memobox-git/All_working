# RAG, Explained in 2 Minutes: Script (draft for review)

**Series:** Explained in 2 Minutes: AI Engineering, episode 01. It is a separate run from the data engineering episodes; the 100 topics are in `ai-series-roadmap.md`.

**Spoken words:** 271 · **Estimated voice:** about 1:32 · **Video:** about 1:55 (opening card, the problem as the hook, channel intro, the rest of the episode, comment ask)

**Format:** the same as the Airflow and Kafka episodes:
- both cuts, landscape for YouTube and portrait for TikTok, Reels and Shorts;
- the "Crispus Roshan" voice, with `[confident]` and `[warmly]` for the last part;
- the 120 BPM beat, and word-by-word captions in the portrait cut;
- each cut opening on its thumbnail.

**Status:** waiting for your review. Nothing has been recorded. A silent preview of the landscape cut (1:57) is in `stackle-video/graphics/rag-explained-preview.mp4`. It has estimated timings, the words on screen, the beat and your channel intro, and it is built from `stackle-video/source/rag/`. The opening card is a temporary design until your thumbnail arrives.

---

## Script

> [confident] Ask a chatbot about your company's refund policy. It's never seen it. So it either says it doesn't know, or worse, it makes one up, and sounds completely sure. The fix isn't a bigger model. It's handing it the right page before it answers. That's what RAG does.
>
> *(your intro: "Hi, I'm Chris … Let's get into it.")*
>
> RAG stands for retrieval-augmented generation. Retrieve the right information, augment the prompt with it, then generate the answer. It comes from a 2020 paper by researchers at Facebook AI, and today it's one of the first systems AI engineers learn to build.
>
> Here's the core idea. A model only knows what it saw in training, and that stops at a cutoff date. RAG doesn't retrain the model. It looks up the right text when the question comes in, and puts it in the prompt. Like an open-book exam, instead of answering from memory.
>
> Now, the architecture. There are two pipelines. The first one runs ahead of time. It splits your documents into small chunks, turns each chunk into an embedding, a list of numbers that captures its meaning, and stores them in a vector database. The second one runs on every question. The question becomes an embedding too, and the database finds the chunks closest in meaning. Those chunks go into the prompt, and the model answers from them, with sources. And when the policy changes, you re-index that one document, and the next answer is right.
>
> [warmly] So when a job post asks for RAG, it means you can build both pipelines. Get your documents in. Get the right chunks out. And every answer comes from your data, with its source. That's RAG.
>
> *(the shared ending: "So, what should I explain next? Tell me in the comments below …")*

The five parts, against the series plan:

| Part | Words | Target |
|---|---|---|
| The problem | 48 | 45 |
| What it is | 42 | 40 |
| The core idea | 51 | 50 |
| Architecture | 94 | 85 |
| In short | 36 | 35 |

## What is on screen

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | The RAG thumbnail. A temporary design until yours arrives |
| The problem | "Ask a chatbot …" | A chat window. "What's our refund policy?" types in. Beside it, the company's `refund-policy.pdf` (30 days) sits behind a lock: the model has never seen it |
| | "… says it doesn't know" | The bot answers, in grey: "Sorry, I don't have access to that." |
| | "… makes one up, and sounds completely sure" | The answer is replaced: "Refunds are available within 60 days." A red "made up" stamp lands on it |
| | "The fix isn't a bigger model." | The model chip grows bigger and gets crossed out |
| | "… handing it the right page …" | The policy page flies into the chat. The answer becomes "Refunds are available within 30 days [1]", with the source chip |
| | "That's what RAG does." | The RAG lockup, on the beat drop |
| Channel intro | "Hi, I'm Chris …" | The Stackle intro, straight after the hook |
| What it is | "RAG stands for …" | R · A · G spells out into Retrieval · Augmented · Generation, the way D·A·G did in the Airflow episode |
| | "Retrieve … augment … generate" | Three step cards light in turn: find the right text, add it to the prompt, write the answer |
| | "… a 2020 paper …" | Timeline: 2020, the RAG paper (Facebook AI Research) → today, one of the first systems AI engineers build |
| The core idea | "A model only knows …" | A "what the model saw in training" bar fills up to a cutoff flag. Your documents sit outside it |
| | "RAG doesn't retrain …" | A "retrain" button, crossed out |
| | "It looks up the right text …" | The prompt builds: the question, plus the retrieved paragraph slotted in under it |
| | "Like an open-book exam …" | Closed book (from memory, dimmed) vs open book (look it up, lit) |
| Architecture | "There are two pipelines." | Two lanes: ① Indexing, ahead of time, and ② Retrieval, every question. The camera follows each part as it is named |
| | "It splits your documents …" | Three files → a page cut into numbered chunks → each chunk becomes a row of numbers → dots on a meaning map inside the vector database |
| | "The second one runs on every question." | The question → its own row of numbers → a query point lands on the map, and the three closest dots light up |
| | "Those chunks go into the prompt …" | The three chunks fly into the prompt → the model → the answer, with [1] [2] sources |
| | "And when the policy changes …" | The full view. The policy changes from 30 to 14 days, and the answer goes out of date. Only that file runs through the indexing lane again, and the answer updates to 14 days |
| In short | "So when a job post asks for RAG …" | A job post: AI Engineer · Python · RAG pipelines · LLM evals, with "RAG" highlighted. Then the takeaways: Get your documents in · Get the right chunks out · Every answer comes with its source |
| | "That's RAG." | The closing title: the RAG mark and wordmark, "Explained in 2 minutes", "Stackle · AI Engineering · Episode 01" |
| Comment ask | "So, what should I explain next? …" | The shared comment box |

## Where you could be on camera (for the next pass)

The script works as voice-over now, and these are the places where you could appear on camera instead:

| Spot | What it would look like |
|---|---|
| The hook | You, to camera, holding your phone: "Ask a chatbot about your company's refund policy…". The chat window slides in beside you. This is the strongest option, because people stay for a face in the first three seconds |
| "That's what RAG does." | A quick cut back to you as the RAG title lands, then straight into your channel intro |
| In short | You, to camera, delivering the job-post line, with the takeaways appearing next to you |

The architecture stays full-screen graphics either way, because that is the part people come for.

## Facts to check before recording

| Claim | Source |
|---|---|
| RAG comes from "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", Lewis et al., first posted on 22 May 2020 and accepted at NeurIPS 2020 | [arXiv:2005.11401](https://arxiv.org/abs/2005.11401) |
| The authors were at Facebook AI Research (with University College London and New York University) | The paper's author list ([PDF](https://arxiv.org/pdf/2005.11401)) |
| A model's knowledge stops at its training cutoff date | Model documentation lists a "training data cutoff" for each model, for example [Anthropic's models overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) |
| An embedding is a list of numbers (a vector) that captures meaning, so similar texts get similar vectors | [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings) |
| A vector database finds the stored vectors nearest to a query vector | For example the [pgvector README](https://github.com/pgvector/pgvector) (nearest-neighbour search) |

**Kept simple on purpose:**
- The 2020 paper trained its retriever and generator together. Today "RAG" usually means the looser pattern: an off-the-shelf model, with retrieved text put into the prompt. The script describes today's meaning.
- Real systems often add keyword (hybrid) search and a reranking step. Both get their own episodes later (33 and 34 in the roadmap).
- Re-indexing "that one document" assumes the pipeline tracks which chunks came from which file, which is normal practice.
- The 60-day answer, the 30 and 14 days, and the numbers in the embeddings are illustrations.
