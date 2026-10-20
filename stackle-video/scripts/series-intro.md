# Explained in 2 Minutes: Series Intro (episode 00)

**What it is:** the trailer for the series. It covers what the series is, what every episode does, the first six episodes and the goal of 100, and it asks viewers what to explain next.

**Length:** 52 seconds. That is 35 seconds of voice plus the 12.9-second channel intro.

**Status:** recorded (take 1 of 4) and built. The recorded take has two more words after "Two minutes." that the video leaves out (`"resume": ["this", 0]` in `source/series/episode.json`). Both cuts are in `stackle-video/graphics/` (`explained-series-intro.mp4`, `explained-series-intro-vertical.mp4`). The opening cards are temporary until Chris's thumbnails arrive.

---

## Script

> [confident] One data tool. Two minutes.
>
> *(the channel intro: "Hi, I'm Chris. I've spent over 10 years in data engineering and interviewed more than 200 engineers. Now I run Stackle, where I teach the skills that actually get you hired. Let's get into it.")*
>
> This is Explained in 2 Minutes. Every episode takes one tool or idea from data engineering, and shows you what it is, why teams use it, and how it works under the hood, with the architecture drawn out, step by step.
>
> Here's what's coming. Apache Airflow. Apache Kafka. Apache Spark. What data engineering actually is. Snowflake. Databricks. And that's just the start. We're going for a hundred episodes.
>
> [warmly] So, what should I explain next? Tell me in the comments below, and it could be the next episode. See you in episode one.

The line "So, what should I explain next? … it could be the next episode." is also the ending of every episode (`source/explained/audio/cta.wav`), so the series always closes in the same words.

## What is on screen

| Words | Picture |
|---|---|
| (beat) | The opening card (the series thumbnail) |
| "One data tool. Two minutes." | Two big lines, word by word |
| (channel intro) | The Stackle intro |
| "This is Explained in 2 Minutes …" | The series lockup with the stopwatch mark, then "One tool or idea from data engineering, every episode" |
| "… what it is, why teams use it, and how it works under the hood" | Three cards: What it is · Why teams use it · How it works |
| "… with the architecture drawn out, step by step." | Source → Stream → Process → Store, one arrow per "step" |
| "Here's what's coming …" | Six episode cards, each on its name: 01 Apache Airflow · 02 Apache Kafka · 03 Apache Spark · 04 What is Data Engineering? · 05 Snowflake · 06 Databricks |
| "… a hundred episodes." | A 10×10 grid of episodes filling up as the counter runs from 6 to 100 |
| "So, what should I explain next? …" | A comment box typing ideas (dbt, Apache Iceberg, …) and the Comment button pressing on "comments" |
| "See you in episode one." | The lockup and "Next: episode 01, Apache Airflow" |
