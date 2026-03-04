// src/hooks/dashboard.hooks.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import {
  Activity,
  AlertTriangle,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cpu,
  HardDrive,
  Network,
  Timer,
} from "lucide-react";
import { ProjectsSummary } from "@/types/project.types";
import { queryKeys } from "./project.hooks";
import { ProjectCardData } from "@/components/dashboard/projects-tab-content";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardOverview, PerformanceData } from "@/types/dashboard";
import { mapDashboardToHealthStatus, mapDashboardToMetrics, mapPerformanceToMetrics, mapPerformanceToOverallStatus } from "@/lib/utils";

// Helper functions to transform API data into component props
// You might want to move these to a separate utils file if they get complex
// const mapSummaryToProjectsTabContent = (
//   summary: ProjectsSummary
// ): ProjectCardData[] => {
//   if (!summary || !summary.recentProjects) return [];
//   return summary.recentProjects.map((project) => ({
//     id: project._id,
//     name: project.name,
//     status: "healthy", // You'll need to derive this from your API data
//     logCount: project.logCount?.toLocaleString(),
//     errors: 0, // You'll need to derive this from your API data
//     uptime: "100%", // You'll need to derive this from your API data
//     lastActivity: "Just now", // You'll need to derive this from your API data
//   }));
// };

/**
 * Hook to get all data needed for the main dashboard content.
 */
export const useDashboardData = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'overview'],
        queryFn: () => dashboardService.getOverview(),
        staleTime: 60 * 1000, // 1 minute
      },
      {
        queryKey: ['dashboard', 'performance'],
        queryFn: () => dashboardService.getPerformanceMetrics(),
        staleTime: 60 * 1000, // 1 minute
      }
    ]
  });

  const [overviewQuery, performanceQuery] = queries;

  // Derived states
  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const hasData = queries.every(query => query.data);

  // Transform data
  const overviewData = overviewQuery.data?.data as DashboardOverview;
  const performanceData = performanceQuery.data;

  const healthStatus = overviewData ? mapDashboardToHealthStatus(overviewData) : null;
  const metrics = overviewData ? mapDashboardToMetrics(overviewData) : [];
  
  const performanceMetrics = performanceData ? mapPerformanceToMetrics(performanceData) : [];
  const performanceStatus = performanceData ? mapPerformanceToOverallStatus(performanceData) : null;

  return {
    // Individual query states
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
    // Combined states
    isLoading,
    isError,
    hasData,
    // Transformed data
    healthStatus,
    metrics,
    performanceMetrics,
    performanceStatus,
  };
};


