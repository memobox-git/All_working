import { Pixel, type PixelName } from "@/components/icons";

// The pipeline board under the hero: a cell grid with the five stages of a Stackle cohort lighting up
// in turn, little week markers in diagonal cells, and a rising field of pixels. Pure CSS animation.

type Node = { col: number; row: number; span?: number; label: string; icon: PixelName; mark?: string; hatch?: boolean };

const STAGES = 5;
const STEP = 1.4; // seconds each stage stays lit

function Board({ cols, rows, nodes, corner, wave, className = "" }: { cols: number; rows: number; nodes: Node[]; corner: string; wave: { from: number; to: number }; className?: string }) {
  const cw = 100 / cols;
  const rh = 100 / rows;
  // A dithered field of pixels that rises left to right: dense at the bottom, sparse at the top.
  const waveCols = Math.round((wave.to - wave.from) * 10);
  const rand = (x: number, k: number) => {
    const v = Math.sin(x * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const cells: { x: number; y: number; blink: boolean }[] = [];
  for (let x = 0; x < waveCols; x++) {
    const t = x / waveCols;
    const top = Math.max(1, Math.round(1 + t * 7 + rand(x, 99) * 3));
    for (let k = 0; k < top; k++) {
      const p = 0.95 - (k / top) * 0.75;
      if (rand(x, k) < p) cells.push({ x, y: 11.5 - k, blink: k === top - 1 && rand(x, k + 7) > 0.6 });
    }
  }
  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        aspectRatio: `${cols} / ${rows}`,
        backgroundImage: `linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line-soft) 1px, transparent 1px)`,
        backgroundSize: `${cw}% ${rh}%`,
      }}
      aria-hidden="true"
    >
      {/* week markers: a diagonal cell left of each node */}
      {nodes.map((n, i) =>
        n.mark ? (
          <div key={`m${i}`} className="absolute" style={{ left: `${(n.col - 2) * cw}%`, top: `${(n.row - 1) * rh}%`, width: `${cw}%`, height: `${rh}%` }}>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 10 10">
              <line x1="0" y1="10" x2="10" y2="0" stroke="var(--color-line)" strokeWidth="0.12" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="t-mono-sm absolute bottom-1.5 right-1.5 text-[10px] tracking-[0.02em] text-muted">{n.mark}</span>
          </div>
        ) : null,
      )}

      {/* stages */}
      {nodes.map((n, i) => (
        <div
          key={i}
          className={`hero-node absolute flex items-center gap-2.5 px-3 ${n.hatch ? "fill-hatch" : ""}`}
          style={{
            left: `${(n.col - 1) * cw}%`,
            top: `${(n.row - 1) * rh}%`,
            width: `${(n.span ?? 2) * cw}%`,
            height: `${rh}%`,
            animationDelay: `${i * STEP}s`,
            animationDuration: `${STAGES * STEP}s`,
          }}
        >
          <Pixel name={n.icon} size={16} />
          <span className="t-mono-sm whitespace-nowrap">{n.label}</span>
        </div>
      ))}

      {/* corner readout */}
      <div className="absolute right-0 top-0 flex h-[--h] items-center justify-end bg-paper px-3" style={{ width: `${3 * cw}%`, height: `${rh}%` }}>
        <span className="t-mono-sm whitespace-nowrap text-muted">{corner}</span>
      </div>

      {/* pixel field */}
      <svg
        className="absolute bottom-0"
        style={{ left: `${wave.from * cw}%`, width: `${(wave.to - wave.from) * cw}%`, height: `${rh * 1.25}%` }}
        viewBox={`0 0 ${waveCols} 12.5`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        {cells.map((c) => (
          <rect
            key={`${c.x}-${c.y}`}
            x={c.x + 0.15}
            y={c.y + 0.15}
            width={0.7}
            height={0.7}
            fill="var(--color-ink)"
            className={c.blink ? "px-blink" : undefined}
            style={c.blink ? { animationDelay: `${((c.x * 13) % 17) / 6}s` } : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

export function HeroGrid({ nextCohort }: { nextCohort: string }) {
  return (
    <div className="relative overflow-hidden">
      <style>{`
        .hero-node { animation-name: hero-node; animation-iteration-count: infinite; animation-timing-function: steps(1); }
        @keyframes hero-node {
          0% { background-color: var(--color-ink); background-image: none; color: var(--color-paper); }
          ${(100 / STAGES).toFixed(2)}% { background-color: transparent; color: var(--color-ink); }
        }
        .px-blink { animation: px-blink 2.6s steps(1) infinite; }
        @keyframes px-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .hero-node, .px-blink { animation: none !important; } }
      `}</style>
      <Board
        className="hidden md:block"
        cols={14}
        rows={4}
        corner={`Next cohort ${nextCohort}`}
        wave={{ from: 1, to: 11 }}
        nodes={[
          { col: 6, row: 1, label: "Learn live", icon: "play", mark: "WK 01", hatch: true },
          { col: 3, row: 2, label: "Build", icon: "code", mark: "WK 02" },
          { col: 10, row: 2, label: "Ship", icon: "check", mark: "WK 05" },
          { col: 7, row: 3, label: "Demo Day", icon: "chat", mark: "FINAL", span: 3, hatch: true },
          { col: 12, row: 4, label: "Interview", icon: "star", mark: "NEXT", span: 3 },
        ]}
      />
      <Board
        className="md:hidden"
        cols={6}
        rows={6}
        corner={nextCohort}
        wave={{ from: 0, to: 3 }}
        nodes={[
          { col: 3, row: 2, label: "Learn live", icon: "play", mark: "WK 01", span: 3, hatch: true },
          { col: 1, row: 3, label: "Build", icon: "code", span: 3 },
          { col: 5, row: 3, label: "Ship", icon: "check", span: 2, mark: "WK 05" },
          { col: 3, row: 4, label: "Demo Day", icon: "chat", span: 4, mark: "FINAL", hatch: true },
          { col: 4, row: 6, label: "Interview", icon: "star", span: 3, mark: "NEXT" },
        ]}
      />
    </div>
  );
}
