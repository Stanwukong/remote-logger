/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Bell,
  Play,
  Pause,
  Maximize2,
  BarChart3,
  Clock,
  Eye,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  id: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  service: string
  timestamp: string
  metadata?: Record<string, any>
}

interface MetricData {
  label: string
  value: number
  change: number
  trend: "up" | "down"
}

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      level: "info",
      message: "User authentication successful",
      service: "auth-service",
      timestamp: new Date().toISOString(),
      metadata: { userId: 123, ip: "192.168.1.1" },
    },
    {
      id: "2",
      level: "error",
      message: "Database connection timeout",
      service: "api-service",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      metadata: { database: "users", timeout: "5000ms" },
    },
    {
      id: "3",
      level: "warn",
      message: "High memory usage detected",
      service: "worker-service",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      metadata: { usage: "85%", threshold: "80%" },
    },
  ])

  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: "Total Logs", value: 1234567, change: 12.5, trend: "up" },
    { label: "Active Errors", value: 23, change: -8.2, trend: "down" },
    { label: "Response Time", value: 245, change: -15, trend: "down" },
    { label: "Uptime", value: 99.9, change: 0.1, trend: "up" },
  ])

  const [chartData, setChartData] = useState([40, 60, 30, 80, 45, 70, 55, 90, 35, 65, 50, 75])

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return

    const interval = setInterval(() => {
      // Update logs
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        level: ["info", "warn", "error", "debug"][Math.floor(Math.random() * 4)] as LogEntry["level"],
        message: [
          "Request processed successfully",
          "Cache miss for key user:123",
          "Payment processing completed",
          "Background job started",
          "API rate limit exceeded",
          "Database query optimized",
          "User session created",
          "File upload completed",
        ][Math.floor(Math.random() * 8)],
        service: ["api-service", "auth-service", "worker-service", "payment-service"][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        metadata: { requestId: `req_${Math.random().toString(36).substr(2, 6)}` },
      }

      setLogs((prev) => [newLog, ...prev.slice(0, 4)])

      // Update metrics
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * (metric.value * 0.01),
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.5 ? "up" : "down",
        })),
      )

      // Update chart data
      setChartData((prev) => [...prev.slice(1), Math.floor(Math.random() * 100)])
    }, 2000)

    return () => clearInterval(interval)
  }, [isLiveMode])

  const formatValue = (value: number, label: string) => {
    if (label === "Total Logs") return `${(value / 1000000).toFixed(1)}M`
    if (label === "Response Time") return `${Math.round(value)}ms`
    if (label === "Uptime") return `${value.toFixed(1)}%`
    return Math.round(value).toString()
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
      case "warn":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
      case "info":
        return "text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-3 h-3" />
      case "warn":
        return <AlertTriangle className="w-3 h-3" />
      case "info":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Mock Browser Header */}
      <div className="flex items-center justify-between bg-muted/30 px-6 py-4 border-b border-border/50">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 bg-background/50 rounded-md h-8 flex items-center px-4 min-w-0">
            <span className="text-sm text-muted-foreground truncate">app.loghive.dev/dashboard</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsLiveMode(!isLiveMode)} className="text-xs">
            {isLiveMode ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Resume
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex flex-col md:gap-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className=" hidden md:block text-sm text-muted-foreground">Real-time overview of your applications</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isLiveMode ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-xs text-muted-foreground">{isLiveMode ? "Live" : "Paused"}</span>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {index === 0 && <Activity className="w-4 h-4 text-primary" />}
                  {index === 1 && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  {index === 2 && <Clock className="w-4 h-4 text-blue-500" />}
                  {index === 3 && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl font-bold">{formatValue(metric.value, metric.label)}</div>
                <div className="flex items-center space-x-1 text-xs mt-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Live Logs
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Chart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Log Volume (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end space-x-1 h-20">
                    {chartData.map((height, index) => (
                      <div
                        key={index}
                        className="bg-primary/60 rounded-t flex-1 transition-all duration-500 hover:bg-primary/80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Service Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "API Service", status: "healthy", uptime: 99.9 },
                    { name: "Web App", status: "warning", uptime: 98.5 },
                    { name: "Workers", status: "healthy", uptime: 100 },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            service.status === "healthy" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-xs font-medium">{service.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{service.uptime}%</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Live Log Stream</span>
                    <Badge variant="outline" className="text-xs">
                      {logs.length}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Filter className="w-3 h-3 mr-1" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Search className="w-3 h-3 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={cn(
                        "flex items-start space-x-3 p-3 rounded-lg border text-xs transition-all duration-200",
                        getLevelColor(log.level),
                      )}
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="flex items-center space-x-1">
                          {getLevelIcon(log.level)}
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {log.level}
                          </Badge>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{log.message}</p>
                          <p className="text-muted-foreground">
                            {log.service} • {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: "critical", title: "High Error Rate", project: "web-app", time: "2m ago" },
                    { type: "warning", title: "Memory Usage High", project: "api-service", time: "8m ago" },
                    { type: "info", title: "Deployment Complete", project: "worker-queue", time: "15m ago" },
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.type === "critical"
                            ? "bg-red-500"
                            : alert.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.project} • {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Alert Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Critical</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-xs font-semibold">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Warning</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs font-semibold">8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Info</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-semibold">12</span>
                    </div>
                  </div>
                  <Progress value={65} className="h-2 mt-3" />
                  <p className="text-xs text-muted-foreground">Alert resolution rate: 65%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Web App", status: "healthy", logs: "45.2K", errors: 12 },
                { name: "API Service", status: "warning", logs: "128.7K", errors: 3 },
                { name: "Workers", status: "healthy", logs: "89.1K", errors: 0 },
              ].map((project, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{project.name}</CardTitle>
                      <Badge variant={project.status === "healthy" ? "default" : "secondary"} className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Logs</span>
                        <div className="font-semibold">{project.logs}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors</span>
                        <div className="font-semibold text-destructive">{project.errors}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
