import type { ReactNode } from "react";

// One full-width band of the framed page: hairline above and below, a 1120px column between two
// vertical hairlines, and the row number in the left gutter (inline above the content on small screens).
export function Row({
  n,
  tone = "paper",
  id,
  children,
  className = "",
  colClassName = "",
  showInlineNum = true,
}: {
  n?: string;
  tone?: "paper" | "white" | "night" | "fill";
  id?: string;
  children: ReactNode;
  className?: string;
  colClassName?: string;
  showInlineNum?: boolean;
}) {
  const toneClass =
    tone === "night" ? "row-night on-night" : tone === "white" ? "row-white" : tone === "fill" ? "bg-fill" : "";
  return (
    <section id={id} className={`row ${toneClass} ${className}`}>
      <div className="row-grid">
        <div className="row-gutter">{n && <span className="row-num" aria-hidden="true">{n}</span>}</div>
        <div className={`row-col ${colClassName}`}>
          {n && showInlineNum && (
            <div className="row-num-inline pad pt-6" aria-hidden="true">
              {n}
            </div>
          )}
          {children}
        </div>
        <div />
      </div>
    </section>
  );
}

// Section heading block used across pages: label chip, two-tone title, optional lede.
export function SectionHead({
  label,
  title,
  second,
  lede,
  as: Tag = "h2",
  className = "",
  children,
}: {
  label?: string;
  title: ReactNode;
  second?: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`reveal ${className}`}>
      {label && <span className="label">{label}</span>}
      <Tag className={`${Tag === "h1" ? "t-display" : "t-h2"} ${label ? "mt-6" : ""}`}>
        {title}
        {second && (
          <>
            <br />
            <span className="t-second">{second}</span>
          </>
        )}
      </Tag>
      {lede && <p className="t-lede mt-6 max-w-[620px]">{lede}</p>}
      {children}
    </div>
  );
}
