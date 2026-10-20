// Shape of content/resources/*-interview-questions.json (only the fields the Q&A template reads).

export type QaBlock =
  | { type: "paragraph"; html: string }
  | { type: "tip"; label: string; html: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: string; source: string; kind?: string };

export type QaVisual = { label?: string; src: string; alt: string; width: number; height: number };

export type QaQuestion = {
  n: number;
  question: string;
  type: string; // "Theory" | "Practical"
  difficulty: string; // "Easy" | "Medium" | "Hard"
  faang: boolean;
  company: string | null;
  answer: { blocks: QaBlock[] };
  visualExample?: QaVisual;
};

export type QaCategory = { id: string; number: string; name: string; questions: QaQuestion[] };

export type QaFilterRule = { field: string; equals: string | boolean } | null;

export type QaQuizConfig = {
  title: string;
  questionCount: number;
  nextLabel: string;
  finishLabel: string;
  result: {
    title: string;
    messages: { minPercent: number; text: string }[];
  };
};

export type QaData = {
  slug: string;
  summary: string;
  seo: { title: string; description: string };
  filters: { label: string; rule: QaFilterRule }[];
  categories: QaCategory[];
  quiz?: QaQuizConfig;
};

// What the client toolbar needs to filter server-rendered rows: the data-* attribute to compare and its value.
export type QaFilterDef = { id: string; label: string; attr: "type" | "diff" | "faang" | null; value: string };
