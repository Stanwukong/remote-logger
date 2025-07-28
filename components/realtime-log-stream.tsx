"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Filter, Pause, Play, Download, Settings } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  service: string
  metadata: Record<string, any>
}

export function RealtimeLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "User authentication successful",
      service: "auth-service",
      metadata: { userId: 123, ip: "192.168.1.1" },
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      level: "error",
      message: "Database connection timeout",
      service: "api-service",
      metadata: { database: "users", timeout: "5000ms" },
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: "warn",
      message: "High memory usage detected",
      service: "worker-service",
      metadata: { usage: "85%", threshold: "80%" },
    },
  ])
  const [isStreaming, setIsStreaming] = useState(true)
  const [filter, setFilter] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  // Simulate real-time log updates
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogEntry["level"],
        message: [
          "Request processed successfully",
          "Cache miss for key user:123",
          "Payment processing completed",
          "Background job started",
          "API rate limit exceeded",
        ][Math.floor(Math.random() * 5)],
        service: ["api-service", "auth-service", "worker-service", "payment-service"][Math.floor(Math.random() * 4)],
        metadata: { requestId: `req_${Math.random().toString(36).substr(2, 6)}` },
      }

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]) // Keep only last 50 logs
    }, 3000)

    return () => clearInterval(interval)
  }, [isStreaming])

  const filteredLogs = logs.filter((log) => {
    const matchesText =
      filter === "" ||
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.service.toLowerCase().includes(filter.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    return matchesText && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"
      case "warn":
        return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20"
      case "info":
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
      case "debug":
        return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20"
      default:
        return "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warn":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Log Stream</span>
              <Badge variant="outline" className="ml-2">
                {filteredLogs.length} logs
              </Badge>
            </CardTitle>
            <CardDescription>Real-time log entries from all your projects</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsStreaming(!isStreaming)}>
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
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

        {/* Log Entries */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`border-l-4 pl-4 py-3 rounded-r-lg transition-all hover:shadow-sm ${getLevelColor(log.level)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={getLevelBadgeVariant(log.level) as any} className="text-xs">
                    {log.level.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {log.service}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="font-medium text-sm mb-2">{log.message}</p>
              {Object.keys(log.metadata).length > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View metadata
                  </summary>
                  <pre className="mt-2 bg-muted/50 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No logs match your current filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
