# AI Product Manager Roadmap: Script

**Title:** AI Product Manager Roadmap 2026: Skills, Salary and 5 Phases

**Spoken words:** about 1,806 · **Estimated length:** about 12 minutes at 150 words a minute

**Style:** Modelled on real Alex Hormozi transcripts (seven YouTube videos and one solo podcast episode, about 38,000 words). He talks in flowing, medium-length sentences (median 13 words), not clipped fragments. He links ideas with "And so", "if you think about it", "which means" and "right?". He defines terms in plain words ("X just means Y"), uses mirror pairs, works through "let's say" scenarios and the math out loud, and lands each point with one short line.

---

## Hook

**[Graphic 1, full screen]** A real job ad with "$304,000" circled, and "base salary" under it.

*[pause]*

AI product manager jobs are paying up to three hundred and four thousand dollars a year in base salary right now.

*[pause]*

## Promise

**[On camera]**

In this video I am going to show you exactly what I would do to get one of those jobs if I had to start from zero today. The job, the pay, the seven skills, and the five phases, each with a test at the end.

## Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[On camera]** *(Chris to confirm.)*

And AI product managers work with engineers like me every single day, so I'm going to tell you what we actually need from you.

*[pause]*

## Part 1: The job

**[On camera]**

A product manager just means the person who decides what gets built and why. An AI product manager does the same thing, with one extra problem, which is that the product doesn't behave the same way twice.

**[Graphic 2, full screen]** Left: "Normal software: same click, same result." Right: "AI: same question, different answer."

*[pause]*

If you think about normal software, you click the same button, you get the same result. With AI, you ask the same question and you can get a different answer, and sometimes it's wrong with total confidence, right?

*[pause]*

**[Graphic 3, full screen]** A bank chatbot. Monday: the right answer, with a green tick. Tuesday: the same question in different words, and an invented fee in red.

So let's say you run a bank chatbot. On Monday, someone asks about late fees and it nails it. On Tuesday, someone asks the same thing in different words, and it makes up a fee that doesn't exist. Somebody has to catch that before the customers do, and that somebody is you.

*[pause]*

**[On camera]**

And so the job has two halves: deciding what to build, and knowing whether the AI is good enough, what it costs, and how you prove it. Product managers usually have the first half. Engineers usually have the second. The people getting hired have both.

## Part 2: The money

**[On camera]**

Now let's talk about money. These are real job ads posted in the US between August and October 2026, and they're base salary, which just means the pay before bonus or stock.

*[pause]*

**[Graphic 4, full screen]** Three rows. Entry: $120K to $185K. Senior: $130K to $210K. Lead and principal: $140K to $304K. A small note: "Smaller city or non-tech company: closer to $90K at entry."

At the entry level, which is associate and new grad, it's roughly one hundred twenty to one hundred eighty-five thousand. One new grad AI PM job at a big social media company lists one hundred twenty-two to one hundred eighty-four thousand. In a smaller city or outside tech, it can be closer to ninety.

At the senior level, it's roughly one hundred thirty to two hundred ten thousand. At lead and principal, the lowest I found was one hundred forty thousand. The highest was three hundred four thousand, for a principal PM working on vision AI, which just means AI that understands images and video. And that wasn't at an AI lab. It was at a restaurant software company.

**[Graphic 5, full screen]** "Base: up to $304K posted." Under it: "All US PMs, total pay median: $230K (Levels.fyi)."

And that's all base. Add bonus and stock, and the median US product manager makes about two hundred thirty thousand a year. That's from Levels.fyi, where tech workers share their pay.

*[pause]*

**[On camera]**

And so what moves you up isn't just years. It's the size of the decisions people trust you with. Outside the US, the numbers are lower, but the skills are the same.

## Part 3: The seven skills

**[On camera]**

So now the skills. I went through the job ads, and the same seven kept showing up.

**[Card beside you]** 1. LLMs. 2. RAG, agents, fine-tuning. 3. Evals. 4. Trade-offs. 5. Data. 6. Prototypes. 7. Specs.

*[pause]*

**[Graphic 6, full screen]** A phone keyboard guessing the next word. Three labels: "Token: about 3/4 of a word." "Context window: how much it can read at once." "Hallucination: false, but confident."

Number one is knowing how LLMs work. LLM just means large language model, the thing behind ChatGPT, Claude, and Gemini, and all it's doing is predicting the next word, kind of like your phone keyboard. You need three words. A token is a chunk of text, about three quarters of a word, and every token costs money. The context window is how much the model can read at once. And a hallucination is when it says something false with total confidence, like our bank chatbot.

*[pause]*

**[Graphic 7, full screen]** Three tiles. RAG: "Looks it up, then answers." Agent: "Does things, not just says things." Fine-tuning: "Trained on your examples."

Number two is knowing the three ways teams build with LLMs. RAG, or retrieval augmented generation, just means the AI looks things up in your documents before it answers, like a support bot reading the refund policy. Agents are AIs that do things instead of just saying things, so they book the meeting or update the ticket. And fine-tuning means training an existing model on your own examples so it learns a style or a narrow task. You won't build these, but if you can't tell which one a problem needs, you're not the PM. You're a spectator.

*[pause]*

**[Graphic 8, full screen]** A test sheet: question, good answer, AI answer, pass or fail. At the bottom: "190 / 200 = 95%. Ship it?"

Number three is evals, and if you only take one thing from this video, take this. An eval is just a test for your AI. You take real questions, write down what a good answer looks like, and score the AI on every one. So let's say your bank chatbot gets one ninety out of two hundred right. That's ninety-five percent, and deciding if that's good enough to launch is your job.

*[pause]*

**[Graphic 9, full screen]** An inbox and a junk folder. Precision: "When it flags something, is it right?" Recall: "Did it catch everything it should?"

And this isn't just a senior thing. One new grad AI PM job asks you to define evaluation frameworks using precision and recall. Precision means when the AI flags something, how often it's right. Recall means how much of what it should catch it actually catches. Think about a spam filter. High precision keeps your real emails out of junk, and high recall keeps the junk out of your inbox.

*[pause]*

**[Graphic 10, full screen]** The math builds line by line. "1 cent × 1,000,000 a day = $10,000 a day." "= $3.65 million a year." "Bigger model, 10× the price = $36.5 million a year." Last line: "Worth almost $33 million more?"

Number four is trade-offs between quality, speed, and cost, and speed here is called latency, which just means how long the user waits. So let's do the math. Say every answer costs one cent. A million questions a day is ten thousand dollars a day, which is three point six five million a year. Now someone says, "Let's use the bigger model, it's a bit smarter." It's also ten times the price, so your bill is thirty-six and a half million. Is "a bit smarter" worth almost thirty-three million more? That's literally the question they pay you to answer.

*[pause]*

**[Graphic 11, full screen]** A short SQL query: users who asked about refunds last week. Next to it, an A/B split: half see version A, half see version B.

Number five is data. If you can't pull your own numbers, you wait on someone else every single time. So learn SQL, which is just the language for asking a database questions. "How many users asked about refunds last week?" is one query. Then learn A/B tests, where half your users see the old version and half see the new one, because that's how you prove something worked.

*[pause]*

**[Graphic 12, full screen]** A written description, an arrow, and a working app.

Number six is prototypes, which just means a rough version people can click on. Tools like Cursor, Claude Code, and Lovable turn a written description into a working app. And a demo beats a ten-page document, because people react to what they can touch.

*[pause]*

**[On camera]**

And I'll be straight with you. A lot of videos say this job needs no coding, and for some of these jobs that's not true anymore. One senior AI PM job makes every applicant take a sixty-minute coding test. You don't need to be an engineer, but you can't be afraid of code.

*[pause]*

**[Graphic 13, full screen]** A one-page spec. The last heading, "The AI must never," is highlighted.

And number seven is the stuff that never goes away: talk to users, pick the problem that matters most, and write a clear spec. A spec, or product requirements document, says what you're building, who it's for, and how you'll know it worked. For AI, add one section on what it must never do, like give medical advice or show one customer another customer's data.

*[pause]*

## Part 4: The five phases

**[On camera]**

So now the order. If I had to do this from zero, here's exactly what I'd do. It's about six months at ten hours a week, but the weeks don't matter, the tests do. Pass the test, you move on. Don't pass it, you stay.

**[Card beside you]** Phase 1: Learn how AI works. Phase 2: Product and data basics. Phase 3: Evals and trade-offs. Phase 4: Create proof. Phase 5: Get hired.

If you're already a PM, go faster through phase two. If you're already an engineer building AI, go faster through phase one.

*[pause]*

**[Graphic 14, full screen]** Phase 1. Weeks 1 to 4. Test: "Explain RAG, agents, and fine-tuning in 2 minutes."

Phase one, weeks one to four, is learning how AI products work. Use ChatGPT, Claude, and Gemini on real tasks every day, notice where each one breaks, and learn the words from skills one and two. The test is explaining RAG, agents, and fine-tuning to a friend in two minutes, and when you'd use each.

*[pause]*

**[Graphic 15, full screen]** Phase 2. Weeks 5 to 8. Test: "Name the metric. Write the query. Write the spec."

Phase two, weeks five to eight, is product and data basics. Learn enough SQL to filter, group, and join tables on a free public dataset, and learn A/B tests and success metrics. The test is picking an app you use every day, naming its most important metric, writing the query that measures it, and writing a one-page spec for one AI feature it should add.

*[pause]*

**[Graphic 16, full screen]** Phase 3. Weeks 9 to 12. Test: "One page. Two models. Quality, cost, speed. Which one ships?"

Phase three, weeks nine to twelve, is evals and trade-offs, and it comes before building on purpose, because everything you build next needs a score. Pick one AI feature, let's say a tool that summarizes customer reviews, build a test set of fifty real inputs, and run two models on all of them. The test is one page comparing them on quality, cost, and speed, and saying which one you'd ship and why.

*[pause]*

**[Graphic 17, full screen]** Phase 4. Weeks 13 to 20. Three project tiles, each showing: problem, demo, eval score, cost per user.

Phase four, weeks thirteen to twenty, is proof. Build three small AI products, not one, because the first one teaches you the most and looks the worst. Each one shows the problem, a working demo, its eval score, and its cost per user, and gets ten real people using it. The test is whether a stranger can open your portfolio and get all of that in five minutes. Because nobody hires potential. They hire proof.

*[pause]*

**[On camera]** *(Opinion. Chris to confirm.)*

And phase five, weeks twenty-one to twenty-six, is getting hired. If you have a job, start inside your company and offer to own the evals for the team building AI features. An internal move skips the hardest part of hiring, which is getting a stranger to trust you. Outside, search more than one title, like Technical Product Manager for AI Systems, or Data and AI Product Manager.

*[pause]*

**[Graphic 18, full screen]** Four interview questions, one per area: product sense, technical, evals, metrics.

Then practice four kinds of interview questions out loud, at least five times each. Product sense: "Design an AI feature for a grocery app." Technical: "How would you reduce hallucinations?" Evals: "How would you test this chatbot before launch?" Metrics: "Usage dropped ten percent, what do you check first?" And the test for phase five is an offer.

*[pause]*

## Your turn

**[On camera]**

So here's your task for this week. Pick an AI feature in an app you use every day, write ten real questions someone would ask it, and next to each one, write what a good answer looks like. That's your first eval set, and it takes about an hour. Most people who watch this won't do it, which is exactly why the ones who do get hired.

## Call to action

**[On camera]**

If you want help with your plan, the first link in the description books a free fifteen-minute call with me, and we'll figure out which phase you should start with.

**[On camera]** *(Chris to confirm what the masterclass covers.)*

And if you want the technical half done properly, that's what the Stackle AI Engineering Masterclass is for, and the link is in the description too.

**[On camera]**

Drop a comment and tell me, are you coming from product, from engineering, or from somewhere else?

---

## Graphics list

1. **Hook:** a real job ad with "$304,000" circled, and "base salary" under it.
2. **Same question, different answer:** normal software next to AI.
3. **Bank chatbot:** Monday's right answer, and Tuesday's invented fee in red.
4. **Salary table:** Entry $120K to $185K. Senior $130K to $210K. Lead and principal $140K to $304K. Note: "Smaller city or non-tech company: closer to $90K at entry."
5. **Base versus total:** "Base: up to $304K posted." Under it: "All US PMs, total pay median: $230K (Levels.fyi)."
6. **LLM basics:** a phone keyboard guessing the next word, plus the token, context window and hallucination labels.
7. **RAG, agent, fine-tuning:** three tiles, one short line each.
8. **Eval sheet:** "190 / 200 = 95%. Ship it?"
9. **Precision and recall:** an inbox and a junk folder.
10. **The cost math:** 1 cent × 1,000,000 a day = $10,000 a day = $3.65 million a year. Bigger model at 10× the price = $36.5 million a year. "Worth almost $33 million more?"
11. **Data:** an SQL query about refund questions, and an A/B split.
12. **Prototype:** a written description, an arrow, and a working app.
13. **Spec:** one page, with "The AI must never" highlighted.
14. **Phase 1 card:** weeks 1 to 4, and the test.
15. **Phase 2 card:** weeks 5 to 8, and the test.
16. **Phase 3 card:** weeks 9 to 12, and the test.
17. **Phase 4 card:** weeks 13 to 20, and three project tiles.
18. **Interview questions:** product sense, technical, evals, metrics.

**Shortened on-screen labels (not word for word from the script):** Graphic 2, the tile lines in Graphic 7, the Graphic 9 questions, and the phase card titles. Every number on screen matches the script.

**Style for all graphics:** Plus Jakarta Sans. Brand colours from CLAUDE.md: blue-to-cyan accent (#3B82F6 → #22D3EE) on near-black #0A0A0A for video, or #2563EB → #10A5BE on white for stills.

---

## YouTube title

AI Product Manager Roadmap 2026: Skills, Salary and 5 Phases

## YouTube description

AI product manager jobs posted this fall in the United States pay from about $90,000 to more than $300,000 a year in base salary. In this video I show you what an AI product manager really does, what the job pays at each level, the seven skills the job ads ask for, and the five phases I would follow to get hired, starting from zero.

Chapters
0:00 What AI product managers earn
0:00 What an AI product manager does
0:00 Salary at each level
0:00 The seven skills
0:00 The five phases
0:00 Your task for this week

Book a free 15-minute career call: https://calendar.app.google/2HjLnF1HSov9m5Gk9
Stackle AI Engineering Masterclass: [link to add]

Sources
- Base pay ranges come from public job ads on Dice, posted August to October 2026:
  - AI Product Manager Graduate, TikTok, San Jose, $122,574 to $184,000: https://www.dice.com/job-detail/09d73a28-2a39-4cf5-a74a-34ceaa4c0cd3
  - Associate, AI Product Manager, Red Ventures, New York, $125,000 to $145,000: https://www.dice.com/job-detail/f4220da3-5ecc-483d-b992-5570c520b4d3
  - (Associate/Senior) AI Product Manager, BCG X, Boston, $139,500 to $155,000: https://www.dice.com/job-detail/20feff80-693c-4f54-86ab-6fa65e30b90b
  - AI Technology Product Manager, Baird, Milwaukee, $91,000 to $140,000: https://www.dice.com/job-detail/2bb16d18-2bf2-4235-a1c6-dba65d65a2a7
  - Senior Data & AI Product Manager, Hyatt, Chicago, $133,200 to $173,000: https://www.dice.com/job-detail/f4b78be7-5407-4a42-93d8-2c834b2f5659
  - Senior Product Manager, AI, Chicago (via Randstad Digital), $148,000 to $211,000: https://www.dice.com/job-detail/c2d2d6a7-9d8b-421e-9cca-8d3cf81c4b83
  - Senior Technical Product Manager, AI Agents, Evals & Reliability, remote (via Next Step Systems), $165,000 to $200,000, with a 60-minute coding assessment: https://www.dice.com/job-detail/598818cc-ee7a-4bff-bf41-4e8f858c3a2f
  - Lead, Enterprise AI Product Manager, AMD, Santa Clara, $140,000: https://www.dice.com/job-detail/02297dc2-c825-47a9-b323-7831a40458cf
  - Lead AI Product Manager, start-up, San Francisco (via Motion Recruitment), $200,000 to $230,000: https://www.dice.com/job-detail/a2136105-aa8c-4a58-855d-01ed49902484
  - Principal Product Manager, Vision AI, Toast, Costa Mesa, $190,000 to $304,000: https://www.dice.com/job-detail/ea5587d1-3147-432f-8caa-7de41553b611
- Product manager pay in the United States, all product jobs: median total pay $230,000 and median base $185,000, from 4,972 submissions (Levels.fyi, checked October 13, 2026): https://www.levels.fyi/t/product-manager
- One token is about three quarters of a word in English (OpenAI Help Center): https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
- The cost math (one cent per answer, one million questions a day) is an example, not a market price.

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab
