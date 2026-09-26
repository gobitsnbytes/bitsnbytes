"use client";

import { QnAChatInterface } from "@/components/qna-chat-interface";
import {
  LAB_HOVER,
  LAB_TEXT,
  LabGlobe,
  LabGrid,
  LabHero,
  LabLink,
  LabTag,
  PixelGlyph,
  TableHeader,
} from "@/components/lab";
import { dispatchPrompt } from "@/components/ui/booking-blocks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// "Verified from public docs" is dropped: the console bar already carries "Verified from public project sources".
const TAGS = ["QnA Assistant", "Built for sponsor diligence", "Join-ready handoff"];
const HOW = [
  "Ask about events, team, and partnerships.",
  "Answers are grounded in public project sources.",
  "Follow prompts to jump into join or sponsor steps.",
];
const ASKS = ["What makes bits&bytes™ different?", "Show me partner events and outcomes.", "How do sponsors get involved?"];

const CELL = "col-span-full flex flex-col items-start gap-5 lg:col-span-8";

/** /qna — stripe.dev register: LabHero, the console at viewport height, then one row of sponsor / how / asks. */
export default function QnAPage() {
  return (
    <>
      <section
        aria-label="bits&bytes™ QnA Assistant"
        data-cinematic-section=""
        data-cinematic-title="QnA Assistant"
        data-surface="paper"
      >
        <LabHero
          lines={["Ask what matters, ", "get the real ", "bits&bytes™ answer."]}
          glyph={<PixelGlyph text="QNA" decorative />}
          aside={<LabGlobe />}
          subtitle={
            <p>
              This is the official QnA layer for sponsors, educators, and builders. We answer from public sources in this
              project, fast and without fluff.
            </p>
          }
          // the h1 is a sentence, not a two-word title: height-aware so it never fills a short laptop screen
          className="[&_h1]:text-[length:clamp(44px,min(7vw,12svh),120px)]"
        >
          <div className="flex flex-wrap gap-1">
            {TAGS.map((tag) => (
              <LabTag key={tag}>{tag}</LabTag>
            ))}
          </div>
        </LabHero>
      </section>

      <LabGrid data-surface="paper" className="pb-6">
        <QnAChatInterface className="col-span-full h-[clamp(440px,calc(100svh-9rem),760px)]" />
      </LabGrid>

      <LabGrid
        as="section"
        data-cinematic-section=""
        data-cinematic-title="Sponsor Flow"
        data-surface="paper"
        className="gap-y-14 pb-24 pt-16 min-[760px]:pt-24"
      >
        <div className={CELL}>
          <TableHeader label="Sponsor Flow" className="self-stretch" />
          <h2 className={LAB_TEXT.post}>Want a direct convo?</h2>
          <p className={LAB_TEXT.sm}>Ask here, then jump to a sponsor-ready contact route with context.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="sm">
              <LabLink href="/contact">Contact the team</LabLink>
            </Button>
            <Button asChild size="sm" variant="outline">
              <LabLink href="/join">Join the crew</LabLink>
            </Button>
          </div>
        </div>

        <div className={CELL}>
          <TableHeader as="h2" label="How it works" className="self-stretch" />
          <ul role="list" className="self-stretch">
            {HOW.map((line) => (
              <li key={line} className={cn(LAB_TEXT.sm, "flex gap-3 border-b border-dotted border-line py-3")}>
                <span aria-hidden className="mt-[0.35em] size-2 shrink-0 bg-signal" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className={CELL}>
          <TableHeader as="h2" label="Suggested asks" count={ASKS.length} className="self-stretch" />
          <ul role="list" className="self-stretch">
            {ASKS.map((prompt) => (
              <li key={prompt} className="border-b border-dotted border-line">
                <button
                  type="button"
                  onClick={() => dispatchPrompt(prompt)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left font-mono text-[12px] uppercase leading-[1.2]",
                    LAB_HOVER,
                  )}
                >
                  {prompt}
                  <span aria-hidden>↵</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </LabGrid>
    </>
  );
}
