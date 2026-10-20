import type { QaData, QaFilterDef, QaQuestion } from "./types";

// Everything here runs on the server at build time; nothing in this file is sent to the browser.

export function allQuestions(data: QaData): QaQuestion[] {
  return data.categories.flatMap((c) => c.questions);
}

// Real counts from the data (the JSON's hard-coded "70% practical" stat is wrong for both pages).
export function qaStats(data: QaData) {
  const qs = allQuestions(data);
  const count = (pred: (q: QaQuestion) => boolean) => qs.filter(pred).length;
  const total = qs.length;
  const practical = count((q) => q.type === "Practical");
  return {
    total,
    categories: data.categories.length,
    theory: count((q) => q.type === "Theory"),
    practical,
    practicalPct: Math.round((practical / total) * 100),
    easy: count((q) => q.difficulty === "Easy"),
    medium: count((q) => q.difficulty === "Medium"),
    hard: count((q) => q.difficulty === "Hard"),
    levels: new Set(qs.map((q) => q.difficulty)).size,
    faang: count((q) => q.faang),
  };
}

// The JSON's filter rules mapped to the data-* attributes on each question row.
const FIELD_ATTR: Record<string, QaFilterDef["attr"]> = { type: "type", difficulty: "diff", faang: "faang" };

export function qaFilters(data: QaData): QaFilterDef[] {
  return data.filters.map(({ label, rule }) => ({
    id: rule ? `${rule.field}-${String(rule.equals)}`.toLowerCase() : "all",
    label: label.replace(/\s+Only$/i, ""), // "Theory Only" -> "Theory"
    attr: rule ? (FIELD_ATTR[rule.field] ?? null) : null,
    value: rule ? String(rule.equals).toLowerCase() : "",
  }));
}

// "[Meta] Find users who..." -> "Find users who..." (the company is shown as a tag instead).
export function questionText(q: QaQuestion): string {
  if (!q.company) return q.question;
  return q.question.replace(/^\[[^\]]+\]\s*/, "");
}

// Short, lowercased string the client filter searches first (answers are indexed from the DOM on demand).
export function searchKey(q: QaQuestion): string {
  return `q${q.n} ${questionText(q)} ${q.company ?? ""}`.toLowerCase().replace(/\s+/g, " ").trim();
}

export const pad2 = (s: string | number) => (/^\d$/.test(String(s)) ? `0${s}` : String(s));
