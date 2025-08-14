import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryWidgetProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: "up" | "down" | "neutral"
  variant?: "default" | "destructive" | "warning" | "success"
  subtitle?: string
  details?: string
}

export function SummaryWidget({
  title,
  value,
  change,
  icon: Icon,
  trend,
  variant = "default",
  subtitle,
  details,
}: SummaryWidgetProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return TrendingUp
      case "down":
        return TrendingDown
      default:
        return Minus
    }
  }

  const TrendIcon = getTrendIcon()

  const getTrendColor = () => {
    if (variant === "destructive") {
      return trend === "down" ? "text-green-600" : "text-red-600"
    }
    return trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon
          className={cn(
            "h-4 w-4",
            variant === "destructive" && "text-destructive",
            variant === "warning" && "text-yellow-600",
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs mt-1">
          <TrendIcon className={cn("h-3 w-3", getTrendColor())} />
          <span className={getTrendColor()}>{change}</span>
          {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        </div>
        {details && <p className="text-xs text-muted-foreground mt-2">{details}</p>}
      </CardContent>
    </Card>
  )
}
