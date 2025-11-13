"use client"

import Navigation from "@/components/navigation"
import { useState } from "react"

export default function Join() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    experience: "beginner",
    interests: [],
    message: "",
  })

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckbox = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      })
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      })
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({
      name: "",
      email: "",
      school: "",
      experience: "beginner",
      interests: [],
      message: "",
    })
  }

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-slide-in-up">
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[#3e1e68] mb-4">Join Bits&Bytes</h1>
            <p className="text-xl text-[#656565]">Start your journey of innovation and creativity</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-[#e0e0e0] p-8 sm:p-12 animate-fade-in"
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#5d2f77] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#e45a92] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-[#5d2f77] mb-2">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                  placeholder="Your school name"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-[#e45a92] mb-2">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors"
                >
                  <option value="beginner">Beginner - Just starting out</option>
                  <option value="intermediate">Intermediate - Some experience</option>
                  <option value="advanced">Advanced - Confident coder</option>
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-[#5d2f77] mb-3">What interests you?</label>
                <div className="space-y-2">
                  {["Web Development", "Mobile Apps", "AI/ML", "Game Dev", "Design"].map((interest) => (
                    <label key={interest} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleCheckbox(interest)}
                        className="w-4 h-4 accent-[#e45a92]"
                      />
                      <span className="ml-3 text-[#656565] group-hover:text-[#e45a92] transition-colors">
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#e45a92] mb-2">Tell us about yourself</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-xl focus:border-[#e45a92] focus:outline-none transition-colors resize-none"
                  placeholder="What draws you to Bits&Bytes? What are your goals?"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#e45a92] text-white font-display font-bold rounded-xl hover:bg-[#d1437a] transition-all hover:shadow-lg hover:shadow-[#e45a92]/30"
              >
                Join Our Community
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
