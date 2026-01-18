"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertRule } from "@/types/alert.types";
import { Bell, Edit, Trash2, Clock, AlertCircle } from "lucide-react";
import { useUpdateAlertRule, useDeleteAlertRule } from "@/hooks/useAlerts";
import { useState } from "react";
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

interface AlertRuleCardProps {
  rule: AlertRule;
  projectId: string;
  apiKey: string;
}

export function AlertRuleCard({ rule, projectId, apiKey }: AlertRuleCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateMutation = useUpdateAlertRule();
  const deleteMutation = useDeleteAlertRule();

  const handleToggleActive = async () => {
    updateMutation.mutate({
      ruleId: rule._id,
      updates: { isActive: !rule.isActive },
      apiKey,
      projectId,
    });
  };

  const handleDelete = async () => {
    deleteMutation.mutate({
      ruleId: rule._id,
      apiKey,
      projectId,
    });
    setShowDeleteDialog(false);
  };

  const getSeverityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "fatal":
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warn":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {rule.name}
              </CardTitle>
              <CardDescription className="mt-1">
                Trigger when {rule.condition.frequency || rule.condition.keyword || 0} {rule.condition.level || "error"}{" "}
                logs occur
              </CardDescription>
            </div>
            <Switch
              checked={rule.isActive}
              onCheckedChange={handleToggleActive}
              disabled={updateMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Condition Details */}
          <div
            className={`p-3 rounded-lg border ${getSeverityColor(
              rule.condition.level || "info"
            )}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Condition</span>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Level:</span>{" "}
                <Badge variant="outline" className="capitalize">
                  {rule.condition.level}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Threshold:</span>{" "}
                {rule.condition.frequency || rule.condition.keyword || 0} occurrences
              </p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">Window:</span>{" "}
                {rule.condition.intervalMinutes} minutes
              </p>
            </div>
          </div>

          {/* Notification Channels */}
          {rule.notifyChannels && rule.notifyChannels.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Notification Channels</p>
              <div className="flex flex-wrap gap-2">
                {rule.notifyChannels.map((channel) => (
                  <Badge
                    key={channel}
                    variant="secondary"
                    className="capitalize"
                  >
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Badge variant={rule.isActive ? "default" : "secondary"}>
              {rule.isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this alert rule? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
