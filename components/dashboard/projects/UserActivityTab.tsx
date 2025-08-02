import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"

export function UserActivityTab() {
  const userJourneyData = [
    { from: "Landing Page", to: "Dashboard", users: 1247, percentage: 85 },
    { from: "Dashboard", to: "Projects", users: 892, percentage: 72 },
    { from: "Projects", to: "Analytics", users: 567, percentage: 64 },
    { from: "Analytics", to: "Settings", users: 234, percentage: 41 },
  ]

  const interactionData = [
    { element: "Primary CTA Button", clicks: 2456, percentage: 100 },
    { element: "Navigation Menu", clicks: 1892, percentage: 77 },
    { element: "Search Bar", clicks: 1234, percentage: 50 },
    { element: "Footer Links", clicks: 567, percentage: 23 },
    { element: "Social Icons", clicks: 234, percentage: 10 },
  ]

  const scrollDepthData = [
    { page: "/dashboard", depth25: 95, depth50: 78, depth75: 45, depth100: 23 },
    { page: "/projects", depth25: 92, depth50: 82, depth75: 67, depth100: 34 },
    { page: "/analytics", depth25: 88, depth50: 71, depth75: 52, depth100: 28 },
    { page: "/settings", depth25: 96, depth50: 89, depth75: 76, depth100: 45 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Journey Map</CardTitle>
            <CardDescription>Most common user paths through your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userJourneyData.map((path, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">{path.from}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">{path.to}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{path.users} users</span>
                      <span className="text-xs font-medium">{path.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={path.percentage} className="h-2 w-16 md:w-20 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Heatmap</CardTitle>
            <CardDescription>Most clicked elements and user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactionData.map((interaction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate pr-2">{interaction.element}</span>
                    <span className="text-muted-foreground text-xs flex-shrink-0">
                      {interaction.clicks} clicks
                    </span>
                  </div>
                  <Progress value={interaction.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scroll Depth Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Scroll Depth Analysis</CardTitle>
          <CardDescription>How far users scroll on different pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scrollDepthData.map((page, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-sm">{page.page}</h4>
                <div className="space-y-3">
                  {[
                    { label: "25%", value: page.depth25 },
                    { label: "50%", value: page.depth50 },
                    { label: "75%", value: page.depth75 },
                    { label: "100%", value: page.depth100 },
                  ].map((depth, depthIndex) => (
                    <div key={depthIndex} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{depth.label}</span>
                        <span className="font-medium">{depth.value}%</span>
                      </div>
                      <Progress value={depth.value} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}