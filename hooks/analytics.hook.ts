// ============================================
// TANSTACK QUERY HOOKS FOR ANALYTICS
// ============================================

import { analyticsService } from "@/services/analytics.service";
import { useQuery } from "@tanstack/react-query";

// Centralized query keys for analytics
export const analyticsQueryKeys = {
  all: ["analytics"] as const,

  // Error analytics
  errorTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "error-timeline", projectId, params] as const,
  topErrors: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "top-errors", projectId, params] as const,
  errorDistribution: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "error-distribution", projectId, params] as const,
  errorStats: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "error-stats", projectId, params] as const,
  errorDetails: (projectId: string, errorId: string) =>
    [...analyticsQueryKeys.all, "error-details", projectId, errorId] as const,
  errorTrends: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "error-trends", projectId, params] as const,

  // Performance analytics
  performanceTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "performance-timeline", projectId, params] as const,
  webVitals: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "web-vitals", projectId, params] as const,
  resourcePerformance: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "resource-performance", projectId, params] as const,
  pagePerformance: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "page-performance", projectId, params] as const,
  performanceScore: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "performance-score", projectId, params] as const,
  slowestEndpoints: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "slowest-endpoints", projectId, params] as const,

  // Activity analytics
  activityFeed: (projectId: string, params?: { page?: number; limit?: number; level?: string; service?: string }) =>
    [...analyticsQueryKeys.all, "activity-feed", projectId, params] as const,
  activityStats: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "activity-stats", projectId, params] as const,
  activityFilterValues: (projectId: string) =>
    [...analyticsQueryKeys.all, "activity-filter-values", projectId] as const,
  activityStream: (projectId: string, params?: { since?: string }) =>
    [...analyticsQueryKeys.all, "activity-stream", projectId, params] as const,

  // Session analytics
  sessions: (projectId: string, params?: { page?: number; limit?: number; timeRange?: string }) =>
    [...analyticsQueryKeys.all, "sessions", projectId, params] as const,
  sessionDetail: (projectId: string, sessionId: string) =>
    [...analyticsQueryKeys.all, "session-detail", projectId, sessionId] as const,
  sessionTimeline: (projectId: string, sessionId: string) =>
    [...analyticsQueryKeys.all, "session-timeline", projectId, sessionId] as const,
  sessionStats: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "session-stats", projectId, params] as const,
  userJourneys: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "user-journeys", projectId, params] as const,

  // Environment analytics
  environmentStats: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "environment-stats", projectId, params] as const,

  // Network analytics
  networkOverview: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "network-overview", projectId, params] as const,
  networkRequests: (projectId: string, params?: Record<string, unknown>) =>
    [...analyticsQueryKeys.all, "network-requests", projectId, params] as const,
  networkTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "network-timeline", projectId, params] as const,
  networkTopEndpoints: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "network-top-endpoints", projectId, params] as const,
  networkSlowest: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "network-slowest", projectId, params] as const,

  // Interaction analytics
  interactionOverview: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "interaction-overview", projectId, params] as const,
  interactionTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "interaction-timeline", projectId, params] as const,
  interactionTopElements: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "interaction-top-elements", projectId, params] as const,
  interactionMostClicked: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "interaction-most-clicked", projectId, params] as const,

  // Console analytics
  consoleOverview: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "console-overview", projectId, params] as const,
  consoleMessages: (projectId: string, params?: Record<string, unknown>) =>
    [...analyticsQueryKeys.all, "console-messages", projectId, params] as const,
  consoleTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "console-timeline", projectId, params] as const,

  // Pageview analytics
  pageviewOverview: (projectId: string, params?: { timeRange?: string }) =>
    [...analyticsQueryKeys.all, "pageview-overview", projectId, params] as const,
  pageviewTimeline: (projectId: string, params?: { timeRange?: string; granularity?: string }) =>
    [...analyticsQueryKeys.all, "pageview-timeline", projectId, params] as const,
  pageviewTopPages: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "pageview-top-pages", projectId, params] as const,
  pageviewReferrers: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "pageview-referrers", projectId, params] as const,
  pageviewNavFlow: (projectId: string, params?: { timeRange?: string; limit?: number }) =>
    [...analyticsQueryKeys.all, "pageview-nav-flow", projectId, params] as const,
};

// ============================================
// ERROR ANALYTICS HOOKS
// ============================================

export const useErrorTimeline = (
  projectId: string,
  params?: { timeRange?: string; granularity?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.errorTimeline(projectId, params),
    queryFn: () => analyticsService.getErrorTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useTopErrors = (
  projectId: string,
  params?: { timeRange?: string; limit?: number }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.topErrors(projectId, params),
    queryFn: () => analyticsService.getTopErrors(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useErrorDistribution = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.errorDistribution(projectId, params),
    queryFn: () => analyticsService.getErrorDistribution(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useErrorStats = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.errorStats(projectId, params),
    queryFn: () => analyticsService.getErrorStats(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useErrorDetails = (projectId: string, errorId: string) => {
  return useQuery({
    queryKey: analyticsQueryKeys.errorDetails(projectId, errorId),
    queryFn: () => analyticsService.getErrorDetails(projectId, errorId),
    enabled: !!projectId && !!errorId,
    staleTime: 30_000,
  });
};

export const useErrorTrends = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.errorTrends(projectId, params),
    queryFn: () => analyticsService.getErrorTrends(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// PERFORMANCE ANALYTICS HOOKS
// ============================================

export const usePerformanceTimeline = (
  projectId: string,
  params?: { timeRange?: string; granularity?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.performanceTimeline(projectId, params),
    queryFn: () => analyticsService.getPerformanceTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useWebVitalsAnalytics = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.webVitals(projectId, params),
    queryFn: () => analyticsService.getWebVitals(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useResourcePerformance = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.resourcePerformance(projectId, params),
    queryFn: () => analyticsService.getResourcePerformance(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePagePerformance = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pagePerformance(projectId, params),
    queryFn: () => analyticsService.getPagePerformance(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePerformanceScore = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.performanceScore(projectId, params),
    queryFn: () => analyticsService.getPerformanceScore(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useSlowestEndpoints = (
  projectId: string,
  params?: { timeRange?: string; limit?: number }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.slowestEndpoints(projectId, params),
    queryFn: () => analyticsService.getSlowestEndpoints(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// ACTIVITY ANALYTICS HOOKS
// ============================================

export const useActivityFeed = (
  projectId: string,
  params?: { page?: number; limit?: number; level?: string; service?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.activityFeed(projectId, params),
    queryFn: () => analyticsService.getActivityFeed(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useActivityStats = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.activityStats(projectId, params),
    queryFn: () => analyticsService.getActivityStats(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useActivityFilterValues = (projectId: string) => {
  return useQuery({
    queryKey: analyticsQueryKeys.activityFilterValues(projectId),
    queryFn: () => analyticsService.getActivityFilterValues(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useActivityStream = (
  projectId: string,
  params?: { since?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.activityStream(projectId, params),
    queryFn: () => analyticsService.getActivityStream(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// SESSION ANALYTICS HOOKS
// ============================================

export const useSessions = (
  projectId: string,
  params?: { page?: number; limit?: number; timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.sessions(projectId, params),
    queryFn: () => analyticsService.getSessions(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useSessionDetail = (projectId: string, sessionId: string) => {
  return useQuery({
    queryKey: analyticsQueryKeys.sessionDetail(projectId, sessionId),
    queryFn: () => analyticsService.getSessionDetails(projectId, sessionId),
    enabled: !!projectId && !!sessionId,
    staleTime: 30_000,
  });
};

export const useSessionTimeline = (projectId: string, sessionId: string) => {
  return useQuery({
    queryKey: analyticsQueryKeys.sessionTimeline(projectId, sessionId),
    queryFn: () => analyticsService.getSessionTimeline(projectId, sessionId),
    enabled: !!projectId && !!sessionId,
    staleTime: 30_000,
  });
};

export const useSessionStats = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.sessionStats(projectId, params),
    queryFn: () => analyticsService.getSessionStats(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useUserJourneys = (
  projectId: string,
  params?: { timeRange?: string; limit?: number }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.userJourneys(projectId, params),
    queryFn: () => analyticsService.getSessionJourneys(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// ENVIRONMENT ANALYTICS HOOKS
// ============================================

export const useEnvironmentStats = (
  projectId: string,
  params?: { timeRange?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.environmentStats(projectId, params),
    queryFn: () => analyticsService.getEnvironmentStats(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// NETWORK ANALYTICS HOOKS
// ============================================

export const useNetworkOverview = (projectId: string, params?: { timeRange?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.networkOverview(projectId, params),
    queryFn: () => analyticsService.getNetworkOverview(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useNetworkRequests = (
  projectId: string,
  params?: { timeRange?: string; page?: number; limit?: number; status?: string; method?: string; search?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.networkRequests(projectId, params),
    queryFn: () => analyticsService.getNetworkRequests(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useNetworkTimeline = (projectId: string, params?: { timeRange?: string; granularity?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.networkTimeline(projectId, params),
    queryFn: () => analyticsService.getNetworkTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useNetworkTopEndpoints = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.networkTopEndpoints(projectId, params),
    queryFn: () => analyticsService.getNetworkTopEndpoints(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useNetworkSlowest = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.networkSlowest(projectId, params),
    queryFn: () => analyticsService.getNetworkSlowest(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// INTERACTION ANALYTICS HOOKS
// ============================================

export const useInteractionOverview = (projectId: string, params?: { timeRange?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.interactionOverview(projectId, params),
    queryFn: () => analyticsService.getInteractionOverview(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useInteractionTimeline = (projectId: string, params?: { timeRange?: string; granularity?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.interactionTimeline(projectId, params),
    queryFn: () => analyticsService.getInteractionTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useInteractionTopElements = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.interactionTopElements(projectId, params),
    queryFn: () => analyticsService.getInteractionTopElements(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useInteractionMostClicked = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.interactionMostClicked(projectId, params),
    queryFn: () => analyticsService.getInteractionMostClicked(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// CONSOLE ANALYTICS HOOKS
// ============================================

export const useConsoleOverview = (projectId: string, params?: { timeRange?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.consoleOverview(projectId, params),
    queryFn: () => analyticsService.getConsoleOverview(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useConsoleMessages = (
  projectId: string,
  params?: { timeRange?: string; page?: number; limit?: number; level?: string; search?: string }
) => {
  return useQuery({
    queryKey: analyticsQueryKeys.consoleMessages(projectId, params),
    queryFn: () => analyticsService.getConsoleMessages(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const useConsoleTimeline = (projectId: string, params?: { timeRange?: string; granularity?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.consoleTimeline(projectId, params),
    queryFn: () => analyticsService.getConsoleTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

// ============================================
// PAGEVIEW ANALYTICS HOOKS
// ============================================

export const usePageviewOverview = (projectId: string, params?: { timeRange?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pageviewOverview(projectId, params),
    queryFn: () => analyticsService.getPageviewOverview(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePageviewTimeline = (projectId: string, params?: { timeRange?: string; granularity?: string }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pageviewTimeline(projectId, params),
    queryFn: () => analyticsService.getPageviewTimeline(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePageviewTopPages = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pageviewTopPages(projectId, params),
    queryFn: () => analyticsService.getPageviewTopPages(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePageviewReferrers = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pageviewReferrers(projectId, params),
    queryFn: () => analyticsService.getPageviewReferrers(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};

export const usePageviewNavigationFlow = (projectId: string, params?: { timeRange?: string; limit?: number }) => {
  return useQuery({
    queryKey: analyticsQueryKeys.pageviewNavFlow(projectId, params),
    queryFn: () => analyticsService.getPageviewNavigationFlow(projectId, params),
    enabled: !!projectId,
    staleTime: 30_000,
  });
};
