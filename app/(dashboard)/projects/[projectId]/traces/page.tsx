"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTraces } from "@/hooks/trace.hook";
import { TraceList } from "@/components/dashboard/traces/TraceList";

export default function TracesPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  const [timeRange, setTimeRange] = useState("24h");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minDuration, setMinDuration] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 25;

  const buildParams = useCallback((): Record<string, string> => {
    const p: Record<string, string> = {
      timeRange,
      page: String(page),
      limit: String(limit),
    };
    if (statusFilter !== "all") p.status = statusFilter;
    if (minDuration) p.minDuration = minDuration;
    if (serviceFilter !== "all") p.service = serviceFilter;
    return p;
  }, [timeRange, statusFilter, minDuration, serviceFilter, page]);

  const {
    data: tracesResponse,
    isLoading,
    error,
  } = useTraces(projectId, buildParams());

  const traces = tracesResponse?.data || [];
  const meta = tracesResponse?.meta;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-signal" />
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Distributed Traces
            </h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36 bg-bg-surface border-border-subtle">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="6h">Last 6 hours</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 bg-bg-surface border-border-subtle">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ok">OK</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min duration (ms)"
          value={minDuration}
          onChange={(e) => setMinDuration(e.target.value)}
          className="w-40 bg-bg-surface border-border-subtle"
        />

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-36 bg-bg-surface border-border-subtle">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
          <h3 className="text-lg font-display font-semibold text-status-danger">
            Failed to load traces
          </h3>
          <p className="text-text-secondary mt-2">
            An error occurred while fetching traces. Please try again.
          </p>
        </div>
      ) : (
        <TraceList traces={traces} projectId={projectId} />
      )}

      {/* Pagination */}
      {meta && meta.total > limit && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, meta.total)} of {meta.total} traces
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-text-secondary font-mono">
              {page} / {Math.ceil(meta.total / limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= meta.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
