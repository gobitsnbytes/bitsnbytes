"use client";

import { useEffect, useRef, type JSX } from "react";
import { cn } from "@/lib/utils";

const CHARSET = "01&#*+=/<>";

export type ScrambleTextProps = {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** mount: on mount (after delay). inview: first time 60% visible. hover: pointer enters the closest link/button. */
  trigger?: "mount" | "inview" | "hover";
  /** ms before the scramble starts (mount / inview). */
  delay?: number;
};

const motionOff = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.dataset.immersiveMotion === "off";

/**
 * Space Mono label that resolves out of binary-ish noise (revelatio / kprverse). The real text is
 * always in the DOM (it only goes transparent while the aria-hidden mirror scrambles on top), so
 * screen readers, crawlers and copy/paste get the plain string. Skipped under reduced motion and the
 * site motion toggle.
 */
export function ScrambleText({ text, as = "span", className, trigger = "inview", delay = 0 }: ScrambleTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const realRef = useRef<HTMLSpanElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const real = realRef.current;
    const mirror = mirrorRef.current;
    if (!root || !real || !mirror) return;

    let raf = 0;
    let timer = 0;

    const reset = () => {
      cancelAnimationFrame(raf);
      mirror.textContent = "";
      real.style.color = "";
    };

    const run = () => {
      if (motionOff()) return;
      cancelAnimationFrame(raf);
      const start = performance.now();
      const duration = Math.min(900, 280 + text.length * 32);
      real.style.color = "transparent";

      const frame = (now: number) => {
        const t = (now - start) / duration;
        if (t >= 1) return reset();
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          // char i locks in once t passes its slot; the first 30% is pure noise
          out += ch === " " || t >= 0.3 + 0.7 * (i / text.length) ? ch : CHARSET[(Math.random() * CHARSET.length) | 0];
        }
        mirror.textContent = out;
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const later = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, delay);
    };

    if (trigger === "mount") {
      later();
      return () => {
        window.clearTimeout(timer);
        reset();
      };
    }

    if (trigger === "hover") {
      const target = root.closest<HTMLElement>("a, button") ?? root;
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType !== "touch") run();
      };
      target.addEventListener("pointerenter", onEnter);
      return () => {
        target.removeEventListener("pointerenter", onEnter);
        reset();
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        later();
      },
      { threshold: 0.6 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      reset();
    };
  }, [text, trigger, delay]);

  // Typed as span so JSX props stay checkable (R3F widens IntrinsicElements); any tag renders at runtime.
  const Tag = as as "span";
  return (
    <Tag ref={rootRef} className={cn("relative", className)}>
      <span ref={realRef}>{text}</span>
      <span ref={mirrorRef} aria-hidden className="pointer-events-none absolute inset-0" />
    </Tag>
  );
}
