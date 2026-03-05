"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Link2,
  Loader2,
  Zap,
  Mail,
  Webhook,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { useProject, useUpdateProject } from "@/hooks/project.hooks";
import { toast } from "sonner";
import { SignalDot } from "@/components/shared/SignalDot";

export default function IntegrationSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-8 w-48 bg-bg-surface rounded animate-pulse" />
        <div className="h-64 bg-bg-surface rounded animate-pulse" />
      </div>
    );
  }

  const project = projectData?.project;

  if (!project) {
    return (
      <div className="max-w-2xl">
        <Card className="bg-bg-surface border-border-subtle">
          <CardContent className="p-12 text-center">
            <p className="text-text-muted">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { apiClient } = await import("@/services/config");
      await apiClient.put(`/projects/${projectId}/integration-settings`, {
        slack: { webhookUrl: slackWebhookUrl || undefined },
        email: {
          recipients: emailRecipients
            ? emailRecipients.split(",").map((e) => e.trim())
            : [],
        },
        webhook: { url: webhookUrl || undefined },
      });
      toast.success("Integration settings saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save integration settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-signal" />
          </div>
          Integrations
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Connect external services for notifications and data export
        </p>
      </div>

      {/* Slack */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center text-signal">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-text-primary">
                  Slack
                </CardTitle>
                <CardDescription className="text-xs text-text-muted mt-0.5">
                  Send alert notifications to a Slack channel
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <SignalDot
                status={slackWebhookUrl ? "ok" : "warn"}
                size="sm"
                pulse={!!slackWebhookUrl}
              />
              <span className="text-xs text-text-muted">
                {slackWebhookUrl ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="slackUrl" className="text-text-secondary text-sm">
              Webhook URL
            </Label>
            <Input
              id="slackUrl"
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20 font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Email */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-data/10 flex items-center justify-center text-data">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-text-primary">
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-xs text-text-muted mt-0.5">
                  Send alerts to email addresses
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <SignalDot
                status={emailRecipients ? "ok" : "warn"}
                size="sm"
                pulse={!!emailRecipients}
              />
              <span className="text-xs text-text-muted">
                {emailRecipients ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="emailRecipients" className="text-text-secondary text-sm">
              Recipients
            </Label>
            <Input
              id="emailRecipients"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="dev@example.com, ops@example.com"
              className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20"
            />
            <p className="text-xs text-text-muted">
              Separate multiple emails with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generic Webhook */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-status-warn/10 flex items-center justify-center text-status-warn">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-text-primary">
                  Custom Webhook
                </CardTitle>
                <CardDescription className="text-xs text-text-muted mt-0.5">
                  Send log data to a custom HTTP endpoint
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <SignalDot
                status={webhookUrl ? "ok" : "warn"}
                size="sm"
                pulse={!!webhookUrl}
              />
              <span className="text-xs text-text-muted">
                {webhookUrl ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl" className="text-text-secondary text-sm">
              Webhook URL
            </Label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-service.com/webhook"
              className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-signal focus:ring-signal/20 font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="signal" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Save Integration Settings
        </Button>
      </div>
    </div>
  );
}
