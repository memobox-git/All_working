import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Row, SectionHead } from "@/components/row";
import { Accordion } from "@/components/accordion";
import { EnrollPanel } from "@/components/course/enroll-panel";
import { CohortList } from "@/components/course/live-cohorts";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { IsoHub, IsoPipeline, IsoSchedule } from "@/components/illustrations";
import { getCourse, getCourses, fmtDays, fmtPrice } from "@/lib/courses";
import { instructor, site } from "@/content/site";

export async function generateStaticParams() {
  return (await getCourses()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getCourse((await params).slug);
  if (!c) return {};
  return {
    title: c.copy.title,
    description: c.copy.subtitle,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: { title: `${c.copy.title} · Stackle`, description: c.copy.subtitle },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();
  const c = course.copy;
  const days = course.cohorts[0]?.days ?? ["monday", "wednesday", "friday"];
  const Art = c.glyph === "flow" ? IsoHub : c.glyph === "db" ? IsoPipeline : IsoSchedule;
  const artProps = c.glyph === "flow" ? { tools: ["LLMs", "RAG", "Agents", "Evals"], center: "App" } : {};
  const facts = [
    { l: "Duration", v: `${course.weeks} weeks` },
    { l: "Schedule", v: fmtDays(days) },
    { l: "Level", v: course.level ? course.level[0].toUpperCase() + course.level.slice(1) : "All levels" },
    { l: "Format", v: course.format === "cohort" ? "Live cohort" : "Self-paced" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.subtitle,
    provider: { "@type": "Organization", name: "Stackle", sameAs: site.url },
    offers: { "@type": "Offer", price: course.price, priceCurrency: "USD", category: "Paid" },
    hasCourseInstance: course.cohorts.map((k) => ({ "@type": "CourseInstance", courseMode: "online", startDate: k.start.slice(0, 10), endDate: k.end.slice(0, 10), instructor: { "@type": "Person", name: instructor.fullName } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Row n="01" tone="white" showInlineNum={false}>
        <nav aria-label="Breadcrumb" className="t-mono pad flex items-center gap-2 py-4 text-muted">
          <Link href="/courses" className="hover:text-ink">Academy</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{c.short}</span>
        </nav>
      </Row>

      <Row n="02">
        <div className="grid lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="pad pb-10 pt-10 md:pb-14 md:pt-20">
              <div className="reveal">
                <span className="label">{c.category}</span>
                <h1 className="t-display mt-6">
                  {c.title.replace(/ Masterclass$/, "")}
                  <br />
                  <span className="t-second">Masterclass.</span>
                </h1>
                <p className="t-lede mt-6 max-w-[620px]">{c.subtitle}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 border-t hairline md:grid-cols-4">
              {facts.map((f, i) => (
                <div key={f.l} className={`px-5 py-5 md:px-8 ${i % 2 ? "border-l hairline" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
                  <dt className="t-mono-sm text-muted">{f.l}</dt>
                  <dd className="mt-2 font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="fill-iso grid place-items-center border-t hairline p-8 md:p-12">
              <Art className="h-[240px] w-full max-w-[460px] md:h-[300px]" {...artProps} />
            </div>
          </div>
          <aside className="border-t hairline p-4 md:p-6 lg:border-l lg:border-t-0">
            <div className="lg:sticky lg:top-[96px]">
              <EnrollPanel
                courseId={course.id}
                slug={course.slug}
                title={c.title}
                price={course.price}
                careerPrice={c.careerTrack.price}
                weeks={course.weeks}
                level={course.level}
                initial={course.cohorts}
                appUrl={site.appUrl}
                bookCall={site.bookCall}
              />
            </div>
          </aside>
        </div>
      </Row>

      <Row n="03">
        <div className="pad sec grid gap-12 md:grid-cols-2">
          <div>
            <SectionHead label="Outcomes" title="What you" second="leave with." />
            <ul className="reveal mt-8 border-t hairline">
              {c.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 border-b hairline py-4">
                  <Pixel name="check" size={13} className="mt-1.5" /> <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHead label="Audience" title="Who it's" second="for." />
            <ul className="reveal mt-8 border-t hairline">
              {course.forWho.map((o, i) => (
                <li key={o} className="flex items-start gap-4 border-b hairline py-4">
                  <span className="t-mono-sm mt-1 text-muted">{String(i + 1).padStart(2, "0")}</span> <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Row>

      {course.curriculum.length > 0 && (
        <Row n="04" id="curriculum">
          <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.7fr]">
            <div>
              <SectionHead label="Curriculum" title={`${course.curriculum.length} weeks,`} second="week by week." />
              <p className="t-small reveal mt-6 max-w-[300px]">Each week has live sessions on {fmtDays(days).replace(/ \/ /g, ", ")} and ends with something you build.</p>
            </div>
            <Accordion
              numbered={false}
              items={course.curriculum.map((w) => ({
                q: (
                  <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="t-mono-sm text-muted">Week {String(w.n).padStart(2, "0")}</span>
                    <span>{w.title}</span>
                  </span>
                ),
                a: w.points.length ? (
                  <ul className="grid gap-2">
                    {w.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Details for this week are shared in the cohort.</p>
                ),
              }))}
            />
          </div>
        </Row>
      )}

      <Row n="05">
        <div className="pad sec grid gap-12 md:grid-cols-2">
          <div>
            <SectionHead label="Before you start" title="Prerequisites" />
            <ul className="reveal mt-8 border-t hairline">
              {course.prerequisites.map((p) => (
                <li key={p} className="flex items-start gap-3 border-b hairline py-4">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHead label="Dates" title="Upcoming" second="cohorts." />
            <div className="reveal mt-8">
              <CohortList courseId={course.id} initial={course.cohorts} limit={4} />
            </div>
          </div>
        </div>
      </Row>

      <Row n="06">
        <div className="grid md:grid-cols-[380px_1fr]">
          <div className="fill-iso grid place-items-center border-b hairline p-8 md:border-b-0 md:border-r">
            <figure className="corners w-full max-w-[280px] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={instructor.photo} alt="Chris (Crispus Roshan)" width={640} height={800} loading="lazy" className="block aspect-[4/5] w-full object-cover grayscale" />
              <figcaption className="t-mono-sm px-1 pb-1 pt-3 text-muted">{instructor.fullName}</figcaption>
            </figure>
          </div>
          <div className="pad flex flex-col justify-center py-12 md:py-16">
            <SectionHead label="Your instructor" title="Chris" second="Crispus Roshan" />
            <p className="t-body reveal mt-6 max-w-[560px]">{instructor.bio}</p>
          </div>
        </div>
      </Row>

      {c.faq.length > 0 && (
        <Row n="07">
          <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr]">
            <SectionHead title="Questions" />
            <Accordion items={c.faq} />
          </div>
        </Row>
      )}

      <Row n="08" tone="night">
        <div className="pad sec flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="reveal">
            <h2 className="t-h2">
              {course.cohorts.length ? "Save your seat." : "Be first in line."}
              <br />
              <span className="t-second">{fmtPrice(course.price)} · {course.weeks} weeks · live</span>
            </h2>
          </div>
          <div className="reveal flex flex-wrap gap-3">
            {course.cohorts.length > 0 && (
              <a href={`${site.appUrl}/courses/${course.slug}`} className="btn btn-paper">
                <Pixel name="spark" size={14} /> Enroll
              </a>
            )}
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-line">
              Book a free call <ArrowUpRight />
            </a>
          </div>
        </div>
      </Row>
    </>
  );
}
