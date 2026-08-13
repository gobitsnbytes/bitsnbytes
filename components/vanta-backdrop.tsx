"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

import { useExperience } from "@/components/experience-provider";

type VantaEffect = {
  destroy: () => void;
};

export function VantaBackdrop() {
  const elementRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);
  const { resolvedTheme } = useTheme();
  const { motionEnabled } = useExperience();

  useEffect(() => {
    const element = elementRef.current;
    const canRender =
      motionEnabled &&
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!element || !canRender) {
      effectRef.current?.destroy();
      effectRef.current = null;
      return;
    }

    let cancelled = false;

    const mountEffect = async () => {
      const module = await import("vanta/dist/vanta.fog.min");
      if (cancelled || !elementRef.current) return;

      const createFog = module.default;
      const isDark = resolvedTheme === "dark";
      effectRef.current = createFog({
        el: elementRef.current,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: isDark ? 0x97192c : 0xfda83d,
        midtoneColor: isDark ? 0x5b0f1a : 0xf4d9d1,
        lowlightColor: isDark ? 0x1e0509 : 0x97192c,
        baseColor: isDark ? 0x120f0a : 0xfaf8f5,
        blurFactor: 0.68,
        speed: 0.42,
        zoom: 0.72,
      });
    };

    mountEffect();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [motionEnabled, resolvedTheme]);

  return (
    <div
      ref={elementRef}
      data-vanta-backdrop
      aria-hidden="true"
      className="absolute inset-0 hidden opacity-[0.16] mix-blend-multiply dark:opacity-[0.2] dark:mix-blend-screen md:block"
    />
  );
}
