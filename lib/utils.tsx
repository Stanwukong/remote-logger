import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { AlertTriangle, Bug, Info, Zap } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLevelIcon = (level: string) => {
  switch (level) {
    case "error":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "warn":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "info":
      return <Info className="w-4 h-4 text-blue-500" />;
    case "debug":
      return <Bug className="w-4 h-4 text-gray-500" />;
    case "trace":
      return <Zap className="w-4 h-4 text-gray-400" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

export const getLevelColor = (level: string) => {
  switch (level) {
    case "error":
      return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
    case "warn":
      return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20";
    case "info":
      return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
    case "debug":
      return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20";
    case "trace":
      return "border-l-gray-400 bg-gray-50/30 dark:bg-gray-950/10";
    default:
      return "border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20";
  }
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: format(date, "MMM dd"),
    time: format(date, "HH:mm:ss.SSS"),
  };
};