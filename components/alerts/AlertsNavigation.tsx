"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings2, Shield, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/alerts",
    label: "Events",
    icon: Bell,
    match: (pathname: string) => pathname === "/alerts",
  },
  {
    href: "/alerts/rules",
    label: "Rules",
    icon: Settings2,
    match: (pathname: string) => pathname === "/alerts/rules",
  },
  {
    href: "/alerts/escalation-policies",
    label: "Escalation Policies",
    icon: Shield,
    match: (pathname: string) => pathname === "/alerts/escalation-policies",
  },
  {
    href: "/alerts/maintenance-windows",
    label: "Maintenance Windows",
    icon: Wrench,
    match: (pathname: string) => pathname === "/alerts/maintenance-windows",
  },
];

export function AlertsNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.match(pathname);
        const Icon = tab.icon;

        return (
          <Link key={tab.href} href={tab.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "gap-2 whitespace-nowrap",
                isActive
                  ? "bg-[var(--signal)] text-[var(--bg-void)] hover:bg-[var(--signal)]/90"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
