import type { Metadata } from "next";
import raw from "@/content/resources/sql-interview-questions.json";
import { QaPage } from "@/components/resources/qa/qa-page";
import { qaStats } from "@/components/resources/qa/lib";
import type { QaData } from "@/components/resources/qa/types";

const data = raw as unknown as QaData;
const stats = qaStats(data);

export const metadata: Metadata = {
  title: data.seo.title.replace(/\s+[–-]\s+Stackle$/, ""),
  // The JSON says "300+"; the page has 295.
  description: data.seo.description.replace(/^\d+\+/, String(stats.total)),
  alternates: { canonical: "/resources/sql-interview-questions" },
};

export default function Page() {
  return (
    <QaPage
      data={data}
      title={`${stats.total} SQL interview`}
      second="questions and answers."
      summary={data.summary.replace(/\s*Built by Stackle[^.]*\.?\s*$/, "")}
      meta={[
        { label: "Questions", value: String(stats.total) },
        { label: "Categories", value: String(stats.categories) },
        { label: "Practical", value: `${stats.practicalPct}%` },
        { label: "Difficulty levels", value: String(stats.levels) },
      ]}
    />
  );
}
