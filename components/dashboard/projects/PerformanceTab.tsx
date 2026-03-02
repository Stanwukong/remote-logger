import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockPerformanceData } from "@/lib/mock-data"

interface CoreWebVitalCardProps {
  title: string
  description: string
  goodPercentage: number
  threshold: string
}

function CoreWebVitalCard({ title, description, goodPercentage, threshold }: CoreWebVitalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Good ({threshold})</span>
          <span className="font-semibold">{goodPercentage}%</span>
        </div>
        <Progress value={goodPercentage} className="h-2" />
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="w-3 h-3 bg-status-ok rounded-full mx-auto mb-1" />
            <span>Good</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-status-warn rounded-full mx-auto mb-1" />
            <span>Needs Work</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-status-danger rounded-full mx-auto mb-1" />
            <span>Poor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceTab() {
  const coreWebVitals = [
    {
      title: "Largest Contentful Paint",
      description: "LCP measures loading performance",
      goodPercentage: mockPerformanceData.coreWebVitals.lcp.good,
      threshold: "<2.5s"
    },
    {
      title: "First Input Delay",
      description: "FID measures interactivity",
      goodPercentage: mockPerformanceData.coreWebVitals.fid.good,
      threshold: "<100ms"
    },
    {
      title: "Cumulative Layout Shift",
      description: "CLS measures visual stability",
      goodPercentage: mockPerformanceData.coreWebVitals.cls.good,
      threshold: "<0.1"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {coreWebVitals.map((vital, index) => (
          <CoreWebVitalCard key={index} {...vital} />
        ))}
      </div>

      {/* Page Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Page Performance</CardTitle>
          <CardDescription>Performance metrics for individual pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">URL</th>
                      <th className="text-left p-2">Avg Load Time</th>
                      <th className="text-left p-2">P95</th>
                      <th className="text-left p-2">P99</th>
                      <th className="text-left p-2">Sessions</th>
                      <th className="text-left p-2">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPerformanceData.pagePerformance.map((page, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-2 font-medium">{page.url}</td>
                        <td className="p-2">{page.avgLoadTime}ms</td>
                        <td className="p-2">{page.p95}ms</td>
                        <td className="p-2">{page.p99}ms</td>
                        <td className="p-2">{page.sessions.toLocaleString()}</td>
                        <td className="p-2">{page.bounceRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile card layout */}
              <div className="md:hidden space-y-4">
                {mockPerformanceData.pagePerformance.map((page, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="font-medium text-sm">{page.url}</div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Avg Load: </span>
                        <span>{page.avgLoadTime}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">P95: </span>
                        <span>{page.p95}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sessions: </span>
                        <span>{page.sessions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bounce: </span>
                        <span>{page.bounceRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}