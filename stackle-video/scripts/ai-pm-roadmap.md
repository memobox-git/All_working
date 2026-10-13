# AI Product Manager Roadmap: Script

**Title:** AI Product Manager Roadmap 2026: Skills, Salary and 5 Phases

**Spoken words:** about 2,616 · **Estimated length:** about 17 minutes at 150 words a minute

**Style:** Modelled on real Alex Hormozi transcripts (seven YouTube videos and one solo podcast episode, about 38,000 words). He talks in flowing, medium-length sentences (median 13 words), not clipped fragments. He links ideas with "And so", "if you think about it", "which means" and "right?". He defines terms in plain words ("X just means Y"), uses mirror pairs, works through "let's say" scenarios and the math out loud, and lands each point with one short line.

---

## Hook

**[Graphic 1, full screen]** A real job ad with "$304,000" circled, and "base salary" under it.

*[pause]*

AI product manager jobs are paying up to three hundred and four thousand dollars a year in base salary right now.

*[pause]*

## Promise

**[On camera]**

In this video I am going to show you exactly what I would do to get one of those jobs if I had to start from zero today. What the job actually is, what it pays at every level, the seven skills that get you hired, and the five phases to get there, with a test at the end of each phase so you know when you're ready to move on.

## Intro

**[On camera, with one picture for each fact]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than two hundred thousand people follow me on LinkedIn.

**[On camera]** *(Chris to confirm.)*

And the reason I'm making this video is because AI product managers work with engineers like me every single day, and I've been on the engineering side of that for ten years. So I'm going to tell you what we actually need from you, not what sounds good on a slide.

*[pause]*

## Part 1: The job

**[On camera]**

So let's start with what the job actually is. A product manager just means the person who decides what gets built and why. An AI product manager does the same thing, but with one extra problem, which is that the product doesn't behave the same way twice.

**[Graphic 2, full screen]** Left: "Normal software: same click, same result." Right: "AI: same question, different answer."

*[pause]*

And so if you think about normal software, you click the same button, you get the same result, every time. If you think about AI, you ask the same question, you can get a different answer, and sometimes that answer is wrong. And it's wrong with total confidence, right?

*[pause]*

**[Graphic 3, full screen]** A bank chatbot. Monday: the right answer, with a green tick. Tuesday: the same question in different words, and an invented fee in red.

So let's say you're the product manager on a bank chatbot. On Monday, someone asks about late fees, and it nails it. On Tuesday, someone asks the exact same thing in slightly different words, and it makes up a fee that doesn't exist. Now, the bank doesn't care that it was right on Monday. The bank cares that it was wrong on Tuesday. And so somebody has to catch that before the customers do, and that somebody is you.

*[pause]*

**[On camera]**

And so the way I think about this job is that it has two halves. The first half is deciding what to build. The second half is knowing whether the AI is good enough, what it costs, and how you prove it. Most product managers have the first half and not the second. Most engineers have the second half and not the first. The people getting hired right now have both, and that's what this roadmap is built to give you.

## Part 2: The money

**[On camera]**

Now let's talk about money. These numbers come from real job ads posted in the US between August and October 2026, and they're base salary, which just means the pay before any bonus or stock.

*[pause]*

**[Graphic 4, full screen]** Three rows. Entry: $120K to $185K. Senior: $130K to $210K. Lead and principal: $140K to $304K. A small note: "Smaller city or non-tech company: closer to $90K at entry."

So at the entry level, which is associate and new grad, you're looking at roughly one hundred twenty to one hundred eighty-five thousand. One new grad AI PM job at a big social media company lists one hundred twenty-two to one hundred eighty-four thousand, for someone who just graduated, right? Now, if you're in a smaller city or at a company that isn't in tech, that starting number can be closer to ninety.

At the senior level, it's roughly one hundred thirty to two hundred ten thousand. One senior job that focuses on AI agents and testing pays one hundred sixty-five to two hundred thousand, and it's fully remote.

And then lead and principal is where the range gets really wide. The lowest one I found was one hundred forty thousand. The highest was three hundred four thousand, for a principal PM working on vision AI, which just means AI that understands images and video. And what I find interesting is that it wasn't at an AI lab. It was at a restaurant software company.

**[Graphic 5, full screen]** "Base: up to $304K posted." Under it: "All US PMs, total pay median: $230K (Levels.fyi)."

And remember, all of that is base. If you add bonus and stock, Levels.fyi, which is a site where tech workers share what they actually earn, puts the median product manager in the US at about two hundred thirty thousand a year in total pay. And that's across all product managers, not just AI.

*[pause]*

**[On camera]**

And so if you look at what the senior and principal jobs ask for, it's not just more years. It's bigger decisions. At the entry level, you help ship a feature. At the principal level, you decide whether an AI system is safe, useful, and worth what it costs. You don't get paid for your time. You get paid for the size of the decisions people trust you to make. Outside the US, the numbers are lower, but the skills are exactly the same.

## Part 3: The seven skills

**[On camera]**

So now let's talk about the skills. I went through the job ads, and the same skills kept showing up over and over again, so I grouped them into seven.

**[Card beside you]** 1. LLMs. 2. RAG, agents, fine-tuning. 3. Evals. 4. Trade-offs. 5. Data. 6. Prototypes. 7. Specs.

*[pause]*

**[Graphic 6, full screen]** A phone keyboard guessing the next word. Three labels: "Token: about 3/4 of a word." "Context window: how much it can read at once." "Hallucination: false, but confident."

Number one is knowing how LLMs work. LLM just means large language model, which is the thing behind ChatGPT, Claude, and Gemini. And if you think about what it's actually doing, it's predicting the next word, kind of like your phone keyboard, just a lot better. Now, there are three words you need. A token is a chunk of text, about three quarters of a word, and every token costs money. The context window is how much the model can read at one time. And a hallucination is when the model says something false with total confidence, which is exactly what our bank chatbot did.

*[pause]*

**[Graphic 7, full screen]** Three tiles. RAG: "Looks it up, then answers." Agent: "Does things, not just says things." Fine-tuning: "Trained on your examples."

Number two is knowing the three ways teams build with LLMs. The first one is RAG, which stands for retrieval augmented generation, and it just means the AI looks things up in your documents before it answers. So if a support bot reads the refund policy before it answers a refund question, that's RAG. The second one is agents, which are AIs that do things instead of just saying things, so they book the meeting or they update the ticket. And the third one is fine-tuning, which means you take an existing model and train it on your own examples so it learns a style or a narrow task. Now, you're not going to build these yourself. But if you can't tell which one a problem needs, you're not really the product manager. You're a spectator.

*[pause]*

**[Graphic 8, full screen]** A test sheet: question, good answer, AI answer, pass or fail. At the bottom: "190 / 200 = 95%. Ship it?"

Number three is evals, and if you only take one thing from this video, take this one. An eval is just a test for your AI. You take real questions, you write down what a good answer looks like, and you score the AI on every single one. So let's go back to the bank chatbot. You pull two hundred real questions about fees, and it gets one hundred ninety right. That's ninety-five percent. And so now the question is, is ninety-five percent good enough to launch? Making that call is your job.

*[pause]*

**[Graphic 9, full screen]** An inbox and a junk folder. Precision: "When it flags something, is it right?" Recall: "Did it catch everything it should?"

And this isn't just a senior thing. One new grad AI PM job I found asks you to define evaluation frameworks using precision and recall. Precision just means, when the AI flags something, how often is it right? Recall means, out of everything it should have caught, how much did it actually catch? So if you think about the spam filter in your email, high precision means your real emails don't end up in junk, and high recall means the junk doesn't end up in your inbox.

*[pause]*

**[Graphic 10, full screen]** The math builds line by line. "1 cent × 1,000,000 a day = $10,000 a day." "= $3.65 million a year." "Bigger model, 10× the price = $36.5 million a year." Last line: "Worth almost $33 million more?"

Number four is trade-offs, and specifically quality, speed, and cost. Speed here is called latency, which just means how long the user waits for an answer. And I want to do the math with you, because this is where it gets real. Let's say every answer costs you one cent. That sounds like nothing, right? But if you get a million questions a day, that's ten thousand dollars a day, which is three point six five million dollars a year. Now, someone on your team says, "Let's use the bigger model, it's a little bit smarter." Cool. It's also ten times the price, which means your bill is now thirty-six and a half million dollars a year. So is "a little bit smarter" worth almost thirty-three million dollars more? Maybe, maybe not. But that is literally the question they're paying you to answer. And I'm not making this up. One senior AI PM job ad lists it word for word: make hard trade-offs across quality, latency, cost, reliability, and user experience.

*[pause]*

**[Graphic 11, full screen]** A short SQL query: users who asked about refunds last week. Next to it, an A/B split: half see version A, half see version B.

Number five is data. And the way I think about it is, if you can't pull your own numbers, you have to wait on someone else every single time, and the person who waits is always slower than the person who doesn't. So learn SQL, which is just the language you use to ask a database questions. "How many users asked the bot about refunds last week?" is one query, and you should be able to write it yourself. Then learn A/B tests, which just means half your users see the old version, half see the new one, and you compare. That's how you prove something worked instead of guessing that it did.

*[pause]*

**[Graphic 12, full screen]** A written description, an arrow, and a working app.

Number six is building prototypes. A prototype is just a rough version of the product that people can actually click on. And today, tools like Cursor, Claude Code, and Lovable can turn a written description into a working app. So a demo will beat a ten-page document almost every time, because people react to what they can touch, not to what they have to imagine.

*[pause]*

**[On camera]**

Now, I want to be straight with you on this one. A lot of videos tell you that you don't need any coding for this job, and for some of these jobs, that's just not true anymore. One senior AI PM job I read makes every applicant take a sixty-minute coding test. So you don't need to be an engineer, but you can't be afraid of code either.

*[pause]*

**[Graphic 13, full screen]** A one-page spec. The last heading, "The AI must never," is highlighted.

And number seven is the stuff that never goes away, which is talking to users, picking the problem that matters most, and writing a clear spec. A spec, or PRD, which stands for product requirements document, just says what you're building, who it's for, and how you'll know it worked. Now, for AI, I'd add one more section, which is what the AI must never do. So it never gives medical advice, and it never shows one customer another customer's data. And honestly, that one section can save a company.

*[pause]*

## Part 4: The five phases

**[On camera]**

So now you know the skills, but skills in the wrong order are kind of useless, right? And so if I had to do this from zero today, this is exactly the order I'd follow. It's about six months at around ten hours a week. But the weeks don't really matter. The tests do. If you pass the test, you move on. If you don't, you stay until you do.

**[Card beside you]** Phase 1: Learn how AI works. Phase 2: Product and data basics. Phase 3: Evals and trade-offs. Phase 4: Create proof. Phase 5: Get hired.

And if you're already a product manager, you can move faster through phase two. If you're already an engineer building AI, you can move faster through phase one.

*[pause]*

**[Graphic 14, full screen]** Phase 1. Weeks 1 to 4. Test: "Explain RAG, agents, and fine-tuning in 2 minutes."

Phase one is weeks one to four, and it's learning how AI products actually work. So use ChatGPT, Claude, and Gemini every day on real tasks, and pay attention to where each one breaks. And learn the words: LLM, token, context window, hallucination, RAG, agent, fine-tuning. The test is, can you explain RAG, agents, and fine-tuning to a friend in two minutes, including when you'd use each one? If you can't do it in two minutes, you don't actually know it yet.

*[pause]*

**[Graphic 15, full screen]** Phase 2. Weeks 5 to 8. Test: "Name the metric. Write the query. Write the spec."

Phase two is weeks five to eight, and it's the product and data basics. So write a one-page spec for an AI feature in an app you already use. Learn enough SQL to filter, group, and join tables, and practice on a free public dataset. And learn how A/B tests and success metrics work. The test here has three parts. Pick an app you use every day, name its most important metric, write the query that would measure it, and write a one-page spec for one AI feature it should add. If you can only do two of the three, you're not done.

*[pause]*

**[Graphic 16, full screen]** Phase 3. Weeks 9 to 12. Test: "One page. Two models. Quality, cost, speed. Which one ships?"

Phase three is weeks nine to twelve, and it's evals and trade-offs. And I put this before building on purpose, because everything you build in the next phase needs a score. So pick one AI feature, let's say a tool that summarizes customer reviews. Build a test set of fifty real inputs, write what a good output looks like for each one, and run two different models on all fifty. Then track the score, the price, and the speed for both. The test is one page that compares the two models on quality, cost, and speed, and says which one you'd ship and why.

*[pause]*

**[Graphic 17, full screen]** Phase 4. Weeks 13 to 20. Three project tiles, each showing: problem, demo, eval score, cost per user.

Phase four is weeks thirteen to twenty, and this is where you create proof. So you build three small AI products. Not one, three. And the reason is that the first one is going to teach you the most and look the worst, and that's fine, that's the whole point of it. Every project should show four things: the problem, a working demo, its eval score, and its cost per user. Then you put them on LinkedIn and GitHub, and you get ten real people to use each one. The test is, can a stranger open your portfolio and understand the problem, the product, the score, and the cost in five minutes? Because nobody hires potential. They hire proof.

*[pause]*

**[On camera]** *(Opinion. Chris to confirm.)*

And phase five is weeks twenty-one to twenty-six, and it's getting hired. If you already have a job, I would start inside your own company first. Find the team that's building AI features and offer to own their evals, because an internal move skips the hardest part of hiring, which is getting a stranger to trust you. And if you're searching outside, don't just search one title. The same job shows up as Technical Product Manager for AI Systems, Data and AI Product Manager, and a bunch of other names, so search all of them.

*[pause]*

**[Graphic 18, full screen]** Four interview questions, one per area: product sense, technical, evals, metrics.

Then you prepare for four kinds of interview questions. Product sense, which sounds like, "Design an AI feature for a grocery app." Technical, like, "How would you reduce hallucinations?" Evals, like, "How would you test this chatbot before launch?" And metrics, like, "Usage dropped ten percent, what do you check first?" Practice each one out loud at least five times. Not in your head, out loud. And the test for phase five is an offer.

*[pause]*

## Your turn

**[On camera]**

So here's what I want you to do this week. Not next month, this week. Pick an AI feature in an app you use every day. Write down ten real questions someone would ask it, and next to each one, write what a good answer looks like. That's it. You've just built your first eval set, and it takes about an hour. And the truth is, most people who watch this won't do it, which is exactly why the people who do end up getting hired.

## Call to action

**[On camera]**

If you want help building your plan, the first link in the description books a free fifteen-minute call with me, and we'll figure out where you're starting from and which phase you should focus on first.

**[On camera]** *(Chris to confirm what the masterclass covers.)*

And if you want to learn the technical half properly, so LLMs, RAG, agents, and how to test them, that's what the Stackle AI Engineering Masterclass is for. The link is in the description too.

**[On camera]**

And drop a comment and tell me, are you coming into this from product, from engineering, or from somewhere else?

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

**Style for all graphics:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

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
