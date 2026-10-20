// Turns a roadmap JSON file (content/resources/<slug>.json) into the cleaned model the template renders.
// Runs on the server only: route files import the JSON, call buildRoadmap(), and pass the result down.
//
// Clean-up rules (from the .notes.md QA pass, 2026-10-20):
// - videos: drop ones YouTube marks unavailable, ones that open a different video than their label
//   (linkCheck.labelMatches === false), and repeats of a video already shown earlier on the page;
// - resources: drop 404s and the internal "/" placeholder; relabel links that only reach a homepage;
// - code: swap decorative emojis for plain symbols (two columns wide, so ASCII art stays aligned);
// - phase cards take their salary from the salary table when the page has one, so the two never disagree;
// - "7 phases" style counts in headings and footnotes use the real number of phases.

export type LinkCheck = {
  status?: string;
  httpStatus?: number;
  labelMatches?: boolean;
  youtubeTitle?: string;
  note?: string;
  checked?: string;
};

type RawResource = { label: string; url: string; kind?: string; linkCheck?: LinkCheck };
type RawVideo = { title: string; url: string; youtubeId?: string; linkCheck?: LinkCheck };
type RawExample = {
  kind: string;
  title?: string;
  language?: string;
  code?: string;
  variant?: string;
  languageShownOnPage?: boolean;
  columns?: string[];
  rows?: string[][];
  total?: { label: string; value: string };
  nodes?: { label: string; sub?: string }[];
  steps?: { level: string; salary: string }[];
};
type RawTopic = {
  id: string;
  title: string;
  category: string;
  lesson: { overview: string; checklist: string[]; resources: RawResource[]; videos: RawVideo[]; example?: RawExample };
};
type RawPhase = {
  id: string;
  label: string;
  stage: string;
  title: string;
  salary: { text: string; kind: string; range?: string; role?: string };
  description: string;
  skills: string[];
  topics: RawTopic[];
};
export type SalaryRow = { phase: string; stage: string; role: string; salary: string; isTarget: boolean };

export type RawRoadmap = {
  slug: string;
  title: string;
  summary: string;
  seo: { title: string; description: string };
  hero: { headingLines: string[]; lead: string; leadMd?: string; ctas: { label: string; href: string; external: boolean }[] };
  roadmap: { eyebrow: string; heading: string; intro?: string; introMd?: string; runningExampleMd?: string; phases: RawPhase[] };
  lessonDrawer: { exampleFootnote: string };
  salaryTable?: { rows: SalaryRow[] };
};

// ---- the cleaned model ----

export type Example =
  | { kind: "code"; title: string; language: string; filename: string; code: string }
  | { kind: "table"; title: string; columns: string[]; rows: Cell[][]; total?: { label: string; value: string } }
  | { kind: "flow"; title: string; nodes: { label: string; sub?: string }[] }
  | { kind: "ladder"; title: string; steps: { level: string; salary: string }[] };

// A table cell is text, or a star rating the old page drew with emojis (rendered as a small meter).
export type Cell = string | { stars: number };

export type Lesson = {
  id: string;
  n: string; // "01", numbered across the whole page
  title: string;
  category: string;
  phaseLabel: string; // "Phase 1"
  overview: string;
  checklist: string[];
  resources: { label: string; url: string; kind?: string }[];
  videos: { title: string; url: string }[];
  example?: Example;
};

export type PhaseSalary =
  | { kind: "none"; text: string }
  | { kind: "target"; text: string }
  | { kind: "range"; range: string; role?: string };

export type Phase = {
  id: string;
  label: string;
  stage: string;
  title: string;
  description: string;
  salary: PhaseSalary;
  skills: string[];
  topics: Lesson[];
};

export type Roadmap = {
  slug: string;
  heading: string;
  intro: string; // inline Markdown (**bold**, *italic*)
  runningExample?: string; // inline Markdown
  exampleFootnote: string;
  phases: Phase[];
  totals: { phases: number; topics: number; checklist: number; links: number };
};

export type Drop = { lesson: string; type: "video" | "resource"; label: string; url: string; reason: string };

// Labels that promised a specific page but link to a homepage (or another page): make them say where they go.
const RELABEL: Record<string, string> = {
  "DE vs DA vs DS — Towards Data Science": "Towards Data Science",
  "Levels.fyi Resume Tips": "Levels.fyi",
  "W3Schools SQL Data Modeling": "W3Schools SQL CREATE DATABASE",
  "Braintrust / LangSmith": "Braintrust docs",
  "Latent Space Discord": "Latent Space",
};

// Decorative emojis in code examples, mapped to a plain symbol plus a space: emojis render two columns wide,
// and several examples are column-aligned ASCII art.
const EMOJI: Record<string, string> = {
  "✅": "✓", "❌": "✗", "⚠️": "!", "⚠": "!", "⭐": "*", "💎": "◆", "💰": "$", "💡": "→", "📊": "→",
  "📦": "■", "🛒": "■", "📋": "■", "📅": "■", "🏪": "■",
};

export function deEmoji(s: string): string {
  return s.replace(/\p{Extended_Pictographic}️?/gu, (m) => {
    const sym = EMOJI[m] ?? EMOJI[m.replace(/️/g, "")];
    return sym ? `${sym} ` : "";
  });
}

function cell(s: string): Cell {
  const stars = s.match(/⭐/g)?.length ?? 0;
  if (stars && !s.replace(/⭐|️|\s/g, "")) return { stars };
  return deEmoji(s).trim();
}

const pad = (n: number) => String(n).padStart(2, "0");

function cleanExample(e: RawExample | undefined): Example | undefined {
  if (!e) return undefined;
  const title = e.title ?? "Example";
  if (e.kind === "code" && e.code) {
    const language = e.language ?? "text";
    const filename = e.variant === "notebook" ? "databricks notebook" : language === "text" ? "output" : language;
    return { kind: "code", title, language, filename, code: deEmoji(e.code) };
  }
  if (e.kind === "table" && e.columns && e.rows) {
    return { kind: "table", title, columns: e.columns, rows: e.rows.map((r) => r.map(cell)), total: e.total };
  }
  if (e.kind === "flow" && e.nodes) return { kind: "flow", title, nodes: e.nodes.map((n) => ({ label: n.label, sub: n.sub })) };
  if (e.kind === "ladder" && e.steps) return { kind: "ladder", title, steps: e.steps };
  return undefined;
}

function phaseSalary(p: RawPhase, table?: SalaryRow[]): PhaseSalary {
  const row = table?.find((r) => r.phase === p.label);
  if (row) {
    if (row.isTarget) return { kind: "target", text: row.salary };
    if (row.salary === "—" || !row.salary) return { kind: "none", text: p.salary.text };
    return { kind: "range", range: row.salary, role: row.role !== "—" ? row.role : undefined };
  }
  if (p.salary.kind === "range" && p.salary.range) return { kind: "range", range: p.salary.range, role: p.salary.role };
  if (p.salary.kind === "target") return { kind: "target", text: p.salary.text };
  return { kind: "none", text: p.salary.text };
}

const fixPhaseCount = (s: string, n: number) => s.replace(/\b\d+ (P|p)hases\b/g, (_m, p: string) => `${n} ${p}hases`);

export function buildRoadmap(raw: RawRoadmap): { roadmap: Roadmap; dropped: Drop[] } {
  const dropped: Drop[] = [];
  const seenVideos = new Set<string>();
  const phaseCount = raw.roadmap.phases.length;
  let n = 0;
  let checklist = 0;
  let links = 0;

  const phases: Phase[] = raw.roadmap.phases.map((p) => ({
    id: p.id,
    label: p.label,
    stage: p.stage,
    title: p.title,
    description: p.description,
    salary: phaseSalary(p, raw.salaryTable?.rows),
    skills: p.skills,
    topics: p.topics.map((t) => {
      const L = t.lesson;
      const resources = L.resources.flatMap((r) => {
        const lc = r.linkCheck ?? {};
        if (lc.status === "broken") {
          dropped.push({ lesson: t.id, type: "resource", label: r.label, url: r.url, reason: `HTTP ${lc.httpStatus ?? 404}` });
          return [];
        }
        if (lc.status === "internal" && r.url === "/") {
          dropped.push({ lesson: t.id, type: "resource", label: r.label, url: r.url, reason: "links to the home page; no such tool" });
          return [];
        }
        return [{ label: RELABEL[r.label] ?? r.label, url: r.url, kind: r.kind }];
      });
      const videos = L.videos.flatMap((v) => {
        const lc = v.linkCheck ?? {};
        const key = v.youtubeId ?? v.url;
        let reason = "";
        if (lc.status === "unavailable") reason = "unavailable on YouTube";
        else if (lc.labelMatches === false) reason = `opens a different video: "${lc.youtubeTitle ?? "?"}"`;
        else if (seenVideos.has(key)) reason = "same video already listed earlier on the page";
        if (reason) {
          dropped.push({ lesson: t.id, type: "video", label: v.title, url: v.url, reason });
          return [];
        }
        seenVideos.add(key);
        return [{ title: v.title, url: v.url }];
      });
      checklist += L.checklist.length;
      links += resources.length + videos.length;
      return {
        id: t.id,
        n: pad(++n),
        title: t.title,
        category: t.category,
        phaseLabel: p.label,
        overview: L.overview,
        checklist: L.checklist,
        resources,
        videos,
        example: cleanExample(L.example),
      };
    }),
  }));

  // The old copy said "Click any step row ... live demo"; the new page has topics and worked examples.
  const intro = (raw.roadmap.introMd ?? raw.roadmap.intro ?? "")
    .replace("**step row**", "**topic**")
    .replace(/(?:a )?live (?:code\/data )?demo/, "a worked example");

  return {
    roadmap: {
      slug: raw.slug,
      heading: fixPhaseCount(raw.roadmap.heading, phaseCount),
      intro,
      runningExample: raw.roadmap.runningExampleMd && fixPhaseCount(raw.roadmap.runningExampleMd, phaseCount),
      exampleFootnote: fixPhaseCount(raw.lessonDrawer.exampleFootnote, phaseCount),
      phases,
      totals: { phases: phaseCount, topics: n, checklist, links },
    },
    dropped,
  };
}
