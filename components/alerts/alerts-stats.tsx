"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Bell, TrendingUp, TrendingDown } from "lucide-react"
import type { AlertStats as ApiStats } from "@/services/alert.service"


interface AlertsStatsProps {
  alerts: any[]
  apiStats?: ApiStats
}

export function AlertsStats({ alerts, apiStats }: AlertsStatsProps) {
  const computed = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
    snoozed: alerts.filter((a) => a.status === "snoozed").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
  }

  const stats = apiStats ? {
    total: apiStats.total,
    active: apiStats.active,
    acknowledged: apiStats.acknowledged,
    resolved: apiStats.resolved,
    snoozed: apiStats.snoozed,
    critical: apiStats.bySeverity.critical,
    warning: apiStats.bySeverity.warning,
  } : computed

  // Calculate resolution rate
  const resolvedAndTotal = stats.resolved + stats.active + stats.acknowledged
  const resolutionRate = resolvedAndTotal > 0 ? Math.round((stats.resolved / resolvedAndTotal) * 100) : 0

  // Calculate critical rate
  const criticalRate = stats.total > 0 ? Math.round(((stats.critical + stats.warning) / stats.total) * 100) : 0

  // Mock trend data (in a real app, this would come from historical data)
  const trends = {
    activeChange: -12, // -12% from last period
    resolutionChange: +8, // +8% from last period
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.active}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {trends.activeChange < 0 ? (
              <TrendingDown className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingUp className="h-3 w-3 text-red-500" />
            )}
            <span className={trends.activeChange < 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(trends.activeChange)}% from last week
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.acknowledged}</div>
          <p className="text-xs text-muted-foreground">Being investigated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {trends.resolutionChange > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={trends.resolutionChange > 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(trends.resolutionChange)}% from last week
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          <Bell className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs px-1">
              {stats.snoozed} snoozed
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Additional metrics row */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Alert Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Critical: {stats.critical}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Warning: {stats.warning}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Info: {alerts.filter((a) => a.severity === "info").length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{resolutionRate}%</div>
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{criticalRate}%</div>
              <p className="text-xs text-muted-foreground">Critical/High Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
