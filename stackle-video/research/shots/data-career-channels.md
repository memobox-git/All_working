# How data and AI career Shorts are filmed and edited

Research for Stackle Shorts. The question was: "Go to the competition. Check what shots they are doing. Let's do those shots."
This file is about the visual recipe (camera, framing, setting, text, captions, graphics, editing pace). It is not about topics.

Checked on **2026-10-16**. 9 channels, 19 Shorts.

---

## How the numbers were collected (read this first)

| What | How I got it | Limits |
|---|---|---|
| List of Shorts and rough views | `yt-dlp --flat-playlist` on each channel's `/shorts` page, 2026-10-16 | Views are rounded (e.g. 468000) |
| Exact views, length, upload date | yt-dlp video metadata (`view_count`, `duration`, `upload_date`), 2026-10-16 | Views change daily |
| Frames | **No video files could be downloaded.** YouTube blocked every player client: `ios`, `android`, `tv`, `tv_simply`, `tv_embedded`, `android_vr` and `web_creator` returned HTTP 429 or "Sign in to confirm you're not a bot"; `mweb` and `web_embedded` gave a link, but the download got HTTP 403 (it needs a PO token). So I used two fallbacks: (1) YouTube's storyboard (format `sb0`, 101x180 px, about 1 frame per second; for the 170 s Aishwarya Short, 1 frame every 2 s), and (2) YouTube's own HD stills: the first frame (`frame0`, 270x480), three stills YouTube picks from the Short (`oar1-3`, 720x1280 or 1080x1920), and the thumbnail. I found the time of each `oar` still by matching it to the closest storyboard frame. They are not at fixed points (for example 5 s, 7 s and 20 s in a 21 s Short). | Storyboard frames are small and blurry. Big text is readable but small text is not. The two 2022 Rishabh Shorts have no `oar` stills. |
| Length | yt-dlp metadata `duration` (not ffprobe, because there was no video file) | Whole seconds |
| Cuts per 10 s, **A** | `ffmpeg select='gt(scene,0.3)'` run on the storyboard frames (about 1 per second), divided by the length | Misses cuts shorter than about 1 s and jump cuts that keep the same framing |
| Cuts per 10 s, **B** | I counted by eye every visible change of shot or layout (cut to b-roll, back to face, punch-in zoom, new graphic screen) on the 1-per-second storyboard strip | Counted by hand, so treat it as "about". Usually higher than A |
| Spoken hook | YouTube captions (`--write-auto-subs --write-subs --sub-langs en`, `web_embedded` client), 2026-10-16 | Worked for 17 of 19 (one of them, Rishabh #16, only had creator-uploaded en-IN subtitles). For 2 Shorts (#10, #17), YouTube returned HTTP 429 even after retries; for #10 I read the hook from the captions burned into the frames, and #17 has no captions to read |
| On-screen hook, captions, setting | Looked at the contact sheets and storyboard strips myself | I only describe what I could see |

**Contact sheets.** Each sheet is a 4x3 grid of 270x480 tiles. Rows 1–2 show the times asked for: 0 s (HD first frame), 1 s, 2.5 s, 5 s, 10 s, 40%, 70% and 1 s before the end (storyboard frames, blurry). Row 3 shows the three HD stills (labelled with their matched time, e.g. "HD still 2 (~7s)") and the thumbnail (centre crop). Each tile is labelled "HD" or "SB" (storyboard). The sheets are in [`frames/`](frames/), named `CHANNEL-VIDEOID.jpg`.

**Clean-up.** No video was downloaded. The storyboard files, stills and working frames were kept only in the session scratchpad and were deleted once the sheets were made. The contact sheets in `frames/` are the only images added to this repo.

---

## Which Shorts were picked

I took the top 2 in-niche Shorts per channel by views (top 3 for Sundas Khalid).

- **Skipped as off-niche:** Sundas Khalid "Unboxing iPhone 15 Plus Green" (about 10,000,000 views, flat-playlist rounded). This is her most-viewed Short, but it is a phone unboxing.
- **Kept, but borderline:** Sundas Khalid "How much money Software Engineers make?" (4.9M). It is about tech salaries rather than data/AI, but it is a career Short and its shot (an event interview) is the same one she uses in her data Shorts. If you want strictly data: her next ones are "Software Engineer vs Data Scientist" (about 1.4M) and "Don't Become a Data Scientist If" (about 1.3M), both from flat-playlist, rounded.
- Every other channel's top 2 by views was in-niche.

---

## Table

Views = exact `view_count` from yt-dlp, checked 2026-10-16. Length = yt-dlp `duration`. Cuts/10 s = **A** (ffmpeg scene filter on storyboard) / **B** (my count by eye on storyboard). "0 s" = the HD first frame.

| # | Channel | Short | Link | Views | Length | Cuts/10 s (A / B) | Shot type | Hook: spoken (captions) / on-screen at 0–1 s | Caption style | Contact sheet |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sundas Khalid | How much money Software Engineers make? 💰 ft. Maddy | [link](https://www.youtube.com/shorts/jfOmPvZ7cSQ) | 4,881,531 | 21 s | 2.4 / ~3.8 | Event interview outdoors, handheld mic, two-shot + singles | "What do you do for a living?" / Yellow box with black text, top: "How much money Software Engineers make? 🥵" (stays the whole Short) | Phrase captions (3–6 words), white-yellow bold with outline, chest height | [sheet](frames/SundasKhalid-jfOmPvZ7cSQ.jpg) |
| 2 | Sundas Khalid | Don't Become a Data Analyst if | [link](https://www.youtube.com/shorts/YsRDM6eoRq8) | 3,527,272 | 60 s | 1.0 / ~1.5 | Seated talking head with podcast mic + b-roll | "Three reasons why you shouldn't become a data analyst. You don't like creating dashboards." / Top title: "3 reasons to not become a" (small white) + "Data Analyst" (big yellow); stays the whole Short | One word at a time, yellow bold with black outline, chest height, plus a white-on-black "chapter" pill under it ("Salary") | [sheet](frames/SundasKhalid-YsRDM6eoRq8.jpg) |
| 3 | Sundas Khalid | Data Engineer vs. Data Scientist ft. @eczachly_ | [link](https://www.youtube.com/shorts/jZGWOUNeiFY) | 2,196,542 | 53 s | 0 / 0 | Event interview, wide full-body 3-shot, one take, "X vs Y" | "Hi, what's your name and what do you do for a living?" / Two yellow labels, top: "Data Engineer" vs "Data Scientist" (stay the whole Short) | 1–2 words, yellow bold, chest height; answers (skills, salaries) stacked as text over each guest | [sheet](frames/SundasKhalid-jZGWOUNeiFY.jpg) |
| 4 | Data with Baraa | Don't Become a Data Analyst! | [link](https://www.youtube.com/shorts/o55yneAtUHQ) | 468,751 | 60 s | 2.0 / ~2.5 | Seated talking head with podcast mic + numbered cards + stock b-roll | "Reasons not to become a data analyst. If you hate Excel like me, then sorry…" / 0 s: no text. ~1 s: big white card, lower third: "Don't Become a DATA ANALYST" + chart emoji | No running captions. Numbered card stays on screen: teal "#1" + white box, black bold text ("Don't Like EXCEL") | [sheet](frames/DataWithBaraa-o55yneAtUHQ.jpg) |
| 5 | Data with Baraa | Learn Python for Data Analysis in 3 Steps | [link](https://www.youtube.com/shorts/u8ABLLK3-z0) | 353,761 | 60 s | 2.3 / ~3.5 | Talking head + code screen recording with face bubble + hand-drawn sketches (many layouts) | "How to learn Python as a data analyst? Well, the good news is that you don't have to learn everything." / 0 s: no text. ~1 s: white card "How to learn PYTHON 'Data Analyst'" + Python logo | 2–4 words, bold uppercase, white with one key word in cyan or red, lower middle | [sheet](frames/DataWithBaraa-u8ABLLK3-z0.jpg) |
| 6 | Zach Wilson | Master the 5 levels of SQL | [link](https://www.youtube.com/shorts/OcRFwqj_we4) | 426,757 | 85 s | 2.1 / ~2.5 | Selfie talking head + full-screen diagram + split (graphic top, face bottom) | "SQL has five levels to it. Level zero is select star from table." / 0 s: no text. ~1 s: full white screen "5 LEVELS OF SQL" with a 5-step pyramid | Small green highlight box, dark text, 1–3 words, chest height; key terms as big yellow condensed caps ("COMMON TABLE EXPRESSIONS") | [sheet](frames/EcZachly_-OcRFwqj_we4.jpg) |
| 7 | Zach Wilson | The four levels of data engineering! | [link](https://www.youtube.com/shorts/_eMnqdrZx_Q) | 373,458 | 58 s | 0 / 0 | Selfie talking head with mic on boom, one take, no graphics | "There are four levels of data engineering. Level one, you know SQL and Python…" / Top-left white text, two lines: "The four levels of data engineering!" (stays the whole Short) | 2–3 words, bold uppercase, white with key word yellow, lower middle | [sheet](frames/EcZachly_-_eMnqdrZx_Q.jpg) |
| 8 | Sumit Mittal | Advantages of PARQUET FILE FORMAT in Apache Spark | [link](https://www.youtube.com/shorts/7c1VvMLlyAg) | 243,292 | 44 s | 0.2 / 0.2 | Mock interview video call, split top/bottom | "Can you tell me what are the advantages of Parquet over other file formats?" / Full red screen, white box: "Explain Parquet File Format?" (0–2 s) | Sentence chunks in a white box with dark text, on the split line | [sheet](frames/sumitmittal07-7c1VvMLlyAg.jpg) |
| 9 | Sumit Mittal | Understanding how to Optimize PySpark Job | [link](https://www.youtube.com/shorts/oQ0iA4r5Fcs) | 162,189 | 48 s | 0.2 / 0.2 | Mock interview video call, split top/bottom | "Any specific techniques you've used when optimizing a PySpark job?" / Full yellow screen, blue box: "Pyspark Job Optimization Techniques" (0–2 s) | Sentence chunks, white text in a red box, on the split line | [sheet](frames/sumitmittal07-oQ0iA4r5Fcs.jpg) |
| 10 | The Big Data Show | Explaining your project in Data Engineering interview | [link](https://www.youtube.com/shorts/FXlMNcEalSY) | 306,794 | 60 s | 0 / 0 | Mock interview video call, split top/bottom | Captions blocked (HTTP 429). Burned-in caption at 0–3 s: "can you also mention like the architecture, like what was the source…" / Only that caption | Two-line sentence chunks, white box, black text, on the split line | [sheet](frames/TheBigDataShow-FXlMNcEalSY.jpg) |
| 11 | The Big Data Show | Difference b/w Pandas & PySpark | [link](https://www.youtube.com/shorts/B9t_RuhLt00) | 211,469 | 60 s | 0 / 0 | Mock interview video call, split top/bottom | "So what is the fundamental difference between pandas and PySpark?" (auto-captions + burned-in) / Only the caption "So what is the fundamental" | Two-line sentence chunks, white box, black text, on the split line | [sheet](frames/TheBigDataShow-B9t_RuhLt00.jpg) |
| 12 | Mo Chen | How to learn Python fast for data analysis? | [link](https://www.youtube.com/shorts/aegyF26ppP4) | 169,408 | 42 s | 0 / ~1.9 | Cinematic talking head, mic on desk stand in front of chest, jump cuts | "When you learn Python, please make sure that you don't go away and do endless general programming tutorials. I've done that before and wasted at least 6 months…" / 0 s: no text | 1–3 words, white bold italic, key word yellow, lower middle (over the mic) | [sheet](frames/mo-chen-aegyF26ppP4.jpg) |
| 13 | Mo Chen | Use of Power BI as a Business Analyst | [link](https://www.youtube.com/shorts/M8BpkQNoTis) | 118,935 | 52 s | 0.4 / 0.4 | Podcast clip, two cameras (host question, then guest answer) | "What are the technical skills that you need as a business analyst?" / 0 s: caption "What are the" only | Subtitle style: light-yellow text on a black box, 3–4 words, lower middle | [sheet](frames/mo-chen-M8BpkQNoTis.jpg) |
| 14 | Jash Radia | Data Engineering Interviews in 2021 vs 2025 🥲 | [link](https://www.youtube.com/shorts/i3FYVpbmpdE) | 189,279 | 71 s | 1.4 / ~2.1 | Skit: he plays interviewer and candidate on a fake video call | "Write an SQL query to select top 10 users by order count." / 0 s: orange gradient (no text). ~1 s: kinetic title "data Engineering interviews in 2021" | 1–3 words, bold uppercase, white with black outline, on the split line | [sheet](frames/JashRadia-i3FYVpbmpdE.jpg) |
| 15 | Jash Radia | 3 Step DSA Roadmap for Data Engineers 🚀 | [link](https://www.youtube.com/shorts/6ubCFPOwFmk) | 78,249 | 54 s | 3.0 / ~3.3 | B-roll opener with kinetic text, then talking head on a sofa + screenshots + stock b-roll | "You might be a really good data engineer but you might be really bad at DSA because you have not been practicing." / 0 s: blurred frame. 1–5 s: stock coding footage with mixed-size text ("DATA ENGINEER", "really bad", "not been PRACTICING") | 1–3 words, bold uppercase white with shadow, lower middle | [sheet](frames/JashRadia-6ubCFPOwFmk.jpg) |
| 16 | Rishabh Mishra | What is Data Science & Future Scope? | [link](https://www.youtube.com/shorts/2MgUGNMY-8E) | 903,576 | 41 s | 1.2 / ~1.2 | Medium talking head (lav mic), colourful home background, keyword pop-ups | From creator-uploaded en-IN subtitles: "In today's world Data Science is one of the most growing and highest paying career options." / 0 s: no text. ~1 s: "DATA SCIENCE" in yellow on a black box | No running captions. Keywords and numbers pop up in yellow on black boxes, lower third ("$37 Billion", "11.5 Million jobs") | [sheet](frames/RishabhMishraOfficial-2MgUGNMY-8E.jpg) |
| 17 | Rishabh Mishra | 5 Best SQL Websites to Practice … for FREE | [link](https://www.youtube.com/shorts/bdfMRFxaIQU) | 543,480 | 32 s | 0.9 / ~2.2 | Talking head, then fast montage of website screen recordings with a face bubble | Captions blocked (HTTP 429) / 0 s: no text | None while talking. During the montage, the site name sits in a yellow-green highlight bar ("w3schools.com", "DataLemur.com", "HackerRank.com") | [sheet](frames/RishabhMishraOfficial-bdfMRFxaIQU.jpg) |
| 18 | Aishwarya Srinivasan | Anthropic Just Revealed the Jobs Most Exposed to AI! | [link](https://www.youtube.com/shorts/VS16C2_zUw4) | 215,149 | 170 s | 1.6 / ~2.1 (storyboard is 1 frame per 2 s here, so the real pace is likely higher) | Talking head holding a wireless mic + full-screen charts, tables, doodles, screenshots, numbered cards | "Anthropic just dropped a study on how AI could affect jobs and labor market, and the results are more surprising than people think." / 0 s: no text | Two-tone: the phrase in a white pill with dark text, the current words in a purple pill with white text, lower middle | [sheet](frames/aishwaryasrinivasan-VS16C2_zUw4.jpg) |
| 19 | Aishwarya Srinivasan | AI Rapid fire while doing Dead-Hangs? (Read captions) | [link](https://www.youtube.com/shorts/6_dR-svahIs) | 205,193 | 32 s | 0 / ~0.3 | Challenge: wide full-body static shot in a home gym, off-camera voice asks rapid-fire questions | "Hey, Ish. Let's see how many AI questions you can answer while doing a dead hang." / Black box with yellow text, top: "AI Rapid Fire while doing Dead-Hangs" | Serif font (Times-like), white, key words yellow italic, 2–4 words, lower middle | [sheet](frames/aishwaryasrinivasan-6_dR-svahIs.jpg) |

---

## Notes per Short: what makes the shot work

### Sundas Khalid

**1. How much money Software Engineers make? (4.88M views, 21 s)**
- Shot: outdoors on a sunny rooftop/terrace at what looks like a tech event (glass building, sky, people in the background). It opens on a wide two-shot (both standing, full body). Then it cuts between close singles of the guest and of Sundas, with one punch-in near the end.
- Mic: the guest holds a small wireless mic transmitter (DJI-style) like a handheld mic.
- Text: a yellow title box with black text sits at the top for the whole Short and asks the question the viewer wants answered.
- Ending: the answer ("$275K to $300K 💰") comes in the last 3 s, then a cut to Sundas saying "wow". It ends right on the payoff, so it loops.
- Why it works: the title asks a money question, and the viewer stays to hear the number. It is short (21 s), so it gets rewatched.

**2. Don't Become a Data Analyst if (3.53M views, 60 s)**
- Shot: seated, chest-up, centred, talking straight to the lens. A Shure-style podcast mic on a boom arm sits in the lower left of the frame. Home office with a window behind her (soft daylight), background blurred.
- Edit: punch-in zooms between sentences (frame 0 is wider than 1–3 s). B-roll cutaways about every 10–15 s: hands typing on a pink keyboard (~4 s), her silhouette at a standing desk with monitors (~9–11 s), a screenshot of her own long video "HARSH REALITY OF BEING A DATA ANALYST" (~33 s, while she says "you can watch a longer video on my YouTube channel"), and a wide side shot of her typing at a desk (~48 s).
- Text: a two-line title at the top for the whole Short (small white line + big yellow "Data Analyst"). Under the one-word captions there is a white-on-black pill that names the current reason ("Building Reports & Dashboards", "Salary", "To the Next Career").
- Ending: ends on a question ("…Data Science skills like statistics, machine learning, etc.?"). There is no end card.
- Why it works: "Don't become X" plus a fixed title tells the viewer exactly what they will get. The chapter pill shows progress through the 3 reasons.

**3. Data Engineer vs. Data Scientist ft. @eczachly_ (2.20M views, 53 s)**
- Shot: one locked-off wide shot of three people standing full body in an office or event hall. Sundas is in the middle with a handheld mic, a data engineer (Zach Wilson) on one side and a data scientist on the other. Ceiling lights, carpet. No cuts are visible.
- Text: two yellow labels at the top ("Data Engineer" vs "Data Scientist") stay the whole Short. Answers become text stacked over each guest's chest: salaries ("$127K", "$200K") and skill lists ("SQL, Python, Bash, Java, Scala" against "Python, SQL").
- Ending: a joke loop. "Hold on, what about the first answer?" "It's already too late."
- Why it works: the "vs" layout makes it a side-by-side comparison you can read with the sound off. A known guest from the niche helps.

### Data with Baraa

**4. Don't Become a Data Analyst! (469K views, 60 s)**
- Shot: seated, chest-up, centred, eye contact. A podcast mic on a boom arm comes in from the left. Purple-lit wall with framed icon art behind him. He holds a coffee mug in the first frame (a casual prop).
- Edit: a big white title card pops in at about 1 s ("Don't Become a DATA ANALYST" + chart emoji). Then 6 numbered reasons. Each reason gets a lower-third card (teal "#1" + white box: "Don't Like EXCEL", "Don't Like Building Dashboard", "Don't Like Explaining Things", "Only as Stepping Stone", "Tech Only No Business", "Just For MONEY") that stays on while that reason runs. Each reason cuts to 2–4 s of b-roll: an Excel screen recording, a dark dashboard UI, stock clips (woman presenting a chart, top-down business meeting, man face-palming, top-down typing, sticky notes).
- No word-by-word captions. The card does the job of the captions.
- Ending: ends on his face with the last reason ("you're going to get burned out really quickly"). No call to action.

**5. Learn Python for Data Analysis in 3 Steps (354K views, 60 s)**
- Shot: close talking head (head and shoulders), glasses, purple/blue RGB light, big plant, LED bar, podcast mic at the left edge.
- Edit: the busiest layout in the set. Title card "How to learn PYTHON 'Data Analyst'" + Python logo at ~1 s. A full-screen white hand-drawn sketch ("Answer Business Questions Using Data") at 7–9 s. Then three sections, each with a label card ("#1 Basics", "#2 Pandas", "#3 Plotly") + tool logo + his face in a circle at the bottom right, over a dark code screen recording (charts appear as the code runs). A split-screen sketch (top) with him below (bottom) at 45–50 s. A recap screen stacking the three labels at 53–55 s.
- Ending: a column of his YouTube Python course thumbnails on the left, him on the right. This promotes his full course.
- Captions: big bold uppercase, 2–4 words, one key word coloured.

### Zach Wilson (DataExpert)

**6. Master the 5 levels of SQL (427K views, 85 s)**
- Shot: very close, slightly wide-angle selfie framing at a desk, bright white room with window light, a gold cat-shaped light on the wall, a big foam-covered mic close in the foreground on the left. Casual colour-block hoodie.
- Edit: cuts between three layouts. (1) Full-screen white graphic "5 LEVELS OF SQL" with a pyramid that fills one level at a time; it comes back between sections as a progress map. (2) Split screen: white top half with green pill graphics (SQL keywords, join diagrams, CTE code), his face in the bottom half. (3) Full-face talking head.
- Captions: small green highlight boxes, plus big yellow condensed caps for key terms.
- Ending: a comment-keyword call to action: "If you are interested in my SQL guide on how to pass SQL interviews in big tech, comment SQL in the comments and I will send it to you." A white "Comment 'SQL'" pill appears on screen.
- Why it works: a "levels" ladder is easy to follow, and the pyramid shows how far through you are.

**7. The four levels of data engineering! (373K views, 58 s)**
- Shot: selfie talking head, head and upper chest, slightly left of centre, eye contact. Cream wall with an orange neon cat sign. Black Shure-style mic on a boom arm on the right. Text on his hoodie and on the mic is mirrored, so it was likely shot on the phone's front camera.
- Edit: one continuous take. No b-roll and no graphics. Only a fixed white title at the top left ("The four levels of data engineering!") and CapCut-style captions (bold uppercase, key word yellow).
- Ending: "If you like this content, follow for more."
- Why it works: the simplest recipe in the set. Clear structure (level 1 to 4), one take, title on top. It shows that a strong list idea does not need editing.

### Sumit Mittal (TrendyTech)

**8. Advantages of PARQUET FILE FORMAT (243K views, 44 s)** and **9. Optimize PySpark Job (162K views, 48 s)**
- Shot: a recorded mock interview on a video call. Each person is on a webcam (head and shoulders), plain walls, headsets. The layout stacks two tiles: interviewer on top, candidate below. Sumit himself is not on screen.
- Edit: a 2 s full-screen colour card with the interview question first (red with "Explain Parquet File Format?"; yellow with "Pyspark Job Optimization Techniques"). Then one Q&A with no cuts. A small TrendyTech logo at the top right on #8.
- Captions: sentence chunks in a box on the line between the two tiles (white box on #8, red box on #9).
- Ending: ends when the answer ends ("…so this really helps in optimization"). No call to action.
- Why it works: viewers test themselves against the candidate. It costs almost nothing to make if you already run mock interviews.

### The Big Data Show

**10. Explaining your project in DE interview (307K views, 60 s)** and **11. Pandas vs PySpark (211K views, 60 s)**
- Shot: the same video-call split as Sumit (interviewer on top, candidate below), webcam quality, home rooms.
- Edit: no intro card. It starts right on the interviewer's question. One continuous clip, no cuts.
- Captions: two-line sentence chunks, white box with black text, on the split line.
- Ending: #10 cuts off mid-sentence ("incremental data, and we have written…"), which pushes viewers to the full mock interview. #11 ends at the end of the answer.

### Mo Chen

**12. How to learn Python fast for data analysis? (169K views, 42 s)**
- Shot: cinematic look. Medium close-up, centred, eye contact. A Rode mic on a desk stand sits right in front of his chest. Warm, dim, moody lighting with a blurred home-studio background and a bright LED strip line. Shallow depth of field, so this is probably a real camera, not a phone.
- Edit: jump cuts that switch between a tight and a wider framing (visible at about 1, 7, 17 and 29 s). No b-roll. No text at 0 s.
- Captions: small white bold italic, key word yellow, placed over the mic.
- Hook: a "don't do what I did" warning ("…I've done that before and wasted at least 6 months").

**13. Use of Power BI as a Business Analyst (119K views, 52 s)**
- Shot: a podcast clip from two cameras. The host is in 3/4 profile (black tee, Rode PodMic on a desk stand). The guest is in 3/4 profile looking at the host, not the lens. Bright white studio, plant, green laptop on the desk.
- Edit: host question (0–5 s), cut to the guest's answer as one long take, cut back to the host (arms crossed) at the end.
- Captions: subtitle style, text on a black box.
- Why it works: the question is the hook, and a real practitioner gives the answer.

### Jash Radia

**14. Data Engineering Interviews in 2021 vs 2025 (189K views, 71 s)**
- Shot: a skit where Jash plays both people. The interviewer sits at a desk behind a laptop with stickers. The candidate is in a car in the 2021 part and at home in a red plaid shirt in the 2025 part. It is laid out as a fake video call (stacked tiles, call controls bar at the bottom), with some full-frame inserts of each role.
- Edit: kinetic title cards on an orange gradient ("data Engineering interviews in 2021", then "Vs 2025"). "2021" and "2025" yellow tags, a money-rain effect on the salary line, a code editor panel under the candidate.
- Ending: a punchline. "HR will let you know about the final verdict." "She won't." Then the interviewer laughs.
- Why it works: anyone who has interviewed knows the joke. The two time periods give a clear before/after.

**15. 3 Step DSA Roadmap for Data Engineers (78K views, 54 s)**
- Shot: the first 5 s are stock coding b-roll (green code on a laptop, hands typing) with kinetic text in mixed sizes. Then a seated talking head on a sofa in a living room with daylight, chest-up, centred.
- Edit: full-screen inserts: book cover ("Cracking the Coding Interview"), question-list screenshots, an animated deep-blue list of patterns (Sliding Window, 2 Pointers, Divide and Conquer…), LeetCode "Top Interview 150" screenshots with a yellow "Start from this list" label, and stock b-roll of a programmer at the end.
- Captions: bold uppercase white with a shadow.

### Rishabh Mishra

**16. What is Data Science & Future Scope? (904K views, 41 s, from 2022)**
- Shot: medium shot (waist up), centred, eye contact, lav mic clipped to his shirt. A busy, colourful background: a big red paper fan on an orange wall and a clock.
- Edit: no running captions. Keywords and numbers pop up in yellow on black boxes ("DATA SCIENCE", "11.5 Million jobs", the LinkedIn logo, "$37 Billion" then "$230 Billion"). Full-screen inserts: a "What Is Data Science" title over a server-room image, a Venn diagram, a process diagram strip.
- Ending: a black end card with his name in yellow (a channel brand outro).

**17. 5 Best SQL Websites to Practice (543K views, 32 s, from 2022)**
- Shot: the same set as #16 for the first 20 s, a plain talking head (he holds up 5 fingers at about 10 s).
- Edit: the last 12 s are a fast montage, about 2 s per website (w3schools, DataLemur, sql-practice, 8 Week SQL Challenge, HackerRank). Each is a scrolling screen recording with the site name in a highlight bar and his face in a circle at the bottom right.
- Why it works: it is a save-worthy list, and the payoff (the websites) arrives fast at the end.

### Aishwarya Srinivasan

**18. Anthropic Just Revealed the Jobs Most Exposed to AI! (215K views, 170 s)**
- Shot: seated talking head, chest-up, centred, eye contact, in a wooden cabin or lodge with timber beams and warm practical lights. She holds a wireless mic transmitter in her hand.
- Edit: she is on screen for only about half of the Short. The rest is full-screen visuals: line and bar charts, a "Most exposed occupations" table with a highlighter animation row by row, hand-drawn animated doodles on a beige background, a radar chart on black, stock factory/office clips, a screenshot of the Anthropic report page, numbered title cards with a small robot mascot ("#1 Learn how to work with AI tools effectively", "#2 Focus on higher level thinking", "#3 Build AI literacy"), screen recordings of AI tools, and "Take Away" cards.
- Ending: on her face with the last line ("…will be the ones who benefit the most").
- Note: this is almost 3 minutes long. It is a news explainer, not a classic 30–60 s Short.

**19. AI Rapid fire while doing Dead-Hangs? (205K views, 32 s)**
- Shot: a wide, static, full-body shot (phone on a tripod) in a home gym with white wall bars, a mirror and a black wall. She hangs from the bar for almost the whole Short. A voice off camera fires questions.
- Edit: one take. A black box with yellow text names the challenge at the top. The serif captions show both the questions and her answers (answers in yellow italic).
- Ending: the last question is the call to action. "What's the best resource to go deep in agentic AI?" "Join my upcoming agentic AI bootcamp."
- Why it works: the physical challenge adds tension (can she hold on?), and the quick answers feel honest. The course plug is hidden inside the format.

---

## Patterns across all 19 (from what I saw)

- **Talking to the lens is the default.** 10 of 19 are one person talking straight to camera (#2, 4, 5, 6, 7, 12, 15, 16, 17, 18). In the video-call Shorts (#8–11, 14) people also look at the lens, because it is a webcam.
- **A mic in the shot is a credibility prop.** In 13 of 19 a mic is visible: podcast mic on a boom or stand (#2, 4, 5, 6, 7, 12, 13), handheld or wireless transmitter (#1, 3, 18), headset (#8, 9, 10). #11, #14, #15, #16, #17 and #19 show no big mic (Rishabh wears a small clip-on mic).
- **Text on the first frame.** 7 of 19 have a title or question card on the very first frame (#1, 2, 3, 7, 8, 9, 19). These include all three Sundas Shorts, the biggest in the set. Most of the others put a title card on screen by about 1 s.
- **Persistent top title.** 5 of 19 keep a headline at the top for the whole Short (#1, 2, 3, 7, 19). It works like a YouTube title inside the video.
- **Captions sit at chest height**, about 55–70% of the way down the frame. That is above the YouTube buttons and caption area, never at the very bottom. Most are 1–4 words, bold, white with one key word in yellow or another accent colour.
- **Pace is moderate.** By-eye changes (B) run from 0 to about 3.8 per 10 s. The median across the 19 is about 1.5 per 10 s. Five Shorts have **zero or almost zero** visible cuts and still did well: #3 (2.2M), #7 (373K), #10 (307K), #11 (211K) and #19 (205K). The format and the hook carry these Shorts more than fast cutting does.
- **Endings:** a loop or punchline (#1, 3, 14), a comment-keyword offer (#6 "comment SQL"), a course or bootcamp plug (#5, 19), "follow for more" (#7), a branded end card (#16), cutting off mid-answer (#10), or ending on the last point (#2, 4, 8, 9, 11, 12, 13, 15, 17, 18).

---

## Synthesis: the 8 shot types to copy

The "how to film" and "how to edit" for each type are written for one person with a phone and CapCut (or any similar editor). The aim is 10 minutes of editing or less per Short.

### Type 1. Desk mic talking head (the default)
**Used by:** Sundas "Don't Become a Data Analyst if" (3.53M), Baraa "Don't Become a Data Analyst!" (469K), Zach "5 levels of SQL" (427K), Zach "four levels of DE" (373K), Baraa "Python in 3 steps" (354K), Mo Chen "learn Python fast" (169K). Variants without a boom mic: Rishabh (904K, 543K), Aishwarya AI jobs (215K), Jash DSA (78K).

**How to film it**
- Phone vertical, 1080p or 4K at 30 fps. Use the back camera if you can see yourself with a mirror or screen; otherwise use the front camera like Zach.
- Phone on a tripod at eye level, about 60–90 cm away. Frame from mid-chest to just above the head. Eyes about one-third down the frame.
- Put a podcast mic on a boom arm or desk stand so it enters the frame from one side or sits in front of your chest. It can also be your real audio mic.
- Light: a window to one side of you, or one soft light at 45°. Add one "practical" light in the background (a lamp, an LED strip or a neon sign) about 1–2 m behind you, for depth.
- Background: a real room with some depth (shelves, plant, desk). Not a flat wall. Wear a plain, solid colour.

**How to edit it**
- Cut out every pause and breath (jump cuts). Every 1–2 sentences, swap between your normal framing and a 110–120% punch-in.
- Auto-captions at chest height: 1–3 words per line, bold sans-serif, white with the key word in yellow.
- Optional: a fixed title at the top for the whole Short (see Type 2).
- Target about 1.5–2.5 visual changes per 10 s. You do not need more.

### Type 2. Numbered list with a fixed title, cards and b-roll
**Used by:** Sundas "Don't Become a Data Analyst if" (3.53M), Baraa "Don't Become a Data Analyst!" (469K), Baraa "Python in 3 steps" (354K), Aishwarya AI jobs (215K, "#1/#2/#3" cards), Jash DSA (78K).

**How to film it**
- Film the Type 1 talking head.
- Then spend 5 minutes on 3–6 b-roll clips of 3–4 s each: your hands typing, your screen (SQL, a dashboard, a notebook), a wide side shot of you at your desk, and a close-up of a notebook or whiteboard. Film them with the phone on the same tripod, just moved.

**How to edit it**
- Top title for the whole Short, two lines: a small white line plus a big yellow line ("3 reasons NOT to become a" / "Data Engineer"). Put it in the top 15% of the frame.
- For each point, put a card in the lower third ("#1 You hate on-call") and keep it on screen while that point runs. Or put a small chapter pill under the captions, like Sundas.
- Cut to one b-roll clip of 2–4 s inside each point. Go back to your face for the punchline of each point.

### Type 3. Graphic on top, face below (explainer split)
**Used by:** Zach "5 levels of SQL" (427K), Baraa "Python in 3 steps" (354K), Rishabh "5 SQL websites" (543K, face bubble over screen recordings), Aishwarya AI jobs (215K, full-screen charts).

**How to film it**
- Film the Type 1 talking head, but frame a little wider so your face still reads when it sits in the bottom half.
- Separately, record your screen: code, a SQL editor, a diagram, a website. Zoom the browser or editor to 150–200% so the text can be read on a phone.

**How to edit it**
- 9:16 canvas. Put the screen recording or diagram in the top 50–60% and your clip in the bottom 40–50%. Or put the screen full-screen with your face in a circle at the bottom right.
- Make one simple "map" graphic (a pyramid, a level list, steps 1–2–3) and bring it back between sections, filling in one step at a time.
- Captions: small boxes on the split line, or big key words only.
- Switch layout about every 3–5 s.

### Type 4. Mock interview video call split
**Used by:** Sumit Mittal "Parquet" (243K) and "PySpark optimization" (162K), The Big Data Show "Explaining your project" (307K) and "Pandas vs PySpark" (211K). Jash's skit (189K) uses the same layout.

**How to film it**
- Run a real mock interview on Zoom, Google Meet or Riverside, and record each person's camera. Webcam quality is fine: all four of these Shorts are plain webcam footage. Both people use headsets or earbuds.
- Ask one clear, common interview question per Short.

**How to edit it**
- Crop each person's tile and stack them: interviewer on top, candidate below. Cut down to one question and its answer (40–60 s).
- Optional 1–2 s full-screen colour card with the question at the start (Sumit's style). Or start straight on the question (Big Data Show).
- Captions: sentence chunks in a solid box (white or red) placed on the line between the two tiles.
- No other cuts. To push people to the full interview, end mid-answer.

### Type 5. Event or street interview with a handheld mic
**Used by:** Sundas "How much money Software Engineers make?" (4.88M) and "Data Engineer vs Data Scientist" (2.20M). These are two of the three biggest Shorts in this set (the skipped unboxing is not counted).

**How to film it**
- Go to a meetup, a conference or an office. A friend holds the phone vertical at chest height, or you lock it on a tripod for a wide shot.
- Use a wireless mic transmitter as a handheld mic and hold it towards each person.
- One guest: film a wide two-shot first, then a closer single of the guest's answer. If you film in 4K, you can crop in later instead.
- "X vs Y" with two guests: one wide, full-body shot of all three people, held for the whole Short.

**How to edit it**
- A fixed top title in a yellow box with black text, worded as the viewer's question ("How much do data engineers make?"). Or two "X" vs "Y" labels over the guests.
- Phrase captions at chest height. Show key answers (salary, skills) as text over the person who said them.
- End on the reveal and a reaction ("wow") so it loops. Keep it short: 20–55 s.

### Type 6. Podcast clip, two cameras
**Used by:** Mo Chen "Use of Power BI as a Business Analyst" (119K).

**How to film it**
- Two phones on tripods, one on each person at a 3/4 angle. Each person has a desk mic on a stand in the shot.
- Bright neutral room, a plant, a laptop on the desk.

**How to edit it**
- Start on the host's question: the question is the hook. Cut to the guest's whole answer as one take. End on a short host reaction shot.
- Subtitle-style captions (text on a black box).
- 2–3 cuts in total.

### Type 7. Skit: you play two roles on a fake call
**Used by:** Jash Radia "Data Engineering Interviews in 2021 vs 2025" (189K).

**How to film it**
- Film yourself twice in two outfits and two places (interviewer at a desk with a laptop; candidate somewhere else). Use webcam-style framing at eye level.
- Write a script with a clear before/after and a one-line punchline at the end.

**How to edit it**
- Stack both clips in a fake call layout and add a call controls bar.
- Add title cards for the two parts ("2021" / "vs 2025"), bold captions on the split line, and one sound effect or visual gag at the punchline.
- End on the punchline and a laugh.

### Type 8. Challenge or activity wide shot (rapid-fire Q&A)
**Used by:** Aishwarya "AI Rapid fire while doing Dead-Hangs" (205K).

**How to film it**
- Phone on a tripod, wide, full body, one take of about 30 s while you do something physical or awkward (dead hang, plank, walking up stairs).
- A friend off camera reads 6–8 quick questions. The last question sets up your call to action ("Best resource to learn data engineering?").

**How to edit it**
- No cuts. A fixed top title that names the challenge ("Data Engineering rapid fire while planking").
- Captions for both the question and the answer, with the answer in a different colour or style.
- About 5 minutes of editing.

---

## If Stackle copies only three

1. **Type 2 (numbered list with fixed title)** for evergreen career advice ("Don't become a data engineer if…"). It is the format of the 3.5M Sundas Short and the 469K Baraa Short.
2. **Type 5 (event interview, "X vs Y" or "How much do … make?")** at the next meetup or conference. It is the top format by views in this set, and it needs guests, not editing.
3. **Type 4 (mock interview split)** if Stackle already runs or can record mock interviews. It is the cheapest to make: no new filming and almost no editing.
