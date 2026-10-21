# RAG Short, told the StoryBrand (SB7) way

**Framework:** Donald Miller, *Building a StoryBrand*. A character wants something, has a problem (external, internal and philosophical), meets a guide (empathy and authority) who gives them a plan and calls them to act, which helps them avoid failure and ends in success. The viewer is the hero; Chris is the guide, not the hero.

**Length:** 165 spoken words, 56 seconds. Vertical 1080×1920.

**Status:** made. The video is `stackle-video/graphics/rag-short-sb7.mp4` (captions in `.srt`), built from `stackle-video/source/rag-short-sb7/` on the shared kit in `rag-short/`.

| SB7 step | Where |
|---|---|
| 1. A character who wants something | Line 1: you want the bot to answer like your best support person |
| 2. Has a problem: external | Line 2: it promises 60 days; the policy is 30 |
| Internal | Line 3: you're the one explaining it to your boss |
| Philosophical | Line 4: an AI shouldn't make things up; it should show its work |
| 3. Meets a guide (empathy + authority) | Line 5: "I get it." + over ten years in data engineering |
| 4. Who gives them a plan | Lines 6 to 9: RAG in three steps |
| 5. And calls them to action | Line 13: follow, and learn RAG first |
| 6. That helps them avoid failure | Line 10: paying for bigger models that still make things up |
| 7. And ends in success | Lines 11 and 12: answers from your documents with proof, updates without retraining |

## Script

| # | Voice | Scene |
|---|---|---|
| 1 | You want your company's AI chatbot to answer like your best support person. | The company assistant, with the goal: "answer like your best support person" |
| 2 | Instead, it tells a customer refunds take sixty days. The real policy is thirty. | "Refunds within 60 days", stamped "made up", against the 30-day policy |
| 3 | And now you're the one explaining it to your boss. | A message from your boss: "Why did our bot promise 60-day refunds?" |
| 4 | An AI shouldn't make things up. It should show its work. | ✕ makes things up / ✓ shows its work |
| 5 | I get it. I've spent over ten years in data engineering, and here's the fix. | The guide card: Chris, 10+ years in data engineering, 200+ engineers interviewed |
| 6 | It's called RAG, and it's three steps. | The plan: RAG in 3 steps |
| 7 | One: turn your documents into numbers that capture their meaning, and store them in a vector database. | Step 1: a paragraph becomes numbers, which flow into the database |
| 8 | Two: when a question comes in, grab the three paragraphs that match it best. | Step 2: the question, then the three best paragraphs |
| 9 | Three: give those paragraphs to the model, so it answers from them, with sources. | Step 3: the prompt, then the answer with its source |
| 10 | Skip this, and you'll pay for bigger models that still make things up. | Failure: a 700B model, and "60 days" still made up |
| 11 | Do it, and every answer comes from your own documents, with a link to the proof. | Success: the answer with its source, and a tap on it |
| 12 | And when the policy changes, you update the document. No retraining. | 30 becomes 14, "Retrain the model" crossed out |
| 13 | Follow, and learn RAG first. Next, I'll explain AI agents. | The waving robot, "Learn RAG first", "Next: AI agents", Follow |
