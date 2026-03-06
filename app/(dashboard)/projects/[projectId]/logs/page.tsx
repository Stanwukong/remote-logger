"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useLogHiveStore } from "@/store/loghive-store";
import { useLogs, useDistinctValues } from "@/hooks/log.hooks";
import { useWebsocket } from "@/hooks/useWebsocket";
import { logService } from "@/services/log.service";
import { LogEntry, LogFilters as ApiLogFilters } from "@/types/analytics";

// Existing components
import { LogExplorerSplitPane } from "@/components/logs/enhanced/LogExplorerSplitPane";
import { EnhancedLogListItem } from "@/components/logs/enhanced/EnhancedLogListItem";
import { EnhancedLogDetailPanel } from "@/components/logs/enhanced/EnhancedLogDetailPanel";
import {
  ObservatoryFilterBar,
  LogFilters,
} from "@/components/logs/enhanced/ObservatoryFilterBar";

// Shared components
import { PageHeader } from "@/components/shared/PageHeader";
import {
  StructuredQueryInput,
  parseStructuredQuery,
} from "@/components/shared/StructuredQueryInput";
import { SavedSearchSelector } from "@/components/shared/SavedSearchSelector";

// UI
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Download, Loader2, Activity } from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Time range mapping (store TimeRange -> hours)
// ---------------------------------------------------------------------------

const TIME_RANGE_HOURS: Record<string, number> = {
  "1h": 1,
  "6h": 6,
  "24h": 24,
  "7d": 168,
  "30d": 720,
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ProjectLogsPage() {
  // 1. Get projectId from URL
  const params = useParams();
  const projectId = params.projectId as string;

  // 2. Get global state from Zustand
  const selectedTimeRange = useLogHiveStore((s) => s.selectedTimeRange);
  const selectedEnvironment = useLogHiveStore((s) => s.selectedEnvironment);

  // 3. Local filter state
  const [filters, setFilters] = useState<LogFilters>({
    search: "",
    levels: [],
    services: [],
    environments: [],
    eventTypes: [],
    release: "",
  });

  const [structuredQuery, setStructuredQuery] = useState("");
  const [selectedLogIndex, setSelectedLogIndex] = useState<number>(-1);
  const [isLiveTail, setIsLiveTail] = useState(false);

  const listContainerRef = useRef<HTMLDivElement>(null);

  // 4. Fetch distinct values for the filter bar
  const { data: distinctServices } = useDistinctValues(projectId, "service");
  const { data: distinctEnvironments } = useDistinctValues(
    projectId,
    "environment"
  );

  const availableServices = useMemo(
    () => distinctServices ?? [],
    [distinctServices]
  );
  const availableEnvironments = useMemo(
    () => distinctEnvironments ?? [],
    [distinctEnvironments]
  );

  // 5. Build API filters (merge structured query + filter bar + global time/env)
  const apiFilters: ApiLogFilters = useMemo(() => {
    const parsed = parseStructuredQuery(structuredQuery);

    const hours = TIME_RANGE_HOURS[selectedTimeRange] || 24;

    // Structured query wins over filter bar; filter bar is the fallback.
    const levels =
      parsed.levels && parsed.levels.length > 0
        ? (parsed.levels as LogEntry["level"][])
        : filters.levels.length > 0
          ? (filters.levels as LogEntry["level"][])
          : undefined;

    const services =
      parsed.services && parsed.services.length > 0
        ? parsed.services
        : filters.services.length > 0
          ? filters.services
          : undefined;

    // Global environment selector overrides everything when not "all"
    const environments =
      selectedEnvironment !== "all"
        ? [selectedEnvironment]
        : parsed.environments && parsed.environments.length > 0
          ? parsed.environments
          : filters.environments.length > 0
            ? filters.environments
            : undefined;

    const eventTypes =
      parsed.eventTypes && parsed.eventTypes.length > 0
        ? parsed.eventTypes
        : filters.eventTypes.length > 0
          ? filters.eventTypes
          : undefined;

    const search = parsed.search || filters.search || undefined;
    const release = filters.release || undefined;

    return {
      levels,
      services,
      search,
      release,
      startDate: new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
      limit: 500,
      ...(environments ? { environments } : {}),
      ...(eventTypes ? { eventTypes } : {}),
    } as ApiLogFilters;
  }, [structuredQuery, filters, selectedTimeRange, selectedEnvironment]);

  // 6. Fetch logs
  const { data: logsData, isLoading, refetch } = useLogs(projectId, apiFilters);
  const logs = useMemo(() => logsData?.logs ?? [], [logsData]);

  // 7. Live tail via WebSocket
  const { lastMessage } = useWebsocket();

  useEffect(() => {
    if (!isLiveTail || !lastMessage) return;
    try {
      const msg = lastMessage.data;
      if (msg?.type === "new_log" && msg?.projectId === projectId) {
        refetch();
      }
    } catch {
      // Silently ignore parse errors
    }
  }, [isLiveTail, lastMessage, projectId, refetch]);

  // Auto-refresh every 3s in live tail mode
  useEffect(() => {
    if (!isLiveTail) return;
    const interval = setInterval(() => refetch(), 3000);
    return () => clearInterval(interval);
  }, [isLiveTail, refetch]);

  // 8. Keyboard navigation (j/k, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "j":
          e.preventDefault();
          setSelectedLogIndex((prev) => Math.min(prev + 1, logs.length - 1));
          break;
        case "k":
          e.preventDefault();
          setSelectedLogIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          break;
        case "Escape":
          e.preventDefault();
          setSelectedLogIndex(-1);
          break;
        case "r":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            refetch();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logs.length, refetch]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedLogIndex >= 0 && listContainerRef.current) {
      const selectedElement = listContainerRef.current.querySelector(
        `[data-log-index="${selectedLogIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedLogIndex]);

  // 9. Handlers
  const handleLogSelect = useCallback(
    (log: LogEntry) => {
      const index = logs.findIndex((l) => l._id === log._id);
      setSelectedLogIndex(index);
    },
    [logs]
  );

  const handleExport = useCallback(
    async (format: "csv" | "json") => {
      if (!projectId) {
        toast.error("No project selected");
        return;
      }

      const loadingToast = toast.loading(
        `Exporting logs as ${format.toUpperCase()}...`
      );

      try {
        await logService.exportLogs(projectId, format, apiFilters);
        toast.success(
          `Logs exported successfully as ${format.toUpperCase()}`,
          { id: loadingToast }
        );
      } catch (error) {
        console.error("Export failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to export logs",
          { id: loadingToast }
        );
      }
    },
    [projectId, apiFilters]
  );

  // 10. Load saved search handler
  const handleLoadSearch = useCallback(
    (savedFilters: {
      search?: string;
      levels?: string[];
      services?: string[];
      environments?: string[];
      eventTypes?: string[];
      timeRange?: string;
    }) => {
      // If the saved search has a search string, put it in the structured query
      if (savedFilters.search) {
        setStructuredQuery(savedFilters.search);
      } else {
        setStructuredQuery("");
      }

      setFilters({
        search: "",
        levels: savedFilters.levels || [],
        services: savedFilters.services || [],
        environments: savedFilters.environments || [],
        eventTypes: savedFilters.eventTypes || [],
        timeRange: (savedFilters.timeRange as LogFilters["timeRange"]) || undefined,
        release: "",
      });

      // Reset selection when loading a new search
      setSelectedLogIndex(-1);
    },
    []
  );

  // Build currentFilters shape for SavedSearchSelector
  const currentFiltersForSave = useMemo(
    () => ({
      search: structuredQuery || filters.search || undefined,
      levels: filters.levels.length > 0 ? filters.levels : undefined,
      services: filters.services.length > 0 ? filters.services : undefined,
      environments:
        filters.environments.length > 0 ? filters.environments : undefined,
      eventTypes:
        filters.eventTypes.length > 0 ? filters.eventTypes : undefined,
      timeRange: selectedTimeRange,
    }),
    [structuredQuery, filters, selectedTimeRange]
  );

  const selectedLog = selectedLogIndex >= 0 ? logs[selectedLogIndex] : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-bg-base">
      {/* Page Header */}
      <div className="border-b border-border-subtle px-6 pt-4 pb-3">
        <PageHeader
          title="Log Explorer"
          description="Real-time log monitoring and analysis"
          className="pb-0"
          actions={
            <>
              <SavedSearchSelector
                projectId={projectId}
                currentFilters={currentFiltersForSave}
                onLoadSearch={handleLoadSearch}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border-faint"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="border-border-faint"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
            </>
          }
        />
      </div>

      {/* Observatory Filter Bar */}
      <div className="px-6 py-3 border-b border-border-subtle">
        <ObservatoryFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          availableServices={availableServices}
          availableEnvironments={availableEnvironments}
          isLiveTail={isLiveTail}
          onToggleLiveTail={() => setIsLiveTail(!isLiveTail)}
        />
      </div>

      {/* Results Summary Strip */}
      <div className="px-6 py-2 bg-bg-elevated border-b border-border-faint">
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-muted">
            {isLoading && logs.length === 0 ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-signal" />
                Loading logs...
              </span>
            ) : logs.length > 0 ? (
              <>
                Showing{" "}
                <span className="text-signal font-semibold">{logs.length}</span>{" "}
                log{logs.length !== 1 ? "s" : ""}
                {(structuredQuery || filters.search) && (
                  <span className="ml-1">
                    matching{" "}
                    <span className="text-text-primary font-mono">
                      &quot;{structuredQuery || filters.search}&quot;
                    </span>
                  </span>
                )}
                {isLiveTail && (
                  <span className="ml-2 inline-flex items-center gap-1 text-signal">
                    <Activity className="w-3 h-3 animate-pulse" />
                    Live
                  </span>
                )}
              </>
            ) : (
              <span>No logs found</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
            <span>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">
                j
              </kbd>
              /
              <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">
                k
              </kbd>{" "}
              to navigate
            </span>
            <span>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">
                Esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>

      {/* Split Pane with Log List and Detail Panel */}
      <div className="flex-1 overflow-hidden">
        <LogExplorerSplitPane
          leftPanel={
            <div ref={listContainerRef} className="h-full overflow-y-auto">
              {isLoading && logs.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-signal" />
                    <p className="text-sm text-text-muted">Loading logs...</p>
                  </div>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-text-muted">No logs found</p>
                    <p className="text-xs text-text-muted/60">
                      Try adjusting your filters or time range
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border-faint">
                  {logs.map((log: LogEntry, index: number) => (
                    <div key={log._id} data-log-index={index}>
                      <EnhancedLogListItem
                        log={log}
                        isSelected={index === selectedLogIndex}
                        onSelect={handleLogSelect}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
          rightPanel={
            <EnhancedLogDetailPanel
              log={selectedLog}
              onClose={() => setSelectedLogIndex(-1)}
            />
          }
        />
      </div>
    </div>
  );
}
