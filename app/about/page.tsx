"use client"

import TeamCaseStudy from "@/components/team-case-study"
import { PageSection } from "@/components/page-section"
import { WebGLShader } from "@/components/ui/web-gl-shader"

const aboutContent = {
  title: "About Bits&Bytes",
  description:
    "We're a teen-led code club dedicated to fostering innovation, collaboration, and real-world impact through technology.",
  sections: [
    {
      title: "Host Hackathons",
      description:
        "We organize competitive hackathons where teens can showcase their coding skills and build innovative projects under time pressure, fostering creativity and teamwork.",
    },
    {
      title: "Workshops & Learning",
      description:
        "Regular workshops cover everything from web development to AI/ML, helping teens master cutting-edge technologies and industry best practices.",
    },
    {
      title: "Connect & Collaborate",
      description:
        "We bring together like-minded individuals from different schools, creating a supportive club where teens can learn from each other and build lasting connections.",
    },
    {
      title: "Inspire & Build",
      description:
        "We inspire the next generation of developers and innovators to turn their ideas into reality and create solutions that make a real difference.",
    },
  ],
}

const teamMembers = [
  {
    id: 1,
    name: "Yash",
    role: "Co-Founder",
    image: "/team/yash.jpeg",
    bio: "Leads the entire organization, coordinating between all teams, organizing events, setting timelines, and ensuring that work gets executed efficiently.",
    expertise: ["Leadership", "Event Management", "Team Coordination", "Strategic Planning"],
    linkedin: "https://www.linkedin.com/in/yash-singh-a41540270/",
    accentColor: "#3E1E68", // Deep Purple
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika",
    role: "Co-Founder & Chief Creative Strategist",
    image: "/team/aadrika.png",
    bio: "Leads branding, design decisions, idea generation, and promotional campaign planning. Handles basic tech work and guides the overall direction of the organization.",
    expertise: ["Creative Strategy", "Brand Development", "Campaign Planning", "Design Direction"],
    linkedin: "https://in.linkedin.com/in/aadrika-maurya",
    accentColor: "#E45A92", // Vibrant Pink
    isFounder: true,
  },
  {
    id: 3,
    name: "Akshat",
    role: "Co-Founder & Technical Lead",
    image: "/team/akshat.png",
    bio: "Builds and maintains the website, leads programming projects, evaluates tech stacks, and ensures the technical stability of all projects.",
    expertise: ["AI & LLMOps", "Cloud Infrastructure", "Full-Stack Development"],
    linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
    accentColor: "#5D2F77", // Rich Plum
    isFounder: true,
  },
  {
    id: 4,
    name: "Devansh",
    role: "Founding Member & Backend Lead",
    image: "/team/devaansh.jpeg",
    bio: "Manages backend development, collaborates on technical features, and builds relationships with schools, students, and external communities for participation and support.",
    expertise: ["Backend Development", "Database Architecture", "Community Outreach", "Partnership Building"],
    linkedin: "https://www.linkedin.com/in/devaanshpa/",
  },
  {
    id: 5,
    name: "Saksham",
    role: "Ideation & Research Lead",
    image: "/team/saksham.jpeg",
    bio: "Brainstorms new concepts, supports ongoing initiatives with research, and helps refine plans for events and content.",
    expertise: ["Strategic Ideation", "Research & Analysis", "Concept Development", "Event Planning"],
    linkedin: "https://www.linkedin.com/in/sakshm/",
  },
  {
    id: 6,
    name: "Kaustubh",
    role: "Content & Video Producer",
    image: "/portrait-of-young-engineer.jpg",
    bio: "Creates compelling video content, edits event highlights, and works on storytelling that attracts attention.",
    expertise: ["Video Production", "Content Creation", "Video Editing", "Brand Storytelling"],
  },
  {
    id: 7,
    name: "Oviyaa",
    role: "Social Media & Promotions Head",
    image: "/portrait-of-young-community-organizer.jpg",
    bio: "Oversees all posts, creates promotional strategies, manages audience engagement, and focuses on increasing online reach across all social platforms.",
    expertise: ["Social Media Strategy", "Digital Marketing", "Community Engagement", "Growth Strategy"],
    linkedin: "https://www.linkedin.com/in/oviyaa-singh-3a183a370/",
  },
  {
    id: 8,
    name: "Maryam",
    role: "Lead Graphics Designer",
    image: "/portrait-of-young-mobile-developer.jpg",
    bio: "Designs visuals for posts, events, and campaigns while maintaining branding consistency. Coordinates closely with the social media and content teams.",
    expertise: ["Graphic Design", "Brand Identity", "Visual Communication", "Design Systems"],
    linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
  },
  {
    id: 9,
    name: "Fatima",
    role: "Graphics Design Associate",
    image: "/team/fatima.jpeg",
    bio: "Supports the graphics design workflows, helping to craft visuals and streamline the design process for faster execution.",
    expertise: ["Design Support", "Visual Assets", "Workflow Optimization", "Creative Collaboration"],
  },
]

export default function About() {
  return (
    <>
      <WebGLShader />
      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="About"
          title={aboutContent.title}
          description={aboutContent.description}
        >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {aboutContent.sections.map((section, index) => (
            <div
              key={section.title}
              className="glass-card relative isolate overflow-hidden p-6 text-foreground shadow-xl hover:shadow-[var(--glow-strong)] dark:text-white"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h3 className="font-display text-xl font-semibold text-foreground dark:text-white sm:text-2xl">{section.title}</h3>
              <p className="mt-3 text-sm text-foreground/80 dark:text-white/80 sm:text-base">{section.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        align="center"
        eyebrow="Team"
        title="Meet the Agents"
        description="A tight crew of designers, engineers, club leads, and storytellers powering Lucknow's teen-led tech movement."
      >
        <TeamCaseStudy members={teamMembers} />
        <p className="mt-6 text-center text-sm text-muted-foreground">*Roles stay flexible as our team and club grow.</p>
      </PageSection>
      </main>
    </>
  )
}


