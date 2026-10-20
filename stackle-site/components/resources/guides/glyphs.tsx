// A pixel "x" in the same bitmap style as <Pixel> (components/icons.tsx has no cross glyph).
// Used next to the word "Bad" / "Avoid" so the meaning never depends on the icon alone.

const CROSS = ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"];

export function PixelCross({ size = 12, className = "" }: { size?: number; className?: string }) {
  const cells: string[] = [];
  CROSS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === "#") cells.push(`M${x} ${y}h1v1h-1z`);
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${CROSS[0].length} ${CROSS.length}`}
      className={`inline-block shrink-0 ${className}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={cells.join("")} />
    </svg>
  );
}
