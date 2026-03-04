"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  ArrowLeft,
  Key,
  Users,
  Zap,
  Bell,
  Trash2,
  Copy,
  Check,
  Shield,
  Code2,
  Link2,
  AlertTriangle,
  Archive,
  ArrowRightLeft,
  Mail,
  Webhook,
  Loader2,
  Hash,
} from "lucide-react";
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useArchiveProject,
  useRestoreProject,
  useRegenerateApiKey,
  useUpdateRateLimit,
} from "@/hooks/project.hooks";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import SDKConfigSettings from "@/components/settings/SDKConfigSettings";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import type { Project } from "@/types/project.types";

type ProjectData = Project["project"];

export default function ProjectSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-bg-surface rounded animate-pulse" />
        <div className="h-96 bg-bg-surface rounded animate-pulse" />
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6">
        <Card className="bg-bg-surface border-border-subtle">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
              Project not found
            </h3>
            <p className="text-text-muted mb-4">
              The project you are looking for does not exist or has been removed.
            </p>
            <Button variant="signal" asChild className="mt-4">
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { project } = projectData;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-text-muted hover:text-text-primary hover:bg-bg-elevated"
        >
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-signal/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-signal" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
              Project Settings
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <SignalDot
                status={project.isActive ? "ok" : "warn"}
                size="sm"
                pulse={project.isActive}
              />
              <p className="text-sm text-text-secondary">{project.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-bg-elevated border border-border-subtle grid w-full grid-cols-6 h-11 p-1 rounded-lg">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <Settings className="w-3.5 h-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <Users className="w-3.5 h-3.5" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <Shield className="w-3.5 h-3.5" />
            API & Security
          </TabsTrigger>
          <TabsTrigger
            value="sdk"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <Code2 className="w-3.5 h-3.5" />
            SDK Config
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <Link2 className="w-3.5 h-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-bg-surface data-[state=active]:text-signal data-[state=active]:border-b-2 data-[state=active]:border-signal data-[state=active]:shadow-none text-text-muted text-sm gap-1.5 rounded-md"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings project={project} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManagement project={project} />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiSettings project={project} />
        </TabsContent>

        <TabsContent value="sdk" className="space-y-6">
          <SDKConfigSettings projectId={projectId} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettings project={project} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedSettings project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// General Settings
// ---------------------------------------------------------------------------
function GeneralSettings({ project }: { project: ProjectData }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [isActive, setIsActive] = useState(project.isActive);

  const updateProject = useUpdateProject();

  const handleSave = () => {
    updateProject.mutate(
      {
        projectId: project._id,
        projectData: { name, description, isActive },
      },
      {
        onSuccess: () => toast.success("Project settings saved"),
        onError: () => toast.error("Failed to save project settings"),
      }
    );
  };

  return (
    <Card className="bg-bg-surface border-border-subtle">
      <CardHeader>
        <CardTitle className="font-display text-text-primary">
          General Information
        </CardTitle>
        <CardDescription className="text-text-muted">
          Update your project&apos;s basic information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-secondary text-sm">
            Project Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Project"
            className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-text-secondary text-sm">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this project monitors..."
            rows={3}
            className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated border border-border-subtle">
          <div>
            <Label htmlFor="active" className="text-text-primary text-sm font-medium">
              Project Status
            </Label>
            <p className="text-sm text-text-muted mt-0.5">
              {isActive ? (
                <span className="flex items-center gap-1.5">
                  <SignalDot status="ok" size="sm" />
                  Project is active and receiving logs
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <SignalDot status="warn" size="sm" pulse={false} />
                  Project is inactive
                </span>
              )}
            </p>
          </div>
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-text-secondary text-sm">Tags</Label>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-bg-elevated text-text-secondary border-border-subtle"
              >
                <Hash className="w-3 h-3 mr-1 text-text-muted" />
                {tag}
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-border-subtle text-text-muted hover:text-signal hover:border-signal/30"
            >
              Add Tag
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle">
          <Button
            variant="signal"
            onClick={handleSave}
            disabled={updateProject.isPending}
          >
            {updateProject.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Team Management
// ---------------------------------------------------------------------------
function TeamManagement({ project }: { project: ProjectData }) {
  return (
    <Card className="bg-bg-surface border-border-subtle">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-text-primary">
              Team Members
            </CardTitle>
            <CardDescription className="text-text-muted">
              Manage who has access to this project
            </CardDescription>
          </div>
          <Button variant="signal" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Owner */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated border-l-2 border-signal/30 border border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-signal/10 flex items-center justify-center ring-1 ring-signal/20">
                <span className="font-semibold text-sm text-signal">
                  {project.ownerId.firstName?.[0]}
                  {project.ownerId.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {project.ownerId.firstName} {project.ownerId.lastName}
                </p>
                <p className="text-sm text-text-muted">
                  {project.ownerId.email}
                </p>
              </div>
            </div>
            <Badge className="bg-signal/15 text-signal border-signal/20 hover:bg-signal/15">
              Owner
            </Badge>
          </div>

          {/* Team Members */}
          {project.teamMembers?.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-4 rounded-lg bg-bg-surface border border-border-subtle hover:border-border-default transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center ring-1 ring-border-subtle">
                  <span className="font-semibold text-sm text-text-secondary">
                    {member.user.firstName?.[0]}
                    {member.user.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    {member.user.firstName} {member.user.lastName}
                  </p>
                  <p className="text-sm text-text-muted">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.role === "admin" ? (
                  <Badge className="bg-data-info/15 text-data-info border-data-info/20 capitalize hover:bg-data-info/15">
                    {member.role}
                  </Badge>
                ) : (
                  <Badge className="bg-bg-elevated text-text-muted border-border-subtle capitalize hover:bg-bg-elevated">
                    {member.role}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-status-danger hover:bg-status-danger/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {(!project.teamMembers || project.teamMembers.length === 0) && (
            <div className="text-center py-8 text-text-muted">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No team members yet. Invite someone to collaborate.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// API Settings
// ---------------------------------------------------------------------------
function ApiSettings({ project }: { project: ProjectData }) {
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const regenerateApiKey = useRegenerateApiKey();
  const updateRateLimit = useUpdateRateLimit();

  const [maxRequests, setMaxRequests] = useState(
    project.rateLimitConfig.maxRequestsPerMinute
  );
  const [burstLimit, setBurstLimit] = useState(
    project.rateLimitConfig.burstLimit
  );

  const maskedKey = project.apiKey
    ? "****-****-****-" + project.apiKey.slice(-8)
    : "";

  const handleCopyApiKey = useCallback(() => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [project.apiKey]);

  const handleRegenerate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to regenerate the API key? All existing integrations using the current key will stop working."
    );
    if (!confirmed) return;

    regenerateApiKey.mutate(project._id, {
      onSuccess: () => toast.success("API key regenerated successfully"),
      onError: () => toast.error("Failed to regenerate API key"),
    });
  };

  const handleSaveRateLimit = () => {
    updateRateLimit.mutate(
      {
        projectId: project._id,
        rateLimit: { maxRequests, windowInMinutes: 1 },
      },
      {
        onSuccess: () => toast.success("Rate limit updated"),
        onError: () => toast.error("Failed to update rate limit"),
      }
    );
  };

  return (
    <>
      {/* API Key Card */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-text-primary">
            <Key className="w-5 h-5 text-signal" />
            API Key
          </CardTitle>
          <CardDescription className="text-text-muted">
            Your project&apos;s API key for log ingestion via the SDK
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFullKey ? (
            <TerminalBlock
              code={project.apiKey}
              filename="API Key"
              showCopy={true}
            />
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle font-mono text-sm text-text-secondary">
                {maskedKey}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyApiKey}
                className="border-border-subtle text-text-muted hover:text-signal hover:border-signal/30 shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-signal" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullKey(!showFullKey)}
              className="border-border-subtle text-text-secondary hover:text-text-primary"
            >
              {showFullKey ? "Hide Key" : "Reveal Key"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerateApiKey.isPending}
              className="border-status-danger/30 text-status-danger hover:bg-status-danger/10 hover:border-status-danger/50"
            >
              {regenerateApiKey.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Regenerate API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting Card */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-text-primary">
            <Shield className="w-5 h-5 text-data-info" />
            Rate Limiting
          </CardTitle>
          <CardDescription className="text-text-muted">
            Configure rate limits for this project&apos;s API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text-secondary text-sm">
                Max Requests Per Minute
              </Label>
              <Input
                type="number"
                value={maxRequests}
                onChange={(e) => setMaxRequests(Number(e.target.value))}
                className="bg-bg-elevated border-border-subtle text-text-primary focus:border-signal focus:ring-signal/20 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-text-secondary text-sm">
                Burst Limit
              </Label>
              <Input
                type="number"
                value={burstLimit}
                onChange={(e) => setBurstLimit(Number(e.target.value))}
                className="bg-bg-elevated border-border-subtle text-text-primary focus:border-signal focus:ring-signal/20 font-mono"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveRateLimit}
            disabled={updateRateLimit.isPending}
            className="border-border-subtle text-text-secondary hover:text-signal hover:border-signal/30"
          >
            {updateRateLimit.isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Save Rate Limit
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Integration Settings
// ---------------------------------------------------------------------------
interface IntegrationCardData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
}

function IntegrationSettings({ project }: { project: ProjectData }) {
  const integrations: IntegrationCardData[] = [
    {
      id: "slack",
      name: "Slack",
      description: "Send alert notifications to Slack channels",
      icon: <Zap className="w-5 h-5" />,
      connected: false,
    },
    {
      id: "discord",
      name: "Discord",
      description: "Send alert notifications to Discord",
      icon: <Bell className="w-5 h-5" />,
      connected: false,
    },
    {
      id: "email",
      name: "Email Notifications",
      description: "Configure email alerts for critical events",
      icon: <Mail className="w-5 h-5" />,
      connected: false,
    },
    {
      id: "webhook",
      name: "Custom Webhook",
      description: "Send log data to custom HTTP endpoints",
      icon: <Webhook className="w-5 h-5" />,
      connected: false,
    },
  ];

  // Suppress unused variable warning -- project may be used for connected status later
  void project;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((integration) => (
        <Card
          key={integration.id}
          className="bg-bg-surface border-border-subtle hover:border-signal/30 transition-colors duration-200"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center text-signal">
                  {integration.icon}
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-text-primary">
                    {integration.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-text-muted mt-0.5">
                    {integration.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <SignalDot
                  status={integration.connected ? "ok" : "warn"}
                  size="sm"
                  pulse={integration.connected}
                />
                <span className="text-xs text-text-muted">
                  {integration.connected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border-subtle text-text-secondary hover:text-signal hover:border-signal/30 hover:shadow-[0_0_12px_rgba(0,217,126,0.06)] transition-all duration-200"
            >
              Configure {integration.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Advanced Settings (Danger Zone)
// ---------------------------------------------------------------------------
function AdvancedSettings({ project }: { project: ProjectData }) {
  const router = useRouter();
  const archiveProject = useArchiveProject();
  const restoreProject = useRestoreProject();
  const deleteProject = useDeleteProject();

  const handleArchiveToggle = () => {
    if (project.isActive) {
      archiveProject.mutate(project._id, {
        onSuccess: () => toast.success("Project archived successfully"),
        onError: () => toast.error("Failed to archive project"),
      });
    } else {
      restoreProject.mutate(project._id, {
        onSuccess: () => toast.success("Project restored successfully"),
        onError: () => toast.error("Failed to restore project"),
      });
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${project.name}"? This action cannot be undone and all logs will be lost.`
    );
    if (!confirmed) return;

    deleteProject.mutate(
      { projectId: project._id, hardDelete: true },
      {
        onSuccess: () => {
          toast.success("Project deleted permanently");
          router.push("/projects");
        },
        onError: () => toast.error("Failed to delete project"),
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Archive */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-status-warn/10 flex items-center justify-center">
                <Archive className="w-4.5 h-4.5 text-status-warn" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {project.isActive ? "Archive Project" : "Restore Project"}
                </p>
                <p className="text-sm text-text-muted">
                  {project.isActive
                    ? "Temporarily disable this project and stop log ingestion"
                    : "Restore this project and resume log ingestion"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchiveToggle}
              disabled={archiveProject.isPending || restoreProject.isPending}
              className="border-status-warn/30 text-status-warn hover:bg-status-warn/10 hover:border-status-warn/50"
            >
              {(archiveProject.isPending || restoreProject.isPending) && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              {project.isActive ? "Archive" : "Restore"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Ownership */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-data-info/10 flex items-center justify-center">
                <ArrowRightLeft className="w-4.5 h-4.5 text-data-info" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  Transfer Ownership
                </p>
                <p className="text-sm text-text-muted">
                  Transfer this project to another team member
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-data-info/30 text-data-info hover:bg-data-info/10 hover:border-data-info/50"
            >
              Transfer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete */}
      <Card className="bg-status-danger/5 border-status-danger/30">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-status-danger/10 flex items-center justify-center">
                <Trash2 className="w-4.5 h-4.5 text-status-danger" />
              </div>
              <div>
                <p className="font-medium text-status-danger">
                  Delete Project
                </p>
                <p className="text-sm text-text-muted">
                  Permanently delete this project and all associated data
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
