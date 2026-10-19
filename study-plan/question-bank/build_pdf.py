"""Builds the printable question bank (HTML, then PDF) from questions.json.

Usage: python3 build_pdf.py   (writes question-bank.html, then render_pdf.js turns it into the PDF)
"""
import html
import json
from urllib.parse import urlparse
from pathlib import Path

HERE = Path(__file__).parent
FONTS = (HERE / "../../stackle-video/source/node_modules/@fontsource/plus-jakarta-sans/files").resolve()

NAMES = [
    "Python", "SQL", "DSA and coding", "Distributed systems and Kafka", "Spark",
    "Data modeling, warehousing and lakehouse", "AWS and Kubernetes",
    "ML, AI engineering and AI infrastructure", "Debugging and production scenarios",
    "System design", "Behavioral and leadership",
]

topics = json.loads((HERE / "questions.json").read_text())
reported = json.loads((HERE / "reported.json").read_text())
SOURCES = {"www.teamblind.com": "Blind", "leetcode.com": "LeetCode", "prachub.com": "PracHub",
           "www.aced.io": "Aced", "www.reddit.com": "Reddit", "www.youtube.com": "YouTube"}


def esc(s):
    # Backticks in the source mark code names; show them in the mono face.
    out, code = [], False
    for part in html.escape(s).split("`"):
        out.append(f"<code>{part}</code>" if code else part)
        code = not code
    return "".join(out)


def font_face(weight):
    return (f"@font-face{{font-family:PJS;font-weight:{weight};"
            f"src:url('file://{FONTS}/plus-jakarta-sans-latin-{weight}-normal.woff2')}}")


toc_rows = []
body = []
for i, (t, name) in enumerate(zip(topics, NAMES), 1):
    qs = [q for s in t["secs"] for q in s["qs"]]
    first, last = qs[0]["id"], qs[-1]["id"]
    senior = sum(q["lvl"] == "Senior" for q in qs)
    toc_rows.append(
        f'<tr><td class="n">{i}</td><td>{html.escape(name)}</td>'
        f'<td class="ids">{first} – {last}</td><td class="num">{senior}</td><td class="num">{len(qs) - senior}</td></tr>')
    secs = []
    for s in t["secs"]:
        items = "".join(
            f'<li><span class="box"></span><span class="id">{q["id"]}</span>'
            f'<span class="lvl {q["lvl"].lower()}">{q["lvl"]}</span>'
            f'<span class="q">{esc(q["q"])}</span></li>' for q in s["qs"])
        secs.append(f'<section><h3>{html.escape(s["name"])} <span class="wk">{html.escape(s["weeks"])}</span></h3>'
                    f'<ol>{items}</ol></section>')
    body.append(
        f'<article class="topic"><header><div class="kicker">Topic {i} of 11</div>'
        f'<h2>{html.escape(name)}</h2><p class="meta">100 questions · {senior} Senior · {100 - senior} Staff</p></header>'
        + "".join(secs) + "</article>")

# The reported questions go last, as a 12th section with a source line under each question.
rq, rep_secs = 0, []
for s in reported:
    items = []
    for q in s["qs"]:
        rq += 1
        src = SOURCES[urlparse(q["url"]).netloc]
        items.append(
            f'<li><span class="box"></span><span class="id">RQ-{rq:02d}</span>'
            f'<span class="q">{esc(q["q"])}<span class="src">{html.escape(q["who"])} · {q["when"]} · '
            f'<a href="{html.escape(q["url"])}">{src}</a></span></span></li>')
    rep_secs.append(f'<section><h3>{html.escape(s["name"])} <span class="wk">{html.escape(s["weeks"])}</span></h3>'
                    f'<ol>{"".join(items)}</ol></section>')
toc_rows.append(
    f'<tr><td class="n">12</td><td>Reported in real interviews</td>'
    f'<td class="ids">RQ-01 – RQ-{rq:02d}</td><td class="num">–</td><td class="num">–</td></tr>')
body.append(
    '<article class="topic rep"><header><div class="kicker">Bonus</div>'
    '<h2>Reported in real interviews</h2>'
    f'<p class="meta">{rq} questions from public write-ups, 2024–2026 · each links to its source</p></header>'
    '<div class="how"><ul>'
    "<li>Each question comes from one person's write-up on Blind, LeetCode Discuss, Reddit, YouTube or an interview-prep site. "
    'Treat it as a sample of what gets asked, not a list of what will be asked.</li>'
    '<li>Wording is quoted or closely paraphrased. Few write-ups come from staff loops; where one does, the line says so.</li>'
    '<li>Sections marked <b>Not in the plan yet</b> are rounds the 15 weeks don\'t train.</li>'
    '</ul></div>' + "".join(rep_secs) + "</article>")

page = f"""<!doctype html><html><head><meta charset="utf-8"><title>Staff Data Engineer Interview Question Bank</title>
<style>
{''.join(font_face(w) for w in (400, 600, 700, 800))}
:root{{--ink:#0B0B0F;--muted:#5A5F6E;--line:#E4E7EE;--blue:#1F4FFF;--blue-soft:#EBF0FF;--yellow:#FFCC1A;--yellow-soft:#FFF6D1}}
@page{{size:A4;margin:16mm 15mm 18mm}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:PJS,sans-serif;color:var(--ink);font-size:9.6pt;line-height:1.42}}
code{{font-family:"DejaVu Sans Mono",monospace;font-size:.88em;background:#F2F4F8;padding:0 .25em;border-radius:3px}}
.cover{{page-break-after:always;padding-top:2mm}}
.cover .kicker{{color:var(--blue);font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-size:9pt}}
.cover h1{{font-size:30pt;line-height:1.05;letter-spacing:-.02em;margin:4mm 0 3mm;font-weight:800}}
.cover h1 span{{color:var(--blue)}}
.cover .sub{{font-size:12pt;color:var(--muted);max-width:150mm}}
.stats{{display:flex;gap:6mm;margin:6mm 0 6mm}}
.stat{{border:1.5px solid var(--line);border-radius:4mm;padding:4mm 6mm}}
.stat b{{display:block;font-size:22pt;font-weight:800;color:var(--blue);line-height:1}}
.stat span{{font-size:9pt;color:var(--muted)}}
.how{{background:var(--blue-soft);border-radius:4mm;padding:4mm 6mm;margin-bottom:6mm}}
.how h2{{font-size:11pt;margin:0 0 2mm}}
.how ul{{margin:0;padding-left:5mm}}
.how li{{margin:1.2mm 0}}
table.toc{{width:100%;border-collapse:collapse;font-size:10pt}}
table.toc th{{text-align:left;font-size:8pt;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);border-bottom:1.5px solid var(--ink);padding:2mm 2mm}}
table.toc td{{border-bottom:1px solid var(--line);padding:1.7mm 2mm}}
table.toc .n{{color:var(--blue);font-weight:800;width:8mm}}
table.toc .ids{{font-family:"DejaVu Sans Mono",monospace;font-size:8.5pt;color:var(--muted)}}
table.toc .num{{text-align:right;font-variant-numeric:tabular-nums;width:18mm}}
.topic{{page-break-before:always}}
.topic header{{border-bottom:2.5px solid var(--blue);padding-bottom:3mm;margin-bottom:4mm}}
.topic .kicker{{color:var(--blue);font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-size:8pt}}
.topic h2{{font-size:20pt;margin:1.5mm 0 1mm;font-weight:800;letter-spacing:-.01em}}
.topic .meta{{margin:0;color:var(--muted);font-size:9pt}}
section{{margin-top:4.5mm}}
h3{{font-size:10.5pt;margin:0 0 2mm;font-weight:800;break-after:avoid}}
h3 .wk{{font-weight:600;font-size:8pt;color:var(--blue);background:var(--blue-soft);padding:.4mm 2mm;border-radius:2mm;margin-left:1.5mm;white-space:nowrap}}
ol{{list-style:none;margin:0;padding:0}}
.topic ol>li{{display:grid;grid-template-columns:4.2mm 15mm 12mm 1fr;column-gap:2mm;align-items:baseline;padding:1.5mm 0;border-bottom:.6px solid var(--line);break-inside:avoid}}
.box{{width:3.2mm;height:3.2mm;border:1.2px solid var(--ink);border-radius:.7mm;display:inline-block;transform:translateY(.5mm)}}
.id{{font-family:"DejaVu Sans Mono",monospace;font-size:8pt;color:var(--muted)}}
.lvl{{font-size:7pt;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-align:center;border-radius:1.5mm;padding:.3mm 0}}
.lvl.senior{{background:var(--blue-soft);color:var(--blue)}}
.lvl.staff{{background:var(--yellow);color:var(--ink)}}
.topic.rep ol>li{{grid-template-columns:4.2mm 13mm 1fr}}
.topic.rep .how{{margin:0 0 2mm}}
.src{{display:block;font-size:7.8pt;color:var(--muted);margin-top:.6mm}}
.src a{{color:var(--blue);text-decoration:none}}
</style></head><body>
<div class="cover">
  <div class="kicker">Senior → Staff Data Engineer</div>
  <h1>Interview Question Bank<br><span>1,100 questions</span></h1>
  <p class="sub">100 questions for each of the 11 topics in the 15-week plan, from Python and SQL to system design, AI infrastructure and behavioral rounds. Questions only: practise answering out loud, then tick the box. At the back: {rq} questions reported from real interviews, with sources.</p>
  <div class="stats"><div class="stat"><b>1,100</b><span>questions</span></div><div class="stat"><b>11</b><span>topics</span></div><div class="stat"><b>15</b><span>weeks</span></div><div class="stat"><b>+{rq}</b><span>reported in real interviews</span></div></div>
  <div class="how"><h2>How to use it</h2><ul>
    <li><b>Senior</b> questions are the ones to answer cold, in under 2 minutes.</li>
    <li><b>Staff</b> questions go deeper: trade-offs, scale, and why you'd choose one option over another. Answer them the way you'd explain a decision to another team.</li>
    <li>Each section shows the week of the plan it belongs to. Do those questions alongside that week's work.</li>
  </ul></div>
  <table class="toc"><thead><tr><th></th><th>Topic</th><th>Questions</th><th style="text-align:right">Senior</th><th style="text-align:right">Staff</th></tr></thead>
  <tbody>{''.join(toc_rows)}</tbody></table>
</div>
{''.join(body)}
</body></html>"""

(HERE / "question-bank.html").write_text(page)
print("wrote", HERE / "question-bank.html")
