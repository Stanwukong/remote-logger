import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Layers, Server, Zap, LucideIcon } from "lucide-react"

interface IntegrationCardProps {
  name: string
  icon: LucideIcon
}

function IntegrationCard({ name, icon: Icon }: IntegrationCardProps) {
  return (
    <Card className="text-center hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <p className="font-medium">{name}</p>
      </CardContent>
    </Card>
  )
}

const integrationData = {
  languages: {
    icon: Code,
    items: ["Node.js"]
  },
  frameworks: {
    icon: Layers,
    items: ["React", "Next.js", "Express", "NestJS"]
  },
  platforms: {
    icon: Server,
    items: ["AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Heroku", "DigitalOcean", "Railway", "Fly.io", "Render", "Supabase", "PlanetScale"]
  },
  tools: {
    icon: Zap,
    items: ["Slack", "Discord", "Teams", "PagerDuty", "Datadog", "New Relic", "Sentry", "Grafana", "Prometheus", "Kibana", "Splunk", "LogRocket"]
  }
}

export function Integrations() {
  return (
    <section className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl my-24">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Integrations
        </Badge>
        <h2 className="text-4xl font-bold mb-4">Works with your entire stack</h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Seamlessly integrate with your favorite tools and platforms
        </p>
      </div>

      <Tabs defaultValue="languages" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12">
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {Object.entries(integrationData).map(([key, data]) => (
          <TabsContent key={key} value={key} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {data.items.map((item) => (
                <IntegrationCard key={item} name={item} icon={data.icon} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}