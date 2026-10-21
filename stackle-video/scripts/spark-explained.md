# Apache Spark, Explained in 2 Minutes: Script

**Title:** Apache Spark, Explained in 2 Minutes

**Series:** Explained in 2 Minutes, episode 04

**Spoken words:** 262 · **Voice:** 1:32 · **Video:** 1:55 (opening card, the problem as the hook, channel intro, the rest of the episode, comment ask)

**Format:** the same as Kafka:
- both cuts (landscape for YouTube with an `.srt`, portrait for TikTok, Reels and Shorts with captions burned in);
- the "Crispus Roshan" voice, with `[confident]`, then `[warmly]` for the last part;
- **no background music**;
- the hook first, then your intro (now ending on "…get you hired.");
- each cut opening on its thumbnail.

**Status:** approved, recorded (take 1 of 4; "YARN" is said as a word) and built. Both cuts are in `stackle-video/graphics/` (`spark-explained.mp4` with `.srt`, `spark-explained-vertical.mp4`). The opening cards are temporary until Chris's thumbnails arrive. The post copy is in `spark-explained-posts.md`.

---

## Script

> [confident] Your laptop opens a file of a million orders in a second. Now open every order your company has ever taken: two terabytes. It doesn't fit in memory, and one machine would take all night. So a lot of teams split the work across many machines, with Apache Spark.
>
> *(your intro: "Hi, I'm Chris … the skills that actually get you hired.")*
>
> Spark is an open-source engine for processing large amounts of data across many machines. You write Python or SQL, and Scala, Java and R work too. It started at UC Berkeley in 2009, was open-sourced in 2010, and became a top-level Apache project in 2014.
>
> Here's the core idea. Spark cuts your data into partitions. You write steps on a DataFrame, which works like a table: filter, group, sum. But Spark doesn't run them one by one. It writes a plan, and runs it only when you ask for a result, like saving the output. Then one task per partition runs, all at the same time.
>
> Now, the architecture. The driver runs your code, and turns the plan into tasks. The cluster manager, like Kubernetes or YARN, gives the driver executors on worker machines. Executors run the tasks, and keep data in memory, so it's fast. And if one executor dies? The driver re-runs just its tasks on another one, rebuilding the lost pieces from the plan. Then the results land in storage.
>
> [warmly] So when a team says, "we use Spark," it means their data is too big for one machine. They write the steps once. Spark splits them into tasks across a cluster, and re-runs any piece that fails. That's Apache Spark.
>
> *(the shared ending: "So, what should I explain next? Tell me in the comments below …")*

## What is on screen

| Part | Words | Picture |
|---|---|---|
| Opening card | (silent) | Your Spark thumbnail (16:9 and 9:16). A temporary design until yours arrives |
| The problem | "Your laptop opens a file …" | A laptop opens `orders.csv` (1M rows) at once. The file swaps to `all_orders/` (2 TB). A memory bar fills red, the progress bar crawls, and a clock spins to "all night". On "many machines", the file cuts into slices that fly out to a row of machines |
| Channel intro | "Hi, I'm Chris …" | Your Stackle intro (11.7 s), straight after the hook |
| What it is | "Spark is an open-source engine …" | Spark logo and wordmark. The definition word by word, with "across many machines" highlighted. Language chips: Python, SQL, Scala, Java, R. Timeline: 2009 UC Berkeley · 2010 open source · 2014 top-level Apache project |
| The core idea | "Spark cuts your data into partitions …" | A table splits into eight coloured partitions. `daily_sales.py` (below) types in, and each line adds a dashed box to a plan. Nothing runs. On "saving the output" (`.write`), the plan turns solid and all eight partitions light up at once, one task each |
| Architecture | "The driver runs your code …" | A driver card (your code and the plan) breaks the plan into task chips. A cluster manager card (Kubernetes · YARN · standalone) hands out executors on three worker cards, each with a memory chip. Tasks fly to the executors. One executor turns red, its two tasks go grey, and they re-run on another executor. The results land in an S3 bucket |
| In short | "So when a team says …" | "We use Spark." Takeaways: too big for one machine · split into tasks · re-run what fails. Then the closing title |
| Comment ask | "So, what should I explain next? …" | The shared comment box |

**Code on screen** (`daily_sales.py`, PySpark):

```python
orders = spark.read.parquet("s3://shop/orders/")
daily = (orders
    .filter(orders.status == "paid")
    .groupBy("order_date")
    .sum("amount"))
daily.write.parquet("s3://shop/daily_sales/")
```

## Facts to check before recording

All checked. The sources are in `series-roadmap.md` (episode 04).

| Claim | Source |
|---|---|
| Spark started as a research project at UC Berkeley in 2009 and was open-sourced in early 2010. The voice says "UC Berkeley", not "AMPLab", because the AMPLab itself launched in 2011 | [Spark, "History"](https://spark.apache.org/history.html); [AMPLab, "About"](https://amplab.cs.berkeley.edu/about/) |
| Spark became a top-level Apache project on 27 February 2014 | [ASF press release](https://blogsarchive.apache.org/foundation/entry/the_apache_software_foundation_announces50) |
| Python, SQL, Scala, Java and R | [spark.apache.org](https://spark.apache.org/) |
| The driver runs your program. Cluster managers: standalone, YARN, Kubernetes. Executors run tasks and keep data in memory or on disk | [Cluster mode overview](https://spark.apache.org/docs/latest/cluster-overview.html) |
| One task per partition. Transformations are lazy and run only when an action needs a result. A lost partition is recomputed from the steps that created it | [RDD programming guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html) |
| The code on screen runs as written | Ran on 21 October 2026 in Spark 4.0.1 (local mode, Java 21) with local paths in place of `s3://`: it keeps the paid orders and writes one row per day, in a column named `sum(amount)` |

**Kept simple on purpose:**
- Stages and the shuffle are left for episodes 23 and 88, so the driver simply "turns the plan into tasks".
- Spark also runs on one machine (local mode), but the episode shows only a cluster.
- Reading a Parquet file can start a small job to read its schema. The steps after it are lazy, which is what the voice says.
- When an executor is lost, Spark may also re-run earlier work whose shuffle files were on it. "Rebuilding the lost pieces from the plan" covers both.

**A pronunciation to watch:** "YARN" should be said as the word, not spelled out. If the takes spell it, it goes after Kubernetes so it's easy to cut.
