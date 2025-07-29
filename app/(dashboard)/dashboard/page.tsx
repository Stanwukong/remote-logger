import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Zap,
  Settings,
  Plus,
  ArrowRight,
  Download,
  RefreshCw,
  Bell,
  Cpu,
  HardDrive,
  Network,
  Timer,
} from "lucide-react"
import Link from "next/link"
import { SystemStatus } from "@/components/system-status"
import { SummaryWidget } from "@/components/summary-widget"
import { ChartCard } from "@/components/chart-card"
import { ProjectHealthCard } from "@/components/project-health-card"
import { AlertsOverview } from "@/components/alerts-overview"
import { RealtimeLogStream } from "@/components/realtime-log-stream"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your applications.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/projects">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <SystemStatus />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryWidget
          title="Total Logs (24h)"
          value="1,234,567"
          change="+12.5%"
          icon={Activity}
          trend="up"
          subtitle="vs yesterday"
          details="Peak: 89K/hour at 2:00 PM"
        />
        <SummaryWidget
          title="Active Errors"
          value="23"
          change="-8.2%"
          icon={AlertTriangle}
          trend="down"
          variant="destructive"
          subtitle="vs last hour"
          details="3 critical, 8 high, 12 medium"
        />
        <SummaryWidget
          title="Alert Rules"
          value="8"
          change="+2"
          icon={Zap}
          trend="up"
          variant="warning"
          subtitle="active rules"
          details="2 triggered in last hour"
        />
        <SummaryWidget
          title="Projects"
          value="12"
          change="+1"
          icon={Users}
          trend="up"
          subtitle="total projects"
          details="11 active, 1 paused"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Timer className="w-4 h-4 mr-2" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">-12ms</span>
              <span className="text-muted-foreground">from last hour</span>
            </div>
            <Progress value={75} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-orange-600" />
              <span className="text-orange-600">+5%</span>
              <span className="text-muted-foreground">from last hour</span>
            </div>
            <Progress value={68} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <HardDrive className="w-4 h-4 mr-2" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600">+180MB</span>
              <span className="text-muted-foreground">today</span>
            </div>
            <Progress value={45} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Network className="w-4 h-4 mr-2" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <div className="flex items-center space-x-1 text-xs">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-green-600">30 days</span>
              <span className="text-muted-foreground">no incidents</span>
            </div>
            <Progress value={99.9} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Live Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Log Volume Trends"
              description="Logs per hour over the last 24 hours"
              type="line"
              data={{
                labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
                datasets: [
                  {
                    label: "Logs",
                    data: [12000, 8000, 15000, 25000, 35000, 28000, 18000],
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                  },
                ],
              }}
            />
            <ChartCard
              title="Error Distribution"
              description="Error types and frequency in the last 24 hours"
              type="pie"
              data={{
                labels: ["Database Errors", "API Timeouts", "Auth Failures", "Network Issues", "Other"],
                datasets: [
                  {
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                      "hsl(var(--destructive))",
                      "hsl(var(--destructive) / 0.8)",
                      "hsl(var(--destructive) / 0.6)",
                      "hsl(var(--destructive) / 0.4)",
                      "hsl(var(--destructive) / 0.2)",
                    ],
                  },
                ],
              }}
            />
          </div>

          {/* Project Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectHealthCard />
            </div>
            <div>
              <AlertsOverview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <RealtimeLogStream />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Active Alerts</span>
                      </CardTitle>
                      <CardDescription>Current alerts requiring attention</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/alerts">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Rules
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        severity: "critical",
                        title: "High Error Rate in API Service",
                        description: "Error rate exceeded 5% threshold",
                        project: "web-app",
                        time: "2 minutes ago",
                        count: 15,
                      },
                      {
                        id: 2,
                        severity: "warning",
                        title: "Memory Usage Above 80%",
                        description: "Worker service memory usage is high",
                        project: "worker-queue",
                        time: "8 minutes ago",
                        count: 1,
                      },
                      {
                        id: 3,
                        severity: "info",
                        title: "Deployment Completed",
                        description: "Version 1.2.3 deployed successfully",
                        project: "api-service",
                        time: "15 minutes ago",
                        count: 1,
                      },
                    ].map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 border border-border/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              alert.severity === "critical"
                                ? "bg-red-500"
                                : alert.severity === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div>
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.project} • {alert.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alert.count > 1 && <Badge variant="outline">{alert.count}x</Badge>}
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alert Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Info</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-semibold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alert Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Rules</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Triggered Today</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Avg Response Time</span>
                      <span className="font-semibold">45s</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/alerts/rules">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Rule
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Overview</h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Web Application",
                status: "healthy",
                logs: "45.2K",
                errors: 12,
                uptime: "99.9%",
                lastActivity: "2 minutes ago",
              },
              {
                name: "API Service",
                status: "warning",
                logs: "128.7K",
                errors: 3,
                uptime: "99.5%",
                lastActivity: "1 minute ago",
              },
              {
                name: "Background Workers",
                status: "healthy",
                logs: "89.1K",
                errors: 0,
                uptime: "100%",
                lastActivity: "30 seconds ago",
              },
            ].map((project, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <Badge variant={project.status === "healthy" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Logs (24h)</span>
                      <div className="font-semibold">{project.logs}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors</span>
                      <div className="font-semibold text-destructive">{project.errors}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uptime</span>
                      <div className="font-semibold">{project.uptime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Activity</span>
                      <div className="font-semibold">{project.lastActivity}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <Link href={`/projects/${project.name.toLowerCase().replace(" ", "-")}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Log Levels Distribution"
              description="Breakdown of log levels over time"
              type="bar"
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    label: "Error",
                    data: [120, 150, 180, 90, 200, 160, 140],
                    backgroundColor: "hsl(var(--destructive))",
                  },
                  {
                    label: "Warning",
                    data: [300, 280, 350, 250, 400, 320, 290],
                    backgroundColor: "hsl(var(--warning))",
                  },
                  {
                    label: "Info",
                    data: [1200, 1100, 1400, 1000, 1600, 1300, 1150],
                    backgroundColor: "hsl(var(--primary))",
                  },
                ],
              }}
            />

            <ChartCard
              title="Response Time Trends"
              description="Average response times across services"
              type="line"
              data={{
                labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
                datasets: [
                  {
                    label: "API Service",
                    data: [245, 230, 280, 320, 290, 260, 250],
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                  },
                  {
                    label: "Web App",
                    data: [180, 170, 200, 240, 220, 190, 185],
                    borderColor: "hsl(var(--secondary))",
                    backgroundColor: "hsl(var(--secondary) / 0.1)",
                  },
                ],
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Error Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { source: "Database Connection", count: 45, percentage: 35 },
                    { source: "API Timeout", count: 32, percentage: 25 },
                    { source: "Auth Failure", count: 26, percentage: 20 },
                    { source: "Network Error", count: 19, percentage: 15 },
                    { source: "Other", count: 6, percentage: 5 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{item.source}</span>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "API Service", responseTime: "245ms", status: "good" },
                    { service: "Web App", responseTime: "180ms", status: "excellent" },
                    { service: "Workers", responseTime: "95ms", status: "excellent" },
                    { service: "Database", responseTime: "12ms", status: "excellent" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{item.service}</div>
                        <div className="text-xs text-muted-foreground">{item.responseTime}</div>
                      </div>
                      <Badge variant={item.status === "excellent" ? "default" : "secondary"}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Log Volume</span>
                    <span className="font-semibold">1.2M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-semibold">2.4GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Requests</span>
                    <span className="font-semibold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Integrations</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <Progress value={65} className="h-2 mt-4" />
                  <p className="text-xs text-muted-foreground">65% of monthly quota used</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
