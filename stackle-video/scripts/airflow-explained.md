# Apache Airflow, Explained: Script

**Title:** Apache Airflow Explained in 90 Seconds (Architecture Included)

**Show:** Explained for Data Engineers

**Spoken words:** 245 · **Length:** 1:35 (voice 1:31, plus the closing title)

**Format:** White-background motion graphics, voiced by the ElevenLabs "Crispus Roshan" voice (`eleven_v4`, calm delivery), with soft original music underneath and no sound effects. Source and build steps are in `stackle-video/source/airflow/`.

---

## Script

> [calm] Every morning, before anyone at work opens a laptop, thousands of data pipelines have already run. Something decided when each one should start, in what order, and what to do when one fails. In a lot of companies, that something is Apache Airflow.
>
> Airflow is an open-source tool for orchestrating workflows. Orchestrating just means running the right task, at the right time, in the right order. It started at Airbnb in 2014, and today it's a top-level Apache project.
>
> You write each pipeline in Python, as a DAG. DAG just means directed acyclic graph. Each box is a task: extract the orders, transform them, and load them into the warehouse. The arrows are dependencies, so a task only runs after the tasks before it succeed.
>
> Now, the architecture. The DAG processor reads your Python files and saves each DAG to the metadata database. The scheduler checks that database, finds the tasks that are ready, and hands them to the executor. The executor sends them out to workers, and the workers do the actual work. Every result — queued, running, success or failed — goes back into the metadata database. And the web UI sits on top, so you can see every run, read the logs, and retry a failed task with one click.
>
> [warmly] So when a team says, "we use Airflow," it means their pipelines are code. They run on a schedule, in the right order, and when something breaks, they know exactly where. That's Apache Airflow.

## What is on screen

| Time | Words | Picture |
|---|---|---|
| 0:00 | "Every morning … already run." | "06:00 AM". A 32 × 12 grid of task runs turns from grey to blue to green |
| 0:08 | "Something decided …" | The grid moves up. Three cards: *When to start*, *In what order*, *What to do when one fails*. One task turns red |
| 0:15 | "… Apache Airflow." | Pinwheel mark and the "Apache Airflow" wordmark |
| 0:18 | "Airflow is an open-source tool …" | The definition, word by word, with "orchestrating workflows" highlighted |
| 0:21 | "Orchestrating just means …" | Three cards: the right task, at the right time, in the right order |
| 0:26 | "It started at Airbnb …" | Timeline: 2014 Airbnb, 2016 Apache Incubator, 2019 top-level project |
| 0:31 | "You write each pipeline in Python …" | `orders_pipeline.py` types in. D·A·G expands to Directed, Acyclic, Graph |
| 0:38 | "Each box is a task …" | extract → transform → load cards, each lighting up its code. Arrows draw, then tasks run and succeed in order |
| 0:50 | "Now, the architecture." | "What runs your DAGs" |
| 0:51 | "The DAG processor …" | The diagram builds piece by piece as each part is named, and the camera follows. Dots flow along every connection |
| 1:07 | "Every result …" | Full view. queued / running / success / failed land in the metadata database |
| 1:13 | "And the web UI sits on top …" | The UI appears on top. The camera zooms in: runs fill in, the log shows a failed load, a click retries it and it turns green |
| 1:20 | "So when a team says …" | "We use Airflow." and three takeaways |
| 1:30 | "That's Apache Airflow." | Closing title, then a fade to white |

## Facts checked

| Claim | Source |
|---|---|
| Airflow started at Airbnb in October 2014 (Maxime Beauchemin) | [airflow.apache.org, "Project"](https://airflow.apache.org/docs/apache-airflow/stable/project.html) |
| Apache Incubator in March 2016, top-level project in January 2019 | Same page |
| The DAG processor parses DAG files and serializes them into the metadata database. It always runs as its own process | [Airflow docs, "Architecture Overview"](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html) |
| The executor is a setting of the scheduler and runs inside it. That is why the Executor card says "in the scheduler" | Same page |
| `from airflow.sdk import dag, task` is the Airflow 3 import for the TaskFlow decorators | [Airflow 3.1 TaskFlow tutorial](https://airflow.apache.org/docs/apache-airflow/3.1.0/tutorial/taskflow.html) |

**Simplified on purpose:** in Airflow 3, workers report task state through the API server, which writes it to the metadata database. The diagram draws that as one "results" arrow from the workers to the database, and the voice says the results "go back into the metadata database". Both are true at this level of detail. The API server also serves the web UI.
