# Stackle video graphics

- `graphics/` holds the rendered MP4s, ready to drop into the edit.
- `source/` holds what they are made from: HTML motion graphics (`intro.html`, `cta.html`) and the Excalidraw animation pipeline in `source/excali/`.

## Excalidraw scenes

Each scene is a real Excalidraw file, drawn stroke by stroke with Excalidraw's own engine (rough.js) and font (Excalifont).

```bash
cd stackle-video/source && npm install
node excali/build.js excali/scenes/portfolio.js                  # writes portfolio.excalidraw
node render.js excali/scenes/portfolio.excalidraw ../graphics/portfolio.mp4
```

- Open any `.excalidraw` file at excalidraw.com to look at it or change it, then render it again.
- Each element's `customData` holds its timing: `at` is the second it starts drawing, `dur` is how long it takes, and `out` (optional) is when it fades away. Elements added in the editor without timing draw one after another.
- Frames are the camera. At a frame's `at`, the view glides to that frame over `dur` seconds.
- A scene `.js` file rebuilds its `.excalidraw` file, so edit one or the other, not both.
- Excalifont comes from the Excalidraw project under the SIL Open Font License 1.1.
