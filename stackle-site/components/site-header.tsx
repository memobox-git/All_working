"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Menu, Pixel, ArrowUpRight } from "./icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Stackle home">
      <Pixel name="logo" size={20} />
      <span className="text-[20px] font-medium tracking-[-0.03em]">Stackle</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="row-grid">
        <div />
        <div className="flex h-[68px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-6 xl:px-4">
          <Logo />
          <nav aria-label="Main" className="hidden border border-line lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`t-mono px-4 py-[13px] transition-colors hover:bg-white hover:text-ink ${isActive(item.href) ? "bg-ink text-paper hover:!bg-ink hover:!text-paper" : "text-muted"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={`${site.appUrl}/auth`} className="t-mono hidden px-3 py-3 text-muted hover:text-ink sm:inline-flex">
              Sign in
            </a>
            <Link href="/courses" className="btn btn-line btn-chrome">
              Enroll
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center border border-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <Menu open={open} />
            </button>
          </div>
        </div>
        <div />
      </div>

      {open && (
        <div id="mobile-menu" className="on-night fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-night text-paper lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {[...nav, { href: `${site.appUrl}/auth`, label: "Sign in" }].map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-end justify-between border-b border-night-line px-5 pb-5 pt-6"
                onClick={() => setOpen(false)}
              >
                <span>
                  <span className="t-mono-sm block text-night-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block text-[28px] tracking-[-0.03em]">{item.label}</span>
                </span>
                <ArrowUpRight size={18} className="mb-2 text-night-muted" />
              </a>
            ))}
          </nav>
          <div className="p-5">
            <Link href="/courses" className="btn btn-paper btn-block" onClick={() => setOpen(false)}>
              <Pixel name="spark" size={14} /> See the next cohorts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
