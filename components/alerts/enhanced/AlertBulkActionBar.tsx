"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Clock, Trash2, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useBulkUpdateAlerts, useDeleteAlerts } from "@/hooks/alerts.hook";

interface AlertBulkActionBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
}

export function AlertBulkActionBar({
  selectedCount,
  selectedIds,
  onClearSelection,
}: AlertBulkActionBarProps) {
  const bulkUpdateMutation = useBulkUpdateAlerts();
  const deleteAlertsMutation = useDeleteAlerts();

  const handleBulkAction = async (
    action: "acknowledged" | "resolved" | "snoozed" | "delete"
  ) => {
    const loadingToast = toast.loading(
      `${action === "delete" ? "Deleting" : "Updating"} ${selectedCount} alert${
        selectedCount > 1 ? "s" : ""
      }...`
    );

    try {
      if (action === "delete") {
        await deleteAlertsMutation.mutateAsync({
          alertIds: selectedIds,
          softDelete: true,
        });
        toast.success(`${selectedCount} alert${selectedCount > 1 ? "s" : ""} deleted`, {
          id: loadingToast,
        });
      } else {
        await bulkUpdateMutation.mutateAsync({
          alertIds: selectedIds,
          status: action,
        });
        toast.success(
          `${selectedCount} alert${selectedCount > 1 ? "s" : ""} ${action}`,
          { id: loadingToast }
        );
      }
      onClearSelection();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed", {
        id: loadingToast,
      });
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[var(--bg-elevated)] border-2 border-[var(--signal)] rounded-lg shadow-2xl shadow-[var(--signal)]/20 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-3">
            <Badge className="bg-[var(--signal)] text-[var(--bg-void)] text-sm px-3 py-1">
              {selectedCount} selected
            </Badge>
            <div className="h-4 w-px bg-[var(--border-subtle)]" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mark as Acknowledged */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("acknowledged")}
              disabled={bulkUpdateMutation.isPending || deleteAlertsMutation.isPending}
              className="border-[var(--status-warn)] text-[var(--status-warn)] hover:bg-[var(--status-warn)]/10"
            >
              <Clock className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>

            {/* Mark as Resolved */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("resolved")}
              disabled={bulkUpdateMutation.isPending || deleteAlertsMutation.isPending}
              className="border-[var(--status-ok)] text-[var(--status-ok)] hover:bg-[var(--status-ok)]/10"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkUpdateMutation.isPending || deleteAlertsMutation.isPending}
                  className="border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--signal)]"
                >
                  More
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[var(--bg-elevated)] border-[var(--border-subtle)]"
              >
                <DropdownMenuItem
                  onClick={() => handleBulkAction("snoozed")}
                  className="text-[var(--text-secondary)] hover:text-[var(--signal)] hover:bg-[var(--bg-surface)]"
                >
                  Snooze for 1 hour
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[var(--border-faint)]" />
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="h-4 w-px bg-[var(--border-subtle)]" />

            {/* Clear Selection */}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
