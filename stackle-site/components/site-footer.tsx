import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "./site-header";
import { ArrowRight } from "./icons";

const cols = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Academy" },
      { href: "/courses/master-ai-engineering-in-10-weeks-get-hired", label: "AI Engineering" },
      { href: "/courses/data-engineering-masterclass-get-job-ready-in-10-weeks", label: "Data Engineering" },
      { href: "/resources", label: "Free resources" },
    ],
  },
  {
    title: "Get hired",
    links: [
      { href: "/career", label: "Career service" },
      { href: site.coachUrl, label: "AI resume coach" },
      { href: site.bookCall, label: "Book a free call" },
      { href: `${site.appUrl}/auth`, label: "Student login" },
    ],
  },
  {
    title: "Follow",
    links: [
      { href: site.socials.linkedin, label: "LinkedIn" },
      { href: site.socials.meetup, label: "Meetup" },
      { href: site.socials.substack, label: "Newsletter" },
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-night bg-night text-paper">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid gap-10 border-b border-night-line py-16 md:grid-cols-[1.2fr_1fr] md:items-end md:py-24">
          <div>
            <span className="label">Next step</span>
            <h2 className="t-h2 mt-6 max-w-[560px]">
              Not sure where to start? <span className="t-second">Talk it through with Chris.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-paper">
              Book a free call <ArrowRight />
            </a>
            <Link href="/courses" className="btn btn-line">
              See the cohorts
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-[280px] text-[15px] leading-relaxed text-night-muted">Live cohorts in data and AI engineering, taught by an engineer who hires.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="t-mono-sm text-night-muted">{c.title}</p>
              <ul className="mt-4 grid gap-2.5">
                {c.links.map((l) => {
                  const external = /^(https?:|mailto:)/.test(l.href);
                  return (
                    <li key={l.label}>
                      <a href={l.href} {...(external && !l.href.startsWith("mailto:") ? { target: "_blank", rel: "noreferrer" } : {})} className="text-[15px] text-paper/85 transition-colors hover:text-paper">
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="select-none overflow-hidden border-t border-night-line pt-6">
          <div className="t-serif bg-gradient-to-b from-[#3a3733] to-night bg-clip-text text-center text-[27vw] leading-[0.82] tracking-[-0.045em] text-transparent xl:text-[300px]">
            Stackle<span className="italic">.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-night-line py-6 text-[13.5px] text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stackle. Built by engineers, for engineers.</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-paper">Privacy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
