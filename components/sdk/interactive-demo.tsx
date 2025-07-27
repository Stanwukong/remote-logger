"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Play, Send, Activity, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

export function InteractiveDemo() {
  const [logLevel, setLogLevel] = useState("info")
  const [message, setMessage] = useState("User logged in successfully")
  const [metadata, setMetadata] = useState('{"userId": 123, "email": "demo@example.com"}')
  const [logs, setLogs] = useState([
    {
      id: 1,
      level: "info",
      message: "Application started",
      metadata: { version: "1.0.0", environment: "demo" },
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 2,
      level: "warn",
      message: "High memory usage detected",
      metadata: { usage: "85%", threshold: "80%" },
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
  ])

  const handleSendLog = () => {
    try {
      const parsedMetadata = metadata ? JSON.parse(metadata) : {}
      const newLog = {
        id: logs.length + 1,
        level: logLevel,
        message,
        metadata: parsedMetadata,
        timestamp: new Date().toISOString(),
      }
      setLogs([newLog, ...logs])
    } catch (error) {
      console.error(`Invalid JSON metadata: ${error}`)
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "border-l-red-500"
      case "warn":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
      default:
        return "border-l-green-500"
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Log Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Send Test Log</span>
          </CardTitle>
          <CardDescription>Try sending logs to see them appear in real-time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level">Log Level</Label>
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter log message..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata (JSON)</Label>
            <Textarea
              id="metadata"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"key": "value"}'
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={handleSendLog} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send Log
          </Button>
        </CardContent>
      </Card>

      {/* Live Log Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Live Log Stream</span>
            <Badge variant="outline" className="ml-auto">
              {logs.length} logs
            </Badge>
          </CardTitle>
          <CardDescription>Real-time log visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className={`border-l-4 px-4 py-2 bg-muted/30 rounded-r-lg ${getLevelColor(log.level)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getLevelIcon(log.level)}
                    <Badge
                      variant={log.level === "error" ? "destructive" : log.level === "warn" ? "secondary" : "default"}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-medium text-sm my-2">{log.message}</p>
                {Object.keys(log.metadata).length > 0 && (
                  <pre className="text-xs bg-background/50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
