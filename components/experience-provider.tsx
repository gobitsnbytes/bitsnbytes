"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Driver, DriveStep } from "driver.js";

const TOUR_STORAGE_KEY = "bnb-cinematic-tour-v1";
const MOTION_STORAGE_KEY = "bnb-immersive-motion";

type ExperienceContextValue = {
  motionEnabled: boolean;
  toggleMotion: () => void;
  startTour: () => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function getSectionLabel(section: HTMLElement, index: number) {
  const explicitLabel = section.dataset.cinematicTitle;
  if (explicitLabel) return explicitLabel;

  const heading = section.querySelector<HTMLElement>("h1, h2");
  const headingText = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (headingText) return headingText.slice(0, 34);

  return `chapter ${String(index + 1).padStart(2, "0")}`;
}

function getTopLevelSections() {
  const allSections = Array.from(
    document.querySelectorAll<HTMLElement>(
      "main section, main [data-cinematic-section]",
    ),
  );

  return Array.from(new Set(allSections)).filter(
    (section) =>
      !section.parentElement?.closest("section, [data-cinematic-section]"),
  );
}

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }
  return value;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [activeChapter, setActiveChapter] = useState({
    index: 0,
    total: 0,
    label: "opening frame",
  });
  const progressRef = useRef<HTMLDivElement>(null);
  const tourRef = useRef<Driver | null>(null);
  const autoTourStartedRef = useRef(false);

  useEffect(() => {
    setSettledPath(null);
    const settleTimer = window.setTimeout(() => setSettledPath(pathname), 480);
    return () => window.clearTimeout(settleTimer);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = window.localStorage.getItem(MOTION_STORAGE_KEY);
    const enabled = stored === null ? !media.matches : stored === "on";
    setMotionEnabled(enabled && !media.matches);

    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMotionEnabled(false);
    };

    media.addEventListener("change", onPreferenceChange);
    return () => media.removeEventListener("change", onPreferenceChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.immersiveMotion = motionEnabled
      ? "on"
      : "off";
  }, [motionEnabled]);

  useEffect(() => {
    if (!motionEnabled || pathname === "/qna") return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
      prevent: (node) =>
        node instanceof HTMLElement &&
        Boolean(node.closest("[data-lenis-prevent]")),
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [motionEnabled, pathname]);

  useGSAP(
    () => {
      if (settledPath !== pathname) return;

      if (pathname === "/qna") {
        setActiveChapter({ index: 0, total: 0, label: "live assistant" });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      const sections = getTopLevelSections();
      const labels = sections.map(getSectionLabel);
      setActiveChapter({
        index: 0,
        total: sections.length,
        label: labels[0] ?? "opening frame",
      });

      sections.forEach((section, index) => {
        section.classList.add("cinematic-section");
        section.dataset.cinematicIndex = String(index + 1).padStart(2, "0");

        ScrollTrigger.create({
          trigger: section,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: ({ isActive }) => {
            if (!isActive) return;

            sections.forEach((item) =>
              item.classList.toggle("is-cinematic-active", item === section),
            );
            setActiveChapter({
              index,
              total: sections.length,
              label: labels[index],
            });
          },
        });

        if (!motionEnabled || index === 0) return;

        gsap.fromTo(
          section,
          {
            autoAlpha: 0.3,
            transform: "translateY(28px)",
            clipPath: "inset(0 0 7% 0)",
          },
          {
            autoAlpha: 1,
            transform: "translateY(0px)",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.78,
            ease: "power4.out",
            clearProps: "transform,clipPath,opacity,visibility",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      });

      const progressTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: ({ progress }) => {
          if (!progressRef.current) return;
          gsap.set(progressRef.current, {
            transform: `scaleY(${Math.max(progress, 0.025)})`,
          });
        },
      });

      const refreshTimers = [
        window.setTimeout(() => ScrollTrigger.refresh(), 160),
        window.setTimeout(() => ScrollTrigger.refresh(), 900),
      ];

      return () => {
        progressTrigger.kill();
        refreshTimers.forEach(window.clearTimeout);
        sections.forEach((section) => {
          section.classList.remove("cinematic-section", "is-cinematic-active");
          delete section.dataset.cinematicIndex;
        });
      };
    },
    {
      dependencies: [motionEnabled, pathname, settledPath],
      revertOnUpdate: true,
    },
  );

  const startTour = useCallback(async () => {
    const { driver } = await import("driver.js");
    tourRef.current?.destroy();

    const candidateSteps: Array<{
      element: Element | null;
      popover: DriveStep["popover"];
    }> = [
      {
        element: document.querySelector('[data-tour="navigation"]'),
        popover: {
          title: "the map",
          description:
            "seven doors, one network. move between the work, the people, and the public record from here.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element:
          document.querySelector('[data-tour="page-hero"]') ??
          document.querySelector("main h1"),
        popover: {
          title: "start with the claim",
          description:
            "each page opens with the thing it can prove. the rest of the scroll is the evidence.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: document.querySelector('[data-tour="prospectus"]'),
        popover: {
          title: "take the full brief",
          description:
            "the partnership prospectus puts the whole story in one file. download it, forward it, and use it to start the serious conversation.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: getTopLevelSections()[1] ?? getTopLevelSections()[0] ?? null,
        popover: {
          title: "follow the build",
          description:
            "the chapters sharpen as they enter the frame. scroll normally; the site keeps your place without taking over.",
          side: "top",
          align: "start",
        },
      },
      {
        element: document.querySelector('[data-tour="footer-trust"]'),
        popover: {
          title: "the rules are public",
          description:
            "safety, privacy, conduct, and brand stewardship live here. being teen-led still means being accountable.",
          side: "top",
          align: "center",
        },
      },
    ];

    const steps: DriveStep[] = candidateSteps
      .filter(
        (step): step is { element: Element; popover: DriveStep["popover"] } =>
          Boolean(step.element),
      )
      .map((step) => ({
        element: step.element,
        popover: step.popover,
      }));

    if (!steps.length) return;

    const tour = driver({
      animate: motionEnabled,
      duration: motionEnabled ? 260 : 0,
      smoothScroll: motionEnabled,
      allowClose: true,
      allowScroll: true,
      overlayColor: "#120f0a",
      overlayOpacity: 0.82,
      stagePadding: 10,
      stageRadius: 0,
      popoverClass: "bnb-driver-popover",
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "next",
      prevBtnText: "back",
      doneBtnText: "done",
      steps,
      onDestroyed: () => {
        window.localStorage.setItem(TOUR_STORAGE_KEY, "seen");
        tourRef.current = null;
      },
    });

    tourRef.current = tour;
    tour.drive();
  }, [motionEnabled]);

  useEffect(() => {
    if (
      pathname !== "/" ||
      autoTourStartedRef.current ||
      window.localStorage.getItem(TOUR_STORAGE_KEY) ||
      window.innerWidth < 900
    ) {
      return;
    }

    autoTourStartedRef.current = true;
    const timer = window.setTimeout(startTour, 1300);
    return () => window.clearTimeout(timer);
  }, [pathname, startTour]);

  useEffect(() => () => tourRef.current?.destroy(), [pathname]);

  const toggleMotion = useCallback(() => {
    setMotionEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(MOTION_STORAGE_KEY, next ? "on" : "off");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ motionEnabled, toggleMotion, startTour }),
    [motionEnabled, startTour, toggleMotion],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      {activeChapter.total > 0 && (
        <aside
          aria-hidden="true"
          className="cinematic-scroll-rail pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
        >
          <div className="max-w-32 text-right font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/55">
            <span className="block text-primary dark:text-accent">
              {String(activeChapter.index + 1).padStart(2, "0")} /{" "}
              {String(activeChapter.total).padStart(2, "0")}
            </span>
            <span className="mt-1 block truncate">{activeChapter.label}</span>
          </div>
          <div className="relative h-24 w-[3px] overflow-hidden bg-foreground/15">
            <div
              ref={progressRef}
              className="absolute inset-0 origin-top bg-primary dark:bg-accent"
              style={{ transform: "scaleY(0.025)" }}
            />
          </div>
        </aside>
      )}
    </ExperienceContext.Provider>
  );
}
