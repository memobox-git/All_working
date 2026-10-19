// A main agent's avatar: a smaller glossy blue orb with its initials.
// Subagents get a lighter orb so the hierarchy reads at a glance.
export function AgentOrb({
  name,
  size = 36,
  variant = "main",
  className = "",
}: {
  name: string;
  size?: number;
  variant?: "main" | "sub";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`agent-orb agent-orb-${variant} inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold tracking-tight ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
    >
      {initials(name)}
    </span>
  );
}

export function initials(name: string) {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
