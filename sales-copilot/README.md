# Live Sales Copilot

Listens to your sales call and, the moment the prospect asks something, pushes back or names a competitor, shows you what to say next, based on your own playbook.

It's a single file (`index.html`) that runs in Chrome or Edge. There's nothing to install and no server. Your keys and notes stay in your browser.

## Setup (about 2 minutes)

1. **Open `index.html` in Chrome or Edge.** Double-click it, or drag it into a browser window.
2. **Settings → Keys**
   - **Anthropic API key** (required): powers the suggestions. Create one at [console.anthropic.com](https://console.anthropic.com/settings/keys).
   - **Deepgram API key** (recommended): turns the call audio into text and hears both sides of an online call. Sign up at [console.deepgram.com](https://console.deepgram.com/signup); new accounts get free credit. Without it the app uses the browser's free speech recognition, which only hears your microphone.
3. **Settings → Your playbook.** Fill in the template: what you sell, pricing, proof points, competitors, and how you answer common objections. You can paste existing sales docs or load a `.txt` or `.md` file.
4. Click **Test drive** to watch a sample call play out with a made-up company.

## On a call

1. Click **Start call** and choose where the call is happening:
   - **On this computer (Zoom, Meet, Teams…)**: Chrome asks what to share. Pick the **tab** with your call and switch on **Also share tab audio**. On Windows you can pick **Entire screen** and switch on **Also share system audio**, which also covers the Zoom and Teams desktop apps. On a Mac, join the call in a browser tab (Meet, or the Zoom or Teams web app). **Wear headphones** so your mic only picks up you.
   - **Speakerphone or in person**: the app listens through your mic only.
2. Optionally add a line about who you're calling and your goal for the call.
3. Talk normally. Cards appear on the left:
   - **The big line** is something you can say word for word.
   - **The bullets** are supporting facts from your playbook. If something isn't in your playbook, the card says so instead of making it up.
   - **Then ask** is a follow-up question that moves the deal forward.
4. Shortcuts:
   - **Space**: get a card for this exact moment.
   - **/**: type a private question, for example "what's our refund policy?"
   - **Esc**: cancel a card that's still being written.
5. **Pop out** opens a small window that stays on top of Zoom, so you don't have to switch windows.
6. When the call ends, **Wrap-up** writes a summary, next steps, a ready-to-send follow-up email and a couple of coaching tips. **Download** saves the transcript.

**Practise before a real call:** type an objection into the box and press **Prospect said** to see how the copilot would answer it.

## Tips

- **Playbook quality = answer quality.** Specific numbers, customer stories and your exact objection responses make the cards much sharper.
- **Speed vs. quality:** Claude Opus 5.5 (the default) gives the sharpest answers. If cards feel slow, switch to Sonnet 5.5 or Haiku 5.5 in Settings. Each card shows how many seconds it took.
- **Cost:** the panel under the card shows a running estimate of the AI cost for the call. Expect a few cents per card on Opus, and much less on Haiku. Deepgram bills separately per minute of audio.
- **Too many cards?** Settings → Suggestions → "Only when I press Help me now."
- **Mixed-language calls** (e.g. Hinglish): Settings → Call language → "Mixed languages".

## Privacy and consent

Audio goes to Deepgram (or to Google, if you use the browser's free speech engine) to become text. The text goes to Anthropic to produce suggestions. Nothing is stored anywhere except your own browser. Recording or transcribing calls can require the other person's consent depending on where you and they are, so tell people the call is being transcribed when the law requires it.

## Troubleshooting

| Problem | Fix |
|---|---|
| "No audio was shared" | When Chrome asks what to share, switch on **Also share tab audio** (or **system audio** for the whole screen). |
| Only your side shows up | You probably picked a tab without the call, or audio sharing was off. End the call and start again. |
| Your words show up as "Prospect" | You're on speakers. Use headphones. |
| "Couldn't connect to Deepgram" | Check the Deepgram key and that the account has credit. |
| "Anthropic rejected the API key" | Re-paste the key in Settings. Make sure the account has billing set up. |
| Pop out does nothing | Needs Chrome or Edge version 116 or newer. Alternatively, place this window side by side with your call. |
