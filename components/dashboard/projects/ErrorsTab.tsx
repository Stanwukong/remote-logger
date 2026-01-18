import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { LogEntry } from "@/types/analytics"

interface ErrorsTabProps {
  logs: LogEntry[]
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

export function ErrorsTab({ logs }: ErrorsTabProps) {
  const errorLogs = logs.filter((log) => log.level === "error" || log.eventType === "error")

  // Generate chart data for errors over time
  const errorChartData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
    return {
      time: hour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      errors: Math.floor(Math.random() * 20) + 5,
      warnings: Math.floor(Math.random() * 40) + 10,
    }
  })

  return (
    <div className="space-y-6">
      {/* Error Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Error Trends</CardTitle>
          <CardDescription>Error occurrences over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="warnings" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Error Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Frequency</CardTitle>
            <CardDescription>Most common errors in this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {errorLogs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-medium text-sm truncate">{log.message}</h4>
                    <p className="text-xs text-muted-foreground">
                      {log.service} • {formatTimestamp(log.timestamp)}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs flex-shrink-0">
                    {Math.floor(Math.random() * 50) + 10}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
            <CardDescription>Stack trace and error information</CardDescription>
          </CardHeader>
          <CardContent>
            {errorLogs.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">{errorLogs[0].message}</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>File: {errorLogs[0].error?.url || "app.js"}</p>
                    <p>Line: {errorLogs[0].error?.lineNumber || 123}</p>
                    <p>Column: {errorLogs[0].error?.columnNumber || 45}</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-xs mb-2">Stack Trace</h5>
                  <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {errorLogs[0].error?.stack ||
                      `Error: ${errorLogs[0].message}
    at Object.handleClick (app.js:123:45)
    at HTMLButtonElement.<anonymous> (app.js:456:78)`}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}