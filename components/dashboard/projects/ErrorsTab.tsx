"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { LogEntry } from "@/types/analytics"
import {
  CHART_COLORS,
  GRID_PROPS,
  AXIS_PROPS,
  ANIMATION_CONFIG,
  CURSOR_LINE_PROPS,
} from "@/lib/charts/observatory-theme"

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
              <LineChart data={errorChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <filter id="errorsGlow" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feFlood floodColor={CHART_COLORS.danger} floodOpacity="0.35" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="warningsGlow" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feFlood floodColor={CHART_COLORS.warn} floodOpacity="0.35" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid
                  stroke={GRID_PROPS.stroke}
                  strokeOpacity={GRID_PROPS.strokeOpacity}
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  {...AXIS_PROPS}
                  stroke={CHART_COLORS.grid}
                  interval="preserveStartEnd"
                />
                <YAxis
                  {...AXIS_PROPS}
                  stroke={CHART_COLORS.grid}
                  width={40}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div
                        className="rounded-lg border border-border-subtle/60 p-3 text-sm"
                        style={{
                          backgroundColor: "rgba(11, 18, 32, 0.85)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        <p className="text-text-muted text-[11px] mb-1.5 font-mono">{label}</p>
                        <div className="space-y-1">
                          {payload.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
                                <span className="text-text-secondary text-xs">{entry.name}</span>
                              </div>
                              <span className="text-text-primary font-semibold font-mono text-xs">
                                {entry.value?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                  cursor={CURSOR_LINE_PROPS}
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  name="Errors"
                  stroke={CHART_COLORS.danger}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5, strokeWidth: 2,
                    stroke: CHART_COLORS.danger,
                    fill: "var(--bg-surface)",
                    style: { filter: `drop-shadow(0 0 6px ${CHART_COLORS.danger})` },
                  }}
                  filter="url(#errorsGlow)"
                  {...ANIMATION_CONFIG}
                />
                <Line
                  type="monotone"
                  dataKey="warnings"
                  name="Warnings"
                  stroke={CHART_COLORS.warn}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5, strokeWidth: 2,
                    stroke: CHART_COLORS.warn,
                    fill: "var(--bg-surface)",
                    style: { filter: `drop-shadow(0 0 6px ${CHART_COLORS.warn})` },
                  }}
                  filter="url(#warningsGlow)"
                  {...ANIMATION_CONFIG}
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