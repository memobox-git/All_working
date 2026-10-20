import Link from "next/link";
import { Row, SectionHead } from "@/components/row";
import { HeroCards } from "@/components/home/hero-cards";
import { CourseCard } from "@/components/course/course-card";
import { ResourceCard } from "@/components/resource-card";
import { CareerPlans } from "@/components/career/plans";
import { CodeBlock } from "@/components/code-block";
import { Accordion } from "@/components/accordion";
import { ArrowRight, Pixel, type PixelName } from "@/components/icons";
import { getCourses, fmtDate } from "@/lib/courses";
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
  { title: "You can't explain your own project", body: "Your resume says you built a real-time pipeline with Kafka and Spark. The first follow-up is “Why Kafka?”, and a tutorial project has no answer." },
  { title: "Fifteen tools, nothing deep", body: "The interviewer picks one tool and asks how it works inside. Three tools you know deeply are worth more than fifteen you've only touched." },
  { title: "Your story starts in the wrong place", body: "“Walk me through a pipeline you've built” should start with the business problem, not the tech stack." },
];

const features: { icon: PixelName; title: string; body: string }[] = [
  { icon: "play", title: "Live, not pre-recorded", body: "Three live sessions a week with Chris. Ask questions as you build, and keep every recording and file for life." },
  { icon: "code", title: "Real projects, every week", body: "End-to-end pipelines on a modern cloud stack, or a deployed AI app: work you can show, and explain, in an interview." },
  { icon: "user", title: "Taught by someone who hires", body: "Chris has interviewed 200+ engineers. You learn what interviewers actually probe, and what gets people rejected." },
  { icon: "target", title: "A Career track when you need it", body: "Add 1:1 help with your resume, referrals and mock interviews, so the skills turn into offers." },
];

const steps = [
  { n: "01", title: "Pick your cohort", body: "Choose AI or Data Engineering and a start date. Not sure? Book a free call and Chris will tell you straight." },
  { n: "02", title: "Learn live", body: "Monday, Wednesday and Friday sessions. Build along in class, then keep going on your own between them." },
  { n: "03", title: "Ship your projects", body: "Every week ends in working code that goes into your portfolio: models, pipelines, streams, DAGs, AI apps." },
  { n: "04", title: "Present at Demo Day", body: "Show your project and practise explaining every choice in it, the part most interviews actually test." },
];

const faqs = [
  { q: "Who teaches the cohorts?", a: `Chris (Crispus Roshan). ${instructor.bio}` },
  { q: "Are the sessions live?", a: "Yes. Cohorts meet live three times a week (Monday, Wednesday and Friday). Every session is recorded, and you keep lifetime access to the recordings and resources." },
  { q: "Which course should I take?", a: "If you already write some Python or SQL and want to build data platforms, take Data Engineering. If you want to build AI products (LLM apps, RAG, agents), take AI Engineering; it only needs basic Python. Not sure? Book a free call and Chris will tell you straight." },
  { q: "How much does it cost?", a: "Each masterclass is $1,497 on the Standard track. The Career track ($1,997) adds 1:1 job help: a resume rewrite, referral support and mock interviews." },
  { q: "I only need help with my resume and LinkedIn.", a: "That's the Career service: an ATS-friendly resume rewrite, LinkedIn optimisation, positioning and a 1:1 review call, from $250. Or start with the free AI resume coach." },
  { q: "Do I need an account to enroll?", a: "Yes. When you enroll you create a Stackle account, pay securely with Stripe, and get your learner dashboard with the sessions, recordings and materials." },
];

export default async function Home() {
  const courses = await getCourses();
  const open = courses.filter((c) => c.cohorts.length);
  const next = open.flatMap((c) => c.cohorts.map((k) => k.start)).sort()[0];
  const heroCourse = courses.find((c) => c.slug === "data-engineering-masterclass-get-job-ready-in-10-weeks") ?? open[0] ?? courses[0];
  const featured = resources.filter((r) => r.featured).concat(resources.filter((r) => !r.featured)).slice(0, 6);

  return (
    <>
      {/* hero */}
      <section className="fill-ruled relative overflow-hidden">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10">
          <div>
            <span className="label reveal">Live cohorts · Data &amp; AI engineering</span>
            <h1 className="t-display reveal mt-7" style={{ ["--d" as string]: ".05s" }}>
              Learn the skills that <span className="t-accent">get you hired.</span>
            </h1>
            <p className="t-lede reveal mt-7 max-w-[560px]" style={{ ["--d" as string]: ".1s" }}>
              Small live cohorts in data and AI engineering, taught by Chris: 10+ years in data engineering and 200+ engineers interviewed. You build real projects
              and learn to explain them the way interviews test you.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: ".15s" }}>
              <Link href="/courses" className="btn btn-ink">
                See the next cohorts <ArrowRight />
              </Link>
              <Link href="/resources" className="btn btn-line">
                Free resources
              </Link>
            </div>
            <ul className="dot-list reveal mt-8 grid gap-x-8 gap-y-2.5 text-[14.5px] text-ink-2 sm:grid-cols-2" style={{ ["--d" as string]: ".2s" }}>
              <li>Taught live, three sessions a week</li>
              <li>Recordings and materials for life</li>
              <li>{next ? `Next cohort starts ${fmtDate(next, { month: "long", day: "numeric" })}` : "New cohorts announced soon"}</li>
              <li>Career track with 1:1 job help</li>
            </ul>
          </div>
          {heroCourse && <HeroCards course={heroCourse} />}
        </div>
      </section>

      {/* industries */}
      <Row tone="white">
        <div className="pad grid gap-6 py-10 md:grid-cols-[230px_1fr] md:items-center md:py-12">
          <p className="t-mono-sm text-muted">Chris has hired engineers for teams in</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
            {instructor.industries.map((x) => (
              <li key={x} className="t-serif text-[22px] tracking-[-0.01em] text-ink-2 md:text-[24px]">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </Row>

      {/* the problem */}
      <Row>
        <div className="pad sec">
          <SectionHead label="Sound familiar?" title="Good engineers still get rejected" second="for the same few reasons." lede="From more than 200 interviews Chris has run, these come up again and again. None of them is a missing certificate." />
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            {rejections.map((r, i) => (
              <div key={r.title} className="panel reveal relative overflow-hidden p-6 md:p-7" style={{ ["--d" as string]: `${i * 0.06}s` }}>
                <span className="absolute inset-y-0 left-0 w-[3px] bg-ink" aria-hidden="true" />
                <p className="t-serif text-[15px] text-muted">Reason {String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-h4 mt-3">{r.title}</h3>
                <p className="t-small mt-3">{r.body}</p>
              </div>
            ))}
          </div>
          <Link href="/courses" className="dlink reveal mt-8">
            How the cohorts fix this <ArrowRight />
          </Link>
        </div>
      </Row>

      {/* programs */}
      <Row tone="white" id="programs">
        <div className="pad sec">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label="Academy" title="Two live cohorts." second="One standard: job-ready." lede="Start with the track you need. Both run live, both end in a portfolio project you can defend." />
            <Link href="/courses" className="btn btn-line btn-chrome reveal">
              All programs <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
            {open.map((c, i) => (
              <CourseCard key={c.slug} course={c} n={i + 1} />
            ))}
          </div>
        </div>
      </Row>

      {/* why */}
      <Row>
        <div className="pad sec grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHead label="Why Stackle" title="Built like a bootcamp." second="Taught like a mentor." />
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {features.map((f, i) => (
              <div key={f.title} className="reveal flex gap-4" style={{ ["--d" as string]: `${i * 0.05}s` }}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-white">
                  <Pixel name={f.icon} size={18} />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold leading-snug">{f.title}</h3>
                  <p className="t-small mt-2">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Row>

      {/* numbers */}
      <Row tone="night">
        <div className="pad sec">
          <SectionHead label="By the numbers" title="A decade of hiring," second="brought into one room." />
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
            {proof.slice(0, 4).map((p) => (
              <div key={p.label} className="reveal flex flex-col border-t border-night-line pt-6">
                <dt className="order-2 mt-3 text-[14.5px] text-night-muted">{p.label}</dt>
                <dd className="t-serif order-1 text-[52px] leading-none tracking-[-0.03em] md:text-[64px]">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Row>

      {/* how it works */}
      <Row>
        <div className="pad sec">
          <SectionHead label="How it works" title="From first class to" second="final round, in one cohort." />
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n} className="reveal border-t hairline pt-6" style={{ ["--d" as string]: `${i * 0.05}s` }}>
                <p className="t-serif text-[17px] text-muted">{s.n}</p>
                <h3 className="mt-3 text-[18px] font-semibold">{s.title}</h3>
                <p className="t-small mt-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Row>

      {/* instructor */}
      <Row tone="white">
        <div className="pad sec grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
          <figure className="reveal relative mx-auto w-full max-w-[420px]">
            <div className="card-float overflow-hidden p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={instructor.photo} alt="Chris (Crispus Roshan), founder of Stackle" width={640} height={800} loading="lazy" className="block aspect-[4/5] w-full rounded-[10px] object-cover grayscale" />
            </div>
            <figcaption className="chip-dark absolute -bottom-5 right-4 px-4 py-3 sm:-right-6">
              <p className="text-[12.5px] text-night-muted">{instructor.role}</p>
              <p className="t-serif mt-1 text-[21px] leading-none">{instructor.fullName}</p>
            </figcaption>
          </figure>
          <div>
            <SectionHead label="Your instructor" title="Taught by someone" second="who hires." />
            <p className="t-body reveal mt-6 max-w-[520px]">{instructor.bio}</p>
            <ul className="reveal mt-8 grid gap-3 sm:grid-cols-2">
              {instructor.facts.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-ink-2">
                  <Pixel name="check" size={17} className="mt-0.5 text-ink" /> {f}
                </li>
              ))}
            </ul>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="dlink reveal mt-8">
              Chris on LinkedIn <ArrowRight />
            </a>
          </div>
        </div>
      </Row>

      {/* code */}
      <Row>
        <div className="pad sec grid gap-12 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-16">
          <div>
            <SectionHead label="Learn by doing" title="Learn it by" second="shipping it." lede="Every week ends in working code: a data model, a Spark job, a Kafka stream, an Airflow DAG, a RAG app. It goes in your portfolio, and you learn to defend it." />
            <Link href="/courses/data-engineering-masterclass-get-job-ready-in-10-weeks#curriculum" className="dlink reveal mt-8">
              See the full curriculum <ArrowRight />
            </Link>
          </div>
          <div className="reveal" style={{ ["--d" as string]: ".1s" }}>
            <CodeBlock code={DAG} language="python" filename="dags/orders_daily.py" lineNumbers />
            <p className="mt-3 text-[13.5px] text-muted">Week 07 · Job orchestration with Airflow</p>
          </div>
        </div>
      </Row>

      {/* resources */}
      <Row tone="white">
        <div className="pad sec">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label="Free resources" title="Free, and" second="actually useful." lede="Roadmaps with a lesson for every topic, 580 interview questions with worked answers, and guides you can work through tonight." />
            <Link href="/resources" className="btn btn-line btn-chrome reveal">
              The full library <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {featured.map((r) => (
              <ResourceCard key={r.slug} r={r} />
            ))}
          </div>
        </div>
      </Row>

      {/* free AI coach */}
      <Row>
        <div className="pad py-14 md:py-16">
          <a href={site.coachUrl} className="panel group grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-8">
            <span className="icon-tile !h-14 !w-14">
              <Pixel name="doc" size={24} />
            </span>
            <span>
              <span className="t-mono-sm text-muted">Free · AI resume coach</span>
              <span className="t-serif mt-2 block text-[24px] leading-tight tracking-[-0.01em] md:text-[28px]">
                Drop your resume. Get an honest score, the bullets that work <span className="italic">and the gaps that don&apos;t.</span>
              </span>
            </span>
            <span className="btn btn-ink btn-chrome justify-self-start md:justify-self-end">
              Try it free <ArrowRight />
            </span>
          </a>
        </div>
      </Row>

      {/* career service */}
      <Row tone="white" id="career">
        <div className="pad sec">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead label="Career service" title="Get the interviews" second="before the cohort ends." lede="Chris rewrites your resume and LinkedIn for the roles you want, and gives you a plan for where and how to apply." />
            <Link href="/career" className="btn btn-line btn-chrome reveal">
              How it works <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 md:mt-16">
            <CareerPlans />
          </div>
        </div>
      </Row>

      {/* FAQ */}
      <Row id="faq">
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <SectionHead label="FAQ" title="Questions," second="answered." />
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="dlink reveal mt-6">
              Ask Chris on a call <ArrowRight />
            </a>
          </div>
          <Accordion items={faqs} />
        </div>
      </Row>
    </>
  );
}
