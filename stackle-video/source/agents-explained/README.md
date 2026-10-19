# AI Agents Explained

A 5½-minute animated explainer (4:48 of voiceover plus the 47-second channel intro), voiced by the ElevenLabs "Crispus Roshan" voice, with motion graphics synced to the spoken words. Output: `stackle-video/graphics/ai-agents-explained.mp4` (1920×1080, 30 fps, -14 LUFS). Script and sources: `stackle-video/scripts/ai-agents-explained.md`.

## Rebuild

```bash
cd stackle-video/source && npm install
cd agents-explained && ./build.sh                   # full quality, about 45 minutes on 4 cores
./build.sh /tmp/draft.mp4 --sub 1                   # fast draft, no motion blur
```

`build.sh` renders the picture, mixes the soundtrack, then cuts `graphics/stackle-intro.mp4` in after the promise, just before "Number one". Rendering is split into chunks, so a stopped build picks up where it left off when run again.

## How it fits together

| File | Job |
|---|---|
| `audio/vo.txt` | The voiceover text as sent to ElevenLabs |
| `audio/vo.mp3` | The voiceover (ElevenLabs `eleven_v4`, take 4 of 4, the closest match to the script) |
| `audio/vo.transcript.json` | Word timings for the voiceover (faster-whisper `small.en`, run locally) |
| `make-cues.js` | Turns the word timings into `cues.js` |
| `index.html`, `style.css` | The scenes, the HUD and the overlays |
| `scene.js` | One GSAP timeline keyed to spoken phrases, plus the background and sound cues |
| `splice.js` | Prints where the channel intro is cut in |
| `mix.js` | Voice, ducked ambience bed and sound effects (shared with `../intro-pro/audio/sfx`), normalised to -14 LUFS |
| `../render-pro.js` | Renders frames in parallel with motion blur |

## Changing things

- **New take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (any transcript with `words: [{text, start, end, type: "word"}]`, from ElevenLabs Scribe or faster-whisper), then rebuild. Cues are phrases (`cue('the loop keeps')`), searched in script order, so timing follows the new take by itself. If you change the words, update the matching `cue()` phrases in `scene.js`. A missing phrase stops the build and names the phrase.
- **Avoid cueing on words a transcriber may spell differently:** LangGraph ("Lang graph"), CrewAI ("Crew AI"), numbers ("ten" becomes "10").
- **Sound levels:** `LEVEL` in `mix.js`.
