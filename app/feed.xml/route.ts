import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://gobitsnbytes.org";
  const updatedDate = new Date().toISOString();

  const entries = [
    {
      title: "bits&bytes™ Official Launch: India's Pan-India Youth Builder Network",
      link: `${baseUrl}/about`,
      summary: "GOBITSNBYTES FOUNDATION incorporated as Section 8 non-profit company. Scaling teen developer hackathons and local builder chapters nationwide.",
      updated: "2026-06-02T10:00:00Z",
      id: `${baseUrl}/about#launch-2026`,
    },
    {
      title: "SparkCloud Partnership Announced: Free Cloud Compute for Teen Developers",
      link: `${baseUrl}/cloud`,
      summary: "bits&bytes™ partners with Sparkden to provide free cloud development spaces, container compute, and databases for teen builders in India.",
      updated: "2026-05-15T10:00:00Z",
      id: `${baseUrl}/cloud#sparkcloud-launch`,
    },
    {
      title: "Hack4Good v0 Archived: Lucknow's Landmark Agentic AI Hackathon",
      link: `${baseUrl}/events`,
      summary: "425+ registrations, 110 on-ground attendees, and ₹35,000 in prizes awarded at Cubispace Lucknow for autonomous AI agents.",
      updated: "2026-05-03T18:00:00Z",
      id: `${baseUrl}/events#hack4good-v0`,
    },
    {
      title: "India Innovates 2026: Official Executive Partner at Bharat Mandapam",
      link: `${baseUrl}/events`,
      summary: "bits&bytes™ served as the Official Executive Partner for the World's Largest Civic Tech Hackathon at Bharat Mandapam, New Delhi with 1.26 crore+ applicants.",
      updated: "2026-03-28T20:00:00Z",
      id: `${baseUrl}/events#india-innovates-2026`,
    },
  ];

  const atomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>bits&amp;bytes™ | India's Youth Builder Network</title>
  <subtitle>Announcements, hackathons, and releases from GOBITSNBYTES FOUNDATION</subtitle>
  <link href="${baseUrl}/feed.xml" rel="self"/>
  <link href="${baseUrl}"/>
  <updated>${updatedDate}</updated>
  <id>${baseUrl}/</id>
  <author>
    <name>bits&amp;bytes™ Team</name>
    <email>hello@gobitsnbytes.org</email>
    <uri>${baseUrl}</uri>
  </author>
  ${entries
    .map(
      (entry) => `
  <entry>
    <title>${entry.title}</title>
    <link href="${entry.link}"/>
    <id>${entry.id}</id>
    <updated>${entry.updated}</updated>
    <summary>${entry.summary}</summary>
  </entry>`
    )
    .join("")}
</feed>`;

  return new NextResponse(atomFeed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
