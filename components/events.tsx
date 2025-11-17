"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Calendar, MapPin, Clock } from "lucide-react"

type Event = {
  _id: string
  image?: string
  title: string
  date: string
  description?: string
  location?: string
  googleFormLink?: string
  time?: string
}

export function Events() {
  const [eventsEnabled, setEventsEnabled] = useState(true)
  const [events, setEvents] = useState<Event[]>([]) // Explicitly define the type of events
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    try {
      const adminSettings = localStorage.getItem("codeClubAdminSettings")
      if (adminSettings) {
        const parsed = JSON.parse(adminSettings)
        setEventsEnabled(parsed.eventsEnabled ?? true)
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events")
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }
    fetchEvents()
  }, [])

  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = events.filter((event) => new Date(event.date) < new Date())

  if (!eventsEnabled) {
    return (
      <section id="events" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mx-auto mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Events are currently unavailable</h2>
            <p className="text-muted-foreground">
              Please check back later. This section has been turned off by an admin.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Events</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join us for workshops, hackathons, tech talks, and networking events
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl font-bold mb-8 gradient-text"
          >
            Upcoming Events
          </motion.h3>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Upcoming
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{event.description}</p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" style={{ color: "var(--accent-blue)" }} />
                        <span>{new Date(event.date).toLocaleDateString("en-US")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" style={{ color: "var(--accent-blue)" }} />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" style={{ color: "var(--accent-blue)" }} />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {event.googleFormLink && (
                      <a
                        href={event.googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-transform transform hover:scale-105"
                      >
                        Register
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No upcoming events available.</p>
          )}
        </div>

        {/* Past Events */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl font-bold mb-8 gradient-text"
          >
            Past Events
          </motion.h3>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      Completed
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-muted-foreground text-xs mb-3 leading-relaxed line-clamp-2">{event.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(event.date).toLocaleDateString("en-US")}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No past events available.</p>
          )}
        </div>
      </div>
    </section>
  )
}
