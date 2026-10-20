import type { Metadata } from "next";
import raw from "@/content/resources/ai-engineer-roadmap.json";
import { buildRoadmap, type RawRoadmap } from "@/components/resources/roadmap/data";
import { RoadmapTemplate } from "@/components/resources/roadmap/roadmap-template";
import { Roles, SalaryTable, Stack } from "@/components/resources/roadmap/overview-blocks";

const json: RawRoadmap = raw;
const { roadmap } = buildRoadmap(json);
const course = "/courses/master-ai-engineering-in-10-weeks-get-hired";

export const metadata: Metadata = {
  title: raw.title,
  description: "From zero to Senior AI Engineer in 10 weeks: LLMs, RAG, agents, evals and production. A free roadmap with a checklist, resources and a worked example for every topic.",
  alternates: { canonical: "/resources/ai-engineer-roadmap" },
};

export default function Page() {
  const webinar = raw.hero.ctas.find((c) => c.href.includes("meetup.com"));
  return (
    <RoadmapTemplate
      roadmap={roadmap}
      hero={{
        title: raw.hero.headingLines[0],
        second: raw.hero.headingLines[1],
        summary: raw.hero.lead,
        // The old "FREE AI Roadmap Webinar" button goes to the general Meetup events list, so it says that.
        secondary: webinar ? { label: "Free events on Meetup", href: webinar.href, external: true } : undefined,
      }}
      overview={[
        (n) => <Stack key="stack" n={n} data={raw.stack} />,
        (n) => <SalaryTable key="salary" n={n} data={raw.salaryTable} />,
        (n) => (
          <Roles
            key="roles"
            n={n}
            data={raw.roles}
            note="Approximate US ranges (2025–2026). Pay varies widely by location, company and level."
          />
        ),
      ]}
      cta={{
        title: raw.cta.offer.headingLines.join(" "),
        body: raw.cta.offer.body,
        href: course,
        label: "See the AI Engineering course",
      }}
    />
  );
}
