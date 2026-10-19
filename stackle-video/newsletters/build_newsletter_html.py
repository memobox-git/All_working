"""Turns a Stackle newsletter draft (Markdown) into a page for reading and copying into the send tool.

Usage: python3 build_newsletter_html.py senior-to-staff-what-staff-interviews-ask.md
Writes the .html next to the .md. Each subject line, the preview text and the body
get a copy button; the body copies as formatted text where the browser allows it.
"""
import html
import re
import sys
from pathlib import Path

src = Path(sys.argv[1])
md = src.read_text()
title = md.split("\n", 1)[0].removeprefix("# Newsletter: ").strip()
subjects = re.findall(r"^\d+\. (.+)$", md.split("## Subject line options", 1)[1].split("##", 1)[0], re.M)
preview = md.split("## Preview text", 1)[1].split("##", 1)[0].strip()
body_md = md.split("## Body", 1)[1].strip()
notes = [
    "Replace the two link placeholders. Both Notion pages must be shared to the web first, or readers will hit "
    "“Request access”.",
    "Your employer isn’t named, per your LinkedIn rule. Meta appears only as a pay example and an interview "
    "target. Say if you want the line from the video added.",
    "“Hit reply” fits an email newsletter. On a LinkedIn newsletter, change it to “tell me in the "
    "comments”.",
    "Every number comes from the job postings, Levels.fyi, or the interview write-ups linked on page 12 of the "
    "question bank.",
]


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[Link: ([^\]]+)\]", r'<span class="ph">[Link: \1]</span>', s)
    return s


blocks = []
for b in re.split(r"\n\s*\n", body_md):
    b = b.strip()
    if b.startswith("### "):
        blocks.append(f"<h2>{html.escape(b[4:])}</h2>")
    elif "\n→ " in b:
        head, rest = b.split("\n→ ", 1)
        blocks.append(f'<p class="pt">{inline(head)}<br>→ {inline(rest)}</p>')
    else:
        blocks.append(f"<p>{inline(b).replace(chr(10), '<br>')}</p>")
words = len(re.findall(r"[\w$'’+-]+", re.sub(r"\[Link:[^\]]*\]|\*\*", "", body_md)))

subject_items = "".join(
    f'<li><span class="opt">Option {i}</span><span class="line" id="subj{i}">{html.escape(s)}</span>'
    f'<button type="button" class="copy" data-copy="subj{i}">Copy</button></li>'
    for i, s in enumerate(subjects, 1))

page = f"""<title>Staff Interviews Newsletter</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: a send kit (subject lines, preview text) above the newsletter itself, set as a single sheet the way it reads in an inbox. */
:root {{
  --bg: #F3F5FA; --sheet: #FFFFFF; --fg: #0B0B0F; --muted: #5A5F6E; --line: #E2E6EF;
  --accent: #1F4FFF; --on-accent: #FFFFFF; --accent-soft: #EBF0FF; --highlight: #FFCC1A; --highlight-soft: #FFF6D1;
  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #0B0E1C; --sheet: #141A33; --fg: #EEF1FA; --muted: #A3AAC2; --line: #262C4A;
  --accent: #7C97FF; --on-accent: #0B0E1C; --accent-soft: #1B2350; --highlight: #FFCC1A; --highlight-soft: #3A3315; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #0B0E1C; --sheet: #141A33; --fg: #EEF1FA; --muted: #A3AAC2; --line: #262C4A;
  --accent: #7C97FF; --on-accent: #0B0E1C; --accent-soft: #1B2350; --highlight: #FFCC1A; --highlight-soft: #3A3315; color-scheme: dark }}
* {{ box-sizing: border-box }}
body {{ background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: 16px; line-height: 1.6 }}
.wrap {{ max-width: 760px; margin: 0 auto; padding-block: 32px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 28px }}
header {{ display: grid; gap: 10px }}
.eyebrow {{ font-weight: 700; font-size: .78rem; letter-spacing: .16em; text-transform: uppercase; color: var(--accent) }}
h1 {{ font-family: var(--font-display); font-size: clamp(1.8rem, 5vw, 2.6rem); line-height: 1.08; letter-spacing: -.02em; margin: 0; text-wrap: balance }}
.facts {{ display: flex; flex-wrap: wrap; gap: 6px 18px; color: var(--muted); font-size: .9rem }}
.facts b {{ color: var(--fg); font-variant-numeric: tabular-nums }}
.label {{ font-size: .72rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin: 0 0 10px }}
.kit {{ display: grid; gap: 22px }}
ol.subjects {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 8px }}
ol.subjects li {{ display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center;
  background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px }}
.opt {{ font: 500 .74rem var(--font-mono); color: var(--muted); white-space: nowrap }}
.line {{ font-weight: 600; min-width: 0 }}
.preview {{ display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center;
  background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; color: var(--muted) }}
button {{ font: 600 .82rem var(--font-body); color: var(--fg); background: var(--bg); border: 1px solid var(--line);
  border-radius: 999px; padding: 5px 12px; cursor: pointer; white-space: nowrap }}
button:hover {{ border-color: var(--accent); color: var(--accent) }}
button.primary {{ background: var(--accent); border-color: var(--accent); color: var(--on-accent) }}
button.primary:hover {{ color: var(--on-accent); filter: brightness(1.08) }}
button:focus-visible {{ outline: 3px solid var(--highlight); outline-offset: 2px }}
.sheet-head {{ display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px }}
.sheet-head .label {{ margin: 0 }}
article {{ background: var(--sheet); border: 1px solid var(--line); border-top: 4px solid var(--accent); border-radius: 12px;
  padding: clamp(20px, 5vw, 44px) }}
article > * {{ max-width: 62ch }}
article p {{ margin: 0 0 16px; font-size: 1.04rem }}
article h2 {{ font-family: var(--font-display); font-size: 1.3rem; letter-spacing: -.01em; margin: 34px 0 12px; text-wrap: balance }}
article p.pt strong {{ color: var(--accent) }}
.ph {{ background: var(--highlight-soft); border: 1px dashed var(--highlight); border-radius: 4px; padding: 1px 6px;
  font: 500 .9rem var(--font-mono) }}
section.notes {{ border-left: 3px solid var(--highlight); padding: 4px 0 4px 18px }}
section.notes ul {{ margin: 0; padding-left: 18px; display: grid; gap: 8px; color: var(--muted) }}
.status {{ font-size: .82rem; color: var(--accent); min-height: 1.2em }}
@media (max-width: 520px) {{ ol.subjects li {{ grid-template-columns: minmax(0, 1fr) auto }} .opt {{ grid-column: 1 / -1 }} }}
</style>
<div class="wrap">
  <header>
    <div class="eyebrow">Stackle · Newsletter draft</div>
    <h1>{html.escape(title)}</h1>
    <div class="facts"><span><b>{words}</b> words</span><span><b>{max(1, round(words / 230))}</b> min read</span><span>Senior to staff data engineer series</span></div>
  </header>
  <div class="kit">
    <div><p class="label">Subject line: pick one</p><ol class="subjects">{subject_items}</ol></div>
    <div><p class="label">Preview text</p><div class="preview"><span id="preview">{html.escape(preview)}</span>
      <button type="button" class="copy" data-copy="preview">Copy</button></div></div>
  </div>
  <div>
    <div class="sheet-head"><p class="label">The newsletter</p>
      <div><span class="status" id="status" role="status"></span> <button type="button" class="primary copy" data-copy="letter" data-rich="1">Copy newsletter</button></div></div>
    <article id="letter">{''.join(blocks)}</article>
  </div>
  <section class="notes"><p class="label">Before you send</p><ul>{''.join(f'<li>{html.escape(n)}</li>' for n in notes)}</ul></section>
</div>
<script>
(() => {{
  const status = document.getElementById('status');
  const say = (btn, msg) => {{ const t = btn.textContent; btn.textContent = msg; setTimeout(() => btn.textContent = t, 1600) }};
  const selectText = el => {{ const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r) }};
  document.querySelectorAll('button.copy').forEach(btn => btn.addEventListener('click', () => {{
    const el = document.getElementById(btn.dataset.copy);
    const plain = el.innerText.trim();
    const fallback = () => navigator.clipboard.writeText(plain);
    let job;
    try {{
      job = btn.dataset.rich && window.ClipboardItem
        ? navigator.clipboard.write([new ClipboardItem({{
            'text/html': new Blob([el.innerHTML], {{ type: 'text/html' }}),
            'text/plain': new Blob([plain], {{ type: 'text/plain' }}) }})]).catch(fallback)
        : fallback();
    }} catch (e) {{ job = Promise.reject(e) }}
    job.then(() => say(btn, 'Copied'))
       .catch(() => {{ selectText(el); status.textContent = 'Copy is blocked here. The text is selected, so press Ctrl+C or Cmd+C.' }});
  }}));
}})();
</script>
"""

out = src.with_suffix(".html")
out.write_text(page)
print("wrote", out, "words:", words, "subjects:", len(subjects), "blocks:", len(blocks))
