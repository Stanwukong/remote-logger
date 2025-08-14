// src/app/dashboard/page.tsx
"use client";

import { SystemStatus } from "@/components/system-status";
// import { RealtimeLogStream } from "@/components/realtime-log-stream";
// import { QuickActions } from "@/components/quick-actions";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KeyMetricsGrid } from "@/components/dashboard/key-metrics-grid";
// import {
//   PerformanceMetricsSection,
//   defaultPerformanceMetrics,
// } from "@/components/dashboard/performance-metrics-section";
// import {
//   OverviewTabContent,
//   defaultLogVolumeChartData,
//   defaultErrorDistributionChartData,
// } from "@/components/dashboard/overview-tab-content";
// import {
//   AlertsTabContent,
//   defaultActiveAlerts,
//   defaultAlertSummary,
//   defaultAlertRulesSummary,
// } from "@/components/dashboard/alerts-tab-content";
// import { ProjectsTabContent } from "@/components/dashboard/projects-tab-content";
// import {
//   AnalyticsTabContent,
//   defaultLogLevelsChartData,
//   defaultResponseTimeChartData,
//   defaultTopErrorSources,
//   defaultServicePerformance,
//   defaultUsageStatistics,
// } from "@/components/dashboard/analytics-tab-content";
// import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { useRouter } from "next/navigation";
import EmptyProjectsPage from "@/components/Empty/dashboard";
import { useDashboardData } from "@/hooks/dashboard.hook";
import { HealthStatusWidget } from "@/components/ui/health-status-widget";
// import { HealthStatusGrid } from "@/components/dashboard/health-status-grid";

export default function DashboardPage() {
  const {
    healthStatus,
    metrics,
    performanceMetrics,
    performanceStatus,
    hasData,
    isLoading: projectsLoading,
    isError,
  } = useDashboardData();

  const router = useRouter();
  // console.log(healthStatus, performanceStatus);

  const handleRefresh = () => {
    router.refresh();
  };

  const newMetrics = [...(metrics ?? []), ...(performanceMetrics ?? [])];

  const handleExport = () => {
    console.log("Exporting dashboard data!");
    // Implement data export logic here
  };

  if (projectsLoading) {
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

  if (isError || !hasData) {
    return <EmptyProjectsPage />;
  }

  return (
    <div className="space-y-8 p-6 md:px-8 lg:p-10">
      {/* Header with Actions */}
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your applications."
        onRefresh={handleRefresh}
        onExport={handleExport} // Example: link to a new project creation page
      />

      {/* System Status Banner */}
      <SystemStatus />

      <KeyMetricsGrid metrics={newMetrics} />

      <div className="flex items-center gap-10 w-full">
        <HealthStatusWidget message={healthStatus?.message} status={healthStatus?.status} details={healthStatus?.details}/>
        <HealthStatusWidget {...performanceStatus} />
      </div>

      {/* Main Content Tabs
      <DashboardTabs
        overviewContent={
          <OverviewTabContent
            logVolumeChartData={defaultLogVolumeChartData}
            errorDistributionChartData={defaultErrorDistributionChartData}
          />
        }
        liveLogsContent={<RealtimeLogStream />}
        alertsContent={
          <AlertsTabContent
            activeAlerts={defaultActiveAlerts}
            alertSummary={defaultAlertSummary}
            alertRulesSummary={defaultAlertRulesSummary}
          />
        }
        // projectsContent={<ProjectsTabContent projects={projects} />}
        analyticsContent={
          <AnalyticsTabContent
            logLevelsChartData={defaultLogLevelsChartData}
            responseTimeChartData={defaultResponseTimeChartData}
            topErrorSources={defaultTopErrorSources}
            servicePerformance={defaultServicePerformance}
            usageStatistics={defaultUsageStatistics}
          />
        }
      />

      {/* Quick Actions */}
      {/* <QuickActions /> */}
    </div>
  );
}
