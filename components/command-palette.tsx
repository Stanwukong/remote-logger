"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import {
  FolderOpen,
  Search,
  Plus,
  Settings,
  Users,
  BarChart3,
  AlertTriangle,
  Terminal,
  Globe,
  Shield,
  Activity,
  Database,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  // Mock data for search results
  const projects = [
    { id: "web-app", name: "Web Application", environment: "production" },
    { id: "api-service", name: "API Service", environment: "production" },
    { id: "mobile-app", name: "Mobile App Backend", environment: "staging" },
    { id: "analytics", name: "Analytics Pipeline", environment: "production" },
  ]

  const recentLogs = [
    { id: "1", message: "User authentication failed", project: "web-app", level: "error" },
    { id: "2", message: "Database connection timeout", project: "api-service", level: "error" },
    { id: "3", message: "Payment processing completed", project: "web-app", level: "info" },
    { id: "4", message: "Cache miss for user data", project: "api-service", level: "warn" },
  ]

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredLogs = recentLogs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search projects, logs, or run commands..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/projects/new"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Project</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/logs"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Logs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/analytics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/alerts"))}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Manage Alerts</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Database className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/projects"))}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/realtime"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Real-time Monitoring</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/team"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Team Management</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        {/* Projects */}
        {filteredProjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem key={project.id} onSelect={() => runCommand(() => router.push(`/projects/${project.id}`))}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {project.environment}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Recent Logs */}
        {filteredLogs.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Logs">
              {filteredLogs.map((log) => (
                <CommandItem
                  key={log.id}
                  onSelect={() => runCommand(() => router.push(`/logs?search=${encodeURIComponent(log.message)}`))}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{log.message}</span>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{log.project}</span>
                      <Badge
                        variant={log.level === "error" ? "destructive" : log.level === "warn" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {log.level}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Help */}
        <CommandSeparator />
        <CommandGroup heading="Help">
          <CommandItem onSelect={() => runCommand(() => window.open("/docs", "_blank"))}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/support", "_blank"))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Support</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
