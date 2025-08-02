import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Project } from "@/types/analytics"

interface ProjectStatsProps {
  project: Project
}

interface StatCardProps {
  title: string
  value: string
  trend: {
    direction: "up" | "down"
    value: string
    color: "green" | "red"
  }
}

function StatCard({ title, value, trend }: StatCardProps) {
  const TrendIcon = trend.direction === "up" ? TrendingUp : TrendingDown
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{value}</div>
        <div className={`flex items-center space-x-1 text-xs ${
          trend.color === "green" ? "text-green-600" : "text-red-600"
        }`}>
          <TrendIcon className="h-3 w-3" />
          <span>{trend.value}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectStats({ project }: ProjectStatsProps) {
  const stats = [
    {
      title: "Total Events",
      value: `${(project.totalEvents / 1000).toFixed(1)}K`,
      trend: { direction: "up" as const, value: "+8% from yesterday", color: "green" as const }
    },
    {
      title: "Error Rate",
      value: `${project.errorRate}%`,
      trend: { direction: "down" as const, value: "-0.3% from yesterday", color: "green" as const }
    },
    {
      title: "Active Users",
      value: project.activeUsers.toLocaleString(),
      trend: { direction: "up" as const, value: "+156 from yesterday", color: "green" as const }
    },
    {
      title: "Avg Page Load",
      value: `${(project.avgPageLoad / 1000).toFixed(1)}s`,
      trend: { direction: "down" as const, value: "-200ms from yesterday", color: "green" as const }
    },
    {
      title: "Uptime",
      value: `${project.uptime}%`,
      trend: { direction: "up" as const, value: "+0.1% from yesterday", color: "green" as const }
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}