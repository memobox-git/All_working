# 5-day test (Oct 15-19, 2026)

Each day uses the format of one of the example posts Chris shared. The wording and topics are Chris's own.

| Day | Format (from Chris's examples) | Hook | Visual | Status |
|---|---|---|---|---|
| Thu Oct 15 | Tool map (Jean Lee, Python mind map: 377 on 69k) | Every AI system runs on a data stack most people never see. | `visuals/data-stack-for-ai.png` | FINAL, below |
| Fri Oct 16 | Step-by-step build (Chorouk Malmoum, Codex steps: 245 on 126k) | How to build a RAG pipeline on your own documents, step by step. | Step infographic | Next |
| Sat Oct 17 | Levels (Abhisek Sahu, SQL mastery: 1,435 on 179k) | Every data pipeline works on day 1. Day 90 is where you find out what you built. | `visuals/pipeline.gif` | FINAL in `week-1.md` |
| Sun Oct 18 | Roadmap (Aiswarya Venkitesh, Databricks roadmap: 616 on 77k) | Spark mastery roadmap, from first DataFrame to production | Roadmap image | Next |
| Mon Oct 19 | Usage gap (Uttam Gupta, "barely using Claude": 209) | Using AI only to write SQL is using a fraction of it. | Workflow image | Next |

Post at 8:30 AM ET. Upload the image with the post, and keep links out of the body.

---

## FINAL · Thu Oct 15 · The data engineering stack behind AI

Image: `visuals/data-stack-for-ai.png` (1080x1350). It shows 43 tools with their logos across 10 layers, the same list as the post.

```
Every AI system runs on a data stack most people never see.
This is that stack, layer by layer, with the tools teams use at each one. 👇

A model is only as good as what it's fed. Before any AI feature ships, someone has to get the data in, store it, clean it, schedule it, check it, and turn documents into something a model can search.

That someone is usually a data engineer.

1. Ingestion: pull data from apps, APIs and databases
→ Fivetran, Airbyte, Debezium, dlt

2. Streaming: move events as they happen
→ Kafka, Flink, Spark Streaming, Redpanda, Kinesis

3. Storage: cheap files, with real tables on top
→ Amazon S3, Iceberg, Delta Lake, Hudi, Parquet

4. Warehouses: where dashboards and analysts query
→ Snowflake, BigQuery, Databricks, Redshift, ClickHouse

5. Processing: clean, join and reshape data at any size
→ Spark, Polars, DuckDB, pandas, Trino

6. Transformation: turn raw tables into trusted models
→ dbt, SQLMesh, Dataform

7. Orchestration: run it all in order, on time
→ Airflow, Dagster, Prefect, Kestra

8. Quality and observability: catch bad data before anyone sees it
→ Great Expectations, Soda, Monte Carlo, OpenLineage

9. Catalog and governance: find data and control who sees it
→ Unity Catalog, DataHub, OpenMetadata

10. AI data layer: data a model can search and use
→ Unstructured, pgvector, Qdrant, Pinecone, Feast

Most teams run one or two tools per layer, not five. So when you read a job post, don't ask "do I know this tool?" Ask "which layer is this, and have I worked in it?"

AI engineers build on top of this stack. Data engineers build the stack.
```

---

## After each post

- Reply to every comment in the first hour.
- After 24 hours, send a screenshot of the post analytics (impressions, reactions, followers gained). It goes in this table.

| Day | Post | Impressions (24h) | Impressions (7d) | Reactions | Comments | Followers gained |
|---|---|---|---|---|---|---|
| Thu Oct 15 | Data stack behind AI | | | | | |
| Fri Oct 16 | RAG pipeline steps | | | | | |
| Sat Oct 17 | Day 1 vs Day 90 | | | | | |
| Sun Oct 18 | Spark roadmap | | | | | |
| Mon Oct 19 | AI beyond SQL | | | | | |

Benchmark for your follower tier (Shield): a typical post gets 1,216 impressions, and a top-10% post gets 9,052.

## Bank (built, not scheduled)

These visuals were made for the earlier plan. They're kept for later weeks:
- `titles.gif`: 0 "Data Engineer" titles at Databricks, Snowflake and Uber (text in `bank.md` #1).
- `pay.gif`: AI engineer vs data engineer pay (text in `week-1.md`, Tue).
- `join.gif`: why a join returns more rows than you started with.
- `rerun.gif`: what happens if your pipeline runs twice (text in `bank.md` #4).
- `newsletter-cover.png` and `newsletter-logo.png`: for "Across the Table" #1 (text in `week-1.md`, Sat).
- `apple-job-post.png`: the Apple job post decode (text in `week-1.md`, Fri). Before using it, change "this week" to the posting month.
