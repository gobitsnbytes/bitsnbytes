import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://gobitsnbytes.org";
  const buildDate = new Date().toUTCString();

  const items = [
    {
      title: "bits&bytes™ Official Launch: India's Pan-India Youth Builder Network",
      link: `${baseUrl}/about`,
      description: "GOBITSNBYTES FOUNDATION incorporated as Section 8 non-profit company. Scaling teen developer hackathons and local builder chapters nationwide.",
      pubDate: new Date("2026-06-02").toUTCString(),
      guid: `${baseUrl}/about#launch-2026`,
      category: "Network Announcement",
    },
    {
      title: "SparkCloud Partnership Announced: Free Cloud Compute for Teen Developers",
      link: `${baseUrl}/cloud`,
      description: "bits&bytes™ partners with Sparkden (The Spark Forward Foundation, Inc.) to provide free cloud development spaces, container compute, and databases for teen builders in India.",
      pubDate: new Date("2026-05-15").toUTCString(),
      guid: `${baseUrl}/cloud#sparkcloud-launch`,
      category: "Partnership",
    },
    {
      title: "Hack4Good v0 Archived: Lucknow's Landmark Agentic AI Hackathon",
      link: `${baseUrl}/events`,
      description: "425+ registrations, 110 on-ground attendees, and ₹35,000 in prizes awarded at Cubispace Lucknow for autonomous AI agents.",
      pubDate: new Date("2026-05-03").toUTCString(),
      guid: `${baseUrl}/events#hack4good-v0`,
      category: "Hackathons",
    },
    {
      title: "India Innovates 2026: Official Executive Partner at Bharat Mandapam",
      link: `${baseUrl}/events`,
      description: "bits&bytes™ served as the Official Executive Partner for the World's Largest Civic Tech Hackathon at Bharat Mandapam, New Delhi with 1.26 crore+ applicants.",
      pubDate: new Date("2026-03-28").toUTCString(),
      guid: `${baseUrl}/events#india-innovates-2026`,
      category: "Civic Tech",
    },
    {
      title: "Execron 1.0 at IIT Kanpur: AI Hackathon & Workshop for Classes 9–12",
      link: `${baseUrl}/events`,
      description: "Co-hosted AI Hackathon & Workshop at IIT Kanpur during TechKriti '26 for high school coders.",
      pubDate: new Date("2026-03-22").toUTCString(),
      guid: `${baseUrl}/events#execron-1-0`,
      category: "Workshops",
    },
    {
      title: "bits&bytes™ Minecraft SMP Server 1.21.1 Crossplay Launched",
      link: `${baseUrl}/minecraft`,
      description: "Free student survival multiplayer server with Java & Bedrock crossplay, zero pay-to-win, and CoreProtect anti-grief on Azure infrastructure.",
      pubDate: new Date("2026-02-10").toUTCString(),
      guid: `${baseUrl}/minecraft#server-launch`,
      category: "Community",
    },
  ];

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>bits&amp;bytes™ | India's Youth Builder Network</title>
    <link>${baseUrl}</link>
    <description>Latest news, hackathons, workshops, and product announcements from bits&amp;bytes™ (GOBITSNBYTES FOUNDATION).</description>
    <language>en-IN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.svg</url>
      <title>bits&amp;bytes™</title>
      <link>${baseUrl}</link>
    </image>
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category}</category>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
