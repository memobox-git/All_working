import type { Metadata } from "next";
import { ResourceCta, ResourceHero } from "@/components/resources/resource-shell";
import { ArrowRight } from "@/components/icons";
import { CheatsheetReader, cheatsheetMeta } from "@/components/resources/reader/cheatsheet";
import type { Cheatsheet } from "@/components/resources/reader/types";
import raw from "@/content/resources/de-masterclass-cheatsheet.json";

// The source hard-codes a dated model id in the "Call the Claude API" sample; use the current one.
const data = JSON.parse(JSON.stringify(raw).replaceAll("claude-sonnet-4-20250514", "claude-sonnet-5-5")) as Cheatsheet;

const QUESTIONS = data.groups.flatMap((g) => g.topics.flatMap((t) => t.sections.flatMap((s) => s.questions))).length;
const SUMMARY = `Answers to ${QUESTIONS} data engineering interview questions, from SQL joins and window functions to data modeling, Spark, Snowflake, dbt, Kafka, Airflow, cloud services and AI in pipelines, with code and comparison tables.`;

export const metadata: Metadata = {
  title: "Data Engineering Masterclass cheat sheet",
  description: SUMMARY,
  alternates: { canonical: "/resources/de-masterclass-cheatsheet" },
};

export default function Page() {
  const first = data.groups[0].topics[0];
  return (
    <>
      <ResourceHero
        category="Cheat Sheets"
        title="Data Engineering Masterclass,"
        second="the complete cheat sheet."
        summary={SUMMARY}
        meta={cheatsheetMeta(data)}
      >
        <a href={`#${first.id}`} className="btn btn-ink">
          Start with {first.navLabel} <ArrowRight />
        </a>
      </ResourceHero>
      <CheatsheetReader data={data} n="03" />
      <ResourceCta
        n="04"
        courseHref="/courses/data-engineering-masterclass-get-job-ready-in-10-weeks"
        courseLabel="See the Data Engineering Masterclass"
      />
    </>
  );
}
