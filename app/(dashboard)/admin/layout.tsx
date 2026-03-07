"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Building2,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminTabs = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Organizations", href: "/admin/organizations", icon: Building2 },
  { name: "System", href: "/admin/system", icon: Server },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left sidebar navigation */}
      <nav className="w-56 shrink-0 border-r border-border-subtle space-y-1 pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 px-3">
          Admin Dashboard
        </h2>
        {adminTabs.map((tab) => {
          const isActive =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
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
