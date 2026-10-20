# Explained in 2 Minutes: series roadmap

**Series:** Explained in 2 Minutes, by Stackle. Presented by Chris (Crispus Roshan): 10+ years in data engineering, 200+ engineers interviewed. It is the short companion to the long-form "Explained for Data Engineers" show.

**Status on 20 October 2026:** 00 (the trailer), 01 Apache Airflow and 02 Apache Kafka are made, in both cuts. 00 and 02 open on temporary cards until your thumbnails arrive. 03 to 06 are planned in detail below. 07 onwards are not started.

**Approval:** every script is sent to you for approval before anything is recorded.

---

## The series

Each episode explains one data-engineering tool or idea in about two minutes. Every episode has the same shape, so viewers know what they will get, and each new episode is quicker to make than the last.

### Format

| | |
|---|---|
| Length | About 1:30 to 2:00. The five main parts take about 1:35 (240 to 260 spoken words). The channel intro and the closing ask add about 15 seconds |
| Voice | Chris's cloned voice ("Crispus Roshan" on ElevenLabs, `eleven_v4`), with one delivery tag per episode, such as `[calm]` or `[confident]`, and `[warmly]` for the last part |
| Picture | Motion graphics on a white background, each picture timed to the word that names it. An original 120 BPM beat under the voice. No sound effects |
| Cuts | Landscape 1920×1080 for YouTube, with an `.srt` caption file. Portrait 1080×1920 for TikTok, Instagram Reels and YouTube Shorts, with word-by-word captions burned in |
| Opening | Each cut opens on its own thumbnail card. Then Chris's channel intro (about 12 seconds): "Hi, I'm Chris… Let's get into it." |
| Closing | "That's X.", then the voiced ask: "What should I explain next? Tell me in the comments below." Then the closing title |

### The fixed structure

| Part | Its job | About | In the Kafka episode |
|---|---|---|---|
| Opening card | Your thumbnail, with the beat already playing | 2 s | The Kafka thumbnail |
| Channel intro | "Hi, I'm Chris… Let's get into it." The same in every episode | 12 s | |
| The problem | A concrete, everyday hook that makes the tool necessary | 45 words | One tap on "Order" that three services need, and the tangle of service-to-service wiring |
| What it is | A one-line definition, the jargon word explained, and where it came from, with dates | 40 words | "An open-source platform for streaming events". LinkedIn, then a top-level Apache project in 2012 |
| The core idea | The one concept you must understand | 50 words | The log: a topic, new events on the end, consumers reading at their own offset |
| Architecture | The components drawn one at a time, with one failure or scaling moment | 85 words | Brokers, partitions and replicas. One broker fails and a replica takes over |
| In short | "So when a team says 'we use X', it means …", three takeaways, then "That's X." | 35 words | Publish once · anyone can read · as it happens |
| The ask | "What should I explain next? Tell me in the comments below." | 4 s | |
| Closing title | Series name and episode number | 2 s | |

The five main parts add up to about 255 words. For an idea rather than a tool (such as 04 or 07), the "In short" line adapts: "So when a job post says 'data engineer', it means …".

### How an episode is made

1. **Research.** Every date and claim gets a source (official docs or the project's own pages) in a "Facts to check" table.
2. **Script.** 240 to 260 words in the five parts, with delivery tags. It goes to you for approval. Nothing is recorded before you approve it.
3. **Voice.** Four takes in the "Crispus Roshan" voice. The best take is saved as `audio/vo.mp3`.
4. **Word timings.** A transcript with a start and end time for every word (`audio/vo.transcript.json`). The picture cues, the music hits and the captions all follow these timings.
5. **Motion graphics.** White-background HTML scenes for the episode, built on the shared kit in `stackle-video/source/explained/`. Each picture appears on the word that names it. The beat is generated from the same timings, so it drops on the title and marks each chapter.
6. **Two cuts.** The landscape cut (plus `.srt`) and the portrait cut (captions burned in). Each opens on its thumbnail.
7. **Post copy.** Titles, description with chapters, tags and the pinned comment, as in `airflow-explained-posts.md`.

---

## Publishing plan

### Cadence

- **Two episodes a week, on Tuesday and Friday.** That means two scripts approved, two voices recorded and four renders (two cuts each) every week. It is realistic once the first few episodes have settled the kit.
- **Both cuts go out the same day.** The landscape cut on YouTube, the portrait cut on TikTok, Instagram Reels and YouTube Shorts.
- **Time:** about 8:30 AM US Eastern, which is early evening in India (18:00 IST in US summer time, 19:00 IST in winter). After a month, check YouTube Studio for when your viewers are online, and move it if needed.
- **Keep two finished episodes in reserve.** Start publishing only when there are two finished episodes beyond the week's own. If the reserve runs out, publish one episode that week rather than rush one.
- **A season is 10 episodes, so 5 weeks.** After each season, take one break week: no new explainer. Optionally, publish the season as one compilation on YouTube (the episodes back to back, with one intro: about 15 minutes), and use the week to catch up.
- **Total:** 50 publishing weeks plus 9 break weeks, so about 14 months. For example, if week 1 starts on Tuesday 10 November 2026, Season 1 ends on Friday 11 December 2026, and episode 99 lands around the end of 2027, plus any holiday weeks you take.

### Seasons

Each season tells one story, so a viewer who finds one episode has a reason to watch the next.

| Season | Episodes | Theme | The story |
|---|---|---|---|
| 1 | 00–09 | The modern data stack basics | The names you hear in your first week on a data team, and how they fit into one picture |
| 2 | 10–19 | Storage and table formats | Where the data actually sits: lakes, files and formats, and how table formats turn files into tables |
| 3 | 20–29 | Processing | How big data gets crunched: from Hadoop to what makes Spark slow (shuffles, skew, joins), then the single-machine tools that took some of that work back |
| 4 | 30–39 | Running pipelines | Getting data in (Fivetran, Airbyte, Data Factory), the other orchestrators, the two habits that make re-runs safe, and the infrastructure underneath |
| 5 | 40–49 | Cloud warehouses and query engines | The other big engines after Snowflake and Databricks, then the features that decide speed and cost |
| 6 | 50–59 | Streaming and change data capture | From the nightly batch to real time: incremental loads, CDC, the Kafka tools around it, and stream processing |
| 7 | 60–69 | Data modelling | How to shape tables people can use: from normalization to star schemas, history, and one definition of each metric |
| 8 | 70–79 | Quality, governance and catalogs | Can you trust this table? Tests, monitoring, contracts, lineage, catalogs, access and ownership |
| 9 | 80–89 | Interview essentials | The concepts interviewers ask about most, ending with how to answer a pipeline design question. Chris's 200+ interviews give this season its angle |
| 10 | 90–99 | AI and data | What a data engineer needs to feed and run AI systems: embeddings, vector databases, RAG, ML tools, MCP and agents. Episode 99 is the 100th video |

### Season 1, week by week

The trailer and Airflow go out together, so anyone who watches the trailer has an episode to click straight away.

| Week | Tuesday | Friday | Where it stands |
|---|---|---|---|
| 1 | 00 Trailer and 01 Apache Airflow | 02 Apache Kafka | All three made. 00 and 02 wait for their thumbnails |
| 2 | 03 Apache Spark | 04 What is data engineering | Planned in detail below |
| 3 | 05 Snowflake | 06 Databricks | Planned in detail below |
| 4 | 07 ETL vs ELT | 08 dbt | To plan |
| 5 | 09 The modern data stack | (none) | To plan |
| 6 | Break week: optional Season 1 compilation | | |

With the reserve rule, week 1 starts once 00, 01, 02, 03 and 04 are finished.

### When the plan changes

- Episodes 00 to 06 stay in the order you set.
- Inside a season, episodes can swap places, except the season's first and last.
- The closing ask will bring requests. When a topic is asked for often, pull it forward from a later season, or swap it in from the reserve list for an episode not yet made.
- An episode's number is fixed once it is published. Numbers of unmade episodes can move.
- Each post names the next episode, and the YouTube end screen links to it.

---

## The 100 episodes

**Numbering:** 00 to 99. 00 is the trailer and 01 to 99 are the explainers, so the series is 100 videos. The first digit plus one is the season: Season 1 is 00 to 09, Season 2 is 10 to 19, and so on.

**Titles** follow "X, Explained in 2 Minutes". Upload titles can add a hint in brackets, as the Airflow post copy does ("Apache Airflow Explained in 2 Minutes (DAGs + Architecture)").

The "Core idea" and "Picture" columns are starting points. Each episode's facts are checked when its script is written.

### Season 1: the modern data stack basics (00–09)

The first-week vocabulary of a data team, ending with one picture that joins it all up.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 00 | Explained in 2 Minutes: The Series (Trailer) | One tool or idea, two minutes, the same five parts every time | "One data tool. Two minutes. No fluff.", Chris's intro, what every episode does (what it is · why teams use it · how it works), a mini architecture drawn step by step, the first six episodes, a 10×10 grid filling to 100, and the comment ask. 54 seconds. **Made** (`source/series/`) |
| 01 | Apache Airflow, Explained in 2 Minutes | The DAG: tasks and the order they run in | DAG processor → metadata database ⇄ scheduler → executor → workers, with the web UI on top. A failed task retried with one click. **Made** |
| 02 | Apache Kafka, Explained in 2 Minutes | The log: a topic that producers append to and consumers read at their own offset | Brokers holding partitions and replicas. A broker fails and a replica takes over. A consumer group splits the partitions. KRaft controllers on top. **Made** |
| 03 | Apache Spark, Explained in 2 Minutes | The data is cut into partitions, and a lazy plan runs one task per partition, in parallel | Driver → cluster manager → executors on worker machines. An executor dies and its tasks re-run elsewhere. Planned below |
| 04 | What Is Data Engineering? Explained in 2 Minutes | The lifecycle: generate → ingest → store → transform → serve | The whole map from sources to dashboards, with orchestration on top. A renamed column caught by a test. Planned below |
| 05 | Snowflake, Explained in 2 Minutes | Storage and compute are separate | Storage (micro-partitions), virtual warehouses and cloud services. The 9 AM rush scales out, then idle compute suspends. Planned below |
| 06 | Databricks, Explained in 2 Minutes | The lakehouse: one copy of the data, as open files with a transaction log, and warehouse features on top | Your cloud storage, the compute plane, the control plane and Unity Catalog. A crashed write never shows half a table. Planned below |
| 07 | ETL vs ELT, Explained in 2 Minutes | Where the transform happens: before loading, or inside the warehouse | Two conveyor belts. ETL: extract → transform server → load. ELT: extract → load raw → transform inside the warehouse. Cheap storage and elastic compute flip the order |
| 08 | dbt, Explained in 2 Minutes | Each transformation is a SQL `SELECT` file (a model), and `ref()` links the models into a graph | `models/` folder → dbt compiles the SQL → runs it in the warehouse → tables. The lineage graph builds from the refs. A test fails on a duplicate key |
| 09 | The Modern Data Stack, Explained in 2 Minutes | A separate managed tool for each job, joined around a cloud warehouse | The Season 1 map: sources → Fivetran or Airbyte → Snowflake or Databricks → dbt → dashboards, with Airflow on top and Kafka for real time. Each box carries its episode number |

### Season 2: storage and table formats (10–19)

Where the data lives, from a folder of files to a table many engines can share.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 10 | Data Warehouse vs Data Lake vs Lakehouse, Explained in 2 Minutes | A warehouse checks the shape of data on the way in. A lake stores raw files and decides later. A lakehouse adds tables on top of the lake | Three buildings: a tidy warehouse, a lake of raw files, and the lake with a table layer on top. The same question asked of each |
| 11 | Amazon S3, Explained in 2 Minutes | Object storage: files (objects) in buckets, found by key. Folders are just name prefixes | A bucket with keys like `orders/2026/10/20/part-0.parquet`. The folder view turns out to be a prefix. Copies spread across data centres. Storage classes as shelves, from hot to cold |
| 12 | Row vs Column Storage, Explained in 2 Minutes | Store values column by column, so analytics reads only the columns it needs, and repeated values compress well | The same table laid out by row and by column. `SUM(amount)` reads one column in the column layout, and every row in the row layout |
| 13 | Apache Parquet, Explained in 2 Minutes | A columnar file with row groups, column chunks and a footer of statistics that lets readers skip data | A Parquet file opened up: row groups → column chunks → pages, with min/max values in the footer. A query skips two of three row groups |
| 14 | Apache Avro, Explained in 2 Minutes | A row-based format that carries its schema with the data, built for schemas that change | The file header with the schema, then compact binary rows. Writer schema vs reader schema. A new field with a default, read by old and new code |
| 15 | Partitioning, Explained in 2 Minutes | Split a table into folders by a column, so queries open only the folders they need | A table cut into `date=` folders. `WHERE date = '2026-10-20'` opens one. Then a table partitioned by user ID: millions of tiny folders |
| 16 | Apache Iceberg, Explained in 2 Minutes | A table is a tree of metadata (snapshots and manifests) over data files, so every engine agrees on what the table holds | Catalog → metadata file → manifest list → manifests → Parquet files. Each commit adds a snapshot. Time travel to yesterday. Spark, Trino and Snowflake reading the same table |
| 17 | Delta Lake, Explained in 2 Minutes | Numbered commits in `_delta_log` turn a folder of Parquet files into a table with ACID transactions | Data files plus JSON commits 0, 1, 2 and so on. Two writers collide and one retries. Time travel to version 3. A checkpoint file every few commits. Goes deeper than episode 06 |
| 18 | Schema Evolution, Explained in 2 Minutes | Changing a table's columns without breaking the people who read it | A table gains a column, and old files read it as null. Adding is safe. Renaming and changing types can break readers. Safe and breaking changes on two lists |
| 19 | The Small Files Problem, Explained in 2 Minutes | Thousands of tiny files slow every query. Compaction rewrites them into a few large ones | A streaming job drops a file every minute. A query opens each one, slowly. Compaction merges them, and the same query runs fast |

### Season 3: processing (20–29)

How processing grew from Hadoop to Spark, what makes it slow, and when one machine is enough.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 20 | Apache Hadoop, Explained in 2 Minutes | Spread files across many ordinary machines (HDFS) and send the code to the data (MapReduce) | HDFS: a file cut into blocks, each copied to three machines, with the NameNode holding the map. MapReduce: map → shuffle → reduce. A machine dies and a copy takes over. YARN hands out resources |
| 21 | Apache Hive, Explained in 2 Minutes | SQL on files, with a metastore that records where each table's files live | A SQL query → Hive → jobs on the cluster. The Hive Metastore as a phone book: table → columns → location. Spark and Trino still reading the same metastore |
| 22 | The Shuffle, Explained in 2 Minutes | Moving rows between machines so that rows with the same key end up together | Four executors, each holding mixed keys. A group-by sends all rows for each key to one place. Arrows cross the network, and a stage line is drawn where the shuffle happens |
| 23 | Data Skew, Explained in 2 Minutes | One key has far more rows than the rest, so one task runs long after the others finish | 200 task bars. 199 finish, and one keeps growing (`customer_id = null`). Salting splits the big key into ten smaller ones |
| 24 | Broadcast Joins, Explained in 2 Minutes | Copy the small table to every machine, so the big table never has to move | A huge `orders` table and a tiny `countries` table. A shuffle join moves both. A broadcast join copies `countries` to every executor, and the shuffle arrows disappear |
| 25 | pandas, Explained in 2 Minutes | A DataFrame: a table held in memory on one machine | A table in RAM with an index and typed columns. A 50 GB file hits the memory limit. Signposts to Polars, DuckDB and Spark |
| 26 | Polars, Explained in 2 Minutes | A DataFrame library that uses every CPU core and plans the whole query before running it | The same query in pandas (one core busy) and in Polars (all cores busy). Lazy mode: the plan pushes the filter down into the file read |
| 27 | DuckDB, Explained in 2 Minutes | An analytics database that runs inside your program, with no server | A Python process with DuckDB inside it. SQL straight on Parquet files in S3. Columns processed in batches |
| 28 | Apache Arrow, Explained in 2 Minutes | One shared in-memory column format, so tools hand data to each other without converting it | pandas, Polars, DuckDB and Spark around one Arrow buffer. Without Arrow, every hand-off converts and copies |
| 29 | AWS Glue, Explained in 2 Minutes | Serverless Spark jobs, plus a Data Catalog that describes your tables in S3 | A crawler scans S3 and fills the Glue Data Catalog. A Glue job starts, runs Spark and shuts down. Athena reads the same catalog |

### Season 4: running pipelines (30–39)

How data gets in, what else can run it besides Airflow, and the habits and infrastructure that keep it safe.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 30 | Fivetran, Explained in 2 Minutes | Managed connectors that copy data from your apps and databases into the warehouse, and keep it in sync | Salesforce, Postgres and Stripe → connectors → warehouse tables. After the first load, only changes sync. A new source column appears in the table on its own |
| 31 | Airbyte, Explained in 2 Minutes | Open-source connectors: a source, a destination and a scheduled sync between them | Source connector → Airbyte → destination connector. A catalogue of connectors. Self-hosted or Airbyte Cloud |
| 32 | Azure Data Factory, Explained in 2 Minutes | Pipelines of activities (copy data, run a notebook), started by triggers | Linked services → datasets → a pipeline with Copy and Databricks activities. The integration runtime does the work. A schedule trigger fires, and a failed activity sends an alert |
| 33 | Dagster, Explained in 2 Minutes | Assets, not tasks: you declare the tables you want and how each one is built | Asset graph `raw_orders` → `orders` → `daily_sales`. One asset is materialized. An asset check fails. Side by side with Airflow's task DAG |
| 34 | Prefect, Explained in 2 Minutes | Plain Python functions become flows and tasks, with retries and run history | A script with `@flow` and `@task`. Prefect records each run. A worker picks runs from a work pool. A task retries three times, then succeeds |
| 35 | Idempotency, Explained in 2 Minutes | Running a job twice gives the same result as running it once | A load fails halfway and is retried. Append-only doubles the rows. Overwrite-by-date or `MERGE` on a key keeps one copy |
| 36 | Backfills, Explained in 2 Minutes | Re-running a pipeline for past dates, safely and in parallel | A calendar of daily runs. A bug is fixed in March. January to March re-run, each run replacing only its own date |
| 37 | Docker, Explained in 2 Minutes | A container packs your code with everything it needs, so it runs the same everywhere | Dockerfile → image → container. "Works on my machine" vs the same image on a laptop, in CI and on a cluster |
| 38 | Kubernetes for Data, Explained in 2 Minutes | A scheduler that runs containers as pods across machines, and replaces them when they fail | The control plane and nodes. Airflow tasks and Spark executors as pods. A node dies and its pods restart elsewhere |
| 39 | Terraform, Explained in 2 Minutes | Infrastructure as code: describe buckets, warehouses and permissions in files, review the plan, then apply it | A `.tf` file → `terraform plan` (the diff) → `apply` → an S3 bucket, a Snowflake warehouse and a role. The state file. The same code for dev and prod |

### Season 5: cloud warehouses and query engines (40–49)

The other engines teams run SQL on, and the features that decide how fast it runs and what it costs.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 40 | Google BigQuery, Explained in 2 Minutes | Serverless: you send SQL, and Google brings compute (slots) to separately stored data | A query fans out into a tree of slots that read columnar storage over Google's network. On-demand pricing (per byte scanned) vs capacity pricing (reserved slots) |
| 41 | Amazon Redshift, Explained in 2 Minutes | Massively parallel processing: a leader node plans the query, and compute nodes each work on their share | Leader node → compute nodes split into slices. Distribution styles: KEY, ALL, EVEN. Managed storage. Redshift Serverless as the no-cluster option |
| 42 | Microsoft Fabric, Explained in 2 Minutes | One software-as-a-service platform with one copy of the data in OneLake, used by many engines | OneLake at the bottom, holding Delta tables. Data Factory, Spark, Warehouse, Real-Time Intelligence and Power BI on top. Shortcuts to data in other clouds |
| 43 | Trino, Explained in 2 Minutes | Query data where it lives, through connectors, without loading it first | Coordinator → workers. Connectors to Iceberg on S3, Postgres and Kafka. One query joins a lake table with a database table. A note on Presto, where Trino came from |
| 44 | Amazon Athena, Explained in 2 Minutes | Serverless SQL over files in S3. You pay for the data each query scans | Query → Athena → Glue Data Catalog → S3. The same query on CSV and on partitioned Parquet: less data scanned, a smaller bill |
| 45 | ClickHouse, Explained in 2 Minutes | A columnar database built for fast analytics on fresh data, using MergeTree tables | Inserts land as parts, and background merges combine them. A sparse primary index skips blocks. A dashboard querying billions of rows |
| 46 | Clustering, Explained in 2 Minutes | Sort data inside a table so similar values sit together and queries skip whole blocks | Blocks before and after clustering by date: overlapping min/max ranges, then clean ones. Pruning skips most blocks |
| 47 | Materialized Views, Explained in 2 Minutes | A stored query result that the database keeps up to date | A view (runs every time) vs a materialized view (stored result). A dashboard reads the stored result. New rows arrive and it refreshes |
| 48 | Query Plans, Explained in 2 Minutes | `EXPLAIN` shows how the engine will run your SQL: the scans, joins and aggregations, in order | A query turns into a tree: scan → filter → join → aggregate. The expensive step turns red. The fix: filter before the join |
| 49 | Cloud Warehouse Costs, Explained in 2 Minutes | You pay for storage and for compute, and compute is often the bigger part | Two meters: storage per TB per month, and compute by time or by data scanned. A warehouse left running all weekend. Auto-suspend, right-sizing and pruning |

### Season 6: streaming and change data capture (50–59)

From the nightly batch to events processed as they happen.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 50 | Batch vs Streaming, Explained in 2 Minutes | Process data in scheduled chunks, or event by event as it arrives | A nightly truck vs a conveyor belt. Freshness weighed against cost and complexity. Most companies run both |
| 51 | Incremental Loads, Explained in 2 Minutes | Load only the rows that changed since the last run, using a high-water mark | A source table with `updated_at`. The last run's mark. Only newer rows move. A deleted row is missed, which is why CDC exists |
| 52 | Change Data Capture (CDC), Explained in 2 Minutes | Read the database's own change log instead of querying its tables | App writes → database log (Postgres WAL, MySQL binlog) → CDC reader → insert, update and delete events → warehouse. The tables are never scanned |
| 53 | Debezium, Explained in 2 Minutes | Open-source CDC connectors that turn database changes into Kafka events | Postgres → Debezium on Kafka Connect → one topic per table. Each event holds the row before and after the change |
| 54 | Kafka Connect, Explained in 2 Minutes | Move data in and out of Kafka with configuration, not code | Source connectors → Kafka → sink connectors (S3, Snowflake). Workers share the tasks. One worker fails and its tasks move |
| 55 | Schema Registry, Explained in 2 Minutes | One place that stores message schemas, so producers and consumers agree on the shape of the data | A producer registers schema v1 and gets an ID. Each message carries the ID, and the consumer looks it up. A breaking v2 is rejected |
| 56 | Apache Flink, Explained in 2 Minutes | Stateful stream processing: keep state per key and update it with every event | Sources → operators with keyed state → sinks. Checkpoints saved to storage. A failure restores the last checkpoint |
| 57 | Windows and Watermarks, Explained in 2 Minutes | Group a stream by time, and decide how long to wait for late events | Events on a time line. Five-minute windows. A late event arrives. The watermark line moves and closes the window |
| 58 | Exactly-Once Processing, Explained in 2 Minutes | Each event changes the result once, even after failures and retries | Three pipes: at-most-once (an event lost), at-least-once (an event duplicated), exactly-once (checkpoints plus transactional writes) |
| 59 | Spark Structured Streaming, Explained in 2 Minutes | A stream is a table that keeps growing, and the same DataFrame query runs on it in small batches | An unbounded table with new rows at the bottom. A trigger every 10 seconds. A checkpoint folder. The same code as the batch job |

### Season 7: data modelling (60–69)

How to shape tables people can use and trust.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 60 | Data Modelling, Explained in 2 Minutes | Three levels: conceptual (the business), logical (entities and keys) and physical (real tables) | "Customer places Order" as two boxes → entities with keys → tables with column types in a warehouse |
| 61 | Normalization, Explained in 2 Minutes | Store each fact once, so one change happens in one place | One wide table repeating customer addresses → split into `customers` and `orders`. An address changes in one row. 1NF → 2NF → 3NF as steps |
| 62 | Fact vs Dimension Tables, Explained in 2 Minutes | Facts are measurable events at a declared grain. Dimensions describe them | `fact_orders` (amount, quantity, keys) with `dim_customer`, `dim_product` and `dim_date` around it. "One row per order line" stamped on it as the grain |
| 63 | Star Schema vs Snowflake Schema, Explained in 2 Minutes | One fact table with flat dimensions, or dimensions split into sub-tables | A star (the fact in the middle, five dimensions) vs a snowflake (dimensions branching further). The joins counted for the same question |
| 64 | Slowly Changing Dimensions, Explained in 2 Minutes | When a dimension changes, overwrite it (Type 1) or add a new row and keep the history (Type 2) | A customer moves from Pune to Austin. Type 1 overwrites. Type 2 adds a row with `valid_from`, `valid_to` and `is_current`. An old order still joins to Pune |
| 65 | Surrogate Keys, Explained in 2 Minutes | A key the warehouse makes, separate from the source system's ID | `customer_id = 42` from two systems collides. Surrogate keys 1001 and 1002 keep them apart. Type 2 history needs one key per version |
| 66 | Kimball vs Inmon, Explained in 2 Minutes | Build data marts for each business process first (bottom-up), or one normalized enterprise warehouse first (top-down) | Two build orders side by side: marts joined by shared dimensions vs a central warehouse in third normal form feeding the marts |
| 67 | Data Vault, Explained in 2 Minutes | Hubs hold keys, links hold relationships and satellites hold history | `hub_customer`, `hub_order`, `link_customer_order` and satellites with load dates. A new source is added without changing existing tables |
| 68 | Medallion Architecture, Explained in 2 Minutes | Bronze (raw), silver (cleaned) and gold (ready for the business) | Three shelves in a lakehouse: raw JSON → deduplicated tables → `daily_sales`. A logic fix is replayed from bronze |
| 69 | The Semantic Layer, Explained in 2 Minutes | Define each metric once, so every tool gives the same answer | Two dashboards showing different revenue. One metric definition in the middle feeds BI, notebooks and AI tools |

### Season 8: quality, governance and catalogs (70–79)

Can you trust this table, can you find it, and who is allowed to use it?

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 70 | Data Governance, Explained in 2 Minutes | Who owns each dataset, who may use it, and the rules for both | Roles: owner, steward, consumer. Policies attached to tables. An audit log of who read what |
| 71 | Data Quality, Explained in 2 Minutes | Measure data against a few dimensions: complete, unique, valid, consistent and on time | One table with each problem highlighted: nulls, duplicates, an impossible value, a mismatch, a late load |
| 72 | Great Expectations, Explained in 2 Minutes | Tests for data, written as expectations and run inside the pipeline | Expectations (not null, unique, between 0 and 100) → a checkpoint runs them on new data → a pass or fail report. The pipeline stops on a failure |
| 73 | Data Observability, Explained in 2 Minutes | Watch every table's health all the time: freshness, volume, schema and distribution | A wall of table monitors. A row count drops 90% overnight. An alert points to the upstream job that caused it |
| 74 | Data Contracts, Explained in 2 Minutes | An agreed schema, rules and owner between the team that makes the data and the teams that use it | Producer → contract (schema, types, freshness, owner) → consumers. A breaking change is blocked in CI before it ships |
| 75 | Data Lineage, Explained in 2 Minutes | Track where each dataset comes from and what depends on it | A graph from source tables to dashboards. A broken column traced upstream. Airflow, Spark and dbt sending OpenLineage events |
| 76 | Data Catalogs, Explained in 2 Minutes | A searchable list of datasets with owners, descriptions and lineage | A search for "revenue" → a table page: owner, columns, freshness, lineage and who uses it. DataHub and OpenMetadata as examples |
| 77 | Unity Catalog, Explained in 2 Minutes | One governance layer for tables, files and models, named `catalog.schema.table` | Metastore → catalogs → schemas → tables, volumes and models. `GRANT SELECT`. The same rules across workspaces |
| 78 | Access Control and PII Masking, Explained in 2 Minutes | Give each role only what it needs, and hide personal data from people who don't need it | Roles → privileges → tables. A masking policy turns emails into `****@gmail.com` for analysts. A row filter by region |
| 79 | Data Mesh, Explained in 2 Minutes | Domain teams own their data as products, on a shared self-serve platform | A central data team as a bottleneck → domains (orders, payments, marketing) publishing data products on one platform, under shared rules |

### Season 9: interview essentials (80–89)

The questions Chris has asked and been asked most, one per episode.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 80 | OLTP vs OLAP, Explained in 2 Minutes | Many small reads and writes for the app, or large scans for analysis | An app database finding one order vs a warehouse summing a year. Row store vs column store. Why data is copied from one to the other |
| 81 | ACID Transactions, Explained in 2 Minutes | All or nothing: atomicity, consistency, isolation and durability | A bank transfer: a debit and a credit. A crash in the middle rolls both back. Two users at once see consistent balances |
| 82 | The CAP Theorem, Explained in 2 Minutes | When the network splits, a distributed system must choose between consistency and availability | Three nodes, and the network is cut. One design refuses writes (consistent). The other accepts them and reconciles later (available) |
| 83 | SQL Joins, Explained in 2 Minutes | Inner, left, right and full joins, and how duplicate keys multiply rows | Two small tables with rows matched by lines. A duplicate key turns 3 rows into 6 |
| 84 | SQL Window Functions, Explained in 2 Minutes | Calculate across related rows without collapsing them | A table partitioned by customer and ordered by date. `ROW_NUMBER` fills in. Keep `row_number = 1` to deduplicate. A running total |
| 85 | SQL Order of Execution, Explained in 2 Minutes | SQL runs FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT, not top to bottom | One query with each clause lighting up in run order. Why a `SELECT` alias fails in `WHERE` |
| 86 | Database Indexes, Explained in 2 Minutes | A sorted structure (a B-tree) that finds rows without reading the whole table | A full table scan vs a B-tree walk to one row. Each insert now also updates the index |
| 87 | How Spark Runs a Job, Explained in 2 Minutes | An action starts a job, shuffles split it into stages, and each stage runs one task per partition | One `write` → a job → two stages split at the shuffle → tasks. The same job in the Spark UI |
| 88 | Lambda vs Kappa Architecture, Explained in 2 Minutes | A batch path plus a fast path, or one streaming path for everything | Lambda: two pipelines merged where results are served. Kappa: one stream, reprocessed by replaying the log |
| 89 | The Data Pipeline Design Interview, Explained in 2 Minutes | A repeatable answer: requirements → sources → ingestion → storage → processing → serving → quality → scale | A whiteboard fills in step by step for "design the analytics pipeline for a food-delivery app", with volumes written beside each box |

### Season 10: AI and data (90–99)

What a data engineer feeds AI systems, and the tools that run them.

| # | Title | Core idea | Architecture / picture to draw |
|---|---|---|---|
| 90 | LLMs for Data Engineers, Explained in 2 Minutes | A model that predicts the next token, limited by its context window and priced per token | Text → tokens → model → next token, in a loop. The context window as a box that fills up. Where data engineers come in: the data that goes in |
| 91 | Embeddings, Explained in 2 Minutes | Text turned into a list of numbers, so similar meanings sit close together | Sentences as points on a map: "refund policy" lands near "return an item". Distance as similarity |
| 92 | Vector Databases, Explained in 2 Minutes | Store embeddings and find the nearest ones fast, with an approximate index | A million points and a query point. An HNSW-style index narrows the search in layers. Metadata filters. pgvector vs a dedicated database |
| 93 | RAG Pipelines for Data Engineers, Explained in 2 Minutes | Retrieve the right chunks first, then let the model answer from them | Docs → chunks → embeddings → vector store. Question → top matches → prompt → answer with sources. A document changes and is re-indexed |
| 94 | Ray, Explained in 2 Minutes | Run Python functions across a cluster, often for AI jobs such as embedding millions of documents | A head node and workers. Tasks and actors. Ten million documents embedded across GPUs |
| 95 | Feature Stores, Explained in 2 Minutes | Define ML features once, and serve the same values in training and in production | One definition → an offline store (history for training) and an online store (fast lookups for the live model). Point-in-time joins |
| 96 | MLflow, Explained in 2 Minutes | Track experiments, then register and version the models that come out of them | Runs with parameters and metrics → the model registry (v1, v2, "champion") → serving |
| 97 | Text-to-SQL, Explained in 2 Minutes | An LLM writes SQL from a question, using your schema and metric definitions | Question → schema and semantic layer as context → LLM → SQL → warehouse → answer. A wrong join caught by a check |
| 98 | Model Context Protocol (MCP), Explained in 2 Minutes | One standard way for AI apps to connect to tools and data | An AI app (the client) → MCP servers for the warehouse, GitHub and Slack. Tools, resources and prompts |
| 99 | AI Agents for Data Teams, Explained in 2 Minutes | An LLM in a loop that plans, calls tools and checks the results | Goal → plan → tool calls (run a query, run dbt, read logs) → check → repeat. A human approves before anything changes. The 100th video |

### Reserve list

Good topics that did not make the 100. Use them for swaps when viewers ask, or for a second run.

CI/CD for data pipelines · Git for data engineers · PostgreSQL · Apache Hudi · Apache Beam and Google Dataflow · Amazon Kinesis · Kafka Streams · Apache Druid · Reverse ETL · One Big Table · Delta Sharing · LLM evals

---

## Detailed plans: episodes 03 to 06

These are beat outlines, not scripts. Each full script (about 250 words) will be written from its outline and sent to you for approval before recording. Every fact below was checked on 20 October 2026, except where a row says otherwise. Check again before recording, as in episode 01.

### 03 Apache Spark

**Folder and slug:** `stackle-video/source/spark/`, `spark-explained` · **Delivery tag (suggested):** `[confident]`

**Hook idea:** a laptop meets a file that is too big. A million orders open in a second. Every order the company has ever taken (2 TB) doesn't fit in memory, and one machine would take all night. So teams split the work across many machines.

#### Beats

| Part | Outline | About |
|---|---|---|
| The problem | Your laptop opens a file of a million orders in a second. Now open every order your company has ever taken: two terabytes. It doesn't fit in memory, and one machine would take all night. So a lot of teams split the work across many machines, with Apache Spark | 45 words |
| What it is | Spark is an open-source engine for processing large amounts of data across many machines. You write Python or SQL (Scala, Java and R work too). It started at UC Berkeley in 2009, was open-sourced in 2010, and became a top-level Apache project in 2014 | 40 words |
| The core idea | Spark cuts your data into partitions. You write steps on a DataFrame, which works like a table: filter, group, sum. Spark doesn't run them one by one. It writes a plan, and runs it only when you ask for a result, like saving the output. Then one task per partition runs, all at the same time | 55 words |
| Architecture | The driver runs your code and turns the plan into tasks. The cluster manager (YARN, Kubernetes or Spark's own) gives the driver executors on worker machines. Executors run the tasks and keep data in memory. Failure moment: one executor dies. The driver re-runs only its tasks on another executor, rebuilding the lost pieces from the plan. The results land in storage | 80 words |
| In short | "So when a team says 'we use Spark', it means their data is too big for one machine. They write the steps once. Spark splits them into tasks across a cluster, and re-runs any piece that fails. That's Apache Spark." Takeaways: too big for one machine · split into tasks · re-run what fails | 35 words |

#### What is on screen (plan)

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | Your Spark thumbnail (16:9 and 9:16, in your marker style) |
| Channel intro | "Hi, I'm Chris … Let's get into it." | The shared intro |
| The problem | "Your laptop opens a file …" | A laptop opens `orders.csv` (1M rows) at once. The file swaps to `all_orders/` (2 TB). A memory bar fills red, the progress bar crawls, and a clock spins to "all night" |
| What it is | "Spark is an open-source engine …" | The big file cuts into slices that fly out to a row of machines. Spark logo and wordmark. The definition word by word, with "across many machines" highlighted. Language chips: Python, SQL, Scala, Java, R. Timeline: 2009 UC Berkeley · 2010 open source · 2013 joins Apache · 2014 top-level project |
| The core idea | "Spark cuts your data into partitions …" | A table splits into eight coloured partitions. `daily_sales.py` types in, and each line adds a dashed box to a plan. Nothing runs. On `.write`, the plan turns solid and all eight partitions light up at once |
| Architecture | "The driver runs your code …" | Driver card (your code and the plan) breaks the plan into task chips. Cluster manager card (YARN · Kubernetes · standalone) hands out executors on three worker cards, each with a memory chip. Tasks fly to the executors. One executor turns red, its two tasks go grey, and they re-run on another executor. The results land in an S3 bucket |
| In short | "So when a team says …" | "We use Spark." Takeaways: too big for one machine · split into tasks · re-run what fails |
| The ask | "What should I explain next? …" | The comment prompt card |
| Closing title | | Closing title, then a fade to white |

**Code on screen (draft, PySpark):**

```python
orders = spark.read.parquet("s3://shop/orders/")
daily = (orders
    .filter(orders.status == "paid")
    .groupBy("order_date")
    .sum("amount"))
daily.write.parquet("s3://shop/daily_sales/")
```

#### Facts to check before recording

| Claim | Source | Checked |
|---|---|---|
| Spark started as a research project at UC Berkeley in 2009 and was open-sourced in early 2010 | [Spark, "History"](https://spark.apache.org/history.html) | Yes |
| The history page says it started "at the UC Berkeley AMPLab in 2009", but the AMPLab's own page says the lab launched on 17 February 2011. So the voice and the timeline say "UC Berkeley", not "AMPLab" | [AMPLab, "About"](https://amplab.cs.berkeley.edu/about/) | Yes, conflict noted |
| Spark moved to the Apache Software Foundation in 2013 (it entered the Incubator in June 2013) | Spark "History" page; [ASF press release, 27 February 2014](https://blogsarchive.apache.org/foundation/entry/the_apache_software_foundation_announces50) | Yes |
| Spark became a top-level Apache project on 27 February 2014 | Same press release; [Spark news, "Spark becomes top-level Apache project"](https://spark.apache.org/news/spark-becomes-tlp.html) | Yes |
| "A multi-language engine for executing data engineering, data science, and machine learning on single-node machines or clusters", with Python, SQL, Scala, Java and R | [spark.apache.org](https://spark.apache.org/) | Yes |
| The driver runs `main()` and creates the SparkContext. Cluster managers: standalone, YARN, Kubernetes. Executors run tasks and keep data in memory or on disk | [Cluster mode overview](https://spark.apache.org/docs/latest/cluster-overview.html) | Yes |
| Spark runs one task for each partition | [RDD programming guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html) | Yes |
| Transformations are lazy, and run only when an action needs a result | Same guide | Yes |
| A lost partition is recomputed from the transformations that created it | Same guide | Yes |
| Current versions are 4.x: 4.0.0 on 23 May 2025, 4.2.0 on 14 July 2026. The code above uses the DataFrame API, which is the same in 3.x and 4.x | [Spark news](https://spark.apache.org/news/index.html) | Yes |
| The PySpark code runs as written (`groupBy(...).sum("amount")` gives a column named `sum(amount)`) | Run it once in a local Spark session | No, check before recording |

**Kept simple on purpose:** stages and the shuffle are left for episodes 22 and 87, so the driver "turns the plan into tasks". Spark also runs on one machine (local mode), but the episode shows only a cluster. Reading a Parquet file can start a small job to read its schema, but the steps after it are lazy, which is what the voice says. When an executor is lost, Spark may also re-run earlier work whose shuffle files were on it. The voice says "rebuilding the lost pieces from the plan", which covers both.

### 04 What is data engineering

**Folder and slug:** `stackle-video/source/data-engineering/`, `data-engineering-explained` · **Delivery tag (suggested):** `[calm]`

**Hook idea:** one number on a dashboard at 9 AM, and the hidden road it travelled to get there. This episode is also the map of the series: each box in its architecture is an episode, with a small episode tag on it.

#### Beats

| Part | Outline | About |
|---|---|---|
| The problem | At 9 AM, the CEO opens a dashboard: yesterday's sales, 4,213 orders. That number came from a payments database, a mobile app and a spreadsheet from finance. Someone had to collect it, clean it and get it there before 9, every day. That someone is a data engineer | 45 words |
| What it is | Data engineering is building the systems that move data from where it's created to where it's used: clean, on time, every day. In 2006, Hadoop made it practical to store and process huge data on many ordinary machines. In 2017, Maxime Beauchemin, who created Airflow, described the job in an essay, "The Rise of the Data Engineer" | 45 words |
| The core idea | Every pipeline does the same five jobs. Data is generated in a source. It's ingested, which means collected. It's stored. It's transformed: cleaned, joined, summed. And it's served to the people and apps that use it. That's the data engineering lifecycle | 50 words |
| Architecture | Sources on the left: an app database, events, software-as-a-service tools, files. Ingestion: batch connectors, and streaming with Kafka. Storage: a lake or a warehouse. Transformation: Spark or dbt. Serving: dashboards, ML models, apps. Orchestration (Airflow) runs across the top. Failure moment: at 3 AM, the app team renames a column. A test catches it, the pipeline stops and an alert goes out. The dashboard says "last updated yesterday" instead of showing a wrong number | 85 words |
| In short | "So when a company says 'we need a data engineer', it means they need someone to build the roads their data travels on: from every source, cleaned, on time, and trusted. That's data engineering." Takeaways: move it · clean it · keep it running | 35 words |

#### What is on screen (plan)

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | Your thumbnail for this episode (16:9 and 9:16) |
| Channel intro | "Hi, I'm Chris … Let's get into it." | The shared intro |
| The problem | "At 9 AM, the CEO opens a dashboard …" | A dashboard card: "Yesterday's sales: 4,213 orders". The camera pulls back, and three faint lines run from the number back to a database, a phone and a spreadsheet. A clock reads 08:59 |
| What it is | "Data engineering is building the systems …" | The definition word by word, with "move data" highlighted. Timeline: 2006 Hadoop · 2017 "The Rise of the Data Engineer". A small Airflow pinwheel next to Beauchemin's name links back to episode 01 |
| The core idea | "Every pipeline does the same five jobs …" | Five cards in a row light up in turn: Generate → Ingest → Store → Transform → Serve. Under them, a thin bar: security · data management · DataOps · architecture · software engineering |
| Architecture | "Sources on the left …" | The map builds left to right, box by box, with dots flowing along each line. Each box has an episode tag: Kafka (02), Snowflake (05), Databricks (06), Spark (03), dbt (08). Airflow (01) draws across the top. At "3 AM", a column header in the source flips from `amount` to `total`. The transform box turns red, a test badge says "failed: column missing", an alert pings, and the dashboard shows "last updated yesterday" |
| In short | "So when a company says …" | "We need a data engineer." Takeaways: move it · clean it · keep it running |
| The ask | "What should I explain next? …" | The comment prompt card |
| Closing title | | Closing title, then a fade to white |

#### Facts to check before recording

| Claim | Source | Checked |
|---|---|---|
| Doug Cutting and Mike Cafarella split HDFS and MapReduce out of Apache Nutch as a subproject called Hadoop on 28 January 2006. Cutting joined Yahoo that year | [CIO, "Apache Hadoop turns 10"](https://www.cio.com/article/3027631/apache-hadoop-turns-10.html) | Yes, but this is press coverage, not an Apache page. Look for an Apache source, or say "2006" only |
| "The Rise of the Data Engineer", by Maxime Beauchemin, published 20 January 2017 | [freeCodeCamp](https://www.freecodecamp.org/news/the-rise-of-the-data-engineer-91be18f1e603/) | Yes |
| In the essay, Beauchemin says he joined Facebook in 2011 as a business intelligence engineer, and describes data engineers as building "tools, infrastructure, frameworks, and services" | Same essay | Yes (not used in the voice) |
| Beauchemin started Airflow at Airbnb in October 2014 | [Airflow, "Project"](https://airflow.apache.org/docs/apache-airflow/stable/project.html) (already in episode 01's facts) | Yes |
| The lifecycle: generation, storage, ingestion, transformation, serving. The undercurrents: security, data management, DataOps, data architecture, orchestration, software engineering | Joe Reis and Matt Housley, *Fundamentals of Data Engineering* (O'Reilly, 2022), chapter 2; [Joe Reis, "The Data Engineering Lifecycle and Undercurrents, 4 Years Later"](https://joereis.substack.com/p/the-data-engineering-lifecycle-and) | Yes |
| Not used: "Bill Inmon published the first data warehouse book in 1992". Sources disagree (1990 or 1992), so it stays out of this episode | Wikipedia vs the publisher's copy | Conflict noted |
| The 4,213 orders number is made up for the example. It is shown as an example, not a statistic | | |

**Kept simple on purpose:** the book lists storage second, because storage sits under every stage. The video draws the stages in the order data flows (generate, ingest, store, transform, serve). Orchestration is drawn as the bar across the top, so it is left out of the undercurrents bar to avoid showing it twice. No job-market numbers or salaries in this episode unless they come from a named, dated source.

### 05 Snowflake

**Folder and slug:** `stackle-video/source/snowflake/`, `snowflake-explained` · **Delivery tag (suggested):** `[confident]`

**Hook idea:** Monday, 9 AM. Finance starts the month-end report, and every dashboard in the company slows to a crawl, because they all share one database server.

#### Beats

| Part | Outline | About |
|---|---|---|
| The problem | It's Monday, 9 AM. Finance starts the month-end report. At the same moment, every dashboard in the company slows to a crawl. They all share one database server, and it can't do both at once. So a lot of companies moved their analytics to Snowflake | 45 words |
| What it is | Snowflake is a cloud data warehouse: a database for analytics that you use as a service, with no servers to install or manage. It was founded in 2012, became generally available in 2015, and runs on AWS, Azure and Google Cloud | 40 words |
| The core idea | Storage and compute are separate. Your data is stored once, in cloud storage. Compute comes as virtual warehouses: clusters you start, stop and resize. Each team can have its own, reading the same data, without slowing anyone else down. And you pay for a warehouse only while it runs | 50 words |
| Architecture | Three layers, drawn one at a time. Storage: every table is cut into micro-partitions, compressed and stored by column. Compute: the virtual warehouses. Cloud services on top: logins and access, metadata, and the query optimizer. A query arrives, the optimizer uses the metadata to skip micro-partitions that can't match, and a warehouse reads only the rest. Scaling moment: at 9 AM, dashboard queries start to queue, so Snowflake adds clusters, then removes them when the rush is over. At night, idle warehouses suspend and stop costing anything | 90 words |
| In short | "So when a team says 'we use Snowflake', it means their data lives in one place, and every team gets its own compute, which starts, stops and scales on its own, and costs money only while it runs. That's Snowflake." Takeaways: one copy of the data · compute per team · pay while it runs | 35 words |

#### What is on screen (plan)

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | Your Snowflake thumbnail (16:9 and 9:16) |
| Channel intro | "Hi, I'm Chris … Let's get into it." | The shared intro |
| The problem | "It's Monday, 9 AM …" | A calendar flips to "Mon 09:00". A month-end report starts, and one server's CPU bar fills red. Five dashboard cards around it show loading spinners |
| What it is | "Snowflake is a cloud data warehouse …" | Snowflake logo and wordmark. The definition word by word, with "cloud data warehouse" highlighted. A server rack crossed out ("nothing to install"). Timeline: 2012 founded · 2015 generally available · then AWS, Azure and Google Cloud chips |
| The core idea | "Storage and compute are separate …" | One storage cylinder at the bottom. Three warehouse cards above it (Finance L, Dashboards S, Pipelines M), each with its own on/off switch and size dial, all reading from the same cylinder. Each card has a small meter that runs only while it is on |
| Architecture | "Three layers …" | The storage layer draws first: a table breaks into micro-partition blocks, each stored by column. The virtual warehouses draw above it. Cloud services draw on top (login · access · metadata · optimizer). A query drops in, the optimizer greys out most blocks (pruning) and the warehouse reads the few left. At "9 AM", queries stack up in a queue on the Dashboards warehouse, two more clusters slide in beside it, and the queue drains. Then night: the warehouses dim to "suspended" and their meters stop |
| In short | "So when a team says …" | "We use Snowflake." Takeaways: one copy of the data · compute per team · pay while it runs |
| The ask | "What should I explain next? …" | The comment prompt card |
| Closing title | | Closing title, then a fade to white |

**Code on screen (optional, for the core idea):**

```sql
CREATE WAREHOUSE dashboards_wh
  WAREHOUSE_SIZE = SMALL
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 3
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;
```

#### Facts to check before recording

| Claim | Source | Checked |
|---|---|---|
| Founded in July 2012 (incorporated in Delaware on 23 July 2012) by Benoit Dageville, Thierry Cruanes and Marcin Żukowski | Snowflake's SEC filings (10-K note on organization, for example [this one](https://www.sec.gov/Archives/edgar/data/1640147/000164014725000110/R8.htm)); [Wikipedia](https://en.wikipedia.org/wiki/Snowflake_Inc.) for the founders | Yes |
| Came out of stealth in October 2014. General availability of the "Snowflake Elastic Data Warehouse" on 23 June 2015, on AWS | Snowflake press release, 23 June 2015 ("Snowflake Redefines the Data Warehouse for the Cloud Era"); [SD Times coverage](https://sdtimes.com/big-data/snowflake-announces-general-availability-of-elastic-data-warehouse/) | Yes |
| IPO priced on 15 September 2020, trading on the NYSE as SNOW from 16 September 2020 | [Snowflake, "Snowflake Announces Pricing of Initial Public Offering"](https://www.snowflake.com/en/news/press-releases/snowflake-announces-pricing-of-initial-public-offering/) | Yes (not used in the voice) |
| A Snowflake account can be hosted on AWS, Google Cloud or Microsoft Azure | [Snowflake docs, "Supported cloud platforms"](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms) | Yes |
| No hardware to select, install, configure or manage, and "virtually no software" | [Snowflake docs, "Key concepts and architecture"](https://docs.snowflake.com/en/user-guide/intro-key-concepts) | Yes |
| Three layers: database storage, compute (virtual warehouses) and cloud services. Cloud services handles authentication, metadata management, and query parsing and optimization | Same page | Yes. Check that the page also lists access control before showing "access" on screen |
| A hybrid of shared-disk and shared-nothing designs, with massively parallel processing compute clusters | Same page | Yes |
| Each virtual warehouse is an independent compute cluster that doesn't share compute with the others | Same page | Yes |
| Data is stored in a compressed, columnar format. Tables are divided into micro-partitions of 50 to 500 MB of uncompressed data, with metadata that allows pruning | Same page; [Snowflake docs, "Micro-partitions and data clustering"](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions) | Yes |
| Warehouses can be started, stopped and resized at any time. Auto-suspend and auto-resume. Per-second billing, with a 60-second minimum each time a warehouse starts | [Snowflake docs, "Overview of warehouses"](https://docs.snowflake.com/en/user-guide/warehouses-overview) | Yes |
| Multi-cluster warehouses in auto-scale mode start more clusters when queries queue, and shut them down as the load drops. Enterprise Edition or higher | [Snowflake docs, "Multi-cluster warehouses"](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) | Yes |
| The `CREATE WAREHOUSE` code. `MAX_CLUSTER_COUNT` above 1 needs Enterprise Edition. `AUTO_SUSPEND` is in seconds | [Snowflake docs, "CREATE WAREHOUSE"](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse) | Yes |

**Kept simple on purpose:** Snowflake now calls itself the "AI Data Cloud" and does more than warehousing. The episode sticks to the warehouse, which is what most teams use it for. "Costs money only while it runs" is about compute. Storage is billed separately, all the time. Adding clusters helps with many queries at once. A single slow query needs a bigger warehouse instead, which the core idea covers with "resize".

### 06 Databricks

**Folder and slug:** `stackle-video/source/databricks/`, `databricks-explained` · **Delivery tag (suggested):** `[calm]`

**Hook idea:** most companies keep their data twice, once in a cheap lake and once in a warehouse, and the two copies never quite agree.

#### Beats

| Part | Outline | About |
|---|---|---|
| The problem | Most companies keep their data twice. Raw files in a data lake, because it's cheap. And a cleaned copy in a warehouse, because analysts need fast SQL. Two copies, two bills, and two numbers that never quite match. Databricks keeps one copy instead | 45 words |
| What it is | Databricks is a data and AI platform built on the lakehouse: one copy of your data, as open files in your own cloud storage, with warehouse features on top. It was founded in 2013 by the people who created Apache Spark | 40 words |
| The core idea | Tables in Databricks are Delta tables: ordinary Parquet files, plus a transaction log. Every change adds one commit to the log, and readers only see finished commits. So a folder of cheap files behaves like a database table, with safe updates and every past version | 50 words |
| Architecture | Your cloud storage at the bottom (S3, Azure Data Lake Storage or Google Cloud Storage), holding Delta tables in bronze, silver and gold layers. Above it, the compute plane: clusters and SQL warehouses that read and write those tables. On top, the control plane that Databricks runs: the workspace, notebooks and jobs. Unity Catalog decides who can see which table. Failure moment: a nightly job crashes halfway through a write. There's no commit, so everyone still sees last night's table. Re-run it, and it commits once | 85 words |
| In short | "So when a team says 'we use Databricks', it means one copy of their data, in open files in their own cloud. Pipelines, SQL and AI all run on it, and one catalog controls who sees what. That's Databricks." Takeaways: one copy, open files · pipelines, SQL and AI on top · one catalog for access | 35 words |

#### What is on screen (plan)

| Part | Words | Picture |
|---|---|---|
| Opening card | (beat only) | Your Databricks thumbnail (16:9 and 9:16) |
| Channel intro | "Hi, I'm Chris … Let's get into it." | The shared intro |
| The problem | "Most companies keep their data twice …" | A lake of raw files on the left, a warehouse on the right, and a copy arrow between them. Two bills appear. Two dashboards show "Revenue: 1.24M" and "Revenue: 1.19M" |
| What it is | "Databricks is a data and AI platform …" | The warehouse slides onto the lake and becomes a table layer on top of it. Databricks logo and wordmark. The definition word by word, with "lakehouse" highlighted. Timeline: 2013 founded by Spark's creators (Spark logo links back to episode 03) · 2019 Delta Lake open-sourced · 2024 Unity Catalog open-sourced |
| The core idea | "Tables in Databricks are Delta tables …" | A folder `orders/` with Parquet files and a `_delta_log/` folder. Commits `00000.json`, `00001.json` and `00002.json` stack up as writes happen. A reader icon looks only at finished commits. A version slider scrubs back to version 1 |
| Architecture | "Your cloud storage at the bottom …" | Storage draws first: an S3 / ADLS / GCS bucket with three shelves (bronze, silver, gold). The compute plane draws above it: a cluster and a SQL warehouse, labelled "classic: your cloud account · serverless: Databricks' account". The control plane draws on top: workspace, notebooks, jobs. Unity Catalog draws as a gate across the storage, and a `GRANT SELECT` line lets the analysts through. Then a job bar crashes at 60%. Half-written files sit grey with no commit, and the readers still see version 41. The re-run adds commit 42 |
| In short | "So when a team says …" | "We use Databricks." Takeaways: one copy, open files · pipelines, SQL and AI on top · one catalog for access |
| The ask | "What should I explain next? …" | The comment prompt card |
| Closing title | | Closing title, then a fade to white |

#### Facts to check before recording

| Claim | Source | Checked |
|---|---|---|
| Founded in 2013 by the original creators of Apache Spark (the page also names Delta Lake, MLflow and Unity Catalog) | [Databricks, "About us"](https://www.databricks.com/company/about-us) | Yes |
| Delta Lake was open-sourced on 24 April 2019 | [Databricks blog, "Open Sourcing Delta Lake"](https://www.databricks.com/blog/2019/04/24/open-sourcing-delta-lake.html) | Yes |
| Delta Lake became a Linux Foundation project, announced 16 October 2019 | [Databricks blog, 16 October 2019](https://www.databricks.com/blog/2019/10/16/delta-lake-now-hosted-by-the-linux-foundation-to-become-the-open-standard-for-data-lakes.html) | Yes (not used in the voice) |
| "A lakehouse is a new, open architecture that combines the best elements of data lakes and data warehouses" (30 January 2020) | [Databricks blog, "What is a Lakehouse?"](https://www.databricks.com/blog/2020/01/30/what-is-a-data-lakehouse.html) | Yes. Don't say Databricks invented the word |
| Unity Catalog was open-sourced in June 2024 (announced 12 June at Data + AI Summit) and is hosted by LF AI & Data | [Databricks press release](https://www.databricks.com/company/newsroom/press-releases/databricks-open-sources-unity-catalog-creating-industrys-only-open); [Databricks blog, "Open Sourcing Unity Catalog"](https://www.databricks.com/blog/open-sourcing-unity-catalog) | Yes |
| Delta Lake is "open source software that extends Parquet data files with a file-based transaction log for ACID transactions", and the default table format on Databricks | [Databricks docs, "What is Delta Lake?"](https://docs.databricks.com/aws/en/delta/) | Yes |
| The log is in `_delta_log/` as numbered JSON files. Each one is an atomic version of the table | [Delta Lake protocol](https://github.com/delta-io/delta/blob/master/PROTOCOL.md) | Yes |
| Readers never see inconsistent data (serializable isolation) | [Delta Lake docs, introduction](https://docs.delta.io/latest/delta-intro.html) | Yes |
| The control plane is in Databricks' account. Classic compute runs in your cloud account. Serverless compute runs in Databricks' account. Unity Catalog metastores are the central governance system for tables and ML models | [Databricks docs, "High-level architecture"](https://docs.databricks.com/aws/en/getting-started/high-level-architecture) | Yes |
| Medallion layers: bronze holds raw data, silver validated and cleaned data, gold refined data for analytics | [Databricks docs, "Medallion architecture"](https://docs.databricks.com/aws/en/lakehouse/medallion) | Yes |
| Databricks runs on AWS, Azure and Google Cloud | Databricks docs (separate editions for each cloud) | No, confirm the wording before recording |
| `GRANT SELECT ON TABLE main.sales.orders TO analysts` is valid Unity Catalog SQL | Databricks docs, Unity Catalog privileges | No, check the exact syntax (group names may need backticks) |

**Kept simple on purpose:** Databricks also works with Apache Iceberg tables. The episode shows Delta only, and episode 16 covers Iceberg. The diagram draws one compute plane with a "classic / serverless" label instead of two planes. The Delta log gets one line here. Episode 17 opens it up (conflicts, checkpoints), and episode 77 covers Unity Catalog.

---

## Production notes

**Thumbnails.** For each episode, you supply two thumbnails in your marker style: 16:9 as `img/thumbnail.png` and 9:16 as `img/thumbnail-vertical.png`, on a white or #FEFEFE background. Each cut opens on its own thumbnail, and the build saves that first frame as `<slug>-thumbnail.jpg` and `<slug>-vertical-thumbnail.jpg` in `stackle-video/graphics/`.

**Voice.** Once you approve a script, it is recorded in four takes with the "Crispus Roshan" voice, and the best take is kept as `audio/vo.mp3`. Its word timings go in `audio/vo.transcript.json`.

**Build.** From the episode's folder:

```bash
cd stackle-video/source/<episode> && ./build.sh   # landscape (YouTube), plus the .srt
./build.sh vertical                              # portrait (TikTok, Reels, Shorts), captions burned in
```

The first time on a machine, run `npm install` in `stackle-video/source/`. A fast draft without motion blur is `./build.sh <out.mp4> --sub 1` (see `stackle-video/source/airflow/README.md`).

**Each episode folder** (as in `source/airflow/` and `source/kafka/`) has `episode.json` (title, episode number, slug, voice offset and the music cue words), a `build.sh` that calls `../explained/build.sh`, the scenes (`index.html`, `vertical.html` and their scripts and styles), `audio/` and `img/`. The finished files land in `stackle-video/graphics/`: `<slug>.mp4`, `<slug>.srt`, `<slug>-vertical.mp4` and both thumbnails.

**Music cues.** Each cue in `episode.json` is a word and which time it is spoken (0 is the first). Airflow and Kafka drop the beat on "apache". That works for 03 Spark, but 04, 05 and 06 have no "Apache" in the title, so set `drop` to the first spoken word of the title (for example `["snowflake", 0]`, if the hook's last line is the first time "Snowflake" is said). The `chapters` cues follow each script's chapter openers, such as "here's", "now" and "team".

**Per episode, in `stackle-video/scripts/`:** `<slug>.md` (the script, the on-screen plan and the facts table) and `<slug>-posts.md` (titles, description with chapters, tags and the pinned comment).

**Decided:** every episode runs thumbnail card → the shared 12.9-second intro (`graphics/stackle-intro.mp4`, and `stackle-intro-vertical.mp4` for the portrait cut) → the episode → the closing ask. The closing ask is one shared recording too (`source/explained/audio/cta.wav`), so episodes don't need to record it.

**Open question for you:** viewers on TikTok and Shorts decide in the first two seconds. One option is to open the portrait cut on the hook's first line and play the intro after it, which the kit already supports (`"intro": {"after": [word, n]}` in `episode.json`, as the trailer does). Your call.
