"use client";

import { useState } from "react";
import { Search, Filter, X, Clock, Database, Tag, Activity, Save, Hash, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export interface LogFilters {
  search: string;
  levels: string[];
  services: string[];
  environments: string[];
  eventTypes: string[];
  timeRange?: "1h" | "24h" | "7d" | "30d" | "custom";
  release?: string;
  customFrom?: string;
  customTo?: string;
}

interface ObservatoryFilterBarProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
  onSaveSearch?: () => void;
  availableServices: string[];
  availableEnvironments: string[];
  isLiveTail?: boolean;
  onToggleLiveTail?: () => void;
}

const LOG_LEVELS = [
  { value: "trace", label: "Trace", color: "var(--level-trace)" },
  { value: "debug", label: "Debug", color: "var(--level-debug)" },
  { value: "info", label: "Info", color: "var(--level-info)" },
  { value: "warn", label: "Warn", color: "var(--level-warn)" },
  { value: "error", label: "Error", color: "var(--level-error)" },
  { value: "fatal", label: "Fatal", color: "var(--level-fatal)" },
];

const EVENT_TYPES = [
  { value: "error", label: "Error" },
  { value: "performance", label: "Performance" },
  { value: "interaction", label: "Interaction" },
  { value: "network", label: "Network" },
  { value: "console", label: "Console" },
  { value: "pageview", label: "Pageview" },
];

const TIME_RANGES = [
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

export function ObservatoryFilterBar({
  filters,
  onFiltersChange,
  onSaveSearch,
  availableServices,
  availableEnvironments,
  isLiveTail,
  onToggleLiveTail,
}: ObservatoryFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const activeFiltersCount =
    filters.levels.length +
    filters.services.length +
    filters.environments.length +
    filters.eventTypes.length +
    (filters.timeRange ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.release ? 1 : 0);

  const toggleLevel = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    onFiltersChange({ ...filters, levels: newLevels });
  };

  const toggleService = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    onFiltersChange({ ...filters, services: newServices });
  };

  const toggleEnvironment = (env: string) => {
    const newEnvs = filters.environments.includes(env)
      ? filters.environments.filter((e) => e !== env)
      : [...filters.environments, env];
    onFiltersChange({ ...filters, environments: newEnvs });
  };

  const toggleEventType = (type: string) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter((t) => t !== type)
      : [...filters.eventTypes, type];
    onFiltersChange({ ...filters, eventTypes: newTypes });
  };

  const clearFilters = () => {
    setCustomDateRange({});
    setShowDatePicker(false);
    onFiltersChange({
      search: "",
      levels: [],
      services: [],
      environments: [],
      eventTypes: [],
      release: "",
      customFrom: undefined,
      customTo: undefined,
    });
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    const newRange = { from: range?.from, to: range?.to };
    setCustomDateRange(newRange);
    if (range?.from && range?.to) {
      onFiltersChange({
        ...filters,
        customFrom: range.from.toISOString(),
        customTo: range.to.toISOString(),
      });
    }
  };

  const formatDateShort = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="space-y-3">
      {/* Main Filter Bar */}
      <div className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-lg p-3 shadow-[var(--shadow-card)]">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-signal transition-colors" />
          <Input
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search logs... (message, error, url)"
            className="pl-10 bg-bg-base border-border-faint focus:border-signal focus:ring-signal/20"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Time Range Selector */}
        <Select
          value={filters.timeRange || ""}
          onValueChange={(value) => {
            const newTimeRange = value as LogFilters["timeRange"];
            if (newTimeRange === "custom") {
              setShowDatePicker(true);
            } else {
              setShowDatePicker(false);
              setCustomDateRange({});
            }
            onFiltersChange({
              ...filters,
              timeRange: newTimeRange,
              ...(newTimeRange !== "custom" && { customFrom: undefined, customTo: undefined }),
            });
          }}
        >
          <SelectTrigger className="w-[180px] bg-bg-base border-border-faint">
            <Clock className="w-4 h-4 mr-2 text-text-muted" />
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Date Range Picker */}
        {filters.timeRange === "custom" && (
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-border-faint gap-2",
                  customDateRange.from && customDateRange.to && "border-signal/30 bg-signal/10"
                )}
              >
                <CalendarIcon className="w-4 h-4 text-text-muted" />
                {customDateRange.from && customDateRange.to ? (
                  <span className="text-xs text-text-primary">
                    {formatDateShort(customDateRange.from)} - {formatDateShort(customDateRange.to)}
                  </span>
                ) : (
                  <span className="text-xs text-text-muted">Pick dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-bg-surface border-border-subtle"
              align="start"
            >
              <Calendar
                mode="range"
                selected={
                  customDateRange.from
                    ? { from: customDateRange.from, to: customDateRange.to }
                    : undefined
                }
                onSelect={handleCustomDateSelect}
                numberOfMonths={2}
                disabled={{ after: new Date() }}
                className="bg-bg-surface text-text-primary"
                classNames={{
                  day: "text-text-primary",
                  caption_label: "text-text-primary",
                  weekday: "text-text-muted",
                  outside: "text-text-muted/50",
                  range_start: "rounded-l-md bg-signal/20",
                  range_end: "rounded-r-md bg-signal/20",
                  range_middle: "bg-signal/10 rounded-none",
                  today: "bg-bg-base text-signal rounded-md",
                }}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "relative border-border-faint",
            isExpanded && "bg-signal/10 border-signal/30"
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-signal text-bg-void">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Live Tail Toggle */}
        {onToggleLiveTail && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLiveTail}
            className={cn(
              "border-border-faint",
              isLiveTail && "bg-signal/10 border-signal/30 text-signal"
            )}
          >
            <Activity className={cn("w-4 h-4 mr-2", isLiveTail && "animate-pulse")} />
            Live Tail
          </Button>
        )}

        {/* Save Search */}
        {onSaveSearch && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveSearch}
            className="border-border-faint"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-text-muted hover:text-status-danger"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 space-y-4 shadow-[var(--shadow-card)] animate-in slide-in-from-top-2 duration-200">
          {/* Log Levels */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Log Levels
            </div>
            <div className="flex flex-wrap gap-2">
              {LOG_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => toggleLevel(level.value)}
                  className={cn(
                    "px-3 py-1.5 rounded border text-xs font-medium font-mono uppercase transition-all",
                    filters.levels.includes(level.value)
                      ? "shadow-[var(--glow-signal-sm)]"
                      : "hover:border-border-accent"
                  )}
                  style={{
                    color: filters.levels.includes(level.value) ? level.color : "var(--text-muted)",
                    backgroundColor: filters.levels.includes(level.value)
                      ? `${level.color}15`
                      : "var(--bg-base)",
                    borderColor: filters.levels.includes(level.value)
                      ? `${level.color}40`
                      : "var(--border-faint)",
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          {availableServices.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" />
                Services
              </div>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={cn(
                      "px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      filters.services.includes(service)
                        ? "bg-data-muted text-data border-data/30 shadow-[var(--glow-data)]"
                        : "bg-bg-base text-text-muted border-border-faint hover:border-border-accent"
                    )}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Environments */}
          {availableEnvironments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                Environments
              </div>
              <div className="flex flex-wrap gap-2">
                {availableEnvironments.map((env) => (
                  <button
                    key={env}
                    onClick={() => toggleEnvironment(env)}
                    className={cn(
                      "px-3 py-1.5 rounded border text-xs font-medium transition-all",
                      filters.environments.includes(env)
                        ? "bg-signal-muted text-signal border-signal/30 shadow-[var(--glow-signal-sm)]"
                        : "bg-bg-base text-text-muted border-border-faint hover:border-border-accent"
                    )}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event Types */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Event Types
            </div>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleEventType(type.value)}
                  className={cn(
                    "px-3 py-1.5 rounded border text-xs font-medium transition-all",
                    filters.eventTypes.includes(type.value)
                      ? "bg-signal-muted text-signal border-signal/30 shadow-[var(--glow-signal-sm)]"
                      : "bg-bg-base text-text-muted border-border-faint hover:border-border-accent"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Release Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              <Hash className="w-3.5 h-3.5" />
              Release
            </div>
            <Input
              value={filters.release || ""}
              onChange={(e) => onFiltersChange({ ...filters, release: e.target.value })}
              placeholder="e.g. 1.2.3"
              className="max-w-[240px] font-mono text-xs bg-bg-base border-border-faint focus:border-signal focus:ring-signal/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
