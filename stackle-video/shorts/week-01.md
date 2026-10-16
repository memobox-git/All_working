# Week 1 Shorts: 14 scripts with edit notes

All 14 use **setup A** (phone, vertical, face to camera), so they can be filmed in one session of about 60–90 minutes. Chris speaks about 150 words a minute, so 100 words is about 40 seconds.

**Labels in the scripts:**
- **[On camera]**: only Chris, full screen, with captions.
- **[Graphic N]**: a graphic fills the top half of the screen, and Chris stays in the bottom half (template T2). Chris keeps talking.
- **[Card]**: Chris stays full screen, and a text card pops up beside him (template T1).
- *[pause]*: a one-second pause where a graphic starts or ends.

**Every Short:**
- Hook text on screen for the first 2 seconds.
- Captions all the way through.
- A small zoom-in every 5–7 seconds.
- No intro, no logo and no music.
- A related-video link set at upload to the long video named in each Short.

Lines marked **[CHECK]** are hiring-side claims written for Chris. Each one must match what he really saw in his interviews, or be changed. Lines marked **[CHRIS: …]** are blanks only Chris can fill.

---

## Research brief

Claude in Chrome is not connected in this cloud session, so this brief uses:
- the channel research from 15 October 2026 (`research_notes/AI data career YouTube growth/`)
- web search for the fact checks

| Creator | Short | Views | Series it informs |
|---|---|---|---|
| Sundas Khalid | "Don't Become a Data Analyst if" | 3.5M | S09 |
| Sundas Khalid | "Data Engineer vs. Data Scientist ft. @eczachly_" | 2.1M | S10 |
| Zach Wilson | "The four levels of data engineering!" | 373K | S11 |
| Zach Wilson | "Master the 5 levels of SQL" | 426K | S11 |
| The Big Data Show | Explaining your project in a data engineering interview | 306K | S04, S07 |
| Sumit Mittal | "Advantages of PARQUET FILE FORMAT in Apache Spark" | 243K | S05 |
| Data with Baraa | "Don't Become a Data Engineer!" | 168K | S09 |

**What they all do:** one question or one claim in the first line, one point, under a minute.

**Our angle:**
- Every career Short comes from the hiring side: what Chris saw in 200+ interviews.
- Every teaching Short ends with the one line an engineer can say in an interview.
- No other creator's sentences, hooks or examples are reused.

---

## S01 · AI term in 30 seconds: Token

- **Type:** AI term in 30 seconds · **Edit:** T2 · **Words:** 110 · **Length:** about 45 seconds
- **Hook text:** "You pay AI by the token"
- **Related video:** 20 AI Concepts Every Engineer Should Know
- **Title:** What Is a Token in AI? Explained in 45 Seconds

**[On camera]** Every AI model charges you by the token, so you should know what a token is.

*[pause]* **[Graphic 1]** "Snowflake" cut into "Snow" and "flake".

A token just means a small piece of text. A short word is usually one token, and a long word is often cut into two or more. On OpenAI's tokenizer, the word "Snowflake" is two tokens, "Snow" and "flake".

*[pause]* **[Graphic 2]** "Hello, why is the dashboard empty?" English: 8 tokens. Hindi: 15 tokens.

The same question can cost more in another language. On that tokenizer, "Hello, why is the dashboard empty?" is eight tokens in English and fifteen in Hindi.

*[pause]* **[On camera]** So when you build with AI, count your tokens, because tokens are what you pay in. All twenty AI terms are in the full video, linked right here.

---

## S02 · AI term in 30 seconds: Context window

- **Type:** AI term in 30 seconds · **Edit:** T2 · **Words:** 125 · **Length:** about 50 seconds
- **Hook text:** "AI can't read everything at once"
- **Related video:** 20 AI Concepts Every Engineer Should Know
- **Title:** What Is a Context Window in AI? Explained in 50 Seconds

**[On camera]** An AI model can only read a limited amount of text at one time, and that limit is called the context window.

*[pause]* **[Graphic 1]** A box labelled "Context window: about 1 million tokens", filling up with instructions, documents and the chat.

The context window just means the most text a model can read at one time, counted in tokens, which are small pieces of text. The newest models from Anthropic, OpenAI and Google can hold about one million tokens.

*[pause]* **[Graphic 2]** A pile labelled "Three years of logs" that does not fit in the box.

Let's say you want an AI to explain why a job failed, and you have three years of logs. Even a million tokens won't hold them. And models can get worse at finding the right detail as you give them more text.

*[pause]* **[On camera]** So the skill is not giving the model everything. The skill is picking what goes in. The full video is linked right here.

---

## S03 · AI term in 30 seconds: RAG

- **Type:** AI term in 30 seconds · **Edit:** T2 · **Words:** 127 · **Length:** about 50 seconds
- **Hook text:** "RAG explained in 50 seconds"
- **Related video:** 20 AI Concepts Every Engineer Should Know
- **Title:** What Is RAG in AI? Retrieval-Augmented Generation in 50 Seconds

**[On camera]** RAG is how an AI answers from your company's documents instead of guessing.

*[pause]* **[Graphic 1]** Three steps. Retrieve: "Find the right page." Augment: "Add it to the prompt." Generate: "Answer from it."

RAG stands for retrieval-augmented generation. RAG just means you find the right documents and add them to the prompt before the model answers. Retrieve means find, augment means add, and generate means write the answer.

*[pause]* **[Graphic 2]** The question "How do I restart the billing pipeline?" with and without the help page in the prompt.

Let's say someone asks your help bot how to restart the billing pipeline. Without RAG, the model guesses. With RAG, your code finds the right help page and puts it in the prompt, so the model answers from your real steps.

*[pause]* **[On camera]** The model does not change, only the prompt does. And finding the right pages and keeping them up to date is a data pipeline, which is exactly what data engineers build. The full video is linked right here.

---

## S04 · Interview question: "Walk me through a pipeline you've built"

- **Type:** Interview question of the day · **Edit:** T1 · **Words:** 131 · **Length:** about 50 seconds
- **Hook text:** "Walk me through a pipeline you've built."
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** Data Engineer Interview Question: Walk Me Through a Pipeline

**[On camera]** "Walk me through a pipeline you've built" comes up in a lot of data engineering interviews, and many answers start in the wrong place. **[CHECK]**

*[pause]* **[Card]** "1. The business problem"

Start with the business problem in one sentence: who needed the data, and why they needed it.

*[pause]* **[Card]** "2. Every stage: source, ingest, clean, store, schedule, monitor"

Then walk through every stage in order. Say where the data comes from, how you pull it in, how you clean and check it, where you store it, how it runs on a schedule, and how you know when it breaks.

*[pause]* **[Card]** "3. One number"

Then give one number, like how much data it moved each day or how many hours it saved.

*[pause]* **[On camera]** A pipeline answer with a reason, every stage and a number sounds like someone who really built it. More of what I listen for is in the video linked right here.

---

## S05 · Interview question: Parquet vs CSV

- **Type:** Interview question of the day · **Edit:** T2 · **Words:** 124 · **Length:** about 50 seconds
- **Hook text:** "Why Parquet instead of CSV?"
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** Parquet vs CSV: The Data Engineer Interview Answer

**[On camera]** When an interviewer asks why data teams use Parquet instead of CSV, there is a one-line answer they want to hear.

*[pause]* **[Graphic 1]** The same table stored two ways: CSV as rows of plain text, Parquet as columns.

A CSV file is plain text, stored row by row. Parquet is a column-oriented file format, which just means it stores the values of each column together.

*[pause]* **[Graphic 2]** A table with 50 columns. A query needs 3. Parquet reads 3 columns, and CSV reads every full row.

That matters because many analytics queries read only a few columns. Let's say your table has fifty columns and your query needs three. With Parquet, the engine can read just those three columns. With CSV, it has to read every row in full.

*[pause]* **[Graphic 3]** "Parquet: columnar, compressed, typed."

Parquet also compresses well, and it stores data types, so a date stays a date.

*[pause]* **[On camera]** So say it in one line: Parquet is columnar, compressed and typed, which makes analytics faster and cheaper.

---

## S06 · Interview question: ETL vs ELT

- **Type:** Interview question of the day · **Edit:** T2 · **Words:** 126 · **Length:** about 50 seconds
- **Hook text:** "ETL vs ELT: the only difference is the order"
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** ETL vs ELT Explained: Data Engineer Interview Question

**[On camera]** ETL and ELT use the same three letters, and the only difference is the order.

*[pause]* **[Graphic 1]** ETL: Extract, then Transform on a separate server, then Load into the warehouse.

ETL stands for extract, transform, load. You pull the data out, clean and reshape it on a separate server, and then load it into the warehouse.

*[pause]* **[Graphic 2]** ELT: Extract, then Load raw data into the warehouse, then Transform inside it.

ELT stands for extract, load, transform. You load the raw data into the warehouse first, and then transform it there, using the warehouse's own computing power.

*[pause]* **[Graphic 3]** "New report needs a column you dropped." ELT: run a new transformation. ETL: pull from the source again.

Let's say a new report needs a column you dropped. With ELT, the raw data is still in the warehouse, so you just run a new transformation. With ETL, you may have to pull it from the source again.

*[pause]* **[On camera]** ETL still fits when sensitive data must be masked before it lands. ELT is the common pattern for cloud warehouses.

---

## S07 · Across the Table: Rejection reason #1

- **Type:** Rejection reason #N · **Edit:** T1 · **Words:** 103 · **Length:** about 40 seconds
- **Hook text:** "Rejection reason #1"
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** Why Data Engineers Get Rejected: Reason #1

**[On camera]** Rejection reason number one, from more than two hundred interviews I have run: you can't explain your own project. **[CHECK]**

*[pause]* **[Card]** "Built a real-time pipeline with Kafka and Spark." Then: "Why Kafka?"

Let's say your resume says you built a real-time pipeline with Kafka and Spark. The first follow-up question is "Why Kafka?", and if the project came from a tutorial, there is often no answer.

*[pause]* **[Card]** "For every tool: why this one, and not the other choice?"

**[On camera]** The fix is simple. For every tool in your project, know why you picked it over the other choice. For example, know why you used Kafka instead of a simple queue, and why you used Spark instead of plain Python. The other reasons are in the video linked right here.

---

## S08 · Across the Table: Rejection reason #2

- **Type:** Rejection reason #N · **Edit:** T1 · **Words:** 87 · **Length:** about 35 seconds
- **Hook text:** "Rejection reason #2"
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** Why Data Engineers Get Rejected: Reason #2

**[On camera]** Rejection reason number two: your resume lists fifteen tools, and you can't go deep on any of them. **[CHECK]**

*[pause]* **[Card]** A skills line: "Spark, Kafka, Airflow, Snowflake, dbt, AWS, Azure…" with one tool circled.

Let's say your skills section lists Spark, Kafka, Airflow, Snowflake, dbt, AWS, Azure and eight more. The interviewer picks one and asks how it works inside. When that answer stays on the surface, the rest of the list stops counting too.

*[pause]* **[Card]** "3 tools you know deeply > 15 tools you have touched"

**[On camera]** So cut the list to the tools you can talk about for ten minutes. Three tools you know deeply are worth more than fifteen you have only touched.

---

## S09 · Don't become a data engineer if…

- **Type:** Don't become a data engineer if… · **Edit:** T1 · **Words:** 108 · **Length:** about 45 seconds
- **Hook text:** "Don't become a data engineer if…"
- **Related video:** How I'd Become a Data Engineer in 2027 If I Started Over
- **Title:** Don't Become a Data Engineer If This Sounds Bad to You

**[On camera]** Don't become a data engineer if these three things sound bad to you.

*[pause]* **[Card]** "1. Fixing things that broke"

First, you will fix things that broke. Pipelines fail, and someone has to find out why, sometimes before the morning reports go out.

*[pause]* **[Card]** "2. Quiet work"

Second, good data engineering work is quiet. When a pipeline works, nobody notices. The analysts show the charts, and the pipeline behind them stays invisible.

*[pause]* **[Card]** "3. Always learning"

Third, the tools keep changing. Many teams moved from Hadoop to Spark, and now AI is changing the job again, so you never stop learning.

*[pause]* **[On camera]** If none of that scares you, data engineering is a great job. The full roadmap is in the video linked right here.

---

## S10 · Data analyst vs data engineer vs AI engineer

- **Type:** X vs Y · **Edit:** T2 · **Words:** 115 · **Length:** about 45 seconds
- **Hook text:** "Analyst vs data engineer vs AI engineer"
- **Related video:** How I'd Become a Data Engineer in 2027 If I Started Over
- **Title:** Data Analyst vs Data Engineer vs AI Engineer: What They Do

**[On camera]** A data analyst, a data engineer and an AI engineer all work with data, but they do very different work every day.

*[pause]* **[Graphic 1]** Three columns. Analyst: "Why did sales drop?" Data engineer: "Is the sales data on time and correct?" AI engineer: "Can a bot answer from our documents?"

A data analyst answers questions with data. Let's say sales dropped last week. The analyst finds out why and shows it in a dashboard.

A data engineer builds the pipelines that bring the data in, and makes sure the sales data arrives on time, clean and complete.

An AI engineer builds products on top of AI models, like a help bot that answers from the company's documents.

*[pause]* **[On camera]** So pick the job whose daily work you would enjoy, not the one with the loudest headlines. The video linked right here shows where to start.

---

## S11 · The 4 levels of a data engineering project

- **Type:** Levels of · **Edit:** T2 · **Words:** 129 · **Length:** about 50 seconds
- **Hook text:** "4 levels of data engineering projects. Which is yours?"
- **Related video:** Why You Keep Getting Rejected for Data Engineer Jobs
- **Title:** The 4 Levels of Data Engineering Projects (Which Is Yours?)

**[On camera]** There are four levels of data engineering projects, and in my interviews, the top two got the most attention. **[CHECK]**

*[pause]* **[Graphic 1]** Four steps, filling in one at a time as Chris names them.

At level one, you load a CSV file into a notebook and make a chart. Almost everyone has this project.

At level two, the data comes from a real source, like an API, and lands in cloud storage on a schedule. A tool like Airflow, which is a scheduler for pipelines, runs it every day.

At level three, you add data quality checks and alerts, so you know the data is wrong before anyone else does.

At level four, the project answers a real business question, and you can explain the cost, the trade-offs and what you would change.

*[pause]* **[On camera]** Which level is your project at? Tell me in the comments.

---

## S12 · If I started data engineering over

- **Type:** If I started over · **Edit:** T1 · **Words:** 91 · **Length:** about 35 seconds
- **Hook text:** "If I started data engineering over in 2027…"
- **Related video:** How I'd Become a Data Engineer in 2027 If I Started Over
- **Title:** If I Started Data Engineering Over, I'd Learn These 3 First

Keep this Short in sync with the long video once that script is written.

**[On camera]** If I had to start data engineering again in 2027, I would learn three things first, in this order.

*[pause]* **[Card]** "1. SQL"

First, SQL, because most of the data engineering interviews I have run tested it. **[CHECK]**

*[pause]* **[Card]** "2. Python"

Second, Python, which you use to pull data from APIs, clean it and move it.

*[pause]* **[Card]** "3. One cloud platform"

Third, one cloud platform, such as AWS, Azure or Google Cloud, and how to build one pipeline on it from start to finish.

*[pause]* **[On camera]** Spark, Kafka and the AI tools come after these three. The full roadmap is in the video linked right here.

---

## S13 · W2 vs 1099 vs C2C (US)

- **Type:** Money · **Edit:** T2 · **Words:** 118 · **Length:** about 45 seconds
- **Hook text:** "W2 vs 1099 vs C2C: same rate, different money"
- **Related video:** How I'd Become a Data Engineer in 2027 If I Started Over
- **Title:** W2 vs 1099 vs C2C for Data Engineers in the US
- **Platforms:** YouTube, Instagram and the US TikTok account

**[On camera]** In the United States, a data engineering offer can come as W2, 1099 or C2C, and the same hourly rate does not mean the same money.

*[pause]* **[Graphic 1]** "W2: employee. Employer takes taxes out and pays half of Social Security and Medicare."

W2 just means you are an employee. Your employer takes taxes out of each paycheck and pays half of your Social Security and Medicare tax.

*[pause]* **[Graphic 2]** "1099: contractor. You pay both halves: 15.3% self-employment tax. Usually no benefits."

1099 just means you are an independent contractor. You pay both halves yourself, which the IRS calls self-employment tax, and it is 15.3 percent. You also usually get no benefits, like health insurance.

*[pause]* **[Graphic 3]** "C2C: your company signs with their company."

C2C means corp-to-corp, where your own company signs the contract and handles the taxes.

*[pause]* **[On camera]** So before you compare rates, add the taxes and the lost benefits, and ask a tax professional before you sign.

---

## S14 · Real interview moment: Amazon, section 2

- **Type:** Real interview moment · **Edit:** T1 · **Words:** fill in (aim for 100–130) · **Length:** about 45–55 seconds
- **Hook text:** "Amazon data engineer interview. Section 2."
- **Related video:** Why You Keep Getting Rejected (in week 2, switch it to "My Amazon Data Engineer Interview")
- **Title:** My Amazon Data Engineer Interview: The Question That Stopped Me

This Short is based on Chris's LinkedIn post that reached 37,031 impressions. Only Chris can fill the blanks. Nothing here may be invented.

**[On camera]** In my data engineering interview at Amazon, section two stopped me in the middle of a thought.

*[pause]* **[Card]** The question, word for word.

The question was: **[CHRIS: the exact question]**.

**[On camera]** **[CHRIS: what you started to say, and the moment you knew it was the wrong path]**.

*[pause]* **[Card]** "What a strong answer covers"

**[CHRIS: what you said instead, or what a strong answer covers, in two or three sentences]**.

*[pause]* **[On camera]** **[CHRIS: the one-line lesson]**. The whole interview, round by round, is in the video linked right here.

---

## Graphics list (made with the intro graphics tool, in Stackle colours)

| Short | Graphics |
|---|---|
| S01 | "Snow" + "flake" token split; English 8 vs Hindi 15 tokens |
| S02 | Context window box filling up; "three years of logs" pile that doesn't fit |
| S03 | Retrieve, augment, generate; the help-bot question with and without the page |
| S05 | CSV rows vs Parquet columns; 50 columns, query needs 3; "columnar, compressed, typed" |
| S06 | ETL flow; ELT flow; "new report needs a column you dropped" |
| S10 | Three columns: analyst, data engineer, AI engineer |
| S11 | Four project levels, filling in one at a time |
| S13 | W2, 1099 and C2C cards |
| Cards (T1) | S04, S07, S08, S09, S12, S14 text cards |

## Filming order

Film in one session. Same shirt, same spot, phone at eye level. Leave a 2-second pause between Shorts, so the edit can split them automatically.

1. Teaching Shorts first, while your energy is high: S01, S02, S03, S05, S06, S10, S11.
2. Hiring-side Shorts: S04, S07, S08, S12.
3. Opinion and money: S09, S13.
4. S14 last, after the blanks are filled.

## Sources

| Fact | Source |
|---|---|
| "Snowflake" is "Snow" + "flake"; "Hello, why is the dashboard empty?" is 8 tokens in English and 15 in Hindi | OpenAI tiktoken, o200k_base (the GPT-4o tokenizer), checked 13 Oct 2026, from the 20 AI Concepts script |
| The newest models from Anthropic, OpenAI and Google hold about 1 million tokens | Anthropic, OpenAI and Google model docs, checked 13 Oct 2026, from the 20 AI Concepts script |
| Models can get worse at finding details as input grows | [Chroma, "Context Rot"](https://www.trychroma.com/research/context-rot), 14 Jul 2025 |
| RAG: find documents and add them to the input | [Lewis and others, arXiv 2005.11401](https://arxiv.org/abs/2005.11401), May 2020 |
| Parquet is column-oriented, with compression and encoding schemes; readers find only the column chunks they need | [Apache Parquet overview](https://parquet.apache.org/docs/overview/); [file format](https://parquet.apache.org/docs/file-format/) |
| ETL transforms before loading; ELT loads raw data and transforms in the warehouse; ETL can mask data before it lands | [IBM, ELT vs ETL](https://www.ibm.com/think/topics/elt-vs-etl); [AWS, ETL vs ELT](https://aws.amazon.com/compare/the-difference-between-etl-and-elt/); [Google Cloud, What is ELT](https://cloud.google.com/discover/what-is-elt) |
| Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) | [IRS, Self-employment tax](https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes) |
| Amazon interview, "section 2 stopped me mid-thought", 37,031 impressions | Chris's LinkedIn post, as listed in the stackle-linkedin-posts skill |

## Added for Chris to check

- Every **[CHECK]** line: S04, S07, S08, S11, S12. These say what Chris saw in his interviews. Keep, change or cut each one.
- S09: "Many teams moved from Hadoop to Spark" is a general industry claim, not from a source.
- S13 is for the US audience. It is not tax advice, and the Short says to ask a tax professional.
- The Short call to action points to the related long video, not the free call. This follows the Shorts plan, not the long-video rule in the stackle-script skill.
