import type { Metadata } from "next";
import { ObieOrb } from "@/components/obie-orb";

export const metadata: Metadata = { title: "This OBIE is private" };

// Shown to anyone signed in whose email isn't on the private list.
export default function PrivatePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
      <ObieOrb size={88} />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">This OBIE is private</h1>
      <p className="mt-3 max-w-sm text-muted">
        It&apos;s only open to its owner for now. If that should be you, sign in with the email you were invited with.
      </p>
      <form action="/auth/signout" method="post" className="mt-8">
        <button
          type="submit"
          className="rounded-full border border-border px-5 py-2.5 font-semibold transition-colors hover:bg-surface"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
