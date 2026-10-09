---
name: video-shorts
description: Turn an idea into a finished 1, 2 or 3 minute short video, fully automatically. The script is written with the Stackle script skill; the user's own HeyGen avatar (lip-synced to their cloned ElevenLabs voice) is the A-roll; B-roll is code-built motion graphics; shots mix A-roll, B-roll, picture-in-picture, split screen, real camera clips, titles, stats, charts, lists, diagrams, code, quotes and CTAs; ElevenLabs makes the music and sound effects; captions, edit and render are done here. Outputs vertical 9:16 and horizontal 16:9 MP4s. Use when the user asks to make, build, produce or render a short, a reel, a video, or "shots" from an idea or a script, or invokes /video-shorts.
---

# Video shorts

Idea in → finished video out. No approval stops: the user chose fully automatic.
Everything below runs on the user's computer, from the repo root.

## 0. Preflight (every time)

Run `node .claude/skills/video-shorts/scripts/setup.mjs`.
- Exit 0 → continue.
- Otherwise it prints exactly what's missing (and opens `.env` for them if keys are missing).
  Relay that in plain words and stop. Never ask the user to paste keys into chat; they go in `.env`.
  If they paste a key anyway, don't repeat it, tell them to put it in `.env` and to rotate it.

## 1. Read the request

From the user's message take:
- **Idea / topic** (required).
- **Length**: 1, 2 or 3 minutes (default 1). Narration runs ~150 words/min,
  so target ≈150 / 300 / 450 spoken words.
- **Real footage** (optional): paths to camera clips of the user. Use them as A-roll shots.
- Anything they say about look, captions or format. Otherwise decide yourself (step 3).

Project folder: `<OUTPUT_DIR>/<yyyy-mm-dd>-<slug>/` (OUTPUT_DIR is in `.env`, default `~/Desktop/shorts`).

## 2. Script

Use the **stackle-script** skill to write the script for the idea at the target length
(it does its own creator research in Chrome). Ask it for a spoken script only: no stage directions in the
spoken lines. Save it as `script.md` in the project folder.

If the stackle-script skill isn't available, write the script yourself: hook in the first sentence,
one idea per sentence, conversational, ends with a clear CTA.

## 3. Shot list

Convert the script into `shotlist.json` in the project folder. Format: `references/shotlist-format.md`.
Shot catalog and when to use each: `references/shot-types.md`.

Rules:
- Every spoken word of the script appears, in order, in some shot's `say`. Don't add or drop words;
  the narration is generated from the concatenated `say` fields.
- **Pace**: one shot per ~5–12 spoken words (≈2–4 s). A 1-min short ≈ 15–25 shots.
- **Hook** (first shot): `aroll` with `punchIn`, or a `broll` `title`/`stat` that states the hook.
- Mix: roughly 35% `aroll`, 35% `pip`/`split`, 30% `broll`. Never 3 identical layouts in a row.
- Put a `lowerThird` with the user's name on the first or second `aroll` shot.
- Numbers → `stat` or `chart`. Steps/process → `diagram` or `list`. Tools/code → `code`.
  This vs that → `compare`. Punchy line → `kinetic` or `quote`.
- Last shot: `cta` graphic (in `pip` or `broll`).
- **Look**: pick a theme per video that fits the topic (colors, fonts, backdrop). See the theme
  section of the format reference for ready-made palettes; vary them between videos.
- **Captions**: choose per video. `karaoke` (word-by-word) for punchy, fast videos;
  `simple` for calmer, explanatory ones.
- **Music**: write a `music.prompt` that fits the mood (genre, tempo, energy, "no vocals").
- Real clips from the user: `{"layout": "aroll", "clip": "<path>", "clipFrom": s, "clipTo": s}`.
  A clip shot with no `say` plays its own audio and is captioned automatically.

## 4. Build

```
node .claude/skills/video-shorts/scripts/build.mjs "<project folder>"
```
Optional: `--formats=9x16` or `--formats=16x9` if the user wants only one (default both).

This generates the narration (ElevenLabs, with word timings), your avatar (HeyGen, green screen, keyed
to transparent), sound effects + music (ElevenLabs), renders every format with Remotion, normalizes loudness
to -14 LUFS, and writes `captions.srt` and `cost.json`. The HeyGen render usually takes a few minutes; let it run.

Every paid step is cached. If something fails mid-way, fix it and re-run the same command; it
won't pay again for finished steps. If you change only graphics/layouts, the re-run costs nothing.
If you change any `say` text, narration and avatar are regenerated (paid).

If a build fails:
- Shot list validation errors: fix `shotlist.json` and re-run.
- API errors (401/403/quota): tell the user what the API said; don't retry in a loop.
- Render errors: read the error, fix, re-run.

## 5. Report

Tell the user, briefly:
- the paths of the MP4s (one per format) and `captions.srt`
- length, number of shots, theme and caption style you chose
- the estimated cost from `cost.json`
- optional: the title + description from the script, ready to paste

## Testing without spending credits

`build.mjs <folder> --mock` uses a silent voice, a placeholder avatar and a test tone instead of the
APIs, so you can check layouts and timing for free. Never present a mock render as the real video.
