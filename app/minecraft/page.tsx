import type { Metadata } from "next";

import { MinecraftScroll } from "./minecraft-scroll";

export const metadata: Metadata = {
  title: "Free Minecraft Survival Server India | Java + Bedrock | mc.gobitsnbytes.org",
  description:
    "India's best free Minecraft survival server — Java & Bedrock crossplay, 1.21.1 Purpur, zero mods, 20 TPS, CoreProtect anti-grief, daily backups. Connect now: mc.gobitsnbytes.org · Student-run by bits&bytes™.",
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
    "minecraft server lucknow",
    "minecraft server uttar pradesh",
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
    title: "Free Minecraft Server India 🎮 Java + Bedrock | mc.gobitsnbytes.org",
    description:
      "No pay-to-win. No mods needed. Zero lag. India's student-run Minecraft survival server — Java & Bedrock crossplay on 1.21.1. Connect: mc.gobitsnbytes.org",
    url: "https://gobitsnbytes.org/minecraft",
    type: "website",
    siteName: "bits&bytes™",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bits&bytes™ Minecraft Server — Free Java & Bedrock Crossplay, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Minecraft Server India 🎮 Java + Bedrock Crossplay",
    description:
      "Zero mods. Zero pay-to-win. 20 TPS. CoreProtect anti-grief. Connect on Java or Bedrock: mc.gobitsnbytes.org — India's student-run survival SMP.",
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
      name: "Free Minecraft Survival Server India | Java + Bedrock | mc.gobitsnbytes.org",
      description:
        "India's best free Minecraft survival server — Java & Bedrock crossplay, 1.21.1 Purpur, zero mods, 20 TPS, CoreProtect anti-grief.",
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
        "India's free student-run Minecraft 1.21.1 survival server with Java and Bedrock crossplay. No mods required. CoreProtect anti-grief. 20 TPS on Azure. Open to all players.",
      url: "https://gobitsnbytes.org/minecraft",
      sameAs: ["https://github.com/gobitsnbytes/minecraft-server"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free to join — no subscription, no pay-to-win",
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
        "Zero mods required — vanilla experience",
        "20 TPS lag-free gameplay",
        "G1GC tuned Java 21 runtime",
        "3000 chunk pre-generated radius",
        "CoreProtect anti-grief with 1.4M+ block logs",
        "48-hour block rollback window",
        "Daily world snapshots",
        "DiscordSRV in-game chat bridge",
        "Azure-hosted 4 vCPU 8 GB RAM",
        "99.98% uptime",
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
      screenshot: "/og-image.png",
    },
    {
      "@type": "HowTo",
      "@id": "https://gobitsnbytes.org/minecraft#howto-connect",
      name: "How to Join the bits&bytes™ Minecraft Server",
      description: "Quick setup instructions to connect on PC (Java) or Mobile/Console (Bedrock) using IP mc.gobitsnbytes.org.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          name: "Launch Minecraft 1.21.1",
          text: "Open Minecraft Java Edition or Bedrock Edition (PE / Windows / Console).",
        },
        {
          "@type": "HowToStep",
          name: "Add Server",
          text: "Click Multiplayer -> Add Server. Set Server Address to mc.gobitsnbytes.org (Port 25565 for Java, 19132 for Bedrock).",
        },
        {
          "@type": "HowToStep",
          name: "Connect & Play",
          text: "Double-click the server to join immediately with zero mods required.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://gobitsnbytes.org/minecraft#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the IP address for the bits&bytes™ Minecraft server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The server IP is mc.gobitsnbytes.org. Java Edition: port 25565 (default). Bedrock Edition: port 19132.",
          },
        },
        {
          "@type": "Question",
          name: "Is the bits&bytes™ Minecraft server free to join?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, it is completely free. There is no subscription, no pay-to-win, and no premium required. Just connect using the server IP mc.gobitsnbytes.org.",
          },
        },
        {
          "@type": "Question",
          name: "Does the Minecraft server support Bedrock and Java crossplay?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! The server fully supports Java and Bedrock crossplay. Java players connect on port 25565, Bedrock and Pocket Edition players connect on port 19132 — both using the IP mc.gobitsnbytes.org.",
          },
        },
        {
          "@type": "Question",
          name: "What Minecraft version does the server run?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The server runs Minecraft 1.21.1 on a Purpur server core with Java 21 and G1GC tuning for maximum performance. No mods or texture packs are required.",
          },
        },
        {
          "@type": "Question",
          name: "Is the server based in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The server is hosted on Microsoft Azure infrastructure in India, giving Indian players the best latency. It is student-run by the bits&bytes™ team, a Section 8 nonprofit based in Lucknow.",
          },
        },
        {
          "@type": "Question",
          name: "Is there protection against griefing on the server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The server uses CoreProtect with over 1.4 million block change logs and a 48-hour rollback window. Any grief can be undone. Audit logs and active moderation keep the server safe.",
          },
        },
        {
          "@type": "Question",
          name: "Can Pocket Edition (MCPE) players join?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Pocket Edition and Bedrock players on mobile, console, and Windows can join using the IP mc.gobitsnbytes.org on port 19132.",
          },
        },
      ],
    },
  ],
};

export default function MinecraftPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(minecraftJsonLd) }}
      />
      <MinecraftScroll serverIp={SERVER_IP} />
    </>
  );
}
