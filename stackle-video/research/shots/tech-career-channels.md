# How the big tech-career Shorts are filmed and edited

Research for Stackle (Chris). Goal: copy the shots that work. This is about the camera, framing, setting, on-screen text, captions, graphics and edit pace, not about topics.

Checked on 2026-10-16. 17 Shorts from 8 channels (3 from Sajjaad Khader, 2 from each of the others), plus 1 bonus Hormozi Short.

Contact sheets are in `/home/user/All_working/stackle-video/research/shots/frames/`. Each Short has two images:
- `CHANNEL-ID.jpg`: 8 frames at 0.2 s, 1 s, 2.5 s, 5 s, 10 s, 40%, 70% and 1 s before the end, 4 x 2 grid, 270 px wide each, with the time printed on each frame. These come from YouTube's storyboard images (about 101 x 180 px each), so they are blurry.
- `CHANNEL-ID-hires.jpg`: up to 4 sharp 1080 x 1920 frames that YouTube picked from inside the video (3 auto-picked frames plus the cover thumbnail). These are the best images for reading captions and seeing the set. Their exact times are not known.

## How the numbers were made, and what did not work

- **Shorts lists and views.** I listed each channel's Shorts with `yt-dlp --flat-playlist` on 2026-10-16 and picked the top ones by view count. The view numbers in the table are YouTube's `view_count` field, read with yt-dlp on 2026-10-16. The one exception is Sajjaad's "Comp Sci Challenge": its metadata call failed, so its number is the rounded figure from the flat list (7.1M).
- **Video download was blocked.** Every client I tried failed. ios, android, android_vr, tv_simply and web_safari got "Sign in to confirm you're not a bot". tv got "page needs to be reloaded". mweb and web_safari returned images only. web_embedded listed video formats, but googlevideo returned HTTP 403 when I tried to download. A second ios try later in the session failed the same way. So **no video files were downloaded**, and nothing went into the repo.
- **Fallback used.** For each Short I downloaded YouTube's storyboard (format `sb0`, through the mweb client): sprite sheets of small frames, about one frame every 0.95 to 0.98 s. For the two Satish Shorts (over 2 minutes) it is one frame every ~2 s. Exaltitude's 2023 Short only had 50 x 90 px frames. Maddy's 10-second meme only had 48 x 27 px frames, so its contact sheet uses the 4 sharp YouTube frames instead. I also downloaded YouTube's auto-picked frames (`oar1/2/3.jpg`) and cover (`oardefault.jpg`) from i.ytimg.com. Storyboards, thumbnails and filmstrips are in the scratchpad only.
- **Length** is yt-dlp's `duration` field. Sajjaad's "Comp Sci Challenge" is the exception: its length comes from the `dur=43.264` value in a stream URL. I could not run ffprobe because there was no video file.
- **Cuts per 10 s.** I give two numbers:
  - `sb` = number of frames where ffmpeg's `select='gt(scene,0.3)'` fired on the storyboard frame sequence, divided by length x 10. This is a lower bound. Two cuts inside the same second count as one, and small punch-in zooms often do not trigger it.
  - `eye` = my own count of shot changes from a filmstrip of every storyboard frame. It is closer to the truth, but it is still a count at 1-second sampling.
  - For Maddy's meme I counted clip changes with a pixel-difference check on the tiny frames.
- **Spoken hook.** I could not get auto-captions. mweb said "subtitles require a PO Token", and the other clients were bot-blocked. So the "spoken" hook below is put together from the burned-in captions visible in the first 1 to 5 storyboard frames. It may miss words. Missing or unsure words are in [brackets].

## Main table

| # | Channel | Short title | Link | Views (yt-dlp, 2026-10-16) | Length (yt-dlp) | Cuts per 10 s | Shot type | Hook: on-screen (first 1-2 s) / spoken (from burned-in captions) | Caption style | Contact sheet |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sajjaad Khader | Comp Sci Challenge for $700 😭 | https://www.youtube.com/shorts/akwUFpbLoHM | 7.1M (flat list, rounded) | 43.3 s (stream URL) | sb 0.2 / eye ~0 (one take) | Outdoor handheld challenge, off-camera asker, cash prize | On-screen: "The HARDEST Comp Sci Challenge ‼️" at top all video, red box "Task: Explain Compilers" from ~4 s / Spoken: "[...] in college?? computer science 😮 [...] for $700 [...] explain what compilers are to me" | Small white bold italic, 1-3 words, centre-lower; jokes in asterisks ("*speaks French like a beast*") | frames/sajjaadkhader-akwUFpbLoHM.jpg (+ -hires.jpg) |
| 2 | Sajjaad Khader | Software Engineer Vs Data Science in 2025 👀 @meglovesdata | https://www.youtube.com/shorts/d8ob3mdgqBI | 2,986,629 | 32 s | sb 1.9 / eye ~2.2 | Two-person standing face-off with a guest, handheld mic | On-screen: white box "Software Engineer VS Data Science in 2025 😳" + role labels on chests / Spoken: no word captions burned in, not recoverable | No word captions. Answers appear as red chips under blue role labels | frames/sajjaadkhader-d8ob3mdgqBI.jpg |
| 3 | Sajjaad Khader | Amazon Software Engineer Salary Go CRAZY 😭 @ALifeEngineered | https://www.youtube.com/shorts/sd-qwA3ugyY | 2,833,652 | 56 s | sb 0.4 / eye ~0.4 | Seated two-shot at desk with a guest + salary board that fills in | On-screen: white box "INSANE SALARY Amazon PRINCIPAL Software Engineer 😭" + empty year board (2006 ... 2024) / Spoken: "[...] Software Engineer at Amazon" | Small white words mid-frame. Blue value chips, red breakdown chips | frames/sajjaadkhader-sd-qwA3ugyY.jpg |
| 4 | Maddy Zhang | Hope you had a romantic Valentine's Day with your code! #programmingmemes | https://www.youtube.com/shorts/3UvzmZPV-SY | 2,761,988 | 10 s | ~4 clip changes in 10 s (pixel diff) | Faceless meme: clips of couples, lock-screen look | On-screen: black box "Other people on Valentine's Day:" then "Software engineers:" / Spoken: none (music meme) | One label, white text in black rounded box, centre | frames/maddyzhang-3UvzmZPV-SY.jpg (sharp frames only) |
| 5 | Maddy Zhang | I got the AMD AI Halo!! (sponsored, "#AMD_Partner") | https://www.youtube.com/shorts/CF5cMoYaVHc | 737,590 | 63 s | sb 3.5 / eye ~4.0 | Seated desk talking head + product in hand + screen b-roll | On-screen: big yellow "Size" / Spoken: "Size doesn't matter when it comes to AI workstations. This is the AMD Ryzen AI Halo" | Small white sentence words + one big yellow italic serif keyword | frames/maddyzhang-CF5cMoYaVHc.jpg |
| 6 | Andrew Codesmith | You're a Software Engineer and can't work from home anymore | https://www.youtube.com/shorts/5Z8jDfsTGOQ | 3,056,147 | 63 s | sb 2.2 / eye ~3.5 | POV skit: him on bed vs laptop on a video call (boss off-screen) | On-screen: "POV: you're a Software Engineer and can't work from home anymore" (white, top third) / Spoken: "[...] and Andrew, if you can just stay on the call [...] from next week [...] coming in the office [...] you can't work from home anymore" | Small lime-green lowercase words, lower-middle, no box | frames/andrewcodesmith-5Z8jDfsTGOQ.jpg |
| 7 | Andrew Codesmith | POV: British people learning to code 🇬🇧 | https://www.youtube.com/shorts/O53A1ZCkjf4 | 1,615,206 | 21 s | sb 3.8 / eye ~5.7 | POV skit: side profile at desk + phone close-ups of the screen | On-screen: "POV: British people learning to code 🇬🇧" (white, drop shadow, centre) / Spoken: none seen (no speech captions) | Only the POV line and a "3 days later" card | frames/andrewcodesmith-O53A1ZCkjf4.jpg |
| 8 | Coding With Sagar | Python Interview Question for Bakery Management System | https://www.youtube.com/shorts/J2lN9lzoAQE | 6,318,311 | 51 s | sb 1.0 / eye ~1.4 hard cuts (the middle is non-stop animation) | Studio close-up with big mic + animated explainer with face bubble | On-screen: none in first 2 s (fade from black, floating Python logo) / Spoken: not recoverable (no word captions) | No word captions. Neon-yellow glowing titles in the animation | frames/codingwithsagar-J2lN9lzoAQE.jpg |
| 9 | Coding With Sagar | Get a password of Locked PDF in #pythonprogramming | https://www.youtube.com/shorts/A0Ed1QeiER4 | 4,382,782 | 48 s | sb 1.7 / eye ~2.9 | Story skit, he plays two roles + green-screen opener | On-screen: neon-yellow glitch "LOCKED PDF" at top (2 s) / Spoken: "A company asked our student Sagar [...] and was given a task of cracking the [locked PDF]" | Small white words + one big bold yellow keyword ("password", "unlock", "Python") | frames/codingwithsagar-A0Ed1QeiER4.jpg |
| 10 | Satish Dhawale | Excel trick that Saves lot of Time! | https://www.youtube.com/shorts/jEJpX335ZTc | 2,359,892 | 124 s | sb 0.2 / eye ~0.8 (2-s sampling) | Boss-employee skit opener, then camera on a big touch screen with his hand pointing | On-screen: none in first 4 s / Spoken (Hindi): "kya karke rakha hai yeh aapne" ("what have you done here?") | Big yellow bold keyword + smaller white words, lower-left (Hindi in Latin letters) | frames/satishdhawale-jEJpX335ZTc.jpg |
| 11 | Satish Dhawale | Wow! Transfer any Picture table to Excel in just 10 Seconds | https://www.youtube.com/shorts/UAcXUz-yILY | 781,246 | 141 s | sb 0.35 / eye ~0.7 (2-s sampling) | Prop (printed table) + filming the big screen, step labels | On-screen: no readable text at 0-2 s. Cover frame has title "...paper to Excel sheet in just 10 seconds" / Spoken: not readable | "STEP 1/2/3" yellow text with dark outline; hand-drawn yellow circle and arrow | frames/satishdhawale-UAcXUz-yILY.jpg |
| 12 | Ashish Pratap Singh | Resume that got me interviews at Amazon, Google & Microsoft | https://www.youtube.com/shorts/KUoHNaQ7RDo | 1,462,917 | 55 s | sb 1.5 / eye ~1.8 | Document walkthrough (his resume) + short talking-head bits | On-screen: "THIS IS THE RESUME" then "GET SHORTLISTED AT" + Google logo / Spoken: "This is the resume [...] get shortlisted at [Google ...] here is how I created it" | Uppercase white bold with dark outline, lower third; yellow highlighter on the document | frames/ashishps-KUoHNaQ7RDo.jpg |
| 13 | Ashish Pratap Singh | Most commonly asked topics in coding interviews | https://www.youtube.com/shorts/8E4JVTKcM24 | 341,071 | 20 s | sb 1.5 / eye ~2.0 | Faceless list that fills in on a coloured paper background | On-screen: "99% OF THE COMPANIES / WILL ONLY ASK QUESTIONS / FROM THESE TOPICS / IN A CODING INTERVIEW" / Spoken: same words (captions are the voiceover) | Uppercase white with yellow keywords; list items as yellow chips | frames/ashishps-8E4JVTKcM24.jpg |
| 14 | Jean Lee (Exaltitude) | Will Software Engineers Survive Against AI? | https://www.youtube.com/shorts/JKELBPybJ7o | 776,808 | 59 s | sb 1.4 / eye ~2.0 (50x90 px frames) | Close-up talking head by bright windows, holding a small mic, stock b-roll | On-screen: "AI vs Software Engineers" title with 3D emoji icons / Spoken: not readable at this size | White sentence-case, 2-4 words, centre-lower, thin outline; 3D sticker icons | frames/exaltitude-JKELBPybJ7o.jpg |
| 15 | Jean Lee (Exaltitude) | Math Basics required for AI & Machine Learning | https://www.youtube.com/shorts/uZt95OZ4WUU | 151,044 | 47 s | sb 3.2 / eye ~3.4 | Close-up talking head holding a mic + her cut-out over checklist pages and screenshots | On-screen = spoken: "IF YOU'RE A / SOFTWARE ENGINEER / LOOKING TO BREAK INTO AI OR / MACHINE LEARNING / BUT NOT SURE HOW MUCH MATH YOU NEED TO KNOW / DON'T WORRY I'VE GOT YOU COVERED" | Uppercase white bold on a pink-red box behind each phrase, centre-lower | frames/exaltitude-uZt95OZ4WUU.jpg |
| 16 | Alex Hormozi | You Need to Build the Right Foundation | https://www.youtube.com/shorts/DDRP89Lizrg | 9,539,461 | 54 s | sb 2.6 / eye ~4.6 | Prop metaphor: building towers from big toy bricks, many angles | On-screen = spoken: "IF I TOLD [you to build the] TALLEST TOWER IN 10 SECONDS HERE'S WHAT YOU MIGHT DO" + stopwatch and skyscraper icons | Big white uppercase condensed font, heavy black shadow, 2-3 words, centred on chest; some keywords yellow | frames/alexhormozi-DDRP89Lizrg.jpg |
| 17 | Alex Hormozi | Always Be Ready | https://www.youtube.com/shorts/SAG_Lqo-KBw | 8,766,307 | 55 s | sb 0.5 / eye ~0.5 (jump cuts in the same framing are hard to see) | Seated couch talking head, story + cut-out image pop-ups | On-screen = spoken: "AWHILE BACK / I ROLLED UP / TO A GAS STATION / IN A SUPERCAR" (+ car image) | Black bold uppercase on yellow box, 2-4 words, centred on chest | frames/alexhormozi-SAG_Lqo-KBw.jpg |
| bonus | Alex Hormozi | A Cheat Code at 34 I Wish I Knew at 24... | https://www.youtube.com/shorts/eT8gMOx8kQU | 4,917,472 | 18 s | sb 0.6 / eye 0 (one take) | Walk-and-talk toward camera, outdoors | On-screen = spoken: "A CHEAT CODE / AT 34 / THAT I WISH [I KNEW] / AT 24" | One word at a time, light-green glow, centred on chest | frames/alexhormozi-eT8gMOx8kQU.jpg |

### Hits I skipped (off-niche or not career/tech), from the flat list on 2026-10-16
- Alex Hormozi: "When I was single..." (9.0M, a food story about eating Chipotle; seated talking head), "Panda Express Protein" (8.2M), "I've eaten 200 grams of protein every day for 20 years" (6.8M). I used his top two business Shorts instead.
- Maddy Zhang: her two biggest tech Shorts (above) are a meme and a paid gadget video. Her career-style Shorts are much smaller: "I left @Google..." 34K, "Data science vs software engineering" 26K, "Resiliency as a SWE in 2026" 25K.

## Notes per Short: what makes the shot work

**1. Sajjaad, "Comp Sci Challenge for $700" (7.1M, his #1).** A man in a long dark coat stands on a suburban sidewalk next to a planter, at dusk, under a grey sky. The camera is handheld at chest height by the off-screen asker, whose hand comes into frame with cash and a phone. It is wide-angle with a slight fisheye bend. The picture sits in a 3:4 window with black bars top and bottom (12.5% each, measured on the 1080x1920 frame). It is one continuous take. The title and the red "Task" label stay at the top the whole time, so anyone who scrolls in at any second knows the game. From ~20 s a small diagram builds in the lower part as he answers: red "Source Code" with "Human Readable ✅ / Machine Readable ❌", then "Compiler" with a chip icon and a pointing-hand emoji, then green "Machine Code". It ends with the cash handover and the caption "You earned it": a payoff ending, no call to action. **Why it works:** money at stake plus a simple test makes tension in second 1. You learn the concept while you wait for the payoff.

**2. Sajjaad, "Software Engineer Vs Data Science" (3.0M).** Two people stand side by side in what looks like a hotel or event hall: wood panels, a purple-lit pillar, patterned carpet, a plant. A third person films at chest height from knees-up. Sajjaad holds a mic on a short pole. A white question box at the top changes every few seconds: "Average Salary⁉️", "TOP 3 SKILLS", "Who Should NOT Go Into Your Field?", "Will your field get replace by AI!?". Blue role labels sit on their chests with a red "VS". Each answer drops in as a red chip under the right person ("$123,000" vs "$125,000"; "Python, Java, JavaScript" vs "Python, Machine Learning, Statistics"; "Problem Solving, Coding" vs "Clients"). It punches in on whoever is talking and ends on a close-up of the guest mid-answer. **Why it works:** a scoreboard you can compare at a glance, and a new question every ~6 s.

**3. Sajjaad, "Amazon Software Engineer Salary" (2.8M).** A seated two-shot at a white desk, phone on a tripod at eye level, straight on, slatted light-wood wall behind. Both wear small clip-on wireless mics. Sajjaad leans into the lens for the first 3 s, then sits back while the guest tells his story. The salary board is on screen from second 0 with empty values (2006, 2008, 2009, 2012, 2020, and 2024 in green). Each number pops in as a blue chip, with red base-plus-stock breakdowns, ending at "$850,000/yr" for 2024. **Why it works:** the empty board is an open loop. You stay to see the last number. Almost no editing is needed: about one take.

**4. Maddy, Valentine's meme (2.8M).** No presenter. About 5 short clips of couples doing lifts, shown with a phone lock-screen clock over them. A black label in the middle reads "Other people on Valentine's Day:" and then "Software engineers:". The cover frame shows a woman lifting a laptop over her head. It is 10 s long, so people rewatch. The clips look like trend footage from other people (source unknown), so copying it means filming your own.

**5. Maddy, "I got the AMD AI Halo" (738K, paid).** A seated medium close-up at her desk: purple LED backlight, shelves with figures, monitors behind, a lav mic with a fuzzy windscreen on her chest. In the opening second she holds the box up to the lens. The edit is fast (about 4 cuts per 10 s, eye count). It cuts between her and close-ups of hands opening the box, a white three-item checklist ("Run a frontier model for local AI coding / Create images / Create our own music") that comes back as chapter markers, a spec page with yellow highlight bars, and phone footage of monitors showing the tools. It ends with a blue rounded box: "Link in my bio to get this workstation yourself!".

**6. Andrew, "can't work from home anymore" (3.1M, his #1).** A POV skit with two set-ups:
- Andrew on a bed in a bright bedroom with a wood headboard, phone on a tripod at bed height, medium to medium-close. He never looks at the lens.
- A side shot of a MacBook on a video call: a dark call screen with a "JB" tile, a green speaking frame and red leave buttons. This is the boss, voice only.

The POV line stays at the top for the opening. Small lime-green captions carry both voices. There are ~22 shot changes (eye count), switching on every line. It ends with him lying back, hands over his face. **Why it works:** every software engineer knows this pain, and the laptop as the "other actor" means he needs no second person.

**7. Andrew, "British people learning to code" (1.6M).** A locked side-profile shot at a white desk: laptop on a stand, white curtains, white cube shelves, very clean and bright. It is cut with handheld phone close-ups of the screen: CSS with British "colour", a ChatGPT "temporarily unavailable" error, green tests passing. A "3 days later" card shows him with messier hair (a visual joke). There is no talking. It ends with the sponsor line as the punchline: "Learn to code in American!! at coddy.tech". It is 21 s long with the fastest pace in this set (~5.7 cuts per 10 s, eye count).

**8. Sagar, "Bakery Management System" (6.3M, his #1).**
- 0-3 s: it fades in from black to a very close talking head. His face fills the top half, a big studio mic (Shure logo visible) sits in front of his chin, and behind him are a gaming chair, purple and pink light, a glowing monitor and a floating 3D Python logo.
- 4-32 s: a full-screen animated explainer on a black grid, with his face in a blue-ringed circle at the top. Cartoon icons (cake, clipboard), neon-yellow glowing text ("BMS – Bakery Management System", an order record), mind-map lines and an Excel icon build the program idea.
- Then a glitch transition back to his face, terminal and code screen recordings, and a white "LINK IN BIO" label.

No word captions are visible. **Why it works:** an "interview question" promise, then a cartoon you can follow without code.

**9. Sagar, "Locked PDF" (4.4M).** He plays two people: the narrator or interviewer in a black hoodie at the big mic, and "the student" in a grey hoodie filmed from the side. The first 4 s use a replaced (green-screen) city-tower background. Icons animate across the top (PDF → padlock → "PASSWORD" → "UNLOCK"), plus a meme photo insert, a cartoon "A Few Moments Later" card, a screen recording of the PDF password box, and a "HIRED" label. The captions are two-tier: small white words plus one big yellow keyword. It ends with neon "FOLLOW" and then "READ CAPTIONS" (go read the description for the course).

**10. Satish, "Excel trick" (2.4M, his #1).** Hindi, filmed in a training room in front of a large touch screen showing Excel, handheld by a camera person. It opens cold with a ~25 s boss-and-employee skit. Then come long over-the-shoulder shots of the screen with his hand and pen pointing, and a dark-green label "CTRL + H = Replace". The ending is a sales block: LIKE/SHARE/COMMENT stickers, "Excel / Power Bi" pills, a "skillcourse.in" pill, and stacked course cards. It is 124 s long, so it is a long Short. **Why it works:** a real work scene first, then a trick you can see on a big screen, with no screen recorder needed.

**11. Satish, "Picture table to Excel" (781K).** He holds a printed paper table up to the camera: the problem as a physical object. There is a hand-drawn yellow circle and arrow on the paper, he photographs it with his phone ("STEP 1: CAPTURE PICTURE"), then taps through Excel's "Data → From Picture" on the big screen ("STEP 2", "STEP 3"). He draws red pen circles on the touch screen itself. It ends with a subscribe sticker and a teaser: "POWER QUERY MASTERCLASS IS COMING SOON.....".

**12. Ashish, "Resume" (1.5M, his #1).**
- It opens on the thing itself: his resume, full screen, "THIS IS THE RESUME", "GET SHORTLISTED AT" with a Google logo flash.
- Then just ~2 s of him: seated at a desk, white office chair, grey t-shirt, glasses, eye contact, soft daylight ("HERE IS HOW I CREATED IT").
- The rest is slow pans across the resume, with a yellow highlighter wiping over each part as he talks, plus a black card with the "Accomplished X by implementing Y which led to Z" formula.
- It ends with an end card for his long video (thumbnail, "Check out the full video!", Subscribe button with a cursor click), so the Short is a trailer for long-form.

**13. Ashish, "Coding interview topics" (341K).** Faceless. It has 4 s of dark stock-style footage with "99% OF THE COMPANIES..." text. Then a cyan crumpled-paper background with a header label ("DATA STRUCTURES", then "ALGORITHMS") and yellow chips appearing one per beat. It ends on the full list, so people screenshot or save it.

**14. Jean Lee, "Will Software Engineers Survive Against AI?" (777K, her #1).** A close-up talking head by tall bright windows: she holds a small black wireless mic near her chin like a handheld mic, with eye contact and soft backlight. The edit adds 3D sticker icons (AI chip, "NOPE!", red X, car), stock b-roll (office, city, money counting) and a punch-in zoom around 12-14 s.

**15. Jean Lee, "Math Basics for AI & ML" (151K).** The same close-up with the mic in her hand, in a bright white room. The hook is one long caption sentence that names the viewer ("If you're a software engineer looking to break into AI..."). The middle uses a "notes page" layout: a white checklist page ("Calculus: Derivatives, Integrals, Fundamental Theorems", then Linear algebra, then Probability & Stats) with her cut-out in the lower-right corner, and the same over Khan Academy and MIT OpenCourseWare screenshots. **Why it works:** it looks like a study plan you want to save.

**16. Hormozi, "Build the Right Foundation" (9.5M, his #1 Short).** A physical metaphor with big cardboard toy bricks, red and blue, in his home office (whiteboard, kitchen counter, wood floor). He is standing, eye level, with a wide lens. Many angles: front medium-wide, high angle on his hands stacking, low angle, side wide. Graphics are used as story tools:
- a 05-to-01 countdown ring while he rushes a flimsy tower
- icons (stopwatch, skyscraper, calendar "10")
- a black-and-white flashback
- a fire overlay on the word "NEVER" near the end

The captions are big white uppercase condensed text with a heavy black shadow, sitting on his chest, not at the bottom. **Why it works:** you watch a tower get built and you understand the lesson without the words.

**17. Hormozi, "Always Be Ready" (8.8M).** He sits on a couch in a tank top and cap. The camera is at chest height, slightly below his eyes, framing head to thighs, with gold statues and orchids behind and soft daylight. It is one story (a supercar at a gas station, a kid selling, "always have a way to take the money"). There is almost no camera change. All the energy is in the captions: black bold uppercase on yellow boxes, centred on his chest, plus cut-out images that pop up when he names a thing (the car, a kid in a suit, a card machine). This is the cheapest shot in the set, and it has 8.8M views.

**Bonus, Hormozi, "Cheat Code at 34" (4.9M).** He walks toward the camera in a parking lot, shirtless. The camera backs away at chest height (someone walking backwards, or a gimbal). It is one take, with one word on screen at a time in a light-green glow. It is 18 s long.

## Synthesis: the shot types that keep coming back

Patterns across all 17 Shorts (from the frames):
- **Text on screen by second 1:** 14 of 17 had readable hook text in the 0-1 s storyboard frames. For Maddy's meme this is judged from the sharp frames, because its storyboard is too small to read. The 3 that did not are Sagar's Bakery Short, which fades in from black, and both Satish Shorts.
- **Captions sit in the middle of the frame:** usually at chest height. The Hormozi, Jean Lee and Ashish Shorts put them there, not at the very bottom where YouTube's buttons cover them.
- **The mic is often visible:** clip-on mics (Hormozi, Sajjaad, Maddy, Satish), a mic in the hand (Jean Lee, Sajjaad), or a big studio mic (Sagar). Nobody hides it.
- **Pace is not what makes them big:** the two biggest Shorts here sit at opposite ends. Hormozi's bricks has ~4.6 cuts per 10 s (eye count); Sajjaad's challenge is one take. What they share is a visible game or stake from second 1.
- **Length:** the median is 54 s (yt-dlp durations: 10 to 141 s).
- **Endings:** most end on a payoff or a reaction, not a "subscribe". Hard calls to action appear mainly on sales-driven Shorts: Maddy's paid video, Sagar, Satish, and Ashish's long-video end card.

### 1. Seated close-up talking head with big centre captions (Hormozi style)
Used by: Hormozi "Always Be Ready" (8.8M); Jean Lee both Shorts (777K, 151K); Sagar's openers (6.3M, 4.4M); Maddy AMD (738K); Ashish resume (short bits).
- **How to film it:**
  - Phone vertical on a tripod at chest or chin height, 0.7-1 m away, 1x rear camera.
  - Frame from just above your head to mid-chest, or to your thighs if you sit on a couch like Hormozi. Eyes on the upper third.
  - A window in front of you or to one side. A background 1-2 m behind with depth (shelf, plant, lamp).
  - Clip-on wireless mic. It is fine if it shows.
  - Tell one story or one point in one take.
- **How to edit it:**
  - Cut out every pause (jump cuts).
  - Zoom in 110-120% on every second or third sentence and on the key line.
  - Captions of 2-4 words, bold uppercase, centred on the chest. Either black text on a yellow box (Hormozi) or white with a heavy black shadow. One keyword per screen in a second colour.
  - When you name a thing (a tool logo, a company, a salary), pop in a background-removed image for 1-2 s.
  - Under 10 minutes: CapCut auto-captions with a saved caption preset, then 4-6 zooms and 3-4 image pop-ups.

### 2. Talking head plus a board that fills in (open loop)
Used by: Sajjaad salary board (2.8M), Sajjaad VS scoreboard (3.0M), Sajjaad compiler diagram (7.1M); Jean Lee checklist pages (151K); Ashish topic list (341K, faceless version).
- **How to film it:**
  - Same as type 1, but frame a bit wider and leave empty space: the top 20% for a title box, and the lower half or one side for the board.
  - Keep the phone locked on a tripod so the graphics stay lined up.
- **How to edit it:**
  - Put a white box with black text at the top for the whole video (the question or topic).
  - At second 0, show the board with its labels and empty values: years, tools, levels, "Data Engineer vs AI Engineer".
  - Each time you say a fact, drop in one chip. Blue = value, red = detail, green = the final or biggest number.
  - Keep the last chip for the last 5 s.
  - Under 10 minutes: build the board once as a template (Canva or CapCut text boxes) and only change the words each time.

### 3. Two-person face-off or guest collab
Used by: Sajjaad + @meglovesdata, standing at an event (3.0M); Sajjaad + A Life Engineered, seated at a desk (2.8M).
- **How to film it:**
  - Standing: two people side by side, phone at chest height 1.5-2 m away (knees-up), with a third person holding it or a tripod. One handheld mic passed between them, or a 2-channel wireless kit.
  - Seated: both at a table, phone on a tripod at eye level, straight on.
  - Ask 3-5 short questions, about 6 s per answer.
- **How to edit it:**
  - Question box at the top that changes with each question.
  - A role label on each chest ("Data Engineer" vs "Data Scientist") with a red "VS".
  - Answers stack as chips under each person.
  - Zoom in on whoever is talking.
  - End on a reaction close-up.

### 4. Outdoor handheld challenge (off-camera asker, a prize)
Used by: Sajjaad "Comp Sci Challenge for $700" (7.1M, his top Short).
- **How to film it:**
  - You hold the phone at chest height with the 0.5x wide lens, one continuous take.
  - Your hand with the prize (cash, a gift card) comes into frame at the start and again at the handover.
  - The other person stands 1-1.5 m away in daylight, plain outdoor background.
  - Use a clip mic on them, or just the phone mic close in.
- **How to edit it:**
  - Fixed title at the top ("The HARDEST Data Engineering Challenge") plus a red "Task: Explain [concept]" label for the whole video.
  - Small 1-3 word captions.
  - As they explain, build a 3-box diagram at the bottom (input → step → output).
  - Keep the money handover as the last shot, with no call to action.
  - Almost no cutting, so it is fast to edit.

### 5. POV skit with shot / reverse shot (laptop or "you" as the second actor)
Used by: Andrew "can't work from home" (3.1M), Andrew "British people learning to code" (1.6M); Sagar "Locked PDF" (4.4M); Satish "Excel trick" opener (2.4M).
- **How to film it:**
  - Set-up A: you, medium shot, not looking at the lens, reacting.
  - Set-up B: the "other side". A laptop on a fake video call, a Slack or Teams message, a terminal error, or you again in a different top filmed from another angle (Sagar).
  - Phone on a tripod. Film all of set-up A's lines, then all of set-up B's lines.
  - Natural window light. Ordinary real places work: bed, desk, office.
- **How to edit it:**
  - "POV: you're a data engineer and ..." in white at the top third for the opening.
  - Small single-colour captions for the dialogue (Andrew uses lime green).
  - Cut on every line change, about 3-5 cuts per 10 s.
  - Use a "3 days later" card for time jumps.
  - End on a reaction shot (face in hands), not a "subscribe".

### 6. Prop or physical metaphor demo
Used by: Hormozi "Build the Right Foundation" (9.5M, his top Short); Maddy holding the product to the lens (738K); Satish holding the printed table (781K).
- **How to film it:**
  - Pick one physical object that stands for the idea (stacked boxes for data layers, cups for pipelines, sticky notes for tables) and do the action for real.
  - Standing, medium-wide, eye level, with the phone on a tripod.
  - Then film 3-4 extra angles of the same action: high angle on your hands, close on the object, low angle, side wide.
- **How to edit it:**
  - Cut between the angles on each action.
  - Add simple story graphics: a countdown ring, 1-2 icons, black-and-white for "before", one effect on the final word.
  - Big centred uppercase captions (as in type 1).
  - This takes more filming time but little editing skill.

### 7. Screen walkthrough with the presenter still visible
Used by: Satish, filming a big touch screen with his hand pointing (2.4M, 781K); Ashish, resume pan with a highlighter (1.5M); Jean Lee, her cut-out over pages and sites (151K); Sagar, face bubble over animation (6.3M); Maddy, spec page with highlights (738K).
- **How to film it:** pick one of three ways.
  - **(a) Satish way:** phone over your shoulder filming your monitor while your hand or a pen points at the screen. No screen recorder needed.
  - **(b) Jean Lee way:** a screen recording or screenshot full screen, with your talking head cut out (background removed) in a lower corner.
  - **(c) Sagar way:** a full-screen visual with your face in a circle at the top.
- **How to edit it:**
  - Zoom into the part of the screen you are talking about.
  - Mark it with a yellow highlighter bar or a hand-drawn circle and arrow.
  - Add "STEP 1 / 2 / 3" labels.
  - Bring your face back full screen at least every ~10 s.
  - End with the result on screen.

### 8. Faceless list or meme (lowest effort, weakest for building Chris's face)
Used by: Maddy Valentine's meme (2.8M); Ashish topics list (341K).
- **How to make it:**
  - **List version:** a plain coloured or textured background, a header label, and chips that pop in one per beat in time with a voiceover. 15-20 s.
  - **Meme version:** "Other people: ... / Data engineers: ..." over your own short clips, under 10 s.
- **Note:** it gets views but does not show Chris. Use it only as filler between face-on Shorts.

### Bonus: walk-and-talk toward the camera (Hormozi, 4.9M)
- **How to film it:** someone walks backwards in front of you with the phone at chest height (or you use a gimbal), on an open path or car park. One take, 15-20 s.
- **How to edit it:** no cuts; one word on screen at a time, centred on the chest, in one glow colour.

## What to copy first (for a solo creator, from the evidence above)
1. **Type 1, seated close-up with big centre captions.** Hormozi gets 8.8M views from one couch set-up with almost no angle changes. It is the cheapest, and it is the Hormozi look Chris wants.
2. **Type 2, a board that fills in.** It fits data and AI topics well (salaries by year, tool stacks, roadmaps), and it drove 3 of Sajjaad's top Shorts.
3. **Type 5, POV skit with a laptop as the second actor.** Data engineering pain (broken pipeline at 3 a.m., "can you just pull this data") works like Andrew's, and it needs no second actor.
4. **Then, when there is time or a guest:** type 3 (face-off with a guest) and type 6 (prop metaphor), the formats behind Sajjaad's and Hormozi's biggest numbers.
