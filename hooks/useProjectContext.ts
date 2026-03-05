'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLogHiveStore } from '@/store/loghive-store';
import { useProject } from '@/hooks/project.hooks';

export function useProjectContext() {
  const params = useParams<{ projectId?: string }>();
  const projectId = params?.projectId ?? null;

  const storeProjectId = useLogHiveStore((s) => s.currentProjectId);
  const setCurrentProjectId = useLogHiveStore((s) => s.setCurrentProjectId);

  // Sync URL projectId -> Zustand store
  useEffect(() => {
    if (projectId !== storeProjectId) {
      setCurrentProjectId(projectId);
    }
  }, [projectId, storeProjectId, setCurrentProjectId]);

  // Fetch project data via React Query (useProject already has enabled: !!projectId built-in)
  const { data: project, isLoading, error } = useProject(projectId ?? '');

  return {
    projectId,
    project: project ?? null,
    isLoading,
    error,
    hasProject: !!projectId,
  };
}
