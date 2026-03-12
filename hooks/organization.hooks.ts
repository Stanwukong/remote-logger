import { useMutation, useQuery } from "@tanstack/react-query";
import { organizationService } from "@/services/organization.service";
import { queryClient } from "@/lib/query/client";
import {
  CreateOrgPayload,
  UpdateOrgPayload,
  InviteMemberPayload,
  UpdateMemberRolePayload,
  CreateTeamPayload,
  UpdateTeamPayload,
  AddTeamMemberPayload,
  SetProjectAccessPayload,
  AuditLogFilters,
  OrgRole,
} from "@/types/organization.types";

// ============================================
// QUERY KEYS
// ============================================

export const orgQueryKeys = {
  all: ["organizations"] as const,
  lists: () => [...orgQueryKeys.all, "list"] as const,
  detail: (orgId: string) => [...orgQueryKeys.all, "detail", orgId] as const,
  members: (orgId: string) => [...orgQueryKeys.all, "members", orgId] as const,
  teams: (orgId: string) => [...orgQueryKeys.all, "teams", orgId] as const,
  teamDetail: (orgId: string, teamId: string) =>
    [...orgQueryKeys.all, "teams", orgId, teamId] as const,
  auditLog: (orgId: string, filters: AuditLogFilters) =>
    [...orgQueryKeys.all, "audit-log", orgId, filters] as const,
};

// ============================================
// ORGANIZATION QUERY HOOKS
// ============================================

/** List all organizations the current user belongs to. */
export const useOrganizations = () => {
  return useQuery({
    queryKey: orgQueryKeys.lists(),
    queryFn: () => organizationService.listOrgs(),
    staleTime: 5 * 60 * 1000,
  });
};

/** Get a single organization by ID. */
export const useOrganization = (orgId: string) => {
  return useQuery({
    queryKey: orgQueryKeys.detail(orgId),
    queryFn: () => organizationService.getOrg(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
};

/** List all members for an organization. */
export const useOrgMembers = (orgId: string) => {
  return useQuery({
    queryKey: orgQueryKeys.members(orgId),
    queryFn: () => organizationService.listMembers(orgId),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
  });
};

/** List all teams for an organization. */
export const useOrgTeams = (orgId: string) => {
  return useQuery({
    queryKey: orgQueryKeys.teams(orgId),
    queryFn: () => organizationService.listTeams(orgId),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
  });
};

/** Get a single team by ID. */
export const useOrgTeam = (orgId: string, teamId: string) => {
  return useQuery({
    queryKey: orgQueryKeys.teamDetail(orgId, teamId),
    queryFn: () => organizationService.getTeam(orgId, teamId),
    enabled: !!orgId && !!teamId,
    staleTime: 2 * 60 * 1000,
  });
};

/** Get audit log for an organization with filters. */
export const useAuditLog = (orgId: string, filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: orgQueryKeys.auditLog(orgId, filters),
    queryFn: () => organizationService.getAuditLog(orgId, filters),
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
};

// ============================================
// ORGANIZATION MUTATION HOOKS
// ============================================

/** Create a new organization. */
export const useCreateOrg = () => {
  return useMutation({
    mutationFn: (data: CreateOrgPayload) => organizationService.createOrg(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.lists() });
    },
  });
};

/** Update an organization. */
export const useUpdateOrg = () => {
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: UpdateOrgPayload }) =>
      organizationService.updateOrg(orgId, data),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.detail(orgId) });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.lists() });
    },
  });
};

/** Delete an organization. */
export const useDeleteOrg = () => {
  return useMutation({
    mutationFn: (orgId: string) => organizationService.deleteOrg(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.all });
    },
  });
};

// ============================================
// MEMBER MUTATION HOOKS
// ============================================

/** Invite a member to the organization. */
export const useInviteMember = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      data,
    }: {
      orgId: string;
      data: InviteMemberPayload;
    }) => organizationService.inviteMember(orgId, data),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.detail(orgId) });
    },
  });
};

/** Remove a member from the organization. */
export const useRemoveMember = () => {
  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: string; userId: string }) =>
      organizationService.removeMember(orgId, userId),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.detail(orgId) });
    },
  });
};

/** Update a member's role. */
export const useUpdateMemberRole = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      userId,
      role,
    }: {
      orgId: string;
      userId: string;
      role: OrgRole;
    }) => organizationService.updateMemberRole(orgId, userId, { role }),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.detail(orgId) });
    },
  });
};

/** Accept an organization invite. */
export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (orgId: string) => organizationService.acceptInvite(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.all });
    },
  });
};

// ============================================
// TEAM MUTATION HOOKS
// ============================================

/** Create a new team. */
export const useCreateTeam = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      data,
    }: {
      orgId: string;
      data: CreateTeamPayload;
    }) => organizationService.createTeam(orgId, data),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
    },
  });
};

/** Update a team. */
export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      teamId,
      data,
    }: {
      orgId: string;
      teamId: string;
      data: UpdateTeamPayload;
    }) => organizationService.updateTeam(orgId, teamId, data),
    onSuccess: (_result, { orgId, teamId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
      queryClient.invalidateQueries({
        queryKey: orgQueryKeys.teamDetail(orgId, teamId),
      });
    },
  });
};

/** Delete a team. */
export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: ({ orgId, teamId }: { orgId: string; teamId: string }) =>
      organizationService.deleteTeam(orgId, teamId),
    onSuccess: (_result, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
    },
  });
};

/** Add a member to a team. */
export const useAddTeamMember = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      teamId,
      data,
    }: {
      orgId: string;
      teamId: string;
      data: AddTeamMemberPayload;
    }) => organizationService.addTeamMember(orgId, teamId, data),
    onSuccess: (_result, { orgId, teamId }) => {
      queryClient.invalidateQueries({
        queryKey: orgQueryKeys.teamDetail(orgId, teamId),
      });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
    },
  });
};

/** Remove a member from a team. */
export const useRemoveTeamMember = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      teamId,
      userId,
    }: {
      orgId: string;
      teamId: string;
      userId: string;
    }) => organizationService.removeTeamMember(orgId, teamId, userId),
    onSuccess: (_result, { orgId, teamId }) => {
      queryClient.invalidateQueries({
        queryKey: orgQueryKeys.teamDetail(orgId, teamId),
      });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
    },
  });
};

/** Set project access for a team. */
export const useSetProjectAccess = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      teamId,
      data,
    }: {
      orgId: string;
      teamId: string;
      data: SetProjectAccessPayload;
    }) => organizationService.setProjectAccess(orgId, teamId, data),
    onSuccess: (_result, { orgId, teamId }) => {
      queryClient.invalidateQueries({
        queryKey: orgQueryKeys.teamDetail(orgId, teamId),
      });
      queryClient.invalidateQueries({ queryKey: orgQueryKeys.teams(orgId) });
    },
  });
};

/** Export audit log to CSV. */
export const useExportAuditLog = () => {
  return useMutation({
    mutationFn: ({
      orgId,
      filters,
    }: {
      orgId: string;
      filters?: AuditLogFilters;
    }) => organizationService.exportAuditLog(orgId, filters),
  });
};
