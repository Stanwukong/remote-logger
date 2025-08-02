// src/components/dashboard/dashboard-tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface DashboardTabsProps {
  // Each tab content is passed as a ReactNode, allowing flexibility
  overviewContent: React.ReactNode;
  liveLogsContent: React.ReactNode;
  alertsContent: React.ReactNode;
  projectsContent: React.ReactNode;
  analyticsContent: React.ReactNode;
  defaultValue?: string; // Default active tab
}

export function DashboardTabs({
  overviewContent,
  liveLogsContent,
  alertsContent,
  projectsContent,
  analyticsContent,
  defaultValue = "overview",
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 max-w-2xl">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="logs">Live Logs</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">{overviewContent}</TabsContent>
      <TabsContent value="logs">{liveLogsContent}</TabsContent>
      <TabsContent value="alerts">{alertsContent}</TabsContent>
      <TabsContent value="projects">{projectsContent}</TabsContent>
      <TabsContent value="analytics">{analyticsContent}</TabsContent>
    </Tabs>
  );
}
