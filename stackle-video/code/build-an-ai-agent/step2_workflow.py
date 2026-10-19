"""NOT an agent, part 2: a workflow.

The code decides every step. The AI fills in one piece at a time.
It always runs the same four steps, in the same order.

Run:  python step2_workflow.py
"""
import anthropic

from tools import list_tables, run_sql

client = anthropic.Anthropic()  # reads your ANTHROPIC_API_KEY

question = "Where do taxi drivers in New York get the best tips?"


def ask(prompt: str) -> str:
    """One call to the model: a prompt in, text out."""
    response = client.beta.messages.create(
        model="claude-opus-5-5",
        max_tokens=16000,
        messages=[{"role": "user", "content": prompt}],
        # if the model declines a request, the API retries it on a fallback model
        fallbacks="default",
        betas=["server-side-fallback-2026-07-01"],
    )
    return "".join(block.text for block in response.content if block.type == "text")


# Step 1 (code): get the tables and columns.
tables = list_tables()

# Step 2 (AI): write one SQL query.
query = ask(f"Here are my DuckDB tables:\n{tables}\n\nWrite one SQL query that answers: {question}\nReply with only the SQL.")
query = query.strip().removeprefix("```sql").removeprefix("```").removesuffix("```")
print(f"The query:\n{query}\n")

# Step 3 (code): run the query. If it fails, the workflow stops here.
result = run_sql(query)
print(f"The result:\n{result}\n")

# Step 4 (AI): explain the result.
print(ask(f"Question: {question}\n\nQuery result:\n{result}\n\nAnswer the question in three sentences."))
