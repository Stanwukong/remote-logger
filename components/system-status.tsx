import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"

export function SystemStatus() {
  const systemStatus = {
    overall: "operational", // operational, degraded, outage
    lastIncident: "7 days ago",
    uptime: "99.9%",
  }

  if (systemStatus.overall === "operational") {
    return (
      <Alert className="flex items-center border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse mr-4"/>
        <AlertDescription className="flex items-cente w-full justify-between">
          <div className="flex items-center space-x-4">
            <span>All systems operational</span>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {systemStatus.uptime} uptime
            </Badge>
            <span className="text-sm text-muted-foreground">Last incident: {systemStatus.lastIncident}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Status Page
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="flex items-center border-red-200 bg-red-50/10">
      <span className="h-3 w-3 rounded-full bg-red-400 animate-pulse mr-4"/>
      <AlertDescription className="flex items-center w-full justify-between">
        <div className="flex items-center space-x-4">
          <span>System experiencing issues</span>
          <Badge variant="destructive">Investigating</Badge>
        </div>
        <Button variant="ghost" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Status Page
        </Button>
      </AlertDescription>
    </Alert>
  )
}
