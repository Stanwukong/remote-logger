"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2 } from "lucide-react";
import SDKConfigSettings from "@/components/settings/SDKConfigSettings";

export default function SDKConfigSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  return (
    <div className="space-y-6 max-w-3xl">
      <SDKConfigSettings projectId={projectId} />
    </div>
  );
}
