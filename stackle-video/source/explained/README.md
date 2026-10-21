# Explained in 2 Minutes: the series kit

Everything the episodes share. Each episode is its own folder next to this one (`airflow/`, `kafka/`, `series/`, …) with its pages, its scenes and an `episode.json`. The tools here turn that folder into two finished videos:
- a landscape cut (1920×1080) for YouTube, with an `.srt`;
- a vertical cut (1080×1920) for TikTok, Reels and Shorts, with the captions burned in.

## Running order of every episode

| Part | Length | What plays |
|---|---|---|
| Opening card | 1.8 s (`card`) | The episode's thumbnail, full frame, over the start of the beat. It is the first frame, so it doubles as the TikTok cover |
| The hook | about 17 s | The episode's opening, its problem part, up to the line that names the tool ("… put Apache Kafka in the middle.") |
| Channel intro | 11.7 s | Chris's Stackle intro ("Hi, I'm Chris … the skills that actually get you hired."), from `../../graphics/stackle-intro.mp4` (or `stackle-intro-vertical.mp4`). The voice and the beat pause while it plays |
| The rest of the episode | about 1:05 | What it is, the core idea, architecture, in short |
| Comment ask | 5.2 s (`cta`) | "So, what should I explain next? Tell me in the comments below, and it could be the next episode." A comment box types out ideas (`cta.js`) |
| Fade | 1.8 s | To white |

The rule for every video: **the hook first, then the channel intro.** Each episode names its last hook word in `"intro": {"after": [word, n]}`: `["middle", 0]` for Kafka, `["airflow", 0]` for Airflow. The series intro (episode 00) plays it after "One data tool. Two minutes." (`"after": ["minutes", 0]`), and its `"resume": ["this", 0]` picks the voice up again at "This is …", leaving out the words in between.

## episode.json

```json
{
  "title": "Apache Kafka",
  "episode": 2,
  "slug": "kafka-explained",
  "card": 1.8,
  "offset": 1.8,
  "intro": {
    "landscape": "../../graphics/stackle-intro.mp4",
    "vertical": "../../graphics/stackle-intro-vertical.mp4",
    "transcript": "../intro-pro/audio/vo.transcript.json",
    "voiceOffset": 0.6,
    "after": ["middle", 0]
  },
  "cta": true,
  "music": { "drop": ["apache", 0], "chapters": [["here's", 0], ["now", 1], ["team", 0]], "break": ["that's", 0] }
}
```

The fields:
- `slug` names the outputs: `stackle-video/graphics/<slug>.mp4`, `<slug>-vertical.mp4`, `<slug>.srt` and the two `-thumbnail.jpg` files.
- `card` is how long the opening card holds.
- `offset` is where the voice would start if there were no intro.
- `intro` is the channel intro.
  - `after` is `[word, n]`: the intro plays after the n-th time the voice says that word (counting from 0), at the end of the hook. The voice pauses for it. (`null` would play it straight after the card, which the series doesn't do.)
  - The voice file is cut in the quiet between words, found from the audio itself, so no syllable is clipped.
  - `resume` (optional, with `after`): `[word, n]` where the voice picks up again. The words in between are left out of the video.
- `cta` adds the comment ask after the closing title.
- `music` is `false` for no background music (Kafka and Gen AI have none: the soundtrack is the voices and the channel intro's own sound). Otherwise it names the words the beat follows (also counted from 0):
  - `drop` is where the full beat comes in, usually the first "Apache".
  - `chapters` places a crash on each of three chapters. Open hats join from the first, and the arp plays from the second until the third.
  - `break` is where the drums drop out, on the last line.

## Making the next episode

1. **Script.** Write it in `stackle-video/scripts/<slug>.md`, in the fixed structure: the problem → what it is → the core idea → architecture → in short ("So when a team says …", then "That's …"). It should be about 250 words, and Chris approves it before recording.
2. **Voice.** Use ElevenLabs `eleven_v4` with the "Crispus Roshan" voice and record 4 takes. Pick one, transcribe it with `eleven_scribe_v1`, and save the files as `<episode>/audio/vo.mp3` and `<episode>/audio/vo.transcript.json` (the transcript with its `words` list).
3. **Thumbnails.** Save Chris's designs as `<episode>/img/thumbnail.png` (16:9) and `<episode>/img/thumbnail-vertical.png` (9:16).
4. **Pages.** Copy the `kafka/` folder as a starting point.
   - `index.html` and `vertical.html` hold the same elements.
   - `style.css` and `vertical.css` lay them out for each frame size.
   - `story.js` is one timeline for both cuts. Graphics hang on spoken words with `at('word', n)`, and positions are read from the page, so the cuts stay in sync.
   - `brand.js` draws the tool's mark.
   Keep `../explained/cta.css` and `../explained/cta.js` in both pages, and call `drawCta(t)` from `render(t)`.
5. **Build.**
   ```bash
   cd stackle-video/source/<episode>
   ./build.sh                        # landscape + .srt, about 6 minutes on 4 cores
   ./build.sh vertical               # vertical, about 8 minutes
   ./build.sh /tmp/draft.mp4 --sub 1 # fast draft, no motion blur (add `vertical` first for the vertical cut)
   ```
   A stopped render picks up where it left off; delete `<out>.picture.parts/` to start clean.

## The files here

| File | Job |
|---|---|
| `build.sh` | One cut, end to end: timeline → frames → music → soundtrack → MP4 → intro laid in → thumbnail → `.srt` |
| `make-cues.js` | Lays out the running order from `episode.json` and the transcripts. Writes `<episode>/cues.js` (for the page) and `<episode>/timeline.json` (for the tools below) |
| `common.js` | Loaded by every page: cue lookup (`at()`), the paused GSAP timeline and its helpers, icons, the dotted white background, the opening card and connector arrows |
| `captions.js` | Word-by-word captions for the vertical cuts |
| `cta.js`, `cta.css` | The comment ask scene |
| `reintro.sh` | After the channel intro changes length, swaps the new intro into both finished cuts of an episode without re-rendering the page (the page is blank under the intro), and rebuilds the soundtrack and `.srt`: `./reintro.sh ../kafka` |
| `remix.sh` | Rebuilds only the soundtrack of a finished cut and swaps it into the MP4, without re-rendering the picture: `./remix.sh ../kafka` or `./remix.sh ../kafka vertical`. Use it after changing `music` |
| `make-music.py` | The beat: original house-pop at 120 BPM, synthesised from scratch (nothing to license), following the cue words. It pauses for the channel intro and keeps a soft pad under the comment ask |
| `mix.js` | Voice (split around the intro if needed), comment ask and, unless `music` is `false`, the beat ducked about 10 dB under the voice. It normalises to -14 LUFS, then lays in the intro's own sound |
| `make-srt.js` | The `.srt` for YouTube: the intro's lines, the voiceover and the comment ask |
| `make-thumb.js` | Saves a cut's first frame as its thumbnail JPG |
| `audio/cta.wav`, `audio/cta.transcript.json` | The comment ask, cut from the series intro take (`series/audio/vo.mp3`, 29.30–34.52 s) |
| `../render-pro.js` | Renders frames in parallel with motion blur |

## The channel intro

It lives in `../intro-pro/` (see its README). `./build.sh` renders `stackle-intro.mp4` and `./build.sh vertical` renders `stackle-intro-vertical.mp4`. If the intro changes, rebuild it, then rebuild the episodes: the timeline reads its length from the file.
