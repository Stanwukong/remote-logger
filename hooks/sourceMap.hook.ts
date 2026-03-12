import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceMapService } from '@/services/sourceMap.service';

export const useSourceMaps = (projectId: string, release?: string) =>
  useQuery({
    queryKey: ['sourcemaps', projectId, release],
    queryFn: () => sourceMapService.listSourceMaps(projectId, release),
    enabled: !!projectId,
  });

export const useResolveStackTrace = (projectId: string) => {
  return useMutation({
    mutationFn: ({ release, stackTrace }: { release: string; stackTrace: string }) =>
      sourceMapService.resolveStackTrace(projectId, release, stackTrace),
  });
};

export const useDeleteSourceMap = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sourceMapService.deleteSourceMap(projectId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sourcemaps', projectId] }),
  });
};
