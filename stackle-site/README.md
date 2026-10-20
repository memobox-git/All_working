# stackle.io

The public website for Stackle: the homepage, the Academy (live cohorts), the career service, the free resource library and the legal pages.
A static Next.js 16 site (`output: "export"`), hosted on Netlify. Design rules are in [DESIGN.md](DESIGN.md); launch steps are in [LAUNCH.md](LAUNCH.md).

## Run it

```bash
cd stackle-site
npm install
cp .env.example .env.local   # add the Supabase anon key
npm run dev                  # http://localhost:3000
npm run build                # writes the static site to out/
```

## Where things come from

| What | Source |
|---|---|
| Courses, cohort dates, weekly curriculum, prerequisites, price | Supabase `stackle-base` (read at build time; cohort dates refresh live in the browser). Falls back to `content/courses.snapshot.json` (`npm run snapshot` to refresh it). |
| Course page copy (titles, subtitles, outcomes, FAQ) | `content/courses.ts` |
| Site-wide facts: links, emails, Chris's bio, community numbers | `content/site.ts` |
| Resource library list | `content/resources.ts` |
| Resource page content | `content/resources/<slug>.json` (extracted from the old site; each has a `.notes.md`) |
| Enroll, sign-in, learner dashboard | The Lovable app at learn.stackle.io (`NEXT_PUBLIC_APP_URL`) |
| Career checkout | Supabase function `create-resume-checkout` (Stripe) |
| "Notify me" and cheat-sheet emails | Supabase `waitlist` table |
| Old app URLs | `public/_redirects` sends them to learn.stackle.io |
