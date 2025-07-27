import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export function FeatureCard({ icon: Icon, title, description, features }: FeatureCardProps) {
  return (
    <Card className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}