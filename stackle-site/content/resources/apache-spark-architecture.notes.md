# apache-spark-architecture: extraction notes

Source: `sparkModules` array plus the `SparkArchitectureResourcePage` component in the main bundle. I evaluated the
JSX with a mock runtime to get exact text, then checked it line by line against the live page, rendered once per
lesson (13/13 lessons match, ignoring whitespace). The global site navbar and footer are hidden on this route.
Screenshots of every lesson and UI state are in
`/tmp/claude-0/-home-user-All-working/df524b4a-79ce-5043-8169-78cd529f7371/scratchpad/extract/interactive/shots/`
(`apache-spark-architecture__NN-<lessonId>.png`, `__state-*.png`, `__block-*.png`).

Note for the rebuild: despite the "Interactive Guide" title, the page has **no simulation, animation, quiz or
step-through walkthrough**. Its only interactivity is the course-reader navigation. The architecture visuals
(cluster diagram, pipelines, job/stage hierarchy, shuffle, Spark UI mock) are static boxes; the Spark UI tabs do
not respond to clicks.

## 1. Structure / layout
It is the same "course reader" shell as `/resources/power-bi`. The two pages share one design, with these
differences:
- **Sidebar** (fixed, 320px, lg and up):
  1. "← Resources" link.
  2. Brand: a 40px square with a cyan border and 10% cyan fill holding a lucide `Flame` icon, "Apache Spark", and
     the tagline "Architecture & execution".
  3. Search box ("Search lessons").
  4. Nav "Apache Spark curriculum": 7 module groups, each with a lucide icon and an uppercase label such as
     "01 · FOUNDATIONS". Lesson buttons show a 2-digit global number and the title. Earlier lessons get a check
     mark. The **active lesson is filled cyan** with near-black text.
  5. Footer: "Learning path", "{n}/13", and a 4px cyan bar.
- **Header** (64px): the module label in cyan, uppercase, above the lesson title. On the right (sm and up) is an
  outline button, "Official docs" plus an external-link icon, linking to
  https://spark.apache.org/docs/latest/cluster-overview.html in a new tab.
- **Article** (max 900px, scrolls independently):
  1. "LESSON 02 · 10 MIN".
  2. H1 title, then a divider.
  3. Blocks.
  4. Prev/next grid: "Previous"/"Next" + title. On the last lesson the right cell is "Complete / Back to resources".
  Unlike Power BI, there are no mobile-only buttons.
- **Mobile** (below lg): a hamburger "Open curriculum" opens a left drawer (`min(90vw,360px)`) with a backdrop. It
  closes via the X button, the backdrop, or picking a lesson.
- **Theme**: always dark, with the same tokens as power-bi. The accent is cyan `hsl(188 86% 43%)`, there is no
  yellow, page `0 0% 4%`, surface `0 0% 7%`, border `0 0% 18%`.

## 2. Interactions
- **Routing**: `?lesson=<lessonId>`. A missing or unknown id falls back to lesson 1. Selecting a lesson does
  `setSearchParams({lesson},{replace:true})`, which replaces the history entry. Lessons can be deep-linked, e.g.
  `/resources/apache-spark-architecture?lesson=shuffle`.
- **Scroll is not reset** on lesson change. There is no scroll call at all, so the article keeps its scrollTop
  (tested: 883 → 1005). The rebuild should scroll to the top on lesson change.
- **Search**: a case-insensitive substring match on lesson titles only. It hides empty modules, keeps global
  numbering, and shows "No lessons match your search." when nothing matches. Example: "shuffle" leaves only
  09 "Shuffles & partition strategy".
- **Progress**: derived only from the current index, `(i+1)/13`. The bar width animates over 300ms. Nothing is
  persisted.
- `document.title` = "Apache Spark Architecture | Stackle Resources".
- There are no downloads, forms, API calls or gated content.

## 3. JSON schema (blocks inside `modules[].lessons[].blocks`)
Inline text is a Markdown subset (`**bold**`, `` `code` ``, `[label](url)`).

**Common blocks:**
- `lede`: first in every lesson.
- `heading` (h2).
- `paragraph`.
- `list` {ordered}.
- `callout` {title, text}: left cyan border, uppercase cyan title.
- `code` {language: "python" | "bash", code}: a plain `<pre>` with no highlighting.
- `table` {head, rows}: the first column is bold.
- `cards` {columns 2|3, items[{title,text}]}.
- `takeaways`: last in every lesson.

**Spark-specific blocks:**
- `pipeline` {items[]}: 5 boxes in a row (stacked on mobile). Each box shows a cyan "01".."05" and a bold label.
  Between boxes is a cyan "→", shown only at md and up. Used in:
  - lesson 5: User code → Logical plan → Optimized plan → Physical plan → Tasks
  - lesson 7: Source RDD → map → filter → reduceByKey → Result
  - lesson 11: Task fails → Executor lost → Scheduler retries → Lineage rebuilds → Stage completes
- `diagram` {diagram:"cluster-architecture"} (lesson 2): a figure in three columns (`1fr 120px 1.5fr`).
  - Left, the Driver box with a cyan border: "CONTROL PLANE", then "Driver", then "SparkSession · DAG scheduler".
  - Middle: the label "REQUESTS / RESOURCES →".
  - Right, the "RESOURCE BROKER" box: "Cluster manager" with two inner boxes, "Worker · Executor 1" and
    "Worker · Executor 2".
  - Caption: "The driver plans work; the cluster manager allocates resources; executors run tasks and store data."
  - JSON: `nodes`, `edges`, `caption`.
- `diagram` {diagram:"execution-hierarchy"} (lesson 6): nested boxes. "APPLICATION" (cyan border) contains "Job",
  which contains Stage 0 ("Task per input partition") and Stage 1 ("Task per shuffle partition") side by side.
- `diagram` {diagram:"shuffle"} (lesson 9): the inputs Partition A/B/C in a row; then the cyan uppercase label
  "shuffle write ↓ network fetch ↓ shuffle read"; then the outputs Key group 1/2 with cyan borders.
- `diagram` {diagram:"spark-ui-mock"} (lesson 12):
  - Tab strip: JOBS, STAGES (active, cyan fill), STORAGE, SQL, EXECUTORS.
  - Three metric tiles: 14.2 GB "Shuffle read", 31 s "Median task", and 8 min "Maximum task · skew". The 8 min tile
    is in cyan to flag skew.
- `feature-cards` {items[{label,title,text,highlight?}]} (lesson 4): Client mode vs Cluster mode. Cluster mode
  has a cyan border.
- `link-card` {label,text,link} (lesson 13): "Continue learning", with a link to the Cluster Mode Overview.
- Other fields: `modules[].icon` is a lucide name, `lesson.number` is the global number, `lesson.minutes` is
  numeric.

## 4. Counts
7 modules, 13 lessons, 138 minutes in total. The lessons contain:
- 20 H2 headings, 10 paragraphs and 2 lists
- 11 tables and 3 card grids
- 9 code samples (7 PySpark/Python, 2 bash `spark-submit`)
- 8 callouts and 13 takeaway lists
- 3 pipelines, 4 diagrams, 1 feature-card pair and 1 link card

The modules are:
1. Foundations (2 lessons)
2. Deployment (2)
3. Execution model (2)
4. Data abstractions (2)
5. Performance (2)
6. Reliability & operations (2)
7. Practical workflow (1, the capstone)

The lessons contain no images. The listing card image was saved as `card.jpg` (1200×912).

The architecture components are covered across lessons:
- driver, cluster manager, executors and worker nodes (lessons 2–3, with a table);
- deploy modes (lesson 4);
- DAG and plans (lesson 5);
- applications, jobs, stages and tasks (lesson 6);
- RDDs (lesson 7) and DataFrames (lesson 8);
- shuffle (lesson 9) and caching (lesson 10);
- fault tolerance (lesson 11), Spark UI diagnosis (lesson 12) and the capstone before/after code (lesson 13).

## 5. Doubts / issues
- **Illustrative numbers**: the Spark UI mock (14.2 GB, 31 s, 8 min) is made up, not real job data. It is fine as
  an illustration, but don't present it as measured.
- **No real SEO copy**: the old page only had the generic site meta description. I copied `summary` and
  `seo.description` verbatim from lesson 1's lede.
- **Placeholder listing card**: badge "New", likes 0 and views "New" are placeholders.
- **Missing H1**: there is no visible page-level H1 for the whole guide. The H1 changes with each lesson. "title"
  uses the listing-card title.
- **Hard-coded config values**: the code samples use example S3 paths and dates (2026-01-01, 2026-09-20). The
  `spark-submit` memory settings (4g, 8g, 4 cores) are example values.
- No broken links were found. The only external link is spark.apache.org, used twice (the header button and the
  lesson 13 link card).
