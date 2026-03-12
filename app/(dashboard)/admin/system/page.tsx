"use client";

import { useAdminSystemHealth } from "@/hooks/admin.hook";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import {
  Database,
  Server,
  Clock,
  HardDrive,
  Cpu,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Progress bar component
// ---------------------------------------------------------------------------

function MemoryBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const barColor =
    pct > 90
      ? "bg-status-danger"
      : pct > 70
      ? "bg-status-warn"
      : "bg-signal";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-muted font-mono">
          {formatBytes(used)} / {formatBytes(total)} ({pct}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSystemPage() {
  const { data: health, isLoading } = useAdminSystemHealth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  const mongoConnected = health?.mongodb?.status === "connected";
  const mem = health?.memoryUsage;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health"
        description="Real-time server and database monitoring"
        badge={
          <Badge
            variant="outline"
            className={
              mongoConnected
                ? "text-signal border-signal/30"
                : "text-status-danger border-status-danger/30"
            }
          >
            {mongoConnected ? "Healthy" : "Degraded"}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MongoDB */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display text-text-primary flex items-center gap-2">
              <Database className="w-4 h-4 text-signal" />
              MongoDB
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Status</span>
              <div className="flex items-center gap-2">
                <SignalDot
                  status={mongoConnected ? "ok" : "danger"}
                  size="md"
                  pulse={mongoConnected}
                />
                <span
                  className={`text-sm font-medium ${
                    mongoConnected ? "text-signal" : "text-status-danger"
                  }`}
                >
                  {health?.mongodb?.status ?? "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Active Connections
              </span>
              <span className="text-sm text-text-primary font-mono">
                {health?.mongodb?.connections ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Database Size</span>
              <span className="text-sm text-text-primary font-mono">
                {health?.mongodb?.dbSize
                  ? formatBytes(health.mongodb.dbSize)
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Process Info */}
        <Card className="bg-bg-surface border-border-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display text-text-primary flex items-center gap-2">
              <Server className="w-4 h-4 text-data-info" />
              Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Node.js Version</span>
              <Badge variant="outline" className="text-text-muted font-mono text-xs">
                {health?.nodeVersion ?? "N/A"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Uptime</span>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-sm text-text-primary font-mono">
                  {health?.uptime ? formatUptime(health.uptime) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card className="bg-bg-surface border-border-subtle lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display text-text-primary flex items-center gap-2">
              <Cpu className="w-4 h-4 text-status-warn" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {mem ? (
              <>
                <MemoryBar
                  label="Heap Used / Heap Total"
                  used={mem.heapUsed}
                  total={mem.heapTotal}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">RSS</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {formatBytes(mem.rss)}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Resident Set Size
                    </p>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">External</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {formatBytes(mem.external)}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      C++ objects bound to JS
                    </p>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-1">Array Buffers</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {formatBytes(mem.arrayBuffers)}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      ArrayBuffer &amp; SharedArrayBuffer
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">
                Memory data unavailable.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
