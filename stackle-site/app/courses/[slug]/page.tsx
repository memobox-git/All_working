import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Row, SectionHead } from "@/components/row";
import { Accordion } from "@/components/accordion";
import { EnrollPanel } from "@/components/course/enroll-panel";
import { CohortList } from "@/components/course/live-cohorts";
import { HeroCards } from "@/components/home/hero-cards";
import { ResourceCta } from "@/components/resources/resource-shell";
import { Pixel } from "@/components/icons";
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
  const facts = [
    { l: "Duration", v: `${course.weeks} weeks` },
    { l: "Schedule", v: fmtDays(days) },
    { l: "Level", v: course.level ? course.level[0].toUpperCase() + course.level.slice(1) : "All levels" },
    { l: "Live content", v: c.liveHours ? `${c.liveHours} hours` : "Live cohort" },
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

      <section id="top" className="fill-ruled">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 pb-16 pt-8 md:px-10 md:pb-24 md:pt-14 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] text-muted">
              <Link href="/courses" className="hover:text-ink">Academy</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-2">{c.short}</span>
            </nav>
            <div className="reveal mt-10 md:mt-14">
              <span className="label">{c.category}</span>
              <h1 className="t-display mt-6">
                {c.title.replace(/ Masterclass$/, "")} <span className="t-second">Masterclass.</span>
              </h1>
              <p className="t-lede mt-6 max-w-[620px]">{c.subtitle}</p>
            </div>
            <dl className="reveal mt-12 grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
              {facts.map((f) => (
                <div key={f.l} className="border-t border-line-strong pt-4">
                  <dt className="text-[13.5px] text-muted">{f.l}</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="lg:row-span-2">
            <div className="lg:sticky lg:top-[100px]">
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
      </section>

      <Row tone="white">
        <div className="pad sec grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <SectionHead label="Outcomes" title="What you" second="leave with." />
            <ul className="reveal mt-8 grid gap-4">
              {c.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-[16px] text-ink-2">
                  <Pixel name="check" size={18} className="mt-0.5 text-ink" /> <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          {course.curriculum.length > 0 && <HeroCards course={course} />}
        </div>
      </Row>

      <Row>
        <div className="pad sec grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHead label="Audience" title="Who it's" second="for." />
            <ol className="reveal mt-8 grid gap-5">
              {course.forWho.map((o, i) => (
                <li key={o} className="flex items-start gap-4 border-t hairline pt-5">
                  <span className="t-serif w-7 shrink-0 text-[16px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink-2">{o}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHead label="Before you start" title="Prerequisites" />
            <ul className="reveal dot-list mt-8 grid gap-3 text-ink-2">
              {course.prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </Row>

      {course.curriculum.length > 0 && (
        <Row tone="white" id="curriculum">
          <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.7fr] md:gap-16">
            <div>
              <SectionHead label="Curriculum" title={`${course.curriculum.length} weeks,`} second="week by week." />
              <p className="t-small reveal mt-6 max-w-[320px]">Each week has live sessions on {fmtDays(days).replace(/ \/ /g, ", ")} and ends with something you build.</p>
            </div>
            <Accordion
              items={course.curriculum.map((w) => ({
                q: (
                  <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="t-serif w-[72px] shrink-0 text-[15px] font-normal text-muted">Week {String(w.n).padStart(2, "0")}</span>
                    <span>{w.title}</span>
                  </span>
                ),
                a: w.points.length ? (
                  <ul className="dot-list grid gap-2">
                    {w.points.map((p) => (
                      <li key={p}>{p}</li>
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

      <Row>
        <div className="pad sec grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
          <figure className="reveal relative mx-auto w-full max-w-[340px]">
            <div className="card-float overflow-hidden p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={instructor.photo} alt="Chris (Crispus Roshan)" width={640} height={800} loading="lazy" className="block aspect-[4/5] w-full rounded-[10px] object-cover grayscale" />
            </div>
          </figure>
          <div>
            <SectionHead label="Your instructor" title="Chris," second="Crispus Roshan." />
            <p className="t-body reveal mt-6 max-w-[560px]">{instructor.bio}</p>
            <div className="reveal mt-8">
              <span className="label label-plain">Upcoming cohorts</span>
              <div className="mt-4 max-w-[520px]">
                <CohortList courseId={course.id} initial={course.cohorts} limit={4} />
              </div>
            </div>
          </div>
        </div>
      </Row>

      {c.faq.length > 0 && (
        <Row tone="white">
          <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
            <SectionHead label="FAQ" title="Questions," second="answered." />
            <Accordion items={c.faq} />
          </div>
        </Row>
      )}

      <ResourceCta
        title={course.cohorts.length ? "Save your seat." : "Be first in line."}
        body={`${fmtPrice(course.price)} · ${course.weeks} weeks · live with Chris. Not sure it's the right track? Book a free call first.`}
        courseHref={course.cohorts.length ? `${site.appUrl}/courses/${course.slug}` : "#top"}
        courseLabel={course.cohorts.length ? "Enroll now" : "Get notified"}
      />
    </>
  );
}
