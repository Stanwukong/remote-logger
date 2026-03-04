"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AlertStatsCards } from "./AlertStatsCards";
import { AlertFilterBar, AlertFilters } from "./AlertFilterBar";
import { AlertTabFilters } from "./AlertTabFilters";
import { EnhancedAlertListItem } from "./EnhancedAlertListItem";
import { AlertBulkActionBar } from "./AlertBulkActionBar";
import { AlertDetailPanel } from "./AlertDetailPanel";
import { AlertsNavigation } from "../AlertsNavigation";
import { LogExplorerSplitPane } from "@/components/logs/enhanced/LogExplorerSplitPane";
import { useAlerts, useAlertRules } from "@/hooks/alerts.hook";
import { useProjects } from "@/hooks/project.hooks";
import { Alert } from "@/services/alert.service";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeading } from "@/components/shared/SectionHeading";

type AlertStatus = "all" | "active" | "acknowledged" | "resolved" | "snoozed";

export function EnhancedAlertsPage() {
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Project selection
  const { data: projectsResponse } = useProjects();
  const projects = useMemo(
    () => (projectsResponse as any)?.data ?? [],
    [projectsResponse]
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // Tab filter
  const [selectedTab, setSelectedTab] = useState<AlertStatus>("all");

  // Selection
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [selectedAlertIndex, setSelectedAlertIndex] = useState<number>(-1);

  // Filters
  const [filters, setFilters] = useState<AlertFilters>({
    search: "",
    severities: [],
    statuses: [],
    ruleIds: [],
    timeRange: "24h",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 50;

  // Build API filters
  const apiFilters = useMemo(() => {
    const timeRangeMap: Record<string, number> = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const result: Record<string, any> = {
      page,
      limit,
    };

    if (
      filters.timeRange &&
      filters.timeRange !== "custom" &&
      timeRangeMap[filters.timeRange]
    ) {
      result.startDate = new Date(
        Date.now() - timeRangeMap[filters.timeRange]
      ).toISOString();
    }

    if (selectedTab !== "all") {
      result.status = selectedTab;
    } else if (filters.statuses.length === 1) {
      result.status = filters.statuses[0];
    }

    if (filters.severities.length === 1) {
      result.severity = filters.severities[0];
    }

    if (filters.ruleIds.length === 1) {
      result.ruleId = filters.ruleIds[0];
    }

    return result;
  }, [filters, selectedTab, page, limit]);

  // Fetch alerts and rules
  const {
    data: alertsData,
    isLoading,
    refetch,
    isRefetching,
  } = useAlerts(selectedProjectId || undefined, apiFilters);

  const { data: rulesData } = useAlertRules(selectedProjectId || "");

  const alerts = useMemo(() => alertsData?.data || [], [alertsData]);
  const meta = useMemo(() => alertsData?.meta, [alertsData]);
  const rules = useMemo(() => rulesData?.data || [], [rulesData]);

  // Client-side filtering for multi-value filters the API doesn't support
  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    // Search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (alert: Alert) =>
          alert.title.toLowerCase().includes(searchLower) ||
          alert.message.toLowerCase().includes(searchLower)
      );
    }

    // Multi-severity filter (if more than 1)
    if (filters.severities.length > 1) {
      filtered = filtered.filter((alert: Alert) =>
        filters.severities.includes(alert.severity)
      );
    }

    // Multi-status filter (if more than 1 and tab is "all")
    if (filters.statuses.length > 1 && selectedTab === "all") {
      filtered = filtered.filter((alert: Alert) =>
        filters.statuses.includes(alert.status)
      );
    }

    // Multi-rule filter (if more than 1)
    if (filters.ruleIds.length > 1) {
      filtered = filtered.filter((alert: Alert) =>
        filters.ruleIds.includes(alert.ruleId)
      );
    }

    return filtered;
  }, [alerts, filters, selectedTab]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
    setSelectedAlertIndex(-1);
    setSelectedAlertIds([]);
  }, [filters, selectedTab, selectedProjectId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "j":
          e.preventDefault();
          setSelectedAlertIndex((prev) =>
            Math.min(prev + 1, filteredAlerts.length - 1)
          );
          break;
        case "k":
          e.preventDefault();
          setSelectedAlertIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Escape":
          e.preventDefault();
          setSelectedAlertIndex(-1);
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
  }, [filteredAlerts.length, refetch]);

  // Auto-scroll selected alert into view
  useEffect(() => {
    if (selectedAlertIndex >= 0 && listContainerRef.current) {
      const selectedElement = listContainerRef.current.querySelector(
        `[data-alert-index="${selectedAlertIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedAlertIndex]);

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlertIds((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlertIds.length === filteredAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map((a: Alert) => a._id));
    }
  };

  const handleAlertClick = useCallback(
    (alert: Alert) => {
      const index = filteredAlerts.findIndex(
        (a: Alert) => a._id === alert._id
      );
      setSelectedAlertIndex(index);
    },
    [filteredAlerts]
  );

  const selectedAlert =
    selectedAlertIndex >= 0 ? filteredAlerts[selectedAlertIndex] : null;

  const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 1;

  if (isLoading && !alerts.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-signal" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-base">
      {/* Header */}
      <div className="shrink-0 border-b border-border-subtle bg-bg-surface px-6 py-4">
        <div className="flex items-center justify-between">
          <SectionHeading
            headline="Alert Events"
            sub="Monitor and manage triggered alerts"
            align="left"
          />
          <div className="flex items-center gap-3">
            {/* Project Selector */}
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-[200px] bg-bg-base border-border-subtle">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-bg-elevated border-border-subtle">
                {projects.map((project: any) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="border-border-faint"
            >
              {isRefetching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="shrink-0 px-6 pt-4 bg-bg-surface border-b border-border-subtle">
        <AlertsNavigation />
      </div>

      {/* Stats Cards */}
      <div className="shrink-0 px-6 py-4 bg-bg-surface border-b border-border-subtle">
        <AlertStatsCards
          projectId={selectedProjectId || undefined}
          timeRange={
            (filters.timeRange === "1h" || filters.timeRange === "custom"
              ? "1d"
              : filters.timeRange === "24h"
              ? "1d"
              : filters.timeRange) as "1d" | "7d" | "30d"
          }
        />
      </div>

      {/* Filter Bar */}
      <div className="shrink-0 px-6 py-3 bg-bg-surface border-b border-border-subtle">
        <AlertFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          availableRules={rules}
          onRefresh={() => refetch()}
          isRefreshing={isRefetching}
        />
      </div>

      {/* Tab Filters */}
      <div className="shrink-0 px-6 py-2 bg-bg-surface border-b border-border-subtle">
        <AlertTabFilters
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          alerts={alerts}
        />
      </div>

      {/* Results Summary Bar */}
      <div className="shrink-0 px-6 py-2 bg-bg-elevated border-b border-border-faint">
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-muted">
            {filteredAlerts.length > 0 ? (
              <>
                Showing{" "}
                <span className="text-signal font-semibold">
                  {filteredAlerts.length}
                </span>{" "}
                alert{filteredAlerts.length !== 1 ? "s" : ""}
                {meta?.total && meta.total > limit && (
                  <span>
                    {" "}
                    of{" "}
                    <span className="text-text-primary">{meta.total}</span>{" "}
                    total
                  </span>
                )}
              </>
            ) : (
              <span>No alerts found</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="font-mono">
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
            <span className="font-mono">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-bg-base border border-border-faint rounded">
                Esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>

      {/* Split Pane: Alert List + Detail Panel */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <LogExplorerSplitPane
          leftPanel={
            <div ref={listContainerRef} className="h-full overflow-y-auto">
              {/* Select All Header */}
              {filteredAlerts.length > 0 && (
                <div className="px-4 py-3 border-b border-border-subtle flex items-center gap-3 bg-bg-base sticky top-0 z-10">
                  <Checkbox
                    checked={
                      selectedAlertIds.length === filteredAlerts.length &&
                      filteredAlerts.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    className="border-border-subtle"
                  />
                  <span className="text-sm text-text-secondary">
                    {filteredAlerts.length} alert
                    {filteredAlerts.length !== 1 ? "s" : ""}
                    {selectedAlertIds.length > 0 &&
                      ` (${selectedAlertIds.length} selected)`}
                  </span>
                </div>
              )}

              {/* Alert List */}
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="h-12 w-12 text-text-tertiary mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No alerts found
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md">
                    {selectedTab === "all"
                      ? "There are no alerts to display. Alerts will appear here when your application triggers alert rules."
                      : `No ${selectedTab} alerts at the moment.`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-faint">
                  {filteredAlerts.map((alert: Alert, index: number) => (
                    <div
                      key={alert._id}
                      data-alert-index={index}
                      className="flex items-start gap-3 px-4 py-1"
                    >
                      <Checkbox
                        checked={selectedAlertIds.includes(alert._id)}
                        onCheckedChange={() => handleSelectAlert(alert._id)}
                        className="mt-5 border-border-subtle"
                      />
                      <div className="flex-1 min-w-0">
                        <EnhancedAlertListItem
                          alert={alert}
                          isSelected={index === selectedAlertIndex}
                          onClick={() => handleAlertClick(alert)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-4 border-t border-border-subtle bg-bg-base">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="border-border-subtle"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-text-secondary">
                    Page{" "}
                    <span className="text-signal font-semibold">{page}</span> of{" "}
                    {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page >= totalPages}
                    className="border-border-subtle"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          }
          rightPanel={
            <AlertDetailPanel
              alert={selectedAlert}
              onClose={() => setSelectedAlertIndex(-1)}
            />
          }
        />
      </div>

      {/* Bulk Action Bar */}
      <AlertBulkActionBar
        selectedCount={selectedAlertIds.length}
        selectedIds={selectedAlertIds}
        onClearSelection={() => setSelectedAlertIds([])}
      />
    </div>
  );
}
