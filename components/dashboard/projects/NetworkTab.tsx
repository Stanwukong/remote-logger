import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockNetworkData } from "@/lib/mock-data"

export function NetworkTab() {
  return (
    <div className="space-y-6">
      {/* API Performance */}
      <Card>
        <CardHeader>
          <CardTitle>API Performance</CardTitle>
          <CardDescription>Performance metrics for API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Endpoint</th>
                    <th className="text-left p-2">Success Rate</th>
                    <th className="text-left p-2">Avg Response Time</th>
                    <th className="text-left p-2">Requests</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockNetworkData.endpoints.map((endpoint, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-2 font-medium">{endpoint.url}</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <span>{endpoint.successRate}%</span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              endpoint.successRate > 99
                                ? "bg-green-500"
                                : endpoint.successRate > 95
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="p-2">{endpoint.avgResponseTime}ms</td>
                      <td className="p-2">{endpoint.requests.toLocaleString()}</td>
                      <td className="p-2">
                        <Badge
                          variant={
                            endpoint.successRate > 99
                              ? "default"
                              : endpoint.successRate > 95
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {endpoint.successRate > 99 ? "Healthy" : endpoint.successRate > 95 ? "Warning" : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="md:hidden space-y-4">
              {mockNetworkData.endpoints.map((endpoint, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate pr-2">{endpoint.url}</div>
                    <Badge
                      variant={
                        endpoint.successRate > 99
                          ? "default"
                          : endpoint.successRate > 95
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {endpoint.successRate > 99 ? "Healthy" : endpoint.successRate > 95 ? "Warning" : "Critical"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Success Rate: </span>
                      <span className="font-medium">{endpoint.successRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Time: </span>
                      <span>{endpoint.avgResponseTime}ms</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Requests: </span>
                      <span>{endpoint.requests.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Code Distribution & Failed Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Code Distribution</CardTitle>
            <CardDescription>HTTP status codes over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockNetworkData.statusCodes).map(([code, percentage]) => (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        code.startsWith("2") ? "default" : code.startsWith("4") ? "secondary" : "destructive"
                      }
                    >
                      {code}
                    </Badge>
                    <span className="text-sm">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2 w-20 md:w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Requests</CardTitle>
            <CardDescription>Recent request failures and errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNetworkData.failedRequests.map((request, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded truncate flex-1 mr-2">
                      {request.url}
                    </code>
                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                      {request.count}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{request.error}</p>
                  <p className="text-xs text-muted-foreground">{request.lastSeen}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}