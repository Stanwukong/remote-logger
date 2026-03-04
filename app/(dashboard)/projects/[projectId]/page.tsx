/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/project.hooks";
import { Project } from "@/types/project.types";
import {
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react";
import {
  ProjectDashboardHeader,
  ObservatoryMetricCard,
  OverviewTab,
  ErrorsTabContent,
  PerformanceTabContent,
  UsageTabContent,
  RecommendationsTabContent,
} from "@/components/dashboard/projects/detail";

export default function ProjectDashboard() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-signal" />
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16 bg-bg-surface border border-border-subtle rounded-lg">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Project not found
          </h2>
          <p className="text-text-secondary mt-2">
            The project you are looking for does not exist.
          </p>
          <div className="mt-4">
            <Button variant="signal" asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { project, analytics, recommendations } = projectData as Project;
  const healthScore = recommendations?.healthScore ?? 0;

  const totalRequests = analytics?.performance?.metrics?.totalRequests ?? 0;
  const successfulRequests = analytics?.performance?.metrics?.successfulRequests ?? 0;
  const successRate =
    totalRequests > 0
      ? Math.round((successfulRequests / totalRequests) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <ProjectDashboardHeader
          project={project}
          healthScore={healthScore}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ObservatoryMetricCard
            title="Total Logs"
            value={(analytics?.overview?.totalLogs ?? 0).toLocaleString()}
            subtitle={`${analytics?.overview?.recentLogs ?? 0} recent`}
            icon={FileText}
          />
          <ObservatoryMetricCard
            title="Error Rate"
            value={`${analytics?.overview?.errorRate ?? 0}%`}
            subtitle={`${analytics?.overview?.errorLogs ?? 0} errors`}
            icon={AlertTriangle}
            variant={
              (analytics?.overview?.errorRate ?? 0) > 10
                ? "danger"
                : (analytics?.overview?.errorRate ?? 0) > 5
                ? "warning"
                : "success"
            }
          />
          <ObservatoryMetricCard
            title="Success Rate"
            value={`${successRate}%`}
            subtitle={`${successfulRequests}/${totalRequests}`}
            icon={CheckCircle}
            variant="success"
          />
          <ObservatoryMetricCard
            title="Team Members"
            value={project.teamMembers?.length ?? 0}
            subtitle="Active contributors"
            icon={Users}
          />
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-bg-surface border border-border-subtle p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-bg-elevated data-[state=active]:text-signal rounded-md"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="data-[state=active]:bg-bg-elevated data-[state=active]:text-signal rounded-md"
            >
              Errors
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-bg-elevated data-[state=active]:text-signal rounded-md"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="data-[state=active]:bg-bg-elevated data-[state=active]:text-signal rounded-md"
            >
              Usage
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-bg-elevated data-[state=active]:text-signal rounded-md"
            >
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              analytics={analytics}
              recommendations={recommendations}
              project={project}
            />
          </TabsContent>

          <TabsContent value="errors">
            <ErrorsTabContent
              errors={analytics.errors}
              projectId={project._id}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTabContent
              performance={analytics.performance}
              responseTime={analytics.responseTime}
              usage={analytics.usage}
            />
          </TabsContent>

          <TabsContent value="usage">
            <UsageTabContent
              project={project}
              usage={analytics.usage}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTabContent
              recommendations={recommendations}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
