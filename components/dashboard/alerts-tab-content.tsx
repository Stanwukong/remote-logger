// src/components/dashboard/alerts-tab-content.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Plus } from "lucide-react";
import Link from "next/link";

// Define a type for an individual alert
interface AlertItem {
  id: number;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  project: string;
  time: string;
  count: number;
}

// Define a type for alert summary
interface AlertSummaryData {
  critical: number;
  warning: number;
  info: number;
}

// Define a type for alert rules summary
interface AlertRulesSummaryData {
  activeRules: number;
  triggeredToday: number;
  avgResponseTime: string;
}

interface AlertsTabContentProps {
  activeAlerts: AlertItem[];
  alertSummary: AlertSummaryData;
  alertRulesSummary: AlertRulesSummaryData;
}

export function AlertsTabContent({
  activeAlerts,
  alertSummary,
  alertRulesSummary,
}: AlertsTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Active Alerts</span>
                  </CardTitle>
                  <CardDescription>Current alerts requiring attention</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/alerts">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Rules
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-status-danger"
                            : alert.severity === "warning"
                            ? "bg-status-warn"
                            : "bg-data-info"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.project} • {alert.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.count > 1 && <Badge variant="outline">{alert.count}x</Badge>}
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-status-danger rounded-full" />
                  <span className="font-semibold">{alertSummary.critical}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Warning</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-status-warn rounded-full" />
                  <span className="font-semibold">{alertSummary.warning}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Info</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-data-info rounded-full" />
                  <span className="font-semibold">{alertSummary.info}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Active Rules</span>
                  <span className="font-semibold">{alertRulesSummary.activeRules}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Triggered Today</span>
                  <span className="font-semibold">{alertRulesSummary.triggeredToday}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-semibold">{alertRulesSummary.avgResponseTime}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/alerts/rules">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Example data for parent component
export const defaultActiveAlerts: AlertItem[] = [
  {
    id: 1,
    severity: "critical",
    title: "High Error Rate in API Service",
    description: "Error rate exceeded 5% threshold",
    project: "web-app",
    time: "2 minutes ago",
    count: 15,
  },
  {
    id: 2,
    severity: "warning",
    title: "Memory Usage Above 80%",
    description: "Worker service memory usage is high",
    project: "worker-queue",
    time: "8 minutes ago",
    count: 1,
  },
  {
    id: 3,
    severity: "info",
    title: "Deployment Completed",
    description: "Version 1.2.3 deployed successfully",
    project: "api-service",
    time: "15 minutes ago",
    count: 1,
  },
];

export const defaultAlertSummary: AlertSummaryData = {
  critical: 3,
  warning: 8,
  info: 12,
};

export const defaultAlertRulesSummary: AlertRulesSummaryData = {
  activeRules: 8,
  triggeredToday: 23,
  avgResponseTime: "45s",
};
