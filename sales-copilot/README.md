# Live Sales Copilot

Listens to your sales call and, the moment the prospect asks something, pushes back or names a competitor, shows you what to say next, based on your own playbook.

It's a single file (`index.html`) that runs in Chrome or Edge. There's nothing to install and no server. Your keys and notes stay in your browser.

**Live at https://live-sales-copilot.netlify.app.** Open it in Chrome or Edge, or open `index.html` directly.

## Setup (about 2 minutes)

1. **Open `index.html` in Chrome or Edge.** Double-click it, or drag it into a browser window.
2. **Settings → Keys**
   - **Anthropic API key** (required): powers the suggestions. Create one at [console.anthropic.com](https://console.anthropic.com/settings/keys).
   - **Deepgram API key** (recommended): turns the call audio into text and hears both sides of an online call. Sign up at [console.deepgram.com](https://console.deepgram.com/signup); new accounts get free credit. Without it the app uses the browser's free speech recognition, which only hears your microphone.
3. **Settings → Your playbook (optional).** Without a playbook, the copilot answers from Claude's own knowledge. When you're ready, fill in the template (what you sell, pricing, proof points, competitors, how you answer objections) and answers about your company come from it. You can paste existing sales docs or load a `.txt` or `.md` file.
4. Click **Test drive** to watch a sample call play out with a made-up company.

## On a call

1. Click **Start call** and choose where the call is happening:
   - **On this computer (Zoom, Meet, Teams…)**: Chrome asks what to share. Pick the **tab** with your call and switch on **Also share tab audio**. On Windows you can pick **Entire screen** and switch on **Also share system audio**, which also covers the Zoom and Teams desktop apps. On a Mac, join the call in a browser tab (Meet, or the Zoom or Teams web app). **Wear headphones** so your mic only picks up you.
   - **Speakerphone or in person**: the app listens through your mic only.
2. Optionally add a line about who you're calling and your goal for the call.
3. Talk normally. Cards appear on the left:
   - **The big line** is something you can say word for word.
   - **The bullets** are supporting facts. With a playbook, facts about your company come from it, and if something isn't covered the card says so instead of making it up. Without one, it answers from Claude's own knowledge and flags anything you should confirm, such as your exact price.
   - **Then ask** is a follow-up question that moves the deal forward.
4. Shortcuts:
   - **Space**: get a card for this exact moment.
   - **/**: type a private question, for example "what's our refund policy?"
   - **Esc**: cancel a card that's still being written.
5. **Pop out** opens a small window that stays on top of Zoom, so you don't have to switch windows.
6. When the call ends, **Wrap-up** writes a summary, next steps, a ready-to-send follow-up email and a couple of coaching tips. **Download** saves the transcript.

**Practise before a real call:** type an objection into the box and press **Prospect said** to see how the copilot would answer it.

## Save calls to your database (Stacklebot on Supabase)

Every call's transcript, suggestions and wrap-up can be saved to the `copilot_calls` table in your Stacklebot Supabase project. You can reopen calls from **Calls**.

One-time setup:
1. In [Supabase → Stacklebot → Edge Functions → Secrets](https://supabase.com/dashboard/project/oshlofyxapvmgxvkldub/functions/secrets), add a secret named `COPILOT_SYNC_CODE`. Set its value to a code you make up, at least 8 characters, like a password.
2. In the copilot, open **Settings → Save calls to your database**, type the same code, and press **Check**. It should say "Connected". Then press **Save**.

From then on, each call is saved every 45 seconds while it runs, again when it ends, and again with its wrap-up. Test drives and practice lines aren't saved.

How it works:
- The page talks to the `copilot-calls` edge function (`supabase/functions/copilot-calls`). The function only answers requests that carry your sync code.
- The table has row-level security on and no policies, so your project's public key can't read or change it. Only the function can.
- The table is defined in `supabase/migrations/`.

## Tips

- **Playbook quality = answer quality.** Specific numbers, customer stories and your exact objection responses make the cards much sharper.
- **Speed vs. quality:** Claude Opus 5.5 (the default) gives the sharpest answers. If cards feel slow, switch to Sonnet 5.5 or Haiku 5.5 in Settings. Each card shows how many seconds it took.
- **Cost:** the panel under the card shows a running estimate of the AI cost for the call. Expect a few cents per card on Opus, and much less on Haiku. Deepgram bills separately per minute of audio.
- **Too many cards?** Settings → Suggestions → "Only when I press Help me now."
- **Mixed-language calls** (e.g. Hinglish): Settings → Call language → "Mixed languages".

## Privacy and consent

Audio goes to Deepgram (or to Google, if you use the browser's free speech engine) to become text. The text goes to Anthropic to produce suggestions. Nothing is stored anywhere except your own browser. Recording or transcribing calls can require the other person's consent depending on where you and they are, so tell people the call is being transcribed when the law requires it.

## Troubleshooting

During a call, the top of the transcript panel shows a sound meter and a status for each source (Prospect, You, or Mic). If the transcript stays empty, read what it says there. It tells you whether sound is reaching the page, whether words are coming back, and what to change. **Check** buttons next to both keys in Settings confirm the keys work before a call.

| Problem | Fix |
|---|---|
| Nothing appears and there's a red message about the speech engine | You're using the free browser engine in a browser that doesn't include it (Brave, Opera, Arc, Vivaldi, or an app's built-in browser). Open the page in Google Chrome or Microsoft Edge, or add a Deepgram key. |
| "No sound from the call yet" | The wrong tab was shared, or "Also share tab audio" was off. End the call and start again. |
| "Your microphone is silent" | Unmute your mic, or pick the right one from the icon at the left of the address bar. |
| "Hearing sound, but no words are coming back" | Check Settings → Call language matches the call. |
| "No audio was shared" | When Chrome asks what to share, switch on **Also share tab audio** (or **system audio** for the whole screen). |
| Only your side shows up | You probably picked a tab without the call, or audio sharing was off. End the call and start again. |
| Your words show up as "Prospect" | You're on speakers. Use headphones. |
| "Couldn't connect to Deepgram" | Check the Deepgram key and that the account has credit. |
| "Anthropic rejected the API key" | Re-paste the key in Settings. Make sure the account has billing set up. |
| "This API key is not scoped to a workspace…" | Your key belongs to your whole Anthropic organization. In Settings, paste the **Anthropic workspace ID** (Anthropic Console → Settings → Workspaces, starts with `wrkspc_`), or create a new key inside a workspace. Press **Check key** to confirm. |
| Pop out does nothing | Needs Chrome or Edge version 116 or newer. Alternatively, place this window side by side with your call. |
