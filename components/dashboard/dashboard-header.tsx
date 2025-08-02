// src/components/dashboard/dashboard-header.tsx
import { Button } from "@/components/ui/button";
import {  Download, RefreshCw } from "lucide-react";
import { NewProjectModal } from "./new-project-modal";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  onExport?: () => void;
  newProjectHref?: string; // Href for the New Project button
}

export function DashboardHeader({
  title,
  description,
  onRefresh,
  onExport,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <NewProjectModal/>
      </div>
    </div>
  );
}
