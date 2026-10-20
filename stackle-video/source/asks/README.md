# Mid-video asks

Ten-second clips to drop into the middle of a video, voiced by the ElevenLabs "Crispus Roshan" voice, in the same page style as the intro.

| Clip | Use it in | Says |
|---|---|---|
| `graphics/stackle-ask-call.mp4` (8.6s) | Career and interview videos | "Quick pause. Not sure what your next career move should be? Book a free 15-minute call with me. The link is in the description." |
| `graphics/stackle-ask-de.mp4` (9.8s) | Data engineering videos | "Quick pause. Want to become a data engineer? Join my Data Engineering Masterclass and get job-ready in 10 weeks. The link is in the description." |
| `graphics/stackle-ask-ai.mp4` (10.1s) | AI engineering videos | "Quick pause. Want to become an AI engineer? Join my AI Engineering Masterclass and learn the skills companies hire for. The link is in the description." |

Each clip says "the link is in the description", so put the matching link in that video's description.

## Rebuild

```bash
./build.sh call                                                   # or de, ai
./build.sh call ../../graphics/stackle-ask-call-tall.mp4 --size 1080x1920   # vertical
```

## Changing things

- **Words on screen:** `ASKS` in `ask.js` (question, card title and line, and the spoken word each one appears on).
- **New voiceover:** replace `audio/<ask>.mp3` and `audio/<ask>.transcript.json` (an ElevenLabs transcript with word timings), then rebuild.
- **Layout:** `ask.css`. Shared fonts, colours, pen strokes and sounds are in `../kit`.
