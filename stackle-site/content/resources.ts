import type { PixelName } from "@/components/icons";

// The free resource library, in display order. Counts come from the content files in content/resources/.
export type ResourceGroup = "Roadmaps" | "Interview prep" | "Guides" | "Cheat sheets";

export type ResourceItem = {
  slug: string;
  title: string;
  summary: string;
  group: ResourceGroup;
  glyph: PixelName;
  stat: { value: string; label: string };
  badge?: string;
  featured?: boolean;
};

export const resourceGroups: ResourceGroup[] = ["Roadmaps", "Interview prep", "Guides", "Cheat sheets"];

export const resources: ResourceItem[] = [
  { slug: "data-engineering-roadmap", title: "Data Engineering Roadmap", summary: "From SQL and Python to ETL, the cloud and production pipelines, then the job search, in five phases with a lesson for every topic.", group: "Roadmaps", glyph: "flow", stat: { value: "20", label: "Lessons" }, badge: "Popular", featured: true },
  { slug: "ai-engineer-roadmap", title: "AI Engineer Roadmap", summary: "How LLMs work, prompting, RAG, agents, evals and shipping to production, in eight phases with a lesson for every topic.", group: "Roadmaps", glyph: "spark", stat: { value: "27", label: "Lessons" }, featured: true },
  { slug: "data-analyst-roadmap", title: "Data Analyst Roadmap", summary: "Analyst foundations, the BI toolkit and turning numbers into decisions, then landing the role, step by step.", group: "Roadmaps", glyph: "grid", stat: { value: "17", label: "Lessons" } },
  { slug: "sql-interview-questions", title: "SQL Interview Questions", summary: "Worked answers from the basics to window functions, query tuning, data modeling and real scenarios from Meta, Google, Amazon and Uber.", group: "Interview prep", glyph: "db", stat: { value: "295", label: "Questions" }, badge: "FAANG", featured: true },
  { slug: "tableau-interview-questions", title: "Tableau Interview Questions", summary: "Calculations, LOD expressions, chart choices and dashboard design, with answers and examples.", group: "Interview prep", glyph: "grid", stat: { value: "285", label: "Questions" } },
  { slug: "linkedin-bible", title: "The LinkedIn Bible", summary: "Profile, headline, DMs, job search, networking and comments: how to get found and get replies.", group: "Guides", glyph: "user", stat: { value: "14", label: "Templates" } },
  { slug: "apache-spark-architecture", title: "Apache Spark Architecture", summary: "Driver, executors, jobs, stages, shuffles, caching and the Spark UI, in short lessons with PySpark examples.", group: "Guides", glyph: "bolt", stat: { value: "13", label: "Lessons" } },
  { slug: "power-bi", title: "Power BI: Data to HR Analytics", summary: "Power Query, data modeling and DAX, built up into a working HR analytics report.", group: "Guides", glyph: "target", stat: { value: "26", label: "Lessons" } },
  { slug: "python-for-de-deck", title: "Python for Data Engineering", summary: "Python basics, Python for data engineering and building pipelines, in three parts with runnable code.", group: "Guides", glyph: "code", stat: { value: "27", label: "Slides" } },
  { slug: "sql-cheat-sheet", title: "SQL Essentials Cheat Sheet", summary: "Every core SQL statement on two pages: filtering, joins, aggregations, window functions and more.", group: "Cheat sheets", glyph: "doc", stat: { value: "PDF", label: "Download" }, badge: "Free PDF" },
  { slug: "de-masterclass-cheatsheet", title: "Data Engineering Cheat Sheet", summary: "The masterclass companion: SQL, modeling, Spark, Kafka, Airflow, dbt and Snowflake as quick answers.", group: "Cheat sheets", glyph: "doc", stat: { value: "69", label: "Answers" } },
];
