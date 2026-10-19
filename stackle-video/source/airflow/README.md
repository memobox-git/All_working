# Apache Airflow, explained

A 95-second explainer on a white canvas, voiced by the ElevenLabs "Crispus Roshan" voice, with soft original music underneath and motion graphics synced to every word. Output: `stackle-video/graphics/airflow-explained.mp4` (1920×1080, 30 fps, -14 LUFS). The script is in `stackle-video/scripts/airflow-explained.md`.

## Rebuild

```bash
cd stackle-video/source && npm install
cd airflow && ./build.sh                              # full quality, motion blur on (about 5 minutes on 4 cores)
./build.sh /tmp/draft.mp4 --sub 1                     # fast draft, no motion blur
```

Rendering is split into chunks, so a stopped build picks up where it left off when run again.

## How it fits together

| File | Job |
|---|---|
| `audio/vo.mp3` | The voiceover (ElevenLabs `eleven_v4`, take 3 of 4) |
| `audio/vo.transcript.json` | Word timings for the voiceover |
| `make-cues.js` | Turns the word timings into `cues.js` (voice starts 1 second in) |
| `index.html`, `style.css` | The five scenes and the HUD |
| `scene.js` | One GSAP timeline keyed to spoken words (`at('scheduler')`), plus the background, task grids, flow dots and camera |
| `../render-pro.js` | Renders frames in parallel with motion blur |
| `make-music.py` | Writes the music: a calm D major piece (pad, soft electric piano, bass, reverb) at 70 BPM. It is synthesised from scratch, so there is nothing to license, and the last chord lands on the closing title |
| `mix.js` | Voice over the music, which dips gently under speech, normalised to -14 LUFS |

## The five scenes

1. **The problem** (0:00): the 6 AM grid of pipeline runs, and the three questions: when, in what order, what if one fails.
2. **What it is** (0:16): the title, the one-line definition, "the right task, time and order", and 2014 → 2016 → 2019.
3. **DAGs** (0:31): a TaskFlow DAG in Python next to the graph it makes. Tasks run in order once the ones before them succeed.
4. **Architecture** (0:50): DAG files → DAG processor → metadata database ⇄ scheduler → executor → workers, with results flowing back. The web UI sits on top: runs, logs and a one-click retry.
5. **In short** (1:20): "We use Airflow", three takeaways and the closing title.

## Changing things

- **New voiceover take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (an ElevenLabs transcript with word timings), then rebuild. Cues follow the words, so most timing adjusts itself. If you change the words, update the `at('word')` calls in `scene.js` that point at them.
- **Music level:** `MUSIC` in `mix.js`. **Music itself:** the chords, piano patterns and tempo are at the top of `make-music.py`.
- **Code on screen:** `CODE` in `scene.js`. Keep the highlighted line numbers (`band(...)`) in step with it.
