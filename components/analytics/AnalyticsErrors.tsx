"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Users,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

import { analyticsService } from "@/services/analytics.service";
import { TimeRange } from "@/types/analytics.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AnalyticsErrorsProps {
  projectId: string;
}

const AnalyticsErrors = ({ projectId }: AnalyticsErrorsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [selectedError, setSelectedError] = useState<any | null>(null);

  // Queries
  const statsQuery = useQuery({
    queryKey: ["errorStats", projectId, timeRange],
    queryFn: () => analyticsService.getErrorStats(projectId, timeRange),
  });

  const timelineQuery = useQuery({
    queryKey: ["errorTimeline", projectId, timeRange],
    queryFn: () => analyticsService.getErrorTimeline(projectId, timeRange),
  });

  const topErrorsQuery = useQuery({
    queryKey: ["topErrors", projectId, timeRange],
    queryFn: () => analyticsService.getTopErrors(projectId, 10, timeRange),
  });

  const distributionQuery = useQuery({
    queryKey: ["errorDistribution", projectId, timeRange],
    queryFn: () => analyticsService.getErrorDistribution(projectId, timeRange),
  });

  const isLoading =
    statsQuery.isLoading ||
    timelineQuery.isLoading ||
    topErrorsQuery.isLoading ||
    distributionQuery.isLoading;

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string, inverse = false) => {
    if (trend === "up") return inverse ? "text-green-600" : "text-red-600";
    if (trend === "down") return inverse ? "text-red-600" : "text-green-600";
    return "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Errors",
      value: statsQuery.data?.totalErrors ?? 0,
      change: statsQuery.data?.changes.totalErrors ?? "0%",
      trend: statsQuery.data?.changes.totalErrors.startsWith("+")
        ? "up"
        : "down",
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      label: "Error Rate",
      value: `${statsQuery.data?.errorRate ?? 0}%`,
      change: statsQuery.data?.changes.errorRate ?? "0%",
      trend: statsQuery.data?.changes.errorRate.startsWith("-") ? "down" : "up",
      icon: TrendingDown,
      color: "text-green-500",
    },
    {
      label: "Affected Users",
      value: statsQuery.data?.affectedUsers ?? 0,
      change: statsQuery.data?.changes.affectedUsers ?? "0%",
      trend: statsQuery.data?.changes.affectedUsers.startsWith("+")
        ? "up"
        : "down",
      icon: Users,
      color: "text-orange-500",
    },
    {
      label: "MTTR",
      value: `${Math.round((statsQuery.data?.mttr ?? 0) / 60)}m`,
      change: `${statsQuery.data?.changes.mttr ?? 0}`,
      trend: (statsQuery.data?.changes.mttr ?? "0").startsWith("-")
        ? "down"
        : "up",
      icon: Clock,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Error Analytics</h2>
          <p className="text-muted-foreground">
            Monitor and analyze application errors in real-time
          </p>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(
                    stat.trend,
                    idx === 1 || idx === 3
                  )}`}
                >
                  {getTrendIcon(stat.trend)}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Error Timeline</CardTitle>
          <CardDescription>Error frequency over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineQuery.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Errors"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="warnings"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Warnings"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="fatal"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Fatal"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Errors List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Errors</CardTitle>
              <Button variant="ghost" className="text-sm text-blue-600">
                View All →
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topErrorsQuery.data?.map((error, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedError(error)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm font-mono text-gray-900 truncate block max-w-full">
                            {error.message}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(error.lastSeen).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {error.affectedUsers} users
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {error.service}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-1 ${getTrendColor(
                            error.trend
                          )}`}
                        >
                          {getTrendIcon(error.trend)}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {error.count}
                          </div>
                          <div className="text-xs text-gray-500">
                            occurrences
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Distribution */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Error Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionQuery.data ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distributionQuery.data?.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {distributionQuery.data?.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-gray-700">{entry.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Detail Modal */}
      <Dialog
        open={!!selectedError}
        onOpenChange={(open) => !open && setSelectedError(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
          </DialogHeader>
          {selectedError && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Message
                </label>
                <p className="mt-1 p-3 bg-gray-50 rounded font-mono text-sm break-all">
                  {selectedError.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Occurrences
                  </label>
                  <p className="mt-1 text-2xl font-bold">
                    {selectedError.count}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Affected Users
                  </label>
                  <p className="mt-1 text-2xl font-bold">
                    {selectedError.affectedUsers}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Service
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="text-blue-700 bg-blue-50 border-blue-200"
                  >
                    {selectedError.service}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Seen
                </label>
                <p className="mt-1">
                  {new Date(selectedError.lastSeen).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyticsErrors;
