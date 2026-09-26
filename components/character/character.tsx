"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMotionEnabled } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

/** The CTO avatar poses in public/character, with their intrinsic sizes (full body 1024×1536, busts 1254×1254). */
export const POSES = {
  wave: [1024, 1536],
  "point-down": [1024, 1536],
  idle: [1024, 1536],
  door: [1024, 1536],
  fork: [1024, 1536],
  megaphone: [1024, 1536],
  clapper: [1024, 1536],
  typing: [1024, 1536],
  headset: [1254, 1254],
  thinking: [1254, 1254],
} as const;

export type Pose = keyof typeof POSES;

/** Print Riot sticker finish: cream cut-out outline + hard ink offset shadow (0-blur drop-shadows). */
const STICKER =
  "drop-shadow(2px 0 0 var(--cream)) drop-shadow(-2px 0 0 var(--cream)) drop-shadow(0 2px 0 var(--cream)) drop-shadow(0 -2px 0 var(--cream)) drop-shadow(5px 5px 0 var(--ink))";

type Props = {
  pose: Pose;
  /** Wrapper classes: set the width (height follows the intrinsic ratio, so no CLS) and responsive visibility. */
  className?: string;
  /** Rendered width hint for next/image, e.g. "160px" or "(min-width: 1024px) 12vw, 0px". */
  sizes: string;
  /** Above the fold: load eagerly. */
  priority?: boolean;
  /** Skip the pop-up entrance (small avatars). */
  still?: boolean;
  /** Skip the sticker outline (tiny avatars inside a framed circle). */
  plain?: boolean;
  imgClassName?: string;
};

/** Decorative avatar. Pops up with a spring when it scrolls into view; static under reduced motion / motion off. */
export function Character({ pose, className, sizes, priority, still, plain, imgClassName }: Props) {
  const motionOn = useMotionEnabled() && !still;
  const [width, height] = POSES[pose];
  const img = (
    <Image
      src={`/character/${pose}.webp`}
      alt=""
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      draggable={false}
      className={cn("block h-auto w-full select-none", imgClassName)}
      style={plain ? undefined : { filter: STICKER }}
    />
  );

  if (!motionOn) {
    return (
      <div aria-hidden="true" className={className}>
        {img}
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0, y: "40%", rotate: -3, clipPath: "inset(0% -10% 40% -10%)" }}
      whileInView={{ opacity: 1, y: "0%", rotate: 0, clipPath: "inset(-10% -10% -10% -10%)" }}
      whileHover={{ rotate: -3, scale: 1.03 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.9 }}
    >
      {img}
    </motion.div>
  );
}
