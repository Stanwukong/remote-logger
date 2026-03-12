"use client";

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
  ShieldCheck,
  Wifi,
  WifiOff,
  Shrink,
  HeartPulse,
  Repeat2,
  Radar,
  Settings,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { CodeBlock } from "./code-block";

export function FeatureShowcase() {
  return (
    <Tabs defaultValue="circuit-breaker" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto mb-8 gap-1 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
        <TabsTrigger
          value="circuit-breaker"
          className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
          Circuit Breaker
        </TabsTrigger>
        <TabsTrigger
          value="offline"
          className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
        >
          <WifiOff className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
          Offline Queue
        </TabsTrigger>
        <TabsTrigger
          value="compression"
          className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
        >
          <Shrink className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
          Compression
        </TabsTrigger>
        <TabsTrigger
          value="health"
          className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-signal/10 data-[state=active]:text-signal transition-all duration-200"
        >
          <HeartPulse className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
          Health Metrics
        </TabsTrigger>
      </TabsList>

      {/* Circuit Breaker */}
      <TabsContent value="circuit-breaker" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-primary font-display">
                <div className="w-8 h-8 bg-signal/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-signal" />
                </div>
                Circuit Breaker Pattern
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Protects your app when the API is unreachable. Automatically stops sending,
                tests recovery, and resumes when healthy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`const logger = new Apperio({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Circuit breaker configuration
  circuitBreaker: {
    failureThreshold: 5,   // Open after 5 failures
    resetTimeout: 30000,   // Try again after 30s
    halfOpenRequests: 1,   // Test with 1 request
  },
});

// SDK handles state transitions automatically:
// CLOSED  -> normal operation, sending logs
// OPEN    -> API failing, logs buffered locally
// HALF_OPEN -> testing if API recovered`}
                showCopy
                title="circuit-breaker.ts"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-text-primary font-display text-base">
                State Machine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual state diagram */}
              <div className="space-y-3">
                {[
                  {
                    state: "CLOSED",
                    desc: "Normal operation. Logs sent to API. Failure counter tracks errors.",
                    color: "bg-status-ok/10 border-status-ok/30 text-status-ok",
                    dot: "bg-status-ok",
                  },
                  {
                    state: "OPEN",
                    desc: "API unreachable. Logs buffered in memory. No requests sent until timeout.",
                    color: "bg-status-danger/10 border-status-danger/30 text-status-danger",
                    dot: "bg-status-danger",
                  },
                  {
                    state: "HALF_OPEN",
                    desc: "Testing recovery. One probe request sent. Success closes, failure reopens.",
                    color: "bg-status-warn/10 border-status-warn/30 text-status-warn",
                    dot: "bg-status-warn",
                  },
                ].map((item) => (
                  <div
                    key={item.state}
                    className={`p-3 rounded-lg border ${item.color}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <span className="font-mono text-sm font-semibold">
                        {item.state}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Repeat2 className="w-4 h-4 text-text-muted" />
                <p className="text-xs text-text-muted">
                  Transitions are automatic. Zero developer intervention needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Offline Queue */}
      <TabsContent value="offline" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-primary font-display">
                <div className="w-8 h-8 bg-data/10 rounded-lg flex items-center justify-center">
                  <WifiOff className="w-4 h-4 text-data" />
                </div>
                Offline Queue
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Detects offline state, queues logs in memory with priority-based eviction,
                and auto-retries when connection is restored.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`const logger = new Apperio({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Offline queue configuration
  offlineQueue: {
    maxSize: 500,         // Max queued logs
    priorityEviction: true, // Keep errors, drop debug
  },
});

// When offline:
// 1. Logs are queued in memory
// 2. Priority: fatal > error > warn > info > debug > trace
// 3. When queue is full, lowest priority logs are evicted
// 4. On reconnection, queued logs are flushed automatically`}
                showCopy
                title="offline-queue.ts"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-text-primary font-display text-base">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    icon: WifiOff,
                    label: "Connection Lost",
                    desc: "Navigator.onLine and fetch failures detected instantly",
                  },
                  {
                    icon: Settings,
                    label: "Priority Queuing",
                    desc: "Errors and fatals kept. Debug and trace evicted first when full",
                  },
                  {
                    icon: Wifi,
                    label: "Auto Recovery",
                    desc: "Online event fires, queued logs flushed in order",
                  },
                  {
                    icon: CheckCircle2,
                    label: "Zero Data Loss",
                    desc: "Critical logs preserved even during extended outages",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/[0.03] border border-white/[0.06] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-signal" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {item.label}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Compression */}
      <TabsContent value="compression" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-primary font-display">
                <div className="w-8 h-8 bg-data-bright/10 rounded-lg flex items-center justify-center">
                  <Shrink className="w-4 h-4 text-data-bright" />
                </div>
                Payload Compression
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Automatically compresses log payloads before sending to reduce bandwidth usage.
                Works in both browser and Node.js environments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`const logger = new Apperio({
  apiKey: "your-api-key",
  projectId: "your-project-id",

  // Enable compression
  compression: true,
});

// Browser: Uses CompressionStream API (gzip)
// Node.js: Uses zlib compression
// Automatic fallback to uncompressed if not supported
// Typical compression ratio: 60-80% reduction`}
                showCopy
                title="compression.ts"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-text-primary font-display text-base">
                Bandwidth Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual comparison bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Uncompressed</span>
                    <span className="font-mono">~12 KB</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full w-full bg-status-danger/40 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Gzip Compressed</span>
                    <span className="font-mono text-signal">~3 KB</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full w-1/4 bg-signal/60 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-lg font-display font-bold text-signal">
                    ~75%
                  </div>
                  <div className="text-xs text-text-muted">Size Reduction</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-lg font-display font-bold text-data">
                    Auto
                  </div>
                  <div className="text-xs text-text-muted">Fallback</div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-white/[0.08] text-text-muted"
                >
                  Browser
                </Badge>
                <span className="text-xs text-text-secondary">
                  CompressionStream API (Chrome 80+, Firefox 113+, Safari 16.4+)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] border-white/[0.08] text-text-muted"
                >
                  Node.js
                </Badge>
                <span className="text-xs text-text-secondary">
                  Native zlib module, no additional dependencies
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Health Metrics */}
      <TabsContent value="health" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-primary font-display">
                <div className="w-8 h-8 bg-status-ok/10 rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-4 h-4 text-status-ok" />
                </div>
                SDK Health Metrics
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Monitor the SDK itself. Track buffer utilization, flush success rates,
                circuit breaker state, and sanitization activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`const metrics = logger.getHealthMetrics();

console.log(metrics);
// {
//   bufferSize: 12,
//   maxBufferSize: 1000,
//   bufferUtilization: 0.012,
//   flushSuccessCount: 847,
//   flushFailureCount: 2,
//   droppedLogCount: 0,
//   circuitBreakerState: "CLOSED",
//   sanitizationCount: 156,
//   lastFlushTime: "2026-03-08T14:23:01Z",
//   uptime: 3600000
// }`}
                showCopy
                title="health-metrics.ts"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-text-primary font-display text-base">
                Live Dashboard Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Simulated health dashboard */}
              {[
                {
                  label: "Buffer Utilization",
                  value: "1.2%",
                  bar: 1.2,
                  color: "bg-status-ok",
                },
                {
                  label: "Flush Success Rate",
                  value: "99.8%",
                  bar: 99.8,
                  color: "bg-signal",
                },
                {
                  label: "Sanitization Rate",
                  value: "18%",
                  bar: 18,
                  color: "bg-data",
                },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>{metric.label}</span>
                    <span className="font-mono text-text-primary">
                      {metric.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className={`h-full ${metric.color}/60 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(metric.bar, 100)}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-xs text-text-muted mb-0.5">
                    Circuit Breaker
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-status-ok/30 text-status-ok bg-status-ok/10"
                  >
                    CLOSED
                  </Badge>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-xs text-text-muted mb-0.5">
                    Dropped
                  </div>
                  <span className="text-sm font-mono font-semibold text-status-ok">
                    0
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                  <div className="text-xs text-text-muted mb-0.5">Uptime</div>
                  <span className="text-sm font-mono font-semibold text-text-primary">
                    1h
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Radar className="w-4 h-4 text-signal" />
                <p className="text-xs text-text-muted">
                  Access via{" "}
                  <code className="font-mono text-text-code">
                    logger.getHealthMetrics()
                  </code>{" "}
                  at any time
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-data" />
                <p className="text-xs text-text-muted">
                  PII audit trail via{" "}
                  <code className="font-mono text-text-code">
                    logger.getSanitizationAuditTrail()
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
