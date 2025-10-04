"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Users } from "lucide-react"

export function Members() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const executiveTeam = [
    {
      name: "Alex Chen",
      role: "President",
      image: "/professional-male-developer.png",
      social: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
      name: "Sarah Johnson",
      role: "Vice President",
      image: "/professional-female-developer.png",
      social: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
      name: "Mike Rodriguez",
      role: "Secretary",
      image: "/professional-male-programmer.png",
      social: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
      name: "Emily Zhang",
      role: "Vice Secretary",
      image: "/professional-asian-female-developer.jpg",
      social: { github: "#", linkedin: "#", twitter: "#" },
    },
  ]

  const departments = [
    {
      name: "Technology Department",
      lead: {
        name: "David Kim",
        role: "Tech Lead",
        image: "/professional-tech-lead.png",
        bio: "Senior developer specializing in system architecture and mentoring",
      },
      color: "blue",
      members: [
        { name: "Lisa Wang", role: "Full Stack Developer" },
        { name: "James Wilson", role: "Backend Developer" },
        { name: "Anna Petrov", role: "Frontend Developer" },
        { name: "Carlos Martinez", role: "DevOps Engineer" },
        { name: "Sophie Brown", role: "Mobile Developer" },
        { name: "Ryan Taylor", role: "AI/ML Engineer" },
      ],
    },
    {
      name: "Documentation Department",
      lead: {
        name: "Emma Davis",
        role: "Documentation Lead",
        image: "/professional-female-writer.png",
        bio: "Expert in technical writing and knowledge management",
      },
      color: "emerald",
      members: [
        { name: "Oliver Smith", role: "Technical Writer" },
        { name: "Maya Patel", role: "Content Creator" },
        { name: "Lucas Johnson", role: "Documentation Manager" },
      ],
    },
    {
      name: "Marketing Department",
      lead: {
        name: "Jessica Lee",
        role: "Marketing Lead",
        image: "/professional-marketing-lead.png",
        bio: "Creative strategist driving brand awareness and engagement",
      },
      color: "indigo",
      members: [
        { name: "Noah Wilson", role: "Social Media Manager" },
        { name: "Ava Garcia", role: "Content Strategist" },
        { name: "Ethan Brown", role: "Graphic Designer" },
        { name: "Isabella Martinez", role: "Event Coordinator" },
        { name: "Mason Davis", role: "Community Manager" },
        { name: "Sophia Rodriguez", role: "Brand Manager" },
      ],
    },
    {
      name: "Design Department",
      lead: {
        name: "Chloe Anderson",
        role: "Design Lead",
        image: "/professional-design-lead.png",
        bio: "UX/UI expert creating beautiful and functional experiences",
      },
      color: "purple",
      members: [
        { name: "Liam Thompson", role: "UI/UX Designer" },
        { name: "Zoe White", role: "Visual Designer" },
        { name: "Jackson Harris", role: "Product Designer" },
        { name: "Grace Clark", role: "Interaction Designer" },
        { name: "Aiden Lewis", role: "Design Systems Lead" },
        { name: "Lily Walker", role: "User Researcher" },
      ],
    },
    {
      name: "Logistics Department",
      lead: {
        name: "Benjamin Hall",
        role: "Logistics Lead",
        image: "/professional-logistics-lead.png",
        bio: "Operations expert ensuring smooth execution of all events",
      },
      color: "orange",
      members: [
        { name: "Mia Allen", role: "Event Planner" },
        { name: "Alexander Young", role: "Venue Coordinator" },
        { name: "Charlotte King", role: "Supply Manager" },
        { name: "William Wright", role: "Transportation Lead" },
        { name: "Amelia Lopez", role: "Catering Coordinator" },
        { name: "Henry Hill", role: "Equipment Manager" },
      ],
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
      emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      indigo: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
      purple: "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400",
      orange: "border-orange-500/30 bg-orange-500/5 text-orange-600 dark:text-orange-400",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section id="members" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Passionate individuals driving innovation and fostering a collaborative learning environment
          </p>
        </motion.div>

        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold text-center mb-12 gradient-text"
          >
            Executive Leadership
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {executiveTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="glass-card rounded-2xl p-6 text-center group cursor-pointer relative overflow-hidden"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image || "/placeholder.svg?height=96&width=96&query=executive-member"}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xl font-semibold mb-1 text-foreground">{member.name}</h4>
                <p className="text-blue-500 text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {departments.map((dept, deptIndex) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 + deptIndex * 0.2 }}
              className="relative"
            >
              <div className={`glass-card rounded-3xl p-6 md:p-8 border-2 ${getColorClasses(dept.color)}`}>
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{dept.name}</h3>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{dept.members.length + 1} Members</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.6, delay: 0.1 + deptIndex * 0.1 }}
                    className="md:basis-2/5 lg:basis-[42%]"
                  >
                    <div className="glass-card rounded-2xl p-6 border-2 border-current h-full">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={
                            dept.lead.image ||
                            `/placeholder.svg?height=160&width=160&query=${dept.lead.name.toLowerCase().replace(" ", "-") || "/placeholder.svg"}-lead`
                          }
                          alt={dept.lead.name}
                          className="w-32 h-32 rounded-2xl object-cover mb-4"
                        />
                        <h4 className="text-lg font-semibold mb-1 text-foreground">{dept.lead.name}</h4>
                        <p className="font-medium text-current">{dept.lead.role}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 + deptIndex * 0.1 }}
                    className="md:basis-3/5 lg:basis-[58%]"
                  >
                    <div className="grid grid-cols-3 grid-rows-2 gap-4">
                      {dept.members.slice(0, 6).map((member, index) => (
                        <motion.div
                          key={member.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          className="glass-card rounded-xl p-5 text-center"
                        >
                          <img
                            src={`/.jpg?key=p7ik4&height=64&width=64&query=${member.name.toLowerCase().replace(" ", "-")}-member`}
                            alt={member.name}
                            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                          />
                          <h5 className="text-base font-semibold text-foreground">{member.name}</h5>
                          <p className="text-sm text-current">{member.role}</p>
                        </motion.div>
                      ))}
                    </div>
                    {dept.members.length > 6 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {dept.members.slice(6).map((member, index) => (
                          <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, delay: 0.1 + index * 0.04 }}
                            className="glass-card rounded-lg p-4 text-center"
                          >
                            <img
                              src={`/.jpg?key=lm01j&height=56&width=56&query=${member.name.toLowerCase().replace(" ", "-")}-member`}
                              alt={member.name}
                              className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                            />
                            <h6 className="text-sm font-medium text-foreground">{member.name}</h6>
                            <p className="text-xs text-current">{member.role}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
