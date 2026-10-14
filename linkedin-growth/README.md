# LinkedIn growth playbook: 13k → 25k followers by Dec 14, 2026

Built Oct 14, 2026 for Chris (Stackle). It draws on verified public LinkedIn data from data, AI and LinkedIn-growth creators, LinkedIn's own 2026 engineering and policy posts, and the large third-party datasets (Buffer, AuthoredUp, Metricool, Socialinsider, Shield, van der Blom).

| File | What's in it |
|---|---|
| `README.md` (this file) | The strategy: the math, positioning, rules, growth levers, the 60-day plan |
| [`hooks-swipe-file.md`](hooks-swipe-file.md) | 1,099 verified hooks (100+ reactions each) with author, followers, reactions, link, and which patterns win |
| [`evidence.md`](evidence.md) | Who we actually checked, and which rule each person is behind |
| [`creators.md`](creators.md) | Who to study and who to collaborate with: data, AI and LinkedIn-growth creators with exact follower counts and signature formats |
| [`visuals.md`](visuals.md) | Which images, carousels, infographics, videos and GIFs work, with specs and examples |
| [`calendar-60-days.md`](calendar-60-days.md) | Oct 15 to Dec 13: one post a day, written as hooks, plus the weekly Live/newsletter/collab tasks |
| [`research/algorithm-and-formats-2026.md`](research/algorithm-and-formats-2026.md) | Sourced notes on how the 2026 feed ranks posts, format benchmarks, follower mechanics |
| [`research/growth-sellers-playbooks.md`](research/growth-sellers-playbooks.md) | What Vedika Bhaia, Unnati Bagga (The Growth Square), Justin Welsh, Jasmin Alić, Lara Acosta and others do and teach, including The Growth Square's 50-hook swipe file and ~20 fast-growth case studies |
| [`research/data-creators.md`](research/data-creators.md) | 32 data creators: exact followers, typical post today, formats, hook patterns, every verified post |
| [`research/ai-creators.md`](research/ai-creators.md) | 42 AI creators: who still wins in 2026, visual systems (Rakesh Gohel, Brij Pandey, Alex Xu, Avi Chawla), the AI angle a data engineer can own |
| [`data/verified-posts.csv`](data/verified-posts.csv) | The raw table behind the swipe file, to filter and sort |

---

## 1. The honest math (read this first)

**The goal:** 13,000 → 25,000 followers by Dec 14, 2026 means **+12,000 in 61 days**, about **200 new followers a day**. That is +92% in two months.

**The benchmark:** the median active LinkedIn profile grows about **2.7% a month** ([AuthoredUp](https://authoredup.com/blog/linkedin-metrics-to-track)). Your goal is about 46% a month, roughly **17 times the median**. It is a stretch target, not a default outcome. It can be reached, but only with several breakout posts **and** growth from outside the feed (events, collaborations, your Meetup and workshop audiences, and possibly paid boosts). Posting daily alone will not get there.

**What "1k-10k impressions every post" means at your size.** Shield's benchmarks for 10k-25k follower accounts ([Feb 2026](https://theshieldindex.beehiiv.com/p/february-2026-linkedin-reach-benchmarks-by-follower-bracket)):

| Percentile | Impressions per post |
|---|---|
| Typical (p50) | 1,216 |
| Strong (p75) | 3,248 |
| Top 10% (p90) | 9,052 |
| Breakout (p99) | 75,131 |

So 1,000+ every post is the median for your tier: a realistic floor once every post is on-niche. **10,000+ is a top-10% post.** Your own record shows you can already make those: Amazon interview 37,031 · Mercedes-Benz questions 27K · "What Amazon, Google, Netflix expect" 11,238 · cracked loops 4,725. The work is making that hit rate consistent and turning the reach into follows.

**Your conversion number (do this first, tomorrow).** LinkedIn post analytics now show *followers gained* and *profile viewers* per post. Open your top 20 posts and write down impressions and followers gained for each. Divide to get **your followers per 1,000 impressions (F/1k)**. Everything below scales off that number:

| Your F/1k | Impressions needed for +12k followers | Per day |
|---|---|---|
| 2 | 6.0M | ~98k |
| 5 | 2.4M | ~39k |
| 10 | 1.2M | ~20k |

Sixty posts at your current top-10% level (~9k each) is about 540k impressions. That gap is why the plan below leans on **breakout posts plus off-feed levers**. One more point: follows come from *relevance*, not raw reach. One analysis found a 93k-impression post that gained 15 followers ([contentin.io](https://contentin.io/blog/why-93000-linkedin-impressions-performed-worse-than-838-the-algorithm-truth-nobodys-talking-about)). A post that only data engineers love beats a meme that everyone likes.

**It has been done, and it always looked the same:**
- The Growth Square says one of its clients added 10,000+ followers in 55 days.
- Vedika Bhaia says a client of hers added 14k in 2 months, with "7-8 back to back bangers" and 400+ relevant connections added every month.
- A Matt Barker client at about 18k followers gained about 2,000 from a single carousel.

These are self-reported. **Every ~10k-in-60-days case came from a cluster of viral posts plus deliberate network growth**, never from a steady average ([`research/growth-sellers-playbooks.md`](research/growth-sellers-playbooks.md), section 6).

**Realistic outcome:** if you execute every lever in section 6, the floor is roughly 17-19k by mid-December (a planning estimate, not a measured benchmark). Reaching 25k needs 3-5 breakout posts (60k+ impressions each), two or three collaborations with large data or AI creators, and a paid test that works. Treat 25k as the stretch target and track weekly against the targets in section 8.

---

## 2. How to become the #1 data & AI creator: own a lane first

You won't pass the giants in 60 days. The biggest accounts in this space have hundreds of thousands of followers (see [`creators.md`](creators.md)). You can, however, be **#1 in a lane none of them owns**, then widen it.

**Who owns what right now** (exact followers; "typical" = median reactions on their latest posts, Oct 2026):

| Lane | Owner | Followers | Typical post now |
|---|---|---|---|
| Data engineering careers + big-tech comp | Zach Wilson | 533,177 | 126 (his all-time best: a comp post, 14,528) |
| India DE courses + memes | Shashank Mishra, Darshil Parmar | 191,669 / 146,292 | 41 / 48 (technical explainers: 11-57; memes: 3,000+) |
| SQL interview puzzles | Ankit Bansal | 262,943 | 218 |
| DE interview scenarios, one market | Ajay Kadiyala (Dubai) | 185,417 | **522, highest of any data creator checked** |
| AI explainer infographics | Brij Kishore Pandey, Alex Xu | 740,434 / 1,036,872 | 252 / 736 |
| AI = a data problem | Andreas Horn | 257,466 | 262 (his "…It is fixing your data." post got 1,952) |

Two things stand out:
- **Big accounts' typical posts are small now.** Follower count doesn't predict the typical post; format and topic do.
- **The creator with the best typical post in the data niche is running your format,** first-person interview scenarios, in a single market (Dubai). Nobody runs it for the US/global big-tech market from the hiring side.

More in [`creators.md`](creators.md).

**The open lane: the hiring side of data & AI interviews.** None of the large accounts has your edge: **200+ data engineering interviews run from the hiring side** across banking, healthcare, automotive and exchanges, plus your own recent loops (Amazon, Mercedes-Benz, Airbnb's "design our data warehouse", a healthcare AI startup). Interview, money and big-tech-expectation posts are already your best performers.

Hiring-side hooks also break out for small accounts in neighbouring niches (verified):
- Izmah Khan, 8,038 followers: 23,549 reactions on "Today, I witnessed my team lead interviewing a Full-Stack Web Developer…"
- Rajya Vardhan Mishra: 9,286 on "In the last 15 years, I have interviewed 800+ Software Engineers…"
- Harshit Sharma: 6,081 on "After taking 75 Software Engineer interviews at Google in < 7 months"
- Alejandro R., 11,198 followers: 2,342 on "I can tell in 5 minutes during an interview if someone understands data"
- Kateryna Stetsiuk, 14,960 followers: 1,109 on "I've interviewed around 150 candidates for ML/AI Engineer positions…"

Your "200+ interviews" is the same hook with more behind it.

**How AI fits without killing reach.** Your AI listicles and tool comparisons got 120-260 impressions. LinkedIn is now actively suppressing that kind of content:
- In 2026 LinkedIn began classifying "low-effort, likely AI-generated" posts, and views of flagged posts are down 40% ([LinkedIn, Sep 2026](https://news.linkedin.com/2026/how-linkedin-is-tackling-ai-slop)).
- Since Oct 8, 2026, those classifiers check **every post shown outside your network**, which is exactly the audience you need to grow ([Tim Jurka, LinkedIn VP Eng](https://www.linkedin.com/pulse/technology-behind-linkedins-fight-against-ai-slop-tim-jurka-7ojbc/)).
- "Top 10 AI tools" posts are the most recycled content in the niche.
- **Even the giants' typical AI posts are small now.** Median reactions on recent posts: Brij Kishore Pandey 252 on 740k followers, Ruben Hassid 285 on 945k, Avi Chawla 86 on 177k, Armand Ruiz 46 on 208k. Generic "AI agents explained" has the weakest 2026 median of the major AI topics ([`research/ai-creators.md`](research/ai-creators.md)).
- **An outside study backs the "AI through your own niche" approach.** It found creators whose feeds are mostly about something else earn an *AI premium* when they post AI, while heavy AI posters drag their own medians down ([MagicPost, Jun 2026](https://magicpost.in/blog/top-linkedin-creators-ai)).

So **AI goes through your lens: careers, interviews and money**, never generic explainers.
- "The AI round that's now in data engineering interviews"
- "What OpenAI / Anthropic / Databricks expect from a data engineer"
- "Data engineer vs AI engineer: same pipelines, different pay"
- "The question I now ask every data engineer about AI"
- A real DE-to-AI-engineering move with numbers

Plus one more angle nobody big owns: **"AI is a data problem."** RAG quality is retrieval and data quality, agent memory is a data model, and semantic layers and data contracts sit under every agent. Small accounts get outsized results there:

| Author (followers) | Reactions | Hook |
|---|---|---|
| Shobhit Tankha (8,296) | 1,551 | "A lot of AI engineers (even sharp ones) get seduced by the cool factor of vector databases." |
| Isin Pesch (5,601) | 1,369 | "Everyone is selling the semantic layer as the way to make AI agents reliable on your data." |
| Andreas Horn | 1,952 (his typical post: 262) | "…has nothing to do with AI. It is fixing your data." |

That is the bridge from "the data engineering interviews guy" to "the data & AI careers guy".

**News-jacks, done the data way, are your spike lever.** Day-one posts on big AI launches got a median of 8.1 reactions per 1k followers in the growth-seller sample, against 1.9 for niche business news. In the data niche, tool news with an immediate practical consequence beats generic AI commentary from the same creators:

| Post | Reactions |
|---|---|
| "AWS just put DuckDB inside Aurora PostgreSQL" | 746 |
| "Python is getting lazy… lazy imports" | 1,165 |
| Generic AI commentary from the same creators | 40-69 |

When a major data or AI launch lands, replace that day's post with: "[Launch] just shipped. Here's what it changes for data engineers / in interviews.

**Make LinkedIn understand the lane.** The 2026 feed finds candidate audiences by matching the text of your post *and your headline/industry* to members' profiles with an LLM ([LinkedIn Engineering, Mar 2026](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed)). Off-topic posts confuse that matching. Keep about 80% of posts on one main topic (data & AI careers and interviews) and 2-3 sub-topics ([van der Blom, Jun 2026](https://pod.wave.co/podcast/creator-science-dc8ffac2-9d4b-4034-a53c-bc78b533d35a/307-richard-van-der-blom-the-state-of-linkedin-in-2026-based-on-data-from-13-million-posts)).

---

## 3. What the 2026 feed rewards (the short version)

Full sources in [`research/algorithm-and-formats-2026.md`](research/algorithm-and-formats-2026.md).

1. **Topic fit decides who sees the post.** An LLM matches post text plus your headline to member profiles, and a sequence model ranks the result. Stay on-niche and keep your headline explicit.
2. **The ranker predicts long dwell and contributions.** Long dwell means people stop and read; contributions are reactions, comments and reposts. Write posts that are worth reading to the end. Reply to every real comment in the first hour or two: replies to commenters are associated with up to 2.4x reach ([AuthoredUp](https://authoredup.com/blog/linkedin-algorithm)).
3. **Engagement bait is filtered.** That includes "comment YES", "comment PDF to get it", "repost if", pods and comment automation ([LinkedIn, Mar 2026](https://news.linkedin.com/2026/ImprovingTheFeed)). LinkedIn's own definition of bait is explicitly asking for likes, comments, shares or follows. **No "comment X for the PDF" posts**, even though growth sellers still teach them.
4. **AI slop is filtered beyond your network** (section 2). Write in your own voice, with first-hand detail no one else has.
5. **Links:** LinkedIn says links aren't penalized, but personal-profile studies show 19-27% less reach for a link in the body ([Metricool 2026](https://metricool.com/linkedin-trends/)). Keep links out of posts; point to "my Featured section".
6. **Hashtags:** 0-3, or none. **Tags:** only tag people who are genuinely in the post. Tagging for attention counts as bait.
7. **Cadence:** more posts per week lifts impressions per post ([Buffer, 2M posts](https://buffer.com/resources/how-often-to-post-on-linkedin/)). Never post twice in 24 hours. The plan is **one post a day**.
8. **Timing:** weekday afternoons in the audience's local time perform best (Buffer: 3-8 pm, Wednesday 4 pm the single best slot; [Sep 2026](https://buffer.com/resources/best-time-to-post-on-linkedin/)). Your audience is split between the US and India, so test **8:30 am ET** (6 pm IST) against **12:30 pm ET**, and keep whichever wins.
9. **Saves and sends** are now in your analytics. Saved posts correlate with follows ([AuthoredUp](https://authoredup.com/blog/linkedin-algorithm)). Interview questions, answers and checklists are the most saveable things you make.
10. **Newsletters:** the first edition invites all your followers and connections, and every later edition notifies subscribers ([LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a517925)). Standalone articles get about 0.4x normal reach (van der Blom).

---

## 4. Hooks: the rules that come out of the data

What 1,000+ verified hooks say (details: [`hooks-swipe-file.md`](hooks-swipe-file.md) and the three research files):

- **Data niche:**
  - **Money with an exact number and a company has the highest median** (1,475). Examples: Zach Wilson's comp post (14,528), "From Intern to Amazon - Here is my salary growth" (6,231), "In 11 months I negotiated from $71K to $153K" (1,475).
  - Next: career-transition stories (902), first-person interview stories at a named company or market (748), contrarian takes about hiring (693).
  - **Pure technical explainers with no story or number got 11-57**, even on 150k-200k accounts.
- **AI niche:**
  - "X vs Y" comparisons and "the shift to X" posts have the highest medians.
  - **First-person proof has the fattest tail**: the 31,313 post was "I spent 3+ hours in the last 2 weeks putting together this no-nonsense curriculum".
  - Generic agent explainers and copy-paste prompt posts are cooling in 2026.
- **Growth sellers:**
  - Aphorism one-liners win for 700k+ accounts. Real milestones (6.0 reactions per 1k followers) and then-vs-now arcs (5.0) win per follower.
  - **"Comment X to get it" posts get 3-4x the comments but fewer reactions**: 0.6 per 1k followers in the last 12 months, the lowest of any pattern.
- **Across all three:** pattern medians sit close together (about 3-7 reactions per 1k followers). The spread *inside* a pattern is much bigger than between patterns. **Specificity beats the template**: a real number, a named company, one moment, your own stake.

**Your hook rules (data + your own numbers):**
1. **Line 1 names a company or a dollar figure** whenever it's true. Your 37k, 27k and 11k posts all did, and so do many of the top data hooks in the swipe file.
2. **First person, one specific moment.** Example: "Recently took a Data Engineering interview at Amazon. Section 2 stopped me mid-thought." Coaching framing ("I've been helping engineers…") got 138. The same topic in first person got 4,725.
3. **Keep the hook under ~140 characters**, since that's roughly what shows before "…more" on mobile. Two lines at most before the break.
4. **Contrarian or hiring-side truth works when you earn it.** "I've run 200+ data engineering interviews. [Something people get wrong]." Only use it if it's true and you can back it up in the body.
5. **Lists and cheat sheets win on raw reactions**, but only when the list is yours: questions you asked or were asked, stages of a real answer. A generic list is exactly what the slop filter catches.
6. **News hooks work for the big AI accounts** (Andrew Ng, Allie K. Miller and others). For you, news only works through your lens: "OpenAI is hiring data engineers. Here's what the role actually asks for."
7. **Never** open with "Here's", invent a dramatic setup, or use engagement bait.

**15 templates in your lane** (fill each with a true detail; * means it needs a real detail from you):

| Pattern | Template |
|---|---|
| Company + first-person moment | Recently took a data engineering interview at [Company]. [Round] stopped me mid-thought.* |
| Company + question | "[Exact question]" — [Company] asked me this in a data engineering loop.* |
| Hiring side | I've run 200+ data engineering interviews. The [question / moment] that decides most of them happens in [minute / round].* |
| Hiring side contrarian | Most people fail [Company]-style SQL rounds before they write a line of SQL.* |
| What big tech expects | What [Company] expects from a [level] data engineer in 2026 (from their actual job posts). |
| AI company expects | What [OpenAI / Anthropic / Databricks] expects from a data engineer, from their actual job posts. |
| Money + company + deadline | $[verified number] data engineer at [Company]. [N] weeks left in 2026. |
| Money comparison | Data engineer vs AI engineer at [Company]: $[A] vs $[B] (Levels.fyi). |
| Before → after | This resume bullet got rejected at [Company]. This version gets calls.* |
| Before → after answer | Weak answer vs passing answer to "[question]". |
| Failure → turnaround | My first big tech loop in 2019 didn't go as planned. In 2021 I changed one thing and got the offer.* |
| Founder honesty | Stackle is [N] months old. [Real number] is the one I check every morning.* |
| Proof / milestone | 511 people showed up to a free workshop on a [day]. One question came up [N] times.* |
| AI through your lens | The AI question now showing up in data engineering interviews (I got it at [Company]).* |
| Relatable humour (max 1/week) | A real data engineering moment as an image + one line. ("The pipeline is green. The dashboard is wrong.") |

The full list of verified hooks, sorted by pattern and by how much each beat its author's audience size, is in [`hooks-swipe-file.md`](hooks-swipe-file.md).

---

## 5. Formats and visuals (summary; details in [`visuals.md`](visuals.md))

- **Story posts** (interview moments, money, founder, hiring side): **text-only or one real photo is enough.** In the data niche, text-only and image posts are close (2.0 vs 2.5 reactions per 1k followers), and the biggest data post (14,528) is text-only. Andrew Ng's 21,964-reaction story is text-only too.
- **Teaching posts** (What Big Tech Expects, Before/After, X vs Y, interview answers): **one strong image.** Infographics, cheat sheets and diagrams are what people save. In the AI niche, 187 of 243 verified winners were single-image posts. Use 4:5 portrait (1080x1350) with your face and handle in the header (Rakesh Gohel and Brij Pandey style), so reposts carry your name.
- **Carousels:** only for step-by-step walkthroughs, 8-12 slides, slide 1 = the end result. A Matt Barker client at about 18k followers gained about 2,000 followers from one carousel in 2026. But documents can't be boosted, and per-follower results fell over the last 12 months.
- **Video:** the weakest format in the data niche (1.0 reactions per 1k followers vs 2.0-2.5 for text and images), and per-post video reach is down 36% year on year. Use it for 60-180 second clips from your weekly Live, with captions burned in.
- **GIFs / animated diagrams:** Rakesh Gohel, Alex Xu and Avi Chawla use them, but no dataset measures their reach. They upload as video. Optional.
- **Memes:** one a week at most. They buy reach (Shashank Mishra's 3,832 vs 11-57 for his explainers) but convert to followers poorly.

---

## 6. Growth levers beyond posting (this is where the extra followers come from)

Posting gets you reach. These levers turn reach and your existing audiences into **followers**. The targets are planning targets: measure each one weekly and keep only what moves the number.

| # | Lever | What exactly to do | 60-day target |
|---|---|---|---|
| 1 | **Profile conversion** | Headline names the lane: "Data & AI Engineering Careers · 200+ data engineering interviews run from the hiring side · Founder @Stackle". Banner states the promise and the proof. Featured holds the free roadmap, the next event and the newsletter. Settings → Visibility → Followers → **make Follow primary** ([LinkedIn Help](https://www.linkedin.com/help/billing/answer/53652)). | Profile views → follows up week over week |
| 2 | **Owned audiences → LinkedIn** | Meetup (~3,900 members), every workshop (511 at the Claude one), YouTube, TikTok, the Stackle email list and your students. Add a "Follow me on LinkedIn" slide with a QR code to every session, plus the link in every Meetup and event email, in the YouTube description and pinned comment, and in your TikTok bio. Say it out loud at the end of every live session. | 1,000-2,000 follows |
| 3 | **Weekly LinkedIn Event + Live** | Run the workshops you already do as **LinkedIn Events**, which need a LinkedIn signup and put your profile in front of every registrant. Add a weekly "Across the Table Live": a real mock data engineering interview, with a volunteer, in 30-45 minutes. Clip the best 60-90 seconds into a post afterward. | 8 events, 300+ registrants each |
| 4 | **Newsletter: "Across the Table"** | Launch in week 1. The first edition invites all ~13k followers plus connections. Publish weekly: one real interview question, how to answer it, and what the hiring side saw. Every edition notifies subscribers. | 3,000+ subscribers |
| 5 | **Collaborations** | Pick 10 data or AI creators with 20k-500k followers from [`creators.md`](creators.md). Offer something concrete: "I'll run a live mock interview with one of your followers on your Live" or a co-hosted event on "what hiring managers look for in 2026". Co-host LinkedIn Events so both of you can invite your networks, and tag only people who are genuinely in the post. | 3-4 collabs with 50k+ creators |
| 6 | **Commenting** | 30 minutes a day, 10-15 real comments (35-120 words, your own experience) on posts from the creators list, early in their life. Top-1% creators reply about 8x more than average ones, and commenting frequency correlates with follower growth ([summary](https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports)). No AI-written comments: LinkedIn now detects and suppresses them. | ~600 real comments |
| 7 | **Paid boost test** | Once a week, boost the post that is already winning organically, using the "growing followers" goal. Target data engineers and analytics engineers in the US and India. Images, text and video can be boosted; documents and polls can't ([LinkedIn Help](https://www.linkedin.com/help/lms/answer/a6584635)). Thought Leader Ads run at about a $49 median CPM in B2B ([ZenABM](https://zenabm.com/blog/tla-benchmarks/)). Start at $50-100 per boost and compute cost per follower. Scale only if it's cheaper than your target (e.g. under $1.50/follower). | Decide by week 3 |
| 8 | **Targeted connection requests** | Accepted connections also follow you. Send personal-note requests to data engineers who engaged with your posts or attended your events. Keep your follower-to-connection ratio healthy (≥1.5 per [AuthoredUp](https://authoredup.com/blog/linkedin-algorithm)). | 300-600 accepted |

---

## 7. The 60-day plan

Day-by-day calendar with hooks: [`calendar-60-days.md`](calendar-60-days.md).

**Week 0-1 (Oct 15-21): set up the machine**
- Pull your baseline: F/1k from your top 20 posts; your best day and time; your top 5 posts by followers gained.
- Rewrite your headline, About (first 3 lines), banner and Featured. Make Follow primary.
- Launch the "Across the Table" newsletter, first edition.
- Schedule 4 weekly Live/Events through mid-November and send 10 collab invites.
- Fix the video scripts that say "more than two hundred thousand people follow me on LinkedIn". Use your real number.

**Weeks 2-4 (Oct 22-Nov 11): find the breakout format**
- Daily posts on the weekly rhythm. One Live a week. One newsletter a week.
- After each week, rank posts by **followers gained**, not likes. Make more of the format that converts, with a new topic each time: no repeats, no part twos.
- Run the paid boost test on the best post of each week.

**Weeks 5-8 (Nov 12-Dec 13): scale what converts**
- Double the share of the winning format. Run 2-3 collaborations with bigger creators. Run one larger "event" week, such as a free 3-day "Data & AI interview sprint" as LinkedIn Events.

---

## 8. Track this every Sunday (10 minutes)

| Metric | Where | Weekly target |
|---|---|---|
| Net new followers | Analytics → Audience | ~1,400/week for 25k; ~575/week for 18k |
| Median impressions per post | Post analytics | ≥3,000 (p75 for your tier) |
| Posts over 10k impressions | Post analytics | ≥2 a week |
| Followers gained per post (top 3) | Post analytics | Learn which format converts |
| Profile views | Analytics | Rising week over week |
| Newsletter subscribers | Newsletter analytics | +400/week |
| Event registrants | Event page | 300+ per event |
| Paid: cost per follower | Campaign / boost analytics | Under your target or stop |

---

## 9. Never do these (they cost reach or trust)

- "Comment PDF / YES to get it", "repost if", "follow for more" asks. LinkedIn defines all of these as bait.
- Engagement pods, auto-comment tools, AI-written comments, browser-extension automation. LinkedIn says pods are being made ineffective and automation is not allowed.
- Generic AI listicles, tool-vs-tool posts, "Top 10 tools". They score low on your account and are what the slop filter targets.
- External links in the post body.
- Part twos, sequels or repeats. Your repeat dropped from 1,557 to 202.
- Invented stories, quotes or numbers. Every claim must be real. Check salary numbers on Levels.fyi before posting.
- More than 3 hashtags, or tagging people who aren't in the post.
