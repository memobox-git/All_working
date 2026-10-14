# Rebrands: last month's winners, rewritten for Chris (Oct 16-20)

How these were picked: the 114 data and AI posts from Sep 14 to Oct 14, 2026 with 100+ reactions in `data/verified-posts.csv`. I kept the ones that teach something and don't depend on the author's own life story, so they can be rewritten honestly. Each one keeps the idea and is rewritten in new words, with a data engineering angle the original didn't have. Original posts are linked so you can compare.

| Day | Rewritten post | Source post | Its reactions | Reactions per 1k followers |
|---|---|---|---|---|
| Fri Oct 16 | What is MCP, for data engineers | [Sivasankar Natarajan, "What is MCP?"](https://www.linkedin.com/feed/update/urn:li:activity:7506570451591192576) | 1,623 on 26.7k followers | **60.7**, the best ratio of the month |
| Sat Oct 17 | Data engineer skills, 2016 vs 2026 | [Alex Freberg, "SQL and excel were what you needed… 2015"](https://www.linkedin.com/posts/alex-freberg_sql-and-excel-were-what-you-needed-to-land-activity-7511853897884540928-Kk6T) | 1,353, text-only | 2.9 |
| Sun Oct 18 | Fix the data before the AI | [Andreas Horn, "…It is fixing your data."](https://www.linkedin.com/posts/andreashorn1_the-best-thing-you-can-do-for-your-ai-strategy-activity-7515290062301839360-EPiX) | 1,956 | 7.6 (his typical post: 262) |
| Tue Oct 20 | Dashboard vs finance interview question | [Ajay Kadiyala, "The BI dashboard doesn't match finance's numbers"](https://www.linkedin.com/posts/ajay026_dataengineering-azure-spark-activity-7515618390305333248-pF_z) | 523, text-only | 2.8 (his series runs 500-800) |

Post at 8:30 AM ET. Only Friday has an image. The other three were text-only or near text-only in the original too.

---

## Fri Oct 16 · What is MCP

Image: `visuals/mcp-explained.png`

Facts checked: MCP servers exist for Snowflake (Snowflake Labs), BigQuery (Google's MCP Toolbox for Databases), Postgres and dbt (dbt Labs). ChatGPT, Cursor and VS Code all support MCP.

```
Everyone's talking about MCP.
Most explanations skip the part data engineers should care about. 👇

MCP (Model Context Protocol) is an open standard that connects AI apps to the systems they need: databases, files, GitHub, Slack, your warehouse.

Before MCP
→ every AI app needed its own custom connector for every system
→ 3 apps and 5 systems meant 15 integrations to build and maintain

With MCP
→ each system needs one MCP server
→ any app that speaks MCP can use it: Claude, ChatGPT, Cursor, VS Code and more

It has three parts
→ Host: the app you type into
→ Client: the piece inside the host that speaks MCP
→ Server: a small program that exposes a system's tools and data

Ask "how many orders failed yesterday?" The model sees that the database server offers a query tool, calls it, gets the rows back, and answers in plain English.

Now the part for data engineers.

Snowflake, BigQuery, Postgres and dbt all have MCP servers. The AI tools your company adopts will end up querying your warehouse. Someone has to decide:
→ which schemas the AI can see
→ read-only or write
→ row limits and timeouts, so one question can't scan the whole warehouse
→ logging, so you can see every query it ran

That someone is usually the data team.

MCP made connecting AI to data easy. Making it safe is still a data engineering job.
```

---

## Sat Oct 17 · Skills, 2016 vs 2026

Text-only. The Apple fact is from `source-facts.md`: Apple Ads data engineer role, posted Oct 12, 2026, which lists hands-on LLM use as a minimum qualification.

```
In 2016, SQL and one ETL tool could get you a data engineering job.
The 2026 list is longer. 👇

1. SQL
→ still in almost every data engineering interview. Joins, window functions, dedupe.

2. Python
→ pipelines, API pulls, and the glue between systems

3. One cloud warehouse or lakehouse
→ Snowflake, BigQuery or Databricks. Go deep on one.

4. Spark
→ for the tables that don't fit on one machine

5. Orchestration
→ Airflow or Dagster, with retries and alerts

6. Data modeling
→ grain, facts and dimensions. This is where senior engineers stand out.

7. AI in your daily work
→ using LLMs to write and review code, and checking what they produce. An Apple data engineer job posted this month lists it as a minimum qualification.

You don't need all seven at once. Go in that order, one skill per project.

SQL was enough in 2016. In 2026, it's where you start.
```

---

## Sun Oct 18 · Fix the data before the AI

Text-only. Source for both numbers: [Gartner press release, Feb 26, 2025, "Lack of AI-Ready Data Puts AI Projects at Risk"](https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk). The 60% figure is a forecast, so the post says "predicted".

```
Gartner predicted that through 2026, companies would abandon 60% of AI projects that don't have AI-ready data behind them.
The model was never the hard part. 👇

In the same research, 63% of organizations said they don't have, or aren't sure they have, the right data practices for AI.

AI doesn't fix messy data. It repeats it, faster and with more confidence.

A bad number on a dashboard gets questioned in a meeting. A bad number in an AI agent sends the email, updates the forecast and moves on.

So before the agent comes the boring work:

→ One definition per metric. If sales and finance calculate revenue differently, the AI will pick one, and you won't know which.
→ An owner for every important table. When it breaks, someone's name is on it.
→ Quality checks before the load, not after: duplicates, nulls, freshness.
→ Documentation the AI can read: what each table is for and what each column means.
→ Access rules: what the AI can see, and what it never should.

None of this shows up in a demo. All of it shows up in production.

Every AI strategy is a data strategy first.
```

---

## Tue Oct 20 · "The dashboard doesn't match finance"

Text-only. The dollar figures are a made-up example inside the question, not a real case.

```
"The dashboard says revenue was $4.2M last month. Finance says $3.9M. Where do you start?"

The tempting answer is to open the dashboard query. The better answer works backwards through the pipeline, because a dashboard can only show what the tables under it let through. 👇

Check in this order:

1. Same definition?
→ Finance may count revenue when it's recognized. The dashboard may count it when the order is placed. Ask before you debug.

2. Duplicates
→ a retried load wrote some transactions twice. Count rows per transaction ID.

3. Currency
→ two sources, one in USD and one in EUR, summed in the same column.

4. Time zones
→ the dashboard's month ends at midnight UTC. Finance's ends at midnight in New York.

5. Joins
→ a join to a table with several rows per order quietly multiplies revenue.

6. Late data
→ refunds that landed after the dashboard refreshed.

Then fix it where it started, add a check so it can't happen silently again, and tell finance which number is right and why.

That last step matters as much as the fix.

Interviewers ask this to see whether you debug the query or the pipeline.
```

---

## Next in line (not written yet)

- [Zach Wilson, "Senior data engineers at Netflix can make $500k per year"](https://www.linkedin.com/posts/eczachly_senior-data-engineers-at-netflix-can-make-activity-7515891756492742656-UCZZ): 318 reactions, about 2.5x his typical post. Rewrite it as what each round of a senior data engineering loop checks, using a verified Levels.fyi number in the hook.
