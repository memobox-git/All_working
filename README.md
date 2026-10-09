# Folio Studio

Drop a resume and watch a portfolio website design and build itself, live, in front of you.

1. **Upload** a PDF, DOCX or TXT resume (or paste the text), pick a style, and optionally add notes.
2. **Watch it build.** Claude reads the resume, and its design plan streams into the activity panel. It picks a name, palette, fonts and highlights, then writes the site section by section. The preview renders each section as it arrives and scrolls along with the build. Switch to **Code** to see the HTML being typed.
3. **Ship it.** Download the single HTML file, open it full screen, or **Publish** to a live Netlify URL (and connect the person's own domain there).

## Run it

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Without an API key the app runs in **demo mode** and replays a recorded build of a sample resume, so you can show the experience offline. "Watch a sample build" always plays the demo.

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Required for live builds |
| `ANTHROPIC_WORKSPACE_ID` | Only if your key isn't scoped to a workspace |
| `PORTFOLIO_MODEL` | Defaults to `claude-opus-5-5` |
| `PORTFOLIO_EFFORT` | `low` (fastest, default), `medium` or `high` |
| `NETLIFY_AUTH_TOKEN` | Enables one-click Publish |

## How it works

- `app/api/build/route.ts` sends the resume to Claude (PDFs go in natively as documents; DOCX is converted to text with mammoth) and streams the reply back as NDJSON events: `thinking`, `html`, `done` and `error`.
- `lib/prompt.ts` asks Claude to emit a `<!--@profile {...}-->` comment first, then the `<head>` with all the CSS, then each section preceded by `<!--@step Label-->`. The studio turns those markers into the design card and build checklist.
- `app/page.tsx` writes the HTML into the preview iframe with `document.write` as each chunk arrives, so the browser renders the page progressively, the way it would on a slow network.
- `app/api/publish/route.ts` creates a Netlify site and uploads `index.html` through Netlify's file-digest deploy API.
- `fixtures/demo-portfolio.html` is the recorded build that demo mode replays.

## Video shorts skill

`.claude/skills/video-shorts/` is a Claude Code skill that turns an idea into a finished 1–3 minute short:
script (Stackle script skill) → your HeyGen avatar speaking in your cloned ElevenLabs voice → motion-graphic
B-roll, picture-in-picture, split screens, captions, music and sound effects → vertical 9:16 and horizontal 16:9 MP4s.

One-time setup on your computer (needs Node 18+ and ffmpeg):

```bash
git clone https://github.com/memobox-git/all_working.git
cd all_working
node .claude/skills/video-shorts/scripts/setup.mjs
```

Setup creates `.env` in this folder and opens it. Paste your ElevenLabs and HeyGen API keys, save,
and run setup again: it finds your cloned voice and lists your avatars. Then in Claude Code, in this
folder, say: *"make a 1-minute short about …"*. Videos land in `~/Desktop/shorts`.
