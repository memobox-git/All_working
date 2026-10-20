import type { Metadata } from "next";
import Link from "next/link";
import { Row, SectionHead } from "@/components/row";
import { CourseCard } from "@/components/course/course-card";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { getCourses, fmtDate, fmtPrice } from "@/lib/courses";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Academy: live data and AI engineering cohorts",
  description: "Live, small-group cohorts in AI engineering and data engineering, taught by Chris (Crispus Roshan). Real projects, recordings for life, and a Career track with 1:1 job help.",
  alternates: { canonical: "/courses" },
};

const included = [
  { icon: "play" as const, title: "Live sessions", body: "Three a week, Monday, Wednesday and Friday, taught by Chris." },
  { icon: "calendar" as const, title: "Recordings for life", body: "Every session is recorded. Keep the recordings and materials." },
  { icon: "code" as const, title: "Portfolio projects", body: "Build along in class and ship work you can show and explain." },
  { icon: "chat" as const, title: "Community", body: "Learn alongside your cohort, with support between sessions." },
  { icon: "doc" as const, title: "Resources", body: "Notes, code and cheat sheets you can download and keep." },
  { icon: "check" as const, title: "Certificate", body: "A certificate of completion when you finish the program." },
];

export default async function Academy() {
  const courses = await getCourses();
  const open = courses.filter((c) => c.cohorts.length);
  const next = open.flatMap((c) => c.cohorts.map((k) => k.start)).sort()[0];
  const price = Math.min(...courses.map((c) => c.price));

  return (
    <>
      <Row n="01" tone="white" showInlineNum={false}>
        <p className="t-mono pad flex items-center justify-between gap-4 py-4 text-muted">
          <span>Stackle / Academy</span>
          <span className="hidden sm:inline">{open.length} programs enrolling</span>
        </p>
      </Row>
      <Row n="02">
        <div className="pad pb-12 pt-10 md:pb-16 md:pt-20">
          <SectionHead
            as="h1"
            label="Academy"
            title={<>Live cohorts in data</>}
            second="and AI engineering."
            lede="Small groups, taught live by Chris. You build real projects every week, keep the recordings for life, and finish with work you can explain in any interview."
          />
        </div>
        <dl className="grid grid-cols-2 border-t hairline md:grid-cols-4">
          {[
            { v: String(open.length), l: "Programs enrolling" },
            { v: next ? fmtDate(next, { month: "short", day: "numeric" }) : "TBA", l: "Next cohort" },
            { v: "3×", l: "Live sessions a week" },
            { v: fmtPrice(price), l: "Standard track" },
          ].map((m, i) => (
            <div key={m.l} className={`corners flex flex-col px-5 py-6 md:px-8 md:py-8 ${i % 2 ? "border-l hairline" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
              <dt className="t-mono-sm order-2 mt-3 text-muted">{m.l}</dt>
              <dd className="t-pixel order-1 text-[40px] leading-none md:text-[52px]">{m.v}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row n="03" id="programs">
        <div className="pad sec">
          <SectionHead label="Programs" title="Pick your track." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c.slug} course={c} n={i + 1} />
            ))}
          </div>
        </div>
      </Row>

      <Row n="04">
        <div className="pad sec pb-0 md:pb-0">
          <SectionHead label="Every cohort" title="What's included" second="in every program." />
        </div>
        <ul className="mt-12 grid gap-px border-t hairline bg-line sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {included.map((x) => (
            <li key={x.title} className="flex gap-5 bg-paper p-6 md:p-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center border border-line bg-white">
                <Pixel name={x.icon} size={16} />
              </span>
              <span>
                <span className="block text-[17px] font-medium tracking-[-0.01em]">{x.title}</span>
                <span className="t-small mt-1.5 block">{x.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Row>

      <Row n="05">
        <div className="pad sec">
          <SectionHead label="Two tracks" title="Learn the skills, or" second="get hired with help." />
          <div className="mt-12 grid border hairline md:grid-cols-2">
            <div className="bg-white p-6 md:p-8">
              <p className="t-mono-sm text-muted">Standard track</p>
              <p className="t-pixel mt-4 text-[48px] leading-none">{fmtPrice(price)}</p>
              <p className="t-small mt-4">The full program: every live session, the projects, recordings and resources for life.</p>
              <Link href="#programs" className="dlink mt-8 text-[15px]">
                Choose a program above <ArrowUpRight />
              </Link>
            </div>
            <div className="border-t hairline bg-ink p-6 text-paper md:border-l md:border-t-0 md:p-8">
              <p className="t-mono-sm text-night-muted">Career track</p>
              <p className="t-pixel mt-4 text-[48px] leading-none">{fmtPrice(courses[0]?.copy.careerTrack.price ?? 1997)}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-night-muted">Everything in Standard, plus 1:1 job help with Chris: a resume rewrite, referral support and mock interviews.</p>
              <a href={site.bookCall} target="_blank" rel="noreferrer" className="dlink mt-8 text-[15px]">
                Book a call to join <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </Row>

      <Row n="06" tone="night">
        <div className="pad sec flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="reveal">
            <h2 className="t-h2">
              Not sure which one?
              <br />
              <span className="t-second">Ask Chris. The call is free.</span>
            </h2>
          </div>
          <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-paper reveal">
            <Pixel name="calendar" size={14} /> Book a free call
          </a>
        </div>
      </Row>
    </>
  );
}
