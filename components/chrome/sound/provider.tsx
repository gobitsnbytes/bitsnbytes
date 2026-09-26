"use client";

import { useEffect } from "react";

import { useExperience } from "@/components/experience-provider";
import { isShortcut, useShortcutsEnabled } from "../hotkeys/shortcuts";
import { RECIPES, play, unlock, useSoundEnabled, type SoundName } from "./engine";

const INTERACTIVE =
  "a[href], button, [role=button], [role=tab], [role=switch], [role=menuitem], [role=checkbox], summary, input, select, textarea, label[for], [data-sound]:not(html)";
const TEXT = "textarea, input:not([type]), input[type=text], input[type=email], input[type=search], input[type=url], input[type=tel], input[type=password], input[type=number]";
/** Hotkeys play a scale degree each. */
const HOTKEY_NOTES: Record<string, number> = { E: 0, A: 1, J: 2, C: 3, M: 4, S: 5 };
/** Open/close cues only follow a real gesture, so page load and programmatic state never sound. */
const GESTURE_WINDOW_MS = 1200;

const el = (target: EventTarget | null) => (target instanceof Element ? target : null);

/** data-sound="none" silences an element; data-sound="<recipe>" swaps its cue. */
function cue(target: Element | null, fallback: SoundName): SoundName | null {
  const override = target?.closest<HTMLElement>("[data-sound]:not(html)")?.dataset.sound;
  if (override === "none") return null;
  return override && override in RECIPES ? (override as SoundName) : fallback;
}

const twoNote = (up: boolean) => {
  play("tick", up ? 0 : 2);
  setTimeout(() => play("tick", up ? 2 : 0), 70);
};

/**
 * Global sound delegation: document-level listeners, no per-component wiring. Mounts nothing and
 * listens to nothing while sound is off; the engine never creates an AudioContext before a gesture.
 */
export function SoundProvider() {
  const on = useSoundEnabled();
  const shortcuts = useShortcutsEnabled();
  const { lenis, motionEnabled } = useExperience();

  useEffect(() => {
    document.documentElement.dataset.sound = on ? "on" : "off";
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const fine = window.matchMedia("(pointer: fine)");
    let hovered: Element | null = null;
    let lastGesture = 0;
    let lastTabKey = 0;
    let lastSweep = 0;

    const gesture = () => {
      lastGesture = performance.now();
      unlock();
    };

    const onOver = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const target = el(e.target)?.closest(INTERACTIVE) ?? null;
      if (target === hovered) return;
      hovered = target;
      const name = target && cue(target, "tick");
      if (name) play(name, 0);
    };
    const onDown = (e: PointerEvent) => {
      gesture();
      const target = el(e.target)?.closest(INTERACTIVE);
      const name = target && cue(target, "thock");
      if (name) play(name);
    };
    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      const target = el(e.target)?.closest(INTERACTIVE);
      if (target && cue(target, "tick")) play("tick", 2);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!e.isTrusted) return;
      gesture();
      if (e.key === "Tab" || e.key.startsWith("Arrow")) lastTabKey = performance.now();
      const degree = HOTKEY_NOTES[e.key.toUpperCase()];
      if (shortcuts && degree !== undefined && isShortcut(e)) play("pluck", degree);
    };
    const onFocus = (e: FocusEvent) => {
      const target = el(e.target);
      if (!target || performance.now() - lastTabKey > 150 || !target.matches(":focus-visible")) return;
      const name = cue(target, "tick");
      if (name) play(name, 1);
    };
    const onInput = (e: Event) => {
      const target = el(e.target);
      if (e.isTrusted && target?.matches(TEXT)) play("key");
    };
    const onChange = (e: Event) => {
      const target = e.target;
      if (!e.isTrusted || !(target instanceof HTMLInputElement)) return;
      if (target.type === "checkbox" || target.type === "radio") twoNote(target.checked);
    };

    const sweepFor = (up: boolean) => {
      const now = performance.now();
      if (now - lastGesture > GESTURE_WINDOW_MS || now - lastSweep < 150) return;
      lastSweep = now;
      play(up ? "sweepUp" : "sweepDown");
    };
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        const t = r.target as Element;
        if (r.type === "childList") {
          for (const n of r.addedNodes) {
            if (n instanceof Element && (n.matches("[role=dialog]") || n.querySelector("[role=dialog]"))) sweepFor(true);
          }
          continue;
        }
        const value = r.attributeName === "open" ? String(t.hasAttribute("open")) : t.getAttribute(r.attributeName!);
        if (value === r.oldValue) continue;
        if (r.attributeName === "aria-checked" || value === "checked" || value === "unchecked") {
          if (performance.now() - lastGesture < GESTURE_WINDOW_MS) twoNote(value === "true" || value === "checked");
        } else if (value === "true" || value === "open") sweepFor(true);
        else if (value === "false" || value === "closed") sweepFor(false);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["aria-expanded", "data-state", "open", "aria-checked"],
    });

    // Paper rustle scaled by scroll velocity (Lenis when it runs, native delta otherwise); gentler without motion.
    let lastY = window.scrollY;
    let lastT = performance.now();
    let lastRustle = 0;
    const onScroll = () => {
      const now = performance.now();
      const v = lenis ? Math.abs(lenis.velocity) : (Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT)) * 16;
      lastY = window.scrollY;
      lastT = now;
      if (now - lastRustle < 90 || v < 2) return;
      lastRustle = now;
      play("rustle", Math.min(1, v / 60) * (motionEnabled ? 1 : 0.4));
    };

    const onReady = () => play("chord");

    const opts = { capture: true, passive: true } as const;
    document.addEventListener("pointerover", onOver, opts);
    document.addEventListener("pointerdown", onDown, opts);
    document.addEventListener("touchstart", gesture, opts);
    document.addEventListener("click", onClick, opts);
    document.addEventListener("keydown", onKey, opts);
    document.addEventListener("focusin", onFocus, opts);
    document.addEventListener("input", onInput, opts);
    document.addEventListener("change", onChange, opts);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("bnb:ready", onReady);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerover", onOver, opts);
      document.removeEventListener("pointerdown", onDown, opts);
      document.removeEventListener("touchstart", gesture, opts);
      document.removeEventListener("click", onClick, opts);
      document.removeEventListener("keydown", onKey, opts);
      document.removeEventListener("focusin", onFocus, opts);
      document.removeEventListener("input", onInput, opts);
      document.removeEventListener("change", onChange, opts);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("bnb:ready", onReady);
    };
  }, [on, shortcuts, lenis, motionEnabled]);

  return null;
}
