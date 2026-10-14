# Data creators on LinkedIn: who wins, formats, hooks, and every verified post

Research date: 2026-10-14. Scope: data engineering, analytics, data science careers, SQL/Spark/Databricks/Snowflake, data interviews. Global + India.
Client context: data engineer with about 13k followers. His best posts are first-person interview stories at named companies, "what big tech expects", hiring-side insights and money/salary posts.

## 0. Method and caveats (read first)

- **Every number below was read from public LinkedIn pages on 2026-10-14:** profile pages (exact follower counts and the most recent original posts with exact reactions) and post pages (reactions, comments, date, full text). The rows are in [`../data/verified-posts.csv`](../data/verified-posts.csv) (segment = Data).
- Very recent posts were still growing. For example, Zach Wilson's "Senior data engineers at Netflix can make $500k per year" showed 166 reactions on the profile fetch and 318 on the post fetch a few hours later.
- **Media type** was detected only inside the main post, not in the "related posts" cards LinkedIn shows under it. Markers: image, native video, PDF/carousel, link preview card.
- **How posts were discovered.** WebSearch restricted to linkedin.com finds mostly 2021-2024 posts, so the "all-time viral" posts come from there. The 2026 posts come from profile pages.
  - Some creators have only 1-3 verified posts.
  - Search results are biased toward posts that search engines indexed. They are not a random sample.
- **Profile blocking.** LinkedIn returned HTTP 999 or an authwall on many profile fetches, so some profiles could not be read: Krish Naik, Andreas Kretz, Joe Reis, Venkata Naga Sai Kumar Bysani, Ken Jee, Emma Ding and Dawn Choo (data-dawn).
  - For those, the follower count comes from their post pages, which is also exact as of the fetch. "Median recent" is shown as n/v.
- **Per-creator cap.** Pattern and media statistics use the capped set: data creators only, posts with at least 100 reactions, and at most 12 posts per creator (that creator's top 12).
- **Excluded from stats:**
  - Tanay Pratap, "Is 6LPA a good salary for a fresher?", 4,583 reactions. He is a general tech creator, not a data creator.
  - Hariharan S, "Sharing my Google Data Analytics Interview Experience", 1,542.
  - Mohammed Kaish Ansari, 341.
  - The last two are one-off posters, not creators. They are still useful evidence that the "named-company interview experience" pattern works.
- **Checked and left out of the creator table:**
  - Mehdi Ouazza (34,733 followers): 3 verified posts, all under 20 reactions.
  - Thoufiq Mohammed / techTFQ (37,382): 2 verified posts, under 100.
  - Riya Khandelwal (77,500): 1 post, 3 reactions.
  - Pavan Belagatti: now posts on AI/DevOps.
  - Pratiek Nagda: a job-listing reposter.
  - Ashish Pratap Singh, Neo Kim, Arpit Bhayani and Gaurav Sen: system design, not data.
- **Candidates I could not verify (no data collected):** Dawn Choo (authwall), Durga Gadiraju, Joseph Machado, Shalini Goyal, Kate Strachnyi and Chris Gambill. Handles were found via search (durga0gadiraju, josephmachado1991, goyalshalini, kate-strachnyi-data, databasemanagement), but their profiles and posts were never fetched.
- Wrong handle guess: `lukebarousse`. The correct handle is `luke-b`.
- Impressions are not public. Treat reactions as the only engagement number.

Verified data-creator posts with >=100 reactions (max 12/creator): 196 from 32 creators

## 1. Creator table

Followers: from the profile fetch where it worked, otherwise from the post-page `followers` field (both exact as of 2026-10-14). "Median reactions, recent posts" is the median of the original posts visible on the public profile, mostly dated Sep-Oct 2026 (n shown). Exceptions: Danny Ma's visible posts date from 2024-2026, Nick Singh's from May-Aug 2026 and Luke Barousse's from Jun-Aug 2026. "Verified posts >=100" counts verified posts before the 12-per-creator cap. "Best verified post" is the highest reaction count seen for that creator.

| Creator | Handle | Followers (exact) | Niche | Region | Median reactions, recent posts | Verified posts >=100 | Best verified post | Signature format |
|---|---|---|---|---|---|---|---|---|
| Brij Kishore Pandey | brijpandeyji | 740432 | AI / data architecture explainers | US (n/v) | n/v | 1 | 1252 | Cheat-sheet carousels/infographics |
| Zach Wilson | eczachly | 533177 | Data engineering careers, big-tech comp, founder (DataExpert.io) | US | 126 (n=6) | 22 | 14528 | Long text-only first-person posts (comp, career ladder, interviews); 2026: SF/founder diary photos |
| Alex Freberg | alex-freberg | 461749 | Data analyst careers (Alex The Analyst) | US | 239 (n=7) | 10 | 4954 | Text-only career confessions/contrarian takes; 2026: AI-tool demos (Claude) image/video |
| Krish Naik | naikkrish | 409896 | Data science / AI education | India | n/v | 5 | 3075 | Image posts: milestones, roadmaps, YouTube links |
| Sumit Mittal | bigdatabysumit | 332331 | Big data / data engineering training (TrendyTech) | India | 46 (n=2) | 13 | 597 | Student-success images, Spark interview Q text posts |
| Jess Ramos | jessramosmsba | 304863 | Data analytics careers, SQL, AI | US | 194 (n=6) | 16 | 1718 | Text-only hot takes + personal money/career stories; 2026: short video clips |
| Venkata Naga Sai Kumar Bysani | saibysani18 | 274586 | Data analytics / data science, AWS for data | US | n/v | 1 | 431 | Infographic image + "Most X only need N" list hook |
| Deepak Goyal | deepak-goyal-93805a17 | 266408 | Azure data engineering training (Azurelib) | India | 170 (n=5) | 9 | 4365 | Roadmap image/carousel, interview advice text, bold-unicode headers |
| Ankit Bansal | ankitbansal6 | 262943 | SQL + data engineering interviews (NamasteSQL) | India | 218 (n=8) | 19 | 1593 | SQL puzzle images ("asked in Amazon/Uber"), interview Q lists; 2026: text career lessons + Python-news image |
| Shakra Shamim | shakra-shamim | 200635 | Data analyst / SQL interviews | India (posted in 2026 that she has left India) | 489 (n=9) | 10 | 2198 | 2023-24: text-only SQL interview Q lists; 2026: bold-unicode personal-story posts with image |
| Pooja Jain | pooja-jain-898253106 | 198997 | Data engineering concepts (Storyteller) | India | 186 (n=3) | 4 | 866 | Bold-unicode headline + infographic image |
| Shashank Mishra | shashank219 | 191669 | Data engineering careers + memes (GrowDataSkills) | India | 41 (n=9) | 17 | 6231 | Memes (image) + salary/career stories; 2026 technical explainers get 11-57 |
| Nick Singh | nick-singh-tech | 191117 | SQL / data science interviews (DataLemur) | US | 21 (n=5) | 4 | 415 | Meme/screenshot images + free interview guides |
| Rishabh Mishra | rishabhnmishra | 189636 | Data analytics (SQL, Power BI) | India / Germany | n/v | 6 | 1748 | Free notes PDF carousels, project images |
| Benjamin Rogojan | benjaminrogojan | 188379 | Data engineering consulting / strategy (Seattle Data Guy) | US | 62 (n=5) | 3 | 1323 | Text opinion posts + study-guide image |
| Ajay Kadiyala | ajay026 | 185417 | Data engineering interviews, Dubai job market | UAE (Dubai) | 522 (n=5) | 10 | 815 | 2026: text-only first-person Dubai interview scenarios + GIF explainer |
| Abhisek Sahu | abhisek-sahu-84a404b1 | 179293 | Data engineering patterns, Azure/DevOps | Netherlands (n/v) | n/v | 1 | 838 | "Junior vs Senior data engineer" pattern image |
| Ravit Jain | ravitjain | 172288 | Data & AI media host (The Ravit Show) | n/v | 290 (n=8) | 9 | 541 | Sponsored (#ad) event/interview posts with photos/video |
| Sundas Khalid | sundaskhalid | 165961 | Data science careers (Google) | US | 100 (n=7) | 6 | 1057 | Text/photo personal milestones, career advice |
| Andreas Kretz | andreas-kretz | 162621 | Data engineering education (Learn Data Engineering Academy) | Germany (n/v) | n/v | 3 | 1185 | Tool-map / skills-matrix images |
| Avery Smith | averyjsmith | 161043 | Data analyst careers (Data Career Jumpstart) | US | n/v | 3 | 931 | Text-only lists + humor |
| Daniel Lee | danleedata | 159310 | Data science interviews (DataInterview) | US | n/v | 1 | 1380 | Interview playbook image |
| Darshil Parmar | darshil-parmar | 146292 | Data engineering projects (DataVidhya) | India | 48 (n=6) | 17 | 2548 | Project thumbnail images; 2026: tool-news explainers (image) + tutorials |
| Ken Jee | kenjee | 125944 | Data science | US | n/v | 3 | 5495 | Text-only how-I-work posts |
| Danny Ma | datawithdanny | 123915 | SQL / analytics education (Data With Danny) | Australia (n/v) | 48 (n=6) | 6 | 1041 | Meme/relatable image + free SQL resource CTA |
| Kristen Kehrer | kristen-kehrer-datamovesme | 105976 | Data science / AI, author | US | 42 (n=8) | 2 | 619 | Text-only encouragement + event/partnership photos |
| Luke Barousse | luke-b | 105730 | Data analyst careers (datanerd.tech) | US | 178 (n=5) | 15 | 2050 | "Data Nerds!" opener + chart/screenshot images, course launches |
| Joe Reis | josephreis | 98491 | Data engineering (Fundamentals of Data Engineering) | US | n/v | 3 | 313 | Book/podcast updates, humor |
| Chad Sanderson | chad-sanderson | 90938 | Data contracts / data quality (Gable) | US | n/v | 3 | 737 | Code/diagram images + strong opinions |
| Thais Cooke | thaiscooke | 82241 | Data analytics (healthcare), career change | US | 34 (n=8) | 6 | 491 | Text-only analogies, conference photos |
| Andres Vourakis | andresvourakis | 48006 | Data science careers / job market | n/v | n/v | 1 | 163 | "I scraped N job postings" data carousel |
| Emma Ding | emmading001 | 30302 | Data science interviews | US | n/v | 2 | 1495 | Cheat-sheet images, resume checklists |

Followers vs. engagement, from the profile fetches:
- **High medians.** Ajay Kadiyala (185k followers, median 522), Shakra Shamim (201k, median 489) and Ravit Jain (172k, median 290; sponsored posts) have the highest recent medians.
- **Low medians.** Zach Wilson has 533k followers and a recent median of 126. Shashank Mishra (192k) has a median of 41, but his memes hit 3,375-3,832. Darshil Parmar (146k) has a median of 48.5.
- **Takeaway.** Follower count does not predict the typical post. Format and topic do.

## 2. Standout creators: formats, cadence, recurring hooks

"Cadence" counts the original posts visible on the public profile divided by the days they span. It is a lower bound, because reshares are not shown.

**Zach Wilson (eczachly, 533,177).**
- All-time top: "I think talking about compensation should be less taboo. Here's my total compensation over the last 7 years…" 14,528 reactions and 893 comments, text-only, 2022.
- Other top posts:
  - "If I had to start learning #dataengineering all over again, I'd follow this plan" 4,103.
  - "My seven-month-old… startup EcZachly Inc just crossed $500k in revenue!" 3,034 (image).
  - "Window functions are critical… The 'second highest salary' is a question I've faced in interviews" 1,221 (video).
  - "Here's the most important things I did for climbing the big tech data engineering ladder" 759.
  - "Whenever I'm interviewing for a new #dataengineering role, I try to do the following" 748.
  - "Getting a staff level role in big tech is challenging! In fact, <3% of engineers… ever reach this role!" 443.
- Format: long text-only lists with money numbers and big-tech names (Facebook, Netflix, Airbnb).
- 2026: about 4.7 posts per week, mostly an SF/founder diary at 84-140 reactions. His best recent post went back to the old formula: "Senior data engineers at Netflix can make $500k per year. The interview process is intense though:" (318, image).

**Shashank Mishra (shashank219, 191,669; India).**
- "From Intern to Amazon - Here is my salary growth 👇" 6,231 (image, 164 comments).
- "The Unveiling of My CTC for Data Engineer - L4 Level at Amazon" 752.
- "Heard about layoffs at McKinsey… Back in 2019, I worked there" 449.
- Memes in October 2026: "Resume .. Final.. Final.. Final2 🥲 Us broooo" 3,832 and "It's time for 🍿🍿🍿🍿" 3,375.
- Technical explainers in the same 9 days got 11-57 (Spark, feature stores, streaming double-counting).
- Visible cadence: about 7 posts per week.
- Formula: salary plus a named company (Amazon, McKinsey), or a relatable meme.

**Alex Freberg (alex-freberg, 461,749).**
- Confession/insider posts, text-only:
  - "After about 2 years working as a Data Analyst I realized almost everyone is winging it!" 4,954 (257 comments).
  - "When I was a Data Analyst… I didn't use a lot of my vacation time" 2,945.
  - "There has never been an easier time… also never been a tougher time to become a Data Analyst" 2,665.
- "I went from a Junior Data Analyst to an Analytics Manager in 5 years" 2,245 (image).
- 2026, about 3.8 posts per week, median 239:
  - "SQL and excel were what you needed to land a job back in 2015. Times have changed" 1,353.
  - "Right now I'm getting my hands on the new Claude Dashboard! I connected Claude to BigQuery" 506.

**Jess Ramos (jessramosmsba, 304,863).**
- "At my first job as a Data Analyst, I made a very junior mistake" 1,718.
- "It broke me when my (ex) manager told me I wasn't performing at a senior level" 1,598.
- "❌Companies don't care about your Data Analytics certification" 1,496.
- "I've been called an entitled snowflake for advocating for remote work" 1,172 (136 comments).
- 2026: "In 11 months I negotiated from $71K to $153K as a data analyst in tech. Because whoever speaks first in a salary negotiation LOSES!!" 1,475 (128 comments, native video).
- About 6 posts per week; recent median 194.

**Ankit Bansal (ankitbansal6, 262,943; India).**
- Company-named SQL interview puzzles, shown as an image of the input and output tables:
  - "Uber SQL Interview problem…" 695.
  - "Let's see who can solve this SQL problem asked in the Amazon interview for a BI Engineer position" 462.
  - "Paypal SQL Interview Question asked in Data Engineer Interview" 273.
- Lists: "If you have ever given an SQL interview some of the questions would be definitely from below list" 1,548.
- Stat hook: "SQL is the most in-demand skill, listed in a whopping 61% of job posts" 1,593.
- 2026: the most consistent DE poster, with 8 visible posts in 7 days and a median of 218.
  - "Python is getting lazy. 😄 Python 3.15 brings lazy imports." 1,165.
  - Ellipsis-teaser career lessons: "Today I am sharing one uncomfortable truth about working in tech…" 371, and "One thing I have realised after teaching 1000s of data professionals for years…" 227.

**Ajay Kadiyala (ajay026, 185,417; works in Dubai).** The 2026 breakout, and the closest template to the client's best posts. He runs a series of first-person, location-specific interview posts:
- "I failed a data engineer interview in Dubai. They asked me to explain production & Leadership scenarios" 813 (text-only).
- "𝗗𝘂𝗯𝗮𝗶 𝗷𝗼𝗯 𝘀𝗲𝗲𝗸𝗲𝗿𝘀: I'd practise explaining one pipeline end to end" 815 (image/GIF).
- "People ask me how I got a data job in Dubai. They expect a story about applications and referrals." 743 (text-only).
- "Scenario: you're in a data engineer interview in Dubai. The interviewer says: 'The BI dashboard doesn't match finance's numbers. Where do you look?'" 523, with 78 comments: the question format drives comments.
- His recent median is 522, the highest of all profiles fetched. His 2022-23 tool and roadmap posts got 190-591.

**Darshil Parmar (darshil-parmar, 146,292; India).**
- "I wanted to become a Data Scientist but ended up becoming a Data Engineer" 2,548.
- Free projects: "Uber Data Analytics | End-To-End…" 1,362 and "5 Data Engineering Projects for FREE (1 Million+ Views)" 1,344.
- 2026: news-hook posts beat tutorials. "You do not need a pipeline to join Postgres with your data lake anymore. AWS just put DuckDB inside Aurora PostgreSQL." got 746, while "Databricks Unity Catalog Explained in 10 Minutes" got 36 and the Fabric lakehouse tutorial got 25.

**Deepak Goyal (deepak-goyal-93805a17, 266,408; India).**
- "Roadmap for becoming an Azure Data Engineer in 2023" 4,365 (image).
- "Want to Become Azure Data Engineer / But have doubts?" 836 (carousel).
- 2026: "Give at least 2 interviews every month / Even when you are not looking for change" 371 (text-only). Recent median 170.

**Shakra Shamim (shakra-shamim, 200,635).**
- "I have listed some #SQL interview questions below…" 2,198 (text-only, 128 comments, 2023).
- 2026: bold-unicode personal stories with an image, recent median 489:
  - "How many of you have received 'feedback' that could have been given kindly but was delivered in a way that humiliated you?" 873.
  - "200K+ People ❤️ … during my first job at Cognizant" 852.
  - "One day, I felt completely overwhelmed. I had worked until 2 AM" 573.

**Luke Barousse (luke-b, 105,730).** Every post opens with "Data Nerds!".
- Free SQL course launch 2,050.
- "Three years ago today, I started my YouTube channel. Within a year, I was able to leave my data analyst job" 1,779.
- Job-postings data: "Have you ever found an entry-level job requiring 10+ years of experience?" 870.
- 2026, about 0.5 posts per week: "'Don't bother learning new skills, AI will just automate them for you!'" 693, and the 100k-follower milestone 621.

**Others with standout single posts:**
- Ken Jee (125,944): "How I use ChatGPT in my data science work (4-5 hours per week time savings)" 5,495, text-only.
- Krish Naik (409,896), milestone images: "Another feat achieved. Top Data Science and AI voice in Linkedin." 3,075, and "Feeling proud to be a Github Star" 1,880.
- Daniel Lee (159,310): "Here's the playbook I used to ace Google's data scientist interview" 1,380.
- Emma Ding (30,302): "Want to land more Data Science interviews?" resume makeover 1,495. Her other cheat sheets got 42-132.
- Danny Ma (123,915): meme "The true reality of modern data analytics 🙂" 1,041.
- Chad Sanderson (90,938): opinion plus diagram, 637-737.
- Abhisek Sahu (179,293): "Data Pipeline Pattern / Junior data engineers pick the tool they know. Senior data engineers…" 838 (image, 94 comments).
- Pooja Jain (198,997): "A data model shouldn't start with tables. It should start with the business." 430 (83 comments).
- Sumit Mittal (332,331): student-offer images (e.g. "Paulomi Laskar… Joining Barclays" 597) and Spark interview Q lists (534, 397). His 2 visible 2026 posts got 23-69.
- Ravit Jain (172,288): sponsored "#ad" event/interview posts, consistently 267-364 but with low comment counts (11-30).

## 3. Hook pattern analysis (verified posts with 100+ reactions, data creators, capped at 12 per creator)

Each post was labelled by keyword rules plus a manual review of every 100+ post. Sorted by median reactions.

| Pattern | Posts | Median reactions | Range | Best example (author, reactions) |
|---|---|---|---|---|
| Money: salary / comp / revenue number | 7 | 1475 | 117-14528 | "I think talking about compensation should be less taboo." (Zach Wilson, 14528) |
| Career transition / origin story | 7 | 902 | 371-2548 | "I wanted to become a Data Scientist but ended up becoming a Data Engineer 👨🏻‍💻" (Darshil Parmar, 2548) |
| Named company/market interview story or playbook (first-person) | 5 | 748 | 487-1380 | "📕 Here's the playbook I used to ace Google’s data scientist interview in 2019." (Daniel Lee, 1380) |
| Contrarian / hard truth | 17 | 693 | 131-2665 | "There has never been an easier time to become a Data Analyst." (Alex Freberg, 2665) |
| Confession / mistake / vulnerability story | 11 | 619 | 121-4954 | "After about 2 years working as a Data Analyst I realized almost everyone is winging it! No" (Alex Freberg, 4954) |
| Roadmap / "if I started over" / how to break in | 13 | 610 | 148-4365 | "Roadmap for becoming an Azure Data Engineer in 2023:" (Deepak Goyal, 4365) |
| Cheat sheet / explainer / X-vs-Y / tool map | 21 | 541 | 106-1613 | "What's the difference between a Business Analyst and a Data Analyst?" (Alex Freberg, 1613) |
| Interview question / quiz / prep ("asked in <Company>") | 20 | 533 | 133-2198 | "I have listed some #SQL interview questions below from previous post & comments. Make use " (Shakra Shamim, 2198) |
| Data-backed stat / job-market data | 4 | 531 | 163-1593 | "For data analyst roles, SQL is the most in-demand skill, listed in a whopping 61% of job p" (Ankit Bansal, 1593) |
| AI / tool / news reaction | 14 | 478 | 107-5495 | "How I use ChatGPT in my data science work (4-5 hours per week time savings):" (Ken Jee, 5495) |
| Humor / meme / relatable | 12 | 462 | 100-3832 | "Resume .. Final.. Final.. Final2  🥲 Us broooo" (Shashank Mishra, 3832) |
| Milestone / launch / celebration | 18 | 460 | 132-3075 | "Another feat achieved. Top Data Science and AI voice in Linkedin. Thank you Linkedin." (Krish Naik, 3075) |
| Career strategy / big-tech ladder / hiring-side | 5 | 443 | 371-759 | "Here’s the most important things I did for climbing the big tech data engineering ladder:" (Zach Wilson, 759) |
| Student or follower success story | 7 | 428 | 139-1362 | "The more I teach the more I learn and the more success stories I see 😀" (Krish Naik, 1362) |
| Free resource / course / project giveaway | 21 | 417 | 230-2050 | "Data Nerds! Today I launched a free course on “SQL for Data Analytics!"" (Luke Barousse, 2050) |
| Event / sponsored partner post | 7 | 327 | 135-364 | "Orlando, let’s make some connections!!!! I’m heading to Gartner IT Symposium/Xpo 2026 with" (Ravit Jain, 364) |
| Other: parable / opinion / commentary | 4 | 266 | 209-490 | "𝐌𝐲 𝐦𝐨𝐦 𝐨𝐧𝐜𝐞 𝐛𝐫𝐨𝐮𝐠𝐡𝐭 𝐡𝐨𝐦𝐞 𝐚 𝐭𝐢𝐧𝐲 𝐜𝐮𝐫𝐫𝐲-𝐥𝐞𝐚𝐟 𝐩𝐥𝐚𝐧𝐭." (Shakra Shamim, 490) |
| Personal life / travel update | 3 | 210 | 170-308 | "Hello from London 👩🏻‍💻" (Sundas Khalid, 308) |

Example hooks per pattern (reactions):
- **Money: salary / comp / revenue number** (highest median):
  - "I think talking about compensation should be less taboo. Here's my total compensation over the last 7 years" (14,528)
  - "From Intern to Amazon - Here is my salary growth 👇" (6,231)
  - "In 11 months I negotiated from $71K to $153K as a data analyst in tech" (1,475)
  - "The Unveiling of My CTC for Data Engineer - L4 Level at Amazon" (752)
  - Most money posts pair a specific number with a named company (Amazon, Netflix) or a time window (7 years, 11 months).
- **Career transition / origin story:**
  - "I wanted to become a Data Scientist but ended up becoming a Data Engineer" (2,548)
  - "I went from a Junior Data Analyst to an Analytics Manager in 5 years" (2,245)
  - "Three years ago today, I started my YouTube channel. Within a year, I was able to leave my data analyst job" (1,779)
- **Named company/market interview story (first-person):**
  - "Here's the playbook I used to ace Google's data scientist interview" (1,380)
  - "I failed a data engineer interview in Dubai." (813)
  - "Whenever I'm interviewing for a new #dataengineering role…" (748)
  - "People ask me how I got a data job in Dubai." (743)
  - Also, from an excluded non-creator: "Sharing my Google Data Analytics Interview Experience… I had applied for 150+ companies" (1,542).
- **Contrarian / hard truth:**
  - "There has never been an easier time… never been a tougher time" (2,665)
  - "❌Companies don't care about your Data Analytics certification" (1,496)
  - "SQL and excel were what you needed to land a job back in 2015" (1,353)
- **Confession / vulnerability:**
  - "…I realized almost everyone is winging it!" (4,954)
  - "At my first job as a Data Analyst, I made a very junior mistake" (1,718)
  - "It broke me when my (ex) manager told me…" (1,598)
- **Interview question / quiz:**
  - "I have listed some #SQL interview questions…" (2,198)
  - "If you have ever given an SQL interview some of the questions would be definitely from below list" (1,548)
  - "Uber SQL Interview problem" (695)
  - "Scenario: you're in a data engineer interview in Dubai…" (523, 78 comments)
- **Roadmap / "if I started over":**
  - "Roadmap for becoming an Azure Data Engineer in 2023" (4,365)
  - "If I had to start learning #dataengineering all over again" (4,103)
  - "A common path to becoming a data engineer is to start as a data analyst" (1,323)
- **AI / tool news:**
  - "How I use ChatGPT in my data science work (4-5 hours per week time savings)" (5,495)
  - "Anaconda & Microsoft just unveiled: Python in Excel" (1,580)
  - "Python is getting lazy. 😄" (1,165)
  - "AWS just put DuckDB inside Aurora PostgreSQL" (746)
- **Humor / meme:**
  - "Resume .. Final.. Final.. Final2 🥲" (3,832)
  - "The true reality of modern data analytics 🙂" (1,041)
  - "After spending 5 years in the industry, finally got a chance to use N-Ary Tree 🥲" (961)
- **Career strategy / big-tech ladder / hiring-side:**
  - "Here's the most important things I did for climbing the big tech data engineering ladder" (759)
  - "If you're a data engineering… recruiter that is hiring, please reach out to me I have hundreds of vetted candidates" (497)
  - "Getting a staff level role in big tech is challenging! In fact, <3%…" (443)
  - "Give at least 2 interviews every month" (371)
- **Data-backed stat:**
  - "SQL is the most in-demand skill, listed in a whopping 61% of job posts" (1,593)
  - "Have you ever found an entry-level job requiring 10+ years of experience?" (870)
- **Free resource / cheat sheet / milestone:** high volume, mid medians.
  - "Today I launched a free course on 'SQL for Data Analytics!'" (2,050)
  - "Full SQL Course + Notes for FREE!!!" (1,748)
  - "All tools Data Engineers need!" (1,185)
  - "Another feat achieved. Top Data Science and AI voice" (3,075)

Hook mechanics that recur across the 100+ set:
- A number in line 1: a salary, a time window, a % or a count of applications.
- A named company or market: Amazon, Netflix, Google, Facebook, Airbnb, McKinsey, Uber, PayPal, Dubai.
- First-person failure or "nobody tells you" framing.
- An ellipsis teaser: "Today I am sharing one uncomfortable truth…", "A student once asked me something that made me think…".
- A two-line contrast: easier/tougher, 2015 vs now, junior vs senior.
- Questions and scenarios ("Where do you look?") pull the most comments relative to reactions:
  - Ajay's scenario: 78 comments on 523 reactions.
  - Pooja's data-model take: 83 on 430.
  - Danny Ma's "I just made a #SQL mistake… Can you help me out?": 62 on 133.

## 4. Media analysis (main-post media re-checked; capped set of data-creator posts with 100+ reactions)

| Media type | Posts | Median reactions | Mean | Max |
|---|---|---|---|---|
| text-only | 58 | 536 | 1146 | 14528 |
| image (single/multi, incl. GIF) | 105 | 533 | 846 | 6231 |
| document/carousel (PDF) | 10 | 516 | 673 | 1748 |
| link preview card (YouTube/GitHub/article) | 6 | 460 | 510 | 1159 |
| native video | 16 | 330 | 533 | 1613 |

How to read the media table:
- **Text-only and single images tie on median** (about 535). Text-only holds the single biggest post (14,528) and most of the 2,000+ confession, contrarian and money posts.
- **Images** dominate memes, salary-growth graphics, SQL puzzle screenshots, milestones and infographics.
- **Native video has the lowest median** in this set. Its best results came from video posts carrying a money or contrast hook (Jess Ramos's $71K→$153K, 1,475; Alex Freberg's BA vs DA, 1,613).
- **Carousels:** the sample is small (10). The best were free-notes/roadmap PDFs (Rishabh Mishra 1,748; Deepak Goyal 836; Tanay Pratap's excluded "Is 6LPA a good salary" 4,583).
- **Link preview cards** (YouTube/GitHub/blog links) are the weakest format besides video.
- **Caveat:** this set is selected for 100+ reactions, so it shows which formats reach high numbers. It does not show average performance by format.

## 5. What gets the biggest numbers in the data niche right now (2026)

Basis: 102 original posts dated 2026-09-01 to 2026-10-13 from the 19 profiles that loaded (median 121 reactions), plus 2026 posts found via search.
1. **Money transparency with a precise before/after number.** "In 11 months I negotiated from $71K to $153K as a data analyst in tech" got 1,475 reactions and 128 comments. Zach Wilson's money-hook Netflix post (318) was his best of 6 recent posts; his SF diary posts got 84-166. The all-time data-creator record in this dataset is also a comp post (14,528).
2. **Job-hunt pain memes, especially for the India DE audience.** "Resume .. Final.. Final.. Final2" got 3,832 and "It's time for 🍿" got 3,375. The same account's technical posts got 11-57 in the same week.
3. **First-person interview stories tied to a specific place or company.** Ajay Kadiyala's Dubai series got 523-815 per post (median 522). The all-time comparisons are "playbook I used to ace Google's DS interview" (1,380) and "Google Data Analytics Interview Experience" (1,542, non-creator).
4. **"The bar has moved" contrarian takes on hiring.** "SQL and excel were what you needed to land a job back in 2015" got 1,353. Also: "Give at least 2 interviews every month" 371, and Ankit Bansal's "uncomfortable truth about working in tech" 371.
5. **Concrete tool-news one-liners with an immediate practical consequence.**
   - "Python is getting lazy… lazy imports" 1,165.
   - "AWS just put DuckDB inside Aurora PostgreSQL" 746.
   - "I connected Claude to BigQuery" 506.
   - Generic AI commentary from the same creators did far worse: "Could tech jobs disappear by 2030? Anthropic modeled 3 scenarios" 49, "Meta Launched Muse" 40, "Everyone posts their AI wins but nobody posts the fails" 69.
6. **Vulnerable personal stories in bold-unicode formatting** (Shakra Shamim): 490-873.
7. **What underperforms in 2026:**
   - Pure technical explainers without a story or number: Spark internals 34, feature-store freshness 22, streaming double-count 41, Unity Catalog 36, Fabric lakehouse 25, data-platform scaling 11.
   - Conference recap posts: Thais Cooke 9-69, with one at 135; Kristen Kehrer's Forbes summit posts 16-99. Ravit Jain's sponsored event posts are the exception, but they are paid posts.
   - Course/student promos: Sumit Mittal 23-69.

## 6. Full swipe file: every verified data-creator post with 100+ reactions (capped at 12 per creator, sorted by reactions)

Media is the main-post media. Pattern labels come from keyword rules plus a manual review.

| # | Reactions | Comments | Author | Date | Media | Pattern | Hook (first line) | URL |
|---|---|---|---|---|---|---|---|---|
| 1 | 14528 | 893 | Zach Wilson | 2022-05-06 | text-only | Money: salary / comp / revenue number | I think talking about compensation should be less taboo. | https://www.linkedin.com/posts/eczachly_dataengineering-softwareengineering-activity-6928209055740026880-PdRN |
| 2 | 6231 | 164 | Shashank Mishra | 2023-07-07 | image (single/multi, incl. GIF) | Money: salary / comp / revenue number | From Intern to Amazon - Here is my salary growth 👇🌟 | https://www.linkedin.com/posts/shashank219_dataengineering-careergrowth-salary-activity-7082956619201880064-_wGM |
| 3 | 5495 | 135 | Ken Jee | 2023-02-07 | text-only | AI / tool / news reaction | How I use ChatGPT in my data science work (4-5 hours per week time savings): | https://www.linkedin.com/posts/kenjee_technology-datascience-chatgpt-activity-7028529627186819072-qHpM |
| 4 | 4954 | 257 | Alex Freberg | 2024-01-25 | text-only | Confession / mistake / vulnerability story | After about 2 years working as a Data Analyst I realized almost everyone is winging it! No one knows everything and people do a lot of resea | https://www.linkedin.com/posts/alex-freberg_after-about-2-years-working-as-a-data-analyst-activity-7156270306037305346-evx7 |
| 5 | 4365 | 140 | Deepak Goyal | 2023-01-16 | image (single/multi, incl. GIF) | Roadmap / "if I started over" / how to break in | Roadmap for becoming an Azure Data Engineer in 2023: | https://www.linkedin.com/posts/deepak-goyal-93805a17_data-analytics-bigdata-activity-7020618240116547584-a7FO |
| 6 | 4103 | 167 | Zach Wilson | 2022-07-29 | text-only | Roadmap / "if I started over" / how to break in | If I had to start learning #dataengineering all over again, I’d follow this plan, mostly in order: | https://www.linkedin.com/posts/eczachly_dataengineering-activity-6958613446951137280-OZhD |
| 7 | 3832 | 70 | Shashank Mishra | 2026-10-06 | image (single/multi, incl. GIF) | Humor / meme / relatable | Resume .. Final.. Final.. Final2  🥲 Us broooo | https://www.linkedin.com/posts/shashank219_resume-final-final-final2-us-broooo-activity-7513090332322889728-XNMm |
| 8 | 3375 | 68 | Shashank Mishra | 2026-10-09 | image (single/multi, incl. GIF) | Humor / meme / relatable | It's time for 🍿 🍿 🍿 🍿 | https://www.linkedin.com/posts/shashank219_its-time-for-activity-7514201586055671808-cTcD |
| 9 | 3075 | 104 | Krish Naik | 2023-12-07 | image (single/multi, incl. GIF) | Milestone / launch / celebration | Another feat achieved. Top Data Science and AI voice in Linkedin. Thank you Linkedin. | https://www.linkedin.com/posts/naikkrish_another-feat-achieved-top-data-science-and-activity-7138390971750174720-jdA5 |
| 10 | 3034 | 148 | Zach Wilson | 2023-10-20 | image (single/multi, incl. GIF) | Money: salary / comp / revenue number | My seven-month-old, solo founder, bootstrapped startup EcZachly Inc just crossed $500k in revenue! | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7120950285828591616-awV7 |
| 11 | 2945 | 56 | Alex Freberg | 2022-09-15 | text-only | Confession / mistake / vulnerability story | When I was a Data Analyst I wanted to work hard to prove myself and make my worth known. So I didn't use a lot of my vacation time because I | https://www.linkedin.com/posts/alex-freberg_when-i-was-a-data-analyst-i-wanted-to-work-activity-6976168228762923008-wBv_ |
| 12 | 2665 | 96 | Alex Freberg | 2022-01-31 | text-only | Contrarian / hard truth | There has never been an easier time to become a Data Analyst. | https://www.linkedin.com/posts/alex-freberg_there-has-never-been-an-easier-time-to-become-activity-6893898099438206976-SwzH |
| 13 | 2548 | 35 | Darshil Parmar | 2023-10-31 | image (single/multi, incl. GIF) | Career transition / origin story | I wanted to become a Data Scientist but ended up becoming a Data Engineer 👨🏻‍💻 | https://www.linkedin.com/posts/darshil-parmar_dataengineer-dataengineering-datascience-activity-7125004032665915393-q6Fx |
| 14 | 2245 | 91 | Alex Freberg | 2023-12-04 | image (single/multi, incl. GIF) | Career transition / origin story | I went from a Junior Data Analyst to an Analytics Manager in 5 years. | https://www.linkedin.com/posts/alex-freberg_i-went-from-a-junior-data-analyst-to-an-analytics-activity-7137434198318993408-4SMn |
| 15 | 2198 | 128 | Shakra Shamim | 2023-07-27 | text-only | Interview question / quiz / prep ("asked in <Company>") | I have listed some #SQL interview questions below from previous post & comments. Make use of it and please do comment if you have some more  | https://www.linkedin.com/posts/shakra-shamim-8ab3a1233_sql-dataanalysts-activity-7090353757720305664-jRld |
| 16 | 2050 | 118 | Luke Barousse | 2024-03-11 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | Data Nerds! Today I launched a free course on “SQL for Data Analytics!" | https://www.linkedin.com/posts/luke-b_data-nerds-today-i-launched-a-free-course-activity-7172939321426042880-Ofsg |
| 17 | 1880 | 48 | Krish Naik | 2022-08-23 | image (single/multi, incl. GIF) | Milestone / launch / celebration | Feeling proud to be a Github Star .All this was possible with just one goal that is providing valuable content on Data Science related topic | https://www.linkedin.com/posts/naikkrish_githubstars-github-githubeducation-activity-6967846099621470208-bvHv |
| 18 | 1779 | 125 | Luke Barousse | 2023-08-03 | image (single/multi, incl. GIF) | Career transition / origin story | Three years ago today, I started my YouTube channel. Within a year, I was able to leave my data analyst job to pursue my dream full-time. | https://www.linkedin.com/posts/luke-b_datanerd-activity-7092872047273410560-xQjG |
| 19 | 1748 | 131 | Rishabh Mishra | 2023-08-18 | document/carousel (PDF) | Free resource / course / project giveaway | Full SQL Course + Notes for FREE!!! 🔥 | https://www.linkedin.com/posts/rishabhnmishra_complete-sql-notes-by-rishabh-mishra-basic-activity-7098172536537923584-Ozrb |
| 20 | 1718 | 84 | Jess Ramos | 2022-09-19 | text-only | Confession / mistake / vulnerability story | At my first job as a Data Analyst, I made a very junior mistake. I made everything as technical as possible because I thought having complic | https://www.linkedin.com/posts/jessramosmsba_data-dataanalyst-simplicity-activity-6977443758699151360-4u1o |
| 21 | 1613 | 57 | Alex Freberg | 2023-10-13 | native video | Cheat sheet / explainer / X-vs-Y / tool map | What's the difference between a Business Analyst and a Data Analyst? | https://www.linkedin.com/posts/alex-freberg_whats-the-difference-between-a-business-activity-7118584873828720642-XrPO |
| 22 | 1598 | 108 | Jess Ramos | 2024-01-29 | image (single/multi, incl. GIF) | Confession / mistake / vulnerability story | It broke me when my (ex) manager told me I wasn’t performing at a senior level only a few weeks into my new job. | https://www.linkedin.com/posts/jessramosmsba_it-broke-me-when-my-ex-manager-told-me-activity-7157768808923889664-rpnm |
| 23 | 1593 | 25 | Ankit Bansal | 2022-11-19 | image (single/multi, incl. GIF) | Data-backed stat / job-market data | For data analyst roles, SQL is the most in-demand skill, listed in a whopping 61% of job posts. | https://www.linkedin.com/posts/ankitbansal6_namaste-sql-datanalyst-activity-6999579408499912704-4sOa |
| 24 | 1580 | 34 | Shashank Mishra | 2023-08-23 | image (single/multi, incl. GIF) | AI / tool / news reaction | 🚀 This is next level ! Anaconda & Microsoft just unveiled: Python in Excel 📊🐍 | https://www.linkedin.com/posts/shashank219_python-excel-dataanalytics-activity-7099990093792239616-4UML |
| 25 | 1548 | 41 | Ankit Bansal | 2022-09-28 | text-only | Interview question / quiz / prep ("asked in <Company>") | If you have ever given an SQL interview some of the questions would be definitely from below list : | https://www.linkedin.com/posts/ankitbansal6_sql-interviewquestions-activity-6980739747174383616-yrkC |
| 26 | 1496 | 106 | Jess Ramos | 2022-09-13 | text-only | Contrarian / hard truth | ❌Companies don’t care about your Data Analytics certification. | https://www.linkedin.com/posts/jessramosmsba_datascience-analytics-portfolio-activity-6975600885636747265-EGsM |
| 27 | 1495 | 56 | Emma Ding | 2023-10-04 | image (single/multi, incl. GIF) | Roadmap / "if I started over" / how to break in | Want to land more Data Science interviews? | https://www.linkedin.com/posts/emmading001_want-to-land-more-data-science-interviews-activity-7115364962155298816-cnGP |
| 28 | 1475 | 128 | Jess Ramos | 2026-10-07 | native video | Money: salary / comp / revenue number | In 11 months I negotiated from $71K to $153K as a data analyst in tech 👩🏻‍💻 | https://www.linkedin.com/posts/jessramosmsba_in-11-months-i-negotiated-from-71k-to-153k-activity-7513600974528307200-AY0d |
| 29 | 1380 | 45 | Daniel Lee | 2021-12-15 | image (single/multi, incl. GIF) | Named company/market interview story or playbook (first-person) | 📕 Here's the playbook I used to ace Google’s data scientist interview in 2019. | https://www.linkedin.com/posts/danleedata_heres-the-playbook-i-used-to-ace-google-activity-6876924533870227456-3IGk |
| 30 | 1362 | 12 | Krish Naik | 2023-09-21 | image (single/multi, incl. GIF) | Student or follower success story | The more I teach the more I learn and the more success stories I see 😀 | https://www.linkedin.com/posts/naikkrish_the-more-i-teach-the-more-i-learn-and-the-activity-7110488192570597376-rxId |
| 31 | 1362 | 48 | Darshil Parmar | 2023-04-30 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | 🚗 Uber Data Analytics / End-To-End Modern Data Engineering Project | https://www.linkedin.com/posts/darshil-parmar_dataengineering-gcp-dataengineer-activity-7058417533011263488-pk7W |
| 32 | 1353 | 80 | Alex Freberg | 2026-10-02 | text-only | Contrarian / hard truth | SQL and excel were what you needed to land a job back in 2015. | https://www.linkedin.com/posts/alex-freberg_sql-and-excel-were-what-you-needed-to-land-activity-7511853897884540928-Kk6T |
| 33 | 1344 | 32 | Darshil Parmar | 2023-10-01 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | 5 Data Engineering Projects for FREE (1 Million+ Views)📈 | https://www.linkedin.com/posts/darshil-parmar_5-data-engineering-projects-for-free-1-million-activity-7114121508267917313-PP6f |
| 34 | 1323 | 86 | Benjamin Rogojan | 2023-05-29 | text-only | Roadmap / "if I started over" / how to break in | A common path to becoming a data engineer is to start as a data analyst. | https://www.linkedin.com/posts/benjaminrogojan_a-common-path-to-becoming-a-data-engineer-activity-7069024479942758400-eOkS |
| 35 | 1252 | 70 | Brij Kishore Pandey | 2022-12-23 | document/carousel (PDF) | Cheat sheet / explainer / X-vs-Y / tool map | If you're a beginner in SQL or an experienced programmer looking to refresh your knowledge, the attached SQL cheatsheet is a must-have resou | https://www.linkedin.com/posts/brijpandeyji_complete-sql-cheatsheet-activity-7012093916665495552-3jZY |
| 36 | 1221 | 68 | Zach Wilson | 2023-04-16 | native video | Interview question / quiz / prep ("asked in <Company>") | Window functions are critical for data engineering, especially during interviews! | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7053400171082088449-8n7f |
| 37 | 1185 | 83 | Andreas Kretz | 2022-09-14 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | All tools Data Engineers need! Categorized into cloud native (only available on that platform) and cloud agnostic (use anywhere) platforms & | https://www.linkedin.com/posts/andreas-kretz_dataengineering-data-datascience-activity-6975764945380511745-9esQ |
| 38 | 1178 | 93 | Alex Freberg | 2023-07-10 | image (single/multi, incl. GIF) | Contrarian / hard truth | "Makes everyone a Data Analyst" | https://www.linkedin.com/posts/alex-freberg_makes-everyone-a-data-analyst-multiple-activity-7084149189101719552-Y7Kd |
| 39 | 1172 | 136 | Jess Ramos | 2024-02-17 | image (single/multi, incl. GIF) | Contrarian / hard truth | I’ve been called an entitled snowflake for advocating for remote work, adequate work life balance, and flexibility. | https://www.linkedin.com/posts/jessramosmsba_ive-been-called-an-entitled-snowflake-for-activity-7164652732337868801-NN7D |
| 40 | 1165 | 52 | Ankit Bansal | 2026-10-07 | image (single/multi, incl. GIF) | AI / tool / news reaction | Python is getting lazy. 😄 | https://www.linkedin.com/posts/ankitbansal6_python-is-getting-lazy-python-315-brings-activity-7513431521106538497-3zym |
| 41 | 1159 | 43 | Benjamin Rogojan | 2023-10-01 | link preview card (YouTube/GitHub/article) | Interview question / quiz / prep ("asked in <Company>") | Interviewing for a data engineering position requires preparing, studying, and long, all-day interviews. | https://www.linkedin.com/posts/benjaminrogojan_data-engineering-study-guide-outline-make-activity-7114371274583273473--beA |
| 42 | 1057 | 36 | Sundas Khalid | 2023-12-07 | image (single/multi, incl. GIF) | Milestone / launch / celebration | 4 year Googleversary 🎉 | https://www.linkedin.com/posts/sundaskhalid_4-year-googleversary-biggest-learning-activity-7138618793819336705-pmxS |
| 43 | 1041 | 30 | Danny Ma | 2024-08-13 | image (single/multi, incl. GIF) | Humor / meme / relatable | The true reality of modern data analytics 🙂 | https://www.linkedin.com/posts/datawithdanny_dataanalytics-sql-data-activity-7229024126647033856-b0GF |
| 44 | 977 | 12 | Shakra Shamim | 2024-01-14 | text-only | Roadmap / "if I started over" / how to break in | General questions and answers of aspiring data analysts - | https://www.linkedin.com/posts/shakra-shamim-8ab3a1233_dataanalyst-activity-7152238757843210240-J7cO |
| 45 | 973 | 179 | Jess Ramos | 2023-12-12 | image (single/multi, incl. GIF) | Milestone / launch / celebration | I've been secretly working on something ⚡BIG⚡ behind the scenes, and today I'm ready to share it with you: introducing Big Data Energy Analy | https://www.linkedin.com/posts/jessramosmsba_gotbde-activity-7140382348096733184-HAqw |
| 46 | 961 | 12 | Shashank Mishra | 2022-06-28 | text-only | Humor / meme / relatable | After spending 5 years in the industry, finally got a chance to use N-Ary Tree 🥲 | https://www.linkedin.com/posts/shashank219_developerlife-coding-activity-6947400998826950656-pBpy |
| 47 | 931 | 82 | Avery Smith | 2022-09-06 | text-only | Humor / meme / relatable | How you think you'll progress as a data analyst | https://www.linkedin.com/posts/averyjsmith_how-you-think-youll-progress-as-a-data-analyst-activity-6972889717948223488--FR1 |
| 48 | 902 | 56 | Alex Freberg | 2023-08-28 | native video | Career transition / origin story | I went from a Data Analyst to an Analytics Manager and I thought I was on my to being a Director and C-Level in the next 10 years. | https://www.linkedin.com/posts/alex-freberg_i-went-from-a-data-analyst-to-an-analytics-activity-7101896117126135808-mSSI |
| 49 | 873 | 23 | Shakra Shamim | 2026-09-21 | image (single/multi, incl. GIF) | Confession / mistake / vulnerability story | 𝐇𝐨𝐰 𝐦𝐚𝐧𝐲 𝐨𝐟 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 “𝐟𝐞𝐞𝐝𝐛𝐚𝐜𝐤” 𝐭𝐡𝐚𝐭 𝐜𝐨𝐮𝐥𝐝 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐠𝐢𝐯𝐞𝐧 𝐤𝐢𝐧𝐝𝐥𝐲 𝐛𝐮𝐭 𝐰𝐚𝐬 𝐝𝐞𝐥𝐢𝐯𝐞𝐫𝐞𝐝 𝐢𝐧 𝐚 𝐰𝐚𝐲 𝐭𝐡𝐚𝐭 𝐡𝐮𝐦𝐢𝐥𝐢𝐚𝐭𝐞𝐝 𝐲𝐨𝐮? | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%90%87%F0%9D%90%A8%F0%9D%90%B0-%F0%9D%90%A6%F0%9D%90%9A%F0%9D%90%A7%F0%9D%90%B2-%F0%9D%90%A8%F0%9D%90%9F-%F0%9D%90%B2%F0%9D%90%A8%F0%9D%90%AE-%F0%9D%90%A1%F0%9D%90%9A%F0%9D%90%AF%F0%9D%90%9E-%F0%9D%90%AB%F0%9D%90%9E-activity-7507657519436136449-xnoS |
| 50 | 870 | 81 | Luke Barousse | 2023-09-27 | image (single/multi, incl. GIF) | Data-backed stat / job-market data | Data Nerds! Have you ever found an entry-level job requiring 10+ years of experience? 🤬 | https://www.linkedin.com/posts/luke-b_data-nerds-have-you-ever-found-an-entry-level-activity-7112808796246216704-fmsV |
| 51 | 866 | 31 | Pooja Jain | 2023-11-07 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | 😉𝐁𝐞𝐠𝐢𝐧 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐛𝐚𝐬𝐢𝐜𝐬!! | https://www.linkedin.com/posts/pooja-jain-898253106_sql-data-datascientist-activity-7127606965962227713-UbqI |
| 52 | 852 | 70 | Shakra Shamim | 2026-10-02 | image (single/multi, incl. GIF) | Milestone / launch / celebration | 𝟐𝟎𝟎𝐊+ 𝐏𝐞𝐨𝐩𝐥𝐞 ❤️ | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%9F%90%F0%9D%9F%8E%F0%9D%9F%8E%F0%9D%90%8A-%F0%9D%90%8F%F0%9D%90%9E%F0%9D%90%A8%F0%9D%90%A9%F0%9D%90%A5%F0%9D%90%9E-around-45-years-activity-7511764141049802753-ymBE |
| 53 | 838 | 94 | Abhisek Sahu | 2026-10-10 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | Data Pipeline Pattern | https://www.linkedin.com/posts/abhisek-sahu-84a404b1_data-pipeline-pattern-junior-data-engineers-activity-7514574099273293824-2ECe |
| 54 | 836 | 23 | Deepak Goyal | 2023-02-14 | document/carousel (PDF) | Roadmap / "if I started over" / how to break in | Want to Become Azure Data Engineer | https://www.linkedin.com/posts/deepak-goyal-93805a17_how-to-become-azure-data-engineer-activity-7031094671342723073-S16h |
| 55 | 815 | 47 | Ajay Kadiyala | 2026-10-07 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | 𝗗𝘂𝗯𝗮𝗶 𝗷𝗼𝗯 𝘀𝗲𝗲𝗸𝗲𝗿𝘀: 𝗜’𝗱 𝗽𝗿𝗮𝗰𝘁𝗶𝘀𝗲 𝗲𝘅𝗽𝗹𝗮𝗶𝗻𝗶𝗻𝗴 𝗼𝗻𝗲 𝗽𝗶𝗽𝗲𝗹𝗶𝗻𝗲 𝗲𝗻𝗱 𝘁𝗼 𝗲𝗻𝗱. | https://www.linkedin.com/posts/ajay026_%F0%9D%97%97%F0%9D%98%82%F0%9D%97%AF%F0%9D%97%AE%F0%9D%97%B6-%F0%9D%97%B7%F0%9D%97%BC%F0%9D%97%AF-%F0%9D%98%80%F0%9D%97%B2%F0%9D%97%B2%F0%9D%97%B8%F0%9D%97%B2%F0%9D%97%BF%F0%9D%98%80-%F0%9D%97%9C%F0%9D%97%B1-%F0%9D%97%BD%F0%9D%97%BF%F0%9D%97%AE%F0%9D%97%B0%F0%9D%98%81%F0%9D%97%B6%F0%9D%98%80%F0%9D%97%B2-activity-7513444253176487936-iiaZ |
| 56 | 813 | 51 | Ajay Kadiyala | 2026-10-09 | text-only | Named company/market interview story or playbook (first-person) | I failed a data engineer interview in Dubai. | https://www.linkedin.com/posts/ajay026_comment-save-dataengineering-activity-7514168517835870208-yzmw |
| 57 | 763 | 53 | Luke Barousse | 2024-01-29 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | Data Nerds! I re-launched my ChatGPT course; It’s now free (link below) | https://www.linkedin.com/posts/luke-b_data-nerds-i-re-launched-my-chatgpt-course-activity-7157776056609882112-YRcu |
| 58 | 759 | 29 | Zach Wilson | 2023-08-04 | text-only | Career strategy / big-tech ladder / hiring-side | Here’s the most important things I did for climbing the big tech data engineering ladder: | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7093293709894553600-dVZx |
| 59 | 756 | 79 | Jess Ramos | 2022-09-15 | text-only | Contrarian / hard truth | For anyone looking for a job in tech or data right now: | https://www.linkedin.com/posts/jessramosmsba_jobs-hiring-datascience-activity-6975966890296770560-eRCi |
| 60 | 752 | 18 | Shashank Mishra | 2023-06-13 | text-only | Money: salary / comp / revenue number | The Unveiling of My CTC for Data Engineer - L4 Level at Amazon 🚀 | https://www.linkedin.com/posts/shashank219_dataengineering-amazon-career-activity-7074279556601327616-9H2z |
| 61 | 749 | 98 | Jess Ramos | 2022-09-09 | text-only | Contrarian / hard truth | Sorry, but Easy Apply on LinkedIn won’t get you anywhere.❌ | https://www.linkedin.com/posts/jessramosmsba_easyapply-interview-analytics-activity-6973842989236322305-h3XQ |
| 62 | 748 | 30 | Zach Wilson | 2022-11-08 | text-only | Named company/market interview story or playbook (first-person) | Whenever I'm interviewing for a new #dataengineering role, I try to do the following things: | https://www.linkedin.com/posts/eczachly_dataengineering-activity-6995541805907800065-s2Tb |
| 63 | 746 | 26 | Darshil Parmar | 2026-10-01 | image (single/multi, incl. GIF) | AI / tool / news reaction | You do not need a pipeline to join Postgres with your data lake anymore. AWS just put DuckDB inside Aurora PostgreSQL. | https://www.linkedin.com/posts/darshil-parmar_you-do-not-need-a-pipeline-to-join-postgres-activity-7511410598467989504-ZqWf |
| 64 | 743 | 36 | Ajay Kadiyala | 2026-09-17 | text-only | Named company/market interview story or playbook (first-person) | People ask me how I got a data job in Dubai. | https://www.linkedin.com/posts/ajay026_dataengineering-sql-apachespark-activity-7506202483283697664-5tNW |
| 65 | 737 | 46 | Chad Sanderson | 2022-11-16 | image (single/multi, incl. GIF) | Contrarian / hard truth | Daily reminder that the number 1 problem in machine learning and analytics is bad data. If your data is low quality all use cases will be bu | https://www.linkedin.com/posts/chad-sanderson_dataengineering-activity-6998698824865087488-QGdI |
| 66 | 735 | 26 | Ankit Bansal | 2023-09-23 | image (single/multi, incl. GIF) | Student or follower success story | So one of my team members referred Namaste SQL course to one of his friends. | https://www.linkedin.com/posts/ankitbansal6_sql-analytics-activity-7111192596978270208-Fcsa |
| 67 | 714 | 75 | Chad Sanderson | 2023-10-03 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | Data Contracts are data agreements that are enforceable programmatically. They are an application of governance-as-code. Here's an example b | https://www.linkedin.com/posts/chad-sanderson_dataengineering-activity-7115002577116659712-6w5K |
| 68 | 713 | 33 | Sundas Khalid | 2023-05-09 | text-only | Milestone / launch / celebration | Earlier today, I got to share the stage with some talented Googlers and had an opportunity to share parts of my story with almost 4K audienc | https://www.linkedin.com/posts/sundaskhalid_earlier-today-i-got-to-share-the-stage-with-activity-7061840005991694336-7mup |
| 69 | 695 | 39 | Ankit Bansal | 2023-02-05 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | Uber SQL Interview problem to test your problem solving before the next interview. | https://www.linkedin.com/posts/ankitbansal6_sql-interview-uber-activity-7027842339360436224-WUmE |
| 70 | 693 | 69 | Luke Barousse | 2026-06-18 | image (single/multi, incl. GIF) | Contrarian / hard truth | Data Nerds! "Don't bother learning new skills, AI will just automate them for you!" | https://www.linkedin.com/posts/luke-b_data-nerds-dont-bother-learning-new-skills-activity-7473358951821201408-k0hV |
| 71 | 678 | 39 | Ankit Bansal | 2023-01-12 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | Here is an interesting SQL problem to warm up before your next interview. | https://www.linkedin.com/posts/ankitbansal6_sql-sceneriobased-interviewprep-activity-7019149161006583809-iBv2 |
| 72 | 650 | 22 | Ankit Bansal | 2023-04-16 | text-only | Interview question / quiz / prep ("asked in <Company>") | This I think is one of the most asked advanced SQL interview question. | https://www.linkedin.com/posts/ankitbansal6_sql-analytics-activity-7053220340067422208-yrSp |
| 73 | 637 | 66 | Chad Sanderson | 2023-12-14 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | The specification for data contracts should be technology agnostic and defined in YAML. PayPal's open-source spec is a great example of this | https://www.linkedin.com/posts/chad-sanderson_dataengineering-activity-7141130369965232129-k5KJ |
| 74 | 636 | 68 | Andreas Kretz | 2022-09-07 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | Skills matrix for Data Engineers, Architects and ML Engineers. I've been working on that matrix today. What do you think? | https://www.linkedin.com/posts/andreas-kretz_dataengineering-dataengineer-data-activity-6973254133935964160-xv63 |
| 75 | 622 | 27 | Darshil Parmar | 2022-09-23 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | 🚀 End-To-End Data Engineering Project FREE! | https://www.linkedin.com/posts/darshil-parmar_dataengineering-dataengineer-bigdata-activity-6978972447840587776-H1Md |
| 76 | 621 | 66 | Luke Barousse | 2026-07-21 | image (single/multi, incl. GIF) | Milestone / launch / celebration | Data Nerds, we just hit 100,000 followers!! 💯 | https://www.linkedin.com/posts/luke-b_data-nerds-we-just-hit-100000-followers-activity-7485332774401449984-u4l_ |
| 77 | 620 | 20 | Shashank Mishra | 2022-09-19 | text-only | Contrarian / hard truth | Salary doesn't describe the Quality of skill sets you have✌ | https://www.linkedin.com/posts/shashank219_skills-skillset-growth-activity-6977497915644633089-K5Gj |
| 78 | 620 | 15 | Darshil Parmar | 2023-10-02 | image (single/multi, incl. GIF) | Career transition / origin story | Become a Freelance Data Engineer (Complete Guide) 👨🏻‍💻 | https://www.linkedin.com/posts/darshil-parmar_dataengineering-freelance-dataengineer-activity-7114490259945500672-nzVK |
| 79 | 619 | 68 | Kristen Kehrer | 2023-02-15 | text-only | Confession / mistake / vulnerability story | If you're out there feeling imposter syndrome because you have to google everything..  make sure to pat yourself on the back for honing your | https://www.linkedin.com/posts/kristen-kehrer-datamovesme_if-youre-out-there-feeling-imposter-syndrome-activity-7031660506557874177-32Pq |
| 80 | 610 | 37 | Rishabh Mishra | 2023-04-01 | document/carousel (PDF) | Roadmap / "if I started over" / how to break in | Complete Data Analyst Roadmap to Start your career in Data Analytics 2023 ⬇️ | https://www.linkedin.com/posts/rishabhnmishra_data-analyst-roadmap-2023-by-rishabh-mishra-activity-7047796735087157248-cRYj |
| 81 | 601 | 14 | Danny Ma | 2021-09-18 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | I just published my free SQL Masterclass on GitHub: a crypto case study with 50+ questions with answers! Link is on the Data With Danny page | https://www.linkedin.com/posts/datawithdanny_datawithdanny-sql-datascience-activity-6845018624353271808-uMOZ |
| 82 | 597 | 15 | Sumit Mittal | 2023-03-28 | image (single/multi, incl. GIF) | Student or follower success story | Paulomi Laskar has made TrendyTech proud by Cracking multiple job offers from various product-based companies and Joining Barclays as a Big  | https://www.linkedin.com/posts/bigdatabysumit_sumitteaches-bigdata-dataengineering-activity-7046443379735367681-BKx2 |
| 83 | 591 | 36 | Ajay Kadiyala | 2023-10-25 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | knowing what tools are used in #dataengineering is very important for your success in your job....... | https://www.linkedin.com/posts/ajay026_dataengineering-dataengineering-tools-activity-7122906492244004864-ioGK |
| 84 | 584 | 35 | Rishabh Mishra | 2024-01-26 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | 🚀 Sharing all my Data Analytics Projects and Resources from GitHub 📚 | https://www.linkedin.com/posts/rishabhnmishra_datascience-dataanalytics-dataanalyst-activity-7156646183040389120-NncZ |
| 85 | 573 | 18 | Shakra Shamim | 2026-09-18 | image (single/multi, incl. GIF) | Confession / mistake / vulnerability story | 𝐎𝐧𝐞 𝐝𝐚𝐲, 𝐈 𝐟𝐞𝐥𝐭 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐥𝐲 𝐨𝐯𝐞𝐫𝐰𝐡𝐞𝐥𝐦𝐞𝐝. | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%90%8E%F0%9D%90%A7%F0%9D%90%9E-%F0%9D%90%9D%F0%9D%90%9A%F0%9D%90%B2-%F0%9D%90%88-%F0%9D%90%9F%F0%9D%90%9E%F0%9D%90%A5%F0%9D%90%AD-%F0%9D%90%9C%F0%9D%90%A8%F0%9D%90%A6%F0%9D%90%A9%F0%9D%90%A5%F0%9D%90%9E%F0%9D%90%AD-activity-7506578082435153921-IOti |
| 86 | 567 | 38 | Sumit Mittal | 2022-09-15 | text-only | Cheat sheet / explainer / X-vs-Y / tool map | Big Data in just 10 lines | https://www.linkedin.com/posts/bigdatabysumit_bigdata-dataengineering-apachespark-activity-6976072701970923521-d9Hc |
| 87 | 558 | 39 | Luke Barousse | 2023-08-12 | image (single/multi, incl. GIF) | AI / tool / news reaction | ChatGPT is getting WAAAY better at data analysis 😳 it's not perfect, but it's hella fast 💨 | https://www.linkedin.com/posts/luke-b_chatgpt-is-getting-waaay-better-at-data-analysis-activity-7096177674355699712-lqrS |
| 88 | 557 | 8 | Krish Naik | 2023-12-06 | image (single/multi, incl. GIF) | Roadmap / "if I started over" / how to break in | Perfect roadmap to learn Data Science in 2024 with all the videos, code,documentation and handwritten materials. This includes Python,Machin | https://www.linkedin.com/posts/naikkrish_perfect-roadmap-to-learn-data-science-in-activity-7138061155419242496-S_mu |
| 89 | 553 | 43 | Ankit Bansal | 2023-09-20 | text-only | Interview question / quiz / prep ("asked in <Company>") | This question is often asked in SQL interviews and the interviewer may try to confuse you with multiple scenarios. | https://www.linkedin.com/posts/ankitbansal6_sql-join-interviewquestions-activity-7110103670435848192-dYpo |
| 90 | 541 | 23 | Ravit Jain | 2021-11-14 | document/carousel (PDF) | Cheat sheet / explainer / X-vs-Y / tool map | What is Data Warehouse? Simple and good explanation! For more such free content and learning, join my Slack channel and don't forget to foll | https://www.linkedin.com/posts/ravitjain_data-warehouse-activity-6865556106727497730-9fIK |
| 91 | 539 | 19 | Shashank Mishra | 2022-08-10 | text-only | Money: salary / comp / revenue number | Did you know Data engineering is one of the highly paid professions in India 🤯 | https://www.linkedin.com/posts/shashank219_dataengineering-bigdata-datanalytics-activity-6963127596800700416-aAhO |
| 92 | 534 | 13 | Sumit Mittal | 2024-01-16 | text-only | Interview question / quiz / prep ("asked in <Company>") | Data Engineering - 10 Managerial round Interview Questions | https://www.linkedin.com/posts/bigdatabysumit_dataengineering-bigdata-interview-activity-7152930163272388609-Z22- |
| 93 | 533 | 21 | Darshil Parmar | 2023-05-14 | image (single/multi, incl. GIF) | Milestone / launch / celebration | 🤩 100K+ in just 15 days on 🚖 Uber Data Analytics / End-To-End Modern Data Engineering Project | https://www.linkedin.com/posts/darshil-parmar_dataengineering-gcp-dataengineer-activity-7063488789867864064-OBfv |
| 94 | 532 | 13 | Sumit Mittal | 2023-08-02 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | The first video of the most awaited "Big Data Interview Series - Top 20 Questions" is finally out  📢 | https://www.linkedin.com/posts/bigdatabysumit_bigdata-dataengineering-interview-activity-7092444716599803904-jiB4 |
| 95 | 525 | 54 | Zach Wilson | 2024-02-16 | text-only | Contrarian / hard truth | If you’re someone who says, “I’ve applied for 200 jobs in the past month and keep getting ghosted” | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7164089396009324545-1JGS |
| 96 | 523 | 78 | Ajay Kadiyala | 2026-10-13 | text-only | Interview question / quiz / prep ("asked in <Company>") | Scenario: you're in a data engineer interview in Dubai. | https://www.linkedin.com/posts/ajay026_dataengineering-azure-spark-activity-7515618390305333248-pF_z |
| 97 | 520 | 27 | Rishabh Mishra | 2023-05-17 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | One more Power BI Project for data analytics enthusiasts. 🚀 | https://www.linkedin.com/posts/rishabhnmishra_powerbi-powerbideveloper-dataanalytics-activity-7064487841216499712-0o2I |
| 98 | 518 | 18 | Shakra Shamim | 2026-09-30 | image (single/multi, incl. GIF) | AI / tool / news reaction | 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞 𝐢𝐬 𝐭𝐚𝐥𝐤𝐢𝐧𝐠 𝐚𝐛𝐨𝐮𝐭 𝐀𝐈 𝐫𝐞𝐩𝐥𝐚𝐜𝐢𝐧𝐠 𝐣𝐨𝐛𝐬. | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%90%84%F0%9D%90%AF%F0%9D%90%9E%F0%9D%90%AB%F0%9D%90%B2%F0%9D%90%A8%F0%9D%90%A7%F0%9D%90%9E-%F0%9D%90%A2%F0%9D%90%AC-%F0%9D%90%AD%F0%9D%90%9A%F0%9D%90%A5%F0%9D%90%A4%F0%9D%90%A2%F0%9D%90%A7%F0%9D%90%A0-%F0%9D%90%9A%F0%9D%90%9B-activity-7511040923318022144-AA8Y |
| 99 | 506 | 26 | Alex Freberg | 2026-10-12 | image (single/multi, incl. GIF) | AI / tool / news reaction | Right now I'm getting my hands on the new Claude Dashboard! | https://www.linkedin.com/posts/alex-freberg_right-now-im-getting-my-hands-on-the-new-activity-7515402811002474496-jGH4 |
| 100 | 497 | 37 | Zach Wilson | 2024-03-19 | text-only | Career strategy / big-tech ladder / hiring-side | If you’re a data engineering or analytics engineering recruiter that is hiring, please reach out to me I have hundreds of vetted candidates  | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7175919525136068609-DN16 |
| 101 | 491 | 22 | Darshil Parmar | 2022-11-28 | document/carousel (PDF) | Free resource / course / project giveaway | 5 Books that helped me in my Data Engineering career 👇🏻 | https://www.linkedin.com/posts/darshil-parmar_5-books-for-data-engineering-activity-7002884358277591040-T3er |
| 102 | 491 | 38 | Thais Cooke | 2022-09-12 | text-only | Humor / meme / relatable | Cleaning data is like cleaning my house. When I think I am done, there is always something else to clean… | https://www.linkedin.com/posts/thaiscooke_datacleaning-excel-dataanalysis-activity-6975069527873130496-29cF |
| 103 | 490 | 9 | Shakra Shamim | 2026-09-19 | image (single/multi, incl. GIF) | Other: parable / opinion / commentary | 𝐌𝐲 𝐦𝐨𝐦 𝐨𝐧𝐜𝐞 𝐛𝐫𝐨𝐮𝐠𝐡𝐭 𝐡𝐨𝐦𝐞 𝐚 𝐭𝐢𝐧𝐲 𝐜𝐮𝐫𝐫𝐲-𝐥𝐞𝐚𝐟 𝐩𝐥𝐚𝐧𝐭. | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%90%8C%F0%9D%90%B2-%F0%9D%90%A6%F0%9D%90%A8%F0%9D%90%A6-%F0%9D%90%A8%F0%9D%90%A7%F0%9D%90%9C%F0%9D%90%9E-%F0%9D%90%9B%F0%9D%90%AB%F0%9D%90%A8%F0%9D%90%AE%F0%9D%90%A0%F0%9D%90%A1%F0%9D%90%AD-%F0%9D%90%A1%F0%9D%90%A8%F0%9D%90%A6%F0%9D%90%9E-activity-7506932761786580992-y0jM |
| 104 | 487 | 10 | Zach Wilson | 2023-06-23 | link preview card (YouTube/GitHub/article) | Named company/market interview story or playbook (first-person) | I wrote a long-form article about the things I did to get into Facebook even though I didn't go to an Ivy League or even have any connection | https://www.linkedin.com/posts/eczachly_how-i-got-a-data-engineering-job-at-facebook-activity-7078069924652355584-b9St |
| 105 | 476 | 36 | Zach Wilson | 2023-11-13 | link preview card (YouTube/GitHub/article) | Career transition / origin story | When I quit Airbnb back in March, many people told me I was crazy. They said, “I was throwing away tons of opportunities and killing my care | https://www.linkedin.com/posts/eczachly_how-i-quit-my-600k-data-engineering-job-activity-7129882839566716929-axdx |
| 106 | 474 | 5 | Shashank Mishra | 2023-06-03 | image (single/multi, incl. GIF) | Milestone / launch / celebration | In last 1.5 Years, I got great opportunities to explore amazing Data Engineering skills and added great values in my professional experience | https://www.linkedin.com/posts/shashank219_dataengineering-lovefordataenegineering-activity-7070790577449021441-QlCe |
| 107 | 464 | 9 | Darshil Parmar | 2023-06-02 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | 💰 How PayU Finance Built Data Architecture to Securely Process Data? | https://www.linkedin.com/posts/darshil-parmar_dataengineering-dataengineer-python-activity-7070268818807226368-5TE0 |
| 108 | 462 | 67 | Ankit Bansal | 2023-04-06 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | Let's see who can solve this SQL problem asked in the Amazon interview for a BI Engineer position.. | https://www.linkedin.com/posts/ankitbansal6_sql-interview-amazon-activity-7049587499496574976-8f85 |
| 109 | 453 | 49 | Avery Smith | 2024-01-12 | text-only | Roadmap / "if I started over" / how to break in | The best way to learn Data Analytics and get a job in Data Analytics is by... | https://www.linkedin.com/posts/averyjsmith_the-best-way-to-learn-data-analytics-and-activity-7151573561265029121-R8F9 |
| 110 | 449 | 12 | Shashank Mishra | 2023-03-30 | text-only | AI / tool / news reaction | Heard about layoffs at McKinsey & Company🥲 | https://www.linkedin.com/posts/shashank219_layoffs-mckinsey-activity-7047175375583387649-CiIZ |
| 111 | 445 | 45 | Sumit Mittal | 2022-09-05 | image (single/multi, incl. GIF) | Milestone / launch / celebration | A huge thanks for all the warm wishes you folks have been giving on teacher's day since morning. | https://www.linkedin.com/posts/bigdatabysumit_bigdata-dataengineering-trendytech-activity-6972543397811146753-pT3C |
| 112 | 443 | 14 | Zach Wilson | 2024-02-25 | link preview card (YouTube/GitHub/article) | Career strategy / big-tech ladder / hiring-side | Getting a staff level role in big tech is challenging! In fact, <3% of engineers in big tech ever reach this role! | https://www.linkedin.com/posts/eczachly_how-to-go-from-senior-to-staff-data-engineer-activity-7167650179561578496-KIxd |
| 113 | 439 | 38 | Zach Wilson | 2023-03-07 | text-only | Career strategy / big-tech ladder / hiring-side | I’ll be emailing a signup form for my data engineering bootcamp in 10 days! | https://www.linkedin.com/posts/eczachly_dataengineering-activity-7038974486318125056-7MOu |
| 114 | 434 | 11 | Shashank Mishra | 2023-01-27 | text-only | Humor / meme / relatable | If something happens to this planet today then still there is one category of human species who will stay alive.... and that is | https://www.linkedin.com/posts/shashank219_dataengineering-developerlife-activity-7024720582395015168-h5eL |
| 115 | 431 | 48 | Venkata Naga Sai Kumar Bysani | 2026-03-16 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | AWS has 200+ services. Most data professionals only need 15. | https://www.linkedin.com/posts/saibysani18_aws-has-200-services-most-data-professionals-activity-7439308512846987264-l2_H |
| 116 | 430 | 83 | Pooja Jain | 2026-10-07 | image (single/multi, incl. GIF) | Contrarian / hard truth | 𝗔 𝗱𝗮𝘁𝗮 𝗺𝗼𝗱𝗲𝗹 𝘀𝗵𝗼𝘂𝗹𝗱𝗻'𝘁 𝘀𝘁𝗮𝗿𝘁 𝘄𝗶𝘁𝗵 𝘁𝗮𝗯𝗹𝗲𝘀. | https://www.linkedin.com/posts/pooja-jain-898253106_%F0%9D%97%94-%F0%9D%97%B1%F0%9D%97%AE%F0%9D%98%81%F0%9D%97%AE-%F0%9D%97%BA%F0%9D%97%BC%F0%9D%97%B1%F0%9D%97%B2%F0%9D%97%B9-%F0%9D%98%80%F0%9D%97%B5%F0%9D%97%BC%F0%9D%98%82%F0%9D%97%B9%F0%9D%97%B1%F0%9D%97%BB%F0%9D%98%81-activity-7513549092069961730-kDoR |
| 117 | 428 | 25 | Alex Freberg | 2026-10-05 | image (single/multi, incl. GIF) | Student or follower success story | People are out here making big moves! | https://www.linkedin.com/posts/alex-freberg_people-are-out-here-making-big-moves-just-activity-7512887118558416896-bAEY |
| 118 | 420 | 14 | Ankit Bansal | 2023-01-14 | image (single/multi, incl. GIF) | Student or follower success story | And the first blood is out. | https://www.linkedin.com/posts/ankitbansal6_think-sql-zerotohero-activity-7019881949263523840-0HG8 |
| 119 | 417 | 14 | Danny Ma | 2021-09-28 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | SQL is important - do you agree? 🚀 | https://www.linkedin.com/posts/datawithdanny_data-sql-analytics-activity-6848596317523075072-ZJ3U |
| 120 | 415 | 5 | Shashank Mishra | 2023-01-10 | image (single/multi, incl. GIF) | AI / tool / news reaction | ChatGPT convinced me that DATA ENGINEERING is NOT USELESS and even mostly I have talked about the rosy picture of Data Engineering professio | https://www.linkedin.com/posts/shashank219_dataengineering-experience-reality-activity-7018577831408340994-VHQP |
| 121 | 415 | 25 | Nick Singh | 2023-06-05 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | 6,000-Word SQL Interview Guide for Data Analysts & Data Scientists. | https://www.linkedin.com/posts/nick-singh-tech_6000-word-sql-interview-guide-for-data-analysts-activity-7071327338931646464-ERgb |
| 122 | 405 | 10 | Danny Ma | 2021-11-16 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | Fall in love with the process, not just the results! ❤️ | https://www.linkedin.com/posts/datawithdanny_sql-datawithdanny-analytics-activity-6866357567631818752-bM-V |
| 123 | 403 | 16 | Deepak Goyal | 2022-10-19 | text-only | Cheat sheet / explainer / X-vs-Y / tool map | 20 Must to master concept in Azure Data Factory (ADF) | https://www.linkedin.com/posts/deepak-goyal-93805a17_jobs-technology-dataengineer-activity-6988462142555336705-NcqT |
| 124 | 399 | 35 | Luke Barousse | 2023-07-09 | image (single/multi, incl. GIF) | AI / tool / news reaction | Data Nerds!! ChatGPT’s Code Interpreter ISN’T going to replace data jobs... well... at least anytime soon. | https://www.linkedin.com/posts/luke-b_datascience-data-ai-activity-7083888279267262464-PYsX |
| 125 | 397 | 45 | Luke Barousse | 2023-11-27 | native video | Milestone / launch / celebration | Data Nerds! I’ve been working behind the scenes this past year and am stoked that my course is finally here 🤖📊🎉 | https://www.linkedin.com/posts/luke-b_data-nerds-ive-been-working-behind-the-activity-7134952164090662913-U0B5 |
| 126 | 397 | 16 | Sumit Mittal | 2023-07-20 | text-only | Interview question / quiz / prep ("asked in <Company>") | Trending Interview question in Apache Spark | https://www.linkedin.com/posts/bigdatabysumit_bigdata-dataengineering-apachespark-activity-7087707248235331584-xL_H |
| 127 | 389 | 23 | Darshil Parmar | 2022-10-03 | text-only | Roadmap / "if I started over" / how to break in | Python for Data Engineering (Topics to cover) 👇🏻 | https://www.linkedin.com/posts/darshil-parmar_dataengineering-python-datawithdarshil-activity-6982572115166158848-1kFk |
| 128 | 388 | 2 | Ajay Kadiyala | 2023-02-28 | document/carousel (PDF) | Free resource / course / project giveaway | Learning #spark with Databricks opens up lot of opportunities in your #dataengineering journey.... | https://www.linkedin.com/posts/ajay026_spark-with-databricks-activity-7036220949649645568-5b7m |
| 129 | 387 | 67 | Jess Ramos | 2023-08-17 | text-only | Contrarian / hard truth | Just because your SQL query runs without an error doesn’t mean it’s what you really want. | https://www.linkedin.com/posts/jessramosmsba_just-because-your-sql-query-runs-without-activity-7098082927728541696-qvwx |
| 130 | 371 | 13 | Deepak Goyal | 2026-10-11 | text-only | Career strategy / big-tech ladder / hiring-side | Give at least 2 interviews every month | https://www.linkedin.com/posts/deepak-goyal-93805a17_give-at-least-2-interviews-every-month-even-activity-7514989647941238784-jVNx |
| 131 | 371 | 10 | Ankit Bansal | 2026-10-11 | text-only | Contrarian / hard truth | Today I am sharing one uncomfortable truth about working in tech… | https://www.linkedin.com/posts/ankitbansal6_today-i-am-sharing-one-uncomfortable-truth-activity-7514887321222017024-mOWj |
| 132 | 371 | 52 | Thais Cooke | 2023-04-24 | text-only | Career transition / origin story | If you asked me three years ago what was SQL and GitHub, I would probably think that you were talking about a movie sequel, and GitHub sound | https://www.linkedin.com/posts/thaiscooke_careergrowth-activity-7056254234949783552-Xw_H |
| 133 | 369 | 10 | Darshil Parmar | 2023-04-14 | document/carousel (PDF) | Free resource / course / project giveaway | 🚗 Uber Data Analytics / End-To-End Modern Data Engineering Project | https://www.linkedin.com/posts/darshil-parmar_uber-data-engineering-project-activity-7052628144163368960-P-Zj |
| 134 | 365 | 29 | Luke Barousse | 2023-12-13 | native video | AI / tool / news reaction | Data Nerds! I'm saving ~20 hours a week using AI tools as a Data Analyst | https://www.linkedin.com/posts/luke-b_data-nerds-im-saving-20-hours-a-week-using-activity-7140796075329708032-zJ7Y |
| 135 | 364 | 12 | Ravit Jain | 2026-10-12 | image (single/multi, incl. GIF) | Event / sponsored partner post | Orlando, let’s make some connections!!!! I’m heading to Gartner IT Symposium/Xpo 2026 with The Ravit Show, and Boomi’s Booth #221 is on my l | https://www.linkedin.com/posts/ravitjain_boomi-gartnersym-agenticai-activity-7515441371235635202---5y |
| 136 | 359 | 66 | Jess Ramos | 2023-01-20 | image (single/multi, incl. GIF) | Milestone / launch / celebration | 2 good things happened to me this morning: | https://www.linkedin.com/posts/jessramosmsba_dataengineering-analytics-learning-activity-7022223881029505024-r-Kw |
| 137 | 357 | 23 | Sumit Mittal | 2023-07-06 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | Let me ask a very interesting question - Pyspark on Databricks | https://www.linkedin.com/posts/bigdatabysumit_bigdata-apachespark-dataengineering-activity-7082656459158683648-ZrB6 |
| 138 | 351 | 20 | Ravit Jain | 2022-02-10 | image (single/multi, incl. GIF) | Humor / meme / relatable | So TRUE! What would you add? For more such free content and learning, join my Slack channel and don't forget to follow my YouTube channel "T | https://www.linkedin.com/posts/ravitjain_datanalyst-analytics-datascience-activity-6897611804701188096-vaaa |
| 139 | 346 | 23 | Ravit Jain | 2026-10-08 | native video | Event / sponsored partner post | Everyone is talking about models. Tamar Yehoshua is talking about context!!!! I sat down with Tamar, Chief Product and AI Officer at Atlassi | https://www.linkedin.com/posts/ravitjain_atlassian-team26europe-agenticai-activity-7513886131499769856-BdnD |
| 140 | 341 | 16 | Rishabh Mishra | 2023-04-09 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | Want to learn Power BI, then this is for you- Power BI Tutorial + Project 🚀 | https://www.linkedin.com/posts/rishabhnmishra_powerbi-dataanalytics-datascience-activity-7050839255090085888-Khkx |
| 141 | 334 | 11 | Ravit Jain | 2026-10-11 | native video | Event / sponsored partner post | A few weeks ago I was at Equinix Horizon, and I am still thinking about everything I captured on camera there. Got to meet Adaire Fox-Martin | https://www.linkedin.com/posts/ravitjain_equinix-equinixhorizon-ai-activity-7515066804575113216-VknP |
| 142 | 329 | 23 | Ravit Jain | 2021-05-23 | document/carousel (PDF) | Free resource / course / project giveaway | Love these fantastic notes to Start Career in Data Science shared by my partners, 365 Data Science. For more such free content and learning  | https://www.linkedin.com/posts/ravitjain_notes-to-start-your-career-in-data-science-activity-6802133631918755840-G_mO |
| 143 | 328 | 11 | Shakra Shamim | 2026-09-23 | image (single/multi, incl. GIF) | Confession / mistake / vulnerability story | 𝐈𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐦𝐨𝐫𝐞 𝐭𝐡𝐚𝐧 𝟒 𝐦𝐨𝐧𝐭𝐡𝐬 𝐬𝐢𝐧𝐜𝐞 𝐈 𝐥𝐞𝐟𝐭 𝐈𝐧𝐝𝐢𝐚, and not a single day has passed when I haven’t missed home. I often think about the thing | https://www.linkedin.com/posts/shakra-shamim_%F0%9D%90%88%F0%9D%90%AD-%F0%9D%90%A1%F0%9D%90%9A%F0%9D%90%AC-%F0%9D%90%9B%F0%9D%90%9E%F0%9D%90%9E%F0%9D%90%A7-%F0%9D%90%A6%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9E-%F0%9D%90%AD%F0%9D%90%A1%F0%9D%90%9A%F0%9D%90%A7-%F0%9D%9F%92-activity-7508382732083900416-ilVP |
| 144 | 327 | 17 | Ravit Jain | 2026-10-09 | native video | Event / sponsored partner post | Most enterprises are not held back by AI models. They are held back by their data. That was the topic of my conversation with Savinay Berry, | https://www.linkedin.com/posts/ravitjain_ad-df26-salesforce-activity-7514265046495993856-oHSR |
| 145 | 326 | 6 | Darshil Parmar | 2022-12-21 | image (single/multi, incl. GIF) | Roadmap / "if I started over" / how to break in | 👨🏻‍💻 The path to learning Data Engineering is simple! | https://www.linkedin.com/posts/darshil-parmar_dataengineering-dataengineer-activity-7011234036295602176-gvMP |
| 146 | 321 | 41 | Thais Cooke | 2022-10-10 | text-only | Other: parable / opinion / commentary | How can we learn so many analytics tools with so little time in the day? The answer is: consistency. | https://www.linkedin.com/posts/thaiscooke_how-can-we-learn-so-many-analytics-tools-activity-6985199381369020416-d1eR |
| 147 | 314 | 17 | Nick Singh | 2023-05-26 | image (single/multi, incl. GIF) | Humor / meme / relatable | Data Science Interview Questions Be Like: | https://www.linkedin.com/posts/nick-singh-tech_data-science-interview-questions-be-like-activity-7067858246484578304-UHEY |
| 148 | 313 | 79 | Joe Reis | 2023-03-23 | image (single/multi, incl. GIF) | Contrarian / hard truth | Be careful. | https://www.linkedin.com/posts/josephreis_be-careful-fundamentals-of-data-engineering-activity-7044817570322944000-IrW4 |
| 149 | 310 | 37 | Jess Ramos | 2026-10-07 | native video | Cheat sheet / explainer / X-vs-Y / tool map | Should you be a data scientist or a data analyst? | https://www.linkedin.com/posts/jessramosmsba_should-you-be-a-data-scientist-or-a-data-activity-7513696241302577152-anRe |
| 150 | 309 | 29 | Luke Barousse | 2023-09-20 | native video | AI / tool / news reaction | Data Nerds! Is AI the end of Data Analyst jobs? ☠️ | https://www.linkedin.com/posts/luke-b_data-nerds-is-ai-the-end-of-data-analyst-activity-7110280318997176320-syZr |
| 151 | 308 | 45 | Sundas Khalid | 2026-10-08 | image (single/multi, incl. GIF) | Personal life / travel update | Hello from London 👩🏻‍💻 | https://www.linkedin.com/posts/sundaskhalid_hello-from-london-i-am-spending-activity-7513969449545187328--8rt |
| 152 | 306 | 22 | Sumit Mittal | 2023-02-13 | image (single/multi, incl. GIF) | Student or follower success story | Taking a break to take care of his child, and getting back to career after cracking multiple offers 🔥 | https://www.linkedin.com/posts/bigdatabysumit_bigdata-career-dataengineering-activity-7030866911613652992-Tpm3 |
| 153 | 304 | 29 | Ken Jee | 2021-12-30 | text-only | Free resource / course / project giveaway | Starting Round 4 of the #66DaysOfData on January 4th! I hope many of you will join me this time around! | https://www.linkedin.com/posts/kenjee_66daysofdata-datascience-machinelearning-activity-6882405978957062144-8NE0 |
| 154 | 302 | 29 | Joe Reis | 2022-03-02 | link preview card (YouTube/GitHub/article) | Free resource / course / project giveaway | Want to learn all about data ingestion? Check out the latest chapter (raw and not final) in Fundamentals of Data Engineering that shows you  | https://www.linkedin.com/posts/josephreis_fundamentals-of-data-engineering-activity-6904907244794720256-G599 |
| 155 | 299 | 33 | Jess Ramos | 2023-12-19 | native video | Humor / meme / relatable | Have you ever felt the physical pain of having to manually refresh data, export it to a spreadsheet, and perform the EXACT same calculations | https://www.linkedin.com/posts/jessramosmsba_have-you-ever-felt-the-physical-pain-of-having-activity-7142878305510191104-Oggg |
| 156 | 288 | 10 | Danny Ma | 2022-03-02 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | ☝️ Learn SQL with me for free - checkout my profile! ☝️ | https://www.linkedin.com/posts/datawithdanny_data-analytics-sql-activity-6904771616216035328-BCSW |
| 157 | 281 | 5 | Nick Singh | 2023-01-26 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | 6 FREE resources to practice Data Science Interview Questions | https://www.linkedin.com/posts/nick-singh-tech_sql-activity-7024250927226253312-iQj1 |
| 158 | 279 | 1 | Sumit Mittal | 2023-09-03 | text-only | Cheat sheet / explainer / X-vs-Y / tool map | 🚀 Excited to share some 🔥 Spark Optimization Techniques! 🔥 | https://www.linkedin.com/posts/bigdatabysumit_sparkoptimization-bigdata-datascience-activity-7103990577846767616-YWc5 |
| 159 | 273 | 24 | Ankit Bansal | 2023-08-06 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | Paypal SQL Interview Question asked in Data Engineer Interview for Sunday workout 💪 | https://www.linkedin.com/posts/ankitbansal6_sql-paypal-activity-7093811394961166336-XFpZ |
| 160 | 272 | 30 | Ravit Jain | 2026-10-09 | image (single/multi, incl. GIF) | Event / sponsored partner post | Next week I’m headed to Salt Lake City for MasterControl’s Masters Summit, where 600+ quality and manufacturing leaders from life sciences w | https://www.linkedin.com/posts/ravitjain_ad-mastercontrolpartner-mastercontrol-activity-7514421432945405952-JUXl |
| 161 | 267 | 14 | Ravit Jain | 2026-10-08 | image (single/multi, incl. GIF) | Event / sponsored partner post | I have had this conference on my list for 3 years. This year I'm in the room, YAY!!!! On October 15, I'll be at TiDB SCaiLE 2026 at the Comp | https://www.linkedin.com/posts/ravitjain_tidb-distributedsql-agenticai-activity-7513976747768524801-JD5n |
| 162 | 262 | 7 | Sumit Mittal | 2023-12-16 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | Data Engineer vs Data Analysts/Scientists vs Decision Makers | https://www.linkedin.com/posts/bigdatabysumit_bigdata-dataengineering-dataanalyst-activity-7141867870094843904-IlH_ |
| 163 | 236 | 0 | Ajay Kadiyala | 2023-08-10 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | Simple data engineering mind map...... | https://www.linkedin.com/posts/ajay026_dataengineering-mindmap-datapipelines-activity-7095248648023785472-A8O3 |
| 164 | 230 | 12 | Ajay Kadiyala | 2022-12-06 | image (single/multi, incl. GIF) | Free resource / course / project giveaway | having Projects adds a great value in your #dataengineering interviews and in your job....... | https://www.linkedin.com/posts/ajay026_dataengineering-resume-projects-activity-7005768073727148032-xzwq |
| 165 | 223 | 40 | Joe Reis | 2024-02-03 | native video | Milestone / launch / celebration | Cool to see Fundamentals of Data Engineering in the #1 spot in all three formats on Amazon - paperback, Kindle, audiobook. Crazy it’s been a | https://www.linkedin.com/posts/josephreis_cool-to-see-fundamentals-of-data-engineering-activity-7159526732465668096-477S |
| 166 | 219 | 79 | Avery Smith | 2023-04-01 | text-only | Confession / mistake / vulnerability story | 😢 I've got some sad news...I'm shutting down Data Career Jumpstart | https://www.linkedin.com/posts/averyjsmith_ive-got-some-sad-newsim-shutting-activity-7047929048752128000-J11t |
| 167 | 211 | 20 | Thais Cooke | 2022-11-07 | text-only | Other: parable / opinion / commentary | The beauty of data: it’s everywhere | https://www.linkedin.com/posts/thaiscooke_dataanalytics-data-projects-activity-6995377968856408064-Cdyz |
| 168 | 210 | 27 | Sundas Khalid | 2026-10-05 | image (single/multi, incl. GIF) | Personal life / travel update | This was my first time in Barcelona, and what could be better than attending Microsoft FabCon and SQLCon✨ | https://www.linkedin.com/posts/sundaskhalid_this-was-my-first-time-in-barcelona-and-activity-7512882214175461376-RzjK |
| 169 | 209 | 12 | Shakra Shamim | 2026-09-22 | text-only | Other: parable / opinion / commentary | I once met a colleague who had undergone a 𝐡𝐞𝐚𝐫𝐭 𝐬𝐮𝐫𝐠𝐞𝐫𝐲 𝐚𝐭 𝐣𝐮𝐬𝐭 𝟑𝟒. He was still dealing with high cholesterol, high blood pressure, and se | https://www.linkedin.com/posts/shakra-shamim_i-once-met-a-colleague-who-had-undergone-activity-7508016152636432384-PRnb |
| 170 | 206 | 7 | Ajay Kadiyala | 2022-09-30 | image (single/multi, incl. GIF) | Contrarian / hard truth | Don't Just do LeetCode DSA. It never help you become a data analytics Pro...... | https://www.linkedin.com/posts/ajay026_datastructures-algorithms-maang-activity-6981459910332997632-aEai |
| 171 | 193 | 2 | Krish Naik | 2022-03-02 | link preview card (YouTube/GitHub/article) | Interview question / quiz / prep ("asked in <Company>") | Important Interview Questions On Decision Tree Machine Learning Algorithm | https://www.linkedin.com/posts/naikkrish_important-interview-questions-on-decision-activity-6904645024475402240-qctf |
| 172 | 192 | 45 | Luke Barousse | 2023-09-13 | native video | Data-backed stat / job-market data | Data Nerds!! What are the top skills of a Data Analyst? | https://www.linkedin.com/posts/luke-b_data-nerds-what-are-the-top-skills-of-a-activity-7107740842173288448-oKFq |
| 173 | 190 | 11 | Ajay Kadiyala | 2022-06-08 | text-only | Cheat sheet / explainer / X-vs-Y / tool map | Database vs Datawarehouse Vs Data Lake: | https://www.linkedin.com/posts/ajay026_comment-data-database-activity-6940139419072884736-_vXA |
| 174 | 190 | 26 | Nick Singh | 2023-10-05 | image (single/multi, incl. GIF) | Milestone / launch / celebration | NEW on DataLemur: SOLVE PYTHON DATA SCIENCE CODING INTERVIEW QUESTIONS! https://lnkd.in/gRVBDPm6 | https://www.linkedin.com/posts/nick-singh-tech_new-on-datalemur-solve-python-data-science-activity-7115699922359787520-xViZ |
| 175 | 189 | 61 | Pooja Jain | 2026-10-12 | image (single/multi, incl. GIF) | Roadmap / "if I started over" / how to break in | 𝗬𝗼𝘂 𝗹𝗲𝗮𝗿𝗻𝗲𝗱 𝗦𝗽𝗮𝗿𝗸. 𝗧𝗵𝗲𝗻 𝘀𝗼𝗺𝗲𝗼𝗻𝗲 𝘀𝗮𝗶𝗱 𝗞𝗮𝗳𝗸𝗮. 𝗧𝗵𝗲𝗻 𝗱𝗯𝘁. 𝗧𝗵𝗲𝗻 𝗔𝗶𝗿𝗳𝗹𝗼𝘄. | https://www.linkedin.com/posts/pooja-jain-898253106_%F0%9D%97%AC%F0%9D%97%BC%F0%9D%98%82-%F0%9D%97%B9%F0%9D%97%B2%F0%9D%97%AE%F0%9D%97%BF%F0%9D%97%BB%F0%9D%97%B2%F0%9D%97%B1-%F0%9D%97%A6%F0%9D%97%BD%F0%9D%97%AE%F0%9D%97%BF%F0%9D%97%B8-%F0%9D%97%A7%F0%9D%97%B5%F0%9D%97%B2%F0%9D%97%BB-activity-7515383567963836416-eCAd |
| 176 | 182 | 5 | Deepak Goyal | 2026-10-04 | text-only | Humor / meme / relatable | Work-Life Balance IT professional office schedule | https://www.linkedin.com/posts/deepak-goyal-93805a17_work-life-balance-it-professional-office-activity-7512473777092386817-CWTE |
| 177 | 173 | 9 | Andreas Kretz | 2022-09-26 | image (single/multi, incl. GIF) | Milestone / launch / celebration | New Course: Data Engineering on Databricks is finally available! 🚀 | https://www.linkedin.com/posts/andreas-kretz_databricks-dataengineering-dataengineer-activity-6980188040040222720-MpHr |
| 178 | 170 | 11 | Deepak Goyal | 2026-10-08 | image (single/multi, incl. GIF) | Personal life / travel update | 🇺🇸 New York & Florida, Let's Connect! | https://www.linkedin.com/posts/deepak-goyal-93805a17_new-york-florida-lets-connect-activity-7513881837744685056-RREU |
| 179 | 166 | 9 | Deepak Goyal | 2023-10-22 | text-only | Interview question / quiz / prep ("asked in <Company>") | 𝗖𝗼𝗺𝗽𝗮𝗻𝘆 𝗪𝗶𝘀𝗲 𝗥𝗲𝗮𝗹 𝗗𝗮𝘁𝗮 𝗘𝗻𝗴𝗶𝗻𝗲𝗲𝗿 𝗜𝗻𝘁𝗲𝗿𝘃𝗶𝗲𝘄 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 | https://www.linkedin.com/posts/deepak-goyal-93805a17_data-jobs-interviewexperience-activity-7121752065894182912-Z8EO |
| 180 | 164 | 7 | Rishabh Mishra | 2024-02-15 | image (single/multi, incl. GIF) | AI / tool / news reaction | In 1979, IBM said “computers can never be held accountable” and “therefore a computer must never make a management decision.” | https://www.linkedin.com/posts/rishabhnmishra_ai-datascience-machinelearning-activity-7163764394315689985-Kvgi |
| 181 | 163 | 53 | Andres Vourakis | 2026-01-15 | document/carousel (PDF) | Data-backed stat / job-market data | I scraped and analyzed 700+ Data Scientist job postings from recent months to understand how AI is shaping the data science job market as we | https://www.linkedin.com/posts/andresvourakis_ai-data-scientist-job-market-in-2026-analysis-activity-7417586666867105792-2x6w |
| 182 | 160 | 12 | Shakra Shamim | 2026-09-24 | text-only | Confession / mistake / vulnerability story | “You can’t become intelligent without becoming stupid.” | https://www.linkedin.com/posts/shakra-shamim_you-cant-become-intelligent-without-becoming-activity-7508748304613277698-KWEi |
| 183 | 154 | 13 | Ken Jee | 2023-07-13 | image (single/multi, incl. GIF) | Milestone / launch / celebration | Crazy to see my Titanic walkthrough just hit 1000 upvotes on Kaggle! Really glad to see people are finding this type of content useful. Hopi | https://www.linkedin.com/posts/kenjee_datascience-kaggle-activity-7085227961318064128-LKFV |
| 184 | 148 | 6 | Sumit Mittal | 2023-01-27 | text-only | Roadmap / "if I started over" / how to break in | How to Learn Big Data? | https://www.linkedin.com/posts/bigdatabysumit_sumitteaches-bigdata-dataengineer-activity-7024701846569046017-xCBP |
| 185 | 148 | 25 | Thais Cooke | 2022-10-03 | text-only | Milestone / launch / celebration | Last week I was on How to Get an Analytics Job podcast. We talked about different aspects of Data Visualization, and it was an honor to be a | https://www.linkedin.com/posts/thaiscooke_dataanalytics-datavisualization-tableau-activity-6982659488906412032-vH5E |
| 186 | 139 | 1 | Sumit Mittal | 2023-09-01 | image (single/multi, incl. GIF) | Student or follower success story | The participation of women in the Software Engineering field was very low a decade back. | https://www.linkedin.com/posts/bigdatabysumit_bigdata-activity-7103344750606381056-b3sD |
| 187 | 135 | 35 | Thais Cooke | 2026-09-25 | image (single/multi, incl. GIF) | Event / sponsored partner post | Yesterday, I was asked what my favorite part of Big Data LDN  was. | https://www.linkedin.com/posts/thaiscooke_yesterday-i-was-asked-what-my-favorite-part-activity-7509292546377039872-2Wmb |
| 188 | 133 | 62 | Danny Ma | 2024-08-16 | image (single/multi, incl. GIF) | Interview question / quiz / prep ("asked in <Company>") | I just made a #SQL mistake with my WHERE filter! Can you help me out? 🥵 | https://www.linkedin.com/posts/datawithdanny_sql-data-analytics-activity-7230123374407000065-rzD0 |
| 189 | 132 | 3 | Emma Ding | 2023-08-05 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | ⚙️ Machine Learning Cheat Sheet ⚙️ | https://www.linkedin.com/posts/emmading001_machinelearning-datascience-interviewpreparation-activity-7093629227610107905-5YDA |
| 190 | 132 | 11 | Kristen Kehrer | 2026-09-29 | image (single/multi, incl. GIF) | Milestone / launch / celebration | Thank you Packt and authors Hanane D.  and Fayssal El Mofatiche, CAIA for this copy of Building AI Agents for Finance! | https://www.linkedin.com/posts/kristen-kehrer-datamovesme_thank-you-packt-and-authors-hanane-d-and-activity-7510681455400886273-M0T4 |
| 191 | 131 | 39 | Benjamin Rogojan | 2022-10-01 | ? | Contrarian / hard truth | We live in a data world that wants to move fast. | https://www.linkedin.com/posts/benjaminrogojan_lets-move-fast-and-get-rid-of-data-engineers-activity-6981989213231595520-w3sv |
| 192 | 121 | 26 | Sundas Khalid | 2026-10-06 | native video | Confession / mistake / vulnerability story | Fired by the CEO After Being Put on a PIP | https://www.linkedin.com/posts/sundaskhalid_fired-by-the-ceo-after-being-put-on-a-pip-activity-7513244491550732289-9IRm |
| 193 | 117 | 14 | Deepak Goyal | 2021-12-30 | text-only | Money: salary / comp / revenue number | These days In India: | https://www.linkedin.com/posts/deepak-goyal-93805a17_databricks-dataengineering-azuredataengineer-activity-6882260943053688832-mmIC |
| 194 | 107 | 1 | Deepak Goyal | 2026-10-06 | image (single/multi, incl. GIF) | AI / tool / news reaction | Most people are using Claude like ChatGPT | https://www.linkedin.com/posts/deepak-goyal-93805a17_most-people-are-using-claude-like-chatgpt-activity-7513138887326810112-jI5_ |
| 195 | 106 | 46 | Pooja Jain | 2026-10-13 | image (single/multi, incl. GIF) | Cheat sheet / explainer / X-vs-Y / tool map | 𝗦𝗤𝗟 𝗖𝗵𝗲𝗮𝘁 𝗦𝗵𝗲𝗲𝘁 𝗳𝗼𝗿 𝗗𝗮𝘁𝗮 𝗘𝗻𝗴𝗶𝗻𝗲𝗲𝗿𝘀 | https://www.linkedin.com/posts/pooja-jain-898253106_%F0%9D%97%A6%F0%9D%97%A4%F0%9D%97%9F-%F0%9D%97%96%F0%9D%97%B5%F0%9D%97%B2%F0%9D%97%AE%F0%9D%98%81-%F0%9D%97%A6%F0%9D%97%B5%F0%9D%97%B2%F0%9D%97%B2%F0%9D%98%81-%F0%9D%97%B3%F0%9D%97%BC%F0%9D%97%BF-%F0%9D%97%97%F0%9D%97%AE%F0%9D%98%81%F0%9D%97%AE-activity-7515721016334131200-fizL |
| 196 | 100 | 19 | Sundas Khalid | 2026-10-07 | native video | Humor / meme / relatable | If you work with data, you have lived this scenario 👇🏽 | https://www.linkedin.com/posts/sundaskhalid_chatgptpartner-activity-7513606960852856832-hFHq |
