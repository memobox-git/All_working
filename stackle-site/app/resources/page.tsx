import type { Metadata } from "next";
import { Row, SectionHead } from "@/components/row";
import { Library } from "@/components/resources/library";
import { ResourceCta } from "@/components/resources/resource-shell";
import { resources } from "@/content/resources";

export const metadata: Metadata = {
  title: "Free resources: roadmaps, interview questions and guides",
  description: "Free career resources for data and AI roles: roadmaps with a lesson for every topic, 295 SQL and 285 Tableau interview questions with answers, the LinkedIn Bible, Spark and Power BI guides, and cheat sheets.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const totals = [
    { v: String(resources.length), l: "Free resources" },
    { v: "580", l: "Interview questions" },
    { v: "64", l: "Roadmap lessons" },
    { v: "$0", l: "Forever" },
  ];
  return (
    <>
      <section className="fill-ruled">
        <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-20">
          <SectionHead
            as="h1"
            label="Free resources"
            title="Practical guides for"
            second="your next career move."
            lede="Roadmaps, interview preparation and hands-on references for modern data and AI roles. No sign-up, no paywall."
          />
          <dl className="reveal mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:mt-16 md:grid-cols-4">
            {totals.map((m) => (
              <div key={m.l} className="flex flex-col border-t border-line-strong pt-5">
                <dt className="order-2 mt-2 text-[14px] text-muted">{m.l}</dt>
                <dd className="t-serif order-1 text-[40px] leading-none tracking-[-0.03em] md:text-[52px]">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Row>
        <Library items={resources} />
      </Row>
      <ResourceCta title="Learn it live, not alone." />
    </>
  );
}
