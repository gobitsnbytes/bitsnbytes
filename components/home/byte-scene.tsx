"use client";

/*
 * ByteScene — buttermax.net's hero object, rebuilt as a bits&bytes™ byte.
 *
 * Reference moves (tmp/research-full.json → buttermax):
 *  - "Hero object that outruns the scroll": the hero's ScrollTrigger writes 0→1 progress into `progress`; here it
 *    lifts the byte ~1.1 hero-heights extra (≈2× page speed), pitches it, drifts the bits apart and scales to .9,
 *    so it has left the viewport by ~40% of the first screen while the wordmark scrolls 1:1.
 *  - "Timed object swap": every 8s the eight bits burst out along their diagonals, the cluster turns 90° and
 *    reassembles (their noise-dissolve slideshow, done as a print gesture). The B sits on both ±Z faces, so one
 *    side always carries it after a turn.
 *  - Idle: slow spin, bob, and a damped pointer tilt.
 *
 * Print look: orthographic true-isometric camera (matches the isometric cube mark), flat unlit colours
 * (burgundy / burgundy-dk / cream / ink), drei <Edges> key lines in ink, no lights, no env maps, no post.
 * ~130 triangles. The only texture is the "B", drawn at runtime on a 2D canvas in Archivo 900 (wide).
 *
 * Loaded only through next/dynamic({ ssr: false }) from hero.tsx after requestIdleCallback, so three/R3F/drei
 * stay off the LCP path. frameloop goes to "never" once the hero is mostly scrolled past or the tab is hidden.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { cn } from "@/lib/utils";

export type ByteSceneProps = {
  /** 0→1 scroll progress over the hero, written by the hero's ScrollTrigger. */
  progress: { current: number };
  /** Element whose box the byte centres on (the hero's empty middle slot). */
  anchor: { current: HTMLElement | null };
};

const INK = "#120f0a";
const CREAM = "#fee9cf";
const BURGUNDY = "#97192c";
const BURGUNDY_DK = "#791423";

const HALF = 0.52; // bit centre offset: unit cubes with a 0.04 seam
const ISO_PITCH = Math.atan(1 / Math.SQRT2); // 35.26°, true isometric with the -45° yaw below
const SWAP_EVERY = 8;
const SWAP_LEN = 1.6;
const INTRO_LEN = 1.2;
const LINE = 2.5; // key line width, CSS px

const SIGNS = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as const)));

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

const archivo = () => getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim();

/** Face art for the B: cream letter, ink key line and a hard ink offset shadow on burgundy-dk. */
function drawB(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const s = canvas.width;
  ctx.fillStyle = BURGUNDY_DK;
  ctx.fillRect(0, 0, s, s);
  ctx.font = `900 ${Math.round(s * 0.74)}px ${archivo() || "Arial, sans-serif"}`;
  ctx.fontStretch = "expanded";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const m = ctx.measureText("B");
  const x = s / 2 - s * 0.02;
  const y = s / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  ctx.fillStyle = INK;
  ctx.fillText("B", x + s * 0.04, y + s * 0.04);
  ctx.fillStyle = CREAM;
  ctx.fillText("B", x, y);
  ctx.lineWidth = s * 0.016;
  ctx.lineJoin = "miter";
  ctx.strokeStyle = INK;
  ctx.strokeText("B", x, y);
}

/** Per-bit material arrays. BoxGeometry groups: +x, -x, +y, -y, +z, -z. */
function useByteMaterials() {
  const set = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    drawB(canvas);
    const base = new THREE.CanvasTexture(canvas);
    base.colorSpace = THREE.SRGBColorSpace;
    const textures: THREE.Texture[] = [];
    const flat = (color: string) => new THREE.MeshBasicMaterial({ color });
    const top = flat(CREAM);
    const bottom = flat(INK);
    const one = flat(BURGUNDY);
    const zero = flat(INK);
    const inner = flat(BURGUNDY_DK);
    // Each outward ±z face shows one quadrant of the B, so it splits into four when the bits burst.
    const quadrant = (ox: number, oy: number) => {
      const t = base.clone();
      t.repeat.set(0.5, 0.5);
      t.offset.set(ox, oy);
      textures.push(t);
      return new THREE.MeshBasicMaterial({ map: t });
    };
    const bits = SIGNS.map(([x, y, z]) => {
      // Two "0" bits get ink sides; the other six are "1" (burgundy).
      const side = (x > 0 && y > 0 && z < 0) || (x > 0 && y < 0 && z > 0) ? zero : one;
      const oy = y > 0 ? 0.5 : 0;
      return [
        side,
        side,
        top,
        bottom,
        z > 0 ? quadrant(x > 0 ? 0.5 : 0, oy) : inner,
        z < 0 ? quadrant(x < 0 ? 0.5 : 0, oy) : inner,
      ];
    });
    return { canvas, textures, bits };
  }, []);

  // Redraw once Archivo is ready (the first draw may have used the fallback face).
  useEffect(() => {
    const family = archivo();
    if (!family) return;
    let live = true;
    document.fonts
      .load(`900 100px ${family}`)
      .then(() => {
        if (!live) return;
        drawB(set.canvas);
        set.textures.forEach((t) => (t.needsUpdate = true));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [set]);

  return set.bits;
}

function Byte({ progress, anchor }: ByteSceneProps) {
  const materials = useByteMaterials();
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const star = useMemo(() => {
    // The brand four-point star (same curve as the loader glyph), as a thin extrusion.
    const s = new THREE.Shape();
    s.moveTo(0, 1);
    s.bezierCurveTo(0.06, 0.38, 0.38, 0.06, 1, 0);
    s.bezierCurveTo(0.38, -0.06, 0.06, -0.38, 0, -1);
    s.bezierCurveTo(-0.06, -0.38, -0.38, -0.06, -1, 0);
    s.bezierCurveTo(-0.38, 0.06, -0.06, 0.38, 0, 1);
    return new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false, curveSegments: 5 }).center();
  }, []);

  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);
  const bits = useRef<(THREE.Mesh | null)[]>([]);
  const canvas = useThree((s) => s.gl.domElement);
  const height = useThree((s) => s.size.height);

  const pointer = useRef({ x: 0, y: 0 });
  const layout = useRef({ x: 0, y: 0, unit: 100 });
  const clock = useRef({ time: 0, intro: 0, swaps: 0, swapT: -1, spin: 0, pitch: 0, yaw: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Centre and size the byte on the anchor slot (ortho zoom 1: one world unit = one CSS px).
  useEffect(() => {
    const slot = anchor.current;
    if (!slot) return;
    const measure = () => {
      const a = slot.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      layout.current = {
        x: a.left + a.width / 2 - (c.left + c.width / 2),
        y: c.top + c.height / 2 - (a.top + a.height / 2),
        unit: Math.min(a.height * 0.5, c.width * 0.2, c.height * 0.17), // may overlap the type, as buttermax does
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [anchor, canvas]);

  useFrame((_, rawDelta) => {
    const t = tilt.current;
    const sp = spin.current;
    const st = starRef.current;
    if (!t || !sp || !st) return;
    // Own clock: R3F resets its clock when frameloop resumes, and long frames must not skip the choreography.
    const dt = Math.min(rawDelta, 0.05);
    const c = clock.current;
    const { x, y, unit } = layout.current;
    c.time += dt;
    c.intro = Math.min(1, c.intro + dt / INTRO_LEN);
    c.spin += dt * 0.12;

    let burst = 0;
    let turn = 0;
    if (c.swapT < 0 && c.time >= SWAP_EVERY * (c.swaps + 1)) c.swapT = 0;
    if (c.swapT >= 0) {
      c.swapT += dt;
      const u = Math.min(1, c.swapT / SWAP_LEN);
      burst = Math.sin(Math.PI * u) * 0.85;
      turn = easeInOutCubic(clamp01((u - 0.15) / 0.7));
      if (u === 1) {
        c.swapT = -1;
        c.swaps += 1;
        turn = 0;
      }
    }

    const p = progress.current;
    const intro = easeOutCubic(c.intro);
    burst += (1 - intro) * 1.8 + p * 1.2;
    c.pitch = THREE.MathUtils.damp(c.pitch, pointer.current.y * 0.2, 3.5, dt);
    c.yaw = THREE.MathUtils.damp(c.yaw, pointer.current.x * 0.35, 3.5, dt);

    t.position.set(x, y + p * height * 1.1 + Math.sin(c.time * 0.9) * unit * 0.05, 0);
    t.rotation.set(ISO_PITCH + c.pitch + p * 0.9, c.yaw, p * 0.35);
    t.scale.setScalar(unit * (1 - 0.1 * p) * (0.9 + 0.1 * intro));
    sp.rotation.y = -Math.PI / 4 + c.spin + ((c.swaps + turn) * Math.PI) / 2;

    const k = HALF * (1 + burst);
    bits.current.forEach((m, i) => {
      if (!m) return;
      const [bx, by, bz] = SIGNS[i];
      m.position.set(bx * k, by * k, bz * k);
      m.rotation.set(bx * burst * 0.35, by * burst * 0.5, bz * burst * 0.3);
    });
    st.position.y = 1.62 + burst * 0.7;
    st.rotation.y += dt * 0.9;
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {SIGNS.map((_, i) => (
          <mesh
            key={i}
            ref={(m) => {
              bits.current[i] = m;
            }}
            geometry={box}
            material={materials[i]}
          >
            <Edges color={INK} lineWidth={LINE} />
          </mesh>
        ))}
        <mesh ref={starRef} geometry={star} scale={0.42}>
          <meshBasicMaterial color={CREAM} />
          <Edges color={INK} lineWidth={LINE} threshold={30} />
        </mesh>
      </group>
    </group>
  );
}

export default function ByteScene(props: ByteSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Root = top half of the viewport: rendering stops once the hero is half scrolled past (the byte left at ~40%).
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px 0px -50% 0px",
    });
    io.observe(el);
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 ease-riot",
        ready && "opacity-100",
      )}
    >
      <Canvas
        orthographic
        flat
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 600], zoom: 1, near: 1, far: 2000 }}
        frameloop={inView && pageVisible ? "always" : "never"}
        onCreated={() => setReady(true)}
        style={{ pointerEvents: "none" }}
      >
        <Byte {...props} />
      </Canvas>
    </div>
  );
}
