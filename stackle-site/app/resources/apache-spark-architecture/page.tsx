import type { Metadata } from "next";
import { ResourceCta, ResourceHero } from "@/components/resources/resource-shell";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { CourseReader, courseMeta } from "@/components/resources/reader/course-reader";
import type { Course } from "@/components/resources/reader/types";
import raw from "@/content/resources/apache-spark-architecture.json";

const course = raw as unknown as Course;
const DOCS = "https://spark.apache.org/docs/latest/cluster-overview.html";

export const metadata: Metadata = {
  title: "Apache Spark Architecture: an interactive guide",
  description: course.seo.description,
  alternates: { canonical: "/resources/apache-spark-architecture" },
};

export default function Page() {
  const first = course.modules[0].lessons[0];
  return (
    <>
      <ResourceHero
        category="Interactive"
        title="Apache Spark Architecture,"
        second="an interactive guide."
        summary={course.summary}
        meta={courseMeta(course)}
      >
        <div className="flex flex-wrap gap-3">
          <a href={`#${first.id}`} className="btn btn-ink">
            Start lesson 01 <ArrowRight />
          </a>
          <a href={DOCS} target="_blank" rel="noreferrer" className="btn btn-line">
            Official docs <ArrowUpRight />
          </a>
        </div>
      </ResourceHero>
      <CourseReader course={course} n="03" navLabel="Apache Spark curriculum" />
      <ResourceCta
        n="04"
        courseHref="/courses/data-engineering-masterclass-get-job-ready-in-10-weeks"
        courseLabel="See the DE Masterclass"
      />
    </>
  );
}
