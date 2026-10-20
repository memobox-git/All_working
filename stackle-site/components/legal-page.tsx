import type { ReactNode } from "react";
import { Row } from "@/components/row";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Row n="01" tone="white" showInlineNum={false}>
        <p className="t-mono pad py-4 text-muted">Stackle / Legal</p>
      </Row>
      <Row n="02">
        <div className="pad sec grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <h1 className="t-h2">{title}</h1>
            <p className="t-mono-sm mt-4 text-muted">Last updated: {updated}</p>
          </div>
          <div className="prose-s max-w-[680px]">{children}</div>
        </div>
      </Row>
    </>
  );
}
