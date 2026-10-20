import type { Metadata } from "next";
import raw from "@/content/resources/data-analyst-roadmap.json";
import { buildRoadmap, type RawRoadmap } from "@/components/resources/roadmap/data";
import { RoadmapTemplate } from "@/components/resources/roadmap/roadmap-template";
import { Roles, SalaryTable, Stack } from "@/components/resources/roadmap/overview-blocks";
import { Md } from "@/components/resources/roadmap/md";

const json: RawRoadmap = raw;
// Phase cards take their salary from the salary table (the old cards disagreed with it).
const { roadmap } = buildRoadmap(json);

export const metadata: Metadata = {
  title: "Data Analyst Roadmap 2026: Power BI & Tableau",
  description: raw.seo.description.replace("live demos", "worked examples"),
  alternates: { canonical: "/resources/data-analyst-roadmap" },
};

export default function Page() {
  const masterclass = raw.hero.ctas.find((c) => c.href.includes("meetup.com"));
  return (
    <RoadmapTemplate
      roadmap={roadmap}
      hero={{
        title: raw.hero.headingLines[0],
        second: raw.hero.headingLines[1],
        summary: <Md text={raw.hero.leadMd} />,
        // The old "FREE Analyst Masterclass" button goes to the general Meetup events list, so it says that.
        secondary: masterclass ? { label: "Free events on Meetup", href: masterclass.href, external: true } : undefined,
      }}
      overview={[
        (n) => <Stack key="stack" n={n} data={raw.stack} />,
        (n) => <SalaryTable key="salary" n={n} data={raw.salaryTable} />,
        (n) => (
          <Roles
            key="roles"
            n={n}
            data={raw.roles}
            note="Approximate US ranges (2025–2026). Pay varies widely by location, industry and level."
          />
        ),
      ]}
      cta={{
        title: raw.cta.offer.headingLines.join(" "),
        href: "/courses/data-engineering-masterclass-get-job-ready-in-10-weeks",
        // Short enough for the CTA button to fit at 390px.
        label: "Data Engineering course",
      }}
    />
  );
}
