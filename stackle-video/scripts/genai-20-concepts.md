# 20 Gen AI Concepts You Actually Need, Explained in 2 Minutes: Script (draft for review)

**Series:** Explained in 2 Minutes, episode 03 (Gen AI takes this slot, so Spark and the rest move down one)

**Spoken words:** 332. **Length:** 2:04 of voice, so 2:29 in all, counting the opening card, your intro and the comment ask.

**Format:** each concept is a notebook page in the style of your reference. The page has:
- the number in a coloured circle;
- a big marker title;
- the line that is spoken;
- a hand-drawn sketch;
- a starred takeaway.

A 1→20 tracker runs down the side (along the top in the vertical cut) and ticks off each concept. The voice says each number, so viewers always know where they are. The order is the same as every episode: the hook, then your intro, then the rest.

**Status:** approved and made. The voice is take 2 of 4 (`source/genai/audio/vo.mp3`, 2:04 of voice), and the video runs 2:29 in all: about 25 seconds longer than estimated, because twenty concepts take longer to say than the word count suggested. Both cuts are in `stackle-video/graphics/` (`genai-20-concepts.mp4` with `.srt`, and `genai-20-concepts-vertical.mp4`). The post copy is in `genai-20-concepts-posts.md`. The opening cards are temporary until your thumbnails arrive.

---

## Script

> [confident] Most people learning Gen AI stop at prompting. But it's a full stack, from tokens to agents, and the last eight are where the jobs are. Here are the twenty you actually need.
>
> *(your intro: "Hi, I'm Chris … Let's get into it.")*
>
> One: tokens. Models read text in small pieces called tokens, and you pay per token.
>
> Two: embeddings. Text becomes a list of numbers, so similar meanings sit close together.
>
> Three: attention. Every token looks at every other token to work out what it means.
>
> Four: large language models. They predict the next token, one at a time.
>
> Five: the context window. How much text the model can see at once.
>
> Six: temperature. Low is focused and repeatable. High is more varied.
>
> Seven: prompting. Clear instructions, examples and a format give better answers.
>
> Eight: few-shot. Show a few examples in the prompt, and the model follows the pattern.
>
> Nine: hallucinations. Answers that sound confident, but are made up.
>
> Ten: fine-tuning. Train a model further on your own examples to change how it behaves.
>
> Eleven: RLHF. People rank the answers, and the model learns what they prefer.
>
> Twelve: multimodal. One model that understands text, images and audio.
>
> Now the last eight. This is where the jobs are.
>
> Thirteen: vector databases. They store embeddings, and find the closest matches fast.
>
> Fourteen: chunking. Split long documents into small pieces you can search.
>
> Fifteen: RAG. Retrieve the right chunks first, then answer from them, with sources.
>
> Sixteen: tool calling. The model asks your code to run a function, like a database query.
>
> Seventeen: agents. A model in a loop that plans, uses tools and checks its own work.
>
> Eighteen: MCP. An open standard for plugging tools and data into AI apps.
>
> Nineteen: evals. Tests that score the answers, so you know a change made things better.
>
> Twenty: guardrails. Checks on what goes in and what comes out, so the system stays safe.
>
> [warmly] Tokens to agents: that's the full stack. Save this, so you have all twenty in one place.
>
> *(the shared ending: "So, what should I explain next? Tell me in the comments below …")*

## What is on screen

Each page builds as its line is spoken: the number and title on the concept's name, the sketch during the sentence, and the takeaway as it ends. The takeaways below are as they appear on screen.

| # | Concept | Sketch | Takeaway |
|---|---|---|---|
| Card | (beat only) | Your thumbnail, in the style of your "20 Gen AI Concepts" cover | |
| Hook | "Most people … stop at prompting" | The cover page: "20 Gen AI Concepts You Actually Need", "Tokens → Agents. The full stack.", the 1–20 circles filling in, and "the last 8 are where the jobs are" circled | |
| (intro) | | Your Stackle intro | |
| 1 | Tokens | "unbelievable" splits into un · believ · able, each with a number | Tokens, not words, are what you pay for |
| 2 | Embeddings | A 2D map: king, queen and prince close together, car, truck and bus in another cluster | Meaning becomes distance |
| 3 | Attention | "She sat by the bank of the river": lines from "bank" to every word, the thickest to "river" | Context decides meaning |
| 4 | Large language models | "The cat sat on the ___" with bars for the likely next tokens: mat, sofa, floor | Next-token prediction, at huge scale |
| 5 | Context window | A long scroll of text with a window frame over it: what's inside is seen, what's outside isn't | Not in the window? The model can't use it |
| 6 | Temperature | A dial: at low, the same answer three times; at high, three different ones | Low for facts, high for ideas |
| 7 | Prompting | A sticky note with four slots: role, task, examples, format | Be specific, show an example |
| 8 | Few-shot | "great → positive", "awful → negative", "it's fine → ?", and the model fills in "neutral" | Examples beat explanations |
| 9 | Hallucinations | A speech bubble: "The Eiffel Tower opened in 1925", with a red "made up" stamp (it opened in 1889) | Fluent isn't the same as true |
| 10 | Fine-tuning | A base model plus your examples gives a tuned model with your badge on it | It changes behavior more than knowledge |
| 11 | RLHF | Two answers, A and B. A person picks B, and an arrow loops back into the model | Trained on what people prefer |
| 12 | Multimodal | Text, image and sound icons, all going into one model | One model, many inputs |
| | "Now the last eight …" | A banner: "The last 8: where the jobs are", with circles 13–20 lit | |
| 13 | Vector databases | A query point, with its nearest neighbours circled among many dots | Search by meaning, not keywords |
| 14 | Chunking | A long document cut into numbered pieces with scissors | Smaller pieces, better search |
| 15 | RAG | Question → search → the top 3 chunks → model → an answer with [1] [2] sources | Answers from your data, with sources |
| 16 | Tool calling | Model → `{"tool": "get_orders"}` → your code → the result back to the model | The model asks, your code acts |
| 17 | Agents | A loop: plan → act → check, and back to plan, around a goal flag | Tools plus a loop |
| 18 | MCP | An AI app in the middle, with one standard plug to a database, GitHub and Slack | One plug for every tool |
| 19 | Evals | A test sheet: 72% before a change, 91% after | Measure it before you ship it |
| 20 | Guardrails | Input check → model → output check, blocking a leaked email address | Safe in, safe out |
| Close | "Tokens to agents …" | All 20 circles ticked, "Tokens → Agents. The full stack." | |
| Ask | "What should I explain next? …" | The shared comment box | |

## Facts to check before recording

| Claim | Source |
|---|---|
| One token is about four characters of English text | OpenAI, ["What are tokens and how to count them?"](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) |
| Attention: every token looks at every other token (self-attention in the transformer) | Vaswani et al., ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762), 2017 |
| LLMs generate one token at a time, each predicted from the ones before | Same paper; any LLM docs on autoregressive decoding |
| RLHF: people rank model answers, a reward model learns from the rankings, and the model is trained toward the preferred ones | Ouyang et al., ["Training language models to follow instructions with human feedback"](https://arxiv.org/abs/2203.02155), 2022 |
| MCP (Model Context Protocol) is an open standard for connecting AI apps to tools and data, introduced by Anthropic in November 2024 | [Anthropic announcement](https://www.anthropic.com/news/model-context-protocol); [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| The Eiffel Tower opened in 1889 (the example of a made-up answer says 1925) | [Eiffel Tower official site](https://www.toureiffel.paris/en/the-monument/history) |
| RAG: Retrieval-Augmented Generation | Lewis et al., ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"](https://arxiv.org/abs/2005.11401), 2020 |

**Kept simple on purpose:**
- Attention is shown without layers or heads.
- "It changes behavior more than knowledge" (fine-tuning) is a rule of thumb. Fine-tuning can add some knowledge, but RAG is the usual way to give a model your facts.
- The token numbers, probabilities and eval scores on screen are illustrations, not real measurements.
