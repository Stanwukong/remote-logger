"use client";

import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AIResponseCardProps {
  content: string;
  source: "ai" | "heuristic";
  confidence?: "high" | "medium" | "low";
  title?: string;
  timestamp?: string;
  dataCount?: number;
}

export function AIResponseCard({
  content,
  source,
  confidence,
  title = "AI Analysis",
  timestamp,
  dataCount,
}: AIResponseCardProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const confidenceVariant = confidence === "high"
    ? "status-ok"
    : confidence === "medium"
    ? "status-warn"
    : confidence === "low"
    ? "status-danger"
    : undefined;

  return (
    <div className="bg-bg-surface border border-border-faint rounded-xl p-4 border-l-[3px] border-l-signal">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-signal" />
        <span className="bg-signal/10 text-signal text-[11px] rounded px-2 py-0.5 font-medium">
          {source === "ai" ? "AI" : "Statistical"}
        </span>
        {title && (
          <span className="text-sm font-medium text-text-primary">{title}</span>
        )}
        {confidence && confidenceVariant && (
          <Badge variant={confidenceVariant} className="text-[10px] ml-auto">
            {confidence} confidence
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      {/* Source attribution */}
      {(dataCount || timestamp) && (
        <p className="text-xs text-text-muted italic mt-3">
          {dataCount && `Based on ${dataCount.toLocaleString()} events`}
          {dataCount && timestamp && " \u00B7 "}
          {timestamp && `${timestamp}`}
        </p>
      )}

      {/* Feedback row */}
      <div className="flex items-center gap-2 border-t border-border-faint pt-3 mt-3">
        <span className="text-xs text-text-muted mr-1">Helpful?</span>
        <button
          onClick={() => setFeedback(feedback === "up" ? null : "up")}
          className={`p-1 rounded transition-colors ${
            feedback === "up"
              ? "text-signal bg-signal/10"
              : "text-text-muted hover:text-signal"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setFeedback(feedback === "down" ? null : "down")}
          className={`p-1 rounded transition-colors ${
            feedback === "down"
              ? "text-status-danger bg-status-danger/10"
              : "text-text-muted hover:text-status-danger"
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
