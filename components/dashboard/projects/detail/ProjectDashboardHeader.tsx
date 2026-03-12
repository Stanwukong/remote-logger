"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignalDot } from "@/components/shared/SignalDot";
import { ArrowLeft, Settings, Eye, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Project } from "@/types/project.types";

interface ProjectDashboardHeaderProps {
  project: Project["project"];
  healthScore: number;
}

export function ProjectDashboardHeader({
  project,
  healthScore,
}: ProjectDashboardHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    toast.success("Project ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mt-1 text-text-muted hover:text-text-primary"
        >
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">
              {project.name}
            </h1>
            <SignalDot
              status={project.isActive ? "ok" : "danger"}
              pulse={project.isActive}
              label={project.isActive ? "Active" : "Inactive"}
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 text-text-muted hover:text-signal transition-colors font-mono text-xs"
              title="Click to copy project ID"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {project._id}
            </button>
            <span className="text-text-tertiary">|</span>
            <span className="text-text-tertiary text-xs">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/projects/${project._id}/settings`)}
          className="border-border-subtle text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button variant="signal" size="sm" asChild>
          <Link href={`/logs?projectId=${project._id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Logs
          </Link>
        </Button>
      </div>
    </div>
  );
}
