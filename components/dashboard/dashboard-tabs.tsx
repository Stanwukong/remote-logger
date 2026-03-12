"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface DashboardTabsProps {
  overviewContent: React.ReactNode;
  errorsContent: React.ReactNode;
  performanceContent: React.ReactNode;
  usageContent: React.ReactNode;
  defaultValue?: string;
}

export function DashboardTabs({
  overviewContent,
  errorsContent,
  performanceContent,
  usageContent,
  defaultValue = "overview",
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
      <TabsList className="bg-bg-elevated border border-border-subtle rounded-lg p-1 h-auto w-fit">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-signal/10 data-[state=active]:text-signal data-[state=active]:border-signal/30 data-[state=active]:shadow-none rounded-md px-4 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="errors"
          className="data-[state=active]:bg-signal/10 data-[state=active]:text-signal data-[state=active]:border-signal/30 data-[state=active]:shadow-none rounded-md px-4 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          Errors
        </TabsTrigger>
        <TabsTrigger
          value="performance"
          className="data-[state=active]:bg-signal/10 data-[state=active]:text-signal data-[state=active]:border-signal/30 data-[state=active]:shadow-none rounded-md px-4 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          Performance
        </TabsTrigger>
        <TabsTrigger
          value="usage"
          className="data-[state=active]:bg-signal/10 data-[state=active]:text-signal data-[state=active]:border-signal/30 data-[state=active]:shadow-none rounded-md px-4 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          Usage
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">{overviewContent}</TabsContent>
      <TabsContent value="errors" className="mt-6">{errorsContent}</TabsContent>
      <TabsContent value="performance" className="mt-6">{performanceContent}</TabsContent>
      <TabsContent value="usage" className="mt-6">{usageContent}</TabsContent>
    </Tabs>
  );
}
