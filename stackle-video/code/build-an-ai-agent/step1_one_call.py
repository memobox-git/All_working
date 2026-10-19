"""NOT an agent, part 1: one question in, one answer out.

The model answers from what it learned in training.
It cannot see your data, and it cannot run anything.

Run:  python step1_one_call.py
"""
import anthropic

client = anthropic.Anthropic()  # reads your ANTHROPIC_API_KEY

question = "Where do taxi drivers in New York get the best tips? Use our January 2024 trip data."

response = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": question}],
    # if the model declines a request, the API retries it on a fallback model
    fallbacks="default",
    betas=["server-side-fallback-2026-07-01"],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
