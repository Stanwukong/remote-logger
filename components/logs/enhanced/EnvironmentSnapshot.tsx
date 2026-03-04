"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SignalDot } from "@/components/shared/SignalDot";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EnvironmentData {
  url?: string;
  referrer?: string;
  viewport?: { width: number; height: number };
  scrollPosition?: { x: number; y: number };
  networkState?: {
    online: boolean;
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  memory?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
}

interface EnvironmentSnapshotProps {
  environment?: EnvironmentData;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function EnvRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-text-muted">{label}</span>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}

export function EnvironmentSnapshot({ environment }: EnvironmentSnapshotProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!environment) {
    return null;
  }

  const hasAnyData =
    environment.url ||
    environment.referrer ||
    environment.viewport ||
    environment.scrollPosition ||
    environment.networkState ||
    environment.memory;

  if (!hasAnyData) {
    return null;
  }

  const memoryPercentage =
    environment.memory?.usedJSHeapSize && environment.memory?.jsHeapSizeLimit
      ? Math.round(
          (environment.memory.usedJSHeapSize / environment.memory.jsHeapSizeLimit) * 100
        )
      : null;

  return (
    <div className="space-y-2">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors w-full text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span>Environment at time of error</span>
      </button>

      {isOpen && (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL */}
            {environment.url && (
              <EnvRow label="URL">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono text-xs truncate block max-w-full cursor-help">
                      {environment.url}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-md break-all">
                    {environment.url}
                  </TooltipContent>
                </Tooltip>
              </EnvRow>
            )}

            {/* Referrer */}
            {(environment.referrer !== undefined) && (
              <EnvRow label="Referrer">
                {environment.referrer ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-xs truncate block max-w-full cursor-help">
                        {environment.referrer}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-md break-all">
                      {environment.referrer}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-xs text-text-muted">Direct</span>
                )}
              </EnvRow>
            )}

            {/* Viewport */}
            {environment.viewport && (
              <EnvRow label="Viewport">
                <span className="font-mono text-xs">
                  {environment.viewport.width} x {environment.viewport.height}px
                </span>
              </EnvRow>
            )}

            {/* Scroll Position */}
            {environment.scrollPosition && (
              <EnvRow label="Scroll">
                <span className="font-mono text-xs">
                  x: {environment.scrollPosition.x}, y: {environment.scrollPosition.y}
                </span>
              </EnvRow>
            )}

            {/* Network */}
            {environment.networkState && (
              <EnvRow label="Network">
                <div className="flex items-center gap-2">
                  <SignalDot
                    status={environment.networkState.online ? "ok" : "danger"}
                    size="sm"
                    pulse={false}
                  />
                  <span className="text-xs">
                    {environment.networkState.online ? "Online" : "Offline"}
                  </span>
                  {environment.networkState.effectiveType && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border-faint font-mono">
                      {environment.networkState.effectiveType}
                    </span>
                  )}
                  {environment.networkState.rtt !== undefined && (
                    <span className="text-xs text-text-muted font-mono">
                      {environment.networkState.rtt}ms RTT
                    </span>
                  )}
                  {environment.networkState.downlink !== undefined && (
                    <span className="text-xs text-text-muted font-mono">
                      {environment.networkState.downlink} Mbps
                    </span>
                  )}
                </div>
              </EnvRow>
            )}

            {/* Memory */}
            {environment.memory && environment.memory.usedJSHeapSize && (
              <EnvRow label="Memory">
                <div className="space-y-1">
                  {memoryPercentage !== null && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-bg-elevated border border-border-faint overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            memoryPercentage > 80
                              ? "bg-status-danger"
                              : memoryPercentage > 60
                              ? "bg-status-warn"
                              : "bg-signal"
                          }`}
                          style={{ width: `${Math.min(memoryPercentage, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-secondary">
                        {memoryPercentage}%
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-text-muted font-mono">
                    {formatBytes(environment.memory.usedJSHeapSize)}
                    {environment.memory.jsHeapSizeLimit &&
                      ` / ${formatBytes(environment.memory.jsHeapSizeLimit)}`}
                  </div>
                </div>
              </EnvRow>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
