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
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (used for login redirects) |
| `CRON_SECRET` | Any long random string |

## Deploy

The Vercel project uses `obie` as its Root Directory, so it builds only this folder.
