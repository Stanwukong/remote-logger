import { apiClient } from './config';
import { ApiError, handleApiError } from './auth.service';

export const sourceMapService = {
  listSourceMaps: async (projectId: string, release?: string) => {
    try {
      const params = new URLSearchParams();
      if (release) params.append('release', release);
      const response = await apiClient.get(`/${projectId}/sourcemaps?${params}`);
      if (response.data.status === 'error') throw new ApiError(response.data.message, response.status);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  resolveStackTrace: async (projectId: string, release: string, stackTrace: string) => {
    try {
      const response = await apiClient.post(`/${projectId}/sourcemaps/resolve`, { release, stackTrace });
      if (response.data.status === 'error') throw new ApiError(response.data.message, response.status);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  deleteSourceMap: async (projectId: string, id: string) => {
    try {
      const response = await apiClient.delete(`/${projectId}/sourcemaps/${id}`);
      if (response.data.status === 'error') throw new ApiError(response.data.message, response.status);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
