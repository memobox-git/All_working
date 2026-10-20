import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="fill-ruled">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-32">
        <span className="label">Error 404</span>
        <h1 className="t-display mt-6 max-w-[760px]">
          This page isn&apos;t here. <span className="t-second">It may have moved in the redesign.</span>
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ink">
            Back to home <ArrowRight />
          </Link>
          <Link href="/resources" className="btn btn-line">
            Free resources
          </Link>
          <Link href="/courses" className="btn btn-line">
            Academy
          </Link>
        </div>
      </div>
    </section>
  );
}
