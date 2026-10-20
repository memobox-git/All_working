# Apache Airflow, explained

A 95-second explainer on a white canvas, voiced by the ElevenLabs "Crispus Roshan" voice, with soft original music underneath and motion graphics synced to every word. It comes in two cuts that share the voice, music and timing:

| Cut | File | For |
|---|---|---|
| Landscape | `stackle-video/graphics/airflow-explained.mp4` (1920×1080) and `airflow-explained.srt` | YouTube. Upload the `.srt` as captions |
| Vertical | `stackle-video/graphics/airflow-explained-vertical.mp4` (1080×1920), captions burned in | TikTok, Instagram Reels, YouTube Shorts |

Both are 30 fps at -14 LUFS. The script is in `stackle-video/scripts/airflow-explained.md`.

## Rebuild

```bash
cd stackle-video/source && npm install
cd airflow && ./build.sh                              # landscape + .srt, motion blur on (about 5 minutes on 4 cores)
./build.sh vertical                                   # the vertical cut (about 7 minutes)
./build.sh /tmp/draft.mp4 --sub 1                     # fast draft, no motion blur (works with `vertical` too)
```

Rendering is split into chunks, so a stopped build picks up where it left off when run again.

## How it fits together

| File | Job |
|---|---|
| `audio/vo.mp3` | The voiceover (ElevenLabs `eleven_v4`, take 3 of 4) |
| `audio/vo.transcript.json` | Word timings for the voiceover |
| `make-cues.js` | Turns the word timings into `cues.js` (voice starts 1 second in) |
| `common.js` | Shared by both cuts: cue lookup (`at('scheduler')`), the GSAP timeline helpers, icons, the pinwheel, the background and connector arrows |
| `index.html`, `style.css`, `scene.js` | The landscape cut: five scenes, the HUD, task grids, flow dots and camera |
| `vertical.html`, `vertical.css`, `vertical.js` | The vertical cut: the same story laid out for a phone, plus the captions |
| `../render-pro.js` | Renders frames in parallel with motion blur (`--width`/`--height` set the frame size) |
| `make-music.py` | Writes the music: a calm D major piece (pad, soft electric piano, bass, reverb) at 70 BPM. It is synthesised from scratch, so there is nothing to license, and the last chord lands on the closing title |
| `mix.js` | Voice over the music, which dips gently under speech, normalised to -14 LUFS |
| `make-srt.js` | Writes the `.srt` captions for the landscape cut from the word timings |

## The five scenes

1. **The problem** (0:00): the 6 AM grid of pipeline runs, and the three questions: when, in what order, what if one fails.
2. **What it is** (0:16): the title, what Airflow is, "the right task, time and order", and 2014 → 2016 → 2019.
3. **DAGs** (0:31): a TaskFlow DAG in Python next to the graph it makes. Tasks run in order once the ones before them succeed.
4. **Architecture** (0:50): DAG files → DAG processor → metadata database ⇄ scheduler → executor → workers, with results flowing back. The web UI sits on top: runs, logs and a one-click retry.
5. **In short** (1:20): "We use Airflow", three takeaways and the closing title.

## The vertical cut

- Everything that matters sits between y 180 and 1430 and inside x 90–990, so TikTok's top tabs, the buttons on the right and the caption at the bottom never cover it.
- The architecture is re-drawn as a three-column grid (UI on top, the metadata database in the middle, workers along the bottom). The camera tours it inside a clipped window, so zoom-ins never run under the captions.
- Captions come straight from the word timings: up to four words a page, the spoken word on a blue pill, the words still to come in grey. Page length is set in `vertical.js` (`PAGES`).

## Changing things

- **New voiceover take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (an ElevenLabs transcript with word timings), then rebuild both cuts. Cues and captions follow the words, so most timing adjusts itself. If you change the words, update the `at('word')` calls in `scene.js` and `vertical.js` that point at them.
- **Music level:** `MUSIC` in `mix.js`. **Music itself:** the chords, piano patterns and tempo are at the top of `make-music.py`.
- **Code on screen:** `CODE` in `scene.js` and `vertical.js`. Keep the highlighted line numbers (`band(...)`) in step with it.
