"use client";

import { useState } from "react";
import { Copy } from "@/components/icons";

// A paper-side copy button (the shared <CopyButton> is styled for dark code windows).
export function CopyTextButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
    >
      <Copy size={14} />
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}
