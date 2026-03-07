"use client";

import {
  Github,
  Ticket,
  Siren,
  MessageSquare,
  MessagesSquare,
  LineChart,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Github,
  Ticket,
  Siren,
  MessageSquare,
  MessagesSquare,
  LineChart,
  Plug,
};

interface IntegrationIconProps {
  iconName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function IntegrationIcon({
  iconName,
  className,
  size = "md",
}: IntegrationIconProps) {
  const Icon = iconMap[iconName] || Plug;
  return <Icon className={cn(sizeClasses[size], className)} />;
}
