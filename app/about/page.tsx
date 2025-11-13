"use client"

import Navigation from "@/components/navigation"
import TeamCard from "@/components/team-card"

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
    name: "Alex Chen",
    role: "Co-Founder & Lead Dev",
    image: "/portrait-of-young-tech-leader.jpg",
    bio: "Full-stack developer passionate about AI and web development. Alex started Bits&Bytes to create a space for teen innovation.",
  },
  {
    id: 2,
    name: "Jordan Smith",
    role: "Co-Founder & Designer",
    image: "/portrait-of-young-designer.jpg",
    bio: "Creative UI/UX designer focused on accessible, beautiful digital experiences. Jordan drives the visual identity of our projects.",
  },
  {
    id: 3,
    name: "Maya Patel",
    role: "Community Lead",
    image: "/portrait-of-young-community-organizer.jpg",
    bio: "Enthusiastic about building community and mentoring. Maya ensures every member feels welcomed and supported in their journey.",
  },
  {
    id: 4,
    name: "Liam O'Brien",
    role: "Project Manager",
    image: "/portrait-of-young-project-manager.jpg",
    bio: "Strategic thinker who loves organizing chaos into beautiful projects. Liam keeps our team on track and motivated.",
  },
  {
    id: 5,
    name: "Sofia Rodriguez",
    role: "Backend Specialist",
    image: "/portrait-of-young-developer.jpg",
    bio: "Database enthusiast and system architect. Sofia builds the powerful engines that power our applications.",
  },
  {
    id: 6,
    name: "Kai Nakamura",
    role: "Mobile Dev Lead",
    image: "/portrait-of-young-mobile-developer.jpg",
    bio: "iOS and Android expert creating seamless mobile experiences. Kai brings apps to life on every device.",
  },
  {
    id: 7,
    name: "Emma Thompson",
    role: "DevOps Engineer",
    image: "/portrait-of-young-engineer.jpg",
    bio: "Infrastructure wizard ensuring everything runs smoothly. Emma handles deployment, security, and system reliability.",
  },
  {
    id: 8,
    name: "Marcus Johnson",
    role: "Content Creator",
    image: "/portrait-of-young-content-creator.jpg",
    bio: "Passionate educator creating tutorials and resources. Marcus makes coding accessible and fun for everyone.",
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
              <h2 className="font-display font-bold text-5xl sm:text-6xl text-[#3e1e68] mb-4">Meet Our Team</h2>
              <p className="text-xl text-[#656565] max-w-2xl mx-auto">
                The passionate teens behind Bits&Bytes, building tomorrow's innovation today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={member.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-in-up">
                  <TeamCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
