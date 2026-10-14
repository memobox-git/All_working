# 20 AI Concepts Explained: Script

**Title:** AI Concepts Explained: 20 Terms Every Engineer Should Know

**Spoken words:** about 3,950 · **Estimated length:** about 26 minutes at 150 words a minute

**Type:** Concepts video. It is rebuilt from Gaurav Sen's "20 AI Concepts Explained in 40 Minutes". It keeps the promise of twenty terms, with a new structure, our own examples, fixes for the original's mistakes, and four terms the original left out.

**Style:** Alex Hormozi's real speaking style (see `skills/hormozi-style`). The video opens with "In this video, I'm going to..." and numbers every point. Each point is a short rule, then why, then a "let's say" example, then one short landing line. Terms are defined as "X just means Y", followed by a mirror pair, and the maths is done out loud before a money question. Sentences are medium length (about 13 words on average), with contractions and only a few short punch lines. The Stackle structure stays: promise, standard intro, parts, your turn, and the call to action.

**Research date:** 13 October 2026

---

## Research brief: dissecting the original

### How the research was done
This ran in a cloud session, so the research used yt-dlp and web search. **The numbers, the full transcript and 400 comments for the original video are real, taken on 13 October 2026.** YouTube blocked the video download, so the visual notes come from YouTube's storyboard frames (small preview images every ten seconds) and the thumbnail. Token counts were run with OpenAI's own tokenizer library, tiktoken. Every fact the script uses is checked against a primary source in the sources table.

### The original video

| Creator | Subscribers | Title | Link | Views | Likes | Comments | Uploaded | Length |
|---|---|---|---|---|---|---|---|---|
| Gaurav Sen (GKCS) | 763K | 20 AI Concepts Explained in 40 Minutes | youtube.com/watch?v=OYvlznJ4IZQ | 1,048,311 | 22,097 | 586 | 20 Sep 2025 | 43:34 |

Transcript read in full (6,538 words, about 150 words a minute). 400 comments read: 357 top comments and 43 replies, sorted by likes.

### How it is built

- **Packaging.** The title promises a number and a time: "20 AI Concepts Explained in 40 Minutes". The thumbnail says "20 Important Concepts of AI Engineering" with "LLMs, Tokens, Vectors, and More" and Gaurav standing on the right. The description lists all twenty chapters, so a viewer can jump to any term.
- **Format.** A lightboard: Gaurav writes on a dark glass board facing the camera, with jump cuts and fast-forward while he draws. The opening is a separate talking-head shot in a different shirt. Text slides appear only once, for the chain-of-thought example. Viewers loved the board ("I'm more interested in the digital blackboard", 35 likes).
- **Opening.** There is no hook. The first line is "Hi everyone, this is GKCS. In today's video we will see some of the commonly used terms in the AI space." Term 1 starts at 0:28.
- **Order.** The first six terms build on each other (LLM, tokens, vectors, attention, training and transformer). After that, the order jumps around: context engineering comes before agents, and chain of thought comes after reinforcement learning.
- **Examples.** Almost every term gets a new example: "All that glitters is not gold", apple (the fruit and the company), "Et tu, Brute", a crane hunting a crab, "Where is my parcel?", "I am upset with your payment system", IndiGo and Air India flights, a travel agent, a fair coin, NASA weather, and a keystroke puzzle. That is about eleven examples, and none of them links to the next.
- **Ending.** There is no recap. The video ends with a line about his AI engineering course.
- **Delivery.** The speech is unscripted. "Okay" is said 53 times.

**Time spent on each term**

| # | Term | Starts | Length | Note |
|---|---|---|---|---|
| 1 | Large language model | 0:28 | 1:00 | |
| 2 | Tokenization | 1:28 | 1:25 | Example is wrong (see below) |
| 3 | Vectorization | 2:53 | 1:22 | Engineers say "embedding" |
| 4 | Attention | 4:15 | 3:07 | Best example in the video (apple) |
| 5 | Self-supervised learning | 7:22 | 4:45 | Second-longest chapter |
| 6 | Transformer | 12:07 | 2:25 | |
| 7 | Fine-tuning | 14:32 | 2:33 | |
| 8 | Few-shot prompting | 17:05 | 1:06 | |
| 9 | Retrieval augmented generation | 18:11 | 2:22 | |
| 10 | Vector database | 20:33 | 2:30 | |
| 11 | Model Context Protocol | 23:03 | 2:40 | |
| 12 | Context engineering | 25:43 | 2:34 | |
| 13 | Agents | 28:17 | 1:02 | Called "the most long term thing" but gets one minute |
| 14 | Reinforcement learning | 29:19 | 5:23 | Longest chapter, and the one viewers found hardest |
| 15 | Chain of thought | 34:42 | 1:13 | On-screen maths error |
| 16 | Reasoning models | 35:55 | 0:41 | Shortest chapter |
| 17 | Multi-modal models | 36:36 | 1:45 | |
| 18 | Small language models | 38:21 | 2:03 | Wrong size ranges |
| 19 | Distillation | 40:24 | 1:23 | |
| 20 | Quantization | 41:47 | 1:47 | |

**What the numbers say:** the theory terms (self-supervised learning, reinforcement learning, attention) take 13 of the 43 minutes. The terms engineers use every day (agents, reasoning models, few-shot prompting) get under three minutes between them.

### What works, and what we keep
- **The number in the title and a chapter for every term.** This format reached one million views. We keep "20" in our title and give every concept its own chapter.
- **The apple example for attention.** One word, three meanings, and the nearby words decide. We keep the idea but not the example: our word is "pipeline", which data people use every day.
- **"Retrieve, augment, generate."** A comment quoting this line has 45 likes. We keep the three steps as the RAG graphic.
- **Hiding part of the screen for self-supervised learning.** Viewers called it "hilarious" and "eye-opening". We keep the idea of hiding a word, with our own sentence ("Please send the report by Friday").
- **The car and the engine.** "The large language model is the product. You can think of it as a car. And this is the engine." It works, but it is his line, so we do not reuse it.
- **A calm pace.** One comment praised that it "lets moments breathe". Our script keeps the pauses.

### What viewers said in the comments
- **Interview revision is a main use.** The second most-liked comment (214 likes) is "I have an interview tomorrow for an AI engineer role, and this is the best video to revise the key concepts." Another says the same (14 likes). Our one-sentence definition cards and the cheat sheet serve this directly.
- **The reinforcement learning part lost people.** "From 30:09 to 31:47, it was kind of hard to understand about what different points you were referring to."
- **The second half felt choppy.** "Latter half seems to be edited/cut from a longer video so it is choppy." Gaurav replied: "I'll work on improving the flow in future videos."
- **Viewers asked for terms that are missing.** "Would like to understand context window topic also." "Where does EVALS come into picture in context engineering." "Is there a video which explains what is neuro network, vector and basics of AI?"
- **Viewers asked what replaces RAG.** "If RAG is dead already, what is replacing it?" The video says "people are saying RAG is already dead" and never answers.
- **RAG confused at least one viewer.** "RAG: I think the generation is augmented not the query." Our script says plainly that the prompt is augmented and the model is not changed.
- **The best idea came from a viewer.** "These concepts become much easier once you stop treating them as a glossary. RAG, MCP, vector databases, and agents usually show up together in real systems." This is the angle of our whole script.

### Where it is wrong, unclear or out of date
1. **The token example is wrong (1:44).** Gaurav says "glitters" splits into "glitt" and an "ers" token that tells the model someone is doing an action, and that the space is its own token. On OpenAI's real tokenizers (o200k_base, used by GPT-4o, and cl100k_base, used by GPT-4), "All that glitters is not gold" is 7 tokens: "All", " that", " gl", "itters", " is", " not", " gold". The space is attached to the front of the next word, and the split is "gl" plus "itters". Tokenizers choose pieces by how often they appear in text, not by grammar.
2. **Wrong date for when it got famous (7:06).** "In 2022 this became really, really famous which are GPT-2 being released." GPT-2 came out in 2019. What made LLMs famous in 2022 was ChatGPT, released on 30 November 2022.
3. **Wrong breakthrough (7:37).** "Here's where there was a major breakthrough in 2017. Basically the concept of self-supervised learning." The 2017 breakthrough was the transformer paper. Training a language model to predict the next word from plain text is much older.
4. **A guess about layers (13:39).** "I think recent GPT architectures are in hundreds." OpenAI has not published layer counts for its recent models. The largest GPT with a published count, GPT-3, has 96 layers (Brown and others, 2020).
5. **Two kinds of fine-tuning are mixed (14:32).** The example (training a model to answer instead of saying "I would like to know that too") is instruction tuning, which turns a base model into an assistant. The medical example is fine-tuning for one field. The video does not say that most teams try prompting and RAG first.
6. **MCP is described as the thing that takes actions (23:03).** The ability to act comes from tool calling. MCP is the standard plug that lets any AI app use any tool. Tool calling is never explained. The IndiGo and Air India MCP servers are made-up examples, which the video does not say. The video also came out before a big change: in December 2025, Anthropic gave MCP to the Agentic AI Foundation under the Linux Foundation.
7. **The agent definition is about where it runs, not what it is (28:28).** "You have a long running process which is known as an agent. You can think of this is a server." The common definition, used by Anthropic, is a model using tools in a loop.
8. **Reinforcement learning from human feedback is explained incorrectly (29:19).** The video paints +1 and −1 scores onto paths in a vector space. In RLHF, people rank answers, a reward model learns those rankings, and the main model is trained to score higher with the reward model (OpenAI's InstructGPT paper). The video also misses the 2024–2025 change: reasoning models were trained with rewards from automatic checks, such as correct maths answers and passing code tests.
9. **An opinion is given as fact (33:12).** The fair-coin story ends with "reinforcement learning cannot build mental models". This is a debated opinion, not a settled fact. Our script leaves it out.
10. **Chain of thought is described as training only (34:49).** "When training the model, we clearly explain our thought process." Chain of thought began as a prompting technique (Wei and others, Google, 2022). Reasoning models later learned it through training.
11. **The on-screen maths is wrong (35:15).** The slide asks how many keystrokes it takes to type the numbers from 1 to 1,000. Two viewers point out errors in the worked answer. The correct total is 2,893: 9 one-digit numbers, 90 two-digit numbers (180 keys), 900 three-digit numbers (2,700 keys) and 1,000 itself (4 keys). The storyboard frame was too small to read the slide's own total.
12. **Wrong sizes for small and large models (38:57).** "A small language model may have 3 million to 300 million parameters... large language models... 3 to 300 billion parameters." Models called small today are mostly between about 1 and 10 billion parameters. Microsoft's Phi-3-mini, which Microsoft calls a small language model, has 3.8 billion, and Meta's lightweight Llama 3.2 models have 1 and 3 billion. There is no official cut-off (IBM says "a few million to a few billion"), but a top of 300 million is far too low. At the other end, the biggest open models are well above 300 billion: DeepSeek-V3 has 671 billion parameters and Kimi K2 has 1 trillion.
13. **Quantization starts from the wrong size (42:08).** The example goes from 32 bits to 8 bits. The maths is right (8 bits is 75% smaller than 32), but most open models are released in 16-bit (Meta's Llama checkpoints use bfloat16), so the usual move is from 16-bit to 8-bit or 4-bit. Some recent models now ship at 8 or 4 bits from the start, such as DeepSeek-V3 (FP8) and Kimi K2 Thinking (INT4).
14. **Terms are used before they are explained.** "What do we mean by training? What do we mean by neural network? As we go through this video, you will be understanding these terms." Neither "neural network" nor "parameter" is ever defined, yet small language models, distillation and quantization all depend on them.
15. **Missing terms that engineers use every day:** context window, hallucination, tool calling and evals. Two of these were asked for in the comments.

### Competitor videos
Twelve videos that explain a list of AI terms, sorted by views. Numbers were pulled with yt-dlp on 13 October 2026. Transcripts were read for the top five, and the other concept lists come from chapters.

| # | Creator | Subscribers | Title | Link | Views | Uploaded | Length | Transcript |
|---|---|---|---|---|---|---|---|---|
| 1 | KodeKloud | 462K | Don't learn AI Agents without Learning these Fundamentals | youtube.com/watch?v=ZaPbP9DwBOE | 1,343,241 | 21 Oct 2025 | 56:39 | Read |
| 2 | IBM Technology (Martin Keen) | 1.82M | 7 AI Terms You Need to Know: Agents, RAG, ASI & More | youtube.com/watch?v=VSFuqMh4hus | 1,341,703 | 1 Sep 2025 | 11:04 | Read |
| 3 | Syntax (CJ) | 505K | LLMs Explained: Tokens, Embeddings, Transformers and More | youtube.com/watch?v=YmLp8qe87A0 | 1,009,189 | 10 Jul 2026 | 51:48 | Read |
| 4 | IBM Technology (Jeff Crume) | 1.82M | AI Simplified: 6 Concepts You Need to Know About Modern AI | youtube.com/watch?v=mUw27wG7uFA | 973,492 | 6 Sep 2026 | 8:49 | Read |
| 5 | Simon Scrapes | 104K | Every Claude Code Concept Explained for Normal People | youtube.com/watch?v=ZlDnsf_DOzg | 918,316 | 28 Feb 2026 | 27:24 | Read |
| 6 | Marina Wyss | 156K | AI Engineering in 76 Minutes (Complete Course/Speedrun!) | youtube.com/watch?v=JV3pL1_mn2M | 588,407 | 1 Apr 2025 | 1:16:03 | Chapters |
| 7 | ByteByteAI (with ByteByteGo) | not shown | 9 AI Concepts Explained in 7 minutes | youtube.com/watch?v=nVnxG10D5W0 | 398,256 | 5 Feb 2026 | 6:36 | Chapters |
| 8 | Maddy Zhang | 94.1K | AI was HARD until I Learned these 10 Concepts | youtube.com/watch?v=5DtjQrROUzY | 198,813 | 1 Mar 2026 | 10:54 | Chapters |
| 9 | Chai aur Code (in Hindi) | 944K | Learn All AI terms in 1 video | youtube.com/watch?v=_g2CgoTcVME | 166,088 | 26 Jul 2026 | 36:21 | Read (Hindi captions) |
| 10 | IBM Technology | 1.82M | 5 AI Agent Terms You Need to Know | youtube.com/watch?v=k5jYwyhDMxA | 123,749 | 23 Jun 2026 | 11:07 | Chapters |
| 11 | Codist | 60.7K | 100+ AI Concepts for Developers Explained in 20 Minutes. (Part 01) | youtube.com/watch?v=IauULFe1j-A | 108,073 | 11 Aug 2026 | 21:18 | Chapters |
| 12 | Better Stack | 228K | Every AI Concept Explained (In 8 Minutes) | youtube.com/watch?v=ZTmZOdB5o0U | 22,407 | 7 Oct 2026 | 8:23 | Chapters |

Smaller list videos that cover 2026 terms: Shaw Talebi, "30 AI Engineering Terms Explained (in Plain English)" (14,347 views), which has chapters on hallucination, guardrails and evals, and Marina Wyss, "AI Engineering For Beginners in 14 Minutes" (49,308 views), the only one with an LLM-as-a-judge chapter.

**What the numbers say:**
- **Four of these videos have about a million views or more, and so does the original.** Two of them (Syntax and IBM's "6 Concepts") were uploaded in the last four months, so the topic is still growing.
- **Short and long both work.** IBM's 8:49 analogy video reached 973,492 views in 37 days. KodeKloud's 56-minute video and Syntax's 51-minute build reached over a million.
- **KodeKloud already uses one running project:** "TechCorp", a company with 500 GB of documents that wants an assistant. So "one project" is not new on its own. What none of the twelve does is use a data engineering example (pipelines, warehouses, on-call incidents) or tie the terms to a map.
- **Chai aur Code proves the Indian audience wants this,** with 166,088 views for a Hindi version.

**Terms that almost every video covers:** agents (10 of 12), LLMs, RAG (8), MCP (8), tokens (about 8) and fine-tuning (about 8). Embeddings and vector databases appear in about 7, the context window in 6.

**Terms that few or none cover:** evals have their own section in only one of the twelve, and hallucination in none. LLM-as-a-judge appears in none of the twelve. Tool calling has its own chapter in only two. Prompt caching, guardrails, temperature and mixture of experts are rare too. Our script gives evals, hallucination and tool calling full concepts, and LLM-as-a-judge sits inside evals.

**Where they are wrong or out of date:**
- **KodeKloud** says MCP has been popular since Anthropic released it "back in November 2022". The real date is November 2024. It also says one million tokens is "roughly 7,500 words", which is off by a factor of one hundred (about 750,000 words), and it uses old models such as GPT-3.5 Turbo in its code.
- **IBM's "7 AI Terms"** describes mixture-of-experts "experts" as specialists picked for a task, when the routing actually happens for each token. Its last two minutes promote an IBM event from October 2025.
- **Syntax** says a top-p of 0.2 "means only the top 20% of tokens are considered", which is wrong. It also leaves out reasoning training and mixture of experts on purpose.
- **IBM's "6 Concepts"** calls MCP "the orchestration layer". MCP is a way to connect tools and data, and the agent loop does the orchestration. It also presents the system prompt as the main protection against prompt injection.
- **Simon Scrapes** treats context rot as the same thing as hallucination. Its details are tied to one product and date fast.

### Gaps, and the angle our script takes
1. **One short example per concept, from the data side, and one question that closes the loop.** Each concept gets its own "let's say" from data work (pipelines, runbooks, warehouse queries, on-call incidents). The agent concept uses "Why is the sales dashboard empty this morning?", and that question comes back at the end to show all twenty working together. This answers the viewer who said the terms make more sense in one system than as a glossary, without one made-up example taking over the video. KodeKloud uses one long running project inside a 56-minute LangChain course; ours keeps every example short.
2. **A map with five areas** (inside the model, how it was trained, what you send it, how it takes action, how you ship it). The map fills in as the video goes, so the twenty terms become one picture instead of a list.
3. **A data engineering point of view.** The examples are pipelines, warehouses, runbooks and on-call incidents, which none of the twelve competitor videos uses. The closing point is that most of the map is data work.
4. **Every mistake above is fixed,** and the facts are checked against primary sources.
5. **Time follows usefulness.** Each concept gets one to one and a half minutes. Theory is kept short, and the terms engineers use every day get the same time as the theory.
6. **The cost maths, out loud.** Tokens, MCP, agents, context engineering, model routing and quantization each come with a worked "let's say" calculation and a money question, so the viewer sees why each idea matters to a real bill.
7. **A one-sentence definition for every concept,** on a card and then on one cheat sheet at the end. This serves the viewers who watch for interview revision.
8. **Four terms added** (context window, hallucination, tool calling and evals), and five folded into others, so the count stays at twenty. Evals and hallucination are the biggest gaps across all thirteen videos (the original and the twelve competitors).
9. **Real token counts,** including the same question in English and Hindi, because many Stackle viewers are in India.
10. **Much shorter:** about 26 minutes instead of 43.

### How the twenty terms map from the original to ours

| Original term | In our script |
|---|---|
| 1. Large language model | 1. Large language model, with "neural network" and "parameter" now defined, and multimodal models in one line |
| 2. Tokenization | 2. Token, with a real tokenizer |
| 3. Vectorization | 3. Embedding (the word engineers use) |
| 4. Attention | 4. Transformer and attention |
| 5. Self-supervised learning | 5. Pre-training (self-supervised learning is explained inside it) |
| 6. Transformer | 4. Transformer and attention |
| 7. Fine-tuning | 6. Fine-tuning |
| 8. Few-shot prompting | 11. Prompt |
| 9. Retrieval augmented generation | 12. RAG |
| 10. Vector database | 13. Vector database |
| 11. Model Context Protocol | 15. MCP |
| 12. Context engineering | 17. Context engineering |
| 13. Agents | 16. Agent |
| 14. Reinforcement learning | 7. Reinforcement learning |
| 15. Chain of thought | 8. Reasoning model |
| 16. Reasoning models | 8. Reasoning model |
| 17. Multi-modal models | One line inside 1. Large language model |
| 18. Small language models | 19. Distillation and small language models |
| 19. Distillation | 19. Distillation and small language models |
| 20. Quantization | 20. Quantization |
| (new) | 9. Hallucination |
| (new, asked for in the comments) | 10. Context window |
| (new) | 14. Tool calling |
| (new, asked for in the comments) | 18. Evals |

### Source for every number and fact in the script
| Fact in script | Source | Date |
|---|---|---|
| Original video: 1,048,311 views, 22,097 likes, 586 comments, 43:34, uploaded 20 Sep 2025; chapters, transcript and comments | yt-dlp metadata, subtitles and comments for youtube.com/watch?v=OYvlznJ4IZQ | pulled 13 Oct 2026 |
| "Why is the sales dashboard empty this morning?" is 9 tokens; "Snowflake" is "Snow" + "flake"; "All that glitters is not gold" is 7 tokens, with "glitters" split as "gl" + "itters"; "Hello, why is the dashboard empty?" is 8 tokens in English and 15 in Hindi | OpenAI's tiktoken library, o200k_base encoding (GPT-4o), run in this session. cl100k_base gives the same English splits. | run 13 Oct 2026 |
| One token is about 4 characters or three quarters of a word in English, on OpenAI's models | developers.openai.com/api/docs/concepts ("1 token is approximately 4 characters or 0.75 words for English text") | checked 13 Oct 2026 |
| Other tokenizers differ (newer Claude models: a token is about 3.5 English characters) | platform.claude.com/docs/en/about-claude/glossary | checked 13 Oct 2026 |
| The transformer was introduced in "Attention Is All You Need", 2017, by Google researchers | arxiv.org/abs/1706.03762 (v1, 12 Jun 2017) | 2017 |
| GPT-2 came out in 2019 | OpenAI, "Release Strategies and the Social Impacts of Language Models", arxiv.org/abs/1908.09203 ("In February 2019, we released the 124 million parameter GPT-2…") | Nov 2019 |
| ChatGPT was released on 30 November 2022 | openai.com/index/chatgpt (page blocked to our tools; date from the search index) | 30 Nov 2022 |
| Biggest open models: hundreds of billions to a trillion parameters (DeepSeek-V3 671B; Kimi K2 1T) | arxiv.org/abs/2412.19437 and arxiv.org/abs/2507.20534 | Dec 2024, Jul 2025 |
| GPT-3 has 175B parameters and 96 layers | arxiv.org/abs/2005.14165, Table 2.1 | May 2020 |
| RLHF steps: supervised fine-tuning, a reward model trained on people's preferences, then reinforcement learning | InstructGPT, arxiv.org/abs/2203.02155 | Mar 2022 |
| People preferred a model trained this way over one "more than one hundred times bigger" | Same paper: "outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer parameters" (175 ÷ 1.3 ≈ 135) | Mar 2022 |
| Chain of thought began in 2022 as a prompting technique | Wei and others, Google, arxiv.org/abs/2201.11903 | Jan 2022 |
| OpenAI's o1 in 2024 "thinks before it answers" | o1 system card, cdn.openai.com/o1-system-card.pdf (o1-preview, 12 Sep 2024; full o1, 5 Dec 2024) | Sep and Dec 2024 |
| DeepSeek R1 (January 2025) was trained with reinforcement learning (plus a small amount of supervised data first); six distilled versions from 1.5B to 70B, made by fine-tuning open models on R1's answers | arxiv.org/abs/2501.12948 (22 Jan 2025) and huggingface.co/deepseek-ai/DeepSeek-R1 | Jan 2025 |
| Training and testing reward guessing over saying "I do not know" | OpenAI, "Why Language Models Hallucinate", arxiv.org/abs/2509.04664 ("the training and evaluation procedures reward guessing over acknowledging uncertainty") | 4 Sep 2025 |
| The newest models from Anthropic, OpenAI and Google hold about one million tokens | platform.claude.com/docs/en/build-with-claude/context-windows; developers.openai.com/api/docs/models; ai.google.dev/gemini-api/docs/models | checked 13 Oct 2026 |
| Models get worse at finding details as the input grows; "context rot" | Chroma, "Context Rot", trychroma.com/research/context-rot (18 models tested); Anthropic, "Effective context engineering for AI agents" | 14 Jul 2025; 29 Sep 2025 |
| RAG: retrieve documents and add them to the input so the model answers from them | Lewis and others, Facebook AI Research, arxiv.org/abs/2005.11401 | May 2020 |
| Vector search index used by many vector databases (HNSW) | Malkov and Yashunin, arxiv.org/abs/1603.09320 | Mar 2016 |
| pgvector adds vector search to Postgres | github.com/pgvector/pgvector | checked 13 Oct 2026 |
| Tool calling: the model returns a tool request, your code runs it and sends back the result | platform.claude.com/docs/en/agents-and-tools/tool-use/overview | checked 13 Oct 2026 |
| MCP introduced by Anthropic in November 2024 | anthropic.com/news/model-context-protocol | 25 Nov 2024 |
| MCP given to the Agentic AI Foundation under the Linux Foundation, co-founded by Anthropic, Block and OpenAI | anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation; linuxfoundation.org press release | 9 Dec 2025 |
| Agent: a model using tools in a loop | Anthropic, "Effective context engineering for AI agents" ("LLMs autonomously using tools in a loop"); Simon Willison ("An LLM agent runs tools in a loop to achieve a goal") | 29 Sep 2025; 18 Sep 2025 |
| Evals: give the AI an input and grade the output; LLM-as-a-judge | Anthropic, "Demystifying evals for AI agents" (9 Jan 2026); platform.claude.com/docs/en/test-and-evaluate/develop-tests; OpenAI evaluation best practices | 2026 |
| Small language model: no official cut-off, usually up to about 10 billion parameters; Phi-3-mini has 3.8 billion | IBM, ibm.com/think/topics/small-language-models ("a few million to a few billion"); Microsoft Azure blog, "Introducing Phi-3" (23 Apr 2024) | 2024–2026 |
| 8B model: about 16 GB at 16-bit, 8 GB at 8-bit, 4 GB at 4-bit, for the weights alone | Hugging Face, "Llama 3.1" blog, memory table (huggingface.co/blog/llama31); Transformers docs ("roughly 2 * X GB of VRAM in bfloat16") | 23 Jul 2024 |
| Many open models are released in 16-bit; some now ship at 8 or 4 bits | Hugging Face Llama 3.1 blog (bfloat16 checkpoints); DeepSeek-V3 model card (FP8); Kimi K2 Thinking model card (INT4) | 2024–2025 |

---

---

## Script

### Promise

**[On camera]**

In this video, I'm going to explain the twenty AI concepts you keep hearing in every AI meeting, from tokens and embeddings to RAG, MCP and agents. I'll do it in plain English, with one example for each. By the end, you'll be able to explain every one of them in a single sentence.

And the reason this matters is because these words show up in job ads, in interviews and in your first week on an AI team. If you don't know them, you end up nodding along and hoping nobody asks you anything, right?

### Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[Graphic 1, full screen]** The map: five empty areas called "Inside the model", "How it was trained", "What you send it", "How it takes action" and "How you ship it".

*[pause]*

So I've put the twenty concepts into five groups: what's inside the model, how it was trained, what you send it, how it takes action, and how you ship it. Each group builds on the one before, so by the end you'll see how they all fit together.

*[pause]*

### Part 1: Inside the model

**[On camera]**

So let's start inside the model, because everything else sits on top of these four ideas.

#### 1. Large language model

**[Card beside you]** 1. LLM just means a program that has learned to predict the next piece of text.

Number one is the large language model, or LLM. An LLM just means a program that has learned to predict the next piece of text. It predicts one piece, adds it to the text, and predicts again. And so a full answer is really hundreds of small predictions in a row.

**[Graphic 2, full screen]** "The nightly data load failed because the input file was ___". Three guesses appear with bars for how likely each one is, and "missing" is the tallest.

*[pause]*

Let's say you type, "The nightly data load failed because the input file was". The model looks at every word before the gap. Then it predicts the most likely next word, which might be "missing".

*[pause]*

**[On camera]**

Inside, an LLM is a neural network, which just means a huge set of numbers called parameters. Training adjusts those numbers until the predictions get good. A model with a lot of parameters can hold a lot of patterns, but it costs a lot to run. A model with fewer parameters is cheap to run, but it holds less. And models that can also read images and audio are called multimodal.

So an LLM predicts. It doesn't look things up.

#### 2. Token

**[Card beside you]** 2. A token just means a small piece of text.

Number two is the token, and the rule is that everything in AI is counted in tokens. A token just means a small piece of text, and a long word is often split into more than one.

**[Graphic 3, full screen]** "Why is the sales dashboard empty this morning?" split into nine colored tokens. Below it, "Snowflake" splits into "Snow" and "flake". At the bottom, "Hello, why is the dashboard empty?" is 8 tokens in English and 15 in Hindi. Label: "OpenAI tokenizer used by GPT-4o".

*[pause]*

On OpenAI's tokenizer, "Why is the sales dashboard empty this morning?" is nine tokens. But the word "Snowflake" on its own is two, "Snow" and "flake". In English, one token is about three quarters of a word.

*[pause]*

**[On camera]**

And the reason you care is money, because you pay for every token in and every token out. A lot of tokens means a big bill and a slow answer. A few tokens means a small bill and a fast one.

**[Graphic 4, full screen]** The maths builds line by line. "Let's say: $3 per million tokens." "1,000 questions × 5,000 tokens = 5 million tokens a day." "= $15 a day = about $450 a month." Last line: "Hindi: 15 tokens instead of 8. Close to double?"

*[pause]*

So let's do the math. Let's say a model charges three dollars for every million tokens. Let's say your app gets a thousand questions a day, and each one sends five thousand tokens. That's five million tokens a day, which is fifteen dollars a day, or about four hundred and fifty a month. That adds up fast, right? Now, that short question took eight tokens in English and fifteen in Hindi. So if your users write in Hindi, are you ready for a bill that's close to double?

*[pause]*

**[On camera]**

Tokens are what you pay in.

#### 3. Embedding

**[Card beside you]** 3. An embedding just means a list of numbers that captures what a piece of text means.

Number three is the embedding. An embedding just means a list of numbers that captures what a piece of text means. Think of it as a spot on a map of meaning. Text that means a lot of the same thing lands close together. Text that means very different things lands far apart.

**[Graphic 5, full screen]** A map of points. "Why is the dashboard empty?" sits right next to "Missing rows in the sales table". "Change the dashboard colors" is a little further away. "Today's lunch menu" is far off in a corner.

*[pause]*

Let's say your team has a runbook page called "Missing rows in the sales table". Someone asks, "Why is the dashboard empty?" Those two share almost no words, right? But they mean nearly the same thing, so their embeddings land right next to each other.

*[pause]*

**[On camera]**

Embeddings match meaning, not words.

#### 4. Transformer and attention

**[Card beside you]** 4. Attention just means each word looks at the words around it to work out what it means. A transformer is a design built around attention.

Number four is the transformer, and the key part inside it is called attention. Attention just means each word looks at the words around it to work out what it means. It needs to do that because one word can mean very different things.

**[Graphic 6, full screen]** Two sentences. "The pipeline failed last night", with arrows from "pipeline" to "failed" and "night". "The pipeline looks strong this quarter", with arrows from "pipeline" to "strong" and "quarter".

*[pause]*

Let's say you hear the word "pipeline". If a data engineer says the pipeline failed last night, they mean jobs that move data. If someone in sales says the pipeline looks strong this quarter, they mean their deals. The words nearby tell you which one, and that's exactly what attention looks at.

*[pause]*

**[Graphic 7, full screen]** A tall stack of identical blocks, each saying "Attention" then "Process". Beside it: "2017: Attention Is All You Need" and "GPT = Generative Pre-trained Transformer".

*[pause]*

A transformer just means a design for a neural network that's built around attention. It repeats attention many times, so each round understands the text a little better. Google researchers introduced it in 2017, in a paper called "Attention Is All You Need". It's the T in GPT.

*[pause]*

**[On camera]**

Almost every LLM is a transformer underneath.

### Part 2: How the model was trained

**[Graphic 1 again]** The map. "Inside the model" is filled in, and "How it was trained" lights up.

*[pause]*

**[On camera]**

So now you know what's inside the model, and the next five concepts are about how it learned all of that.

#### 5. Pre-training

**[Card beside you]** 5. Pre-training just means the model reads a huge amount of text and practices guessing the next token.

Number five is pre-training, which is the first and biggest stage of training. Pre-training just means the model reads a huge amount of text and practices guessing the next token.

**[Graphic 8, full screen]** "Please send the report by ____". After a beat, the hidden word appears: "Friday". Underneath: "The text is its own answer key."

*[pause]*

And what makes it work is that nobody has to label the answers, because the text already has them. Let's say the sentence is "Please send the report by Friday." You hide the last word, the model guesses, and then it sees the real word and learns. This is called self-supervised learning, which just means the data provides its own answers.

*[pause]*

**[On camera]**

And if you think about it, that's why it scales. If people had to label every answer, you'd get a little data at a high cost. Because the text labels itself, you get a lot of data at a low cost.

After pre-training, you have a base model, which only continues text. If you ask it a question, it might just write three more questions back. It's smart, but it's not helpful yet.

#### 6. Fine-tuning

**[Card beside you]** 6. Fine-tuning just means extra training on a smaller set of examples that you choose.

Number six is fine-tuning, and it's how you change the way a model behaves. Fine-tuning just means extra training on a smaller set of examples that you choose. That's how a base model becomes an assistant. A lot of good examples can teach a model a new habit, and a few bad ones can teach it a bad one.

**[Graphic 9, full screen]** Two columns. Left, "Fine-tune": collect examples, train, test, and repeat when a new model comes out. Right, "Instructions first": write the rule, add two examples, try it today.

*[pause]*

Let's say you want every answer from your help bot in three lines: what broke, why, and what to do next. You could fine-tune a model for that. Or you could write that rule in the instructions and add two examples, which you can try today.

*[pause]*

**[On camera]** *(Advice line. Chris to confirm.)*

And so most teams try better instructions and better documents first. They only fine-tune when that isn't enough. Fix the instructions before you retrain the model.

#### 7. Reinforcement learning

**[Card beside you]** 7. Reinforcement learning just means the model tries, gets a score, and learns to do more of what scored well.

Number seven is reinforcement learning, or RL. Reinforcement learning just means the model tries something, gets a score, and learns to do more of what scored well. Answers that score well become more likely. Answers that score badly become less likely.

**[Graphic 10, full screen]** Top row, "Learning from people": two answers, a person picks one, a reward model learns the choice, and the LLM is trained to score higher. Bottom row: "1.3 billion parameters beat 175 billion. 175 ÷ 1.3 ≈ 135 times smaller." Source: OpenAI, 2022.

*[pause]*

The best-known kind is RL from human feedback, or RLHF. Let's say a person sees two answers and picks the better one. Those choices train a reward model, and then the LLM is trained to score higher with it.

And the results are kind of wild. In OpenAI's 2022 research, people preferred a 1.3 billion parameter model trained this way over a 175 billion one that wasn't. If you do the math, 175 divided by 1.3 is about 135. So a model about 135 times smaller won, just because of how it was trained.

*[pause]*

**[On camera]**

The newer kind of RL uses automatic checks instead of people. If the task is maths with one right answer, or code with tests, a program can score it. That means the model can practice far more than people could ever score. You get what you reward.

#### 8. Reasoning model

**[Card beside you]** 8. A reasoning model just means a model that works through a problem step by step before it answers.

Number eight is the reasoning model, which came out of that newer kind of RL. A reasoning model just means a model that works through a problem step by step before it answers. Those written steps are called a chain of thought. It started in 2022 as a prompting trick. Then models like OpenAI's o1 in 2024 and DeepSeek's R1 in 2025 were trained to do it on their own.

**[Graphic 11, full screen]** The question "Which of our ten biggest customers spent less this quarter than last quarter?" and four steps under it: find the ten customers, get this quarter's spend, get last quarter's spend, compare.

*[pause]*

Let's say you ask, "Which of our ten biggest customers spent less this quarter than last?" The model has to find the ten customers, get two numbers for each, and compare them before it answers. A model that writes those steps out has a much better shot than one that answers in one go.

*[pause]*

**[On camera]**

But thinking costs tokens. A hard question with a lot of steps is worth that cost. An easy question with one step just wastes it. Save reasoning for hard questions.

#### 9. Hallucination

**[Card beside you]** 9. A hallucination just means an answer that sounds confident but is false.

Number nine is hallucination, and it's the side effect of everything we just covered. A hallucination just means an answer that sounds confident but is false. It happens because the model is trained to produce likely text, and likely isn't the same as true.

**[Graphic 12, full screen]** A SQL query that filters on "region_code", and a red error under it: "column region_code does not exist".

*[pause]*

Let's say you ask an AI assistant to write a query on your sales table. It filters on a column called "region_code", and it looks completely right. But your table doesn't have that column. The query fails.

*[pause]*

**[On camera]**

In 2025, OpenAI researchers argued that the way models are tested actually rewards guessing. So let's say a test has a hundred questions, and the model doesn't know ten of them. If it says "I don't know", it scores zero on those ten. If it guesses, it gets a few right by luck. Which means guessing beats being honest.

And so a model with a lot of real facts in front of it has less room to guess. A model with few facts fills the gap with something that sounds right. You can't fully train this away yet, so you design around it.

### Part 3: What you send the model

**[Graphic 1 again]** The map. The first two areas are filled in, and "What you send it" lights up.

*[pause]*

**[On camera]**

So a model can't know your company's facts unless you give them to it, and the next four concepts are about what you send it.

#### 10. Context window

**[Card beside you]** 10. The context window just means the most text a model can work with at one time.

Number ten is the context window. The context window just means the most text a model can work with at one time, counted in tokens. Your instructions, your documents, the chat so far and the answer all have to fit inside it. The newest models from Anthropic, OpenAI and Google hold about one million tokens.

**[Graphic 13, full screen]** A box labelled "Context window: about 1 million tokens" filling up with instructions, examples, documents, tool results, chat history and the answer. Beside it, a pile labelled "Three years of logs" that does not fit. Under it: "Context rot: 18 models got less reliable as inputs grew (Chroma, 2025)."

*[pause]*

Let's say you want an assistant to explain why a job failed, and you have three years of logs. Even at a million tokens, they won't fit, right? And even if they did, models get worse at finding the right detail as the input gets longer. One study of eighteen models found exactly that, and people call it context rot.

*[pause]*

**[On camera]**

So a lot of text is slow, expensive and easy to get lost in. A little text is fast and cheap, but it might miss what matters. Choosing what goes in is the skill.

#### 11. Prompt

**[Card beside you]** 11. A prompt just means the text you send to the model. Few-shot prompting just means adding a few examples.

Number eleven is the prompt. A prompt just means the text you send to the model, and in an app it has two parts. The system prompt holds the instructions you write once. The user message is the question, which changes every time.

**[Graphic 14, full screen]** A system prompt: "You help the data team answer questions about dashboards and pipelines. Answer in three lines: what broke, why, and what to do next. If you're not sure, say so." Below it, two example answers in the same three-line format.

*[pause]*

Let's say you're building a help bot for a data team. Your system prompt could say, "You help the data team answer questions about dashboards and pipelines. Answer in three lines: what broke, why, and what to do next. If you're not sure, say so." That last line is your first defence against hallucination, because it lets the model say it doesn't know.

*[pause]*

**[On camera]**

Then there's few-shot prompting, which just means you add a few examples of good answers. With no examples, the model guesses the format. With two or three, it copies the format. Examples beat explanations.

#### 12. Retrieval-augmented generation

**[Card beside you]** 12. RAG just means you find the right documents and add them to the prompt before the model answers.

Number twelve is RAG, which stands for retrieval-augmented generation. RAG just means you find the right documents and add them to the prompt before the model answers. So you retrieve the documents, augment the prompt with them, and then generate the answer.

**[Graphic 15, full screen]** Three steps. Retrieve: "Find the runbook page." Augment: "Add it to the prompt." Generate: "Answer from your steps."

*[pause]*

Let's say someone asks your help bot, "How do I restart the billing pipeline?" The model has never seen your runbook, which is your team's guide for fixing things. Without RAG, it answers from memory and guesses. With RAG, your code finds the right page and puts it in the prompt. Now the model answers from your actual steps.

*[pause]*

**[On camera]**

And notice that nothing about the model changes, because the prompt is what gets augmented. You might hear that RAG is dead. What really changed is how the finding happens, because many AI tools now let the model search for itself. The job is still the same.

#### 13. Vector database

**[Card beside you]** 13. A vector database just means a database that stores embeddings and finds the ones closest to a question.

Number thirteen is the vector database, and it's how RAG usually finds the right pages. A vector database just means a database that stores embeddings and finds the ones closest to a question. Keyword search finds the same words. Vector search finds the same meaning.

**[Graphic 16, full screen]** Runbook pages cut into chunks, each chunk turned into an embedding and stored. The question "Why is the dashboard empty?" becomes an embedding and lands next to "Missing rows in the sales table". In a corner: "Keyword search + vector search" and "Postgres + pgvector".

*[pause]*

Let's say your team has two hundred runbook pages. You split them into small chunks, turn each chunk into an embedding, and store it. When a question comes in, you turn it into an embedding too, and the database returns the closest chunks. That's how "Why is the dashboard empty?" finds the page about missing rows.

*[pause]*

**[On camera]**

Meaning search can miss exact names like a job ID, so a lot of teams add keyword search too. And if you already run Postgres, an extension called pgvector adds vector search to it. Keeping those embeddings fresh is a data pipeline, and you already know how to build those.

### Part 4: How the model takes action

**[Graphic 1 again]** The map. Three areas are filled in, and "How it takes action" lights up.

*[pause]*

**[On camera]**

So far, the model can read and answer. But a lot of answers live in real systems, like your job scheduler, and the next four concepts are about how the model reaches them.

#### 14. Tool calling

**[Card beside you]** 14. Tool calling just means the model asks your code to run a function, and your code sends back the result.

Number fourteen is tool calling, and the rule is that the model never runs anything itself. Tool calling just means the model asks your code to run a function. Your code runs it and sends the result back.

**[Graphic 17, full screen]** Four steps between the model and your code. 1. The model asks: "Call get_job_status for the sales job." 2. Your code runs it. 3. Your code sends back: "Failed at 3:10 a.m." 4. The model answers with that fact.

*[pause]*

Let's say you give a model a tool called "get job status". Someone asks, "Did the sales job run last night?" The model asks your code to call "get job status" for the sales job. Your code runs it, gets back "failed at 3:10 a.m.", and sends that back. Now the model answers with real data instead of a guess.

*[pause]*

**[On camera]**

Your code does the running, which means you stay in control. The more tools you give a model, the more it can do, and the more it can break. With read-only access, it can't delete a table, even by mistake. The model asks. Your code decides.

#### 15. Model Context Protocol

**[Card beside you]** 15. MCP just means one standard way to plug tools and data into AI apps.

Number fifteen is MCP, which stands for Model Context Protocol. MCP just means one standard way to plug tools and data into AI apps. It's kind of like how USB-C is one plug for lots of devices.

**[Graphic 18, full screen]** Left, "Without MCP": ten apps and ten tools joined by a tangle of lines, "10 × 10 = 100 connectors". Right, "With MCP": each connects once to MCP in the middle, "10 + 10 = 20". Bottom line: "Let's say one week each: 100 weeks or 20?"

*[pause]*

And the reason MCP exists is the math. Before MCP, every AI app built its own connector for every tool. So let's say there are ten AI apps and ten tools, and ten times ten is a hundred connectors. With MCP, each tool is wrapped once as an MCP server, and each app learns MCP once. That's ten plus ten, which is twenty. Now let's say each connector takes a week to build. Would you rather pay for a hundred weeks of work or twenty? That's five times less work.

*[pause]*

**[On camera]**

Anthropic introduced MCP in November 2024. In December 2025, it handed MCP to the Agentic AI Foundation, under the Linux Foundation. So before you build a connector, check if an MCP server already exists.

#### 16. Agent

**[Card beside you]** 16. An agent just means a model that uses tools in a loop until the job is done.

Number sixteen is the agent. An agent just means a model that uses tools in a loop until the job is done. You give it the goal, and it picks each next step based on what it found in the last one.

**[Graphic 19, full screen]** A loop: "Decide", "Use a tool", "Read the result", and back to "Decide". Beside it, the steps: no rows today, the load job failed, "input file not found", then "Re-run the job when the file lands?" for a person to approve.

*[pause]*

Let's say someone on your sales team asks, "Why is the sales dashboard empty this morning?" An agent checks the table behind the dashboard and sees no rows for today. Then it checks the job that loads that table and sees it failed. It reads the log and finds "input file not found". So it replies with the reason and asks if it should re-run the job once the file lands. And if you think about it, nobody wrote those steps in advance.

*[pause]*

**[Graphic 20, full screen]** The maths builds line by line. "Let's say 20,000 tokens a step × 10 steps = 200,000 tokens." "At $3 per million = 60 cents a question." "× 1,000 questions = $600 a day." Last line: "Worth it?"

*[pause]*

But every step costs tokens, so let's do that math too. Let's say each step sends twenty thousand tokens, and the agent takes ten steps. That's two hundred thousand tokens for one question. At three dollars per million, that's sixty cents a question. And at a thousand questions a day, that's six hundred dollars a day. So is the agent worth six hundred dollars a day to you? Sometimes it is, and sometimes a simple script does the job for almost nothing.

*[pause]*

**[On camera]**

A lot of freedom means an agent can solve problems you didn't plan for. It also means it can make mistakes you didn't plan for. So give it only the tools it needs, and have a person approve anything that changes data.

#### 17. Context engineering

**[Card beside you]** 17. Context engineering just means choosing what goes into the context window at every step.

Number seventeen is context engineering, and it matters most for agents. Context engineering just means choosing what goes into the context window at every step. Prompt engineering is about the words in one message. Context engineering is about everything the model sees, including documents, tool results and notes from earlier steps.

**[Graphic 21, full screen]** Two bars. "Whole log: 50,000 lines × 20 tokens = 1,000,000 tokens." "Error lines only: 12 lines × 20 tokens = 240 tokens." Below: "Plus a short summary of the earlier steps."

*[pause]*

Let's say the agent checking that empty dashboard opens a log with fifty thousand lines. If each line is about twenty tokens, that's a million tokens from one file. That fills even the biggest context window. But if your code keeps only the twelve error lines, that's about two hundred and forty tokens. So which one gives the better answer, and which one costs less? It's the same one.

*[pause]*

**[On camera]**

Good context engineering also means swapping old steps for a short summary. A demo works on one clean question. A product has to keep the right information in front of the model, step after step.

### Part 5: How you ship it

**[Graphic 1 again]** The map. Four areas are filled in, and "How you ship it" lights up.

*[pause]*

**[On camera]**

So now the assistant can read, answer and act. Before real people rely on it, you need to know if it's good and if you can afford it, and that's the last three concepts.

#### 18. Evals

**[Card beside you]** 18. An eval just means a test for your AI.

Number eighteen is evals, and it's the one most videos on this topic skip. An eval just means a test for your AI. You give it real questions where you already know the right answer, and you score what it says.

**[Graphic 22, full screen]** A table of fifty past incidents with four columns: the question, the real cause, the AI's answer, and pass or fail. The bottom line builds: "46 ÷ 50 = 92%. Good enough?" Beside it: "Data tests check your data. Evals check your AI."

*[pause]*

Let's say you have fifty past incidents where you already know the real cause. You run your assistant on all fifty, and let's say it gets forty-six right, which is ninety-two percent. Now the question is whether ninety-two percent is good enough for your team. That call is your job.

*[pause]*

**[On camera]**

Some checks are simple code, like "did it name the right job?" Others need judgment, so another model grades each answer against a checklist, which is called LLM-as-a-judge. With evals, every change is measured. Without them, every change is a guess. Data tests check your data, and evals check your AI.

#### 19. Distillation and small language models

**[Card beside you]** 19. Distillation just means training a small model to copy a big model's answers.

Number nineteen is distillation. Distillation just means training a small model to copy a big model's answers. The big model is the teacher, and the small one is the student. When DeepSeek released its R1 reasoning model in January 2025, it also released six smaller versions trained on R1's answers.

When the student is small enough, it's called a small language model. There's no official cut-off, but it usually means up to about ten billion parameters. Small models are cheaper and faster, and they can run on your own servers.

**[Graphic 23, full screen]** A router. Easy questions go to a small model, hard ones to a big model. The maths builds: "All big: 10,000 × 1¢ = $100 a day." "Routed: 8,000 × 0.1¢ = $8, plus 2,000 × 1¢ = $20." "= $28 a day." Last line: "$100 or $28?"

*[pause]*

And so a common setup is to send easy questions to a small model and hard ones to a big model. Let's say a big model costs one cent a question, and a small one costs a tenth of a cent. Let's say you get ten thousand questions a day. If they all go to the big model, that's a hundred dollars a day. Now let's say eight thousand are easy and go to the small model. That's eight dollars, plus twenty for the two thousand hard ones, so twenty-eight dollars a day.

*[pause]*

**[On camera]**

So would you rather pay a hundred dollars a day or twenty-eight? Your evals tell you if the small model is good enough to switch. Not every question needs the biggest model.

#### 20. Quantization

**[Card beside you]** 20. Quantization just means storing a model's numbers with fewer bits so it needs less memory.

Number twenty is quantization, and it's the last one. Quantization just means storing a model's numbers with fewer bits so it needs less memory. More bits keeps a little more quality and needs a lot more memory. Fewer bits loses a little quality and needs a lot less.

**[Graphic 24, full screen]** A model with 8 billion parameters as three bars. "16-bit: 8 billion × 2 bytes = 16 GB." "8-bit: about 8 GB." "4-bit: 8 billion × half a byte = 4 GB." A laptop icon next to the 4-bit bar.

*[pause]*

Let's do the math. Many open models are released with sixteen bits for each parameter, which is two bytes. So let's say you have a model with eight billion parameters. Eight billion times two bytes is sixteen gigabytes, just to hold the numbers. At four bits, which is half a byte, that's four gigabytes, plus some extra while it runs. So do you rent a big graphics card for sixteen gigabytes, or run it on a good laptop at four?

*[pause]*

**[On camera]**

Quantization happens after training, so it doesn't make training cheaper. It makes running cheaper.

### Putting it all together

**[Graphic 25, full screen]** The completed map. All twenty concepts sit in their five areas, joined by the path of the empty-dashboard question.

*[pause]*

So let's put all twenty together with the agent example, "Why is the sales dashboard empty this morning?" The question becomes tokens and embeddings, and a transformer uses attention to work out what it means. That model was pre-trained, fine-tuned and trained with RL, and it can reason, but it can still hallucinate. So you fill its context window with a clear prompt, a few examples, and the runbook pages RAG finds in a vector database. Tool calling and MCP let it check real systems, and as an agent, it loops until it finds the missing file. Context engineering keeps each step clean, and evals tell you it works. Distillation and quantization make it cheap to run.

*[pause]*

**[On camera]** *(Added line. Chris to confirm.)*

And if you look at the map again, only the first two groups are the model itself. Everything else is getting the right data in and checking what comes out, which means documents, pipelines, logs and tests. That's data engineering work. So if you're a data engineer, you're a lot closer to AI engineering than you think.

### Your turn

**[Graphic 26, full screen]** The cheat sheet: all twenty "just means" definitions from the cards, on one page.

*[pause]*

**[On camera]**

So here's what I want you to do this week. Pick five of these twenty concepts and explain each one out loud in one sentence, without looking. Then pick one and explain where it fits in a project you've already built. Most people will watch this and forget half of it by tomorrow. The ones who say it out loud are the ones who can explain it when it counts.

**[On camera]** *(Added line. Chris to confirm.)*

And in an AI engineering interview, explaining how you'd stop an assistant from making things up will usually get you further than explaining how attention works.

### Call to action

**[On camera]**

If you want help planning your move into AI engineering, the first link in the description books a free fifteen-minute call with me. We'll work out where you're starting from and what to learn first.

**[On camera]** *(Chris to confirm which masterclass to name.)*

And if you want to build projects like this step by step, that's what the Stackle masterclasses are for. The Data Engineering Masterclass and the AI Engineering Masterclass both teach you to build real projects, and the links are in the description.

**[On camera]**

And drop a comment telling me which of these twenty is still confusing for you. I'll take the one that comes up most and make a full video on it.

---

## Graphics list

The video has one main picture, **the map**, which comes back at the start of every part with more areas filled in. Build it once with five empty areas, and add each concept's box as a layer. Every "let's say" number on screen gets a small "Let's say" label, so nobody reads it as a real price.

1. **The map:** five areas called "Inside the model", "How it was trained", "What you send it", "How it takes action" and "How you ship it". Shown empty in the intro, then again at the start of Parts 2 to 5 with the earlier areas filled in.
2. **LLM:** "The nightly data load failed because the input file was ___", with three guesses and bars for how likely each one is. "missing" is the tallest.
3. **Tokens:** "Why is the sales dashboard empty this morning?" split into nine colored tokens: "Why", " is", " the", " sales", " dashboard", " empty", " this", " morning", "?". "Snowflake" becomes "Snow" and "flake". "Hello, why is the dashboard empty?" is 8 tokens in English, and "नमस्ते, डैशबोर्ड खाली क्यों है?" is 15. Label: "OpenAI tokenizer used by GPT-4o".
4. **Token maths:** "Let's say: $3 per million tokens." "1,000 questions × 5,000 tokens = 5 million tokens a day." "= $15 a day = about $450 a month." "Hindi: 15 tokens instead of 8. Close to double?"
5. **Embeddings:** "Why is the dashboard empty?" right next to "Missing rows in the sales table". "Change the dashboard colors" a little further away. "Today's lunch menu" far off in a corner.
6. **Attention:** "The pipeline failed last night", with arrows from "pipeline" to "failed" and "night". "The pipeline looks strong this quarter", with arrows to "strong" and "quarter".
7. **Transformer:** a tall stack of identical blocks, each saying "Attention" then "Process". Beside it: "2017: Attention Is All You Need" and "GPT = Generative Pre-trained Transformer".
8. **Pre-training:** "Please send the report by ____", then "Friday" appears. Underneath: "The text is its own answer key."
9. **Fine-tuning versus instructions:** left, "Fine-tune": collect examples, train, test, repeat when a new model comes out. Right, "Instructions first": write the rule, add two examples, try it today.
10. **RLHF:** two answers, a person picks one, a reward model learns the choice, and the LLM is trained to score higher. Under it: "1.3 billion parameters beat 175 billion. 175 ÷ 1.3 ≈ 135 times smaller." Source: OpenAI, 2022.
11. **Reasoning:** "Which of our ten biggest customers spent less this quarter than last quarter?" with four steps: find the ten customers, get this quarter's spend, get last quarter's spend, compare.
12. **Hallucination:** a SQL query that filters on "region_code", with a red error: "column region_code does not exist".
13. **Context window:** a box labelled "Context window: about 1 million tokens" filling up with instructions, examples, documents, tool results, chat history and the answer. A pile labelled "Three years of logs" that does not fit. Under it: "Context rot: 18 models got less reliable as inputs grew (Chroma, 2025)."
14. **Prompt:** the system prompt text, with two example answers in the same three-line format below it.
15. **RAG:** Retrieve, "Find the runbook page". Augment, "Add it to the prompt". Generate, "Answer from your steps".
16. **Vector database:** runbook pages cut into chunks, each becoming an embedding. The question's embedding lands next to "Missing rows in the sales table". In a corner: "Keyword search + vector search" and "Postgres + pgvector".
17. **Tool calling:** four steps. 1. The model asks: "Call get_job_status for the sales job." 2. Your code runs it. 3. Your code sends back: "Failed at 3:10 a.m." 4. The model answers with that fact.
18. **MCP maths:** left, "Without MCP": ten apps and ten tools in a tangle, "10 × 10 = 100 connectors". Right, "With MCP": each connects once, "10 + 10 = 20". Bottom: "Let's say one week each: 100 weeks or 20?"
19. **Agent:** the loop "Decide", "Use a tool", "Read the result" and back to "Decide". Beside it, the steps: no rows today, the load job failed, "input file not found", then "Re-run the job when the file lands?" for a person to approve.
20. **Agent maths:** "Let's say 20,000 tokens a step × 10 steps = 200,000 tokens." "At $3 per million = 60 cents a question." "× 1,000 questions = $600 a day." "Worth it?"
21. **Context engineering maths:** "Whole log: 50,000 lines × 20 tokens = 1,000,000 tokens." "Error lines only: 12 lines × 20 tokens = 240 tokens." "Plus a short summary of the earlier steps."
22. **Evals:** a table of fifty past incidents with the question, the real cause, the AI's answer, and pass or fail. "46 ÷ 50 = 92%. Good enough?" Beside it: "Data tests check your data. Evals check your AI."
23. **Distillation and routing maths:** easy questions go to a small model and hard ones to a big model. "All big: 10,000 × 1¢ = $100 a day." "Routed: 8,000 × 0.1¢ = $8, plus 2,000 × 1¢ = $20." "= $28 a day." "$100 or $28?"
24. **Quantization maths:** an 8-billion-parameter model as three bars. "16-bit: 8 billion × 2 bytes = 16 GB." "8-bit: about 8 GB." "4-bit: 8 billion × half a byte = 4 GB." A laptop icon next to the 4-bit bar.
25. **The full map:** all twenty concepts in their five areas, joined by the path of the empty-dashboard question.
26. **Cheat sheet:** the twenty "just means" definitions from the cards, on one page.

**Cards beside you:** one for each concept, with the number and the "just means" definition, word for word from the script.

**Shortened on-screen labels (not word for word from the script):** the map's area names, the Graphic 9 column steps, the Graphic 10 row label, the Graphic 13 layer labels, the Graphic 15 step labels and the Graphic 19 loop labels. Every number on screen matches the script.

**Style for all graphics:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

**Thumbnail idea:** the finished map from Graphic 25, small and busy on the left, and "20 AI CONCEPTS" in large text on the right, with Chris pointing at the map. The original's thumbnail is text and a person only, so the map makes ours look different in search results.

---

## YouTube title

AI Concepts Explained: 20 Terms Every Engineer Should Know

(57 characters.) Other options: "20 AI Concepts Explained in Plain English (With Real Examples)" (61) or "AI Engineering Concepts Explained: Tokens to Agents" (51).

## YouTube description

In this video, I explain the twenty AI concepts you keep hearing in every AI meeting, from tokens and embeddings to RAG, MCP and agents. Each one gets a plain-English definition, one example, and the maths where it matters, so by the end you can explain every one of them in a single sentence and see how they fit together.

Chapters
0:00 Twenty AI concepts in plain English
0:00 1. Large language model
0:00 2. Token
0:00 3. Embedding
0:00 4. Transformer and attention
0:00 5. Pre-training
0:00 6. Fine-tuning
0:00 7. Reinforcement learning
0:00 8. Reasoning model
0:00 9. Hallucination
0:00 10. Context window
0:00 11. Prompt
0:00 12. RAG
0:00 13. Vector database
0:00 14. Tool calling
0:00 15. MCP
0:00 16. Agent
0:00 17. Context engineering
0:00 18. Evals
0:00 19. Distillation and small language models
0:00 20. Quantization
0:00 Putting it all together
0:00 Your task for this week

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle Data Engineering Masterclass: https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks
Stackle AI Engineering Masterclass: [link to add]

Sources
- Attention Is All You Need (the transformer paper, 2017): https://arxiv.org/abs/1706.03762
- InstructGPT, reinforcement learning from human feedback (OpenAI, 2022): https://arxiv.org/abs/2203.02155
- Chain-of-thought prompting (Google, 2022): https://arxiv.org/abs/2201.11903
- DeepSeek-R1 and its distilled models (2025): https://arxiv.org/abs/2501.12948
- Why Language Models Hallucinate (OpenAI, 2025): https://arxiv.org/abs/2509.04664
- Context Rot (Chroma, 2025): https://www.trychroma.com/research/context-rot
- Effective context engineering for AI agents (Anthropic, 2025): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Retrieval-Augmented Generation (Facebook AI Research, 2020): https://arxiv.org/abs/2005.11401
- pgvector, vector search for Postgres: https://github.com/pgvector/pgvector
- Tool use with Claude (Anthropic docs): https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Model Context Protocol: https://modelcontextprotocol.io
- MCP joins the Agentic AI Foundation (Anthropic, December 2025): https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
- Demystifying evals for AI agents (Anthropic, 2026): https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Model memory at 16, 8 and 4 bits (Hugging Face): https://huggingface.co/blog/llama31

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab

---

## Facts, examples and lines added for Chris to check

- **Style check.** `skills/hormozi-style/scripts/style_check.py` on the spoken script gives a median sentence length of 13 words (mean 13.5) and 8% short lines, with no clichés and no fragment runs. Only 12% of sentences are 20 words or longer, which is below Hormozi's 18% to 30%, because you asked for an average of about 13 words. To sound a little more like him, join a few pairs of sentences with "and so".
- **Every "let's say" number is made up, and the script says so out loud.** These are $3 per million tokens, a thousand questions a day at five thousand tokens each, twenty thousand tokens a step for ten steps, one cent against a tenth of a cent a question, ten thousand questions with eight thousand easy ones, a week per connector, fifty thousand log lines at twenty tokens each, twelve error lines, forty-six out of fifty, two hundred runbook pages, and the 3:10 a.m. failure. Each one is labelled "Let's say" on screen too. If you have real numbers from your own work, swap them in.
- **The long running example is gone.** Each concept has its own short "let's say", as your rules ask. The empty-dashboard question is used once, in the agent concept, and comes back only in "Putting it all together" to close the loop.
- **Nothing is reused from the original video.** The car and engine line, "All that glitters", and the apple example are not in this version. The pipeline example keeps the same idea (one word, two meanings) with our own word.
- **The intro keeps the interviews sentence.** Your rules say to ask about it for concept videos, so please confirm.
- **Added lines to confirm:** the fine-tuning advice ("most teams try better instructions and better documents first"), the data engineering point after the full map, and the interview line in "Your turn". Keep the interview line only if it matches what you see.
- **"It's the one most videos on this topic skip"** (evals) is backed by the competitor research: only one of the twelve competitor videos gives evals its own section.
- **The comment promise** ("I'll take the one that comes up most and make a full video on it") commits you to a follow-up video. Cut it if you do not want that.
- **Length:** about 26 minutes, which is about two minutes longer than the first version, because every concept now has a rule, a reason, a "let's say" and a landing line. To get to about 25 minutes, cut the MCP history paragraph, the "RAG is dead" lines, the two vector database tips and the reasoning-model history, which saves about 160 words.
- **Graphics load:** twenty-six full-screen graphics plus twenty cards is heavy. Graphics 8, 9 and 12 are the easiest to turn into cards beside you.
- **Next videos from the gaps:** temperature, mixture of experts, guardrails and prompt injection, and prompt caching are missing from almost every competitor too. The comment question at the end will tell you which one people want.
- **Research method:** your rules say to research in your Chrome. It was not connected in this cloud session, so the research used yt-dlp and web search, as the brief explains.
- **Check before filming:** the context window sizes (they change often; checked on 13 October 2026). The token counts in Graphic 3 come from OpenAI's o200k_base tokenizer, and Claude's tokenizer gives different numbers, so keep the "OpenAI tokenizer" label on screen.
