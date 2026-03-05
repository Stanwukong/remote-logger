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
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-signal" />
          </div>
          SDK Configuration
        </h1>
        <p className="text-text-secondary mt-1 ml-[46px]">
          Configure your logging SDK behavior and data sanitization
        </p>
      </div>

      <SDKConfigSettings projectId={projectId} />
    </div>
  );
}
