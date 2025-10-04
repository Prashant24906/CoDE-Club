"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings, Users, Calendar, BarChart3, Shield, ArrowLeft, Eye, EyeOff, Save } from "lucide-react"
import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"
import { AdminNavbar } from "@/components/admin-navbar"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [quizEnabled, setQuizEnabled] = useState(false)
  const [eventsEnabled, setEventsEnabled] = useState(true)
  const [registrationOpen, setRegistrationOpen] = useState(true)

  // Load admin settings
  useEffect(() => {
    const adminSettings = localStorage.getItem("codeClubAdminSettings")
    if (adminSettings) {
      const settings = JSON.parse(adminSettings)
      setQuizEnabled(settings.quizEnabled || false)
      setEventsEnabled(settings.eventsEnabled || true)
      setRegistrationOpen(settings.registrationOpen || true)
    }
  }, [])

  const handleLogin = () => {
    // Simple password check (in real app, this would be proper authentication)
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  const handleSaveSettings = () => {
    const settings = {
      quizEnabled,
      eventsEnabled,
      registrationOpen,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("codeClubAdminSettings", JSON.stringify(settings))
    alert("Settings saved successfully!")
  }

  const stats = [
    { label: "Members", value: "156", icon: Users, color: "text-cyan-400" },
    { label: "Events", value: "8", icon: Calendar, color: "text-emerald-400" },
    { label: "Quiz Attempts", value: "342", icon: BarChart3, color: "text-sky-400" },
  ]

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen">
        <AdminNavbar />
        <ParticleBackground />
        <div className="container mx-auto px-4 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md mx-auto"
          >
           

            <Card className="glass-card p-8">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
                <p className="text-muted-foreground mt-2">Enter admin password to continue</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 pr-12 text-foreground placeholder-muted-foreground bg-background/50"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <Button onClick={handleLogin} className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Access Admin Panel
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">Demo password: admin123</div>
            </Card>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      <AdminNavbar />
      <ParticleBackground />
      <div className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="glass-card rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div className="flex items-baseline gap-2">
                    <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center mb-8">
              <Settings className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Quiz Management</h3>
                <div className="flex items-center justify-between p-4 bg-background/20 rounded-lg">
                  <div>
                    <p className="text-foreground font-medium">Enable Quiz Section</p>
                    <p className="text-sm text-muted-foreground">Allow students to take quizzes</p>
                  </div>
                  <Switch checked={quizEnabled} onCheckedChange={setQuizEnabled} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Events Management</h3>
                <div className="flex items-center justify-between p-4 bg-background/20 rounded-lg">
                  <div>
                    <p className="text-foreground font-medium">Show Events</p>
                    <p className="text-sm text-muted-foreground">Display upcoming events</p>
                  </div>
                  <Switch checked={eventsEnabled} onCheckedChange={setEventsEnabled} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Registration</h3>
                <div className="flex items-center justify-between p-4 bg-background/20 rounded-lg">
                  <div>
                    <p className="text-foreground font-medium">Open Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new member signups</p>
                  </div>
                  <Switch checked={registrationOpen} onCheckedChange={setRegistrationOpen} />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </motion.div>

          {/* Direct Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <Card className="glass-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Member Management</h3>
              <p className="mb-4 text-sm text-muted-foreground">Add or remove club members and roles.</p>
              <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Link href="/admin/members">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Members
                </Link>
              </Button>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Event Planning</h3>
              <p className="mb-4 text-sm text-muted-foreground">Create, update, and remove events.</p>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/admin/events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Events
                </Link>
              </Button>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Quiz Builder</h3>
              <p className="mb-4 text-sm text-muted-foreground">Add questions and options to create quizzes.</p>
              <Button asChild className="w-full bg-sky-600 hover:bg-sky-700">
                <Link href="/admin/quizzes">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Create Quiz
                </Link>
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
