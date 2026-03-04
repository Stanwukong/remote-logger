"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SystemStatus } from "@/components/system-status";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KeyMetricsGrid } from "@/components/dashboard/key-metrics-grid";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { OverviewTabContent } from "@/components/dashboard/overview-tab-content";
import { ErrorsTabContent } from "@/components/dashboard/errors-tab-content";
import { PerformanceTabContent } from "@/components/dashboard/performance-tab-content";
import { UsageTabContent } from "@/components/dashboard/usage-tab-content";
import { HealthStatusWidget } from "@/components/ui/health-status-widget";
import EmptyProjectsPage from "@/components/Empty/dashboard";
import { useDashboardData } from "@/hooks/dashboard.hook";
import { PerformanceData } from "@/types/dashboard";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("24h");

  const {
    overview,
    performance,
    healthStatus,
    metrics,
    performanceMetrics,
    performanceStatus,
    hasData,
    isLoading: projectsLoading,
    isError,
  } = useDashboardData();

  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  const newMetrics = [...metrics, ...performanceMetrics];

  const handleExport = () => {
    // Export logic placeholder
  };

  if (projectsLoading) {
    return (
      <div className="space-y-8 p-6 md:px-8 lg:p-10 animate-pulse">
        <div className="h-8 bg-bg-surface rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-surface rounded-xl border border-border-subtle" />
          ))}
        </div>
        <div className="h-96 bg-bg-surface rounded-xl border border-border-subtle" />
      </div>
    );
  }

  if (isError || !hasData) {
    return <EmptyProjectsPage />;
  }

  const overviewData = overview.data ?? null;
  const performanceData = (performance.data as PerformanceData) ?? null;

  return (
    <div className="space-y-8 p-6 md:px-8 lg:p-10">
      {/* Header with Actions */}
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your applications."
        onRefresh={handleRefresh}
        onExport={handleExport}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* System Status Banner */}
      <SystemStatus />

      {/* Key Metrics Grid */}
      <KeyMetricsGrid metrics={newMetrics} />

      {/* Health Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HealthStatusWidget
          message={healthStatus?.message}
          status={healthStatus?.status}
          details={healthStatus?.details}
        />
        <HealthStatusWidget {...performanceStatus} />
      </div>

      {/* Main Content Tabs */}
      <DashboardTabs
        overviewContent={<OverviewTabContent overviewData={overviewData} />}
        errorsContent={<ErrorsTabContent overviewData={overviewData} />}
        performanceContent={<PerformanceTabContent performanceData={performanceData} />}
        usageContent={<UsageTabContent overviewData={overviewData} performanceData={performanceData} />}
      />
    </div>
  );
}
