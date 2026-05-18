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
        "section-shell py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden",
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
            <span className="section-eyebrow text-[0.6rem] sm:text-[0.7rem] px-3 sm:px-4">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-foreground/90 font-medium px-2 sm:px-0">
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
