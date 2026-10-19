"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AgentOrb } from "./agent-orb";
import { CustomStackDesigner, type BuiltAgent } from "./custom-stack-designer";
import { ObieOrb } from "./obie-orb";

export type TeamRow = {
  id: string;
  parentId: string | null;
  role: string;
  reason: string;
  credits: number;
  depth: 0 | 1 | 2;
  on: boolean;
};
export type TeamStack = { stack: string; title: string; main: TeamRow; agents: TeamRow[] };
export type Suggestion = { name: string; reason: string; request: string };

// "Your recommended team": one reason per agent, an on/off switch each, and
// the estimated weekly credits. Build creates the agents one by one.
export function TeamBuilder({ stacks, suggestions }: { stacks: TeamStack[]; suggestions: Suggestion[] }) {
  const router = useRouter();
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(stacks.flatMap((s) => s.agents.map((a) => [a.id, a.on]))),
  );
  const [built, setBuilt] = useState<BuiltAgent[] | null>(null);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designer, setDesigner] = useState<string | null>(null);

  const stackOn = (s: TeamStack) => s.agents.some((a) => on[a.id]);

  const credits = useMemo(
    () =>
      stacks.reduce(
        (sum, s) =>
          sum + (stackOn(s) ? s.main.credits : 0) + s.agents.reduce((a, row) => a + (on[row.id] ? row.credits : 0), 0),
        0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [on, stacks],
  );
  const count = stacks.reduce((n, s) => n + (stackOn(s) ? 1 : 0) + s.agents.filter((a) => on[a.id]).length, 0);

  function toggle(stack: TeamStack, row: TeamRow) {
    setOn((current) => {
      const next = { ...current, [row.id]: !current[row.id] };
      // Platform agents live under their parent: switching a parent off takes
      // its platforms along, switching a platform on brings the parent back.
      for (const child of stack.agents.filter((a) => a.parentId === row.id)) {
        if (!next[row.id]) next[child.id] = false;
      }
      if (next[row.id] && row.depth === 2 && row.parentId) next[row.parentId] = true;
      return next;
    });
  }

  async function build() {
    setBuilding(true);
    setError(null);
    try {
      const ids = stacks.flatMap((s) => [
        ...(stackOn(s) ? [s.main.id] : []),
        ...s.agents.filter((a) => on[a.id]).map((a) => a.id),
      ]);
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintIds: ids }),
      });
      const body = (await res.json().catch(() => ({}))) as { agents?: BuiltAgent[]; error?: string };
      if (!res.ok || !body.agents) throw new Error(body.error ?? "Couldn't build the team.");
      setBuilt(body.agents);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBuilding(false);
    }
  }

  if (built) {
    return <BuiltTeam agents={built} onDone={() => router.refresh()} />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-32">
      <div className="flex flex-col items-center text-center">
        <ObieOrb size={64} state={building ? "working" : "idle"} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Your recommended team</h1>
        <p className="mt-2 max-w-md text-muted">
          Based on your Business Profile. Switch agents on or off, then tap Build. You can change this anytime.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {stacks.map((stack) => (
          <section key={stack.stack} className="rounded-2xl border border-border bg-background">
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <AgentOrb name={stack.title} size={36} className={stackOn(stack) ? "" : "opacity-40"} />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold tracking-tight">{stack.title}</h2>
                <p className="truncate text-sm text-muted">{stack.main.reason}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted">
                {stack.agents.filter((a) => on[a.id]).length} of {stack.agents.length}
              </span>
            </header>
            <ul className="divide-y divide-border">
              {stack.agents.map((row) => (
                <li
                  key={row.id}
                  className={`flex items-center gap-3 px-4 py-3 ${row.depth === 2 ? "pl-10 sm:pl-14" : ""}`}
                >
                  <AgentOrb
                    name={row.role}
                    size={row.depth === 2 ? 26 : 30}
                    variant="sub"
                    className={on[row.id] ? "" : "opacity-40"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{row.role}</p>
                    <p className="text-sm text-muted">{row.reason}</p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-muted sm:inline">~{row.credits} cr/wk</span>
                  <Switch label={`${row.role} agent`} on={!!on[row.id]} onChange={() => toggle(stack, row)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {suggestions.map((s) =>
          designer === s.name ? null : (
            <div key={s.name} className="flex flex-wrap items-center gap-3 rounded-2xl bg-primary-soft px-4 py-3">
              <ObieOrb size={28} />
              <p className="min-w-0 flex-1 text-sm">
                <strong>OBIE suggests a {s.name} stack.</strong> {s.reason}
              </p>
              <button
                type="button"
                onClick={() => setDesigner(s.name)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Design it
              </button>
            </div>
          ),
        )}
        {designer ? (
          <CustomStackDesigner
            key={designer}
            initialRequest={suggestions.find((s) => s.name === designer)?.request ?? ""}
            onBuilt={(agents) => setBuilt(agents)}
            onCancel={() => setDesigner(null)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setDesigner("custom")}
            className="w-full rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted hover:text-foreground"
          >
            Need something else? Ask OBIE for a custom stack
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="text-sm">
            <p className="font-bold">
              {count} agents, about {credits.toLocaleString()} credits a week
            </p>
            <p className="text-muted">{error ?? "Estimates. You approve every plan before credits are spent."}</p>
          </div>
          <button
            type="button"
            onClick={build}
            disabled={building || count === 0}
            className="shrink-0 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            {building ? "Building..." : "Build"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}
    >
      <span
        className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

// The team arrives one agent at a time. Each name can be changed in place.
function BuiltTeam({ agents, onDone }: { agents: BuiltAgent[]; onDone: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-8 pb-16">
      <div className="flex flex-col items-center text-center">
        <ObieOrb size={64} float />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Meet your team</h1>
        <p className="mt-2 max-w-md text-muted">Tap a name to rename an agent.</p>
      </div>
      <ul className="mt-8 space-y-2">
        {agents.map((agent, i) => (
          <li
            key={agent.id}
            className="agent-arrive flex items-center gap-3 rounded-2xl bg-surface px-3 py-2"
            style={{
              animationDelay: `${Math.min(i * 140, 4000)}ms`,
              marginLeft: `${(agent.path.split(".").length - 1) * 1.25}rem`,
            }}
          >
            <AgentOrb name={agent.name} size={agent.level === "main" ? 36 : 28} variant={agent.level === "main" ? "main" : "sub"} />
            <RenameField agent={agent} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Go to my workspace
        </button>
      </div>
    </div>
  );
}

function RenameField({ agent }: { agent: BuiltAgent }) {
  const [name, setName] = useState(agent.name);
  const [saved, setSaved] = useState(agent.name);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    const next = name.trim();
    if (!next || next === saved) {
      setName(saved);
      return;
    }
    setStatus("Saving");
    const res = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: next }),
    });
    if (res.ok) {
      setSaved(next);
      setStatus("Saved");
    } else {
      setName(saved);
      setStatus("Couldn't rename");
    }
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        aria-label={`Rename ${saved}`}
        value={name}
        maxLength={40}
        onChange={(event) => setName(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className={`min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1.5 outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 ${
          agent.level === "main" ? "font-bold" : "font-medium"
        }`}
      />
      {status && <span className="shrink-0 text-xs text-muted">{status}</span>}
    </div>
  );
}
