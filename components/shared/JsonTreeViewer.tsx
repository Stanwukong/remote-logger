"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";

interface JsonTreeViewerProps {
  data: unknown;
  initialExpanded?: boolean;
  maxDepth?: number;
  className?: string;
  label?: string;
}

type JsonValueType = "string" | "number" | "boolean" | "null" | "object" | "array" | "undefined";

function getValueType(value: unknown): JsonValueType {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

const typeColors: Record<JsonValueType, string> = {
  string: "text-status-ok",
  number: "text-data-info",
  boolean: "text-data-purple",
  null: "text-text-muted italic",
  undefined: "text-text-muted italic",
  object: "text-text-muted",
  array: "text-text-muted",
};

function formatValue(value: unknown, type: JsonValueType): string {
  switch (type) {
    case "string":
      return `"${value}"`;
    case "null":
      return "null";
    case "undefined":
      return "undefined";
    case "boolean":
      return String(value);
    case "number":
      return String(value);
    default:
      return String(value);
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    },
    [text]
  );

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover/value:opacity-100 ml-1.5 p-0.5 text-text-muted/50 hover:text-text-secondary transition-all duration-150"
      aria-label={copied ? "Copied" : "Copy value"}
    >
      {copied ? (
        <Check className="w-3 h-3 text-signal" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

interface JsonNodeProps {
  keyName?: string;
  value: unknown;
  depth: number;
  maxDepth: number;
  defaultExpanded: boolean;
  isLast: boolean;
}

function JsonNode({
  keyName,
  value,
  depth,
  maxDepth,
  defaultExpanded,
  isLast,
}: JsonNodeProps) {
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const [expanded, setExpanded] = useState(
    defaultExpanded && depth < 1
  );

  const toggleExpanded = useCallback(() => {
    if (depth < maxDepth) {
      setExpanded((prev) => !prev);
    }
  }, [depth, maxDepth]);

  const indent = depth * 16;
  const comma = isLast ? "" : ",";

  // Primitive values
  if (!isExpandable) {
    const displayValue = formatValue(value, type);
    const copyText = type === "string" ? String(value) : displayValue;

    return (
      <div
        className="group/value flex items-center min-h-[22px]"
        style={{ paddingLeft: `${indent}px` }}
      >
        {keyName !== undefined && (
          <>
            <span className="text-text-secondary">{`"${keyName}"`}</span>
            <span className="text-text-muted mr-1">:</span>
          </>
        )}
        <span className={cn("whitespace-pre-wrap break-all", typeColors[type])}>
          {displayValue}
        </span>
        <span className="text-text-muted">{comma}</span>
        <CopyButton text={copyText} />
      </div>
    );
  }

  // Object or Array
  const entries =
    type === "array"
      ? (value as unknown[]).map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>);

  const itemCount = entries.length;
  const preview =
    type === "array" ? `[${itemCount} item${itemCount !== 1 ? "s" : ""}]` : `{...}`;
  const openBracket = type === "array" ? "[" : "{";
  const closeBracket = type === "array" ? "]" : "}";

  // At max depth, show collapsed preview
  if (depth >= maxDepth) {
    return (
      <div
        className="group/value flex items-center min-h-[22px]"
        style={{ paddingLeft: `${indent}px` }}
      >
        {keyName !== undefined && (
          <>
            <span className="text-text-secondary">{`"${keyName}"`}</span>
            <span className="text-text-muted mr-1">:</span>
          </>
        )}
        <span className="text-text-muted">{preview}</span>
        <span className="text-text-muted">{comma}</span>
        <CopyButton text={JSON.stringify(value, null, 2)} />
      </div>
    );
  }

  if (!expanded) {
    return (
      <div
        className="group/value flex items-center min-h-[22px] cursor-pointer hover:bg-bg-surface/50 rounded-sm transition-colors"
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpanded}
      >
        <ChevronRight className="w-3 h-3 text-text-muted/60 mr-1 shrink-0" />
        {keyName !== undefined && (
          <>
            <span className="text-text-secondary">{`"${keyName}"`}</span>
            <span className="text-text-muted mr-1">:</span>
          </>
        )}
        <span className="text-text-muted">
          {openBracket}
          <span className="text-text-muted/60 mx-0.5">{preview}</span>
          {closeBracket}
        </span>
        <span className="text-text-muted">{comma}</span>
        <CopyButton text={JSON.stringify(value, null, 2)} />
      </div>
    );
  }

  return (
    <div>
      {/* Opening line */}
      <div
        className="flex items-center min-h-[22px] cursor-pointer hover:bg-bg-surface/50 rounded-sm transition-colors"
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpanded}
      >
        <ChevronDown className="w-3 h-3 text-text-muted/60 mr-1 shrink-0" />
        {keyName !== undefined && (
          <>
            <span className="text-text-secondary">{`"${keyName}"`}</span>
            <span className="text-text-muted mr-1">:</span>
          </>
        )}
        <span className="text-text-muted">{openBracket}</span>
      </div>

      {/* Children */}
      {entries.map(([childKey, childValue], idx) => (
        <JsonNode
          key={childKey}
          keyName={type === "object" ? childKey : undefined}
          value={childValue}
          depth={depth + 1}
          maxDepth={maxDepth}
          defaultExpanded={defaultExpanded}
          isLast={idx === entries.length - 1}
        />
      ))}

      {/* Closing bracket */}
      <div
        className="flex items-center min-h-[22px]"
        style={{ paddingLeft: `${indent}px` }}
      >
        <span className="text-text-muted ml-4">
          {closeBracket}
        </span>
        <span className="text-text-muted">{comma}</span>
      </div>
    </div>
  );
}

export function JsonTreeViewer({
  data,
  initialExpanded = true,
  maxDepth = 10,
  className,
  label,
}: JsonTreeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = useCallback(() => {
    let text: string;
    try {
      text = JSON.stringify(data, null, 2);
    } catch {
      text = String(data);
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  // Handle non-JSON data gracefully
  if (data === undefined || data === null) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border-faint bg-bg-base p-4 font-mono text-xs",
          className
        )}
      >
        <span className="text-text-muted italic">
          {data === null ? "null" : "undefined"}
        </span>
      </div>
    );
  }

  const isPrimitive =
    typeof data !== "object" || data === null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border-faint bg-bg-base overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-faint">
        <span className="text-xs font-mono text-text-muted">
          {label || (Array.isArray(data) ? "Array" : typeof data === "object" ? "Object" : "Value")}
        </span>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
          aria-label={copied ? "Copied" : "Copy JSON"}
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

      {/* Tree content */}
      <div className="p-3 font-mono text-xs overflow-x-auto">
        {isPrimitive ? (
          <div className="group/value flex items-center">
            <span
              className={cn(
                "whitespace-pre-wrap break-all",
                typeColors[getValueType(data)]
              )}
            >
              {formatValue(data, getValueType(data))}
            </span>
            <CopyButton text={String(data)} />
          </div>
        ) : (
          <JsonNode
            value={data}
            depth={0}
            maxDepth={maxDepth}
            defaultExpanded={initialExpanded}
            isLast={true}
          />
        )}
      </div>
    </div>
  );
}
