# AI creators on LinkedIn: who wins, what they post, and the AI angle a data engineer can own

Research date: 2026-10-14. Client: data engineer, ~13k followers, wants to become the #1 data & AI creator on LinkedIn.

Every number below comes from (a) the li_profile / li_post scrapers, (b) WebFetch of public LinkedIn pages (post pages and LinkedIn's own "Top Content" topic hubs), or (c) a cited third-party source. Nothing is estimated. If a number isn't shown, it wasn't verified.

## 0. Data, method, caveats

After capping at 12 posts per creator (task rule), 407 verified AI-creator posts with ≥100 reactions remain. Merged unique posts: 578 | verified AI-creator posts with >=100 reactions: 492 (>=500: 273, >=1,000: 189, >=5,000: 29) | distinct AI creators with a >=100 post: 202 | li_profile profiles with data: 8 | li_post records: 105 | sources: li_post+webfetch: 83, webfetch: 365, li_post+li_profile: 21, li_profile: 23

**Data:** the posts behind this file are in [`../data/verified-posts.csv`](../data/verified-posts.csv) (segment = AI). Sources per post: the public post page, the public profile page, or LinkedIn's own public "Top Content" topic hubs (`linkedin.com/top-content/...`), which list posts with author, exact follower count, relative age, reactions and comments.

**Caveats**
1. Top Content hubs show posts LinkedIn already ranks highly, so their reaction numbers skew high. For a creator's *typical* post, use the li_profile "recent median" (§1, §6).
2. LinkedIn ages are relative. "1y" means 12–23 months, so "2026" in this file means age ≤ 9.5 months.
3. LinkedIn rate-limited many profile fetches, so creator discovery leaned on LinkedIn's own topic hubs. Unverified candidates are listed at the end of §1.
4. "AI creator" excludes CEOs, executives and news pages whose AI posts appear on the hubs (Demis Hassabis, Reid Hoffman, Arthur Mensch, LinkedIn News, etc.). They stay in the raw data but aren't counted in the AI-creator stats.
5. Hook-pattern and topic labels come from transparent regex rules in `analyze.py`. They're a consistent heuristic, not hand-coding. Each post gets the first matching pattern.

---

## 1. Creator table (focus list)

"Typical reactions" is the **median of the creator's most recent original posts from li_profile**, which is the unbiased number. Where the profile fetch was blocked, the cell gives the median of that creator's *verified high-performing sample* and says so (biased upward). Region comes from the LinkedIn subdomain in the author URL that li_post returned (in. = India, ca. = Canada, etc.). `www` means US or not specified. "—" means not verified.

| # | Creator | Handle | Followers (exact) | Niche | Region | Typical reactions/post | Best verified post | Signature format (verified examples) | Media seen via li_post |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Andrew Ng | andrewyng | 2,656,052 | AI education & research leader (DeepLearning.AI, AI Fund) | www (US/unspecified) | 4,615 (median of 14 verified top/hub posts; biased high; no recent-post sample) | 21,964: "I recently received an email titled “An 18-year-old’s dilemma: Too lat" | Long text letters and news commentary. The 21,964 "18-year-old's dilemma" post is text-only. Course or tool launches (course launch = video, 21,100). | image 4, video 1, text-only 1 |
| 2 | Allie K. Miller | alliekmiller | 1,677,750 | AI for business leaders | www (US/unspecified) | 982 (median of 8 verified top/hub posts; biased high; no recent-post sample) | 1,809: "OpenAI, calm down. I can only type so fast." | Named frameworks ("WISER" prompt formula, 1,493) and beginner how-tos ("If I woke up brand new to AI tomorrow…", 699, video). | video 1, image 1 |
| 3 | Steve Nouri | stevenouri | 1,738,269 | AI news & tools | Singapore | 4,813 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 4,813: "🚀 This is great! Meet TOON - the new language for talking to LLMs effi" | News-jack of a new format or tool ("Meet TOON - the new language for talking to LLMs efficiently", 4,813). | image 1 |
| 4 | Ethan Mollick | — | 436,357 | AI-at-work research (academic) | — | 5,392 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 5,392: "In our new paper we ran an experiment at Procter and Gamble with 776 e" | First-person research findings ("In our new paper we ran an experiment at Procter and Gamble with 776 experienced professionals…", 5,392). | — |
| 5 | Pascal Bornet | pascalbornet | 1,542,892 | AI, automation & future of work | www (US/unspecified) | 2,070 (median of 9 verified top/hub posts; biased high; no recent-post sample) | 4,890: "IKEA automated the task, not the people." | Short reframe one-liners ("IKEA automated the task, not the people.", 4,890). MagicPost: 172 AI posts per year. | image 2, video 2 |
| 6 | Alex Wang | alexwang2911 | 1,185,102 | AI learning, explainers, book reviews | Australia | 3,014 (median of 13 verified top/hub posts; biased high; no recent-post sample) | 12,268: "Funny... but how true is it?" | Square quote card that reproduces someone else's tweet (black background, faint "@Alex Wang" watermark) for the 12,268 hit. Otherwise matrix or diagram images, a "Monthly Book Review" series, and the sign-off "I share my journey here. Join me and let's grow together." | image 4, document/carousel 1 |
| 7 | Alex Xu | alexxubyte | 1,036,872 | System design → AI-engineering diagrams (ByteByteGo) | www (US/unspecified) | **736** (median of 7 most recent posts) | 9,290: "RAG vs Agentic RAG / RAG (Retrieval Augmented Generation) is a method " | Branded animated GIF diagram (ByteByteGo logo, numbered steps, dashed flow arrows, real product logos) plus a numbered text walkthrough. "X vs Y" and "What is X?" titles. Newsletter CTA, and the same hashtags (#systemdesign #coding #interviewtips) on AI posts. | image 8 |
| 8 | Ruben Hassid | ruben-hassid | 944,811 | ChatGPT/Claude prompts & AI tools for non-technical professionals | Israel | **285** (median of 9 most recent posts) | 2,397: "Prompting is the weakest way to use Claude." | Copy-paste prompt posts. The image is a mock ChatGPT UI showing the prompt (4:5, dark mode). Short text (about 900 characters), image or carousel. Recent profile sample shows 2 posts a day (≈05:00 and ≈11:00 UTC). | image 8, document/carousel 2 |
| 9 | Brij Kishore Pandey | brijpandeyji | 740,434 | Agentic AI, RAG & AI-architecture explainers | www (US/unspecified) | **252** (median of 7 most recent posts) | 8,220: "Agentic AI is a paradigm shift where AI models learn, plan, and execut" | Tall (2:3) light-background infographic with a big two-tone title, color-banded tiers, tool logos and a small name/@handle badge. Unicode-bold keywords in the text. Frames: "X ≠ Y", "staircase / evolution", "Naive RAG works in a demo." | image 8 |
| 10 | Aishwarya Srinivasan | aishwarya-srinivasan | 653,254 | AI engineering careers & roadmaps | www (US/unspecified) | 539 (median of 21 verified top/hub posts; biased high; no recent-post sample) | 6,129: "If you're feeling overwhelmed with how fast AI is evolving, you're not" | "If you're getting started… / If you're an AI engineer…" plus a roadmap or cheat-sheet image, with a "Follow me" sign-off. | image 4 |
| 11 | Vaibhav Sisinty | vaibhavsisinty | 602,393 | AI tools & news (GrowthSchool) | India | **411** (median of 7 most recent posts) | 823: "An open source tool just crossed 80,000 GitHub stars that lets your AI" | Short (about 6-line) news-jacks on open-source tools and Claude updates. | image 2 |
| 12 | Addy Osmani | addyosmani | 305,260 | AI-assisted coding / agentic engineering | www (US/unspecified) | 1,622 (median of 9 verified top/hub posts; biased high; no recent-post sample) | 6,492: "Vibe Coding !== Low Quality Work: a guide to responsible AI-assisted d" | Essays and free guides ("Vibe Coding !== Low Quality Work", 6,492, image). Coins terms ("Cognitive Surrender", 2,144). | image 2, document/carousel 1 |
| 13 | Sebastian Raschka | sebastianraschka | 271,272 | LLM research & build-from-scratch education | www (US/unspecified) | 2,862 (median of 7 verified top/hub posts; biased high; no recent-post sample) | 6,601: "I put together a new LLM Architecture Gallery that collects the archit" | Architecture figures and galleries (6,601), new-model breakdowns (Kimi K2, 4,433), tutorials (KV cache, 2,433). | image 3 |
| 14 | Andreas Horn | andreashorn1 | 257,466 | Enterprise AI strategy & agentic AI | Spain | **262** (median of 9 most recent posts) | 5,831: "Blueprint for how banks can actually extract real value from AI:" | Report and whitepaper digests with an image ("McKinsey… blueprint for how banks…", 5,831). Contrarian data takes ("…has nothing to do with AI. It is fixing your data.", 1,952). | image 7 |
| 15 | Eduardo Ordax | eordax | 254,031 | GenAI (AWS) → memes, news, Claude Code diaries | Spain | **94** (median of 7 most recent posts) | 5,450: "A Netflix engineer just shipped something amazing!" | Mix of memes (2–380), news-jacks (5,450), a personal announcement (3,358) and huge multi-panel cheat sheets with a "Visualisation by Eduardo Ordax" credit line (RAG cheatsheet, 1,921). | image 5 |
| 16 | Greg Coquillo | greg-coquillo | 237,216 | AI infrastructure frameworks & mindmaps | www (US/unspecified) | 413 (median of 31 verified top/hub posts; biased high; no recent-post sample) | 1,864: "AI Agent vs Agentic AI / Most people use the terms AI Agent and Agenti" | Logo-wall or framework infographic with a big gradient title, a name/title badge (photo, "Product Leader") and notebook-style section headers ("The AI Ecosystem", 319). Hub hits: "AI Agent vs Agentic AI" (1,864), "8-Layer Architecture for LLM Systems" (830). | image 1 |
| 17 | Charlie Hills | charlie-hills | 258,631 | AI tools & Claude workflows | UK | 1,111 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 1,111: "You can build full n8n workflows in under 5 minutes. / All you need is" | "You can build X in under 5 minutes" plus a guide carousel (n8n with Claude, 1,111, document). Recent posts under the charlie-hills URL show author "Charlie Hills AI" with 9,711 followers and 30–39 reactions (unresolved anomaly). | document/carousel 1 |
| 18 | Lior Alexander | lioralex | 211,048 | AI news | www (US/unspecified) | 2,840 (median of 2 verified top/hub posts; biased high; no recent-post sample) | 5,318: "You can now run 70B LLMs on a 4GB GPU. AirLLM just made massive models" | "You can now…" capability news ("run 70B LLMs on a 4GB GPU", 5,318, image). | image 1 |
| 19 | Armand Ruiz | armand-ruiz | 207,751 | AI at Meta (formerly IBM) | www (US/unspecified) | **46** (median of 7 most recent posts) | 2,480: "Everyone's suddenly talking about Context Engineering. Here's why it m" | Before: guides and frameworks (1,062–2,480). Now: employer product announcements (recent median 46). | image 1 |
| 20 | Aurimas Griciūnas | — | 188,666 | AI engineering (SwirlAI) | — | 569 (median of 4 verified top/hub posts; biased high; no recent-post sample) | 1,328: "Here is why you need to understand 𝗔𝗴𝗲𝗻𝘁𝗶𝗰 𝗥𝗔𝗚 as an AI Engineer." | Technical explainers ("Here is why you need to understand Agentic RAG…", 1,328; TOON, 595). | — |
| 21 | Akshay Pachaar | akshay-pachaar | 182,375 | LLM / AI-engineering visuals | — | 269 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 269: "Function calling vs MCP visually explained…👇 (reshare of Avi Chawla)" | Only a reshare of Avi Chawla's post was verified ("Function calling vs MCP visually explained", 269). Profile fetch blocked. | — |
| 22 | Manthan Patel | leadgenmanthan | 180,568 | AI agents & automation diagrams | www (US/unspecified) | 5,929 (median of 4 verified top/hub posts; biased high; no recent-post sample) | 6,574: "Everyone's building AI agents, but few understand the Agentic framewor" | "Super Simple Post" diagram explainers (6,125; 6,574) and "How Do AI Agents Work? The diagram below…" (5,734). | image 2 |
| 23 | Avi Chawla | avi-chawla | 177,132 | DS/ML/LLM tutorials (Daily Dose of Data Science) | India | **86** (median of 8 most recent posts) | 4,192: "10 GitHub repos to build a career in AI engineering: (100% free step-b" | "X vs Y, clearly explained:" plus a dark-mode animated GIF flow diagram (1080×1080). "N GitHub repos…" posts use a screenshot collage (4,192). Posts daily. | image 3 |
| 24 | Rakesh Gohel | rakeshgohel01 | 170,230 | AI agents (JUTEQ) | Canada | 1,843 (median of 7 verified top/hub posts; biased high; no recent-post sample) | 5,644: "AI Agents are about 90% Software engineering and only 10% AI" | Branded animated GIF infographic (headshot, name and @handle header, 4:5). Contrarian or ratio hook. "let me explain..." plus a cited paper. Sign-off: "Save 💾 ➞ React 👍 ➞ Share ♻️ & follow for everything related to AI Agents". | image 4 |
| 25 | Raj Abhijit Dandekar | raj-abhijit-dandekar-67a33118a | 160,775 | Build-LLMs-from-scratch education (Vizuara) | India | 10,502 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 10,502: "Everyone interacts with ChatGPT. But can you build it from scratch?" | "Everyone interacts with ChatGPT. But can you build it from scratch?" (10,502, image). | image 1 |
| 26 | Paolo Perrone | — | 140,194 | LLM inference | — | 1,719 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 1,719: "I spent 3 years learning LLM inference. These are the only resources w" | First-person curation ("I spent 3 years learning LLM inference. These are the only resources worth your time.", 1,719). | — |
| 27 | Shubham Saboo | shubhamsaboo | 118,658 | Open-source AI agent apps (Awesome LLM Apps) | www (US/unspecified) | 356 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 356: "This open-source AI Agent actually remembers and grows with you 🤯 / No" | Open-source repo showcase plus "Link to the GitHub repo in the comments." (356, image). | image 1 |
| 28 | Nikki Siapno | nikkisiapno | 237,849 | System design (Level Up Coding) | — | 275 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 275: "Docker vs Kubernetes / 𝗗𝗼𝗰𝗸𝗲𝗿 is a containerization platform that solv" | "X vs Y" as a vertical (9:16) talking-head video with burned-in bold caption words (thumbnail checked). Text adds Unicode-bold definitions, "What else would you add?" and a free 218-page System Design Handbook CTA (275, video). | video 1 |
| 29 | Aishwarya Naresh Reganti | — | 130,829 | LLM / AI-engineering research | — | 57 (median of 3 verified top/hub posts; biased high; no recent-post sample) | 370: "This is a solid guide on LLM inference, it starts with the basics and " | Resource and paper shares. Low verified numbers (38–370). | — |
| 30 | Vin Vashishta | — | 212,484 | AI strategy | — | 344 (median of 2 verified top/hub posts; biased high; no recent-post sample) | 427: "What's the point of a massive context window if using over 5% of it ca" | Contrarian commentary on AI headlines (262–427). | — |
| 31 | Elvis S. | omarsar | 95,182 | AI research papers digest | bz subdomain (Belize) | 2,698 (median of 2 verified top/hub posts; biased high; no recent-post sample) | 3,383: "🌟 New Paper: AI Agents vs. Agentic AI Interesting paper summarizing di" | "New Paper:" / "Another banger paper from Google…" digests (2,013–3,383). | image 1 |
| 32 | Ruchi Bhatia | ruchi798 | 101,014 | Data science | www (US/unspecified) | 7,401 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 7,401: "Two years ago, I presented my data science project to Jensen Huang." | First-person story ("Two years ago, I presented my data science project to Jensen Huang.", 7,401, image). | image 1 |
| 33 | Chandrasekar Srinivasan | chandrasekarsrinivasan | 51,211 | AI curriculum for software engineers (mid-size) | www (US/unspecified) | 15,782 (median of 2 verified top/hub posts; biased high; no recent-post sample) | 31,313: "I spent 3+ hours in the last 2 weeks putting together this no-nonsense" | Long curriculum post plus a plain, very tall mind-map image (800×2438, no branding): 6 branches × Skills/Tools. 31,313 reactions on 51,211 followers. | image 1 |
| 34 | Shivani Virdi | — | 87,796 | AI engineering (Microsoft) | — | 401 (median of 6 verified top/hub posts; biased high; no recent-post sample) | 1,404: "AI engineering isn't MCP." | "I taught myself…" stories and contrarian lines ("AI engineering isn't MCP.", 1,404). | — |
| 35 | Kumud Deepali Rudraraju | — | 243,483 | AI careers | — | 638 (median of 3 verified top/hub posts; biased high; no recent-post sample) | 1,340: "Your company doesn't care if you "know AI."" | Career reframes ("Your company doesn't care if you 'know AI.'", 1,340). | — |
| 36 | Ravit Jain | — | 172,288 | AI/data community | — | 257 (median of 5 verified top/hub posts; biased high; no recent-post sample) | 300: "Most people want to use Generative AI." | GitHub-repo roadmaps (verified 74–295). | — |
| 37 | Terezija Semenski | terezijasemenski | 34,133 | ML/AI education (mid-size) | Croatia | 3,578 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 3,578: "I taught myself machine learning > 10 years ago." | First-person proof ("I taught myself machine learning > 10 years ago.", 3,578). | image 1 |
| 38 | Victoria Slocum | victorialslocum | 49,011 | Agentic-workflow explainers (mid-size) | Germany | 3,736 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 3,736: "What's the difference between just AI and truly agentic workflows?" | "What's the difference between just AI and truly agentic workflows?" (3,736). | image 1 |
| 39 | Alexandre Kantjas | akantjas | 40,876 | AI automation (mid-size) | Germany | 4,725 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 4,725: "Automation, AI workflow, or AI agent?" | "Automation, AI workflow, or AI agent?" (4,725). | image 1 |
| 40 | Damien Benveniste | — | 173,428 | ML/LLM education (The AI Edge) | — | 43 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 43: "Mary Poppins gave us one of the best examples of why it is better to b" | Only one verified post (43). | — |
| 41 | Sahar Mor | — | 43,001 | AI coding & agents | — | 33 (median of 1 verified top/hub posts; biased high; no recent-post sample) | 33: "Most AI coders underuse one of the highest-leverage features in Claude" | Only one verified post (33). | — |
| 42 | Zach Wilson | — | 533,206 | Data engineering (reference point for the client) | — | 1,106 (median of 2 verified top/hub posts; biased high; no recent-post sample) | 1,695: "Building Data Pipelines has levels to it:" | Data-engineering "levels" posts ("Building Data Pipelines has levels to it:", 1,695). One AI post: "AI Engineering has four levels to it!" (518). | — |

**Candidates not verified** (no handle or post could be confirmed, or every profile fetch was blocked): Pau Labarta Bajo, Raul Junco, Zain Kahn, Rowan Cheung, Maryam Miradi, Philipp Schmid, and Cassie Kozyrkov (handle `kozyrkov` per Reepl/DataNorth; no post verified). Ethan Mollick is verified through one hub post (436,357 followers, 5,392 reactions), but his profile fetch (`emollick`) returned no name. Sahar Mor and Damien Benveniste were found, but each had only one verified post with fewer than 100 reactions (33 and 43).

---

## 2. Standout creators: formats, visuals, hook habits

Visual notes come from the actual post images. 13 images were downloaded from the posts' structured data (`research/ai/imgs/`, file name = activity ID) and inspected one by one. GIF frame counts come from the files themselves.

### Rakesh Gohel: rakeshgohel01, 170,230 followers, Canada
- **Visual system** (checked: "AI Agents vs. Agentic AI", 4,083; "AI Agent Guardrails", 1,146):
  - **Format:** animated GIF infographics, 800×1000 (4:5 portrait). About 30 and 87 frames, so the diagram animates (arrows and flows move).
  - **Header (the same every time):** circular headshot top-left, name in navy bold with the LinkedIn logo, "@rakeshgohel01" in grey. The title sits top-right in heavy black sans-serif, and the key term is highlighted with a filled block (blue box with white text, or a peach/orange highlight).
  - **Body:** a modular grid of rounded panels. Each has a solid blue header bar with white text, or orange/green "stage" boxes. Numbered circles (①–⑥) mark the flow, with real vendor logos (AWS, Azure, OpenAI, Gemma, Phi-4) inside the boxes. One graphic even embeds a Google Trends chart.
  - **Palette:** white background, navy text, blue (#3B82F6-like) plus orange/peach accents, green for "output" stages.
  - **Density:** high, 5–6 panels on one canvas.
  - **Watermark:** a second small headshot plus "@rakeshgohel01" placed *inside* the diagram, mid-image, so crops can't remove it.
- **Text structure:** contrarian hook, then "let me explain...", then a cited paper (e.g. "Cornell University released… research paper"), then a numbered breakdown. Closes with "Save 💾 ➞ React 👍 ➞ Share ♻️ & follow for everything related to AI Agents".
- **Hooks that worked:**
  - "AI Agents are about 90% Software engineering and only 10% AI" (5,644)
  - "Most still think that AI Agents and Agentic AI are the same thing" (4,083)
  - "Vector databases just became optional for AI agents." (2,094)
  - "In the last 4 months, I've tried and tested 7 coding AI Agents" (1,731)

### Brij Kishore Pandey: brijpandeyji, 740,432 followers
- **Visual system** (checked: "The AI Agents Staircase", 7,327):
  - **Format:** tall static JPEG, 1000×1500 (2:3), white background.
  - **Title:** huge black bold title with one phrase in red ("The **AI Agents** Staircase").
  - **Layout:** a metaphor. A staircase arrow climbs through three color-banded tiers (light blue "ADVANCED", pink/purple "INTERMEDIATE", green "BASIC"), with an illustrated person climbing at the bottom. 15 stacked cards, each with a colored header bar plus a 1–2 line definition with examples, and small tool logos (OpenAI, Hugging Face, Pinecone, etc.).
  - **Density:** very high, but it scans because of the tiers.
  - **Branding:** a small rounded badge with headshot, "Brij Kishore Pandey", "@brijpandeyji" and LinkedIn/X icons placed mid-graphic. Other creators repost these with credit; Abhishek Chandragiri's post ends "Image credit: Brij kishore Pandey".
- **Text:** Unicode-bold key phrases (𝗔𝗴𝗲𝗻𝘁𝗶𝗰 𝗔𝗜, 𝗹𝗲𝗮𝗿𝗻, 𝗽𝗹𝗮𝗻…), bullet sections with bold labels, and a strategic closing line.
- **Recurring frames:**
  - Paradigm shift / evolution: 8,220; 5,784; 3,556
  - "LLM ≠ Generative AI ≠ AI Agents ≠ Agentic AI": 4,279
  - "Naive RAG works in a demo.": 4,501
- **Caution:** his 7 most recent posts have a median of 252 (max 415). His recent hooks have moved toward first-person ("When I started posting on linkedin, I was terrified…" 408; "Many of you ask me how to switch your career to the AI side. Here is exactly what I did." 106).

### Avi Chawla: avi-chawla, 177,132 followers, India
- **Visual system** (checked: "RAG vs Jev + RAG", 2,559; "10 GitHub repos…", 4,192):
  - **Explainers:** square 1080×1080 animated GIFs (about 50 frames) in **dark mode**. Black background, a big white bold title, and two side-by-side flow diagrams split by a dashed divider. Nodes are glowing circular icons, color-coded: blue for data/embeddings/vector DB, amber for query/LLM/response, green for the new component (Jev). Labels only, almost no prose.
  - **Branding:** none inside the frame.
  - **Resource lists:** a collage of 12 GitHub README screenshots under a monospace title ("10 GitHub Repos to build a career in AI Engineering"). The screenshots *are* the proof.
- **Text:**
  - Title line plus a parenthetical qualifier ("(100% free step-by-step roadmap)", "(must-know for AI engineers)", "(it's a popular ML interview question)").
  - Emoji-numbered list.
  - Sign-off: "Find me → Avi Chawla / Every day, I share tutorials and insights on DS, ML, LLMs, and RAGs."
- **Pattern:** "X vs. Y, clearly explained:" is his house hook ("SFT vs. DPO vs. RLVR, clearly explained:", "RAG vs. Jev + RAG, clearly explained:").
- **Caution:** his recent median is 86 (n=8). The new-concept explainer (Jev) hit 2,559; routine explainers got 32–273.

### Nikki Siapno: nikkisiapno, 237,849 followers
- **Verified post:** "Docker vs Kubernetes" (275 reactions, 45 comments), dated 2026-10-08.
- **Format:** a **vertical 9:16 talking-head video** (720×1280 thumbnail). Home-studio setting (mic, plants, framed art) with bold white uppercase burned-in captions ("WHAT'S THE…"). It is not a diagram.
- **Text:** "X vs Y" title, Unicode-bold term definitions, a 1-line punchline ("Docker runs containers. Kubernetes keeps them running."), "What else would you add?", then "📌 PS: Want to improve at system design? Download my 218 page System Design Handbook for free and join 35,000+ engineers who get my free weekly newsletter".
- A WebSearch result snippet quotes her saying she vibe-coded a skill that generates SVG diagrams "using my branding". The diagram style itself wasn't verified here, because her profile fetch was blocked.

### Alex Xu (ByteByteGo): alexxubyte, 1,036,872 followers
- **Visual system** (checked: "RAG vs Agentic RAG", 9,290; "Generative AI Learning Roadmap", 7,924):
  - **Format:** animated GIFs, about 800×940–980, 75–90 frames.
  - **Layout:** a strict house template. A **green vertical accent bar** sits left of the title (top-left), with the title in heavy black or white. Comparison titles use colored pills ("RAG" blue pill, "Versus", "Agentic RAG" green pill). The **ByteByteGo logo sits top-right**. Sections are rounded boxes with **dashed colored borders** (blue/green/purple) and pill-shaped section headers. **Numbered step circles** sit on dashed arrows.
  - **Content:** real product logos (GPT, Gemini, Claude, AWS, Azure), cute flat icons and mock UI (a ChatGPT "What can I help with?" box). The roadmap version runs a vertical "spine" with 8 numbered modules alternating left and right.
  - **Background:** dark charcoal for comparisons, light for roadmaps.
  - **Density:** high, but strictly gridded.
- **Text:** title line, a 1-sentence definition, then "1 - … 2 - …" numbered steps. Ends with "Subscribe to our weekly newsletter to get a Free System Design PDF (158 pages)" and the same hashtags on every post (#systemdesign #coding #interviewtips).
- **Recent median** (li_profile): 736 (n=7).

### Ruben Hassid: ruben-hassid, 944,810 followers, Israel
- **Visual:** the image is a **mock ChatGPT o3 interface** (dark mode, 1080×1350), with the prompt sitting in the message box above "Cancel / Send" buttons. The reader sees the exact thing to copy. No logo or watermark.
- **Text:** about 9 lines. Hook, "Copy & paste it (after clicking '...more'):", the prompt in quotes, a one-line rationale with a citation, "Reshare ♻ to help others…", "PS: I share weekly prompts at Ruben Hassid."
- **Cadence:** his recent sample shows two posts a day. MagicPost counted 188 AI posts in 12 months.
- **Recent median** 285. Spikes come from privacy and self-interest prompts ("Google your name. Now imagine your ex doing it." 2,312) and Claude contrarian posts ("Prompting is the weakest way to use Claude." 2,397).

### Andrew Ng: andrewyng, 2,656,046 followers
- **Biggest AI posts in the dataset:**
  - Text-only story, "I recently received an email titled 'An 18-year-old's dilemma: Too late to contribute to AI?'": 21,964 reactions, 851 comments
  - Course-launch video: 21,100
  - "Releasing a new 'Agentic Reviewer'…": 17,683
- **Formula:** a concrete person or event, then a lesson.

### Andreas Horn: andreashorn1, 257,466 followers
- **Format:** Unicode-bold first line, then a digest of a report (McKinsey, Anthropic, Microsoft) with an image.
- **Best:** "…blueprint for how banks can actually extract real value from AI:" (5,831).
- **Recent median:** 262. His recent spikes are data-first or contrarian: "The best thing you can do for your AI strategy in 2026 has nothing to do with AI. It is fixing your data." (1,952); "Something changed in the last few months… Agentic AI is real" (2,173).

### Alex Wang: alexwang2911, 1,185,102 followers, Australia
- **Biggest post** (12,268): a **square quote card reproducing someone else's tweet** ("To replace programmers with AI, clients will have to accurately describe what they want. we're safe."). Black background with a faint "@Alex Wang" watermark bottom-left, captioned "Funny... but how true is it?".
- **Other hits:** matrix images ("Which AI role suits you?" 4,537), carousels ("AI agents are more than just LLMs." 3,776), and a "Monthly Book Review" series (2,938; 1,965).
- **Sign-off:** "I share my journey here. Join me and let's grow together."

### Greg Coquillo: greg-coquillo, 237,215 followers
- **Visual** ("The AI Ecosystem"): a tall infographic with a huge orange-gradient title and a blue name badge (photo, "Greg Coquillo / Product Leader"). Notebook-spiral section headers alternate orange and blue, with logo walls of 10–20 vendor logos per section linked by colored "pipe" lines. Very high logo density.
- **Numbers:** 27 verified posts, sample median 417, best 1,864 ("AI Agent vs Agentic AI").

### Chandrasekar Srinivasan: chandrasekarsrinivasan, 51,211 followers (the biggest post in the dataset)
- **Result:** 31,313 reactions and 758 comments on a long curriculum post.
- **Visual:** a **plain auto-generated mind map** (800×2438, light grey). One root, "AI Skills and How To Master Them", with 6 colored branches (LLMs, RAG, Agentic AI, AI Agents, AI Engineer, ML Engineer), each split into Skills and Tools with 8 leaves.
- **Branding:** none. No designed template.
- **Lesson:** content usefulness and a first-person effort hook ("I spent 3+ hours in the last 2 weeks…") beat polish.

### Eduardo Ordax: eordax, 254,031 followers, Spain
- **Visual** (RAG cheatsheet, 1,921): a huge multi-panel poster. Pastel cards, coral pill section titles ("RAG Foundations", "Advanced Retrieval Techniques", "Generation", "Evaluation"), dozens of mini flow diagrams, and a footer credit with headshot ("Visualisation by Eduardo Ordax").
- **Recent feed:** mostly memes (2–380). The spikes are a personal announcement (3,358) and news-jacks (5,450).

**What the client should copy visually:**
1. **One consistent header** (headshot, name, @handle) like Rakesh, or one consistent frame (accent bar, logo top-right, dashed sections) like Alex Xu. Put a small in-image watermark inside the diagram, not in a corner.
2. **4:5 portrait or 2:3 tall for infographics, 1:1 for dark-mode diagrams.** Comparisons ("X vs Y") as two columns or two stacked panels with color-coded nodes, and the new or important element in a contrasting color.
3. **Animation is common among the diagram leaders.** 5 of the 6 images checked from Rakesh, Avi and Alex Xu are multi-frame GIFs. The exception is Avi's screenshot collage.
4. **The biggest single post was an unbranded mind map, and the second biggest was text-only.** For a 13k account, the hook and the first-person stake matter more than polish.

---

## 3. Hook pattern analysis (verified AI-creator posts with ≥100 reactions)

Sorted by median reactions. n is the number of verified posts.

| Pattern | n posts | Median reactions | Range | Best example (author, reactions, hook) |
|---|---|---|---|---|
| P04 Shift / evolution / "the era of X" | 15 | 3,352 | 389–8,220 | Brij Kishore Pandey, 8,220: "Agentic AI is a paradigm shift where AI models learn, plan, and execute tasks autonomously..." |
| P02 Personal announcement / launch / milestone | 5 | 2,938 | 946–21,100 | Andrew Ng, 21,100: "Announcing my new course: Agentic AI! / Building AI agents is one of the most in-demand skills in the job mark" |
| P01 Copy-paste prompt / tool hack ("This is my favorite ChatGPT prompt hack") | 9 | 1,558 | 820–2,390 | Ruben Hassid, 2,390: "This is my favorite ChatGPT prompt hack. Copy & paste it (after clicking "...more"):" |
| P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | 22 | 1,268 | 152–9,290 | Alex Xu, 9,290: "RAG vs Agentic RAG / RAG (Retrieval Augmented Generation) is a method that combines information retrieval with" |
| P10 News-jack ("X just released / launched", "You can now…") | 17 | 878 | 128–9,216 | Andrew Ng, 9,216: "“Loop engineering” is a hot buzzphrase after mentions of it by Boris Cherny (Claude Code’s creator)" |
| P05 Contrarian reframe / myth-bust ("X is not Y", "Stop X", "you don't have an X problem") | 67 | 720 | 152–4,890 | Pascal Bornet, 4,890: "IKEA automated the task, not the people." |
| P09 Free resource drop (repos, courses, papers, cheat sheets, tips) | 32 | 656 | 101–17,683 | Andrew Ng, 17,683: "Releasing a new "Agentic Reviewer" for research papers. / I started coding this as a weekend project, and Yixi" |
| P11 "Everyone talks about X…" / shared confusion & overwhelm ("you're not alone") | 19 | 629 | 107–10,502 | Raj Abhijit Dandekar, 10,502: "Everyone interacts with ChatGPT. But can you build it from scratch?" |
| P15 Career / jobs tension | 19 | 559 | 106–4,537 | Alex Wang, 4,537: ""Which AI role suits you?" An interesting matrix, and I like the idea." |
| P07 First-person proof / story ("I tried", "I interviewed 150", "I taught myself") | 47 | 550 | 115–31,313 | Chandrasekar Srinivasan, 31,313: "I spent 3+ hours in the last 2 weeks putting together this no-nonsense curriculum" |
| P08 Roadmap / learning path / "If you're getting started" | 38 | 528 | 150–7,924 | Alex Xu, 7,924: "The Generative AI Learning Roadmap / Generative AI is a type of AI that can create new content based on what i" |
| P12 Explainer / definition ("What is X?", "X, explained", "N layers of…") | 41 | 502 | 103–5,745 | Andreas Horn, 5,745: "𝗧𝗵𝗶𝘀 𝗶𝘀 𝗵𝗮𝗻𝗱𝘀 𝗱𝗼𝘄𝗻 𝗼𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗕𝗘𝗦𝗧 𝘃𝗶𝘀𝘂𝗮𝗹𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗼𝗳 𝗵𝗼𝘄 𝗟𝗟𝗠𝘀 𝗮𝗰𝘁𝘂𝗮𝗹𝗹𝘆 𝘄𝗼𝗿𝗸." |
| P00 Bold declarative thesis, no other device ("Agent memory has quickly become…") | 114 | 467 | 101–12,946 | Andrew Ng, 12,946: "The buzz over DeepSeek this week crystallized, for many people, a few important trends..." |
| P14 Question or meme one-liner ("Funny... but how true is it?") | 21 | 388 | 101–12,268 | Alex Wang, 12,268: "Funny... but how true is it?" |
| P06 Number shock / ratio ("90% X, 10% Y", "$2.73 vs $0.02") | 26 | 276 | 104–5,644 | Rakesh Gohel, 5,644: "AI Agents are about 90% Software engineering and only 10% AI" |

**What the pattern data says**
- **Highest medians.** Three patterns name a change or a contrast that the reader feels behind on:
  - "Shift / evolution" (P04): "Agentic AI is a paradigm shift…", "The AI Agents Staircase…", "We're witnessing a shift from static models to AI agents…"
  - "X vs Y / X ≠ Y" comparisons (P03): "RAG vs Agentic RAG", "LLM ≠ Generative AI ≠ AI Agents ≠ Agentic AI", "Automation, AI workflow, or AI agent?"
  - Personal announcements (P02)

  The comparison format carries the best mid-size results: Alexandre Kantjas (40,876 followers) got 4,725 and Victoria Slocum (49,011) got 3,736.
- **News-jacks (P10)** are hit-or-miss (wide range). They pay off when the "new thing" is genuinely new and named: loop engineering, TOON, "run 70B LLMs on a 4GB GPU", Agent Skills.
- **Contrarian reframes (P05)** are the most-used high-performing device (largest named group). They're the safest pattern for a technical niche. The data-layer examples (vector DBs, semantic layer, "fix your data") come from this group.
- **First-person proof (P07)** has a mid median but the fattest tail. It holds the single biggest post (Chandrasekar Srinivasan, 31,313) and most of the small-account outliers (Terezija Semenski, Kateryna Stetsiuk, Ravi Singh, Junhua Zhu). That matches the client's own data: his first-person interview stories outperform everything else.
- **Number-shock hooks (P06)** have the lowest median. A number alone isn't enough. Rakesh Gohel's "AI Agents are about 90% Software engineering and only 10% AI" (5,644) worked because the ratio is also a contrarian claim.
- **Roadmaps (P08) and resource drops (P09)** are reliable but saturated. Aishwarya Srinivasan's "If you're … this is for you" roadmap series sits mostly between 400 and 1,000 on 653k followers.

**Fill-in templates for the client, one per verified pattern (examples to adapt, not verified posts):**
- P03: "Data pipeline vs AI pipeline. Same DAG, different failure modes."
- P05: "Your RAG isn't failing because of the LLM. It's failing because of your joins."
- P07: "I interviewed 40 data engineers this year. The AI round changed everything."
- P04: "Data engineering is quietly becoming context engineering."
- P10: "[New thing] just dropped. Here's what it means for your Airflow DAGs."
- P11: "Everyone's building AI agents. Nobody's talking about the data they run on."
- P06: "We cut our LLM bill from $X to $Y with one SQL change."
- P02: "I'm leaving my DE job to build AI data infra. Here's why."

---

## 4. Media analysis

Media type is verified only for posts fetched with li_post. WebFetch can't see attachments, and media for profile-only posts is unknown.

| Media type (li_post) | n posts (>=100 reactions) | Median reactions | Range | Median comments |
|---|---|---|---|---|
| image | 91 | 2,782 | 224–31,313 | 156 |
| video | 7 | 699 | 195–21,100 | 160 |
| document/carousel | 5 | 2,300 | 1,010–4,477 | 192 |
| text-only | 1 | 21,964 | 21,964–21,964 | 851 |

(li_post media records total incl. <100 reactions and non-AI-creator posts: 105; by type: image 92, video 7, document/carousel 5, text-only 1)

**How to read this table.** The li_post sample is mostly the *top* posts we chose to check, plus recent profile posts with ≥150 reactions, so it shows what the winners use. It is not a controlled test of format effects. li_post marks `image` when the post's structured data carries an image. When the page also shows video or document markers next to an image, the post is counted as `image` (those page-level markers are noisy), and `video` is counted only when the post itself is a VideoObject. That covers native images and infographics, and may include link-preview thumbnails on link posts (some of Andrew Ng's news letters). `document/carousel` means a PDF/document post was detected. `video` means the page is a VideoObject.

**What the media data says**
- **The single static image (infographic, diagram, meme or screenshot) dominates the AI winners.** Almost every top post checked with li_post is an image post: Chandrasekar Srinivasan's curriculum flowchart (31,313), Alex Wang's meme (12,268), Raj Abhijit Dandekar (10,502), Alex Xu's RAG vs Agentic RAG diagram (9,290), Brij Kishore Pandey's "AI Agents Staircase" (7,327), Manthan Patel's agent diagrams (6,125–6,574), Rakesh Gohel (5,644; 4,083).
- **Carousels/documents are a minority but strong for "how-to" and guides.** Examples: Ruben Hassid's "1 prompt to create every prompt" (2,300) and ChatGPT headshots (1,010), Charlie Hills' n8n-with-Claude guide (1,111, 498 comments), Addy Osmani's Google whitepaper share (4,477), Alex Wang's "AI agents are more than just LLMs." (3,776). Their comment counts are high relative to reactions (Charlie Hills 498 comments on 1,111 reactions; Ruben Hassid 419 on 2,300). Ruben's two carousel texts send readers to the comments ("More info on my 1st comment.", "(Prompt 8 is in the top comment)").
- **Native video is rare among verified AI winners.** Only 7 of the li_post-checked posts are videos. Andrew Ng's course launch (21,100) is the outlier, because the announcement is the content. Pascal Bornet's two videos got 2,196 and 2,079 (on 1.54M followers), Allie K. Miller's got 699, Vaibhav Sisinty's got 438, Nikki Siapno's vertical talking-head "Docker vs Kubernetes" got 275, and Avi Chawla's got 195. On the same accounts, image posts did better: Vaibhav's best recent image post got 823, and Avi's Jev image post got 2,558.
- **Text-only can win when the story is strong.** Andrew Ng's "I recently received an email titled 'An 18-year-old's dilemma: Too late to contribute to AI?'" is text-only at 21,964 reactions and 851 comments, the second-biggest AI post in the dataset. For the client, whose interview stories already work as text, the format is the story. A visual is optional.
- MagicPost names the same winning formats: explainer diagrams (Alex Xu), free-resource lists (Andrew Bolis), practical workflow posts (Rory Flynn), hiring and company news, and event recaps.

---

## 5. Which AI topics get the biggest numbers right now (2026)

| Topic | n (all) | Median (all) | n posted in 2026 (<=9.5 mo old) | Median 2026 | Best 2026 post |
|---|---|---|---|---|---|
| Prompting / ChatGPT tips | 23 | 1,409 | 4 | 1691 | Ruben Hassid 2,314: "Google your name. Now imagine your ex doing it. / Four prompts erase what they'd" |
| Enterprise AI strategy / data foundation | 15 | 1,340 | 6 | 1146 | Andreas Horn 1,956: "The best thing you can do for your AI strategy in 2026 has nothing to do with AI" |
| AI & jobs / layoffs / future of work | 7 | 878 | 6 | 1086 | Pascal Bornet 4,890: "IKEA automated the task, not the people." |
| LLM internals / models / research / open-weight & policy news | 49 | 1,060 | 21 | 772 | Sebastian Raschka 6,601: "I put together a new LLM Architecture Gallery that collects the architecture fig" |
| RAG / vector DB / knowledge graph / semantic layer / agent memory | 61 | 672 | 32 | 599 | Brij Kishore Pandey 4,501: "𝗡𝗮𝗶𝘃𝗲 𝗥𝗔𝗚 𝘄𝗼𝗿𝗸𝘀 𝗶𝗻 𝗮 𝗱𝗲𝗺𝗼." |
| AI careers / roadmaps / interviews / learning | 81 | 585 | 32 | 522 | Pascal Bornet 2,939: "Brutal career truth in the age of AI: knowledge alone is no longer enough." |
| AI tools / productivity stacks | 16 | 397 | 8 | 487 | Alex Wang 3,014: "AI tools can make iteration much faster." |
| Claude / Claude Code / coding agents / vibe coding / loop engineering | 65 | 486 | 47 | 474 | Andrew Ng 9,216: "“Loop engineering” is a hot buzzphrase after mentions of it by Boris Cherny (Cla" |
| MCP / A2A / agent protocols | 10 | 342 | 4 | 473 | Sivasankar Natarajan 1,623: "What is MCP (Model Context Protocol)?" |
| AI agents / agentic AI (concepts, frameworks, architectures) | 109 | 538 | 32 | 345 | Alex Xu 2,492: "The Typical AI Agent Stack, Explained" |
| Other AI | 56 | 382 | 21 | 211 | Eduardo Ordax 5,450: "A Netflix engineer just shipped something amazing!" |

**What's winning in 2026 (posts ≤ 9.5 months old, verified numbers):**

1. **Coding agents, Claude Code, "loop engineering"** is the busiest 2026 lane on LinkedIn's hubs and has the single biggest 2026 hits.
   - Andrew Ng, "“Loop engineering” is a hot buzzphrase after mentions of it by Boris Cherny (Claude Code’s creator)…": 9,216
   - Addy Osmani, "Google published a free ~50 page whitepaper on the new SDLC with Vibe Coding & Agentic Engineering!": 4,477
   - Andrew Ng, "Coding agents are accelerating different types of software work to different degrees.": 3,182
   - Eduardo Ordax, "I've spent at least 60' every day for the last couple of months vibe coding on Claude Code…": 2,590
   - Ruben Hassid, "Prompting is the weakest way to use Claude.": 2,397, and "I wrote these 6 Claude formulas for my team. Nobody's allowed to skip them (including you):": 2,137
   - Julio Casal (80,283 followers), "Claude Code doesn't make you faster. Directing it does.": 2,304
   - Sandipan Bhaumik (27,548 followers), "Claude Code Project Structure: Every File and Folder Explained": 2,239
   - Addy Osmani, "Agent Skills just crossed 31,000 stars on GitHub!": 1,870
   - Vaibhav Sisinty's 7 most recent posts are all Claude, coding-agent or open-source-agent tool news (median 411).
2. **The data layer under agents (retrieval, memory, knowledge graphs, semantic layers, "vectorless" RAG)** has the highest 2026 median of the four largest 2026 lanes (each with 29 or more verified 2026 posts), and it is the lane closest to data engineering. The small "Enterprise AI strategy / data foundation" lane does even better in 2026 (median above 1,000 on 6 posts). Andreas Horn's "…has nothing to do with AI. It is fixing your data." (1,952) and "Data governance is one of the most misunderstood topics in enterprise." (1,944) both sit there.
   - Brij Kishore Pandey, "Naive RAG works in a demo.": 4,501
   - Alex Wang, "Agent memory has quickly become one of the most discussed topics in AI.": 3,614
   - Alex Xu, "RAG vs Graph RAG vs Agentic RAG": 3,141
   - Avi Chawla, "RAG vs. Jev + RAG, clearly explained": 2,559 (his recent median is 86)
   - Rakesh Gohel, "Vector databases just became optional for AI agents.": 2,094, and "The question for AI agents was never what does the graph contain…": 1,843
   - Elvis S., a Google agent-memory paper: 2,013
   - George Hurn-Maloney (12,287 followers), agent memory: 1,779
   - Isin Pesch (5,601 followers), semantic layer: 1,369
3. **LLM internals made visual or practical**
   - Sebastian Raschka, "I put together a new LLM Architecture Gallery…": 6,601
   - Lior Alexander, "You can now run 70B LLMs on a 4GB GPU…": 5,318
   - Hao Hoang, "Most engineers say they 'understand LLMs.'": 2,356
   - Paolo Perrone, "I spent 3 years learning LLM inference. These are the only resources worth your time.": 1,719
4. **AI-and-jobs reframes** (small n, high median)
   - Pascal Bornet, "IKEA automated the task, not the people.": 4,890, and "The forecast was that AI would shrink the workforce.": 2,070
   - Sharan Hegde, "TCS just did something that shouldn't be possible if AI is killing IT jobs…": 1,294
5. **Personal milestones beat everything else on the same account**
   - Eduardo Ordax, "Big Annoucement!!!! Today is probably one of the most special days of my professional life!!": 3,358. His other 6 recent posts had 2–380.
   - Andrew Ng, "Announcing my new course: Agentic AI!": 21,100

**What's cooling:**
- **Generic "AI agents / agentic AI explained" posts.** This is the biggest lane overall, but its 2026 median is the lowest of the major topics. Its famous hits (Brij Kishore Pandey 8,220 / 7,327 / 5,784, Manthan Patel 6,574 / 6,125, Rakesh Gohel 5,644) are all labelled "1y" on LinkedIn, meaning they're from 2025.
- **Copy-paste ChatGPT prompt posts.** Historically strong (Ruben Hassid's prompt posts got 820–2,390), but few verified 2026 examples. Ruben's verified 2026 hits are about Claude ("Prompting is the weakest way to use Claude." 2,397) and privacy ("Google your name. Now imagine your ex doing it." 2,312), not about ChatGPT prompts.
- **"Top AI tools" lists.** Greg Coquillo's "Most people drown in the endless sea of new AI tools." got 447 (237k followers). Anshuman Tiwari's "There are thousands of AI tools launching every week." got 283 (82,964 followers). These are the closest public analogue to the client's 120–260-impression listicles.

**New-concept explainers spike when something new drops.** Avi Chawla's Jev explainer got about 30× his recent median. Steve Nouri's "Meet TOON - the new language for talking to LLMs efficiently" got 4,813. Andrew Ng's "loop engineering" got 9,216. The move is the same each time: name the new thing, then contrast it with what people already know ("RAG vs. Jev + RAG", "JSON vs TOON", "Prompt Engineering vs Loop Engineering").

---

## 6. The client's key problem: why AI listicles flop on his account, and what AI angle a data engineer can own

**His own data:** AI listicles and tool comparisons got 120–260 impressions. First-person data-engineering interview stories got 4k–37k.

### 6a. Reach efficiency by follower band (all verified AI-creator posts)
| Follower band | n verified posts (AI creators, all reaction levels) | Median reactions | Median reactions as % of followers | Max reactions |
|---|---|---|---|---|
| 0–5,000 | 16 | 244 | 8.35% | 6,125 |
| 5,000–50,000 | 122 | 263 | 1.39% | 4,725 |
| 50,000–150,000 | 72 | 405 | 0.48% | 31,313 |
| 150,000–500,000 | 159 | 587 | 0.26% | 10,502 |
| 500,000–100,000,000 | 149 | 1,429 | 0.13% | 21,964 |

### 6b. What giant accounts' *typical* posts get now (recent posts, li_profile)
| Creator | Followers | Recent original posts fetched (li_profile) | Median reactions | Max | Median as % of followers |
|---|---|---|---|---|---|
| Alex Xu | 1,036,872 | 7 | 736 | 1,057 | 0.071% |
| Ruben Hassid | 944,802 | 9 | 285 | 2,312 | 0.030% |
| Brij Kishore Pandey | 740,429 | 7 | 252 | 415 | 0.034% |
| Vaibhav Sisinty | 602,386 | 7 | 411 | 822 | 0.068% |
| Andreas Horn | 257,465 | 9 | 262 | 2,173 | 0.102% |
| Eduardo Ordax | 254,031 | 7 | 94 | 3,358 | 0.037% |
| Armand Ruiz | 207,751 | 7 | 46 | 70 | 0.022% |
| Avi Chawla | 177,132 | 8 | 86 | 2,559 | 0.049% |

### 6c. Smaller creators (<60k followers) whose AI posts hit ≥400 reactions
| Reactions | Author (followers) | Reactions ÷ followers | Hook pattern | Hook |
|---|---|---|---|---|
| 31,313 | Chandrasekar Srinivasan (51,211) | 61.1% | P07 First-person proof / story | I spent 3+ hours in the last 2 weeks putting together this no-nonsense curriculum |
| 6,125 | Jiunn-Tyng (Tyng) Yeh (4,105) | 149.2% | P00 Bold declarative thesis, no other device | People are suffering—yet many still deny that hours with ChatGPT reshape how we focus, create and critique. |
| 4,725 | Alexandre Kantjas (40,876) | 11.6% | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | Automation, AI workflow, or AI agent? |
| 3,736 | Victoria Slocum (49,011) | 7.6% | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | What's the difference between just AI and truly agentic workflows? |
| 3,578 | Terezija Semenski (34,133) | 10.5% | P07 First-person proof / story | I taught myself machine learning > 10 years ago. |
| 2,239 | Sandipan Bhaumik (27,548) | 8.1% | P12 Explainer / definition | Claude Code Project Structure: Every File and Folder Explained |
| 2,052 | Rock Lambros (24,174) | 8.5% | P11 "Everyone talks about X…" / shared confusion & overwhelm | AI security/securing the use of AI is going to kill me. |
| 1,962 | Sarveshwaran Rajagopal (56,214) | 3.5% | P05 Contrarian reframe / myth-bust | Stop treating LLMs like they are the entire AI solution. |
| 1,779 | George Hurn-Maloney (12,287) | 14.5% | P00 Bold declarative thesis, no other device | Agent memory is highly complex, but getting it right is one of the most critical engineering challenges… |
| 1,686 | João (Joe) Moura (53,138) | 3.2% | P14 Question or meme one-liner | My biggest fear as an AI startup founder? |
| 1,623 | Sivasankar Natarajan (26,734) | 6.1% | P12 Explainer / definition | What is MCP (Model Context Protocol)? |
| 1,551 | Shobhit Tankha (8,296) | 18.7% | P05 Contrarian reframe / myth-bust | A lot of AI engineers (even sharp ones) get seduced by the cool factor of vector databases. |
| 1,488 | Rohit Ghumare (56,974) | 2.6% | P07 First-person proof / story | I moved from DevOps into AI-native infrastructure. Here is what I would learn first: |
| 1,410 | Raghvender Arni (31,420) | 4.5% | P06 Number shock / ratio | TL;DR: AWS Distinguished Engineer Joe Magerramov's team achieved 10x coding throughput using AI agents |
| 1,369 | Isin Pesch (5,601) | 24.4% | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone is selling the semantic layer as the way to make AI agents reliable on your data. |
| 1,346 | Ravi Singh (44,774) | 3.0% | P07 First-person proof / story | As a Team Lead at Google, I'm watching the engineering craft change faster than ever. |
| 1,170 | Rahul Agarwal (46,241) | 2.5% | P00 Bold declarative thesis, no other device | Few Lessons from Deploying and Using LLMs in Production |
| 1,152 | Jean Malaquias (38,928) | 3.0% | P00 Bold declarative thesis, no other device | Retrieval Architecture Is Defining the Future of AI Systems |
| 1,109 | Kateryna Stetsiuk (14,960) | 7.4% | P07 First-person proof / story | I've interviewed around 150 candidates for ML/AI Engineer positions across various levels over the last 12 months. |
| 1,106 | Ravi Shankar (34,910) | 3.2% | P08 Roadmap / learning path / "If you're getting started" | If you're aiming to move into a Machine Learning Engineer position… |
| 1,104 | Sean Connelly (24,210) | 4.6% | P00 Bold declarative thesis, no other device | Zero Trust for AI Agents |
| 1,072 | Carmen Rincon (29,675) | 3.6% | P00 Bold declarative thesis, no other device | Hey everyone! If you're curious about Claude Design workflows, I'm sharing my personal workflow (part 1 & 2) now. |
| 1,072 | Suresh Srinivas (8,772) | 12.2% | P00 Bold declarative thesis, no other device | We are currently witnessing an AI "Gold Rush," with vendors of all stripes racing to add agentic capabilities |
| 1,067 | Sowmya Y (3,552) | 30.0% | P05 Contrarian reframe / myth-bust | Vectorless RAG is an interesting shift in how we think about retrieval. |
| 1,021 | Oron Gill Haus (47,589) | 2.1% | P14 Question or meme one-liner | The AI Coding Revolution Is Here, But Are We Testing for It? |
| 903 | Kalpit Jain (6,145) | 14.7% | P00 Bold declarative thesis, no other device | A simple trick to cut LLM API costs (without switching models!) |
| 856 | Santhosh Bandari (28,205) | 3.0% | P06 Number shock / ratio | Why 99% of GenAI Engineers Fail When Asked About LangChain, LangGraph & MLOps You can build a chatbot with LangChain. |
| 760 | Anthony Alcaraz (48,326) | 1.6% | P00 Bold declarative thesis, no other device | Agentic systems don't just benefit from Small Language Models. |
| 733 | Anil Inamdar (14,387) | 5.1% | P00 Bold declarative thesis, no other device | Building with GenAI in 2025? Your architecture will make—or break—your success. |
| 708 | Ben (Xiaojun) Li (35,672) | 2.0% | P09 Free resource drop | A 40+ hours of YouTube course on #LLM Reasoning Model. |
| 707 | Sumeet Agrawal (10,728) | 6.6% | P05 Contrarian reframe / myth-bust | Most people only see AI agents on the surface, but the real power lies deep in the stack. |
| 650 | Dileep Pandiya (22,110) | 2.9% | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | AI Agents vs RAG vs LLM Workflows — A Strategic Comparison for Modern AI Solutions |
| 629 | Juan Sequeda (22,262) | 2.8% | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone is building semantics for AI agents. I wonder if most are going to regret it. |
| 614 | Srini Tallapragada (16,060) | 3.8% | P14 Question or meme one-liner | How do you get all of your engineers using AI daily — without breaking everything? |
| 593 | Waseem Alshikh (17,482) | 3.4% | P00 Bold declarative thesis, no other device | As I’m sure everyone has been shouting from the rooftops, “2025 is the year of AI agents!”. |
| 559 | Vijayan Nagarajan (14,425) | 3.9% | P15 Career / jobs tension | 🚀 If you're entering an AI career right now, here's the truth: |
| 530 | Sinan Aral (17,733) | 3.0% | P10 News-jack | We just built a commercial grade RCT platform called Pairit |
| 522 | Dr. Dirk Alexander Molitor (15,171) | 3.4% | P00 Bold declarative thesis, no other device | Anthropic just stepped into engineering. |
| 518 | Angel Dimitrov (2,094) | 24.7% | P07 First-person proof / story | I think I just crossed a point of no return with AI-native development. |
| 513 | Cameron R. Wolfe (26,356) | 1.9% | P00 Bold declarative thesis, no other device | Many recent frontier LLMs like Grok-3 and DeepSeek-R1 use a Mixture-of-Experts (MoE) architecture. |
| 502 | Ivan Burazin (23,544) | 2.1% | P12 Explainer / definition | Introducing the AI Enablement Stack: A Comprehensive Mapping of 100+ Companies Shaping the Future of AI Development |
| 498 | Piyush Ranjan (31,665) | 1.6% | P11 "Everyone talks about X…" / shared confusion & overwhelm | Want to learn how to build AI Agents but feel overwhelmed? |
| 491 | Animesh Kumar (20,631) | 2.4% | P00 Bold declarative thesis, no other device | Every LLM already carries a latent ontology: a geometric map of how business concepts relate to each other, |
| 486 | Poornachandra Kongara (35,902) | 1.4% | P14 Question or meme one-liner | Are you using Claude AI fully or only scratching the surface? |
| 483 | Bahareh Jozranjbar (10,959) | 4.4% | P00 Bold declarative thesis, no other device | Agentic AI is quietly reshaping UX research and human factors. |
| 477 | Michał Choiński (12,053) | 4.0% | P10 News-jack | ChatGPT just launched Agent for Plus and Pro plans. |
| 473 | Sanjay Kumar Ph.D. (48,168) | 1.0% | P05 Contrarian reframe / myth-bust | Enterprise RAG is not “just vector search + LLM.” |
| 448 | Joe Bohman (7,125) | 6.3% | P00 Bold declarative thesis, no other device | The future of engineering is generative, intelligent, and deeply domain-aware. |
| 442 | Raman Walia (45,388) | 1.0% | P07 First-person proof / story | I'm working as a Software Engineer at Facebook (Meta) with over 20 years of experience. |
| 440 | Junhua Zhu (2,118) | 20.8% | P07 First-person proof / story | We built a GPT from scratch in 500 lines. |
| 438 | Bally S Kehal (23,326) | 1.9% | P05 Contrarian reframe / myth-bust | You don't have an AI agent problem. You have an architecture decision problem. |
| 432 | Sohrab Rahimi (24,541) | 1.8% | P00 Bold declarative thesis, no other device | Knowledge Graphs (KGs) have long been the unsung heroes behind technologies like search engines and recommendation syste |
| 414 | Abhishek Chandragiri (16,378) | 2.5% | P06 Number shock / ratio | How to Actually Become a "10x Developer" with AI |
| 405 | Edward Frank Morris (38,278) | 1.1% | P07 First-person proof / story | A few months ago, a colleague screamed at Microsoft Copilot like he was auditioning for Bring Me The Horizon. |

### 6d. Interpretation and recommended angle
**1. Why his AI listicles stall: he is competing in the most crowded lane against accounts 10–200× his size, and even they now get modest numbers there.**
- In the hub data, generic "AI agents / agentic AI explained" is the largest lane (§5) and has the weakest 2026 median of the major topics. Greg Coquillo (237,215 followers) has more verified posts in this lane than almost anyone, with a sample median of a few hundred reactions (§8).
- "Top AI tools" lists are the closest public analogue to the client's flops:
  - Greg Coquillo (237,215 followers), "Most people drown in the endless sea of new AI tools.": 447
  - Kumud Deepali Rudraraju (243,483), "There are hundreds of AI tools now.": 528
  - Anshuman Tiwari (82,964), "There are thousands of AI tools launching every week.": 283
- The giants' *typical* posts are small relative to their audience (table 6b, recent li_profile posts). Brij Kishore Pandey's recent median is 252 on 740k followers. Avi Chawla's is 86 on 177k. Armand Ruiz's is 46 on 207k, after his feed moved to employer product announcements; his earlier educational posts got 1,062–2,480. A listicle from a 13k account has no structural advantage in this lane.
- MagicPost (June 2026; 571 creators with ≥5k followers who post AI regularly) found:
  - The median AI post earns about 40 likes.
  - Posting AI content more often tends to lower a creator's median. Pascal Bornet posts 172 AI posts a year and sits 14% below his overall median. Ruben Hassid (188 AI posts a year) was excluded from the top 20 on this basis.
  - Creators whose feeds are mostly about something else ("tourists") earn an *AI premium*: up to +74% for Chris Donnelly, whose feed is 9% AI.
  - Engagement efficiency favours smaller accounts: Mati Staniszewski, 35k followers, has a 2.06% engagement rate.
  - Source: https://magicpost.in/blog/top-linkedin-creators-ai
  - **Implication:** a data engineer who posts AI *through a data lens*, as one part of a data-engineering feed, is the profile the study says earns the premium.

**2. What wins for small and mid-size accounts (verified). It's the same thing that wins for him: first-person, specific, insider.**
- **First-person insider proof:**
  - Chandrasekar Srinivasan (51,211 followers), "I spent 3+ hours in the last 2 weeks putting together this no-nonsense curriculum so you can break into AI as a software engineer in 2025.": 31,313 reactions, 758 comments. Image post with a flowchart, per li_post and the post text.
  - Terezija Semenski (34,133), "I taught myself machine learning > 10 years ago.": 3,578
  - Ravi Singh (44,774), "As a Team Lead at Google, I'm watching the engineering craft change faster than ever.": 1,346
  - Kateryna Stetsiuk (14,960), "I've interviewed around 150 candidates for ML/AI Engineer positions across various levels over the last 12 months.": 1,109
  - Ruchi Bhatia (101,014), "Two years ago, I presented my data science project to Jensen Huang.": 7,401
- **Contrarian takes about the data layer under AI (his home turf):**
  - Isin Pesch (5,601), "Everyone is selling the semantic layer as the way to make AI agents reliable on your data.": 1,369
  - Shobhit Tankha (8,296), "A lot of AI engineers (even sharp ones) get seduced by the cool factor of vector databases.": 1,551
  - Sowmya Y (3,552), "Vectorless RAG is an interesting shift in how we think about retrieval.": 1,067
  - Suresh Srinivas (8,772), "We are currently witnessing an AI 'Gold Rush'…": 1,072
  - Juan Sequeda (22,262), "Everyone is building semantics for AI agents. I wonder if most are going to regret it.": 629
  - Andreas Kretz (162,621; a data-engineering creator), "I thought my RAG project was solid until I saw how random the results really were...": 717
  - Andreas Horn (257,465), "The best thing you can do for your AI strategy in 2026 has nothing to do with AI. It is fixing your data.": 1,952 (his recent median is 262), and "Data governance is one of the most misunderstood topics in enterprise.": 1,944
- **Human-impact takes backed by evidence:** Jiunn-Tyng (Tyng) Yeh (4,105 followers), "People are suffering—yet many still deny that hours with ChatGPT reshape how we focus, create and critique.": 6,125 reactions, 456 comments.
- **Cost and efficiency engineering:**
  - Kalpit Jain (6,145), "A simple trick to cut LLM API costs (without switching models!)": 903
  - Andreas Horn, "…the same task costs $2.73 on one frontier model and $0.02 on another.": 838
  - Nikhil Kassetty (6,126), "Comparing JSON and TOON for Structured LLM Prompts": 378
- **Building in public:**
  - Junhua Zhu (2,118), "We built a GPT from scratch in 500 lines.": 440
  - Angel Dimitrov (2,094), "I think I just crossed a point of no return with AI-native development.": 518
  - Sandipan Bhaumik (27,548), "Claude Code Project Structure: Every File and Folder Explained": 2,239
  - Rakesh Gohel, "In the last 4 months, I've tried and tested 7 coding AI Agents": 1,731
  - Eduardo Ordax, "I've spent at least 60' every day … vibe coding on Claude Code": 2,590
- **His proven interview format travels.** Posts on the same LinkedIn "Tech Interview Preparation" hub (non-AI, but the identical mechanic):
  - Izmah Khan (8,038 followers), "Today, I witnessed my team lead interviewing a Full-Stack Web Developer with 2 years of experience,": 23,549 reactions, 1,610 comments
  - Alejandro R. (11,198), "I can tell in 5 minutes during an interview if someone understands data": 2,342
  - Rajya Vardhan Mishra (120,968), "In the last 15 years, I have interviewed 800+ Software Engineers…": 9,286
  - Harshit Sharma (82,026), "After taking 75 Software Engineer interviews at Google in < 7 months,": 6,081
  - Interview posts with an AI twist also work: Kateryna Stetsiuk 1,109 (above); Manish Mazumder (72,011), "As an ML Engineer I get maximum questions asked from NLP, Gen AI and LLMs.": 1,060; Kumud Deepali Rudraraju, "Most candidates are still preparing for interviews from the last hiring cycle.": 638; Daniel Lee (159,310), "Chatted with AI tech leads hiring AI engineers. Here's the stack they look for in interviews ↓": 585

**3. The AI angle a data engineer can own: "AI is a data problem. Here's what it looks like from inside the pipelines."**

No giant in this dataset owns the data-engineer-for-AI lane. Brij Kishore Pandey's headline mentions Data Engineering, but his verified hits are generic agent/RAG explainers. Zach Wilson (533,180 followers), the biggest data-engineering creator in the data, has one verified AI post: "AI Engineering has four levels to it!" (518). Recommended lanes, each with verified precedent above:
1. **AI interview stories for data roles.** Take his best format and add AI. "I interviewed 40 data engineers this year. The AI questions changed completely." / "A candidate used Copilot in a live SQL round. Here's what happened." (Precedent: Kateryna Stetsiuk, Manish Mazumder, Izmah Khan.)
2. **"Your AI problem is a data problem."** RAG quality is retrieval and data quality. Agent memory is a data model. Semantic layers and data contracts for agents. Vector DB vs Postgres. (Precedent: Isin Pesch, Shobhit Tankha, Sowmya Y, Andreas Horn "fixing your data", Andreas Kretz.)
3. **Real builds with receipts.** "I put an LLM step into our production pipeline for 30 days. The bill, the failures, the fix." Show screenshots of the DAG, the cost dashboard and the eval table. (Precedent: Kalpit Jain, Junhua Zhu, Rakesh Gohel's "tried and tested 7 coding AI agents", Eduardo Ordax's Claude Code diary.)
4. **Career moves from data into AI**, told first-person. What transferred, what didn't, what the new role pays and asks. (Precedent: Rohit Ghumare (56,974 followers), "I moved from DevOps into AI-native infrastructure. Here is what I would learn first:" at 1,488, the same move from an adjacent infra role; Terezija Semenski; Chandrasekar Srinivasan; Ravi Singh; Shivani Virdi's "I taught myself AI engineering from scratch … got promoted at Microsoft" at 550.)
5. **News-jacks with a data lens.** When a new AI concept drops (as Jev, TOON and loop engineering did), explain it as "X vs the thing data engineers already know". (Precedent: Avi Chawla's "RAG vs. Jev + RAG" at about 30× his median; Steve Nouri's TOON post at 4,813.)

**What to stop:** generic tool lists, "AI agents explained" infographics, and reposted cheat sheets with no first-person stake. In this data they work only for accounts that already have hundreds of thousands of followers, and even those accounts' recent medians are 46–736 reactions.

---

## 7. Swipe file: top 80 verified hooks from AI creators (max 5 per creator)

| # | Reactions | Comments | Author (followers) | Media | Age (mo) | Hook pattern | Hook (first line/s) | URL |
|---|---|---|---|---|---|---|---|---|
| 1 | 31,313 | 758 | Chandrasekar Srinivasan (51,211) | image | 14.9 | P07 First-person proof / story | I spent 3+ hours in the last 2 weeks putting together this no-nonsense curriculum | https://www.linkedin.com/feed/update/urn:li:activity:7351616833126285312 |
| 2 | 21,964 | 851 | Andrew Ng (2,656,041) | text-only | 11.0 | P07 First-person proof / story | I recently received an email titled “An 18-year-old’s dilemma: Too late to contribute to AI?” | https://www.linkedin.com/feed/update/urn:li:activity:7394769800234766336 |
| 3 | 21,100 | 532 | Andrew Ng (2,656,041) | video | 12.2 | P02 Personal announcement / launch / milestone | Announcing my new course: Agentic AI! / Building AI agents is one of the most in-demand skills in the job market. | https://www.linkedin.com/posts/andrewyng_announcing-my-new-course-agentic-ai-building-activity-7381380126317404160-wW75 |
| 4 | 17,683 | 597 | Andrew Ng (2,656,045) | n/a | 10 | P09 Free resource drop | Releasing a new "Agentic Reviewer" for research papers. / I started coding this as a weekend project, and Yixing J. made it much better. | https://www.linkedin.com/posts/andrewyng_releasing-a-new-agentic-reviewer-for-research-activity-7398773018317074432-vMct |
| 5 | 12,946 | 422 | Andrew Ng (2,656,046) | n/a | 12 | P00 Bold declarative thesis, no other device | The buzz over DeepSeek this week crystallized, for many people, a few important trends... | https://www.linkedin.com/feed/update/urn:li:activity:7290799617779085312 |
| 6 | 12,268 | 429 | Alex Wang (1,185,102) | image | 25.0 | P14 Question or meme one-liner | Funny... but how true is it? | https://www.linkedin.com/posts/alexwang2911_programming-artificialintelligence-technology-activity-7241033721120743424-KsMm |
| 7 | 10,502 | 261 | Raj Abhijit Dandekar (160,775) | image | 21.4 | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone interacts with ChatGPT. But can you build it from scratch? | https://www.linkedin.com/feed/update/urn:li:activity:7280100124968566785 |
| 8 | 9,290 | 377 | Alex Xu (1,036,872) | image | 15.6 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | RAG vs Agentic RAG / RAG (Retrieval Augmented Generation) is a method that combines information retrieval with large language | https://www.linkedin.com/posts/alexxubyte_systemdesign-coding-interviewtips-activity-7344040591753678849-j-6J |
| 9 | 9,216 | 613 | Andrew Ng (2,656,038) | image | 3.5 | P10 News-jack | “Loop engineering” is a hot buzzphrase after mentions of it by Boris Cherny (Claude Code’s creator) | https://www.linkedin.com/feed/update/urn:li:activity:7477753883768029185 |
| 10 | 8,220 | 262 | Brij Kishore Pandey (740,430) | image | 19.0 | P04 Shift / evolution / "the era of X" | Agentic AI is a paradigm shift where AI models learn, plan, and execute tasks autonomously... | https://www.linkedin.com/feed/update/urn:li:activity:7306275434969649152 |
| 11 | 7,924 | 206 | Alex Xu (1,036,872) | image | 19.6 | P08 Roadmap / learning path / "If you're getting started" | The Generative AI Learning Roadmap / Generative AI is a type of AI that can create new content based on what it has learned from existing knowledge. | https://www.linkedin.com/posts/alexxubyte_systemdesign-coding-interviewtips-activity-7300194175021400066-SY3c |
| 12 | 7,401 | 70 | Ruchi Bhatia (101,014) | image | 11.5 | P07 First-person proof / story | Two years ago, I presented my data science project to Jensen Huang. | https://www.linkedin.com/feed/update/urn:li:activity:7389171665210925056 |
| 13 | 7,327 | 156 | Brij Kishore Pandey (740,429) | image | 19.0 | P04 Shift / evolution / "the era of X" | 𝗧𝗵𝗲 𝗔𝗜 𝗔𝗴𝗲𝗻𝘁𝘀 𝗦𝘁𝗮𝗶𝗿𝗰𝗮𝘀𝗲 represents the 𝘀𝘁𝗿𝘂𝗰𝘁𝘂𝗿𝗲𝗱 𝗲𝘃𝗼𝗹𝘂𝘁𝗶𝗼𝗻 from passive AI models to fully autonomous systems. | https://www.linkedin.com/feed/update/urn:li:activity:7306637799196119040 |
| 14 | 6,601 | 193 | Sebastian Raschka (271,272) | n/a | 7 | P00 Bold declarative thesis, no other device | I put together a new LLM Architecture Gallery that collects the architecture figures I shared over the months | https://www.linkedin.com/feed/update/urn:li:activity:7438933573891649536 |
| 15 | 6,574 | 347 | Manthan Patel (180,568) | image | 16.4 | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone's building AI agents, but few understand the Agentic frameworks that power them. | https://www.linkedin.com/feed/update/urn:li:activity:7334812927717175296 |
| 16 | 6,492 | 291 | Addy Osmani (305,258) | image | 17.8 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | Vibe Coding !== Low Quality Work: a guide to responsible AI-assisted dev | https://www.linkedin.com/feed/update/urn:li:activity:7319245879943512064 |
| 17 | 6,129 | 279 | Aishwarya Srinivasan (653,248) | image | 14.4 | P11 "Everyone talks about X…" / shared confusion & overwhelm | If you're feeling overwhelmed with how fast AI is evolving, you're not alone. | https://www.linkedin.com/feed/update/urn:li:activity:7357445028295729154 |
| 18 | 6,125 | 238 | Manthan Patel (180,568) | image | 19.2 | P04 Shift / evolution / "the era of X" | Use this Super Simple Post to Understand the Evolution of AI Agents in 6 Key Phases. | https://www.linkedin.com/feed/update/urn:li:activity:7303646570594361344 |
| 19 | 6,125 | 456 | Jiunn-Tyng (Tyng) Yeh (4,105) | n/a | 12 | P00 Bold declarative thesis, no other device | People are suffering—yet many still deny that hours with ChatGPT reshape how we focus, create and critique. | https://www.linkedin.com/feed/update/urn:li:activity:7339320656062312450 |
| 20 | 5,831 | 211 | Andreas Horn (257,465) | image | 15.4 | P09 Free resource drop | Blueprint for how banks can actually extract real value from AI: | https://www.linkedin.com/feed/update/urn:li:activity:7346163584348884994 |
| 21 | 5,784 | 187 | Brij Kishore Pandey (740,429) | image | 18.3 | P04 Shift / evolution / "the era of X" | We’re witnessing a shift from static models to AI agents that can think, reason, and act | https://www.linkedin.com/feed/update/urn:li:activity:7314247940863057920 |
| 22 | 5,745 | 295 | Andreas Horn (257,466) | n/a | 12 | P12 Explainer / definition | 𝗧𝗵𝗶𝘀 𝗶𝘀 𝗵𝗮𝗻𝗱𝘀 𝗱𝗼𝘄𝗻 𝗼𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗕𝗘𝗦𝗧 𝘃𝗶𝘀𝘂𝗮𝗹𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗼𝗳 𝗵𝗼𝘄 𝗟𝗟𝗠𝘀 𝗮𝗰𝘁𝘂𝗮𝗹𝗹𝘆 𝘄𝗼𝗿𝗸. | https://www.linkedin.com/feed/update/urn:li:activity:7347531690912669697 |
| 23 | 5,734 | 162 | Manthan Patel (180,568) | n/a | 12 | P12 Explainer / definition | How Do AI Agents Work? The diagram below illustrates the core architecture of AI agents. | https://www.linkedin.com/posts/leadgenmanthan_how-do-ai-agents-work-the-diagram-below-activity-7286619276130611201-lXDK |
| 24 | 5,644 | 209 | Rakesh Gohel (170,229) | image | 14.7 | P06 Number shock / ratio | AI Agents are about 90% Software engineering and only 10% AI | https://www.linkedin.com/feed/update/urn:li:activity:7353405600610881536 |
| 25 | 5,450 | 232 | Eduardo Ordax (254,031) | n/a | 3 | P10 News-jack | A Netflix engineer just shipped something amazing! | https://www.linkedin.com/feed/update/urn:li:activity:7473461554361962498 |
| 26 | 5,392 | 338 | Ethan Mollick (436,357) | n/a | 12 | P09 Free resource drop | In our new paper we ran an experiment at Procter and Gamble with 776 experienced professionals solving real business… | https://www.linkedin.com/feed/update/urn:li:activity:7309212044812038144 |
| 27 | 5,318 | 254 | Lior Alexander (211,048) | image | 9.1 | P10 News-jack | You can now run 70B LLMs on a 4GB GPU. AirLLM just made massive models usable on low-memory hardware. | https://www.linkedin.com/feed/update/urn:li:activity:7415709234442588160 |
| 28 | 4,890 | 226 | Pascal Bornet (1,542,889) | image | 1.7 | P05 Contrarian reframe / myth-bust | IKEA automated the task, not the people. | https://www.linkedin.com/feed/update/urn:li:activity:7496853685894045696 |
| 29 | 4,813 | 346 | Steve Nouri (1,738,269) | image | 11.1 | P10 News-jack | 🚀 This is great! Meet TOON - the new language for talking to LLMs efficiently. | https://www.linkedin.com/feed/update/urn:li:activity:7394385948760801280 |
| 30 | 4,725 | 248 | Alexandre Kantjas (40,876) | image | 17.9 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | Automation, AI workflow, or AI agent? | https://www.linkedin.com/feed/update/urn:li:activity:7318265649863045120 |
| 31 | 4,561 | 178 | Andreas Horn (257,465) | image | 18.9 | P14 Question or meme one-liner | 𝗢𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗠𝗢𝗦𝗧 𝗱𝗶𝘀𝗰𝘂𝘀𝘀𝗲𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻: 𝗛𝗼𝘄 𝘁𝗼 𝗽𝗶𝗰𝗸 𝘁𝗵𝗲 𝗿𝗶𝗴𝗵𝘁 𝗟𝗟𝗠 𝗳𝗼𝗿 𝘆𝗼𝘂𝗿 𝘂𝘀𝗲 𝗰𝗮𝘀𝗲? | https://www.linkedin.com/feed/update/urn:li:activity:7306961323286827008 |
| 32 | 4,537 | 154 | Alex Wang (1,185,102) | image | 12.7 | P15 Career / jobs tension | "Which AI role suits you?" An interesting matrix, and I like the idea. | https://www.linkedin.com/feed/update/urn:li:activity:7376152942187425792 |
| 33 | 4,501 | 120 | Brij Kishore Pandey (740,430) | image | 4.9 | P05 Contrarian reframe / myth-bust | 𝗡𝗮𝗶𝘃𝗲 𝗥𝗔𝗚 𝘄𝗼𝗿𝗸𝘀 𝗶𝗻 𝗮 𝗱𝗲𝗺𝗼. | https://www.linkedin.com/feed/update/urn:li:activity:7461614868157222912 |
| 34 | 4,477 | 192 | Addy Osmani (305,258) | document/carousel | 3.9 | P09 Free resource drop | Google published a free ~50 page whitepaper on the new SDLC with Vibe Coding & Agentic Engineering! | https://www.linkedin.com/feed/update/urn:li:activity:7472535945221783552 |
| 35 | 4,433 | 85 | Sebastian Raschka (271,271) | image | 15.1 | P10 News-jack | The newly released 1-trillion-parameter Kimi K2 LLM takes the crown as the best available open-weight model. | https://www.linkedin.com/feed/update/urn:li:activity:7349829221013180416 |
| 36 | 4,279 | 124 | Brij Kishore Pandey (740,429) | image | 14.2 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | LLM ≠ Generative AI ≠ AI Agents ≠ Agentic AI | https://www.linkedin.com/feed/update/urn:li:activity:7359988910942236672 |
| 37 | 4,192 | 108 | Avi Chawla (177,132) | image | 15.6 | P06 Number shock / ratio | 10 GitHub repos to build a career in AI engineering: (100% free step-by-step roadmap) | https://www.linkedin.com/posts/avi-chawla_10-github-repos-to-build-a-career-in-ai-engineering-activity-7343925733104181249-VWAw |
| 38 | 4,083 | 177 | Rakesh Gohel (170,229) | image | 16.8 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | Most still think that AI Agents and Agentic AI are the same thing / But both are entirely different architectures, let me explain... | https://www.linkedin.com/posts/rakeshgohel01_most-still-think-that-ai-agents-and-agentic-activity-7330934143326781440-vn67 |
| 39 | 3,776 | 164 | Alex Wang (1,185,101) | document/carousel | 18.9 | P05 Contrarian reframe / myth-bust | AI agents are more than just LLMs. | https://www.linkedin.com/feed/update/urn:li:activity:7307447983078264832 |
| 40 | 3,736 | 76 | Victoria Slocum (49,011) | image | 18.8 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | What's the difference between just AI and truly agentic workflows? | https://www.linkedin.com/feed/update/urn:li:activity:7308440988744634369 |
| 41 | 3,654 | 219 | Alex Wang (1,185,102) | image | 22.0 | P05 Contrarian reframe / myth-bust | You don't become an AI professional by using AI tools, or taking an AI course. | https://www.linkedin.com/feed/update/urn:li:activity:7273275461927903233 |
| 42 | 3,614 | 142 | Alex Wang (1,185,101) | image | 7.2 | P00 Bold declarative thesis, no other device | Agent memory has quickly become one of the most discussed topics in AI. | https://www.linkedin.com/feed/update/urn:li:activity:7436742607344455680 |
| 43 | 3,578 | 339 | Terezija Semenski (34,133) | image | 15.0 | P07 First-person proof / story | I taught myself machine learning > 10 years ago. | https://www.linkedin.com/feed/update/urn:li:activity:7350848814192234496 |
| 44 | 3,527 | 128 | Alex Xu (1,036,872) | image | 15.5 | P12 Explainer / definition | What is an AI Agent? / An AI agent is a software program that can interact with its environment, gather data, and use that data... | https://www.linkedin.com/posts/alexxubyte_systemdesign-coding-interviewtips-activity-7345117017508659200-1dyv |
| 45 | 3,383 | 97 | Elvis S. (95,181) | image | 16.9 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | 🌟 New Paper: AI Agents vs. Agentic AI Interesting paper summarizing distinctions between AI Agents and Agentic AI. | https://www.linkedin.com/feed/update/urn:li:activity:7329585346051018753 |
| 46 | 3,361 | 489 | Eduardo Ordax (254,031) | image | 0.1 | P02 Personal announcement / launch / milestone | Big Annoucement!!!! / Today is probably one of the most special days of my professional life!! | https://www.linkedin.com/posts/eordax_career-ai-activity-7515341637405786112-bpww |
| 47 | 3,280 | 132 | Aishwarya Srinivasan (653,248) | image | 15.6 | P08 Roadmap / learning path / "If you're getting started" | If you're an AI engineer trying to understand and build with GenAI, RAG (Retrieval-Augmented Generation) is one of the most essential components to ma | https://www.linkedin.com/feed/update/urn:li:activity:7343658184168894464 |
| 48 | 3,141 | 85 | Alex Xu (1,036,872) | image | 3.7 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | RAG vs Graph RAG vs Agentic RAG / RAG connects LLMs to your data and there are three different ways to do it. | https://www.linkedin.com/feed/update/urn:li:activity:7475575251855126528 |
| 49 | 3,113 | 330 | Henry Shi (81,188) | image | 20.1 | P07 First-person proof / story | I tried EVERY major AI Coding tool so you don’t have to. | https://www.linkedin.com/feed/update/urn:li:activity:7295132016201588736 |
| 50 | 3,052 | 66 | Sebastian Raschka (271,271) | image | 12.0 | P12 Explainer / definition | Multi-Head Attention (MHA) is the engine of LLMs. | https://www.linkedin.com/feed/update/urn:li:activity:7383510781717487616 |
| 51 | 2,939 | 428 | Pascal Bornet (1,542,890) | image | 5.3 | P05 Contrarian reframe / myth-bust | Brutal career truth in the age of AI: knowledge alone is no longer enough. | https://www.linkedin.com/feed/update/urn:li:activity:7457353422174957568 |
| 52 | 2,895 | 158 | Pallavi Ahuja (107,753) | image | 14.6 | P05 Contrarian reframe / myth-bust | Built for those serious about doing AI, not just talking about it. | https://www.linkedin.com/feed/update/urn:li:activity:7355086132688109568 |
| 53 | 2,879 | 179 | Andreas Horn (257,466) | image | 3.8 | P00 Bold declarative thesis, no other device | Humans keep inventing new ways to 'measure' how busy software teams are | https://www.linkedin.com/feed/update/urn:li:activity:7473608682744942592 |
| 54 | 2,862 | 66 | Sebastian Raschka (271,271) | image | 12.5 | P00 Bold declarative thesis, no other device | Evaluating reasoning models is non-trivial. | https://www.linkedin.com/feed/update/urn:li:activity:7378061426738909184 |
| 55 | 2,797 | 69 | Alex Xu (1,036,872) | n/a | 12 | P09 Free resource drop | 🚀 New Launch: Become an AI Engineer / Learn by Doing / Cohort Based Course | https://www.linkedin.com/posts/alexxubyte_ai-aiengineer-machinelearning-activity-7374107635442438144-oI8n |
| 56 | 2,782 | 128 | Andreas Horn (257,465) | image | 14.6 | P08 Roadmap / learning path / "If you're getting started" | Microsoft just released a full-blown curriculum on GenAI — for free. | https://www.linkedin.com/feed/update/urn:li:activity:7355130206241619968 |
| 57 | 2,738 | 342 | Clare Kitching (90,950) | image | 7.8 | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone talks about AI models. Very few talk about AI systems. | https://www.linkedin.com/feed/update/urn:li:activity:7430887762578460672 |
| 58 | 2,590 | 123 | Eduardo Ordax (254,031) | image | 6.7 | P07 First-person proof / story | I've spent at least 60' every day for the last couple of months vibe coding on Claude Code... | https://www.linkedin.com/feed/update/urn:li:activity:7441953754859356160 |
| 59 | 2,559 | 92 | Avi Chawla (177,132) | image | 0.2 | P03 Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." | RAG vs. Jev + RAG, clearly explained: / In a standard RAG setup, documents are split into chunks, converted into embeddings, and stored in a vector DB | https://www.linkedin.com/posts/avi-chawla_rag-vs-jev-rag-clearly-explained-in-activity-7513547219438952449-wTnj |
| 60 | 2,480 | 207 | Armand Ruiz (207,751) | image | 15.4 | P11 "Everyone talks about X…" / shared confusion & overwhelm | Everyone's suddenly talking about Context Engineering. Here's why it matters. | https://www.linkedin.com/feed/update/urn:li:activity:7346130792151961602 |
| 61 | 2,433 | 83 | Sebastian Raschka (271,272) | n/a | 12 | P10 News-jack | I just published a new tutorial article explaining how KV caching works in LLMs, both conceptually and in code... | https://www.linkedin.com/feed/update/urn:li:activity:7340724707970715648 |
| 62 | 2,397 | 285 | Ruben Hassid (944,807) | image | 6.0 | P05 Contrarian reframe / myth-bust | Prompting is the weakest way to use Claude. | https://www.linkedin.com/feed/update/urn:li:activity:7449773533049679872 |
| 63 | 2,390 | 248 | Ruben Hassid (944,808) | image | 17.3 | P01 Copy-paste prompt / tool hack | This is my favorite ChatGPT prompt hack. Copy & paste it (after clicking "...more"): | https://www.linkedin.com/posts/ruben-hassid_this-is-my-favorite-chatgpt-prompt-hack-activity-7324749642196221954-G2aF |
| 64 | 2,356 | 31 | Hao Hoang (73,963) | n/a | 7 | P12 Explainer / definition | Most engineers say they 'understand LLMs.' | https://www.linkedin.com/feed/update/urn:li:activity:7439165002730844160 |
| 65 | 2,314 | 283 | Ruben Hassid (944,811) | image | 0.1 | P01 Copy-paste prompt / tool hack | Google your name. Now imagine your ex doing it. / Four prompts erase what they'd find (for $0): | https://www.linkedin.com/posts/ruben-hassid_google-your-name-now-imagine-your-ex-doing-activity-7515275262348066816-Ilep |
| 66 | 2,304 | 40 | Julio Casal (80,283) | image | 6.6 | P05 Contrarian reframe / myth-bust | Claude Code doesn't make you faster. Directing it does. | https://www.linkedin.com/feed/update/urn:li:activity:7442552119913713664 |
| 67 | 2,300 | 419 | Ruben Hassid (944,808) | document/carousel | 43.0 | P01 Copy-paste prompt / tool hack | You tried the ChatGPT hype. You spent hours learning how to prompt. And then you stopped using the GPT thing. / I feel you. So I made 1 prompt… ...to  | https://www.linkedin.com/posts/ruben-hassid_chatgpt-1-prompt-to-create-every-prompt-activity-7041452608632315904-8p6n |
| 68 | 2,239 | 162 | Sandipan Bhaumik (27,548) | image | 6.4 | P12 Explainer / definition | Claude Code Project Structure: Every File and Folder Explained | https://www.linkedin.com/feed/update/urn:li:activity:7445009592637476864 |
| 69 | 2,196 | 248 | Pascal Bornet (1,542,890) | video | 5.9 | P05 Contrarian reframe / myth-bust | AI is not about apps… and it's definitely not about prompts. | https://www.linkedin.com/feed/update/urn:li:activity:7450407899065012224 |
| 70 | 2,144 | 159 | Addy Osmani (305,258) | image | 5.3 | P00 Bold declarative thesis, no other device | Cognitive Surrender is how engineers quietly accumulate comprehension debt | https://www.linkedin.com/feed/update/urn:li:activity:7457678048948064256 |
| 71 | 2,137 | 189 | Ruben Hassid (944,810) | image | 2.8 | P01 Copy-paste prompt / tool hack | I wrote these 6 Claude formulas for my team. Nobody's allowed to skip them (including you): | https://www.linkedin.com/feed/update/urn:li:activity:7484562689374199808 |
| 72 | 2,094 | 236 | Rakesh Gohel (170,230) | n/a | 4 | P05 Contrarian reframe / myth-bust | Vector databases just became optional for AI agents. | https://www.linkedin.com/feed/update/urn:li:activity:7470454705895235584 |
| 73 | 2,079 | 176 | Pascal Bornet (1,542,889) | video | 13.0 | P14 Question or meme one-liner | What if the future of IT wasn't about resolving tickets… but eliminating them altogether? | https://www.linkedin.com/feed/update/urn:li:activity:7373309645290889216 |
| 74 | 2,070 | 392 | Pascal Bornet (1,542,890) | n/a | 2 | P15 Career / jobs tension | The forecast was that AI would shrink the workforce. | https://www.linkedin.com/feed/update/urn:li:activity:7483458707108958208 |
| 75 | 2,052 | 246 | Rock Lambros (24,174) | image | 9.9 | P11 "Everyone talks about X…" / shared confusion & overwhelm | AI security/securing the use of AI is going to kill me. | https://www.linkedin.com/feed/update/urn:li:activity:7407423157445287937 |
| 76 | 2,013 | 55 | Elvis S. (95,182) | n/a | 1 | P09 Free resource drop | Another banger paper from Google. If you build memory for long-horizon agents, this one is worth your time. (bookmark it) | https://www.linkedin.com/feed/update/urn:li:activity:7503521127185526784 |
| 77 | 2,008 | 137 | Aishwarya Srinivasan (653,248) | image | 14.3 | P05 Contrarian reframe / myth-bust | Most people think RAG is just “vector DB + LLM.” | https://www.linkedin.com/feed/update/urn:li:activity:7358891950302818305 |
| 78 | 1,980 | 285 | Alex Banks (203,017) | image | 14.9 | P05 Contrarian reframe / myth-bust | Your AI company is just a wrapper. | https://www.linkedin.com/feed/update/urn:li:activity:7351219485665554432 |
| 79 | 1,962 | 79 | Sarveshwaran Rajagopal (56,214) | image | 8.1 | P05 Contrarian reframe / myth-bust | Stop treating LLMs like they are the entire AI solution. | https://www.linkedin.com/feed/update/urn:li:activity:7426837338963599360 |
| 80 | 1,951 | 146 | Armand Ruiz (207,751) | n/a | — | P09 Free resource drop | Guide to Building an AI Agent | https://www.linkedin.com/feed/update/urn:li:activity:7292512309300576256 |

---

## 8. Appendix: every AI creator with a verified ≥100-reaction post

| Creator | Handle | Followers | Region (LinkedIn subdomain) | Recent median (li_profile) | Verified-sample median (n) | Best verified | Media seen | Top hook types |
|---|---|---|---|---|---|---|---|---|
| Andrew Ng | andrewyng | 2,656,052 | www (US/unspecified) | — | 4,615 (14) | 21,964 | image 4, video 1, text-only 1 | News-jack; First-person proof / story |
| Steve Nouri | stevenouri | 1,738,269 | Singapore | — | 4,813 (1) | 4,813 | image 1 | News-jack |
| Allie K. Miller | alliekmiller | 1,677,750 | www (US/unspecified) | — | 982 (8) | 1,809 | video 1, image 1 | Bold declarative thesis, no other device; First-person proof / story |
| Pascal Bornet | pascalbornet | 1,542,892 | www (US/unspecified) | — | 2,070 (9) | 4,890 | image 2, video 2 | Contrarian reframe / myth-bust; Bold declarative thesis, no other device |
| Alex Wang | alexwang2911 | 1,185,102 | Australia | — | 3,014 (13) | 12,268 | image 4, document/carousel 1 | Bold declarative thesis, no other device; Contrarian reframe / myth-bust |
| Alex Xu | alexxubyte | 1,036,872 | www (US/unspecified) | 736 (n=7) | 1,057 (13) | 9,290 | image 8 | Bold declarative thesis, no other device; Explainer / definition |
| Ruben Hassid | ruben-hassid | 944,811 | Israel | 285 (n=9) | 1,010 (17) | 2,397 | image 8, document/carousel 2 | Copy-paste prompt / tool hack; Contrarian reframe / myth-bust |
| Brij Kishore Pandey | brijpandeyji | 740,434 | www (US/unspecified) | 252 (n=7) | 1,381 (45) | 8,220 | image 8 | Contrarian reframe / myth-bust; Shift / evolution / "the era of X" |
| Aishwarya Srinivasan | aishwarya-srinivasan | 653,254 | www (US/unspecified) | — | 539 (21) | 6,129 | image 4 | Roadmap / learning path / "If you're getting started"; Bold declarative thesis, no other device |
| Vaibhav Sisinty | vaibhavsisinty | 602,393 | India | 411 (n=7) | 342 (6) | 823 | image 2 | News-jack; Number shock / ratio |
| Zach Wilson | — | 533,206 | — | — | 1,106 (2) | 1,695 | — | Roadmap / learning path / "If you're getting started" |
| Sharan Hegde | — | 528,287 | — | — | 1,294 (1) | 1,294 | — | Career / jobs tension |
| Ethan Mollick | — | 436,357 | — | — | 5,392 (1) | 5,392 | — | Free resource drop |
| Aakash Gupta | — | 324,210 | — | — | 708 (3) | 1,144 | — | Free resource drop; Bold declarative thesis, no other device |
| Addy Osmani | addyosmani | 305,260 | www (US/unspecified) | — | 1,622 (9) | 6,492 | image 2, document/carousel 1 | Bold declarative thesis, no other device; Free resource drop |
| Venkata Naga Sai Kumar Bysani | — | 274,586 | — | — | 575 (2) | 691 | — | Number shock / ratio; Free resource drop |
| Sebastian Raschka | sebastianraschka | 271,272 | www (US/unspecified) | — | 2,862 (7) | 6,601 | image 3 | News-jack; Bold declarative thesis, no other device |
| Priyanka SG | — | 265,895 | — | — | 233 (1) | 233 | — | Career / jobs tension |
| Charlie Hills | charlie-hills | 258,631 | UK | — | 1,111 (1) | 1,111 | document/carousel 1 | Copy-paste prompt / tool hack |
| Andreas Horn | andreashorn1 | 257,466 | Spain | 262 (n=9) | 1,727 (29) | 5,831 | image 7 | Bold declarative thesis, no other device; Contrarian reframe / myth-bust |
| Eduardo Ordax | eordax | 254,031 | Spain | 94 (n=7) | 334 (10) | 5,450 | image 5 | Question or meme one-liner; First-person proof / story |
| Kumud Deepali Rudraraju | — | 243,483 | — | — | 638 (3) | 1,340 | — | Contrarian reframe / myth-bust; "Everyone talks about X…" / shared confusion & overwhelm |
| Usman Asif | — | 241,889 | — | — | 560 (1) | 560 | — | First-person proof / story |
| Nikki Siapno | nikkisiapno | 237,849 | — | — | 275 (1) | 275 | video 1 | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Greg Coquillo | greg-coquillo | 237,216 | www (US/unspecified) | — | 413 (31) | 1,864 | image 1 | Contrarian reframe / myth-bust; Bold declarative thesis, no other device |
| Vin Vashishta | — | 212,484 | — | — | 344 (2) | 427 | — | Number shock / ratio |
| Lior Alexander | lioralex | 211,048 | www (US/unspecified) | — | 2,840 (2) | 5,318 | image 1 | News-jack; Bold declarative thesis, no other device |
| Armand Ruiz | armand-ruiz | 207,751 | www (US/unspecified) | 46 (n=7) | 53 (11) | 2,480 | image 1 | Free resource drop; Shift / evolution / "the era of X" |
| Alex Banks | a-banks | 203,017 | UK | — | 1,429 (2) | 1,980 | image 1 | Contrarian reframe / myth-bust; News-jack |
| Pooja Jain | — | 198,997 | — | — | 219 (1) | 219 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Vishakha Sadhwani | — | 191,507 | — | — | 634 (3) | 1,331 | — | Bold declarative thesis, no other device; Free resource drop |
| Aurimas Griciūnas | — | 188,666 | — | — | 569 (4) | 1,328 | — | Bold declarative thesis, no other device; Explainer / definition |
| Akshay Pachaar | akshay-pachaar | 182,375 | — | — | 269 (1) | 269 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Manthan Patel | leadgenmanthan | 180,568 | www (US/unspecified) | — | 5,929 (4) | 6,574 | image 2 | "Everyone talks about X…" / shared confusion & overwhelm; Shift / evolution / "the era of X" |
| Avi Chawla | avi-chawla | 177,132 | India | 86 (n=8) | 86 (8) | 4,192 | image 3 | Number shock / ratio; Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Aditya Sharma | — | 174,716 | — | — | 1,182 (1) | 1,182 | — | Roadmap / learning path / "If you're getting started" |
| Ravit Jain | — | 172,288 | — | — | 257 (5) | 300 | — | Roadmap / learning path / "If you're getting started"; "Everyone talks about X…" / shared confusion & overwhelm |
| Rakesh Gohel | rakeshgohel01 | 170,230 | Canada | — | 1,843 (7) | 5,644 | image 4 | Contrarian reframe / myth-bust; Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Andreas Kretz | — | 162,621 | — | — | 717 (1) | 717 | — | First-person proof / story |
| Raj Abhijit Dandekar | raj-abhijit-dandekar-67a33118a | 160,775 | India | — | 10,502 (1) | 10,502 | image 1 | "Everyone talks about X…" / shared confusion & overwhelm |
| Daniel Lee | — | 159,310 | — | — | 585 (1) | 585 | — | Explainer / definition |
| Morgan DeBaun | — | 157,042 | — | — | 230 (1) | 230 | — | Bold declarative thesis, no other device |
| Gabriel Millien | — | 155,567 | — | — | 688 (4) | 1,022 | — | Contrarian reframe / myth-bust; Free resource drop |
| Anjali Viramgama | — | 149,765 | — | — | 249 (2) | 308 | — | Bold declarative thesis, no other device; Roadmap / learning path / "If you're getting started" |
| Paolo Perrone | — | 140,194 | — | — | 1,719 (1) | 1,719 | — | First-person proof / story |
| Shalini Goyal | goyalshalini | 135,244 | — | — | 269 (1) | 269 | — | Explainer / definition |
| Aishwarya Naresh Reganti | — | 130,829 | — | — | 57 (3) | 370 | — | Free resource drop |
| Divyanshi Sharma | — | 127,504 | — | — | 1,435 (1) | 1,435 | — | Contrarian reframe / myth-bust |
| Priyanka Vergadia | — | 121,387 | — | — | 186 (2) | 223 | — | Contrarian reframe / myth-bust; Roadmap / learning path / "If you're getting started" |
| T. Scott Clendaniel | — | 120,934 | — | — | 282 (1) | 282 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Shubham Saboo | shubhamsaboo | 118,658 | www (US/unspecified) | — | 356 (1) | 356 | image 1 | Free resource drop |
| Jhankar Mahbub | — | 112,951 | — | — | 420 (1) | 420 | — | First-person proof / story |
| Luís Rodrigues | lfrodrigues | 112,119 | UAE | — | 538 (1) | 538 | image 1 | Contrarian reframe / myth-bust |
| Pallavi Ahuja | progressivethinker | 107,753 | India | — | 2,895 (1) | 2,895 | image 1 | Contrarian reframe / myth-bust |
| Pavan Belagatti | — | 104,641 | — | — | 452 (2) | 707 | — | Roadmap / learning path / "If you're getting started"; Explainer / definition |
| Ruchi Bhatia | ruchi798 | 101,014 | www (US/unspecified) | — | 7,401 (1) | 7,401 | image 1 | First-person proof / story |
| Aadit Sheth | — | 98,288 | — | — | 101 (1) | 101 | — | Free resource drop |
| Ravena O | — | 96,169 | — | — | 313 (3) | 350 | — | Roadmap / learning path / "If you're getting started"; Bold declarative thesis, no other device |
| Elvis S. | omarsar | 95,182 | bz subdomain (Belize) | — | 2,698 (2) | 3,383 | image 1 | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .."; Free resource drop |
| Matt Wood | — | 94,285 | — | — | 238 (1) | 238 | — | Bold declarative thesis, no other device |
| Ashley Nicholson | — | 94,062 | — | — | 720 (1) | 720 | — | Bold declarative thesis, no other device |
| Basia Kubicka | — | 91,377 | — | — | 148 (2) | 172 | — | First-person proof / story; Bold declarative thesis, no other device |
| Clare Kitching | clarekitching | 90,950 | Australia | — | 2,738 (1) | 2,738 | image 1 | "Everyone talks about X…" / shared confusion & overwhelm |
| Sumanth P | — | 90,178 | — | — | 715 (2) | 862 | — | Free resource drop; Bold declarative thesis, no other device |
| Arvind Jain | — | 90,115 | — | — | 432 (1) | 432 | — | Bold declarative thesis, no other device |
| Shivani Virdi | — | 87,796 | — | — | 401 (6) | 1,404 | — | First-person proof / story; Roadmap / learning path / "If you're getting started" |
| Tobias Zwingmann | — | 86,046 | — | — | 217 (1) | 217 | — | Bold declarative thesis, no other device |
| Stephanie Hills | — | 84,824 | — | — | 672 (1) | 672 | — | Career / jobs tension |
| Uttam Gupta | — | 83,062 | — | — | 772 (1) | 772 | — | First-person proof / story |
| Anshuman Tiwari | — | 82,964 | — | — | 283 (1) | 283 | — | "Everyone talks about X…" / shared confusion & overwhelm |
| Henry Shi | henrythe9th | 81,188 | www (US/unspecified) | — | 3,113 (1) | 3,113 | image 1 | First-person proof / story |
| Julio Casal | juliocasal | 80,283 | www (US/unspecified) | — | 2,304 (1) | 2,304 | image 1 | Contrarian reframe / myth-bust |
| Manisha Lodha | manisha-lodha-b72713200 | 79,900 | www (US/unspecified) | — | 675 (1) | 675 | image 1 | "Everyone talks about X…" / shared confusion & overwhelm |
| Miguel Fierro | — | 78,982 | — | — | 204 (1) | 204 | — | Free resource drop |
| Sid Arora | — | 77,565 | — | — | 665 (1) | 665 | — | Bold declarative thesis, no other device |
| Aditi Jain | — | 76,849 | — | — | 337 (1) | 337 | — | Bold declarative thesis, no other device |
| Shubham Srivastava | — | 74,813 | — | — | 191 (1) | 191 | — | Contrarian reframe / myth-bust |
| Nate Herk | — | 74,689 | — | — | 500 (1) | 500 | — | Free resource drop |
| Hao Hoang | — | 73,963 | — | — | 304 (3) | 2,356 | — | First-person proof / story; "Everyone talks about X…" / shared confusion & overwhelm |
| José Siles | — | 73,746 | — | — | 694 (1) | 694 | — | Contrarian reframe / myth-bust |
| Peter Slattery | — | 72,266 | — | — | 424 (1) | 424 | — | Bold declarative thesis, no other device |
| Manish Mazumder | — | 72,011 | — | — | 819 (4) | 1,094 | — | Career / jobs tension; Roadmap / learning path / "If you're getting started" |
| Amit Rawal | — | 71,738 | — | — | 520 (3) | 672 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .."; Contrarian reframe / myth-bust |
| Anshul Chhabra | — | 64,569 | — | — | 143 (2) | 158 | — | News-jack; First-person proof / story |
| Pramod Gosavi | — | 59,564 | — | — | 110 (1) | 110 | — | Free resource drop |
| Linda Haviv | — | 57,090 | — | — | 164 (1) | 164 | — | Number shock / ratio |
| Rohit Ghumare | — | 56,974 | — | — | 1,488 (1) | 1,488 | — | First-person proof / story |
| Sarveshwaran Rajagopal | sarveshwaran-rajagopal | 56,214 | India | — | 1,962 (1) | 1,962 | image 1 | Contrarian reframe / myth-bust |
| João (Joe) Moura | — | 53,138 | — | — | 1,686 (1) | 1,686 | — | Question or meme one-liner |
| Chandrasekar Srinivasan | chandrasekarsrinivasan | 51,211 | www (US/unspecified) | — | 15,782 (2) | 31,313 | image 1 | First-person proof / story; Roadmap / learning path / "If you're getting started" |
| Victoria Slocum | victorialslocum | 49,011 | Germany | — | 3,736 (1) | 3,736 | image 1 | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Anthony Alcaraz | — | 48,326 | — | — | 760 (1) | 760 | — | Bold declarative thesis, no other device |
| Sanjay Kumar Ph.D. | — | 48,168 | — | — | 343 (3) | 473 | — | Contrarian reframe / myth-bust; Explainer / definition |
| Oron Gill Haus | — | 47,589 | — | — | 1,021 (1) | 1,021 | — | Question or meme one-liner |
| Katharina Koerner | — | 46,871 | — | — | 235 (1) | 235 | — | Free resource drop |
| Rahul Agarwal | — | 46,241 | — | — | 655 (2) | 1,170 | — | First-person proof / story; Bold declarative thesis, no other device |
| Raman Walia | — | 45,388 | — | — | 383 (2) | 442 | — | First-person proof / story; Bold declarative thesis, no other device |
| Ravi Singh | — | 44,774 | — | — | 1,346 (1) | 1,346 | — | First-person proof / story |
| Betsy Tong | — | 44,558 | — | — | 205 (1) | 205 | — | Contrarian reframe / myth-bust |
| Arjun Jain | — | 44,458 | — | — | 124 (1) | 124 | — | First-person proof / story |
| Nathan Lambert | — | 42,499 | — | — | 282 (1) | 282 | — | Career / jobs tension |
| Shekhar Kirani | — | 41,600 | — | — | 165 (1) | 165 | — | Number shock / ratio |
| Maureen Wiley Clough | — | 41,463 | — | — | 247 (1) | 247 | — | Career / jobs tension |
| Cristóbal Cobo | — | 41,160 | — | — | 256 (1) | 256 | — | Explainer / definition |
| Alexandre Kantjas | akantjas | 40,876 | Germany | — | 4,725 (1) | 4,725 | image 1 | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Jean Malaquias | — | 38,928 | — | — | 1,152 (1) | 1,152 | — | Bold declarative thesis, no other device |
| Edward Frank Morris | — | 38,278 | — | — | 405 (1) | 405 | — | First-person proof / story |
| Davit Baghdasaryan | — | 38,073 | — | — | 115 (1) | 115 | — | First-person proof / story |
| Ross Dawson | — | 37,890 | — | — | 159 (1) | 159 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Anurag (Anu) Karuparti | — | 37,566 | — | — | 156 (4) | 189 | — | "Everyone talks about X…" / shared confusion & overwhelm; Free resource drop |
| Poornachandra Kongara | — | 35,902 | — | — | 486 (1) | 486 | — | Question or meme one-liner |
| Ben (Xiaojun) Li | — | 35,672 | — | — | 708 (1) | 708 | — | Free resource drop |
| Jason Moccia | — | 34,959 | — | — | 203 (1) | 203 | — | Explainer / definition |
| Ravi Shankar | — | 34,910 | — | — | 745 (2) | 1,106 | — | Roadmap / learning path / "If you're getting started" |
| Terezija Semenski | terezijasemenski | 34,133 | Croatia | — | 3,578 (1) | 3,578 | image 1 | First-person proof / story |
| Sarthak Rastogi | — | 33,633 | — | — | 172 (1) | 172 | — | Contrarian reframe / myth-bust |
| Himanshu Joshi | — | 32,132 | — | — | 183 (1) | 183 | — | Free resource drop |
| Piyush Ranjan | — | 31,665 | — | — | 296 (4) | 498 | — | Explainer / definition; "Everyone talks about X…" / shared confusion & overwhelm |
| Raghvender Arni | — | 31,420 | — | — | 319 (3) | 1,410 | — | Bold declarative thesis, no other device; Number shock / ratio |
| Sharad Bajaj | — | 30,206 | — | — | 133 (1) | 133 | — | Bold declarative thesis, no other device |
| Carmen Rincon | — | 29,675 | — | — | 1,072 (1) | 1,072 | — | Bold declarative thesis, no other device |
| Ananya Ghosh Chowdhury | — | 29,068 | — | — | 184 (1) | 184 | — | Bold declarative thesis, no other device |
| James Isilay | — | 29,045 | — | — | 122 (1) | 122 | — | Number shock / ratio |
| Abi Noda | — | 28,409 | — | — | 139 (1) | 139 | — | Bold declarative thesis, no other device |
| Santhosh Bandari | — | 28,205 | — | — | 856 (1) | 856 | — | Number shock / ratio |
| Sandipan Bhaumik | sandipanbhaumik | 27,548 | UK | — | 2,239 (1) | 2,239 | image 1 | Explainer / definition |
| Sivasankar Natarajan | — | 26,734 | — | — | 863 (2) | 1,623 | — | Explainer / definition |
| Cameron R. Wolfe | — | 26,356 | — | — | 429 (2) | 513 | — | Bold declarative thesis, no other device |
| Pradeep Sanyal | — | 25,988 | — | — | 223 (1) | 223 | — | Free resource drop |
| Raj Goodman Anand | — | 25,081 | — | — | 123 (1) | 123 | — | Number shock / ratio |
| Sohrab Rahimi | — | 24,541 | — | — | 270 (2) | 432 | — | Bold declarative thesis, no other device |
| Sean Connelly | — | 24,210 | — | — | 1,104 (1) | 1,104 | — | Bold declarative thesis, no other device |
| Rock Lambros | rocklambros | 24,174 | www (US/unspecified) | — | 2,052 (1) | 2,052 | image 1 | "Everyone talks about X…" / shared confusion & overwhelm |
| Ivan Burazin | — | 23,544 | — | — | 502 (1) | 502 | — | Explainer / definition |
| Bally S Kehal | — | 23,326 | — | — | 337 (2) | 438 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .."; Contrarian reframe / myth-bust |
| Axel Abulafia | — | 22,816 | — | — | 132 (1) | 132 | — | Career / jobs tension |
| Juan Sequeda | — | 22,262 | — | — | 629 (1) | 629 | — | "Everyone talks about X…" / shared confusion & overwhelm |
| Dileep Pandiya | — | 22,110 | — | — | 159 (3) | 650 | — | Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .."; Bold declarative thesis, no other device |
| Dr. Einat Orr | — | 21,301 | — | — | 149 (1) | 149 | — | Free resource drop |
| Dr. Isil Berkun | — | 21,227 | — | — | 128 (1) | 128 | — | Free resource drop |
| Romano Roth | — | 20,813 | — | — | 105 (1) | 105 | — | Number shock / ratio |
| Sethuraman Panchanathan | — | 20,812 | — | — | 335 (1) | 335 | — | Bold declarative thesis, no other device |
| Nir Diamant | — | 20,687 | — | — | 237 (1) | 237 | — | Bold declarative thesis, no other device |
| Animesh Kumar | — | 20,631 | — | — | 491 (1) | 491 | — | Bold declarative thesis, no other device |
| Dr. M. Nagarajan | — | 20,266 | — | — | 117 (1) | 117 | — | Bold declarative thesis, no other device |
| John Bailey | — | 19,431 | — | — | 147 (1) | 147 | — | Number shock / ratio |
| Sudipta Bhattacharya | — | 17,830 | — | — | 156 (1) | 156 | — | Bold declarative thesis, no other device |
| Sinan Aral | — | 17,733 | — | — | 530 (1) | 530 | — | News-jack |
| Waseem Alshikh | waseemalshikh | 17,482 | — | — | 593 (1) | 593 | — | Bold declarative thesis, no other device |
| Joseph Chivini | — | 16,581 | — | — | 134 (1) | 134 | — | News-jack |
| Pascal Brier | — | 16,563 | — | — | 107 (1) | 107 | — | "Everyone talks about X…" / shared confusion & overwhelm |
| Jothi Moorthy | — | 16,445 | — | — | 247 (1) | 247 | — | Question or meme one-liner |
| Abhishek Chandragiri | abhishek-chandragiri | 16,378 | www (US/unspecified) | — | 247 (3) | 414 | image 1 | Explainer / definition; Comparison: "X vs Y" / "X ≠ Y" / "A = .., B = .." |
| Srini Tallapragada | — | 16,060 | — | — | 614 (1) | 614 | — | Question or meme one-liner |
| Davide Mauri | — | 15,282 | — | — | 101 (1) | 101 | — | Question or meme one-liner |
| Brianna Bentler | — | 15,227 | — | — | 188 (1) | 188 | — | Contrarian reframe / myth-bust |
| Mallun Yen | — | 15,211 | — | — | 159 (1) | 159 | — | Number shock / ratio |
| Dr. Dirk Alexander Molitor | — | 15,171 | — | — | 522 (1) | 522 | — | Bold declarative thesis, no other device |
| Kateryna Stetsiuk | — | 14,960 | — | — | 1,109 (1) | 1,109 | — | First-person proof / story |
| Jatinder Singh | jatinsingh | 14,951 | www (US/unspecified) | — | 362 (1) | 362 | image 1 | Bold declarative thesis, no other device |
| Vijayan Nagarajan | — | 14,425 | — | — | 559 (1) | 559 | — | Career / jobs tension |
| Anil Inamdar | — | 14,387 | — | — | 733 (1) | 733 | — | Bold declarative thesis, no other device |
| Navveen Balani | — | 13,053 | — | — | 228 (1) | 228 | — | Bold declarative thesis, no other device |
| Gaurav (Rav) Mendiratta | — | 12,642 | — | — | 239 (1) | 239 | — | Bold declarative thesis, no other device |
| Sean Forde | — | 12,480 | — | — | 220 (1) | 220 | — | Question or meme one-liner |
| George Hurn-Maloney | — | 12,287 | — | — | 1,779 (1) | 1,779 | — | Bold declarative thesis, no other device |
| Cole Medin | — | 12,078 | — | — | 285 (1) | 285 | — | Number shock / ratio |
| Michał Choiński | — | 12,053 | — | — | 477 (1) | 477 | — | News-jack |
| Josh Huilar | — | 11,883 | — | — | 246 (1) | 246 | — | Career / jobs tension |
| Andrew P. | — | 11,180 | — | — | 273 (1) | 273 | — | Bold declarative thesis, no other device |
| Bahareh Jozranjbar | — | 10,959 | — | — | 483 (1) | 483 | — | Bold declarative thesis, no other device |
| Sumeet Agrawal | — | 10,728 | — | — | 493 (2) | 707 | — | Contrarian reframe / myth-bust; Explainer / definition |
| Alfredo Serrano Figueroa | — | 10,625 | — | — | 156 (1) | 156 | — | Career / jobs tension |
| Silvio Savarese | — | 10,491 | — | — | 150 (1) | 150 | — | Bold declarative thesis, no other device |
| Patrick Salyer | — | 10,423 | — | — | 134 (1) | 134 | — | Bold declarative thesis, no other device |
| Vishwas Lele | — | 9,671 | — | — | 140 (1) | 140 | — | First-person proof / story |
| Mehdi Yari | — | 8,894 | — | — | 206 (1) | 206 | — | First-person proof / story |
| Suresh Srinivas | — | 8,772 | — | — | 1,072 (1) | 1,072 | — | Bold declarative thesis, no other device |
| Julia Wu | — | 8,441 | — | — | 120 (1) | 120 | — | Career / jobs tension |
| Shobhit Tankha | — | 8,296 | — | — | 1,551 (1) | 1,551 | — | Contrarian reframe / myth-bust |
| Joe Bohman | — | 7,125 | — | — | 448 (1) | 448 | — | Bold declarative thesis, no other device |
| Kalpit Jain | — | 6,145 | — | — | 903 (1) | 903 | — | Bold declarative thesis, no other device |
| Nikhil Kassetty | — | 6,126 | — | — | 378 (1) | 378 | — | Bold declarative thesis, no other device |
| Isin Pesch | — | 5,601 | — | — | 1,369 (1) | 1,369 | — | "Everyone talks about X…" / shared confusion & overwhelm |
| Taras Tsugrii | — | 5,520 | — | — | 318 (1) | 318 | — | Bold declarative thesis, no other device |
| Katie Dove | — | 5,236 | — | — | 231 (1) | 231 | — | Question or meme one-liner |
| Abdul Rehman | — | 4,729 | — | — | 226 (1) | 226 | — | Question or meme one-liner |
| Carrie Loranger | — | 4,663 | — | — | 164 (1) | 164 | — | "Everyone talks about X…" / shared confusion & overwhelm |
| Shubho R. Ghosh | — | 4,339 | — | — | 104 (1) | 104 | — | Number shock / ratio |
| Jiunn-Tyng (Tyng) Yeh | — | 4,105 | — | — | 6,125 (1) | 6,125 | — | Bold declarative thesis, no other device |
| Abhiram Ravikumar | — | 3,992 | — | — | 101 (1) | 101 | — | Bold declarative thesis, no other device |
| Emre Okcular | — | 3,762 | — | — | 106 (1) | 106 | — | Bold declarative thesis, no other device |
| Sowmya Y | — | 3,552 | — | — | 1,067 (1) | 1,067 | — | Contrarian reframe / myth-bust |
| Steve Suarez | — | 3,394 | — | — | 262 (1) | 262 | — | First-person proof / story |
| Adam Kiezun | — | 3,285 | — | — | 353 (1) | 353 | — | First-person proof / story |
| Elle Crenshaw | — | 2,964 | — | — | 356 (1) | 356 | — | Contrarian reframe / myth-bust |
| Junhua Zhu | — | 2,118 | — | — | 440 (1) | 440 | — | First-person proof / story |
| Nandini Katta | — | 2,117 | — | — | 382 (1) | 382 | — | Contrarian reframe / myth-bust |
| Angel Dimitrov | — | 2,094 | — | — | 518 (1) | 518 | — | First-person proof / story |
| Angelina Sanchez | — | 2,074 | — | — | 152 (1) | 152 | — | Contrarian reframe / myth-bust |
| Rajeshwar D. | rajeshward | 1,749 | — | — | 117 (2) | 157 | — | Explainer / definition |

---

## 9. Sources
- Public LinkedIn profile and post pages (fetched 2026-10-14); every post URL is in `../data/verified-posts.csv`.
- LinkedIn Top Content topic hubs (fetched 2026-10-14).
- MagicPost, "Top 20 LinkedIn Creators on AI (2026)", data dated June 2026: https://magicpost.in/blog/top-linkedin-creators-ai
- Reepl, LinkedIn creator directory (follower figures are approximate): https://reepl.io/top-influencers
- DataNorth, "Top 10 AI influencers to follow on LinkedIn in 2026": https://datanorth.ai/blog/top-10-ai-influencers-to-follow-on-linkedin-in-2026
