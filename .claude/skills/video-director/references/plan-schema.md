# plan.json format

`scripts/build_board.py` turns this file into the director's board. Only `title` and `shots` are required. Any section you leave out is skipped. `assets/example-plan.json` is a complete example.

## Contents
- Top level
- meta
- vision
- beats
- shots
- frame (storyboard diagrams)
- script
- tools and budget
- risks, workflow, checklist
- assumptions, questions, changes

## Top level

```json
{
  "title": "What is a data pipeline? (in 6 minutes)",
  "logline": "One sentence that sells the video.",
  "version": 1,
  "meta": {}, "assumptions": [], "questions": [],
  "vision": {}, "beats": [], "shots": [], "script": [],
  "tools": [], "budget": {}, "risks": [], "workflow": [], "checklist": [], "changes": []
}
```

## meta

| Field | Example | Notes |
|---|---|---|
| platform | "Instagram Reels" | |
| length | "0:30" | Shown as Runtime. Compared with storyboarded time. |
| aspect | "16:9" | One of 16:9, 9:16, 1:1, 4:5, 4:3, 21:9, 2.39:1. Sets every frame's shape. |
| audience, goal, budget, deadline, crew | strings | Shown as chips in the header |
| currency | "$", "₹", "£", "€" | Prefix for every cost |
| date | "2026-10-11" | Date the prices were estimated |
| safe_zones | true | For 9:16, shades the bottom and right areas that platform UI covers. Default true. |
| wpm | 150 | Speaking pace used to time the script |

## vision

```json
{
  "intent": "Make the viewer feel 'oh, that's all it is'.",
  "tone": ["calm", "clear"],
  "look": "...", "camera": "...", "light": "...", "type": "...", "edit": "...", "sound": "...",
  "palette": [{"hex": "#0F1115", "name": "Ink"}],
  "references": ["Style descriptions, not specific videos to copy"]
}
```

## beats

```json
{"name": "Hook", "start": "0:00", "end": "0:15", "purpose": "State the problem", "feeling": "curious"}
```
Times accept `"m:ss"` or seconds. The timeline bar is drawn in proportion to each beat's length.

## shots

| Field | Example | Notes |
|---|---|---|
| id | "3" or "3b" | |
| beat | "Extract" | |
| time | "0:45-0:55" | The duration is computed from it, or set `duration` in seconds |
| size | "MCU" | WS, MS, MCU, CU, ECU, OTS, insert, overhead, full-screen graphic... |
| angle | "Eye level" | |
| move | "Push in" | Also drawn on the frame unless `frame.move` overrides it |
| lens | "1x (26mm)" | Phone lens names are friendlier for beginners |
| visual | "What we see" | |
| audio | "Voice-over or dialogue, word for word" | Spoken words only, so the word count and timing stay right. Builds the script table when `script` is absent. |
| sound | "Whoosh; music drops out" | Music, effects and ambience cues |
| onscreen | "Text on screen" | |
| transition | "Match cut to shot 4" | |
| method | "Live action" | Live action, screen recording, motion graphics, stock, AI video, AI image + parallax, AI avatar, 2D animation, 3D, archive |
| tools | ["iPhone", "Tripod"] | |
| how | ["Step 1", "Step 2"] | Numbered steps a beginner could follow |
| effort | "30 min" | |
| cost | 0, 25, "15-25", or "varies" | Ranges are summed as ranges |
| feasibility | "green", "amber", "red" | Amber and red need `fallback` or `alternatives` |
| risk | "What could go wrong" | |
| fallback | "What to do instead" | |
| alternatives | see below | Used in fix mode |
| status | "dropped" | Keeps a replaced shot on the board, greyed out, for before/after. Dropped shots are left out of counts, the script and warnings. |
| frame | see below | The storyboard diagram |

Alternatives, with the chosen one marked:
```json
"alternatives": [
  {"option": "Stock aerial clip", "how": "Licensed 4K city aerial at sunset", "cost": "0-60", "effort": "30 min", "fidelity": 4, "pick": true},
  {"option": "Google Earth Studio flyover", "how": "Free; needs on-screen attribution", "cost": 0, "effort": "2 h", "fidelity": 3}
]
```

## frame

A frame is a composition diagram. Coordinates are fractions of the frame: `x` 0 is the left edge and 1 is the right edge; `y` 0 is the top and 1 is the bottom. The faint rule-of-thirds grid is drawn automatically, so place key subjects near 0.33 or 0.67.

```json
"frame": {
  "bg": "room",
  "move": "push in",
  "elements": [
    {"kind": "person", "size": "mcu", "x": 0.62, "facing": "left", "label": "You"},
    {"kind": "text", "style": "title", "text": "20 places", "x": 0.08, "y": 0.15, "w": 0.4, "accent": true}
  ]
}
```

**bg**: `plain`, `room` (wall and floor), `desk` (desk surface at the bottom), `outdoor` (horizon), `city` (skyline), `studio` (curved backdrop), `grid` (dark motion-graphics canvas), `dark`.

**move**: `static`, `push in`, `pull out`, `zoom in`, `zoom out`, `pan left`, `pan right`, `tilt up`, `tilt down`, `track left`, `track right`, `crane up`, `crane down`, `drone rise`, `orbit`, `handheld`, `gimbal follow`, `whip pan`, `rack focus`. If left out, the shot's `move` is used.

**Element kinds**

| kind | Fields | Draws |
|---|---|---|
| person | `size` (`ews`, `ws`, `fs`, `ms`, `mcu`, `cu`, `ecu`), `x`, optional `y`, `facing` (`front`, `left`, `right`, `away`), `label`, `highlight` | A figure framed at that shot size. Full body for ews/ws/fs, bust for ms and closer. `facing` moves the eyes to show eyeline. |
| shoulder | `side` (`left`, `right`) | A dark foreground head and shoulder for over-the-shoulder shots |
| screen / monitor / laptop / phone | `x`, `y`, `w`, `h` (top-left and size), `content` (`ui`, `code`, `chart`, `video`, `face`), `label`, `stand` (monitor only) | Devices for screen recordings, UI demos and video calls |
| text | `text`, `style` (`title`, `big`, `body`, `label`, `caption`, `lower-third`), `x`, `y`, `w`, `align`, `accent`, `box` | On-screen text. `caption` is centered at the bottom; `lower-third` is a name bar. |
| object | `shape`, `x`, `y` (where it sits), `s` (height as a fraction of the frame), `w`, `label`, `label_at` (`below`, `above`; automatic by default), `accent` | Shapes: `box`, `paper`, `hand`, `building`, `tree`, `mountain`, `sun`, `cloud`, `candle`, `bottle`, `mug`, `plant`, `car`, `desk`, `window`, `door`. Use `box` with a `label` for anything else (a product, a logo, an app icon). |
| chart | `x`, `y`, `w`, `h`, `values`, `type` (`bar`, `line`), `label` | A data graphic |
| arrow | `from` [x, y], `to` [x, y], `label` | Movement of a subject or an animated element inside the frame (dashed). Camera moves use `move` instead. |

**Raw SVG**: for anything the elements can't express, add `"svg": "<circle cx='160' cy='90' r='20' class='f-obj'/>"`. The viewBox is 320×180 for 16:9, 180×320 for 9:16, 240×240 for 1:1, 240×300 for 4:5. Use the classes `f-fig`, `f-obj`, `f-accent-fill`, `f-text`, `f-label`, `f-line`, `f-move` so it follows the theme.

Tips for frames that read well:
- One idea per frame. If a frame needs a paragraph to explain, split the shot.
- Leave empty space where text or graphics will go and put the text element there, so the person sees that the layout works.
- Show the end position of a move. For a push-in, the dashed box is where the frame lands, so the subject should fit inside it.
- For 9:16, keep text and faces out of the shaded platform UI zones. Short words read best; centre on-screen text so it clears the camera-move tag in the top corner.
- Text with `box: true` stays readable on dark frames; use it for titles over `grid` or `dark` backgrounds.

## script

Optional. Use it when spoken lines don't map one-to-one to shots. Otherwise the script table is built from the shots.
```json
{"time": "0:00", "shot": "1", "visual": "...", "audio": "spoken words", "sound": "music and effects", "onscreen": "..."}
```

## tools and budget

```json
"tools": [
  {"name": "DaVinci Resolve", "category": "Edit", "use": "Cut, grade, captions", "plan": "Free", "cost": 0, "alt": "CapCut desktop"}
],
"budget": {
  "tiers": [{"name": "Lean", "summary": "Owned gear + free software"}, {"name": "Standard", "summary": "..."}, {"name": "Premium", "summary": "..."}],
  "line_items": [
    {"item": "Microphone", "costs": {"Lean": 0, "Standard": "20-30", "Premium": "150-250"}, "note": "Lean uses phone voice memo"}
  ],
  "note": "Prices approximate as of October 2026; check before buying."
}
```
Tier totals are summed from `line_items` unless a tier sets `total`. A cost that is text ("quote needed") shows as written, and the total gets a "+".

## risks, workflow, checklist

```json
"risks": [{"risk": "Echo in the room", "impact": "High", "likelihood": "Medium", "plan_b": "...", "plan_c": "..."}],
"workflow": [{"stage": "Shoot", "time": "Day 3", "owner": "You", "steps": ["...", "..."]}],
"checklist": ["Phone storage cleared", "Exposure locked"]
```

## assumptions, questions, changes

```json
"assumptions": ["You film on an iPhone"],
"questions": ["Is the logo animation required?"],
"changes": [{"date": "2026-10-12", "shot": "3", "was": "Drone flyover", "now": "Stock aerial + push-in", "why": "No drone; airspace restricted"}]
```
In fix mode, always add a `changes` entry and raise `version`.
