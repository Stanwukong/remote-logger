"use client";

import { Lock } from "lucide-react";
import { useBetaAccess } from "@/store/apperio-store";

interface UpgradeGateProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Wraps content that requires the "full" beta tier.
 * When the user is on "core" tier, renders an informational overlay instead of children.
 */
export function UpgradeGate({ feature, children }: UpgradeGateProps) {
  const { betaTier } = useBetaAccess();

  if (betaTier === "full") {
    return <>{children}</>;
  }

  return (
    <div className="relative flex items-center justify-center min-h-[400px] p-8">
      <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm rounded-xl" />
      <div className="relative z-10 text-center max-w-md space-y-4">
        <div className="w-14 h-14 bg-surface border border-border-subtle rounded-xl flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-text-muted" />
        </div>
        <h3 className="text-lg font-display font-semibold text-text-primary">
          {feature}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          This feature will be available in the full release.
          You&apos;re currently on the early access core plan.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-signal/10 border border-signal/20 rounded-full text-xs text-signal font-medium">
          <span className="w-1.5 h-1.5 bg-signal rounded-full animate-pulse" />
          Coming soon
        </div>
      </div>
    </div>
  );
}
