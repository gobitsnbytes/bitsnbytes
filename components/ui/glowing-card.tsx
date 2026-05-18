"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface GlowingCardProps {
    children: React.ReactNode;
    className?: string;
    /** Custom animation delay for staggered animations */
    animationDelay?: number;
    /** Whether to show the glowing effect */
    glow?: boolean;
    /** Spread of the glow effect */
    spread?: number;
    /** Proximity to trigger the glow */
    proximity?: number;
    /** Inactive zone multiplier */
    inactiveZone?: number;
    /** Border width of the glow */
    borderWidth?: number;
    /** Card variant - affects inner styling */
    variant?: "default" | "numbered";
    /** Number index for numbered variant */
    index?: number;
}

export function GlowingCard({
    children,
    className,
    animationDelay = 0,
    glow = true,
    spread = 40,
    proximity = 64,
    inactiveZone = 0.01,
    borderWidth = 3,
}: GlowingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                duration: 0.6,
                bounce: 0,
                delay: animationDelay,
            }}
            className={cn(
                "relative min-h-[14rem] list-none h-full group",
                className
            )}
        >
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                {/* Reflective top edge */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />

                <GlowingEffect
                    spread={spread}
                    glow={glow}
                    disabled={false}
                    proximity={proximity}
                    inactiveZone={inactiveZone}
                    borderWidth={borderWidth}
                />

                <div className="relative h-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/40 p-6 md:p-8 flex flex-col justify-between gap-4">
                    {/* Inner glass shine */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

                    <div className="relative z-10 h-full">
                        {children}
                    </div>
                </div>

                {/* Ambient glows that sync with group hover */}
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--brand-pink)/10 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-(--brand-purple)/10 blur-[80px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            </div>
        </motion.div>
    );
}

interface GlowingCardIconProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardIcon({ children, className }: GlowingCardIconProps) {
    return (
        <div className={cn(
            "w-fit rounded-lg border-[0.75px] border-border bg-muted p-2",
            className
        )}>
            {children}
        </div>
    );
}

interface GlowingCardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardTitle({ children, className }: GlowingCardTitleProps) {
    return (
        <h3 className={cn(
            "pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground dark:text-white",
            className
        )}>
            {children}
        </h3>
    );
}

interface GlowingCardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function GlowingCardDescription({ children, className }: GlowingCardDescriptionProps) {
    return (
        <p className={cn(
            "font-sans text-sm leading-[1.25rem] md:text-base md:leading-[1.5rem] text-muted-foreground dark:text-white font-medium",
            className
        )}>
            {children}
        </p>
    );
}

interface GlowingCardNumberProps {
    index: number;
    className?: string;
}

export function GlowingCardNumber({ index, className }: GlowingCardNumberProps) {
    return (
        <p className={cn(
            "text-xs font-semibold uppercase tracking-[0.35em] text-[var(--brand-pink)]",
            className
        )}>
            {String(index).padStart(2, '0')}
        </p>
    );
}

export { GlowingEffect };
