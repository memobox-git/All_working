# Stackle video graphics

- `scripts/` holds the video scripts, each with its research brief, filming labels and graphics list.
- `graphics/` holds the rendered clips, ready to drop into the edit. `graphics/de-2026/` is the data engineer video and `graphics/ds-2026/` is the data scientist video.
- `source/` holds what they are made from: HTML motion graphics (`intro.html`, `cta.html`) and the Excalidraw animation pipeline in `source/excali/`.

## Excalidraw scenes

Each scene is a real Excalidraw file, drawn stroke by stroke with Excalidraw's own engine (rough.js) and font (Excalifont).

```bash
cd stackle-video/source && npm install
node excali/build.js excali/scenes/de-2026/03-skills.js          # writes 03-skills.excalidraw
node render.js excali/scenes/de-2026/03-skills.excalidraw ../graphics/de-2026/03-skills.mp4
node render.js excali/scenes/de-2026/card-a-checks.excalidraw ../graphics/de-2026/card-a-checks.mov
node excali/storyboard.js sheet.png excali/scenes/de-2026/*.excalidraw   # one picture of every scene
```

- Open any `.excalidraw` file at excalidraw.com to look at it or change it, then render it again.
- Each element's `customData` holds its timing: `at` is the second it starts drawing, `dur` is how long it takes, and `out` (optional) is when it fades away. Elements added in the editor without timing draw one after another.
- Frames are the camera. At a frame's `at`, the view glides to that frame over `dur` seconds.
- A scene `.js` file rebuilds its `.excalidraw` file, so edit one or the other, not both.
- Excalifont comes from the Excalidraw project under the SIL Open Font License 1.1.

## Writing a scene

Scenes use `excali/kit.js` for shapes and `excali/doodles.js` for small icons (database, cloud, person, laptop, clock, table, check, cross).

- `s.say(line)` takes the script sentence. What follows starts drawing when Chris starts saying that line, at about 150 words a minute. After the recording, the same lines can be timed to the real voice.
- `s.settle()` waits until the voice has finished, for example before the camera pulls back.
- `s.cut()` marks a point where Chris is on camera. `render.js` then writes one numbered clip per part, such as `07-interviews-1.mp4` and `07-interviews-2.mp4`.
- `shift(s, dx, dy)` draws one zone of a big board in its own 1920 × 1080 coordinates.
- A `.mov` output is transparent, for cards that sit beside Chris.
