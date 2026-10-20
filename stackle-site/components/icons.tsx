// Line icons (24px grid, 1.6 stroke) under their old names, plus the Stackle slab mark ("logo").
// Every icon inherits currentColor, so it works on paper and on night.

const LINE = {
  spark: "M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5zM18.5 15.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5z",
  check: "M5 12.5l4.2 4.2L19 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  play: "M8.5 5.8v12.4L18.2 12z",
  db: "M4.5 6.5c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3zM4.5 6.5v11c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-11M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3",
  code: "M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14",
  chat: "M4.5 5.5h15v10.5h-9l-4.5 3.5v-3.5h-1.5z",
  doc: "M6.5 3.5h7.5l4 4v13h-11.5zM13.5 3.5v4.5h4.5M9.5 12.5h5M9.5 16h5",
  flow: "M3.5 4.5h6v6h-6zM14.5 13.5h6v6h-6zM6.5 10.5v2.5a3.5 3.5 0 0 0 3.5 3.5h4.5",
  user: "M12 11.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5zM4.5 20.5c.4-3.7 3.5-5.8 7.5-5.8s7.1 2.1 7.5 5.8",
  target: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12.6a.6.6 0 1 0 0-1.2.6.6 0 0 0 0 1.2z",
  calendar: "M4.5 6h15v14h-15zM4.5 10.5h15M8.5 3.5V7M15.5 3.5V7",
  bolt: "M13.5 3.5L5.5 13.5h6l-1 7 8-10h-6z",
  lock: "M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  quote: "M6.5 7h4v4.5c0 2.8-1.4 4.8-4 5.5M14 7h4v4.5c0 2.8-1.4 4.8-4 5.5",
  grid: "M4.5 4.5h6.5V11H4.5zM13 4.5h6.5V11H13zM4.5 13h6.5v6.5H4.5zM13 13h6.5v6.5H13z",
  star: "M12 3.8l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.4l-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7z",
} as const;

export type PixelName = keyof typeof LINE | "logo";

export function Pixel({ name, size = 16, className = "", title }: { name: PixelName; size?: number; className?: string; title?: string }) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  if (name === "logo") {
    // three slabs stacked into a rising staircase
    return (
      <svg width={size} height={Math.round(size * 0.8)} viewBox="0 0 10 8" className={`inline-block shrink-0 ${className}`} fill="currentColor" {...a11y}>
        <rect x="6" y="0" width="4" height="2" rx="0.35" />
        <rect x="3" y="3" width="7" height="2" rx="0.35" />
        <rect x="0" y="6" width="10" height="2" rx="0.35" />
      </svg>
    );
  }
  const filled = name === "play";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      <path d={LINE[name]} />
    </svg>
  );
}

export function ArrowUpRight({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M3 11 11 3M4.5 3H11v6.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRight({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M1.5 7h11M8 2.5 12.5 7 8 11.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowLeft({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M12.5 7h-11M6 2.5 1.5 7 6 11.5" strokeLinecap="square" />
    </svg>
  );
}

export function Copy({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect x="4.5" y="4.5" width="8" height="8" />
      <path d="M2 9.5V2h7.5" />
    </svg>
  );
}

export function Search({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={`shrink-0 ${className}`} aria-hidden="true">
      <circle cx="7" cy="7" r="5" />
      <path d="m11 11 3.5 3.5" strokeLinecap="square" />
    </svg>
  );
}

export function Menu({ open = false }: { open?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {open ? <path d="m4 4 10 10M14 4 4 14" /> : <path d="M2 6h14M2 12h14" />}
    </svg>
  );
}
