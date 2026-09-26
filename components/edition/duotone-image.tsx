import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Two-plate duotone: the grayscale photo multiplies onto the light plate (white -> light),
// then the dark plate is laid on with `lighten` (black -> dark). No canvas, no filters animated.
const TONES = {
  "burgundy-orange": { light: "bg-orange", dark: "bg-burgundy" },
  "ink-orange": { light: "bg-orange", dark: "bg-ink" },
  "ink-cream": { light: "bg-cream", dark: "bg-ink" },
} as const;

export type DuotoneTone = keyof typeof TONES;

export type DuotoneImageProps = {
  src: ImageProps["src"];
  alt: string;
  sizes: string;
  /** Above-the-fold image: preloads it (next/image `preload`). */
  priority?: boolean;
  /** Shadow -> highlight plates. Default burgundy-orange. */
  tone?: DuotoneTone;
  /** Adds the print dot screen on top. Default true. */
  halftone?: boolean;
  /** Box classes. The image fills this box (object-cover), so give it a size or aspect ratio. */
  className?: string;
};

/** Real photo printed as a brand duotone (+ halftone screen): our stand-in for Editions' paintings. */
export function DuotoneImage({
  src,
  alt,
  sizes,
  priority = false,
  tone = "burgundy-orange",
  halftone = true,
  className,
}: DuotoneImageProps) {
  const plates = TONES[tone];
  return (
    <div className={cn("relative isolate overflow-hidden", plates.light, className)}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        fill
        preload={priority}
        className="object-cover mix-blend-multiply grayscale contrast-[1.15]"
      />
      <span aria-hidden className={cn("pointer-events-none absolute inset-0 mix-blend-lighten", plates.dark)} />
      {halftone ? (
        <span aria-hidden className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />
      ) : null}
    </div>
  );
}
