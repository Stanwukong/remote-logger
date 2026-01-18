"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Eye,
  Edit,
  Archive,
  RefreshCw,
} from "lucide-react";
import { AlertsStats } from "@/components/alerts/alerts-stats";
import { CreateAlertModal } from "@/components/alerts/create-alert-model";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { EmptyState } from "@/components/Empty/empty-state";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useProjects } from "@/hooks/project.hooks";
import { useAlerts, useAlertStats } from "@/hooks/alerts.hook";

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "info" | "warning";
  status: "active" | "acknowledged" | "resolved" | "snoozed";
  project: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  environment: string;
  source: string;
  count: number;
  lastTriggered: string;
}

export default function AlertsPage() {
  // Projects to derive selected project
  const { data: projectsResp, isLoading: projectsLoading, isError: projectsError, refetch: refetchProjects } = useProjects();
  const projects = (projectsResp as any)?.data || [];

  // API alerts & stats
  const { data: alertsResp, isLoading: alertsLoading, isError: alertsError, refetch: refetchAlerts } = useAlerts();
  const { data: statsResp, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useAlertStats();

  // Map API alerts to existing shape for rendering parts that expect it
  const apiAlertsRaw = (alertsResp as any)?.data || [];
  const apiAlertsAsLegacy: Alert[] = apiAlertsRaw.map((a: any) => ({
    id: a._id,
    title: a.title,
    message: a.message,
    severity: a.severity,
    status: a.status,
    project: a.projectId || "",
    createdAt: a.triggeredAt,
    updatedAt: a.updatedAt,
    tags: a.tags || [],
    environment: a.environment || "",
    source: a.metadata?.source || "",
    count: a.metadata?.count || 0,
    lastTriggered: a.triggeredAt,
  }));

  const [alerts, setAlerts] = useState<Alert[]>(apiAlertsAsLegacy.length ? apiAlertsAsLegacy : []);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.project.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || alert.status === statusFilter;
      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;
      const matchesProject =
        projectFilter === "all" || alert.project === projectFilter;
      const matchesTab = activeTab === "all" || alert.status === activeTab;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity &&
        matchesProject &&
        matchesTab
      );
    });
  }, [
    alerts,
    searchQuery,
    statusFilter,
    severityFilter,
    projectFilter,
    activeTab,
  ]);

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((alert) => alert.id));
    }
  };

  const handleStatusChange = (alertId: string, newStatus: Alert["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: newStatus, updatedAt: new Date().toISOString() }
          : alert
      )
    );
  };

  const handleBulkStatusChange = (newStatus: Alert["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        selectedAlerts.includes(alert.id)
          ? { ...alert, status: newStatus, updatedAt: new Date().toISOString() }
          : alert
      )
    );
    setSelectedAlerts([]);
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    setSelectedAlerts((prev) => prev.filter((id) => id !== alertId));
  };

  const handleBulkDelete = () => {
    setAlerts((prev) =>
      prev.filter((alert) => !selectedAlerts.includes(alert.id))
    );
    setSelectedAlerts([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800 border-red-200";
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "snoozed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <Bell className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage your system alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => { refetchAlerts(); refetchStats(); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-10"><LoadingSpinner /></div>
      ) : statsError ? (
        <ErrorState title="Failed to load stats" action={<Button variant="outline" onClick={() => refetchStats()}>Retry</Button>} />
      ) : (
        <AlertsStats alerts={alerts} apiStats={(statsResp as any)?.data} />
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="flex flex-col lg:flex-row gap-4 border-none shadow-none">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-800">
                  {selectedAlerts.length} alert
                  {selectedAlerts.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("acknowledged")}
                >
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("resolved")}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("snoozed")}
                >
                  Snooze
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({alerts.filter((a) => a.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged">
            Acknowledged (
            {alerts.filter((a) => a.status === "acknowledged").length})
          </TabsTrigger>
          <TabsTrigger value="snoozed">
            Snoozed ({alerts.filter((a) => a.status === "snoozed").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({alerts.filter((a) => a.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alerts</CardTitle>
                  <CardDescription>
                    {filteredAlerts.length} alert
                    {filteredAlerts.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={
                      selectedAlerts.length === filteredAlerts.length &&
                      filteredAlerts.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select all
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {projectsLoading || alertsLoading ? (
                <div className="flex items-center justify-center py-12"><LoadingSpinner size="large" /></div>
              ) : projectsError || alertsError ? (
                <ErrorState title="Failed to load alerts" action={<Button variant="outline" onClick={() => { refetchProjects(); refetchAlerts(); }}>Retry</Button>} />
              ) : filteredAlerts.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={Bell}
                    title="No alerts found"
                    description="There are no alerts for the selected filters. Create a rule or adjust filters to see results."
                    actionLabel="Create Alert Rule"
                    onAction={() => setCreateModalOpen(true)}
                  />
                </div>
              ) : (
              <div className="divide-y">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedAlerts.includes(alert.id)}
                        onCheckedChange={() => handleSelectAlert(alert.id)}
                      />
                      <div className="flex-shrink-0">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {alert.title}
                              </h3>
                              <Badge
                                className={getSeverityColor(alert.severity)}
                              >
                                {alert.severity}
                              </Badge>
                              <Badge className={getStatusColor(alert.status)}>
                                {alert.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">
                              {alert.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTimeAgo(alert.lastTriggered)}
                              </span>
                              <span>Project: {alert.project}</span>
                              <span>Environment: {alert.environment}</span>
                              <span>Count: {alert.count}</span>

                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {alert.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAlert(alert);
                                  setDetailsModalOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Alert
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(alert.id, "acknowledged")
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Acknowledge
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(alert.id, "resolved")
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resolve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(alert.id, "snoozed")
                                }
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Snooze
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateAlertModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onAlertRuleCreated={() => {
          setCreateModalOpen(false);
        }}
      />

      <AlertDetailsModal
        alert={selectedAlert}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
