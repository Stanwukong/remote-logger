import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Bell, Database, Cpu, Eye, Target, Layers, LucideIcon } from "lucide-react"

interface AdditionalFeature {
  icon: LucideIcon
  title: string
  desc: string
}

const additionalFeatures: AdditionalFeature[] = [
  { icon: Search, title: "Advanced Search", desc: "Powerful query language with regex support" },
  { icon: Filter, title: "Smart Filtering", desc: "Filter by severity, service, time, and custom fields" },
  { icon: Bell, title: "Multi-Channel Alerts", desc: "Slack, email, webhooks, and mobile notifications" },
  { icon: Database, title: "Long-term Storage", desc: "Retain logs for compliance and historical analysis" },
  { icon: Cpu, title: "High Performance", desc: "Handle millions of logs per second with low latency" },
  { icon: Eye, title: "Log Correlation", desc: "Connect related logs across services and requests" },
  { icon: Target, title: "Error Tracking", desc: "Automatic error grouping and stack trace analysis" },
  { icon: Layers, title: "Multi-Environment", desc: "Separate dev, staging, and production environments" },
]

export function AdditionalFeatures() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {additionalFeatures.map((feature, index) => (
        <Card key={index} className="text-center hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-base">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}