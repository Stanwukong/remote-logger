"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface FeatureCardProps {
  pain: string;
  title: string;
  description: string;
  icon: ReactNode;
  visual?: ReactNode;
  span?: 1 | 2;
  className?: string;
}

export function FeatureCard({
  pain,
  title,
  description,
  icon,
  visual,
  span = 1,
  className,
}: FeatureCardProps) {
  return (
    <div
      data-stagger
      className={cn(
        "group relative rounded-xl border border-border-subtle bg-bg-surface/60 backdrop-blur-sm p-6 overflow-hidden transition-all duration-300",
        "hover:border-signal/30 hover:shadow-[0_0_40px_var(--signal-glow)]",
        span === 2 && "md:col-span-2",
        className
      )}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Pain point */}
        <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mb-3">
          {pain}
        </p>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-signal/10 text-signal shrink-0">
            {icon}
          </div>
          <h3 className="font-display font-bold text-base text-text-primary">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {description}
        </p>

        {/* Visual element */}
        {visual && (
          <div className="mt-2">
            {visual}
          </div>
        )}
      </div>
    </div>
  );
}
