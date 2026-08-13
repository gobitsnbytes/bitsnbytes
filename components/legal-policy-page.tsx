"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { 
  Search, 
  ArrowUpRight, 
  Mail, 
  AlertTriangle, 
  Check, 
  ArrowUp, 
  ChevronDown
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

// Starburst component for branding/retro aesthetics
const Starburst = ({ className = "text-[#97192c]", size = 32 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 0 L58 28 L85 15 L70 39 L97 50 L70 61 L85 85 L58 72 L50 100 L42 72 L15 85 L30 61 L3 50 L30 39 L15 15 L42 28 Z" />
  </svg>
);

// Four-pointed sparkle star
const SparkleStar = ({ className = "text-[#fc920d]", size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const [isCopied, setIsCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Monitor scroll for ScrollTop and ActiveSection tracking
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button
      setShowScrollTop(window.scrollY > 400);

      // Scroll Spy logic
      const scrollPosition = window.scrollY + 200;
      let currentSection = sections[0]?.id ?? "";

      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el && el.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@gobitsnbytes.org");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 110,
        behavior: "smooth",
      });
    }
  };

  // Split markdown into parts with and without <aside> tags
  const parts = useMemo(
    () => markdown.split(/<aside>([\s\S]*?)<\/aside>/g),
    [markdown],
  );

  // Group text content by section for search filtering
  // Each section starts with a heading line: ## Section Title
  const sectionsContent = useMemo(() => {
    // Standard markdown contains sections. We want to extract text between h2s.
    const rawSections = markdown.split(/##\s+/);
    const mapping: { [key: string]: string } = {};
    
    // First part is prefix/aside
    mapping["introduction"] = rawSections[0] || "";

    rawSections.slice(1).forEach(sec => {
      const lines = sec.split("\n");
      const titleLine = lines[0] || "";
      const id = legalSlug(titleLine);
      mapping[id] = sec;
    });

    return mapping;
  }, [markdown]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase().trim();
    
    return sections.filter(sec => {
      const matchLabel = sec.label.toLowerCase().includes(query);
      const matchContent = (sectionsContent[sec.id] || "").toLowerCase().includes(query);
      return matchLabel || matchContent;
    });
  }, [searchQuery, sections, sectionsContent]);

  return (
    <div className="w-full min-h-screen bg-[#eae8e4] text-[#120f0a] pt-28 pb-20 relative z-10 font-sans selection:bg-[#fc920d] selection:text-[#120f0a]">
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.06] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner with burst details */}
        <header
          data-tour="page-hero"
          data-cinematic-section
          data-cinematic-title={title.toLowerCase()}
          className="mb-12 border-b-4 border-[#120f0a] pb-10 relative"
        >
          <div className="absolute -right-6 -top-6 hidden md:block animate-spin-slow">
            <Starburst size={90} className="text-[#97192c]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#fc920d] text-[#120f0a] border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <Icon className="w-3.5 h-3.5" />
              {badge}
            </span>
            <span className="text-xs font-mono text-[#716f6c] font-semibold">
              {updated}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#120f0a] leading-none mb-6">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="bg-[#fc920d] px-2 py-0.5 border-[3px] border-[#120f0a] inline-block shadow-[4px_4px_0px_0px_#120f0a] -rotate-1">
              {title.split(" ").slice(-1)[0]}
            </span>
          </h1>

          <p className="font-serif-brand text-lg md:text-xl text-[#413f3b] max-w-[70ch] leading-relaxed">
            {summary}
          </p>

          {/* Quick Highlight Pills */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-6">
              {highlights.map((hl, idx) => (
                <span key={idx} className="bg-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#120f0a] flex items-center gap-1">
                  <SparkleStar size={10} className="text-[#97192c]" />
                  {hl}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Search Input Card */}
        <div className="mb-10 max-w-xl">
          <div className="bg-white border-[3px] border-[#120f0a] p-3 shadow-[4px_4px_0px_0px_#120f0a] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#716f6c]" />
            <input 
              type="text" 
              placeholder={`Search ${title} guidelines...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none bg-transparent font-mono text-sm text-[#120f0a] placeholder-[#a09f9d]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="bg-[#eae8e4] border border-[#120f0a] text-xs font-mono font-bold px-2 py-0.5 hover:bg-neutral-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div
          data-cinematic-section
          data-cinematic-title="the public record"
          className="grid gap-8 lg:grid-cols-[18rem_1fr] items-start"
        >
          
          {/* Sidebar navigation */}
          <aside className="sticky top-28 hidden lg:block space-y-4">
            <div className="bg-white border-[3px] border-[#120f0a] p-4 shadow-[4px_4px_0px_0px_#120f0a]">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#716f6c] border-b border-[#120f0a]/15 pb-2 mb-3">
                On This Page
              </p>
              <nav className="space-y-2.5">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  const isVisible = filteredSections.some(s => s.id === section.id);
                  if (!isVisible) return null;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      className={`w-full text-left font-mono text-xs font-bold px-3 py-2 border-2 transition-all flex items-center justify-between group ${
                        isActive 
                          ? "bg-[#fc920d] border-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] translate-x-[2px] translate-y-[2px]" 
                          : "bg-white border-[#120f0a]/30 hover:border-[#120f0a] hover:bg-neutral-50 shadow-[2px_2px_0px_0px_transparent]"
                      }`}
                    >
                      <span className="truncate">{section.label}</span>
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Quick Contact Widget */}
            <div className="bg-[#fee9cf] border-[3px] border-[#120f0a] p-4 shadow-[4px_4px_0px_0px_#120f0a] space-y-3">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider">Need Policy Help?</h4>
              <p className="text-xs text-[#413f3b] leading-normal">
                Have questions or need to report a governance concern? Contact GOBITSNBYTES FOUNDATION directly.
              </p>
              <button 
                onClick={copyEmail}
                className="w-full bg-[#97192c] text-white border-2 border-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] font-mono text-[10px] font-bold py-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {isCopied ? "Email Copied!" : "Copy Inbox Address"}
              </button>
            </div>
          </aside>

          {/* Markdown Content */}
          <div className="space-y-8 min-w-0">
            <AnimatePresence mode="popLayout">
              {filteredSections.length > 0 ? (
                // Group by parts of markdown
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[6px_6px_0px_0px_#120f0a]"
                >
                  <div className="prose max-w-[72ch] font-serif-brand text-base leading-[1.75] text-[#413f3b]">
                    {parts.map((part, index) => {
                      if (!part.trim()) return null;
                      
                      // Handle <aside> parsing
                      if (index % 2 === 1) {
                        const isWarning = part.trim().startsWith("Warning:");
                        const text = part.trim().replace(/^Warning:\s*/, "");

                        return (
                          <div
                            key={index}
                            className={`my-6 border-[3px] border-[#120f0a] p-4 shadow-[4px_4px_0px_0px_#120f0a] ${
                              isWarning
                                ? "bg-[#fda83d] text-[#120f0a]"
                                : "bg-[#f4d9d1] text-[#120f0a]"
                            }`}
                          >
                            <div className="flex gap-3 items-start">
                              <AlertTriangle className="w-5 h-5 shrink-0 text-[#97192c]" />
                              <p className="m-0 font-medium font-sans text-sm">
                                {text}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      // Check if part belongs to search filters
                      // If query is set, we only show blocks containing the query or the corresponding titles.
                      // Since parts is a large markdown block, we parse and render it.
                      return (
                        <ReactMarkdown
                          key={index}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h2: ({ children }) => {
                              const slug = legalSlug(children);
                              const isMatch = filteredSections.some(s => s.id === slug);
                              if (searchQuery && !isMatch) return null;

                              return (
                                <h2
                                  id={slug}
                                  ref={(el) => {
                                    sectionRefs.current[slug] = el;
                                  }}
                                  className="scroll-mt-28 pt-8 font-display text-2xl md:text-3xl font-black uppercase text-[#120f0a] mb-5 tracking-tight border-b-2 border-[#120f0a]/10 pb-2 flex items-center gap-2"
                                >
                                  {children}
                                </h2>
                              );
                            },
                            h3: ({ children }) => (
                              <h3 className="mt-6 font-mono text-base font-black uppercase text-[#120f0a]">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => {
                              // If children contains header tag, let parent handler hide/show it
                              return (
                                <p className="mt-4 text-[#413f3b] text-base leading-[1.75] font-serif-brand">
                                  {children}
                                </p>
                              );
                            },
                            ul: ({ children }) => (
                              <ul className="mt-4 space-y-2.5 pl-5 list-disc marker:text-[#97192c]">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mt-4 space-y-2.5 pl-5 list-decimal marker:text-[#97192c]">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => <li className="pl-1">{children}</li>,
                            hr: () => <hr className="my-8 border-t-2 border-[#120f0a]" />,
                            strong: ({ children }) => (
                              <strong className="font-bold text-[#120f0a]">{children}</strong>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="font-bold text-[#97192c] underline decoration-2 underline-offset-4 transition-colors hover:text-[#fc920d]"
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
                  </div>
                </motion.div>
              ) : (
                /* Empty search state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-4 border-[#120f0a] p-10 shadow-[6px_6px_0px_0px_#120f0a] text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <Starburst size={64} className="text-[#a09f9d]" />
                  </div>
                  <h3 className="text-xl font-black uppercase font-mono">No Matching Sections Found</h3>
                  <p className="text-sm text-[#716f6c] max-w-[45ch] mx-auto">
                    We couldn't find any sections matching "{searchQuery}". Try using simpler keywords.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-[#fc920d] text-[#120f0a] border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] font-mono text-xs font-bold px-4 py-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                  >
                    Reset Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick FAQ / Accordion Section for policy queries */}
            <div className="bg-[#f7f1ec] border-4 border-[#120f0a] p-6 md:p-8 shadow-[6px_6px_0px_0px_#120f0a] space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight border-b border-[#120f0a]/15 pb-3 flex items-center gap-2">
                <Starburst size={20} className="text-[#97192c]" />
                Common Enquiries
              </h3>
              
              <div className="space-y-3">
                {[
                  {
                    q: "Who is responsible for the operations of the Foundation?",
                    a: "GOBITSNBYTES FOUNDATION is governed by its Board of Directors who hold ultimate fiduciary, financial, and legal authority. Operational leadership roles (CEO, CTO, COO, etc.) coordinate day-to-day work."
                  },
                  {
                    q: "How can I exercise my data rights or verify parental consent?",
                    a: "Under the DPDP Act 2023, you or your guardian can request access, correction, or deletion of personal data by emailing hello@gobitsnbytes.org."
                  }
                ].map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="bg-white border-2 border-[#120f0a] transition-all">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 font-mono text-sm font-black text-left hover:bg-neutral-50"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t-2 border-[#120f0a]"
                          >
                            <p className="p-4 text-sm font-serif-brand leading-relaxed text-[#413f3b] bg-[#f7f1ec]">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Contact Info Card */}
            <div className="bg-[#97192c] text-white border-4 border-[#120f0a] p-6 shadow-[6px_6px_0px_0px_#120f0a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs uppercase font-mono tracking-wider opacity-80">Official Policy Inbox</p>
                <p className="text-sm font-semibold mt-1">Send questions, suggestions, or formal notifications to the Foundation.</p>
              </div>
              <a 
                href="mailto:hello@gobitsnbytes.org"
                className="bg-[#fc920d] text-[#120f0a] border-2 border-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] font-mono text-xs font-bold px-4 py-2 shrink-0 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5"
              >
                Send Email <Mail className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Scroll Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-[#fc920d] text-[#120f0a] border-[3px] border-[#120f0a] p-3 shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
