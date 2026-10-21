# 20 Video Effects Created by Claude

A remake of @taki.gpt's "20 Video Effects Created by Claude" TikTok, on your own footage. You film one take reading the effect names; this folder turns it into the edit: word-by-word captions, the "20 Video Effects" header with a numbered label per effect, all 20 effects timed to the moment you say each name, and the "Comment EDIT" ending.

Output: one 1080×1920, 30 fps MP4 for TikTok, Reels and Shorts. The soundtrack is your voice over a 120 BPM beat built on the edit's own timing (one bar per effect, so every switch lands on a downbeat) and a sound effect for each animation, with the music ducking whenever you talk, at -14 LUFS. The music and sounds are synthesised in `music.py`, so they are free to use.

## What to film

One take, phone vertical, framed from just above your head to your chest, a metre or more in front of the wall. Read slowly, with a short pause after each name:

> Claude, edit this video and add these effects.
> Orbit. Chat takeover. Frame escape. Snap zoom. Checklist pop. Headline storm. Zoom portal. Growth curve. Studio reveal. B-roll overlay. Paper cutout. Dolly zoom. Magazine cover. Liquid glass. Zoom-through cut. Green screen. Frame break. Digital zoom. Phone mockup. Checklist.
> If you want all of these AI video editing effects, plus a dedicated AI video editing employee, so you just drop in your raw video file, enter a prompt and get a fully edited video out, comment the word EDIT and I'll send you everything. And if you want to stay ahead in the world of AI, give me a follow.

Optional: a 10–15 second screen recording for the B-roll effect. Without one, the B-roll effect shows an editor window with your footage in it.

## Make it

```bash
cd stackle-video/source && npm install
cd effects20
python3 -I prep/cut.py ~/raw.mov keep.json ~/cut.mp4   # optional: keep only the good parts of the take
./prep/prep.sh ~/cut.mp4 [~/screen.mp4]   # frames, cut-outs, word timings: about 15 minutes for a minute of video
node stills.js work/stills                 # one still per effect on work/stills/sheet.jpg, to check the look
./build.sh work/final.mp4 --sub 2          # renders the video (about 11 minutes; --sub 1 for a fast draft)
```

`keep.json` lists the `[start, end]` seconds worth keeping, in order: the intro, about 2 seconds from the start of each effect name, and the best take of the call to action. Cut in the pauses; `cut.py` also writes where the cuts land, and the edit switches effects on them so the jumps don't show.

If Whisper mishears a word, fix it in `work/transcript.json`, then run `node ../kit/make-cues.js work/transcript.json 0 work/cues.js`.

Python needs `faster-whisper onnxruntime opencv-python-headless numpy`. The cut-out and speech models download once into `~/.cache` (MODNet, Apache-2.0) and `~/.cache/huggingface` (Whisper small.en, MIT).

## How it fits together

| File | Job |
|---|---|
| `prep/cut.py` | Keeps the good parts of a take and records where the cuts land |
| `prep/prep.sh` | Footage to `work/`: frames, cut-outs, voice, word timings, `meta.js`, `cuts.js` |
| `prep/matte.py` | Cuts the person out of every frame (MODNet; `--model birefnet` is cleaner but about 25 s a frame on CPU) |
| `prep/transcribe.py` | Word timings with Whisper, written in the ElevenLabs shape so `../kit/make-cues.js` reads them |
| `prep/plate.py` | The empty room (for the dolly zoom), a face crop (profile tag), and where the face is |
| `config.js` | Your handle, name, magazine title and the on-screen words |
| `index.html`, `style.css` | The pieces of every effect |
| `scene.js` | The edit: finds each effect name in the transcript and draws each frame |
| `stills.js` | Stills and a contact sheet without a full render |
| `timing.js` | Reads the effect, ending and sound-cue times from the edit into `work/timing.json` |
| `music.py` | The beat, the sound effects and the mix with the voice, to `work/soundtrack.wav` |
| `build.sh` | Renders with `../render-pro.js`, then makes and lays on the soundtrack |

## Changing things

- **Your name and handle:** `config.js`.
- **Timing:** effects follow the words, so a new take needs no changes. If Whisper mishears a name, that effect is placed between its neighbours.
- **The ending:** it follows the call to action you say. Each part starts on its word (`PARTS` in `scene.js`): the editor card on "plus", the drop zone on "just" or "drop", the prompt box on "enter", "tell" or "send", the phone on "get" or "fully", the comment box on "comment", and your profile tag on "follow". A part you don't say is left out.
- **An effect's look:** each effect is one function in `scene.js` (`orbit`, `chat`, `escape`, …) and one block in `style.css`, both marked with the effect's number.
- **Colours:** the variables at the top of `style.css`.
