# Apache Airflow, Explained in 2 Minutes (episode 01)

A 95-second explainer on a white canvas, voiced by the ElevenLabs "Crispus Roshan" voice, over an upbeat original beat, with motion graphics synced to every word. It comes in two cuts that share the voice, music and timing:

| Cut | File | For |
|---|---|---|
| Landscape | `stackle-video/graphics/airflow-explained.mp4` (1920×1080) and `airflow-explained.srt` | YouTube. Upload the `.srt` as captions |
| Vertical | `stackle-video/graphics/airflow-explained-vertical.mp4` (1080×1920), captions burned in | TikTok, Instagram Reels, YouTube Shorts |

Both are 30 fps at -14 LUFS. Each opens on its own thumbnail card, and the build saves that first frame as `<video>-thumbnail.jpg` (upload it as the YouTube thumbnail; on TikTok, the first frame is the cover). The script is in `stackle-video/scripts/airflow-explained.md`.

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
| `make-cues.js` | Turns the word timings into `cues.js`. The voice starts 1.8 s in, after the opening card (`OFFSET` in `build.sh`) |
| `common.js` | Shared by both cuts: cue lookup (`at('scheduler')`), the GSAP timeline helpers, icons, the pinwheel, the background and connector arrows |
| `index.html`, `style.css`, `scene.js` | The landscape cut: five scenes, the HUD, task grids, flow dots and camera |
| `vertical.html`, `vertical.css`, `vertical.js` | The vertical cut: the same story laid out for a phone, plus the captions |
| `../render-pro.js` | Renders frames in parallel with motion blur (`--width`/`--height` set the frame size) |
| `make-music.py` | Writes the music: an upbeat house-pop beat at 120 BPM in D major (kick, claps, hats, off-beat bass, plucked chords, an arp in the architecture part). It is synthesised from scratch, so there is nothing to license. It reads the voice timings so the beat drops on the title, a crash marks each chapter, the drums cut for "That's Apache Airflow" and the last chord hits as the voice ends |
| `mix.js` | Voice over the beat, which dips under speech (about 10 dB below the voice), normalised to -14 LUFS |
| `make-srt.js` | Writes the `.srt` captions for the landscape cut from the word timings |
| `make-thumb.js` | Saves a cut's first frame (the opening card) as its thumbnail |
| `make-portrait.py`, `img/` | Cuts the presenter out of `img/portrait-source.png` for the opening card (`img/portrait.png`). Needs `pip install "rembg[cpu]"` |

## The scenes

0. **Opening card** (0:00): the thumbnail (photo, "Explained in 2 minutes", Apache Airflow, extract → transform → load), with the beat already playing. It clears as the voice starts.
1. **The problem** (0:02): the 6 AM grid of pipeline runs, and the three questions: when, in what order, what if one fails.
2. **What it is** (0:17): the title, what Airflow is, "the right task, time and order", and 2014 → 2016 → 2019.
3. **DAGs** (0:32): a TaskFlow DAG in Python next to the graph it makes. Tasks run in order once the ones before them succeed.
4. **Architecture** (0:51): DAG files → DAG processor → metadata database ⇄ scheduler → executor → workers, with results flowing back. The web UI sits on top: runs, logs and a one-click retry.
5. **In short** (1:21): "We use Airflow", three takeaways and the closing title.

## The vertical cut

- Everything that matters sits between y 180 and 1430 and inside x 90–990, so TikTok's top tabs, the buttons on the right and the caption at the bottom never cover it.
- The architecture is re-drawn as a three-column grid (UI on top, the metadata database in the middle, workers along the bottom). The camera tours it inside a clipped window, so zoom-ins never run under the captions.
- Captions come straight from the word timings: up to four words a page, the spoken word on a blue pill, the words still to come in grey. Page length is set in `vertical.js` (`PAGES`).

## Changing things

- **New voiceover take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (an ElevenLabs transcript with word timings), then rebuild both cuts. Cues and captions follow the words, so most timing adjusts itself. If you change the words, update the `at('word')` calls in `scene.js` and `vertical.js` that point at them.
- **Music level:** `MUSIC` in `mix.js`, or per build: `MUSIC=0 ./build.sh` makes a voice-only version, `MUSIC=.3 ./build.sh` a louder beat. **Music itself:** tempo, chords and the stab rhythm are at the top of `make-music.py`.
- **New photo:** put it at `img/portrait-source.png`, run `python3 make-portrait.py img/portrait-source.png img/portrait.png`, then rebuild. The card sizes are `.th-portrait` in `style.css` and `vertical.css`.
- **Next episode:** the series name and episode number are in the opening card, the top bar and the closing credit of `index.html` and `vertical.html`.
- **Code on screen:** `CODE` in `scene.js` and `vertical.js`. Keep the highlighted line numbers (`band(...)`) in step with it.
