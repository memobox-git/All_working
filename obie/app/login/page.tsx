import Link from "next/link";
import { ObieOrb } from "@/components/obie-orb";

// Placeholder until login (email magic link and Google) is built.
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <ObieOrb size={72} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Sign in is almost here</h1>
      <p className="mt-2 max-w-xs text-muted">
        Email and Google sign-in arrive in the next build step.
      </p>
      <Link href="/" className="mt-8 text-sm font-semibold text-primary">
        Back to home
      </Link>
    </main>
  );
}
