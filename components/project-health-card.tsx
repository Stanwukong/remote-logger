import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Activity, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export function ProjectHealthCard() {
  const projects = [
    {
      name: "Web Application",
      status: "healthy",
      uptime: 99.9,
      errorRate: 0.1,
      responseTime: 245,
      trend: "up",
      lastIncident: "7 days ago",
    },
    {
      name: "API Service",
      status: "warning",
      uptime: 99.5,
      errorRate: 2.3,
      responseTime: 380,
      trend: "down",
      lastIncident: "2 hours ago",
    },
    {
      name: "Background Workers",
      status: "healthy",
      uptime: 100,
      errorRate: 0.0,
      responseTime: 95,
      trend: "up",
      lastIncident: "Never",
    },
    {
      name: "Payment Service",
      status: "critical",
      uptime: 97.2,
      errorRate: 5.8,
      responseTime: 1200,
      trend: "down",
      lastIncident: "15 minutes ago",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-status-ok" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-status-warn" />
      case "critical":
        return <XCircle className="w-4 h-4 text-status-danger" />
      default:
        return <Activity className="w-4 h-4 text-text-muted" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "border-l-status-ok"
      case "warning":
        return "border-l-status-warn"
      case "critical":
        return "border-l-status-danger"
      default:
        return "border-l-border-subtle"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Project Health</span>
            </CardTitle>
            <CardDescription>Real-time health status of all your projects</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`border-l-4 pl-4 py-3 bg-muted/20 rounded-r-lg ${getStatusColor(project.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h4 className="font-semibold text-sm">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">Last incident: {project.lastIncident}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    project.status === "healthy"
                      ? "default"
                      : project.status === "warning"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {project.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-semibold">{project.uptime}%</span>
                  </div>
                  <Progress value={project.uptime} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Error Rate</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{project.errorRate}%</span>
                      {project.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-status-danger" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-status-ok" />
                      )}
                    </div>
                  </div>
                  <Progress value={Math.min(project.errorRate * 10, 100)} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Response</span>
                    <span className="font-semibold">{project.responseTime}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - project.responseTime / 10)} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
