# Personal AI Agents graphics

Motion graphics for `stackle-video/scripts/personal-agents.md`. Output goes to `stackle-video/graphics/personal-agents/`:

- **19 animated graphics**, 1920×1080, 30 fps, as MP4.
- **10 "card beside you" overlays**, as transparent PNGs in `cards/`.

They use the same navy, blue and cyan palette, fonts and corner HUD as the channel intro (`../intro-pro`), so the video looks like one piece from the intro onwards.

## What's here

| File | Script graphic | Line it runs under |
|---|---|---|
| `g01-cold-open-timeline.mp4` | 1 | Paragraphs 1–2 (hook and promise) |
| `g02-the-plan.mp4` | 2 | Paragraph 6 |
| `g03-map-chatbot.mp4` | 3 | Paragraph 8 |
| `g05-map-diy-agent.mp4` | 5 | Paragraph 11 |
| `g07-map-personal-agent.mp4` | 7 | Paragraph 14 |
| `g08-phone-message.mp4` | 8 | Paragraph 15 |
| `g09-map-one-line-each.mp4` | 9 | Paragraph 16 |
| `g12-learning-memory-file.mp4` | 12 | Paragraph 23 |
| `g13-connectors.mp4` | 13 | Paragraph 25 |
| `g14-map-ready-out-of-the-box.mp4` | 14 | Paragraph 28 |
| `g17-heartbeat.mp4` | 17 | Paragraph 34 |
| `g18-the-maths.mp4` | 18 | Paragraph 36 |
| `g19-cloud-computer.mp4` | 19 | Paragraph 38 |
| `g20-lock-in.mp4` | 20 | Paragraph 42 |
| `g21-meta-claims.mp4` | 21 | Paragraph 44 |
| `g22-prompt-injection.mp4` | 22 | Paragraph 46 |
| `g23-pick-this-if.mp4` | 23 | Paragraph 49 |
| `g24-agent-vs-pipeline.mp4` | 24 | Paragraph 52 |
| `g25-your-turn.mp4` | 25 | Paragraphs 53–54 |
| `cards/card-01-your-task.png` … `card-10-one-rule.png` | Cards beside you | Parts 1, 2, 3, 4 and 5 |

The paragraph numbers match the numbered script Chris reviewed.

**Not built here:** Graphics 4, 6, 10, 11, 15 and 16. These are screen recordings Chris films:
- the chatbot run;
- the career folder;
- the rules file;
- the demo folder;
- Muse;
- Muse's files.

To match the rest of the video, add a round face bubble in the bottom-left corner and a blue highlight box on whatever is being named.

## Timing

Each graphic is paced to its own line at 150 words a minute:
- It starts 0.6 seconds before the first word.
- Each item appears on the word that names it.
- It holds for 1.6 seconds after the last word.

After recording, there are three ways to line them up:
1. **Slip it in the edit.** Most graphics only need sliding to the first word.
2. **Retime everything.** If Chris reads faster or slower overall, use `WPM=165 ./build.sh`.
3. **Move one cue.** Cues are words from the line, like `at('heartbeat')`, in `scenes.js`. Change the word or add seconds (`at('heartbeat') + 0.5`).

## The full narrated video

`graphics/personal-agents/full/personal-agents-full.mp4` is the whole video, about 15 minutes, in the light Jeff Su look:
- Chris's ElevenLabs voice ("Crispus Roshan") reads the whole script.
- Every VOICE line has its graphic, real launch page or real launch footage, timed to the word he says.
- Every CAMERA line is a grey card that says "CAMERA · LINE N" and shows the line. Chris puts his own shot over it, at the same length.

How it's made:
1. `vo/chunk01–12.mp3` are the narration, generated in 12 parts. `vo/words01–12.json` are their word timings from ElevenLabs Scribe. `vo/plan.json` says which paragraphs are in each part.
2. `python3 vo/timeline.py` gives every script word its time on the joined narration. It splits the video into 56 slots, one per visual (`vo/timeline.json`, `vo/timing.js`), and writes `vo/narration.wav`.
3. `node build-video.js` renders each slot from `video.html?slot=N`. In a slot, a cue like `at('heartbeat')` is the moment the voice says that word. It then joins the slots and adds the narration.

`video.html` loads every scene: the motion graphics (`scenes.js`), the real-source scenes (`scenes-real.js`) and the newer ones (`scenes-new.js`). It draws them all in the light look (`light.css`, `pa-light.css`, `scenes-new.css`).

```bash
cd stackle-video/source/personal-agents
./clips.sh                              # official footage, cut to frames (not committed)
python3 vo/timeline.py                  # slots and narration.wav
node build-video.js                     # about 45 minutes; finished slots are kept
node build-video.js --only 11,18        # re-render just these slots, then run it again to join
open "video.html?slot=11"               # preview one slot (scrub with window.render(t))
```

If Chris re-records with his real voice:
- Replace the chunks and word files.
- Run `timeline.py`. The cues follow his timing.
- Run `build-video.js` again, after deleting `full/slots/`.

## Rebuild

```bash
cd stackle-video/source && npm install
cd personal-agents && ./build.sh                    # everything, light motion blur, about 25 minutes
SUB=1 ./build.sh /tmp/draft                         # fast draft, no motion blur
ONLY="08 17" ./build.sh                             # just these graphics
open "index.html?g=17"                              # preview one in a browser (scrub with window.render(t) in the console)
```

`build.sh` uses `../render-pro.js`, the same renderer as the intro. It needs Playwright installed, globally or locally.

## How it fits together

| File | Job |
|---|---|
| `index.html`, `pa.css` | One page; `?g=NN` picks the graphic |
| `core.js` | The paused GSAP timeline, word cues (`speech()`), animation helpers, the HUD |
| `scenes.js` | One entry per graphic: the line Chris says (`text`) and what appears on which word (`build`) |
| `cards.js`, `card.html` | Renders the side cards as transparent PNGs |
| `build.sh` | Renders everything |

## Changing words

If a line changes in the script, update `text` for that scene in `scenes.js`, so the cues still find their words. On-screen labels sit next to each cue.

These labels were shortened from the script or added for the screen:
- the "In this video" rows (Graphic 1);
- the notes under the lit column (Graphics 3, 5, 7 and 14);
- the three checks (Graphic 8);
- "Recruiter 1–3", "Followed up" and "3 apps · 1 job" (Graphic 13);
- "Every 30 minutes, by default" and "A new email wakes it right away" (Graphic 17);
- "Closed" (Graphic 19);
- "Another app" and "Lose nothing" (Graphic 20);
- "A promise" (Graphic 21);
- the "341 of 2,857 skills checked · Koi Security, Feb 2026" source line (Graphic 22);
- the bottom chip (Graphic 24);
- the step titles (Graphic 25).
