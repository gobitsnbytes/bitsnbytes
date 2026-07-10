"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // These routes pin a full-viewport `position: fixed` stage. The transform on
  // the motion.div below would become their containing block and break the
  // fixed positioning, so they opt out of the page transition entirely.
  const isPosterRoute = pathname === "/fork";
  const isCinematicRoute = pathname === "/minecraft";

  if (isPosterRoute || isCinematicRoute) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
      animate={{ opacity: 1, transform: "translateY(0)" }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

