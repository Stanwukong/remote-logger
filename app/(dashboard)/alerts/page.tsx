"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
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
