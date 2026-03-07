import { apiClient } from "./config";
import { ApiError, handleApiError } from "./auth.service";
import { ApiResponse } from "@/types/api";
import {
  Organization,
  Team,
  AuditLogEntry,
  CreateOrgPayload,
  UpdateOrgPayload,
  InviteMemberPayload,
  UpdateMemberRolePayload,
  CreateTeamPayload,
  UpdateTeamPayload,
  AddTeamMemberPayload,
  SetProjectAccessPayload,
  AuditLogFilters,
} from "@/types/organization.types";

const BASE = "/organizations";

export const organizationService = {
  // ============================================
  // ORGANIZATION CRUD
  // ============================================

  createOrg: async (data: CreateOrgPayload) => {
    try {
      const response = await apiClient.post<ApiResponse<Organization>>(
        BASE,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create organization",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  listOrgs: async () => {
    try {
      const response = await apiClient.get<ApiResponse<Organization[]>>(BASE);
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch organizations",
          response.status,
          response.data.errors
        );
      }
      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  getOrg: async (orgId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Organization>>(
        `${BASE}/${orgId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch organization",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateOrg: async (orgId: string, data: UpdateOrgPayload) => {
    try {
      const response = await apiClient.put<ApiResponse<Organization>>(
        `${BASE}/${orgId}`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update organization",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteOrg: async (orgId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${BASE}/${orgId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete organization",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // ============================================
  // MEMBERS
  // ============================================

  listMembers: async (orgId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Organization["members"]>>(
        `${BASE}/${orgId}/members`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch members",
          response.status,
          response.data.errors
        );
      }
      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  inviteMember: async (orgId: string, data: InviteMemberPayload) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `${BASE}/${orgId}/members`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to invite member",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  removeMember: async (orgId: string, userId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${BASE}/${orgId}/members/${userId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to remove member",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateMemberRole: async (
    orgId: string,
    userId: string,
    data: UpdateMemberRolePayload
  ) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        `${BASE}/${orgId}/members/${userId}`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update member role",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  acceptInvite: async (orgId: string) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `${BASE}/${orgId}/invites/accept`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to accept invite",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // ============================================
  // TEAMS
  // ============================================

  createTeam: async (orgId: string, data: CreateTeamPayload) => {
    try {
      const response = await apiClient.post<ApiResponse<Team>>(
        `${BASE}/${orgId}/teams`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to create team",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  listTeams: async (orgId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Team[]>>(
        `${BASE}/${orgId}/teams`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch teams",
          response.status,
          response.data.errors
        );
      }
      return response.data.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  getTeam: async (orgId: string, teamId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Team>>(
        `${BASE}/${orgId}/teams/${teamId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch team",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateTeam: async (orgId: string, teamId: string, data: UpdateTeamPayload) => {
    try {
      const response = await apiClient.put<ApiResponse<Team>>(
        `${BASE}/${orgId}/teams/${teamId}`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to update team",
          response.status,
          response.data.errors
        );
      }
      return response.data.data!;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteTeam: async (orgId: string, teamId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${BASE}/${orgId}/teams/${teamId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to delete team",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  addTeamMember: async (
    orgId: string,
    teamId: string,
    data: AddTeamMemberPayload
  ) => {
    try {
      const response = await apiClient.post<ApiResponse>(
        `${BASE}/${orgId}/teams/${teamId}/members`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to add team member",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  removeTeamMember: async (orgId: string, teamId: string, userId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${BASE}/${orgId}/teams/${teamId}/members/${userId}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to remove team member",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  setProjectAccess: async (
    orgId: string,
    teamId: string,
    data: SetProjectAccessPayload
  ) => {
    try {
      const response = await apiClient.put<ApiResponse>(
        `${BASE}/${orgId}/teams/${teamId}/access`,
        data
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to set project access",
          response.status,
          response.data.errors
        );
      }
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // ============================================
  // AUDIT LOG
  // ============================================

  getAuditLog: async (orgId: string, filters: AuditLogFilters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<AuditLogEntry[]>>(
        `${BASE}/${orgId}/audit-log?${params.toString()}`
      );
      if (response.data.status === "error") {
        throw new ApiError(
          response.data.message || "Failed to fetch audit log",
          response.status,
          response.data.errors
        );
      }
      return {
        entries: response.data.data || [],
        meta: response.data.meta,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  exportAuditLog: async (orgId: string, filters: AuditLogFilters = {}) => {
    try {
      const response = await apiClient.post(
        `${BASE}/${orgId}/audit-log/export`,
        filters,
        { responseType: "blob" }
      );

      let filename = `audit-log-${orgId}.csv`;
      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename="?([^";\n]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      handleApiError(error);
    }
  },
};
