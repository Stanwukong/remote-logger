/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Mail,
  Zap,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useProjects } from "@/hooks/project.hooks";
import {
  useEscalationPolicies,
  useCreateEscalationPolicy,
  useUpdateEscalationPolicy,
  useDeleteEscalationPolicy,
} from "@/hooks/alerts.hook";
import { EscalationLevel, EscalationPolicy } from "@/services/alert.service";
import { AlertsNavigation } from "@/components/alerts/AlertsNavigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SignalDot } from "@/components/shared/SignalDot";

const DEFAULT_LEVEL: EscalationLevel = {
  level: 1,
  delayMinutes: 15,
  notifyChannels: ["email"],
  recipients: [],
};

export default function EscalationPoliciesPage() {
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const projects = projectsData?.data || [];
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const effectiveProjectId = selectedProjectId || projects[0]?._id || "";

  const { data: policiesData, isLoading: policiesLoading } =
    useEscalationPolicies(effectiveProjectId);
  const policies = policiesData?.data || [];

  const createMutation = useCreateEscalationPolicy();
  const updateMutation = useUpdateEscalationPolicy();
  const deleteMutation = useDeleteEscalationPolicy();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<EscalationPolicy | null>(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);

  // Set default project when loaded
  if (!selectedProjectId && projects.length > 0) {
    setSelectedProjectId(projects[0]._id);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <AlertsNavigation />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <SectionHeading
            headline="Escalation Policies"
            sub="Configure multi-level notification escalation for unresolved alerts"
            align="left"
          />
          <div className="flex items-center gap-3">
            {/* Project Selector */}
            <Select value={effectiveProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px] bg-[var(--bg-surface)] border-[var(--border-subtle)]">
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
            <Button
              onClick={() => setShowCreateDialog(true)}
              disabled={!effectiveProjectId}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Content */}
        {projectsLoading || policiesLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--signal)]" />
          </div>
        ) : policies.length === 0 ? (
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-[var(--text-tertiary)]" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No escalation policies
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-6 max-w-md mx-auto">
              Escalation policies automatically notify additional people when alerts
              remain unacknowledged. Create your first policy to get started.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {policies.map((policy) => (
              <PolicyCard
                key={policy._id}
                policy={policy}
                onEdit={() => setEditingPolicy(policy)}
                onDelete={() => setDeletingPolicyId(policy._id)}
                onToggleActive={() => {
                  updateMutation.mutate({
                    id: policy._id,
                    data: { isActive: !policy.isActive },
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {(showCreateDialog || editingPolicy) && (
        <PolicyFormDialog
          open={showCreateDialog || !!editingPolicy}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateDialog(false);
              setEditingPolicy(null);
            }
          }}
          policy={editingPolicy}
          projectId={effectiveProjectId}
          onSubmit={(data) => {
            if (editingPolicy) {
              updateMutation.mutate(
                { id: editingPolicy._id, data },
                {
                  onSuccess: () => setEditingPolicy(null),
                }
              );
            } else {
              createMutation.mutate(data as any, {
                onSuccess: () => setShowCreateDialog(false),
              });
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingPolicyId}
        onOpenChange={(open) => !open && setDeletingPolicyId(null)}
      >
        <AlertDialogContent className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--text-primary)]">
              Delete Escalation Policy
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--text-tertiary)]">
              This will permanently delete this escalation policy. Any rules using
              it will no longer have an escalation path.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border-subtle)] text-[var(--text-secondary)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingPolicyId) {
                  deleteMutation.mutate(
                    { id: deletingPolicyId },
                    { onSuccess: () => setDeletingPolicyId(null) }
                  );
                }
              }}
              className="bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================
// Policy Card
// ============================================

function PolicyCard({
  policy,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  policy: EscalationPolicy;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <Shield className="h-5 w-5 text-[var(--data-purple)]" />
            <div>
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {policy.name}
              </h3>
              {policy.description && (
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  {policy.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-[var(--data-purple)]/30 text-[var(--data-purple)]"
            >
              {policy.levels.length} level{policy.levels.length > 1 ? "s" : ""}
            </Badge>
            <div className="flex items-center gap-2">
              <SignalDot status={policy.isActive ? "ok" : "info"} pulse={policy.isActive} />
              <span className="text-xs text-[var(--text-tertiary)]">
                {policy.isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={policy.isActive}
                onCheckedChange={onToggleActive}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-[var(--text-tertiary)] hover:text-[var(--signal)]"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-[var(--text-tertiary)] hover:text-[var(--status-danger)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Expanded Levels */}
        {expanded && (
          <div className="mt-4 ml-7 space-y-2">
            {policy.levels
              .sort((a, b) => a.level - b.level)
              .map((level, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-md bg-[var(--bg-base)] border border-[var(--border-subtle)]"
                >
                  <Badge
                    variant="outline"
                    className="border-[var(--signal)]/30 text-[var(--signal)] font-mono text-xs shrink-0"
                  >
                    L{level.level}
                  </Badge>
                  <div className="flex-1 text-sm">
                    <span className="text-[var(--text-secondary)]">
                      After{" "}
                      <span className="text-[var(--text-primary)] font-medium">
                        {level.delayMinutes} min
                      </span>
                      , notify via{" "}
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {level.notifyChannels.join(", ")}
                    </span>
                  </div>
                  {level.recipients.length > 0 && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {level.recipients.length} recipient
                      {level.recipients.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================
// Policy Form Dialog
// ============================================

function PolicyFormDialog({
  open,
  onOpenChange,
  policy,
  projectId,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: EscalationPolicy | null;
  projectId: string;
  onSubmit: (data: any) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(policy?.name || "");
  const [description, setDescription] = useState(policy?.description || "");
  const [isActive, setIsActive] = useState(policy?.isActive ?? true);
  const [levels, setLevels] = useState<EscalationLevel[]>(
    policy?.levels?.length
      ? [...policy.levels]
      : [{ ...DEFAULT_LEVEL }]
  );

  const addLevel = () => {
    setLevels((prev) => [
      ...prev,
      {
        level: prev.length + 1,
        delayMinutes: (prev[prev.length - 1]?.delayMinutes || 15) * 2,
        notifyChannels: ["email"],
        recipients: [],
      },
    ]);
  };

  const removeLevel = (index: number) => {
    if (levels.length <= 1) return;
    setLevels((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((l, i) => ({ ...l, level: i + 1 }))
    );
  };

  const updateLevel = (index: number, updates: Partial<EscalationLevel>) => {
    setLevels((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...updates } : l))
    );
  };

  const toggleLevelChannel = (index: number, channel: "email" | "slack" | "webhook") => {
    setLevels((prev) =>
      prev.map((l, i) => {
        if (i !== index) return l;
        const channels = l.notifyChannels.includes(channel)
          ? l.notifyChannels.filter((c) => c !== channel)
          : [...l.notifyChannels, channel];
        return { ...l, notifyChannels: channels };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: any = {
      name: name.trim(),
      projectId,
      levels: levels.map((l, i) => ({ ...l, level: i + 1 })),
      isActive,
      createdBy: "", // Backend sets this from auth
    };
    if (description.trim()) data.description = description.trim();

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Shield className="h-5 w-5 text-[var(--data-purple)]" />
            {policy ? "Edit" : "Create"} Escalation Policy
          </DialogTitle>
          <DialogDescription className="text-[var(--text-tertiary)]">
            Define escalation levels that activate when alerts go unacknowledged
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Description */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)]">
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">Policy Name</Label>
              <Input
                placeholder="e.g., Critical Alert Escalation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--text-secondary)]">Description</Label>
              <Textarea
                placeholder="Describe when this policy should be used..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-primary)] resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label className="text-[var(--text-secondary)]">
                {isActive ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>

          {/* Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[var(--text-secondary)] font-medium">
                Escalation Levels
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLevel}
                className="border-dashed border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--signal)] hover:border-[var(--signal)]"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Level
              </Button>
            </div>

            {levels.map((level, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-[var(--signal)]/30 text-[var(--signal)] text-xs"
                  >
                    Level {i + 1}
                  </Badge>
                  {levels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLevel(i)}
                      className="text-[var(--text-tertiary)] hover:text-[var(--status-danger)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-[var(--text-tertiary)]">
                      Delay (minutes)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={level.delayMinutes}
                      onChange={(e) =>
                        updateLevel(i, {
                          delayMinutes: parseInt(e.target.value) || 1,
                        })
                      }
                      className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-[var(--text-tertiary)]">
                      Webhook URL
                    </Label>
                    <Input
                      placeholder="Optional"
                      value={level.webhookUrl || ""}
                      onChange={(e) =>
                        updateLevel(i, {
                          webhookUrl: e.target.value || undefined,
                        })
                      }
                      className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Channels */}
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--text-tertiary)]">
                    Notify Channels
                  </Label>
                  <div className="flex gap-2">
                    {(
                      [
                        { id: "email", icon: Mail, label: "Email" },
                        { id: "slack", icon: Zap, label: "Slack" },
                        { id: "webhook", icon: Globe, label: "Webhook" },
                      ] as const
                    ).map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleLevelChannel(i, id)}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                          level.notifyChannels.includes(id)
                            ? "bg-[var(--signal)]/10 border-[var(--signal)] text-[var(--signal)]"
                            : "bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--signal)]"
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipients */}
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--text-tertiary)]">
                    Recipients (comma-separated emails)
                  </Label>
                  <Input
                    placeholder="team-lead@example.com, oncall@example.com"
                    value={level.recipients.join(", ")}
                    onChange={(e) =>
                      updateLevel(i, {
                        recipients: e.target.value
                          .split(",")
                          .map((r) => r.trim())
                          .filter(Boolean),
                      })
                    }
                    className="bg-[var(--bg-void)] border-[var(--border-subtle)] h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
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
              disabled={isPending || !name.trim()}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : policy ? (
                "Update Policy"
              ) : (
                "Create Policy"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
