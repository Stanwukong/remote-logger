"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Download,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useProfile, useExportData, useDeleteAccount } from "@/hooks/user.hook";
import { toast } from "sonner";

export default function PrivacySettingsPage() {
  const { data: profile } = useProfile();
  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const emailMatches =
    profile?.email &&
    confirmEmail.toLowerCase().trim() === profile.email.toLowerCase();

  const handleExport = () => {
    exportData.mutate(undefined, {
      onSuccess: (blob) => {
        // Trigger browser download from the Blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `apperio-data-export-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Data export downloaded successfully");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to export data");
      },
    });
  };

  const handleDelete = () => {
    if (!emailMatches) return;

    deleteAccount.mutate(confirmEmail.trim(), {
      onSuccess: () => {
        toast.success("Account deleted. Redirecting...");
        // Clear auth cookie and redirect
        document.cookie = "authToken=; Max-Age=-99999999;";
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete account");
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-signal" />
          </div>
          Privacy & Data
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Manage your data, export it, or delete your account
        </p>
      </div>

      {/* Export Data Section */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <Download className="w-4.5 h-4.5 text-data-info" />
            Export Your Data
          </CardTitle>
          <CardDescription className="text-text-muted">
            Download a copy of all your data including your profile, projects,
            logs (last 90 days, up to 50k entries), alerts, preferences, custom
            dashboards, saved searches, and API tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Your data will be exported as a ZIP archive containing JSON files
            for each data category. Sensitive fields like passwords and OAuth
            tokens are excluded.
          </p>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportData.isPending}
            className="border-border-subtle text-text-primary hover:bg-bg-elevated"
          >
            {exportData.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {exportData.isPending ? "Generating export..." : "Export Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Section (Danger Zone) */}
      <Card className="bg-bg-surface border-status-danger/40">
        <CardHeader>
          <CardTitle className="font-display text-status-danger flex items-center gap-2">
            <Trash2 className="w-4.5 h-4.5" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-text-muted">
            Permanently delete your account and all associated data. This
            includes all projects you own, their logs, alert rules, alert
            events, preferences, custom dashboards, saved searches, and API
            tokens. You will also be removed from any projects where you are a
            team member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-status-danger/20 bg-status-danger/5 p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-danger shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                This action is <strong className="text-text-primary">irreversible</strong>. Once
                deleted, your data cannot be recovered. We recommend exporting
                your data before proceeding.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-danger">
              <AlertTriangle className="w-5 h-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-status-danger/20 bg-status-danger/5 p-3">
              <p className="text-sm text-text-secondary">
                The following will be permanently deleted:
              </p>
              <ul className="text-sm text-text-muted mt-2 space-y-1 list-disc list-inside">
                <li>Your user account and profile</li>
                <li>All projects you own and their logs</li>
                <li>All alert rules and alert events</li>
                <li>Custom dashboards, saved searches, and preferences</li>
                <li>API tokens</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmEmail"
                className="text-text-secondary text-sm"
              >
                Type{" "}
                <strong className="text-text-primary">
                  {profile?.email || "your email"}
                </strong>{" "}
                to confirm
              </Label>
              <Input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-bg-elevated border-border-subtle text-text-primary placeholder:text-text-muted focus:border-status-danger focus:ring-status-danger/20"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setConfirmEmail("");
              }}
              className="border-border-subtle text-text-primary hover:bg-bg-elevated"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!emailMatches || deleteAccount.isPending}
            >
              {deleteAccount.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteAccount.isPending
                ? "Deleting..."
                : "Permanently Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
