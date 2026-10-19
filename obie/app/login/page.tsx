import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ObieOrb } from "@/components/obie-orb";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in to OBIE" };

const promises = [
  "Tell OBIE about your business, by voice or text.",
  "Get a team for sales, marketing, customers, product and operations.",
  "Nothing goes out in your name until you approve it.",
];

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel: desktop only */}
      <section className="relative hidden flex-col justify-between bg-primary-soft p-12 lg:flex">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          OBIE
        </Link>
        <div className="max-w-md">
          <ObieOrb size={132} float />
          <h2 className="mt-8 text-4xl font-extrabold tracking-tight">
            One Business,{" "}
            <span className="underline decoration-accent decoration-4 underline-offset-[7px]">
              Infinite Employees
            </span>
          </h2>
          <ul className="mt-8 space-y-4">
            {promises.map((line) => (
              <li key={line} className="flex gap-3 text-base leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted">An AI team for one-person businesses.</p>
      </section>

      {/* Form */}
      <section className="flex flex-col px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <header className="flex items-center justify-between py-4 lg:hidden">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            OBIE
          </Link>
        </header>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center pb-16">
          <ObieOrb size={56} className="lg:hidden" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight lg:mt-0">Sign in to OBIE</h1>
          <p className="mt-2 text-muted">Use your email and password. New here? Create an account.</p>
          <Suspense fallback={<div className="mt-8 h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
