"use client";

import Image from "next/image";
import { Check, Copy } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import useSWR from "swr";

/* ---------------------------------------------------------------------------
   Cinematic Minecraft page — rebuilt on the same skeleton as app/fork.
   A tall <main> scrolls a pinned, full-viewport stage. Scroll progress scrubs
   a background video and fades a sequence of centered text scenes over it.

   PERFORMANCE:
   • NO spring — raw scrollYProgress drives everything (zero settling frames).
   • Video scrub uses a lerp loop to smooth micro-jitter without lag.
   • Full `transform` strings for GPU compositing (not FM shorthand `y`).
   • CSS containment on the fixed stage to isolate paint/layout.
--------------------------------------------------------------------------- */

type Data = Record<string, unknown>;

const fetcher = async (url: string): Promise<Data> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Offline");
  return response.json() as Promise<Data>;
};

/** One quiet heartbeat: how many players are online right now (or null). */
function usePlayersOnline(): number | null {
  const { data } = useSWR<Data>("/api/players", fetcher, {
    refreshInterval: 20_000,
    revalidateOnFocus: true,
  });
  return typeof data?.online === "number" ? data.online : null;
}

/** A scene fades in and out over a scroll window, drifting gently upward.
 *  Uses full `transform` strings (not shorthand `y`) for GPU acceleration. */
function Scene({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: ReactNode;
}) {
  // Wider ±0.07 ramps (up from ±0.06) so transitions breathe, without bleeding
  // into adjacent scenes (inter-scene gaps are 0.06).
  const opacity = useTransform(progress, [start - 0.07, start, end, end + 0.07], [0, 1, 1, 0]);
  // Hardware-accelerated: full transform string instead of shorthand `y`.
  const translateY = useTransform(
    progress,
    [start - 0.07, start, end, end + 0.07],
    ["translateY(24px)", "translateY(0px)", "translateY(0px)", "translateY(-16px)"],
  );

  return (
    <motion.div
      style={{ opacity, transform: translateY, willChange: "transform, opacity" }}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-[clamp(1.2rem,6vw,5rem)] text-center [text-shadow:0_2px_24px_rgba(12,4,6,0.7),0_1px_4px_rgba(12,4,6,0.5)] [contain:layout_style]" 
    >
      {/* Soft radial pool behind the words — guarantees contrast over bright
          video frames without any hard-edged panel. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_60%_45%_at_center,rgba(12,4,6,0.5),rgba(12,4,6,0)_70%)]"
        aria-hidden
      />
      {/* pointer-events re-enabled on the content so buttons stay clickable. */}
      <div className="pointer-events-auto relative w-full max-w-[min(92vw,60rem)]">{children}</div>
    </motion.div>
  );
}

function StatusStrip({ serverIp }: { serverIp: string }) {
  const online = usePlayersOnline();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider">
      <span className="inline-flex items-center gap-2 border border-[#faf8f5]/15 bg-white/[0.02] px-4 py-3 text-[#fee9cf]/90">
        <span className="h-2 w-2 bg-[#fc920d] shadow-[0_0_8px_rgba(252,146,13,0.6)]" />
        {online !== null ? `${online} active players` : "world initialized"}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy server address ${serverIp}`}
        className="inline-flex items-center gap-2 border-2 border-[#faf8f5]/30 bg-white/[0.04] px-5 py-3 font-mono text-xs tracking-widest text-[#faf8f5] uppercase transition-all duration-150 hover:border-[#fc920d]/70 hover:bg-[#fc920d]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fc920d]"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied to clipboard" : serverIp}
      </button>
    </div>
  );
}

export function MinecraftScroll({ serverIp }: { serverIp: string }) {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // No spring — raw scroll progress drives scenes directly.
  // This eliminates dozens of extra settling frames per scroll event.
  const progress = scrollYProgress;

  // Drive the background video frame via lerp-smoothed seek.
  // Lerp factor 0.5 settles in ~4 frames; threshold 0.003 avoids sub-frame seeks.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;
    let target = 0;
    let actual = 0;

    const seek = () => {
      actual += (target - actual) * 0.5;
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(
          video.duration - 0.04,
          Math.max(0, actual * video.duration),
        );
      }
      if (Math.abs(target - actual) > 0.003) {
        raf = requestAnimationFrame(seek);
      } else {
        actual = target;
        raf = 0;
      }
    };

    const update = (value: number) => {
      target = reduceMotion ? 0 : value;
      if (!raf) raf = requestAnimationFrame(seek);
    };

    video.pause();
    const unsubscribe = scrollYProgress.on("change", update);
    video.addEventListener("loadedmetadata", () => update(scrollYProgress.get()));
    return () => {
      unsubscribe();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollYProgress, reduceMotion]);

  return (
    <main
      ref={stageRef}
      className="relative bg-[#12070a] text-[#faf8f5]"
      style={{ minHeight: "900svh" }}
    >
      {/* Skip link for keyboard / screen-reader users. */}
      <a
        href="#join"
        className="fixed left-4 top-[-100px] z-[60] bg-[#fc920d] px-5 py-3 text-xs font-mono uppercase tracking-widest text-[#12070a] transition-[top] duration-150 focus:top-4"
      >
        Skip to join
      </a>

      {/* In-flow scroll sentinels so nav anchors have real, scrollable targets
          (the pinned scenes below are fixed and contribute no scroll offset). */}
      <span id="top" className="pointer-events-none absolute top-0" aria-hidden />
      <span id="join" className="pointer-events-none absolute bottom-[6svh]" aria-hidden />

      {/* inset-0 alone fills the true viewport; an explicit h-[100svh] here
          would fight top/bottom:0 and leave a gap below the stage. */}
      <section className="fixed inset-0 overflow-hidden bg-[#12070a] [contain:layout_style_paint]">
        {/* Background video — the star. */}
        <div className="absolute inset-0 z-0" aria-hidden>
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-center [transform:translateZ(0)]"
            muted
            playsInline
            preload="auto"
          >
            <source src="/movie/mc-server-bg.mp4" type="video/mp4" />
          </video>
          {/* One restrained gradient for legibility — no stacked tints. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0406]/40 to-[#0c0406]/60" />
        </div>

        {/* Minimal chrome. */}
        <header className="absolute left-1/2 top-6 z-40 flex w-[min(92vw,1050px)] -translate-x-1/2 items-center justify-between text-xs font-mono uppercase tracking-widest mix-blend-difference">
          <a href="#top" className="font-bold text-[#faf8f5] lowercase">
            bits&amp;bytes<sup className="text-[0.45em]">™</sup>
          </a>
          <a href="#join" className="opacity-80 transition-opacity hover:opacity-100">
            [ CONNECT ]
          </a>
        </header>

        {/* Hairline scroll progress. */}
        <div className="absolute inset-x-0 bottom-0 z-40 h-[2px] origin-left">
          <motion.i style={{ scaleX: scrollYProgress }} className="block h-full w-full origin-left bg-[#fc920d]/85" />
        </div>

        {/* 1 — Hero: logo + three words */}
        <Scene progress={progress} start={0} end={0.10}>
          <div className="flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="bits&amp;bytes™ isometric cube monogram"
              width={76}
              height={76}
              priority
              className="[filter:drop-shadow(0_12px_34px_rgba(12,4,6,0.55))]"
            />
            {/* System Blueprint Label */}
            <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#fee9cf]/50">
              <span>SYS_INIT // 26.8467° N, 80.9462° E</span>
            </div>
            <h1
              className="mt-6 font-accent-sans text-[clamp(4rem,12vw,9.5rem)] font-normal uppercase leading-[0.82] tracking-tighter"
              aria-label="Build. Explore. Belong."
            >
              <span aria-hidden>
                Build.<br />Explore.<br /><em className="not-italic text-[#fc920d]">Belong.</em>
              </span>
            </h1>
            <div className="mt-[clamp(2.5rem,8vh,6rem)] flex flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#fee9cf]/40 animate-pulse">
                SCROLL DRAFTING SHEET TO DEPLOY
              </span>
              <b className="font-mono text-xs text-[#fc920d]">↓</b>
            </div>
          </div>
        </Scene>

        {/* 2 — One short intro line */}
        <Scene progress={progress} start={0.14} end={0.24}>
          <div className="max-w-[38rem] text-center flex flex-col items-center justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fc920d]/70 mb-3 text-center">
              // DESIGN BRIEF //
            </p>
            <p className="font-serif-brand text-[clamp(1.8rem,4.5vw,3.2rem)] font-normal leading-[1.1] text-[#faf8f5] tracking-tight text-center">
              A Minecraft world worth<br /><em className="font-serif-brand italic font-light text-[#fee9cf]">returning to.</em>
            </p>
            <p className="mt-4 font-serif-brand text-sm leading-relaxed text-[#faf8f5]/70 max-w-[30rem] text-center">
              A Section 8 nonprofit teen builder network's survival server. Designed for high agency, fully optimized, zero endless menus, and focused on pure community vanilla+ play.
            </p>
          </div>
        </Scene>

        {/* 3 — High-Fidelity Blueprint Spec Panel */}
        <Scene progress={progress} start={0.28} end={0.38}>
          <div className="w-full max-w-[min(92vw,56rem)] border border-[#faf8f5]/15 bg-[#12070a]/75 backdrop-blur-md p-4 sm:p-6 text-left font-mono">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#faf8f5]/15 pb-2 sm:pb-3.5 mb-4 sm:mb-5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#fee9cf]/60 gap-1 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#fc920d]" />
                <span>SERVER_BLUEPRINT_V2.0</span>
              </div>
              <div>LOC: AP-SOUTH-1A // IN</div>
            </div>

            {/* Spec Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5 text-[10px] sm:text-xs text-[#faf8f5]/90">
              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// HARDWARE CONFIGURATION</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">HOST OS:</span>
                    <span>Debian 12 Bookworm</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">COMPUTE:</span>
                    <span>4 vCPU / 8GB RAM</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">RUNTIME/GC:</span>
                    <span className="truncate" title="Java 21 (Temurin) // G1GC Tuned">Java 21 // G1GC</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// GAMEPLAY & PROTOCOL</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">ENGINE:</span>
                    <span>Purpur (Paper Fork)</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">CROSSPLAY:</span>
                    <span>Bedrock + Java Edition</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">WORLD PRE-GEN:</span>
                    <span>3000-radius (Chunky)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// EXTENDED PLUGIN STACK</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">CORE SYSTEM:</span>
                    <span className="truncate" title="LuckPerms, EssentialsX, CoreProtect">LuckPerms, EssentialsX</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">SOCIAL INTEGR:</span>
                    <span>DiscordSRV (Chat Bridge)</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">CUSTOM API:</span>
                    <span>bnb-api + bnb-consent</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// SECURITY & AUTOMATION</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">INFRA IaC:</span>
                    <span>bootstrap-host.sh</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">FIREWALL:</span>
                    <span>UFW / Fail2ban SSH</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">BACKUPS:</span>
                    <span>Daily zstd retention</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer indicator line */}
            <div className="mt-4 border-t border-[#faf8f5]/15 pt-2.5 text-[8px] sm:text-[9px] text-[#fee9cf]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 select-none">
              <a
                href="https://github.com/gobitsnbytes/minecraft-server"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#fc920d] transition-colors pointer-events-auto flex items-center gap-1.5"
              >
                <span>[ GITHUB: GOBITSNBYTES/MINECRAFT-SERVER ]</span>
              </a>
              <span>COMPILED WITH PLANAR SHELLS // NO MODS REQUIRED</span>
            </div>
          </div>
        </Scene>

        {/* 4 — Legal & Safeguarding Charter Blueprint */}
        <Scene progress={progress} start={0.42} end={0.54}>
          <div className="w-full max-w-[min(92vw,56rem)] border border-[#faf8f5]/15 bg-[#12070a]/75 backdrop-blur-md p-4 sm:p-6 text-left font-mono">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#faf8f5]/15 pb-2 sm:pb-3.5 mb-4 sm:mb-5 text-[9px] sm:text-[10px] uppercase tracking-wider text-[#fee9cf]/60 gap-1 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#fc920d]" />
                <span>LEGAL_&amp;_SAFEGUARDING_CHARTER_V1.0</span>
              </div>
              <div>STATUS: BINDING // COMPLIANT</div>
            </div>

            {/* Spec Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5 text-[10px] sm:text-xs text-[#faf8f5]/90">
              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// GOVERNANCE &amp; TERMS</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">STEWARD:</span>
                    <span>GOBITSNBYTES FOUNDATION</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">LEGAL CLASS:</span>
                    <span>Section 8 Nonprofit (IN)</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">CODE OF COND:</span>
                    <span>TL;DR: Build things. Be decent.</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// MINOR PROTECTION</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">COMPLIANCE:</span>
                    <span>POCSO Act, 2012 / DPDP Act, 2023</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">CONSENT:</span>
                    <span>Mandatory parent consent</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">PROFILING:</span>
                    <span>Zero targeted commercial ads</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// CONSENT GATE SYSTEM</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">GATE PLUGIN:</span>
                    <span>bnb-consent (source compiled)</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">RESTRICTION:</span>
                    <span>No interaction before command</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">COMMAND:</span>
                    <span className="text-[#fc920d] font-bold">/accept</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] sm:text-[10px] uppercase text-[#fc920d]/75 tracking-wider mb-1">// SECURITY AUDITS &amp; EULA</span>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">EULA POLICY:</span>
                    <span>Mojang commercial guidelines</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] border-b border-[#faf8f5]/5 py-1">
                    <span className="text-[#fee9cf]/50">MONETISATION:</span>
                    <span>Zero pay-to-win or real money</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] py-1">
                    <span className="text-[#fee9cf]/50">LOGGING SCOPE:</span>
                    <span>Abuse prevention only // No sell</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer indicator line */}
            <div className="mt-4 border-t border-[#faf8f5]/15 pt-2.5 text-[8px] sm:text-[9px] text-[#fee9cf]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 select-none">
              <div className="flex gap-3">
                <a href="https://gobitsnbytes.org/terms" target="_blank" rel="noopener noreferrer" className="hover:text-[#fc920d] transition-colors pointer-events-auto">[ TERMS ]</a>
                <a href="https://gobitsnbytes.org/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#fc920d] transition-colors pointer-events-auto">[ PRIVACY ]</a>
                <a href="https://gobitsnbytes.org/coc" target="_blank" rel="noopener noreferrer" className="hover:text-[#fc920d] transition-colors pointer-events-auto">[ CONDUCT ]</a>
              </div>
              <span>ISSUED BY GOBITSNBYTES BOARD OF DIRECTORS</span>
            </div>
          </div>
        </Scene>

        {/* 5 — Manifesto moment */}
        <Scene progress={progress} start={0.58} end={0.70}>
          <div className="max-w-[48rem] flex flex-col items-center text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#fc920d]/70 mb-4 text-center">
              // WEB-FREE PRINCIPLE
            </span>
            <h2
              className="font-accent-sans text-[clamp(2.4rem,6vw,5.5rem)] font-normal uppercase leading-[0.9] tracking-tighter text-center"
              aria-label="No endless menus. No noise. Just Minecraft, done right."
            >
              <span aria-hidden>
                No endless menus.<br />No noise.
              </span>
            </h2>
            <p className="mt-4 font-serif-brand text-[clamp(1.2rem,2.5vw,1.75rem)] font-normal leading-relaxed text-[#fee9cf]/85 text-center">
              Just Minecraft, done right.
            </p>
          </div>
        </Scene>

        {/* 6 — Tiny live status strip */}
        <Scene progress={progress} start={0.74} end={0.84}>
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fee9cf]/40 text-center">
              DEPLOYED DEPLOYMENT NODE
            </span>
            <StatusStrip serverIp={serverIp} />
          </div>
        </Scene>

        {/* 7 — Final CTA */}
        <Scene progress={progress} start={0.88} end={1.04}>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fc920d]/80 mb-2 text-center">// WORLD INITIATION</span>
              <h2
                className="font-accent-sans text-[clamp(3.8rem,10vw,8.5rem)] font-normal uppercase leading-[0.82] tracking-tighter text-center"
                aria-label="See you in-game."
              >
                <span aria-hidden>
                  See you<br /><em className="not-italic text-[#fc920d]">in-game.</em>
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <StatusStrip serverIp={serverIp} />
              <div className="flex flex-col items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-[#fee9cf]/40 mt-2 text-center">
                <span>JAVA: mc.gobitsnbytes.org (PORT: 25565)</span>
                <span>BEDROCK: mc.gobitsnbytes.org (PORT: 19132)</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[9px] font-mono tracking-wider text-[#fee9cf]/30 mt-6 text-center select-none uppercase">
                <span className="normal-case">bits&amp;bytes™ by GOBITSNBYTES FOUNDATION</span>
                <span>© 2026 GOBITSNBYTES FOUNDATION. All rights reserved. | gobitsnbytes.org</span>
              </div>
            </div>
          </div>
        </Scene>
      </section>
    </main>
  );
}
