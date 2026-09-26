/**
 * Seeded generative print art for FigWindow / RouterFigure (Canvas 2D, no deps).
 *
 * seed string → djb2 hash → mulberry32 PRNG → ArtParams (preset + jittered parameters). The same
 * seed always draws the same figure. drawArt() paints one frame at time `t` (seconds) in CSS px
 * (the caller sets the dpr transform). Our own presets, printed in brand inks:
 *   orbits        cream-filled ellipses on a Lissajous path, ink hairlines, burgundy / orange accents
 *   contours      ridgeline "topography": occluding cream bands, an orange sun, one burgundy line
 *   dither-noise  two riso plates: an orange halftone dot plate under an ink Bayer-dither plate
 *   grid-warp     an ink grid bent by a wandering lens, burgundy guide lines, orange focus disc
 */

export type ArtPreset = "orbits" | "contours" | "dither-noise" | "grid-warp";
export const ART_PRESETS: readonly ArtPreset[] = ["orbits", "contours", "dither-noise", "grid-warp"];

export type ArtParams = {
  preset: ArtPreset;
  /** Shapes / lines / resolution, depending on the preset. */
  count: number;
  /** Wobble amount (≈0.4–5). */
  noise: number;
  /** Size multiplier (≈0.9–1.3). */
  scale: number;
  speed: number;
  fa: number;
  fb: number;
  twist: number;
  lump: number;
  ph: readonly [number, number, number, number];
  accent: number;
  /** Start time, so static frames differ per seed. */
  t0: number;
};

export type ArtOverrides = Partial<Pick<ArtParams, "count" | "noise" | "scale">>;

const TAU = Math.PI * 2;
const INK = "#120f0a";
const CREAM = "#fee9cf";
const BURGUNDY = "#97192c";
const ORANGE = "#fc920d";

export function djb2(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) hash = (Math.imul(hash, 33) + input.charCodeAt(i)) | 0;
  return hash >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic parameters for `seed`. The PRNG is always drawn in the same order, so overrides never shift the rest. */
export function artConfig(seed: string, preset?: ArtPreset, overrides: ArtOverrides = {}): ArtParams {
  const r = mulberry32(djb2(seed));
  const range = (min: number, max: number) => min + r() * (max - min);
  const picked = ART_PRESETS[Math.floor(r() * ART_PRESETS.length)];
  const base = {
    count: Math.round(range(40, 120)),
    noise: range(0.4, 2.4),
    scale: range(0.9, 1.2),
    speed: range(0.6, 1.4),
    fa: 1 + Math.floor(r() * 4),
    fb: 1 + Math.floor(r() * 5),
    twist: range(0.5, 3),
    lump: range(0.2, 0.8),
    ph: [r() * TAU, r() * TAU, r() * TAU, r() * TAU] as const,
    accent: r(),
    t0: r() * 60,
  };
  return { ...base, ...overrides, preset: preset ?? picked };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Smooth seeded field on normalised coords, roughly -1..1. */
function wave(x: number, y: number, t: number, p: ArtParams) {
  return (
    (Math.sin(x * 3.1 * p.fa + t * 0.9 + p.ph[0]) +
      Math.sin(y * 2.3 * p.fb - t * 0.7 + p.ph[1]) +
      0.5 * Math.sin((x + y) * 4.7 + t * 1.3 + p.ph[2]) +
      0.8 * Math.sin(Math.hypot(x - 0.5, y - 0.5) * 9 - t * 1.1 + p.ph[3])) /
    3.3
  );
}

// Faint halftone paper: a 6px dot tile, cached per context.
const dotTiles = new WeakMap<CanvasRenderingContext2D, CanvasPattern | null>();
function paper(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  if (!dotTiles.has(ctx)) {
    const tile = document.createElement("canvas");
    tile.width = tile.height = 6;
    const tctx = tile.getContext("2d");
    if (tctx) {
      tctx.fillStyle = "rgba(18,15,10,0.18)";
      tctx.fillRect(0, 0, 1, 1);
      tctx.fillRect(3, 3, 1, 1);
    }
    dotTiles.set(ctx, tctx ? ctx.createPattern(tile, "repeat") : null);
  }
  const tile = dotTiles.get(ctx);
  if (tile) {
    ctx.fillStyle = tile;
    ctx.fillRect(0, 0, w, h);
  }
}

function orbits(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: ArtParams) {
  const n = clamp(Math.round(p.count), 12, 180);
  const m = Math.min(w, h);
  const ax = w * 0.34 * p.scale;
  const ay = h * 0.3 * p.scale;
  const amp = 0.08 + Math.min(p.noise, 5) * 0.05;
  const hot = Math.floor(p.accent * n);
  ctx.lineWidth = 0.75;
  for (let i = 0; i < n; i++) {
    const th = (i / n) * TAU;
    const nz = Math.sin(th * 3 + t * 0.7 + p.ph[0]) + 0.5 * Math.sin(th * 7 - t * 1.3 + p.ph[1]);
    const x = w / 2 + Math.cos(th * p.fa + t * 0.15) * ax * (1 + amp * nz);
    const y = h / 2 + Math.sin(th * p.fb + t * 0.2 + p.ph[2]) * ay * (1 + amp * nz);
    const r = m * p.scale * (0.06 + 0.05 * p.lump * (1 + Math.sin(t + th / (Math.PI * 0.5 * p.fa))));
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.42, th * p.twist + t * 0.3, 0, TAU);
    ctx.fillStyle = i === hot ? ORANGE : CREAM;
    ctx.fill();
    ctx.strokeStyle = i % 9 === 0 ? BURGUNDY : INK;
    ctx.stroke();
  }
}

function contours(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: ArtParams) {
  const lines = clamp(Math.round(p.count / 3), 12, 44);
  const top = h * 0.3;
  const step = (h * 0.95 - top) / lines;
  const amp = step * (4 + Math.min(p.noise, 5) * 1.4) * p.scale;
  const segs = Math.max(24, Math.round(w / 4));
  const hot = Math.floor(p.accent * lines);

  // Sun behind the first ridges (the bands occlude its lower half).
  ctx.fillStyle = ORANGE;
  ctx.beginPath();
  ctx.arc(w * (0.3 + p.accent * 0.4), top, Math.min(w, h) * 0.16 * p.scale, 0, TAU);
  ctx.fill();

  ctx.lineWidth = 0.75;
  for (let k = 0; k < lines; k++) {
    const y0 = top + k * step;
    const ridge = new Path2D();
    for (let j = 0; j <= segs; j++) {
      const u = j / segs;
      const envelope = Math.exp(-((u - 0.5) ** 2) / (0.03 * p.scale));
      const y = y0 - envelope * amp * Math.max(0, 0.35 + 0.75 * wave(u * 2.2, k / lines, t * 0.5, p));
      if (j === 0) ridge.moveTo(0, y);
      else ridge.lineTo(u * w, y);
    }
    const band = new Path2D(ridge);
    band.lineTo(w, h);
    band.lineTo(0, h);
    band.closePath();
    ctx.fillStyle = CREAM;
    ctx.fill(band);
    ctx.lineWidth = k === hot ? 1.5 : 0.75;
    ctx.strokeStyle = k === hot ? BURGUNDY : INK;
    ctx.stroke(ridge);
  }
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function dither(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: ArtParams) {
  const cols = clamp(Math.round(p.count * 0.8), 24, 110);
  const cell = w / cols;
  const rows = Math.ceil(h / cell);
  const gain = 0.45 + Math.min(p.noise, 5) * 0.08;

  // Orange halftone plate, 3 cells per dot, slightly off-register.
  ctx.fillStyle = ORANGE;
  ctx.beginPath();
  const dot = cell * 3;
  for (let y = 0; y < rows / 3 + 1; y++) {
    for (let x = 0; x < cols / 3 + 1; x++) {
      const v = wave((x * 3) / cols + 0.21, (y * 3) / rows - 0.13, t * 0.8 + 2, p);
      const r = dot * 0.55 * clamp(v * 1.4, 0, 1) * p.scale;
      if (r < 0.4) continue;
      const cx = x * dot + dot / 2 + cell * 0.6;
      const cy = y * dot + dot / 2 + cell * 0.4;
      ctx.moveTo(cx + r, cy);
      ctx.arc(cx, cy, r, 0, TAU);
    }
  }
  ctx.fill();

  // Ink Bayer plate.
  ctx.fillStyle = INK;
  ctx.beginPath();
  const size = cell * 0.86;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = 0.5 + gain * wave(x / cols, y / rows, t * 0.6, p);
      if (v > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16) ctx.rect(x * cell, y * cell, size, size);
    }
  }
  ctx.fill();

  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    w * (0.5 + 0.3 * Math.sin(t * 0.3 * p.fa + p.ph[0])),
    h * (0.5 + 0.3 * Math.cos(t * 0.27 * p.fb + p.ph[1])),
    Math.min(w, h) * 0.18 * p.scale,
    0,
    TAU,
  );
  ctx.stroke();
}

function gridWarp(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: ArtParams) {
  const n = clamp(Math.round(p.count / 5), 8, 28);
  const lx = w * (0.5 + 0.3 * Math.sin(t * 0.4 * p.fa + p.ph[0]));
  const ly = h * (0.5 + 0.3 * Math.cos(t * 0.33 * p.fb + p.ph[1]));
  const radius = Math.min(w, h) * 0.35 * p.scale;
  const strength = 0.7 + Math.min(p.noise, 5) * 0.12;
  const warp = (x: number, y: number): [number, number] => {
    const dx = x - lx;
    const dy = y - ly;
    const f = strength * Math.exp(-(dx * dx + dy * dy) / (radius * radius));
    return [
      x + dx * f + Math.sin((y / h) * 6 + t + p.ph[2]) * p.noise * 1.5,
      y + dy * f + Math.cos((x / w) * 5 - t * 0.8 + p.ph[3]) * p.noise * 1.5,
    ];
  };
  const hotRow = Math.floor(p.accent * n);
  const hotCol = n - 1 - hotRow;
  const segs = 32;
  const line = (horizontal: boolean, i: number) => {
    ctx.beginPath();
    for (let j = 0; j <= segs; j++) {
      const a = (i / n) * (horizontal ? h : w);
      const b = (j / segs) * (horizontal ? w : h);
      const [x, y] = horizontal ? warp(b, a) : warp(a, b);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const hot = horizontal ? i === hotRow : i === hotCol;
    ctx.strokeStyle = hot ? BURGUNDY : INK;
    ctx.lineWidth = hot ? 1.5 : 0.75;
    ctx.stroke();
  };
  for (let i = 0; i <= n; i++) {
    line(true, i);
    line(false, i);
  }
  ctx.beginPath();
  ctx.arc(lx, ly, radius * 0.2, 0, TAU);
  ctx.fillStyle = ORANGE;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.75;
  ctx.stroke();
}

/** Paints one frame. `t` is seconds (already scaled by speed / press-and-hold). */
export function drawArt(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: ArtParams) {
  paper(ctx, w, h);
  if (p.preset === "orbits") orbits(ctx, w, h, t, p);
  else if (p.preset === "contours") contours(ctx, w, h, t, p);
  else if (p.preset === "dither-noise") dither(ctx, w, h, t, p);
  else gridWarp(ctx, w, h, t, p);
}
