import type { Metadata } from "next";
import raw from "@/content/resources/sql-cheat-sheet.json";
import { ResourceHero, ResourceCta } from "@/components/resources/resource-shell";
import { Row } from "@/components/row";
import { CodeBlock } from "@/components/code-block";
import { ArrowRight } from "@/components/icons";
import { CheatSheetSignup } from "@/components/resources/guides/cheat-sheet-signup";

export const metadata: Metadata = {
  title: "SQL Essentials Cheat Sheet",
  description: `${raw.summary} Read it here or download the free PDF, no email needed.`,
  alternates: { canonical: "/resources/sql-cheat-sheet" },
};

const pdf = raw.file;
const pdfSize = `${(pdf.bytes / 1000).toFixed(1)} KB`;

const slug = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Lines ending in ";" are runnable SQL. The others are keyword lists ("UNION, UNION ALL, INTERSECT, EXCEPT"),
// sometimes with a note in brackets; those render as keyword chips instead of fake code.
const sections = raw.pdfContent.sections.map((s) => {
  const lines = s.code.split("\n");
  const sql = lines.filter((l) => l.trim().endsWith(";")).join("\n");
  const keywords = lines
    .filter((l) => !l.trim().endsWith(";"))
    .map((l) => {
      const m = /^(.*?)\s*\((.+)\)\s*$/.exec(l.trim());
      const list = m ? m[1] : l.trim();
      return { words: list.split(/,\s*/).filter(Boolean), note: m ? m[2] : null };
    });
  return { ...s, id: slug(s.title), sql, keywords };
});

const statements = sections.reduce((n, s) => n + (s.sql ? s.sql.split("\n").length : 0), 0);

function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <a href={pdf.src} download={pdf.downloadFilename} className={`btn btn-ink ${className}`}>
      Download the PDF <ArrowRight className="rotate-90" />
    </a>
  );
}

export default function Page() {
  return (
    <>
      <ResourceHero
        category={raw.category}
        title="SQL Essentials"
        second="Cheat Sheet"
        summary={raw.summary}
        meta={[
          { label: "Sections", value: String(sections.length) },
          { label: "SQL statements", value: String(statements) },
          { label: "PDF pages", value: String(pdf.pages) },
          { label: "PDF size", value: pdfSize },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <DownloadButton />
          <p className="t-mono-sm text-muted">PDF · {pdf.pages} pages · No email needed</p>
        </div>
      </ResourceHero>

      <Row n="03" id="sheet">
        <nav aria-label="Sections" className="pad border-b hairline py-5">
          <ol className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="t-mono-sm inline-flex items-center gap-2 border hairline bg-white px-2.5 py-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                  <span className="opacity-60">{String(s.number).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <ol>
          {sections.map((s) => (
            <li
              key={s.id}
              id={s.id}
              className="pad grid gap-5 border-b hairline py-9 last:border-b-0 md:grid-cols-[230px_minmax(0,1fr)] md:gap-10 md:py-12"
            >
              <div>
                <span className="t-pixel block text-[40px] leading-none md:text-[52px]" aria-hidden="true">
                  {String(s.number).padStart(2, "0")}
                </span>
                <h2 className="t-h4 mt-3 md:mt-4">
                  <span className="sr-only">{s.number}. </span>
                  {s.title}
                </h2>
              </div>
              <div className="min-w-0 space-y-4">
                {s.sql && <CodeBlock code={s.sql} language="sql" filename={`${s.id}.sql`} />}
                {s.keywords.map((k, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <span className="t-mono-sm mr-1 text-muted">{s.sql ? "Also" : "Keywords"}</span>
                    {k.words.map((w) => (
                      <code key={w} className="border hairline bg-white px-2 py-1 font-mono text-[13px] text-ink">
                        {w}
                      </code>
                    ))}
                    {k.note && <span className="t-small ml-1">{k.note.charAt(0).toUpperCase() + k.note.slice(1)}.</span>}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Row>

      <Row n="04" id="download">
        <div className="grid md:grid-cols-2">
          <div className="pad py-12 md:py-16">
            <span className="label">Free PDF</span>
            <h2 className="t-h3 mt-6">Keep a copy on your desk.</h2>
            <p className="t-body mt-4 max-w-[440px]">
              The same {sections.length} sections on {pdf.pages} printable pages. It&apos;s a direct download, with no form to fill in.
            </p>
            <DownloadButton className="mt-7" />
            <p className="t-mono-sm mt-4 text-muted">
              {pdf.downloadFilename} · {pdfSize}
            </p>
          </div>
          <div id="updates" className="pad border-t hairline bg-white py-12 md:border-l md:border-t-0 md:py-16">
            <span className="label label-plain">Optional</span>
            <h2 className="t-h3 mt-6">Email me new cheat sheets.</h2>
            <p className="t-body mt-4 max-w-[440px]">Get an email when we publish a new cheat sheet. You don&apos;t need this to download the PDF.</p>
            <div className="mt-7 max-w-[480px]">
              <CheatSheetSignup source="sql-cheat-sheet" />
            </div>
          </div>
        </div>
      </Row>

      <ResourceCta n="05" />
    </>
  );
}
