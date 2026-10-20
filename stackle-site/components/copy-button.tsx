"use client";

import { useState } from "react";
import { Copy } from "./icons";

// Copies `text`, or when it's omitted, the text of the nearest code window's <pre>. Reading from the page
// keeps long code out of the client payload (pages like the SQL questions have hundreds of samples).
export function CopyButton({ text, label = "Copy", className = "" }: { text?: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-2 text-[12.5px] font-semibold text-night-muted transition-colors hover:text-paper ${className}`}
      onClick={async (e) => {
        const pre = e.currentTarget.closest("figure")?.querySelector("pre");
        const lines = pre ? Array.from(pre.querySelectorAll("[data-line]")) : [];
        const value = text ?? (lines.length ? lines.map((l) => l.textContent ?? "").join("\n").replace(/\u00a0/g, "") : pre?.textContent ?? "");
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        } catch {}
      }}
      aria-label={done ? "Copied" : `${label} to clipboard`}
    >
      <Copy size={13} />
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}
