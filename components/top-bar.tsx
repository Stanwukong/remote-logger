"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWebsocket } from "@/hooks/useWebsocket";

interface TopBarProps {
  onCommandOpen: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "error" | "warning" | "info" | "success";
  unread: boolean;
  projectId?: string;
  logId?: string;
  timestamp: number;
}

interface TimeRange {
  label: string;
  value: string;
  hours: number;
}

const TIME_RANGES: TimeRange[] = [
  { label: "Last hour", value: "1h", hours: 1 },
  { label: "Last 24 hours", value: "24h", hours: 24 },
  { label: "Last 7 days", value: "7d", hours: 168 },
  { label: "Last 30 days", value: "30d", hours: 720 },
];

export function TopBar({ onCommandOpen }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  // WebSocket connection for real-time notifications
  const { lastMessage } = useWebsocket();

  // Handle real-time notifications
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);

        if (data.type === "error" || data.type === "alert") {
          const newNotification: Notification = {
            id: data.id || Date.now().toString(),
            title: data.title || "New Alert",
            message: data.message || "An issue has been detected",
            time: "Just now",
            type: data.severity === "high" ? "error" : "warning",
            unread: true,
            projectId: data.projectId,
            logId: data.logId,
            timestamp: Date.now(),
          };

          setNotifications((prev) => [
            newNotification,
            ...prev.slice(0, 49),
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

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
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle notification actions
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, unread: false } : n
        )
      );

      if (notification.projectId) {
        router.push(`/projects/${notification.projectId}`);
      } else if (notification.logId) {
        router.push(`/logs?logId=${notification.logId}`);
      }
    },
    [router]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  // Handle time range change
  const handleTimeRangeChange = useCallback((timeRange: string) => {
    setSelectedTimeRange(timeRange);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-status-warn" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-status-ok" />;
      default:
        return <Info className="h-4 w-4 text-data-info" />;
    }
  };

  const getTimeRangeLabel = (value: string) => {
    return (
      TIME_RANGES.find((range) => range.value === value)?.label || "Last 24h"
    );
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border-subtle bg-bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-bg-base/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbLink
              href="/dashboard"
              className="text-text-muted hover:text-text-secondary"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((breadcrumb) => (
            <div key={breadcrumb.href} className="flex items-center">
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage className="text-text-primary">
                    {breadcrumb.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={breadcrumb.href}
                    className="text-text-muted hover:text-text-secondary"
                  >
                    {breadcrumb.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center space-x-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onCommandOpen}
          className="hidden md:inline-flex items-center gap-2 h-9 w-64 rounded-md border border-border-subtle bg-bg-surface px-3 text-sm text-text-muted hover:bg-bg-elevated/50 hover:text-text-secondary transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border-subtle bg-bg-elevated px-1.5 font-mono text-[10px] font-medium text-text-muted">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>

        <Separator orientation="vertical" className="h-4" />

        {/* Time Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-text-secondary hover:text-text-primary"
            >
              <Clock className="w-4 h-4 mr-2" />
              {getTimeRangeLabel(selectedTimeRange)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-bg-surface border-border-subtle"
          >
            <DropdownMenuLabel className="text-text-muted">
              Time Range
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {TIME_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.value}
                onSelect={() => handleTimeRangeChange(range.value)}
                className={
                  selectedTimeRange === range.value
                    ? "bg-signal/10 text-signal"
                    : ""
                }
              >
                {range.label}
              </DropdownMenuItem>
            ))}
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
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-status-danger text-[10px] text-white flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-bg-surface border-border-subtle"
          >
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="text-text-primary">Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-6 px-2 text-xs text-signal hover:text-signal-bright"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-text-muted mb-2" />
                  <p className="text-sm text-text-muted">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-4 space-y-1 cursor-pointer hover:bg-bg-elevated/50"
                    onSelect={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="text-sm font-medium text-text-primary">
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-signal rounded-full" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-text-muted">
                        {notification.time}
                      </span>
                      {notification.projectId && (
                        <Badge
                          variant="outline"
                          className="text-xs border-border-subtle"
                        >
                          Project
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-signal hover:text-signal-bright"
              onSelect={() => router.push("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/settings")}
          className="text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
