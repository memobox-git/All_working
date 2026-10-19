import { pillFor, type Pill } from "@/lib/chat-types";

const STYLES: Record<Pill, string> = {
  Waiting: "bg-surface text-muted ring-border",
  Working: "bg-primary-soft text-primary ring-primary/30",
  Done: "bg-primary text-primary-foreground ring-primary",
  Stuck: "bg-accent text-accent-foreground ring-accent",
};

// Waiting, Working, Done or Stuck. Unknown statuses render nothing.
export function StatusPill({ status, className = "" }: { status: string; className?: string }) {
  const pill = pillFor(status);
  if (!pill) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${STYLES[pill]} ${className}`}
    >
      {pill === "Working" && <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden />}
      {pill}
    </span>
  );
}
