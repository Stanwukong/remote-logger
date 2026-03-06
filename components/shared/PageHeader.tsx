'use client';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, badge, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-6 px-4', className)}>
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight truncate">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-text-secondary max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
