'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabLayoutProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function TabLayout({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  children,
  className,
}: TabLayoutProps) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.id ?? '');
  const activeTab = controlledTab ?? internalTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (!controlledTab) setInternalTab(tabId);
      onTabChange?.(tabId);
    },
    [controlledTab, onTabChange]
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-1 border-b border-border-subtle overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
              'border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-signal border-signal'
                : 'text-text-muted border-transparent hover:text-text-secondary hover:border-border-accent'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  activeTab === tab.id
                    ? 'bg-signal/15 text-signal'
                    : 'bg-bg-elevated text-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div>{children(activeTab)}</div>
    </div>
  );
}
