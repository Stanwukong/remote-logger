"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateAlertRule } from "@/hooks/useAlerts";
import { CreateAlertRuleData } from "@/types/alert.types";

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
}

export function CreateAlertModal({
  open,
  onOpenChange,
  projects,
}: CreateAlertModalProps) {
  const createMutation = useCreateAlertRule();
  const [formData, setFormData] = useState<Partial<CreateAlertRuleData>>({
    name: "",
    projectId: "",
    condition: {
      level: "error",
      keyword: 10,
      intervalMinutes: 5,
    },
    isActive: true,
    notifyChannels: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.projectId || !formData.condition) {
      return;
    }

    createMutation.mutate(
      {
        projectId: formData.projectId,
        ruleData: formData as CreateAlertRuleData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          // Reset form
          setFormData({
            name: "",
            projectId: "",
            condition: {
              level: "error",
              keyword: 10,
              intervalMinutes: 5,
            },
            isActive: true,
            notifyChannels: [],
          });
        },
      }
    );
  };

  const toggleChannel = (channel: string) => {
    const channels = formData.notifyChannels || [];
    if (channels.includes(channel)) {
      setFormData({
        ...formData,
        notifyChannels: channels.filter((c) => c !== channel),
      });
    } else {
      setFormData({
        ...formData,
        notifyChannels: [...channels, channel],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>
            Set up a new alert rule to get notified when specific conditions are
            met
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              placeholder="e.g., High Error Rate"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Log Level</Label>
              <Select
                value={formData.condition?.level}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    condition: { ...formData.condition!, level: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trace">Trace</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="fatal">Fatal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Input
                id="threshold"
                type="number"
                min="1"
                placeholder="10"
                value={formData.condition?.keyword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: {
                      ...formData.condition!,
                      keyword: parseInt(e.target.value) || 0,
                    },
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Time Window (minutes)</Label>
            <Input
              id="interval"
              type="number"
              min="1"
              placeholder="5"
              value={formData.condition?.intervalMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: {
                    ...formData.condition!,
                    intervalMinutes: parseInt(e.target.value) || 0,
                  },
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Notification Channels</Label>
            <div className="space-y-2">
              {["email", "slack", "discord", "webhook"].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={formData.notifyChannels?.includes(channel)}
                    onCheckedChange={() => toggleChannel(channel)}
                  />
                  <label
                    htmlFor={channel}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {channel}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
