import type { Metadata } from "next";
import raw from "@/content/resources/tableau-interview-questions.json";
import { QaPage } from "@/components/resources/qa/qa-page";
import { qaStats } from "@/components/resources/qa/lib";
import type { QaData } from "@/components/resources/qa/types";

const data = raw as unknown as QaData;
const stats = qaStats(data);

export const metadata: Metadata = {
  title: data.seo.title.replace(/\s+[–-]\s+Stackle$/, ""),
  // The JSON says "260+" and "50+ FAANG"; use the real counts.
  description: data.seo.description.replace(/^\d+\+/, String(stats.total)).replace(/\d+\+ FAANG/, `${stats.faang} FAANG`),
  alternates: { canonical: "/resources/tableau-interview-questions" },
};

export default function Page() {
  return (
    <QaPage
      data={data}
      title={
        <>
          <span className="t-pixel">{stats.total}</span> Tableau interview
        </>
      }
      second="questions and answers."
      summary={data.summary.replace(/\s*Built by Stackle[^.]*\.?\s*$/, "")}
      meta={[
        { label: "Questions", value: String(stats.total) },
        { label: "Categories", value: String(stats.categories) },
        { label: "Practical", value: `${stats.practicalPct}%` },
        { label: "FAANG questions", value: String(stats.faang) },
      ]}
      heroExtra={
        <a href="#quiz" className="btn btn-line btn-chrome">
          Take the {data.quiz?.questionCount ?? 15}-question quiz
        </a>
      }
    />
  );
}
