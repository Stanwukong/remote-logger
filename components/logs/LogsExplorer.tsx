"use client";

import { EnhancedLogExplorer } from "./enhanced/EnhancedLogExplorer";
import { useProjects } from "@/hooks/project.hooks";
import { useMemo } from "react";
import EmptyLogsPage from "../Empty/logs";
import { Loader2 } from "lucide-react";

export default function LogsExplorerContent() {
  const { data: projectsResponse, isLoading: isProjectsLoading } = useProjects();

  const projects = useMemo(() => {
    return projectsResponse?.data ?? [];
  }, [projectsResponse?.data]);

  const hasProjects = projects.length > 0;

  if (!hasProjects && !isProjectsLoading) {
    return <EmptyLogsPage />;
  }

  if (isProjectsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-signal" />
          <p className="text-sm text-text-muted">Loading projects...</p>
        </div>
      </div>
    );
  }

  return <EnhancedLogExplorer />;
}
