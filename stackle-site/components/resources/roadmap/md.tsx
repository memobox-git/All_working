import type { ReactNode } from "react";

// Inline Markdown used in the roadmap JSON (*Md fields): **bold** and *italic* only.
export function Md({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  const out: ReactNode[] = parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-medium text-ink">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
  return <>{out}</>;
}
