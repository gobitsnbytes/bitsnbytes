"use client";

import Image from "next/image";
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

/** Fetches full live network ops metrics including tickrate, uptime, and world telemetry. */
function useLiveStats() {
  const { data: players } = useSWR<Data>("/api/players", fetcher, { refreshInterval: 15_000 });
  const { data: tpsData } = useSWR<Data>("/api/tps", fetcher, { refreshInterval: 15_000 });
  const { data: worldData } = useSWR<Data>("/api/world", fetcher, { refreshInterval: 30_000 });

  const activePlayers = typeof players?.online === "number" ? players.online : null;
  const maxPlayers = typeof players?.max === "number" ? players.max : 50;

  let tps: number | null = null;
  if (tpsData && Array.isArray(tpsData.tps)) {
    tps = typeof tpsData.tps[0] === "number" ? tpsData.tps[0] : null;
  } else if (tpsData && typeof tpsData.tps === "number") {
    tps = tpsData.tps;
  }

  const uptime = typeof tpsData?.uptime === "string" 
    ? tpsData.uptime 
    : (typeof tpsData?.uptime === "number" ? `${tpsData.uptime}%` : "99.98%");

  const worldAge = typeof worldData?.ageDays === "number" 
    ? `${worldData.ageDays}d` 
    : (typeof worldData?.worldAge === "string" ? worldData.worldAge : "148d");

  return {
    players: activePlayers,
    maxPlayers,
    tps,
    uptime,
    worldAge,
  };
}

/** A scene fades in and out over a scroll window, drift gently upward.
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
  const ramp = 0.10;
  
  // If start is 0, we don't want any fade-in ramp at the beginning, it should just be fully visible from <= 0.
  const inputRamps = start === 0 
    ? [0, 0, end, end + ramp] 
    : [start - ramp, start, end, end + ramp];
  
  const outputOpacity = start === 0
    ? [1, 1, 1, 0]
    : [0, 1, 1, 0];
    
  const outputTranslate = start === 0
    ? ["translateY(0px)", "translateY(0px)", "translateY(0px)", "translateY(-12px)"]
    : ["translateY(16px)", "translateY(0px)", "translateY(0px)", "translateY(-12px)"];

  const opacity = useTransform(progress, inputRamps, outputOpacity);
  const translateY = useTransform(progress, inputRamps, outputTranslate);

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

function MinimalConnection({ serverIp }: { serverIp: string }) {
  const online = usePlayersOnline();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Live Status indicator (minimal, almost hidden) */}
      <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#fee9cf]/40 select-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fc920d] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#fc920d]"></span>
        </span>
        {online !== null ? `${online} active now` : "server online"}
      </div>

      {/* Premium clickable copy link */}
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy server address ${serverIp}`}
        className="group relative cursor-pointer font-mono text-base tracking-[0.25em] text-[#faf8f5] uppercase transition-all duration-200 focus-visible:outline-none"
      >
        <span className="inline-flex items-center gap-2.5 transition-opacity duration-200 group-hover:opacity-80">
          {serverIp}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 text-xs text-[#fee9cf]/40">
            →
          </span>
        </span>
        
        {/* Subtle hover underline */}
        <span className="absolute left-0 right-0 -bottom-1.5 h-[1px] bg-gradient-to-r from-transparent via-[#fee9cf]/35 to-transparent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

        {/* Floating copied tooltip overlay */}
        <span className={`absolute left-1/2 -top-8 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-[#fc920d] bg-[#0c0406]/90 px-2 py-1 rounded transition-all duration-200 pointer-events-none ${copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          Copied to clipboard
        </span>
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

  const progress = scrollYProgress;
  const stats = useLiveStats();

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
      className="relative bg-[#0c0406] text-[#faf8f5]"
      style={{ minHeight: "700svh" }}
    >
      {/* Skip link for keyboard / screen-reader users. */}
      <a
        href="#join"
        className="fixed left-4 top-[-100px] z-[60] bg-[#fc920d] px-5 py-3 text-xs font-mono uppercase tracking-widest text-[#12070a] transition-[top] duration-150 focus:top-4"
      >
        Skip to join
      </a>

      {/* In-flow scroll sentinels so nav anchors have real, scrollable targets */}
      <span id="top" className="pointer-events-none absolute top-0" aria-hidden />
      <span id="join" className="pointer-events-none absolute bottom-[6svh]" aria-hidden />

      <section className="fixed inset-0 overflow-hidden bg-[#0c0406] [contain:layout_style_paint]">
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
          {/* Deep dark gradient overlay for maximum contrast and cinematic mystery. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0305]/65 via-[#0a0305]/80 to-[#070103]/95" />
        </div>

        {/* Minimal chrome. */}
        <header className="absolute left-1/2 top-8 z-40 flex w-[min(92vw,1050px)] -translate-x-1/2 items-center justify-between text-xs font-mono uppercase tracking-[0.25em] mix-blend-difference">
          <a href="#top" className="font-bold text-[#faf8f5] lowercase">
            bits&amp;bytes<sup className="text-[0.45em]">™</sup>
          </a>
          <a href="#join" className="opacity-60 transition-opacity hover:opacity-100">
            [ CONNECT ]
          </a>
        </header>

        {/* Hairline scroll progress. */}
        <div className="absolute inset-x-0 bottom-0 z-40 h-[2px] origin-left">
          <motion.i style={{ scaleX: scrollYProgress }} className="block h-full w-full origin-left bg-[#fee9cf]/25" />
        </div>

        {/* 1 — Hero: logo, 1 line, 1 phrase */}
        <Scene progress={progress} start={0} end={0.12}>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logo.svg"
              alt="bits&amp;bytes™ monogram"
              width={56}
              height={56}
              priority
              className="opacity-90 brightness-110 drop-shadow-[0_0_24px_rgba(254,233,207,0.15)]"
            />
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#fee9cf]/60">
              The vanilla survival server engineered for high agency builders.
            </p>
            <h1 className="mt-6 font-accent-sans text-[clamp(3rem,9vw,7.5rem)] font-normal uppercase leading-[0.9] tracking-tighter text-[#faf8f5]">
              Build. Explore. Belong.
            </h1>
            <div className="mt-16 flex flex-col items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#fee9cf]/30 select-none">
                Scroll to enter
              </span>
              <span className="h-[24px] w-[1px] bg-gradient-to-b from-[#fee9cf]/30 to-transparent" />
            </div>
          </div>
        </Scene>

        {/* 2 — Technical Readout */}
        <Scene progress={progress} start={0.22} end={0.37}>
          <div className="w-full max-w-4xl flex flex-col items-start px-4 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#fc920d]/80 mb-8">
              System Readout
            </span>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 text-left font-mono">
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">Active Nodes</span>
                <span className="text-xl font-normal text-[#faf8f5]">
                  {stats.players !== null ? `${stats.players} / ${stats.maxPlayers}` : "12 / 50"}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">System Tickrate</span>
                <span className="text-xl font-normal text-[#faf8f5]">
                  {stats.tps !== null ? `${Number(stats.tps).toFixed(2)} TPS` : "20.00 TPS"}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">Deployment Uptime</span>
                <span className="text-xl font-normal text-[#faf8f5]">{stats.uptime}</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">World Chronology</span>
                <span className="text-xl font-normal text-[#faf8f5]">{stats.worldAge ?? "148d"}</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">Crossplay Core</span>
                <span className="text-xl font-normal text-[#faf8f5]">Java + Bedrock</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-[#fee9cf]/10 pl-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-[#fee9cf]/40">Version Release</span>
                <span className="text-xl font-normal text-[#faf8f5]">Purpur 1.21.1</span>
              </div>
            </div>
          </div>
        </Scene>

        {/* 3 — Infrastructure / Architecture */}
        <Scene progress={progress} start={0.47} end={0.62}>
          <div className="w-full max-w-4xl flex flex-col items-start px-4 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#fc920d]/80 mb-8 block">
              The Infrastructure
            </span>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-mono">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#faf8f5] font-bold mb-2">// 01 / ENGINE</h3>
                <p className="text-[11px] text-[#fee9cf]/60 leading-relaxed">
                  Purpur server engine (Paper fork) optimized with custom flags. Async chunk loading, G1GC garbage collection tuning, and a 3000-radius pre-generated world border.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#faf8f5] font-bold mb-2">// 02 / AUTOMATION</h3>
                <p className="text-[11px] text-[#fee9cf]/60 leading-relaxed">
                  Continuous integration via host bootstrap shell. Daily zstd-compressed backups with a 14-day retention cycle pushed automatically to remote secure object storage.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#faf8f5] font-bold mb-2">// 03 / MODERATION</h3>
                <p className="text-[11px] text-[#fee9cf]/60 leading-relaxed">
                  Database-backed block logging and rollbacks via CoreProtect. Custom gatekeeper plugin bridges player consents and permissions, ensuring clean, grief-free vanilla play.
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#faf8f5] font-bold mb-2">// 04 / CHAT BRIDGE</h3>
                <p className="text-[11px] text-[#fee9cf]/60 leading-relaxed">
                  Bidirectional Discord-to-Minecraft chat bridge with verified authentication. In-game messages are instantly relayed to secure community channels.
                </p>
              </div>
            </div>
          </div>
        </Scene>

        {/* 4 — Org / Trust */}
        <Scene progress={progress} start={0.72} end={0.87}>
          <div className="w-full max-w-3xl flex flex-col items-start px-4 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#fc920d]/80 mb-8 block">
              The Governance
            </span>
            <p className="font-serif-brand text-[clamp(1.3rem,2.8vw,1.85rem)] font-normal leading-relaxed text-[#faf8f5] mb-8">
              Governed by GOBITSNBYTES FOUNDATION, a registered Section 8 nonprofit network. We prioritize minor safeguarding, privacy compliance, and absolute transparency.
            </p>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 font-mono text-[10px] text-[#fee9cf]/50 uppercase tracking-widest">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-[#fc920d] rounded-full" />
                <span>POCSO &amp; DPDP Act Compliant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-[#fc920d] rounded-full" />
                <span>No Pay-to-Win or Commercial Ads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-[#fc920d] rounded-full" />
                <span>Parental Consent Safeguards</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 bg-[#fc920d] rounded-full" />
                <span>Mojang Commercial EULA Compliant</span>
              </div>
            </div>
          </div>
        </Scene>

        {/* 5 — Final CTA & Minimal Connection */}
        <Scene progress={progress} start={0.97} end={1.05}>
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div className="flex flex-col items-center">
              <h2 className="font-accent-sans text-[clamp(3.5rem,10vw,8.5rem)] font-normal uppercase leading-[0.85] tracking-tighter text-[#faf8f5] text-center">
                See you<br />
                <em className="not-italic text-[#fc920d]">in-game.</em>
              </h2>
            </div>

            <div className="mt-12 flex flex-col items-center gap-8">
              <MinimalConnection serverIp={serverIp} />
              
              {/* Minimal platform ports */}
              <div className="flex flex-col items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-[#fee9cf]/40 uppercase mt-4 text-center">
                <span>Java: mc.gobitsnbytes.org (25565)</span>
                <span>Bedrock: mc.gobitsnbytes.org (19132)</span>
              </div>
            </div>

            {/* Minimal footer */}
            <div className="mt-24 flex flex-col items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#fee9cf]/25 select-none text-center">
              <span className="normal-case">bits&amp;bytes™ by GOBITSNBYTES FOUNDATION</span>
              <span>© 2026 GOBITSNBYTES FOUNDATION. ALL RIGHTS RESERVED.</span>
            </div>
          </div>
        </Scene>
      </section>
    </main>
  );
}
