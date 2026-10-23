# sleekbuys.com site audit: raw findings

Checked on 23 October 2026 from a cloud server, with curl, a sitemap crawl and Lighthouse 12.6. Each finding says how it was measured.

## Basics

- **Server.** Hostinger (LiteSpeed). Headers report `x-powered-by: PHP/8.0.30`. PHP 8.0's security support ended in November 2023.
- **Software.** WordPress 6.8.11 with the "Blurb" theme by ThemeIM and its "blurb-aide" plugin, plus Elementor and All in One SEO 5.0.2.1.
- **Homepage title.** "Home - SleekBuys".
- **Meta description.** Scraped page text: "The Best Comparison SleekBuys Compare Now Find Your Best Deals With SLEEKBUYS Find Deals Our Store Our Review Compare Price Amazon Top Deals… Price $ 16,052.00…".
- **Analytics.** The MonsterInsights plugin is installed, but its own HTML comment says "MonsterInsights is not currently configured on this site." No GA4 ID (G-…) appears in the page, so **the site has no analytics running**.
- **Ads.** Google AdSense runs as `ca-pub-5887727146018925`, and ads.txt is present and correct.
- **Chatbot.** A Botpress chatbot script (cdn.botpress.cloud) loads on every page.
- **Sitemaps.** robots.txt lists sitemap.xml and sitemap.rss.

## Size (sitemaps, 23 Oct 2026)

| Sitemap | URLs |
|---|---|
| Posts | 866 |
| Products (`/product/…`) | 449 |
| Pages | 18 |
| Post tags | 172 |
| Product tags | 115 |
| Categories | 28 |
| Product categories | 24 |
| Product reviews | 2 |

The 18 pages include theme and WordPress leftovers: `/sample-page/`, `/sample-page-2/`, `/sample-page-2-2/`, `/home-two/`, `/home-three/` and `/bshop/`.
- `/sample-page/` still shows WordPress's default text: "Hi there! I'm a bike messenger by day, aspiring actor by night…"
- `/home-two/` is the theme demo, with the text "Amazon Affiliate Theme… Multivendore Store".

## Publishing activity (post sitemap `lastmod`, by month)

This counts each post's last-modified month, not its publish date, so it is a proxy for activity.

| Month | Posts | | Month | Posts |
|---|---|---|---|---|
| 2024-01 | 27 | | 2025-11 | 35 |
| 2024-07 to 2024-11 | 11–18 each | | 2025-12 | 33 |
| 2025-04 | 66 | | 2026-01 | 35 |
| 2025-05 | 112 | | 2026-02 | 45 |
| 2025-06 | 35 | | 2026-03 | 46 |
| 2025-07 | 24 | | 2026-04 | 35 |
| 2025-08 | 83 | | 2026-05 | 26 |
| 2025-09 | 82 | | 2026-06 | 20 |
| 2025-10 | 35 | | 2026-07 | 30 |
| | | | 2026-08 | 9 |
| | | | 2026-09 | 4 |
| | | | 2026-10 (to the 23rd) | 0 |

Product pages peaked at 81 in Aug 2025. Since then they have run at 4–16 a month, with the last batch in Jul 2026.

## Pirated-software spam posts

- **How many.** 110 post URLs match "windows", "crack", "activator", "torrent", "eztv", "qxr", "rarbg", "magnet" and similar terms.
  - By last-modified month: 24 in Apr 2025, 85 in May 2025 and 1 in Jan 2026.
  - Example URLs: `/windows-10-pro-x64-crack-iso-all-in-one-latest/`, `/windows-11-with-activator-5gb-without-tpm-super-speed/`, `/windows-10-pro-x64-cracked-iso-image-5gb-rarbg/`, `/windows-10-offline-image-disk-directly-2022-no-defender-original-eztv/`.
- **What's on the page.** I checked `/windows-10-pro-x64-crack-iso-all-in-one-latest/`. The body starts "Size: 4.7Gb · Fast Download · Download Torrent", followed by spun text about Windows features.
  - The two download buttons link to `%DLINK1%` and `%DLINK2%`, unfilled placeholders from a bulk-posting template.
  - The schema author is "Sleek Buys", and the categories are "Deployment" and "Download".
- **Cloaking.** The page is identical, at 215,778 bytes, whether fetched as a browser or as Googlebot. So no cloaking was detected.
- **Context.** Scamadviser's cached snapshot of the site, about a year old, showed it advertising a "free student VPS / RDP server". The domain may have been used for other things before.

## Affiliate links (random sample of 60 of the 449 product pages)

- **Tagged short links.** All 43 unique `amzn.to` short links resolve to Amazon with `tag=sleekbuys2023-21`. One resolves to **amazon.com** with the US tag `sleekbuys-20`, which earns nothing from Indian buyers.
- **Untagged full links.** None of the 19 unique full `amazon.in` links carry an affiliate tag. The only "tag=" in them is Amazon's own search parameter `dib_tag=se`.
- **Flipkart.** None of the 6 Flipkart links carry an affiliate ID.
- **Page classification:**
  - 34 pages (57%) have only tagged store links.
  - 14 pages (23%) have at least one untagged Amazon or Flipkart link.
  - 12 pages (20%) have no store link at all.
- **Where outbound links go.** Of 127 outbound links, 45 point to other blogs and brand sites: stylewhirl.com 8, mensxp.com 6, thecoolhour.com 5, morjas.com 4, thestylecreation.com 4, johnlewis.com 3, nykaa.com 2, mywishcare.com 2, and others.
- **No affiliate disclosure** ("As an Amazon Associate I earn…" or similar) appears on the homepage or any of the 60 sampled product pages.

## Status of every sitemap URL (posts and products, 1,315 checked)

- 1,312 returned 200.
- 2 returned 500 ("There has been a critical error on this website"): `/product/why-the-samsung-10000mah-wireless-power-bank-is-the-ultimate-travel-companion/` and `/product/can-airpods-4-block-out-loud-sounds-better-than-older-models/`.
- 1 timed out: `/oneplus-buds-3-pro/`.

## Legal and trust pages

Every one of these returns **404**: /privacy-policy/, /privacy/, /about/, /about-us/, /terms-and-conditions/, /terms/, /disclaimer/, /affiliate-disclosure/, /disclosure/, /cookie-policy/.

The contact page gives "5183 Poston Dr San Jose, CA 95136" and **sleekbuysllc@gmail.com**.

## Other page problems seen in the HTML

- **Prices.** Rupee prices show with a "$" sign ("Price $ 16,052.00"), and some show "$0.00".
- **Ratings.** Most show "0.0".
- **Placeholder and template text.**
  - "Sold by: Admin".
  - Lorem ipsum in the sign-in and sign-up panels ("If you do not have accaount…").
  - The compare widget says "choose not empty group".
  - The footer reads "Copyright ©sleekbuys 2018".
- **Coupons page (`/product-coupons/`).** It shows only the theme's demo coupons, for example "Enjoy Up To 75% Discount On Audio Technica Headphones At **Daraz**". Six of them show "Expires 2019-08-23".
- **Travel page.** It shows phone news ("Vivo T5 5G Unveiled…"), not travel.
- **Share buttons.** They build broken URLs such as `http://https%3A%2F%2Fsleekbuys.com%2F…`.
- **Newsletter.** The form posts to `mdsalam.us13.list-manage.com/subscribe/post?u=458c676bde332b8e0d47e6d1a…`. The theme's public demo at themeim.com/wp/blurb/ uses **the same Mailchimp list ID**. So sign-ups go to the theme developer's list, not to SleekBuys. The block promises a "10% discount" for subscribing.

## Blog post quality (random sample of 40 posts)

- **Length.** Median 690 words of body text, mean 675.
- **Empty posts.** 3 of 40 had about 7 words: old 2024 posts whose content is missing.
- **Images.** 34 of 40 had no image inside the article body.
- **Topics.** Mostly launch news, leaks and rumours, for example "iPhone 18 Pro And Pro Max Price Leaks", "Tecno Pova 8 India Launch Date Confirmed", "OnePlus Turbo 6x Pro Launched…".
  - Off-topic items include "A Look at the Galgotias University Response", "Marvel's Wolverine…" and "Understanding Moltbot…".
- **Hidden characters.** One title ("Vivo Y500 Pro Launched…") contains 144 zero-width Unicode characters.

## Speed (Lighthouse 12.6, mobile preset with simulated throttling, homepage)

This is a lab test run from a cloud server. Real visitors may see different times, but page weight, script count and DOM size are properties of the page itself.

| Metric | Result |
|---|---|
| Performance score | **2 / 100** |
| Accessibility / Best practices / SEO | 73 / 68 / 85 |
| First Contentful Paint | 6.9 s |
| Largest Contentful Paint | **32.9 s** |
| Total Blocking Time | 3,290 ms |
| Cumulative Layout Shift | **0.848** (anything under 0.1 counts as good) |
| Speed Index | 13.0 s |
| Server response | 250 ms (good; the LiteSpeed cache is working) |
| Total page weight | **6.3 MB**, 167 requests |
| DOM size | 3,788 elements |
| Script tags in the homepage HTML | 65 (plus 30 stylesheet links) |
| Biggest third parties | Google ads 363 KB, Botpress chatbot 302 KB, AWS 140 KB, Google Fonts 140 KB |
| Unused JavaScript | about 790 KB |

Google's PageSpeed Insights API was over its daily quota, so I have no Chrome UX Report field data.

## YouTube feed check (RSS, 23 Oct 2026)

| Date | Views | Likes | Title (short) |
|---|---|---|---|
| 22 Oct | 80 | 1 | OPPO Find X10 Pro Max – Triple 200MP Camera Beast |
| 22 Oct | 398 | 3 | Infinix GT 50 Pro 5G 144Hz AMOLED |
| 20 Oct | 1,487 | 9 | OnePlus 16 vs iQOO 16 Specs, Camera & Battery Comparison |
| 19 Oct | 196 | 3 | OnePlus 16: The Ultimate Gaming Beast |
| 14 Oct | 610 | 4 | 3 NEXT-GEN FLAGSHIPS… iQOO 16 vs Xiaomi 18 Pro vs Motorola |
| 13 Oct | 676 | 7 | iQOO 19 BEYOND POWER 13000mAh |
| 12 Oct | 319 | 1 | GOODBYE AWS & GOOGLE CLOUD? Zoho… |
| 9 Oct | 293 | 1 | OPPO Find X10 Series Is Coming |
| 8 Oct | 516 | 5 | Vivo X500 Pro Max vs iPhone 18 Pro Max vs OPPO Find X10 Pro Max |
| 7 Oct | 2,671 | 17 | Vivo V80 vs Vivo V70 Elite – Which One Should You Buy? |
| 6 Oct | 66 | 0 | Amazon Great Indian Festival TOP 7 Smartphone Deals Under ₹50,000 |
| 2 Oct | 1,271 | 7 | Samsung Galaxy Tab S12 Ultra vs S12 Plus – Which One Should You Buy? |
| 1 Oct | 1,140 | 16 | 8 Gaming Phones That Can DESTROY Any Game |
| 30 Sep | 1,104 | 10 | Snapdragon 8 Elite Gen 6 vs Apple A20 Pro – Which Chip Wins? |
| 29 Sep | 2,400 | 8 | Vivo S2 FE & V80 – Next-Level Power & Style, Price & specs |

- **Overall.** Total 13,227 views: mean 882, median 610.
- **Format.** The six "vs" comparison Shorts averaged **about 1,280 views**. The other nine averaged **about 620**. That is a small sample, but the gap is about two to one.
- **Links.** None of the 15 descriptions contains a link of any kind, to the site or to a store.
