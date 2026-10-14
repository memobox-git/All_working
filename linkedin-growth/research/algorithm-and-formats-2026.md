# How LinkedIn reach and follower growth work in 2026 (sourced research notes)

Client context: data engineer and founder of a data & AI career-education startup, about 13k followers. Goals: 1,000 to 10,000+ impressions on every post, 25k followers in 2 months, become the top data & AI creator.

Labels used below:
- **[FACT-PRIMARY]**: LinkedIn's own engineering blog, newsroom, help center, an exec post, or a LinkedIn-authored paper.
- **[DATA]**: a third-party dataset with a stated sample. Correlational, vendor-run, and usually not peer reviewed.
- **[UNVERIFIED]**: commonly repeated, with no traceable primary source or method.

Method note: every URL below was fetched or returned in search results. Gaps are listed in section 7.

---

## 1. How ranking works in 2025-2026

### 1.1 Architecture: what is confirmed
- **[FACT-PRIMARY] Mar 12, 2026.** LinkedIn's engineering blog post "Engineering the next generation of LinkedIn's Feed" (Hristo Danchev) describes two stages:
  - **Retrieval:** an LLM-based dual encoder. Members and posts are turned into text prompts, embedded, and matched by cosine similarity. It replaced several older candidate sources: chronological network activity, trending, collaborative filtering, industry trends and multiple embedding systems.
  - **Ranking:** a transformer "Generative Recommender" (GR) that reads a member's interaction history as an ordered sequence of more than 1,000 interactions.
  - URL: https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed
- **[FACT-PRIMARY]** Inputs to the member prompt: profile, skills, work history, education, and a chronological history of positive engagements. Matching works on meaning, not just keywords. The blog's example links "electrical engineering" to "small modular reactors". For new members, the LLM infers interests from the headline and job title. Same URL.
- **[FACT-PRIMARY]** Popularity counts (views, engagement rate, recency, affinity) are fed to the LLM as percentile buckets in special tokens, for example `<view_percentile>71</view_percentile>`. This raised the correlation between popularity and embedding similarity by 30x, and Recall@10 by 15%. Popularity therefore still matters for which posts become candidates. Same URL.
- **[FACT-PRIMARY]** The ranking model predicts passive tasks (click, skip, long-dwell) and active tasks (like, comment, share) through a Multi-gate Mixture-of-Experts head. The weights are not disclosed. Same URL.
- **[FACT-PRIMARY]** The arXiv paper "An Industrial-Scale Sequential Recommender for LinkedIn Feed Ranking" (Feed SR) was submitted Feb 12, 2026 (v3 Sep 16, 2026) and accepted at CIKM 2026.
  - Feed SR replaced a DCNv2 ranker and has served most Feed traffic.
  - Online A/B results: time spent +2.10%, likes/comments/reshares +3.52%.
  - Training targets are **Long Dwell** (dwell above a threshold that depends on post type) and **Contributions** (like, comment, share), combined with undisclosed weights.
  - The model keeps each member's last 1,000 impressions, built from a year of data, and is retrained daily.
  - Viewer-to-author affinity is a key signal.
  - URL: https://arxiv.org/abs/2602.12354 (details from https://arxiv.org/html/2602.12354v3)
- **[FACT-PRIMARY]** In the same paper, an **LLM-as-ranker** was tested and **abandoned**: numeric features encoded poorly as text, token costs were too high, it never beat production online, and it was weak on network posts, although it did well on out-of-network posts. The LLM sits in **retrieval**, not final ranking. https://arxiv.org/html/2602.12354v3
- **[FACT-PRIMARY] "360Brew"** was a 150B-parameter decoder-only "research pre-production model". The arXiv paper (2501.16450, Jan 2025) has since been **withdrawn** for a licensing reason. The March 2026 feed post does not mention 360Brew. Blogs that say "360Brew ranks your feed" are therefore **[UNVERIFIED]** and probably out of date. https://arxiv.org/abs/2501.16450 ; analysis: https://fast-growth.fr/linkedin-algorithm-2026-proven-invented/
- **[FACT-PRIMARY] Mar 12, 2026.** Tim Jurka (LinkedIn VP Engineering) says ranking uses GR plus LLMs over profile information (industry, experience, skills, geography) and engagement history. https://www.linkedin.com/pulse/updates-linkedin-feed-focusing-authentic-relevant-tim-jurka-umwnc/ ; pressroom: https://news.linkedin.com/2026/ImprovingTheFeed
- **[FACT-PRIMARY] Dwell, 2020 baseline.** LinkedIn's dwell-time post (May 12, 2020):
  - On-feed dwell starts counting once 50% of a post is visible.
  - A P(skip) model lowers a post's score when it is predicted to be skipped.
  - URL: https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time

**What this means for the client (inference):**
- Retrieval matches the text of a post, including the author's headline, company and industry, to members' profiles and engagement histories. A tight, consistent data/AI identity in the headline, plus posts that are clearly about data engineering and AI careers, decides who becomes a candidate audience. A fast-growth analysis of the engineering post confirms that the post description includes the author's headline, company and industry: https://fast-growth.fr/en/white-paper/linkedin-algorithm-2026/
- Ranking then rewards posts people stop and read (long dwell) and contribute to (comment, share, react).

### 1.2 Topic and expertise consistency
- **[DATA]** van der Blom (Algorithm Insights): staying on 2-3 core topics for 90 days correlates with +27% reach and +41% "topic-based follows". A series of 2-3 posts on one theme correlates with +38% profile visits. Secondary summary: https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports
- **[DATA/anecdote]** van der Blom (Creator Science #307, Jun 2, 2026):
  - About 80% of your content should sit on one main topic, with 2-3 subtopics.
  - After rewriting his profile in Feb 2026, his profile visits and reach rose within 3 weeks.
  - LinkedIn has moved from a relationship graph to an interest graph, "the biggest shift in 10 years".
  - About 9% of feed slots are algorithmically suggested posts.
  - URL: https://pod.wave.co/podcast/creator-science-dc8ffac2-9d4b-4034-a53c-bc78b533d35a/307-richard-van-der-blom-the-state-of-linkedin-in-2026-based-on-data-from-13-million-posts

### 1.3 The "test audience" and first hour
- **[UNVERIFIED]** The "golden hour", a 2-5% test audience, and the claim that "only ~5% of posts recover" have no LinkedIn primary source. A 2026 audit found no traceable source for the timing percentages that circulate, such as "reply in first hour +35%" or "commenting elsewhere first +21%": https://fast-growth.fr/en/white-paper/linkedin-algorithm-2026/
- **[DATA]** AuthoredUp describes three stages: classification (0-60 min), engagement testing (1-2 h), and extended distribution (2 h+). This is a vendor description, not a disclosed mechanism. https://authoredup.com/blog/linkedin-algorithm
- **[DATA]** Metricool's 2026 study: 50% of total impressions arrive within the first 48 hours. https://metricool.com/linkedin-trends/
- **[DATA]** Posts can keep appearing for days to 2-3 weeks (AuthoredUp). https://authoredup.com/blog/linkedin-algorithm
- **[Practice]** van der Blom answers comments within the first 10-15 minutes and spends 25-30 minutes a day engaging (Jun 2026 podcast, URL above).

### 1.4 Comments, likes, saves, sends, reposts
- **[FACT-PRIMARY]** Comments and shares are predicted as their own "active" objectives, separate from likes, alongside long dwell. Exact weights are **not public**. https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed
- **[UNVERIFIED]** Specific multipliers have no primary source. These include "a comment = 15x a like", "a save = 5x a like and 2x a comment" (attributed to AuthoredUp), and "saves are the #1 factor". A save does not appear among the objectives in the Feed SR paper. https://fast-growth.fr/linkedin-algorithm-2026-proven-invented/
- **[DATA]** AuthoredUp: saved posts are linked to a 130% higher chance of a follow, and creators whose posts get saved grow about 3x faster. Correlational. https://authoredup.com/blog/linkedin-algorithm
- **[DATA]** AuthoredUp: replies to commenters ("indirect comments") are associated with up to 2.4x reach. Same URL.
- **[UNVERIFIED]** Comment length/quality weighting. No LinkedIn source specifies it. van der Blom's practice is 35-120-word comments on 4-7 profiles a day (via https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports).
- **[FACT-PRIMARY] Sep 10, 2025.** LinkedIn added **Saves** and **Sends on LinkedIn** (shares via DM) to post analytics. https://www.socialmediatoday.com/news/linkedin-adds-save-and-send-data-to-content-insights/759828/
- **[DATA] Metricool 2026** (673,658 posts, 63,108 accounts, Jan-Feb 2025 vs 2026):
  - Visible engagement fell: likes -13%, comments -17%, shares -11%.
  - Clicks per post rose about 5%, and the overall engagement rate rose from 12.21% to 13.90%.
  - In other words, "invisible" interactions (swipes, clicks, views) are growing.
  - URL: https://metricool.com/linkedin-trends/

### 1.5 Engagement bait, pods, AI comments: what is penalized
- **[FACT-PRIMARY]** LinkedIn defines engagement bait as "Content or actions that explicitly ask for likes, shares, comments, or follows". Its examples:
  - reaction-vote polls ("Like if you agree!")
  - tagging people for attention
  - irrelevant hashtags
  - "Asking for thoughts and feedback is acceptable."
  - Copying others' content is discouraged; reshares with your own insight are fine.
  - URL: https://www.linkedin.com/blog/content-recommendations-avoid
- **[FACT-PRIMARY] Mar 12, 2026.** LinkedIn said it will "filter out engagement bait", including "Comment 'Yes' if you agree" posts, videos unrelated to the post text, and "recycled" thought leadership. It will also "make engagement pods ineffective and curb comment automation". Third-party tools and browser extensions are "not allowed on LinkedIn". https://www.linkedin.com/pulse/updates-linkedin-feed-focusing-authentic-relevant-tim-jurka-umwnc/ ; https://news.linkedin.com/2026/ImprovingTheFeed
- **"Comment X to get the PDF":** asking for comments falls inside LinkedIn's own definition of bait above. **[UNVERIFIED]** I found no published number for how much reach it loses, so the size of the penalty is unknown.
- **[FACT-PRIMARY] Sep 15, 2026.** LinkedIn says it catches "hundreds of thousands of automated comment attempts" daily and has blocked "billions" of automated activity attempts over the past couple of months. https://news.linkedin.com/2026/how-linkedin-is-tackling-ai-slop
- **[FACT-PRIMARY via press] Sep 1, 2026.** LinkedIn's EU transparency report shows a **+46%** rise in detected inauthentic activity in H1 2026 compared with H2 2025. https://www.socialmediatoday.com/news/linkedin-increases-push-against-inauthentic-activity/829385/
- **[Press] May 19, 2026.** New classifiers look at comment language together with posting patterns and volume; AI tools comment faster and more often than people. https://www.entrepreneur.com/business-news/linkedin-is-fighting-back-against-ai-slop-and-ai-comments
- **[UNVERIFIED]** "Pod detection is 97% accurate", cited from van der Blom's report on the podcast (URL in 1.2). No LinkedIn source.
- **[Anecdote]** van der Blom: about 80% of the 20-30 comments he gets in the first five minutes are AI-written (Jun 2026 podcast).

### 1.6 External links and "link in comments"
- **[FACT-PRIMARY-ish, Sep 2025]** LinkedIn's Sr. Director of Product Management (named in secondary sources as Rishi Jobanputra) publicly said there is no algorithmic penalty for links when the post leads with value. Original post: https://www.linkedin.com/feed/update/urn:li:activity:7370869955623542785/ (via https://www.threads.com/@mattnavarra/post/DOWa_61Cown/ and https://thebreakoutinsights.substack.com/p/does-linkedin-penalize-external-links). LinkedIn's published documentation describes no link penalty.
- **[DATA] Studies conflict:**
  - Ordinal: -26.5% reach for posts with links, growing from 5% (2023) to 42% (2025). Ordinal sells a link-in-comment tool. Company pages show the largest penalty; personal profiles show almost none in its data. https://www.tryordinal.com/blog/linkedin-link-penalty-study
  - van der Blom: -18.8% median for a body link (Apr 2025), easing by about 3 points by 2026. Same URL.
  - Metricool 2026: personal profiles with links -27% impressions and -20% interactions; company pages with links +51% impressions. https://metricool.com/linkedin-trends/
  - DSMN8 (110k employee posts, Jan-Feb 2026): text posts averaged 775 impressions against 149 for link posts, but link posts drew more clicks. https://dsmn8.com/resources/whats-working-on-linkedin-in-2026-report/
  - AuthoredUp: a single link performs worst, 2-3 links are about flat, and 4+ links get 3-5x the median reach of single-link posts. https://authoredup.com/blog/linkedin-algorithm
  - Socialinsider (company pages): link posts have the lowest engagement rate, 3.25% in 2025. https://www.socialinsider.io/blog/linkedin-benchmark/
- **[UNVERIFIED]** The often-quoted "60% link penalty" has no identifiable source: https://fast-growth.fr/linkedin-algorithm-2026-proven-invented/
- **Link in comments:**
  - Agorapulse found +169% impressions for a link in the comments but called its own data skewed: https://agorapulse.com/social-media-lab/linkedin-comments-link
  - Ordinal says links in comments get far fewer clicks: https://www.tryordinal.com/blog/linkedin-link-penalty-study
- **Practical read:** for a personal profile, a single link card likely costs roughly 20-35% of reach. Put the value in the post, and test a link in the comments or edited in after the first replies. No rigorous data either way.

### 1.7 Hashtags, tagging, editing
- **Hashtags:**
  - [FACT-PRIMARY] LinkedIn lists irrelevant hashtags as engagement bait: https://www.linkedin.com/blog/content-recommendations-avoid
  - [FACT] "Talks about" profile hashtags were removed in Feb 2024: https://www.socialmediatoday.com/news/linkedins-removing-creator-mode-option/706585/
  - [DATA] AuthoredUp says hashtag pages were disabled in Oct 2024. Over 8 months hashtags had "no impact" on reach; 3-5 may slightly reduce visibility and 6+ can seriously hurt it. https://authoredup.com/blog/linkedin-algorithm
  - [DATA] Saywhat: more than 3 hashtags performed 70% worse than none (via https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports).
  - **Takeaway:** use 0-3 hashtags, or none.
- **Tagging:**
  - [FACT-PRIMARY] Tagging people "for attention" counts as engagement bait (LinkedIn blog URL above). LinkedIn's help says a tagged post may be shown to the tagged person's network.
  - [DATA] Ligo (134,522 posts, 1,499 profiles, within-author comparison): 1 tag +35% engagement, 2-3 tags +76%, 4+ tags +126%. Correlational; the effect comes from tagged people actually engaging. Search-result summary of https://ligosocial.com/research/do-hashtags-work-on-linkedin (the page returned 403 when fetched).
  - [UNVERIFIED] The claim that tagging people who don't engage is penalized has no data.
- **Editing after posting:**
  - [UNVERIFIED] "The effect of editing a post after publication has never been measured": https://fast-growth.fr/en/white-paper/linkedin-algorithm-2026/
  - The older claim of a 10-40% penalty for edits in the first 10 minutes dates from 2020-2023 and has no method.
  - Greg Isenberg relays LinkedIn's view that editing a link in after posting does not affect reach (via the Kara Redman summary). Treat this as weak evidence.

### 1.8 Posting frequency and spacing
- **[DATA] Buffer** (2M+ posts from 94k+ accounts, published Aug 28, 2025; within-account fixed-effects regression), compared with posting once a week:
  - 2-5 posts/week: +1,182 impressions per post
  - 6-10 posts/week: +5,001 impressions per post
  - 11+ posts/week: +16,946 impressions per post
  - No sign that more posting cannibalizes reach.
  - URL: https://buffer.com/resources/how-often-to-post-on-linkedin/
- **[DATA, conflicting] van der Blom** reportedly finds daily posting carries a -45% reach penalty per post and recommends 2-4 high-quality posts a week (via https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports). He himself posts about 6 times a week (Jun 2026 podcast).
- **[DATA] AuthoredUp:** 3-5 posts a week; avoid more than one post in 24 hours. https://authoredup.com/blog/linkedin-algorithm
- **[UNVERIFIED]** Ocean Labs: space posts at least 4 hours apart and avoid :00 timestamps (via the Kara Redman summary).
- **Reconciliation:** total reach rises with more posts (Buffer), but each post competes with your own last one. The best-supported plan is **one strong post a day at most, 4-6 a week**, with no same-day doubles.

### 1.9 Best days and times
- **[DATA] Buffer** (4.8M posts, published Sep 9, 2026, audience-local time):
  - Peak window: weekdays 3-8 pm.
  - Best single slot: Wednesday 4 pm. Then Friday 3-4 pm.
  - Mornings (6-11 am) and Mondays are weakest; weekends drop off.
  - URL: https://buffer.com/resources/best-time-to-post-on-linkedin/
- **[DATA] Sprout Social, tech industry** (about 2B engagements across 307k profiles, Nov 27, 2025 to Feb 27, 2026, local time):
  - Monday 12-1 pm; Tuesday 10 am-2 pm; Wednesday 10 am-4 pm; Thursday 10 am-3 pm; Friday 11 am-1 pm and 3 pm.
  - Weekends are worst.
  - URL: https://sproutsocial.com/best-times-to-post/linkedin-tech
- **[DATA] van der Blom:** 8-9 am and 2-3 pm in the audience's local time, and only post when you can engage for the next 90 minutes. Saywhat: Sunday median 1,531 impressions against about 1,075 on weekdays (lower competition). Both via the Kara Redman summary.
- **Takeaway:** post in the audience's local time (US vs India vs EU matters for a data-careers audience), Tuesday to Thursday from late morning to afternoon. Test Sunday.

### 1.10 Post length and the "see more" fold
- **[DATA, conflicting]** van der Blom: 900-1,200 characters. AuthoredUp: 800-1,000 characters, with posts above a 10th-grade reading level getting 35% less reach. Saywhat: 1,250-3,000 characters beat short posts by 31%. Sources: https://authoredup.com/blog/linkedin-algorithm ; https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports
- **[UNVERIFIED]** The fold is about **140 characters on mobile and about 210 on desktop**, roughly 3 lines; line breaks shorten it. LinkedIn does not document it. https://contentin.io/blog/linkedin-post-character-limit/ ; https://eden.so/blog/linkedin-character-limits/
- **Takeaway:** write the hook in the first 1-2 lines, under 140 characters.

---

## 2. Format benchmarks

### 2.1 Personal profiles (most relevant)
- **[DATA] AuthoredUp:** reach multiplier against the profile's own average, 994,894 personal-profile posts, date not given; video data runs Mar 2025 to Feb 2026. https://authoredup.com/blog/linkedin-algorithm ; https://authoredup.com/blog/linkedin-video-posts

  | Format | Reach multiplier | Note |
  |---|---|---|
  | Polls | 1.64x | up from 1.32x |
  | Documents | 1.45x | median reach -25% |
  | Images | 1.18x | |
  | Video | 1.10x in the algorithm guide; 0.86x in the video guide | median video reach -36% YoY, engagement -26% |
  | Text | 0.88x | |

- **[DATA] Taplio** (51,390 posts, June 2026), median impressions by format: image 600, document/carousel 462, video 460, text 307. https://taplio.com/blog/what-are-linkedin-impressions
- **[DATA] Metricool 2026:**
  - Carousels averaged 1,451 impressions per post; video 606.
  - Engagement rate: multi-image 3.71%, single image 1.81%, video 1.80%.
  - Comments per post: image 2.80, carousel 2.38, text 1.75, video 0.98, multi-image 0.85, poll 0.65.
  - Personal-profile engagement rate 2.60% against company pages 1.60%.
  - URL: https://metricool.com/linkedin-trends/
- **[DATA] Buffer** (2M posts, Aug 2025): carousels/PDFs get about 600% more engagement than text, video +84% and images +72%. https://buffer.com/resources/how-often-to-post-on-linkedin/
- **[DATA] van der Blom 2026:**
  - Documents: +6.92% reach, +46.73% engagement; carousels have a 29.2% save rate.
  - Video: reach -35.57%, engagement -23.13%.
  - Standalone articles get about 0.4x normal reach; newsletter editions do much better.
  - He would drop polls, video and text-only, and keep text plus image, carousels and newsletters.
  - Sources: https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports ; Jun 2026 podcast (URL in 1.2)
- **[DATA] Saywhat:**
  - Carousels 4.1x and infographics 3.4x the reach of text.
  - Infographics are 27.4% of the top 1% outliers.
  - Video has the highest viral probability (2.0%); horizontal video beat vertical by 36%.
  - Via the Kara Redman summary.

### 2.2 Company pages (useful for the startup's Page)
**[DATA] Socialinsider:** 1.3M business posts from 16,645 Pages, published Mar 16, 2026. https://www.socialinsider.io/blog/linkedin-benchmark/

Engagement rate by impressions:

| Format | 2024 | 2025 | Q2 2026 |
|---|---|---|---|
| Native document | 6.10% | 7.00% | 6.60% |
| Multi-image | 6.60% | 6.45% | 6.90% |
| Video | 5.60% | 6.00% | 5.90% |
| Image | 4.85% | 5.30% | 5.20% |
| Text | 4.00% | 4.50% | 3.95% |
| Poll | 4.40% | 4.20% | 4.50% |
| Link | 3.30% | 3.25% | 3.30% |

- Impressions per post for Pages with 10-50K followers: multi-image 1,850; image 1,450; video 1,420; poll 1,255; document 1,150; text 845; link 340.
- Average video views per Page fell 36% YoY; in the 10-50K tier, from 1,000 to 585.

### 2.3 Carousels (document posts)
- **[DATA]** MagicPost (67,765 carousels, 2026): median likes are 26 at 6-8 slides, 49 at 9-12, 58 at 13-20 and 60 at 21+. Socialinsider calls 8-12 slides "a sensible starting range". https://www.socialinsider.io/blog/linkedin-carousel/ ; https://magicpost.in/blog/how-many-slides-in-a-linkedin-carousel
- **[UNVERIFIED]** Design and size: 4:5 portrait (1080x1350) for mobile, square for repurposing. Documents can be up to 300 pages / 100 MB. Same Socialinsider URL.
- **Boosting:** document posts are **not boostable** for members, per LinkedIn Help (section 3.5).

### 2.4 Video
- **[FACT-PRIMARY] Feb 4, 2025.** Video viewing is up 36% YoY, and video creation is growing 2x faster than other formats. LinkedIn launched a full-screen vertical feed (mobile from summer 2024, then desktop), a "Videos For You" module, a profile preview and more prominent Follow button in the player, and an average-watch-time metric. https://www.linkedin.com/pulse/up-36-over-last-year-video-linkedin-booming-time-now-somasundaram-yqbzc
- **[DATA] Supply now outruns demand:** per-post video reach is down 36% YoY (AuthoredUp) and Page video views are down 36% YoY (Socialinsider). URLs above.
- **[DATA] Length, AuthoredUp** (36,946 personal video posts), reach multiplier: over 3 min 1.21x; 90 s-3 min 1.07x; 60-90 s 0.97x; 0-30 s 0.96x; 30-60 s 0.95x. Long videos only win if they hold attention. https://authoredup.com/blog/linkedin-video-posts
- **[DATA] Captions:** a long written caption (20+ sentences) gets 1.13x median video reach; under 5 sentences gets 0.73x. LinkedIn does not auto-caption uploads, so burn captions in or upload an SRT. Same URL.
- **[FACT-PRIMARY]** LinkedIn is filtering "videos unrelated to the post text" (Mar 12, 2026, Jurka URL above). Exec Laura Lorenzetti called attention-bait stock-footage videos AI slop in visual form (Entrepreneur URL above).
- **[UNVERIFIED]** Aspect ratio: vertical 9:16 for the video feed, 4:5 or 1:1 in the main feed. Saywhat's data says horizontal beat vertical by 36%.

### 2.5 Polls, articles, newsletters, Live, GIFs
- **Polls:**
  - AuthoredUp shows a high reach multiplier for personal polls (1.64x).
  - LinkedIn bans reaction-vote polls as bait.
  - van der Blom says he would drop polls, and secondary sources say polls produce poor follower growth [UNVERIFIED].
  - Polls cannot be boosted.
- **Articles vs newsletters:**
  - [DATA] van der Blom (Jun 2026): standalone articles get about 0.4x normal reach, while newsletter editions get much higher reach, engagement and conversion. About 80% of his LinkedIn conversions come from his newsletter, and about 60% of his new followers subscribe to it. Podcast URL above.
  - [FACT-PRIMARY] Subscribers get a "notification or email" for each edition. On the **first edition**, connections and followers are invited by notification by default. https://www.linkedin.com/help/linkedin/answer/a517925
- **LinkedIn Live:**
  - [FACT-PRIMARY, Aug 2026] AI-generated clips and chapters for Live replays, in public beta: https://www.linkedin.com/pulse/product-spotlight-recommended-clips-chapters-linkedin-for-mktg-yhbje/
  - [UNVERIFIED] Since about Jun 22, 2026, Live broadcasts must be scheduled in advance as events. Roundup source only: https://www.seositestool.com/10-new-linkedin-features-updates-for-2026/
  - No reach benchmarks were found.
- **GIFs:**
  - [Press, Jun 17, 2026] GIF support was added to comments. In main posts, GIFs have generally needed converting to MP4 to play. https://www.socialmediatoday.com/news/linkedin-adds-gif-support/823229/
  - No reach data for GIFs in posts was found. Treat an animated GIF as a short video or an image (inference).

### 2.6 Which images work
- **[DATA]** Infographics are over-represented among top-1% outliers (Saywhat: 27.4%, via the Kara Redman summary).
- **[DATA]** Image posts had the highest median impressions in Taplio's June 2026 sample (600).
- **[DATA]** Multi-image posts lead impressions for Pages under 50K (Socialinsider).
- **[UNVERIFIED]** That personal photos or selfies beat graphics, and that memes perform well: no solid dataset found.
- **Inference for a data/AI niche:** cheat sheets, architecture diagrams, roadmaps and infographics match the save-and-dwell behaviour the model optimizes, as long as the text adds original insight.

---

## 3. Follower growth mechanics

### 3.1 Profile conversion
- **[FACT-PRIMARY]** Settings, Visibility, Followers, "Make follow primary" makes Follow the main profile button. https://www.linkedin.com/help/billing/answer/53652
- **[FACT-PRIMARY]** Creator Mode's toggle was removed in March 2024. The Follow button and Featured section became available to everyone. https://www.socialmediatoday.com/news/linkedins-removing-creator-mode-option/706585/
- **[FACT-PRIMARY]** Post analytics show profile viewers and followers gained per post (Sep 2025 SMT URL above). These are the client's best per-post conversion metrics.
- **[FACT-PRIMARY]** The vertical video player adds a profile preview and a more prominent Follow button (Feb 2025 Somasundaram URL).
- **[DATA]** AuthoredUp recommends a follower-to-connection ratio of at least 1.5. https://authoredup.com/blog/linkedin-algorithm
- **[UNVERIFIED]** No benchmark exists for headline, banner or Featured conversion rates, and none was found for followers per 10k or 100k impressions. One anecdote: a post with 93k impressions gained 15 followers while one with 838 impressions gained 13. Follows depend on relevance, not raw reach. https://contentin.io/blog/why-93000-linkedin-impressions-performed-worse-than-838-the-algorithm-truth-nobodys-talking-about

### 3.2 Commenting on bigger creators
- **[DATA]** Saywhat: top-1% creators leave about 286 replies a week against 34 for average creators, and commenting frequency correlates about 0.545 with follower growth (via https://newsletter.kararedman.com/p/i-binged-6-linkedin-algorithm-reports).
- **[Practice]** van der Blom leaves 5-10 comments a day on 2nd- and 3rd-degree niche posts. He says this strengthens your interest cluster (Jun 2026 podcast).
- **Caveat [FACT-PRIMARY]:** automated or AI comments are now being detected and suppressed (section 1.5), so comments must be human and substantive.

### 3.3 Collaborations, co-authored posts, cross-promotion
- No LinkedIn-native "collab post" mechanic and no data on co-authored posts or cross-promotion from YouTube or TikTok was found before the search quota ran out (gap).
- The closest evidence is tagging that leads to real engagement (Ligo, +35% to +126%, section 1.7) and Live or event co-hosting (no benchmarks).

### 3.4 Newsletters
- **[FACT-PRIMARY]** Newsletters notify subscribers (notification or email) on each edition, and invite all connections and followers at the first edition. https://www.linkedin.com/help/linkedin/answer/a517925
- **[Anecdote/DATA]** van der Blom's newsletter has about 130k subscribers. Newsletter editions reach much further than articles, and newsletter analytics now show opens and per-link clicks (Jun 2026 podcast).
- **[DATA]** No exact numbers were found for a newsletter's effect on follower growth.

### 3.5 Paid: boosting and Thought Leader Ads
- **[FACT-PRIMARY]** Members can boost their own posts, but access is rolling out gradually; it works from the Activity tab or profile.
  - Boostable: text, single or multi-image, article, video and newsletter posts.
  - **Not boostable:** documents, polls, events, job posts, group posts and connections-only posts.
  - The listed goals include **"growing followers"**.
  - Targeting: location, language, job title, function, industry and seniority.
  - Premium credits: $50/month on monthly plans, $600 in the first month of annual plans, localized by country.
  - The budget can't be changed after boosting. Analytics cover a 5-day boost period.
  - URL: https://www.linkedin.com/help/lms/answer/a6584635
- **[DATA] ZenABM** (2,828 ads, 211 companies, Feb 21, 2026): Thought Leader Ads have a 2.68% median CTR against 0.42% for single image, a $2.29 CPC against $13.23, a **$49.37 median CPM**, and 6.63 s average dwell. B2B targeting, mostly US. The source notes TLA CTR is measured on the engagement objective, so it isn't directly comparable. https://zenabm.com/blog/tla-benchmarks/
- **[UNVERIFIED]** "Personal boosting grows followers about 2x faster" is a LinkedIn marketing claim relayed by https://socialrails.com/blog/linkedin-post-boosting-guide
- **No cost-per-follower benchmark was found.** Inference only: at about $10-50 CPM, 100k paid impressions cost about $1-5k, and follows per impression from paid reach are unknown. Test it with a small budget on proven organic winners and measure followers gained per post.

### 3.6 Top Voice and creator programs (2026)
- **[FACT]** The gold "Community Top Voice" badge (from collaborative articles) was retired from Oct 8, 2024. The **blue Top Voice** badge stays invitation-only and editorially selected, is held for 6-month periods, and is reviewed regularly (SMT, Jan 2025): https://www.socialmediatoday.com/news/linkedin-updates-top-voice-badge/738428/
- **[UNVERIFIED]**
  - An Inc. piece (Oct 8, 2026) describes quarterly lists: https://www.inc.com/ashley-couto/linkedin-blue-top-voice-badge-posting-more/91416724 (the page returned 403).
  - LinkedIn has reportedly published the reasons for each selection since Jan 2026: https://influenceintelligence.substack.com/p/the-top-voice-badge-isnt-about-linkedin
  - Reported criteria: quality, originality, expertise, trust, prominence. https://metricool.com/top-voices-linkedin/

---

## 4. Benchmarks for a ~13k-follower personal profile

**[DATA] The Shield Index, Feb 2026** (50k posts, personal), 10-25K follower tier. Shield's analytics app itself reportedly shut down around June 2026 (per van der Blom), so this data may not be updated further. https://theshieldindex.beehiiv.com/p/february-2026-linkedin-reach-benchmarks-by-follower-bracket

| Percentile | Impressions/post | Reach rate (% of followers) |
|---|---|---|
| p50 (typical) | 1,216 | 8% |
| p75 (strong) | 3,248 | 21% |
| p90 (top) | 9,052 | 58% |
| p99 (breakout) | 75,131 | 473% |

- In March 2026 the 10-25K median was about 1,177 and p99 about 60,563: https://theshieldindex.beehiiv.com/p/march-2026-linkedin-reach-benchmarks-by-follower-size
- For comparison, the 25-50K tier (the client's target) has a p50 of 2,143 and a p90 of 17,352.

**[DATA] Taplio, June 2026** (51,390 posts), 10-25K tier: median 708, top 25% 2,054, top 10% 5,890. https://taplio.com/blog/what-are-linkedin-impressions

**[DATA] AuthoredUp**, personal profiles:
- Median engagement rate is 2.53% for 5-20K followers and 2.38% for 20-50K (372,812 posts, Sep 2025 to Feb 2026).
- Median impressions are 1,006 for all profiles and 11,805 for the top 5% (Jul 2025 to Jun 2026).
- The median active profile grew about 5.5k to 7.2k followers over 12 months, roughly **2.7% a month**.
- URL: https://authoredup.com/blog/linkedin-metrics-to-track

**Reach trend:**
- van der Blom: reach is down about 60% over 2 years for active creators and engagement about 20-25% (Jun 2026 podcast). For 50K+ accounts, reach is down 62%, engagement 67% and follower growth 83% (via the Kara Redman summary).
- AuthoredUp: overall 2025 reach is down 34%, and down for 98% of users.

**What this means for the goals (inference):**
- "**Every post 1,000+**" is about the median for this tier. Reaching it reliably is realistic with niche focus.
- "**10,000+**" is about the top 10% (p90 9,052).
- A "viral" post here is p99, about 60-75k impressions.
- "**25k followers in 2 months**" means about 6,000 net new followers a month, roughly 46% growth a month. The median benchmark is about 2.7% a month, so this is about 17x median. Hitting it would take several p99 breakout posts plus paid amplification and newsletter or Live funnels. It should be treated as a stretch target.

---

## 5. The data / AI niche and AI-written content
- **[FACT-PRIMARY] Sep 15, 2026.** LinkedIn defines AI slop as "low-effort, likely AI-generated content that may sound polished on the surface", plus generic, repetitive or recycled posts. Its numbers:
  - Views of content classified as slop are down 40%.
  - More than 1M members used "Seems like AI slop" within 2 weeks.
  - Authors get a private notice in post analytics if a post receives enough slop feedback.
  - LinkedIn draws "the distinction between AI assistance and AI slop".
  - URL: https://news.linkedin.com/2026/how-linkedin-is-tackling-ai-slop
- **[FACT-PRIMARY] Oct 8, 2026.** Tim Jurka's post:
  - Detection uses teacher-student models with LoRA adapters, plus policy agents (for example: is it promotional, is it an achievement post, is it timely) and human review.
  - **94% precision**.
  - Classifiers now cover **all posts distributed beyond the author's immediate network**, which is exactly the reach a creator needs to grow.
  - URL: https://www.linkedin.com/pulse/technology-behind-linkedins-fight-against-ai-slop-tim-jurka-7ojbc/
- **[Press]**
  - The report button launched Jul 30 / Aug 2026 and was extended to comments in Sep 2026: https://www.socialmediatoday.com/news/linkedin-offers-the-option-to-report-ai-slop/826781/ ; https://socialday.live/features/linkedins-ai-slop-button-was-used-over-1-million-times-in-two-weeks-now-its-show
  - The "Enhance your post" AI rewrite was removed in Aug 2026 and replaced on Sep 20, 2026 by Post Proofreader (Premium), which "does not change your voice": https://www.socialmediatoday.com/news/linkedin-ditches-post-enhancement-launches-post-proofreader/830851/
  - Flagged slop is often limited to the poster's first-degree connections (Entrepreneur, May 19, 2026, URL above).
  - Earlier changes reduced the reach of common AI phrasing such as "it's not X, it's Y": https://www.engadget.com/2241857/linkedin-says-its-ai-slop-button-is-working/
- **[DATA]**
  - Pangram: 41% of long-form posts and 30% of comments from Apr to Jun 2026 were entirely AI-generated (via the socialday URL above).
  - van der Blom: 44% of content shows AI signals, and fully AI-generated posts get **2.8x less reach** and about 5x less engagement (via the Kara Redman summary).
- **Niche implications (inference):** data and AI is one of the most AI-saturated topics. The slop classifiers and the "recycled thought leadership" filter penalize the generic "Top 10 AI tools" and "SQL cheat sheet" posts that dominate it. Content that is hard to fake should stand out: first-hand pipelines and architectures, real student or career outcome data, original benchmarks, opinions with evidence, and a personal voice.

---

## 6. 2026 timeline of LinkedIn changes
| Date | Change | Source |
|---|---|---|
| Feb 12, 2026 | Feed SR ranking paper (in production) | https://arxiv.org/abs/2602.12354 |
| Feb 2026 | Crackdown on automated comments (reported) | https://siecledigital.fr/2026/02/17/linkedin-serre-la-vis-contre-les-faux-commentaires/ |
| Mar 12, 2026 | LLM retrieval + Generative Recommender feed; engagement-bait, pod and automation filters; Interest Picker test | Eng blog; https://news.linkedin.com/2026/ImprovingTheFeed |
| May 19, 2026 | AI slop classifiers for posts and comments; flagged posts held near 1st degree | Entrepreneur URL |
| Jun 17, 2026 | GIFs in comments | SMT 823229 |
| ~Jun 2026 | Shield analytics shut down (Aware shut Nov 2025) | van der Blom podcast |
| Jul 30-Aug 2026 | "Seems like AI slop" report; Enhance-post removed; private slop notice in analytics | SMT 826781; news.linkedin.com |
| Aug 20, 2026 | 1M+ reports; slop views -40% | Engadget URL |
| Aug 2026 | AI clips and chapters for Live replays (beta) | LinkedIn for Marketing pulse |
| Sep 1, 2026 | +46% detected inauthentic activity (H1 2026) | SMT 829385 |
| Sep 2026 | Slop reporting extended to comments; Post Proofreader (Sep 20) | SMT 830851 |
| Sep 23, 2026 | Anti-fake-profile tools (colleague vouching, false employer removal) | https://techcrunch.com/2026/09/23/linkedin-adds-new-tools-to-fight-fake-profiles-and-bogus-work-histories/ (via socialpilot roundup) |
| Oct 8, 2026 | Slop classifiers cover all out-of-network distribution; 94% precision | Jurka pulse URL |
| Ongoing | Personal post boosting rolling out | LinkedIn Help a6584635 |
| Upcoming | van der Blom October 2026 report update (late Oct / Nov 2, 2026) | https://sales.richardvanderblom.com/content-algorithm-playbook/ |

The 2026 analytics already include impressions, members reached, saves, sends, profile viewers and followers gained per post, video average watch time, and newsletter opens and link clicks.

---

## 7. Gaps and open questions
- No primary data on comment-length weighting, the exact size of the editing penalty, collab or co-authored posts, cross-platform promotion, cost per follower from boosts, or GIF reach.
- The van der Blom 2026 report is paywalled (€199). Its figures here are second-hand: podcast, Kara Redman summary, Ordinal.
- Most format and benchmark studies are vendor datasets with selection bias (users of each tool), so treat them as directional.
- GIF reach in posts and collab/co-authored posts were not covered by any dataset found.
