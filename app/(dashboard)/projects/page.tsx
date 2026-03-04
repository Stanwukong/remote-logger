"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, AlertTriangle, Search, Settings, FolderPlus, Plus, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { EmptyState } from "@/components/Empty/empty-state"
import { NewProjectModal } from "@/components/dashboard/new-project-modal"
import { useProjects } from "@/hooks/project.hooks"
import { ProjectDetailsModal } from "@/components/dashboard/projects/ProjectDetailsModal"
import { SignalDot } from "@/components/shared/SignalDot"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: newData, isLoading } = useProjects()

  const projects = newData?.data

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const hasProjects = projects ? true : false

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <div className="h-8 bg-bg-elevated rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-bg-surface rounded-lg border border-border-subtle"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!hasProjects) {
    return (
      <div className="p-6 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1">Manage and monitor all your logging projects</p>
        </div>

        <EmptyState
          icon={FolderPlus}
          title="No projects yet"
          description="Create your first project to start logging and monitoring your applications. Each project provides isolated logging, error tracking, and analytics."
        >
          <div className="space-y-4">
            <NewProjectModal />
            <div className="text-sm text-text-secondary max-w-md">
              <p className="mb-3">Each project includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <div className="flex items-center space-x-2">
                  <SignalDot status="info" size="sm" pulse={false} />
                  <span>Unique API key</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalDot status="ok" size="sm" pulse={false} />
                  <span>Real-time monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalDot status="danger" size="sm" pulse={false} />
                  <span>Error tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalDot status="warn" size="sm" pulse={false} />
                  <span>Performance analytics</span>
                </div>
              </div>
            </div>
          </div>
        </EmptyState>

        {/* Getting Started Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 border-border-subtle">
            <CardHeader>
              <div className="w-10 h-10 bg-data-info/15 rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-data-info" />
              </div>
              <CardTitle className="text-lg">1. Create Project</CardTitle>
              <CardDescription>Set up a new project with a name and description</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed border-2 border-border-subtle">
            <CardHeader>
              <div className="w-10 h-10 bg-status-ok/15 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-5 h-5 text-status-ok" />
              </div>
              <CardTitle className="text-lg">2. Install SDK</CardTitle>
              <CardDescription>Integrate our SDK into your application using the API key</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed border-2 border-border-subtle">
            <CardHeader>
              <div className="w-10 h-10 bg-data-purple/15 rounded-lg flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-data-purple" />
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
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-text-primary">Projects</h1>
          <p className="hidden md:block text-text-secondary mt-1">Manage and monitor all your projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:w-64 bg-bg-base border-border-subtle"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 hidden md:flex border-border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <NewProjectModal />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProjects?.map((project) => (
          <Card
            key={project._id}
            className="bg-bg-surface border-border-subtle hover:border-signal/30 transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-text-primary">{project.name}</CardTitle>
                  <CardDescription className="text-sm text-text-muted">{project.description || "No description"}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalDot
                    status={project.isActive ? "ok" : "danger"}
                    size="sm"
                    pulse={project.isActive}
                  />
                  <Badge variant={project.isActive ? "default" : "secondary"} className="text-xs">
                    {project.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Health Score</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      project.metrics.healthScore >= 80
                        ? "bg-status-ok/15 text-status-ok"
                        : project.metrics.healthScore >= 60
                          ? "bg-status-warn/15 text-status-warn"
                          : "bg-status-danger/15 text-status-danger"
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
                    <Activity className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-muted">Logs (24h)</span>
                  </div>
                  <p className="text-lg font-semibold text-text-primary">{project?.metrics.recentActivity.logsLast24h.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-muted">Errors (24h)</span>
                  </div>
                  <p className="text-lg font-semibold text-status-danger">{project.metrics.recentActivity.errorsLast24h}</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Team Members</span>
                <span className="text-sm font-medium text-text-primary">{project.teamMembers.length}</span>
              </div>

              {/* Created Date */}
              <div className="text-sm text-text-tertiary">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="signal" size="sm" asChild className="flex-1">
                  <Link href={`/projects/${project._id}`}>View Dashboard</Link>
                </Button>
                <ProjectDetailsModal
                  project={project}
                  trigger={
                    <Button variant="outline" size="icon" className="border-border-subtle text-text-secondary hover:text-text-primary">
                      <Info className="w-4 h-4" />
                    </Button>
                  }
                />
                <Button variant="outline" size="icon" asChild className="border-border-subtle text-text-secondary hover:text-text-primary">
                  <Link href={`/projects/${project._id}/settings`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty filtered state */}
      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No projects found</h3>
          <p className="text-text-secondary">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
