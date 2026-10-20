import type { Metadata } from "next";
import { ResourceCta, ResourceHero } from "@/components/resources/resource-shell";
import { ArrowRight } from "@/components/icons";
import { CourseReader, courseMeta } from "@/components/resources/reader/course-reader";
import { CopyTextButton } from "@/components/resources/reader/copy-text-button";
import type { Course } from "@/components/resources/reader/types";
import raw from "@/content/resources/power-bi.json";

const course = raw as unknown as Course;
const dax = course.downloads?.[0];
const DAX_FILE = "/resources/power-bi/hr-analytics-measures.dax";

export const metadata: Metadata = {
  title: "Power BI: from data to HR analytics",
  description: course.seo.description,
  alternates: { canonical: "/resources/power-bi" },
};

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="shrink-0">
      <path d="M7 1.5v8M3.5 6 7 9.5 10.5 6M2 12.5h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Page() {
  const first = course.modules[0].lessons[0];
  return (
    <>
      <ResourceHero
        category="Interactive"
        title="Power BI,"
        second="from data to HR analytics."
        summary={course.summary}
        meta={courseMeta(course)}
      >
        <div className="flex flex-wrap gap-3">
          <a href={`#${first.id}`} className="btn btn-ink">
            Start lesson 01 <ArrowRight />
          </a>
          <a href={DAX_FILE} download className="btn btn-line">
            <DownloadIcon /> Download .dax
          </a>
          {dax && <CopyTextButton text={dax.content} label="Copy DAX" className="btn btn-line" />}
        </div>
        <p className="t-small mt-4">The HR analytics measures for the course project, as one .dax file.</p>
      </ResourceHero>
      <CourseReader
        course={course}
        n="03"
        navLabel="Power BI curriculum"
        sidebarExtra={
          <div className="flex flex-col gap-3">
            <p className="text-[14px] font-semibold text-ink">HR analytics measures</p>
            <div className="flex gap-2">
              <a href={DAX_FILE} download className="btn btn-line btn-chrome flex-1 !px-3">
                <DownloadIcon /> .dax
              </a>
              {dax && <CopyTextButton text={dax.content} label="Copy" className="btn btn-line btn-chrome flex-1 !px-3" />}
            </div>
          </div>
        }
      />
      <ResourceCta n="04" />
    </>
  );
}
