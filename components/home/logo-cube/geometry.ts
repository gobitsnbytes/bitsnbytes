import * as THREE from "three";

/*
 * The cube mark (public/logo.svg) as three face plates of a real cube.
 *
 * The mark is a white isometric hexagon masked by four black cut-outs, so each of its three visible faces is an affine
 * image of a square. Per face: map the cut-outs back into the unit square, punch them out of a thin extruded plate,
 * then place the plate on the cube face. Seen down the cube diagonal the three plates reproduce the logo.
 *
 * Coordinates are logo.svg viewBox units (y down), rounded to 0.01. The two "B"s are single keyhole paths in the SVG
 * whose bridges overlap by ~0.2 units, which earcut can't triangulate cleanly; here each B is the same points split
 * into its outline (a hole) plus its two counters (plate islands), minus one 0.3-unit degenerate curve tail.
 * Check: npx tsx components/home/logo-cube/geometry.check.ts
 */

type P = readonly [number, number];

// Hexagon: top, right-top, right-bottom, bottom, left-bottom, left-top.
const HEX: readonly P[] = [
  [101.28, 64.29],
  [158.17, 97.1],
  [158.17, 161.59],
  [101.47, 194.02],
  [44.57, 161.59],
  [44.76, 96.53],
];

const ROOF: P[] = [
  [136.39, 98.97],
  [143.36, 94.95],
  [101.38, 70.41],
  [61.82, 93.61],
  [69.87, 98.03],
  [101.65, 80.2],
];
const STAR: P[] = [
  [104.33, 95.62],
  [110.64, 97.76],
  [104.47, 100.71],
  [101.92, 106.48],
  [99.37, 100.71],
  [92.8, 97.76],
  [99.24, 95.22],
  [101.65, 89.72],
];

const LEFT_B: P[] = [
  [49.03, 107.06],
  [49.03, 158.65],
  [95.11, 184.34],
  [95.11, 164.05],
  [87.43, 159.69],
  [87.43, 149.83],
  [95.02, 153.91],
  [95.11, 132.09],
];
const LEFT_B_COUNTERS: P[][] = [
  [
    [87.62, 170.69],
    [56.61, 154],
    [56.52, 142.53],
    [87.62, 159.69],
  ],
  [
    [87.43, 149.54],
    [56.61, 133.04],
    [56.61, 120.53],
    [87.62, 137.41],
  ],
];

const RIGHT_B: P[] = [
  [104.78, 133.61],
  [150.4, 108.2],
  [150.87, 129.25],
  [142.81, 133.52],
  [142.62, 143.47],
  [150.3, 139.21],
  [150.49, 159.12],
  [104.88, 185.96],
];
const RIGHT_B_COUNTERS: P[][] = [
  [
    [142.81, 121.95],
    [112.18, 138.83],
    [112.18, 150.59],
    [142.81, 133.34],
  ],
  [
    [142.62, 143.44],
    [112.09, 160.07],
    [111.71, 173.25],
    [142.62, 156.18],
  ],
];

const [T, RT, RB, B, LB, LT] = HEX;
const fourth = (o: P, a: P, b: P): P => [a[0] + b[0] - o[0], a[1] + b[1] - o[1]];
// Inner (front) vertex: the fourth corner of each face parallelogram, averaged over the three faces.
const INNER: P = [fourth(T, RT, LT), fourth(LB, LT, B), fourth(RB, RT, B)]
  .reduce<[number, number]>((s, p) => [s[0] + p[0] / 3, s[1] + p[1] / 3], [0, 0]);

export type FaceName = "top" | "left" | "right";

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/*
 * Cube of half-size 1 viewed down its (1,1,1) diagonal: the inner vertex is (1,1,1), the hexagon's top is (-1,1,-1),
 * right-top (1,1,-1), left-top (-1,1,1), bottom (1,-1,1). Each face runs from the inner vertex along two edges
 * (e1, e2 in the SVG; a, b on the cube) with a × b along the outward normal n.
 */
const FACES: Record<FaceName, { e: [P, P]; a: THREE.Vector3; b: THREE.Vector3; n: THREE.Vector3; cuts: P[][]; islands: P[][] }> = {
  top: { e: [RT, LT], a: v3(0, 0, -2), b: v3(-2, 0, 0), n: v3(0, 1, 0), cuts: [ROOF, STAR], islands: [] },
  left: { e: [LT, B], a: v3(-2, 0, 0), b: v3(0, -2, 0), n: v3(0, 0, 1), cuts: [LEFT_B], islands: LEFT_B_COUNTERS },
  right: { e: [B, RT], a: v3(0, -2, 0), b: v3(0, 0, -2), n: v3(1, 0, 0), cuts: [RIGHT_B], islands: RIGHT_B_COUNTERS },
};

/** The face's plate in unit-square face space: the square with its cut-outs as holes, plus any counter islands. */
export function faceShapes(face: FaceName): THREE.Shape[] {
  const { e, cuts, islands } = FACES[face];
  const [ax, ay] = [e[0][0] - INNER[0], e[0][1] - INNER[1]];
  const [bx, by] = [e[1][0] - INNER[0], e[1][1] - INNER[1]];
  const det = ax * by - ay * bx;
  const toFace = (pts: P[]) =>
    pts.map(([x, y]) => {
      const qx = x - INNER[0];
      const qy = y - INNER[1];
      return new THREE.Vector2((qx * by - qy * bx) / det, (ax * qy - ay * qx) / det);
    });
  const plate = new THREE.Shape([
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 1),
    new THREE.Vector2(0, 1),
  ]);
  plate.holes = cuts.map((c) => new THREE.Path(toFace(c)));
  return [plate, ...islands.map((c) => new THREE.Shape(toFace(c)))];
}

/**
 * One plate per face, `depth` thick, sitting on the face of a half-size-1 cube and extruding outward.
 * The outer rim is mitred 45° so neighbouring plates meet in a clean hexagon silhouette.
 * Groups: 0 = paper caps, 1 = cut walls and mitres.
 */
export function logoPlates(depth: number): Record<FaceName, THREE.BufferGeometry> {
  const build = (face: FaceName) => {
    const { a, b, n } = FACES[face];
    const geo = new THREE.ExtrudeGeometry(faceShapes(face), { depth, bevelEnabled: false });
    const pos = geo.attributes.position;
    const grow = depth / 2; // the unit square spans 2 cube units
    const rim = (t: number) => (t < 1e-6 ? -grow : t > 1 - 1e-6 ? 1 + grow : t);
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) > depth / 2) pos.setXY(i, rim(pos.getX(i)), rim(pos.getY(i)));
    }
    return geo.applyMatrix4(new THREE.Matrix4().makeBasis(a, b, n).setPosition(1, 1, 1));
  };
  return { top: build("top"), left: build("left"), right: build("right") };
}
