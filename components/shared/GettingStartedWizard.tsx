"use client";

import { useState, useCallback } from "react";
import { TerminalBlock } from "@/components/shared/TerminalBlock";
import { Button } from "@/components/ui/button";
import { X, Check, RefreshCw, Package, Code, Send, Eye } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GettingStartedWizardProps {
  projectId: string;
  apiKey: string;
  onDismiss: () => void;
}

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Install the SDK",
    description: "Add the Apperio SDK to your project via npm.",
    icon: <Package className="w-4 h-4" />,
  },
  {
    number: 2,
    title: "Initialize the Logger",
    description: "Configure and initialize Apperio with your project credentials.",
    icon: <Code className="w-4 h-4" />,
  },
  {
    number: 3,
    title: "Send a Test Log",
    description: "Send your first log entry to verify the integration.",
    icon: <Send className="w-4 h-4" />,
  },
  {
    number: 4,
    title: "Verify in Dashboard",
    description: "Confirm your logs are arriving in the dashboard.",
    icon: <Eye className="w-4 h-4" />,
  },
];

// ---------------------------------------------------------------------------
// Step Number Indicator
// ---------------------------------------------------------------------------

function StepIndicator({
  number,
  state,
}: {
  number: number;
  state: "completed" | "active" | "pending";
}) {
  if (state === "completed") {
    return (
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-signal text-bg-void shrink-0">
        <Check className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-signal bg-signal/10 text-signal shrink-0">
        <span className="text-sm font-display font-bold">{number}</span>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border border-border-subtle bg-bg-base text-text-muted shrink-0">
      <span className="text-sm font-display font-semibold">{number}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GettingStartedWizard({
  projectId,
  apiKey,
  onDismiss,
}: GettingStartedWizardProps) {
  const [activeStep, setActiveStep] = useState(1);

  const handleMarkComplete = useCallback(
    (stepNumber: number) => {
      if (stepNumber === activeStep && activeStep < 4) {
        setActiveStep(activeStep + 1);
      }
    },
    [activeStep]
  );

  const getStepState = (stepNumber: number): "completed" | "active" | "pending" => {
    if (stepNumber < activeStep) return "completed";
    if (stepNumber === activeStep) return "active";
    return "pending";
  };

  // Code snippets
  const installCode = `npm install apperio`;

  const initCode = `import Apperio from 'apperio';

const logger = new Apperio({
  apiKey: '${apiKey}',
  projectId: '${projectId}',
});

logger.init();`;

  const testLogCode = `logger.info('Hello from Apperio!', {
  source: 'getting-started',
});`;

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-faint">
        <div>
          <h2 className="text-lg font-display font-bold text-text-primary">
            Getting Started
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Set up Apperio in your application in a few minutes.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
          aria-label="Dismiss wizard"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Dismiss</span>
        </button>
      </div>

      {/* Steps */}
      <div className="px-6 py-6">
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-[15px] top-8 bottom-4 w-px bg-border-subtle"
            aria-hidden="true"
          />

          <div className="space-y-6">
            {/* Step 1: Install */}
            <div className="relative flex gap-4">
              <StepIndicator number={1} state={getStepState(1)} />
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {steps[0].icon}
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    {steps[0].title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {steps[0].description}
                </p>
                <TerminalBlock
                  code={installCode}
                  filename="terminal"
                  language="bash"
                  className="mb-3"
                />
                {getStepState(1) === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkComplete(1)}
                    className="border-border-subtle text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Mark as done
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Initialize */}
            <div className="relative flex gap-4">
              <StepIndicator number={2} state={getStepState(2)} />
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {steps[1].icon}
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    {steps[1].title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {steps[1].description}
                </p>
                {getStepState(2) !== "pending" && (
                  <>
                    <TerminalBlock
                      code={initCode}
                      filename="app.ts"
                      language="typescript"
                      className="mb-3"
                    />
                    {getStepState(2) === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkComplete(2)}
                        className="border-border-subtle text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Mark as done
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Send Test Log */}
            <div className="relative flex gap-4">
              <StepIndicator number={3} state={getStepState(3)} />
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  {steps[2].icon}
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    {steps[2].title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {steps[2].description}
                </p>
                {getStepState(3) !== "pending" && (
                  <>
                    <TerminalBlock
                      code={testLogCode}
                      filename="app.ts"
                      language="typescript"
                      className="mb-3"
                    />
                    {getStepState(3) === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkComplete(3)}
                        className="border-border-subtle text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Mark as done
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Step 4: Verify */}
            <div className="relative flex gap-4">
              <StepIndicator number={4} state={getStepState(4)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {steps[3].icon}
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    {steps[3].title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {steps[3].description}
                </p>
                {getStepState(4) !== "pending" && (
                  <div className="rounded-lg border border-border-subtle bg-bg-base p-4">
                    <p className="text-sm text-text-secondary mb-4">
                      Once you send your first log, it will appear here in
                      real-time. Refresh this page after sending the test log.
                    </p>
                    <Button
                      variant="signal"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Refresh Page
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
