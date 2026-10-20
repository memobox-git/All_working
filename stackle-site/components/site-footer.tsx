import Link from "next/link";
import { site } from "@/content/site";
import { ArrowUpRight, Pixel } from "./icons";

const links = [
  { href: "/courses", label: "Academy" },
  { href: "/career", label: "Career" },
  { href: "/resources", label: "Resources" },
  { href: site.coachUrl, label: "AI resume coach" },
  { href: site.socials.linkedin, label: "LinkedIn" },
  { href: site.socials.meetup, label: "Meetup" },
  { href: site.socials.substack, label: "Newsletter" },
  { href: `${site.appUrl}/auth`, label: "Student login" },
];

export function SiteFooter() {
  return (
    <footer className="row row-night on-night border-t border-night-line">
      <div className="row-grid">
        <div className="row-gutter">
          <span className="row-num">FIN</span>
        </div>
        <div className="row-col">
          <div className="grid border-b border-night-line md:grid-cols-[1fr_2.2fr]">
            <a
              href={site.bookCall}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[180px] flex-col justify-between border-b border-night-line p-6 transition-colors hover:bg-night-2 md:min-h-[240px] md:border-b-0 md:border-r md:p-8"
            >
              <span className="t-mono-sm text-night-muted">01</span>
              <span className="flex items-end justify-between gap-6">
                <span className="text-[32px] leading-[1.05] tracking-[-0.035em] md:text-[44px]">Book a free call</span>
                <ArrowUpRight size={26} className="mb-2 text-night-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper" />
              </span>
            </a>
            <ul className="grid grid-cols-2 gap-px bg-night-line sm:grid-cols-4">
              {links.map((l, i) => {
                const external = l.href.startsWith("http");
                return (
                  <li key={l.label} className="bg-night">
                    <a
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex h-full min-h-[110px] flex-col justify-between p-5 transition-colors hover:bg-night-2 md:min-h-[120px] md:p-6"
                    >
                      <span className="t-mono-sm text-night-muted">{String(i + 2).padStart(2, "0")}</span>
                      <span className="flex items-end justify-between gap-3">
                        <span className="text-[17px] leading-tight tracking-[-0.02em] md:text-[18px]">{l.label}</span>
                        <ArrowUpRight size={14} className="mb-1 shrink-0 text-night-muted group-hover:text-paper" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-night-line px-6 py-7 md:px-8">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Stackle home">
              <Pixel name="logo" size={20} />
              <span className="text-[20px] font-medium tracking-[-0.03em]">Stackle</span>
            </Link>
            <p className="t-mono-sm text-night-muted">Built by engineers, for engineers</p>
          </div>

          <div aria-hidden="true" className="select-none overflow-hidden px-4 pt-10 md:px-8 md:pt-14">
            <div className="t-pixel bg-gradient-to-b from-[#2a2a27] to-night bg-clip-text text-center text-[23vw] leading-[0.8] tracking-[-0.04em] text-transparent xl:text-[268px]">
              STACKLE
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-night-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <p className="t-mono-sm text-night-muted">© {new Date().getFullYear()} Stackle</p>
            <nav aria-label="Legal" className="t-mono-sm flex gap-5 text-night-muted">
              <Link href="/privacy-policy" className="hover:text-paper">Privacy</Link>
              <Link href="/terms" className="hover:text-paper">Terms</Link>
              <a href={`mailto:${site.email}`} className="hover:text-paper">{site.email}</a>
            </nav>
          </div>
        </div>
        <div />
      </div>
    </footer>
  );
}
