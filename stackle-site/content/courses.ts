// Hand-written copy for each course page, layered over the data in Supabase (price, cohorts, weekly
// curriculum, prerequisites). Keyed by slug; the slugs must stay as they are because checkout and old
// links use them.

export type CourseCopy = {
  short: string; // card and nav name
  title: string;
  subtitle: string;
  category: string;
  glyph: "flow" | "db" | "grid";
  liveHours?: number;
  outcomes: string[]; // what you leave with
  forWho?: string[]; // overrides target_personas from the database when set
  prerequisites?: string[]; // overrides the database list when set
  careerTrack: { price: number; adds: string[] };
  faq: { q: string; a: string }[];
};

export const courseCopy: Record<string, CourseCopy> = {
  "master-ai-engineering-in-10-weeks-get-hired": {
    short: "AI Engineering",
    title: "AI Engineering Masterclass",
    subtitle: "Eight weeks of live build-alongs on LLMs, RAG, agents and evals. Every week you ship something real, and you finish with a production AI app in your portfolio.",
    category: "AI engineering",
    glyph: "flow",
    liveHours: 16,
    outcomes: [
      "A deployed AI app you built live, week by week",
      "Working knowledge of prompts, context, RAG, agents and evals",
      "Experience with the OpenAI, Anthropic and Gemini APIs",
      "A portfolio project to talk through in interviews",
    ],
    prerequisites: [
      "Basic Python",
      "High-school level maths and logic",
      "Time for the full 8-week schedule, three live sessions a week",
    ],
    forWho: [
      "Career switchers who want a structured route into AI engineering",
      "Students who want practical, in-demand AI skills alongside their degree",
      "Engineers and analysts who want to build their own AI tools and automations",
    ],
    careerTrack: { price: 1997, adds: ["1:1 resume rewrite", "Referral support", "Mock interviews with feedback"] },
    faq: [
      { q: "Do I need to know machine learning?", a: "No. Week 1 covers how models and LLMs work from the ground up. You need basic Python." },
      { q: "When are the live sessions?", a: "Three times a week (Monday, Wednesday and Friday) for 8 weeks. Every session is recorded, and you keep the recordings." },
      { q: "What will I have at the end?", a: "A production AI app you built and deployed during the cohort, plus the code, notes and recordings from every week." },
      { q: "What's the difference between the two tracks?", a: "The Standard track is the full course. The Career track adds 1:1 job help: a resume rewrite, referral support and mock interviews. Book a call to join the Career track." },
    ],
  },
  "data-engineering-masterclass-get-job-ready-in-10-weeks": {
    short: "Data Engineering",
    title: "Data Engineering Masterclass",
    subtitle: "Ten weeks of live sessions on SQL, Python, data modeling, Spark, Kafka, Airflow and the cloud. You build end-to-end pipelines on a modern stack and present them at Demo Day.",
    category: "Data engineering",
    glyph: "db",
    liveHours: 20,
    outcomes: [
      "End-to-end portfolio pipelines on a modern cloud data stack",
      "Hands-on Spark, Databricks, Kafka and Airflow",
      "Data modeling you can defend in a system design round",
      "A Demo Day presentation to practise telling your project's story",
    ],
    careerTrack: { price: 1997, adds: ["1:1 resume rewrite", "Referral support", "Mock interviews with feedback"] },
    faq: [
      { q: "Is this for beginners?", a: "It's an intermediate course. You should have 6 to 12 months of Python or Java and know basic SQL. If you're earlier than that, start with the free Data Engineering Roadmap." },
      { q: "When are the live sessions?", a: "Three times a week (Monday, Wednesday and Friday) for 10 weeks. Every session is recorded, and you keep the recordings." },
      { q: "Which cloud do we use?", a: "Azure and AWS are both covered, with Databricks for Spark. The point is to learn the concepts once and be productive on any of them." },
      { q: "What's the difference between the two tracks?", a: "The Standard track is the full course. The Career track adds 1:1 job help: a resume rewrite, referral support and mock interviews. Book a call to join the Career track." },
    ],
  },
  "master-data-analysis-in-8-weeks": {
    short: "Data Analyst",
    title: "Data Analyst Masterclass",
    subtitle: "Live sessions on Excel, SQL, Python, Power BI and Tableau, with real dashboards and case studies for your portfolio. The next cohort isn't scheduled yet; join the list to hear first.",
    category: "Data analytics",
    glyph: "grid",
    outcomes: ["Real dashboards and analytics case studies for your portfolio", "SQL and Excel for business analysis", "Power BI and Tableau", "A Demo Day presentation of your work"],
    careerTrack: { price: 1997, adds: ["1:1 resume rewrite", "Referral support", "Mock interviews with feedback"] },
    faq: [],
  },
};

// Order on the Academy page.
export const courseOrder = [
  "master-ai-engineering-in-10-weeks-get-hired",
  "data-engineering-masterclass-get-job-ready-in-10-weeks",
  "master-data-analysis-in-8-weeks",
];
