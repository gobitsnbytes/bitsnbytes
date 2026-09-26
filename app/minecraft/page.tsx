import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ConsoleWindow } from "@/components/contact/console-window";
import {
  HollowWord,
  LAB_HOVER,
  LAB_TEXT,
  LabCell,
  LabFooterRows,
  LabGlobe,
  LabGrid,
  LabHero,
  LabLink,
  LabTag,
  LabTitle,
  PixelGlyph,
  TableHeader,
} from "@/components/lab";
import { Button } from "@/components/riot";
import { cn } from "@/lib/utils";

import { ConnectAddress, LiveStats, ServerReel } from "./minecraft-live";

export const metadata: Metadata = {
  title: "Free Minecraft survival server, Java + Bedrock",
  description:
    "Free Minecraft 1.21.1 survival on Java and Bedrock, no mods, no pay-to-win. Student-run by bits&bytes™. Connect at mc.gobitsnbytes.org",
  keywords: [
    // Server type & version
    "minecraft survival server india",
    "free minecraft server india",
    "minecraft server 1.21",
    "minecraft server 1.21.1",
    "purpur minecraft server",
    "minecraft java bedrock crossplay server",
    "minecraft crossplay server india",
    "java bedrock crossplay 1.21",
    "minecraft bedrock server india",
    "minecraft java server india",
    // Connection / IP
    "mc.gobitsnbytes.org",
    "gobitsnbytes minecraft",
    "bits&bytes minecraft server",
    "bits and bytes minecraft",
    "free minecraft server ip india",
    // Features
    "no mods minecraft server",
    "vanilla minecraft server india",
    "minecraft survival server no mods",
    "anti grief minecraft server",
    "coreprotect minecraft",
    "minecraft server daily backups",
    "20 tps minecraft server",
    "lag free minecraft server india",
    // Audience
    "student minecraft server india",
    "teen minecraft server",
    "minecraft server for students",
    "minecraft community server india",
    "bits and bytes community",
    // Competitive / ranked searches
    "best minecraft server india",
    "top minecraft servers india",
    "minecraft survival multiplayer india",
    "smp server india",
    "smp minecraft india",
    "free smp server india",
    "public smp india",
    "minecraft server ip india free",
    "india minecraft smp 2025",
    "india minecraft smp 2026",
    "minecraft server india 2026",
    // Bedrock specific
    "minecraft bedrock multiplayer india",
    "minecraft pocket edition server india",
    "mcpe server india",
    "bedrock edition server free india",
    // Long tail
    "how to join minecraft server india",
    "minecraft server discord india",
    "open minecraft server india",
    "safe minecraft server for kids india",
    "student run minecraft server",
    "non profit minecraft server",
    "minecraft server azure india",
    "purpur 1.21.1 server",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/minecraft",
  },
  openGraph: {
    title: "Free Minecraft survival server, Java + Bedrock | bits&bytes™",
    description:
      "Free Minecraft 1.21.1 survival on Java and Bedrock, no mods, no pay-to-win. Student-run by bits&bytes™. Connect at mc.gobitsnbytes.org",
    url: "https://gobitsnbytes.org/minecraft",
    type: "website",
    siteName: "bits&bytes™",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ Minecraft server: free Java and Bedrock crossplay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Minecraft survival server, Java + Bedrock | bits&bytes™",
    description:
      "Free Minecraft 1.21.1 survival on Java and Bedrock, no mods, no pay-to-win. Student-run by bits&bytes™. Connect at mc.gobitsnbytes.org",
    images: ["/og-image.png"],
    creator: "@gobitsnbytes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const SERVER_IP = "mc.gobitsnbytes.org";

const minecraftJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gobitsnbytes.org/minecraft#webpage",
      url: "https://gobitsnbytes.org/minecraft",
      name: "Free Minecraft survival server, Java + Bedrock | bits&bytes™",
      description:
        "Free Minecraft 1.21.1 survival on Java and Bedrock, no mods, no pay-to-win. Student-run by bits&bytes™. Connect at mc.gobitsnbytes.org",
      isPartOf: { "@id": "https://gobitsnbytes.org/#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://gobitsnbytes.org",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Minecraft Server",
            item: "https://gobitsnbytes.org/minecraft",
          },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://gobitsnbytes.org/minecraft#server",
      name: "bits&bytes™ Minecraft Survival Server",
      alternateName: [
        "mc.gobitsnbytes.org",
        "bits&bytes Minecraft SMP",
        "gobitsnbytes minecraft server",
        "bits and bytes survival server",
      ],
      applicationCategory: "GameApplication",
      applicationSubCategory: "Multiplayer Game Server",
      operatingSystem: ["Windows", "macOS", "Linux", "Android", "iOS"],
      description:
        "A free, student-run Minecraft 1.21.1 survival server hosted on Azure in India. Java and Bedrock crossplay, no mods required, CoreProtect rollbacks. Open to all players.",
      url: "https://gobitsnbytes.org/minecraft",
      sameAs: ["https://github.com/gobitsnbytes/minecraft-server"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free to join. No subscription, no pay-to-win.",
        availability: "https://schema.org/InStock",
      },
      provider: {
        "@id": "https://gobitsnbytes.org/#organization",
      },
      featureList: [
        "Java Edition support (port 25565)",
        "Bedrock Edition support (port 19132)",
        "Java and Bedrock crossplay",
        "Minecraft 1.21.1 Purpur server core",
        "No mods required",
        "G1GC tuned Java 21 runtime",
        "3000 chunk pre-generated radius",
        "CoreProtect block change logs",
        "48-hour block rollback window",
        "Daily world snapshots",
        "DiscordSRV in-game chat bridge",
        "Azure-hosted 4 vCPU 8 GB RAM",
        "Student-run and community-moderated",
        "Open-source server config on GitHub",
      ],
      inLanguage: ["en-IN", "hi-IN"],
      audience: {
        "@type": "Audience",
        audienceType: "Teen and student Minecraft players in India",
        geographicArea: {
          "@type": "Country",
          name: "India",
        },
      },
      screenshot: "/og-image.png",
    },
    {
      "@type": "HowTo",
      "@id": "https://gobitsnbytes.org/minecraft#howto-connect",
      name: "How to join the bits&bytes™ Minecraft server",
      description: "Connect on PC (Java) or on mobile and console (Bedrock) with the address mc.gobitsnbytes.org.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          name: "Launch Minecraft 1.21.1",
          text: "Open Minecraft Java Edition or Bedrock Edition (PE / Windows / Console).",
        },
        {
          "@type": "HowToStep",
          name: "Add the server",
          text: "Go to Multiplayer, then Add Server. Set the server address to mc.gobitsnbytes.org (port 25565 on Java, 19132 on Bedrock).",
        },
        {
          "@type": "HowToStep",
          name: "Connect and play",
          text: "Double-click the server to join. You don't need any mods.",
        },
      ],
    },
  ],
};

const SPONSOR_URL = "https://misbahkhursheed.vercel.app/";
const LINK = cn("underline decoration-1 underline-offset-4", LAB_HOVER);

const specs: { title: string; rows: [key: string, value: ReactNode][] }[] = [
  {
    title: "Runtime",
    rows: [
      ["Core:", "Purpur 1.21.1"],
      ["Compiler:", "Java 21"],
      ["GC:", "G1GC, tuned"],
      ["Pre-Gen:", "3000 radius"],
      ["Mods:", "0 required"],
    ],
  },
  {
    title: "Infrastructure",
    rows: [
      ["Host:", "Azure B2s"],
      ["Compute:", "4 vCPU"],
      ["Memory:", "8 GB RAM"],
      ["Backups:", "Daily snapshot"],
      [
        "Sponsor:",
        <LabLink key="sponsor" href={SPONSOR_URL} className={LINK}>
          Misbah Khursheed
        </LabLink>,
      ],
    ],
  },
  {
    title: "Protection",
    rows: [
      ["Engine:", "CoreProtect"],
      ["History:", "Block change logs"],
      ["Rollback:", "48-hour window"],
      ["Chat bridge:", "DiscordSRV"],
      ["Audit:", "Audit logs"],
    ],
  },
  {
    title: "Organization",
    rows: [
      ["Legal:", "Section 8 nonprofit"],
      ["Founded:", "2025"],
      ["Management:", "Student-run"],
      [
        "Source:",
        <LabLink key="source" href="https://github.com/gobitsnbytes/minecraft-server" className={LINK}>
          Open Source
        </LabLink>,
      ],
      ["Region:", "India"],
    ],
  },
];

const SECTION = "gap-y-10 pt-24 min-[760px]:pt-[136px]";
// Three title lines: cap the hero type by height too, so the Connect button clears a 1280×650 fold.
const HERO_FIT = "min-[760px]:[&_h1]:text-[length:min(calc(9.11458vw+12.5px),170px,15svh)]";
// Short cells get a line box as tall as the value's first line (LAB_TEXT.md) and centre on it.
const KEY_LINE = "flex h-[1.2em] items-center gap-[7px] text-[length:calc(0.5476vw+17.86px)]";

export default function MinecraftPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(minecraftJsonLd) }}
      />

      <section
        data-cinematic-section=""
        data-cinematic-title="Survival, run by students."
        data-surface="paper"
      >
        <LabHero
          lines={["Survival,", "run by", "students."]}
          glyph={<PixelGlyph text="MC" decorative />}
          aside={<LabGlobe />}
          subtitle={<p>Java and Bedrock in one world. No mods needed.</p>}
          className={HERO_FIT}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="burgundy" size="sm">
              <a href="#join">Connect</a>
            </Button>
            <LabTag>{SERVER_IP}</LabTag>
          </div>
        </LabHero>
      </section>

      {/* live readings beside the framed server reel */}
      <LabGrid
        as="section"
        id="live"
        data-cinematic-section=""
        data-cinematic-title="Live"
        data-surface="paper"
        className={SECTION}
      >
        <TableHeader as="h2" label="Live" className="col-span-full" />
        <ServerReel className="col-span-full self-start lg:col-[1/13]" />
        <LiveStats className="col-span-full self-start lg:col-[14/25]" />
      </LabGrid>

      <LabGrid
        as="section"
        id="specs"
        data-cinematic-section=""
        data-cinematic-title="Operations & specs"
        data-surface="paper"
        aria-labelledby="specs-title"
        className={cn(SECTION, "gap-y-14")}
      >
        <LabCell>
          <LabTitle id="specs-title" count={specs.length}>
            Operations &amp; specs
          </LabTitle>
        </LabCell>
        {specs.map((group) => (
          <article key={group.title} className="col-span-full grid grid-cols-subgrid content-start lg:col-span-12">
            <TableHeader as="h3" label={group.title} className="col-span-full" />
            <dl className="col-span-full grid grid-cols-subgrid">
              {group.rows.map(([key, value]) => (
                <div key={key} className="col-span-full grid grid-cols-subgrid items-start border-b border-line py-2.5">
                  <dt className={cn(KEY_LINE, "col-[1/5] font-mono")}>
                    <span aria-hidden className="size-2 shrink-0 bg-signal" />
                    <span className="text-[12px] uppercase leading-none tracking-[-0.02em]">{key}</span>
                  </dt>
                  <dd className={cn(LAB_TEXT.md, "col-[5/-1] min-w-0")}>{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </LabGrid>

      {/* connect: address + copy + ports in console chrome (#join keeps the old anchor) */}
      <LabGrid
        as="section"
        id="join"
        data-cinematic-section=""
        data-cinematic-title="See you in-game."
        data-surface="paper"
        aria-labelledby="join-title"
        className={SECTION}
      >
        <LabCell span="1/13">
          <LabTitle id="join-title">
            See you
            <br />
            <em className="bg-[var(--lab-hi,var(--marker))] not-italic text-ink">in-game.</em>
          </LabTitle>
        </LabCell>
        <LabCell span="14/-1">
          <ConsoleWindow title="Connect" bodyClassName="grid gap-6 p-5 md:p-8">
            <ConnectAddress serverIp={SERVER_IP} />
            <ul role="list" className="border-t border-dotted border-line font-mono text-[12px] uppercase leading-[1.2]">
              <li className="border-b border-dotted border-line py-3">Java: mc.gobitsnbytes.org (25565)</li>
              <li className="border-b border-dotted border-line py-3">Bedrock: mc.gobitsnbytes.org (19132)</li>
            </ul>
          </ConsoleWindow>
        </LabCell>
      </LabGrid>

      <section
        id="credits"
        data-cinematic-section=""
        data-cinematic-title="bits&bytes™"
        data-surface="paper"
        className="pt-24 min-[760px]:pt-[160px]"
      >
        <LabGrid>
          <LabFooterRows>
            <>
              <LabCell span="1/13">
                <p className={LAB_TEXT.sm}>
                  Infrastructure sponsored by{" "}
                  <LabLink href={SPONSOR_URL} className={cn(LINK, "font-semibold")}>
                    Misbah Khursheed
                  </LabLink>
                </p>
              </LabCell>
              <LabCell span="14/-1" className="grid gap-1.5 font-mono text-[12px] uppercase leading-[1.4] min-[760px]:text-right">
                <p className="normal-case">bits&amp;bytes™ by GOBITSNBYTES FOUNDATION</p>
                <p>© 2026 GOBITSNBYTES FOUNDATION. ALL RIGHTS RESERVED.</p>
              </LabCell>
            </>
          </LabFooterRows>
        </LabGrid>
        <HollowWord text="In-game." />
      </section>
    </>
  );
}
