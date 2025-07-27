import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Bell, BarChart3, Shield, Zap, Database, Clock } from "lucide-react"
import { CodeBlock } from "./code-block"

export function FeatureShowcase() {
  return (
    <Tabs defaultValue="search" className="w-full">
      <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
        <TabsTrigger value="search">Search & Filter</TabsTrigger>
        <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-500" />
                <span>Advanced Search</span>
              </CardTitle>
              <CardDescription>Powerful query language with full-text search and filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Full-text Search</h4>
                  <CodeBlock language="text" code='error AND database AND "connection timeout"' showCopy={false} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Field-specific Queries</h4>
                  <CodeBlock language="text" code="level:error service:api-server userId:123" showCopy={false} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Time Range Filters</h4>
                  <CodeBlock
                    language="text"
                    code="timestamp:[2024-01-01 TO 2024-01-31] AND level:warn"
                    showCopy={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-green-500" />
                <span>Smart Filtering</span>
              </CardTitle>
              <CardDescription>Filter logs by any field with autocomplete suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">level:error</Badge>
                  <Badge variant="outline">service:auth</Badge>
                  <Badge variant="outline">environment:prod</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">userId:123</Badge>
                  <Badge variant="secondary">requestId:req_abc</Badge>
                  <Badge variant="secondary">region:us-east-1</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Combine multiple filters with AND/OR logic. Save frequently used filter combinations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="alerts" className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-500" />
                <span>Intelligent Alerts</span>
              </CardTitle>
              <CardDescription>ML-powered anomaly detection and custom thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="yaml"
                code={`# Alert Configuration
name: "High Error Rate"
condition:
  query: "level:error"
  threshold: 10
  window: "5m"
  
# Anomaly Detection
anomaly_detection:
  enabled: true
  sensitivity: "medium"
  baseline_period: "7d"
  
# Notifications
notifications:
  - type: "slack"
    channel: "#alerts"
  - type: "email"
    recipients: ["team@company.com"]
  - type: "webhook"
    url: "https://api.pagerduty.com/webhook"`}
                showCopy
                title="alert-config.yml"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Multi-Channel Notifications</span>
              </CardTitle>
              <CardDescription>Send alerts to Slack, email, webhooks, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-green-500 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Slack Integration</h4>
                    <p className="text-xs text-muted-foreground">Real-time alerts to your team channels</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-sm">@</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground">Customizable email templates</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">W</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Webhooks</h4>
                    <p className="text-xs text-muted-foreground">Integrate with PagerDuty, Opsgenie, etc.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span>Real-time Analytics</span>
              </CardTitle>
              <CardDescription>Comprehensive metrics and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">1.2M</div>
                    <div className="text-xs text-muted-foreground">Logs Today</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">23</div>
                    <div className="text-xs text-muted-foreground">Active Errors</div>
                  </div>
                </div>
                <div className="h-24 bg-muted/30 rounded-lg flex items-end justify-center space-x-1 p-4">
                  {[40, 60, 30, 80, 45, 70, 55, 90, 35, 65].map((height, index) => (
                    <div key={index} className="bg-blue-500/60 rounded-t flex-1" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Track log volume, error rates, response times, and custom metrics over time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-500" />
                <span>Custom Dashboards</span>
              </CardTitle>
              <CardDescription>Build personalized views for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="json"
                code={`{
  "dashboard": {
    "name": "Production Overview",
    "widgets": [
      {
        "type": "metric",
        "title": "Error Rate",
        "query": "level:error",
        "visualization": "line_chart"
      },
      {
        "type": "table",
        "title": "Recent Errors",
        "query": "level:error",
        "limit": 10
      },
      {
        "type": "pie_chart",
        "title": "Logs by Service",
        "group_by": "service"
      }
    ]
  }
}`}
                showCopy
                title="dashboard-config.json"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span>High Performance</span>
              </CardTitle>
              <CardDescription>Handle millions of logs with minimal latency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{"<50ms"}</div>
                    <div className="text-xs text-muted-foreground">Ingestion Latency</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">10M+</div>
                    <div className="text-xs text-muted-foreground">Logs/Second</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Batch Processing</span>
                    <span className="text-green-500">Optimized</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compression</span>
                    <span className="text-green-500">Enabled</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Auto-scaling</span>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span>Enterprise Security</span>
              </CardTitle>
              <CardDescription>SOC 2 compliant with end-to-end encryption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">AES-256 encryption at rest</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">TLS 1.3 encryption in transit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">GDPR & CCPA compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Role-based access control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Audit logs & compliance reports</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
