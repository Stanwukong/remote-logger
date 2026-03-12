"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

interface LogEntry {
  id: number;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  timestamp: string;
}

const LOG_ENTRIES: Omit<LogEntry, "id" | "timestamp">[] = [
  { level: "INFO", message: "Page loaded: /dashboard (243ms)" },
  { level: "WARN", message: "API response slow: GET /api/users (1,847ms)" },
  { level: "ERROR", message: "Uncaught TypeError: Cannot read property 'data' of undefined" },
  { level: "INFO", message: "User interaction: click #submit-btn" },
  { level: "DEBUG", message: "WebSocket reconnected (attempt 2)" },
  { level: "ERROR", message: "Network failed: POST /api/checkout (timeout)" },
  { level: "INFO", message: "Performance: LCP 1.2s, FID 45ms, CLS 0.03" },
  { level: "WARN", message: "Memory usage: 87% of heap limit" },
  { level: "INFO", message: "Route change: /settings → /billing" },
  { level: "DEBUG", message: "Cache invalidated: user-preferences" },
  { level: "ERROR", message: "CORS blocked: POST https://api.stripe.com/v1/charges" },
  { level: "INFO", message: "Session started: usr_8f2k4n (Chrome 122)" },
];

const levelColors: Record<string, string> = {
  INFO: "text-level-info bg-level-info/10",
  WARN: "text-level-warn bg-level-warn/10",
  ERROR: "text-level-error bg-level-error/10",
  DEBUG: "text-level-debug bg-level-debug/10",
};

function getTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
}

export function LiveLogStream({ className }: { className?: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const indexRef = useRef(0);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed initial entries
    const initial: LogEntry[] = [];
    for (let i = 0; i < 4; i++) {
      initial.push({
        ...LOG_ENTRIES[i % LOG_ENTRIES.length],
        id: idRef.current++,
        timestamp: getTimestamp(),
      });
    }
    setLogs(initial);
    indexRef.current = 4;

    const interval = setInterval(() => {
      const entry = LOG_ENTRIES[indexRef.current % LOG_ENTRIES.length];
      const newLog: LogEntry = {
        ...entry,
        id: idRef.current++,
        timestamp: getTimestamp(),
      };

      setLogs((prev) => {
        const next = [...prev, newLog];
        return next.length > 7 ? next.slice(-7) : next;
      });

      // Show alert notification on ERROR entries
      if (entry.level === "ERROR") {
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 2500);
      }

      indexRef.current++;
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border-subtle bg-bg-void overflow-hidden shadow-2xl",
        className
      )}
    >
      {/* Terminal chrome */}
      <div className="flex items-center justify-between h-9 px-4 bg-bg-surface/80 border-b border-border-faint backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] text-text-muted font-mono tracking-wide">
            apperio &mdash; production
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-ok animate-signal-pulse" />
          <span className="text-[10px] text-text-muted font-mono">LIVE</span>
        </div>
      </div>

      {/* Log entries */}
      <div ref={containerRef} className="p-3 space-y-1 min-h-[240px] max-h-[280px] overflow-hidden">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={cn(
              "flex items-start gap-2 px-2 py-1 rounded text-[12px] font-mono leading-relaxed transition-all duration-500",
              i === logs.length - 1 && "animate-fade-in",
              log.level === "ERROR" && "bg-level-error/5"
            )}
          >
            <span className="text-text-muted shrink-0 w-[72px]">
              {log.timestamp}
            </span>
            <span
              className={cn(
                "shrink-0 px-1.5 py-0 rounded text-[10px] font-bold uppercase tracking-wider",
                levelColors[log.level]
              )}
            >
              {log.level}
            </span>
            <span className="text-text-secondary truncate">{log.message}</span>
          </div>
        ))}
      </div>

      {/* Alert notification slide-in */}
      <div
        className={cn(
          "absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-status-danger/30 bg-bg-surface/95 backdrop-blur-sm shadow-lg transition-all duration-300",
          alertVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        )}
      >
        <Bell className="w-3.5 h-3.5 text-status-danger" />
        <div className="text-[11px]">
          <span className="text-status-danger font-semibold">Alert triggered</span>
          <span className="text-text-muted"> &rarr; Slack #eng-alerts</span>
        </div>
      </div>
    </div>
  );
}
