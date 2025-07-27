import { Activity, Shield, Zap } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: Activity,
    title: "Real-time Log Visualization",
    description: "Stream logs in real-time with advanced filtering, search, and syntax highlighting"
  },
  {
    icon: Zap,
    title: "Project-Specific Insights",
    description: "Get detailed analytics and metrics for each project with customizable dashboards"
  },
  {
    icon: Shield,
    title: "Powerful Alert Rules Engine",
    description: "Configure intelligent alerts with custom thresholds and multi-channel notifications"
  }
]

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Everything you need to monitor your applications</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Powerful logging tools designed for modern development workflows
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}