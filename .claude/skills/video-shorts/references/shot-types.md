# Shot types

A shot = a **layout** (where the speaker and graphic sit) + an optional **graphic** (what's on screen).
Combining them gives the full catalog. All layouts adapt automatically to 9:16 and 16:9.

## Layouts

| Layout | What you see | 9:16 | 16:9 | Needs graphic |
|---|---|---|---|---|
| `aroll` | Speaker full frame | Avatar fills frame | Avatar standing center over the backdrop | no (ignored) |
| `pip` | Graphic, speaker in a corner | Graphic top, avatar cut-out bottom corner | Graphic left, avatar cut-out right | yes |
| `split` | Half graphic, half speaker | Graphic top / speaker bottom | Graphic left / speaker right | yes |
| `broll` | Graphic only, voice-over | Full frame | Full frame | yes |

Speaker = your HeyGen avatar by default (keyed cut-out, so it floats on the backdrop),
or a real camera clip when the shot has `clip` (shown full frame, or as a framed card in `pip`).

Extras on any shot:
- `punchIn: true`: quick zoom-in on the speaker (emphasis, hook, punchline). Best on `aroll`.
- `lowerThird: {"name": "...", "title": "..."}`: name tag slides in for ~3 s.
- `pipCorner`: `bottom-right` (default) | `bottom-left` | `top-right` | `top-left`.
- `sfx`: `whoosh` | `pop` | `click` | `impact` | `riser` | `ding`, or `false` for none.
  Default: a whoosh whenever the graphic type changes.

## Graphics

| `kind` | Use for | Fields |
|---|---|---|
| `title` | Hook, section header | `title`, `subtitle?` |
| `kinetic` | Punchy line; words pop in as they're spoken (captions hidden on this shot) | `emphasis?: string[]` (words to make big and colored) |
| `quote` | A quote or strong one-liner | `quote`, `author?` |
| `stat` | One big number, counts up | `value`, `prefix?`, `suffix?`, `label`, `decimals?` |
| `chart` | Comparing a few numbers | `title?`, `bars: [{label, value}]`, `unit?`, `highlight?` (bar index) |
| `list` | 2–5 points revealed one by one | `title?`, `items`, `numbered?` (false → check marks) |
| `diagram` | Process / pipeline / steps | `title?`, `steps: string[]` (2–5) |
| `compare` | This vs that | `left: {title, items}`, `right: {title, items}` |
| `code` | SQL / Python / CLI snippet, typed on screen | `code`, `language?`, `title?` |
| `image` | A screenshot or picture the user provides | `src` (path), `caption?` |
| `cta` | Ending: follow / subscribe / link | `title`, `subtitle?`, `handle?` |

Keep text short: graphics are read in 2–4 seconds. Titles ≤ 6 words, list items ≤ 4 words,
diagram steps ≤ 2 words, code ≤ 6 lines.

## Recipes

- **Hook**: `aroll` + `punchIn`, or `broll` + `title`/`stat`.
- **Explain a concept**: `split` + `diagram`, then `aroll`.
- **Show proof**: `broll` + `stat`/`chart`, then `pip` with the takeaway.
- **Show how**: `pip` + `code` or `list`.
- **Punchline**: `broll` + `kinetic` with 1–2 emphasis words, or `aroll` + `punchIn`.
- **Ending**: `pip` + `cta`.
