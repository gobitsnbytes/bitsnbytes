"use client"

import Navigation from "@/components/navigation"
import TeamCaseStudy from "@/components/team-case-study"

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
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* About Section */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-slide-in-up">
              <h1 className="font-display font-bold text-5xl sm:text-6xl text-[#3e1e68] mb-4">{aboutContent.title}</h1>
              <p className="text-xl text-[#656565] max-w-2xl mx-auto">{aboutContent.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {aboutContent.sections.map((section, index) => {
                const colors = ["bg-[#3e1e68]", "bg-[#e45a92]", "bg-[#5d2f77]", "bg-[#ffacac]"]
                const textColors = ["text-white", "text-white", "text-white", "text-[#3e1e68]"]
                return (
                  <div
                    key={index}
                    className={`p-8 ${colors[index % 4]} rounded-2xl ${textColors[index % 4]} animate-slide-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="font-display font-bold text-2xl mb-3">{section.title}</h3>
                    <p
                      className={textColors[index % 4] === "text-white" ? "text-white/90" : "text-[#3e1e68]/80"}
                      style={{ opacity: textColors[index % 4] === "text-white" ? 0.9 : 0.8 }}
                    >
                      {section.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="border-t-2 border-[#e45a92]/20 pt-20">
            <div className="text-center mb-16 animate-slide-in-up">
              <h2 className="font-display font-bold text-5xl sm:text-6xl text-[#3e1e68] mb-4">Meet the Team</h2>
              <p className="text-xl text-[#656565] max-w-2xl mx-auto">
                The core crew behind Bits&Bytes—leading strategy, tech, community, and creativity to build Lucknow&apos;s coolest teen-led tech movement.
              </p>
            </div>

            <TeamCaseStudy members={teamMembers} />
            <p className="mt-6 text-center text-sm text-[#656565] max-w-2xl mx-auto">
              *Some roles are flexible and may evolve as our team and community grow.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
