import type { Agent } from "@/lib/chat-types";
import { AgentOrb } from "../agent-orb";
import { ObieOrb, type ObieState } from "../obie-orb";

// OBIE is the blue orb with the yellow star, main agents are smaller orbs
// with initials, subagents lighter orbs, and nano agents tiny dots.
export function Avatar({
  agent,
  nano,
  size = 32,
  obieState = "idle",
}: {
  agent: Agent | null | undefined;
  nano?: boolean;
  size?: number;
  obieState?: ObieState;
}) {
  if (nano) {
    return (
      <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
        <span className="nano-dot size-2.5 rounded-full bg-primary" />
      </span>
    );
  }
  if (!agent) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background"
        style={{ width: size, height: size }}
        aria-hidden
      >
        You
      </span>
    );
  }
  if (agent.path === "obie") return <ObieOrb size={size} state={obieState} />;
  return <AgentOrb name={agent.name} size={size} variant={agent.level === "main" ? "main" : "sub"} />;
}
