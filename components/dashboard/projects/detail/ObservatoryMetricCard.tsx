"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ObservatoryMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantConfig = {
  default: {
    value: "text-signal",
    border: "hover:border-signal/40",
    iconBg: "bg-signal/10",
    iconColor: "text-signal",
  },
  success: {
    value: "text-status-ok",
    border: "hover:border-status-ok/40",
    iconBg: "bg-status-ok/10",
    iconColor: "text-status-ok",
  },
  warning: {
    value: "text-status-warn",
    border: "hover:border-status-warn/40",
    iconBg: "bg-status-warn/10",
    iconColor: "text-status-warn",
  },
  danger: {
    value: "text-status-danger",
    border: "hover:border-status-danger/40",
    iconBg: "bg-status-danger/10",
    iconColor: "text-status-danger",
  },
};

export function ObservatoryMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: ObservatoryMetricCardProps) {
  const config = variantConfig[variant];
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div
      className={cn(
        "bg-bg-surface border border-border-subtle rounded-lg p-5 transition-all duration-200",
        config.border,
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-lg", config.iconBg)}>
          <Icon className={cn("h-4 w-4", config.iconColor)} />
        </div>
        {TrendIcon && (
          <TrendIcon
            className={cn(
              "h-4 w-4",
              trend === "up" ? "text-status-ok" : "text-status-danger"
            )}
          />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className={cn("text-3xl font-display font-bold", config.value)}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
