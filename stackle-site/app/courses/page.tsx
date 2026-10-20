import type { Metadata } from "next";
import { Row, SectionHead } from "@/components/row";
import { CourseCard } from "@/components/course/course-card";
import { ArrowRight, Pixel, type PixelName } from "@/components/icons";
import { getCourses, fmtDate, fmtPrice } from "@/lib/courses";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Academy: live data and AI engineering cohorts",
  description: "Live, small-group cohorts in AI engineering and data engineering, taught by Chris (Crispus Roshan). Real projects, recordings for life, and a Career track with 1:1 job help.",
  alternates: { canonical: "/courses" },
};

const included: { icon: PixelName; title: string; body: string }[] = [
  { icon: "play", title: "Live sessions", body: "Three a week, Monday, Wednesday and Friday, taught by Chris." },
  { icon: "calendar", title: "Recordings for life", body: "Every session is recorded. Keep the recordings and materials." },
  { icon: "code", title: "Portfolio projects", body: "Build along in class and ship work you can show and explain." },
  { icon: "chat", title: "Community", body: "Learn alongside your cohort, with support between sessions." },
  { icon: "doc", title: "Resources", body: "Notes, code and cheat sheets you can download and keep." },
  { icon: "check", title: "Certificate", body: "A certificate of completion when you finish the program." },
];

export default async function Academy() {
  const courses = await getCourses();
  const open = courses.filter((c) => c.cohorts.length);
  const next = open.flatMap((c) => c.cohorts.map((k) => k.start)).sort()[0];
  const price = Math.min(...courses.map((c) => c.price));
  const career = courses[0]?.copy.careerTrack.price ?? 1997;

  return (
    <>
      <section className="fill-ruled">
        <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-10 md:px-10 md:pb-20 md:pt-20">
          <SectionHead
            as="h1"
            label="Stackle Academy"
            title="Live cohorts in data"
            second="and AI engineering."
            lede="Small groups, taught live by Chris. You build real projects every week, keep the recordings for life, and finish with work you can explain in any interview."
          />
          <dl className="reveal mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:mt-16 md:grid-cols-4">
            {[
              { v: String(open.length), l: "Programs enrolling now" },
              { v: next ? fmtDate(next, { month: "short", day: "numeric" }) : "TBA", l: "Next cohort starts" },
              { v: "3×", l: "Live sessions a week" },
              { v: fmtPrice(price), l: "Standard track" },
            ].map((m) => (
              <div key={m.l} className="flex flex-col border-t border-line-strong pt-5">
                <dt className="order-2 mt-2 text-[14px] text-muted">{m.l}</dt>
                <dd className="t-serif order-1 text-[40px] leading-none tracking-[-0.03em] md:text-[52px]">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Row tone="white" id="programs">
        <div className="pad sec">
          <SectionHead label="Programs" title="Pick your" second="track." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c.slug} course={c} n={i + 1} />
            ))}
          </div>
        </div>
      </Row>

      <Row>
        <div className="pad sec grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHead label="Every cohort" title="What's included" second="in every program." />
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {included.map((x, i) => (
              <li key={x.title} className="reveal flex gap-4" style={{ ["--d" as string]: `${i * 0.04}s` }}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-white">
                  <Pixel name={x.icon} size={18} />
                </span>
                <span>
                  <span className="block text-[17px] font-semibold">{x.title}</span>
                  <span className="t-small mt-1.5 block">{x.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Row>

      <Row tone="white">
        <div className="pad sec">
          <SectionHead label="Two tracks" title="Learn the skills, or" second="get hired with help." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="panel flex flex-col p-6 md:p-8">
              <h3 className="t-h3">Standard track</h3>
              <p className="t-small mt-2">The full program: every live session, the projects, recordings and resources for life.</p>
              <p className="t-serif mt-8 text-[52px] leading-none tracking-[-0.03em]">{fmtPrice(price)}</p>
              <a href="#programs" className="btn btn-ink mt-8 self-start">
                Choose a program <ArrowRight />
              </a>
            </div>
            <div className="flex flex-col rounded-[16px] bg-ink p-6 text-paper shadow-[0_30px_60px_-30px_rgba(21,21,19,0.6)] md:p-8">
              <h3 className="t-h3">Career track</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-night-muted">Everything in Standard, plus 1:1 job help with Chris: a resume rewrite, referral support and mock interviews.</p>
              <p className="t-serif mt-8 text-[52px] leading-none tracking-[-0.03em]">{fmtPrice(career)}</p>
              <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-paper mt-8 self-start">
                Book a call to join <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </Row>
    </>
  );
}
