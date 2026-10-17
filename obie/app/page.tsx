import Link from "next/link";
import { ObieOrb } from "@/components/obie-orb";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-extrabold tracking-tight">OBIE</span>
        <Link
          href="/login"
          className="rounded-full px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
        <ObieOrb size={144} float />

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-6xl">
          OBIE
        </h1>
        <p className="mt-3 text-xl font-semibold sm:text-2xl">
          One Business,{" "}
          <span className="underline decoration-accent decoration-4 underline-offset-[7px]">
            Infinite Employees
          </span>
        </p>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
          An AI team for one-person businesses. Tell OBIE about your business and
          get a team for sales, marketing, customers, product and operations.
        </p>

        <Link
          href="/login"
          className="mt-10 inline-flex h-13 w-full max-w-xs items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--color-primary)] transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
        >
          Get started
        </Link>
      </section>
    </main>
  );
}
