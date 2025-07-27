import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Code } from "lucide-react"

const codeExample = `import { LogHive } from '@LogHive-sdk'

const logger = new LogHive({
  apiKey: 'your-api-key',
  project: 'my-app'
})

logger.info('User logged in', { userId: 123 })
logger.error('Payment failed', { error, orderId })`

export function SDKSection() {
  return (
    <section className="container mx-auto px-4 py-24 bg-muted/30 rounded-3xl my-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">SDK + REST API Integration</h2>
        <p className="text-muted-foreground text-lg">Get started in minutes with our developer-friendly SDK</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span className="font-mono text-sm">npm install @LogHive-sdk</span>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
              {codeExample}
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}