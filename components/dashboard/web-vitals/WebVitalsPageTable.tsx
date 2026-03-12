"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SignalDot } from "@/components/shared/SignalDot";
import { ArrowUpDown } from "lucide-react";

interface PageVital {
  name: string;
  avgValue: number;
  count: number;
}

interface PageData {
  url: string;
  vitals: PageVital[];
  totalSamples: number;
}

interface WebVitalsPageTableProps {
  data: PageData[];
}

// Google thresholds
const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
};

type SortKey = "url" | "LCP" | "CLS" | "INP" | "samples";
type SortDir = "asc" | "desc";

function getVitalValue(vitals: PageVital[], name: string): number | null {
  const vital = vitals.find((v) => v.name === name);
  return vital ? vital.avgValue : null;
}

function getVitalRating(
  name: string,
  value: number
): "ok" | "warn" | "danger" {
  const threshold = THRESHOLDS[name];
  if (!threshold) return "warn";
  if (value < threshold.good) return "ok";
  if (value < threshold.poor) return "warn";
  return "danger";
}

function formatVitalValue(name: string, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)}`;
}

function getUnit(name: string): string {
  if (name === "CLS") return "";
  return "ms";
}

export function WebVitalsPageTable({ data }: WebVitalsPageTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("samples");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedData = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortKey) {
        case "url":
          aVal = a.url;
          bVal = b.url;
          return sortDir === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        case "LCP":
        case "CLS":
        case "INP":
          aVal = getVitalValue(a.vitals, sortKey) ?? Infinity;
          bVal = getVitalValue(b.vitals, sortKey) ?? Infinity;
          break;
        case "samples":
        default:
          aVal = a.totalSamples;
          bVal = b.totalSamples;
          break;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  if (data.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
        <p className="text-text-muted text-sm text-center py-8">
          No per-page data available.
        </p>
      </div>
    );
  }

  const vitals: SortKey[] = ["LCP", "CLS", "INP"];

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="font-display font-semibold text-text-primary">
          Per-Page Breakdown
        </h3>
        <p className="text-sm text-text-muted mt-0.5">
          Web vitals performance by page URL
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("url")}
                  className="flex items-center gap-1 text-text-muted text-xs uppercase tracking-wider font-display hover:text-text-primary transition-colors"
                >
                  Page URL
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              {vitals.map((vital) => (
                <th key={vital} className="text-right px-6 py-3">
                  <button
                    onClick={() => handleSort(vital)}
                    className="flex items-center gap-1 ml-auto text-text-muted text-xs uppercase tracking-wider font-display hover:text-text-primary transition-colors"
                  >
                    {vital}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              ))}
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort("samples")}
                  className="flex items-center gap-1 ml-auto text-text-muted text-xs uppercase tracking-wider font-display hover:text-text-primary transition-colors"
                >
                  Samples
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((page, index) => (
              <tr
                key={page.url}
                className={cn(
                  "border-b border-border-subtle last:border-b-0 hover:bg-bg-elevated/30 transition-colors",
                  index % 2 === 1 && "bg-bg-elevated/50"
                )}
              >
                <td className="px-6 py-3">
                  <span
                    className="font-mono text-xs text-text-secondary block max-w-[300px] truncate"
                    title={page.url}
                  >
                    {page.url || "(no URL)"}
                  </span>
                </td>
                {vitals.map((vitalName) => {
                  const value = getVitalValue(page.vitals, vitalName);
                  if (value === null) {
                    return (
                      <td
                        key={vitalName}
                        className="text-right px-6 py-3 text-text-muted text-xs"
                      >
                        --
                      </td>
                    );
                  }
                  const rating = getVitalRating(vitalName, value);
                  const unit = getUnit(vitalName);
                  return (
                    <td key={vitalName} className="text-right px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-xs text-text-primary">
                          {formatVitalValue(vitalName, value)}
                          {unit}
                        </span>
                        <SignalDot status={rating} size="sm" pulse={false} />
                      </div>
                    </td>
                  );
                })}
                <td className="text-right px-6 py-3 font-mono text-xs text-text-muted">
                  {page.totalSamples.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
