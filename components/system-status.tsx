import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SignalDot } from "@/components/shared/SignalDot"

export function SystemStatus() {
  const systemStatus = {
    overall: "operational", // operational, degraded, outage
    lastIncident: "7 days ago",
    uptime: "99.9%",
  }

  if (systemStatus.overall === "operational") {
    return (
      <Alert className="flex items-center border-status-ok/30 bg-status-ok/5">
        <SignalDot status="ok" size="md" pulse className="mr-4" />
        <AlertDescription className="flex items-cente w-full justify-between">
          <div className="flex items-center space-x-4">
            <span>All systems operational</span>
            <Badge variant="outline" className="text-status-ok border-status-ok/30">
              {systemStatus.uptime} uptime
            </Badge>
            <span className="text-sm text-muted-foreground">Last incident: {systemStatus.lastIncident}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-status-ok hover:text-signal-bright">
            <ExternalLink className="w-4 h-4 mr-2" />
            Status Page
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="flex items-center border-status-danger/30 bg-status-danger/5">
      <SignalDot status="danger" size="md" pulse className="mr-4" />
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
