"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  useConnectIntegration,
  useTestIntegration,
} from "@/hooks/integration.hooks";
import type {
  IntegrationFieldDef,
  IntegrationTypeSlug,
  Integration,
} from "@/types/integration.types";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Zap,
  ShieldCheck,
  Settings,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationSetupWizardProps {
  type: IntegrationTypeSlug;
  displayName: string;
  fields: IntegrationFieldDef[];
  /** If already connected, pass the existing integration for reconfiguration */
  existingIntegration?: Integration | null;
  onComplete?: (integration: any) => void;
}

type WizardStep = "auth" | "configure" | "test" | "enable";

const steps: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: "auth", label: "Authenticate", icon: ShieldCheck },
  { key: "configure", label: "Configure", icon: Settings },
  { key: "test", label: "Test", icon: Zap },
  { key: "enable", label: "Enable", icon: Plug },
];

export function IntegrationSetupWizard({
  type,
  displayName,
  fields,
  existingIntegration,
  onComplete,
}: IntegrationSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("auth");
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    // Pre-populate from existing config (excluding sensitive fields)
    if (existingIntegration?.config) {
      const initial: Record<string, string> = {};
      for (const field of fields) {
        const val = (existingIntegration.config as Record<string, any>)[
          field.key
        ];
        if (val && field.type !== "password") {
          initial[field.key] = val;
        }
      }
      return initial;
    }
    return {};
  });
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [connectedIntegration, setConnectedIntegration] =
    useState<any>(existingIntegration || null);

  const connectMutation = useConnectIntegration();
  const testMutation = useTestIntegration();

  const requiredFields = fields.filter((f) => f.required);
  const optionalFields = fields.filter((f) => !f.required);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleFieldChange = useCallback(
    (key: string, value: string) => {
      setFormValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const allRequiredFilled = requiredFields.every(
    (f) => formValues[f.key]?.trim()
  );

  const handleConnect = async () => {
    try {
      const result = await connectMutation.mutateAsync({
        type,
        data: { config: formValues },
      });
      setConnectedIntegration(result);
      toast.success(`${displayName} connected successfully`);
      setCurrentStep("test");
    } catch (error: any) {
      toast.error(
        error?.message || `Failed to connect ${displayName}`
      );
    }
  };

  const handleTest = async () => {
    if (!connectedIntegration?._id) {
      toast.error("No connected integration to test");
      return;
    }

    try {
      const result = await testMutation.mutateAsync(connectedIntegration._id);
      if (result) {
        setTestResult(result);
        if (result.success) {
          toast.success("Connection test passed");
        } else {
          toast.error(`Test failed: ${result.message}`);
        }
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error?.message || "Test failed",
      });
      toast.error(error?.message || "Connection test failed");
    }
  };

  const handleFinish = () => {
    toast.success(`${displayName} integration is now active`);
    onComplete?.(connectedIntegration);
  };

  const goNext = () => {
    const next = steps[currentStepIndex + 1];
    if (next) setCurrentStep(next.key);
  };

  const goBack = () => {
    const prev = steps[currentStepIndex - 1];
    if (prev) setCurrentStep(prev.key);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const isActive = step.key === currentStep;
          const isCompleted = idx < currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-2">
              {idx > 0 && (
                <div
                  className={cn(
                    "w-8 h-px",
                    isCompleted ? "bg-signal" : "bg-border-subtle"
                  )}
                />
              )}
              <button
                onClick={() => {
                  if (isCompleted) setCurrentStep(step.key);
                }}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive &&
                    "bg-signal/10 text-signal border border-signal/20",
                  isCompleted &&
                    "text-signal cursor-pointer hover:bg-signal/5",
                  !isActive &&
                    !isCompleted &&
                    "text-text-muted cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-signal" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="hover:translate-y-0 hover:bg-card">
        {/* Step 1: Auth */}
        {currentStep === "auth" && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Enter Credentials
              </CardTitle>
              <CardDescription>
                Provide the required authentication details for{" "}
                {displayName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label
                    htmlFor={field.key}
                    className="text-sm font-medium text-text-primary"
                  >
                    {field.label}
                    <span className="text-status-danger ml-0.5">*</span>
                  </label>
                  <Input
                    id={field.key}
                    type={field.type === "password" ? "password" : "text"}
                    placeholder={field.placeholder}
                    value={formValues[field.key] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                  />
                  {field.helpText && (
                    <p className="text-xs text-text-muted">
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <Button
                  variant="signal"
                  onClick={() => {
                    if (optionalFields.length > 0) {
                      setCurrentStep("configure");
                    } else {
                      handleConnect();
                    }
                  }}
                  disabled={!allRequiredFilled}
                >
                  {optionalFields.length > 0 ? (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Connect
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Configure */}
        {currentStep === "configure" && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Configure Integration
              </CardTitle>
              <CardDescription>
                Customize optional settings for your {displayName}{" "}
                integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionalFields.length > 0 ? (
                optionalFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-text-primary"
                    >
                      {field.label}
                      <span className="text-text-muted ml-1 text-xs">
                        (optional)
                      </span>
                    </label>
                    <Input
                      id={field.key}
                      type={field.type === "password" ? "password" : "text"}
                      placeholder={field.placeholder}
                      value={formValues[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                    />
                    {field.helpText && (
                      <p className="text-xs text-text-muted">
                        {field.helpText}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">
                  No additional configuration needed.
                </p>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  variant="signal"
                  onClick={handleConnect}
                  disabled={
                    connectMutation.isPending || !allRequiredFilled
                  }
                >
                  {connectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Test */}
        {currentStep === "test" && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Test Connection
              </CardTitle>
              <CardDescription>
                Verify that your {displayName} integration is working
                correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResult && (
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border",
                    testResult.success
                      ? "bg-status-ok/5 border-status-ok/20"
                      : "bg-status-danger/5 border-status-danger/20"
                  )}
                >
                  <SignalDot
                    status={testResult.success ? "ok" : "danger"}
                    size="md"
                    pulse={testResult.success}
                  />
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        testResult.success
                          ? "text-status-ok"
                          : "text-status-danger"
                      )}
                    >
                      {testResult.success
                        ? "Connection Successful"
                        : "Connection Failed"}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {testResult.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleTest}
                    disabled={testMutation.isPending}
                  >
                    {testMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Run Test
                      </>
                    )}
                  </Button>
                  <Button variant="signal" onClick={goNext}>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 4: Enable */}
        {currentStep === "enable" && (
          <>
            <CardHeader>
              <CardTitle className="font-display">
                Integration Active
              </CardTitle>
              <CardDescription>
                Your {displayName} integration is connected and ready to
                use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-signal/5 border border-signal/20">
                <SignalDot status="ok" size="lg" pulse />
                <div>
                  <p className="text-sm font-medium text-signal">
                    Integration Connected
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {displayName} is now integrated with Monita. Alerts
                    and actions will flow automatically.
                  </p>
                </div>
              </div>

              {connectedIntegration && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted">Status:</span>
                    <Badge variant="status-ok">Connected</Badge>
                  </div>
                  {connectedIntegration.metadata?.lastSyncAt && (
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">Last sync:</span>
                      <span className="text-text-secondary">
                        {new Date(
                          connectedIntegration.metadata.lastSyncAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button variant="signal" onClick={handleFinish}>
                  <CheckCircle2 className="w-4 h-4" />
                  Done
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
