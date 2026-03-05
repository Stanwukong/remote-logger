"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ChevronDown, ChevronRight, Code } from "lucide-react";
import { ResolvedStackTrace } from "@/components/dashboard/logs/ResolvedStackTrace";

interface StackFrame {
  raw: string;
  functionName: string;
  filePath: string;
  lineNumber: number | null;
  columnNumber: number | null;
  isVendor: boolean;
}

interface StackTraceViewerProps {
  stackTrace: string;
  projectId?: string;
  release?: string;
  className?: string;
}

function parseStackTrace(stackTrace: string): {
  message: string;
  frames: StackFrame[];
} {
  const lines = stackTrace.split("\n");
  const frames: StackFrame[] = [];
  const messageLines: string[] = [];
  let pastMessage = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // V8/Chrome format: "at FunctionName (file:line:col)" or "at file:line:col"
    const v8WithParens = trimmed.match(
      /^at\s+(.+?)\s+\((.+?)(?::(\d+))(?::(\d+))?\)$/
    );
    const v8WithoutParens = trimmed.match(
      /^at\s+(.+?)(?::(\d+))(?::(\d+))?$/
    );
    // Firefox format: "FunctionName@file:line:col"
    const firefoxFormat = trimmed.match(
      /^(.+?)@(.+?)(?::(\d+))(?::(\d+))?$/
    );

    if (v8WithParens) {
      pastMessage = true;
      const filePath = v8WithParens[2];
      frames.push({
        raw: trimmed,
        functionName: v8WithParens[1],
        filePath,
        lineNumber: v8WithParens[3] ? parseInt(v8WithParens[3], 10) : null,
        columnNumber: v8WithParens[4] ? parseInt(v8WithParens[4], 10) : null,
        isVendor: filePath.includes("node_modules") || filePath.includes("vendor"),
      });
    } else if (v8WithoutParens && !trimmed.startsWith("at Error")) {
      // Make sure we don't match "at Error (native)" style
      pastMessage = true;
      const potentialPath = v8WithoutParens[1];
      // Only treat as a frame if it looks like a path (contains / or \)
      if (potentialPath.includes("/") || potentialPath.includes("\\")) {
        frames.push({
          raw: trimmed,
          functionName: "(anonymous)",
          filePath: potentialPath,
          lineNumber: v8WithoutParens[2]
            ? parseInt(v8WithoutParens[2], 10)
            : null,
          columnNumber: v8WithoutParens[3]
            ? parseInt(v8WithoutParens[3], 10)
            : null,
          isVendor:
            potentialPath.includes("node_modules") ||
            potentialPath.includes("vendor"),
        });
      } else if (!pastMessage) {
        messageLines.push(trimmed);
      }
    } else if (firefoxFormat) {
      pastMessage = true;
      const filePath = firefoxFormat[2];
      frames.push({
        raw: trimmed,
        functionName: firefoxFormat[1] || "(anonymous)",
        filePath,
        lineNumber: firefoxFormat[3] ? parseInt(firefoxFormat[3], 10) : null,
        columnNumber: firefoxFormat[4] ? parseInt(firefoxFormat[4], 10) : null,
        isVendor:
          filePath.includes("node_modules") || filePath.includes("vendor"),
      });
    } else if (!pastMessage) {
      messageLines.push(trimmed);
    }
  }

  return {
    message: messageLines.join("\n"),
    frames,
  };
}

function shortenFilePath(filePath: string): string {
  // Show last 3 segments of path for readability
  const segments = filePath.replace(/\\/g, "/").split("/");
  if (segments.length <= 3) return filePath;
  return ".../" + segments.slice(-3).join("/");
}

export function StackTraceViewer({
  stackTrace,
  projectId,
  release,
  className,
}: StackTraceViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showVendorFrames, setShowVendorFrames] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const { message, frames } = useMemo(
    () => parseStackTrace(stackTrace),
    [stackTrace]
  );

  const appFrames = useMemo(
    () => frames.filter((f) => !f.isVendor),
    [frames]
  );
  const vendorFrameCount = frames.length - appFrames.length;

  const visibleFrames = showVendorFrames ? frames : appFrames;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(stackTrace).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [stackTrace]);

  const canResolve = projectId && release;

  if (showResolved && canResolve) {
    return (
      <div className={cn("space-y-3", className)}>
        <button
          onClick={() => setShowResolved(false)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Back to raw trace
        </button>
        <ResolvedStackTrace
          projectId={projectId}
          release={release}
          stackTrace={stackTrace}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border-faint bg-bg-base overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-faint bg-bg-base">
        <div className="flex items-center gap-2">
          <Code className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-mono text-text-muted">Stack Trace</span>
          <span className="text-xs text-text-muted/60">
            ({frames.length} frame{frames.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {canResolve && (
            <button
              onClick={() => setShowResolved(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-signal hover:text-signal/80 bg-signal/10 rounded-md transition-colors"
            >
              <Code className="w-3 h-3" />
              Resolve source maps
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
            aria-label={copied ? "Copied" : "Copy stack trace"}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-signal" />
                <span className="text-signal">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {message && (
        <div className="px-4 py-2.5 border-b border-border-faint">
          <pre className="font-mono text-xs text-text-primary whitespace-pre-wrap break-all">
            {message}
          </pre>
        </div>
      )}

      {/* Frames */}
      <div className="divide-y divide-border-faint/50">
        {visibleFrames.map((frame, index) => {
          const globalIndex = frames.indexOf(frame);

          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 px-4 py-2 transition-colors hover:bg-bg-surface/50",
                !frame.isVendor && "border-l-2 border-l-signal",
                frame.isVendor && "border-l-2 border-l-transparent"
              )}
            >
              {/* Frame number */}
              <span className="font-mono text-xs text-text-muted/50 w-5 shrink-0 text-right pt-px">
                {globalIndex + 1}
              </span>

              {/* Frame content */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span
                  className={cn(
                    "font-mono text-xs font-bold truncate",
                    frame.isVendor
                      ? "text-text-muted/60"
                      : "text-text-primary"
                  )}
                  title={frame.functionName}
                >
                  {frame.functionName}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] truncate",
                    frame.isVendor
                      ? "text-text-muted/40"
                      : "text-text-muted"
                  )}
                  title={`${frame.filePath}${frame.lineNumber ? `:${frame.lineNumber}` : ""}${frame.columnNumber ? `:${frame.columnNumber}` : ""}`}
                >
                  {shortenFilePath(frame.filePath)}
                  {frame.lineNumber !== null && (
                    <span>
                      :{frame.lineNumber}
                      {frame.columnNumber !== null && `:${frame.columnNumber}`}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vendor frames toggle */}
      {vendorFrameCount > 0 && (
        <button
          onClick={() => setShowVendorFrames(!showVendorFrames)}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-text-muted hover:text-text-secondary hover:bg-bg-surface/50 transition-colors border-t border-border-faint"
        >
          {showVendorFrames ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          <span>
            {showVendorFrames ? "Hide" : "Show"} {vendorFrameCount} vendor frame
            {vendorFrameCount !== 1 ? "s" : ""}
          </span>
        </button>
      )}

      {/* Empty state */}
      {frames.length === 0 && (
        <div className="px-4 py-6">
          <pre className="font-mono text-xs text-text-muted whitespace-pre-wrap break-all">
            {stackTrace}
          </pre>
        </div>
      )}
    </div>
  );
}
