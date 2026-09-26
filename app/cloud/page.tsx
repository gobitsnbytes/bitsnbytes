import { Breadcrumbs } from "@/components/breadcrumb";
import { CubeMark } from "@/components/chrome/wordmark";
import { CloudApply } from "@/components/cloud/cloud-apply";
import { EditionOpener, EDITION_GUTTER } from "@/components/edition";
import { Chapter, ChapterHead, Tag, TornEdge, Window } from "@/components/riot";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "cloud-for-builders", title: "cloud for builders" },
  { id: "what-you-get", title: "what you get" },
  { id: "the-hard-limits", title: "the hard limits" },
  { id: "verify-and-apply", title: "verify and apply" },
];

const LINKS = [
  { href: "https://sparkden.org/", label: "sparkden.org" },
  { href: "https://cloud.sparkden.org/", label: "cloud.sparkden.org" },
  { href: "https://sparkden.org/philosophy", label: "Philosophy" },
  { href: "https://cloud.sparkden.org/faq", label: "FAQ" },
];

const QUICK = [
  {
    label: "SparkCloud Environments",
    desc: "Free cloud spaces — code, test, build, and host containers and databases from any browser.",
  },
  {
    label: "One Verified Account",
    desc: "A single Spark Account signs you into every Sparkden service, workspace, and tool.",
  },
];

const PROVIDES = [
  {
    label: "Container Hosting",
    desc: "Deploy containerised apps, Node/Python backends, REST APIs, and bots with instant public URLs.",
  },
  {
    label: "Managed Databases",
    desc: "Provision high-performance PostgreSQL and data store instances for full-stack hackathon projects.",
  },
  {
    label: "Tokens & Vouchers",
    desc: "Transparent token-based billing via student grants. Free tier stays real — tokens never expire.",
  },
];

const POLICIES = [
  { href: "https://sparkden.org/conduct", label: "Sparkden Code of Conduct" },
  { href: "https://sparkden.org/terms", label: "Sparkden Terms of Service" },
  { href: "https://sparkden.org/privacy", label: "Sparkden Privacy Policy" },
  { href: "https://sparkden.org/acceptable-use", label: "Acceptable Use Policy" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const COL = cn("px-4 md:px-8", EDITION_GUTTER);
const LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.16em]";
const ITEM_TITLE =
  "font-[family-name:var(--font-archivo)] text-[clamp(20px,1.9vw,28px)] font-black uppercase leading-[0.95] tracking-[-0.02em]";

/** stripe.dev table row link: "/ 01  label  ↗", full-row fill on hover / focus. */
function RowLink({ href, label, index }: { href: string; label: string; index: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline gap-4 border-b border-line/40 px-1 py-3.5 transition-colors hover:bg-fg hover:text-surface focus-visible:bg-fg focus-visible:text-surface"
    >
      <span aria-hidden className={cn(LABEL, "w-10 shrink-0 text-signal group-hover:text-surface group-focus-visible:text-surface")}>
        / {pad(index + 1)}
      </span>
      <span className="min-w-0 flex-1 font-sans text-base font-extrabold uppercase tracking-[0.01em]">{label}</span>
      <span aria-hidden className="font-mono text-sm">
        ↗
      </span>
    </a>
  );
}

export default function CloudPage() {
  return (
    <>
      <div className="[&_h1]:text-[clamp(28px,3.8vw,52px)]">
        <EditionOpener
          variant="static"
          title="SparkCloud × bits&bytes™"
          kicker="SparkCloud PaaS"
          chapters={CHAPTERS}
          art={{
            src: "/event_pictures/byteforge4.webp",
            alt: "Three students working together on a laptop in front of a chalkboard",
          }}
          tone="ink-orange"
        />
      </div>

      {/* §01 — the offer */}
      <Chapter id="cloud-for-builders" title="cloud for builders" number={1} tone="paper">
        <div className={COL}>
          <Breadcrumbs items={[{ name: "SparkCloud", href: "/cloud" }]} />
          <p className={cn(LABEL, "text-signal")}>§01 — cloud for builders</p>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            <li>
              <Tag tone="burgundy">SparkCloud PaaS</Tag>
            </li>
            <li>
              <Tag tone="orange">Teenagers 13–19</Tag>
            </li>
            <li>
              <Tag tone="cream">India Only</Tag>
            </li>
            <li>
              <Tag tone="ink">US 501(c)(3) Nonprofit Partner</Tag>
            </li>
          </ul>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <p
              data-speakable="true"
              data-citation="true"
              className="max-w-[30ch] font-serif text-[clamp(24px,2.8vw,40px)] leading-[1.2]"
            >
              Free, high-performance cloud development spaces for ambitious teen builders. Code, deploy, and host full-stack
              applications from your browser — no credit card, no corporate account, no gatekeeping.
            </p>

            {/* Partner lockup: bits&bytes™ + Sparkden + SparkCloud */}
            <ul aria-label="Partners" className="self-start border-t-3 border-line">
              <li className="flex items-center gap-3 border-b border-line/40 py-3.5">
                <CubeMark className="size-7" />
                <span className="font-sans text-lg font-black uppercase tracking-tight">bits&bytes™</span>
              </li>
              <li className="flex items-center gap-3 border-b border-line/40 py-3.5">
                <span aria-hidden className="font-mono text-lg font-bold text-signal">
                  +
                </span>
                <a href="https://sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-75">
                  <img src="https://sparkden.org/logo-full.png" alt="Sparkden" className="h-7 object-contain invert dark:invert-0" />
                </a>
              </li>
              <li className="flex items-center gap-3 border-b border-line/40 py-3.5">
                <span aria-hidden className="font-mono text-lg font-bold text-signal">
                  +
                </span>
                <a href="https://cloud.sparkden.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-75">
                  <img src="https://cloud.sparkden.org/sparkcloud-logo.png" alt="SparkCloud" className="h-7 object-contain" />
                </a>
              </li>
            </ul>
          </div>

          <figure className="mt-16 border-y-3 border-line py-10 md:py-14">
            <figcaption className={cn(LABEL, "text-signal")}>Mission Philosophy</figcaption>
            <blockquote className="mt-5 max-w-[26ch] font-serif text-[clamp(28px,4vw,60px)] italic leading-[1.08] tracking-[-0.02em]">
              &ldquo;Deploy. Break it. Fix it. Repeat. Every teenager should be able to ship something real without spending
              weeks on cloud theory or corporate billing requirements.&rdquo;
            </blockquote>
          </figure>

          <ul className="mt-12 grid border-t-3 border-line md:grid-cols-2">
            {QUICK.map((item, index) => (
              <li
                key={item.label}
                className="border-b border-line/40 py-6 md:py-8 md:odd:border-r md:odd:pr-8 md:even:pl-8"
              >
                <p aria-hidden className={cn(LABEL, "text-signal")}>
                  / {pad(index + 1)}
                </p>
                <h3 className={cn(ITEM_TITLE, "mt-3")}>{item.label}</h3>
                <p className="mt-3 max-w-[44ch] font-serif text-base leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>

          <nav aria-label="Sparkden links" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(LABEL, "underline decoration-2 underline-offset-4 hover:text-signal")}
              >
                {link.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </nav>
        </div>
      </Chapter>

      {/* §02 — what you get */}
      <Chapter id="what-you-get" title="what you get" number={2} tone="cream">
        <div className={COL}>
          <ChapterHead
            number={2}
            label="what you get"
            title="What SparkCloud Provides"
            description={
              <>
                Sparkden and SparkCloud are educational programmes operated by{" "}
                <strong>The Spark Forward Foundation, Inc.</strong>, a US 501(c)(3) nonprofit (EIN: 42-2930302).
              </>
            }
          />
          <ul className="grid border-t-3 border-line md:grid-cols-3">
            {PROVIDES.map((item, index) => (
              <li
                key={item.label}
                className="border-b border-line/40 py-6 md:border-b-0 md:border-r md:px-6 md:py-8 md:first:pl-0 md:last:border-r-0"
              >
                <p aria-hidden className={cn(LABEL, "text-signal")}>
                  [S.{pad(index + 1)}]
                </p>
                <h3 className={cn(ITEM_TITLE, "mt-3")}>{item.label}</h3>
                <p className="mt-3 font-serif text-base leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>

          <Window title="Zero Billing Friction" bar="orange" className="mt-12 max-w-3xl" bodyClassName="p-5 md:p-7">
            <p className="font-mono text-sm leading-relaxed">
              Unlike AWS, GCP, or Azure — no credit cards, no complex IAM, no corporate billing. SparkCloud gives student
              builders the agility of Render, Railway, and Vercel while keeping access and education front and centre.
            </p>
          </Window>
        </div>
      </Chapter>

      <TornEdge from="cream" to="ink" />

      {/* §03 — the hard limits */}
      <Chapter id="the-hard-limits" title="the hard limits" number={3} tone="ink">
        <div className={COL}>
          <Tag tone="orange" className="mb-6">
            Mandatory Notice
          </Tag>
          <ChapterHead number={3} label="the hard limits" title="Strict Eligibility & Anti-Abuse" />
          <p className="indent-[26%] font-sans text-[clamp(24px,3.6vw,52px)] font-extrabold uppercase leading-[1.02] tracking-[-0.03em]">
            This complimentary cloud access is strictly reserved for Indian teenagers between{" "}
            <strong className="text-orange">ages 13 and 19</strong> who are active members of bits&bytes™.
          </p>

          <div className="mt-14 max-w-4xl border-3 border-orange p-5 font-mono shadow-[8px_8px_0_0_var(--orange)] md:p-8">
            <p className={cn(LABEL, "text-orange")}>Legal Warning &amp; Anti-Abuse Policy:</p>
            <p className="mt-4 text-sm leading-relaxed">
              Misuse, fraudulent registration, multi-accounting, VPN proxying, or attempting to bypass eligibility criteria will
              result in immediate service termination, permanent blacklisting, legal notice issuance, and formal prosecution
              under applicable Indian and international civil and criminal statutes.
            </p>
            <p className="mt-5 border-t-2 border-cream/40 pt-4 text-sm font-bold uppercase tracking-[0.06em] text-orange">
              Legal action will be taken against anyone found abusing or misusing this service.
            </p>
          </div>
        </div>
      </Chapter>

      <TornEdge from="ink" to="paper" flip />

      {/* §04 — verify and apply */}
      <Chapter id="verify-and-apply" title="verify and apply" number={4} tone="paper">
        <div className={COL}>
          <ChapterHead
            number={4}
            label="verify and apply"
            title="Policy Agreement & Verification"
            description="Before applying, review Sparkden's legal documents and explicitly accept the governing terms."
          />
          <div className="max-w-4xl">
            <nav aria-label="Sparkden legal documents" className="border-t-3 border-line">
              {POLICIES.map((policy, index) => (
                <RowLink key={policy.href} {...policy} index={index} />
              ))}
            </nav>
            <CloudApply />
          </div>

          <div className={cn(LABEL, "mt-20 space-y-1 border-t-2 border-line/40 pt-6 text-center")}>
            <p>bits&bytes™ by GOBITSNBYTES FOUNDATION</p>
            <p className="normal-case tracking-[0.06em]">
              © 2026 GOBITSNBYTES FOUNDATION. All rights reserved. | gobitsnbytes.org
            </p>
          </div>
        </div>
      </Chapter>
    </>
  );
}
