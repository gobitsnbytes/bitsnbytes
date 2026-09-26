"use client";

import Link from "next/link";

import { QnAChatInterface } from "@/components/qna-chat-interface";
import { Eyebrow } from "@/components/riot";
import { dispatchPrompt } from "@/components/ui/booking-blocks";

const VERIFY = ["Verified from public docs", "Built for sponsor diligence", "Join-ready handoff"];
const HOW = [
  "Ask about events, team, and partnerships.",
  "Answers are grounded in public project sources.",
  "Follow prompts to jump into join or sponsor steps.",
];
const ASKS = ["What makes bits&bytes™ different?", "Show me partner events and outcomes.", "How do sponsors get involved?"];

const RULE_LABEL = "flex items-baseline justify-between border-b-2 border-line pb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]";
const ROW_BTN =
  "flex min-h-11 w-full items-center justify-between gap-3 border-2 border-line px-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] shadow-[3px_3px_0_0_var(--shadow-color)] transition-[transform,box-shadow,background-color,color] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none";

/**
 * /qna — a full-height stripe.dev console. The site chrome locks this route to the viewport (no
 * footer, no Lenis), so the page scrolls itself below lg and the manual column scrolls on its own at lg+.
 */
export default function QnAPage() {
  return (
    <section
      data-tour="page-hero"
      aria-label="bits&bytes™ QnA Assistant"
      className="tone-paper h-full overflow-y-auto pt-24 lg:overflow-hidden"
    >
      <div className="grid gap-8 px-4 pb-6 md:px-8 lg:h-full lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-10 lg:pb-8">
        <QnAChatInterface className="h-[calc(100svh-8.5rem)] min-h-[440px] lg:order-2 lg:h-full" />

        <div className="flex flex-col gap-7 lg:order-1 lg:min-h-0 lg:overflow-y-auto lg:pb-2 lg:pr-3">
          <header className="space-y-3">
            <Eyebrow>QnA Assistant</Eyebrow>
            <h1 className="font-[family-name:var(--font-archivo)] text-[clamp(30px,3vw,44px)] font-black uppercase leading-[0.9] tracking-[-0.035em] [font-stretch:112%]">
              Ask what matters, get the real bits&bytes™ answer.
            </h1>
            <p className="max-w-[46ch] font-serif text-base leading-relaxed">
              This is the official QnA layer for sponsors, educators, and builders. We answer from public sources in this
              project, fast and without fluff.
            </p>
          </header>

          <ul className="border-t-2 border-line">
            {VERIFY.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline justify-between gap-3 border-b border-line/40 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em]"
              >
                {item}
                <span aria-hidden className="text-signal">
                  [VERIFY_0{index + 1}]
                </span>
              </li>
            ))}
          </ul>

          <aside aria-labelledby="qna-sponsor-flow" className="space-y-3">
            <p className={RULE_LABEL}>
              <span className="text-signal">Sponsor Flow</span>
              <span aria-hidden>[FLOW_01]</span>
            </p>
            <h2 id="qna-sponsor-flow" className="font-display text-3xl uppercase leading-[0.9] tracking-[0.01em]">
              Want a direct convo?
            </h2>
            <p className="font-serif text-sm leading-relaxed">
              Ask here, then jump to a sponsor-ready contact route with context.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link href="/contact" className={`${ROW_BTN} bg-burgundy text-paper`}>
                Contact the team <span aria-hidden>→</span>
              </Link>
              <Link href="/join" className={`${ROW_BTN} bg-card text-card-foreground`}>
                Join the crew <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>

          <aside aria-label="How it works" className="space-y-5">
            <div className="space-y-2">
              <p className={RULE_LABEL}>
                <span className="text-signal">How it works</span>
                <span aria-hidden>[INFO_02]</span>
              </p>
              <ul className="space-y-1.5 font-serif text-sm leading-normal">
                {HOW.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden className="mt-[0.45em] size-1.5 shrink-0 bg-signal" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p className={RULE_LABEL}>
                <span className="text-signal">Suggested asks</span>
              </p>
              <ul>
                {ASKS.map((prompt) => (
                  <li key={prompt} className="border-b border-line/40">
                    <button
                      type="button"
                      onClick={() => dispatchPrompt(prompt)}
                      className="flex w-full cursor-pointer items-baseline justify-between gap-3 px-1 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-[0.04em] transition-colors hover:bg-fg hover:text-surface focus-visible:bg-fg focus-visible:text-surface"
                    >
                      {prompt}
                      <span aria-hidden>↵</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
