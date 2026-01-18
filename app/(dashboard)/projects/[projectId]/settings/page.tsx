/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams } from "next/navigation";
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
} from "lucide-react";
import { useProject } from "@/hooks/project.hooks";
import { useState } from "react";
import { toast } from "sonner";
import SDKConfigSettings from "@/components/settings/SDKConfigSettings";

export default function ProjectSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <Button asChild className="mt-4">
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
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Project Settings
          </h1>
          <p className="text-muted-foreground mt-1">{project.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="api">API & Security</TabsTrigger>
          <TabsTrigger value="sdk">SDK Config</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings project={project} />
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team" className="space-y-6">
          <TeamManagement project={project} />
        </TabsContent>

        {/* API & Security */}
        <TabsContent value="api" className="space-y-6">
          <ApiSettings project={project} />
        </TabsContent>

        {/* SDK Config */}
        <TabsContent value="sdk" className="space-y-6">
          <SDKConfigSettings projectId={projectId} />
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettings project={project} />
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedSettings project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ project }: { project: any }) {
  const [name, setName] = useState(project.name);
  const [isActive, setIsActive] = useState(project.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Update your project&apos;s basic information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Project"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Project description..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Project Status</Label>
            <p className="text-sm text-muted-foreground">
              {isActive ? "Project is active" : "Project is inactive"}
            </p>
          </div>
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            <Button variant="outline" size="sm">
              Add Tag
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Team Management Component
function TeamManagement({ project }: { project: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this project
              </CardDescription>
            </div>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Owner */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {project.ownerId.firstName?.[0]}
                    {project.ownerId.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {project.ownerId.firstName} {project.ownerId.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.ownerId.email}
                  </p>
                </div>
              </div>
              <Badge>Owner</Badge>
            </div>

            {/* Team Members */}
            {project.teamMembers?.map((member: any) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="font-semibold">
                      {member.user.firstName?.[0]}
                      {member.user.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {member.role}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// API Settings Component
function ApiSettings({ project }: { project: any }) {
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(project.apiKey);
    toast.success("API key copied to clipboard");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key
          </CardTitle>
          <CardDescription>
            Your project&apos;s API key for log ingestion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={project.apiKey} readOnly className="font-mono" />
            <Button variant="outline" onClick={handleCopyApiKey}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="destructive">Regenerate API Key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>
            Configure rate limits for this project&apos;s API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Max Requests Per Minute</Label>
            <Input
              type="number"
              value={project.rateLimitConfig.maxRequestsPerMinute}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>Burst Limit</Label>
            <Input
              type="number"
              value={project.rateLimitConfig.burstLimit}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Integration Settings Component
function IntegrationSettings({ }: { project: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Slack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Slack
          </CardTitle>
          <CardDescription>Send notifications to Slack</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Configure Slack
          </Button>
        </CardContent>
      </Card>

      {/* Discord */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Discord
          </CardTitle>
          <CardDescription>Send notifications to Discord</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Configure Discord
          </Button>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure email alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Configure Email
          </Button>
        </CardContent>
      </Card>

      {/* Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Webhook</CardTitle>
          <CardDescription>Send data to custom endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Configure Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Advanced Settings Component
function AdvancedSettings({  }: { project: any }) {
  return (
    <div className="space-y-6">
      <Card className="border-yellow-500">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Archive Project</p>
              <p className="text-sm text-muted-foreground">
                Temporarily disable this project
              </p>
            </div>
            <Button variant="outline">Archive</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Transfer Ownership</p>
              <p className="text-sm text-muted-foreground">
                Transfer this project to another user
              </p>
            </div>
            <Button variant="outline">Transfer</Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <p className="font-medium text-destructive">Delete Project</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its data
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
