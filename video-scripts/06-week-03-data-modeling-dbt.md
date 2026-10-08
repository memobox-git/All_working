# Video 6 — Week 3: Data modeling + dbt on Snowflake

**Length:** 90s · **Placement:** course page curriculum, YouTube, social

---

**0:00–0:07 · HOOK**
VO (Chris): "Ask three teams how many customers you have and you'll get three different numbers. That isn't a SQL problem. It's a modeling problem."
ON SCREEN: 48,210 · 51,977 · 46,034. Which one is right?

**0:07–0:16 · INTRO**
VO: "Week three of the Stackle Data Engineering Masterclass is data modeling and dbt on Snowflake. I'm Chris. Modeling shows up in 38% of job postings, but in senior interviews it's where I dig deepest."
ON SCREEN: Week 3 · Data modeling + dbt · Data modeling in 38% of postings
SOURCE: InterviewStack, 6,877 postings, May 2026

**0:16–0:26 · RECORDED BASICS** [confirm]
VO: "The recorded basics cover the core ideas: facts, dimensions and keys, plus setting up dbt on Snowflake."
ON SCREEN: Before class: facts, dimensions, keys · dbt setup

**0:26–0:50 · LIVE BUILD**
VO: "Live, we start with grain: what exactly does one row mean? Then history: when a customer moves city, do last year's orders move with them? Then dbt tests, so a broken key fails loudly, and lineage, so you can see which tables break when one changes."
ON SCREEN: Grain · History · dbt tests · Lineage
B-ROLL: the dbt lineage graph from bronze to gold.

**0:50–1:05 · HOW AI IS USED**
VO: "The AI suggests a schema in seconds. Your job is to defend it or reject it. Is the grain right? What happens to history? You write that reasoning down. AI writes the first draft. You learn the judgment that gets you hired."

**1:05–1:18 · WHAT YOU SHIP**
VO: "You ship bronze, silver and gold models in dbt on Snowflake, built on the data from weeks one and two, plus a one-page design doc that explains every choice you made."
ON SCREEN: Ship: bronze / silver / gold models + design doc

**1:18–1:30 · NEXT WEEK / END CARD**
VO: "Next week covers data quality, testing and CI/CD. We break the pipeline on purpose, then catch it."
ON SCREEN: Next: Week 4 · Data quality + CI/CD · **stackle.io** · [Book a call] · Next cohort starts [date]

---

**YouTube title:** Data Modeling with dbt on Snowflake: Grain, History and Lineage (Week 3)
**Marketing clip (0:00–0:07 + 0:26–0:50):** three different customer counts, then how grain fixes it.
**Note:** the three numbers in the hook are illustrative. Use whatever the demo dataset produces.
