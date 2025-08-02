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
} from "lucide-react";
import Link from "next/link";
import { Badge  } from "@/components/ui/badge";

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
    badge: "12"
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

const projectItems = [
  {
    title: "Web App",
    url: "/projects/web-app",
    icon: Activity,
    status: "active",
  },
  {
    title: "API Service",
    url: "/projects/api-service",
    icon: Activity,
    status: "active",
  },
  {
    title: "Worker Queue",
    url: "/projects/worker-queue",
    icon: Activity,
    status: "active",
  },
];

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
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {item.status}
                      </Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>All systems operational</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
