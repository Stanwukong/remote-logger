"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import { Alert } from "@/services/alert.service";
import { AlertCircle, CheckCircle, Clock, BellOff, Layers } from "lucide-react";

type AlertStatus = "all" | "active" | "acknowledged" | "resolved" | "snoozed";

interface AlertTabFiltersProps {
  selectedTab: AlertStatus;
  onTabChange: (tab: AlertStatus) => void;
  alerts: Alert[];
}

export function AlertTabFilters({
  selectedTab,
  onTabChange,
  alerts,
}: AlertTabFiltersProps) {
  const counts = {
    all: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
    snoozed: alerts.filter((a) => a.status === "snoozed").length,
  };

  const tabs: Array<{
    key: AlertStatus;
    label: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      key: "all",
      label: "All",
      icon: <Layers className="h-4 w-4" />,
      color: "signal",
    },
    {
      key: "active",
      label: "Active",
      icon: <AlertCircle className="h-4 w-4" />,
      color: "status-danger",
    },
    {
      key: "acknowledged",
      label: "Acknowledged",
      icon: <Clock className="h-4 w-4" />,
      color: "status-warn",
    },
    {
      key: "resolved",
      label: "Resolved",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "status-ok",
    },
    {
      key: "snoozed",
      label: "Snoozed",
      icon: <BellOff className="h-4 w-4" />,
      color: "text-tertiary",
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.key;
        const count = counts[tab.key];

        return (
          <Button
            key={tab.key}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.key)}
            className={`
              relative px-4 py-2 rounded-lg transition-all duration-200
              ${
                isSelected
                  ? `bg-[var(--${tab.color})]/10 border-[var(--${tab.color})] text-[var(--${tab.color})] border`
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              }
            `}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
              {count > 0 && (
                <Badge
                  className={`
                    ml-1 min-w-[20px] h-5 flex items-center justify-center
                    ${
                      isSelected
                        ? `bg-[var(--${tab.color})] text-[var(--bg-void)]`
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                    }
                  `}
                >
                  {count}
                </Badge>
              )}
            </div>
            {isSelected && tab.key === "active" && count > 0 && (
              <SignalDot
                status="danger"
                pulse
                className="absolute -top-1 -right-1"
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
