"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  ExternalLink,
  Zap,
  TrendingUp,
  Activity,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useProjects } from "@/hooks/project.hooks";
import { useLogs } from "@/hooks/log.hooks";
import { useWebsocket } from "@/hooks/useWebsocket";
import { LogEntry } from "@/types/analytics";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects for notifications
  const { data: projectsData, refetch: refetchProjects } = useProjects();
  const projects = projectsData?.data || [];

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

          setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
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
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, unread: false } : n
      )
    );

    // Navigate to relevant page
    if (notification.projectId) {
      router.push(`/projects/${notification.projectId}`);
    } else if (notification.logId) {
      router.push(`/logs?logId=${notification.logId}`);
    }
  }, [router]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchProjects();
      // Add a small delay to show the refresh animation
      setTimeout(() => setIsRefreshing(false), 1000);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setIsRefreshing(false);
    }
  }, [refetchProjects]);

  // Handle export
  const handleExport = useCallback(() => {
    // This would typically open an export modal or trigger download
    router.push("/export");
  }, [router]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push(`/logs?search=${encodeURIComponent(query)}`);
    }
  }, [router]);

  // Handle time range change
  const handleTimeRangeChange = useCallback((timeRange: string) => {
    setSelectedTimeRange(timeRange);
    // This would typically update global state or trigger a refetch
    // For now, we'll just update the local state
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTimeRangeLabel = (value: string) => {
    return TIME_RANGES.find(range => range.value === value)?.label || "Last 24h";
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Time Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Clock className="w-4 h-4 mr-2" />
              {getTimeRangeLabel(selectedTimeRange)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Time Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {TIME_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.value}
                onSelect={() => handleTimeRangeChange(range.value)}
                className={selectedTimeRange === range.value ? "bg-accent" : ""}
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
              <span>Notifications</span>
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
                    className="h-6 px-2 text-xs"
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
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-4 space-y-1 cursor-pointer"
                    onSelect={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
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
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      {notification.projectId && (
                        <Badge variant="outline" className="text-xs">
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
              className="text-center"
              onSelect={() => router.push("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}