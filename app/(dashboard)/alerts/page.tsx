"use client";

import { useState, useMemo, useEffect } from "react";
import { useState } from "react";
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
import { useAlerts, useAlertStats, useUserAlerts, useUserAlertStats } from "@/hooks/alerts.hook";

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

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "High Error Rate Detected",
    message: "Error rate has exceeded 5% threshold in the last 10 minutes",
    severity: "critical",
    status: "active",
    project: "web-app",
    environment: "production",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:35:00Z",
    tags: ["error-rate", "performance"],
    source: "monitoring",
    count: 47,
    lastTriggered: "2024-01-15T10:35:00Z",
  },
  {
    id: "2",
    title: "Memory Usage Warning",
    message: "Memory usage has reached 85% on server instance",
    severity: "warning",
    status: "acknowledged",
    project: "api-service",
    environment: "production",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T09:20:00Z",
    tags: ["memory", "infrastructure"],
    source: "system",
    count: 12,
    lastTriggered: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    title: "Database Connection Pool Exhausted",
    message:
      "All database connections are in use, new requests are being queued",
    severity: "critical",
    status: "active",
    project: "api-service",
    environment: "production",
    createdAt: "2024-01-15T08:45:00Z",
    updatedAt: "2024-01-15T10:32:00Z",
    tags: ["database", "performance"],
    source: "application",
    count: 23,
    lastTriggered: "2024-01-15T10:32:00Z",
  },
  {
    id: "4",
    title: "SSL Certificate Expiring Soon",
    message: "SSL certificate for api.company.com will expire in 7 days",
    severity: "info",
    status: "snoozed",
    project: "infrastructure",
    environment: "production",
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    tags: ["ssl", "security"],
    source: "security-scan",
    count: 1,
    lastTriggered: "2024-01-15T00:00:00Z",
  },
  {
    id: "5",
    title: "Slow Query Performance",
    message: "Database query execution time exceeded 2 seconds",
    severity: "info",
    status: "resolved",
    project: "web-app",
    environment: "production",
    createdAt: "2024-01-14T16:20:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    tags: ["database", "performance"],
    source: "monitoring",
    count: 8,
    lastTriggered: "2024-01-14T18:45:00Z",
  },
  {
    id: "6",
    title: "Disk Space Low",
    message: "Available disk space is below 10% on log server",
    severity: "critical",
    status: "active",
    project: "infrastructure",
    environment: "production",
    createdAt: "2024-01-15T07:30:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
    tags: ["disk-space", "infrastructure"],
    source: "system",
    count: 5,
    lastTriggered: "2024-01-15T10:15:00Z",
  },
];

export default function AlertsPage() {
  // Projects to derive selected project
  const { data: projectsResp, isLoading: projectsLoading, isError: projectsError, refetch: refetchProjects } = useProjects();
  const projects = (projectsResp as any)?.data || [];
  console.log("PROJECTS: ", projects)

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
                  {projects.map((project) => (
                    <SelectItem key={project} value={project._id}>
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
import {
  Bell,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { CreateAlertModal } from "@/components/alerts/CreateAlertModal";
import { AlertRuleCard } from "@/components/alerts/AlertRuleCard";
import { useAlertRules } from "@/hooks/useAlerts";
import { useProjects } from "@/hooks/project.hooks";

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: projectsData } = useProjects();
  const projects = projectsData?.data || [];

  // For now, we'll show a message if no project is selected
  const selectedProject = projects.find((p) => p._id === projectFilter);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Alert Rules
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure alert rules to get notified when specific conditions are
            met
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Alert Rule
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search alert rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Rules
                </p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Rules
                </p>
                <p className="text-3xl font-bold mt-2 text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Triggered (24h)
                </p>
                <p className="text-3xl font-bold mt-2 text-orange-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Rules List */}
      {projectFilter === "all" || !selectedProject ? (
        <Card>
          <CardHeader>
            <CardTitle>Select a Project</CardTitle>
            <CardDescription>
              Please select a project from the filter above to view and manage
              alert rules
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Alert Rules for {selectedProject.name}
          </h2>
          <AlertRulesContent
            projectId={selectedProject._id}
            apiKey={selectedProject.apiKey}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </div>
      )}

      {/* Create Alert Modal */}
      <CreateAlertModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projects={projects}
      />
    </div>
  );
}

// Separate component for alert rules content
function AlertRulesContent({
  projectId,
  apiKey,
  searchTerm,
  statusFilter,
}: {
  projectId: string;
  apiKey: string;
  searchTerm: string;
  statusFilter: string;
}) {
  const { data: alertRules, isLoading } = useAlertRules(projectId, apiKey);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!alertRules || alertRules.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No alert rules yet</h3>
          <p className="text-muted-foreground">
            Create your first alert rule to get notified about important events
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredRules = alertRules.filter((rule) => {
    const matchesSearch = rule.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rule.isActive) ||
      (statusFilter === "inactive" && !rule.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRules.map((rule) => (
        <AlertRuleCard
          key={rule._id}
          rule={rule}
          projectId={projectId}
          apiKey={apiKey}
        />
      ))}
    </div>
  );
}
