"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Send } from "lucide-react"

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-muted-foreground" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "codeclub@university.edu",
      href: "mailto:codeclub@university.edu",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Computer Science Building, Room 201",
      href: "#",
    },
  ]

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Have questions? Want to join our community? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="glass rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all"
                    style={{ focusRingColor: "var(--accent-blue)" }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="glass rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all"
                    style={{ focusRingColor: "var(--accent-blue)" }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all"
                  style={{ focusRingColor: "var(--accent-blue)" }}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all"
                  style={{ focusRingColor: "var(--accent-blue)" }}
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full glass rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ focusRingColor: "var(--accent-blue)" }}
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full py-3"
                    style={{ background: `linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))` }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer-style Social Links Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 glass-card rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
              <p className="text-muted-foreground">Follow us for updates, events, and highlights.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* using existing socialLinks from this file */}
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  aria-label={social.label}
                  className={`inline-flex items-center justify-center h-11 w-11 rounded-full glass hover:bg-white/10 transition-all ${social.color}`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
