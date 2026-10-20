// Shapes of the course-reader JSON (content/resources/apache-spark-architecture.json, power-bi.json)
// and the DE Masterclass cheat sheet. Only the fields the pages render are typed.

export type TextItem = { title: string; text: string };

export type FeatureCard = {
  label?: string;
  badge?: string;
  number?: string;
  title: string;
  text: string;
  highlight?: boolean;
};

export type ClusterNode = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlight?: boolean;
  children?: string[];
};

export type HierarchyNode = { label: string; text?: string; children?: HierarchyNode[] };

export type DiagramBlock =
  | {
      type: "diagram";
      diagram: "cluster-architecture";
      ariaLabel?: string;
      nodes: ClusterNode[];
      edges: { from: string; to: string; label?: string }[];
      caption?: string;
    }
  | { type: "diagram"; diagram: "execution-hierarchy"; root: HierarchyNode }
  | { type: "diagram"; diagram: "shuffle"; inputs: string[]; label: string; outputs: string[] }
  | {
      type: "diagram";
      diagram: "spark-ui-mock";
      tabs: string[];
      activeTab: string;
      metrics: { value: string; label: string; highlight?: boolean }[];
    }
  | {
      type: "diagram";
      diagram: "relationship";
      from: string;
      fromCardinality: string;
      to: string;
      toCardinality: string;
      label: string;
    };

export type Block =
  | { type: "lede"; text: string }
  | { type: "heading"; level?: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "code"; language?: string; code: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cards"; columns?: number; items: TextItem[] }
  | { type: "takeaways"; items: string[] }
  | { type: "practice"; items: string[] }
  | { type: "pipeline"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "tiles"; variant?: string; columns?: number; items: TextItem[] }
  | { type: "icon-grid"; icon?: string; columns?: number; items: string[] }
  | { type: "checklist-grid"; columns?: number; items: string[] }
  | { type: "feature-cards"; columns?: number; items: FeatureCard[] }
  | { type: "link-card"; label: string; text: string; link: { label: string; url: string; external?: boolean } }
  | DiagramBlock;

export type Lesson = { id: string; number: number; title: string; minutes: number; blocks: Block[] };
export type Module = { id: string; label: string; icon?: string; lessons: Lesson[] };
export type Course = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  seo: { title: string; description: string };
  reader: { navAriaLabel?: string; progressLabel?: string };
  modules: Module[];
  downloads?: { id: string; label: string; file: string; content: string }[];
};

// Cheat sheet
export type CsAnswer =
  | { type: "text"; html: string }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: string[]; rows: (string | { text: string; kind?: string })[][] };
export type CsQuestion = { question: string; hint?: string; level: string; answer: CsAnswer[] };
export type CsSection = { title: string; questions: CsQuestion[] };
export type CsTopic = { id: string; navLabel: string; title: string; subtitle?: string; sections: CsSection[] };
export type CsGroup = { title: string; topics: CsTopic[] };
export type Cheatsheet = { slug: string; title: string; levels: string[]; groups: CsGroup[] };

// What the client-side index receives: titles and anchors only, never lesson bodies.
export type NavItem = { id: string; num: string; title: string };
export type NavGroup = { label: string; items: NavItem[] };
