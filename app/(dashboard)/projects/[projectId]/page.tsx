"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AlertTriangle,
  Users,
  Network,
  Terminal,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { mockProjects, generateMockLogs } from "@/lib/mock-data";
import type { Project, LogEntry } from "@/types/analytics";
import { ProjectHeader } from "@/components/dashboard/projects/ProjectHeader";
import { ProjectStats } from "@/components/dashboard/projects/ProjectsStats";
import { ErrorsTab } from "@/components/dashboard/projects/ErrorsTab";
import { PerformanceTab } from "@/components/dashboard/projects/PerformanceTab";
import { UserActivityTab } from "@/components/dashboard/projects/UserActivityTab";
import { NetworkTab } from "@/components/dashboard/projects/NetworkTab";
import { ConsoleLogsTab } from "@/components/dashboard/projects/ConsoleLogsTab";
import { useParams } from "next/navigation";



export default function ProjectDashboard() {
  const params = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState("errors");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true);
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundProject = mockProjects.find(
          (p) => p.id === params.projectId
        );
        setProject(foundProject || null);

        if (foundProject) {
          setLogs(generateMockLogs(params.projectId, 100));
        }
      } catch (error) {
        console.error("Failed to load project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [params.projectId]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <h2 className="text-xl md:text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/analytics">Back to Overview</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <ProjectHeader
        project={project}
        allProjects={mockProjects}
        currentProjectId={params.projectId}
      />

      <ProjectStats project={project} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-fit">
            <TabsTrigger
              value="errors"
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Errors</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <Network className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
            <TabsTrigger
              value="console"
              className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <Terminal className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Console</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="errors">
          <ErrorsTab logs={logs} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="activity">
          <UserActivityTab />
        </TabsContent>

        <TabsContent value="network">
          <NetworkTab />
        </TabsContent>

        <TabsContent value="console">
          <ConsoleLogsTab logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
