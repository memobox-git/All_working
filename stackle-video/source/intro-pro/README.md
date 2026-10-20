# Stackle channel intro

A 13-second intro voiced by the ElevenLabs "Crispus Roshan" voice: "Hi, I'm Chris. I've spent over 10 years in data engineering and interviewed more than 200 engineers. Now I run Stackle, where I teach the skills that actually get you hired. Let's get into it." The look is a quiet page that fills in as Chris talks: off-white paper, black type, hand-drawn frames and underlines, one red accent, and soft pencil and paper sounds. Output: `stackle-video/graphics/stackle-intro.mp4` (1920×1080, 30 fps, -14 LUFS).

## Rebuild

```bash
cd stackle-video/source && npm install
cd intro-pro && ./build.sh                          # about 1 minute
./build.sh /tmp/draft.mp4 --sub 1                   # faster draft, no motion blur
```

Rendering is split into chunks, so a stopped build picks up where it left off when run again.

## How it fits together

| File | Job |
|---|---|
| `audio/vo.mp3` | The voiceover (ElevenLabs `eleven_v4`, take 2 of 4) |
| `audio/vo.transcript.json` | Word timings for the voiceover |
| `audio/sfx/` | Pencil strokes, paper slides and a quiet ambience bed (ElevenLabs sound effects) |
| `img/chris.jpg` | The photo in the opening frame |
| `make-cues.js` | Turns the word timings into `cues.js` |
| `index.html`, `style.css` | The four scenes: photo card with the name and two numbers, Stackle, and "Let's get into it" |
| `scene.js` | One GSAP timeline keyed to spoken words (`at('stackle')`), the hand-drawn strokes, counters and sound cues |
| `../render-pro.js` | Renders frames in parallel, with optional motion blur (`--sub`) |
| `mix.js` | Voice, ducked bed and sound effects from the scene's cues, normalised to -14 LUFS |

## Changing things

- **New voiceover take or new script:** replace `audio/vo.mp3` and `audio/vo.transcript.json` (an ElevenLabs transcript with word timings), then rebuild. Cues follow the words, so most timing adjusts itself. If you change the words, update the `at('word')` calls in `scene.js` that point at them.
- **Numbers:** edit them in `index.html` and re-record the line.
- **The 47-second version** (with the industries, offers and community numbers) is in git history at commit `9f1b913`.
- **Photo:** replace `img/chris.jpg` (4:5, about 1024×1280).
- **Colours:** the variables at the top of `style.css`.
- **Sound levels:** `LEVEL` in `mix.js`.
