You are building OBIE (One Business, Infinite Employees): an app where a one-person business gets a team of AI agents that run its sales, marketing, customers, product and operations. I am the founder and I test everything from my phone.

CORE IDEAS
- OBIE: the agent the owner talks to first, and the face of the product. OBIE chats by voice or text, learns the business, builds the Business Profile, recommends the team, and stays pinned at the top of the sidebar as the front desk ("OBIE, add an Instagram agent").
- Stacks: the business areas. Defaults are Sales, Marketing, Product, Customers and Operations. OBIE can suggest custom stacks (for example Community or Podcast), and the owner can ask OBIE to create one anytime.
- Three agent levels:
  - Main agent: one per stack. Only main agents and OBIE appear in the sidebar.
  - Subagents: one per area inside a stack. They live inside channels.
  - Nano agents: do exactly ONE task, then disappear. This rule is never overridden.
- Channels: every major goal gets its own channel. Agents post the plan, status updates and approval requests there. Nano agent chatter goes in threads, not the main channel.
- Tasks form a dependency graph (depends_on). A task starts automatically when everything it depends on is done. Agents never poll each other.
- Approvals: anything sent, posted or published in the owner's name, and anything that spends money, needs the owner's approval first.
- Credits: every action costs credits. Show the estimate before running, reserve credits on approval, and refund failed tasks and redos. Every workspace gets 100 daily credits.
- Points: agents earn points for approved, on-time work. More points means more autonomy later.
- One owner per workspace, but put workspace_id on every table from day one.

TECH
- Next.js (App Router) + TypeScript + Tailwind
- Supabase: Postgres, Auth, Storage, Realtime. Row-level security on every table.
- Deploy on Vercel.
- Anthropic API models:
  - claude-sonnet-5-5: main agents, planning, writing
  - claude-haiku-5-5: nano jobs, classification, routing
  - claude-opus-5-5: only for rare deep planning
- Transcription lives behind one file (lib/transcribe.ts) so the provider can be swapped.
- Log every model call: tokens, cost, which agent made it.

DESIGN RULES
- Mobile-first. I build and test from my phone.
- Font: Plus Jakarta Sans everywhere.
- Colors: white, blue, black, yellow. No gold, no burgundy, no black-and-gold look.
- No emojis anywhere in the UI.
- Never use the word "candidate" anywhere in the product.
- Layout like Slack, but cleaner and calmer.
- OBIE's look: a glossy blue orb with a friendly face and a small yellow star above it. The star is a status light: steady when idle, sparkling while working. Main agents are smaller orbs with initials. Nano agents are tiny dots that appear, do their task and fade out.

WORKING RULES
- Build in small steps. After each step, tell me exactly how to test it on my phone.
- Secrets go in environment variables only. Never commit keys.
- Database changes go in migration files.
- If something is unclear, make a sensible choice, tell me in one line, and keep going.

PROJECT NOTES
- The app lives in `obie/` inside the All_working repo. Run every command from `obie/`. On Vercel the project's Root Directory is `obie`.
- The full build plan, with the numbered prompts, is in `docs/build-plan.md`.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.
- Next.js 16: request interception lives in `proxy.ts` (the old `middleware.ts`), and Cache Components is on, so anything that reads cookies or headers sits behind a `<Suspense>` boundary. Read `node_modules/next/dist/docs/` before using an API you are unsure of.
- Supabase clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server components, route handlers, server actions), `lib/supabase/admin.ts` (service role, server only, bypasses RLS), `lib/supabase/proxy.ts` (session refresh).
- Colors are tokens in `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `text-accent` and so on). Use the tokens, not raw hex values, so light and dark mode both work.
- The OBIE avatar is `components/obie-orb.tsx`. Its `state` prop drives the star: `idle` (steady), `working` (sparkles), `listening` (the orb pulses).

@AGENTS.md
