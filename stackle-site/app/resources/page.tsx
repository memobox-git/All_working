import type { Metadata } from "next";
import Link from "next/link";
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
      <Row n="01" tone="white" showInlineNum={false}>
        <p className="t-mono pad flex justify-between py-4 text-muted">
          <span>Stackle / Resource library</span>
          <Link href="/courses" className="hidden hover:text-ink sm:inline">Want it taught live? Academy →</Link>
        </p>
      </Row>
      <Row n="02">
        <div className="pad pb-12 pt-10 md:pb-16 md:pt-20">
          <SectionHead
            as="h1"
            label="Free resources"
            title="Practical guides for"
            second="your next career move."
            lede="Roadmaps, interview preparation and hands-on references for modern data and AI roles. No sign-up, no paywall."
          />
        </div>
        <dl className="grid grid-cols-2 border-t hairline md:grid-cols-4">
          {totals.map((m, i) => (
            <div key={m.l} className={`corners flex flex-col px-5 py-6 md:px-8 md:py-8 ${i % 2 ? "border-l hairline" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
              <dt className="t-mono-sm order-2 mt-3 text-muted">{m.l}</dt>
              <dd className="t-pixel order-1 text-[40px] leading-none md:text-[52px]">{m.v}</dd>
            </div>
          ))}
        </dl>
      </Row>
      <Row n="03" showInlineNum={false}>
        <Library items={resources} />
      </Row>
      <ResourceCta n="04" title="Learn it live, not alone." />
    </>
  );
}
