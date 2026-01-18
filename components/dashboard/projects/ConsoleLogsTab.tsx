import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Terminal, Globe, ExternalLink } from "lucide-react"
import type { LogEntry } from "@/types/analytics"

interface ConsoleLogsTabProps {
  logs: LogEntry[]
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

export function ConsoleLogsTab({ logs }: ConsoleLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [isExpanded, setIsExpanded] = useState(false)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const displayedLogs = isExpanded ? filteredLogs : filteredLogs.slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Console Log Stream</span>
            </CardTitle>
            <CardDescription>Real-time console messages and logs</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {displayedLogs.map((log) => (
            <div
              key={log._id}
              className={`flex items-start space-x-3 p-3 rounded-lg border text-sm transition-all duration-200 ${
                log.level === "error"
                  ? "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800"
                  : log.level === "warn"
                    ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800"
                    : log.level === "info"
                      ? "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800"
                      : "border-gray-200 bg-gray-50 dark:bg-gray-950/20 dark:border-gray-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  log.level === "error"
                    ? "bg-red-500"
                    : log.level === "warn"
                      ? "bg-yellow-500"
                      : log.level === "info"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {log.level}
                  </Badge>
                  {log.service && (
                    <Badge variant="secondary" className="text-xs">
                      {log.service}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <p className="font-medium break-words">{log.message}</p>
                {log.url && (
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    <Globe className="w-3 h-3 inline mr-1" />
                    {log.url}
                  </p>
                )}
                {log.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      View metadata
                    </summary>
                    <pre className="mt-2 bg-muted/50 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {filteredLogs.length > 20 && !isExpanded && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setIsExpanded(true)}
            >
              Load More ({filteredLogs.length - 20} remaining)
            </Button>
          </div>
        )}
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No logs found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}