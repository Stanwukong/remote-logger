import { CheckCircle2, Shield, Clock, Globe } from "lucide-react"

const indicators = [
  { icon: CheckCircle2, label: "SOC 2 Compliant", color: "text-green-500" },
  { icon: Shield, label: "GDPR Ready", color: "text-blue-500" },
  { icon: Clock, label: "99.9% Uptime", color: "text-purple-500" },
  { icon: Globe, label: "Global CDN", color: "text-orange-500" },
]

export function TrustIndicators() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-muted-foreground">
      {indicators.map((indicator) => (
        <div key={indicator.label} className="flex items-center space-x-2">
          <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
          <span className="text-sm">{indicator.label}</span>
        </div>
      ))}
    </div>
  )
}