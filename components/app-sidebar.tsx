"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Activity,
  BarChart3,
  Folder,
  GitBranch,
  Settings,
  Code,
  HelpCircle,
  Search,
  AlertTriangle,
  Loader2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SignalDot } from "@/components/shared/SignalDot";
import { useProjects } from "@/hooks/project.hooks";
import { Project } from "@/types/project.types";
import { useUserAlertStats } from "@/hooks/alerts.hook";

// Helper function to get project status based on analytics
const getProjectStatus = (project: Project): "ok" | "warn" | "danger" | "info" => {
  if (!project.analytics) return "info";

  const errorRate = project.analytics.overview?.errorRate ?? 0;
  const responseTimeHealth = project.analytics.responseTime?.current?.health;
  const performanceHealth = project.analytics.performance?.health;
  const errorHealth = project.analytics.errors?.health;

  if (
    errorRate > 0.1 ||
    responseTimeHealth === "critical" ||
    performanceHealth === "critical" ||
    errorHealth === "critical"
  ) {
    return "danger";
  }
  if (
    errorRate > 0.05 ||
    responseTimeHealth === "poor" ||
    performanceHealth === "poor" ||
    errorHealth === "poor"
  ) {
    return "warn";
  }
  if (
    responseTimeHealth === "excellent" &&
    performanceHealth === "excellent" &&
    errorHealth === "excellent"
  ) {
    return "ok";
  }

  return "ok";
};

const resourceItems = [
  {
    title: "SDK Documentation",
    url: "/sdk",
    icon: Code,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Fetch recent projects from database
  const {
    data: projectsResponse,
    isLoading,
    error,
  } = useProjects({
    includeInactive: false,
  });

  // Fetch user alert statistics
  const { data: alertStats } = useUserAlertStats();

  // Get recent projects (last 5 active projects)
  const recentProjects = projectsResponse?.data?.slice(0, 5) || [];

  // Calculate active alert count
  const activeAlertCount = alertStats?.data?.active || 0;

  // Create navigation items with dynamic project count
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
      badge: projectsResponse?.data?.length?.toString() || "0",
    },
    {
      title: "Logs Explorer",
      url: "/logs",
      icon: Search,
    },
    {
      title: "Alerts",
      url: "/alerts",
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount.toString() : undefined,
      badgeVariant: "destructive" as const,
    },
  ];

  // Check if a navigation item is active
  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name =
        eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  };

  const handleLogout = async () => {
    try {
      clearAllCookies();
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch {}
    router.replace("/login");
  };

  return (
    <Sidebar className="border-r border-border-subtle">
      <SidebarHeader className="border-b border-border-subtle">
        <div className="flex items-center space-x-2.5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-signal shrink-0"
          >
            <path
              d="M4 20L4 16L8 12L12 18L18 8L22 14L24 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="4" cy="20" r="2" fill="currentColor" />
            <circle cx="24" cy="10" r="2" fill="currentColor" />
          </svg>
          <div>
            <h2 className="font-display font-semibold text-lg tracking-[-0.02em]">
              Monita
            </h2>
            <p className="text-xs text-text-muted">Developer Console</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-clip">
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted uppercase text-[11px] tracking-wider font-display">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "bg-signal/10 text-signal font-medium border-l-2 border-signal"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || "secondary"}
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted uppercase text-[11px] tracking-wider font-display">
            Recent Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading projects...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : error ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <AlertTriangle className="w-4 h-4 text-status-danger" />
                    <span>Failed to load</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : recentProjects.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <Folder className="w-4 h-4" />
                    <span>No projects yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                recentProjects.map((project) => {
                  const status = getProjectStatus(project);
                  const projectActive = pathname.startsWith(`/projects/${project._id}`);
                  const exactActive = pathname === `/projects/${project._id}`;
                  const webVitalsActive = pathname === `/projects/${project._id}/web-vitals`;
                  const tracesActive = pathname.startsWith(`/projects/${project._id}/traces`);
                  return (
                    <SidebarMenuItem key={project._id}>
                      <SidebarMenuButton
                        asChild
                        isActive={exactActive}
                        className={
                          exactActive
                            ? "bg-signal/10 text-signal font-medium border-l-2 border-signal"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                        }
                      >
                        <Link href={`/projects/${project._id}`}>
                          <SignalDot
                            status={status}
                            size="sm"
                            pulse={status !== "info"}
                          />
                          <span className="truncate">{project.name}</span>
                          <Badge
                            variant="outline"
                            className="ml-auto text-[10px] text-text-muted"
                          >
                            {project.environment}
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                      {projectActive && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={webVitalsActive}
                              className={
                                webVitalsActive
                                  ? "text-signal font-medium"
                                  : "text-text-muted hover:text-text-primary"
                              }
                            >
                              <Link href={`/projects/${project._id}/web-vitals`}>
                                <Activity className="w-3.5 h-3.5" />
                                <span>Web Vitals</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={tracesActive}
                              className={
                                tracesActive
                                  ? "text-signal font-medium"
                                  : "text-text-muted hover:text-text-primary"
                              }
                            >
                              <Link href={`/projects/${project._id}/traces`}>
                                <GitBranch className="w-3.5 h-3.5" />
                                <span>Traces</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-text-muted uppercase text-[11px] tracking-wider font-display">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "bg-signal/10 text-signal font-medium border-l-2 border-signal"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border-subtle p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <SignalDot status="ok" size="sm" pulse />
            <span>All systems operational</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
