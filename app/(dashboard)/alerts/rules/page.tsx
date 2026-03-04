"use client";

import { useState, useMemo } from "react";
import { useProjects } from "@/hooks/project.hooks";
import {
  useAlertRules,
  useUpdateAlertRule,
  useDeleteAlertRule,
  useTestAlertRule,
  useSnoozeAlertRule,
} from "@/hooks/alerts.hook";
import { AlertsNavigation } from "@/components/alerts/AlertsNavigation";
import { CreateAlertModal } from "@/components/alerts/CreateAlertModal";
import { SignalDot } from "@/components/shared/SignalDot";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Loader2,
  Trash2,
  Power,
  PowerOff,
  FlaskConical,
  BellOff,
  MoreVertical,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  AlertRule,
  SimpleCondition,
  CompositeCondition,
} from "@/services/alert.service";
import { format, isFuture } from "date-fns";
import { toast } from "sonner";

function isCompositeCondition(
  condition: SimpleCondition | CompositeCondition
): condition is CompositeCondition {
  return "operator" in condition && "conditions" in condition;
}

function ConditionDisplay({
  condition,
}: {
  condition: SimpleCondition | CompositeCondition;
}) {
  if (isCompositeCondition(condition)) {
    return (
      <div className="space-y-1">
        <Badge
          variant="outline"
          className="text-xs bg-[var(--data-info)]/10 text-[var(--data-info)] border-[var(--data-info)]/30"
        >
          {condition.operator}
        </Badge>
        <div className="space-y-0.5 pl-3 border-l-2 border-[var(--border-subtle)]">
          {condition.conditions.map((sub, i) => (
            <div key={i} className="text-xs font-mono text-[var(--text-secondary)]">
              {sub.level && <span className="text-[var(--level-error)]">{sub.level}</span>}
              {sub.keyword && (
                <span>
                  {sub.level ? " + " : ""}keyword: &quot;{sub.keyword}&quot;
                </span>
              )}
              {sub.service && <span> service:{sub.service}</span>}
              {sub.environment && <span> env:{sub.environment}</span>}
              {sub.responseTimeThreshold && (
                <span> rt&gt;{sub.responseTimeThreshold}ms</span>
              )}
            </div>
          ))}
        </div>
        {condition.frequency && (
          <div className="text-xs text-[var(--text-tertiary)]">
            {condition.frequency}x / {condition.intervalMinutes || 5}min
          </div>
        )}
      </div>
    );
  }

  const parts: string[] = [];
  if (condition.level) parts.push(condition.level);
  if (condition.keyword) parts.push(`"${condition.keyword}"`);
  if (condition.service) parts.push(`service:${condition.service}`);
  if (condition.environment) parts.push(`env:${condition.environment}`);
  if (condition.eventType) parts.push(`type:${condition.eventType}`);

  return (
    <div className="text-xs font-mono text-[var(--text-secondary)]">
      <span>{parts.join(" + ") || "Any"}</span>
      {condition.frequency && (
        <span className="text-[var(--text-tertiary)] ml-1">
          {" "}&ge; {condition.frequency} / {condition.intervalMinutes || 5}min
        </span>
      )}
      {condition.responseTimeThreshold && (
        <span className="text-[var(--text-tertiary)] ml-1">
          {" "}rt &gt; {condition.responseTimeThreshold}ms
        </span>
      )}
    </div>
  );
}

function TestRuleDialog({
  ruleId,
  open,
  onOpenChange,
}: {
  ruleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const testMutation = useTestAlertRule();
  const [result, setResult] = useState<{
    matchedCount: number;
    previewLogs: any[];
  } | null>(null);

  const handleTest = async () => {
    try {
      const res = await testMutation.mutateAsync({ ruleId, limitLogs: 100 });
      if (res?.data) {
        setResult(res.data);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to test rule"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[var(--bg-surface)] border-[var(--border-subtle)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)] font-display">
            Test Alert Rule
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Dry-run this rule against the last 100 logs to see which would
            trigger an alert.
          </p>

          {!result ? (
            <Button
              onClick={handleTest}
              disabled={testMutation.isPending}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              {testMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FlaskConical className="h-4 w-4 mr-2" />
              )}
              Run Test
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-faint)]">
                <div className="text-lg font-display font-bold text-[var(--signal)]">
                  {result.matchedCount} match
                  {result.matchedCount !== 1 ? "es" : ""}
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  out of last 100 logs
                </p>
              </div>

              {result.previewLogs && result.previewLogs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--text-secondary)]">
                    Preview Matches
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {result.previewLogs.slice(0, 10).map((log: any, i: number) => (
                      <div
                        key={i}
                        className="p-2 bg-[var(--bg-base)] rounded border border-[var(--border-faint)] text-xs font-mono"
                      >
                        <span className="text-[var(--level-error)]">
                          [{log.level}]
                        </span>{" "}
                        <span className="text-[var(--text-secondary)]">
                          {log.message?.slice(0, 120)}
                          {log.message?.length > 120 ? "..." : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="border-[var(--border-subtle)]"
              >
                Run Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SnoozeDialog({
  ruleId,
  open,
  onOpenChange,
}: {
  ruleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const snoozeMutation = useSnoozeAlertRule();
  const [duration, setDuration] = useState("60");

  const handleSnooze = async () => {
    const loadingToast = toast.loading("Snoozing rule...");
    try {
      await snoozeMutation.mutateAsync({
        ruleId,
        durationMinutes: parseInt(duration),
      });
      toast.success(`Rule snoozed for ${duration} minutes`, { id: loadingToast });
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to snooze rule",
        { id: loadingToast }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-[var(--bg-surface)] border-[var(--border-subtle)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)] font-display">
            Snooze Alert Rule
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Temporarily pause this rule. No alerts will be triggered during the snooze period.
          </p>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-[var(--bg-base)] border-[var(--border-subtle)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
              <SelectItem value="480">8 hours</SelectItem>
              <SelectItem value="1440">24 hours</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-[var(--border-subtle)]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSnooze}
              disabled={snoozeMutation.isPending}
              className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
            >
              {snoozeMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BellOff className="h-4 w-4 mr-2" />
              )}
              Snooze
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AlertRuleCard({ rule, projects }: { rule: AlertRule; projects: any[] }) {
  const updateMutation = useUpdateAlertRule();
  const deleteMutation = useDeleteAlertRule();
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [snoozeDialogOpen, setSnoozeDialogOpen] = useState(false);

  const project = projects.find((p: any) => p._id === rule.projectId);
  const isSnoozed = rule.snoozeUntil && isFuture(new Date(rule.snoozeUntil));

  const handleToggleActive = async () => {
    const loadingToast = toast.loading(
      `${rule.isActive ? "Disabling" : "Enabling"} rule...`
    );
    try {
      await updateMutation.mutateAsync({
        ruleId: rule._id,
        data: { isActive: !rule.isActive },
      });
      toast.success(`Rule ${rule.isActive ? "disabled" : "enabled"}`, { id: loadingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update rule",
        { id: loadingToast }
      );
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) return;

    const loadingToast = toast.loading("Deleting rule...");
    try {
      await deleteMutation.mutateAsync(rule._id);
      toast.success("Rule deleted successfully", { id: loadingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete rule",
        { id: loadingToast }
      );
    }
  };

  return (
    <>
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--signal)]/30 transition-colors">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <SignalDot
                  status={isSnoozed ? "warn" : rule.isActive ? "ok" : "info"}
                  pulse={rule.isActive && !isSnoozed}
                />
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {rule.name}
                </h3>
                <Badge
                  variant="outline"
                  className={
                    isSnoozed
                      ? "bg-[var(--status-warn)]/20 text-[var(--status-warn)] border-[var(--status-warn)]/30"
                      : rule.isActive
                      ? "bg-[var(--status-ok)]/20 text-[var(--status-ok)] border-[var(--status-ok)]/30"
                      : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
                  }
                >
                  {isSnoozed ? "Snoozed" : rule.isActive ? "Active" : "Inactive"}
                </Badge>
                {rule.escalationPolicyId && (
                  <Badge
                    variant="outline"
                    className="bg-[var(--data-info)]/10 text-[var(--data-info)] border-[var(--data-info)]/30"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Escalation
                  </Badge>
                )}
              </div>
              {rule.description && (
                <p className="text-sm text-[var(--text-secondary)] mb-2">{rule.description}</p>
              )}
              {isSnoozed && rule.snoozeUntil && (
                <p className="text-xs text-[var(--status-warn)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Snoozed until {format(new Date(rule.snoozeUntil), "PPpp")}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
                <DropdownMenuItem onClick={() => setTestDialogOpen(true)} className="text-[var(--text-secondary)] hover:text-[var(--signal)]">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Test Rule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSnoozeDialogOpen(true)} className="text-[var(--text-secondary)] hover:text-[var(--signal)]">
                  <BellOff className="h-4 w-4 mr-2" />
                  Snooze Rule
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleActive} className="text-[var(--text-secondary)] hover:text-[var(--signal)]">
                  {rule.isActive ? <PowerOff className="h-4 w-4 mr-2" /> : <Power className="h-4 w-4 mr-2" />}
                  {rule.isActive ? "Disable" : "Enable"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[var(--border-faint)]" />
                <DropdownMenuItem onClick={handleDelete} className="text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[var(--text-tertiary)] mb-1">Project</p>
              <p className="text-[var(--text-primary)] font-medium">{project?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-[var(--text-tertiary)] mb-1">Condition</p>
              <ConditionDisplay condition={rule.condition} />
            </div>
            <div>
              <p className="text-[var(--text-tertiary)] mb-1">Notifications</p>
              <div className="flex gap-1 flex-wrap">
                {rule.notifyChannels?.length > 0 ? (
                  rule.notifyChannels.map((channel: string) => (
                    <Badge key={channel} variant="outline" className="text-xs capitalize bg-[var(--signal)]/10 border-[var(--signal)]/30 text-[var(--signal)]">
                      {channel}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[var(--text-tertiary)] text-xs">None</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[var(--text-tertiary)] mb-1">Created</p>
              <p className="text-[var(--text-primary)] text-xs">{format(new Date(rule.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </Card>

      <TestRuleDialog ruleId={rule._id} open={testDialogOpen} onOpenChange={setTestDialogOpen} />
      <SnoozeDialog ruleId={rule._id} open={snoozeDialogOpen} onOpenChange={setSnoozeDialogOpen} />
    </>
  );
}

export default function AlertRulesPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: projectsResponse, isLoading: isProjectsLoading } = useProjects();
  const projects = useMemo(() => (projectsResponse as any)?.data ?? [], [projectsResponse]);

  const effectiveProjectId = selectedProjectId || (projects[0]?._id ?? "");

  const { data: rulesData, isLoading: isRulesLoading } = useAlertRules(effectiveProjectId);
  const rules = useMemo(() => rulesData?.data || [], [rulesData]);

  const filteredRules = useMemo(() => {
    if (!searchTerm) return rules;
    const searchLower = searchTerm.toLowerCase();
    return rules.filter(
      (rule: AlertRule) =>
        rule.name.toLowerCase().includes(searchLower) ||
        rule.description?.toLowerCase().includes(searchLower)
    );
  }, [rules, searchTerm]);

  const isLoading = isProjectsLoading || isRulesLoading;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[var(--bg-base)]">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-4">
        <div className="flex items-center justify-between">
          <SectionHeading headline="Alert Rules" sub="Manage alert rules and notification settings" align="left" />
          <div className="flex items-center gap-3">
            <Select value={effectiveProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px] bg-[var(--bg-base)] border-[var(--border-subtle)]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
                {projects.map((project: any) => (
                  <SelectItem key={project._id} value={project._id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-4 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
        <AlertsNavigation />
      </div>

      {/* Search */}
      <div className="px-6 py-4 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
          <Input
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[var(--bg-base)] border-[var(--border-subtle)]"
          />
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--signal)]" />
          </div>
        ) : filteredRules.length === 0 ? (
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle className="h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No alert rules found</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6">
                {searchTerm ? "No rules match your search criteria." : "Create your first alert rule to get notified when specific conditions are met."}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Rule
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRules.map((rule: AlertRule) => (
              <AlertRuleCard key={rule._id} rule={rule} projects={projects} />
            ))}
          </div>
        )}
      </div>

      <CreateAlertModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} projects={projects} />
    </div>
  );
}
