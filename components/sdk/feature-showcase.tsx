import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Bell,
  BarChart3,
  Shield,
  Zap,
  Database,
  Clock,
} from "lucide-react";
import { CodeBlock } from "./code-block";

export function FeatureShowcase() {
  return (
    <Tabs
      defaultValue="search"
      className="w-full border-2 rounded-xl border-amber-400"
    >
      <p className="text-center w-full text-amber-600 animate-pulse text-xs sm:text-sm px-4 py-2">IN DEVELOPMENT</p>
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-full mx-auto mb-6 sm:mb-8 gap-1 px-2 sm:px-4">
        <TabsTrigger value="search" className="text-xs sm:text-sm py-2 sm:py-3 px-2">
          <span className="hidden sm:inline">Search & Filter</span>
          <span className="sm:hidden">Search</span>
        </TabsTrigger>
        <TabsTrigger value="alerts" className="text-xs sm:text-sm py-2 sm:py-3 px-2">
          <span className="hidden sm:inline">Smart Alerts</span>
          <span className="sm:hidden">Alerts</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 sm:py-3 px-2">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="performance" className="text-xs sm:text-sm py-2 sm:py-3 px-2">
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-data-info flex-shrink-0" />
                <span className="text-sm sm:text-base">Advanced Search</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Powerful query language with full-text search and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm mb-2">
                    Full-text Search
                  </h4>
                  <CodeBlock
                    language="text"
                    code='error AND database AND "connection timeout"'
                    showCopy={false}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm mb-2">
                    Field-specific Queries
                  </h4>
                  <CodeBlock
                    language="text"
                    code="level:error service:api-server userId:123"
                    showCopy={false}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm mb-2">
                    Time Range Filters
                  </h4>
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-status-ok flex-shrink-0" />
                <span className="text-sm sm:text-base">Smart Filtering</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Filter logs by any field with autocomplete suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">level:error</Badge>
                  <Badge variant="outline" className="text-xs">service:auth</Badge>
                  <Badge variant="outline" className="text-xs">environment:prod</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">userId:123</Badge>
                  <Badge variant="secondary" className="text-xs">requestId:req_abc</Badge>
                  <Badge variant="secondary" className="text-xs">region:us-east-1</Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Combine multiple filters with AND/OR logic. Save frequently
                  used filter combinations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-status-warn flex-shrink-0" />
                <span className="text-sm sm:text-base">Intelligent Alerts</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                ML-powered anomaly detection and custom thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-data-purple flex-shrink-0" />
                <span className="text-sm sm:text-base">Multi-Channel Notifications</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Send alerts to Slack, email, webhooks, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 p-2 sm:p-3 border rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-status-ok/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-status-ok font-bold text-xs sm:text-sm">S</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm">Slack Integration</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Real-time alerts to your team channels
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 sm:p-3 border rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-data-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-data-info font-bold text-xs sm:text-sm">@</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm">
                      Email Notifications
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Customizable email templates
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 sm:p-3 border rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-status-warn/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-status-warn font-bold text-xs sm:text-sm">W</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm">Webhooks</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Integrate with PagerDuty, Opsgenie, etc.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-data-info flex-shrink-0" />
                <span className="text-sm sm:text-base">Real-time Analytics</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Comprehensive metrics and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-data-info">1.2M</div>
                    <div className="text-xs text-muted-foreground">
                      Logs Today
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-status-danger">23</div>
                    <div className="text-xs text-muted-foreground">
                      Active Errors
                    </div>
                  </div>
                </div>
                <div className="h-20 sm:h-24 bg-muted/30 rounded-lg flex items-end justify-center space-x-1 p-2 sm:p-4">
                  {[40, 60, 30, 80, 45, 70, 55, 90, 35, 65].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="bg-data-info/60 rounded-t flex-1"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Track log volume, error rates, response times, and custom
                  metrics over time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-status-ok flex-shrink-0" />
                <span className="text-sm sm:text-base">Custom Dashboards</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Build personalized views for your team
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
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

      <TabsContent value="performance" className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">High Performance</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Handle millions of logs with minimal latency
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-status-ok">
                      {"<50ms"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ingestion Latency
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-data-info">10M+</div>
                    <div className="text-xs text-muted-foreground">
                      Logs/Second
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Batch Processing</span>
                    <span className="text-status-ok">Optimized</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Compression</span>
                    <span className="text-status-ok">Enabled</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Auto-scaling</span>
                    <span className="text-status-ok">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-status-danger flex-shrink-0" />
                <span className="text-sm sm:text-base">Enterprise Security</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                SOC 2 compliant with end-to-end encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">AES-256 encryption at rest</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">TLS 1.3 encryption in transit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">SOC 2 Type II certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">GDPR & CCPA compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">Role-based access control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-status-ok rounded-full flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-relaxed">
                    Audit logs & compliance reports
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
