'use client';

import { useProjectContext } from '@/hooks/useProjectContext';
import { Loader2 } from 'lucide-react';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId, project, isLoading, error, hasProject } = useProjectContext();

  if (!hasProject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-display font-semibold text-text-primary">
            No Project Selected
          </h2>
          <p className="text-sm text-text-muted max-w-sm">
            Select a project from the sidebar or navigate to the projects page to get started.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-signal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-display font-semibold text-status-danger">
            Project Not Found
          </h2>
          <p className="text-sm text-text-muted max-w-sm">
            The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
