import type { ReactNode } from "react";
import { Row } from "@/components/row";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="fill-ruled">
        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
          <span className="label">Legal</span>
          <h1 className="t-display mt-6">{title}</h1>
          <p className="mt-5 text-[14px] text-muted">Last updated: {updated}</p>
        </div>
      </section>
      <Row tone="white">
        <div className="pad sec">
          <div className="prose-s max-w-[720px]">{children}</div>
        </div>
      </Row>
    </>
  );
}
