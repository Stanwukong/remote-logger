/* eslint-disable @typescript-eslint/no-explicit-any */


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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Activity,
  BarChart3,
  Folder,
  Settings,
  Code,
  HelpCircle,
  Search,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge  } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useProjects } from "@/hooks/project.hooks";
import { Project } from "@/types/project.types";

// Navigation items will be created dynamically to include project count

// Helper function to get project status based on analytics
const getProjectStatus = (project: Project): string => {
  if (!project.analytics) return "inactive";
  
  const { errorRate } = project.analytics.overview;
  const responseTimeHealth = project.analytics.responseTime.current.health;
  const performanceHealth = project.analytics.performance.health;
  const errorHealth = project.analytics.errors.health;
  
  if (errorRate > 0.1 || responseTimeHealth === "critical" || performanceHealth === "critical" || errorHealth === "critical") {
    return "critical";
  }
  if (errorRate > 0.05 || responseTimeHealth === "poor" || performanceHealth === "poor" || errorHealth === "poor") {
    return "warning";
  }
  if (responseTimeHealth === "excellent" && performanceHealth === "excellent" && errorHealth === "excellent") {
    return "excellent";
  }
  
  return "good";
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "critical":
      return "destructive";
    case "warning":
      return "secondary";
    case "excellent":
      return "default";
    default:
      return "outline";
  }
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
  
  // Fetch recent projects from database
  const { data: projectsResponse, isLoading, error } = useProjects({ 
    includeInactive: false 
  });

  
  // Get recent projects (last 5 active projects)
  const recentProjects = projectsResponse?.data?.slice(0, 5) || [];

  console.log(recentProjects)
  
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
      badge: projectsResponse?.data?.length?.toString() || "0"
    },
    {
      title: "Logs Explorer",
      url: "/logs",
      icon: Search
    },
    {
      title: "Alerts",
      url: "/alerts",
      icon: AlertTriangle,
      badge: "3",
      badgeVariants: "destructive" as const
    }
  ];

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch {}
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
    <Sidebar className="border-r border-border/40 ">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">LogHive</h2>
            <p className="text-xs text-muted-foreground">Developer Console</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badgeVariants || "secondary"} 
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
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
                    <AlertTriangle className="w-4 h-4 text-destructive" />
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
                  return (
                    <SidebarMenuItem key={project._id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/projects/${project._id}`}>
                          <Activity className="w-4 h-4" />
                          <span className="truncate">{project.name}</span>
                          <Badge 
                            variant={getStatusBadgeVariant(status) as any} 
                            className="ml-auto text-xs"
                          >
                            {status}
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>All systems operational</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
