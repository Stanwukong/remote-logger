import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { NewProjectModal } from "./new-project-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  onExport?: () => void;
  timeRange?: string;
  onTimeRangeChange?: (value: string) => void;
}

export function DashboardHeader({
  title,
  description,
  onRefresh,
  onExport,
  timeRange = "24h",
  onTimeRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="text-text-secondary">{description}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger size="sm" className="font-mono text-xs">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="6h">Last 6h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7d</SelectItem>
            <SelectItem value="30d">Last 30d</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <NewProjectModal />
      </div>
    </div>
  );
}
