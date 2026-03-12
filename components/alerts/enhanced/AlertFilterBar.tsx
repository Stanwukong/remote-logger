"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { SignalDot } from "@/components/shared/SignalDot";

export interface AlertFilters {
  search: string;
  severities: ("info" | "warning" | "critical")[];
  statuses: ("active" | "acknowledged" | "resolved" | "snoozed")[];
  ruleIds: string[];
  timeRange: "1h" | "24h" | "7d" | "30d" | "custom";
  startDate?: string;
  endDate?: string;
}

interface AlertFilterBarProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
  availableRules?: Array<{ _id: string; name: string }>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AlertFilterBar({
  filters,
  onFiltersChange,
  availableRules = [],
  onRefresh,
  isRefreshing = false,
}: AlertFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof AlertFilters>(
    key: K,
    value: AlertFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof AlertFilters>(
    key: K,
    value: any
  ) => {
    const currentArray = (filters[key] as any[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as any);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      severities: [],
      statuses: [],
      ruleIds: [],
      timeRange: "24h",
    });
  };

  const activeFilterCount =
    filters.severities.length +
    filters.statuses.length +
    filters.ruleIds.length +
    (filters.search ? 1 : 0);

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search alerts by title or message..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9 bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Time Range Selector */}
        <Select
          value={filters.timeRange}
          onValueChange={(value: any) => updateFilter("timeRange", value)}
        >
          <SelectTrigger className="w-[140px] bg-[var(--bg-base)] border-[var(--border-subtle)]">
            <Calendar className="h-4 w-4 mr-2 text-[var(--signal)]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--signal)] hover:border-[var(--signal)]"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-[var(--signal)] text-[var(--bg-void)]">
              {activeFilterCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>

        {/* Refresh Button */}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--signal)] hover:border-[var(--signal)]"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        )}

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[var(--text-tertiary)] hover:text-[var(--status-danger)]"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-4">
          {/* Severity Filters */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Severity
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "critical", label: "Critical", color: "danger" },
                { value: "warning", label: "Warning", color: "warn" },
                { value: "info", label: "Info", color: "info" },
              ].map((severity) => (
                <button
                  key={severity.value}
                  onClick={() =>
                    toggleArrayFilter("severities", severity.value as any)
                  }
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    border flex items-center gap-2
                    ${
                      filters.severities.includes(severity.value as any)
                        ? `bg-[var(--status-${severity.color})]/10 border-[var(--status-${severity.color})] text-[var(--status-${severity.color})]`
                        : "bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--signal)]"
                    }
                  `}
                >
                  <SignalDot
                    status={
                      severity.color === "danger"
                        ? "danger"
                        : severity.color === "warn"
                        ? "warn"
                        : "info"
                    }
                  />
                  {severity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "active", label: "Active", color: "danger" },
                { value: "acknowledged", label: "Acknowledged", color: "warn" },
                { value: "resolved", label: "Resolved", color: "ok" },
                { value: "snoozed", label: "Snoozed", color: "neutral" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    toggleArrayFilter("statuses", status.value as any)
                  }
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    border flex items-center gap-2
                    ${
                      filters.statuses.includes(status.value as any)
                        ? `bg-[var(--status-${status.color})]/10 border-[var(--status-${status.color})] text-[var(--status-${status.color})]`
                        : "bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--signal)]"
                    }
                  `}
                >
                  <SignalDot
                    status={
                      status.color === "danger"
                        ? "danger"
                        : status.color === "warn"
                        ? "warn"
                        : status.color === "ok"
                        ? "ok"
                        : "info"
                    }
                  />
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rule Filters */}
          {availableRules.length > 0 && (
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                Alert Rules
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRules.slice(0, 5).map((rule) => (
                  <button
                    key={rule._id}
                    onClick={() => toggleArrayFilter("ruleIds", rule._id)}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                      border
                      ${
                        filters.ruleIds.includes(rule._id)
                          ? "bg-[var(--signal)]/10 border-[var(--signal)] text-[var(--signal)]"
                          : "bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--signal)]"
                      }
                    `}
                  >
                    {rule.name}
                  </button>
                ))}
                {availableRules.length > 5 && (
                  <span className="text-sm text-[var(--text-tertiary)] self-center">
                    +{availableRules.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
