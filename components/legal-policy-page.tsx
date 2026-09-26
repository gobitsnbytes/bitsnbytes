"use client";

import { useMemo, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { useOptionalExperience } from "@/components/experience-provider";
import { EditionOpener, EDITION_GUTTER } from "@/components/edition";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Tag, TornEdge } from "@/components/riot";
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
  sections: LegalSection[];
  markdown: string;
  highlights?: string[];
};

const ENQUIRIES = [
  {
    q: "Who is responsible for the operations of the Foundation?",
    a: "GOBITSNBYTES FOUNDATION is governed by its Board of Directors who hold ultimate fiduciary, financial, and legal authority. Operational leadership roles (CEO, CTO, COO, etc.) coordinate day-to-day work.",
  },
  {
    q: "How can I exercise my data rights or verify parental consent?",
    a: "Under the DPDP Act 2023, you or your guardian can request access, correction, or deletion of personal data by emailing hello@gobitsnbytes.org.",
  },
];

const EMAIL = "hello@gobitsnbytes.org";
const ASIDE = /<aside>([\s\S]*?)<\/aside>/g;
const NUMBERED = /^(\d+(?:\.\d+)*\.?)\s+(.*)$/;
const MONO_LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.18em]";

function legalSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const plain = (children: ReactNode) => (Array.isArray(children) ? children.join("") : String(children ?? ""));

/**
 * "3.1 What We Expect" → mono clause number + title (same text, two styles). hideNumber keeps the
 * number for screen readers only, where the sticky rail already prints it large.
 */
function Clause({ text, hideNumber = false }: { text: string; hideNumber?: boolean }) {
  const match = NUMBERED.exec(text);
  if (!match) return <>{text}</>;
  return (
    <>
      <span className={hideNumber ? "sr-only" : "mr-1.5 font-mono text-[0.72em] font-bold tracking-normal text-signal"}>
        {match[1]}
      </span>{" "}
      {match[2]}
    </>
  );
}

/**
 * Splits the policy markdown into the intro <aside>, one entry per "## " section and the closing
 * line after the final "---". Words are untouched; only the layout changes.
 */
function parseDocument(markdown: string) {
  const [pre, ...chunks] = markdown.split(/^## /m);
  const intro = [...pre.matchAll(ASIDE)].map((m) => m[1].trim());
  const preRest = pre.replace(ASIDE, "").replace(/^\s*---\s*$/gm, "").trim();
  let colophon = "";

  const sections = chunks.map((chunk, index) => {
    const newline = chunk.indexOf("\n");
    const heading = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    let body = newline === -1 ? "" : chunk.slice(newline + 1);
    if (index === chunks.length - 1) {
      const cut = body.lastIndexOf("\n---");
      if (cut !== -1) {
        colophon = body.slice(cut + 4).trim();
        body = body.slice(0, cut);
      }
    }
    return { heading, id: legalSlug(heading), body };
  });

  return { intro, preRest, sections, colophon };
}

const BODY: Components = {
  h3: ({ children }) => (
    <h3 className="mt-10 font-sans text-lg font-black uppercase leading-tight tracking-[-0.005em] first:mt-0">
      <Clause text={plain(children)} />
    </h3>
  ),
  p: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 space-y-2.5 pl-5 [list-style-type:square] marker:text-signal">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2.5 pl-6 marker:font-mono marker:text-[0.85em] marker:font-bold marker:text-signal">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  hr: () => <hr className="my-10 border-t-3 border-line" />,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-bold text-signal underline decoration-2 underline-offset-4 hover:decoration-4"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

/** Renders markdown with <aside> call-outs; a leading "Warning:" becomes the call-out's label. */
function Prose({ source }: { source: string }) {
  const parts = source.split(ASIDE);
  return (
    <>
      {parts.map((part, index) => {
        if (!part.trim()) return null;
        if (index % 2 === 0) {
          return (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} components={BODY}>
              {part}
            </ReactMarkdown>
          );
        }
        const text = part.trim();
        const warning = /^Warning:\s*/.exec(text);
        return (
          <div
            key={index}
            role="note"
            className={cn(
              "my-8 border-3 border-ink p-5 font-sans text-[15px] leading-relaxed text-ink shadow-[6px_6px_0_0_var(--ink)] dark:border-cream dark:shadow-[6px_6px_0_0_var(--cream)]",
              warning ? "bg-orange-lt" : "bg-cream",
            )}
          >
            {warning ? <p className={cn(MONO_LABEL, "mb-2")}>Warning</p> : null}
            <p>{warning ? text.slice(warning[0].length) : text}</p>
          </div>
        );
      })}
    </>
  );
}

/**
 * Editions "document": static opener (the h1), a paper preamble (summary, highlights, intro note,
 * contents + search), then one chapter per policy section — mono clause numbers in a sticky rail,
 * Georgia body at a reading measure. The fixed chapter index lists the sections at ≥1280px and the
 * "CH 02/05" chip below that.
 */
export function LegalPolicyPage({ badge, title, summary, updated, sections, markdown, highlights = [] }: LegalPolicyPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const lenis = useOptionalExperience()?.lenis ?? null;

  const doc = useMemo(() => parseDocument(markdown), [markdown]);
  const labels = useMemo(() => new Map(sections.map((s) => [s.id, s.label])), [sections]);
  const query = searchQuery.toLowerCase().trim();
  const visible = useMemo(
    () =>
      new Set(
        doc.sections
          .filter(
            (s) =>
              !query ||
              (labels.get(s.id) ?? "").toLowerCase().includes(query) ||
              `${s.heading}\n${s.body}`.toLowerCase().includes(query),
          )
          .map((s) => s.id),
      ),
    [doc.sections, labels, query],
  );

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else document.getElementById("main-content")?.scrollIntoView({ block: "start" });
  };

  const contents = sections.filter((s) => visible.has(s.id));
  // Common Enquiries continues the clause numbering.
  const nextClause = Math.max(0, ...doc.sections.map((s) => parseInt(NUMBERED.exec(s.heading)?.[1] ?? "0", 10))) + 1;

  return (
    <>
      <div data-tour="page-hero" className="[&_h1]:text-[clamp(28px,3.8vw,52px)]">
        <EditionOpener variant="static" title={title} kicker={`${badge} · ${updated}`} chapters={[]} />
      </div>

      {/* Preamble (not a chapter): summary, highlights, the intro note, contents + search. */}
      <section data-surface="paper" className="tone-paper relative overflow-x-clip py-14 md:py-20">
        <div className={cn("grid gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16", EDITION_GUTTER)}>
          <div className="min-w-0">
            <p className={cn(MONO_LABEL, "text-signal")}>§00 — {badge}</p>
            <p className="mt-5 max-w-[34ch] font-serif text-[clamp(22px,2.3vw,32px)] leading-[1.3]">{summary}</p>
            {highlights.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {highlights.map((hl) => (
                  <li key={hl}>
                    <Tag tone="cream">{hl}</Tag>
                  </li>
                ))}
              </ul>
            )}
            <div className="max-w-[68ch] font-serif text-[17px] leading-[1.7]">
              {doc.intro.map((text) => (
                <div
                  key={text}
                  role="note"
                  className="mt-10 border-l-[6px] border-signal bg-surface-2 py-4 pl-5 pr-4 font-sans text-[15px] leading-relaxed"
                >
                  {text}
                </div>
              ))}
              {doc.preRest ? <Prose source={doc.preRest} /> : null}
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="border-3 border-line bg-card text-card-foreground shadow-[6px_6px_0_0_var(--shadow-color)]">
              <label htmlFor="policy-search" className={cn(MONO_LABEL, "flex items-center justify-between border-b-3 border-line px-3 py-2")}>
                <span>Search</span>
                <span aria-hidden className="text-signal">
                  [{String(visible.size).padStart(2, "0")}/{String(doc.sections.length).padStart(2, "0")}]
                </span>
              </label>
              <div className="flex items-center gap-2 p-2">
                <span aria-hidden className="pl-1 font-mono text-sm font-bold text-signal">
                  ›
                </span>
                <input
                  id="policy-search"
                  type="text"
                  placeholder={`Search ${title} guidelines...`}
                  aria-label={`Search ${title} guidelines`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-sm placeholder:text-fg/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search input"
                    className="cursor-pointer border-2 border-line px-2 py-0.5 font-mono text-[11px] font-bold uppercase hover:bg-fg hover:text-surface"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <nav aria-label="On This Page">
              <p className={cn(MONO_LABEL, "border-b-2 border-line pb-2")}>On This Page</p>
              <ol>
                {contents.map((section) => (
                  <li key={section.id} className="border-b border-line/30">
                    <a
                      href={`#${section.id}`}
                      className="group flex items-baseline gap-3 py-2 font-sans text-sm font-extrabold uppercase tracking-[0.01em] hover:text-signal"
                    >
                      <span aria-hidden className="w-7 shrink-0 font-mono text-[11px] font-bold text-signal">
                        {String(doc.sections.findIndex((s) => s.id === section.id) + 1).padStart(2, "0")}
                      </span>
                      <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                        {section.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {visible.size === 0 && (
        <section data-surface="paper" aria-live="polite" className="tone-paper border-t-3 border-line py-16">
          <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
            <div className="max-w-xl border-3 border-line bg-card p-8 text-card-foreground shadow-[6px_6px_0_0_var(--shadow-color)]">
              <p className="font-display text-4xl uppercase leading-[0.9]">No Matching Sections Found</p>
              <p className="mt-4 font-serif text-base leading-relaxed">
                We couldn&apos;t find any sections matching &quot;{searchQuery}&quot;. Try using simpler keywords.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 cursor-pointer border-2 border-line bg-orange px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-ink shadow-[3px_3px_0_0_var(--shadow-color)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                Reset Search
              </button>
            </div>
          </div>
        </section>
      )}

      {doc.sections.map((section, index) => {
        const label = labels.get(section.id) ?? section.heading;
        const number = NUMBERED.exec(section.heading)?.[1].replace(/\.$/, "");
        const isLast = index === doc.sections.length - 1;
        return (
          <section
            key={section.id}
            id={section.id}
            data-cinematic-section=""
            data-cinematic-title={label}
            data-chapter-number={String(index + 1).padStart(2, "0")}
            data-surface="paper"
            hidden={!visible.has(section.id)}
            className="tone-paper relative overflow-x-clip border-t-3 border-line py-14 md:py-20"
          >
            <div
              className={cn(
                "grid gap-6 px-4 md:px-8 lg:grid-cols-[11rem_minmax(0,68ch)] lg:gap-14",
                EDITION_GUTTER,
              )}
            >
              <div className="self-start lg:sticky lg:top-28">
                {number ? (
                  <p aria-hidden className="mb-3 font-mono text-[clamp(40px,4.5vw,64px)] font-bold leading-none tracking-[-0.04em] text-signal">
                    §{number.padStart(2, "0")}
                  </p>
                ) : null}
                <p className={MONO_LABEL}>{label}</p>
              </div>
              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-archivo)] text-[clamp(28px,3.4vw,48px)] font-black uppercase leading-[0.95] tracking-[-0.03em] [font-stretch:112%]">
                  <Clause text={section.heading} hideNumber />
                </h2>
                <div className="mt-8 font-serif text-[17px] leading-[1.7]">
                  <Prose source={section.body} />
                </div>
                {isLast && doc.colophon ? (
                  <div className="mt-12 border-t-3 border-line pt-5 font-mono text-xs font-bold uppercase leading-relaxed tracking-[0.08em]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={BODY}>
                      {doc.colophon}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      <section
        id="common-enquiries"
        data-cinematic-section=""
        data-cinematic-title="Common Enquiries"
        data-surface="cream"
        className="tone-cream relative overflow-x-clip border-t-3 border-ink py-16 md:py-24"
      >
        <div className={cn("grid gap-8 px-4 md:px-8 lg:grid-cols-[11rem_minmax(0,68ch)] lg:gap-14", EDITION_GUTTER)}>
          <p aria-hidden className="font-mono text-[clamp(40px,4.5vw,64px)] font-bold leading-none tracking-[-0.04em] text-signal">
            §{String(nextClause).padStart(2, "0")}
          </p>
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(40px,6vw,88px)] uppercase leading-[0.86] tracking-[0.005em]">
              Common Enquiries
            </h2>
            <Accordion type="single" collapsible className="mt-8">
              {ENQUIRIES.map((faq, idx) => (
                <AccordionItem key={faq.q} value={`q${idx}`}>
                  <AccordionTrigger className="font-mono text-sm normal-case tracking-normal">{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <TornEdge from="cream" to="ink" />

      {/* Contact poster: the policy inbox. */}
      <section data-surface="ink" className="tone-ink relative overflow-x-clip py-16 md:py-24">
        <div className={cn("grid gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16", EDITION_GUTTER)}>
          <div className="space-y-4">
            <p className={cn(MONO_LABEL, "text-signal")}>Official Policy Inbox</p>
            <a
              href={`mailto:${EMAIL}`}
              className="block break-all font-[family-name:var(--font-archivo)] text-[clamp(26px,3.6vw,52px)] font-black leading-[0.95] tracking-[-0.03em] underline decoration-orange decoration-4 underline-offset-8 hover:text-orange"
            >
              {EMAIL}
            </a>
            <p className="max-w-[46ch] font-serif text-lg leading-relaxed">
              Send questions, suggestions, or formal notifications to the Foundation.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 border-3 border-cream bg-orange px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--cream)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--cream)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none"
            >
              Send Email <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="space-y-4 border-t-2 border-cream/40 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 className={cn(MONO_LABEL, "text-signal")}>Need Policy Help?</h2>
            <p className="max-w-[46ch] font-serif text-lg leading-relaxed">
              Have questions or need to report a governance concern? Contact GOBITSNBYTES FOUNDATION directly.
            </p>
            <button
              type="button"
              onClick={copyEmail}
              aria-live="polite"
              className="cursor-pointer border-3 border-cream px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:bg-cream hover:text-ink"
            >
              {isCopied ? "Email Copied!" : "Copy Inbox Address"}
            </button>
            <p className="pt-6">
              <button
                type="button"
                onClick={toTop}
                className="cursor-pointer font-mono text-[11px] font-bold uppercase tracking-[0.18em] underline decoration-2 underline-offset-4 hover:text-orange"
              >
                <span aria-hidden>↑ </span>Back to top
              </button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
