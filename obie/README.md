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

## Database

OBIE uses the Supabase project "Stacklebot". The schema is in [`supabase/migrations/`](supabase/migrations/): eleven tables with row-level security (each owner sees only their workspace), the `ltree` extension for agent paths, a `credit_balances` view, and Realtime on `messages`, `tasks` and `approvals`.

## Login setup (Supabase dashboard, once)

1. Authentication > URL Configuration: set **Site URL** to the Vercel production URL, and add these **Redirect URLs**:
   - `https://YOUR-VERCEL-DOMAIN/**`
   - `https://obie-*-memobox-gits-projects.vercel.app/**` (preview deployments)
   - `http://localhost:3000/**`
2. Optional, so email links work even when they open inside an email app's own browser: in Authentication > Email Templates, change the link in **Magic Link** and **Confirm signup** to `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`.
3. Optional, for Google sign-in: create an OAuth client (type: Web application) in Google Cloud > APIs & Services > Credentials, with the redirect URI `https://oshlofyxapvmgxvkldub.supabase.co/auth/v1/callback`. Paste its client ID and secret into Supabase > Authentication > Sign In / Providers > Google, and turn it on. The login page shows the Google button as soon as it is on.

## Deploy

The Vercel project uses `obie` as its Root Directory, so it builds only this folder.
