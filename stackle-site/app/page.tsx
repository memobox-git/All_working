import Link from "next/link";
import { Row, SectionHead } from "@/components/row";
import { HeroCards } from "@/components/home/hero-cards";
import { CourseCard } from "@/components/course/course-card";
import { ResourceCard } from "@/components/resource-card";
import { Accordion } from "@/components/accordion";
import { ArrowRight, Pixel, type PixelName } from "@/components/icons";
import { getCourses } from "@/lib/courses";
import { instructor, proof, site } from "@/content/site";
import { resources } from "@/content/resources";

const features: { icon: PixelName; title: string; body: string }[] = [
  { icon: "play", title: "Live, not pre-recorded", body: "Three live sessions a week with Chris. Ask questions as you build, and keep every recording and file for life." },
  { icon: "code", title: "Real projects, every week", body: "End-to-end pipelines on a modern cloud stack, or a deployed AI app: work you can show, and explain, in an interview." },
  { icon: "user", title: "Taught by someone who hires", body: "Chris has interviewed 200+ engineers. You learn what interviewers actually probe, and what gets people rejected." },
];

const faqs = [
  { q: "Are the sessions live?", a: "Yes. Cohorts meet live three times a week (Monday, Wednesday and Friday). Every session is recorded, and you keep lifetime access to the recordings and resources." },
  { q: "Which course should I take?", a: "If you already write some Python or SQL and want to build data platforms, take Data Engineering. If you want to build AI products (LLM apps, RAG, agents), take AI Engineering; it only needs basic Python. Not sure? Book a free call and Chris will tell you straight." },
  { q: "How much does it cost?", a: "Each masterclass is $1,497 on the Standard track. The Career track ($1,997) adds 1:1 job help: a resume rewrite, referral support and mock interviews." },
  { q: "Do I need an account to enroll?", a: "Yes. When you enroll you create a Stackle account, pay securely with Stripe, and get your learner dashboard with the sessions, recordings and materials." },
];

export default async function Home() {
  const courses = await getCourses();
  const open = courses.filter((c) => c.cohorts.length);
  const heroCourse = courses.find((c) => c.slug === "data-engineering-masterclass-get-job-ready-in-10-weeks") ?? open[0] ?? courses[0];
  const featured = resources.filter((r) => r.featured).concat(resources.filter((r) => !r.featured)).slice(0, 3);

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
              Small live cohorts in data and AI engineering, taught by an engineer who has interviewed 200+ engineers. Build real projects, and learn to defend them.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: ".15s" }}>
              <Link href="/courses" className="btn btn-ink">
                See the next cohorts <ArrowRight />
              </Link>
              <Link href="/resources" className="btn btn-line">
                Free resources
              </Link>
            </div>
          </div>
          {heroCourse && <HeroCards course={heroCourse} />}
        </div>
      </section>

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
        <div className="pad sec">
          <SectionHead label="Why Stackle" title="Built like a bootcamp." second="Taught like a mentor." />
          <div className="mt-12 grid gap-x-10 gap-y-10 md:mt-16 md:grid-cols-3">
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
            <p className="t-body reveal mt-6 max-w-[520px]">{instructor.bioShort}</p>
            <dl className="reveal mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
              {proof.slice(0, 4).map((p) => (
                <div key={p.label} className="flex flex-col border-t border-line-strong pt-4">
                  <dt className="order-2 mt-2 text-[13.5px] leading-snug text-muted">{p.label}</dt>
                  <dd className="t-serif order-1 text-[34px] leading-none tracking-[-0.03em]">{p.value}</dd>
                </div>
              ))}
            </dl>
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="dlink reveal mt-8">
              Chris on LinkedIn <ArrowRight />
            </a>
          </div>
        </div>
      </Row>

      {/* resources */}
      <Row>
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

      {/* career service */}
      <Row tone="white" id="career">
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
          <SectionHead label="Career service" title="Need interviews," second="not another course?" lede="Chris rewrites your resume and LinkedIn for the roles you want, and gives you a plan for where to apply." />
          <div className="reveal grid gap-4">
            <Link href="/career" className="panel group flex items-center justify-between gap-6 p-6 md:p-7">
              <span>
                <span className="t-mono-sm text-muted">From $250</span>
                <span className="t-serif mt-2 block text-[24px] leading-tight tracking-[-0.01em]">Resume and LinkedIn rewrite</span>
              </span>
              <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={site.coachUrl} className="panel group flex items-center justify-between gap-6 p-6 md:p-7">
              <span>
                <span className="t-mono-sm text-muted">Free</span>
                <span className="t-serif mt-2 block text-[24px] leading-tight tracking-[-0.01em]">AI resume coach: an honest score in minutes</span>
              </span>
              <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            </a>
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
