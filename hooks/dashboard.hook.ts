// src/hooks/dashboard.hooks.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardOverview, PerformanceData } from "@/types/dashboard";
import {
  mapDashboardToHealthStatus,
  mapDashboardToMetrics,
  mapPerformanceToMetrics,
  mapPerformanceToOverallStatus,
} from "@/lib/utils";

/**
 * Hook to get all data needed for the main dashboard content.
 * Now passes includeComparison=true and optional time range filters.
 */
export const useDashboardData = (params?: {
  startDate?: string;
  endDate?: string;
  environment?: string;
}) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: [
          "dashboard",
          "overview",
          params?.startDate,
          params?.endDate,
          params?.environment,
        ],
        queryFn: () =>
          dashboardService.getOverview({
            startDate: params?.startDate,
            endDate: params?.endDate,
            includeComparison: true,
            environment: params?.environment,
          }),
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["dashboard", "performance"],
        queryFn: () => dashboardService.getPerformanceMetrics(),
        staleTime: 60 * 1000,
      },
    ],
  });

  const [overviewQuery, performanceQuery] = queries;

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const hasData = queries.every((query) => query.data);

  const overviewData = overviewQuery.data?.data as DashboardOverview;
  const performanceData = performanceQuery.data;

  const healthStatus = overviewData
    ? mapDashboardToHealthStatus(overviewData)
    : null;
  const metrics = overviewData ? mapDashboardToMetrics(overviewData) : [];

  const performanceMetrics = performanceData
    ? mapPerformanceToMetrics(performanceData)
    : [];
  const performanceStatus = performanceData
    ? mapPerformanceToOverallStatus(performanceData)
    : null;

  return {
    overview: {
      data: overviewData,
      isLoading: overviewQuery.isLoading,
      isError: overviewQuery.isError,
      error: overviewQuery.error,
    },
    performance: {
      data: performanceData,
      isLoading: performanceQuery.isLoading,
      isError: performanceQuery.isError,
      error: performanceQuery.error,
    },
    isLoading,
    isError,
    hasData,
    healthStatus,
    metrics,
    performanceMetrics,
    performanceStatus,
  };
};
