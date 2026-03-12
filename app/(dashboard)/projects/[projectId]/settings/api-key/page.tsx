"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { useProject, useRegenerateApiKey } from "@/hooks/project.hooks";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { toast } from "sonner";

export default function ApiKeySettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";
  const { data: projectData, isLoading } = useProject(projectId);
  const regenerateApiKey = useRegenerateApiKey();

  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-8 w-48 bg-bg-surface rounded animate-pulse" />
        <div className="h-64 bg-bg-surface rounded animate-pulse" />
      </div>
    );
  }

  if (!projectData || !projectData.project) {
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

  const { project } = projectData;

  const maskedKey = project.apiKey
    ? "****-****-****-" + project.apiKey.slice(-8)
    : "No API key found";

  const handleCopy = () => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (!confirmRegenerate) {
      setConfirmRegenerate(true);
      return;
    }

    regenerateApiKey.mutate(project._id, {
      onSuccess: () => {
        toast.success("API key regenerated successfully");
        setConfirmRegenerate(false);
      },
      onError: () => {
        toast.error("Failed to regenerate API key");
        setConfirmRegenerate(false);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-signal" />
          </div>
          API Key
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Your project&apos;s authentication key for the SDK
        </p>
      </div>

      {/* API Key Display */}
      <Card className="bg-bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <Shield className="w-5 h-5 text-signal" />
            Project API Key
          </CardTitle>
          <CardDescription className="text-text-muted">
            Use this key in the <code className="text-text-code font-mono text-xs">X-API-Key</code> header for log ingestion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFullKey ? (
            <TerminalBlock
              code={project.apiKey}
              filename="API Key"
              showCopy={true}
            />
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center px-4 py-3 rounded-lg bg-bg-elevated border border-border-subtle font-mono text-sm text-text-secondary">
                {maskedKey}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-border-subtle text-text-muted hover:text-signal hover:border-signal/30 shrink-0 h-[46px] w-[46px]"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-signal" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullKey(!showFullKey)}
              className="border-border-subtle text-text-secondary hover:text-text-primary"
            >
              {showFullKey ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1.5" />
                  Hide Key
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1.5" />
                  Reveal Key
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regenerate */}
      <Card
        className={`border ${
          confirmRegenerate
            ? "bg-status-danger/5 border-status-danger/30"
            : "bg-bg-surface border-border-subtle"
        }`}
      >
        <CardHeader>
          <CardTitle className="font-display text-text-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-status-warn" />
            Regenerate API Key
          </CardTitle>
          <CardDescription className="text-text-muted">
            Generate a new API key. The current key will immediately stop
            working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {confirmRegenerate && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-status-danger/10 border border-status-danger/20">
              <AlertTriangle className="w-5 h-5 text-status-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-status-danger">
                  This action cannot be undone
                </p>
                <p className="text-sm text-text-muted mt-1">
                  All existing integrations using the current key will
                  immediately stop working. You will need to update the key in
                  all your applications.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant={confirmRegenerate ? "destructive" : "outline"}
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerateApiKey.isPending}
              className={
                confirmRegenerate
                  ? ""
                  : "border-status-danger/30 text-status-danger hover:bg-status-danger/10 hover:border-status-danger/50"
              }
            >
              {regenerateApiKey.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              {confirmRegenerate
                ? "Confirm Regeneration"
                : "Regenerate API Key"}
            </Button>
            {confirmRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmRegenerate(false)}
                className="border-border-subtle text-text-secondary"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
