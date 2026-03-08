"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Send,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
  Bug,
  Trash2,
  Zap,
} from "lucide-react";

interface LogEntry {
  id: number;
  level: string;
  message: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  source: "manual" | "auto";
}

export function InteractiveDemo() {
  const [logLevel, setLogLevel] = useState("info");
  const [message, setMessage] = useState("User logged in successfully");
  const [metadata, setMetadata] = useState(
    '{"userId": 123, "email": "demo@example.com"}'
  );
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      level: "info",
      message: "Application started",
      metadata: { version: "1.2.2", environment: "demo" },
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: "auto",
    },
    {
      id: 2,
      level: "warn",
      message: "High memory usage detected",
      metadata: { usage: "85%", threshold: "80%" },
      timestamp: new Date(Date.now() - 120000).toISOString(),
      source: "auto",
    },
  ]);

  const handleSendLog = useCallback(() => {
    try {
      const parsedMetadata = metadata ? JSON.parse(metadata) : {};
      const newLog: LogEntry = {
        id: Date.now(),
        level: logLevel,
        message,
        metadata: parsedMetadata,
        timestamp: new Date().toISOString(),
        source: "manual",
      };
      setLogs((prev) => [newLog, ...prev]);
    } catch {
      const errorLog: LogEntry = {
        id: Date.now(),
        level: "error",
        message: "Invalid JSON metadata provided",
        metadata: { rawInput: metadata },
        timestamp: new Date().toISOString(),
        source: "auto",
      };
      setLogs((prev) => [errorLog, ...prev]);
    }
  }, [logLevel, message, metadata]);

  const simulateError = useCallback(() => {
    const errorLog: LogEntry = {
      id: Date.now(),
      level: "error",
      message: "TypeError: Cannot read properties of undefined (reading 'map')",
      metadata: {
        stack:
          "at UserList.render (UserList.tsx:42)\n  at Array.map (<anonymous>)\n  at App.tsx:15",
        component: "UserList",
        eventType: "error",
      },
      timestamp: new Date().toISOString(),
      source: "auto",
    };
    setLogs((prev) => [errorLog, ...prev]);
  }, []);

  const simulatePerformance = useCallback(() => {
    const perfLog: LogEntry = {
      id: Date.now(),
      level: "info",
      message: "Web Vital: LCP measured",
      metadata: {
        metric: "LCP",
        value: 1847,
        rating: "needs-improvement",
        eventType: "performance",
        url: "/dashboard",
      },
      timestamp: new Date().toISOString(),
      source: "auto",
    };
    setLogs((prev) => [perfLog, ...prev]);
  }, []);

  const simulateNetwork = useCallback(() => {
    const netLog: LogEntry = {
      id: Date.now(),
      level: "debug",
      message: "GET /api/v1/users - 200 OK",
      metadata: {
        method: "GET",
        url: "/api/v1/users",
        status: 200,
        duration: 142,
        responseSize: "12.4 KB",
        eventType: "network",
      },
      timestamp: new Date().toISOString(),
      source: "auto",
    };
    setLogs((prev) => [netLog, ...prev]);
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
      case "fatal":
        return <Bug className="w-3.5 h-3.5 text-status-danger" />;
      case "warn":
        return <AlertTriangle className="w-3.5 h-3.5 text-status-warn" />;
      case "info":
        return <Info className="w-3.5 h-3.5 text-data" />;
      case "debug":
        return <Zap className="w-3.5 h-3.5 text-level-debug" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-status-ok" />;
    }
  };

  const getLevelBorderColor = (level: string) => {
    switch (level) {
      case "error":
      case "fatal":
        return "border-l-status-danger";
      case "warn":
        return "border-l-status-warn";
      case "info":
        return "border-l-level-info";
      case "debug":
        return "border-l-level-debug";
      default:
        return "border-l-status-ok";
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "error":
      case "fatal":
        return "bg-status-danger/10 text-status-danger border-status-danger/20";
      case "warn":
        return "bg-status-warn/10 text-status-warn border-status-warn/20";
      case "info":
        return "bg-level-info/10 text-level-info border-level-info/20";
      case "debug":
        return "bg-level-debug/10 text-level-debug border-level-debug/20";
      default:
        return "bg-status-ok/10 text-status-ok border-status-ok/20";
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Log Input Form */}
      <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary font-display">
            <div className="w-8 h-8 bg-signal/10 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-signal" />
            </div>
            <span>Send Test Log</span>
          </CardTitle>
          <CardDescription className="text-text-secondary">
            Simulate SDK logging — send manual logs or trigger auto-captured events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level" className="text-text-secondary text-xs font-medium uppercase tracking-wider">
              Log Level
            </Label>
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger className="bg-bg-elevated/50 border-white/[0.08] text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-bg-surface border-white/[0.08]">
                <SelectItem value="trace">Trace</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="fatal">Fatal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-text-secondary text-xs font-medium uppercase tracking-wider">
              Message
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter log message..."
              className="bg-bg-elevated/50 border-white/[0.08] text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata" className="text-text-secondary text-xs font-medium uppercase tracking-wider">
              Metadata (JSON)
            </Label>
            <Textarea
              id="metadata"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"key": "value"}'
              rows={3}
              className="font-mono text-sm bg-bg-elevated/50 border-white/[0.08] text-text-primary placeholder:text-text-muted"
            />
          </div>

          <Button
            onClick={handleSendLog}
            variant="signal"
            className="w-full font-display font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Log
          </Button>

          {/* Auto-capture simulation buttons */}
          <div className="pt-2 border-t border-white/[0.06]">
            <p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
              Simulate Auto-Capture
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={simulateError}
                variant="outline"
                size="sm"
                className="text-xs bg-status-danger/5 border-status-danger/20 text-status-danger hover:bg-status-danger/10"
              >
                <Bug className="w-3 h-3 mr-1" />
                Error
              </Button>
              <Button
                onClick={simulatePerformance}
                variant="outline"
                size="sm"
                className="text-xs bg-data/5 border-data/20 text-data hover:bg-data/10"
              >
                <Activity className="w-3 h-3 mr-1" />
                Perf
              </Button>
              <Button
                onClick={simulateNetwork}
                variant="outline"
                size="sm"
                className="text-xs bg-signal/5 border-signal/20 text-signal hover:bg-signal/10"
              >
                <Zap className="w-3 h-3 mr-1" />
                Network
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Log Stream */}
      <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-text-primary font-display">
              <div className="w-8 h-8 bg-signal/10 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-signal" />
              </div>
              <span>Live Log Stream</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs border-white/[0.08] text-text-secondary font-mono"
              >
                {logs.length} logs
              </Badge>
              {logs.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLogs((prev) => prev.slice(0, 2))
                  }
                  className="h-7 w-7 p-0 text-text-muted hover:text-status-danger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription className="text-text-secondary">
            Real-time log visualization with level filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border-l-2 px-3 py-2.5 bg-white/[0.02] rounded-r-lg ${getLevelBorderColor(log.level)} transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {getLevelIcon(log.level)}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono px-1.5 py-0 border ${getLevelBadgeStyle(log.level)}`}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    {log.source === "auto" && (
                      <span className="text-[10px] text-text-muted font-mono">
                        auto-captured
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="font-medium text-sm text-text-primary mb-1.5 leading-snug">
                  {log.message}
                </p>
                {Object.keys(log.metadata).length > 0 && (
                  <pre className="text-xs bg-bg-void/60 p-2 rounded font-mono overflow-x-auto text-text-secondary leading-relaxed">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
