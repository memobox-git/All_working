import type { Metadata } from "next";
import Link from "next/link";
import { Row, SectionHead } from "@/components/row";
import { Accordion } from "@/components/accordion";
import { CareerPlans } from "@/components/career/plans";
import { PaidBanner } from "@/components/career/paid-banner";
import { ArrowUpRight, Pixel } from "@/components/icons";
import { IsoStack } from "@/components/illustrations";
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
  "Resumes that never make it past the applicant tracking system",
  "Generic, template resumes that blend in with thousands of others",
  "Weak positioning: no clear story about what makes you valuable",
  "No strategy for where, how or when to apply",
];

const included = [
  { title: "Resume rewrite", icon: "doc" as const, items: ["Full rewrite or optimisation", "Keywords for your target roles", "Metrics-driven achievement bullets", "2+ rounds of revisions"] },
  { title: "LinkedIn profile", icon: "user" as const, items: ["Headline and About rewrite", "Experience section optimisation", "Keywords for recruiter search", "Profile visibility strategy"] },
  { title: "Role positioning", icon: "target" as const, items: ["Target role identification", "Seniority jump strategy", "Narrative positioning", "Personal brand alignment"] },
  { title: "Resume marketing kit", icon: "chat" as const, items: ["Recruiter DM templates", "Referral request templates", "Follow-up email templates", "Cover letter template", "“Tell me about yourself” pitch"] },
  { title: "Application strategy", icon: "flow" as const, items: ["Where and how to apply", "Application tracking system", "Referrals vs cold applying", "Follow-up timing"] },
  { title: "1:1 review call", icon: "calendar" as const, items: ["30–45 minute live strategy session", "Resume and LinkedIn walkthrough", "A 30-day action plan", "Open Q&A"] },
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
      <Row n="01" tone="white" showInlineNum={false}>
        <p className="t-mono pad flex items-center justify-between gap-4 py-4 text-muted">
          <span>Stackle / Career service</span>
          <span className="hidden sm:inline">From $250</span>
        </p>
      </Row>

      <Row n="02">
        <div className="grid md:grid-cols-[1.3fr_1fr]">
          <div className="pad pb-12 pt-10 md:pb-20 md:pt-20">
            <SectionHead
              as="h1"
              label="Resume · LinkedIn · Strategy"
              title="More interviews,"
              second="starting with your resume."
              lede="Not just resume editing: a full resume, LinkedIn, positioning and application strategy system for tech professionals, from someone who has interviewed 200+ engineers."
            />
            <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a href="#plans" className="btn btn-ink">
                <Pixel name="spark" size={14} /> Get started from $250
              </a>
              <a href={site.bookCall} target="_blank" rel="noreferrer" className="dlink">
                Book a free call <ArrowUpRight />
              </a>
            </div>
          </div>
          <div className="fill-iso grid place-items-center border-t hairline p-10 md:border-l md:border-t-0">
            <IsoStack className="w-full max-w-[300px]" labels={["Resume", "LinkedIn", "Strategy"]} />
          </div>
        </div>
      </Row>

      <Row n="03">
        <div className="pad sec pb-0 md:pb-0">
          <SectionHead label="The pipeline" title="Getting hired is a pipeline." second="Every stage feeds the next." lede="Most people practise for interviews they never get. We fix the stages at the top, where the interviews come from." />
        </div>
        <ol className="mt-12 grid grid-cols-2 gap-px border-t hairline bg-line sm:grid-cols-4 lg:grid-cols-7 md:mt-16">
          {pipeline.map((p, i) => (
            <li key={p.name} className={`flex min-h-[150px] flex-col justify-between p-5 ${p.ours ? "bg-ink text-paper" : "bg-paper"}`}>
              <span className="flex items-center justify-between">
                <span className={`t-mono-sm ${p.ours ? "text-night-muted" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                {p.ours && <span className="t-mono-sm border border-paper px-1.5 py-0.5">We fix</span>}
              </span>
              <span>
                <span className="block text-[17px] font-medium tracking-[-0.01em]">{p.name}</span>
                <span className={`mt-1 block text-[13px] ${p.ours ? "text-night-muted" : "text-muted"}`}>{p.note}</span>
              </span>
            </li>
          ))}
          <li className="hidden bg-paper sm:block lg:hidden" aria-hidden="true" />
        </ol>
      </Row>

      <Row n="04" tone="night">
        <div className="pad sec grid gap-12 md:grid-cols-2">
          <SectionHead label="Sound familiar?" title="Skilled, and still" second="not getting calls." lede="You've built real things. Your resume just isn't doing the selling for you. Whether you're a data engineer, software engineer, analyst, ML engineer or a career switcher, the problem is the same." />
          <ul className="reveal self-end border-t hairline">
            {problems.map((p, i) => (
              <li key={p} className="flex items-start gap-4 border-b hairline py-5">
                <span className="t-pixel w-8 shrink-0 text-[20px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Row>

      <Row n="05">
        <div className="pad sec pb-0 md:pb-0">
          <SectionHead label="What's included" title="Everything you need" second="to land more interviews." />
        </div>
        <ul className="mt-12 grid gap-px border-t hairline bg-line sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {included.map((b, i) => (
            <li key={b.title} className="flex flex-col bg-paper p-6 md:p-8">
              <span className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center border border-line bg-white">
                  <Pixel name={b.icon} size={16} />
                </span>
                <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3 className="t-h4 mt-6">{b.title}</h3>
              <ul className="mt-4 grid gap-2">
                {b.items.map((x) => (
                  <li key={x} className="t-small flex items-start gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 bg-ink" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Row>

      <Row n="06" id="plans">
        <div className="pad sec pb-12 md:pb-16">
          <SectionHead label="Pricing" title="Choose your plan." second="Secure checkout with Stripe." />
        </div>
        <div className="border-t hairline">
          <CareerPlans />
        </div>
      </Row>

      <Row n="07">
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHead title="Questions" />
            <a href={`mailto:${site.email}`} className="dlink reveal mt-6">
              {site.email} <ArrowUpRight />
            </a>
          </div>
          <Accordion items={faqs} />
        </div>
      </Row>

      <Row n="08" tone="night">
        <div className="pad sec flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="t-h2 reveal">
            Stop waiting.
            <br />
            <span className="t-second">Start getting interviews.</span>
          </h2>
          <div className="reveal flex flex-wrap gap-3">
            <a href="#plans" className="btn btn-paper">
              <Pixel name="spark" size={14} /> Get started for $250
            </a>
            <Link href="/courses" className="btn btn-line">
              Or join a cohort <ArrowUpRight />
            </Link>
          </div>
        </div>
      </Row>
    </>
  );
}
