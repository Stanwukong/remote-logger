"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useProjects } from "@/hooks/project.hooks";
import { useLogs, useDistinctValues } from "@/hooks/log.hooks";
import { LogEntry } from "@/types/analytics";
import { LogExplorerSplitPane } from "./LogExplorerSplitPane";
import { EnhancedLogListItem } from "./EnhancedLogListItem";
import { EnhancedLogDetailPanel } from "./EnhancedLogDetailPanel";
import {
  ObservatoryFilterBar,
  LogFilters as FilterBarFilters,
} from "./ObservatoryFilterBar";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RefreshCw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { logService } from "@/services/log.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function EnhancedLogExplorer() {
  const searchParams = useSearchParams();
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Project selection
  const { data: projectsResponse } = useProjects();
  const projects = useMemo(() => projectsResponse?.data ?? [], [projectsResponse?.data]);

  const paramProjectId = searchParams.get("projectId") || "";
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (paramProjectId) {
      setSelectedProjectId(paramProjectId);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [paramProjectId, projects, selectedProjectId]);

  // Filters
  const [filters, setFilters] = useState<FilterBarFilters>({
    search: "",
    levels: [],
    services: [],
    environments: [],
    eventTypes: [],
    timeRange: "24h",
    release: "",
  });

  // Live tail mode
  const [isLiveTail, setIsLiveTail] = useState(false);

  // Selected log for detail panel
  const [selectedLogIndex, setSelectedLogIndex] = useState<number>(-1);

  // Fetch available filter values
  const { data: distinctServices } = useDistinctValues(selectedProjectId, "service");
  const { data: distinctEnvironments } = useDistinctValues(selectedProjectId, "environment");

  const availableServices = useMemo(() => distinctServices ?? [], [distinctServices]);
  const availableEnvironments = useMemo(() => distinctEnvironments ?? [], [distinctEnvironments]);

  // Build API filters
  const apiFilters = useMemo(() => {
    const timeRangeMap = {
      "1h": new Date(Date.now() - 60 * 60 * 1000),
      "24h": new Date(Date.now() - 24 * 60 * 60 * 1000),
      "7d": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };

    return {
      levels: filters.levels.length > 0 ? filters.levels as LogEntry['level'][] : undefined,
      services: filters.services.length > 0 ? filters.services : undefined,
      environments: filters.environments.length > 0 ? filters.environments : undefined,
      eventTypes: filters.eventTypes.length > 0 ? filters.eventTypes : undefined,
      search: filters.search || undefined,
      release: filters.release || undefined,
      startDate: filters.timeRange && filters.timeRange !== "custom"
        ? timeRangeMap[filters.timeRange].toISOString()
        : undefined,
      limit: 500,
    };
  }, [filters]);

  // Fetch logs
  const {
    data: logsData,
    isLoading,
    refetch,
  } = useLogs(selectedProjectId, apiFilters);

  const logs = useMemo(() => logsData?.logs ?? [], [logsData]);

  // Auto-refresh for live tail
  useEffect(() => {
    if (!isLiveTail) return;

    const interval = setInterval(() => {
      refetch();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [isLiveTail, refetch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "j":
          // Navigate down
          e.preventDefault();
          setSelectedLogIndex((prev) => Math.min(prev + 1, logs.length - 1));
          break;
        case "k":
          // Navigate up
          e.preventDefault();
          setSelectedLogIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          // Already shows detail panel when selected
          e.preventDefault();
          break;
        case "Escape":
          // Clear selection
          e.preventDefault();
          setSelectedLogIndex(-1);
          break;
        case "r":
          // Refresh
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

  const handleLogSelect = useCallback((log: LogEntry) => {
    const index = logs.findIndex((l) => l._id === log._id);
    setSelectedLogIndex(index);
  }, [logs]);

  const handleExport = useCallback(async (format: "csv" | "json") => {
    if (!selectedProjectId) {
      toast.error("No project selected");
      return;
    }

    const loadingToast = toast.loading(`Exporting logs as ${format.toUpperCase()}...`);

    try {
      await logService.exportLogs(selectedProjectId, format, apiFilters);
      toast.success(`Logs exported successfully as ${format.toUpperCase()}`, {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to export logs", {
        id: loadingToast,
      });
    }
  }, [selectedProjectId, apiFilters]);

  const handleSaveSearch = useCallback(() => {
    // TODO: Implement save search functionality
    toast.info("Save search functionality coming soon!");
  }, []);

  const selectedLog = selectedLogIndex >= 0 ? logs[selectedLogIndex] : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-bg-base">
      {/* Header */}
      <div className="border-b border-border-subtle px-6 py-4">
        <div className="flex items-center justify-between">
          <SectionHeading
            headline="Log Explorer"
            sub="Real-time log monitoring and analysis"
            align="left"
          />
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 border-b border-border-subtle bg-bg-surface">
        <ObservatoryFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onSaveSearch={handleSaveSearch}
          availableServices={availableServices}
          availableEnvironments={availableEnvironments}
          isLiveTail={isLiveTail}
          onToggleLiveTail={() => setIsLiveTail(!isLiveTail)}
        />
      </div>

      {/* Results Summary */}
      <div className="px-6 py-2 bg-bg-elevated border-b border-border-faint">
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-muted">
            {logs.length > 0 ? (
              <>
                Showing <span className="text-signal font-semibold">{logs.length}</span> log{logs.length !== 1 ? "s" : ""}
                {filters.search && (
                  <span className="ml-1">matching <span className="text-text-primary font-mono">"{filters.search}"</span></span>
                )}
              </>
            ) : (
              <span>No logs found</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="font-mono">Press <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">j</kbd>/<kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">k</kbd> to navigate</span>
            <span className="font-mono">Press <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">Esc</kbd> to close</span>
          </div>
        </div>
      </div>

      {/* Split Pane with Log List and Detail */}
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
                  {logs.map((log, index) => (
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
