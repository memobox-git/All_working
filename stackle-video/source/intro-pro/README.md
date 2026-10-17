# Stackle channel intro

A 47-second intro voiced by the ElevenLabs "Crispus Roshan" voice, with motion graphics synced to every word. Output: `stackle-video/graphics/stackle-intro.mp4` (1920×1080, 30 fps, -14 LUFS).

## Rebuild

```bash
cd stackle-video/source && npm install
cd intro-pro && ./build.sh                          # full quality, about 20 minutes
./build.sh /tmp/draft.mp4 --sub 1                   # fast draft, no motion blur
```

Rendering is split into chunks, so a stopped build picks up where it left off when run again.

## How it fits together

| File | Job |
|---|---|
| `audio/vo.mp3` | The voiceover (ElevenLabs `eleven_v4`, take 3 of 4) |
| `audio/vo.transcript.json` | Word timings for the voiceover |
| `make-cues.js` | Turns the word timings into `cues.js` |
| `index.html`, `style.css` | The nine scenes and the HUD |
| `scene.js` | One GSAP timeline keyed to spoken words (`at('stackle')`), plus the background, counters and sound cues |
| `../render-pro.js` | Renders frames in parallel with 6-sample motion blur |
| `mix.js` | Voice, ducked ambience bed and sound effects from the scene's cues, normalised to -14 LUFS |

## Changing things

- **New voiceover take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (an ElevenLabs transcript with word timings), then rebuild. Cues follow the words, so most timing adjusts itself. If you change the words, update the `at('word')` calls in `scene.js` that point at them.
- **Numbers (followers, Meetup members):** edit the counters in `scene.js` (`stats`) and the labels in `index.html`, and re-record the line.
- **Sound levels:** `LEVEL` in `mix.js`.
