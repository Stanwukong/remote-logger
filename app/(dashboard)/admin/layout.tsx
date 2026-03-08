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

      {/* Content area */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
