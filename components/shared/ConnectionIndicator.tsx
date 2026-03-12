"use client";

import { SignalDot } from "@/components/shared/SignalDot";
import { useWebsocket } from "@/hooks/useWebsocket";
import { cn } from "@/lib/utils";

interface ConnectionIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

const STATUS_CONFIG = {
  connected: {
    dotStatus: "ok" as const,
    pulse: true,
    label: "Live",
    labelClass: "text-status-ok",
  },
  connecting: {
    dotStatus: "warn" as const,
    pulse: true,
    label: "Connecting...",
    labelClass: "text-status-warn",
  },
  disconnected: {
    dotStatus: "danger" as const,
    pulse: false,
    label: "Offline",
    labelClass: "text-status-danger",
  },
};

export function ConnectionIndicator({
  className,
  showLabel = true,
}: ConnectionIndicatorProps) {
  const { connectionStatus } = useWebsocket();
  const config = STATUS_CONFIG[connectionStatus];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <SignalDot
        status={config.dotStatus}
        size="sm"
        pulse={config.pulse}
      />
      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium select-none",
            config.labelClass
          )}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
