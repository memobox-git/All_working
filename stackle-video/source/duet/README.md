# Claude Duet in 8 minutes

The finished 8:00 video about Claude Duet, voiced by the ElevenLabs "Crispus Roshan" voice (Chris's own voice) with no on-camera footage. The script is `stackle-video/scripts/claude-duet-8min-voiceover.md`, cut down from `claude-duet-explained.md`, which has the research and the source for every fact.

Output: one 1920×1080, 30 fps MP4 with a -14 LUFS soundtrack, plus an SRT caption file. The look is dark ink blue with one indigo and teal accent and glass cards (no brown or gold), and the footage is the real thing:

| Footage | Where it comes from | How it was captured |
|---|---|---|
| The Claude Duet phone demo and the Duet page | claude.com/product/claude-duet (Anthropic) | `capture/screencast.js`, a real-time recording of the live page at 1.5× zoom |
| Grok Bot launch film | x.ai/news/introducing-grok-bot (xAI) | `capture/grabmedia.js` saves the page's own video request |
| Muse launch film and shopping demo | about.fb.com, "Introducing Muse" (Meta) | direct download of the MP4s on the post |
| Dots | none: OpenAI's post has no launch video of its own | a designed title card instead |

Anthropic's launch video on YouTube could not be used: YouTube blocks downloads and embeds from the cloud machine this was built on. Every clip is credited on screen.

## Make it

```bash
cd stackle-video/source && npm install
cd duet
# 1. footage (into any folder, here ~/footage)
node capture/screencast.js ~/footage/demo-frames ~/footage/duet-demo-2880.mp4 --dsf 1.5 --start 950 --to 1390 --scroll 4 --hold 100
node capture/screencast.js ~/footage/hero-frames ~/footage/duet-hero-2880.mp4 --dsf 1.5 --start 0 --to 900 --scroll 7 --hold 4
node capture/grabmedia.js https://x.ai/news/introducing-grok-bot '*media.x.ai*' ~/footage/grokbot-launch.mp4
curl -o ~/footage/Introducing-Muse_Sizzle-Video.mp4 https://about.fb.com/wp-content/uploads/2026/09/Introducing-Muse_Sizzle-Video.mp4
curl -o ~/footage/Muse_Shopping.mp4 https://about.fb.com/wp-content/uploads/2026/09/Muse_Shopping.mp4
./prep/clips.sh ~/footage work          # 30 fps frames for every clip (about 1 GB)
# 2. voice: the finished track is in audio/, so this step is only for a new voice-over
mkdir -p work && ffmpeg -i audio/voice.mp3 -ar 48000 -ac 1 work/voice.wav && cp audio/words.json audio/sections.json work/
#    or, from new ElevenLabs takes (one per section, in order):  python3 prep/voice.py work 480 s1.mp3 ... s8.mp3
python3 prep/cues.py work               # word timings and clip lengths for the scene
node stills.js work/stills 30 120 250   # optional: check single frames
./build.sh                              # about 30 minutes on 4 cores -> work/claude-duet-8min.mp4
python3 prep/captions.py work ../../scripts/claude-duet-8min-voiceover.md work/claude-duet-8min.srt
```

Python needs `numpy` and `faster-whisper` (for `prep/voice.py`); ffmpeg needs Rubber Band (`ffmpeg -filters | grep rubberband`).

## How it fits together

| File | Job |
|---|---|
| `prep/voice.py` | Trims each take, places the eight sections, fits the total to 8:00 (here a 1.5% speed-up with the pitch kept) and finds word timings with Whisper |
| `prep/clips.sh` | Turns the footage into 30 fps JPEG frames that the scene steps through |
| `prep/cues.py` | Writes `work/cues.js`: words, section times and clip lengths |
| `index.html`, `style.css`, `scene.js` | The edit: one GSAP timeline where every card, chip and clip starts on a spoken word (`T(section, 'phrase')`) |
| `stills.js` | Single frames for checking, and a list of any word cue the scene could not find |
| `music.py` | The music bed, the interface sounds the scene cues, the ducking under the voice, and -14 LUFS |
| `build.sh` | Renders four quarters in parallel with `../render-pro.js`, joins them, adds the soundtrack |
| `prep/captions.py` | YouTube captions from the word timings, in the script's spelling |

## Changing things

- **Words on screen:** in `scene.js`, one block per section. Each item appears on the word in its `T(...)` call.
- **A new voice-over:** generate new takes, run `prep/voice.py` and `prep/cues.py`. Cues follow the words, so most timing moves with them; `stills.js` lists any phrase that no longer matches.
- **Which part of a clip plays:** the `clip(img, name, sourceSeconds, startTime)` calls in `scene.js`.
- **Colours:** the variables at the top of `style.css`.
- **Music:** the chords, tempo and levels at the top of each block in `music.py`.

## The vertical Shorts

Five 1080×1920 Shorts for TikTok and YouTube Shorts, cut from the same voice-over. Their titles and captions are in `stackle-video/scripts/claude-duet-shorts.md`.

```bash
python3 prep/shorts.py work             # cuts each Short's voice -> work/shorts/<id>/{voice.wav, cues.js}
node shorts-stills.js in45 work/sstills 5 20   # optional: check single frames
for id in in45 vs safety catch parts; do
  node ../render-pro.js "shorts.html?s=$id" work/shorts/$id/picture.mp4 --size 1080x1920 --sub 1 --workers 1 --chunk 90
  python3 music.py work/shorts/$id
  ffmpeg -i work/shorts/$id/picture.mp4 -i work/shorts/$id/soundtrack.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -c:a aac -b:a 256k -shortest -movflags +faststart work/shorts/$id/claude-duet-short-$id.mp4
done
```

| File | Job |
|---|---|
| `prep/shorts.py` | Which spans of the long voice-over each Short uses, joined with short beats; word timings moved to the Short's clock and spelled for captions |
| `shorts.html`, `shorts.css`, `shorts.js` | The vertical edit, one builder per Short, with word-by-word captions and an end card that points to the full video |
| `lib.js` | The timeline helpers the long video and the Shorts share |
| `shorts-stills.js` | Single frames of one Short for checking |
