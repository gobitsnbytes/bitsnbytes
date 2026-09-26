"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, wrap } from "framer-motion";

import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

export type DragMarqueeProps = {
  items: ReactNode[];
  /** Auto-drift in px per second (leftwards). */
  speed?: number;
  className?: string;
};

/**
 * Ink ticker you can grab (kprverse / buttermax band). Auto-drifts while in view, pauses on hover/focus,
 * drag it either way and it coasts off with the release velocity. Two copies of the run, wrapped over one
 * copy's width, so it never ends. Decorative (aria-hidden): the same content is listed next to it.
 * Reduced motion / motion toggle: no drift and no coasting; dragging still works.
 */
export function DragMarquee({ items, speed = 50, className }: DragMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const motionOn = useMotionEnabled();
  const x = useMotionValue(0);
  const s = useRef({ width: 0, paused: false, drag: null as null | { id: number; from: number; at: number }, v: 0, lastX: 0, lastT: 0 });

  // ponytail: repeat to >= 10 entries per copy so short lists outrun wide screens.
  const run = Array.from({ length: Math.ceil(10 / Math.max(items.length, 1)) }, () => items).flat();

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const ro = new ResizeObserver(() => (s.current.width = copy.offsetWidth));
    ro.observe(copy);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const st = s.current;
    if (!inView || !st.width || st.drag) return;
    let next = x.get();
    if (motionOn && Math.abs(st.v) > 0.02) {
      next += st.v * delta;
      st.v *= Math.pow(0.94, delta / 16);
    } else if (motionOn && !st.paused) {
      st.v = 0;
      next -= (speed * delta) / 1000;
    } else return;
    x.set(wrap(-st.width, 0, next));
  });

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    s.current.drag = { id: event.pointerId, from: event.clientX, at: x.get() };
    s.current.v = 0;
    s.current.lastX = event.clientX;
    s.current.lastT = event.timeStamp;
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (!st.drag || st.drag.id !== event.pointerId || !st.width) return;
    const dt = event.timeStamp - st.lastT;
    if (dt > 0) st.v = (event.clientX - st.lastX) / dt;
    st.lastX = event.clientX;
    st.lastT = event.timeStamp;
    x.set(wrap(-st.width, 0, st.drag.at + event.clientX - st.drag.from));
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    if (s.current.drag?.id !== event.pointerId) return;
    s.current.drag = null;
    // Stale velocity (pointer held still before release) doesn't coast.
    if (event.timeStamp - s.current.lastT > 80) s.current.v = 0;
  };

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-cursor-label="DRAG"
      onPointerEnter={() => (s.current.paused = true)}
      onPointerLeave={() => (s.current.paused = false)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={cn(
        "cursor-grab touch-pan-y select-none overflow-hidden border-y-3 border-ink bg-ink py-5 text-paper active:cursor-grabbing",
        className,
      )}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} ref={copy === 0 ? copyRef : undefined} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={i} className="flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap">
                {item}
                <span className="size-3 shrink-0 bg-orange" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
