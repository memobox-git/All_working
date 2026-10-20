import type { ReactNode } from "react";

// Isometric line drawings, built from boxes in a simple 3D grid (x right-back, y left-back, z up).
// Faces are drawn back to front with the shared palette, so every illustration matches.

export type IsoBox = {
  x: number;
  y: number;
  z?: number;
  w: number; // along x
  d: number; // along y
  h: number; // height
  tone?: "white" | "ink" | "ghost" | "hatch" | "fill";
  label?: string; // drawn on the top face
};

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * C, (x + y) * S - z];
const pts = (p: [number, number][]) => p.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(" ");

const TONES = {
  white: { top: "#ffffff", left: "#ededE8", right: "#dcdcd5", stroke: "#111110" },
  fill: { top: "#eaeae5", left: "#dcdcd5", right: "#cfcfc7", stroke: "#111110" },
  ink: { top: "#2c2c29", left: "#111110", right: "#000000", stroke: "#111110" },
  hatch: { top: "url(#iso-hatch)", left: "#ededE8", right: "#dcdcd5", stroke: "#111110" },
  ghost: { top: "none", left: "none", right: "none", stroke: "#8f8f87" },
} as const;

export function Box({ b, strokeWidth = 1 }: { b: IsoBox; strokeWidth?: number }) {
  const { x, y, w, d, h } = b;
  const z = b.z ?? 0;
  const t = TONES[b.tone ?? "white"];
  const dash = b.tone === "ghost" ? "3 3" : undefined;
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const left = [iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const right = [iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)];
  const common = { stroke: t.stroke, strokeWidth, strokeLinejoin: "round" as const, strokeDasharray: dash, vectorEffect: "non-scaling-stroke" as const };
  return (
    <g>
      <polygon points={pts(left)} fill={t.left} {...common} />
      <polygon points={pts(right)} fill={t.right} {...common} />
      <polygon points={pts(top)} fill={t.top} {...common} />
    </g>
  );
}

// An isometric scene: pass boxes (any order) plus extra SVG children positioned with iso().
export function IsoScene({
  boxes,
  children,
  pad = 24,
  className = "",
  title,
}: {
  boxes: IsoBox[];
  children?: ReactNode;
  pad?: number;
  className?: string;
  title?: string;
}) {
  const sorted = [...boxes].sort((a, b) => a.x + a.y + (a.z ?? 0) - (b.x + b.y + (b.z ?? 0)));
  const corners = boxes.flatMap((b) => {
    const z = b.z ?? 0;
    return [iso(b.x, b.y, z + b.h), iso(b.x + b.w, b.y, z), iso(b.x, b.y + b.d, z), iso(b.x + b.w, b.y + b.d, z), iso(b.x + b.w, b.y, z + b.h), iso(b.x, b.y + b.d, z + b.h)];
  });
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  return (
    <svg viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <pattern id="iso-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="#ffffff" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="#b9b9b0" strokeWidth="1" />
        </pattern>
      </defs>
      {sorted.map((b, i) => (
        <Box key={i} b={b} />
      ))}
      {children}
    </svg>
  );
}

// A text label placed in the scene at a 3D point.
export function IsoLabel({ at, children, anchor = "middle", dark = false }: { at: [number, number, number]; children: string; anchor?: "start" | "middle" | "end"; dark?: boolean }) {
  const [x, y] = iso(at[0], at[1], at[2]);
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily="var(--font-geist-mono), monospace" fontSize="10" letterSpacing="0.6" fill={dark ? "#f4f4f1" : "#66665f"}>
      {children.toUpperCase()}
    </text>
  );
}

// A dashed connector between two 3D points.
export function IsoLine({ from, to, dashed = true }: { from: [number, number, number]; to: [number, number, number]; dashed?: boolean }) {
  const a = iso(...from);
  const b = iso(...to);
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#111110" strokeWidth="1" strokeDasharray={dashed ? "3 3" : undefined} vectorEffect="non-scaling-stroke" />;
}

// A point just above a box's highest corner, for a label that never overlaps the box.
export function above(b: IsoBox, gap = 10): [number, number, number] {
  const top = (b.z ?? 0) + b.h;
  return [b.x + b.w / 2, b.y + b.d / 2, top + ((b.w + b.d) / 2) * S + gap];
}
