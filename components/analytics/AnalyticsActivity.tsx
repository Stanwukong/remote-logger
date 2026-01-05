"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  Clock,
  Filter,
  Globe,
  Info,
  Pause,
  Play,
  Search,
  User,
  XCircle,
  Loader2,
} from "lucide-react";

import { analyticsService } from "@/services/analytics.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsActivityProps {
  projectId: string;
}

const logLevels: Record<string, any> = {
  fatal: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
  error: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: AlertCircle,
  },
  warn: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    icon: AlertCircle,
  },
  info: {
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Info,
  },
  debug: {
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    icon: Activity,
  },
  trace: {
    color: "bg-gray-400",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    icon: Activity,
  },
};

const AnalyticsActivity = ({ projectId }: AnalyticsActivityProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    level: string[];
    eventType: string[];
    service: string[];
    environment: string[];
    search: string;
  }>({
    level: [],
    eventType: [],
    service: [],
    environment: [],
    search: "",
  });

  // Fetch filter options
  const filterValuesQuery = useQuery({
    queryKey: ["activityFilterValues", projectId],
    queryFn: () => analyticsService.getActivityFilterValues(projectId),
  });

  // Fetch logs with polling
  const logsQuery = useQuery({
    queryKey: ["activityFeed", projectId, filters],
    queryFn: () =>
      analyticsService.getActivityFeed(projectId, {
        limit: 50,
        level: filters.level.length > 0 ? filters.level : undefined,
        eventType: filters.eventType.length > 0 ? filters.eventType : undefined,
        service: filters.service.length > 0 ? filters.service : undefined,
        environment:
          filters.environment.length > 0 ? filters.environment : undefined,
        search: filters.search || undefined,
      }),
    refetchInterval: isPaused ? false : 3000,
  });

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      level: [],
      eventType: [],
      service: [],
      environment: [],
      search: "",
    });
  };

  const hasActiveFilters =
    filters.level.length > 0 ||
    filters.eventType.length > 0 ||
    filters.service.length > 0 ||
    filters.environment.length > 0 ||
    filters.search !== "";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Real-Time Activity
          </h2>
          <p className="text-muted-foreground">
            Live stream of application events •{" "}
            {logsQuery.data?.meta.total || 0} events
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isPaused ? "default" : "destructive"}
            onClick={() => setIsPaused(!isPaused)}
            className="w-32"
          >
            {isPaused ? (
              <Play className="w-4 h-4 mr-2" />
            ) : (
              <Pause className="w-4 h-4 mr-2" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant={showFilters || hasActiveFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {filters.level.length +
                  filters.eventType.length +
                  filters.service.length +
                  filters.environment.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Log Level Filter */}
              <div>
                <Label className="mb-2 block">Log Level</Label>
                <div className="space-y-2">
                  {filterValuesQuery.data?.levels?.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={filters.level.includes(level)}
                        onCheckedChange={() => toggleFilter("level", level)}
                      />
                      <label
                        htmlFor={`level-${level}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize flex items-center gap-2"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            logLevels[level]?.color || "bg-gray-400"
                          }`}
                        />
                        {level}
                      </label>
                    </div>
                  )) || <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>

              {/* Event Type Filter */}
              <div>
                <Label className="mb-2 block">Event Type</Label>
                <div className="space-y-2">
                  {filterValuesQuery.data?.eventTypes?.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.eventType.includes(type)}
                        onCheckedChange={() => toggleFilter("eventType", type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  )) || <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>

              {/* Service Filter */}
              <div>
                <Label className="mb-2 block">Service</Label>
                <div className="space-y-2">
                  {filterValuesQuery.data?.services?.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={filters.service.includes(service)}
                        onCheckedChange={() => toggleFilter("service", service)}
                      />
                      <label
                        htmlFor={`service-${service}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service}
                      </label>
                    </div>
                  )) || <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>

              {/* Environment Filter */}
              <div>
                <Label className="mb-2 block">Environment</Label>
                <div className="space-y-2">
                  {filterValuesQuery.data?.environments?.map((env) => (
                    <div key={env} className="flex items-center space-x-2">
                      <Checkbox
                        id={`env-${env}`}
                        checked={filters.environment.includes(env)}
                        onCheckedChange={() => toggleFilter("environment", env)}
                      />
                      <label
                        htmlFor={`env-${env}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {env}
                      </label>
                    </div>
                  )) || <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Feed */}
      <Card className="overflow-hidden">
        <div className="h-[600px] overflow-y-auto pr-2">
          {logsQuery.isLoading && !logsQuery.data ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : logsQuery.data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground min-h-[200px]">
              <Activity className="w-12 h-12 mb-2 opacity-50" />
              <p>No events match your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logsQuery.data?.data.map((log: any) => {
                const levelConfig = logLevels[log.level] || logLevels.info;
                const Icon = levelConfig.icon;

                return (
                  <div
                    key={log.id}
                    className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${levelConfig.color.replace(
                      "bg-",
                      "border-"
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${levelConfig.textColor}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <p className="font-mono text-sm text-foreground break-words">
                              {log.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            <span className="font-mono">
                              {new Date(log.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`uppercase ${levelConfig.textColor} ${levelConfig.bgColor} border-0`}
                          >
                            {log.level}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {log.eventType}
                          </Badge>
                          <Badge variant="secondary">{log.service}</Badge>
                          <Badge variant="outline">{log.environment}</Badge>

                          {log.userId && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.userId}
                            </span>
                          )}
                          {log.url && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {log.url}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsActivity;
