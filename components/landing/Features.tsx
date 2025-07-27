import { Badge } from "@/components/ui/badge"
import { Activity, BarChart3, Shield } from "lucide-react"
import { FeatureCard } from "./FeatureCard"
import { AdditionalFeatures } from "./AdditionalFeatures"

const mainFeatures = [
  {
    icon: Activity,
    title: "Real-time Log Visualization",
    description: "Stream logs in real-time with advanced filtering, search, and syntax highlighting. Never miss critical events with instant notifications.",
    features: ["Live log streaming", "Advanced search & filtering", "Syntax highlighting"]
  },
  {
    icon: BarChart3,
    title: "Project-Specific Insights",
    description: "Get detailed analytics and metrics for each project with customizable dashboards and comprehensive reporting.",
    features: ["Custom dashboards", "Performance metrics", "Trend analysis"]
  },
  {
    icon: Shield,
    title: "Intelligent Alert Engine",
    description: "Configure smart alerts with custom thresholds, multi-channel notifications, and ML-powered anomaly detection.",
    features: ["Smart thresholds", "Multi-channel alerts", "Anomaly detection"]
  }
]

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Features
        </Badge>
        <h2 className="text-4xl font-bold mb-4">Everything you need to monitor your applications</h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
          Powerful logging tools designed for modern development workflows with enterprise-grade reliability
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {mainFeatures.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <AdditionalFeatures />
    </section>
  )
}