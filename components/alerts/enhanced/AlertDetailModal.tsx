"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { Alert } from "@/services/alert.service";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUpdateAlertStatus } from "@/hooks/alerts.hook";

interface AlertDetailModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetailModal({
  alert,
  isOpen,
  onClose,
}: AlertDetailModalProps) {
  const updateStatusMutation = useUpdateAlertStatus();

  if (!alert) return null;

  const handleUpdateStatus = async (
    status: "acknowledged" | "resolved" | "snoozed"
  ) => {
    const loadingToast = toast.loading(`Updating alert status to ${status}...`);
    try {
      await updateStatusMutation.mutateAsync({
        alertId: alert._id,
        status,
      });
      toast.success(`Alert ${status} successfully`, { id: loadingToast });
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update alert",
        { id: loadingToast }
      );
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--bg-surface)] border-[var(--border-subtle)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-[var(--text-primary)]">
            <SignalDot
              status={
                alert.severity === "critical"
                  ? "danger"
                  : alert.severity === "warning"
                  ? "warn"
                  : "info"
              }
              pulse={alert.status === "active"}
            />
            <span className="font-display">{alert.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between gap-4 p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <Badge
                className={`
                  ${
                    alert.severity === "critical"
                      ? "bg-[var(--status-danger)]/20 text-[var(--status-danger)] border-[var(--status-danger)]/30"
                      : alert.severity === "warning"
                      ? "bg-[var(--status-warn)]/20 text-[var(--status-warn)] border-[var(--status-warn)]/30"
                      : "bg-[var(--data-info)]/20 text-[var(--data-info)] border-[var(--data-info)]/30"
                  }
                `}
                variant="outline"
              >
                {alert.severity.toUpperCase()}
              </Badge>
              <Badge
                className={`
                  ${
                    alert.status === "active"
                      ? "bg-[var(--status-danger)]/20 text-[var(--status-danger)]"
                      : alert.status === "acknowledged"
                      ? "bg-[var(--status-warn)]/20 text-[var(--status-warn)]"
                      : alert.status === "resolved"
                      ? "bg-[var(--status-ok)]/20 text-[var(--status-ok)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
                  }
                `}
                variant="outline"
              >
                {alert.status.toUpperCase()}
              </Badge>
            </div>

            {alert.status !== "resolved" && (
              <div className="flex items-center gap-2">
                {alert.status !== "acknowledged" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus("acknowledged")}
                    disabled={updateStatusMutation.isPending}
                    className="border-[var(--status-warn)] text-[var(--status-warn)] hover:bg-[var(--status-warn)]/10"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Acknowledge
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus("resolved")}
                  disabled={updateStatusMutation.isPending}
                  className="border-[var(--status-ok)] text-[var(--status-ok)] hover:bg-[var(--status-ok)]/10"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Message
            </label>
            <TerminalBlock code={alert.message} className="font-mono text-sm" />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Triggered At
              </label>
              <div className="text-sm text-[var(--text-primary)] font-mono">
                {format(new Date(alert.triggeredAt), "PPpp")}
              </div>
            </div>

            {alert.acknowledgedAt && (
              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Acknowledged At
                </label>
                <div className="text-sm text-[var(--text-primary)] font-mono">
                  {format(new Date(alert.acknowledgedAt), "PPpp")}
                </div>
              </div>
            )}

            {alert.environment && (
              <div>
                <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Environment
                </label>
                <Badge className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]">
                  {alert.environment}
                </Badge>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Alert ID
              </label>
              <div className="flex items-center gap-2">
                <code className="text-xs text-[var(--text-primary)] bg-[var(--bg-base)] px-2 py-1 rounded font-mono">
                  {alert._id.slice(0, 8)}...
                </code>
                <button
                  onClick={() => copyToClipboard(alert._id, "Alert ID")}
                  className="text-[var(--text-tertiary)] hover:text-[var(--signal)]"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {alert.tags && alert.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {alert.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)]/30"
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Log Details (if available) */}
          {alert.metadata?.log && (
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Triggering Log
              </label>
              <TerminalBlock
                code={JSON.stringify(alert.metadata.log, null, 2)}
                className="max-h-[300px] overflow-y-auto"
              />
            </div>
          )}

          {/* Status History Timeline (Phase 2.2) */}
          {alert.metadata?.statusHistory && alert.metadata.statusHistory.length > 0 && (
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status History
              </label>
              <div className="space-y-3">
                {alert.metadata.statusHistory.map((entry: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pl-4 border-l-2 border-[var(--border-subtle)]"
                  >
                    <SignalDot
                      status={
                        entry.status === "active"
                          ? "danger"
                          : entry.status === "acknowledged"
                          ? "warn"
                          : "ok"
                      }
                    />
                    <div className="flex-1">
                      <div className="text-sm text-[var(--text-primary)]">
                        Changed to <strong>{entry.status}</strong>
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">
                        {format(new Date(entry.timestamp), "PPpp")}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
