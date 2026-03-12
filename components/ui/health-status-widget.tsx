import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  type LucideIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface HealthStatusWidgetProps {
  status?: string
  grade?: string
  message?: string
  details?: string
}

export function HealthStatusWidget({
  status,
  message,
  details,
}: HealthStatusWidgetProps) {
  const getStatusIcon = (): LucideIcon => {
    switch (status) {
      case "healthy":
      case "excellent":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "critical":
        return XCircle
      default:
        return HelpCircle
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy":
      case "excellent":
        return "text-status-ok"
      case "warning":
        return "text-status-warn"
      case "critical":
        return "text-status-danger"
      default:
        return "text-text-muted"
    }
  }

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "healthy":
      case "excellent":
        return "default"
      case "warning":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "Healthy"
      case "excellent":
        return "Excellent"
      case "warning":
        return "Warning"
      case "critical":
        return "Critical"
      default:
        return "Unknown"
    }
  }

  const getTrendIcon = () => {
    switch (status) {
      case "healthy":
      case "excellent":
        return TrendingUp
      case "critical":
        return TrendingDown
      default:
        return Minus
    }
  }

  const StatusIcon = getStatusIcon()
  const TrendIcon = getTrendIcon()

  return (
    <Card className="hover:shadow-md transition-shadow w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">System Health</CardTitle>
        <StatusIcon
          className={cn("h-4 w-4", getStatusColor())}
        />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-2xl font-bold font-mono text-text-primary">{getStatusText()}</div>
          <Badge variant={getStatusBadgeVariant()} className="text-xs">
            {status && status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-xs mt-1">
          <TrendIcon className={cn("h-3 w-3", getStatusColor())} />
          <span className={getStatusColor()}>{message}</span>
        </div>
        {details && <p className="text-xs text-text-muted mt-2">{details}</p>}
      </CardContent>
    </Card>
  )
}
