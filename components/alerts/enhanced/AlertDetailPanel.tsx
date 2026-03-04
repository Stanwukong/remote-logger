"use client";

import { useState } from "react";
import { Alert } from "@/services/alert.service";
import { useUpdateAlertStatus } from "@/hooks/alerts.hook";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { SignalDot } from "@/components/shared/SignalDot";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Copy,
  Check,
  Clock,
  CheckCircle,
  AlertTriangle,
  BellOff,
  Calendar,
  Tag,
  FileText,
  User,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

interface AlertDetailPanelProps {
  alert: Alert | null;
  onClose: () => void;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        {title}
      </h4>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="text-text-muted min-w-[120px] text-xs">{label}:</span>
      <span
        className={cn("text-text-secondary flex-1", mono && "font-mono text-xs")}
      >
        {value}
      </span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-bg-elevated transition-colors text-text-muted hover:text-signal"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function SyntaxHighlightedJSON({ data }: { data: unknown }) {
  const jsonString = JSON.stringify(data, null, 2);

  const highlighted = jsonString
    .replace(
      /"([^"]+)":/g,
      '<span style="color: var(--syntax-property)">"$1"</span>:'
    )
    .replace(
      /: "([^"]+)"/g,
      ': <span style="color: var(--syntax-string)">"$1"</span>'
    )
    .replace(
      /: (\d+)/g,
      ': <span style="color: var(--syntax-number)">$1</span>'
    )
    .replace(
      /: (true|false|null)/g,
      ': <span style="color: var(--syntax-keyword)">$1</span>'
    );

  return (
    <pre
      className="font-mono text-xs leading-relaxed p-3 rounded bg-bg-base border border-border-faint overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

const SEVERITY_CONFIG = {
  critical: {
    color: "var(--status-danger)",
    dotVariant: "danger" as const,
    bgClass: "bg-status-danger/10 border-status-danger/30 text-status-danger",
  },
  warning: {
    color: "var(--status-warn)",
    dotVariant: "warn" as const,
    bgClass: "bg-status-warn/10 border-status-warn/30 text-status-warn",
  },
  info: {
    color: "var(--data-info)",
    dotVariant: "info" as const,
    bgClass: "bg-data-info/10 border-data-info/30 text-data-info",
  },
};

const STATUS_CONFIG = {
  active: {
    icon: AlertTriangle,
    label: "Active",
    bgClass: "bg-status-danger/10 text-status-danger",
  },
  acknowledged: {
    icon: Clock,
    label: "Acknowledged",
    bgClass: "bg-status-warn/10 text-status-warn",
  },
  resolved: {
    icon: CheckCircle,
    label: "Resolved",
    bgClass: "bg-status-ok/10 text-status-ok",
  },
  snoozed: {
    icon: BellOff,
    label: "Snoozed",
    bgClass: "bg-bg-elevated text-text-tertiary",
  },
};

export function AlertDetailPanel({ alert, onClose }: AlertDetailPanelProps) {
  const updateStatusMutation = useUpdateAlertStatus();

  if (!alert) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-text-tertiary" />
          <p className="text-sm">No alert selected</p>
          <p className="text-xs">Select an alert to view details</p>
          <p className="text-xs font-mono text-signal/60">
            Press j/k to navigate
          </p>
        </div>
      </div>
    );
  }

  const severity = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
  const status = STATUS_CONFIG[alert.status] || STATUS_CONFIG.active;
  const StatusIcon = status.icon;

  const handleUpdateStatus = async (
    newStatus: "acknowledged" | "resolved" | "snoozed"
  ) => {
    const loadingToast = toast.loading(
      `Updating alert status to ${newStatus}...`
    );
    try {
      await updateStatusMutation.mutateAsync({
        alertId: alert._id,
        status: newStatus,
      });
      toast.success(`Alert ${newStatus} successfully`, { id: loadingToast });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update alert",
        { id: loadingToast }
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-surface">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-elevated px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <SignalDot
                status={severity.dotVariant}
                pulse={alert.status === "active"}
              />
              <span
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: severity.color }}
              >
                {alert.severity}
              </span>
              <span className="text-xs text-text-muted">|</span>
              <div className="flex items-center gap-1.5">
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="text-xs text-text-muted">
                  {status.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-text-primary font-display font-semibold leading-relaxed">
              {alert.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-bg-base transition-colors text-text-muted hover:text-text-primary"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Action Buttons */}
        {alert.status !== "resolved" && (
          <div className="flex items-center gap-2 p-3 bg-bg-base rounded-lg border border-border-faint">
            {alert.status !== "acknowledged" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus("acknowledged")}
                disabled={updateStatusMutation.isPending}
                className="border-status-warn text-status-warn hover:bg-status-warn/10"
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
              className="border-status-ok text-status-ok hover:bg-status-ok/10"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
            {alert.status !== "snoozed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus("snoozed")}
                disabled={updateStatusMutation.isPending}
                className="border-border-subtle text-text-secondary hover:bg-bg-elevated"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Snooze
              </Button>
            )}
          </div>
        )}

        {/* Status & Severity Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={severity.bgClass}>
            {alert.severity.toUpperCase()}
          </Badge>
          <Badge variant="outline" className={status.bgClass}>
            {alert.status.toUpperCase()}
          </Badge>
          {alert.environment && (
            <Badge
              variant="outline"
              className="bg-bg-elevated text-text-secondary border-border-subtle"
            >
              {alert.environment}
            </Badge>
          )}
        </div>

        {/* Message */}
        <DetailSection title="Message">
          <TerminalBlock code={alert.message} />
        </DetailSection>

        {/* Metadata */}
        <DetailSection title="Details">
          <div className="bg-bg-base border border-border-faint rounded-lg p-4 space-y-1">
            <div className="flex items-start gap-2 py-1">
              <span className="text-text-muted min-w-[120px] text-xs flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Triggered:
              </span>
              <span className="text-text-secondary font-mono text-xs flex-1">
                {format(new Date(alert.triggeredAt), "PPpp")}
              </span>
            </div>
            {alert.acknowledgedAt && (
              <div className="flex items-start gap-2 py-1">
                <span className="text-text-muted min-w-[120px] text-xs flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Acknowledged:
                </span>
                <span className="text-text-secondary font-mono text-xs flex-1">
                  {format(new Date(alert.acknowledgedAt), "PPpp")}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 py-1">
              <span className="text-text-muted min-w-[120px] text-xs flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                Alert ID:
              </span>
              <span className="text-text-secondary font-mono text-xs flex-1">
                {alert._id}
              </span>
              <CopyButton text={alert._id} />
            </div>
            {alert.ruleId && (
              <DetailRow label="Rule ID" value={alert.ruleId} mono />
            )}
            {alert.logId && (
              <DetailRow label="Log ID" value={alert.logId} mono />
            )}
            {alert.notifyChannels && alert.notifyChannels.length > 0 && (
              <div className="flex items-start gap-2 py-1">
                <span className="text-text-muted min-w-[120px] text-xs">
                  Channels:
                </span>
                <div className="flex gap-1 flex-wrap">
                  {alert.notifyChannels.map((ch) => (
                    <Badge
                      key={ch}
                      variant="outline"
                      className="text-xs bg-signal/10 text-signal border-signal/30 capitalize"
                    >
                      {ch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailSection>

        {/* Tags */}
        {alert.tags && alert.tags.length > 0 && (
          <DetailSection title="Tags">
            <div className="flex flex-wrap gap-2">
              {alert.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-signal/10 text-signal border-signal/30"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </DetailSection>
        )}

        {/* Triggering Log */}
        {alert.metadata?.log && (
          <DetailSection title="Triggering Log">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton
                  text={JSON.stringify(alert.metadata.log, null, 2)}
                />
              </div>
              <SyntaxHighlightedJSON data={alert.metadata.log} />
            </div>
          </DetailSection>
        )}

        {/* Status History Timeline */}
        {alert.metadata?.statusHistory &&
          alert.metadata.statusHistory.length > 0 && (
            <DetailSection title="Status History">
              <div className="space-y-0">
                {alert.metadata.statusHistory.map(
                  (entry: { status: string; userId?: string; timestamp: string; notes?: string }, index: number) => {
                    const entryStatus =
                      entry.status === "active"
                        ? "danger"
                        : entry.status === "acknowledged"
                        ? "warn"
                        : entry.status === "resolved"
                        ? "ok"
                        : "info";

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 pl-4 py-2 border-l-2 border-border-subtle hover:border-signal/50 transition-colors"
                      >
                        <SignalDot status={entryStatus} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-text-primary">
                            Changed to{" "}
                            <strong className="capitalize">
                              {entry.status}
                            </strong>
                          </div>
                          <div className="text-xs text-text-muted mt-0.5 font-mono">
                            {format(new Date(entry.timestamp), "PPpp")}
                          </div>
                          {entry.notes && (
                            <div className="text-xs text-text-secondary mt-1 italic">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </DetailSection>
          )}

        {/* Auto-Resolved Info */}
        {alert.metadata?.autoResolved && (
          <DetailSection title="Resolution">
            <div className="bg-status-warn/5 border border-status-warn/20 rounded-lg p-3">
              <p className="text-sm text-status-warn">
                Auto-resolved: {alert.metadata.autoResolvedReason || "Exceeded age threshold"}
              </p>
            </div>
          </DetailSection>
        )}
      </div>
    </div>
  );
}
