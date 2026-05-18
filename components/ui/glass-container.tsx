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
                "group relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 p-1.5 sm:p-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10",
                interactive && "cursor-pointer active:scale-[0.98]",
                "md:backdrop-blur-xl", // Only apply blur on larger screens for mobile performance
                containerClassName
            )}
        >
            {/* Reflective top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />

            <div className={cn(
                "relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2.25rem] border border-white/10 bg-black/20",
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
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--brand-pink)/10 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            )}
            {(glowColor === "purple" || glowColor === "both") && (
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-(--brand-purple)/10 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            )}
        </motion.div>
    );
}
