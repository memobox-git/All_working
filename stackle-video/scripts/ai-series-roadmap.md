# Explained in 2 Minutes: AI Engineering, series roadmap

**Series:** Explained in 2 Minutes: AI Engineering, by Stackle. The same format as the data engineering run (`series-roadmap.md`): one AI tool or idea per episode, about two minutes, the same five parts, both cuts. The trailer hook is "One AI tool. Two minutes."

**Status on 20 October 2026:** 01 RAG is scripted and waiting for review (`rag-explained.md`). Everything else is not started.

**Numbering:** 00 is the trailer, and 01 to 100 are the topics, in 10 seasons of 10. Season 1 is the names that show up most in AI job posts, the way the data engineering Season 1 is a data team's first-week vocabulary. Later seasons go deeper.

**The "In short" line** adapts for AI topics: "So when a job post asks for X, it means …".

## Overlaps to settle

- **Data engineering Season 10 (90 to 99)** covers 7 of these topics: LLMs, embeddings, vector databases, RAG, text-to-SQL, MCP and agents. The suggestion is to make them here, then refill that season from its reserve list, so nothing is made twice.
- **The "20 Gen AI Concepts" episode (`genai-20-concepts.md`)** covers 20 topics, and all of them are in this list. It can be the index video that links out to each episode as it comes out.

## The 100 topics

### Season 1: the names in every AI job post (01 to 10)

| # | Title | Core idea |
|---|---|---|
| 01 | RAG | Look up the right pages, then answer from them, with sources |
| 02 | AI Agents | A model in a loop that plans, uses tools and checks its work |
| 03 | MCP | One standard plug between AI apps and tools |
| 04 | LLMs | Next-token prediction, at huge scale |
| 05 | What Is AI Engineering? | Building products on top of models, not training them |
| 06 | Embeddings | Text as numbers, so similar meanings sit close together |
| 07 | Vector Databases | Find the nearest meanings fast |
| 08 | Fine-tuning | Train further on your own examples to change how it behaves |
| 09 | Evals | Tests that score answers, so you know a change helped |
| 10 | The AI Engineering Stack | One map that joins the season up, each box an episode |

### Season 2: how models work (11 to 20)

| # | Title | Core idea |
|---|---|---|
| 11 | Tokens | The pieces a model reads, and what you pay for |
| 12 | Transformers & Attention | Every token looks at every other token |
| 13 | Context Window | How much the model can see at once |
| 14 | Temperature & Sampling | How the next token gets picked |
| 15 | Pre-training vs Post-training | Read the internet, then learn to be an assistant |
| 16 | Reasoning Models | Think longer before answering |
| 17 | Hallucinations | Fluent isn't the same as true, and why |
| 18 | Multimodal Models | Text, images and audio in one model |
| 19 | Diffusion Models | Start from noise, and remove it step by step |
| 20 | Open-weight vs Closed Models | Download it, or rent it by API |

### Season 3: prompts and model APIs (21 to 30)

| # | Title | Core idea |
|---|---|---|
| 21 | Prompt Engineering | Role, task, examples and format |
| 22 | Few-shot Prompting | Show examples, and the model follows the pattern |
| 23 | Chain-of-Thought | Work it out step by step first |
| 24 | Context Engineering | Choosing exactly what goes into the window |
| 25 | Structured Outputs | JSON that matches your schema, every time |
| 26 | Tool Calling | The model asks, your code acts |
| 27 | Streaming | Tokens arrive as they are made |
| 28 | Prompt Caching | Reuse a repeated prefix: cheaper and faster |
| 29 | Batch APIs | Half price, if you can wait |
| 30 | LLM Gateways (LiteLLM, OpenRouter) | One API for every model, with fallbacks |

### Season 4: RAG in depth (31 to 40)

| # | Title | Core idea |
|---|---|---|
| 31 | Chunking | Cut documents into pieces you can search |
| 32 | pgvector | Vector search inside the Postgres you already run |
| 33 | Hybrid Search | Keywords (BM25) and meaning, merged |
| 34 | Reranking | A second, sharper pass over the top results |
| 35 | Document Parsing | PDFs, tables and scans into clean text |
| 36 | GraphRAG | Entities and links, for questions that span documents |
| 37 | Agentic RAG | The model decides what to search, and searches again |
| 38 | LlamaIndex | A framework for connecting your data to LLMs |
| 39 | Text-to-SQL | Questions into SQL, using your schema and metrics |
| 40 | Why RAG Fails | The places a RAG answer goes wrong |

### Season 5: agents in depth (41 to 50)

| # | Title | Core idea |
|---|---|---|
| 41 | Workflows vs Agents | Your code picks the steps, or the model does |
| 42 | The Agent Loop (ReAct) | Think, act, observe, repeat |
| 43 | Agent Memory | What it keeps in the window, and what it stores |
| 44 | Multi-agent Systems | An orchestrator handing work to sub-agents |
| 45 | Human-in-the-loop | A person approves before anything changes |
| 46 | Computer Use | Agents that see the screen and click |
| 47 | Coding Agents | Read, edit, test, repeat |
| 48 | Voice Agents | Speech to text, the model, text to speech, in under a second |
| 49 | Durable Agents (Temporal) | Long jobs that survive a crash and carry on |
| 50 | A2A Protocol | Agents from different vendors talking to each other |

### Season 6: the agent toolbox (51 to 60)

| # | Title | Core idea |
|---|---|---|
| 51 | LangChain | Building blocks for LLM apps |
| 52 | LangGraph | Agents as graphs with state, so you control each step |
| 53 | CrewAI | A team of agents, each with a role |
| 54 | OpenAI Agents SDK | Agents, handoffs and guardrails |
| 55 | Claude Agent SDK | The agent harness behind Claude Code, for your own agents |
| 56 | Agent Skills | Folders of instructions an agent loads only when it needs them |
| 57 | DSPy | Write the program, and let it optimize the prompts |
| 58 | Pydantic AI | Type-safe agents in Python |
| 59 | n8n | AI automations as visual workflows |
| 60 | Amazon Bedrock | Many models behind one AWS API |

### Season 7: evals and observability (61 to 70)

| # | Title | Core idea |
|---|---|---|
| 61 | Golden Datasets | Real questions with known good answers |
| 62 | LLM-as-a-Judge | A model grades another model's answers |
| 63 | RAG Evals (Ragas) | Was the right chunk found, and did the answer stick to it? |
| 64 | Agent Evals | Did it finish the task, and how did it get there? |
| 65 | Benchmarks | MMLU, SWE-bench, and why leaderboards mislead |
| 66 | Tracing (OpenTelemetry) | Every model and tool call as a span |
| 67 | LangSmith | Traces, datasets and evals in one place |
| 68 | Langfuse | Open-source tracing and evals you can host yourself |
| 69 | promptfoo | Prompt tests that run in CI |
| 70 | LLMOps | Version prompts, test every change, watch production |

### Season 8: safety and security (71 to 80)

| # | Title | Core idea |
|---|---|---|
| 71 | Guardrails | Check what goes in and what comes out |
| 72 | Prompt Injection | Instructions hidden in the data |
| 73 | Jailbreaks | Talking a model past its rules |
| 74 | PII & Data Leakage | Keep secrets out of prompts, logs and answers |
| 75 | Llama Guard | A small model that flags unsafe content |
| 76 | OWASP Top 10 for LLMs | The checklist security teams use |
| 77 | Least Privilege for Agents | Give each tool only the access it needs |
| 78 | Agent Sandboxes | A throwaway box for the code an agent runs |
| 79 | Red Teaming | Attack your own app before someone else does |
| 80 | The EU AI Act | Risk tiers, and what they mean for what you build |

### Season 9: training and customizing models (81 to 90)

| # | Title | Core idea |
|---|---|---|
| 81 | Prompting vs RAG vs Fine-tuning | Which one fits which problem |
| 82 | LoRA & QLoRA | Train a small add-on, not the whole model |
| 83 | RLHF | People rank answers, and the model learns what they prefer |
| 84 | DPO | Preference training without a reward model |
| 85 | RL for Reasoning (RLVR, GRPO) | Reward answers you can check: math, code, tests |
| 86 | Distillation | A big model teaches a small one |
| 87 | Synthetic Data | Models writing training data for models |
| 88 | Training Data Pipelines | Dedupe, filter and mix trillions of tokens: where data engineering meets AI |
| 89 | Small Language Models | Small, cheap and fast, tuned for one job |
| 90 | Hugging Face | The hub for open models, datasets and Transformers |

### Season 10: running models in production (91 to 100)

| # | Title | Core idea |
|---|---|---|
| 91 | GPUs & VRAM | Why AI runs on GPUs, and why memory is the limit |
| 92 | Prefill & Decode | Read the prompt in one go, then write one token at a time |
| 93 | KV Cache | Don't recompute what's already been read |
| 94 | Quantization | 16-bit to 4-bit: smaller, faster, nearly as good |
| 95 | Mixture of Experts | A huge model that uses only part of itself for each token |
| 96 | vLLM | Serve far more users per GPU |
| 97 | Ollama | Run open models on your laptop |
| 98 | Speculative Decoding | A small model drafts, the big one checks |
| 99 | LLM Cost & Latency | The levers: model size, caching, batching, routing |
| 100 | AI System Design | "Design a support bot": the interview answer, using the whole series |

### Reserve list

Speech-to-text (Whisper) · Voice cloning · Semantic caching · Google ADK · Microsoft Agent Framework · Azure AI Foundry · Vertex AI · Pinecone · Qdrant · Weaviate · Unsloth · Modal · Ray · MLflow · Feature stores · Scaling laws · Bias and fairness · Arize Phoenix · Braintrust · Vibe coding
