import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
  as?: "section" | "div";
  bleed?: boolean;
};

export function PageSection({
  children,
  className,
  eyebrow,
  title,
  description,
  align = "left",
  as: Component = "section",
  bleed = false,
}: PageSectionProps) {
  const headingAlignment =
    align === "center" ? "items-center text-center" : "text-left";

  return (
    <Component
      data-cinematic-section
      data-cinematic-title={title ?? eyebrow}
      className={cn(
        "section-shell py-6 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
        bleed && "max-w-none px-0 sm:px-6",
        className,
      )}
    >
      {(eyebrow || title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", duration: 0.8, bounce: 0 }}
          className={cn(
            "mb-6 sm:mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3",
            headingAlignment,
          )}
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] text-[9px] font-mono tracking-widest text-[#120f0a] dark:text-[#faf8f5] px-2.5 py-1.5 select-none mb-2">
              <span className="h-1.5 w-1.5 bg-[#97192c] block animate-pulse" />
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-accent-sans text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5] select-none">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-[#120f0a]/80 dark:text-[#faf8f5]/80 font-serif-brand leading-relaxed px-2 sm:px-0 mt-1">
              {description}
            </p>
          )}
        </motion.div>
      )}
      {children}
    </Component>
  );
}

export default PageSection;
