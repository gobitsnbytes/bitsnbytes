"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const howItWorks = [
  ["01", "one city", "one fork"],
  ["02", "student-led", "always"],
  ["03", "local identity", "shared mission"],
  ["04", "ship publicly", "within 90 days"],
  ["05", "core support", "without hand-holding"],
];

const benefits = [
  "brand resources",
  "fork playbook",
  "website structure",
  "council support",
  "launch kit",
  "templates + assets",
];

function Texture() {
  return (
    <>
      <div className="absolute inset-0 bg-[#97192C]" aria-hidden />
      <div
        className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_18%_20%,rgba(18,15,10,0.2),transparent_22%),radial-gradient(circle_at_82%_76%,rgba(252,146,13,0.12),transparent_20%),linear-gradient(90deg,rgba(18,15,10,0.08),transparent_40%,rgba(208,207,206,0.05))]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-halftone opacity-25 mix-blend-soft-light" aria-hidden />
      <div className="absolute inset-0 bg-noise-texture opacity-55 mix-blend-overlay" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(106deg,transparent_0%,transparent_48%,rgba(208,207,206,0.24)_49%,transparent_50%,transparent_100%),linear-gradient(8deg,transparent_0%,transparent_59%,rgba(18,15,10,0.34)_60%,transparent_61%,transparent_100%)]"
        aria-hidden
      />
    </>
  );
}

function PosterWord({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 0.45], ["0vh", "-22vh"]);
  const opacity = useTransform(progress, [0, 0.6], [0.56, 0.08]);
  const scale = useTransform(progress, [0, 0.5], [1, 1.08]);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="pointer-events-none absolute -left-[6vw] top-[8vh] z-0 font-display text-[24vw] font-black uppercase leading-[0.72] tracking-[-0.12em] text-[#120F0A]"
      aria-hidden
    >
      FORKS
    </motion.div>
  );
}

function PaperCard({
  progress,
  start,
  end,
  className,
  children,
  rotateFrom = -2,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  className: string;
  children: ReactNode;
  rotateFrom?: number;
}) {
  const opacity = useTransform(progress, [start - 0.04, start, end, end + 0.04], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.04, start], ["12vh", "0vh"]);
  const rotate = useTransform(progress, [start - 0.04, start], [rotateFrom, 0]);
  const scale = useTransform(progress, [start - 0.04, start], [0.96, 1]);

  return (
    <motion.div style={{ opacity, y, rotate, scale, perspective: 1000 }} className={className}>
      <div className="absolute inset-0 bg-noise-texture opacity-25 mix-blend-multiply" aria-hidden />
      <div className="relative h-full w-full">{children}</div>
    </motion.div>
  );
}

function PastedCard({
  number,
  title,
  line,
  index,
  exit,
  progress,
}: {
  number: string;
  title: string;
  line: string;
  index: number;
  exit: number;
  progress: MotionValue<number>;
}) {
  const start = 0.33 + index * 0.028;
  const opacity = useTransform(progress, [start, start + 0.035, exit, exit + 0.04], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.04], ["9vh", "0vh"]);
  const rotate = useTransform(progress, [start, start + 0.04], [index % 2 ? 3 : -3, index % 2 ? -1 : 1]);

  return (
    <motion.div
      style={{ opacity, y, rotate }}
      className="relative min-h-[10.5rem] overflow-hidden bg-[#D0CFCE] p-4 text-[#120F0A] shadow-[9px_9px_0_#120F0A]"
    >
      <div className="absolute inset-0 bg-noise-texture opacity-25 mix-blend-multiply" aria-hidden />
      <div className="relative">
        <p className="font-mono text-xs font-black text-[#97192C]">{number}</p>
        <h3 className="mt-4 text-balance font-display text-[clamp(1.35rem,2.35vw,2.15rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]">
          {title}
        </h3>
        <p className="mt-3 font-serif-brand text-base leading-tight text-[#120F0A]/78">{line}</p>
      </div>
    </motion.div>
  );
}

function HowItWorksMobile({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.31, 0.36, 0.49, 0.54], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.31, 0.36], ["8vh", "0vh"]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-4 top-[max(5rem,10svh)] z-40 bg-[#D0CFCE] p-4 text-[#120F0A] shadow-[9px_9px_0_#120F0A] md:hidden"
    >
      <div className="absolute inset-0 bg-noise-texture opacity-25 mix-blend-multiply" aria-hidden />
      <div className="relative">
        <p className="w-fit bg-[#120F0A] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#FC920D]">
          how it works
        </p>
        <div className="mt-4 grid gap-2">
          {howItWorks.map(([number, title, line]) => (
            <div key={number} className="grid grid-cols-[2.2rem_1fr] gap-3 border-t border-[#120F0A]/20 py-3 first:border-t-0">
              <span className="font-mono text-xs font-black text-[#97192C]">{number}</span>
              <div>
                <h3 className="font-display text-[clamp(1.35rem,8vw,2rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]">
                  {title}
                </h3>
                <p className="mt-1 font-serif-brand text-base leading-tight text-[#120F0A]/75">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function BenefitLabel({ item, index, progress }: { item: string; index: number; progress: MotionValue<number> }) {
  const start = 0.61 + index * 0.016;
  const opacity = useTransform(progress, [start, start + 0.03, 0.72, 0.75], [0, 1, 1, 0]);
  const x = useTransform(progress, [start, start + 0.03], [index % 2 ? 60 : -60, 0]);
  const rotate = index % 2 ? -2 : 2;

  return (
    <motion.div
      style={{ opacity, x, rotate }}
      className="bg-[#D0CFCE] px-4 py-3 font-display text-[clamp(1.15rem,2.35vw,2.15rem)] font-black uppercase leading-[0.95] tracking-[-0.035em] text-[#120F0A] shadow-[8px_8px_0_#120F0A]"
    >
      {item}
    </motion.div>
  );
}

function BenefitsMobile({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.59, 0.63, 0.72, 0.75], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.59, 0.63], ["8vh", "0vh"]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-4 top-[max(5rem,10svh)] z-40 bg-[#120F0A] p-4 text-[#D0CFCE] shadow-[9px_9px_0_#FC920D] md:hidden"
    >
      <p className="mb-4 w-fit bg-[#D0CFCE] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#120F0A]">
        what forks get
      </p>
      <div className="grid gap-2">
        {benefits.map((item) => (
          <div key={item} className="bg-[#D0CFCE] px-3 py-3 font-display text-[clamp(1.35rem,8vw,2.2rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#120F0A]">
            {item}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const forksData = {
  noida: {
    filename: "noida.json",
    city: "Noida",
    lead: "Aryan Chauhan",
  },
  bangalore: {
    filename: "bangalore.json",
    city: "Bangalore",
    lead: "Sparsh Sharma",
  },
  jaipur: {
    filename: "jaipur.json",
    city: "Jaipur",
    lead: "Shreyas Singh",
  },
  hyderabad: {
    filename: "hyderabad.json",
    city: "Hyderabad",
    lead: "Shreethan Kagitha",
  },
  kolkata: {
    filename: "kolkata.json",
    city: "Kolkata",
    lead: "Shoryavardhaan Gupta",
  },
};


function CodeEditor({ activeFork, setActiveFork }: { activeFork: keyof typeof forksData; setActiveFork: (k: keyof typeof forksData) => void }) {
  const current = forksData[activeFork];

  const lines = [
    { num: 1, content: <><span className="text-[#D0CFCE]/35">{"{"}</span></> },
    { num: 2, content: <><span className="text-[#E45A92]">"node"</span><span className="text-[#D0CFCE]/35">:</span> <span className="text-[#FC920D]">"bitsnbytes/{current.city.toLowerCase()}"</span><span className="text-[#D0CFCE]/35">,</span></> },
    { num: 3, content: <><span className="text-[#E45A92]">"lead"</span><span className="text-[#D0CFCE]/35">:</span> <span className="text-[#FC920D]">"{current.lead}"</span></> },
    { num: 4, content: <><span className="text-[#D0CFCE]/35">{"}"}</span></> },
  ];

  return (
    <div className="bg-[#0D0B07] border border-[#D0CFCE]/8 shadow-[10px_10px_0_rgba(18,15,10,0.85)] max-w-[28rem] w-full mx-auto md:mx-0 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#161210] border-b border-[#D0CFCE]/6">
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-[#97192C]/60" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#FC920D]/50" />
          <span className="block h-2.5 w-2.5 rounded-full bg-[#D0CFCE]/15" />
        </div>
        <p className="ml-2 font-mono text-[10px] text-[#D0CFCE]/30 tracking-wide">fork-manifest</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-[#D0CFCE]/6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {Object.keys(forksData).map((key) => {
          const k = key as keyof typeof forksData;
          const isSelected = activeFork === k;
          return (
            <button
              key={k}
              onClick={() => setActiveFork(k)}
              className={`font-mono text-[10px] px-3 py-1.5 transition-colors duration-100 shrink-0 border-r border-[#D0CFCE]/6 last:border-r-0 ${
                isSelected
                  ? "bg-[#0D0B07] text-[#FC920D] shadow-[inset_0_2px_0_#97192C]"
                  : "bg-[#111] text-[#D0CFCE]/30 hover:text-[#D0CFCE]/55"
              }`}
            >
              {forksData[k].filename}
            </button>
          );
        })}
      </div>

      {/* Code with line numbers */}
      <div className="font-mono text-[11px] leading-[1.7] select-none">
        {lines.map((line) => (
          <div key={line.num} className="flex">
            <span className="w-8 shrink-0 text-right pr-3 text-[#D0CFCE]/15 select-none">{line.num}</span>
            <span className={line.num > 1 && line.num < 4 ? "pl-4" : ""}>{line.content}</span>
          </div>
        ))}
        <div className="flex">
          <span className="w-8 shrink-0 text-right pr-3 text-[#D0CFCE]/15 select-none">5</span>
          <span className="inline-block w-[2px] h-3.5 bg-[#FC920D]/70 animate-pulse" />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#97192C]/90 border-t border-[#D0CFCE]/6">
        <span className="font-mono text-[9px] text-[#D0CFCE]/70 tracking-wide uppercase">json</span>
        <span className="font-mono text-[9px] text-[#D0CFCE]/50">Ln 5, Col 1</span>
      </div>
    </div>
  );
}

export function ForkScroll({ applyUrl }: { applyUrl: string }) {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    mass: 0.5,
  });

  const [activeFork, setActiveFork] = useState<keyof typeof forksData>("noida");

  // Card 3D Tilt effect
  const cardRotateX = useSpring(0, { stiffness: 100, damping: 20 });
  const cardRotateY = useSpring(0, { stiffness: 100, damping: 20 });

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Map coordinate space to tilt degrees (e.g. max 15deg)
    cardRotateX.set(-y / (rect.height / 30));
    cardRotateY.set(x / (rect.width / 30));
  };

  const handleCardPointerLeave = () => {
    cardRotateX.set(0);
    cardRotateY.set(0);
  };

  const openingOpacity = useTransform(smoothProgress, [0, 0.13, 0.22], [1, 1, 0]);
  const openingY = useTransform(smoothProgress, [0, 0.22], ["0vh", "-16vh"]);
  const openingRotate = useTransform(smoothProgress, [0, 0.22], [0, 5]);
  const logoReveal = useTransform(smoothProgress, [0.16, 0.28], [0, 1]);
  const logoRevealY = useTransform(smoothProgress, [0.16, 0.28], ["1.5rem", "0rem"]);
  const howTitleOpacity = useTransform(smoothProgress, [0.3, 0.34, 0.48, 0.53], [0, 1, 1, 0]);
  const manifestoOpacity = useTransform(smoothProgress, [0.52, 0.58, 0.64, 0.69], [0, 1, 1, 0]);
  const manifestoY = useTransform(smoothProgress, [0.5, 0.58], ["12vh", "0vh"]);
  const finalOpacity = useTransform(smoothProgress, [0.82, 0.94], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.82, 1], ["14vh", "0vh"]);

  return (
    <main className="relative overflow-x-hidden bg-[#97192C] text-[#D0CFCE]" style={{ minHeight: "780svh" }}>
      <section className="fixed inset-0 h-[100svh] overflow-hidden bg-[#97192C]">
        <Texture />
        <PosterWord progress={smoothProgress} />
        <div
          className="pointer-events-none absolute -bottom-[10vw] right-[-7vw] z-0 hidden font-display text-[31vw] font-black uppercase leading-none tracking-[-0.12em] text-[#120F0A]/12 md:block"
          aria-hidden
        >
          LEAD
        </div>

        <motion.div
          style={{ opacity: openingOpacity, y: openingY, rotate: openingRotate }}
          className="absolute left-1/2 top-[max(5.25rem,18svh)] z-40 w-[min(90vw,52rem)] -translate-x-1/2 bg-[#D0CFCE] p-4 text-right text-[#120F0A] shadow-[10px_10px_0_#120F0A] sm:p-5 md:top-[30vh] md:p-8 md:shadow-[14px_14px_0_#120F0A]"
        >
          <div className="absolute inset-0 bg-noise-texture opacity-25 mix-blend-multiply" aria-hidden />
          <div className="relative">
            <h1 className="font-display text-[clamp(2.45rem,14vw,6.7rem)] font-black leading-[0.86] tracking-[-0.055em] md:leading-[0.82] md:tracking-[-0.07em]">
              no student
              <br />
              tech scene in
              <br />
              your city<span className="text-[#97192C]">?</span>
              <br />
              fork one<span className="text-[#97192C]">.</span>
            </h1>
            <p className="mt-4 font-serif-brand text-[clamp(1.2rem,6vw,2.55rem)] leading-tight tracking-[-0.03em] md:leading-none md:tracking-[-0.04em]">
              Build with people.
              <br />
              Ship publicly.
            </p>
            <div className="mt-5 bg-[#120F0A] px-4 py-3 text-left md:mt-7">
              <p className="whitespace-nowrap font-display text-[clamp(1.45rem,3.4vw,2.95rem)] font-black leading-none tracking-[-0.045em] text-[#D0CFCE]">
                bits&amp;bytes forks
              </p>
            </div>
          </div>
        </motion.div>

        <PaperCard
          progress={smoothProgress}
          start={0.17}
          end={0.29}
          className="absolute inset-x-4 top-[max(5rem,10svh)] z-40 mx-auto w-auto max-w-[39rem] overflow-hidden bg-[#D0CFCE] p-4 text-[#120F0A] shadow-[10px_10px_0_#120F0A] md:left-auto md:right-[6vw] md:top-[14vh] md:mx-0 md:w-[min(82vw,39rem)] md:p-7 md:shadow-[12px_12px_0_#120F0A]"
          rotateFrom={3}
        >
          <motion.div 
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: "preserve-3d" }}
            className="w-full h-full relative"
          >
            <p className="w-fit bg-[#120F0A] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FC920D]">
              identity reveal
            </p>
            <motion.div style={{ opacity: logoReveal, y: logoRevealY }} className="mt-5 flex min-w-0 flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#120F0A] p-2.5 shadow-[6px_6px_0_#97192C] sm:h-20 sm:w-20 md:h-24 md:w-24 md:p-3 sm:shadow-[8px_8px_0_#97192C]">
                <Image src="/logo.svg" alt="bits&bytes logo" width={92} height={92} className="h-full w-full object-contain" />
              </div>
              <p className="min-w-0 whitespace-nowrap font-display text-[clamp(1.65rem,7vw,4rem)] font-black leading-none tracking-[-0.035em] text-[#120F0A] max-[390px]:text-[1.45rem]">
                bits&amp;bytes
              </p>
            </motion.div>
            <p className="mt-5 max-w-lg text-pretty font-serif-brand text-[clamp(1.08rem,5.1vw,2rem)] leading-tight text-[#120F0A]/82 md:text-[clamp(1.35rem,2.5vw,2rem)]">
              Not a chapter. Not a franchise. A fork: same mission, different build.
            </p>
          </motion.div>
        </PaperCard>

        <motion.div
          style={{ opacity: howTitleOpacity }}
          className="absolute left-[4vw] top-[8vh] z-40 hidden bg-[#120F0A] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FC920D] shadow-[6px_6px_0_rgba(18,15,10,0.35)] md:block"
        >
          how it works
        </motion.div>
        <div className="absolute inset-x-4 top-[18vh] z-30 mx-auto hidden max-w-6xl grid-cols-5 gap-4 md:grid">
          {howItWorks.map(([number, title, line], index) => (
            <PastedCard
              key={number}
              number={number}
              title={title}
              line={line}
              index={index}
              exit={0.49}
              progress={smoothProgress}
            />
          ))}
        </div>
        <HowItWorksMobile progress={smoothProgress} />

        <motion.div
          style={{ opacity: manifestoOpacity, y: manifestoY }}
          className="absolute inset-x-4 top-[max(4.5rem,10svh)] z-40 mx-auto max-w-[70rem] md:left-[6vw] md:right-auto md:top-[14vh] md:mx-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 text-left">
              <p className="max-w-[54rem] font-display text-[clamp(3.2rem,12vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[#120F0A] drop-shadow-[5px_5px_0_rgba(208,207,206,0.18)] md:leading-[0.82] md:tracking-[-0.075em]">
                own the
                <br />
                room.
              </p>
              <div className="mt-5 bg-[#D0CFCE] p-4 text-[#120F0A] shadow-[10px_10px_0_#120F0A] md:mt-6 md:p-5 md:shadow-[12px_12px_0_#120F0A]">
                <p className="font-serif-brand text-[clamp(1.15rem,4vw,1.9rem)] leading-tight tracking-[-0.03em] md:leading-snug">
                  A fork gives your city a flag, a reason to gather, and a public record of people building for real.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-7 w-full">
              <CodeEditor activeFork={activeFork} setActiveFork={setActiveFork} />
            </div>
          </div>
        </motion.div>

        <PaperCard
          progress={smoothProgress}
          start={0.64}
          end={0.82}
          className="absolute inset-x-4 top-[10vh] z-40 mx-auto hidden max-w-6xl bg-transparent text-[#D0CFCE] md:block"
          rotateFrom={0}
        >
          <p className="mb-8 w-fit bg-[#120F0A] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FC920D] shadow-[6px_6px_0_rgba(18,15,10,0.3)]">
            what forks get
          </p>
          <div className="flex flex-wrap gap-4">
            {benefits.map((item, index) => (
              <BenefitLabel key={item} item={item} index={index} progress={smoothProgress} />
            ))}
          </div>
        </PaperCard>
        <BenefitsMobile progress={smoothProgress} />

        <motion.div
          style={{ opacity: finalOpacity, y: finalY }}
          className="absolute inset-x-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 mx-auto max-w-[64rem] bg-[#D0CFCE] p-6 text-[#120F0A] shadow-[10px_10px_0_#120F0A] md:bottom-[5vh] md:p-8 md:shadow-[14px_14px_0_#120F0A]"
        >
          <div className="absolute inset-0 bg-noise-texture opacity-25 mix-blend-multiply" aria-hidden />
          <div className="relative flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-6 flex flex-col gap-4 text-left">
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[0.9] tracking-[-0.055em]">
                  lead your
                  <br />
                  city&apos;s fork.
                </h2>
                <p className="font-serif-brand text-[clamp(1.1rem,2.2vw,1.6rem)] leading-snug tracking-[-0.02em]">
                  Apply if you can gather people, make noise, and ship in public.
                </p>
              </div>

              <div className="md:col-span-6 text-left border-t border-[#120F0A]/20 md:border-t-0 md:border-l md:border-[#120F0A]/20 pt-6 md:pt-0 md:pl-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#97192C] font-bold mb-4">
                  The Fork Covenant / Rules
                </p>
                <div className="space-y-5 font-serif-brand text-[#120F0A]/85">
                  <div>
                    <h4 className="font-display text-sm font-black uppercase tracking-wider text-[#120F0A]">
                      1. Upstream Governance
                    </h4>
                    <p className="text-xs leading-relaxed mt-1">
                      Forks are operational subunits recognized by the Board. GOBITSNBYTES FOUNDATION is the upstream steward. Forks have no independent legal personality.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-black uppercase tracking-wider text-[#120F0A]">
                      2. Centralized Financial Routing
                    </h4>
                    <p className="text-xs leading-relaxed mt-1">
                      All funds must route upstream to GOBITSNBYTES FOUNDATION. Local bank accounts, personal UPI IDs, or cash collections are strictly prohibited.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-black uppercase tracking-wider text-[#120F0A]">
                      3. No Unapproved Representation
                    </h4>
                    <p className="text-xs leading-relaxed mt-1">
                      Fork Leads and Maintainers are local facilitators and do not hold statutory authority, directorship, or the power to bind the Foundation legally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#120F0A]/10 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="bg-[#120F0A] px-5 py-3 text-left w-fit">
                <p className="whitespace-nowrap font-display text-lg font-black leading-none tracking-[-0.04em] text-[#D0CFCE]">
                  bits&amp;bytes™ forks
                </p>
              </div>
              <Link
                href={applyUrl}
                className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#FC920D] px-8 py-3 font-display text-sm font-black uppercase tracking-[0.12em] text-[#120F0A] shadow-[6px_6px_0_#120F0A] outline-none transition-all duration-100 ease-out hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#120F0A] active:translate-y-0.5 active:shadow-[2px_2px_0_#120F0A] active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-[#120F0A]"
              >
                apply now
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
