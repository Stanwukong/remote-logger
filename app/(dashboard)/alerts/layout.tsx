"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  AlertTriangle,
  List,
  BookOpen,
  BarChart3,
  Shield,
  Wrench,
} from "lucide-react";

const alertTabs = [
  { name: "Events", href: "/alerts", icon: List },
  { name: "Rules", href: "/alerts/rules", icon: BookOpen },
  { name: "Analytics", href: "/alerts/analytics", icon: BarChart3 },
  { name: "Escalation", href: "/alerts/escalation-policies", icon: Shield },
  { name: "Maintenance", href: "/alerts/maintenance-windows", icon: Wrench },
];

function isTabActive(pathname: string, href: string): boolean {
  if (href === "/alerts") {
    return pathname === "/alerts";
  }
  return pathname.startsWith(href);
}

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* Page Header */}
      <div className="shrink-0 border-b border-border-subtle">
        <PageHeader
          title="Alerts"
          description="Monitor, manage, and respond to alerts across all your projects"
          badge={
            <AlertTriangle className="h-5 w-5 text-status-warn" />
          }
        />

        {/* Horizontal Tab Navigation */}
        <nav className="flex items-center gap-1 -mb-px overflow-x-auto">
          {alertTabs.map((tab) => {
            const active = isTabActive(pathname, tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                  active
                    ? "text-signal border-signal"
                    : "text-text-muted hover:text-text-primary border-transparent hover:border-border-subtle"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
