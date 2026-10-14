# 20 AI Concepts, One Real Project: Script

**Title:** 20 AI Concepts Every Engineer Should Know (Explained With One Real Project)

**Spoken words:** about 3,650 · **Estimated length:** about 24 minutes at 150 words a minute

**Type:** Concepts video. It is rebuilt from Gaurav Sen's "20 AI Concepts Explained in 40 Minutes". It keeps the same promise of twenty terms, but it has a new structure, one running example, fixes for the original's mistakes, and four terms the original left out. The Stackle sentence rules apply: complete sentences, simple English, no fragments and no contractions.

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
- **The apple example for attention.** One word, three meanings, and the nearby words decide. Our version uses the same idea with a word data people use every day: "pipeline".
- **"Retrieve, augment, generate."** A comment quoting this line has 45 likes. We keep the three steps as the RAG graphic.
- **Hiding part of the screen for self-supervised learning.** Viewers called it "hilarious" and "eye-opening". We use a simpler version with the hidden word "gold".
- **The car and the engine.** "The large language model is the product. You can think of it as a car. And this is the engine." We keep this line for the transformer.
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
1. **One project from start to finish, from the data side.** Every concept is shown inside one assistant that answers "Why is the sales dashboard empty this morning?" This fixes the original's eleven unrelated examples, and it puts the viewer's idea from the comments at the centre. KodeKloud also uses one project, but it is a 56-minute LangChain course built around a document assistant. Ours is a data engineering incident and runs about half the length of the original.
2. **A map with five areas** (inside the model, how it was trained, what you send it, how it takes action, how you ship it). The map fills in as the video goes, so the twenty terms become one picture instead of a list.
3. **A data engineering point of view.** The examples are pipelines, warehouses, runbooks and on-call incidents, which none of the twelve competitor videos uses. The closing point is that most of the map is data work.
4. **Every mistake above is fixed,** and the facts are checked against primary sources.
5. **Time follows usefulness.** Each concept gets about one minute. Theory is kept short, and the terms engineers use every day get the same time as the theory.
6. **A one-sentence definition for every concept,** on a card and then on one cheat sheet at the end. This serves the viewers who watch for interview revision.
7. **Four terms added** (context window, hallucination, tool calling and evals), and five folded into others, so the count stays at twenty. Evals and hallucination are the biggest gaps across all thirteen videos (the original and the twelve competitors).
8. **Real token counts,** including the same question in English and Hindi, because many Stackle viewers are in India.
9. **About half the length:** about 24 minutes instead of 43.

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

## Script

### Hook

**[Graphic 1, full screen]** A team chat at 9:02 a.m. A message from the sales team: "Why is the sales dashboard empty this morning?" An AI assistant replies: "The nightly load failed at 3:10 a.m. because the file from the payments system did not arrive. Do you want me to re-run the job when the file lands?"

*[pause]*

It is nine in the morning, and someone from sales asks: "Why is the sales dashboard empty?" A few years ago, a data engineer would stop everything and dig through the logs. Today, an AI assistant can check the pipeline, find the failed job, and reply with the reason.

*[pause]*

To build that assistant, you need twenty ideas. They are the same twenty words you hear in every AI meeting: tokens, embeddings, RAG, MCP, agents and the rest.

### Promise

**[On camera]**

In this video, I am going to explain those twenty AI concepts in plain English. But I will not give you a list of definitions, because a list is easy to forget. Instead, we will build that one assistant together, and each concept will show up exactly where it is used. By the end, you will be able to explain every term in one sentence, and you will know how they all fit together.

### Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[Graphic 2, full screen]** The map. One empty diagram with five areas: "Inside the model", "How it was trained", "What you send it", "How it takes action" and "How you ship it".

*[pause]*

Here is the map we will fill in. The twenty concepts fall into five groups. First, what happens inside the model. Second, how the model was trained. Third, what you send to the model. Fourth, how the model takes action. And fifth, how you ship it to real users. Each time we learn a concept, it goes onto the map.

*[pause]*

### Part 1: Inside the model

#### 1. Large language model

**[Card beside you]** 1. Large language model (LLM): a program that has learned to predict the next piece of text.

The brain of our assistant is a large language model, or LLM. An LLM is a program that has learned to predict the next piece of text. You give it some text, and it predicts what comes next. Then it adds that piece to the text and predicts again. A full answer is built this way, one small piece at a time.

Inside, an LLM is a neural network. A neural network is a huge set of numbers, called parameters, arranged in layers. During training, these numbers are adjusted again and again until the predictions are good. Large models have billions of parameters, and the biggest open models now have hundreds of billions, or even a trillion.

Many models can also read images and audio. They are called multimodal models, and everything in this video applies to them too.

#### 2. Token

**[Card beside you]** 2. Token: a small piece of text that a model reads and writes.

**[Graphic 3, full screen]** "Why is the sales dashboard empty this morning?" split into nine colored tokens. Below it, "Snowflake" splits into "Snow" and "flake". At the bottom, the same short question in English (8 tokens) and in Hindi (15 tokens). Small label: "OpenAI tokenizer used by GPT-4o".

*[pause]*

A model does not read words. It reads tokens, which are small pieces of text. A common word is often one token, and a less common word is split into parts. Our question, "Why is the sales dashboard empty this morning?", is nine tokens on OpenAI's tokenizer. The word "Snowflake", however, becomes two tokens: "Snow" and "flake".

The pieces are chosen by how often they appear in text, not by grammar. On OpenAI's models, one English token is about three quarters of a word on average. Other companies' tokenizers split text a little differently.

*[pause]*

**[On camera]**

Tokens matter because everything is counted in them. You pay for each token, and the model's limits are set in tokens. Language matters too. The same short question takes eight tokens in English and fifteen in Hindi. So one question can cost almost twice as much in some languages.

#### 3. Embedding

**[Card beside you]** 3. Embedding: a list of numbers that captures what a piece of text means.

**[Graphic 4, full screen]** A map of points. "The dashboard is empty", "No rows were loaded" and "Data is missing from the report" sit close together. "Change the dashboard colors" is further away. "Today's lunch menu" is far off in a corner.

*[pause]*

Next, the model needs the meaning of the text. An embedding is a list of numbers that captures what a piece of text means. You can think of it as a position on a map of meaning. Texts with similar meanings land close together, even when they share no words. "The dashboard is empty" lands close to "No rows were loaded", and far away from "Today's lunch menu".

Real embeddings have hundreds or thousands of numbers, not two, but the idea is the same: close means similar. Remember this concept, because our assistant will use embeddings again to search its documents.

#### 4. Transformer and attention

**[Card beside you]** 4. Transformer: the design inside almost every LLM. Its key part, attention, lets each word take its meaning from the words around it.

**[Graphic 5, full screen]** Two sentences. "The data pipeline failed last night." "The sales pipeline looks strong this quarter." In the first, arrows go from "pipeline" to "data" and "failed". In the second, they go to "sales" and "quarter".

*[pause]*

Here is a problem. To a data engineer, a pipeline is a set of jobs that moves data. To a sales team, a pipeline is the list of deals they hope to close. It is the same word with a different meaning, and the only way to tell them apart is to look at the words nearby.

Attention does exactly that. For every token, the model looks at all the other tokens and decides which ones matter for its meaning. In "The data pipeline failed", attention pulls "pipeline" towards the meaning of data jobs. In "The sales pipeline looks strong", it pulls it towards deals.

*[pause]*

**[On camera]**

A transformer is a design for a neural network that is built around attention. It repeats the same block many times: attention, then a layer that processes the result, and then attention again. Each round builds a richer understanding of the text. Google researchers introduced the transformer in 2017, in a paper called "Attention Is All You Need". It is the T in GPT. If the LLM is the car, the transformer is the engine.

### Part 2: How the model was trained

**[Graphic 2 again]** The map. Part 1 is filled in, and "How it was trained" lights up.

#### 5. Pre-training

**[Card beside you]** 5. Pre-training: the first and biggest stage of training, where the model learns to predict the next token from huge amounts of text.

**[Graphic 6, full screen]** "All that glitters is not ____". After a beat, the hidden word appears: "gold".

*[pause]*

Where does all this knowledge come from? It comes from pre-training, the first and biggest stage of training. The model reads a huge amount of text, from websites, books and code, and it practices one task over and over: guess the next token.

Nobody has to label the answers, because the text already contains them. Hide the last word of "All that glitters is not gold", and the answer is "gold". This is called self-supervised learning, because the data provides its own answers. It is the reason models can learn from so much text: no person has to mark any of it.

After pre-training, you have a base model. It knows a lot about language, but it only continues text. If you ask it a question, it might write three more questions, as if it were continuing a list. It does not yet know that it should answer you.

#### 6. Fine-tuning

**[Card beside you]** 6. Fine-tuning: extra training on a smaller set of chosen examples, to change how a model behaves.

Fine-tuning fixes that. Fine-tuning is extra training on a smaller set of chosen examples. To turn a base model into an assistant, the company that builds it trains it on many examples of a question followed by a good answer. Companies also fine-tune models for a narrow job, such as writing in a fixed format or using medical language.

**[On camera]** *(Advice line. Chris to confirm.)*

For our assistant, we will not fine-tune anything at the start. Fine-tuning needs good examples, time and money, and you may have to repeat it when a better model comes out. Most teams first try better instructions and better documents, which you will see in Part 3. They fine-tune only when those are not enough.

#### 7. Reinforcement learning

**[Card beside you]** 7. Reinforcement learning: training by reward. The model tries, gets a score, and learns to do more of what scores well.

**[Graphic 7, full screen]** Two rows. Top row, "Learning from people": two answers, a person picks the better one, a reward model learns those choices, and the LLM is trained to score higher. Bottom row, "Learning from checks": the model writes code, the tests run, and a pass earns a reward.

*[pause]*

Fine-tuning shows the model good answers. Reinforcement learning, or RL, lets the model try first and then rewards it. The model produces an answer, the answer gets a score, and training pushes the model to do more of what scored well.

The best-known kind is reinforcement learning from human feedback, or RLHF. People compare two answers and pick the better one. Those choices train a second model, called a reward model, which learns to predict what people prefer. The LLM is then trained to get higher scores from the reward model. This is a big reason why chat assistants became helpful and polite. In OpenAI's 2022 research, people preferred the answers of a model trained this way over the answers of a model more than one hundred times bigger.

The newer kind uses checks instead of people. When the task is a maths problem with one right answer, or code that has tests, a program can score the answer automatically. So the model can practice on far more problems than people could ever score by hand. This is how the reasoning models in the next concept were trained.

#### 8. Reasoning model

**[Card beside you]** 8. Reasoning model: a model that is trained to work through a problem step by step before it answers.

**[Graphic 8, full screen]** The assistant's steps, one after another: "The dashboard reads from the sales_daily table." "The table has no rows for today." "The load job failed at 3:10 a.m." "Error: input file not found." Then the answer.

*[pause]*

A reasoning model is a model that works through a problem step by step before it gives an answer. The written steps are called a chain of thought. Chain of thought started in 2022 as a prompting trick: when you showed a model worked examples with steps, its answers improved. Later, models such as OpenAI's o1 in 2024 and DeepSeek's R1 in 2025 were trained, mostly with reinforcement learning, to think this way on their own.

Our question needs steps. The dashboard reads from a table. The table has no rows for today. The job that loads the table failed at 3:10 a.m. And the job failed because an input file never arrived. A model that works through those steps gives a much better answer than a model that guesses in one go.

**[On camera]**

Thinking uses tokens, so a reasoning model is slower and costs more. Use it for hard questions, and use a faster model for simple ones.

#### 9. Hallucination

**[Card beside you]** 9. Hallucination: an answer that sounds confident but is false.

**[Graphic 9, full screen]** The assistant says: "The job sales_daily_v2 failed because of a timeout." A red stamp appears across it: "There is no job called sales_daily_v2."

*[pause]*

All this training has a side effect. A hallucination is an answer that sounds confident but is false. Our assistant might say, "The job sales daily v2 failed because of a timeout," when no job with that name exists.

It happens because the model is trained to produce likely text, and a likely answer is not always a true one. In 2025, OpenAI researchers argued that the way models are trained and tested rewards guessing. On most tests, a model that guesses scores better than a model that says "I do not know".

**[On camera]**

Today's models still hallucinate, so you design around it. You give the model the real facts, you allow it to say "I do not know", and you test it. The rest of this video does exactly that.

### Part 3: What you send the model

**[Graphic 2 again]** The map. Parts 1 and 2 are filled in, and "What you send it" lights up.

#### 10. Context window

**[Card beside you]** 10. Context window: the most text a model can work with at one time, counted in tokens.

**[Graphic 10, full screen]** A box labelled "Context window" fills up, layer by layer: instructions, examples, documents, tool results, the chat so far, and the answer. Beside it, a pile labelled "Three years of pipeline logs" that does not fit.

*[pause]*

The context window is the most text a model can work with at one time, counted in tokens. Everything has to fit inside it: your instructions, the question, any documents you add, the chat so far, and the answer the model writes. Today, the newest models from Anthropic, OpenAI and Google hold about one million tokens, and many older or smaller models hold much less.

That sounds like a lot, but our data team has three years of pipeline logs, and they will never fit. Even when text does fit, more is not always better. Every token costs money and time, and research shows that models get worse at finding the right detail as the input grows longer. People call this context rot.

So the real skill is choosing what to put in the window. The next three concepts are all about that.

#### 11. Prompt

**[Card beside you]** 11. Prompt: the text you send to the model. The system prompt holds the standing instructions, and few-shot prompting adds examples.

**[Graphic 11, full screen]** The assistant's system prompt: "You help the data team answer questions about dashboards and pipelines. Answer in three lines: what broke, why, and what to do next. If you are not sure, say so." Below it, two example answers from past incidents, in the same three-line format.

*[pause]*

A prompt is the text you send to the model. In an app, it has two parts. The system prompt holds the standing instructions that you, the developer, write once. The user message is the question, which changes every time.

Here is a system prompt for our assistant. "You help the data team answer questions about dashboards and pipelines. Answer in three lines: what broke, why, and what to do next. If you are not sure, say so." That last sentence is our first defence against hallucination.

Few-shot prompting means adding a few examples of good answers to the prompt. If we add two past incidents, written in our three-line format, the model follows the format much more reliably than it does from instructions alone.

#### 12. Retrieval-augmented generation (RAG)

**[Card beside you]** 12. RAG: find the right documents, add them to the prompt, and then let the model answer.

**[Graphic 12, full screen]** Three steps. Retrieve: "Find the runbook pages that match the question." Augment: "Add them to the prompt." Generate: "The model answers from those pages."

*[pause]*

The model learned from public text. It has never seen your company's runbooks, which are the step-by-step guides for fixing your systems. Retrieval-augmented generation, or RAG, solves this, and the name gives you the three steps. Retrieve means you find the documents that match the question. Augment means you add them to the prompt. Generate means the model writes the answer using those documents.

The prompt is the thing that gets augmented, not the model. Nothing inside the model changes. It simply reads the right pages before it answers, like a student in an open-book exam.

**[On camera]**

You may have heard people say that RAG is dead. What changed is how the retrieval happens. Many AI tools now let the model search for itself, with tools that you will see in Part 4. The job is still the same: find the right facts and put them in the context window.

#### 13. Vector database

**[Card beside you]** 13. Vector database: a database that stores embeddings and finds the ones closest in meaning to a question.

**[Graphic 13, full screen]** Runbook pages are cut into small chunks. Each chunk becomes an embedding and is stored. The question's embedding finds the closest chunk: "Missing rows in the sales_daily table".

*[pause]*

How does RAG find the right pages? Often, it uses a vector database, which stores embeddings and finds the ones closest in meaning to a question. This is where concept three comes back.

First, you split every runbook page into small chunks, turn each chunk into an embedding, and store it. When a question comes in, you turn the question into an embedding too, and the database returns the closest chunks. "Why is the dashboard empty?" finds the page called "Missing rows in the sales daily table", even though the two share almost no words.

**[On camera]**

Here are two tips from the data side. First, meaning search can miss exact names, such as a job ID or a table name, so many teams combine it with normal keyword search. Second, you may not need a new database at all. If you already run Postgres, an extension called pgvector adds vector search to it. Splitting documents, making embeddings and keeping them fresh when the documents change is a data pipeline, and you already know how to build those.

### Part 4: How the model takes action

**[Graphic 2 again]** The map. Parts 1 to 3 are filled in, and "How it takes action" lights up.

#### 14. Tool calling

**[Card beside you]** 14. Tool calling: the model asks your code to run a function, and then it uses the result.

**[Graphic 14, full screen]** Four steps between the model and your code. 1. The model: "Call get_job_status for sales_daily." 2. Your code runs the function. 3. Your code sends back: "Failed at 3:10 a.m. Error: input file not found." 4. The model writes the answer.

*[pause]*

So far, our assistant can only read what we give it. But the real answer to "Why is the dashboard empty?" lives in live systems, such as the job scheduler and the data warehouse. Tool calling lets the model reach them.

Here is the key idea: the model never runs anything itself. You describe your tools to it, for example "get job status" and "run a read-only SQL query". When the model needs one, it replies with a request, such as: call "get job status" for the sales daily job. Your code runs that function and sends the result back. Then the model continues, with real data in front of it.

Because your code does the running, you stay in control. If the assistant only has read-only access, it cannot delete a table, even by mistake.

#### 15. Model Context Protocol (MCP)

**[Card beside you]** 15. MCP: an open standard for connecting AI apps to tools and data.

**[Graphic 15, full screen]** Before: five AI apps and five tools, joined by a tangle of twenty-five lines. After: each app and each tool connects once to an "MCP" standard in the middle, which makes ten connections. A small USB-C icon.

*[pause]*

Tool calling has one problem. Every AI app used to write its own connector for every tool. With five apps and five tools, that is twenty-five connectors.

The Model Context Protocol, or MCP, is an open standard for connecting AI apps to tools and data. Each tool is wrapped once as an MCP server, and each app learns MCP once. Five plus five makes ten pieces of work instead of twenty-five. People often compare MCP to USB-C, because it is one plug that fits everything.

Anthropic introduced MCP in November 2024. In December 2025, Anthropic gave MCP to the Agentic AI Foundation, a new group under the Linux Foundation that Anthropic, OpenAI and Block started together. So today, MCP is run by an open foundation, not by one company.

For our assistant, this means we may not need to write the database or GitHub tools ourselves. If an MCP server for that system already exists, we plug it in.

#### 16. Agent

**[Card beside you]** 16. Agent: a model that uses tools in a loop until the goal is done.

**[Graphic 16, full screen]** A loop: "Decide", "Use a tool", "Read the result", then back to "Decide". Beside it, the assistant's real steps as a numbered list, ending with a question to a person: "Re-run the job?"

*[pause]*

When you put an LLM, tools and a loop together, you get an agent. An agent is a model that uses tools in a loop until the goal is done. You give it the goal, and the model decides each next step by itself.

Watch our assistant. It checks the dashboard's table and finds no rows for today. It checks the load job and sees that it failed. It reads the job's log and finds "input file not found". It checks the folder where the payments file should arrive, and the file is not there. Then it writes the answer and asks, "Do you want me to re-run the job when the file arrives?"

Nobody wrote those steps in advance. The model chose each step based on what it found in the step before.

**[On camera]**

That freedom is also the risk. Every step costs tokens, and one wrong step can send the rest in the wrong direction. So give an agent only the tools it needs, keep them read-only where you can, and make a person approve anything that changes data.

#### 17. Context engineering

**[Card beside you]** 17. Context engineering: choosing what goes into the context window at every step.

**[Graphic 17, full screen]** The context window at the agent's fourth step. Going in: the system prompt, the question, a short summary of steps one to three, and twelve error lines from the log. Left out: the other 49,988 lines of the log.

*[pause]*

Our agent just read a log file with fifty thousand lines. If it puts all of that into the context window, it fills the window, costs a lot of money, and hides the one line that matters.

Context engineering is choosing what goes into the context window at every step. Prompt engineering is about the words in one prompt. Context engineering is about everything the model sees: the instructions, the examples, the retrieved documents, the tool results, notes from earlier steps and the chat so far. It matters most for agents, because the context changes with every step of the loop.

Here, good context engineering means three things. We keep only the error lines from the log. We replace the first three steps with a short summary. And we save long notes to a file that the agent can read again if it needs them.

**[On camera]**

This is the skill that separates a demo from a product. A demo works on one clean question. A product has to keep the right information in front of the model, step after step.

### Part 5: How you ship it

**[Graphic 2 again]** The map. Parts 1 to 4 are filled in, and "How you ship it" lights up.

#### 18. Evals

**[Card beside you]** 18. Evals: tests that score your AI's answers on a fixed set of real questions.

**[Graphic 18, full screen]** A table of fifty past incidents with four columns: the question, the real cause, the assistant's answer, and pass or fail. The bottom line reads "46 of 50 passed". Beside the table: "Data tests check your data. Evals check your AI."

*[pause]*

Before real users touch our assistant, we need to know if it is any good. Evals are tests that score your AI's answers on a fixed set of real questions.

For our assistant, we take fifty past incidents from the on-call history, where we already know the real cause. We run the assistant on every one and score the answers. Some checks are simple code, such as "Did it name the right job?". Other checks need judgment, so another model grades each answer against a written checklist. This is called LLM-as-a-judge. And for the cases that matter most, a person reads the answers.

**[On camera]**

Run your evals every time you change the prompt, the model or the documents. Without them, you are guessing whether a change made things better or worse. If you have written data quality tests, you already know this idea. Data tests check your data, and evals check your AI.

#### 19. Distillation and small language models

**[Card beside you]** 19. Distillation: training a small model to copy a big model's answers. The result is often called a small language model.

**[Graphic 19, full screen]** A big "teacher" model and a small "student" model. Below them, a router. "Did the sales job run last night?" goes to the small model. "Why is revenue down five percent this week?" goes to the big reasoning model.

*[pause]*

Our assistant works, but a big reasoning model is expensive, and most questions are simple. "Did the sales job run last night?" does not need the biggest model in the world.

Distillation is training a small model to copy a big model's answers. The big model is the teacher. You run it on many examples, and the small model, the student, is trained to give the same answers. For example, when DeepSeek released its R1 reasoning model in January 2025, it also released six smaller versions, from one and a half billion to seventy billion parameters. DeepSeek made them by training existing open models on answers written by R1.

When the student is small enough, it is often called a small language model. There is no official cut-off, but the term usually means a model with up to about ten billion parameters. Microsoft's Phi-3-mini, with three point eight billion parameters, is a well-known example. Small models are cheaper and faster, and they can run on your own servers, so your data never leaves the company. A common setup sends simple questions to a small model and hard questions to a big one.

#### 20. Quantization

**[Card beside you]** 20. Quantization: storing a model's numbers with fewer bits, so the model needs less memory.

**[Graphic 20, full screen]** A model with 8 billion parameters, shown as three bars. 16-bit: about 16 GB. 8-bit: about 8 GB. 4-bit: about 4 GB. A laptop icon sits next to the 4-bit bar.

*[pause]*

This is the last concept. Every parameter is a number, and every number takes memory. Quantization is storing those numbers with fewer bits, so the model needs less memory.

Here is the maths. Many open models are released with sixteen bits, which is two bytes, for each parameter. So a model with eight billion parameters needs about sixteen gigabytes just to hold its numbers. If you store each number in four bits instead, it needs about four gigabytes, plus some extra memory while it runs. That is small enough for many laptops. You lose a little quality, and you gain a model that is cheaper and faster to run.

Quantization does not make training cheaper, because it happens after training. It only makes running the model cheaper.

### The full map

**[Graphic 21, full screen]** The completed map. All twenty concepts sit in their five areas, joined by the path of our one question.

*[pause]*

Now we will put it all together, with our one question. "Why is the sales dashboard empty?" is split into tokens and turned into embeddings. A transformer, built on attention, works out what it means. That model was pre-trained, fine-tuned and trained with reinforcement learning, and it reasons step by step, but it can still hallucinate. So we fill its context window with care: a clear prompt, a few examples, and the right runbook pages, which RAG finds in a vector database. With tool calling and MCP, it reaches live systems, and as an agent, it works in a loop until it finds the missing file. Context engineering keeps every step clean. Evals show that it works. And distillation and quantization make it cheap enough to run every day.

*[pause]*

**[On camera]** *(Added line. Chris to confirm.)*

Now look at the map again. Only the first two areas are the model itself. Everything else is about getting the right data to the model and checking what comes out: documents to split and store, tools that query the warehouse, logs to filter, and tests to run. That is data engineering work. This is why I think data engineers are much closer to AI engineering than they believe.

### Your turn

**[Graphic 22, full screen]** The cheat sheet: all twenty one-sentence definitions on one page.

*[pause]*

Here is your task for this week. Pick five of these twenty concepts, and explain each one out loud in one sentence, without looking. Then pick one concept and explain where it would fit in a project you have built. If you can do both, you understand it.

**[On camera]** *(Added line. Chris to confirm.)*

When I interview engineers for AI work, I rarely ask about the maths behind attention. I ask how they would stop an assistant like this one from making things up.

### Call to action

**[On camera]**

If you want help planning your move into AI engineering, the first link in the description books a free fifteen-minute call with me.

**[On camera]** *(Chris to confirm which masterclass to name.)*

If you want to build projects like this assistant step by step, the Stackle masterclasses can help. The Data Engineering Masterclass and the AI Engineering Masterclass teach you to build real projects. The links are in the description.

**[On camera]**

Tell me in the comments: which of these twenty concepts is still confusing? I will take the most common answer and make a full video on it.

---

## Graphics list

The video has one main picture, **the map**, which comes back at the start of every part with more boxes filled in. Build it once with five empty areas and add each concept's box as a layer.

1. **Hook:** a team chat at 9:02 a.m. The sales message: "Why is the sales dashboard empty this morning?" The assistant's reply: "The nightly load failed at 3:10 a.m. because the file from the payments system did not arrive. Do you want me to re-run the job when the file lands?"
2. **The map:** five areas: "Inside the model", "How it was trained", "What you send it", "How it takes action" and "How you ship it". It is shown empty in the intro, then again at the start of Parts 2, 3, 4 and 5 with the earlier parts filled in.
3. **Tokens:** the question split into nine colored tokens: "Why", " is", " the", " sales", " dashboard", " empty", " this", " morning", "?". "Snowflake" becomes "Snow" and "flake". "Hello, why is the dashboard empty?" is 8 tokens in English, and the Hindi version, "नमस्ते, डैशबोर्ड खाली क्यों है?", is 15. Label: "OpenAI tokenizer used by GPT-4o".
4. **Embeddings:** a two-dimensional map of points. "The dashboard is empty", "No rows were loaded" and "Data is missing from the report" are close together. "Change the dashboard colors" is further away, and "Today's lunch menu" is in a far corner.
5. **Attention:** "The data pipeline failed last night", with arrows from "pipeline" to "data" and "failed". "The sales pipeline looks strong this quarter", with arrows to "sales" and "quarter".
6. **Pre-training:** "All that glitters is not ____", and then "gold" appears.
7. **Reinforcement learning:** the top row, "Learning from people", shows two answers, a person's pick, a reward model, and the LLM scoring higher. The bottom row, "Learning from checks", shows code, tests running, and a pass earning a reward.
8. **Reasoning:** the four steps, "The dashboard reads from the sales_daily table", "The table has no rows for today", "The load job failed at 3:10 a.m." and "Error: input file not found", followed by the answer.
9. **Hallucination:** "The job sales_daily_v2 failed because of a timeout", with a red stamp: "There is no job called sales_daily_v2."
10. **Context window:** a box filling up with instructions, examples, documents, tool results, the chat so far and the answer. Beside it, a pile labelled "Three years of pipeline logs" that does not fit.
11. **Prompt:** the system prompt text, with two example answers from past incidents below it in the same three-line format.
12. **RAG:** Retrieve, "Find the runbook pages that match the question". Augment, "Add them to the prompt". Generate, "The model answers from those pages".
13. **Vector database:** runbook pages cut into chunks, each chunk becoming an embedding, and the question's embedding finding "Missing rows in the sales_daily table".
14. **Tool calling:** four steps. 1. The model: "Call get_job_status for sales_daily." 2. Your code runs the function. 3. Your code sends back: "Failed at 3:10 a.m. Error: input file not found." 4. The model writes the answer.
15. **MCP:** before, five AI apps and five tools joined by twenty-five lines. After, each app and each tool connects once to "MCP" in the middle, which makes ten connections. A small USB-C icon.
16. **Agent:** the loop "Decide", "Use a tool", "Read the result" and back to "Decide". Beside it, the assistant's five real steps, ending with "Re-run the job?" for a person to approve.
17. **Context engineering:** the context window at the agent's fourth step. Going in: the system prompt, the question, a short summary of steps one to three, and twelve error lines. Left out: the other 49,988 lines of the log.
18. **Evals:** a table of fifty past incidents with the question, the real cause, the assistant's answer, and pass or fail. The bottom line: "46 of 50 passed". Beside it: "Data tests check your data. Evals check your AI."
19. **Distillation:** a big "teacher" model and a small "student" model. A router sends "Did the sales job run last night?" to the small model and "Why is revenue down five percent this week?" to the big reasoning model.
20. **Quantization:** a model with 8 billion parameters as three bars: 16-bit, about 16 GB; 8-bit, about 8 GB; 4-bit, about 4 GB. A laptop icon next to the 4-bit bar.
21. **The full map:** all twenty concepts in their five areas, joined by the path of the one question.
22. **Cheat sheet:** the twenty one-sentence definitions from the cards, on one page. This can also be a PDF for the description (see the notes below).

**Cards beside you:** one for each of the twenty concepts, with the number, the name and the one-sentence definition. These are the same sentences as the cheat sheet.

**Shortened on-screen labels (not word for word from the script):** the map's area names, the Graphic 7 row labels, the Graphic 10 layer labels, the Graphic 12 step labels, the Graphic 16 loop labels, and the Graphic 18 column names. The "46 of 50 passed" in Graphic 18 is an example number, not a real result. Every other number on screen matches the script.

**Style for all graphics:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

**Thumbnail idea:** the finished map from Graphic 21, small and busy on the left, and on the right in large text "20 AI CONCEPTS" with "1 real project" underneath, with Chris pointing at the map. The original's thumbnail is text and a person only, so the map makes ours look different in search results.

---

## YouTube title

20 AI Concepts Every Engineer Should Know (Explained With One Real Project)

Other options: "AI Engineering Explained: 20 Concepts, One Real Project" or "20 AI Terms Explained With One Real Project (Tokens to Agents)".

## YouTube description

Tokens, embeddings, RAG, MCP, agents, evals: you hear these words in every AI meeting. In this video I explain twenty AI concepts in plain English, and instead of giving you a list, I show every one of them inside one real project: an AI assistant that answers "Why is the sales dashboard empty this morning?" By the end, you will be able to explain each concept in one sentence and see how they fit together.

Chapters
0:00 Twenty concepts, one project
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
0:00 The full map
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

- **The intro keeps the interviews sentence.** This is a concepts video, and the top comments on the original show people use it for interview revision. Cut it if you want this treated like a tool video.
- **Added lines to confirm:** the fine-tuning advice ("For our assistant, we will not fine-tune anything at the start…"). The data engineering point after the full map ("Only the first two areas are the model itself…"). The interview line in "Your turn" ("When I interview engineers for AI work, I rarely ask about the maths behind attention…"). Keep the interview line only if it is true for you; it is the one hiring line near the end.
- **The assistant is an example, not a real project.** The table name `sales_daily`, the 3:10 a.m. failure, the payments file, the fifty-thousand-line log and "46 of 50 passed" are all made up to make the ideas concrete. If you have a real incident story like this, swap it in. It would make the video stronger.
- **The comment promise** ("I will take the most common answer and make a full video on it") commits you to a follow-up video. Cut it if you do not want that.
- **Credit to the original.** The script does not name Gaurav Sen. The "car and engine" line and the idea of hiding a word come from his video, but both are common ways to teach these ideas. If you want to credit him, one line in the description is enough.
- **Cheat sheet.** The cards already give you twenty one-sentence definitions. If you turn them into a PDF, add the link to the description and say "the cheat sheet is in the description" in "Your turn".
- **Length:** about 24 minutes. To cut about a minute, drop the RAG-is-dead paragraph, the two vector database tips, and the "demo versus product" paragraph in context engineering. To cut more, merge Graphics 6 and 9 into cards and shorten the full-map recap.
- **Graphics load:** twenty-two full-screen graphics plus twenty cards is heavy. Graphics 6, 9 and 11 are the easiest to turn into cards beside you.
- **Next videos from the gaps:** temperature, mixture of experts, guardrails and prompt injection, and prompt caching are missing from almost every competitor too. Any one of them would make a good follow-up, and the comment question at the end will tell you which one people want.
- **Check before filming:** the context window sizes (they change often; checked on 13 October 2026). The token counts in Graphic 3 come from OpenAI's o200k_base tokenizer, and Claude's tokenizer gives different numbers, so keep the "OpenAI tokenizer" label on screen. If you show a live tokenizer instead, recount the tokens.
