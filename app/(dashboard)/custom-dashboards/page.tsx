"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useCustomDashboards,
  useCreateDashboard,
  useDeleteDashboard,
  useDuplicateDashboard,
} from "@/hooks/customDashboard.hook";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonDashboard } from "@/components/shared/SkeletonDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  Plus,
  Copy,
  Trash2,
  Clock,
  Layers,
  ArrowRight,
  X,
  FolderOpen,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardEntry {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  widgets?: Array<{ _id?: string; id?: string }>;
  widgetCount?: number;
  updatedAt?: string;
  createdAt?: string;
  isShared?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | undefined): string {
  if (!iso) return "--";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "--";
  }
}

function formatRelativeDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(iso);
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Create Dashboard Dialog
// ---------------------------------------------------------------------------

function CreateDashboardDialog({
  open,
  onClose,
  onCreate,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      onCreate(name.trim(), description.trim());
    },
    [name, description, onCreate]
  );

  const handleClose = useCallback(() => {
    setName("");
    setDescription("");
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-void/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-lg border border-border-subtle bg-bg-surface shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Create Dashboard
          </h2>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-1.5">
              Dashboard Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Analytics Dashboard"
              className="bg-bg-elevated border-border-subtle"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-1.5">
              Description (optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Track key metrics and KPIs"
              className="bg-bg-elevated border-border-subtle"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="signal"
              size="sm"
              disabled={!name.trim() || isPending}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Card
// ---------------------------------------------------------------------------

function DashboardCard({
  dashboard,
  onNavigate,
  onDuplicate,
  onDelete,
  isDuplicating,
  isDeleting,
}: {
  dashboard: DashboardEntry;
  onNavigate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isDuplicating: boolean;
  isDeleting: boolean;
}) {
  const widgetCount =
    dashboard.widgetCount ?? dashboard.widgets?.length ?? 0;

  return (
    <Card
      className="group cursor-pointer border-border-subtle bg-bg-surface"
      onClick={onNavigate}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4.5 h-4.5 text-signal" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-display font-semibold text-text-primary truncate">
                {dashboard.name}
              </h3>
              {dashboard.description && (
                <p className="text-xs text-text-muted truncate mt-0.5 max-w-[200px]">
                  {dashboard.description}
                </p>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted mt-4">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>
              {widgetCount} widget{widgetCount !== 1 ? "s" : ""}
            </span>
          </div>
          {dashboard.projectName && (
            <div className="flex items-center gap-1 truncate">
              <FolderOpen className="w-3 h-3 shrink-0" />
              <span className="truncate">{dashboard.projectName}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeDate(dashboard.updatedAt ?? dashboard.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-text-muted hover:text-data-info gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            disabled={isDuplicating}
          >
            <Copy className="w-3 h-3" />
            {isDuplicating ? "Duplicating..." : "Duplicate"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-text-muted hover:text-status-danger gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
          >
            <Trash2 className="w-3 h-3" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CustomDashboardsListPage() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Queries
  const { data: dashboardsRaw, isLoading } = useCustomDashboards();
  const createMutation = useCreateDashboard();
  const deleteMutation = useDeleteDashboard();
  const duplicateMutation = useDuplicateDashboard();

  const dashboards: DashboardEntry[] = Array.isArray(dashboardsRaw)
    ? dashboardsRaw
    : [];

  // Handlers
  const handleCreate = useCallback(
    (name: string, description: string) => {
      createMutation.mutate(
        { name, description: description || undefined },
        {
          onSuccess: (result: DashboardEntry | undefined) => {
            setCreateDialogOpen(false);
            if (result) {
              const id = result._id || result.id;
              if (id) {
                router.push(`/custom-dashboards/${id}`);
              }
            }
          },
        }
      );
    },
    [createMutation, router]
  );

  const handleDuplicate = useCallback(
    (dashboardId: string) => {
      duplicateMutation.mutate(dashboardId);
    },
    [duplicateMutation]
  );

  const handleDelete = useCallback(
    (dashboardId: string) => {
      deleteMutation.mutate(dashboardId);
    },
    [deleteMutation]
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader
          title="Custom Dashboards"
          description="Organize metrics your way"
        />
        <SkeletonDashboard />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (dashboards.length === 0) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader
          title="Custom Dashboards"
          description="Organize metrics your way"
          actions={
            <Button
              variant="signal"
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Dashboard
            </Button>
          }
        />

        <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
          <LayoutGrid className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            Create your first custom dashboard
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
            Custom dashboards let you organize metrics your way. Add widgets
            for charts, tables, and key metrics to build the perfect
            observability view for your team.
          </p>
          <Button
            variant="signal"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Dashboard
          </Button>
        </div>

        <CreateDashboardDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreate}
          isPending={createMutation.isPending}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6 space-y-6 bg-bg-base min-h-screen">
      <PageHeader
        title="Custom Dashboards"
        description="Organize metrics your way"
        actions={
          <Button
            variant="signal"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Dashboard
          </Button>
        }
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((dashboard) => {
          const dashboardId = dashboard._id || dashboard.id || "";
          return (
            <DashboardCard
              key={dashboardId}
              dashboard={dashboard}
              onNavigate={() => router.push(`/custom-dashboards/${dashboardId}`)}
              onDuplicate={() => handleDuplicate(dashboardId)}
              onDelete={() => handleDelete(dashboardId)}
              isDuplicating={duplicateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          );
        })}
      </div>

      <CreateDashboardDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreate}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
