"""The agent's tools.

A tool is a normal Python function, plus a short description that tells the
model what the function does and what to pass in.
"""
from pathlib import Path

import duckdb

HERE = Path(__file__).parent

# The guardrails live in the database, not in the prompt, so they hold
# whatever SQL the model writes:
# - read_only: no query can change or delete the data
# - enable_external_access off: no query can read or write other files on your computer
# - lock_configuration: no query can switch those settings back on
db = duckdb.connect(
    str(HERE / "taxi.duckdb"),
    read_only=True,
    config={"enable_external_access": False, "lock_configuration": True},
)


def list_tables() -> str:
    """Every table and column, with the notes from the data dictionary."""
    rows = db.sql("""
        SELECT table_name, column_name, data_type, comment
        FROM duckdb_columns()
        WHERE database_name = current_database() AND NOT internal
        ORDER BY table_name, column_index
    """).fetchall()
    lines = []
    for table, column, data_type, comment in rows:
        note = f"  -- {comment}" if comment else ""
        lines.append(f"{table}.{column} {data_type}{note}")
    return "\n".join(lines)


def run_sql(query: str) -> str:
    """Run one SQL query and return up to 50 rows as text."""
    result = db.sql(query)
    if result is None:
        return "The query ran and returned no rows."
    rows = result.limit(51).fetchall()
    lines = [" | ".join(result.columns)]
    lines += [" | ".join(str(value) for value in row) for row in rows[:50]]
    if len(rows) > 50:
        lines.append("(only the first 50 rows are shown)")
    return "\n".join(lines)


def save_report(filename: str, text: str) -> str:
    """Save a report as a file, but only if the person says yes."""
    path = HERE / "reports" / Path(filename).name  # .name keeps the file inside reports/
    print(f"\nThe agent wants to save reports/{path.name}:\n\n{text}\n")
    if input("Save it? (y/n) ").strip().lower() != "y":
        return "The person said no, so the report was not saved."
    path.parent.mkdir(exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return f"Saved reports/{path.name}"


# What the model sees: each tool's name, what it does, and its inputs.
TOOLS = [
    {
        "name": "list_tables",
        "description": "List every table and column in the taxi database, with notes from the official data dictionary.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "run_sql",
        "description": "Run one read-only DuckDB SQL query on the taxi database. Returns up to 50 rows.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "The SQL query to run."}},
            "required": ["query"],
        },
    },
    {
        "name": "save_report",
        "description": "Save a short markdown report as a file. The person is asked to approve it first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string", "description": "A file name ending in .md"},
                "text": {"type": "string", "description": "The report, in markdown."},
            },
            "required": ["filename", "text"],
        },
    },
]

# How the loop finds the Python function for each tool name.
FUNCTIONS = {"list_tables": list_tables, "run_sql": run_sql, "save_report": save_report}
