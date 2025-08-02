"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Bell,
  Settings,
  Command,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopBarProps {
  onCommandOpen: () => void;
}

export function TopBar({ onCommandOpen }: TopBarProps) {
  const pathname = usePathname();
  const [notifications] = useState([
    {
      id: 1,
      title: "High error rate detected",
      message: "Web Application project has 15% error rate",
      time: "2 minutes ago",
      type: "error",
      unread: true,
    },
    {
      id: 2,
      title: "New team member added",
      message: "Sarah Johnson joined the Analytics team",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "API rate limit reached",
      message: "Mobile App Backend reached 80% of rate limit",
      time: "3 hours ago",
      type: "warning",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { name: string; href: string; isLast: boolean }[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;

      // Format segment name
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        name,
        href,
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((breadcrumb) => (
            <div key={breadcrumb.href} className="flex items-center">
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center space-x-2">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search logs, projects..."
            className="pl-10 w-64 focus-visible:ring-1"
            onClick={onCommandOpen}
            readOnly
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1">

          <Button variant="ghost" size="sm" className="hidden lg:flex">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>

          <Button variant="ghost" size="sm" className="hidden lg:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Time Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Clock className="w-4 h-4 mr-2" />
              Last 24h
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Time Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Last hour</DropdownMenuItem>
            <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Calendar className="w-4 h-4 mr-2" />
              Custom range
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-4 space-y-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-sm font-medium">
                      {notification.title}
                    </h4>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
