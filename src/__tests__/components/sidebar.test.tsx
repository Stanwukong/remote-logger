import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ============================================
// Mocks must be defined before imports
// ============================================

// Track the pathname mock so individual tests can override it
let mockPathname = "/dashboard";
let mockProjects: any[] = [];
let mockAlertStats: any = { data: { active: 0 } };
let mockUserProfile: any = { role: "user" };
let mockCurrentProjectId: string | null = null;
let mockCurrentOrgId: string | null = null;

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link to render a real <a> tag
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock project hooks
vi.mock("@/hooks/project.hooks", () => ({
  useProjects: () => ({
    data: { data: mockProjects },
    isLoading: false,
  }),
}));

// Mock alert hooks
vi.mock("@/hooks/alerts.hook", () => ({
  useUserAlertStats: () => ({
    data: mockAlertStats,
    isLoading: false,
  }),
}));

// Mock user hooks
vi.mock("@/hooks/user.hook", () => ({
  useProfile: () => ({
    data: mockUserProfile,
    isLoading: false,
  }),
}));

// Mock Zustand stores
vi.mock("@/store/loghive-store", () => ({
  useLogHiveStore: (selector: any) =>
    selector({
      currentProjectId: mockCurrentProjectId,
      sidebarCollapsed: false,
    }),
}));

vi.mock("@/store/organization-store", () => ({
  useOrganizationStore: (selector: any) =>
    selector({
      currentOrgId: mockCurrentOrgId,
    }),
}));

// Mock shared components
vi.mock("@/components/shared/SignalDot", () => ({
  SignalDot: ({ status, size, pulse }: any) => (
    <span data-testid="signal-dot" data-status={status} data-size={size} />
  ),
}));

vi.mock("@/components/shared/OrgSwitcher", () => ({
  OrgSwitcher: () => <div data-testid="org-switcher">Org Switcher</div>,
}));

// Mock the shadcn sidebar UI components to render simple HTML
vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children, className }: any) => (
    <aside data-testid="sidebar" className={className}>
      {children}
    </aside>
  ),
  SidebarContent: ({ children, className }: any) => (
    <div data-testid="sidebar-content" className={className}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children, className }: any) => (
    <footer data-testid="sidebar-footer" className={className}>
      {children}
    </footer>
  ),
  SidebarHeader: ({ children, className }: any) => (
    <header data-testid="sidebar-header" className={className}>
      {children}
    </header>
  ),
  SidebarGroup: ({ children }: any) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children }: any) => <div>{children}</div>,
  SidebarGroupLabel: ({ children, className }: any) => (
    <span className={className}>{children}</span>
  ),
  SidebarMenu: ({ children }: any) => (
    <nav data-testid="sidebar-menu">{children}</nav>
  ),
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children, asChild, isActive, className }: any) => (
    <div data-active={isActive} className={className}>
      {children}
    </div>
  ),
  SidebarMenuSub: ({ children }: any) => (
    <div data-testid="sidebar-menu-sub">{children}</div>
  ),
  SidebarMenuSubItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuSubButton: ({ children, asChild, isActive, className }: any) => (
    <div data-active={isActive} className={className}>
      {children}
    </div>
  ),
  SidebarSeparator: () => <hr />,
}));

// Mock badge
vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

// Now import the component under test
import { AppSidebar } from "@/components/app-sidebar";

// ============================================
// Tests
// ============================================

describe("AppSidebar", () => {
  beforeEach(() => {
    // Reset all mocks to defaults before each test
    mockPathname = "/dashboard";
    mockProjects = [];
    mockAlertStats = { data: { active: 0 } };
    mockUserProfile = { role: "user" };
    mockCurrentProjectId = null;
    mockCurrentOrgId = null;
  });

  it("renders the sidebar with Monita branding", () => {
    render(<AppSidebar />);

    expect(screen.getByText("Monita")).toBeInTheDocument();
    expect(screen.getByText("Developer Console")).toBeInTheDocument();
  });

  it("renders primary navigation items", () => {
    render(<AppSidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Logs")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Custom Dashboards")).toBeInTheDocument();
  });

  it("renders resource links", () => {
    render(<AppSidebar />);

    expect(screen.getByText("SDK Docs")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Integrations")).toBeInTheDocument();
  });

  it("shows project count badge", () => {
    mockProjects = [
      { _id: "p1", name: "Project 1", isActive: true },
      { _id: "p2", name: "Project 2", isActive: true },
    ];
    render(<AppSidebar />);

    // The Projects nav item should show badge with count "2"
    const badges = screen.getAllByTestId("badge");
    const projectBadge = badges.find((b) => b.textContent === "2");
    expect(projectBadge).toBeInTheDocument();
  });

  it("shows active alert count badge when alerts exist", () => {
    mockAlertStats = { data: { active: 5 } };
    render(<AppSidebar />);

    const badges = screen.getAllByTestId("badge");
    const alertBadge = badges.find((b) => b.textContent === "5");
    expect(alertBadge).toBeInTheDocument();
    expect(alertBadge).toHaveAttribute("data-variant", "destructive");
  });

  it("does not show alert badge when no active alerts", () => {
    mockAlertStats = { data: { active: 0 } };
    render(<AppSidebar />);

    const badges = screen.getAllByTestId("badge");
    // Only the project count badge should be present (showing "0")
    const alertBadge = badges.find(
      (b) => b.getAttribute("data-variant") === "destructive"
    );
    expect(alertBadge).toBeUndefined();
  });

  it("shows project sub-navigation when a project is in the URL", () => {
    mockPathname = "/projects/proj_123/logs";
    mockCurrentProjectId = "proj_123";
    mockProjects = [
      { _id: "proj_123", name: "My Project", isActive: true },
    ];

    render(<AppSidebar />);

    // The Active Project section should be visible with sub-nav items
    expect(screen.getByText("Active Project")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    // Check a subset of sub-nav items
    expect(screen.getByText("Errors")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Web Vitals")).toBeInTheDocument();
    expect(screen.getByText("Sessions")).toBeInTheDocument();
    expect(screen.getByText("Traces")).toBeInTheDocument();
    expect(screen.getByText("Funnels")).toBeInTheDocument();
  });

  it("does not show project sub-navigation when no project in URL", () => {
    mockPathname = "/dashboard";
    render(<AppSidebar />);

    expect(screen.queryByText("Active Project")).not.toBeInTheDocument();
  });

  it("shows admin section only for admin users", () => {
    mockUserProfile = { role: "admin" };
    render(<AppSidebar />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    // Admin sub-items should exist - but "Overview" and "Users" are also used elsewhere
    // Check for admin-specific URLs
    const adminLinks = screen
      .getAllByRole("link")
      .filter(
        (link) =>
          link.getAttribute("href")?.startsWith("/admin")
      );
    expect(adminLinks.length).toBeGreaterThan(0);
  });

  it("does not show admin section for regular users", () => {
    mockUserProfile = { role: "user" };
    render(<AppSidebar />);

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("shows organization section when org is selected", () => {
    mockCurrentOrgId = "org_123";
    render(<AppSidebar />);

    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("Audit Log")).toBeInTheDocument();
  });

  it("does not show organization section when no org selected", () => {
    mockCurrentOrgId = null;
    render(<AppSidebar />);

    expect(screen.queryByText("Organization")).not.toBeInTheDocument();
    expect(screen.queryByText("Audit Log")).not.toBeInTheDocument();
  });

  it("renders the footer with system status and logout", () => {
    render(<AppSidebar />);

    expect(screen.getByText("System status")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByLabelText("Logout")).toBeInTheDocument();
  });

  it("renders the org switcher", () => {
    render(<AppSidebar />);

    expect(screen.getByTestId("org-switcher")).toBeInTheDocument();
  });

  it("displays project name in active project header", () => {
    mockPathname = "/projects/proj_abc";
    mockProjects = [
      { _id: "proj_abc", name: "Production App", isActive: true },
    ];

    render(<AppSidebar />);

    expect(screen.getByText("Production App")).toBeInTheDocument();
  });

  it('shows "Loading..." when project not yet fetched', () => {
    mockPathname = "/projects/proj_unknown";
    mockProjects = []; // no matching project

    render(<AppSidebar />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
