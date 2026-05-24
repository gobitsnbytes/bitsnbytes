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
      "Founder of Bits&Bytes (gobitsnbytes.org), leading 1,500+ active members in student-led tech culture",
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
      "Production-Grade Engineering",
      "LLMOps & RAG Architecture",
      "Agentic Workflows",
      "Next.js 16 / React 19",
      "System Design",
    ],
    achievements: [
      "AI-native systems engineer; lead architect for the entire Bits&Bytes production-grade tech infrastructure",
      "Designed high-performance efficient retrieval systems for complex AI workflows",
      "Developed reliable long-running autonomous execution stacks for complex tool orchestration",
      "Chapter Lead @ STEMist Education, founding builder-focused STEM culture at Boys High School, Prayagraj",
      "Project Lead for the Bits&Bytes Platform, turning community operations into durable infrastructure",
    ],
    talkToMeWhen: [
      "You care about the edge cases where AI systems usually break and want to build for real constraints",
      "You're building complex agentic workflows, LLMOps pipelines, or local-first AI software",
      "You want to discuss how technical execution and systems thinking overlap to ship meaningful product",
      "You want to close the gap between ambition and the first build for young developers",
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
      "Backend Architecture",
      "Database Systems",
      "Partnership Economics",
    ],
    achievements: [
      "Co-Architected the high-performance backend systems for the Bits&Bytes platform",
      "Executed partnerships that delivered genuine ROI for sponsors across multiple cities",
    ],
    talkToMeWhen: [
      "You are designing scalable database schemas or backend APIs",
      "You want to talk about how we treat participants like high-agency builders",
      "You're interested in the economics of sustainable tech communities",
    ],
    department: "Engineering",
  },
  {
    name: "Drishti Arora",
    role: "Chief Marketing Officer",
    photo: "/team/drishti.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
    superpowers: [
      "Marketing Strategy",
      "Brand Growth",
      "Campaign Management",
      "Audience Development",
    ],
    achievements: [
      "Leads marketing strategy and brand growth across all Bits&Bytes channels",
      "Drives audience development and campaign management for community growth",
    ],
    talkToMeWhen: [
      "You need marketing strategy for a launch or campaign",
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
      "Maintains the premium Bits&Bytes brand identity across all social channels",
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
    name: "Shantanu Joshi",
    role: "Creative Contributor",
    superpowers: [
      "Visual Design",
      "Illustration",
      "Campaign Creative",
      "Brand Collateral",
    ],
    achievements: [
      "Active creative contributor to Bits&Bytes projects",
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
        k.includes("cloud"),
    )
  ) {
    recommendations.push(
      "Engineering Team (Talk to Akshat Kushwaha or Devansh)",
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
