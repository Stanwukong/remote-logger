"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { Button } from "@/components/ui/button"
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
  Clock,
  Star,
  Filter,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  Bug,
  FileText,
  Code,
  ExternalLink,
} from "lucide-react"
import { useProjects } from "@/hooks/project.hooks"
import { useLogs } from "@/hooks/log.hooks"
import { LogEntry } from "@/types/analytics"
import { useDebounce } from "@/hooks/useDebounce"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface RecentSearch {
  id: string
  query: string
  type: 'project' | 'log' | 'navigation' | 'action'
  timestamp: number
  result?: string
}

interface FavoriteItem {
  id: string
  name: string
  type: 'project' | 'page' | 'action'
  path: string
  icon: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // Fetch projects data
  const { data: projectsData, isLoading: projectsLoading } = useProjects()
  const projects = projectsData?.data || []
  
  // Fetch logs for the first project (for recent logs)
  const firstProject = projects[0]
  const { data: logsData, isLoading: logsLoading } = useLogs(
    firstProject?._id || "",
    { limit: 20, level: "error" }
  )
  const recentLogs = logsData?.logs || []

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  // Load recent searches and favorites from localStorage
  useEffect(() => {
    const savedRecentSearches = localStorage.getItem("command-palette-recent")
    const savedFavorites = localStorage.getItem("command-palette-favorites")
    
    if (savedRecentSearches) {
      setRecentSearches(JSON.parse(savedRecentSearches))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((search: Omit<RecentSearch, 'id' | 'timestamp'>) => {
    const newSearch: RecentSearch = {
      ...search,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    
    setRecentSearches(prev => {
      const updated = [newSearch, ...prev.filter(s => s.query !== search.query)].slice(0, 10)
      localStorage.setItem("command-palette-recent", JSON.stringify(updated))
      return updated
    })
  }, [])

  const runCommand = useCallback((command: () => void, searchData?: Omit<RecentSearch, 'id' | 'timestamp'>) => {
    onOpenChange(false)
    command()
    
    if (searchData) {
      saveRecentSearch(searchData)
    }
  }, [onOpenChange, saveRecentSearch])

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!debouncedSearchTerm) return projects.slice(0, 5)
    
    return projects
      .filter(project => 
        project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.environment.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, 5)
  }, [projects, debouncedSearchTerm])

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    if (!debouncedSearchTerm) return recentLogs.slice(0, 5)
    
    return recentLogs
      .filter(log =>
        log.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        log.service?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        log.level.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, 5)
  }, [recentLogs, debouncedSearchTerm])

  // Filter recent searches
  const filteredRecentSearches = useMemo(() => {
    if (!debouncedSearchTerm) return recentSearches.slice(0, 3)
    
    return recentSearches
      .filter(search => 
        search.query.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, 3)
  }, [recentSearches, debouncedSearchTerm])

  // Quick actions
  const quickActions = [
    {
      id: "create-project",
      name: "Create New Project",
      description: "Set up a new logging project",
      icon: Plus,
      action: () => router.push("/projects/new"),
      shortcut: "⌘N"
    },
    {
      id: "search-logs",
      name: "Search Logs",
      description: "Find specific log entries",
      icon: Search,
      action: () => router.push("/logs"),
      shortcut: "⌘F"
    },
    {
      id: "view-analytics",
      name: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      action: () => router.push("/dashboard"),
      shortcut: "⌘A"
    },
    {
      id: "manage-alerts",
      name: "Manage Alerts",
      description: "Configure error notifications",
      icon: AlertTriangle,
      action: () => router.push("/alerts"),
      shortcut: "⌘M"
    },
    {
      id: "export-data",
      name: "Export Data",
      description: "Download logs and reports",
      icon: Download,
      action: () => router.push("/export"),
      shortcut: "⌘E"
    },
    {
      id: "refresh-data",
      name: "Refresh Data",
      description: "Reload all data",
      icon: RefreshCw,
      action: () => window.location.reload(),
      shortcut: "⌘R"
    }
  ]

  // Navigation items
  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Overview and metrics",
      icon: Database,
      path: "/dashboard"
    },
    {
      id: "projects",
      name: "Projects",
      description: "Manage your projects",
      icon: FolderOpen,
      path: "/projects"
    },
    {
      id: "logs",
      name: "Logs",
      description: "View and search logs",
      icon: Terminal,
      path: "/logs"
    },
    {
      id: "alerts",
      name: "Alerts",
      description: "Error notifications",
      icon: AlertTriangle,
      path: "/alerts"
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Performance insights",
      icon: TrendingUp,
      path: "/analytics"
    },
    {
      id: "team",
      name: "Team",
      description: "Manage team members",
      icon: Users,
      path: "/team"
    },
    {
      id: "settings",
      name: "Settings",
      description: "Configure your account",
      icon: Settings,
      path: "/settings"
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "destructive"
      case "warn": return "secondary"
      case "info": return "default"
      default: return "outline"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return Bug
      case "warn": return AlertTriangle
      case "info": return FileText
      default: return Terminal
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search projects, logs, or run commands..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        className="h-12"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for projects, logs, or commands
            </p>
          </div>
        </CommandEmpty>

        {/* Recent Searches */}
        {!searchTerm && filteredRecentSearches.length > 0 && (
          <>
            <CommandGroup heading="Recent Searches">
              {filteredRecentSearches.map((search) => (
                <CommandItem
                  key={search.id}
                  onSelect={() => {
                    setSearchTerm(search.query)
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{search.query}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {search.type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <CommandItem
                key={action.id}
                onSelect={() => runCommand(action.action, {
                  query: action.name,
                  type: 'action',
                  result: action.description
                })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <div>
                    <span>{action.name}</span>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {action.shortcut}
                </kbd>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.id}
                onSelect={() => runCommand(() => router.push(item.path), {
                  query: item.name,
                  type: 'navigation',
                  result: item.description
                })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <div>
                    <span>{item.name}</span>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Projects */}
        {filteredProjects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project._id}
                  onSelect={() => runCommand(() => router.push(`/projects/${project._id}`), {
                    query: project.name,
                    type: 'project',
                    result: `${project.environment} project`
                  })}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <div>
                      <span>{project.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {project.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {project.environment}
                    </Badge>
                    {project.isActive ? (
                      <div className="w-2 h-2 bg-status-ok rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>
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
              {filteredLogs.map((log) => {
                const LevelIcon = getLevelIcon(log.level)
                return (
                  <CommandItem
                    key={log._id}
                    onSelect={() => runCommand(() => router.push(`/logs?search=${encodeURIComponent(log.message)}`), {
                      query: log.message,
                      type: 'log',
                      result: `${log.level} from ${log.service || 'unknown'}`
                    })}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <LevelIcon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm truncate max-w-[300px]">{log.message}</span>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{log.service || 'unknown'}</span>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getLevelColor(log.level)} className="text-xs">
                      {log.level}
                    </Badge>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}

        {/* Help & Resources */}
        <CommandSeparator />
        <CommandGroup heading="Help & Resources">
          <CommandItem onSelect={() => runCommand(() => window.open("/docs", "_blank"), {
            query: "Documentation",
            type: 'navigation',
            result: "Open documentation"
          })}>
            <Globe className="mr-2 h-4 w-4" />
            <div className="flex items-center justify-between w-full">
              <span>Documentation</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/support", "_blank"), {
            query: "Support",
            type: 'navigation',
            result: "Get help"
          })}>
            <Shield className="mr-2 h-4 w-4" />
            <div className="flex items-center justify-between w-full">
              <span>Support</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/api-docs", "_blank"), {
            query: "API Documentation",
            type: 'navigation',
            result: "View API reference"
          })}>
            <Code className="mr-2 h-4 w-4" />
            <div className="flex items-center justify-between w-full">
              <span>API Reference</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}