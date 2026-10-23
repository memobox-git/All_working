# SleekBuys has an audience, but it is set up to earn almost nothing from it

SleekBuys.com is not a store. It is an Indian price-comparison and deals site, built on a bought WordPress theme, and owned by RetrieveAI (San Jose and Hyderabad). It earns in only two ways: a commission when a reader clicks through to Amazon and buys, and Google ads. It already has a lot to work with:

- about **1,315 pages** (866 posts and 449 product pages);
- an Amazon affiliate account;
- a YouTube channel with **7,380 subscribers and 9 million lifetime views**.

But the path from reader to money is broken at almost every step:

- **Store links.** In a random sample of 60 product pages, **14 sent buyers to Amazon or Flipkart with no SleekBuys tag, and 12 had no store link at all**. Only 34 (57%) earned on every store link.
- **Newsletter.** The sign-up form sends every email to **the theme developer's Mailchimp list**, not to SleekBuys.
- **Analytics.** Google Analytics was installed but never connected, so nobody can see the traffic.
- **Legal pages.** There is no privacy policy, About page or affiliate disclosure, though Google AdSense and Amazon both require them.
- **Spam.** Most serious, **110 posts are auto-generated "cracked Windows ISO, Download Torrent" pages** from April and May 2025. They put the site's Google rankings, its AdSense account and its Amazon account at risk.
- **Publishing.** Output has collapsed, from about 80–110 posts a month in mid-2025 to 4 in September 2026 and none so far in October.

On social, the accounts are busy but don't connect to the site or to sales:

- **YouTube** posts 4–5 Shorts a week but never links to the site or to a product.
- **Facebook** re-posts the same Shorts to 8,100 followers and gets about 2 reactions each.
- **Branding.** Facebook and LinkedIn are branded "Retrieve AI".

Meanwhile the market has moved:

- Google now answers "best phone under ₹X" with its own AI answers.
- Small publishers lost **60%** of their search clicks in two years.
- Plain price comparison is shrinking: MySmartPrice's revenue fell **76%** in FY25.

The fix has three steps:

1. **Stop the leaks (weeks 1–2):** delete the spam pages, tag every store link through Cuelinks or EarnKaro, add the legal pages, and fix the newsletter and analytics.
2. **Rebuild around what still earns (weeks 3–8):** a small set of hands-on "best under ₹X" and "X vs Y" pages, higher-commission categories (earbuds, watches, beauty, fashion), credit-card pages and sale hubs.
3. **Make social sell (now through January):** turn the YouTube Shorts into a funnel with Shopping tags and links, start Telegram and WhatsApp deal channels and an email list, and ride Diwali (8 November), Black Friday and the Republic Day sales.

All site checks below were run on 23 October 2026. The raw data and methods are in [research_notes/SleekBuys audit](../research_notes/SleekBuys%20audit/).

## What SleekBuys is today

| Item | Finding |
|---|---|
| Business model | Comparison and deals site. Earns from Amazon affiliate links (tag `sleekbuys2023-21`) and Google AdSense. No cart, no checkout. |
| Owner | RetrieveAI, which calls SleekBuys "our product". LinkedIn lists San Jose and Hyderabad and 2–10 staff ([LinkedIn](https://in.linkedin.com/company/retrieveai)). The contact page gives a San Jose street address and a Gmail address. |
| Domain | Registered 10–11 April 2021 with GoDaddy, owner hidden ([RDAP](https://rdap.org/domain/sleekbuys.com)). Hosted on Hostinger. |
| Platform | WordPress 6.8 with the "Blurb" affiliate theme by ThemeIM, plus Elementor and All in One SEO. Runs on PHP 8.0, which stopped getting security fixes in November 2023. |
| Size | 866 posts, 449 product pages, 18 pages ([sitemap](https://sleekbuys.com/sitemap.xml)) |
| Topics | Phones, laptops, audio and wearables in the menu. Beauty and fashion now make up a large share of the product pages. |
| Analytics | The MonsterInsights plugin says "not currently configured on this site", so **no analytics are running**. |
| Social | YouTube 7.38K subscribers · Facebook 8.1K followers · Instagram @sleekbuys.ai about 541 followers (not verified) · LinkedIn 3,361 followers (under the RetrieveAI name) · Pinterest 0 followers |

## The pain points, most urgent first

### 1. 110 "cracked Windows" torrent pages put the whole site at risk

- **How many.** 110 of the 866 posts, about **one in eight**, are pirated-software pages, with URLs like:
  - `/windows-10-pro-x64-crack-iso-all-in-one-latest/`
  - `/windows-11-with-activator-5gb-without-tpm-super-speed/`
  - `/windows-10-pro-x64-cracked-iso-image-5gb-rarbg/`
- **What's on them.** The one I opened starts "Size: 4.7Gb · Fast Download · Download Torrent". Its two download buttons point to `%DLINK1%` and `%DLINK2%`, the unfilled placeholders of a bulk-posting template.
- **When and by whom.** 109 were last changed in April–May 2025. They are published under the "Sleek Buys" author name, filed under "Deployment" and "Download", and listed in the sitemap that robots.txt points Google to.
- **Not a hidden hack.** Google sees the same page a browser does, so this is not cloaked spam. Either a hacker or someone with a bulk-posting tool added them.

**Why it matters**

- **Google.** Its spam policies cover hacked content and pages made at scale without value ([Google](https://developers.google.com/search/docs/essentials/spam-policies)). Google has run four spam updates so far in 2026 ([Status Dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history)).
- **AdSense.** Google's publisher policies don't allow content that "infringes copyright" or "promotes any form of hacking or cracking" ([Google Publisher Policies](https://support.google.com/adsense/answer/10502938)).
- **Amazon.** The same pages sit beside the Amazon affiliate links, so they can put that account at risk too.

**Fix this week.**
1. Delete all 110 posts and return "410 Gone" for them.
2. Remove the "Deployment" and "Download" categories.
3. Check the WordPress users and plugins, change every password, and run a malware scan.
4. Look at Search Console's "Security issues" and "Manual actions" reports.

### 2. Many store clicks earn nothing, or less than they could

In the 60-page sample:
- **Short links work.** All 43 `amzn.to` short links carry the SleekBuys tag.
- **Full links don't.** None of the 19 full `amazon.in` links has an affiliate tag. **None of the 6 Flipkart links** has one either; Flipkart has not taken direct affiliate sign-ups since 2018, so these can only earn through a network ([Cuelinks](https://www.cuelinks.com/blog/flipkart-affiliate-registration-not-working-heres-a-reliable-alternative/)).
- **Wrong country.** One link goes to **amazon.com** with a US tag, which earns nothing from Indian buyers.
- **Traffic given away.** About a third of all outbound links (45 of 127) went to other blogs and brand sites, mostly fashion and beauty blogs such as MensXP and StyleWhirl.
- **Two pages crash** with "There has been a critical error on this website."

The site also breaks Amazon's own rules in ways that put the account at risk:
- **No disclosure.** It never shows the required line "As an Amazon Associate I earn from qualifying purchases."
- **Fixed prices.** It shows prices typed in by hand ("$ 16,052.00", "$0.00"). Amazon allows prices only from its API, cached for at most 24 hours, with a timestamp if they aren't refreshed hourly ([Amazon operating agreement](https://affiliate-program.amazon.in/help/operating/agreement)).

### 3. The site does not look trustworthy to readers, to Google or to partners

| Problem | What a visitor sees |
|---|---|
| No legal pages | /privacy-policy/, /about/, /terms/ and /affiliate-disclosure/ all return "page not found". AdSense requires a privacy policy, and Amazon requires a disclosure. |
| Mixed identity | Facebook cover and LinkedIn say "Retrieve AI". Instagram is "@sleekbuys.ai". The footer says "Copyright ©sleekbuys 2018" (the domain dates from 2021). The YouTube bio still says "AI powered chat app". |
| Template leftovers | Lorem ipsum in the sign-in and sign-up boxes ("If you do not have accaount…"). WordPress's "Sample Page" ("I'm a bike messenger by day, aspiring actor by night…") and the theme's demo pages (home-two, home-three, bshop) are live and listed in the sitemap. |
| Coupons page | Shows only the theme's demo coupons, such as "Up To 75% Discount On Audio Technica Headphones At Daraz" (a marketplace that doesn't operate in India). All expired on 23 August 2019. |
| Wrong content | The "Travel" menu item shows phone news. Rupee prices show with a "$" sign. Star ratings show "0.0". Products say "Sold by: Admin". |
| Broken sharing | The share buttons build links like `http://https%3A%2F%2Fsleekbuys.com…`, which don't work. |

Google's guidance for review and comparison sites asks for exactly the opposite: first-hand evidence, a clear author, links to more than one seller, and disclosed affiliate links ([Google](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews)). India's dark-patterns rules ban false urgency and disguised ads ([Lok Sabha answer, March 2026](https://fcainfoweb.nic.in/PMS/writereaddata/2026_LS_B_5415.pdf)), so countdown timers on coupons from 2019 are a legal risk as well as an embarrassment.

### 4. Every newsletter sign-up goes to a stranger

- **Where the emails go.** The "Newsletter Signup" form posts to a Mailchimp list on the account "mdsalam" (`u=458c676bde332b8e0d47e6d1a`). The theme's public demo site uses **the same list ID** ([ThemeIM demo](https://themeim.com/wp/blurb/)). Every email ever entered went to the theme developer, not to SleekBuys, and SleekBuys has collected no subscribers.
- **An impossible promise.** The form offers a "10% discount", which a comparison site has no way to give.
- **Two problems in one.** It is a privacy problem, and it means SleekBuys owns no audience at all.

### 5. Nobody can see the traffic

The analytics plugin is installed but was never connected to Google Analytics. SleekBuys can't tell which pages get visits, which links get clicked, or where readers come from. **No public traffic estimate exists either**: Semrush had no data for the domain. So nobody can forecast earnings until Analytics and Search Console are running.

### 6. Pages are very slow on phones

I ran Lighthouse's mobile test on the homepage. It is a lab test from a cloud server, so real visitors may see different times, but the page weight and script counts are facts about the page.

| Metric | Result | Good is |
|---|---|---|
| Performance score | **2 / 100** | 90+ |
| Largest Contentful Paint | **32.9 s** | under 2.5 s |
| Layout shift (CLS) | **0.85** | under 0.1 |
| Total Blocking Time | 3.3 s | under 0.2 s |
| Page weight | **6.3 MB**, 167 requests | under about 2 MB |
| Page elements (DOM) | 3,788 | under about 1,500 |

What causes it:
- **Too much code.** The homepage loads **65 scripts** and 30 stylesheets, mostly old jQuery plugins.
- **Heavy add-ons.** A chatbot adds 302 KB and the ads 363 KB.
- **Hard to tap.** Elements jump around as the page loads, which makes buttons hard to hit.

The server itself is fast (250 ms response), so the theme is the problem, not the hosting.

### 7. Publishing stopped, and most posts are thin rewrites of news

| Period | Posts last changed per month (sitemap) |
|---|---|
| Apr–May 2025 | 66 and 112 (including the spam batch) |
| Aug–Sep 2025 | 83 and 82 |
| Jan–Jul 2026 | 20–46 |
| Aug 2026 | 9 |
| Sep 2026 | 4 |
| Oct 2026 (to the 23rd) | 0 |

These are last-modified dates, not publish dates, so treat them as a measure of activity.

**What the posts look like.** In a random sample of 40 posts:
- **Length.** The median is **690 words**.
- **Images.** **34 had no image** in the article.
- **Empty posts.** 3 were empty apart from the title.
- **Topics.** Most rewrite launch news and leaks ("iPhone 18 Pro And Pro Max Price Leaks…", "Tecno Pova 8 India Launch Date Confirmed…"). A few are off topic, such as Marvel's Wolverine, a university controversy, and Zoho's cloud.
- **Hidden characters.** One title holds 144 invisible characters, a common sign of text pasted from a generator.

This is a race SleekBuys can't win:
- **Bigger sites own news.** 91mobiles and Gadgets360 each get about **16 million visits a month** ([Semrush](https://www.semrush.com/website/91mobiles.com/overview/)).
- **Google targets this kind of output.** Its "scaled content abuse" rule names AI-generated pages made at scale without added value ([Google](https://developers.google.com/search/docs/essentials/spam-policies)).

### 8. Google sends fewer clicks to sites like this every year

- **AI answers cut clicks.**
  - When Google shows an AI summary, users click a result in **8% of visits, against 15%** without one ([Pew](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)).
  - AI Overviews now appear on **83% of "best [product]" searches**, up from 5% a year earlier ([BrightEdge](https://www.brightedge.com/resources/weekly-ai-search-insights/black-friday-2024-vs-2025-what-a-year-of-testing-taught-google-about-ai-overviews)).
  - Small publishers lost **60%** of their search referrals over two years, against 22% for large ones ([Chartbeat via PPC Land](https://ppc.land/small-publishers-lost-60-of-search-traffic-as-ai-reshapes-the-web/)).
- **Google is becoming the comparison site in India.**
  - Since April 2026, AI Mode in India answers shopping searches with its own comparison tables ([Google India](https://blog.google/intl/en-in/products/explore-communicate/new-ways-google-is-using-ai-to-make-shopping-easier/)).
  - In September 2026 Google began testing a Flipkart **"Buy" button inside Gemini and AI Mode** for phones and electronics ([TechCrunch](https://techcrunch.com/2026/09/26/google-tests-buying-from-walmart-owned-flipkart-through-gemini-and-ai-mode-in-india/)).
- **Plain price comparison is fading.** MySmartPrice's revenue fell 76% to ₹81.7 lakh in FY25 ([Inc42](https://inc42.com/company/mysmartprice/)).
- **What still works** for small sites is what Google's own guidance rewards: first-hand testing, original photos, honest verdicts and clear comparison tables. Owned channels (email, Telegram, WhatsApp, YouTube subscribers) matter more each year because they don't depend on Google.

### 9. The social accounts are busy, but disconnected from the site and from sales

| Platform | Today | Problem |
|---|---|---|
| **YouTube** @sleekbuys | **7.38K subscribers, 237 videos, 9.03M lifetime views**. Posts 4–5 Shorts a week on phone launches and spec comparisons. The last 15 averaged **882 views** (median 610). The last long video was about 10 months ago. | **Not linked from the site**, and the site isn't linked from the channel. **None of the last 15 descriptions has any link.** The bio says "AI powered chat app". |
| **Facebook** /Sleekbuys | **8.1K followers**. Re-posts the YouTube Shorts one for one, about 4 a week. | About **2.4 reactions, 0 comments and 0 shares** per post. Cover photo says "Retrieve AI". Listed location "San Jose CA" for an Indian audience. |
| **Instagram** @sleekbuys.ai | About 541 followers and 783 posts (search snippets; Instagram blocked direct checks) | The ".ai" handle doesn't match the brand. Lookalike accounts (@sleekbuys, @sleekbuys_) exist. |
| **LinkedIn** | 3,361 followers on the **RetrieveAI** page | No posts. Wrong name and logo for SleekBuys. |
| **Pinterest** /sleekbuys | 0 followers, last pin February 2023 | Abandoned |
| **Telegram, WhatsApp, email** | None, and the newsletter goes to the theme developer | **No owned audience at all** |

Sources: YouTube [channel](https://www.youtube.com/@sleekbuys) and RSS feed, Facebook page plugin data, LinkedIn page and search snippets, checked 23 October 2026 (details in the [social notes](../research_notes/SleekBuys%20audit/social_audit.md)).

The YouTube numbers already show what works:
- **Comparisons win.** The six "X vs Y" comparison Shorts in October averaged **about 1,280 views**, twice the **about 620** of the other nine. The best was "Vivo V80 vs Vivo V70 Elite – Which One Should You Buy?" with **2,671**.
- **The one deals video flopped.** "Amazon Great Indian Festival TOP 7 Smartphone Deals Under ₹50,000" got **66 views**.
- **Caveat.** The sample is small, but buyers clearly respond to "which should I buy" more than to launch hype.

## How SleekBuys can make money

The streams below are in the order they can start paying. The rates are what each program pays in India today.

| Stream | What it pays | How soon | What it needs |
|---|---|---|---|
| **1. Tag every store link through a network** | Flipkart up to 7.2%; boAt up to 7.2%; Myntra 7.5% on new users; Nykaa up to 5.04%; Pepperfry up to ₹315 a sale ([Cuelinks](https://www.cuelinks.com/campaigns/flipkart-affiliate-program)). Noise 4% ([EarnKaro](https://earnkaro.com/blog/gonoise-affiliate-program/)). | **Days** | Install the Cuelinks plugin or EarnKaro links on the existing 1,315 pages; keep the Amazon tag for Amazon links |
| **2. Shift money pages to higher-paying categories** | Amazon pays only **0.32–0.63% on phones**, but 2.2–2.5% on earbuds, watches and accessories, 3–6% on fashion and home, and **7.6% on beauty** (Cuelinks' table of Amazon rates, Sep 2025; check your own rate card) | Weeks | 10–20 strong pages per category |
| **3. Credit-card pages** | **₹441–1,400 per approved card**: IndusInd ₹1,400, IDFC ₹1,020, AU ₹441 ([vCommission](https://www.vcommission.com/blog/publishers/festive-cpa-opportunities-high-paying-credit-card-campaigns-for-affiliates/)) | Weeks | "Best card for the Flipkart/Amazon sale" pages, with honest bank-offer maths |
| **4. YouTube Shopping affiliate** | Retailer's commission, with **100% going to the creator** for now ([YouTube Help](https://support.google.com/youtube/answer/13376398)). India partners: Flipkart, Myntra, Nykaa, Purplle, Shopsy, Tira and now Amazon ([FoneArena](https://www.fonearena.com/blog/493334/youtube-shopping-affiliate-program-india-expansion.html)). | 1–3 months | YouTube Partner Program plus 500 subscribers ([Storyboard18](https://storyboard18.com/digital/youtube-opens-shopping-affiliate-program-to-creators-with-500-subscribers-93649.htm)); SleekBuys already has 7.38K |
| **5. Sale hubs** | Same commissions, at peak volume. Mobiles were **38–40%** of the ₹24,000 crore sold in the first two days of the 2026 festive sales ([YourStory](https://yourstory.com/2026/10/ecomm-firms-goods-worth-rs-24k-cr-first-two-days-festive-sales-redseer)). | Each sale | One live, updated page per sale, plus Telegram and WhatsApp pushes |
| **6. Brand-paid launch coverage** | 91mobiles earned **₹45.7 crore** in FY25 ([Inc42](https://inc42.com/company/91mobiles/financials/)) partly from paid brand videos for Oppo, OnePlus and Flipkart ([SponsorRadar](https://sponsorradar.com/channels/91mobiles)). Agency estimates: ₹8K–80K a Reel for small creators ([upGrowth](https://upgrowth.in/influencer-marketing-pricing-india-2026/)). | 6+ months | Real reach and a media kit; must be labelled #ad under ASCI rules |
| **7. Display ads (keep, but don't count on them)** | AdSense in India earns roughly ₹80–415 per 1,000 page views for shopping and tech (third-party estimates, [upGrowth](https://upgrowth.in/how-to-calculate-google-adsense-earnings-india/)). Premium networks are out of reach: Ezoic now needs 250K monthly users ([PR Newswire](https://www.prnewswire.com/news-releases/ezoic-raises-bar-to-250k-js-integration-for-full-revenue-platform-surges-in-popularity-with-web-builders-302692672.html)), and Raptive needs mostly US/UK traffic. | Already on | Fewer, better-placed ads; keep them away from the buy buttons |

**What one sale earns.** These are worked examples from the rates above. Your own Amazon rate card may differ.

| Sale | Commission |
|---|---|
| ₹20,000 phone on Amazon (0.32–0.63%) | **₹64–126** |
| ₹2,000 earbuds on Amazon (2.54%) | ₹51 |
| ₹2,000 boAt earbuds via Cuelinks (up to 7.2%) | up to ₹144 |
| ₹3,000 smartwatch on Amazon (2.22%) | ₹67 |
| ₹600 serum on Amazon (7.6%) | ₹46 |
| ₹1,500 Myntra order, new user (7.5%) | ₹113 |
| Pepperfry furniture order | up to ₹315 |
| One approved credit card | **₹441–1,400** |
| MakeMyTrip domestic hotel booking | ₹140 |

So one approved IndusInd card (₹1,400) earns about as much as **11–22 Amazon phone sales**. That's why phones should bring the traffic (they are what people search for and watch), while the money pages should point readers to accessories, wearables, fashion, beauty, and the right bank card for the sale.

**Things to skip for now:**
- **Travel.** Hotels pay ₹140 a booking with 1-day cookies, and the Travel page has no travel content.
- **A browser extension.** BuyHatke already has 6.33M visits a month, and Amazon must approve any extension in writing.
- **The coupon section as it is.** Replace it with a short, checked "today's working codes" list or remove it.

**Two warnings on Amazon:**
- **Rate cuts.** Adweek reported unannounced commission cuts of up to 50% for some publishers from late 2025 ([Adweek](https://www.adweek.com/media/amazon-associates-affiliate-rate-cuts-publishers/)), so don't depend on Amazon alone.
- **Live prices.** Showing live Amazon prices now needs the Creators API, which requires **10 sales in the past 30 days** ([Amazon](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction)). Until then, use "Check price on Amazon" buttons, not typed-in prices.

## Marketing: what to change on YouTube, Instagram and Facebook

### YouTube is the best asset, so make it the engine

| Today | Change to |
|---|---|
| Shorts on launch hype ("Ultimate Gaming Beast!") | Mostly **"X vs Y: which should you buy?"** and **"Best under ₹X"** Shorts; these already get about twice the views. Keep 4–5 a week. |
| No long videos for 10 months | **One long video a week**: "Top 5 phones under ₹20,000 – [sale] 2026", "Don't buy the wrong phone", "Vivo V80 vs V70 Elite: after 7 days". Small channels used exactly this title pattern in the 2026 sales ([example](https://www.youtube.com/watch?v=TGRSc-m2Zqs)). |
| No links anywhere | Link every Short to the matching long video (the only clickable link a Short has). Every long video's description gets the matching SleekBuys page and tagged store links, with a disclosure line. Pin a comment with the deal link. |
| Not in YouTube Shopping | Join the **Shopping affiliate program**. YouTube says product tags get **more than twice the clicks** of description links ([Storyboard18](https://www.storyboard18.com/how-it-works/youtube-brings-amazon-shopping-affiliate-to-india-as-it-unveils-new-ai-creator-and-commerce-tools-ws-o-111261.htm)). More than 450 million Indians now use YouTube for shopping searches. |
| Spec-sheet slides | Show **real hands-on footage**: unboxing, a battery test, a camera sample. YouTube has removed mass-produced, repetitive channels from monetization since July 2025 ([Search Engine Journal](https://searchenginejournal.com/youtube-targets-mass-produced-content-in-monetization-update/550337/)). Real footage also feeds the site, since Google rewards first-hand photos. |
| Bio says "AI powered chat app" | New bio: "Honest phone and gadget comparisons for India. Best buys under every budget." Add the site and Telegram links to the channel header. |

### Instagram: original Reels and carousels with shoppable links

- **Rename the handle** from @sleekbuys.ai to one that matches the brand everywhere (@sleekbuys is taken by an unrelated 7-follower account). Remove "Product of RetrieveAI" from the bio.
- **Post only original content.** Since 30 April 2026, Instagram stops recommending accounts that mostly re-post, even with credits ([Tubefilter](https://tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator)). The cut-down YouTube comparisons are fine because they are SleekBuys' own.
- **Add swipeable comparison carousels.** For example "V80 vs V70 Elite: 6 differences that matter", or "Best earbuds under ₹2,000, ranked". People save and send these, and Instagram's head names sends (shares by DM) as a top ranking signal ([Social Media Today](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/)).
- **Make every Reel shoppable.** Shoppable Reels have been live in India since April 2026, with up to 30 product links per Reel, affiliate links allowed ([Storyboard18](https://www.storyboard18.com/digital/instagram-shoppable-reels-launch-what-it-means-for-creator-monetisation-in-india-94936.htm)).
- **Use comment-to-DM.** Add a "Comment DEAL and I'll DM you the link" automation (ManyChat or similar), plus Story link stickers to the current sale hub.

### Facebook: fix the page, then use it as the cheap ad engine

- **Fix the page.** Change the cover from "Retrieve AI" to SleekBuys, the location from San Jose to India, and the bio. Connect Instagram so Reels cross-post automatically.
- **Mix in sale posts.** Keep the Reels, and add one sale post a day during big sales, linking to the live sale hub.
- **Run a small ad test.** Meta ads in India are among the cheapest in the world: a median of about **$1.35 per 1,000 impressions and $0.10 per click** ([Superads](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/india)). Put ₹500–1,000 a day behind the best comparison Reels, aimed at **growing the Telegram, WhatsApp and email lists**, and judge it by **cost per new subscriber**, not by sales.

### Add the channels that deal-hunters in India actually use

- **Telegram channel "SleekBuys Deals".** Post only verified lowest prices, with a one-line verdict ("lowest in 90 days" or "skip, it was cheaper in July"). Indian deal channels reach 250K to 2.8M subscribers ([EarnKaro](https://earnkaro.com/blog/loot-deals-telegram-channels/), vendor list). Note: Myntra's affiliate terms ban promotion on Telegram.
- **WhatsApp Channel with the same feed.** India blocked Telegram for a week in June 2026 ([TechCrunch](https://techcrunch.com/2026/06/16/india-temporarily-blocks-access-to-telegram-over-exam-fraud-concerns)), so don't depend on one app.
- **Email.** Fix the Mailchimp form so it goes to SleekBuys' own account, drop the "10% discount" promise, and send one "best deals this week" email every Friday.

## The 90-day plan

Diwali is on **8 November 2026**, 16 days from now, so a few quick wins come first.

**Weeks 1–2: stop the leaks**
1. Delete the 110 Windows torrent posts (410 Gone), run a security check, and review Search Console for manual actions.
2. Connect Google Analytics 4 and Search Console.
3. Put all outbound links through **Cuelinks or EarnKaro**, and swap the untagged Amazon and amazon.com links for tagged amazon.in links.
4. Publish a Privacy Policy, an About page (who is behind SleekBuys, how products are chosen), Terms, and an affiliate disclosure on every page with store links.
5. Point the newsletter to SleekBuys' own email account.
6. Remove the sample, demo and lorem ipsum pages, the 2019 coupons and the "Travel" item. Fix "$" to "₹", fix the broken share links and the two crashing pages.
7. Fix the branding on YouTube, Facebook, Instagram and LinkedIn, and link all of them from the site (and the site from all of them).
8. **Diwali quick win:** one "Diwali 2026 best deals" hub page, updated daily, plus a Telegram channel and WhatsApp Channel launched the same day and pushed from YouTube and Instagram.

**Weeks 3–6: rebuild the money pages**
1. Make the site faster: drop the chatbot and unused sliders, cut the scripts, lazy-load images, upgrade PHP to 8.2 or later, and aim for a mobile performance score of 70+.
2. Write **12–20 evergreen pages** with hands-on evidence and named authors: "Best phones under ₹15K / ₹20K / ₹30K", "Best earbuds under ₹2,000", "Best smartwatch under ₹5,000", "Best laptop for students", and the top "X vs Y" pairs from the YouTube comments. Update them monthly at the same URL.
3. Write 2–3 **credit-card pages** for sales ("Best card for the Republic Day sale").
4. Merge or noindex the thin news rewrites. Only publish news with an India price or availability angle.
5. YouTube: one long video a week plus Shorts that link to it. Apply for Shopping affiliate.

**Weeks 7–12: scale around the sales**
1. Run the Black Friday (27 November) and winter end-of-season sale hubs (December). Prepare the Republic Day sale hub (mid-January) three weeks early, with dates and bank offers.
2. Start the Meta ad test for Telegram, WhatsApp and email growth.
3. Once views grow, draft a media kit for brand-paid launch coverage, labelled #ad.

**What to measure each week**

| Area | Measure |
|---|---|
| Money | Store clicks, Amazon and network orders, earnings per 1,000 visits, credit-card approvals |
| Leaks | Share of store links that are tagged (target 100%); spam pages left (target 0) |
| Search | Clicks and impressions in Search Console for the 12–20 money pages |
| Owned audience | New Telegram, WhatsApp and email subscribers; cost per subscriber from ads |
| YouTube | Views per Short, click-through from Shorts to long videos, Shopping tag clicks |

## What to ask the client for

1. **Admin access** to WordPress, Hostinger, Search Console and AdSense.
2. **The Amazon Associates dashboard**: clicks, orders, earnings by category, and the current rate card.
3. **YouTube Studio**: Partner Program status, traffic sources and audience age and country.
4. **Who added the Windows posts** in April–May 2025, and who else has logins.
5. **The team and budget**: who will film, write and post, and how much can go to ads.
6. **The goal**: is SleekBuys a side product of RetrieveAI, or a business it wants to grow? That decides how far to take steps 6–7 of the money plan.

## How this was checked, and what's missing

What I checked myself, on 23 October 2026:
- **Site crawl.** The homepage and every sitemap URL (1,315 posts and products) for status codes.
- **Samples.** A random 60 product pages for affiliate links, resolving every `amzn.to` link to check its tag, and a random 40 posts for length and images.
- **Pages and settings.** The coupons, travel, compare and contact pages, plus the legal URLs, ads.txt and the newsletter form.
- **Speed.** Lighthouse on the homepage.
- **YouTube.** The channel's RSS feed for the latest 15 videos.

Research helpers checked:
- **Social profiles.** Facebook, LinkedIn, Pinterest and YouTube.
- **Ownership records.** The domain registration and the RetrieveAI pages.
- **Competitors and rates.** Competitor finances, and affiliate and ad-network rates.
- **Google and platforms.** Google and AI-search studies, and platform rules.

Their notes, with every source, are in the [research notes folder](../research_notes/SleekBuys%20audit/).

**Gaps:**
- **No traffic data.** There is no traffic or earnings data for SleekBuys itself, so this report gives commission per sale rather than a revenue forecast.
- **Instagram numbers unverified.** The Instagram figures come from search snippets, because Instagram blocked direct checks.
- **Amazon rates unofficial.** Amazon's India rates come from a third-party table (Cuelinks, September 2025), because Amazon's own rate card now sits behind a login.
- **Speed is a lab test.** No field data from real Chrome users was available.
