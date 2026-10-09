# shotlist.json format

Full working example: `templates/example-shotlist.json`.

```jsonc
{
  "title": "Data engineering isn't dying",   // for your reference
  "slug": "de-not-dying",                     // output file names: <slug>-9x16.mp4, <slug>-16x9.mp4
  "captions": "karaoke",                      // "karaoke" (word-by-word) | "simple" | "none"
  "theme": { ... },                           // see below; omitted fields use defaults
  "music": {"prompt": "...", "volume": 0.12}, // or null for no music. volume 0.08–0.18 under voice
  "voice": {"stability": 0.45, "similarity": 0.8, "style": 0.25, "speed": 1.05}, // optional ElevenLabs tuning
  "shots": [ /* see shot-types.md */ ]
}
```

## Shot fields

| Field | Required | Notes |
|---|---|---|
| `layout` | yes | `aroll` · `pip` · `split` · `broll` |
| `say` | yes, unless `clip` | The exact words spoken during this shot |
| `graphic` | for pip/split/broll | See shot-types.md |
| `clip` | no | Path to a real camera clip (absolute, `~/…`, or relative to the project folder) |
| `clipFrom` / `clipTo` | no | Seconds; trim the clip. Default whole clip |
| `punchIn` | no | true → zoom on the speaker |
| `lowerThird` | no | `{"name": "...", "title": "..."}` |
| `pipCorner` | no | pip only |
| `sfx` | no | `whoosh` `pop` `click` `impact` `riser` `ding` or `false` |
| `id` | no | Auto `s01`, `s02`… |

`clip` without `say` → the clip plays with its own sound (auto-captioned).
`clip` with `say` → the clip plays muted under your narration.

## Theme

```json
{
  "bg": "#0b1020", "bg2": "#1a1440",
  "fg": "#f5f7ff", "muted": "#8a93b8",
  "accent": "#ffd23f", "accent2": "#5b8cff",
  "headingFont": "Montserrat", "bodyFont": "Inter",
  "backdrop": "grid"
}
```

- `bg` → `bg2`: background gradient. `fg`: main text. `muted`: secondary text and patterns.
- `accent`: highlights, active caption word, buttons. `accent2`: secondary bars.
- Fonts: `Inter` `Montserrat` `Poppins` `SpaceGrotesk` `BebasNeue` `PlayfairDisplay` `Anton` `DMSans` `Sora`.
- `backdrop`: `grid` · `dots` · `glow` · `plain`.

Keep strong contrast between `fg`/`accent` and `bg`. Pick a different look per video to match the topic:

| Mood | bg / bg2 | fg | accent / accent2 | Fonts | Backdrop |
|---|---|---|---|---|---|
| Tech, night | `#0b1020` / `#1a1440` | `#f5f7ff` | `#ffd23f` / `#5b8cff` | Montserrat / Inter | grid |
| Data, clean | `#0f172a` / `#0b3b4a` | `#e6f6ff` | `#22d3ee` / `#a78bfa` | SpaceGrotesk / Inter | dots |
| Career, warm | `#1c1210` / `#3a1d14` | `#fff4ea` | `#ff7a45` / `#ffc069` | Poppins / DMSans | glow |
| Bold, urgent | `#0a0a0a` / `#2a0a0a` | `#ffffff` | `#ff3b3b` / `#ffb4b4` | Anton / Inter | plain |
| Calm, explain | `#0e1a14` / `#173326` | `#effaf3` | `#4ade80` / `#93c5fd` | Sora / Inter | dots |
| Editorial | `#151515` / `#2b2620` | `#f7f2e9` | `#e9c46a` / `#a8dadc` | PlayfairDisplay / DMSans | glow |
| Light | `#f7f7fb` / `#e6e9f5` | `#14161f` | `#4f46e5` / `#f59e0b` | Poppins / Inter | grid |
