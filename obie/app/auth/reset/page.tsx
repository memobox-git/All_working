import type { Metadata } from "next";
import { ObieOrb } from "@/components/obie-orb";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Set your password" };

// The password email lands here (via /auth/callback) with the user signed in.
export default function ResetPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <ObieOrb size={56} />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Set your password</h1>
        <p className="mt-2 text-muted">You&apos;ll use it with your email to sign in from now on.</p>
        <ResetForm />
      </div>
    </main>
  );
}
