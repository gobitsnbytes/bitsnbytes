// Self-check for the lab kit's pure logic. Run: npx tsx components/lab/lab.check.ts
import assert from "node:assert/strict";
import { artConfig, djb2, mulberry32 } from "./art";
import { GLYPH_FONT, layoutGlyph, meshGlyph } from "./glyph-font";
import { labDate } from "./tokens";

// Meshing covers every lit pixel exactly once, for every glyph in the font.
for (const [char, bitmap] of Object.entries(GLYPH_FONT)) {
  const rows = bitmap.split(" ");
  const covered = new Map<string, number>();
  for (const [x, y, w, h] of meshGlyph(bitmap))
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) covered.set(`${x + i},${y + j}`, (covered.get(`${x + i},${y + j}`) ?? 0) + 1);
  assert.equal(rows.length, 7, char);
  rows.forEach((row) => assert.equal(row.length, 5, char));
  rows.forEach((row, y) =>
    [...row].forEach((px, x) => assert.equal(covered.get(`${x},${y}`) ?? 0, px === "#" ? 1 : 0, `${char} @${x},${y}`)),
  );
}

// Layout: letters 5 wide + 1 gap, spaces 3; blocks sorted bottom edge first.
const bnb = layoutGlyph("BNB");
assert.equal(bnb.cols, 17);
for (let i = 1; i < bnb.blocks.length; i++)
  assert.ok(bnb.blocks[i - 1][1] + bnb.blocks[i - 1][3] >= bnb.blocks[i][1] + bnb.blocks[i][3]);

// Seeded art is deterministic and overrides don't shift the other parameters.
assert.equal(djb2("bits&bytes"), djb2("bits&bytes"));
assert.equal(mulberry32(7)(), mulberry32(7)());
const a = artConfig("Hack4Good v0");
const b = artConfig("Hack4Good v0", undefined, { count: 12 });
assert.deepEqual({ ...a, count: 12 }, b);

assert.equal(labDate("2026-12-17"), "2026.12.17");
assert.equal(labDate(new Date(2026, 11, 17)), "2026.12.17");
console.log("lab.check ok");
