"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, Users, Calendar, FileText, Activity, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, MapPin, ArrowRight,
  Plus, RefreshCw
} from "lucide-react"

// Types
interface Fork {
  id: string
  name: string
  city: string
  status: string
  points: number
  healthScore: number
  healthStatus: string
  level: string
  eventsCount: number
  teamSize: number
}

interface Event {
  id: string
  name: string
  type: string
  status: string
  date?: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  status: string
}

interface LeaderboardEntry {
  rank: number
  forkId: string
  forkName: string
  city: string
  points: number
  level: string
  badge: string
}

const LEVEL_COLORS: Record<string, string> = {
  "Seed Fork": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Active Fork": "bg-green-100 text-green-800 border-green-200",
  "High Impact Fork": "bg-blue-100 text-blue-800 border-blue-200",
  "Elite Fork": "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const HEALTH_COLORS: Record<string, string> = {
  "Excellent": "text-green-600",
  "Good": "text-yellow-600",
  "Fair": "text-orange-600",
  "At Risk": "text-red-600",
}

const EVENT_STATUS_COLORS: Record<string, string> = {
  "Draft": "bg-gray-100 text-gray-800",
  "Planning": "bg-blue-100 text-blue-800",
  "Announced": "bg-purple-100 text-purple-800",
  "Ongoing": "bg-green-100 text-green-800",
  "Completed": "bg-gray-100 text-gray-600",
  "Cancelled": "bg-red-100 text-red-800",
}

export function ForkDashboard() {
  const [forks, setForks] = useState<Fork[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedFork, setSelectedFork] = useState<Fork | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [configMissing, setConfigMissing] = useState<string[]>([])

  useEffect(() => {
    fetchForks()
  }, [])

  async function fetchForks() {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch("/api/forks")
      const data = await res.json()

      if (!res.ok) {
        if (data.missing) {
          setConfigMissing(data.missing)
        }
        throw new Error(data.error || "Failed to fetch forks")
      }

      setForks(data.forks || [])
      setLeaderboard(data.leaderboard || [])
      
      if (data.forks?.length > 0) {
        setSelectedFork(data.forks[0])
        fetchForkDetails(data.forks[0].id)
      }
    } catch (err) {
      console.error("Failed to fetch forks:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function fetchForkDetails(forkId: string) {
    try {
      const res = await fetch(`/api/forks/${forkId}`)
      const data = await res.json()

      if (res.ok) {
        setEvents(data.events || [])
        setMembers(data.members || [])
      }
    } catch (err) {
      console.error("Failed to fetch fork details:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120F0A] text-[#D0CFCE] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#FC920D]" />
          <p className="text-[#A09F9D]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (configMissing.length > 0) {
    return (
      <div className="min-h-screen bg-[#120F0A] text-[#D0CFCE] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-[#1E1A15] border-[#413F3B]">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#FC920D]">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Configuration Required</CardTitle>
            </div>
            <CardDescription className="text-[#A09F9D]">
              The Fork Dashboard requires Notion integration to be configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#D0CFCE]">
              Missing environment variables:
            </p>
            <ul className="list-disc list-inside text-sm text-[#A09F9D] space-y-1">
              {configMissing.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
            <p className="text-sm text-[#A09F9D]">
              Please add these to your <code className="bg-[#120F0A] px-2 py-1 rounded">.env.local</code> file and restart the server.
            </p>
            <Link href="/fork">
              <Button variant="outline" className="w-full border-[#413F3B] text-[#D0CFCE] hover:bg-[#413F3B]">
                Back to Fork Info
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#120F0A] text-[#D0CFCE] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-[#1E1A15] border-[#413F3B]">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Error Loading Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#A09F9D]">{error}</p>
            <Button onClick={fetchForks} variant="outline" className="w-full border-[#413F3B] text-[#D0CFCE] hover:bg-[#413F3B]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#120F0A] text-[#D0CFCE]">
      {/* Header */}
      <header className="border-b border-[#413F3B] bg-[#1E1A15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-[#FC920D] hover:underline text-sm">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold mt-1">Fork Dashboard</h1>
            </div>
            <Button 
              onClick={fetchForks} 
              variant="outline" 
              size="sm"
              className="border-[#413F3B] text-[#D0CFCE] hover:bg-[#413F3B]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1E1A15] border-[#413F3B]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#A09F9D]">Total Forks</p>
                  <p className="text-3xl font-bold">{forks.length}</p>
                </div>
                <div className="h-12 w-12 bg-[#97192C]/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-[#FC920D]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1A15] border-[#413F3B]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#A09F9D]">Active Forks</p>
                  <p className="text-3xl font-bold">{forks.filter(f => f.status === "Active").length}</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1A15] border-[#413F3B]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#A09F9D]">Total Events</p>
                  <p className="text-3xl font-bold">{forks.reduce((sum, f) => sum + f.eventsCount, 0)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1A15] border-[#413F3B]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#A09F9D]">Total Members</p>
                  <p className="text-3xl font-bold">{forks.reduce((sum, f) => sum + f.teamSize, 0)}</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fork Selector */}
            {forks.length > 0 && (
              <Card className="bg-[#1E1A15] border-[#413F3B]">
                <CardHeader>
                  <CardTitle className="text-lg">Select Fork</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forks.map((fork) => (
                      <Button
                        key={fork.id}
                        variant={selectedFork?.id === fork.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedFork(fork)
                          fetchForkDetails(fork.id)
                        }}
                        className={selectedFork?.id === fork.id 
                          ? "bg-[#97192C] hover:bg-[#791423] text-white" 
                          : "border-[#413F3B] text-[#D0CFCE] hover:bg-[#413F3B]"
                        }
                      >
                        {fork.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Fork Details */}
            {selectedFork && (
              <Card className="bg-[#1E1A15] border-[#413F3B]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedFork.name}</CardTitle>
                      <CardDescription className="text-[#A09F9D] flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {selectedFork.city}
                      </CardDescription>
                    </div>
                    <Badge className={LEVEL_COLORS[selectedFork.level] || "bg-gray-100 text-gray-800"}>
                      {selectedFork.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-[#A09F9D]">Points</p>
                      <p className="text-2xl font-bold text-[#FC920D]">{selectedFork.points}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#A09F9D]">Health</p>
                      <p className={`text-2xl font-bold ${HEALTH_COLORS[selectedFork.healthStatus] || "text-gray-400"}`}>
                        {selectedFork.healthScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#A09F9D]">Events</p>
                      <p className="text-2xl font-bold">{selectedFork.eventsCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#A09F9D]">Team</p>
                      <p className="text-2xl font-bold">{selectedFork.teamSize}</p>
                    </div>
                  </div>
                  
                  {/* Health Score Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A09F9D]">Health Score</span>
                      <span className={HEALTH_COLORS[selectedFork.healthStatus]}>{selectedFork.healthStatus}</span>
                    </div>
                    <Progress value={selectedFork.healthScore} max={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs for Events/Team/Reports */}
            <Tabs defaultValue="events" className="space-y-4">
              <TabsList className="bg-[#1E1A15] border border-[#413F3B]">
                <TabsTrigger value="events" className="data-[state=active]:bg-[#97192C]">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-[#97192C]">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-[#97192C]">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="events">
                <Card className="bg-[#1E1A15] border-[#413F3B]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Events</CardTitle>
                      <Button size="sm" className="bg-[#97192C] hover:bg-[#791423]">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Event
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 ? (
                      <p className="text-[#A09F9D] text-center py-8">No events found</p>
                    ) : (
                      <div className="space-y-3">
                        {events.map((event) => (
                          <div 
                            key={event.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-[#120F0A] border border-[#413F3B]"
                          >
                            <div>
                              <p className="font-medium">{event.name}</p>
                              <p className="text-sm text-[#A09F9D]">{event.type}</p>
                            </div>
                            <Badge className={EVENT_STATUS_COLORS[event.status] || "bg-gray-100 text-gray-800"}>
                              {event.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <Card className="bg-[#1E1A15] border-[#413F3B]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Team Members</CardTitle>
                      <Button size="sm" className="bg-[#97192C] hover:bg-[#791423]">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {members.length === 0 ? (
                      <p className="text-[#A09F9D] text-center py-8">No team members found</p>
                    ) : (
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div 
                            key={member.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-[#120F0A] border border-[#413F3B]"
                          >
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-[#A09F9D]">{member.role}</p>
                            </div>
                            <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card className="bg-[#1E1A15] border-[#413F3B]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Reports</CardTitle>
                      <Button size="sm" className="bg-[#97192C] hover:bg-[#791423]">
                        <Plus className="h-4 w-4 mr-1" />
                        Submit Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#A09F9D] text-center py-8">
                      Select a fork to view reports
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Leaderboard */}
          <div>
            <Card className="bg-[#1E1A15] border-[#413F3B] sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#FC920D]" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Fork rankings by points</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-[#A09F9D] text-center py-4">No data available</p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 10).map((entry) => (
                      <div 
                        key={entry.forkId}
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          selectedFork?.id === entry.forkId 
                            ? "bg-[#97192C]/20 border border-[#97192C]" 
                            : "hover:bg-[#120F0A]"
                        }`}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-sm font-bold ${
                          entry.rank === 1 ? "bg-yellow-500 text-black" :
                          entry.rank === 2 ? "bg-gray-300 text-black" :
                          entry.rank === 3 ? "bg-amber-600 text-white" :
                          "bg-[#413F3B] text-[#A09F9D]"
                        }`}>
                          {entry.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{entry.forkName}</p>
                          <p className="text-xs text-[#A09F9D]">{entry.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#FC920D]">{entry.points}</p>
                          <span className="text-lg">{entry.badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}