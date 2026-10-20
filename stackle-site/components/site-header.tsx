"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { ArrowRight, Menu, Pixel } from "./icons";

export function Logo({ className = "", sub = true, dark = false }: { className?: string; sub?: boolean; dark?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="Stackle home">
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${dark ? "bg-paper text-ink" : "bg-ink text-paper"}`}>
        <Pixel name="logo" size={17} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="t-serif text-[23px] tracking-[-0.02em]">Stackle</span>
        {sub && <span className={`mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-night-muted" : "text-muted"}`}>Data &amp; AI careers</span>}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-200 ${scrolled || open ? "border-b border-line bg-paper/90 shadow-[0_10px_30px_-24px_rgba(21,21,19,0.35)] backdrop-blur-md" : "border-b border-transparent bg-paper"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-5 md:h-[80px] md:px-10">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-[8px] px-3.5 py-2 text-[15.5px] transition-colors hover:text-ink ${isActive(item.href) ? "text-ink underline decoration-1 underline-offset-[10px]" : "text-ink-2"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-line btn-chrome hidden sm:inline-flex">
            Book a call
          </a>
          <Link href="/courses" className="btn btn-ink btn-chrome">
            Enroll
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-line-strong bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col px-5 pt-4">
            {[...nav, { href: `${site.appUrl}/auth`, label: "Student login" }].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center justify-between border-b border-line py-5" onClick={() => setOpen(false)}>
                <span className="t-serif text-[30px] tracking-[-0.02em]">{item.label}</span>
                <ArrowRight size={16} className="text-muted" />
              </a>
            ))}
          </nav>
          <div className="grid gap-3 p-5">
            <Link href="/courses" className="btn btn-ink btn-block" onClick={() => setOpen(false)}>
              See the next cohorts <ArrowRight />
            </Link>
            <a href={site.bookCall} target="_blank" rel="noreferrer" className="btn btn-line btn-block">
              Book a free call
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
