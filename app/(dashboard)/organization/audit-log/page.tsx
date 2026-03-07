"use client";

import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScrollText,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuditLog, useExportAuditLog } from "@/hooks/organization.hooks";
import { useOrganizationStore } from "@/store/organization-store";
import type { AuditLogEntry, AuditLogFilters } from "@/types/organization.types";

const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "invite", label: "Invite" },
  { value: "remove", label: "Remove" },
  { value: "role_change", label: "Role Change" },
  { value: "login", label: "Login" },
  { value: "settings_change", label: "Settings Change" },
];

const RESOURCE_OPTIONS = [
  { value: "", label: "All Resources" },
  { value: "organization", label: "Organization" },
  { value: "member", label: "Member" },
  { value: "team", label: "Team" },
  { value: "project", label: "Project" },
  { value: "alert_rule", label: "Alert Rule" },
];

const ACTION_VARIANT: Record<string, "signal" | "status-ok" | "status-warn" | "status-danger" | "level-info"> = {
  create: "status-ok",
  update: "signal",
  delete: "status-danger",
  invite: "level-info",
  remove: "status-warn",
  role_change: "status-warn",
  login: "level-info",
  settings_change: "signal",
};

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getUserDisplay(entry: AuditLogEntry): string {
  if (typeof entry.userId === "object" && entry.userId !== null) {
    const u = entry.userId;
    if (u.firstName || u.lastName) {
      return `${u.firstName || ""} ${u.lastName || ""}`.trim();
    }
    return u.email;
  }
  return String(entry.userId);
}

export default function OrgAuditLogPage() {
  const currentOrgId = useOrganizationStore((s) => s.currentOrgId);
  const exportAuditLog = useExportAuditLog();

  // Filter state
  const [actionFilter, setActionFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const filters: AuditLogFilters = useMemo(
    () => ({
      ...(actionFilter && { action: actionFilter }),
      ...(resourceFilter && { resource: resourceFilter }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      page,
      limit,
    }),
    [actionFilter, resourceFilter, startDate, endDate, page]
  );

  const { data: auditData, isLoading } = useAuditLog(currentOrgId || "", filters);

  const entries = auditData?.entries || [];
  const meta = auditData?.meta;
  const totalPages = meta?.total ? Math.ceil(meta.total / limit) : 1;

  const handleExport = () => {
    if (!currentOrgId) return;
    exportAuditLog.mutate(
      { orgId: currentOrgId, filters },
      {
        onSuccess: () => toast.success("Audit log exported"),
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || err?.message || "Failed to export audit log"
          );
        },
      }
    );
  };

  const handleClearFilters = () => {
    setActionFilter("");
    setResourceFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (!currentOrgId) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4">
            <ScrollText className="w-7 h-7 text-text-muted" />
          </div>
          <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
            No Organization Selected
          </h2>
          <p className="text-sm text-text-muted">
            Select an organization to view its audit trail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-signal" />
            </div>
            Audit Log
          </h1>
          <p className="text-text-secondary mt-1 ml-[46px]">
            Track all actions performed within your organization
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exportAuditLog.isPending}
          className="border-border-subtle text-text-secondary hover:text-text-primary"
        >
          {exportAuditLog.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-text-primary text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action */}
            <div className="space-y-1.5">
              <Label className="text-text-muted text-xs">Action</Label>
              <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
                <SelectTrigger className="bg-bg-elevated border-border-subtle text-text-primary text-sm">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resource */}
            <div className="space-y-1.5">
              <Label className="text-text-muted text-xs">Resource</Label>
              <Select value={resourceFilter} onValueChange={(v) => { setResourceFilter(v); setPage(1); }}>
                <SelectTrigger className="bg-bg-elevated border-border-subtle text-text-primary text-sm">
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <Label className="text-text-muted text-xs">From</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="bg-bg-elevated border-border-subtle text-text-primary text-sm"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <Label className="text-text-muted text-xs">To</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="bg-bg-elevated border-border-subtle text-text-primary text-sm"
              />
            </div>
          </div>

          {(actionFilter || resourceFilter || startDate || endDate) && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-text-muted hover:text-text-primary text-xs"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-bg-elevated rounded animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-3">
                <ScrollText className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-sm text-text-muted">
                No audit log entries found for the selected filters.
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_120px_100px_120px] gap-4 px-4 py-3 border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-muted">
                <span>Event</span>
                <span>User</span>
                <span>Resource</span>
                <span>IP Address</span>
                <span>Timestamp</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border-subtle/50">
                {entries.map((entry) => {
                  const variant = ACTION_VARIANT[entry.action] || "level-info";
                  return (
                    <div
                      key={entry._id}
                      className="grid grid-cols-[1fr_120px_120px_100px_120px] gap-4 px-4 py-3 hover:bg-bg-elevated/30 transition-colors items-center"
                    >
                      {/* Action + Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={variant} className="text-[10px] shrink-0">
                            {entry.action}
                          </Badge>
                          {entry.details && (
                            <span className="text-xs text-text-muted truncate">
                              {typeof entry.details === "object"
                                ? JSON.stringify(entry.details).slice(0, 80)
                                : String(entry.details)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="text-xs text-text-secondary truncate">
                          {getUserDisplay(entry)}
                        </span>
                      </div>

                      {/* Resource */}
                      <div className="min-w-0">
                        <span className="text-xs text-text-secondary truncate block">
                          {entry.resource}
                        </span>
                      </div>

                      {/* IP */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Globe className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="text-xs text-text-muted font-mono truncate">
                          {entry.ipAddress || "N/A"}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Clock className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="text-xs text-text-muted truncate">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {page} of {totalPages}
            {meta?.total && (
              <span className="ml-2">({meta.total} total entries)</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-border-subtle text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border-border-subtle text-text-secondary hover:text-text-primary"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
