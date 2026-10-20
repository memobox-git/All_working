// Pixel glyphs drawn from tiny bitmaps ("#" = filled cell), plus a few thin line icons.
// Every icon inherits currentColor, so it works on paper and on night.

const BITMAPS = {
  // The Stackle mark: three slabs stacked into a rising staircase.
  logo: ["......####", "......####", "..........", "...#######", "...#######", "..........", "##########", "##########"],
  spark: ["#...#...#", ".#..#..#.", "..#.#.#..", "...###...", "#########", "...###...", "..#.#.#..", ".#..#..#.", "#...#...#"],
  check: [".......##", "......##.", "##...##..", ".##.##...", "..###....", "...#....."],
  plus: ["...#...", "...#...", "...#...", "#######", "...#...", "...#...", "...#..."],
  minus: ["#######"],
  play: ["#.....", "###...", "#####.", "######", "#####.", "###...", "#....."],
  db: [".#####.", "#.....#", ".#####.", "#.....#", ".#####.", "#.....#", ".#####."],
  code: ["..#...#..", ".#.....#.", "#...#...#", "#..#....#", ".#.....#.", "..#...#.."],
  chat: ["#########", "#.......#", "#.##.##.#", "#.......#", "#########", "##.......", "#........"],
  doc: ["#####..", "#...##.", "#....##", "#.###.#", "#.....#", "#.###.#", "#.....#", "#######"],
  flow: ["###......", "#.#......", "###......", ".#.......", ".####..##", "....#..##", "....###..", "......#..", ".....###."],
  user: ["..###..", ".#####.", ".#####.", "..###..", ".......", ".#####.", "#######", "#######"],
  target: ["..#####..", ".#.....#.", "#..###..#", "#..#.#..#", "#..###..#", ".#.....#.", "..#####.."],
  calendar: ["#.#...#.#", "#########", "#.......#", "#.#.#.#.#", "#.......#", "#.#.#.#.#", "#########"],
  bolt: ["....##", "...##.", "..##..", ".#####", "...##.", "..##..", ".##...", "##...."],
  lock: ["..###..", ".#...#.", ".#...#.", "#######", "#.....#", "#..#..#", "#.....#", "#######"],
  quote: ["##.##", "##.##", ".#..#", "#..#."],
  grid: ["###.###", "###.###", "###.###", ".......", "###.###", "###.###", "###.###"],
  star: ["....#....", "....#....", "...###...", "#########", ".#######.", "..#####..", ".##...##.", "##.....##"],
} as const;

export type PixelName = keyof typeof BITMAPS;

export function Pixel({ name, size = 16, className = "", title }: { name: PixelName; size?: number; className?: string; title?: string }) {
  const rows = BITMAPS[name];
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const cells: string[] = [];
  rows.forEach((r, y) => {
    let x = 0;
    while (x < r.length) {
      if (r[x] === "#") {
        let run = 1;
        while (r[x + run] === "#") run++;
        cells.push(`M${x} ${y}h${run}v1h-${run}z`);
        x += run;
      } else x++;
    }
  });
  const scale = size / Math.max(w, h);
  return (
    <svg
      width={Math.round(w * scale)}
      height={Math.round(h * scale)}
      viewBox={`0 0 ${w} ${h}`}
      className={`inline-block shrink-0 ${className}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={cells.join("")} />
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
