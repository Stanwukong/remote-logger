// organization.types.ts
// ============================================
// ORGANIZATION & TEAMS TYPES
// ============================================

/** Roles a member can hold within an organization. */
export type OrgRole = "owner" | "admin" | "member" | "viewer";

/** Roles a member can hold within a team. */
export type TeamRole = "lead" | "member";

/** Permission levels for project access. */
export type ProjectPermission = "read" | "write" | "admin";

/** Plan tiers for an organization. */
export type OrgPlan = "free" | "starter" | "pro" | "enterprise";

// ============================================
// ORGANIZATION
// ============================================

export interface OrgMember {
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  role: OrgRole;
  invitedAt?: string;
  joinedAt?: string;
}

export interface OrgSettings {
  defaultRetentionDays?: number;
  enforcesMfa?: boolean;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  billingEmail?: string;
  plan: OrgPlan;
  ownerId: string | { _id: string; email: string; firstName?: string; lastName?: string };
  members: OrgMember[];
  settings: OrgSettings;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TEAMS
// ============================================

export interface TeamMember {
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  } | string;
  role: TeamRole;
}

export interface ProjectAccess {
  project: string | { _id: string; name: string };
  permission: ProjectPermission;
}

export interface Team {
  _id: string;
  organizationId: string;
  name: string;
  members: TeamMember[];
  projectAccess: ProjectAccess[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AUDIT LOG
// ============================================

export interface AuditLogEntry {
  _id: string;
  organizationId: string;
  userId: string | { _id: string; email: string; firstName?: string; lastName?: string };
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// ============================================
// REQUEST / MUTATION PAYLOADS
// ============================================

export interface CreateOrgPayload {
  name: string;
  billingEmail?: string;
}

export interface UpdateOrgPayload {
  name?: string;
  billingEmail?: string;
  settings?: Partial<OrgSettings>;
}

export interface InviteMemberPayload {
  email: string;
  role: OrgRole;
}

export interface UpdateMemberRolePayload {
  role: OrgRole;
}

export interface CreateTeamPayload {
  name: string;
}

export interface UpdateTeamPayload {
  name?: string;
}

export interface AddTeamMemberPayload {
  userId: string;
  role?: TeamRole;
}

export interface SetProjectAccessPayload {
  projectAccess: { project: string; permission: ProjectPermission }[];
}

export interface AuditLogFilters {
  action?: string;
  resource?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
