import Link from "next/link";
import { Row, SectionHead } from "@/components/row";
import { HeroGrid } from "@/components/home/hero-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { Concentric } from "@/components/home/concentric";
import { CourseCard } from "@/components/course/course-card";
import { ResourceCard } from "@/components/resource-card";
import { CareerPlans } from "@/components/career/plans";
import { CodeBlock } from "@/components/code-block";
import { Accordion } from "@/components/accordion";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { IsoPipeline, IsoRounds, IsoSchedule, IsoStack } from "@/components/illustrations";
import { getCourses, fmtDate, fmtDays } from "@/lib/courses";
import { instructor, proof, site } from "@/content/site";
import { resources } from "@/content/resources";

const DAG = `from datetime import datetime
from airflow.decorators import dag, task

import pipeline


@dag(
    schedule="@daily",
    start_date=datetime(2026, 10, 22),
    catchup=False,
)
def orders_daily():
    @task
    def extract():
        return pipeline.read_new_orders()

    @task
    def clean(orders):
        return pipeline.drop_bad_rows(orders)

    @task
    def load(orders):
        pipeline.write_to_warehouse(orders)

    load(clean(extract()))


orders_daily()`;

const rejections = [
  { n: "#1", title: "You can't explain your own project", body: "Your resume says you built a real-time pipeline with Kafka and Spark. The first follow-up is “Why Kafka?”, and a tutorial project has no answer." },
  { n: "#2", title: "Fifteen tools, nothing deep", body: "The interviewer picks one tool and asks how it works inside. Three tools you know deeply are worth more than fifteen you've only touched." },
  { n: "#3", title: "Your story starts in the wrong place", body: "“Walk me through a pipeline you've built” should start with the business problem, not the tech stack." },
];

const faqs = [
  { q: "Who teaches the cohorts?", a: `Chris (Crispus Roshan). ${instructor.bio}` },
  { q: "Are the sessions live?", a: "Yes. Cohorts meet live three times a week (Monday, Wednesday and Friday). Every session is recorded, and you keep lifetime access to the recordings and resources." },
  { q: "Which course should I take?", a: "If you already write some Python or SQL and want to build data platforms, take Data Engineering. If you want to build AI products (LLM apps, RAG, agents), take AI Engineering; it only needs basic Python. Not sure? Book a free call and Chris will tell you straight." },
  { q: "How much does it cost?", a: "Each masterclass is $1,497 on the Standard track. The Career track ($1,997) adds 1:1 job help: a resume rewrite, referral support and mock interviews." },
  { q: "I only need help with my resume and LinkedIn.", a: "That's the Career service: an ATS-friendly resume rewrite, LinkedIn optimisation, positioning and a 1:1 review call, from $250. See the Career page." },
  { q: "Do I need an account to enroll?", a: "Yes. When you enroll you create a Stackle account, pay securely with Stripe, and get access to your learner dashboard with the sessions, recordings and materials." },
];

export default async function Home() {
  const courses = await getCourses();
  const open = courses.filter((c) => c.cohorts.length);
  const starts = open.flatMap((c) => c.cohorts.map((k) => k.start)).sort();
  const next = starts[0];
  const nextShort = next ? fmtDate(next, { month: "short", day: "numeric" }).toUpperCase() : "TBA";
  const days = open[0]?.cohorts[0]?.days ?? [];
  const featured = resources.filter((r) => r.featured).concat(resources.filter((r) => !r.featured)).slice(0, 6);

  return (
    <>
      {/* 01 announcement */}
      <Row n="01" tone="white" showInlineNum={false}>
        <Link href="/courses" className="t-mono pad flex items-center justify-center gap-3 py-[18px] text-center hover:underline">
          <span className="animate-blink inline-block h-2 w-2 bg-ink" aria-hidden="true" />
          {next ? (
            <span>
              Next cohorts start {fmtDate(next, { month: "short", day: "numeric" })}
              <span className="hidden sm:inline"> · {open.map((c) => c.copy.short).join(" + ")}</span>
            </span>
          ) : (
            <span>New cohorts announced soon</span>
          )}
        </Link>
      </Row>

      {/* 02 hero */}
      <Row n="02">
        <div className="pad pb-14 pt-8 md:pb-24 md:pt-24">
          <h1 className="t-display reveal">
            <span className="flex items-start gap-3 md:gap-5">
              <Pixel name="spark" size={44} className="mt-[0.12em] hidden h-[0.6em] w-[0.6em] text-faint sm:block" />
              <span>
                Learn the skills
                <br />
                that get you <span className="t-pixel">hired</span>.
              </span>
            </span>
          </h1>
          <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-[1.25fr_1fr] md:items-start md:gap-16">
            <p className="t-lede reveal max-w-[560px] text-ink-2" style={{ ["--d" as string]: ".1s" }}>
              Live cohorts in data and AI engineering, taught by Chris: 10+ years in data engineering and 200+ engineers interviewed. You learn live, build real
              projects and practise explaining them, the way interviews actually test you.
            </p>
            <div className="reveal" style={{ ["--d" as string]: ".2s" }}>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                <Link href="/courses" className="btn btn-ink">
                  <Pixel name="spark" size={14} /> See the next cohorts
                </Link>
                <Link href="/resources" className="dlink">
                  Free roadmaps <ArrowUpRight />
                </Link>
              </div>
              <p className="t-mono-sm mt-6 text-muted">
                $ next_cohort --start {next ? fmtDate(next, { year: "numeric", month: "2-digit", day: "2-digit" }) : "tba"} --days {fmtDays(days).toLowerCase().replace(/ \/ /g, ",")}
              </p>
            </div>
          </div>
        </div>
      </Row>

      {/* 03 pipeline board */}
      <Row n="03" showInlineNum={false}>
        <HeroGrid nextCohort={nextShort} />
      </Row>

      {/* 04 industries */}
      <Row n="04">
        <div className="pad grid gap-6 py-10 md:grid-cols-[240px_1fr] md:items-center md:py-12">
          <p className="t-mono-sm text-muted">Chris has hired engineers for teams in</p>
          <ul className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
            {instructor.industries.map((x, i) => (
              <li key={x} className="flex items-center gap-3 text-[18px] tracking-[-0.02em] text-ink-2 md:text-[20px]">
                <Pixel name={(["target", "lock", "flow", "bolt"] as const)[i]} size={18} className="text-muted" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </Row>

      {/* 05 the problem */}
      <Row n="05" tone="night">
        <div className="pad sec">
          <SectionHead label="Across the table" title="Why good engineers" second="still get rejected." lede="From more than 200 interviews Chris has run, the same few reasons come up again and again. None of them is a missing course certificate." />
          <div className="mt-12 grid border hairline md:mt-16 md:grid-cols-3">
            {rejections.map((r, i) => (
              <div key={r.n} className={`reveal flex flex-col gap-6 p-6 md:p-8 ${i ? "border-t hairline md:border-l md:border-t-0" : ""}`} style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="t-pixel grid h-14 w-16 place-items-center border hairline text-[30px]">{r.n}</span>
                <div>
                  <h3 className="t-h4">{r.title}</h3>
                  <p className="t-small mt-3 !text-night-muted">{r.body}</p>
                </div>
              </div>
            ))}
            <div className="grid border-t hairline md:col-span-3 md:grid-cols-2">
              <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
                <div>
                  <p className="t-mono-sm text-night-muted">With Stackle</p>
                  <h3 className="t-h2 mt-5">
                    Learn it, build it,
                    <br />
                    <span className="t-pixel">explain it.</span>
                  </h3>
                </div>
                <div>
                  <Link href="/courses" className="btn btn-paper">
                    <Pixel name="spark" size={14} /> Find your cohort
                  </Link>
                </div>
              </div>
              <div className="fill-iso grid min-h-[260px] place-items-center border-t hairline p-8 md:border-l md:border-t-0">
                <IsoRounds className="w-full max-w-[360px] [&_polygon]:[stroke:#f4f4f1]" />
              </div>
            </div>
          </div>
        </div>
      </Row>

      {/* 06 how it works */}
      <Row n="06">
        <div className="pad pt-16 md:pt-28">
          <SectionHead label="How it works" title="From first class to final round" second="in four steps." />
        </div>
        <div className="mt-12 md:mt-16">
          <HowItWorks
            steps={[
              { key: "01", title: "Learn", second: "live", tag: "Mon · Wed · Fri", body: "Three live sessions a week with Chris. Every session is recorded, and you keep the recordings and materials for life.", art: <IsoSchedule className="w-full" /> },
              { key: "02", title: "Build", second: "real projects", tag: "Portfolio", body: "Build along in class and ship your own work: end-to-end pipelines on a modern cloud stack, or a deployed AI app.", art: <IsoPipeline className="w-full" /> },
              { key: "03", title: "Show", second: "your work", tag: "Demo Day", body: "Present your project and practise explaining every choice in it, the part most interviews actually test.", art: <IsoRounds className="w-full" /> },
              { key: "04", title: "Get", second: "hired", tag: "Career track", body: "On the Career track, Chris works with you 1:1 on your resume, referrals and mock interviews.", art: <IsoStack className="w-full" /> },
            ]}
          />
        </div>
      </Row>

      {/* 07 programs */}
      <Row n="07" id="programs">
        <div className="pad sec">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label="Academy" title="Live cohorts." second="Small groups, real projects." />
            <Link href="/courses" className="dlink reveal">
              All programs <ArrowUpRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
            {open.map((c, i) => (
              <CourseCard key={c.slug} course={c} n={i + 1} />
            ))}
          </div>
        </div>
      </Row>

      {/* 08 instructor */}
      <Row n="08">
        <div className="grid md:grid-cols-2">
          <div className="fill-iso relative grid place-items-center border-b hairline p-8 md:border-b-0 md:border-r md:p-14">
            <figure className="corners relative w-full max-w-[380px] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={instructor.photo} alt="Chris (Crispus Roshan), founder of Stackle" width={640} height={800} className="block aspect-[4/5] w-full object-cover grayscale" loading="lazy" />
              <figcaption className="t-mono-sm flex justify-between px-1 pb-1 pt-3 text-muted">
                <span>{instructor.fullName}</span>
                <span>{instructor.role}</span>
              </figcaption>
            </figure>
          </div>
          <div className="pad flex flex-col justify-center py-14 md:py-20">
            <SectionHead label="Your instructor" title="Taught by someone" second="who hires." />
            <p className="t-body reveal mt-6 max-w-[480px]">{instructor.bio}</p>
            <ul className="reveal mt-8 border-t hairline">
              {instructor.facts.map((f) => (
                <li key={f} className="flex items-center gap-3 border-b hairline py-4 text-[15px]">
                  <Pixel name="check" size={13} /> {f}
                </li>
              ))}
            </ul>
            <div className="reveal mt-8">
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="dlink">
                Chris on LinkedIn <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </Row>

      {/* 09 code */}
      <Row n="09" tone="night">
        <div className="pad sec grid gap-12 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-16">
          <div className="reveal">
            <h2 className="t-h2">
              Learn it by
              <br />
              <span className="t-pixel">shipping it.</span>
            </h2>
            <p className="t-lede mt-6 max-w-[420px]">
              Every week ends in working code: a data model, a Spark job, a Kafka stream, an Airflow DAG, a RAG app. It goes in your portfolio, and you learn to defend it.
            </p>
            <Link href="/courses/data-engineering-masterclass-get-job-ready-in-10-weeks" className="dlink mt-8">
              See the curriculum <ArrowUpRight />
            </Link>
          </div>
          <div className="reveal" style={{ ["--d" as string]: ".1s" }}>
            <CodeBlock code={DAG} language="python" filename="dags/orders_daily.py" lineNumbers />
            <p className="t-mono-sm flex items-center gap-2 border border-t-0 border-night-line bg-night-2 px-4 py-3 text-night-muted">
              <span className="h-1.5 w-1.5 bg-paper" aria-hidden="true" /> Week 07 · Job orchestration with Airflow
            </p>
          </div>
        </div>
      </Row>

      {/* 10 proof */}
      <Row n="10">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {proof.slice(0, 4).map((p, i) => (
            <div key={p.label} className={`corners flex flex-col px-6 py-8 md:px-8 md:py-10 ${i % 2 ? "border-l hairline" : ""} ${i > 1 ? "border-t hairline md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
              <dt className="t-mono-sm order-2 mt-4 text-muted">{p.label}</dt>
              <dd className="t-pixel order-1 text-[44px] leading-none md:text-[56px]">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Row>

      {/* 11 resources */}
      <Row n="11">
        <div className="pad sec pb-0 md:pb-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label="Free resources" title="Free, and actually" second="useful." lede="Roadmaps with a lesson for every topic, hundreds of interview questions with worked answers, and guides you can work through tonight." />
            <Link href="/resources" className="dlink reveal">
              The full library <ArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="mt-12 grid gap-px border-t hairline bg-line md:mt-16 md:grid-cols-3">
          {featured.map((r, i) => (
            <ResourceCard key={r.slug} r={r} n={i + 1} />
          ))}
        </div>
      </Row>

      {/* 12 career service */}
      <Row n="12" id="career">
        <div className="pad sec pb-12 md:pb-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              label="Career service"
              title="Get the interviews first."
              second="Resume, LinkedIn, strategy."
              lede="Not ready for a cohort? Chris rewrites your resume and LinkedIn for the roles you want, and gives you a plan for where and how to apply."
            />
            <Link href="/career" className="dlink reveal">
              How it works <ArrowUpRight />
            </Link>
          </div>
        </div>
        <div className="border-t hairline">
          <CareerPlans />
        </div>
      </Row>

      {/* 13 FAQ */}
      <Row n="13" id="faq">
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHead title="Questions" />
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="dlink reveal mt-6">
              Ask Chris on a call <ArrowUpRight />
            </a>
          </div>
          <Accordion items={faqs} />
        </div>
      </Row>

      {/* 14 closing */}
      <Row n="14" tone="night">
        <div className="pad sec grid gap-14 md:grid-cols-2 md:items-center">
          <div className="reveal">
            <h2 className="text-[clamp(2.75rem,1.4rem+4.2vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              Your next role
              <br />
              starts with a <span className="t-pixel">plan.</span>
            </h2>
            <p className="t-lede mt-8 max-w-[420px]">Pick a cohort, or talk it through with Chris first. The call is free.</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link href="/courses" className="btn btn-paper">
                <Pixel name="spark" size={14} /> See the next cohorts
              </Link>
              <a href={site.bookCall} target="_blank" rel="noreferrer" className="dlink">
                Book a free call <ArrowUpRight />
              </a>
            </div>
          </div>
          <Concentric />
        </div>
      </Row>
    </>
  );
}
