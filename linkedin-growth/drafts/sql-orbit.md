# SQL: one language, every data tool (GIF post)

Slot: Thu Oct 22 (the next free day after the test run), or swap it into any day. Never two posts in 24 hours.

Visual: `visuals/sql-orbit.gif` (1080x1350, 8 seconds, 4.3 MB). SQL sits in the centre and 118 small logos pop in around it in five rings while a counter ticks up to 118. Then data dots flow between SQL and the tools, and between the tools themselves. If LinkedIn shows the GIF as a still image, upload `visuals/sql-orbit.mp4` instead. Theme: Dark (motion graphics rule in CLAUDE.md).

When you type the course credit, type "@Baraa Khatib Salkini" and pick his profile from the list, so he's tagged and gets notified.

First comment, right after posting:
Data With Baraa, SQL Full Course for Beginners (30 Hours): https://www.youtube.com/watch?v=SSKVgrwhzus

Sources checked Oct 14, 2026:
- Stack Overflow Developer Survey 2025, technology section (all respondents: SQL 58.6%, Python 57.9%; PostgreSQL 55.6% most used database): https://survey.stackoverflow.co/2025/technology
- SQL history (Codd 1970, SEQUEL 1974 by Chamberlin and Boyce at IBM, renamed over a trademark, Oracle first commercial SQL database in 1979, ANSI standard 1986, ISO 1987): Chamberlin's "Early History of SQL" and the Oracle SQL docs.
- Data With Baraa course: 6,151,887 views, 29h48m, checked with yt-dlp.

```
SQL is 52 years old.
More developers use it than Python. 👇

In Stack Overflow's 2025 developer survey, 58.6% of developers said they'd worked in SQL in the past year. Python was at 57.9%.

How it started
→ 1970: Edgar F. Codd at IBM publishes the relational model: data in tables, linked by keys
→ 1974: Donald Chamberlin and Raymond Boyce, also at IBM, design SEQUEL, a language for asking those tables questions in words close to plain English
→ It gets renamed SQL, because "SEQUEL" was already someone else's trademark
→ 1979: Oracle ships the first commercial SQL database
→ 1986: SQL becomes an ANSI standard, and an ISO standard a year later

Why it never died: you say what you want, not how to get it. SELECT this, FROM there, WHERE that. The database works out the how. Every new engine since has had to speak that language.

Where you'll find it today
→ Data engineering: pipelines and transformations. Most dbt models are just SQL files.
→ Analytics: every Power BI, Tableau or Looker dashboard sits on a query
→ Data science: pulling the training data before any model gets built
→ Software: the database behind most apps. PostgreSQL was the most used database in the same survey.
→ Finance: reporting, reconciliation, audit
→ Healthcare: patient records and claims
→ Marketing and product: segments, funnels, A/B test results
→ Streaming: Flink SQL queries data while it's still moving
→ AI: agents now write SQL against company data

The GIF shows 118 tools that run SQL or connect to it, and that's still not all of them. Learn it once and you can work in all of them.

If you want to learn it, this is an amazing free course I found: @Baraa Khatib Salkini's "SQL Full Course for Beginners (30 Hours)" on Data With Baraa. 6 million views, zero to advanced. Kudos to you, Baraa, for putting this out for free. Link in the first comment.

Tools come and go every few years. SQL has been underneath them for five decades.
```

## The 118 tools in the GIF

In case someone asks in the comments. Order: inner ring outwards.

PostgreSQL, MySQL, SQL Server, Oracle, SQLite, Snowflake, BigQuery, Databricks, Redshift, Excel, Power BI, Tableau, dbt, Spark SQL, MariaDB, CockroachDB, YugabyteDB, TiDB, SingleStore, Neon, Supabase, PlanetScale, Amazon RDS, Cloud Spanner, Percona, Vitess, TimescaleDB, CrateDB, QuestDB, SAP HANA, Teradata, Greenplum, Exasol, MonetDB, Firebolt, Microsoft Fabric, ClickHouse, DuckDB, Trino, Presto, Starburst, Dremio, Hive, Druid, Pinot, Doris, StarRocks, Materialize, RisingWave, Flink SQL, ksqlDB, Kafka, DataFusion, Calcite, Iceberg, Delta Lake, Hudi, Polars, SQLMesh, Airflow, Dagster, Prefect, Fivetran, Airbyte, Matillion, Informatica, Talend, Coalesce, Estuary, Meltano, Kestra, Great Expectations, Soda, Looker, Metabase, Superset, Redash, Mode, Hex, Sigma, ThoughtSpot, Qlik, Grafana, Sisense, Domo, Google Sheets, Lightdash, Evidence, Preset, Retool, Streamlit, Observable, Count, Omni, Holistics, Zoho Analytics, Cube, DBeaver, DataGrip, pgAdmin, TablePlus, Beekeeper Studio, Jupyter, pandas, Python, R, Java, SQLAlchemy, Prisma, Django, Rails, Laravel, Hibernate, .NET, Node.js, Go, Hasura, VS Code
