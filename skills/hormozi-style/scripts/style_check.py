#!/usr/bin/env python3
"""Compare a draft's rhythm with Alex Hormozi's measured speaking style.

Usage:
    python3 style_check.py draft.md
    cat draft.txt | python3 style_check.py

Lines that are markdown headings, filming labels such as "**[Graphic 1]**",
or pause marks such as "*[pause]*" are ignored, so a full script file can be
checked as it is.
"""
import re
import statistics
import sys

# Measured from about 38,000 words of Hormozi transcripts (October 2026).
TARGETS = {
    "median_len": (12, 16, 13),
    "short_share": (0.08, 0.15, 0.14),
    "long_share": (0.18, 0.30, 0.28),
}
CLICHES = [
    "simple. not easy", "simple, not easy", "here's the thing", "game changer",
    "game-changer", "let's dive in", "let's dive into", "at the end of the day",
    "that's the whole game", "no fluff",
]
CONNECTORS = ["and so", "because", "if you", "right?", "which means", "which is",
              "let's say", "if you think about", "number one", "just means"]


END_HEADINGS = re.compile(r"^#+\s*(graphics list|youtube title|youtube description|description|sources)\b", re.I | re.M)


def spoken_text(raw):
    # Stop at the graphics list, title or description so only the spoken script is measured.
    end = END_HEADINGS.search(raw)
    if end:
        raw = raw[:end.start()]
    keep = []
    for para in re.split(r"\n\s*\n", raw):
        p = para.strip()
        if not p or p.startswith(("#", "**[", "*[", "---", "|", ">")):
            continue
        if re.match(r"^\*\*[^*]+:\*\*", p):  # metadata lines such as **Title:**
            continue
        keep.append(p)
    return " ".join(keep)


def main():
    raw = open(sys.argv[1]).read() if len(sys.argv) > 1 else sys.stdin.read()
    text = spoken_text(raw)
    sentences = [s for s in re.split(r"(?<=[.!?])\s+", text) if s.split()]
    if not sentences:
        print("No spoken text found.")
        return
    lens = [len(s.split()) for s in sentences]
    words = sum(lens)
    low = text.lower()
    stats = {
        "median_len": statistics.median(lens),
        "short_share": sum(n <= 5 for n in lens) / len(lens),
        "long_share": sum(n >= 20 for n in lens) / len(lens),
    }
    labels = {
        "median_len": "Median sentence length (words)",
        "short_share": "Sentences of 5 words or fewer",
        "long_share": "Sentences of 20 words or more",
    }
    print(f"Words: {words}   Sentences: {len(sentences)}   About {words / 150:.1f} min at 150 wpm\n")
    print(f"{'Measure':34} {'Draft':>8} {'Target':>12} {'Hormozi':>8}")
    for key, (lo, hi, his) in TARGETS.items():
        val = stats[key]
        pct = key != "median_len"
        fmt = (lambda v: f"{v:.0%}") if pct else (lambda v: f"{v:g}")
        flag = "" if lo <= val <= hi else "  <- adjust"
        print(f"{labels[key]:34} {fmt(val):>8} {fmt(lo) + '-' + fmt(hi):>12} {fmt(his):>8}{flag}")
    and_so = sum(1 for s in sentences if s.lower().startswith("and so"))
    contractions = len(re.findall(r"\b\w+'(?:t|re|ll|ve|d|m|s)\b", low))
    and_so_label = 'Sentences starting "And so"'
    print(f"{and_so_label:34} {and_so:>8}")
    print(f"{'Contractions per 100 words':34} {contractions / words * 100:>8.1f} {'2-6':>12} {'3.7':>8}")
    print("\nConnectors used: " + ", ".join(f"{c} x{low.count(c)}" for c in CONNECTORS if c in low))
    hits = [c for c in CLICHES if c in low]
    print("Clichés to remove: " + (", ".join(hits) if hits else "none"))
    runs, run = 0, 0
    for n in lens:
        run = run + 1 if n <= 5 else 0
        runs += run == 3
    if runs:
        print(f"Fragment runs (3 or more short sentences in a row): {runs}. Join some of them into one sentence.")


if __name__ == "__main__":
    main()
