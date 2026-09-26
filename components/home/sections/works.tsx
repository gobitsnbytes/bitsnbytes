"use client";

/*
 * buttermax works grid → "What we actually do" (every item and line from the old features bento).
 * 3 / 2 / 1 columns split by 2px ink bones (grid gap over an ink ground, so no doubled lines). Each cell is a
 * link whose "object" is a real event photo printed as a burgundy/orange duotone in a centred 75% box; the
 * mono label sits bottom-left, a glyph bottom-right. The cursor lens is a circle clip-path over a full-colour
 * copy of the same photo (same src + sizes, so one download), spring-follows the pointer; keyboard focus
 * opens it fully without animating. Touch: no lens, the tap is the link.
 */

import type { FocusEvent, PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { CodeXml, Lightbulb, MessagesSquare, Rocket, Users } from "lucide-react";

import { useMotionEnabled } from "@/components/experience-provider";
import { DuotoneImage } from "@/components/edition/duotone-image";
import { Chapter, ChapterHead } from "@/components/riot/chapter";
import { cn } from "@/lib/utils";

type Work = {
  ref: string;
  title: string;
  tag?: string;
  href: string;
  cursor: string;
  photo: { src: string; alt: string };
  glyph: ReactNode;
  body: ReactNode;
  extra?: ReactNode;
  wide?: boolean;
};

const ICON = "size-5";

const crew = [
  { name: "Yash Singh", role: "CEO // FOUNDER", src: "/team/yash.jpeg" },
  { name: "Akshat Kushwaha", role: "CTO // SYSTEM ARCHITECT", src: "/team/akshat.jpg" },
  { name: "Aadrika Maurya", role: "CCO & COO // NEURO RESEARCH", src: "/team/aadrika.png" },
];

const works: Work[] = [
  {
    ref: "[REF_COMMUNITY_01]",
    title: "Community",
    tag: "LIVE",
    href: "/join",
    cursor: "JOIN",
    photo: { src: "/event_pictures/byteforge2.webp", alt: "Execron 1.0 participants gathered in a classroom" },
    glyph: <MessagesSquare aria-hidden className={ICON} />,
    body: "Teen developers, designers and roboticists across India who show up to ship things.",
  },
  {
    ref: "[REF_WORKSHOPS_02]",
    title: "Workshops",
    tag: "IN HACKATHONS",
    href: "/events",
    cursor: "VIEW EVENTS",
    photo: { src: "/event_pictures/devday2.jpeg", alt: "A speaker with a microphone at GitHub Copilot Dev Days" },
    glyph: <Lightbulb aria-hidden className={ICON} />,
    body: "Dev tools, hardware interfaces and AI engineering, taught inside our hackathons while you build.",
  },
  {
    ref: "[REF_FORKS_03]",
    title: "Forks",
    tag: "CITY",
    href: "/fork",
    cursor: "VIEW FORKS",
    photo: { src: "/event_pictures/bd1.jpg", alt: "Lucknow Build Guild hardware workshop and meetup" },
    glyph: <CodeXml aria-hidden className={ICON} />,
    body: (
      <>
        Like a fork on GitHub: a city or school chapter takes the playbook from upstream, runs its own room, and
        ships back. Start one at{" "}
        <span className="font-bold underline decoration-2 underline-offset-2">gobitsnbytes.org/fork</span>
      </>
    ),
  },
  {
    ref: "[REF_INNOVATE_04]",
    title: "Innovation",
    href: "/impact",
    cursor: "VIEW IMPACT",
    photo: { src: "/event_pictures/HEe923uagAATqvy.jpg", alt: "Two builders wiring a hardware prototype at India Innovates 2026" },
    glyph: <Rocket aria-hidden className={ICON} />,
    body: "AI, distributed systems and hardware. We learn them by shipping products that use them.",
    extra: <p className="mt-3 font-mono text-[10px] font-bold tracking-[0.12em] opacity-70">[SYS_PROJ_BUILD: SUCCESS]</p>,
  },
  {
    ref: "[REF_CREW_05]",
    title: "Team & Crew",
    href: "/about",
    cursor: "VIEW TEAM",
    photo: { src: "/event_pictures/h4g/h4g3.jpg", alt: "The crew huddled around a laptop at Hack4Good v0" },
    glyph: <Users aria-hidden className={ICON} />,
    body: "Build with teen builders across India. The people who run bits&bytes™ are teenagers too.",
    extra: (
      <ul className="mt-5 grid gap-3 border-t-2 border-line pt-4">
        {crew.map((person) => (
          <li key={person.name} className="flex items-center gap-3">
            <span className="relative size-9 shrink-0 overflow-hidden border-2 border-line">
              <Image src={person.src} alt="" fill sizes="36px" className="object-cover grayscale" />
            </span>
            <span>
              <span className="block font-sans text-sm font-black uppercase leading-none tracking-[-0.01em]">
                {person.name}
              </span>
              <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">
                {person.role}
              </span>
            </span>
          </li>
        ))}
      </ul>
    ),
    wide: true,
  },
];

const OBJECT_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 37vw, 75vw";
const LENS = 120;
const SPRING = { stiffness: 500, damping: 40 };

function WorkCell({ work }: { work: Work }) {
  const motionOn = useMotionEnabled();
  const boxRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const r = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const sr = useSpring(r, { stiffness: 400, damping: 35 });
  const clipPath = useMotionTemplate`circle(${sr}px at ${sx}px ${sy}px)`;

  // Springs follow the pointer; `jump` (keyboard, reduced motion, first contact) lands without animating.
  const to = (value: MotionValue<number>, spring: MotionValue<number>, v: number, jump: boolean) => {
    value.set(v);
    if (jump || !motionOn) spring.jump(v);
  };

  const place = (event: PointerEvent<HTMLElement>, jump: boolean) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || event.pointerType === "touch") return;
    to(x, sx, event.clientX - box.left, jump);
    to(y, sy, event.clientY - box.top, jump);
  };

  const onEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    place(event, true);
    to(r, sr, LENS, false);
  };

  // Keyboard focus opens the whole colour photo at once.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || !event.currentTarget.matches(":focus-visible")) return;
    to(x, sx, box.width / 2, true);
    to(y, sy, box.height / 2, true);
    to(r, sr, box.width, true);
  };

  return (
    <Link
      href={work.href}
      data-cursor-label={work.cursor}
      onPointerEnter={onEnter}
      onPointerMove={(event) => place(event, false)}
      onPointerLeave={() => to(r, sr, 0, false)}
      onFocus={onFocus}
      onBlur={() => to(r, sr, 0, true)}
      className={cn(
        "group relative flex flex-col bg-page p-5 focus-visible:z-10 focus-visible:outline-offset-[-6px] md:p-7",
        work.wide && "md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-x-8",
      )}
    >
      <span className="mb-4 block font-mono text-[10px] font-bold tracking-[0.14em] opacity-60 md:col-span-2">
        {work.ref}
      </span>

      <div ref={boxRef} className="relative mx-auto aspect-square w-3/4">
        <DuotoneImage src={work.photo.src} alt={work.photo.alt} sizes={OBJECT_SIZES} className="absolute inset-0" />
        <motion.div aria-hidden className="absolute inset-0" style={{ clipPath }}>
          <Image src={work.photo.src} alt="" fill sizes={OBJECT_SIZES} className="object-cover" />
        </motion.div>
      </div>

      <div className={cn("mt-auto flex items-end justify-between gap-5 pt-6", work.wide && "md:mt-0 md:self-end")}>
        <div className="min-w-0">
          <h3 className="font-sans text-lg font-black uppercase leading-none tracking-[-0.01em]">
            {work.title}
            {work.tag ? (
              <sup className="ml-1.5 font-mono text-[9px] font-bold tracking-[0.14em] text-signal">{work.tag}</sup>
            ) : null}
          </h3>
          <p className="mt-2 max-w-[38ch] font-serif text-[15px] leading-snug opacity-80">{work.body}</p>
          {work.extra}
        </div>
        <span className="grid min-h-10 min-w-10 shrink-0 place-items-center border-2 border-line px-1.5">
          {work.glyph}
        </span>
      </div>
    </Link>
  );
}

export function HomeWorks() {
  return (
    <Chapter id="what-we-do" title="what we do" number={2} tone="paper" className="pb-0 pt-0 md:pb-0 md:pt-0">
      <div className="px-[4vw]">
        <ChapterHead number={2} label="What We Do" title="What we actually do" description="What we run, and who runs it." />
      </div>
      <div className="grid gap-[2px] border-y-2 border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <WorkCell key={work.ref} work={work} />
        ))}
      </div>
    </Chapter>
  );
}
