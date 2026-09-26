"use client";

/*
 * LogoCubeScene — buttermax.net's hero object, as the bits&bytes™ cube mark (public/logo.svg) built for real in 3D.
 *
 * Build (./logo-cube/geometry.ts): the mark's three faces become thin paper plates with the B, B, roof and star
 * punched out, sitting on a slightly smaller ink core, so the letterforms read as recessed cuts, as in the logo. The
 * three hidden faces reuse the same plates turned 180°: nothing blank flashes when the plates fly apart, at no extra
 * geometry. Rest pose = orthographic camera down the cube diagonal (true isometric), so the resting frame is the logo.
 *
 * Reference moves (tmp/research-full.json → buttermax):
 *  - Hero object that outruns the scroll: the hero's ScrollTrigger writes 0→1 progress into `progress`; the cube
 *    lifts 0.6 hero-heights extra (≈1.6× page speed), pitches and rolls, the plates drift off and it scales to .9.
 *  - Timed object swap: every 8s the six plates peel out along their normals (40ms stagger), the core turns 90°,
 *    and the plates slam back with a bounce, 1.2s in all.
 *  - Idle: slow drift and bob, plus a spring tilt toward the pointer.
 *
 * Print look: flat unlit brand colours (paper plates, burgundy cut walls, ink core with burgundy key lines), drei
 * <Edges> in ink, no lights, env maps or post. Loaded only through next/dynamic({ ssr: false }) from hero.tsx after
 * requestIdleCallback; frameloop goes to "never" once the hero is off screen or the tab is hidden.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { logoPlates, type FaceName } from "./logo-cube/geometry";

export type LogoCubeSceneProps = {
  /** 0→1 scroll progress over the hero, written by the hero's ScrollTrigger. */
  progress: { current: number };
  /** Element whose box the cube centres on (the hero's empty middle slot). */
  anchor: { current: HTMLElement | null };
};

const INK = "#120f0a";
const PAPER = "#faf8f5";
const BURGUNDY = "#97192c";

const DEPTH = 0.07; // plate thickness; the core has half-size 1
const ISO_PITCH = Math.atan(1 / Math.SQRT2); // 35.26°: with the -45° yaw, the camera looks down the cube diagonal
const ISO_YAW = -Math.PI / 4;
const SWAP_EVERY = 8;
const SWAP_LEN = 1.2;
const STAGGER = 0.04;
const PEEL = 0.55; // how far the plates fly out in a swap, cube units
const INTRO_LEN = 0.9;
const LINE = 2.5; // key line width, CSS px

type Vec3 = [number, number, number];
/** Six plates: the three logo faces, then the same plates turned onto the opposite faces. */
const PLATES: { face: FaceName; normal: Vec3; turn: Vec3 }[] = [
  { face: "top", normal: [0, 1, 0], turn: [0, 0, 0] },
  { face: "left", normal: [0, 0, 1], turn: [0, 0, 0] },
  { face: "right", normal: [1, 0, 0], turn: [0, 0, 0] },
  { face: "top", normal: [0, 1, 0], turn: [Math.PI, 0, 0] },
  { face: "left", normal: [0, 0, 1], turn: [0, Math.PI, 0] },
  { face: "right", normal: [1, 0, 0], turn: [0, Math.PI, 0] },
];

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBounce = (t: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t - 1.5 / d) ** 2 + 0.75;
  if (t < 2.5 / d) return n * (t - 2.25 / d) ** 2 + 0.9375;
  return n * (t - 2.625 / d) ** 2 + 0.984375;
};
/** 0→1→0 peel of one plate, s seconds into its swap: fly out, hang, slam back onto the core with two rebounds. */
const swapPeel = (s: number) => {
  if (s <= 0 || s >= 1) return 0;
  if (s < 0.28) return easeOutCubic(s / 0.28);
  if (s < 0.55) return 1;
  return 1 - easeOutBounce((s - 0.55) / 0.45);
};

/** Damped spring toward `target` (slight overshoot); semi-implicit Euler, stable for dt ≤ 0.05. */
function spring(s: { x: number; v: number }, target: number, dt: number) {
  s.v += ((target - s.x) * 40 - s.v * 9) * dt;
  s.x += s.v * dt;
  return s.x;
}

function LogoCube({ progress, anchor }: LogoCubeSceneProps) {
  const plates = useMemo(() => logoPlates(DEPTH), []);
  const core = useMemo(() => new THREE.BoxGeometry(1.96, 1.96, 1.96), []);
  const materials = useMemo(
    () => ({
      plate: [new THREE.MeshBasicMaterial({ color: PAPER }), new THREE.MeshBasicMaterial({ color: BURGUNDY })],
      core: new THREE.MeshBasicMaterial({ color: INK }),
    }),
    [],
  );

  const cube = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const plateRefs = useRef<(THREE.Mesh | null)[]>([]);
  const canvas = useThree((s) => s.gl.domElement);
  const height = useThree((s) => s.size.height);

  const pointer = useRef({ x: 0, y: 0 });
  const layout = useRef({ x: 0, y: 0, unit: 100 });
  const tilt = useRef({ pitch: { x: 0, v: 0 }, yaw: { x: 0, v: 0 } });
  const clock = useRef({ time: 0, intro: 0, swaps: 0, swapT: -1 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Centre and size the cube on the anchor slot (ortho zoom 1: one world unit = one CSS px).
  useEffect(() => {
    const slot = anchor.current;
    if (!slot) return;
    const measure = () => {
      const a = slot.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      layout.current = {
        x: a.left + a.width / 2 - (c.left + c.width / 2),
        y: c.top + c.height / 2 - (a.top + a.height / 2),
        // Short screens squeeze the slot: keep a floor of 12% of the hero height so the cube still reads.
        unit: Math.min(Math.max(a.height * 0.5, c.height * 0.12), c.width * 0.2, c.height * 0.17), // may overlap the type, as buttermax does
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [anchor, canvas]);

  useFrame((_, rawDelta) => {
    const g = cube.current;
    const k = coreRef.current;
    if (!g || !k) return;
    // Own clock: R3F resets its clock when frameloop resumes, and long frames must not skip the choreography.
    const dt = Math.min(rawDelta, 0.05);
    const c = clock.current;
    const { x, y, unit } = layout.current;
    c.time += dt;
    c.intro = Math.min(1, c.intro + dt / INTRO_LEN);

    let turn = 0;
    if (c.swapT < 0 && c.time >= SWAP_EVERY * (c.swaps + 1)) c.swapT = 0;
    if (c.swapT >= 0) {
      c.swapT += dt;
      turn = easeInOutCubic(clamp01((c.swapT - 0.2) / 0.6));
      if (c.swapT >= SWAP_LEN) {
        c.swapT = -1;
        c.swaps += 1;
        turn = 0;
      }
    }

    const p = progress.current;
    const pitch = spring(tilt.current.pitch, pointer.current.y * 0.18, dt) + Math.sin(c.time * 0.5) * 0.035;
    const yaw = spring(tilt.current.yaw, pointer.current.x * 0.3, dt) + Math.sin(c.time * 0.33) * 0.07;

    g.position.set(x, y + p * height * 0.6 + Math.sin(c.time * 0.9) * unit * 0.04, 0);
    g.rotation.set(ISO_PITCH + pitch + p * 0.9, ISO_YAW + yaw, p * 0.35);
    g.scale.setScalar(unit * (1 - 0.1 * p) * (0.92 + 0.08 * easeOutCubic(c.intro)));
    k.rotation.y = ((c.swaps + turn) * Math.PI) / 2;

    plateRefs.current.forEach((m, i) => {
      if (!m) return;
      const d = (c.swapT < 0 ? 0 : swapPeel(c.swapT - i * STAGGER)) * PEEL + p * 0.9;
      const [nx, ny, nz] = PLATES[i].normal;
      m.position.set(nx * d, ny * d, nz * d);
    });
  });

  return (
    <group ref={cube}>
      <mesh ref={coreRef} geometry={core} material={materials.core}>
        <Edges color={BURGUNDY} lineWidth={LINE} />
      </mesh>
      {PLATES.map((plate, i) => (
        <group key={i} rotation={plate.turn}>
          <mesh
            ref={(m) => {
              plateRefs.current[i] = m;
            }}
            geometry={plates[plate.face]}
            material={materials.plate}
          >
            <Edges color={INK} lineWidth={LINE} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function LogoCubeScene(props: LogoCubeSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Root = top half of the viewport: rendering stops once the hero has scrolled out of it.
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
        camera={{ position: [0, 0, 2000], zoom: 1, near: 1, far: 4000 }}
        frameloop={inView && pageVisible ? "always" : "never"}
        onCreated={() => setReady(true)}
        style={{ pointerEvents: "none" }}
      >
        <LogoCube {...props} />
      </Canvas>
    </div>
  );
}
