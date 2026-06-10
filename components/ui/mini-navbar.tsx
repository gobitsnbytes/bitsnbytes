"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Github } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
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
    const defaultTextColor = isActive ? "text-[#97192c] font-black" : "text-[#120f0a]/70 font-bold";
    const hoverTextColor = "text-[#97192c] font-black";

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
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold border-2 border-[#120f0a] bg-white text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none w-full md:w-auto font-mono"
        >
            <Github className="w-3.5 h-3.5" />
            GitHub
        </Link>
    );

    const signupButtonElement = (
        <Link
            href="/join"
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-black border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none w-full md:w-auto uppercase tracking-wider"
        >
            Join Now
            <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
    );

    return (
        <header suppressHydrationWarning={true}
            className={cn(
                "fixed top-6 z-50",
                "flex flex-col items-center",
                "px-5 py-2.5",
                "rounded-none",
                "border-3 border-[#120f0a]",
                "bg-[#eae8e4] text-[#120f0a]",
                "shadow-[4px_4px_0px_0px_#120f0a]",
                // Positioning: fixed padding on mobile, centered on desktop
                "left-4 right-4 md:left-1/2 md:right-auto md:w-auto",
                "transform translate-x-0 md:-translate-x-1/2",
                "transition-[border-radius,background-color,left,right,transform] duration-300 ease",
                "will-change-transform"
            )}
        >
            <div className="flex items-center justify-between w-full gap-x-6 md:gap-x-10">
                <Link href="/" className="flex items-center">
                    <div className="relative flex h-9 w-9 items-center justify-center border-2 border-[#120f0a] bg-white p-1 shadow-[2px_2px_0px_0px_#120f0a] rounded-none hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] transition-all">
                        <Image
                            src="/logo.svg"
                            alt="bits&bytes™ logo"
                            width={26}
                            height={26}
                            className="object-contain"
                        />
                    </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
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

                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    {loginButtonElement}
                    {signupButtonElement}
                </div>

                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-[#120f0a] bg-white text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] focus:outline-none active:translate-y-0.5 active:shadow-none transition-all relative overflow-hidden"
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

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden flex flex-col items-center w-full overflow-hidden"
                    >
                        <nav className="flex flex-col items-center space-y-3 w-full pt-6 border-t border-[#120f0a]/10 mt-3">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-base font-black uppercase tracking-tight transition-colors w-full text-center py-2",
                                            isActive ? "text-[#97192c]" : "text-[#120f0a] hover:text-[#fc920d]"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
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

export default MiniNavbar;
