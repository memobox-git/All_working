# Hero Demo: Final Voiceover Script

- Length: about 60 seconds (97 words, read slowly, with pauses over the footage)
- Voice: the founder's ElevenLabs professional clone, "Crispus Roshan" (voice_id lPAleXPy4oyz3kXDyTSc). We generate it only after the founder says yes.
- Footage: the founder's screen recordings of the clickable penguin prototype (https://claude.ai/artifact/L4FSSyvqWQuqw5439xB7yV, private), or Building OBIE's recordings of the live app, saved in obie/docs/marketing/video/raw/.
- Rule: only record screens that show what Version 1 actually does: voice, plan, credits, approve and drafts. Leave out prototype-only features, such as chicks growing up and live sending, or label them "Coming soon" on screen.

## Voiceover (text to send to the voice generator)

I run my business on my own. This is my team.

I tell OBIE what I need. One voice note.

My Marketing agent turns it into a plan. Which agents are on it, every task, and what it will cost, before anything runs.

I approve the plan.

Each task goes to a chick that does one job, then waddles off. I can watch the work happen.

When it's done, the drafts land in Needs you. I read them, change a word, and approve. Nothing goes out until I tap.

That's OBIE. One business. Infinite employees.

Get early access.

## Shot list with timings

| # | Time | Shot (from the live app) | On-screen caption |
|---|------|--------------------------|-------------------|
| 1 | 0:00–0:05 | The workspace with OBIE, the little blue penguin, at the top of the sidebar | I run my business on my own. |
| 2 | 0:05–0:13 | Tap the mic in the Marketing DM, OBIE listens with its headset on, and the transcript fills in: "Draft five LinkedIn posts about getting hired as a data engineer, by Friday." | One voice note. |
| 3 | 0:13–0:24 | A new channel appears, the plan message shows subagents and tasks, and the approval card shows total credits | A plan, with the cost up front. |
| 4 | 0:24–0:28 | Tap Approve on the plan card | I approve the plan. |
| 5 | 0:28–0:38 | Threads fill in, mochi chicks pick up tasks and waddle off, and pills go from Waiting to Working to Done | One chick. One task. |
| 6 | 0:38–0:52 | The Needs you page shows the drafts. Open one, edit a word, tap Approve | Nothing goes out until I tap. |
| 7 | 0:52–1:00 | The penguin colony on a white background with the OBIE wordmark and the line "You work alone. OBIE doesn't." | Get early access. |

## Edit specs
- Captions: burned in, white text on a semi-transparent black bar, with key words highlighted in yellow and blue accents. Use Plus Jakarta Sans Bold, or the closest available bold sans if the font file isn't in the container. No emojis.
- 16:9 (1920x1080) for the landing hero, saved as obie/public/hero.mp4, plus a poster at obie/public/hero-poster.jpg (frame from shot 3). Muted autoplay works because the captions carry the message.
- 9:16 (1080x1920) for LinkedIn: phone recordings fill the frame, with captions in the middle third.
- Export H.264 with AAC audio, faststart flag on, and keep the hero file under 8 MB.
