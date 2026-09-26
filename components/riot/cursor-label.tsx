"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./scramble-text";

const FINE = "(hover: hover) and (pointer: fine)";
const OFFSET_X = 16;
const OFFSET_Y = 22;

/**
 * One global cursor tag (bfcm / revelatio). Any element opts in with data-cursor-label="PLAY TRAILER".
 * Fine pointers only; a single fixed node moved with translate3d in rAF (slight lerp); label lookup via
 * pointerover delegation. Hidden for touch, while using the keyboard, under reduced motion and when the
 * site motion toggle is off. Purely decorative (aria-hidden): the element keeps its own accessible name.
 */
export function CursorLabel() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const media = window.matchMedia(FINE);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!enabled || !node) return;

    let x = -200;
    let y = -200;
    let tx = x;
    let ty = y;
    let raf = 0;
    let current: string | null = null;

    const show = (next: string | null) => {
      if (next === current) return;
      if (next && !current) {
        // appear at the pointer instead of sliding in from the last spot
        x = tx;
        y = ty;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      current = next;
      setLabel(next);
      if (next) setText(next);
    };

    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return show(null);
      tx = event.clientX + OFFSET_X;
      ty = event.clientY + OFFSET_Y;
      if (current && !raf) raf = requestAnimationFrame(tick);
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return show(null);
      const target = (event.target as Element | null)?.closest?.<HTMLElement>("[data-cursor-label]");
      show(target?.dataset.cursorLabel?.trim() || null);
    };

    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) show(null);
    };
    const hide = () => show(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={nodeRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1100] motion-reduce:hidden motion-off:hidden"
      style={{ transform: "translate3d(-200px, -200px, 0)" }}
    >
      <motion.span
        initial={false}
        animate={label ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="block origin-top-left whitespace-nowrap border-2 border-paper bg-ink px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-paper shadow-[3px_3px_0_0_var(--orange)]"
      >
        {text ? <ScrambleText key={text} text={text} trigger="mount" /> : null}
      </motion.span>
    </div>
  );
}
