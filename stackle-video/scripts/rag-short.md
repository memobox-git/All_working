# RAG, as a vertical Short

**Format:** your cloned voice over full-screen scenes of RAG at work, one scene per line. No presenter on screen: the pictures show what RAG does. The pace, captions and quiet sound follow the style of Vaibhav Sisinty's Shorts (reference: youtube.com/shorts/tMSqFrAiggw).

**Length:** 140 spoken words, 45 seconds. Vertical 1080×1920 for Shorts, Reels and TikTok.

**Status:** made. The video is `stackle-video/graphics/rag-short.mp4` and its captions are in `rag-short.srt`. The source is in `stackle-video/source/rag-short/` (run `./build.sh`).

---

## The style

| Element | How it's done |
|---|---|
| Voice | The "Crispus Roshan" voice (`eleven_v4`, `[conversational]`), take 1 of 4, transcribed with `eleven_scribe_v1` so every picture lands on its word |
| Pace | One scene per line, with a hard cut between lines. The framing alternates between wide and a slight punch-in, with a slow push-in on the hook and a gentle drift |
| Picture | A warm cream backdrop. Clean white cards for the mechanics (chat, documents, paragraphs, numbers, the map of meaning, the answer and its source), with glossy 3D props as characters (the robot librarian is RAG) |
| Captions | 2 to 4 words at a time, white on a dark pill, under the picture |
| Sound | Voice only, with a soft pop when a prop lands, a light whoosh when a card arrives and a tick on each highlight. No music. Levelled for Shorts |

## Script and scenes

| # | Voice | Scene |
|---|---|---|
| 1 | Your company's AI chatbot isn't dumb. | A company chat assistant, "Powered by a top AI model" |
| 2 | It just never read your documents. | The bot, a dashed line to locked files, and a red ✕: "never read them" |
| 3 | Ask it your refund policy, and it'll confidently make one up. | "What's our refund policy?" → "Refunds within 60 days" → a red "made up" stamp |
| 4 | And the fix isn't a bigger model. | The model card grows from 70B to 700B parameters, "10× bigger", then gets a big red ✕ |
| 5 | It's a trick called RAG. | The robot librarian pulling the right file, and R·A·G (Retrieval · Augmented · Generation) |
| 6 | Think of it like an open-book exam. | An exam paper and an open book: "look it up" |
| 7 | Before the model answers, it searches your documents, | Six documents, with a magnifying glass sweeping across them |
| 8 | grabs the three paragraphs that match the question best, | The question, then the three best paragraphs ranked 1, 2, 3, each with its source |
| 9 | and reads them first. | The prompt: the question and the three paragraphs, with the robot reading them |
| 10 | Behind the scenes, every paragraph is turned into numbers that capture its meaning, and stored in a vector database. | A paragraph turns into `[0.12, −0.83, 0.44, …]`, then the numbers flow into the database |
| 11 | So it finds the right paragraph even when you use different words. | The map of meaning: "Can I return this?" lands next to "Refunds within 30 days": "same meaning, different words" |
| 12 | That's why the answer comes back with a source you can click. | "Refunds within 30 days [1]", a tap on the source, and the policy page opens with the line highlighted |
| 13 | And when the policy changes, you just update the document. No retraining. | The policy changes from 30 to 14 days ("updated"), and "Retrain the model" gets crossed out |
| 14 | If you want to get into AI engineering, this is the first thing to learn. | Where to start: 1 RAG (start here), 2 AI agents, 3 Evals, 4 Fine-tuning |
| 15 | Follow, and next I'll explain AI agents. | The robot waving, "Next: AI agents", and a Follow button |

## Props

Made with Canva's image generator, with the backgrounds removed. Each is in your Canva at full size (1264×1264). The video uses 200-pixel previews, the only size this connection returns, so the props stay small to keep them sharp. Exporting the full-size ones from Canva into `source/rag-short/img/props/` would allow them bigger.

| Prop | In Canva |
|---|---|
| Robot librarian | [open](https://www.canva.com/M/MAHYmPzc1Ts) |
| Locked files | [open](https://www.canva.com/M/MAHYngNAWok) |
| Open book | [open](https://www.canva.com/M/MAHYntwLYwI) |
| Database | [open](https://www.canva.com/M/MAHYnrRa640) |
| Robot waving | [open](https://www.canva.com/M/MAHYnlTGVT4) |
