"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CircleAlert, Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export type LegalSection = {
  id: string;
  label: string;
};

type LegalPolicyPageProps = {
  badge: string;
  title: string;
  summary: string;
  updated: string;
  icon: LucideIcon;
  sections: LegalSection[];
  markdown: string;
  highlights?: string[];
};

function legalSlug(children: React.ReactNode) {
  return React.Children.toArray(children)
    .join("")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function LegalPolicyPage({
  badge,
  title,
  summary,
  updated,
  icon: Icon,
  sections,
  markdown,
  highlights = [],
}: LegalPolicyPageProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-140px 0px -62% 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const parts = useMemo(
    () => markdown.split(/<aside>([\s\S]*?)<\/aside>/g),
    [markdown],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-28 pb-20 text-foreground sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(70%_55%_at_22%_0%,rgba(151,25,44,0.34),transparent_68%),radial-gradient(52%_46%_at_84%_8%,rgba(252,146,13,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-faint opacity-35" />
        <div className="absolute inset-0 bg-noise-texture opacity-25" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1fr_20rem] lg:items-end"
        >
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/72">
              <Icon className="h-3.5 w-3.5 text-[var(--bb-orange-100)]" />
              {badge}
            </span>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl font-serif-brand text-lg leading-relaxed text-white/74 sm:text-xl">
              {summary}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[rgba(18,15,10,0.72)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/44">
              Public Trust Notes
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/72">
              <p>{updated}</p>
              <p>Questions, requests, and reports go to hello@gobitsnbytes.org.</p>
            </div>
          </div>
        </motion.header>

        {highlights.length > 0 && (
          <div className="grid gap-3 py-6 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white/82"
              >
                {highlight}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-[rgba(18,15,10,0.62)] p-3">
              <p className="px-2 pb-3 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-white/42">
                On This Page
              </p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-[background-color,color,transform] duration-200 ease-out hover:bg-white/[0.065] active:scale-[0.98]",
                      activeSection === section.id
                        ? "bg-[rgba(151,25,44,0.24)] text-white"
                        : "text-white/55 hover:text-white/88",
                    )}
                  >
                    <span>{section.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-70" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-semibold text-white/72"
                >
                  {section.label}
                </a>
              ))}
            </div>

            <article className="rounded-[1.25rem] border border-white/10 bg-[rgba(8,5,4,0.68)] p-5 shadow-[var(--shadow-card)] sm:p-8 lg:p-11">
              {parts.map((part, index) => {
                if (!part.trim()) return null;
                if (index % 2 === 1) {
                  const isWarning = part.trim().startsWith("Warning:");
                  const text = part.trim().replace(/^Warning:\s*/, "");

                  return (
                    <div
                      key={index}
                      className={cn(
                        "my-6 rounded-2xl border p-5",
                        isWarning
                          ? "border-[rgba(252,146,13,0.34)] bg-[rgba(252,146,13,0.08)]"
                          : "border-[rgba(151,25,44,0.28)] bg-[rgba(151,25,44,0.12)]",
                      )}
                    >
                      <div className="flex gap-3">
                        <CircleAlert className="mt-1 h-5 w-5 shrink-0 text-[var(--bb-orange-100)]" />
                        <p className="m-0 font-serif-brand text-base leading-relaxed text-white/84 sm:text-lg">
                          {text}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <ReactMarkdown
                    key={index}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => (
                        <h2
                          id={legalSlug(children)}
                          className="scroll-mt-28 pt-8 font-display text-2xl font-black leading-tight tracking-normal text-white sm:text-3xl"
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mt-7 font-display text-lg font-bold leading-snug text-white sm:text-xl">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mt-4 max-w-[72ch] font-serif-brand text-base leading-[1.75] text-white/76 sm:text-lg">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mt-4 max-w-[72ch] space-y-3 pl-5 font-serif-brand text-base leading-relaxed text-white/76 marker:text-[var(--bb-orange-100)] sm:text-lg">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mt-4 max-w-[72ch] list-decimal space-y-3 pl-5 font-serif-brand text-base leading-relaxed text-white/76 marker:text-[var(--bb-orange-100)] sm:text-lg">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="pl-1">{children}</li>,
                      hr: () => <hr className="my-9 border-white/10" />,
                      strong: ({ children }) => (
                        <strong className="font-bold text-white">{children}</strong>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="font-bold text-[var(--bb-orange-80)] underline-offset-4 transition-colors duration-200 hover:text-[var(--bb-orange-20)] hover:underline"
                          target={href?.startsWith("http") ? "_blank" : undefined}
                          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {part}
                  </ReactMarkdown>
                );
              })}

              <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Need help with this policy?</p>
                  <p className="mt-1 text-sm text-white/62">
                    Send questions, access requests, or safety reports to the official inbox.
                  </p>
                </div>
                <a
                  href="mailto:hello@gobitsnbytes.org"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--bb-orange-100)] px-4 py-2 text-sm font-bold text-[var(--bb-neutral-100)] transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
