// project.types.ts
// ============================================
// PROJECTS TYPES
// ============================================

// A tag associated with a project.
export type ProjectTag = {
  id: string;
  name: string;
  createdAt: string;
};

// A team member associated with a project.
export type TeamMember = {
  id: string;
  userId: string;
  role: "owner" | "admin" | "member";
  email: string;
};

// Integration settings for a project.
export type IntegrationSettings = {
  id: string;
  name: string;
  isEnabled: boolean;
  config: Record<string, any>;
};

// The main project data structure.
export type Project = {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  userId: string;
  isArchived: boolean;
  tags: ProjectTag[];
  teamMembers: TeamMember[];
  integrationSettings: IntegrationSettings[];
  rateLimit: {
    maxRequests: number;
    windowInMinutes: number;
  };
  logCount: number;
  createdAt: string;
  updatedAt: string;
};

// Data for creating a new project.
export type ProjectCreateData = {
  name: string;
  description?: string;
};

// Data for updating an existing project.
export type ProjectUpdateData = {
  name?: string;
  description?: string;
  tags?: ProjectTag[];
  rateLimit?: {
    maxRequests: number;
    windowInMinutes: number;
  };
};

// Filters for fetching a list of projects.
export type ProjectFilters = {
  isArchived?: boolean;
  tag?: string;
};

// Summary of all projects.
export type ProjectsSummary = {
  totalProjects: number;
  activeProjects: number;
  archivedProjects: number;
  projectsByTag: Record<string, number>;
};

// Analytics data for projects.
export type ProjectAnalytics = {
  totalLogs: number;
  activeProjects: number;
  projects: {
    projectId: string;
    logCount: number;
  }[];
};

// Usage statistics for a single project.
export type ProjectStats = {
  totalLogs: number;
  dailyLogCount: { date: string; count: number }[];
};

// Payload for bulk deletion.
export type BulkDeletePayload = {
  projectIds: string[];
};
