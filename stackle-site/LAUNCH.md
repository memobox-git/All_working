# Launch runbook: new stackle.io

What changes: the public pages of stackle.io move from the Lovable app to this static site (`stackle-site/`, hosted on Netlify).
The Lovable app keeps running, unchanged, at **learn.stackle.io**: it still does sign-up, sign-in, course checkout (Stripe),
the learner dashboard and the tutor/admin tools. The AI resume coach at **app.stackle.io** (Vercel) isn't touched.

```
stackle.io        → Netlify, this site          (was Lovable)
www.stackle.io    → Netlify, redirects to stackle.io
learn.stackle.io  → Lovable app                  (new subdomain)
app.stackle.io    → AI resume coach on Vercel    (unchanged)
```

Every old app URL on stackle.io (`/auth`, `/learner`, `/learn/...`, `/tutor/...`, `/admin/...`, `/courses/<id>/enrollment-success`,
`/academy/success`, `/webinars`, hidden course slugs, …) is redirected to the same path on learn.stackle.io by `public/_redirects`,
so links in old emails, Stripe success URLs and bookmarks keep working.

DNS today (checked 20 Oct 2026): nameservers are NS1 (`dns1.p06.nsone.net`…), which is the provider behind **Netlify DNS**, so the
zone is most likely in your Netlify team under **Domains**. `stackle.io` and `www` point to Lovable (`185.158.133.1`).

## 1. Move the Lovable app to learn.stackle.io (do this first, about 15 min)
1. Lovable → the Stackle project → **Settings → Domains → Connect domain** → `learn.stackle.io`.
2. Add the DNS records Lovable shows you (usually an A record and a TXT verification record) in your DNS (Netlify → Domains → stackle.io).
3. Wait until Lovable shows learn.stackle.io as **Active**. Keep stackle.io connected in Lovable for now.
4. Open https://learn.stackle.io/auth and sign in as a student to confirm it works.

## 2. Supabase auth URLs (2 min)
Supabase → project **stackle-base** → Authentication → URL Configuration:
- **Redirect URLs:** add `https://learn.stackle.io/**`. Keep the existing stackle.io entries (the redirects forward them).
- **Site URL:** change to `https://learn.stackle.io` so confirmation and password-reset emails land on the app directly.

## 3. Create the Netlify site (10 min)
1. Netlify → **Add new project → Import an existing project → GitHub** → `memobox-git/All_working`.
2. Branch: `main` (after this branch is merged). **Base directory:** `stackle-site`. Build command and publish directory come from `stackle-site/netlify.toml` (`npm run build`, `out`).
3. **Environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://wvdwisoaotkuyvcyybps.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the project's anon/publishable key (Supabase → Project Settings → API; it's the same public key the Lovable app uses)
   - `NEXT_PUBLIC_APP_URL` = `https://learn.stackle.io` (optional, that's the default)
4. Deploy and check the `*.netlify.app` URL with the test list in step 5.

## 4. Switch the domain (5 min, then up to an hour for DNS)
1. Netlify → the new site → **Domain management → Add a domain** → `stackle.io` (Netlify offers to add `www` too; say yes).
2. In DNS, remove the old `stackle.io` and `www` A records that point to `185.158.133.1`. Netlify DNS creates its own records for the site.
3. Wait for Netlify to issue the HTTPS certificate (a few minutes).
4. Lovable → Settings → Domains → **remove stackle.io** (keep learn.stackle.io).

## 5. Test (15 min, on your phone and laptop)
- [ ] Home, Academy, both course pages, Career, Resources and a few resource pages load.
- [ ] Course page → pick a cohort → **Enroll** opens learn.stackle.io → sign up/in → Stripe checkout opens. (Don't pay; close the tab.)
- [ ] Career → **Get started for $250** opens Stripe checkout. (Don't pay.)
- [ ] Data Analyst course → **Notify me** with your own email → "You're on the list".
- [ ] https://stackle.io/auth goes to learn.stackle.io/auth; a student can log in and see their dashboard.
- [ ] https://stackle.io/resources/sql-interview-questions and the other old resource URLs load.
- [ ] https://stackle.io/sitemap.xml lists the pages. Submit it in Google Search Console.
- [ ] Google Analytics (G-805Y4K5PCP) shows a realtime visit.

## Rolling back
Point `stackle.io`/`www` back to `185.158.133.1` in DNS and reconnect stackle.io in Lovable. Nothing in Supabase, Stripe or the
Lovable app changes, so a rollback is only DNS.

## After launch (optional)
- learn.stackle.io still shows the old Lovable homepage at `/`. Ask Lovable to redirect `/` to `https://stackle.io`.
- When a cohort fills or new dates are added in Supabase, the site shows them right away in the browser; the static HTML catches up
  on the next deploy (Netlify → Deploys → Trigger deploy, or any push).

## Things for you to confirm or fix (not blocking launch)
**Security**
- Supabase shows row-level security turned off on 4 tables. I did not change it. Ask Lovable or run the fix SQL from the
  Supabase advisor after checking the app still works.

**Copy and numbers**
- Community numbers (13K LinkedIn followers, 3.9K Meetup members, 511 at one free workshop) come from your intro script. Update `content/site.ts` if
  they've moved.
- The three "rejection reasons" on the homepage come from your scripts and were marked [CHECK] there.
- Reviews and testimonials are hidden because they can't be tied to a course. The 22 Data Engineering reviews predate the
  course. Add real quotes with names and permission in `content/site.ts` when you have them.
- "Data Engineer at Meta" is not on the site. Add it if you want it public.
- Salary ranges in the AI Engineer roadmap have no source. Keep, source, or remove them.

**Course data in Supabase**
- The AI course says 8 weeks in some places and 10 in others. The Data Analyst course has 10 weeks, but its URL and
  description say 8.
- Data Engineering week 4 repeats the Spark description.

**Product gaps**
- The $1,997 Career track has no online checkout; the site sends people to book a call.
- The SQL cheat sheet is now a direct download with no email gate.
- The legal pages are short and there is no refund policy.
