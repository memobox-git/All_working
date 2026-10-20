"use client";

import { useState } from "react";
import { Copy } from "./icons";

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`t-mono-sm inline-flex items-center gap-1.5 px-2.5 py-2 text-night-muted transition-colors hover:text-paper ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        } catch {}
      }}
      aria-label={done ? "Copied" : `${label} to clipboard`}
    >
      <Copy size={12} />
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}
