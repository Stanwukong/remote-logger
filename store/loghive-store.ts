import { LogEntry } from "@/types/analytics";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LogHiveState {
    currentProject: string | null;
    selectedTimeRange: '1h' | '24h' | '7d' | '30d';
    filterLevel: LogEntry['level'] | 'all';
    searchQuery: string;

    setCurrentProject: (projectId: string) => void;
    setTimeRange: (range: LogHiveState['selectedTimeRange']) => void;
    setFilterLevel: (level: LogHiveState['filterLevel']) => void;
    setSearchQuery: (query: string) => void
}