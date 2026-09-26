import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Colour plate blended over the grayscale photo. burgundy = burgundy ink on white (screen);
// orange = black ink on orange stock (multiply).
const PLATE = {
  none: null,
  halftone: null,
  burgundy: "bg-burgundy mix-blend-screen",
  orange: "bg-orange mix-blend-multiply",
} as const;

export type HalftoneImageProps = {
  src: ImageProps["src"];
  alt: string;
  sizes: string;
  /** Above-the-fold image: preloads it (next/image `preload`). */
  priority?: boolean;
  /** none: plain photo in the frame. halftone: grayscale + dot screen. burgundy/orange: duotone + dot screen. */
  tone?: keyof typeof PLATE;
  /** Frame classes; set the aspect ratio here (default aspect-[4/3]). */
  className?: string;
};

/** next/image in a hard ink frame with an optional print treatment. */
export function HalftoneImage({ src, alt, sizes, priority = false, tone = "halftone", className }: HalftoneImageProps) {
  const printed = tone !== "none";
  const plate = PLATE[tone];
  return (
    <div
      className={cn(
        "relative isolate aspect-[4/3] overflow-hidden border-3 border-line bg-paper-2 shadow-[6px_6px_0_0_var(--shadow-color)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        fill
        preload={priority}
        className={cn("object-cover", printed && "grayscale contrast-125")}
      />
      {plate ? <span aria-hidden className={cn("pointer-events-none absolute inset-0", plate)} /> : null}
      {printed ? (
        <span aria-hidden className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" />
      ) : null}
    </div>
  );
}
