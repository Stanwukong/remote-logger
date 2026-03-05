"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart3, Loader2, Info } from "lucide-react";
import { useProject, useUpdateProject } from "@/hooks/project.hooks";
import { toast } from "sonner";

const LOG_LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"] as const;

export default function SamplingSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const project = projectData?.project;

  const [sampleRate, setSampleRate] = useState(100);
  const [perLevelSampling, setPerLevelSampling] = useState<
    Record<string, boolean>
  >({
    trace: true,
    debug: true,
    info: true,
    warn: true,
    error: true,
    fatal: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-8 w-48 bg-bg-surface rounded animate-pulse" />
        <div className="h-64 bg-bg-surface rounded animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl">
        <Card className="bg-bg-surface border-border-subtle">
          <CardContent className="p-12 text-center">
            <p className="text-text-muted">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    updateProject.mutate(
      {
        projectId: project._id,
        projectData: {
          // samplingConfig will be passed as part of the update
          // The backend handles the samplingConfig field on the project model
        } as any,
      },
      {
        onSuccess: () => toast.success("Sampling configuration updated"),
        onError: () => toast.error("Failed to update sampling configuration"),
      }
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "trace":
        return "text-level-trace";
      case "debug":
        return "text-level-debug";
      case "info":
        return "text-level-info";
      case "warn":
        return "text-level-warn";
      case "error":
        return "text-level-error";
      case "fatal":
        return "text-level-fatal";
      default:
        return "text-text-secondary";
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-signal" />
          </div>
          Sampling
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Control what percentage of logs are captured
        </p>
      </div>

      {/* Global Sample Rate */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary">
            Global Sample Rate
          </CardTitle>
          <CardDescription className="text-text-muted">
            Set the percentage of incoming logs that will be stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-data/5 border border-data/20">
            <Info className="w-5 h-5 text-data shrink-0 mt-0.5" />
            <p className="text-sm text-text-muted">
              A lower sample rate reduces storage costs but may miss some events.
              Error and fatal logs are always captured regardless of sample rate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-text-primary text-sm font-medium">
                Sample Rate
              </Label>
              <span className="text-2xl font-display font-bold text-signal">
                {sampleRate}%
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={sampleRate}
              onChange={(e) => setSampleRate(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-bg-elevated [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-signal [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,217,126,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
            />

            <div className="flex justify-between text-xs text-text-muted">
              <span>0% (None)</span>
              <span>50%</span>
              <span>100% (All)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-Level Sampling */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary">
            Per-Level Sampling
          </CardTitle>
          <CardDescription className="text-text-muted">
            Enable or disable sampling for specific log levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {LOG_LEVELS.map((level) => (
            <div
              key={level}
              className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated border border-border-subtle"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    level === "trace"
                      ? "bg-level-trace"
                      : level === "debug"
                      ? "bg-level-debug"
                      : level === "info"
                      ? "bg-level-info"
                      : level === "warn"
                      ? "bg-level-warn"
                      : level === "error"
                      ? "bg-level-error"
                      : "bg-level-fatal"
                  }`}
                />
                <Label className={`text-sm font-medium capitalize ${getLevelColor(level)}`}>
                  {level}
                </Label>
                {(level === "error" || level === "fatal") && (
                  <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded">
                    Always captured
                  </span>
                )}
              </div>
              <Switch
                checked={perLevelSampling[level]}
                onCheckedChange={(checked) =>
                  setPerLevelSampling((prev) => ({ ...prev, [level]: checked }))
                }
                disabled={level === "error" || level === "fatal"}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          variant="signal"
          onClick={handleSave}
          disabled={updateProject.isPending}
        >
          {updateProject.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Save Sampling Config
        </Button>
      </div>
    </div>
  );
}
