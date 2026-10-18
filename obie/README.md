# OBIE

**One Business, Infinite Employees.** An AI team for one-person businesses. Stackle is customer number one.

- Project rules for Claude Code: [`CLAUDE.md`](CLAUDE.md)
- The build plan, one prompt per step: [`docs/build-plan.md`](docs/build-plan.md)

## Run it locally

```bash
cd obie
npm install
cp .env.example .env.local   # fill in the keys
npm run dev                  # http://localhost:3000
```

The home page runs without any keys. Login and everything after it need the Supabase keys.

## Environment variables

Every key is listed in [`.env.example`](.env.example). Add the same keys in Vercel under Project > Settings > Environment Variables.

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API Keys > anon (or publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API Keys > service_role (secret) |
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys |
| `TRANSCRIBE_PROVIDER` | `elevenlabs`, `deepgram` or `openai` |
| `ELEVENLABS_API_KEY` / `DEEPGRAM_API_KEY` / `OPENAI_API_KEY` | Only the one for your chosen provider |
| `CRON_SECRET` | Any long random string |
| `UNIPILE_DSN` | Unipile dashboard (shown at the top), e.g. `api8.unipile.com:13851` |
| `UNIPILE_API_KEY` | Unipile dashboard > Access tokens |
| `UNIPILE_WEBHOOK_SECRET` | Any long random string |

## Database

OBIE uses the Supabase project "Stacklebot". The schema is in [`supabase/migrations/`](supabase/migrations/): eleven tables with row-level security (each owner sees only their workspace), the `ltree` extension for agent paths, a `credit_balances` view, and Realtime on `messages`, `tasks` and `approvals`.

## Login setup (Supabase dashboard, once)

1. Authentication > URL Configuration: set **Site URL** to the Vercel production URL, and add these **Redirect URLs**:
   - `https://YOUR-VERCEL-DOMAIN/**`
   - `https://obie-*-memobox-gits-projects.vercel.app/**` (preview deployments)
   - `http://localhost:3000/**`
2. Optional, so email links work even when they open inside an email app's own browser: in Authentication > Email Templates, change the link in **Magic Link** and **Confirm signup** to `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`.
3. Optional, for Google sign-in: create an OAuth client (type: Web application) in Google Cloud > APIs & Services > Credentials, with the redirect URI `https://oshlofyxapvmgxvkldub.supabase.co/auth/v1/callback`. Paste its client ID and secret into Supabase > Authentication > Sign In / Providers > Google, and turn it on. The login page shows the Google button as soon as it is on.

## LinkedIn inbox (Unipile)

`/app/inbox` connects the owner's LinkedIn. New DMs arrive by webhook, the Inbox agent drafts a reply in the owner's voice (claude-sonnet-5-5), and nothing is sent until the owner taps Send. LinkedIn has no public messaging API, so the connection goes through [Unipile](https://www.unipile.com) (from about EUR 49 a month for up to 10 accounts, 7-day free trial).

Setup, once:

1. Create a Unipile account. Copy the DSN and create an access token.
2. Add `UNIPILE_DSN`, `UNIPILE_API_KEY` and `UNIPILE_WEBHOOK_SECRET` in Vercel, then redeploy.
3. Apply the migration `supabase/migrations/20261018120000_obie_inbox.sql`.
4. Open `/app/inbox` on the **production** URL and tap Connect LinkedIn. Unipile calls back `/api/unipile/accounts` and `/api/unipile/messages`, so they must be reachable without Vercel's preview protection, and localhost won't receive them.

How it works:

- `lib/unipile.ts` is the Unipile REST client. One API key serves every workspace; each workspace's Unipile account id lives in `connected_accounts`.
- `app/api/unipile/accounts` runs when the LinkedIn sign-in finishes: it saves the account, creates a message webhook for it, then syncs the last 25 chats and drafts replies to up to 5 recent ones waiting on the owner.
- `app/api/unipile/messages` stores each new message, waits 8 seconds in case more are coming, then drafts one reply. A message the owner sends from the LinkedIn app clears the open draft.
- `lib/inbox/store.ts` does every write with the service role. Owners can only read the inbox tables, because the stored Unipile ids decide which account a reply goes out from.
- Every reply waiting for the owner is also an `approvals` row (kind `reply`). Sending approves it, Skip rejects it.
- Sends are capped at 60 per workspace per 24 hours (Unipile advises at most about 100 LinkedIn messages a day).

## Deploy

The Vercel project uses `obie` as its Root Directory, so it builds only this folder.
