# Build an AI agent: the code from the video

An AI agent that answers questions about one month of real New York taxi trips (January 2024, about 3 million trips) by writing and running SQL. The agent and its tools are about 120 lines of Python with no agent framework, so you can see every part: the model, the tools, the instructions and the loop.

| File | What it is |
|---|---|
| `get_data.py` | Downloads the public trip data and builds `taxi.duckdb`. Run it once. |
| `step1_one_call.py` | **Not an agent.** One question in, one answer out. It can't see the data. |
| `step2_workflow.py` | **Not an agent.** A workflow: the code decides every step, and the AI fills in two of them. |
| `tools.py` | The agent's three tools: `list_tables`, `run_sql` (read-only) and `save_report` (asks you first). |
| `agent.py` | **The agent.** The model picks the next tool, reads the result, and keeps going until it's done. |

## Run it

You need Python 3.10 or newer and an Anthropic API key from https://console.anthropic.com.

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your-key  # Windows: set ANTHROPIC_API_KEY=your-key

python get_data.py                 # downloads about 50 MB, once
python step1_one_call.py
python step2_workflow.py
python agent.py "Where do taxi drivers in New York get the best tips?"
```

Each run of `agent.py` prints how many steps it took, the tokens it used and roughly what it cost.

## The guardrails

- **Read-only data.** `tools.py` opens the database read-only, with file access switched off and the settings locked. No query the model writes can change the data or touch other files on your computer.
- **A step limit.** `MAX_STEPS = 15` in `agent.py`. The agent can't loop forever.
- **Ask before acting.** `save_report` shows you the report and saves it only if you type `y`.

## Try your own data

Put your own tables in `taxi.duckdb` (or change the file name in `tools.py`), add a note to each column, and change the first line of `INSTRUCTIONS` in `agent.py` to describe your data.

## Data source

NYC Taxi and Limousine Commission, TLC Trip Record Data: https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page. Column notes come from the TLC yellow taxi data dictionary (18 March 2025).
