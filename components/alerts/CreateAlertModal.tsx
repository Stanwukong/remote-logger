/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAlertRule, useEscalationPolicies } from "@/hooks/alerts.hook";
import {
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
  Mail,
  Globe,
  Shield,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { SimpleCondition, CompositeCondition } from "@/services/alert.service";

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Array<{ _id: string; name: string }>;
  defaultProjectId?: string;
}

type ConditionMode = "simple" | "composite";

const DEFAULT_SIMPLE_CONDITION: SimpleCondition = {
  level: "error",
  frequency: 10,
  intervalMinutes: 5,
};

export function CreateAlertModal({
  open,
  onOpenChange,
  projects,
  defaultProjectId,
}: CreateAlertModalProps) {
  const createMutation = useCreateAlertRule();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [isActive, setIsActive] = useState(true);
  const [conditionMode, setConditionMode] = useState<ConditionMode>("simple");

  // Simple condition
  const [simpleCondition, setSimpleCondition] = useState<SimpleCondition>({
    ...DEFAULT_SIMPLE_CONDITION,
  });

  // Composite conditions
  const [compositeOperator, setCompositeOperator] = useState<"AND" | "OR">("AND");
  const [compositeConditions, setCompositeConditions] = useState<SimpleCondition[]>([
    { ...DEFAULT_SIMPLE_CONDITION },
    { level: "fatal" },
  ]);
  const [compositeFrequency, setCompositeFrequency] = useState<number>(5);
  const [compositeInterval, setCompositeInterval] = useState<number>(10);

  // Notification config
  const [notifyChannels, setNotifyChannels] = useState<string[]>(["email"]);
  const [emails, setEmails] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  // Escalation policy
  const [escalationPolicyId, setEscalationPolicyId] = useState<string>("");

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["conditions", "notifications"])
  );

  // Escalation policies for selected project
  const { data: policiesData } = useEscalationPolicies(projectId);
  const policies = policiesData?.data || [];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const toggleChannel = (channel: string) => {
    setNotifyChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const updateCompositeCondition = (index: number, updates: Partial<SimpleCondition>) => {
    setCompositeConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  const addCompositeCondition = () => {
    setCompositeConditions((prev) => [...prev, { level: "warn" }]);
  };

  const removeCompositeCondition = (index: number) => {
    if (compositeConditions.length <= 2) return;
    setCompositeConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setProjectId(defaultProjectId || "");
    setIsActive(true);
    setConditionMode("simple");
    setSimpleCondition({ ...DEFAULT_SIMPLE_CONDITION });
    setCompositeOperator("AND");
    setCompositeConditions([
      { ...DEFAULT_SIMPLE_CONDITION },
      { level: "fatal" },
    ]);
    setCompositeFrequency(5);
    setCompositeInterval(10);
    setNotifyChannels(["email"]);
    setEmails("");
    setSlackWebhookUrl("");
    setWebhookUrl("");
    setEscalationPolicyId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !projectId) return;

    const condition: SimpleCondition | CompositeCondition =
      conditionMode === "simple"
        ? simpleCondition
        : {
            operator: compositeOperator,
            conditions: compositeConditions,
            frequency: compositeFrequency,
            intervalMinutes: compositeInterval,
          };

    const notificationConfig: any = {};
    if (emails.trim()) {
      notificationConfig.emails = emails.split(",").map((e) => e.trim()).filter(Boolean);
    }
    if (slackWebhookUrl.trim()) {
      notificationConfig.slackWebhookUrl = slackWebhookUrl.trim();
    }
    if (webhookUrl.trim()) {
      notificationConfig.webhookUrl = webhookUrl.trim();
    }

    const ruleData: any = {
      name,
      projectId,
      condition,
      isActive,
      notifyChannels,
      notificationConfig,
    };

    if (description.trim()) {
      ruleData.description = description.trim();
    }
    if (escalationPolicyId) {
      ruleData.escalationPolicyId = escalationPolicyId;
    }

    createMutation.mutate(
      { data: ruleData },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-display">
            <Zap className="h-5 w-5 text-[var(--signal)]" />
            Create Alert Rule
          </DialogTitle>
          <DialogDescription className="text-[var(--text-tertiary)]">
            Configure conditions and notifications for automated alerting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Basic Info */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--text-secondary)]">
                Rule Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., High Error Rate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[var(--text-secondary)]">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what this rule monitors..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)]">Project</Label>
                <Select value={projectId} onValueChange={setProjectId} required>
                  <SelectTrigger className="bg-[var(--bg-void)] border-[var(--border-subtle)]">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)]">Status</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-md bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <span className="text-sm text-[var(--text-secondary)]">
                    {isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conditions Section */}
          <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("conditions")}
              className="w-full flex items-center justify-between p-3 bg-[var(--bg-base)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--status-warn)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Trigger Conditions
                </span>
              </div>
              {expandedSections.has("conditions") ? (
                <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />
              )}
            </button>

            {expandedSections.has("conditions") && (
              <div className="p-4 space-y-4 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={conditionMode === "simple" ? "default" : "outline"}
                    onClick={() => setConditionMode("simple")}
                    className={
                      conditionMode === "simple"
                        ? "bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
                        : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    }
                  >
                    Simple
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={conditionMode === "composite" ? "default" : "outline"}
                    onClick={() => setConditionMode("composite")}
                    className={
                      conditionMode === "composite"
                        ? "bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
                        : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    }
                  >
                    Composite (AND/OR)
                  </Button>
                </div>

                {conditionMode === "simple" ? (
                  <SimpleConditionEditor
                    condition={simpleCondition}
                    onChange={setSimpleCondition}
                  />
                ) : (
                  <div className="space-y-3">
                    {/* Operator */}
                    <div className="flex items-center gap-3">
                      <Label className="text-[var(--text-secondary)] text-sm">
                        Match
                      </Label>
                      <Select
                        value={compositeOperator}
                        onValueChange={(v) => setCompositeOperator(v as "AND" | "OR")}
                      >
                        <SelectTrigger className="w-[100px] bg-[var(--bg-void)] border-[var(--border-subtle)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">ALL (AND)</SelectItem>
                          <SelectItem value="OR">ANY (OR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-[var(--text-tertiary)]">
                        of the following conditions
                      </span>
                    </div>

                    {/* Sub-conditions */}
                    {compositeConditions.map((cond, i) => (
                      <div
                        key={i}
                        className="relative p-3 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-void)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="border-[var(--signal)]/30 text-[var(--signal)] text-xs"
                          >
                            Condition {i + 1}
                          </Badge>
                          {compositeConditions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeCompositeCondition(i)}
                              className="text-[var(--text-tertiary)] hover:text-[var(--status-danger)] transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <SimpleConditionEditor
                          condition={cond}
                          onChange={(updated) => updateCompositeCondition(i, updated)}
                          compact
                        />
                        {i < compositeConditions.length - 1 && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                            <Badge className="bg-[var(--bg-surface)] text-[var(--signal)] border border-[var(--signal)]/30 text-xs">
                              {compositeOperator}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCompositeCondition}
                      className="border-dashed border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--signal)] hover:border-[var(--signal)]"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Condition
                    </Button>

                    {/* Global frequency/interval for composite */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--text-tertiary)]">
                          Frequency Threshold
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={compositeFrequency}
                          onChange={(e) =>
                            setCompositeFrequency(parseInt(e.target.value) || 1)
                          }
                          className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--text-tertiary)]">
                          Interval (minutes)
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          value={compositeInterval}
                          onChange={(e) =>
                            setCompositeInterval(parseInt(e.target.value) || 1)
                          }
                          className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("notifications")}
              className="w-full flex items-center justify-between p-3 bg-[var(--bg-base)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--data-info)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Notifications
                </span>
                {notifyChannels.length > 0 && (
                  <Badge
                    variant="outline"
                    className="border-[var(--data-info)]/30 text-[var(--data-info)] text-xs"
                  >
                    {notifyChannels.length} channel{notifyChannels.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              {expandedSections.has("notifications") ? (
                <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />
              )}
            </button>

            {expandedSections.has("notifications") && (
              <div className="p-4 space-y-4 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
                {/* Channel toggles */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "email", label: "Email", icon: Mail },
                    { id: "slack", label: "Slack", icon: Zap },
                    { id: "webhook", label: "Webhook", icon: Globe },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleChannel(id)}
                      className={`
                        px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                        border flex items-center gap-2
                        ${
                          notifyChannels.includes(id)
                            ? "bg-[var(--signal)]/10 border-[var(--signal)] text-[var(--signal)]"
                            : "bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--signal)]"
                        }
                      `}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Email config */}
                {notifyChannels.includes("email") && (
                  <div className="space-y-1">
                    <Label className="text-xs text-[var(--text-tertiary)]">
                      Email Recipients (comma-separated)
                    </Label>
                    <Input
                      placeholder="team@example.com, alerts@example.com"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] h-8 text-sm"
                    />
                  </div>
                )}

                {/* Slack config */}
                {notifyChannels.includes("slack") && (
                  <div className="space-y-1">
                    <Label className="text-xs text-[var(--text-tertiary)]">
                      Slack Webhook URL
                    </Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                      className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] h-8 text-sm font-mono"
                    />
                  </div>
                )}

                {/* Webhook config */}
                {notifyChannels.includes("webhook") && (
                  <div className="space-y-1">
                    <Label className="text-xs text-[var(--text-tertiary)]">
                      Webhook URL
                    </Label>
                    <Input
                      placeholder="https://your-server.com/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] h-8 text-sm font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Escalation Policy Section */}
          <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("escalation")}
              className="w-full flex items-center justify-between p-3 bg-[var(--bg-base)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--data-purple)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Escalation Policy
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">Optional</span>
              </div>
              {expandedSections.has("escalation") ? (
                <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[var(--text-tertiary)]" />
              )}
            </button>

            {expandedSections.has("escalation") && (
              <div className="p-4 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
                {!projectId ? (
                  <p className="text-sm text-[var(--text-tertiary)]">
                    Select a project first to see available policies.
                  </p>
                ) : policies.length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)]">
                    No escalation policies configured for this project. Create one in the Escalation Policies tab.
                  </p>
                ) : (
                  <Select
                    value={escalationPolicyId}
                    onValueChange={setEscalationPolicyId}
                  >
                    <SelectTrigger className="bg-[var(--bg-void)] border-[var(--border-subtle)]">
                      <SelectValue placeholder="None (no escalation)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {policies.map((policy) => (
                        <SelectItem key={policy._id} value={policy._id}>
                          {policy.name} ({policy.levels.length} level
                          {policy.levels.length > 1 ? "s" : ""})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--border-subtle)] text-[var(--text-secondary)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !name || !projectId}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Rule"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Simple Condition Editor (reusable)
// ============================================

function SimpleConditionEditor({
  condition,
  onChange,
  compact = false,
}: {
  condition: SimpleCondition;
  onChange: (updated: SimpleCondition) => void;
  compact?: boolean;
}) {
  const update = (field: keyof SimpleCondition, value: any) => {
    onChange({ ...condition, [field]: value });
  };

  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2"}`}>
      {/* Level */}
      <div className="space-y-1">
        <Label className="text-xs text-[var(--text-tertiary)]">Log Level</Label>
        <Select
          value={condition.level || ""}
          onValueChange={(v) => update("level", v)}
        >
          <SelectTrigger className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm">
            <SelectValue placeholder="Any level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trace">Trace</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="fatal">Fatal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Keyword */}
      <div className="space-y-1">
        <Label className="text-xs text-[var(--text-tertiary)]">Keyword</Label>
        <Input
          placeholder="Optional keyword match"
          value={condition.keyword || ""}
          onChange={(e) => update("keyword", e.target.value || undefined)}
          className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
        />
      </div>

      {/* Frequency */}
      {!compact && (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--text-tertiary)]">
            Frequency Threshold
          </Label>
          <Input
            type="number"
            min={1}
            placeholder="10"
            value={condition.frequency ?? ""}
            onChange={(e) =>
              update("frequency", e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
          />
        </div>
      )}

      {/* Interval */}
      {!compact && (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--text-tertiary)]">
            Interval (minutes)
          </Label>
          <Input
            type="number"
            min={1}
            placeholder="5"
            value={condition.intervalMinutes ?? ""}
            onChange={(e) =>
              update(
                "intervalMinutes",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
          />
        </div>
      )}

      {/* Service */}
      <div className="space-y-1">
        <Label className="text-xs text-[var(--text-tertiary)]">Service</Label>
        <Input
          placeholder="Any service"
          value={condition.service || ""}
          onChange={(e) => update("service", e.target.value || undefined)}
          className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
        />
      </div>

      {/* Environment */}
      <div className="space-y-1">
        <Label className="text-xs text-[var(--text-tertiary)]">Environment</Label>
        <Select
          value={condition.environment || "any"}
          onValueChange={(v) => update("environment", v === "any" ? undefined : v)}
        >
          <SelectTrigger className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Type */}
      {!compact && (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--text-tertiary)]">Event Type</Label>
          <Select
            value={condition.eventType || "any"}
            onValueChange={(v) => update("eventType", v === "any" ? undefined : v)}
          >
            <SelectTrigger className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="console">Console</SelectItem>
              <SelectItem value="interaction">Interaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Response Time Threshold */}
      {!compact && (
        <div className="space-y-1">
          <Label className="text-xs text-[var(--text-tertiary)]">
            Response Time (ms)
          </Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g., 3000"
            value={condition.responseTimeThreshold ?? ""}
            onChange={(e) =>
              update(
                "responseTimeThreshold",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] h-8 text-sm"
          />
        </div>
      )}
    </div>
  );
}
