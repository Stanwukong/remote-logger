"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, Users, Clock, Search, Filter, Eye, Settings, FolderPlus, Plus } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/analytics"
import { useEffect, useState } from "react"
import { mockProjects } from "@/lib/mock-data"
import { EmptyState } from "@/components/Empty/empty-state"
import { NewProjectModal } from "@/components/dashboard/new-project-modal"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })


  // Simulate loading and checking for projects
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate checking if user has projects
      // In real app, this would be an API call
      setProjects(mockProjects) // Set to false to show empty state
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

   const hasProjects = projects ? true : false

   if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    )
  }

   if (!hasProjects) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and monitor all your logging projects</p>
        </div>

        <EmptyState
          icon={FolderPlus}
          title="No projects yet"
          description="Create your first project to start logging and monitoring your applications. Each project provides isolated logging, error tracking, and analytics."
        >
          <div className="space-y-4">
            <NewProjectModal />
            <div className="text-sm text-muted-foreground max-w-md">
              <p className="mb-3">Each project includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Unique API key</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Real-time monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Error tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Performance analytics</span>
                </div>
              </div>
            </div>
          </div>
        </EmptyState>

        {/* Getting Started Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardHeader>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">1. Create Project</CardTitle>
              <CardDescription>Set up a new project with a name and description</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardHeader>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">2. Install SDK</CardTitle>
              <CardDescription>Integrate our SDK into your application using the API key</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardHeader>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">3. Start Monitoring</CardTitle>
              <CardDescription>View logs, errors, and analytics in real-time</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }


  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and monitor all your projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      project.status === "healthy"
                        ? "bg-green-500"
                        : project.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {project.environment}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(project.status)} className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/analytics/projects/${project.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                    <Activity className="w-3 h-3" />
                    <span>Events (24h)</span>
                  </div>
                  <div className="font-semibold">{(project.totalEvents / 1000).toFixed(1)}K</div>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Error Rate</span>
                  </div>
                  <div className="font-semibold text-destructive">{project.errorRate}%</div>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                    <Users className="w-3 h-3" />
                    <span>Active Users</span>
                  </div>
                  <div className="font-semibold">{project.activeUsers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    <span>Avg Load</span>
                  </div>
                  <div className="font-semibold">{(project.avgPageLoad / 1000).toFixed(1)}s</div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last activity: {formatTimestamp(project.lastEvent)}</span>
                  <span>Uptime: {project.uptime}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
