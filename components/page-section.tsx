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
            <span className="inline-flex items-center justify-center border-2 border-border bg-accent text-accent-foreground text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 shadow-[2px_2px_0px_0px_var(--border)] mb-2">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-foreground font-bold px-2 sm:px-0 mt-1">
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
