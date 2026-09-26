/** Width / height of one grid cell (the gallery sizes rows from this). */
export const BENTO_CELL = 1.25;
/** Column count per breakpoint: base, md (768px), lg (1024px). */
export const BENTO_COLS = [2, 4, 6] as const;

/** Tile size in grid cells; `cost` = how bad this span is for the photo (0 = ideal). */
export type Span = { w: number; h: number; cost: number };
/** Tile position (0-based column / row) and size in grid cells. */
export type Cell = { x: number; y: number; w: number; h: number };

/** Every span a tile may take, so the packer can always close the last row. */
const ALL = [
  { w: 1, h: 1 },
  { w: 2, h: 1 },
  { w: 1, h: 2 },
  { w: 2, h: 2 },
];
/** Extra cost for a 2×2 on a non-feature photo, or for a feature photo that doesn't get its 2×2. */
const BIG = 0.25;

/**
 * Spans for a photo of aspect `ratio` (w / h) in a grid whose 1×1 cell is `cell` wide per unit high, cheapest first.
 * Cost is the squared log crop (a 4:3 photo in a 5:4 cell ≈ 0; a portrait in a wide tile ≫), so one bad crop
 * outweighs several small ones. A feature photo wants the big 2×2 tile.
 */
export function spansFor(ratio: number, cell: number, feature = false): Span[] {
  return ALL.map((s) => {
    const big = s.w * s.h === 4;
    const cost = Math.log(ratio / ((s.w / s.h) * cell)) ** 2 + (big === feature ? 0 : BIG);
    return { ...s, cost };
  }).sort((a, b) => a.cost - b.cost);
}

/**
 * Packs tiles into a `cols`-wide grid with no empty cell anywhere, last row included. The first empty cell
 * (row-major) always takes one of the next `window` unplaced tiles, in one of its spans; a tile can wait a step or
 * two when it doesn't fit, but never drifts more than `window - 1` places from its turn (reading order holds).
 * Depth-first branch and bound over those choices keeps the hole-free tiling with the lowest total crop cost found
 * within a small step budget once a first tiling exists (it runs on page load; more search barely helps), or a
 * large one while none does. Pure and deterministic (same input, same layout), so server and client agree.
 * Returns each tile's cell (same index as `options`), or null if none found.
 */
export function packBento(options: Span[][], cols: number, window = 3): Cell[] | null {
  const n = options.length;
  const rows = options.reduce((sum, spans) => sum + Math.max(...spans.map((s) => s.h)), 0);
  const grid = new Uint8Array(rows * cols);
  const used = new Uint8Array(n);
  const out = new Array<Cell>(n);
  const area = options.map((spans) => Math.max(...spans.map((s) => s.w * s.h)));
  const floor = options.map((spans) => Math.min(...spans.map((s) => s.cost)));
  // Most cells / least cost the unplaced tiles could still add (pruning bounds).
  let reach = area.reduce((sum, a) => sum + a, 0);
  let rest = floor.reduce((sum, c) => sum + c, 0);
  let best: Cell[] | null = null;
  let bestCost = Infinity;
  // Steps left to improve on the first tiling; the search for a first one may go 200k steps past zero.
  let budget = 4_000;

  const fits = (x: number, y: number, s: Span) => {
    if (x + s.w > cols) return false;
    for (let dy = 0; dy < s.h; dy++) for (let dx = 0; dx < s.w; dx++) if (grid[(y + dy) * cols + x + dx]) return false;
    return true;
  };
  const paint = (x: number, y: number, s: Span, v: 0 | 1) => {
    for (let dy = 0; dy < s.h; dy++) for (let dx = 0; dx < s.w; dx++) grid[(y + dy) * cols + x + dx] = v;
  };

  const place = (placed: number, first: number, bottom: number, filled: number, cost: number) => {
    // Complete: every tile placed and nothing open above the lowest tile edge.
    if (placed === n) {
      if (first >= bottom * cols && cost < bestCost) {
        bestCost = cost;
        best = out.map((c) => ({ ...c }));
      }
      return;
    }
    if ((--budget < 0 && (best || budget < -200_000)) || cost + rest >= bestCost || bottom * cols - filled > reach) return;
    const x = first % cols;
    const y = Math.floor(first / cols);
    // Candidates: the next `window` unplaced tiles; a tile already `window - 1` places late must go now.
    let late = 0;
    while (used[late]) late++;
    const next: number[] = [];
    if (placed - late >= window - 1) next.push(late);
    else for (let i = late; i < n && next.length < window; i++) if (!used[i]) next.push(i);
    // Cheapest choices first, so the first complete tiling is already good and the bound bites early.
    const choices = next
      .flatMap((i, rank) => options[i].map((s) => ({ i, s, key: s.cost + rank * 0.01 })))
      .sort((a, b) => a.key - b.key);
    for (const { i, s } of choices) {
      if (!fits(x, y, s)) continue;
      paint(x, y, s, 1);
      used[i] = 1;
      reach -= area[i];
      rest -= floor[i];
      out[i] = { x, y, w: s.w, h: s.h };
      let open = first;
      while (open < grid.length && grid[open]) open++;
      place(placed + 1, open, Math.max(bottom, y + s.h), filled + s.w * s.h, cost + s.cost);
      rest += floor[i];
      reach += area[i];
      used[i] = 0;
      paint(x, y, s, 0);
    }
  };

  place(0, 0, 0, 0, 0);
  return best;
}

/** Round-robin across groups (a, b, c, a, b, c, …): mixes events without shuffling (no Math.random). */
export function interleave<T>(groups: T[][]): T[] {
  const longest = Math.max(0, ...groups.map((g) => g.length));
  return Array.from({ length: longest }, (_, i) => groups.flatMap((g) => (i < g.length ? [g[i]] : []))).flat();
}

/** True when `cells` cover a `cols`-wide rectangle exactly once each (no holes, no overlaps). */
export function isHoleFree(cells: Cell[], cols: number) {
  const rows = Math.max(0, ...cells.map((c) => c.y + c.h));
  const hits = new Uint8Array(rows * cols);
  for (const c of cells) {
    if (c.x < 0 || c.x + c.w > cols) return false;
    for (let dy = 0; dy < c.h; dy++) for (let dx = 0; dx < c.w; dx++) hits[(c.y + dy) * cols + c.x + dx]++;
  }
  return hits.every((v) => v === 1);
}
