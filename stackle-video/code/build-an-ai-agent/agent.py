"""An AI agent: a model, tools, instructions, and a loop.

Run:  python agent.py "Where do taxi drivers in New York get the best tips?"
"""
import sys

import anthropic

from tools import FUNCTIONS, TOOLS

client = anthropic.Anthropic()  # reads your ANTHROPIC_API_KEY
MODEL = "claude-opus-5-5"
MAX_STEPS = 15  # the stop rule: the agent can never loop forever

# 1. The instructions: the agent's job and its rules.
INSTRUCTIONS = """You are a data analyst agent. You answer questions about New York yellow taxi trips from January 2024 by querying a DuckDB database.
- Start by listing the tables, and read the column notes.
- Check the data before you trust it: look for missing values, odd values, and groups with very few trips.
- In your answer, show the numbers it is based on, and say what you left out and why.
- When you have the answer, save a short report with save_report."""

question = sys.argv[1] if len(sys.argv) > 1 else "Where do taxi drivers in New York get the best tips?"

# 2. The memory: everything said so far. The model sees all of it on every step.
messages = [{"role": "user", "content": question}]
tokens_in = tokens_out = 0

# 3. The loop: ask the model, run the tools it picks, send back the results, repeat.
for step in range(1, MAX_STEPS + 1):
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        system=INSTRUCTIONS,
        tools=TOOLS,
        messages=messages,
        output_config={"effort": "medium"},
        # "updates" returns the short notes the model writes between tool calls
        thinking={"type": "adaptive", "display": "updates"},
        # if the model declines a request, the API retries it on a fallback model
        fallbacks="default",
        betas=["thinking-display-updates-2026-08-18", "server-side-fallback-2026-07-01"],
    )
    messages.append({"role": "assistant", "content": response.content})
    tokens_in += response.usage.input_tokens
    tokens_out += response.usage.output_tokens

    for block in response.content:
        if block.type == "thinking" and block.thinking:
            print(f"\n[agent] {block.thinking}")
        elif block.type == "text":
            print(f"\n{block.text}")

    # No tool call means the agent has decided it is done.
    if response.stop_reason != "tool_use":
        if response.stop_reason == "refusal":
            print("\nThe model declined this request.")
        break

    # 4. The tools: run every tool the model asked for.
    results = []
    for block in response.content:
        if block.type != "tool_use":
            continue
        print(f"\n[tool] {block.name} {block.input.get('query', '')}")
        try:
            output = FUNCTIONS[block.name](**block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
        except Exception as error:
            # Send the error back, so the agent can read it and fix its own mistake.
            output = f"Error: {error}"
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output, "is_error": True})
        print("\n".join(output.splitlines()[:8]))
    messages.append({"role": "user", "content": results})
else:
    print(f"\nStopped: the agent hit the limit of {MAX_STEPS} steps.")

# Claude Opus 5.5 costs $4 per million input tokens and $20 per million output tokens.
cost = tokens_in / 1e6 * 4 + tokens_out / 1e6 * 20
print(f"\nSteps: {step} | tokens in: {tokens_in:,} | tokens out: {tokens_out:,} | cost: about ${cost:.2f}")
