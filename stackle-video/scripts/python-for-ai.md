# Python for AI: script

**Word count (spoken):** 2,745 words | **Estimated length:** about 18 minutes at 150 words a minute (about 16 with the cuts listed at the end)
**Style:** Alex Hormozi's real speaking style, as in the last three scripts:
- Flowing medium sentences linked with "and so", "because", "which means" and "right?".
- Numbered points. Each one is a rule, then the reason, then a "let's say" example, then a short landing line.
- Terms are defined as "X just means Y", and the key terms get a mirror pair.
- The math is said out loud, step by step, ending with a question.
- Contractions throughout, except the intro, which matches the text in intro.mp4.
**Research date:** 14 October 2026

---

## Research brief

### How the research was done
Claude in Chrome isn't connected in a cloud session, so the research used yt-dlp and web search. **Views, likes, upload dates and lengths below are real, taken on 14 October 2026.** Full transcripts were read for five of the ten videos. YouTube blocked the transcript for the other five, so for those the notes come from the title, description, chapters and comments. About 400 top comments were read across five videos. Every number in the script is checked against a primary source in the sources table.

### Creators and videos flagged

| Creator | Channel (subscribers) | Title | Link | Views | Uploaded | Length | Transcript |
|---|---|---|---|---|---|---|---|
| Dave Ebbelaar | Dave Ebbelaar (300K) | Python for AI - Full Beginner Course | youtube.com/watch?v=ygXn5nV5qFc | 1,784,156 | 21 Oct 2025 | 5:15:31 | Read the intro and all chapters |
| MIT OpenCourseWare | MIT OpenCourseWare (6.5M) | Do You Still Need to Learn Python in the Age of AI? | youtube.com/watch?v=hl2IeK4Ogl0 | 291,507 | 2 Jun 2025 | 2:58 | No (description and chapters) |
| codebasics | codebasics (1.6M) | Python Tutorial for AI: Everything You Need in 2 Hours | youtube.com/watch?v=6GuyMZ-cSzE | 263,446 | 1 Jul 2026 | 2:02:52 | No (chapters) |
| Dave Ebbelaar | Dave Ebbelaar (300K) | 17 Python Libraries Every AI Engineer Should Know | youtube.com/watch?v=p4G0coRey9w | 93,614 | 12 Dec 2024 | 19:57 | Yes |
| Marina Wyss | Marina Wyss - AI & Machine Learning (156K) | Python for Machine Learning: Skills That Actually Get You Hired | youtube.com/watch?v=jEJD8M6rNoo | 63,925 | 3 Jun 2025 | 12:35 | Yes |
| Tim Ruscica | Tech With Tim (2.1M) | Do THIS instead of watching endless tutorials — how to learn Python for AI | youtube.com/watch?v=DZIymFrEXik | 51,901 | 26 Apr 2026 | 12:37 | No (chapters, description, 38 comments) |
| Tim Ruscica | Tech With Tim (2.1M) | Python in 2026: Honest Truth About Learning It Now | youtube.com/watch?v=Kuur0L7E9rQ | 47,546 | 3 Aug 2026 | 11:16 | No (chapters, description, 65 comments) |
| Marina Wyss | Marina Wyss - AI & Machine Learning (156K) | The Only Python You Need to Learn for AI in 2026 | youtube.com/watch?v=otBkgSZr0no | 42,699 | 16 Jun 2026 | 8:34 | Yes |
| Harry Connor | Harry Connor AI (17K) | The Python Needed for AI/ML (Complete Roadmap) | youtube.com/watch?v=oD8W_xFWo3A | 37,833 | 5 Sep 2025 | 6:00 | No (description and chapters) |
| Baraa Khatib Salkini | Data with Baraa (507K) | How to learn Python for AI | youtube.com/watch?v=3_zUFQS52PY | 28,052 | 21 May 2026 | 17:35 | Yes |

**What the numbers say:**
- **Long courses win the views.** Dave Ebbelaar's five-hour course has 1.8 million views and 2,700 comments, and most of the top comments are people logging their start date ("Started learning today... like me so I can check my progress").
- **Short "what to learn" videos sit between 28,000 and 64,000 views.** No one owns the short, roadmap-style version of this topic yet, which is the format of our script.
- **The "do I still need Python?" question pulls big numbers on its own.** MIT's three-minute clip has 291,000 views.

### What all of them cover (our script covers these too)
- You still need Python, even though AI can write code.
- The basics: variables, strings and f-strings, lists, dictionaries, loops, if statements and functions.
- Files and JSON.
- Calling an API, and keeping the API key in a .env file.
- Error handling with try and except.
- Virtual environments, with pip or uv.
- Learn by building, not by watching. Baraa says "20% watching, 80% building". Marina says AI may only explain while you learn the basics.
- One project that grows: chatbot, then RAG, then an evaluation, then an agent.

### Where they are wrong, out of date, or disagree
- **"Every model SDK, every agent framework, it's all Python" is wrong.** Data with Baraa says this in the first minute. Anthropic's own documentation shows its SDK in Python, TypeScript, C#, Go, Java, PHP and Ruby. GitHub's 2025 report says TypeScript passed Python in August 2025 as the language with the most monthly contributors. The true claim is that Python leads in AI projects, with nearly half of all new AI repositories.
- **They disagree on classes (object-oriented programming).** Baraa says it is "not a core topic". Marina says you need "just enough" to understand it. codebasics and Dave Ebbelaar teach full chapters on it. Our answer: you need enough to read and write a Pydantic model, which is a class. You don't need big class designs.
- **Two of them mix AI engineering with machine learning.** Harry Connor's roadmap and Marina's 2025 video put NumPy, Matplotlib, scikit-learn and PyTorch in the middle of the plan. That is the machine learning engineer's path. Marina's own 2026 video says AI engineers don't train models, so they don't need PyTorch or TensorFlow. Our script separates the two jobs before it lists anything.
- **Dave Ebbelaar's library video is from December 2024.** It's still useful, but some of it now overlaps with features the model providers have built in. One example: Instructor, a library for getting structured answers, now overlaps with the structured outputs that Anthropic and OpenAI offer in their own APIs.
- **The "AI makes developers 19% slower" study is out of date.** It comes from METR's July 2025 trial. METR now calls that result historical, and its 2026 follow-up was judged unreliable, so our script doesn't use it.
- **Nobody gives evidence for "do you still need Python?"** Every video answers with opinion. Our script uses the Stack Overflow survey and Veracode's security test.

### What viewers asked for in the comments
- "I wish you do a course on... Asynchronous Programming / Handling Asynchronous APIs." (Marina, 2026). None of the ten videos teaches async.
- "Do I really need to learn Python when my tech stack involves .NET, C# and TypeScript?" (Marina, 2026). No video answers this.
- "Testing and learning with API is costly. How to be able to keep learning python?" (Marina, 2026). No video answers this.
- "Does it use the python data engineer role, what purpose of python with a data engineer should I learn?" (Baraa). This is Chris's home ground.
- "So learning machine learning and deep learning not required here?" (Baraa). This is the AI engineer and machine learning engineer split.
- "Waiting for someone to stop just an overview and do a true step by step." (Tech With Tim). Our project in six levels answers this.
- "Im stucked on while loop, dicts and try/except... as i learn a new concept, i forget others." (Tech With Tim). Our "type it, break it, explain it" rule answers this.

### Gaps, and the angle our script takes
1. **Data, not opinion, for "do you still need Python?"** We use Stack Overflow's 2025 and 2026 surveys and Veracode's test of more than 100 models.
2. **An honest answer for TypeScript and C# developers.** We say plainly that you can build AI apps in other languages, and why you should still learn to read Python.
3. **Skip first.** We separate AI engineering from machine learning before listing anything, so viewers know what they can leave out.
4. **Six things, ordered by when you use them.** The order is setup, data shapes, APIs, types, async, then tests and evals.
5. **Why types matter more in AI code.** In MCP's official Python SDK, a function's type hints become the schema the model reads. No video explains this.
6. **Async, with the math.** Nobody covers it, and viewers asked.
7. **Tests and evals explained side by side,** with a "let's say" score.
8. **A free way to practice,** by running a local model with Ollama, which answers the cost question.
9. **The data engineer's head start.**
10. **Shorter.** Our script is about 18 minutes, against five hours for the biggest course and two hours for codebasics.

### Source for every number and fact in the script
| Number or fact in script | Source | Date |
|---|---|---|
| Python shows up in 62% of AI engineering job postings in the US (said as "sixty-two percent") | Axial Search, "AI Engineering Jobs in 2026: A Data-Backed Market Map", 43,480 US postings since January 2026. The figures count postings that *mention* a skill. axialsearch.com/insights/ai-engineering-jobs | Updated 13 Oct 2026 |
| A full Python course can run more than twelve hours | YouTube search results: Data with Baraa, "Python Full Course for Beginners (13 Hours)", 1.36M views; Erik Frits, "The Ultimate Python Course For Beginners", 12:00:00 | Checked 14 Oct 2026 |
| 66% say their biggest frustration is AI answers that are "almost right, but not quite"; 45% say debugging AI-generated code takes more time | Stack Overflow Developer Survey 2025, AI section, survey.stackoverflow.co/2025/ai | Jul 2025 |
| 48% trust AI when they can easily check (validate) the answer | Stack Overflow Developer Survey 2026, AI section, survey.stackoverflow.co/2026/ai | 2026 |
| Veracode tested 80 coding tasks across more than 100 models; 45% of cases had a security flaw; larger models did not do significantly better | Veracode press release, "AI-Generated Code Poses Major Security Risks in Nearly Half of All Development Tasks" | 30 Jul 2025 |
| TypeScript passed Python in August 2025 as the most used language on GitHub, by monthly contributors | GitHub Octoverse 2025, github.blog | 28 Oct 2025 |
| Python powers nearly half of all new AI repositories on GitHub (582,196) | GitHub Octoverse 2025, same post | 28 Oct 2025 |
| AI companies ship their SDKs in several languages | Anthropic docs: SDK examples in Python, TypeScript, C#, Go, Java, PHP and Ruby (platform.claude.com/docs) | Checked 14 Oct 2026 |
| In the MCP Python SDK, the type hints are the tool's schema, and the docstring describes the tool | modelcontextprotocol/python-sdk README: "`a: int, b: int` *is* the schema"; "Two type-hinted Python functions and a docstring" | Checked 14 Oct 2026 |
| Ollama is free and open source, and can run models locally behind an OpenAI-compatible API | github.com/ollama/ollama (MIT licence); docs.ollama.com/api/openai-compatibility | Checked 14 Oct 2026 |

**Numbers that are "let's say" examples, not data:**
- The 200 emails, with 40 skipped.
- The 500 support tickets.
- The 1,000 requests, with 2% failing and the crash at request 37.
- The 1,000 tickets at 3 seconds each, run 20 at a time.
- The 50-question eval, with 41 and then 46 right.

Each one is introduced with "let's say".

**Numbers that are Chris's estimate, not a source:** about three months at ten hours a week from zero, four to six weeks for people who already code, and "about thirty lines" for the task this week.

---

## Script

### Opening

**[On camera]**

In this video, I'm going to show you exactly how much Python you need to become an AI engineer, and which parts you can skip. Python shows up in sixty-two percent of AI engineering job postings in the US this year. But a full course on it can run more than twelve hours, and a lot of that is stuff an AI engineer never touches. So I'll cover whether you still need it now that AI writes code, what you can skip, the six things you actually need in the order you'll use them, and how to learn them without getting stuck in tutorials.

### Intro

**[PAUSE] [Intro motion graphic, full screen: intro.mp4]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

**[PAUSE]**

### Part 1: Do you still need Python if AI writes the code?

**[On camera]**

So let's start with the question everyone asks. Do you still need Python if AI can write the code for you? The short answer is yes. But the reason has changed, because you're not learning Python so you can type every line yourself. You're learning it so you can read what the AI wrote, check it, and fix it when it breaks.

**[PAUSE] [Graphic 1, full screen: Stack Overflow survey 2025: "66%: AI answers that are almost right, but not quite" and "45%: fixing AI-written code takes longer"; then Stack Overflow survey 2026: "48% trust AI when they can easily check the answer"]**

And the data backs this up. In Stack Overflow's 2025 survey, sixty-six percent of developers said their biggest frustration with AI tools is answers that are almost right, but not quite. Forty-five percent said fixing AI-written code takes them longer. And in the 2026 survey, forty-eight percent said they trust AI when they can easily check the answer. Checking the answer is the skill. And if you can't read Python, you can't check anything.

**[PAUSE]**

**[Card beside you: the email-sorting example]**

So let's say you ask AI for a script that reads two hundred customer emails and sorts them by topic. It runs with no errors, and it looks perfect. But it quietly skips every email that has an attachment, and that's forty of them. Nothing crashes, so nobody notices. The only way you catch it is by reading the loop and finding the line that skips them. And so almost right is the most expensive kind of wrong, because it doesn't look wrong.

**[PAUSE] [Graphic 2, full screen: "Veracode tested 100+ AI models on 80 coding tasks", "45% had a security flaw", "Bigger models did not do much better"]**

Security works the same way. Veracode, a security company, tested more than a hundred AI models on eighty coding tasks. Forty-five percent of the results had a security flaw, and the bigger models didn't do much better than the small ones. You only spot a flaw like that if you can read the code.

**[PAUSE]**

**[On camera]**

Now, a question I keep seeing in the comments is, "I already write TypeScript or C#, so do I really need Python?" And I'll be honest. The big AI companies give you their tools in several languages, so yes, you can build AI apps in TypeScript.

**[PAUSE] [Graphic 3, full screen: GitHub Octoverse 2025: "TypeScript: #1 language by contributors" beside "Python: nearly half of all new AI projects (582,196)"]**

GitHub's 2025 report shows both sides of this. TypeScript now has the most contributors on GitHub, but Python still powers nearly half of all new AI projects. And so most of the tutorials and testing tools you'll learn from are written in it. If you can read it, every AI tutorial is open to you. If you can't, you're translating every example before you even start, right? So even if your app ends up in TypeScript, learn to read Python.

**[PAUSE]**

### Part 2: What you can skip

**[On camera]**

Now let's talk about what you can skip, because this is where most people lose months. To understand it, you need one difference. An AI engineer builds products with models that already exist, like an assistant that answers questions from your company's documents. A machine learning engineer trains the models. Those are different jobs, so they need different Python.

**[Card beside you: "Skip for now": training models with PyTorch or TensorFlow, desktop apps and games, big class designs, memorizing syntax]**

So if your goal is AI engineering, there are four things you can leave for later. The first is training neural networks with libraries like PyTorch or TensorFlow, because that's the machine learning engineer's job. The second is desktop apps and games, which a lot of beginner courses spend hours on. The third is big class designs, and the fourth is memorizing syntax, because AI and the documentation will remind you.

**[On camera]**

And so you're not learning all of Python. You're learning the part that AI apps are actually made of.

### Part 3: The six things you need

**[On camera]**

So here are the six things you need, in the order you'll use them.

**[PAUSE] [Graphic 4, full screen: six blocks in a row: "1 Your setup", "2 Lists and dictionaries", "3 Talking to APIs", "4 Types and Pydantic", "5 Async", "6 Tests and evals"]**

They're your setup, lists and dictionaries, talking to APIs, types and Pydantic, async, and tests and evals. If some of those words are new, don't worry. I'll explain every one.

**[PAUSE]**

#### Number one: Your setup

**[On camera]**

Number one is your setup, and the rule is to set up a clean project before you write any AI code. The reason is that two projects often need different versions of the same library. If they share one installation, updating one can break the other.

**[Card beside you: "Virtual environment", "uv", ".env file", "Git"]**

So you learn four things here. A virtual environment just means a separate box of libraries for each project, so nothing clashes. uv is a free tool that creates that box and installs libraries quickly. A .env file just means a hidden file that keeps your API key out of your code, and an API key is the password your code uses to call an AI model. And Git just means saving the history of your code, so you can undo mistakes.

**[On camera]**

So let's say you paste your API key straight into your script and push it to GitHub. Anyone who finds that key can send requests on your account, and you pay for every one of them. Your API key is a password. Keep it in the .env file, and keep that file out of Git.

#### Number two: Lists and dictionaries

**[On camera]**

Number two is lists and dictionaries, and the rule is to get really good at them, especially when one sits inside another. The reason is that almost everything you send to a model, and everything you get back, comes in one of those two shapes. A list just means items in order, like a shopping list. A dictionary just means labelled values, like a contact card with a name, a phone number, and an email.

**[PAUSE] [Graphic 5, full screen: a model reply drawn as nested boxes: the reply holds a list called "content", which holds a dictionary with "type" and "text", and the answer is highlighted three levels down]**

When a model answers, the text you want usually sits a few levels deep. It's inside a dictionary, inside a list, inside the reply. If you can't read nested data like that, you can't even get the answer out, right? And when you send a conversation to a model, you send a list of dictionaries, one for each message. That's how a chatbot remembers what you said two messages ago.

**[PAUSE]**

**[Card beside you: "f-strings", "Loops", "if", "Functions"]**

An f-string just means a sentence with blanks that Python fills in, like a form letter, and it's how you build prompts. So let's say you have five hundred support tickets. A loop goes through each ticket, an if statement keeps only the ones that mention a refund, and an f-string puts each one into your prompt. Then you wrap all of that in a function, so you can run it again tomorrow with one line. AI apps are mostly text going in and nested data coming out.

#### Number three: Talking to APIs

**[On camera]**

Number three is talking to APIs, and the rule is to expect every call to fail sometimes. An API just means one program asking another program for something, like a weather app asking a server for today's forecast. When you call an AI model, you're sending a request over the internet to someone else's computer. It can be slow, it can be busy, and sometimes it's just down.

**[PAUSE] [Graphic 6, full screen, labelled "Let's say": "1,000 requests", "2% fail = 20 failures", "No error handling: crash at request 37, lose the 963 after it", "try/except and a retry: all 1,000 answers"]**

So let's do the math. Let's say you send a thousand requests, and two percent of them fail with a timeout. That's twenty failures. If your script has no error handling, it crashes at the first one, let's say request thirty-seven, and you lose the nine hundred sixty-three after it. But you can use try and except, which just means "try this, and if it fails, do that instead." Then your code waits a second and tries again, and so you end up with all one thousand answers.

**[PAUSE]**

**[Card beside you: "JSON", "Files", "Rate limit"]**

You also learn JSON, which just means the text format most APIs use to send data, and it turns straight into the lists and dictionaries from number two. Files come in here too, because you read your documents in and save your results, so you don't pay for the same answers twice. And then there's the rate limit, which just means the API only lets you send so many requests a minute. A script that works once is a demo. A script that survives a failure is something you can ship.

#### Number four: Types and Pydantic

**[On camera]**

Number four is types and Pydantic, and it's where AI code is most different from normal Python. The rule is to describe the shape of your data in your code. A type hint just means a label that says what kind of value goes in, like a whole number or some text. Pydantic is a library that checks your data actually matches the shape you described.

**[PAUSE] [Graphic 7, full screen: a Pydantic model called "Invoice" with three fields, "vendor: text", "amount: number" and "due_date: date"; the model's answer "amount: about two hundred dollars" arrives and a red "Rejected: not a number" appears]**

So let's say you build a tool that reads invoices and pulls out three things: the vendor, the amount, and the due date. You describe that shape with Pydantic, and you ask the model to answer in that shape. Then one day the model writes "about two hundred dollars" for the amount. Pydantic rejects it, because it's not a number. And so you catch the problem before it lands in your database. A lot of checking means bad data stops at the door. A little checking means you find it a month later in a report.

**[PAUSE]**

**[PAUSE] [Graphic 8, full screen: a short tool function, "def add(a: int, b: int) -> int:" with a one-line docstring, and an arrow pointing to it: "This is what the model reads"]**

And type hints matter even more when you give a model tools. A tool just means a function the model is allowed to call, like looking up an order. Most of these connect through MCP, the Model Context Protocol, which is the standard plug between AI apps and the things they use. In MCP's official Python kit, your function's type hints become the instructions the model reads, and the short description under the function explains what it does. And so in normal code, type hints help people read your code. In AI code, the model reads them too.

**[PAUSE]**

**[Card beside you: "Classes: enough to read and write a Pydantic model"]**

Pydantic also answers how much object-oriented programming you need. A Pydantic model is a class, which just means a template for one kind of thing, like a form with labelled boxes. So you need simple classes like that, and the rest can wait.

#### Number five: Async

**[On camera]**

Number five is async, and none of the popular Python for AI videos I looked at teach it, even though viewers are asking for it. The rule is that when you call a model many times, you run the calls at the same time. The reason is that most of the time, your code isn't doing anything while the model thinks. It's just waiting.

**[Card beside you: "Async: start the next request while you wait for the last one"]**

Async just means your code starts the next request while it waits for the last one. It's like a waiter who takes orders at five tables, instead of standing at one table until the food arrives.

**[PAUSE] [Graphic 9, full screen, labelled "Let's say": "One at a time: 1,000 × 3 seconds = 3,000 seconds = 50 minutes" beside "20 at a time: 1,000 ÷ 20 = 50 rounds × 3 seconds = 150 seconds = 2.5 minutes"]**

So let's do the math. Let's say you have a thousand support tickets, and each model call takes three seconds. One at a time, that's three thousand seconds, which is fifty minutes. Now let's say you run twenty at a time with async. A thousand divided by twenty is fifty rounds, and fifty rounds times three seconds is a hundred fifty seconds. That's two and a half minutes. It's the same model and the same answers, so which one would you rather show your manager?

**[PAUSE]**

**[On camera]**

Number three comes back here, because you can't just send a thousand calls at once. The rate limit stops you. So you go as fast as the API allows, and no faster.

#### Number six: Tests and evals

**[On camera]**

Number six is tests and evals, and the rule is to check your code and your model separately. A test just means a small program that checks your code, like making sure the function that splits a document gives back the right number of pieces. In Python, most people use a tool called pytest for that. An eval just means a list of questions with the correct answers, and a score for how many your system gets right.

**[Card beside you: "Test: same input, same output, every time" and "Eval: the model can answer differently each time, so you score it"]**

You need both, because they catch different problems. Normal code gives the same answer every time, so a test can check it once. A model doesn't. It can answer the same question differently, so you have to score it on lots of questions.

**[PAUSE] [Graphic 10, full screen, labelled "Let's say": "50 questions: 41 right = 82%", then "New prompt: 46 right = 92%"]**

So let's say you write fifty questions for your invoice tool, and it gets forty-one right. Forty-one out of fifty is eighty-two percent. Then you change your prompt, run the same fifty again, and it gets forty-six right, which is ninety-two percent. Now you know the change helped, and by how much. And pandas, a library that works like a spreadsheet inside Python, lines up the results so you can see which questions it missed. Without an eval, "it seems better" is a feeling. With one, it's a number.

**[PAUSE]**

**[PAUSE] [Graphic 11, full screen: the library list: "uv", "httpx or requests", "Pydantic", "asyncio", "pytest", "pandas", "Your model's official SDK", with "Later: FastAPI and a vector database" underneath]**

And here are the libraries in one place. You need uv, httpx or requests, Pydantic, asyncio, pytest, pandas, and the official SDK from your model provider. An SDK just means the ready-made library a company gives you to use its service. Later, you'll add FastAPI to put your app online and a vector database to search your documents, but not on day one.

**[PAUSE]**

**[On camera]**

And if you're already a data engineer, you have a head start that almost nobody mentions. You already handle JSON, files, APIs, and jobs that fail, every single day. So you've basically got numbers one, two and three already. Start at number four this week.

### Part 4: How to learn it without getting stuck

**[On camera]**

Now let's talk about how to actually learn this. Watching tutorials feels like learning. It isn't. My rule is type it, break it, explain it.

**[PAUSE] [Graphic 12, full screen: three steps: "Type it", "Break it", "Explain it"]**

Type it means you write the code yourself, even when it's slow. Break it means you change one thing on purpose and read the error. So let's say you delete one letter from your API key in the .env file and run the script. You'll get an authentication error. Now you've seen it, and so when it happens at work, you fix it in a minute instead of an hour. And explain it means you walk through the code out loud, line by line, until nothing in it surprises you.

**[PAUSE]**

**[On camera]**

The first time you learn each topic, use AI as a teacher, not a writer. Ask it to explain a line, or ask it to quiz you. Once you can explain the code yourself, let AI write it and you review it. That's how the job works now anyway.

**[PAUSE] [Graphic 13, full screen: one project in six levels: "1 Call a model, key in .env", "2 Loop over 50 documents and pull out the answers", "3 Add retries and save to JSON", "4 Answers come back as a Pydantic model", "5 Run the calls with async", "6 Add tests and a 30-question eval"]**

The best way to practice is one small project with a level for each of the six. Level one calls a model, with your key in a .env file. Level two loops over fifty documents and pulls out the answers. Level three adds retries and saves the results to JSON. Level four makes the answers come back as a Pydantic model. Level five runs the calls with async. And level six adds tests and a thirty-question eval. Then you put it on GitHub with a short README, and now you have something to show in an interview.

**[PAUSE]**

**[On camera]** *(Chris to confirm.)*

When I interview engineers, I don't care much whether someone can write Python from memory. I care whether they can walk me through code they wrote and tell me what happens when it fails. That project gives you exactly that conversation.

**[On camera]** *(Chris's estimate. Chris to confirm.)*

If you've never coded before, plan on about three months at ten hours a week for all six. If you already code in another language, it's more like four to six weeks.

### Your turn

**[On camera]**

So here's your one task for this week. Write a script that sends ten questions to a model, saves the answers to a JSON file, and keeps going if one call fails. That's probably about thirty lines. And if you don't want to pay for an API while you learn, you can run a small open model on your own laptop with a free tool called Ollama, and practice the exact same Python. Most people won't do this. They'll watch another tutorial instead, and so if you build it, you're already ahead of them.

### Call to action

**[PAUSE] [CTA motion graphic, full screen: cta.mp4]**

If you want help figuring out where to start, book a free fifteen-minute career call with me, and the link is in the description. And if you want a structured path with real projects and feedback, the Stackle AI Engineering Masterclass is linked there too.

**[PAUSE]**

**[On camera]**

Tell me in the comments which of the six you're on right now, from one to six.

---

## Graphics list

1. **Graphic 1:** Stack Overflow survey 2025: "66%: AI answers that are almost right, but not quite" and "45%: fixing AI-written code takes longer". Then Stack Overflow survey 2026: "48% trust AI when they can easily check the answer".
2. **Graphic 2:** "Veracode tested 100+ AI models on 80 coding tasks", "45% had a security flaw", "Bigger models did not do much better".
3. **Graphic 3:** GitHub Octoverse 2025: "TypeScript: #1 language by contributors" beside "Python: nearly half of all new AI projects (582,196)".
4. **Graphic 4:** six blocks in a row: 1 Your setup, 2 Lists and dictionaries, 3 Talking to APIs, 4 Types and Pydantic, 5 Async, 6 Tests and evals. Reuse this graphic as a small progress bar at the start of each numbered point.
5. **Graphic 5:** a model reply drawn as nested boxes. The reply holds a list called "content", which holds a dictionary with "type" and "text". The answer is highlighted three levels down.
6. **Graphic 6:** the failure math, labelled "Let's say", one line at a time as Chris says it:
   - 1,000 requests
   - 2% fail = 20 failures
   - No error handling: crash at request 37, lose the 963 after it
   - try/except and a retry: all 1,000 answers
7. **Graphic 7:** a Pydantic model called "Invoice" with "vendor: text", "amount: number" and "due_date: date". The answer "amount: about two hundred dollars" arrives, and a red "Rejected: not a number" appears.
8. **Graphic 8:** a short tool function, `def add(a: int, b: int) -> int:` with a one-line docstring, and an arrow: "This is what the model reads".
9. **Graphic 9:** the async math, labelled "Let's say":
   - One at a time: 1,000 × 3 seconds = 3,000 seconds = 50 minutes
   - 20 at a time: 1,000 ÷ 20 = 50 rounds × 3 seconds = 150 seconds = 2.5 minutes
10. **Graphic 10:** the eval score, labelled "Let's say": "50 questions: 41 right = 82%", then "New prompt: 46 right = 92%".
11. **Graphic 11:** the library list, in the order Chris says them: uv, httpx or requests, Pydantic, asyncio, pytest, pandas, your model's official SDK. Underneath: "Later: FastAPI and a vector database".
12. **Graphic 12:** three steps: "Type it", "Break it", "Explain it".
13. **Graphic 13:** one project in six levels:
    1. Call a model, key in .env
    2. Loop over 50 documents and pull out the answers
    3. Add retries and save to JSON
    4. Answers come back as a Pydantic model
    5. Run the calls with async
    6. Add tests and a 30-question eval

**Cards beside you:**
- The email-sorting example.
- "Skip for now" list.
- Number one: virtual environment, uv, .env file, Git.
- Number two: f-strings, loops, if, functions.
- Number three: JSON, files, rate limit.
- Number four: "Classes: enough to read and write a Pydantic model".
- Number five: "Async: start the next request while you wait for the last one".
- Number six: test versus eval.

**Existing motion graphics:** intro.mp4 and cta.mp4 in `stackle-video/graphics/`.

**On-screen labels I shortened or made up (please check):**
- "45%: fixing AI-written code takes longer" on Graphic 1. The survey wording is "Debugging AI-generated code is more time-consuming".
- "48% trust AI when they can easily check the answer" on Graphic 1. The survey says "validate".
- "Bigger models did not do much better" on Graphic 2. Veracode's wording is "larger models do not perform significantly better than smaller models".
- "TypeScript: #1 language by contributors" on Graphic 3. Chris says "TypeScript now has the most contributors on GitHub".
- "This is what the model reads" on Graphic 8.
- The six level names on Graphic 13, which are shortened from the script.
- The "Let's say" labels on Graphics 6, 9 and 10.

All other on-screen text uses the script's words.

---

## Title

**Python for AI: Exactly What to Learn and What to Skip** (52 characters)

Alternative: "Python for AI Engineers 2027: The Only 6 Things You Need" (56 characters)

## Description

In this video, I show you exactly how much Python you need to become an AI engineer, and which parts you can skip. Python shows up in 62% of AI engineering job postings in the US, but most Python courses teach far more than an AI engineer uses. You'll get the six things you need in the order you'll use them, and a project that teaches all six.

**Chapters**
0:00 How much Python you need for AI
--:-- Do you still need Python if AI writes the code?
--:-- What you can skip
--:-- The six things you need
--:-- 1. Your setup
--:-- 2. Lists and dictionaries
--:-- 3. Talking to APIs
--:-- 4. Types and Pydantic
--:-- 5. Async
--:-- 6. Tests and evals
--:-- How to learn it without getting stuck
--:-- Your task this week

**Book a free 15-minute career call:** https://calendar.app.google/2HjLnF1HSov9m5Gk9
**Stackle AI Engineering Masterclass:** [ADD LINK]

**Sources**
- Axial Search, AI Engineering Jobs in 2026 (43,480 US postings; updated 13 Oct 2026): https://axialsearch.com/insights/ai-engineering-jobs
- Stack Overflow Developer Survey 2025, AI: https://survey.stackoverflow.co/2025/ai
- Stack Overflow Developer Survey 2026, AI: https://survey.stackoverflow.co/2026/ai
- Veracode, AI-generated code security research (30 Jul 2025): https://www.veracode.com/press-release/ai-generated-code-poses-major-security-risks-in-nearly-half-of-all-development-tasks-veracode-research-reveals/
- GitHub Octoverse 2025 (28 Oct 2025): https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/
- MCP Python SDK: https://github.com/modelcontextprotocol/python-sdk
- Ollama, OpenAI compatibility: https://docs.ollama.com/api/openai-compatibility

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab

---

## Things I added that you did not give me (please check)

1. **Style:** you didn't ask for a style this time, so I used the Hormozi style from your last three scripts. Say the word if you want the plain Stackle style instead.
2. **The intro keeps the interviews sentence.** I treated this as a roadmap video, not a tool video. Cut that one sentence if you want it out.
3. **Two lines in your voice need your OK:**
   - "When I interview engineers, I don't care much whether someone can write Python from memory. I care whether they can walk me through code they wrote and tell me what happens when it fails."
   - "If you're already a data engineer... you've basically got numbers one, two and three already."
4. **The timeline is my estimate, not a source:** about three months at ten hours a week from zero, and four to six weeks if you already code. "About thirty lines" for the task this week is also an estimate.
5. **"None of the popular Python for AI videos I looked at teach async"** is true for the ten videos in the brief. It's a claim about those ten, not about all of YouTube.
6. **Where the style rules beat the script skill**, as in your last three scripts:
   - The video opens with "In this video, I'm going to...", and the 62% fact is the second sentence.
   - The mirror pairs repeat a key word on purpose ("If you can read Python... If you can't...", "A lot of checking... A little checking...").
7. **The 62% figure counts postings that mention Python,** not postings that require it. Other studies give 71% (365 Data Science, 1,000 postings) and 82.5% (Dataquest, about 1,000 postings, March 2026). I used the largest and most recent sample.
8. **Length:** about 18 minutes. To get to about 16, cut these, in this order:
   - the TypeScript question and Graphic 3 (about 125 words);
   - the Veracode paragraph and Graphic 2 (about 55 words);
   - the library list and Graphic 11 (about 65 words);
   - the "Number three comes back here" lines in number five (about 30 words);
   - the classes card in number four (about 45 words);
   - the "use AI as a teacher" paragraph (about 50 words).
9. **The AI Engineering Masterclass link is missing.** The fixed links line only has the Data Engineering Masterclass.
