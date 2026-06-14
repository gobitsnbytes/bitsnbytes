export interface TeamMember {
  name: string;
  role: string;
  superpowers: string[];
  achievements: string[];
  talkToMeWhen: string[];
  department:
    | "Leadership"
    | "Engineering"
    | "Design"
    | "Community"
    | "Content"
    | "Operations";
  photo?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Yash Singh",
    role: "Chief Executive Officer",
    photo: "/team/yash.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/yashvardhansinghbnb/",
      github: "https://github.com/yashclouded",
      website: "https://yashvibe.codes/",
    },
    superpowers: [
      "Full-Stack Engineering",
      "Mathematics (IOQM)",
      "AI / LLM Intelligence",
      "Game Dev (GoDOT)",
      "Three.js & Creative Coding",
    ],
    achievements: [
      "Founder of bits&bytes™ (gobitsnbytes.org), leading 1,500+ active members in student-led tech culture",
      "Created Codiva: A 5-star rated VS Code extension that gamifies coding for thousands of users",
      "National Qualifier for the Indian Mathematics Olympiad (IOQM)",
      "Built Alem (AI notes app <25MB) and MailAF (AI cold outreach automation)",
      "Educator at STEMist Lucknow, teaching Computer Science to underprivileged students with talent",
      "Lead Organizer for local developer meetups and Galactic Local Mentor at regional hackathons",
    ],
    talkToMeWhen: [
      "You want to discuss community building or scaling high-agency movements",
      "You need help with VS Code extensions, Three.js, or AI-powered outreach workflows",
      "You want to talk about deep mathematical problem solving or competitive programming",
      "You're interested in hardware experiments like LiDAR-based fitness apps or Flipper Zero clones",
    ],
    department: "Leadership",
  },
  {
    name: "Aadrika Maurya",
    role: "Chief Creative Officer & Chief Operating Officer",
    photo: "/team/aadrika.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/aadrika-maurya/",
      github: "https://github.com/Aadrika08",
      website: "https://aadrikasportfolio.framer.website/",
    },
    superpowers: [
      "Neuroscience Research",
      "Creative Strategy",
      "Brand Development",
      "Regional Management",
      "Design Direction",
    ],
    achievements: [
      "RSI India Alumni who conducted neuroscience research on EEG signals and attention pattern modeling",
      "Regional Coordinator for student-led developer meetups, empowering local student developers",
      "Leading creative strategy and cross-city collaboration initiatives for teen builders",
      "Designed the complete visual identity and campaign strategy for India-wide movements",
    ],
    talkToMeWhen: [
      "You need input on complex design systems or branding strategy",
      "You want to discuss neuroscience, cognitive modeling, or research-driven design",
      "You are looking for insights on regional event management and scaling communities",
    ],
    department: "Design",
  },
  {
    name: "Akshat Kushwaha",
    role: "Chief Technology Officer",
    photo: "/team/akshat.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      github: "https://github.com/a3ro-dev",
      website: "https://a3ro.dev",
    },
    superpowers: [
      "Systems Engineering & Architecture",
      "LLMOps, RAG & Retrieval Systems",
      "Agentic Workflow Design",
      "AI-Native Product Engineering",
      "Latency Optimization & Token Efficiency",
      "Next.js / React / Python / FastAPI",
    ],
    achievements: [
      "Built and owns the entire bits&bytes™ technical infrastructure from scratch — every system, every stack decision",
      "Jr. Research Engineer at jhana.ai (India's leading legal AI lab): cut time-to-first-token by 60% by replacing GPT-4o-mini with a self-hosted model, built IVRS automation, and shipped a context-window manager for long dictations",
      "Built Lexana: multi-agent legal intelligence platform with semantic caching (60% LLM cost reduction), real-time WebSocket editing, and RAG pipeline — expanded to Nepal",
      "Built HybridMind: custom hybrid retrieval engine combining FAISS vector search with GraphSAGE-style graph relationships and SQLite WAL persistence",
      "Contributed to production AI systems handling 1.6M+ quarterly requests across real government and legal infrastructure",
      "Started a design studio at 12, scaled to 30 people and 500+ orders in one year",
    ],
    talkToMeWhen: [
      "You have any technical question — architecture, AI systems, retrieval, infrastructure, or product engineering",
      "You're building agentic workflows, LLMOps pipelines, or RAG systems and want to avoid the common failure modes",
      "You want to talk about latency, token efficiency, or making AI systems work reliably under real constraints",
      "You're building anything that needs to survive contact with production",
      "You want to discuss system design, backend architecture, or AI-native product development",
    ],
    department: "Engineering",
  },
  {
    name: "Devaansh Pathak",
    role: "Chief Financial Officer",
    photo: "/team/devansh.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/devaanshpa/",
    },
    superpowers: [
      "Partnership Economics",
      "Financial Operations",
      "Backend Support",
    ],
    achievements: [
      "Manages financial operations and sponsor economics for bits&bytes™",
      "Executed partnerships that delivered genuine ROI for sponsors across multiple cities",
    ],
    talkToMeWhen: [
      "You have questions about sponsorship tiers, partnership economics, or event finances",
      "You're interested in the financial side of running a student-led nonprofit",
    ],
    department: "Operations",
  },
  {
    name: "Drishti Arora",
    role: "Chief Growth Officer",
    photo: "/team/drishti.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
    superpowers: [
      "Growth Strategy",
      "Brand Growth",
      "Campaign Management",
      "Audience Development",
    ],
    achievements: [
      "Leads growth strategy and brand growth across all bits&bytes™ channels",
      "Drives audience development and campaign management for community growth",
    ],
    talkToMeWhen: [
      "You need growth strategy for a launch or campaign",
      "You want to grow audience reach and engagement",
      "You have questions about brand positioning and growth",
    ],
    department: "Leadership",
  },
  {
    name: "Raghwender Vasisth",
    role: "Head of Operations",
    photo: "/team/raghav.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/raghwender-vasisth/",
    },
    superpowers: [
      "Operations Management",
      "Process Optimization",
      "Resource Logistics",
      "Team Coordination",
    ],
    achievements: [
      "Drives operational excellence and keeps the organization running at scale",
      "Optimizes processes and resource logistics for city-wide events",
    ],
    talkToMeWhen: [
      "You need help with operations planning or logistics",
      "You want to optimize team workflows and processes",
      "You have questions about resource allocation and coordination",
    ],
    department: "Operations",
  },
  {
    name: "Maryam Fatima",
    role: "Head of Brand & Media",
    photo: "/team/maryam.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
    },
    superpowers: [
      "Visual Communication",
      "Brand Consistency",
      "Impact Storytelling",
      "Social Strategy",
    ],
    achievements: [
      "Generating 10k+ impressions for club events through strategic storytelling",
      "Maintains the premium bits&bytes™ brand identity across all social channels",
      "Orchestrated promotions for GitHub Copilot Dev Days and multiple independent hackathons",
    ],
    talkToMeWhen: [
      "You need high-impact visuals for a campaign or real-world product launch",
      "You want to ensure visual consistency for a student-led project",
      "You have questions regarding premium social media presence",
    ],
    department: "Design",
  },
  {
    name: "Srishti Singh",
    role: "Head of Partnerships & Institutional Relations",
    photo: "/team/srishti.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
    },
    superpowers: [
      "Process Optimization",
      "Resource Coordination",
      "Logistics Management",
      "Internal Communication",
    ],
    achievements: [
      "Engineered the internal communication workflows for our 100+ active members",
      "Coordinated logistics for regional hackathons and multiple city-wide transitions",
      "Optimized the project lifecycle from workshop to tangible product launch",
    ],
    talkToMeWhen: [
      "You need help navigating internal operations or resource allocation",
      "You want to optimize the transition from idea to shipped product",
      "You need assistance coordinating cross-department city-wide hackathons",
    ],
    department: "Operations",
  },
  {
    name: "Angel",
    role: "Head of Research & Strategy",
    photo: "/team/angel.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/angelp-online/",
      instagram: "https://www.instagram.com/rightangeled/",
    },
    superpowers: [
      "Research & Analysis",
      "Strategic Planning",
      "Community Development",
    ],
    achievements: [
      "Leads strategic research initiatives to identify emerging tech trends and builder opportunities",
      "Develops frameworks for project evaluation and community growth metrics",
    ],
    talkToMeWhen: [
      "You want to discuss tech trends, user research, or project strategy",
      "You need help structuring research frameworks or evaluating strategic growth paths",
    ],
    department: "Leadership",
  },
  {
    name: "Shantanu Joshi",
    role: "Creative Contributor",
    superpowers: [
      "Visual Design",
      "Illustration",
      "Campaign Creative",
      "Brand Collateral",
    ],
    achievements: [
      "Active creative contributor to bits&bytes™ projects",
      "Contributed design assets and creative support for community campaigns",
    ],
    talkToMeWhen: [
      "You need help with campaign visuals or illustration assets",
      "You want a fresh creative perspective on brand collateral",
    ],
    department: "Design",
  },
];

export function findExperts(query: string): TeamMember[] {
  const lowerQuery = query.toLowerCase();
  if (!lowerQuery) return TEAM_MEMBERS;

  return TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(lowerQuery) ||
      member.role.toLowerCase().includes(lowerQuery) ||
      member.superpowers.some((s) => s.toLowerCase().includes(lowerQuery)) ||
      member.achievements.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      member.talkToMeWhen.some((t) => t.toLowerCase().includes(lowerQuery)),
  );
}

export function recommendRoles(skills: string[], interests: string[]): string {
  const userKeywords = [...skills, ...interests].map((k) => k.toLowerCase());
  const recommendations: string[] = [];

  if (
    userKeywords.some(
      (k) =>
        k.includes("design") ||
        k.includes("ui") ||
        k.includes("art") ||
        k.includes("drawing") ||
        k.includes("brand"),
    )
  ) {
    recommendations.push("Design & Content Team (Talk to Aadrika or Maryam)");
  }
  if (
    userKeywords.some(
      (k) =>
        k.includes("code") ||
        k.includes("dev") ||
        k.includes("web") ||
        k.includes("python") ||
        k.includes("js") ||
        k.includes("ai") ||
        k.includes("cloud") ||
        k.includes("backend") ||
        k.includes("frontend") ||
        k.includes("llm") ||
        k.includes("rag") ||
        k.includes("agent") ||
        k.includes("infra") ||
        k.includes("system") ||
        k.includes("tech") ||
        k.includes("engineering") ||
        k.includes("api") ||
        k.includes("database") ||
        k.includes("architecture"),
    )
  ) {
    recommendations.push(
      "Engineering Team (Talk to Akshat Kushwaha — CTO and the primary technical lead for everything infra, AI, and product)",
    );
  }
  if (
    userKeywords.some(
      (k) =>
        k.includes("people") ||
        k.includes("event") ||
        k.includes("manage") ||
        k.includes("lead") ||
        k.includes("operations"),
    )
  ) {
    recommendations.push(
      "Community, Operations & Leadership (Talk to Yash, Raghav or Srishti)",
    );
  }

  if (recommendations.length === 0) {
    return "General Member - join our Discord to explore different tracks!";
  }

  return recommendations.join(", ");
}
