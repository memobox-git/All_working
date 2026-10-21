# Short 02: 20 video effects made by Claude

**Shot:** a talking-head clip where every few seconds a different effect is applied to the same footage. It copies @taki.gpt's "20 Video Effects Created by Claude" (TikTok, 38.5K views, 381 comments, 3,014 saves on 21 October 2026). The comments came from a "comment EDIT" call to action.
**Words:** about 75 · **Length:** about 55 seconds (the list is read slowly, so the effects have time to play)
**Needs:** Chris alone, one take of about 1 minute, plus one screen recording.

---

## How the original is built

- **One take.** He says the prompt, then reads out 20 effect names. Each name gets about 1.8 seconds with that effect applied to his own footage.
- **Fixed header** for the whole video: "20 Video Effects Created by Claude", plus a label under it with the number and name of the current effect ("05 Checklist Pop").
- **Captions** one word at a time, big and bold, near the bottom.
- **Cut-out of the person.** Background removal runs over the whole clip, so graphics can go behind him. Nine of the 20 effects need it.
- **Graphics written as code** (HTML or React, animated), rendered over the footage.
- **Outro** (last 15 seconds): "Comment EDIT" banner, a mock-up of the editor ("Drop your raw video here"), a comment bubble and his profile tag.

---

## Filming

- **Phone:** vertical, on a tripod at chest height, about 1 metre away. Frame from just above your head to your chest.
- **Light:** a window beside you, or one soft light at 45 degrees.
- **Background:** leave a metre or more between you and the wall. A clear gap makes the cut-out much cleaner.
- **Delivery:** one take, looking into the lens. Read the list **slowly**: after each effect name, count "one-and" in your head before the next. Each name needs about 2 seconds on screen.
- **Hands:** keep them low and still during the list. Moving hands make the cut-out flicker.

**Also record:**

| Clip | What to record |
|---|---|
| A | Your screen while you type the prompt below into Claude and send it (10–15 seconds). Used in Chat takeover and B-roll overlay. |

---

## Script

| Time | Chris says | On screen |
|---|---|---|
| 0:00 | Claude, here's my raw video. Edit it and add these effects. | Header "20 Video Effects Created by Claude" pops in, with the 20 names beside you. Captions start. |
| 0:04 | Orbit. Chat takeover. Frame escape. Snap zoom. Checklist pop. | Effects 1–5, one per name, label changes with each. |
| 0:14 | Headline storm. Zoom portal. Growth curve. Studio reveal. B-roll overlay. | Effects 6–10. |
| 0:24 | Paper cutout. Dolly zoom. Magazine cover. Liquid glass. Zoom-through cut. | Effects 11–15. |
| 0:34 | Green screen. Frame break. Digital zoom. Phone mockup. Checklist. | Effects 16–20. Checklist ticks off all 20 names. |
| 0:44 | Every one of these was made by Claude. No editing app, no timeline. You just drop in your raw video, tell Claude what you want, and get a fully edited video back. | "Comment EDIT" banner. The 20 names come back with "+50 more", then the AI editor card on "no", the drop zone on "drop", the prompt box on "tell", and a phone with the finished video on "get". |
| 0:54 | Comment EDIT and I'll send you the prompt and all 20 effects. And follow me to stay ahead in AI. | Comment box types "EDIT" and sends. Your profile tag on "follow". |

---

## The 20 effects

**Cut-out** means the effect needs the background-removed layer of Chris.

| # | Effect | What happens | Cut-out |
|---|---|---|---|
| 1 | Orbit | The 20 effect names circle around your head, passing behind you and in front | Yes |
| 2 | Chat takeover | The video shrinks into a chat window, with the prompt typed above it (clip A) | |
| 3 | Frame escape | The video sits in a tilted white photo frame, and your head comes out past its edge | Yes |
| 4 | Snap zoom | A fast punch-in, about 1.4x in 4 frames | |
| 5 | Checklist pop | A white card with a ticked box ("Edit ✓") pops in beside you | |
| 6 | Headline storm | Tilted news banners fly across the frame ("CLAUDE NOW EDITS VIDEO") | |
| 7 | Zoom portal | A circle with an amber ring opens on you and zooms to fill the screen | |
| 8 | Growth curve | The room goes dark and a rising line chart draws behind you | Yes |
| 9 | Studio reveal | The room swaps to a dark studio with two lights and an "ON AIR" sign | Yes |
| 10 | B-roll overlay | Clip A slides in over the top half of the frame | |
| 11 | Paper cutout | You become a sticker with a white outline on an amber background with shapes | Yes |
| 12 | Dolly zoom | You stay the same size while the room behind you stretches away | Yes |
| 13 | Magazine cover | You on a magazine cover, with the big title behind your head | Yes |
| 14 | Liquid glass | A frosted-glass panel slides across and bends the picture behind it | |
| 15 | Zoom-through cut | The camera rushes into one point and comes out in the next shot | |
| 16 | Green screen | The room is replaced with a city skyline at dusk | Yes |
| 17 | Frame break | The video sits in a panel, and your head breaks over its top edge | Yes |
| 18 | Digital zoom | Camera viewfinder (REC dot, corner marks, timecode) with a slow zoom | |
| 19 | Phone mockup | The video shrinks into a phone screen | |
| 20 | Checklist | All 20 names appear in two columns and tick off one by one | |

---

## Edit

1. **Transcript:** word timings from the voice, the same way `source/asks/audio/*.transcript.json` is made. Each effect starts on the first letter of its name.
2. **Cut-out:** run background removal over the whole clip to get a transparent layer of Chris.
3. **Effects:** one HTML and GSAP scene with all 20 effects, reading the footage, the cut-out layer and the word timings, rendered with `source/render-pro.js` at 1080×1920.
4. **Header and labels:** "20 Video Effects Made by Claude" at the top for the whole video. The label under it shows the effect number in an amber box and the name in a white pill.
5. **Captions:** one word at a time, bold, white with a dark outline, at about 80% of the way down.
6. **Sound:** even out the volume. No music.
7. **Export:** one 1080×1920 file for YouTube, Instagram and TikTok.

---

## Upload

| Field | Text |
|---|---|
| YouTube title | Claude Edited This Video With 20 Effects |
| Pinned comment | Comment EDIT and I'll send you the prompt. |
| Instagram and TikTok caption | I gave Claude my raw video and one prompt. These are the 20 effects it made. Comment EDIT for the prompt. #claude #ai #videoediting #aitools |

---

## For Chris to check

- **"Comment EDIT and I'll send you the prompt and all 20 effects"** means you need something ready to send, and someone to reply to every comment.
- **Keep the 20 effect names word for word.** The edit finds each name in what you say and starts that effect on it.
