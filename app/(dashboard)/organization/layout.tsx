"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Building2, Users, UsersRound, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const orgTabs = [
  { name: "General", href: "/organization/general", icon: Building2 },
  { name: "Members", href: "/organization/members", icon: Users },
  { name: "Teams", href: "/organization/teams", icon: UsersRound },
  { name: "Audit Log", href: "/organization/audit-log", icon: ScrollText },
];

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left sidebar navigation */}
      <nav className="w-1/5.5 shrink-0 border-r border-border-subtle space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 px-3">
          Organization
        </h2>
        {orgTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-signal/10 text-signal border-l-2 border-signal"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.name}
            </Link>
          );
        })}
      </nav>

      {/* Content area */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
