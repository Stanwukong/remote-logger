"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Activity, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VitalCard } from "@/components/dashboard/web-vitals/VitalCard";
import { WebVitalsChart } from "@/components/dashboard/web-vitals/WebVitalsChart";
import { WebVitalsPageTable } from "@/components/dashboard/web-vitals/WebVitalsPageTable";
import { RatingDistribution } from "@/components/dashboard/web-vitals/RatingDistribution";
import {
  useWebVitals,
  useWebVitalsHistory,
  useWebVitalsByPage,
} from "@/hooks/webVitals.hook";
import type { WebVitalMetric } from "@/services/webVitals.service";

const TIME_RANGES = [
  { value: "1h", label: "Last 1 hour" },
  { value: "6h", label: "Last 6 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const VITALS = ["LCP", "CLS", "INP"] as const;

// Map time range to appropriate chart interval
function getInterval(timeRange: string): string {
  switch (timeRange) {
    case "1h":
    case "6h":
      return "hour";
    case "24h":
      return "hour";
    case "7d":
      return "day";
    case "30d":
      return "day";
    default:
      return "hour";
  }
}

// Google thresholds reference data
const THRESHOLD_INFO = [
  { vital: "LCP", good: "< 2.5s", needsWork: "2.5s - 4.0s", poor: "> 4.0s" },
  { vital: "CLS", good: "< 0.1", needsWork: "0.1 - 0.25", poor: "> 0.25" },
  {
    vital: "INP",
    good: "< 200ms",
    needsWork: "200ms - 500ms",
    poor: "> 500ms",
  },
];

export default function WebVitalsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  const [timeRange, setTimeRange] = useState("24h");
  const [selectedVital, setSelectedVital] = useState<string>("LCP");

  const interval = getInterval(timeRange);

  const {
    data: vitalsResponse,
    isLoading: vitalsLoading,
  } = useWebVitals(projectId, timeRange);

  const {
    data: historyResponse,
    isLoading: historyLoading,
  } = useWebVitalsHistory(projectId, timeRange, interval);

  const {
    data: pagesResponse,
    isLoading: pagesLoading,
  } = useWebVitalsByPage(projectId, timeRange);

  const vitals: WebVitalMetric[] = vitalsResponse?.data ?? [];
  const historyData = historyResponse?.data ?? [];
  const pagesData = pagesResponse?.data ?? [];

  // Find a specific vital from the data
  const getVital = (name: string): WebVitalMetric | undefined =>
    vitals.find((v) => v.name === name);

  const selectedVitalData = getVital(selectedVital);
  const isLoading = vitalsLoading;
  const hasData = vitals.length > 0;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-signal" />
              <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
                Web Vitals
              </h1>
            </div>
            <p className="text-sm text-text-muted mt-0.5">
              Core Web Vitals performance metrics from real user monitoring
            </p>
          </div>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasData && (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
          <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            No web vitals data yet
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            Configure the SDK to capture performance metrics. Web vitals will
            appear here once your application starts reporting LCP, CLS, and INP
            measurements.
          </p>
        </div>
      )}

      {/* Data loaded */}
      {!isLoading && hasData && (
        <>
          {/* Vital Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VITALS.map((vitalName) => {
              const vital = getVital(vitalName);
              if (!vital) return null;
              return (
                <VitalCard
                  key={vitalName}
                  name={vital.name}
                  p50={vital.p50}
                  p75={vital.p75}
                  p95={vital.p95}
                  count={vital.count}
                  goodCount={vital.goodCount}
                  needsImprovementCount={vital.needsImprovementCount}
                  poorCount={vital.poorCount}
                />
              );
            })}
          </div>

          {/* Vital Selector Tabs */}
          <div className="flex items-center gap-2">
            {VITALS.map((vitalName) => (
              <button
                key={vitalName}
                onClick={() => setSelectedVital(vitalName)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedVital === vitalName
                    ? "bg-signal/15 text-signal border border-signal/30"
                    : "bg-bg-surface text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-bg-elevated/50"
                }`}
              >
                {vitalName}
              </button>
            ))}
            <button
              onClick={() => setSelectedVital("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedVital === "ALL"
                  ? "bg-signal/15 text-signal border border-signal/30"
                  : "bg-bg-surface text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-bg-elevated/50"
              }`}
            >
              All
            </button>
          </div>

          {/* History Chart + Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {historyLoading ? (
                <Skeleton className="h-80 rounded-lg" />
              ) : selectedVital === "ALL" ? (
                <div className="space-y-6">
                  {VITALS.map((vitalName) => (
                    <WebVitalsChart
                      key={vitalName}
                      data={historyData}
                      selectedVital={vitalName}
                    />
                  ))}
                </div>
              ) : (
                <WebVitalsChart
                  data={historyData}
                  selectedVital={selectedVital}
                />
              )}
            </div>

            <div>
              {selectedVitalData && selectedVital !== "ALL" ? (
                <RatingDistribution
                  goodCount={selectedVitalData.goodCount}
                  needsImprovementCount={
                    selectedVitalData.needsImprovementCount
                  }
                  poorCount={selectedVitalData.poorCount}
                  vitalName={selectedVital}
                />
              ) : selectedVital === "ALL" ? (
                <div className="space-y-6">
                  {VITALS.map((vitalName) => {
                    const vital = getVital(vitalName);
                    if (!vital) return null;
                    return (
                      <RatingDistribution
                        key={vitalName}
                        goodCount={vital.goodCount}
                        needsImprovementCount={vital.needsImprovementCount}
                        poorCount={vital.poorCount}
                        vitalName={vitalName}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {/* Per-Page Table */}
          {pagesLoading ? (
            <Skeleton className="h-64 rounded-lg" />
          ) : (
            <WebVitalsPageTable data={pagesData} />
          )}

          {/* Google Thresholds Reference */}
          <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-data-info" />
              <h3 className="font-display font-semibold text-text-primary text-sm">
                Google Core Web Vitals Thresholds
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {THRESHOLD_INFO.map((info) => (
                <div key={info.vital} className="space-y-2">
                  <p className="font-mono text-xs font-medium text-text-primary">
                    {info.vital}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-signal" />
                      <span className="text-text-muted">Good:</span>
                      <span className="text-text-secondary font-mono">
                        {info.good}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-status-warn" />
                      <span className="text-text-muted">Needs Work:</span>
                      <span className="text-text-secondary font-mono">
                        {info.needsWork}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-status-danger" />
                      <span className="text-text-muted">Poor:</span>
                      <span className="text-text-secondary font-mono">
                        {info.poor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
