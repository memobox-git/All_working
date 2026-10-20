// A thin line "x" that matches the line icons in components/icons.tsx (24px grid, 1.6 stroke), which have no cross.
// Used next to the word "Bad" / "Avoid" so the meaning never depends on the icon alone.
export function PixelCross({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}
