/**
 * Our 5×7 bitmap font for PixelGlyph (A–Z, 0–9, &, -, .) and the block layout. Pure, no DOM.
 */
export const GLYPH_ROWS = 7;

// 5×7, rows top → bottom, '#' = on.
export const GLYPH_FONT: Record<string, string> = {
  A: ".###. #...# #...# ##### #...# #...# #...#",
  B: "####. #...# #...# ####. #...# #...# ####.",
  C: ".#### #.... #.... #.... #.... #.... .####",
  D: "####. #...# #...# #...# #...# #...# ####.",
  E: "##### #.... #.... ####. #.... #.... #####",
  F: "##### #.... #.... ####. #.... #.... #....",
  G: ".#### #.... #.... #.### #...# #...# .####",
  H: "#...# #...# #...# ##### #...# #...# #...#",
  I: "##### ..#.. ..#.. ..#.. ..#.. ..#.. #####",
  J: "..### ....# ....# ....# ....# #...# .###.",
  K: "#...# #..#. #.#.. ##... #.#.. #..#. #...#",
  L: "#.... #.... #.... #.... #.... #.... #####",
  M: "#...# ##.## #.#.# #.#.# #...# #...# #...#",
  N: "#...# ##..# #.#.# #..## #...# #...# #...#",
  O: ".###. #...# #...# #...# #...# #...# .###.",
  P: "####. #...# #...# ####. #.... #.... #....",
  Q: ".###. #...# #...# #...# #.#.# #..#. .##.#",
  R: "####. #...# #...# ####. #.#.. #..#. #...#",
  S: ".#### #.... #.... .###. ....# ....# ####.",
  T: "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
  U: "#...# #...# #...# #...# #...# #...# .###.",
  V: "#...# #...# #...# #...# #...# .#.#. ..#..",
  W: "#...# #...# #...# #.#.# #.#.# ##.## #...#",
  X: "#...# #...# .#.#. ..#.. .#.#. #...# #...#",
  Y: "#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..",
  Z: "##### ....# ...#. ..#.. .#... #.... #####",
  "0": ".###. #...# #..## #.#.# ##..# #...# .###.",
  "1": "..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.",
  "2": ".###. #...# ....# ...#. ..#.. .#... #####",
  "3": "####. ....# ....# .###. ....# ....# ####.",
  "4": "...#. ..##. .#.#. #..#. ##### ...#. ...#.",
  "5": "##### #.... ####. ....# ....# #...# .###.",
  "6": ".###. #.... #.... ####. #...# #...# .###.",
  "7": "##### ....# ...#. ..#.. ..#.. ..#.. ..#..",
  "8": ".###. #...# #...# .###. #...# #...# .###.",
  "9": ".###. #...# #...# .#### ....# ....# .###.",
  "&": ".##.. #..#. #.#.. .#... #.#.# #..#. .##.#",
  "-": "..... ..... ..... .###. ..... ..... .....",
  ".": "..... ..... ..... ..... ..... ..... .#...",
};

export type Block = [x: number, y: number, w: number, h: number];

/** Vertical-first greedy meshing of one bitmap into non-overlapping blocks (grid units). */
export function meshGlyph(bitmap: string): Block[] {
  const rows = bitmap.split(" ");
  const width = rows[0].length;
  const on = (x: number, y: number) => rows[y]?.[x] === "#";
  const used = new Set<number>();
  const free = (x: number, y: number) => on(x, y) && !used.has(y * width + x);
  const blocks: Block[] = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < rows.length; y++) {
      if (!free(x, y)) continue;
      let h = 1;
      while (free(x, y + h)) h++;
      let w = 1;
      while (Array.from({ length: h }, (_, i) => free(x + w, y + i)).every(Boolean)) w++;
      for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) used.add((y + j) * width + x + i);
      blocks.push([x, y, w, h]);
    }
  }
  return blocks;
}

/** Lays out `text` (A–Z, 0–9, &, -, . and spaces; anything else becomes a space). */
export function layoutGlyph(text: string) {
  const blocks: Block[] = [];
  let cursor = 0;
  for (const char of text.toUpperCase()) {
    const bitmap = GLYPH_FONT[char];
    if (!bitmap) {
      cursor += 3;
      continue;
    }
    for (const [x, y, w, h] of meshGlyph(bitmap)) blocks.push([cursor + x, y, w, h]);
    cursor += 6;
  }
  const cols = Math.max(1, cursor - 1);
  // Bottom edge first, then left to right: the build stacks upward like Tetris.
  blocks.sort((a, b) => b[1] + b[3] - (a[1] + a[3]) || a[0] - b[0]);
  return { blocks, cols };
}
