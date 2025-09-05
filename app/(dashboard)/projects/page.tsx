"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle,Search,  Settings, FolderPlus, Plus, Info } from "lucide-react"
import Link from "next/link"
import {  useState } from "react"
import { EmptyState } from "@/components/Empty/empty-state"
import { NewProjectModal } from "@/components/dashboard/new-project-modal"
import { useProjects } from "@/hooks/project.hooks"
import { ProjectDetailsModal } from "@/components/dashboard/projects/ProjectDetailsModal"

export default function ProjectsPage() {
  // const [projects, setProjects] = useState<Project[] | null>(null)
  // const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: newData , isLoading  } = useProjects()

  const projects = newData?.data

  console.log("PROJECTS:", projects)

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })
  



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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="hidden md:block text-muted-foreground">Manage and monitor all your projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10  md:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 hidden md:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProjects?.map((project) => (
          <Card key={project._id} className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-sm">{project.description || "No description"}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${project.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                  <Badge variant={project.isActive ? "default" : "secondary"} className="text-xs">
                    {project.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Health Score</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      project.metrics.healthScore >= 80
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : project.metrics.healthScore >= 60
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {project.metrics.healthScore}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Logs (24h)</span>
                  </div>
                  <p className="text-lg font-semibold">{project?.metrics.recentActivity.logsLast24h.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Errors (24h)</span>
                  </div>
                  <p className="text-lg font-semibold text-destructive">{project.metrics.recentActivity.errorsLast24h}</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="text-sm font-medium">{project.teamMembers.length}</span>
              </div>

              {/* Created Date */}
              <div className="text-sm text-muted-foreground">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button asChild className="flex-1">
                  <Link href={`/projects/${project._id}`}>View Dashboard</Link>
                </Button>
                <ProjectDetailsModal
                  project={project}
                  trigger={
                    <Button variant="outline" size="icon">
                      <Info className="w-4 h-4" />
                    </Button>
                  }
                />
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/projects/${project._id}/settings`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Grid */}
      

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
