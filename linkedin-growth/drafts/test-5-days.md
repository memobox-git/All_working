# 5-day test (Oct 15-19, 2026)

Thursday is a rewrite of Jean Lee's post. Fri-Mon are rewrites of last month's best data and AI posts (see `rebrands-oct.md`). The ideas come from the originals; the wording is new.

| Day | Format (from Chris's examples) | Hook | Visual | Status |
|---|---|---|---|---|
| Thu Oct 15 | Rewrite of Jean Lee's Python mind map (377 on 69k) | Python runs almost every part of an AI system. | `visuals/python-for-ai-engineering.png` | FINAL, below |
| Fri Oct 16 | Rebrand of Sivasankar Natarajan's MCP explainer (1,623 on 26.7k) | Everyone's talking about MCP. | `visuals/mcp-explained.png` | FINAL in `rebrands-oct.md` |
| Sat Oct 17 | Rebrand of Alex Freberg's skills list (1,353, text-only) | In 2016, SQL and one ETL tool could get you a data engineering job. | Text-only | FINAL in `rebrands-oct.md` |
| Sun Oct 18 | Rebrand of Andreas Horn's "fix your data" (1,956) | Gartner predicted… 60% of AI projects… | Text-only | FINAL in `rebrands-oct.md` |
| Mon Oct 19 | Rebrand of Ajay Kadiyala's interview scenario (523, text-only) | "The dashboard says $4.2M. Finance says $3.9M." | Text-only | FINAL in `rebrands-oct.md` |

Post at 8:30 AM ET. Upload the image with the post, and keep links out of the body.

---

## FINAL · Thu Oct 15 · Python for AI engineering (rewrite of Jean Lee's post)

Image: `visuals/python-for-ai-engineering.png` (1080x1350). It shows the same 40 libraries as the post, with their logos.

```
Python runs almost every part of an AI system.
These are the 40 libraries that do the work, grouped by the job each one does. 👇

Building with AI isn't one skill. It's ten different jobs, and each job has its own short list.

1. Data handling
→ pandas: tables in memory
→ Polars: faster DataFrames
→ NumPy: arrays and math
→ DuckDB: SQL on files and DataFrames

2. Classic ML
→ scikit-learn: models, metrics, preprocessing
→ XGBoost: gradient boosting
→ LightGBM: fast boosting on big tables

3. Deep learning
→ PyTorch: train and run neural networks
→ TensorFlow: deep learning at production scale
→ Keras: a simpler API on top of them
→ JAX: fast math on GPUs and TPUs

4. LLMs
→ Transformers: load open models
→ PEFT: fine-tune with LoRA
→ vLLM: serve models fast
→ Sentence Transformers: embeddings

5. RAG and retrieval
→ LlamaIndex: connect documents to LLMs
→ LangChain: LLM building blocks
→ FAISS: fast vector search
→ Chroma: a simple vector database

6. Agents
→ LangGraph: stateful agent workflows
→ PydanticAI: typed agents
→ CrewAI: teams of agents
→ MCP SDK: expose tools to AI apps
→ Claude Agent SDK: agents built on Claude
→ OpenAI Agents SDK: agents built on OpenAI models

7. APIs and apps
→ FastAPI: serve it as an API
→ Pydantic: validate inputs and outputs
→ Streamlit: data apps in an afternoon
→ Gradio: quick model demos

8. Evaluation and tracing
→ Ragas: score RAG answers
→ DeepEval: unit tests for LLM output
→ Langfuse: trace every LLM call
→ MLflow: track experiments and runs

9. Pipelines and MLOps
→ Airflow: schedule pipelines
→ Dagster: pipelines built around data assets
→ DVC: version data and models
→ pytest: test your code

10. Scale
→ PySpark: big data processing
→ Ray: distribute Python and training
→ Dask: parallel pandas-style work

Nobody uses all 40. A real project touches a few rows at a time. Pick one problem, take one library from each row it needs, and ship it.

The list changes every year. Clean data has been at the top the whole time.
```

---

## After each post

- Reply to every comment in the first hour.
- After 24 hours, send a screenshot of the post analytics (impressions, reactions, followers gained). It goes in this table.

| Day | Post | Impressions (24h) | Impressions (7d) | Reactions | Comments | Followers gained |
|---|---|---|---|---|---|---|
| Thu Oct 15 | Python for AI engineering | | | | | |
| Fri Oct 16 | What is MCP | | | | | |
| Sat Oct 17 | Skills 2016 vs 2026 | | | | | |
| Sun Oct 18 | Fix the data first | | | | | |
| Mon Oct 19 | Dashboard vs finance | | | | | |

Benchmark for your follower tier (Shield): a typical post gets 1,216 impressions, and a top-10% post gets 9,052.

## Bank (built, not scheduled)

These visuals were made for the earlier plan. They're kept for later weeks:
- `data-stack-for-ai.png`: the data engineering stack behind AI, 43 tools in 10 layers. Its text was in the first version of this file (commit 771ca02).
- `titles.gif`: 0 "Data Engineer" titles at Databricks, Snowflake and Uber (text in `bank.md` #1).
- `pay.gif`: AI engineer vs data engineer pay (text in `week-1.md`, Tue).
- `join.gif`: why a join returns more rows than you started with.
- `rerun.gif`: what happens if your pipeline runs twice (text in `bank.md` #4).
- `newsletter-cover.png` and `newsletter-logo.png`: for "Across the Table" #1 (text in `week-1.md`, Sat).
- `apple-job-post.png`: the Apple job post decode (text in `week-1.md`, Fri). Before using it, change "this week" to the posting month.
