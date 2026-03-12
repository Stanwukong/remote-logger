'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MasterDetailLayoutProps {
  list: React.ReactNode;
  detail: React.ReactNode | null;
  detailOpen: boolean;
  onDetailClose: () => void;
  defaultListWidth?: number; // percentage, default 55
  minListWidth?: number; // px, default 300
  minDetailWidth?: number; // px, default 280
  className?: string;
}

export function MasterDetailLayout({
  list,
  detail,
  detailOpen,
  onDetailClose,
  defaultListWidth = 55,
  minListWidth = 300,
  minDetailWidth = 280,
  className,
}: MasterDetailLayoutProps) {
  const [listWidthPercent, setListWidthPercent] = useState(defaultListWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      const newListWidth = e.clientX - rect.left;
      const newDetailWidth = totalWidth - newListWidth;

      if (newListWidth >= minListWidth && newDetailWidth >= minDetailWidth) {
        setListWidthPercent((newListWidth / totalWidth) * 100);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minListWidth, minDetailWidth]);

  return (
    <div ref={containerRef} className={cn('flex h-full overflow-hidden', className)}>
      {/* List Panel */}
      <div
        className="overflow-y-auto"
        style={{ width: detailOpen ? `${listWidthPercent}%` : '100%' }}
      >
        {list}
      </div>

      {/* Drag Handle + Detail Panel */}
      {detailOpen && detail && (
        <>
          <div
            onMouseDown={handleMouseDown}
            className="w-1 bg-border-subtle hover:bg-signal/40 cursor-col-resize shrink-0 transition-colors"
          />
          <div
            className="overflow-y-auto bg-bg-surface border-l border-border-subtle relative"
            style={{ width: `${100 - listWidthPercent}%` }}
          >
            <button
              onClick={onDetailClose}
              className="absolute top-3 right-3 p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
            {detail}
          </div>
        </>
      )}
    </div>
  );
}
