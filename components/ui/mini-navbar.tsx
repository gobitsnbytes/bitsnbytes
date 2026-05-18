"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import logo from "@public/logo.svg";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/impact", label: "Impact" },
    { href: "/qna", label: "QnA" },
];

const AnimatedNavLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => {
    const defaultTextColor = "text-white/60";
    const hoverTextColor = "text-white";
    const textSizeClass = "text-sm";

    return (
        <Link
            href={href}
            className={cn(
                "group relative inline-block overflow-hidden h-5 font-medium transition-colors",
                textSizeClass
            )}
        >
            <div className="flex flex-col transition-transform duration-500 ease-out transform group-hover:-translate-y-1/2">
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
    const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
    const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (shapeTimeoutRef.current) {
            clearTimeout(shapeTimeoutRef.current);
        }

        if (isOpen) {
            setHeaderShapeClass("rounded-2xl");
        } else {
            shapeTimeoutRef.current = setTimeout(() => {
                setHeaderShapeClass("rounded-full");
            }, 300);
        }

        return () => {
            if (shapeTimeoutRef.current) {
                clearTimeout(shapeTimeoutRef.current);
            }
        };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const loginButtonElement = (
        <Link
            href="https://github.com/gobitsnbytes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold border border-white/10 bg-white/5 text-white/70 rounded-full hover:border-white/30 hover:text-white transition-transform transition-colors transition-opacity duration-200 w-full md:w-auto"
        >
            <Github className="w-3.5 h-3.5" />
            GitHub
        </Link>
    );

    const signupButtonElement = (
        <div className="relative group w-full md:w-auto">
            <div
                className="absolute inset-0 -m-2 rounded-full
                     hidden md:block
                     bg-[var(--brand-pink)]
                     opacity-20 filter blur-lg pointer-events-none
                     transition-transform transition-colors transition-opacity duration-300 ease-out
                     group-hover:opacity-40 group-hover:blur-xl group-hover:-m-3"
            ></div>
            <Link
                href="/join"
                className="relative z-10 flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-black text-white bg-[var(--brand-pink)] rounded-full hover:brightness-110 active:scale-95 transition-transform transition-colors transition-opacity duration-200 w-full md:w-auto"
            >
                Join Now
                <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );

    return (
        <header suppressHydrationWarning={true}
            className={cn(
                "fixed top-6 z-50",
                "flex flex-col items-center",
                "px-4 md:px-6 py-2.5",
                "backdrop-blur-none md:backdrop-blur-lg", // Disable blur on mobile for performance
                headerShapeClass,
                "border border-white/10 bg-black/95 md:bg-black/70 shadow-2xl",
                // Positioning: fixed padding on mobile, centered on desktop
                "left-4 right-4 md:left-1/2 md:right-auto md:w-auto",
                "transform translate-x-0 md:-translate-x-1/2",
                "transition-[border-radius,background-color,left,right,transform] duration-300 ease",
                "will-change-transform" // Hardware acceleration hint
            )}
        >
            <div className="flex items-center justify-between w-full gap-x-6 md:gap-x-10">
                <Link href="/" className="flex items-center">
                    <div className="relative h-8 w-8 flex items-center justify-center rounded-lg bg-white overflow-hidden p-1.5">
                        <Image
                            src={logo}
                            alt="Bits&Bytes logo"
                            width={20}
                            height={20}
                            className="object-contain invert"
                        />
                    </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
                    {NAV_LINKS.map((link) => (
                        <AnimatedNavLink key={link.href} href={link.href}>
                            {link.label}
                        </AnimatedNavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    {loginButtonElement}
                    {signupButtonElement}
                </div>

                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-all focus:outline-none active:scale-90 relative overflow-hidden"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close Menu" : "Open Menu"}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? "close" : "open"}
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="flex items-center justify-center"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden flex flex-col items-center w-full overflow-hidden"
                    >
                        <nav className="flex flex-col items-center space-y-4 w-full pt-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-lg font-bold transition-colors w-full text-center py-2",
                                        pathname === link.href ? "text-[var(--brand-pink)]" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col items-center gap-3 mt-6 pb-4 w-full">
                            {signupButtonElement}
                            {loginButtonElement}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
