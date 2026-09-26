// Self-check for the logo cube plates. Run: npx tsx components/home/logo-cube/geometry.check.ts
import assert from "node:assert/strict";
import * as THREE from "three";
import { faceShapes, logoPlates, type FaceName } from "./geometry";

const FACES: FaceName[] = ["top", "left", "right"];
const area = (pts: THREE.Vector2[]) => Math.abs(THREE.ShapeUtils.area(pts));

for (const face of FACES) {
  const shapes = faceShapes(face);
  let expected = 0;
  let got = 0;
  for (const shape of shapes) {
    const { shape: contour, holes } = shape.extractPoints(1);
    expected += area(contour) - holes.reduce((s, h) => s + area(h), 0);
    const all = [...contour, ...holes.flat()];
    got += THREE.ShapeUtils.triangulateShape(contour, holes).reduce((s, [a, b, c]) => s + area([all[a], all[b], all[c]]), 0);
    // Every cut-out and counter lies strictly inside its face.
    const inner = shape === shapes[0] ? holes.flat() : contour;
    assert.ok(inner.every((p) => p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1), `${face}: art leaves the face`);
  }
  // Triangulation covers exactly the paper (no missing or doubled triangles around the letterforms).
  assert.ok(Math.abs(got - expected) < 1e-3, `${face}: triangulated ${got.toFixed(4)} ≠ ${expected.toFixed(4)}`);
}

// Mitred plates meet edge-to-edge: every plate reaches the front corner (1+d, 1+d, 1+d) and never beyond it.
const depth = 0.07;
const corner = new THREE.Vector3(1, 1, 1).multiplyScalar(1 + depth);
for (const [face, geo] of Object.entries(logoPlates(depth))) {
  geo.computeBoundingBox();
  assert.ok(geo.boundingBox!.max.distanceTo(corner) < 1e-5, `${face}: plate misses the front corner`);
}

console.log("logo cube geometry ok");
