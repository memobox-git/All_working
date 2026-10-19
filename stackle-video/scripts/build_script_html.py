"""Turns a Stackle script (Markdown) into a readable HTML page for filming.

Usage: python3 build_script_html.py senior-to-staff-de-notion-walkthrough.md
Writes the .html next to the .md. Cues in brackets become chips; the reader can
change the text size and hide the cues to read it like a teleprompter.
"""
import html
import re
import sys
from pathlib import Path

src = Path(sys.argv[1])
md = src.read_text()
script = md[md.index("## Script"):md.index("## Notes for this version")]
notes = md[md.index("## Notes for this version"):].split("\n", 1)[1]
words = re.search(r"\*\*Word count \(spoken\):\*\* ([^|]+)\|", md).group(1).strip()
minutes = re.search(r"\*\*Estimated length:\*\* ([^\n]+)", md).group(1).strip()


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return s


def cue_kind(c):
    c = c.lower()
    if c.startswith("pause"):
        return "pause"
    if "screen share" in c:
        return "screen"
    if c.startswith("graphic"):
        return "graphic"
    if c.startswith("card"):
        return "card"
    if "motion graphic" in c:
        return "motion"
    if c.startswith("optional"):
        return "optional"
    return "camera"


def cue_label(c):
    c = c.rstrip(":").strip()
    c = re.sub(r",? full screen", "", c)
    c = c.replace("Intro motion graphic: ", "Intro: ").replace("CTA motion graphic: ", "CTA: ")
    return c


parts, toc, n = [], [], 0
for block in re.split(r"\n\s*\n", script.split("\n", 1)[1]):
    b = block.strip()
    if not b or b == "---":
        continue
    if b.startswith("### "):
        n += 1
        name = b[4:]
        toc.append(f'<a href="#p{n}">{html.escape(name)}</a>')
        parts.append(f'<h2 id="p{n}">{html.escape(name)}</h2>')
        continue
    if b.startswith("#### "):
        parts.append(f"<h3>{html.escape(b[5:])}</h3>")
        continue
    m = re.match(r"^\*\*((?:\[[^\]]+\]\s*)+)\*\*\s*(.*)$", b, re.S)
    if m:
        chips = "".join(
            f'<span class="cue {cue_kind(c)}">{html.escape(cue_label(c))}</span>'
            for c in re.findall(r"\[([^\]]+)\]", m.group(1)))
        rest = m.group(2).strip()
        parts.append(f'<div class="cues">{chips}</div>')
        if rest:
            parts.append(f'<p class="say optional-line">{inline(rest)}</p>')
        continue
    parts.append(f'<p class="say">{inline(b)}</p>')

# The notes are a numbered list with nested bullets.
note_items = []
for item in re.split(r"\n(?=\d+\. )", notes.strip()):
    lines = item.split("\n")
    head = re.sub(r"^\d+\. ", "", lines[0])
    subs = [l.strip()[2:] for l in lines[1:] if l.strip().startswith("- ")]
    sub_html = ("<ul>" + "".join(f"<li>{inline(s)}</li>" for s in subs) + "</ul>") if subs else ""
    note_items.append(f"<li>{inline(head)}{sub_html}</li>")

page = f"""<title>Senior to Staff Script</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: a single reading column with a part index on the side at desktop width; cues sit as chips above the lines they introduce. */
:root {{
  --bg: #FFFFFF; --surface: #F5F7FC; --fg: #0B0B0F; --muted: #5A5F6E; --line: #E2E6EF;
  --accent: #1F4FFF; --accent-soft: #EBF0FF; --highlight: #FFCC1A; --highlight-soft: #FFF6D1;
  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --say-size: 1.12rem;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #0D1020; --surface: #151a33; --fg: #EEF1FA; --muted: #A3AAC2; --line: #262C4A;
  --accent: #7C97FF; --accent-soft: #1B2350; --highlight: #FFCC1A; --highlight-soft: #3A3315; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #0D1020; --surface: #151a33; --fg: #EEF1FA; --muted: #A3AAC2; --line: #262C4A;
  --accent: #7C97FF; --accent-soft: #1B2350; --highlight: #FFCC1A; --highlight-soft: #3A3315; color-scheme: dark }}
* {{ box-sizing: border-box }}
body {{ background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: 16px; line-height: 1.6 }}
.wrap {{ max-width: 1120px; margin: 0 auto; padding-block: 32px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 48px }}
@media (max-width: 860px) {{ .wrap {{ grid-template-columns: minmax(0, 1fr); gap: 24px }}
  nav.toc {{ position: static; display: flex; flex-wrap: wrap; gap: 6px }}
  nav.toc .label {{ width: 100%; margin-bottom: 0 }}
  nav.toc a {{ border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px; font-size: .8rem }} }}
header.top {{ grid-column: 1 / -1; display: grid; gap: 12px; border-bottom: 2px solid var(--fg); padding-bottom: 20px }}
.eyebrow {{ font-weight: 700; font-size: .78rem; letter-spacing: .16em; text-transform: uppercase; color: var(--accent) }}
h1 {{ font-family: var(--font-display); font-size: clamp(1.9rem, 4.5vw, 2.8rem); line-height: 1.05; letter-spacing: -.02em; margin: 0; text-wrap: balance }}
.facts {{ display: flex; flex-wrap: wrap; gap: 8px 20px; color: var(--muted); font-size: .9rem }}
.facts b {{ color: var(--fg); font-variant-numeric: tabular-nums }}
.controls {{ display: flex; flex-wrap: wrap; gap: 8px; align-items: center }}
.controls button {{ font: 600 .85rem var(--font-body); color: var(--fg); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 6px 14px; cursor: pointer }}
.controls button[aria-pressed="true"] {{ background: var(--accent); color: #fff; border-color: var(--accent) }}
.controls button:focus-visible, nav.toc a:focus-visible {{ outline: 3px solid var(--highlight); outline-offset: 2px }}
nav.toc {{ position: sticky; top: calc(env(safe-area-inset-top, 0px) + 16px); align-self: start; display: grid; gap: 2px; font-size: .88rem }}
nav.toc .label {{ font-size: .72rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px }}
nav.toc a {{ color: var(--muted); text-decoration: none; padding: 4px 10px; border-left: 2px solid var(--line) }}
nav.toc a:hover {{ color: var(--accent); border-left-color: var(--accent) }}
main {{ min-width: 0; max-width: 68ch }}
h2 {{ font-family: var(--font-display); font-size: 1.45rem; letter-spacing: -.01em; margin: 44px 0 14px; padding-top: 12px; border-top: 1px solid var(--line); scroll-margin-top: 16px; text-wrap: balance }}
main h2:first-child {{ margin-top: 0; border-top: 0; padding-top: 0 }}
h3 {{ font-size: 1rem; font-weight: 800; color: var(--accent); margin: 28px 0 8px }}
p.say {{ font-size: var(--say-size); margin: 0 0 16px }}
p.optional-line {{ color: var(--muted); border-left: 3px solid var(--line); padding-left: 12px }}
.cues {{ display: flex; flex-wrap: wrap; gap: 6px; margin: 18px 0 8px }}
.cue {{ font: 500 .78rem/1.3 var(--font-mono); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--muted) }}
.cue.camera {{ color: var(--fg) }}
.cue.screen {{ background: var(--accent-soft); border-color: transparent; color: var(--accent) }}
.cue.graphic, .cue.motion {{ background: var(--highlight-soft); border-color: transparent; color: var(--fg) }}
.cue.card {{ border-color: var(--accent); color: var(--accent); background: transparent }}
.cue.pause {{ border-style: dashed }}
.cue.optional {{ border-style: dashed; color: var(--muted) }}
body.no-cues .cues {{ display: none }}
section.notes {{ margin-top: 48px; background: var(--surface); border-radius: 14px; padding: 20px 22px }}
section.notes h2 {{ margin: 0 0 10px; border: 0; padding: 0; font-size: 1.15rem }}
section.notes ol {{ margin: 0; padding-left: 20px; display: grid; gap: 10px }}
section.notes ul {{ margin: 6px 0 0; padding-left: 18px }}
code {{ font-family: var(--font-mono); font-size: .88em; background: var(--surface); padding: 1px 5px; border-radius: 4px }}
@media (prefers-reduced-motion: no-preference) {{ html {{ scroll-behavior: smooth }} }}
</style>
<div class="wrap">
  <header class="top">
    <div class="eyebrow">Stackle · YouTube script · Notion screen-share version</div>
    <h1>Senior to Staff Data Engineer: My 15-Week Plan</h1>
    <div class="facts"><span><b>{html.escape(words)}</b></span><span><b>{html.escape(minutes)}</b></span></div>
    <div class="controls" role="group" aria-label="Reading controls">
      <button type="button" id="smaller">Smaller text</button>
      <button type="button" id="larger">Larger text</button>
      <button type="button" id="cues" aria-pressed="false">Hide cues</button>
    </div>
  </header>
  <nav class="toc" aria-label="Parts"><div class="label">Parts</div>{''.join(toc)}<a href="#notes">Before you film</a></nav>
  <main>
    {''.join(parts)}
    <section class="notes" id="notes"><h2>Before you film</h2><ol>{''.join(note_items)}</ol></section>
  </main>
</div>
<script>
(() => {{
  const root = document.documentElement, body = document.body;
  const store = {{ get(k) {{ try {{ return localStorage.getItem(k) }} catch (e) {{ return null }} }},
                   set(k, v) {{ try {{ localStorage.setItem(k, v) }} catch (e) {{}} }} }};
  let size = parseFloat(store.get('say-size')) || 1.12;
  const apply = () => root.style.setProperty('--say-size', size + 'rem');
  apply();
  document.getElementById('smaller').onclick = () => {{ size = Math.max(.9, +(size - .12).toFixed(2)); apply(); store.set('say-size', size) }};
  document.getElementById('larger').onclick = () => {{ size = Math.min(2.2, +(size + .12).toFixed(2)); apply(); store.set('say-size', size) }};
  const cues = document.getElementById('cues');
  const setCues = hide => {{ body.classList.toggle('no-cues', hide); cues.setAttribute('aria-pressed', String(hide)); cues.textContent = hide ? 'Show cues' : 'Hide cues' }};
  setCues(store.get('hide-cues') === '1');
  cues.onclick = () => {{ const hide = !body.classList.contains('no-cues'); setCues(hide); store.set('hide-cues', hide ? '1' : '0') }};
}})();
</script>
"""

out = src.with_suffix(".html")
out.write_text(page)
print("wrote", out, "parts:", n)
