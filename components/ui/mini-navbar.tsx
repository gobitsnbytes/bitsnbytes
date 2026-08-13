"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    ArrowUpRight,
    Github,
    Map,
    Pause,
    Play,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "next-themes";
import { useExperience } from "@/components/experience-provider";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/cloud", label: "Cloud" },
    { href: "/impact", label: "Impact" },
    { href: "/qna", label: "QnA" },
    { href: "/press", label: "Press" },
];

const AnimatedNavLink = ({
    href,
    children,
    isActive,
}: {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}) => {
    const defaultTextColor = isActive 
        ? "text-primary dark:text-accent font-black" 
        : "text-foreground/70 dark:text-foreground/80 font-bold hover:text-primary dark:hover:text-accent";
    const hoverTextColor = "text-primary dark:text-accent font-black";

    return (
        <Link
            href={href}
            className={cn(
                "group relative inline-block overflow-hidden h-5 font-bold transition-colors duration-200 text-sm"
            )}
        >
            <div className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] transform group-hover:-translate-y-1/2">
                <span className={cn("flex items-center h-5", defaultTextColor)}>
                    {children}
                </span>
                <span className={cn("flex items-center h-5", hoverTextColor)}>
                    {children}
                </span>
            </div>
        </Link>
    );
};

export function MiniNavbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { motionEnabled, startTour, toggleMotion } = useExperience();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const loginButtonElement = (
        <Link
            href="https://github.com/gobitsnbytes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold border-2 border-border bg-card text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none w-full lg:w-auto font-mono"
        >
            <Github className="w-3.5 h-3.5" />
            GitHub
        </Link>
    );

    const signupButtonElement = (
        <Link
            href="/join"
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-black border-2 border-border bg-[#fc920d] text-[#120f0a] shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none w-full lg:w-auto uppercase tracking-wider"
        >
            Join Now
            <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
    );

    const experienceControls = (
        <div
            className="flex items-center gap-2"
            data-tour="experience-controls"
        >
            <button
                type="button"
                onClick={startTour}
                className="flex h-10 min-w-10 items-center justify-center gap-2 border-2 border-border bg-card px-2.5 font-mono text-[10px] font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-[transform,box-shadow,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                aria-label="Start the site tour"
                title="Start the site tour"
            >
                <Map className="h-4 w-4" aria-hidden="true" />
                <span className="hidden 2xl:inline">Tour</span>
            </button>
            <button
                type="button"
                onClick={toggleMotion}
                className="flex h-10 min-w-10 items-center justify-center border-2 border-border bg-card px-2 text-foreground shadow-[2px_2px_0px_0px_var(--border)] transition-[transform,box-shadow,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                aria-label={`${motionEnabled ? "Pause" : "Play"} immersive motion`}
                aria-pressed={!motionEnabled}
                title={`${motionEnabled ? "Pause" : "Play"} immersive motion`}
            >
                {motionEnabled ? (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Play className="h-4 w-4 translate-x-px" aria-hidden="true" />
                )}
            </button>
        </div>
    );

    return (
        <header suppressHydrationWarning={true}
            data-tour="navigation"
            className={cn(
                "fixed top-4 sm:top-6 z-50",
                "flex flex-col items-center",
                "px-4 sm:px-5 py-2.5",
                "rounded-none",
                "border-3 border-border",
                "bg-background text-foreground",
                "shadow-[4px_4px_0px_0px_var(--border)]",
                // Positioning: fixed padding on mobile, centered on desktop
                "left-3 right-3 sm:left-4 sm:right-4 md:left-1/2 md:right-auto md:w-auto md:max-w-[calc(100vw-2rem)]",
                "transform translate-x-0 md:-translate-x-1/2",
                "transition-[border-radius,background-color,left,right,transform] duration-300 ease",
                "will-change-transform"
            )}
        >
            <div className="flex items-center justify-between w-full gap-x-6 lg:gap-x-10">
                <Link href="/" className="flex items-center">
                    <div className="relative flex h-9 w-9 items-center justify-center border-2 border-border bg-card p-1 shadow-[2px_2px_0px_0px_var(--border)] rounded-none hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] transition-all">
                        <Image
                            src="/logo.svg"
                            alt="bits&bytes™ logo"
                            width={26}
                            height={26}
                            priority
                            suppressHydrationWarning
                            className="object-contain invert dark:invert-0"
                        />
                    </div>
                </Link>

                <nav className="hidden xl:flex items-center space-x-5 xl:space-x-6">
                    {NAV_LINKS.map((link) => (
                        <AnimatedNavLink 
                            key={link.href} 
                            href={link.href}
                            isActive={pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href))}
                        >
                            {link.label}
                        </AnimatedNavLink>
                    ))}
                </nav>

                <div className="hidden xl:flex items-center gap-2 xl:gap-3">
                    {experienceControls}
                    {mounted && (
                        <AnimatedThemeToggler
                            variant="star"
                            theme={theme === "dark" ? "dark" : "light"}
                            onThemeChange={(next) => setTheme(next)}
                        />
                    )}
                    {loginButtonElement}
                    {signupButtonElement}
                </div>

                <div className="flex items-center gap-2 xl:hidden">
                    {mounted && (
                        <AnimatedThemeToggler
                            variant="star"
                            theme={theme === "dark" ? "dark" : "light"}
                            onThemeChange={(next) => setTheme(next)}
                        />
                    )}
                    <button
                        className="flex items-center justify-center w-10 h-10 border-2 border-border bg-card text-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:translate-y-0.5 active:shadow-none transition-[transform,box-shadow] relative overflow-hidden"
                        onClick={toggleMenu}
                        aria-label={isOpen ? "Close Menu" : "Open Menu"}
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <div className={cn(
                                "absolute transition-all duration-200 ease-out transform",
                                isOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
                            )}>
                                <Menu className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "absolute transition-all duration-200 ease-out transform",
                                isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"
                            )}>
                                <X className="w-5 h-5" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="xl:hidden flex flex-col items-center w-full overflow-hidden"
                    >
                        <nav className="flex flex-col items-center space-y-3 w-full pt-6 border-t border-border/15 mt-3">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-base font-black uppercase tracking-tight transition-colors w-full text-center py-2",
                                            isActive ? "text-primary dark:text-accent" : "text-foreground hover:text-primary dark:hover:text-accent"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="flex flex-col items-center gap-3 mt-6 pb-4 w-full">
                            {experienceControls}
                            {signupButtonElement}
                            {loginButtonElement}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default MiniNavbar;
