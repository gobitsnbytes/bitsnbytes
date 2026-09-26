import { Github, Instagram, Linkedin } from "lucide-react";

import { WIDE, CubeMark } from "@/components/chrome/wordmark";
import { ContactForm, CopyEmailButton } from "@/components/contact/contact-form";
import { EditionOpener, EDITION_GUTTER, IndentStatement } from "@/components/edition";
import { Button, Chapter, ChapterHead, ScrambleText, TornEdge, Window } from "@/components/riot";
import { cn } from "@/lib/utils";

const chapters = [
  { id: "send-message", title: "Send Message" },
  { id: "who-we-are", title: "bits&bytes™" },
  { id: "direct-channels", title: "Direct Channels" },
  { id: "corporate-entity", title: "Corporate Entity & Grievances" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/gobitsnbytes" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/gobitsbytes" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/gobitsnbytes" },
];

const GUTTER = cn("px-4 md:px-8", EDITION_GUTTER);
const ROW = "grid gap-3 border-b-2 border-line py-6 md:grid-cols-[17rem_minmax(0,1fr)_auto] md:items-center md:gap-6 md:py-8";
const INDEX = "w-10 shrink-0 text-xs tracking-[0.1em] text-signal";
const KEY = "flex items-baseline gap-6 font-mono text-[11px] font-bold uppercase tracking-[0.14em]";
const VALUE = cn(WIDE, "text-[clamp(24px,3vw,46px)] uppercase leading-[0.95]");
const NOTE = "font-serif text-base opacity-80";

export default function Contact() {
  return (
    <>
      <div data-tour="page-hero">
        <EditionOpener
          variant="static"
          title="Let's build something together"
          kicker="Contact"
          chapters={chapters}
          art={{ src: "/event_pictures/devday2.jpeg", alt: "A builder takes the mic during a bits&bytes™ session" }}
        />
      </div>
      <TornEdge from="ink" to="paper" />

      {/* §01: lede + the form in window chrome */}
      <Chapter id="send-message" title="Send Message" number={1} className="md:pt-20">
        <div className={GUTTER}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <ScrambleText
                as="p"
                text="§01 — Contact"
                className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal"
              />
              <p className="mt-6 max-w-[20ch] font-serif text-[clamp(30px,3.6vw,56px)] italic leading-[1.06] tracking-[-0.02em] first-letter:pr-[0.04em] first-letter:font-script first-letter:text-[1.8em] first-letter:font-normal first-letter:not-italic first-letter:leading-[0] first-letter:text-signal">
                Partner with us on hackathons, workshops, or school programs across Lucknow.
              </p>
              <p aria-hidden className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
                26.8467° N, 80.9462° E
              </p>
            </div>
            <Window title="Reach the bits&bytes™ crew" bar="orange" bodyClassName="p-5 md:p-8">
              <ContactForm />
            </Window>
          </div>
        </div>
      </Chapter>

      {/* §02: buttermax indented statement */}
      <IndentStatement id="who-we-are" label="bits&bytes™" number={2} surface="cream">
        bits&bytes™ is an independent, student-led network helping ambitious teenagers build products and get their ideas out into the world. Taste, engineering standards, and high agency guide everything we ship.
      </IndentStatement>

      {/* §03: stripe.dev table-list of channels */}
      <Chapter id="direct-channels" title="Direct Channels" number={3}>
        <div className={GUTTER}>
          <ChapterHead number={3} label="Contact" title="Direct Channels" />
          <dl>
            <div className={ROW}>
              <dt className={KEY}>
                <span aria-hidden className={INDEX}>
                  [01]
                </span>
                <span className="opacity-75">Email Address</span>
              </dt>
              <dd className="min-w-0">
                <a
                  href="mailto:hello@gobitsnbytes.org"
                  className={cn(VALUE, "break-all normal-case underline-offset-[6px] hover:underline")}
                >
                  hello@gobitsnbytes.org
                </a>
              </dd>
              <dd className="flex flex-wrap gap-3">
                <CopyEmailButton />
                <Button asChild variant="burgundy" size="sm">
                  <a href="mailto:hello@gobitsnbytes.org">Send Email</a>
                </Button>
              </dd>
            </div>
            <div className={ROW}>
              <dt className={KEY}>
                <span aria-hidden className={INDEX}>
                  [02]
                </span>
                <span className="opacity-75">HQ Location</span>
              </dt>
              <dd className={VALUE}>Lucknow, India</dd>
              <dd className={NOTE}>Fiduciary &amp; operational base in UP</dd>
            </div>
            <div className={ROW}>
              <dt className={KEY}>
                <span aria-hidden className={INDEX}>
                  [03]
                </span>
                <span className="opacity-75">Status</span>
              </dt>
              <dd className={VALUE}>Teen-led since 2025</dd>
              <dd className={NOTE}>Independent student community</dd>
            </div>
            <div className={ROW}>
              <dt className={KEY}>
                <span aria-hidden className={INDEX}>
                  [04]
                </span>
                <span className="opacity-75">Follow the Builds</span>
              </dt>
              <dd className={NOTE}>Connect on our channels</dd>
              <dd>
                <ul className="flex gap-3">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <Button asChild variant="outline" size="icon">
                        <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                          <social.icon aria-hidden className="size-5" />
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </Chapter>

      <TornEdge from="paper" to="ink" />

      {/* §04: legal registry on ink */}
      <Chapter id="corporate-entity" title="Corporate Entity & Grievances" number={4} tone="ink">
        <div className={GUTTER}>
          <ChapterHead
            number={4}
            label="Corporate Entity & Grievances"
            title="GOBITSNBYTES FOUNDATION"
            description="Section 8 Non-Profit Company · UP, India"
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <div className="flex items-center gap-5">
              <CubeMark className="size-20 shrink-0 text-cream md:size-28" />
              <div>
                <p className={cn(WIDE, "text-[clamp(28px,3vw,44px)] leading-none")}>bits&amp;bytes™</p>
                <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
                  CIN: U85500UP2026NPL248652
                </p>
              </div>
            </div>
            <div className="border-t-2 border-line">
              <p className="border-b-2 border-line py-5 font-serif text-base md:text-lg">
                Regd. Office: 265/1 Patrakar Colony, Ashok Nagar, Prayagraj - 211001
              </p>
              <p className="border-b-2 border-line py-5 font-serif text-base md:text-lg">
                <strong className="font-mono text-xs uppercase tracking-[0.14em]">Grievances:</strong>{" "}
                <a
                  href="mailto:grievance@gobitsnbytes.org"
                  className="font-mono text-signal underline underline-offset-4 hover:decoration-2"
                >
                  grievance@gobitsnbytes.org
                </a>
              </p>
              <p className="py-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">
                Statutory acknowledgment within 24 hours · Resolution within 15 days
              </p>
            </div>
          </div>
        </div>
      </Chapter>
    </>
  );
}
