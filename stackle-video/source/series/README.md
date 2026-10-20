# Explained in 2 Minutes: the series intro (episode 00)

A 52-second trailer for the series, in the same look and beat as the episodes. It is built with the shared kit in `../explained/`.

| Cut | File | For |
|---|---|---|
| Landscape | `stackle-video/graphics/explained-series-intro.mp4` (1920×1080) and `explained-series-intro.srt` | YouTube (also good as the channel trailer) |
| Vertical | `stackle-video/graphics/explained-series-intro-vertical.mp4` (1080×1920), captions burned in | TikTok, Instagram Reels, YouTube Shorts |

The script is in `stackle-video/scripts/series-intro.md`, the post copy in `series-intro-posts.md`, and the plan for all 100 episodes in `series-roadmap.md`.

## Rebuild

```bash
cd stackle-video/source/series
./build.sh            # landscape + .srt
./build.sh vertical   # vertical
```

## The scenes

| Time | Words | Picture |
|---|---|---|
| 0:00 | (beat) | Opening card: `img/thumbnail.png` / `img/thumbnail-vertical.png`. **Temporary designs**: replace them with Chris's thumbnails |
| 0:02 | "One data tool. Two minutes." | Two big lines, word by word |
| 0:04 | (channel intro) | The Stackle intro, "Hi, I'm Chris … Let's get into it." (`"intro": {"after": ["minutes", 0], "resume": ["this", 0]}` in `episode.json`) |
| 0:17 | "This is Explained in 2 Minutes …" | The series lockup (a stopwatch mark whose arc fills toward two minutes), then "One tool or idea from data engineering, every episode" |
| 0:24 | "… what it is, why teams use it, and how it works under the hood" | Three cards: What it is, Why teams use it, How it works |
| 0:27 | "… with the architecture drawn out, step by step." | Source → Stream → Process → Store, one arrow per "step" |
| 0:31 | "Here's what's coming …" | The first six episodes, each on its name: 01 Apache Airflow, 02 Apache Kafka, 03 Apache Spark, 04 What is Data Engineering?, 05 Snowflake, 06 Databricks |
| 0:41 | "And that's just the start. We're going for a hundred episodes." | The six become the first tiles of a 10×10 grid that fills as the counter runs to 100 |
| 0:44 | "So, what should I explain next? …" | The comment ask (`../explained/cta.js`) |
| 0:49 | "See you in episode one." | The lockup, and "Next: episode 01, Apache Airflow" |

## Files

| File | Job |
|---|---|
| `episode.json` | Output name, card, the intro after "Two minutes" (two words of the take after it are left out), the words the beat follows (the drop on "This is …", a crash on "Here's", the arp for "a hundred", drums out for "See you in episode one") |
| `audio/vo.mp3`, `audio/vo.transcript.json` | The voiceover (`eleven_v4`, take 1 of 4) and its word timings. Its comment-ask line is also cut out as the shared ending for every episode (`../explained/audio/cta.wav`) |
| `index.html`, `vertical.html`, `style.css`, `vertical.css`, `story.js` | The pages, the two layouts and one timeline for both |
| `brand.js` | The stopwatch mark |
