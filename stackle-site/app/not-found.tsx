import Link from "next/link";
import { Row } from "@/components/row";
import { ArrowUpRight, Pixel } from "@/components/icons";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Row n="404">
      <div className="pad sec">
        <p className="t-pixel text-[96px] leading-none md:text-[160px]">404</p>
        <h1 className="t-h2 mt-8">
          This page isn&apos;t here.
          <br />
          <span className="t-second">It may have moved in the redesign.</span>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href="/" className="btn btn-ink">
            <Pixel name="logo" size={14} /> Back to home
          </Link>
          <Link href="/resources" className="dlink">
            Free resources <ArrowUpRight />
          </Link>
          <Link href="/courses" className="dlink">
            Academy <ArrowUpRight />
          </Link>
        </div>
      </div>
    </Row>
  );
}
