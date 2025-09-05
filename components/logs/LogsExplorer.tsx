/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDistinctValues, useLogs } from "@/hooks/log.hooks";
import { useProjects } from "@/hooks/project.hooks";
import { LogEntry, LogFilters } from "@/types/analytics";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import EmptyLogsPage from "../Empty/logs";
import { LogsHeader } from "./LogsHeader";
import { LogsFilterCard } from "./LogsFilterCard";
import { LogsSummary } from "./LogsSummary";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, Search } from "lucide-react";
import { LogListItem } from "./LogListItem";
import { LogsPagination } from "./LogPagination";
import { LogDetailsDialog } from "./LogsDetailsDialog";

export default function LogsExplorerContent() {
    const searchParams = useSearchParams();
    const { data: projectsResponse, isLoading: isProjectsLoading } =
      useProjects();
  
    const projects = useMemo(() => {
      return projectsResponse?.data ?? [];
    }, [projectsResponse?.data]);
  
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({
      from: undefined, // Start with undefined to allow "Pick a date range"
      to: undefined,
    });
  
    // UI states
    const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Define items per page for pagination
  
    // Available filters from API
  
    const availableProjects = useMemo(
      () => projects.map((p) => ({ id: p._id, name: p.name ?? p.id })),
      [projects]
    );
  
    console.log(availableProjects);
  
    const availableLevels = useMemo(
      () => ["error", "warn", "info", "debug", "trace", "fatal"],
      []
    );
  
    const paramProjectId = searchParams.get("projectId") || "";
    const activeProjectId = useMemo(() => {
      if (selectedProjects.length > 0) return selectedProjects[0];
      if (paramProjectId) return paramProjectId;
      return projects[0]?._id || projects[0]?.id || "";
    }, [selectedProjects, paramProjectId, projects]);
  
    const { data: distinctServices } = useDistinctValues(
      activeProjectId,
      "service"
    );
    const availableServices = useMemo(
      () => distinctServices ?? [],
      [distinctServices]
    );
  
    const serverFilters: LogFilters = useMemo(
      () => ({
        level:
          selectedLevels.length === 1 ? (selectedLevels[0] as any) : undefined,
        service: selectedServices.length === 1 ? selectedServices[0] : undefined,
        search: searchTerm || undefined,
        startDate: dateRange.from ? dateRange.from.toISOString() : undefined,
        endDate: dateRange.to
          ? new Date(
              new Date(dateRange.to).setHours(23, 59, 59, 999)
            ).toISOString()
          : undefined,
        limit: 500,
      }),
      [selectedLevels, selectedServices, searchTerm, dateRange]
    );
  
    const {
      data: logsData,
      isLoading: logsLoading,
      refetch,
    } = useLogs(activeProjectId, serverFilters);
    const logs: LogEntry[] = useMemo(() => logsData?.logs ?? [], [logsData]);
  
    const hasProjects = projects.length > 0;
    const isLoading = isProjectsLoading;
  
    // Sorting and pagination only (server handles filtering)
    const applyFiltersAndSort = useCallback(() => {
      const current = [...logs];
      current.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        if (sortBy === "newest") return dateB - dateA;
        if (sortBy === "oldest") return dateA - dateB;
        if (sortBy === "level") {
          const order = {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            trace: 5,
          } as Record<string, number>;
          return (order[a.level] ?? 99) - (order[b.level] ?? 99);
        }
        return 0;
      });
      setFilteredLogs(current);
      setCurrentPage(1);
    }, [logs, sortBy]);
  
    // Apply filters and sort whenever dependencies change
    useEffect(() => {
      applyFiltersAndSort();
    }, [applyFiltersAndSort]);
  
    // Handlers for child components
    const handleRefresh = useCallback(() => {
      refetch();
    }, [refetch]);
  
    const handleExport = useCallback(() => {
      // Implement actual export logic here (e.g., to CSV, JSON)
      alert("Export functionality coming soon!");
    }, []);
  
    const handleDateSelect = useCallback((range: DateRange | undefined) => {
      setDateRange(range || { from: undefined, to: undefined });
    }, []);
  
    const handleClearFilters = useCallback(() => {
      setSearchTerm("");
      setSelectedLevels([]);
      setSelectedProjects([]);
      setSelectedServices([]);
      setDateRange({ from: undefined, to: undefined });
    }, []);
  
    const toggleLogExpansion = useCallback((logId: string) => {
      setExpandedLogs((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(logId)) {
          newExpanded.delete(logId);
        } else {
          newExpanded.add(logId);
        }
        return newExpanded;
      });
    }, []);
  
    const handleViewDetails = useCallback((log: LogEntry) => {
      setSelectedLog(log);
    }, []);
  
    const handleDeleteLog = useCallback((logId: string) => {
      // Placeholder for actual delete logic - remove locally from current view
      if (window.confirm(`Are you sure you want to delete log ${logId}?`)) {
        setFilteredLogs((prevFiltered) =>
          prevFiltered.filter((log) => log.id !== logId)
        );
        setExpandedLogs((prevExpanded) => {
          const newExpanded = new Set(prevExpanded);
          newExpanded.delete(logId);
          return newExpanded;
        });
        alert(`Log ${logId} deleted! (Mock action)`);
      }
    }, []);
  
    const handlePageChange = useCallback((direction: "next" | "previous") => {
      setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
    }, []);
  
    const paginatedLogs = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredLogs.slice(startIndex, endIndex);
    }, [filteredLogs, currentPage, itemsPerPage]);
  
    const activeFiltersCount = useMemo(
      () =>
        (searchTerm ? 1 : 0) +
        selectedLevels.length +
        selectedProjects.length +
        selectedServices.length +
        (dateRange.from || dateRange.to ? 1 : 0),
      [searchTerm, selectedLevels, selectedProjects, selectedServices, dateRange]
    );
  
    if (!hasProjects) {
      return <EmptyLogsPage />;
    }
  
    if (isLoading) {
      return (
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <LogsHeader onRefresh={handleRefresh} onExport={handleExport} />
  
        <LogsFilterCard
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={handleDateSelect}
          selectedLevels={selectedLevels}
          onSelectedLevelsChange={setSelectedLevels}
          selectedProjects={selectedProjects}
          onSelectedProjectsChange={setSelectedProjects}
          selectedServices={selectedServices}
          onSelectedServicesChange={setSelectedServices}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
          availableProjects={availableProjects}
          availableServices={availableServices}
          availableLevels={availableLevels}
        />
  
        <LogsSummary
          filteredCount={filteredLogs.length}
          totalCount={logs.length}
          activeFiltersCount={activeFiltersCount}
          onSortChange={setSortBy}
        />
  
        <Card>
          <CardContent className="p-0">
            {logsLoading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No logs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {paginatedLogs.map((log) => (
                  <LogListItem
                    key={log.id}
                    log={log}
                    isExpanded={expandedLogs.has(log.id)}
                    onToggleExpansion={toggleLogExpansion}
                    onViewDetails={handleViewDetails}
                    onDeleteLog={handleDeleteLog}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
  
        {filteredLogs.length > 0 && (
          <LogsPagination
            filteredCount={filteredLogs.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPrevious={() => handlePageChange("previous")}
            onNext={() => handlePageChange("next")}
          />
        )}
  
        <LogDetailsDialog
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      </div>
    );
  }