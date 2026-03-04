"use client";

import { Project } from "@/types/project.types";
import { SignalDot } from "@/components/shared/SignalDot";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, TrendingUp, Activity } from "lucide-react";

interface RecommendationsTabContentProps {
  recommendations: Project["recommendations"];
}

const CATEGORY_CONFIG: Record<
  string,
  { icon: typeof Zap; color: string; dotStatus: "ok" | "warn" | "danger" | "info" }
> = {
  performance: {
    icon: Zap,
    color: "text-signal",
    dotStatus: "ok",
  },
  reliability: {
    icon: Shield,
    color: "text-status-danger",
    dotStatus: "danger",
  },
  optimization: {
    icon: TrendingUp,
    color: "text-data-info",
    dotStatus: "info",
  },
  monitoring: {
    icon: Activity,
    color: "text-status-warn",
    dotStatus: "warn",
  },
};

export function RecommendationsTabContent({
  recommendations,
}: RecommendationsTabContentProps) {
  const categories = recommendations?.categories ?? {};
  const entries = Object.entries(categories);
  const totalItems = entries.reduce((sum, [, items]) => sum + (items?.length ?? 0), 0);

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-text-primary">
          <Shield className="w-5 h-5 text-signal" />
          <h3 className="font-display font-semibold">Action Items</h3>
        </div>
        <Badge
          variant="outline"
          className={
            recommendations.priority === "high"
              ? "bg-status-danger/10 text-status-danger border-status-danger/30"
              : recommendations.priority === "medium"
              ? "bg-status-warn/10 text-status-warn border-status-warn/30"
              : "bg-bg-elevated text-text-secondary border-border-subtle"
          }
        >
          {recommendations.priority} priority
        </Badge>
      </div>
      <p className="text-sm text-text-muted mb-6">
        {totalItems} recommended improvement{totalItems !== 1 ? "s" : ""} based on
        current metrics
      </p>

      {totalItems === 0 ? (
        <div className="text-center py-8">
          <SignalDot status="ok" size="md" className="mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            No action items at this time. Your project is performing well!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entries.map(([category, items]) => {
            if (items.length === 0) return null;
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.monitoring;
            const CategoryIcon = config.icon;

            return (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-sm capitalize flex items-center gap-2 text-text-primary">
                  <CategoryIcon className={`w-4 h-4 ${config.color}`} />
                  {category}
                  <span className="text-text-muted text-xs">({items.length})</span>
                </h4>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-bg-base border border-border-faint rounded-lg hover:border-border-subtle transition-colors"
                    >
                      <SignalDot
                        status={config.dotStatus}
                        size="sm"
                        className="mt-1 shrink-0"
                      />
                      <span className="text-sm text-text-secondary leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
