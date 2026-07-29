"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { KineticText } from "@/components/ui/kinetic-text";
import {
  Github,
  Instagram,
  Linkedin,
  MapPin,
  ShieldCheck,
} from "lucide-react";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

const DiscordIcon = ({ className, ...props }: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.894.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.92 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.197.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const TwitterIcon = ({ className, ...props }: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/gobitsbytes",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://discord.gg/rjqPfwKKTE",
    label: "Discord",
    icon: DiscordIcon,
  },
  { href: "https://github.com/gobitsnbytes", label: "GitHub", icon: Github },
  {
    href: "https://www.instagram.com/gobitsnbytes",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://x.com/gobitsnbytes",
    label: "Twitter / X",
    icon: TwitterIcon,
  },
];

const footerLinks = [
  {
    title: "Explore",
    links: [
      { id: 1, title: "About", url: "/about" },
      { id: 2, title: "Impact & Research", url: "/impact" },
      { id: 3, title: "Events & Hackathons", url: "/events" },
      { id: 4, title: "Local Hubs (Forks)", url: "/fork" },
      { id: 5, title: "Join Network", url: "/join" },
      { id: 6, title: "Press Kit & Media", url: "/press" },
    ],
  },
  {
    title: "Legal & Safety",
    links: [
      { id: 7, title: "FAQ", url: "/faq" },
      { id: 8, title: "AI Assistant", url: "/qna" },
      { id: 9, title: "Code of Conduct", url: "/coc" },
      { id: 10, title: "Terms of Service", url: "/terms" },
      { id: 11, title: "Privacy Policy", url: "/privacy" },
      { id: 12, title: "IP Policy", url: "/ip" },
    ],
  },
];

const legalLinks = [
  {
    title: "Terms",
    url: "/terms",
    label: "Participation, Forks, money, and authority",
  },
  {
    title: "Privacy",
    url: "/privacy",
    label: "Data handling, minors, and guardian requests",
  },
  {
    title: "Code of Conduct",
    url: "/coc",
    label: "Safety, reporting, enforcement, and standards",
  },
  {
    title: "IP Policy",
    url: "/ip",
    label: "Brand use, logos, open-source, and claims",
  },
  {
    title: "Press Kit",
    url: "/press",
    label: "Official logos, facts, colors, and media contact",
  },
];


export function FlickeringFooter() {
  return (
    <footer
      id="footer"
      className="w-full pb-0 mt-16 sm:mt-24 border-t-4 border-border bg-background text-foreground relative z-10 selection:bg-accent/30 selection:text-foreground"
    >
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.05] pointer-events-none z-0" />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Center Panel - Styled as a bold Neobrutalist block */}
        <div className="relative overflow-hidden border-4 border-border bg-card p-5 sm:p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--border)] rounded-none">
          <div className="relative grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 border-2 border-border bg-accent text-accent-foreground px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_var(--border)] rounded-none">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Trust Center
              </div>
              <p className="text-sm leading-relaxed text-foreground font-semibold max-w-xs">
                The public rules for a teen-led network: safety, privacy, brand stewardship, and participation standards.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="group border-3 border-border bg-card p-3 sm:p-4 text-left shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none text-foreground flex flex-col justify-between"
                >
                  <div>
                    <span className="flex items-center justify-between gap-1 text-xs sm:text-sm font-black uppercase tracking-tight text-foreground">
                      {link.title}
                      <ChevronRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-foreground/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1.5 sm:mt-2 block text-[10px] sm:text-xs leading-snug text-foreground hidden sm:block">
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap / Links Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-5 sm:p-6 md:p-10 max-w-6xl mx-auto relative z-10 gap-6 sm:gap-8 md:gap-4 mt-6 sm:mt-8">
        
        {/* Brand Description Column */}
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative grid h-10 w-10 place-items-center border-3 border-border bg-card text-foreground shadow-[3px_3px_0px_0px_var(--border)] rounded-none group-hover:bg-accent group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_var(--border)] transition-all">
              <Image
                src="/logo.svg"
                alt="bits&bytes™ logo"
                width={28}
                height={28}
                className="h-6 w-6 object-contain invert dark:invert-0"
                priority
              />
            </div>
            <div>
              <p className="font-sans text-lg font-black text-foreground leading-none uppercase tracking-tight">
                bits&bytes™
              </p>
              <p className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-primary dark:text-accent mt-0.5">
                Teen-led
              </p>
            </div>
          </Link>
          <p className="text-foreground text-sm leading-relaxed font-semibold">
            India's independent, teen-led builder network. Connecting the country's most ambitious teenage developers and designers to ship software from scratch.
          </p>
          
          {/* Social Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-border bg-card text-foreground px-3 py-1.5 text-xs font-mono font-bold shadow-[3px_3px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] hover:bg-accent hover:text-accent-foreground active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-none"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Directory Columns */}
        <div className="pt-4 md:pt-0 md:w-1/2">
          <div className="flex flex-col sm:flex-row items-start justify-start md:justify-end gap-8 lg:gap-16">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2.5 w-full sm:w-auto">
                <li className="text-xs font-black uppercase tracking-[0.25em] text-primary dark:text-accent border-b border-border/15 pb-2 mb-2">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-sm font-bold text-foreground hover:text-accent hover:translate-x-1 transition-all duration-150"
                  >
                    <Link href={link.url}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
            
            <div className="flex flex-col gap-y-2.5 w-full sm:w-auto">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary dark:text-accent border-b border-border/15 pb-2 mb-2">
                Connect
              </p>
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="text-sm font-mono font-bold text-foreground underline hover:text-accent transition-colors"
              >
                hello@gobitsnbytes.org
              </a>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary dark:text-accent" />
                Pan-India · HQ: Lucknow, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Neobrutalist Kinetic Text Footer Banner */}
      <div className="w-full py-8 sm:py-10 md:py-16 lg:py-20 mt-8 border-t-4 border-border bg-card overflow-hidden relative z-10 flex items-center justify-center select-none">
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <KineticText
            as="p"
            text="bits&bytes"
            className="font-display text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground justify-center cursor-default select-none"
          />
        </div>
      </div>

      {/* Copyright bottom bar - Solid Deep Charcoal */}
      <div className="border-t-4 border-border py-6 px-4 w-full bg-[#120f0a] dark:bg-card text-zinc-200 dark:text-foreground relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1 font-mono">
            <p className="font-black text-white dark:text-foreground uppercase tracking-tight">
              bits&amp;bytes™ by GOBITSNBYTES FOUNDATION
            </p>
            <p className="text-zinc-300 dark:text-foreground/80">
              © {new Date().getFullYear()} GOBITSNBYTES FOUNDATION. All rights reserved. | gobitsnbytes.org
            </p>
          </div>
          <p className="max-w-2xl text-[9px] sm:text-[10px] opacity-90 leading-relaxed font-serif text-zinc-300 dark:text-foreground/80 text-center md:text-right">
            bits&amp;bytes™ is a student-led builder network operated by GOBITSNBYTES FOUNDATION, a Section 8 non-profit company registered in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FlickeringFooter;
