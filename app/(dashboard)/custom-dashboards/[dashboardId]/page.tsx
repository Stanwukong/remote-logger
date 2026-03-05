"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useCustomDashboard,
  useUpdateDashboard,
  useAddWidget,
  useRemoveWidget,
  useUpdateLayout,
} from "@/hooks/customDashboard.hook";
import type { AddWidgetData } from "@/services/customDashboard.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { SkeletonDashboard } from "@/components/shared/SkeletonDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Settings,
  Save,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Maximize2,
  Minimize2,
  BarChart3,
  LineChart,
  Table2,
  FileText,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WidgetType = "metric" | "chart" | "table" | "text";
type WidgetSize = "small" | "medium" | "large";

interface WidgetEntry {
  _id?: string;
  id?: string;
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface DashboardDetail {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  widgets?: WidgetEntry[];
  projectId?: string;
  isShared?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWidgetId(widget: WidgetEntry): string {
  return widget._id || widget.id || "";
}

function widgetSizeCols(size: WidgetSize): number {
  switch (size) {
    case "small":
      return 1;
    case "medium":
      return 2;
    case "large":
      return 3;
    default:
      return 1;
  }
}

function widgetGridClass(widget: WidgetEntry): string {
  const w = widget.position?.w ?? 1;
  if (w >= 3) return "md:col-span-3";
  if (w >= 2) return "md:col-span-2";
  return "md:col-span-1";
}

function widgetTypeIcon(type: WidgetType) {
  switch (type) {
    case "metric":
      return <BarChart3 className="w-4 h-4" />;
    case "chart":
      return <LineChart className="w-4 h-4" />;
    case "table":
      return <Table2 className="w-4 h-4" />;
    case "text":
      return <FileText className="w-4 h-4" />;
  }
}

function widgetTypeLabel(type: WidgetType): string {
  switch (type) {
    case "metric":
      return "Metric Card";
    case "chart":
      return "Time Series Chart";
    case "table":
      return "Data Table";
    case "text":
      return "Text / Notes";
  }
}

// ---------------------------------------------------------------------------
// Add Widget Dialog
// ---------------------------------------------------------------------------

function AddWidgetDialog({
  open,
  onClose,
  onAdd,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: WidgetType;
    title: string;
    config: Record<string, any>;
    size: WidgetSize;
  }) => void;
  isPending: boolean;
}) {
  const [type, setType] = useState<WidgetType>("metric");
  const [title, setTitle] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [size, setSize] = useState<WidgetSize>("small");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      onAdd({
        type,
        title: title.trim(),
        config: {
          dataSource: dataSource.trim() || undefined,
        },
        size,
      });
      setTitle("");
      setDataSource("");
      setType("metric");
      setSize("small");
    },
    [type, title, dataSource, size, onAdd]
  );

  if (!open) return null;

  const widgetTypes: WidgetType[] = ["metric", "chart", "table", "text"];
  const sizes: WidgetSize[] = ["small", "medium", "large"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-lg border border-border-subtle bg-bg-surface shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Add Widget
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Widget Type */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-2">
              Widget Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {widgetTypes.map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setType(wt)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-all ${
                    type === wt
                      ? "border-signal bg-signal/10 text-signal"
                      : "border-border-subtle bg-bg-elevated text-text-muted hover:border-border-accent hover:text-text-primary"
                  }`}
                >
                  {widgetTypeIcon(wt)}
                  <span className="capitalize">{wt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-1.5">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Widget title"
              className="bg-bg-elevated border-border-subtle"
              autoFocus
            />
          </div>

          {/* Data Source */}
          {type !== "text" && (
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-1.5">
                Data Source (optional)
              </label>
              <Input
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                placeholder="e.g., error-count, response-time, log-volume"
                className="bg-bg-elevated border-border-subtle"
              />
            </div>
          )}

          {/* Size */}
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider font-medium mb-2">
              Size
            </label>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all capitalize ${
                    size === s
                      ? "border-signal bg-signal/10 text-signal"
                      : "border-border-subtle bg-bg-elevated text-text-muted hover:border-border-accent hover:text-text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="signal"
              size="sm"
              disabled={!title.trim() || isPending}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {isPending ? "Adding..." : "Add Widget"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Widget Renderer
// ---------------------------------------------------------------------------

function WidgetRenderer({
  widget,
  isEditing,
  onRemove,
  onResize,
}: {
  widget: WidgetEntry;
  isEditing: boolean;
  onRemove: () => void;
  onResize: (size: WidgetSize) => void;
}) {
  const widgetId = getWidgetId(widget);
  const currentW = widget.position?.w ?? 1;

  const currentSize: WidgetSize =
    currentW >= 3 ? "large" : currentW >= 2 ? "medium" : "small";

  return (
    <div
      className={`${widgetGridClass(widget)} group relative`}
    >
      <div className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden h-full">
        {/* Widget Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-surface">
          <div className="flex items-center gap-2 min-w-0">
            {isEditing && (
              <GripVertical className="w-4 h-4 text-text-muted cursor-grab shrink-0" />
            )}
            <span className="text-text-muted shrink-0">
              {widgetTypeIcon(widget.type)}
            </span>
            <h4 className="text-xs font-display font-semibold text-text-primary truncate">
              {widget.title}
            </h4>
          </div>

          {isEditing && (
            <div className="flex items-center gap-1">
              {/* Resize controls */}
              {currentSize !== "small" && (
                <button
                  onClick={() =>
                    onResize(currentSize === "large" ? "medium" : "small")
                  }
                  className="p-1 text-text-muted hover:text-text-primary transition-colors"
                  title="Shrink"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              )}
              {currentSize !== "large" && (
                <button
                  onClick={() =>
                    onResize(currentSize === "small" ? "medium" : "large")
                  }
                  className="p-1 text-text-muted hover:text-text-primary transition-colors"
                  title="Expand"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onRemove}
                className="p-1 text-text-muted hover:text-status-danger transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4">
          {widget.type === "metric" && (
            <MetricCard
              label={widget.config?.label ?? widget.title}
              value={widget.config?.value ?? "--"}
              subtitle={widget.config?.subtitle}
              variant={widget.config?.variant}
              icon={
                widget.config?.icon ? (
                  <BarChart3 className="w-4 h-4" />
                ) : undefined
              }
            />
          )}

          {widget.type === "chart" && (
            <div>
              {widget.config?.data && Array.isArray(widget.config.data) && widget.config.data.length > 0 ? (
                <TimeSeriesChart
                  data={widget.config.data}
                  series={
                    widget.config.series ?? [
                      {
                        key: "value",
                        label: widget.title,
                        color: "var(--chart-1)",
                        type: "area",
                      },
                    ]
                  }
                  height={200}
                  showLegend={false}
                />
              ) : (
                <div className="flex items-center justify-center h-[200px] text-text-muted text-xs">
                  <div className="text-center">
                    <LineChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Configure a data source to display chart data</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {widget.type === "table" && (
            <div>
              {widget.config?.rows &&
              Array.isArray(widget.config.rows) &&
              widget.config.rows.length > 0 ? (
                <div className="rounded border border-border-subtle overflow-hidden">
                  <table className="w-full">
                    {widget.config.headers && (
                      <thead>
                        <tr className="bg-bg-elevated/50">
                          {(widget.config.headers as string[]).map(
                            (header: string, hi: number) => (
                              <th
                                key={hi}
                                className="text-left text-text-muted text-[10px] uppercase tracking-wider font-medium px-3 py-2"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {(widget.config.rows as Array<Record<string, any>>).map(
                        (row: Record<string, any>, ri: number) => (
                          <tr
                            key={ri}
                            className="border-t border-border-subtle hover:bg-bg-elevated/30"
                          >
                            {Object.values(row).map((val, ci) => (
                              <td
                                key={ci}
                                className="px-3 py-2 text-text-primary text-xs font-mono"
                              >
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[120px] text-text-muted text-xs">
                  <div className="text-center">
                    <Table2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Configure a data source to display table data</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {widget.type === "text" && (
            <div className="prose prose-sm prose-invert max-w-none">
              {widget.config?.content ? (
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {widget.config.content}
                </p>
              ) : (
                <div className="flex items-center justify-center h-[80px] text-text-muted text-xs">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No content configured for this text widget</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CustomDashboardDetailPage() {
  const params = useParams<{ dashboardId: string }>();
  const router = useRouter();
  const dashboardId =
    typeof params?.dashboardId === "string" ? params.dashboardId : "";

  const [isEditing, setIsEditing] = useState(false);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  // Queries & mutations
  const {
    data: dashboardRaw,
    isLoading,
  } = useCustomDashboard(dashboardId);
  const updateMutation = useUpdateDashboard();
  const addWidgetMutation = useAddWidget();
  const removeWidgetMutation = useRemoveWidget();
  const updateLayoutMutation = useUpdateLayout();

  const dashboard: DashboardDetail | null =
    dashboardRaw && typeof dashboardRaw === "object" ? dashboardRaw : null;
  const widgets: WidgetEntry[] = dashboard?.widgets ?? [];

  // Handlers
  const handleAddWidget = useCallback(
    (data: {
      type: WidgetType;
      title: string;
      config: Record<string, any>;
      size: WidgetSize;
    }) => {
      const w = widgetSizeCols(data.size);
      const widgetData: AddWidgetData = {
        type: data.type,
        title: data.title,
        config: data.config,
        position: { x: 0, y: 0, w, h: 1 },
      };
      addWidgetMutation.mutate(
        { dashboardId, data: widgetData },
        {
          onSuccess: () => setAddWidgetOpen(false),
        }
      );
    },
    [dashboardId, addWidgetMutation]
  );

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      removeWidgetMutation.mutate({ dashboardId, widgetId });
    },
    [dashboardId, removeWidgetMutation]
  );

  const handleResizeWidget = useCallback(
    (widgetId: string, size: WidgetSize) => {
      const w = widgetSizeCols(size);
      const newLayout = widgets.map((wgt) => ({
        widgetId: getWidgetId(wgt),
        x: wgt.position?.x ?? 0,
        y: wgt.position?.y ?? 0,
        w: getWidgetId(wgt) === widgetId ? w : wgt.position?.w ?? 1,
        h: wgt.position?.h ?? 1,
      }));
      updateLayoutMutation.mutate({ dashboardId, layout: newLayout });
    },
    [dashboardId, widgets, updateLayoutMutation]
  );

  const handleSaveName = useCallback(() => {
    if (!nameValue.trim()) {
      setEditingName(false);
      return;
    }
    updateMutation.mutate(
      { dashboardId, data: { name: nameValue.trim() } },
      {
        onSuccess: () => setEditingName(false),
      }
    );
  }, [dashboardId, nameValue, updateMutation]);

  const handleStartEditName = useCallback(() => {
    setNameValue(dashboard?.name ?? "");
    setEditingName(true);
  }, [dashboard?.name]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader title="Loading dashboard..." />
        <SkeletonDashboard />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------

  if (!dashboard) {
    return (
      <div className="p-6 space-y-6 bg-bg-base min-h-screen">
        <PageHeader title="Dashboard not found" />
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
          <LayoutGrid className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            Dashboard not found
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
            The dashboard you are looking for does not exist or has been deleted.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/custom-dashboards")}
            className="gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboards
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const dashboardName = dashboard.name ?? "Untitled Dashboard";

  const headerTitle = editingName ? (
    <div className="flex items-center gap-2">
      <Input
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        className="h-8 w-64 bg-bg-elevated border-border-subtle text-sm font-display"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSaveName();
          if (e.key === "Escape") setEditingName(false);
        }}
      />
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveName}>
        <Save className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setEditingName(false)}
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="p-6 space-y-6 bg-bg-base min-h-screen">
      <PageHeader
        title={headerTitle ? "" : dashboardName}
        description={dashboard.description}
        badge={headerTitle}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/custom-dashboards")}
              className="gap-1.5 text-text-muted"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Dashboards
            </Button>

            {!editingName && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStartEditName}
                title="Edit name"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}

            <Button
              variant={isEditing ? "outline" : "ghost"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              {isEditing ? "Done Editing" : "Edit Layout"}
            </Button>

            <Button
              variant="signal"
              size="sm"
              onClick={() => setAddWidgetOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Widget
            </Button>
          </div>
        }
      />

      {/* Widget Grid */}
      {widgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {widgets.map((widget) => {
            const wId = getWidgetId(widget);
            return (
              <WidgetRenderer
                key={wId}
                widget={widget}
                isEditing={isEditing}
                onRemove={() => handleRemoveWidget(wId)}
                onResize={(size) => handleResizeWidget(wId, size)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-12 text-center">
          <LayoutGrid className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
            No widgets yet
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
            Add widgets to your dashboard to visualize metrics, charts, tables,
            and notes. Click "Add Widget" above to get started.
          </p>
          <Button
            variant="signal"
            size="sm"
            onClick={() => setAddWidgetOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Your First Widget
          </Button>
        </div>
      )}

      {/* Saving indicator */}
      {(updateLayoutMutation.isPending || updateMutation.isPending) && (
        <div className="fixed bottom-6 right-6 bg-bg-surface border border-border-subtle rounded-lg shadow-xl px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="text-xs text-text-secondary">Saving changes...</span>
        </div>
      )}

      {/* Add Widget Dialog */}
      <AddWidgetDialog
        open={addWidgetOpen}
        onClose={() => setAddWidgetOpen(false)}
        onAdd={handleAddWidget}
        isPending={addWidgetMutation.isPending}
      />
    </div>
  );
}
