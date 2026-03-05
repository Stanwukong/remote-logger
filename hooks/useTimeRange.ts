'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useLogHiveStore, TimeRange } from '@/store/loghive-store';

export function useTimeRange() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const storeTimeRange = useLogHiveStore((s) => s.selectedTimeRange);
  const setStoreTimeRange = useLogHiveStore((s) => s.setTimeRange);
  const customTimeRange = useLogHiveStore((s) => s.customTimeRange);
  const setCustomTimeRange = useLogHiveStore((s) => s.setCustomTimeRange);

  // URL param name
  const paramName = 'timeRange';

  // Read from URL on mount — URL is source of truth
  useEffect(() => {
    const urlValue = searchParams.get(paramName) as TimeRange | null;
    if (urlValue && urlValue !== storeTimeRange && isValidTimeRange(urlValue)) {
      setStoreTimeRange(urlValue);
    }
  }, [searchParams]); // only run when URL changes

  // Set time range — updates both store AND URL
  const setTimeRange = useCallback((range: TimeRange) => {
    setStoreTimeRange(range);
    const params = new URLSearchParams(searchParams.toString());
    if (range === '24h') {
      params.delete(paramName); // default, no need in URL
    } else {
      params.set(paramName, range);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, pathname, router, setStoreTimeRange]);

  return {
    timeRange: storeTimeRange,
    customTimeRange,
    setTimeRange,
    setCustomTimeRange,
    // Helper: convert to API params
    getTimeRangeParams: () => getTimeRangeParams(storeTimeRange, customTimeRange),
  };
}

function isValidTimeRange(value: string): value is TimeRange {
  return ['1h', '6h', '24h', '7d', '30d', 'custom'].includes(value);
}

// Convert time range to API-compatible start/end params
function getTimeRangeParams(timeRange: TimeRange, custom: { start: Date; end: Date } | null) {
  if (timeRange === 'custom' && custom) {
    return { startDate: custom.start.toISOString(), endDate: custom.end.toISOString() };
  }
  const now = new Date();
  const msMap: Record<string, number> = {
    '1h': 3600000,
    '6h': 21600000,
    '24h': 86400000,
    '7d': 604800000,
    '30d': 2592000000,
  };
  const start = new Date(now.getTime() - (msMap[timeRange] || msMap['24h']));
  return { startDate: start.toISOString(), endDate: now.toISOString() };
}
