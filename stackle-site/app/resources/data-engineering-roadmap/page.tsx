import type { Metadata } from "next";
import raw from "@/content/resources/data-engineering-roadmap.json";
import { buildRoadmap, type RawRoadmap } from "@/components/resources/roadmap/data";
import { RoadmapTemplate } from "@/components/resources/roadmap/roadmap-template";
import { CapabilityMap, PipelineSection } from "@/components/resources/roadmap/overview-blocks";

const json: RawRoadmap = raw;
const { roadmap } = buildRoadmap(json);
const demo = raw.pipelineDemo;
const stage = (k: string) => demo.stages.find((s) => s.key === k)!;

export const metadata: Metadata = {
  title: raw.title,
  description:
    "From zero to Senior Data Engineer: real code, real pipelines, real salaries. A practical sequence from SQL and Python to production pipelines, cloud platforms and senior-level system design.",
  alternates: { canonical: "/resources/data-engineering-roadmap" },
};

export default function Page() {
  const consumers = stage("consumers");
  const views = consumers.views ?? [];
  return (
    <RoadmapTemplate
      roadmap={roadmap}
      hero={{
        title: raw.hero.headingLines[0],
        second: raw.hero.headingLines[1],
        summary: raw.hero.lead,
        secondary: { label: "View the masterclass", href: "/courses/data-engineering-masterclass-get-job-ready-in-10-weeks" },
      }}
      overview={[
        (n) => <CapabilityMap key="cap" n={n} data={raw.capabilityMap} />,
        (n) => (
          <PipelineSection
            key="pipe"
            n={n}
            heading={demo.heading}
            intro={demo.intro}
            request={demo.source.displayedRequest}
            text={{
              start: demo.buttons.start,
              loading: demo.buttons.loading,
              rerun: demo.buttons.rerun,
              idleText: demo.idle.text,
              idleNote: demo.idle.note,
              stages: {
                api: { title: stage("fetching").title, subtitle: stage("fetching").subtitle },
                bronze: { title: stage("bronze").title, subtitle: stage("bronze").subtitle },
                silver: { title: stage("silver").title, subtitle: stage("silver").subtitle, footnote: stage("silver").footnote },
                gold: { title: stage("gold").title, subtitle: stage("gold").subtitle, footnote: stage("gold").footnote },
                consumers: { title: consumers.title, subtitle: consumers.subtitle },
              },
              analystCode: views[0]?.code ?? "",
              scientistCode: views[1]?.code ?? "",
              closing: consumers.closingNote ?? { strong: "", text: "" },
            }}
          />
        ),
      ]}
      cta={{
        title: raw.cta.heading,
        body: raw.cta.body,
        href: "/courses/data-engineering-masterclass-get-job-ready-in-10-weeks",
        // Short enough for the CTA button to fit at 390px (the body already names the masterclass).
        label: "See the masterclass",
      }}
    />
  );
}
