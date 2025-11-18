"use client"

import TeamCaseStudy from "@/components/team-case-study"
import { PageSection } from "@/components/page-section"

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
        "We bring together like-minded individuals from different schools, creating a supportive community where teens can learn from each other and build lasting connections.",
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
    role: "Founder",
    image: "/portrait-of-young-tech-leader.jpg",
    bio: "Leads the entire organization, coordinating between all teams, organizing events, setting timelines, and ensuring that work gets executed efficiently.",
    expertise: ["Leadership", "Event Operations", "Team Coordination"],
  },
  {
    id: 2,
    name: "Aadrika",
    role: "Co-Founder & Chief Creative Strategist",
    image: "/portrait-of-young-community-organizer.jpg",
    bio: "Leads branding, design decisions, idea generation, and promotional campaign planning while handling basic tech work and guiding the overall direction.",
    expertise: ["Branding", "Creative Strategy", "Campaign Planning"],
  },
  {
    id: 3,
    name: "Akshat",
    role: "Co-Founder & Technical Lead",
    image: "/portrait-of-young-project-manager.jpg",
    bio: "Builds and maintains the website, leads programming projects, evaluates tech stacks, and ensures the technical stability of all projects.",
    expertise: ["Technical Architecture", "Web Development", "Project Delivery"],
  },
  {
    id: 4,
    name: "Devansh",
    role: "Founding Member, Backend & Outreach Coordinator",
    image: "/portrait-of-young-developer.jpg",
    bio: "Manages backend development, collaborates on technical features, and builds relationships with schools, students, and external communities for participation and support.",
    expertise: ["Backend Development", "Databases", "Community Outreach"],
  },
  {
    id: 5,
    name: "Saksham",
    role: "Ideation & Research Associate",
    image: "/portrait-of-young-designer.jpg",
    bio: "Brainstorms new concepts, supports ongoing initiatives with research, and helps refine plans for events and content.",
    expertise: ["Ideation", "Research", "Concept Development"],
  },
  {
    id: 6,
    name: "Kaustubh",
    role: "Content & Reels Producer",
    image: "/portrait-of-young-engineer.jpg",
    bio: "Creates compelling video content, edits event highlights, and works on storytelling that attracts attention.",
    expertise: ["Content Production", "Video Editing", "Storytelling"],
  },
  {
    id: 7,
    name: "Oviyaa",
    role: "Social Media Manager & Promotions Head (flexible role)",
    image: "/portrait-of-young-community-organizer.jpg",
    bio: "Oversees all posts, creates promotional strategies, manages audience engagement, and focuses on increasing online reach.",
    expertise: ["Social Media Strategy", "Promotions", "Community Engagement"],
  },
  {
    id: 8,
    name: "Maryam",
    role: "Graphics Designer (flexible role)",
    image: "/portrait-of-young-mobile-developer.jpg",
    bio: "Designs visuals for posts, events, and campaigns while maintaining branding consistency, and coordinates closely with the social media and content teams.",
    expertise: ["Graphic Design", "Brand Consistency", "Visual Communication"],
  },
  {
    id: 9,
    name: "Fatima",
    role: "Graphics Design Assistant (flexible role)",
    image: "/portrait-of-young-content-creator.jpg",
    bio: "Supports the graphics design workflows, helping to craft visuals and streamline the design process.",
    expertise: ["Design Support", "Workflow Optimization", "Content Design"],
  },
  {
    id: 10,
    name: "Areeb",
    role: "Community Outreach & Programming Support (flexible role)",
    image: "/portrait-of-young-developer.jpg",
    bio: "Expands reach within student networks, assists in coding tasks, and provides technical support for events.",
    expertise: ["Community Outreach", "Programming Support", "Event Tech"],
  },
]

export default function About() {
  return (
    <main className="bg-transparent">
      <PageSection
        eyebrow="About"
        title={aboutContent.title}
        description={aboutContent.description}
        align="center"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {aboutContent.sections.map((section, index) => (
            <div
              key={section.title}
              className="card-surface border-white/20 bg-white/80 p-6 text-left dark:border-white/5 dark:bg-white/5"
              style={{ animationDelay: `${index * 0.05}s` }}
                  >
              <h3 className="font-display text-2xl font-semibold text-foreground">{section.title}</h3>
              <p className="mt-3 text-base text-muted-foreground">{section.description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        eyebrow="Team"
        title="Meet the Agents"
        description="A tight crew of designers, engineers, community leads, and storytellers powering Lucknow’s teen-led tech movement."
        align="center"
      >
        <TeamCaseStudy members={teamMembers} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          *Roles stay flexible as our team and community grow.
        </p>
      </PageSection>
      </main>
  )
}
