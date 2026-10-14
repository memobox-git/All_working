---
name: hormozi-style
description: Write or rewrite any video script, hook, intro, LinkedIn post, email, or chat reply in Alex Hormozi's real speaking style, built from measured patterns in about 38,000 words of his actual transcripts. Use this whenever the user says Hormozi, Alex Hormozi, "Mozi style", "like Hormozi", "Hormozi voice", "make it sound like Alex", or asks for a direct, no-nonsense business-YouTuber voice, even if they only say "his style" after Hormozi came up earlier. Works alongside stackle-script for Stackle videos and stackle-linkedin-posts for posts.
---

# Hormozi style

## The one thing to get right

Hormozi sounds like a smart friend explaining something out loud. He does not sound like a motivational poster. Most attempts fail because they write clipped fragments ("Base. Not bonus. Not stock.") and slogans he never says. His real transcripts show flowing, medium-length sentences joined with "And so", a "let's say" scenario or some math to make the point concrete, and one short line to land the point at the end.

If a draft reads like a list of slogans, it is wrong, even if every slogan is punchy.

## His measured fingerprint

These numbers come from seven of his YouTube videos and one solo podcast episode (about 38,000 words). Run `scripts/style_check.py` on a draft to compare.

| Measure | Hormozi | Aim for |
|---|---|---|
| Median sentence length | 13 words (mean 16) | 12 to 16 |
| Sentences of 5 words or fewer | 14% | 8% to 15% |
| Sentences of 20 words or more | 28% | 18% to 30% |
| Sentences starting with "And so" | about 1 in 9 | often, but not every sentence |
| Contractions | about 3.7 per 100 words | use them naturally |

His most common connectors, in order: "and so", "so", "because", "if you", "right?", "you know", "here's", "I think", "which is", "which means", "let's say", "the thing is", "number one".

Phrases people think he says but that never appear in the transcripts: "Simple. Not easy.", "Here's the thing", "game changer". Leave them out.

## The moves, and why they work

1. **State the topic straight away.** He opens with "In this video, I'm going to..." and says exactly what he will argue. He doesn't tease, because the clarity is the hook.
2. **Number the points.** He says "Number one is..." and each point runs the same way: a short rule, the reason ("because", "if you think about it"), an example, then one short line to land it. Numbering keeps a long video easy to follow.
3. **Define words in plain speech: "X just means Y."** Then he often adds a mirror pair: "If you have a lot of it, you put a little in and get a lot out. If you have a little, you put a lot in and get a little out." Viewers remember a definition when they hear both sides.
4. **Make it concrete with "Let's say...", "Imagine..." or "If you think about...".** He walks the viewer into a scene instead of stating a principle. He sometimes pushes it to the extreme ("if you think about the hypothetical extreme of focus...") so the logic is impossible to miss.
5. **Do the math out loud,** one step at a time, then ask the money question ("Is that worth thirty-three million dollars?"). Numbers make the stakes real.
6. **Report real conversations:** "And they're like, '...' And I was like, '...'". Use this only for conversations the speaker actually had. If there is no real one, use a hypothetical like "someone on your team says..."
7. **Use reframes and mirror lines** that flip a common belief, such as "listen to the people closest to your goals, not closest to you." Write new ones. Don't reuse his.
8. **Land the point after the explanation, not before it,** with one short line like "That's the thing." or "They hire proof." The short line works because the long sentences came first.
9. **Use tag questions like "right?"** to keep the listener nodding along.
10. **Add a small honest aside** once or twice, such as self-aware humour or "this is easy to say, hard to do, so let me break it down."
11. **Be blunt, not cruel.** He can be crude on his own channel. For a professional channel, keep the directness and drop the insults.
12. **Close with one direct ask,** plus one "most people won't do this" line.

## What not to do (corrections from the user)

- **Don't write in machine-gun fragments.** A few short punch lines per section is the limit.
- **Don't answer a question nobody asked.** "The difference between those two numbers is not luck" was rejected with "Who asked?" Every line should give the viewer something they came for.
- **Don't let other style rules flatten the voice.** When Hormozi style is requested, contractions, "And so" openers and the occasional fragment are allowed, even if another skill forbids them.
- **Don't invent stories, clients or numbers for the speaker.** Use their real stories, or a "let's say" scenario, or leave a `[STORY: what kind of story fits here]` placeholder and ask them for it.
- **Don't copy Hormozi's lines or catchphrases word for word.** Write new lines in his rhythm.

## Workflow

1. **Get the content right first:** facts, numbers and sources. The style changes how things are said, never what is true.
2. **Draft in the voice,** using the moves above.
3. **Run the checker:** `python3 scripts/style_check.py <file>`, or pipe the text in. Fix anything outside the target bands, and remove any cliché it flags.
4. **Read it aloud.** If a line sounds like a poster, rewrite it as something you'd actually say to a friend across a table.
5. **Hand over the text.** If it's a rewrite, mention the two or three biggest changes in one line each.

## Using it with other skills

- **Stackle video scripts (stackle-script):** keep everything structural from that skill:
  - the hook, the exact phrase "In this video I am going to", and the standard intro;
  - sourced numbers, graphics labels, banned words and the call to action.

  Replace its sentence rules (complete sentences, no contractions) with this voice. Keep words simple, because many viewers speak English as a second language.
- **LinkedIn posts and other writing (stackle-linkedin-posts):** the numbers above come from spoken video. For written text, keep the moves, remove spoken filler ("um", "like", "you know", "kind of"), and keep sentences a little shorter.
- **Chat replies:** use the same moves, just smaller: one numbered list, one "let's say" example, and one landing line.

## Before and after

Rejected (slogan fragments):

> AI product manager jobs are paying up to three hundred and four thousand dollars a year. Base. Not bonus. Not stock. Base salary. And you don't need to be an engineer to get one. You need seven skills, learned in the right order. That's it. Simple. Not easy. But simple.

Approved (his real cadence):

> AI product manager jobs are paying up to three hundred and four thousand dollars a year in base salary right now. In this video I am going to show you exactly what I would do to get one of those jobs if I had to start from zero today.

Rejected:

> Four. Trade-offs. Quality, speed, cost. You can't max all three. Let's do the math. Say every answer costs one cent. Sounds like nothing.

Approved:

> Number four is trade-offs, and specifically quality, speed, and cost. And I want to do the math with you, because this is where it gets real. Let's say every answer costs you one cent. That sounds like nothing, right? But if you get a million questions a day, that's ten thousand dollars a day, which is three point six five million dollars a year.

For short real examples of each move taken from his transcripts, and for how to refresh this research, read `references/transcript-evidence.md`.
