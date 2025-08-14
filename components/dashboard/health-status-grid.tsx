// src/components/dashboard/key-metrics-grid.tsx
// import { SummaryWidget } from "@/components/summary-widget"; // Assuming this is an existing component
// import { Activity, AlertTriangle, Zap, Users, LucideIcon } from "lucide-react";
import {
  HealthStatusWidget,
  HealthStatusWidgetProps,
} from "../ui/health-status-widget";

interface HealthStatusGridProps {
  statuses: HealthStatusWidgetProps[];
}

export function HealthStatusGrid({ statuses }: HealthStatusGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map((status, index) => (
        <HealthStatusWidget key={index} {...status} />
      ))}
    </div>
  );
}
