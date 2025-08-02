"use client";

import EmptyLogsPage from "@/components/Empty/logs";
import { LogListItem } from "@/components/logs/LogListItem";
import { LogsPagination } from "@/components/logs/LogPagination";
import { LogDetailsDialog } from "@/components/logs/LogsDetailsDialog";
import { LogsFilterCard } from "@/components/logs/LogsFilterCard";
import { LogsHeader } from "@/components/logs/LogsHeader";
import { LogsSummary } from "@/components/logs/LogsSummary";
import { Card, CardContent } from "@/components/ui/card";
import { generateMockLogs } from "@/lib/mock-data";
import { LogEntry } from "@/types/analytics";
import { RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export default function LogsExplorer() {
  const [hasProjects, setHasProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Mock data for filters (these would typically come from an API)
  const availableProjects = useMemo(
    () => ["web-app", "api-service", "mobile-app", "analytics", "auth-service"],
    []
  );
  const availableServices = useMemo(
    () => ["frontend", "backend", "database", "cache", "queue", "auth"],
    []
  );
  const availableLevels = useMemo(
    () => ["error", "warn", "info", "debug", "trace"],
    []
  );

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockLogs = generateMockLogs(undefined, 100); // Generate more logs for pagination
      setLogs(mockLogs);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  // Simulate loading and checking for projects
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate checking if user has projects
      // In real app, this would be an API call
      setHasProjects(false) // Set to false to show empty state
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])


  // Memoized filter logic
  const applyFiltersAndSort = useCallback(() => {
    let currentFiltered = [...logs];

    // Filter by search term
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.projectId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by levels
    if (selectedLevels.length > 0) {
      currentFiltered = currentFiltered.filter((log) =>
        selectedLevels.includes(log.level)
      );
    }

    // Filter by projects
    if (selectedProjects.length > 0) {
      currentFiltered = currentFiltered.filter((log) =>
        selectedProjects.includes(log.projectId)
      );
    }

    // Filter by services
    if (selectedServices.length > 0) {
      currentFiltered = currentFiltered.filter(
        (log) => log.service && selectedServices.includes(log.service)
      );
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      currentFiltered = currentFiltered.filter((log) => {
        const logDate = new Date(log.timestamp);
        if (dateRange.from && logDate < dateRange.from) return false;
        // Adjust 'to' date to include the entire day
        const toDateAdjusted = dateRange.to
          ? new Date(dateRange.to.setHours(23, 59, 59, 999))
          : undefined;
        if (toDateAdjusted && logDate > toDateAdjusted) return false;
        return true;
      });
    }

    // Sort
    currentFiltered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      if (sortBy === "newest") {
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        return dateA - dateB;
      } else if (sortBy === "level") {
        // Example: custom sort order for levels
        const levelOrder = { error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
        return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      }
      return 0;
    });

    setFilteredLogs(currentFiltered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [
    logs,
    searchTerm,
    selectedLevels,
    selectedProjects,
    selectedServices,
    dateRange,
    sortBy,
  ]);

  // Apply filters and sort whenever dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Handlers for child components
  const handleRefresh = useCallback(() => {
    // In a real app, you'd re-fetch data from your API
    window.location.reload(); // Simple page reload for mock data
  }, []);

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
    // Placeholder for actual delete logic
    if (window.confirm(`Are you sure you want to delete log ${logId}?`)) {
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
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
    )
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
          {loading ? (
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
