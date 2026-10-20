import type { Metadata } from "next";
import { Row, SectionHead } from "@/components/row";
import { Accordion } from "@/components/accordion";
import { CareerPlans } from "@/components/career/plans";
import { PaidBanner } from "@/components/career/paid-banner";
import { ArrowRight, Pixel, type PixelName } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Career service: resume, LinkedIn and job search strategy",
  description: "Get more interviews with an ATS-friendly resume rewrite, LinkedIn optimisation, role positioning and a 1:1 strategy call with Chris (Crispus Roshan). From $250.",
  alternates: { canonical: "/career" },
};

const pipeline = [
  { name: "Resume", note: "Your entry ticket", ours: true },
  { name: "LinkedIn", note: "Inbound discovery", ours: true },
  { name: "Artifacts", note: "GitHub, portfolio" },
  { name: "Applying", note: "Volume and targeting", ours: true },
  { name: "Interview prep", note: "Coding, system design" },
  { name: "Interviews", note: "Technical and behavioral" },
  { name: "Offer", note: "Negotiate and decide" },
];

const problems = [
  { title: "Filtered out early", body: "Resumes that never make it past the applicant tracking system, so no human ever reads them." },
  { title: "Blending in", body: "Generic, template resumes that look like thousands of others for the same role." },
  { title: "No clear story", body: "Weak positioning: nothing that says what makes you valuable, or for which role." },
  { title: "No plan", body: "No strategy for where, how or when to apply, so effort turns into silence." },
];

const included: { title: string; icon: PixelName; items: string[] }[] = [
  { title: "Resume rewrite", icon: "doc", items: ["Full rewrite or optimisation", "Keywords for your target roles", "Metrics-driven achievement bullets", "2+ rounds of revisions"] },
  { title: "LinkedIn profile", icon: "user", items: ["Headline and About rewrite", "Experience section optimisation", "Keywords for recruiter search", "Profile visibility strategy"] },
  { title: "Role positioning", icon: "target", items: ["Target role identification", "Seniority jump strategy", "Narrative positioning", "Personal brand alignment"] },
  { title: "Resume marketing kit", icon: "chat", items: ["Recruiter DM templates", "Referral request templates", "Follow-up email templates", "Cover letter template", "“Tell me about yourself” pitch"] },
  { title: "Application strategy", icon: "flow", items: ["Where and how to apply", "Application tracking system", "Referrals vs cold applying", "Follow-up timing"] },
  { title: "1:1 review call", icon: "calendar", items: ["30–45 minute live strategy session", "Resume and LinkedIn walkthrough", "A 30-day action plan", "Open Q&A"] },
];

const faqs = [
  { q: "Who is this for?", a: "Tech professionals (data engineers, software engineers, analysts, ML engineers) and career switchers with real-world experience who want more, and better, interviews." },
  { q: "How long does it take?", a: "You'll receive your optimised resume and LinkedIn profile within 14 days of the kickoff call. The full process, including revisions, usually wraps up within 14 to 30 days." },
  { q: "Do you rewrite my resume or just edit it?", a: "A full rewrite if it needs one. Every bullet, section and keyword is written for applicant tracking systems and for the human recruiter reading it. It's repositioning, not proofreading." },
  { q: "Is this only for data engineers?", a: "No. It works for all tech roles: software, data, analytics, ML and AI, DevOps and more. The strategy is tailored to the role you're targeting." },
  { q: "How many revisions do I get?", a: "At least two rounds. We revise until you're happy; that's the satisfaction guarantee." },
  { q: "What happens after I buy?", a: "You'll get an onboarding form for your current resume, target roles and goals. Then we schedule your 1:1 review call and get to work on your materials." },
];

export default function CareerPage() {
  return (
    <>
      <PaidBanner />
      <section className="fill-ruled">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="label reveal">Resume · LinkedIn · Strategy</span>
            <h1 className="t-display reveal mt-7">
              More interviews, <span className="t-accent">starting with your resume.</span>
            </h1>
            <p className="t-lede reveal mt-7 max-w-[560px]">
              Not just resume editing: a full resume, LinkedIn, positioning and application strategy system for tech professionals, from someone who has interviewed 200+ engineers.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3">
              <a href="#plans" className="btn btn-ink">
                Get started from $250 <ArrowRight />
              </a>
              <a href={site.coachUrl} className="btn btn-line">
                Free AI resume review
              </a>
            </div>
          </div>
          <div className="card-float reveal mx-auto w-full max-w-[440px] p-5 md:p-6" style={{ ["--d" as string]: ".1s" }}>
            <div className="flex items-center justify-between gap-3">
              <p className="t-serif text-[21px]">Your hiring pipeline</p>
              <span className="rounded-full border border-line-strong px-2.5 py-1 text-[12px] font-semibold">7 stages</span>
            </div>
            <ol className="mt-4">
              {pipeline.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between gap-3 border-t hairline py-2.5 text-[14.5px]">
                  <span className="flex items-center gap-3">
                    <span className="t-serif w-5 text-[13px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className={p.ours ? "font-semibold text-ink" : "text-ink-2"}>{p.name}</span>
                  </span>
                  {p.ours ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[12px] font-semibold text-paper">
                      <Pixel name="check" size={12} /> We fix
                    </span>
                  ) : (
                    <span className="text-[13px] text-muted">{p.note}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Row tone="white">
        <div className="pad sec">
          <SectionHead label="Sound familiar?" title="Skilled, and still" second="not getting calls." lede="You've built real things. Your resume just isn't doing the selling for you. Whether you're a data engineer, software engineer, analyst, ML engineer or a career switcher, the problem is the same." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <div key={p.title} className="panel reveal relative overflow-hidden p-6" style={{ ["--d" as string]: `${i * 0.05}s` }}>
                <span className="absolute inset-y-0 left-0 w-[3px] bg-ink" aria-hidden="true" />
                <h3 className="t-h4">{p.title}</h3>
                <p className="t-small mt-3">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Row>

      <Row>
        <div className="pad sec">
          <SectionHead label="What's included" title="Everything you need" second="to land more interviews." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((b, i) => (
              <div key={b.title} className="panel reveal flex flex-col p-6 md:p-7" style={{ ["--d" as string]: `${i * 0.04}s` }}>
                <span className="icon-tile">
                  <Pixel name={b.icon} size={19} />
                </span>
                <h3 className="t-h4 mt-6">{b.title}</h3>
                <ul className="dot-list mt-4 grid gap-2 text-[14.5px] text-ink-2">
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Row>

      <Row tone="white" id="plans">
        <div className="pad sec">
          <SectionHead label="Pricing" title="Choose" second="your plan." lede="One flat price, no hourly billing. Secure checkout with Stripe." />
          <div className="mt-12">
            <CareerPlans />
          </div>
        </div>
      </Row>

      <Row>
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <SectionHead label="FAQ" title="Questions," second="answered." />
            <a href={`mailto:${site.email}`} className="dlink reveal mt-6">
              {site.email} <ArrowRight />
            </a>
          </div>
          <Accordion items={faqs} />
        </div>
      </Row>
    </>
  );
}
