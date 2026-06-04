import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    glowColor?: "pink" | "purple" | "both" | "none";
    animated?: boolean;
    /** Animation delay for staggered reveals */
    delay?: number;
    /** Whether to disable the entrance animation */
    noEntry?: boolean;
    /** Layout ID for shared layout animations */
    layoutId?: string;
    /** Whether to enable layout transitions */
    layout?: boolean | "position" | "size" | "preserve-aspect";
    /** Enable interactive tap scaling feedback */
    interactive?: boolean;
}

export function GlassContainer({
    children,
    className,
    containerClassName,
    glowColor = "both",
    animated = true,
    delay = 0,
    noEntry = false,
    layoutId,
    layout,
    interactive = false,
}: GlassContainerProps) {
    const entryProps = noEntry ? {} : {
        initial: { opacity: 0, y: 12, filter: "blur(8px)" },
        whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
        viewport: { once: true, margin: "-50px" },
        transition: {
            type: "spring",
            duration: 0.6,
            bounce: 0,
            delay: delay,
        }
    };

    const tapProps = interactive ? {
        whileTap: { scale: 0.98 },
    } : {};

    return (
        <motion.div 
            {...entryProps}
            {...tapProps}
            layoutId={layoutId}
            layout={layout}
            className={cn(
                "group relative overflow-hidden rounded-[18px] border border-[rgba(208,207,206,0.12)] bg-[linear-gradient(145deg,rgba(151,25,44,0.18),rgba(18,15,10,0.5))] p-1.5 sm:p-2 transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-[rgba(252,146,13,0.26)] hover:shadow-[var(--glow-soft)]",
                interactive && "cursor-pointer active:scale-[0.98]",
                "md:backdrop-blur-xl", // Only apply blur on larger screens for mobile performance
                containerClassName
            )}
        >
            {/* Reflective top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />

            <div className={cn(
                "relative overflow-hidden rounded-[14px] border border-[rgba(208,207,206,0.11)] bg-[rgba(18,15,10,0.5)]",
                className
            )}>
                {/* Animated glass shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />
                {animated && (
                    <div className="absolute -inset-[100%] aspect-square bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_50%)] animate-[spin_30s_linear_infinite]" />
                )}

                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>

            {/* Ambient glows */}
            {(glowColor === "pink" || glowColor === "both") && (
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[var(--bb-burgundy-100)]/14 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            )}
            {(glowColor === "purple" || glowColor === "both") && (
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[var(--bb-orange-100)]/12 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            )}
        </motion.div>
    );
}
