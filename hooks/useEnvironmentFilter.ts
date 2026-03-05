'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useLogHiveStore } from '@/store/loghive-store';

export function useEnvironmentFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedEnvironment = useLogHiveStore((s) => s.selectedEnvironment);
  const setSelectedEnvironment = useLogHiveStore((s) => s.setSelectedEnvironment);

  const paramName = 'env';

  // Read from URL on mount
  useEffect(() => {
    const urlValue = searchParams.get(paramName);
    if (urlValue && urlValue !== selectedEnvironment) {
      setSelectedEnvironment(urlValue);
    }
  }, [searchParams]);

  // Set environment — updates store AND URL
  const setEnvironment = useCallback((env: string) => {
    setSelectedEnvironment(env);
    const params = new URLSearchParams(searchParams.toString());
    if (env === 'all') {
      params.delete(paramName);
    } else {
      params.set(paramName, env);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, pathname, router, setSelectedEnvironment]);

  return {
    environment: selectedEnvironment,
    setEnvironment,
    isFiltered: selectedEnvironment !== 'all',
  };
}
