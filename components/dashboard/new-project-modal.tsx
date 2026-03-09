"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Copy, Check, Key, Folder, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateProject } from "@/hooks/project.hooks";

export function NewProjectModal() {
  const {
    mutateAsync: createProject,
    isPending,
    data: createdProjectData,
    reset: resetMutation,
  } = useCreateProject();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    // environment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Project name must be less than 50 characters";
    }

    // if (!formData.environment) {
    //   newErrors.environment = "Environment is required";
    // }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setOpen((prev) => !prev);
    setTimeout(() => {
      setStep("form");
      setFormData({ name: "", description: "" });
      setErrors({});
      setCopiedField(null);
      resetMutation();
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newProject = await createProject({
        ...formData,
        description: formData.description || undefined,
      });

      if (newProject) {
        toast.success("Project created successfully", {
          description: `${newProject.name} is ready to receive logs.`,
        });
      } else {
        throw new Error("Project is undefined");
      }

      setStep("success");
    } catch (error) {
      console.log(error)
      toast.error("Error creating project", {
        description: `An error occurred while creating the project.`,
      });
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success("Copied to clipboard", {
        description: `${field} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast("Failed to copy", {
        description: `Error: ${error}`,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {step === "form" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Create New Project
              </DialogTitle>
              <DialogDescription>
                Set up a new logging project to start monitoring your
                application. You&apos;ll receive a unique Project ID and API key
                to integrate with your app.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="My Awesome App"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  maxLength={50}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formData.name.length}/50 characters
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your project..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={errors.description ? "border-destructive" : ""}
                  rows={3}
                  maxLength={200}
                />
                {errors.description && (
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formData.description.length}/200 characters
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-status-ok">
                <Check className="w-5 h-5" />
                Project Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Your project has been created and is ready to receive logs. Save
                these credentials securely - you&apos;ll need them to integrate
                with your application.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {createdProjectData?.name}
                  </CardTitle>
                </CardHeader>
                {createdProjectData?.description && (
                  <CardContent className="pt-0">
                    <CardDescription>
                      {createdProjectData.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project ID</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={createdProjectData?.id || ""}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          createdProjectData?.id || "",
                          "Project ID"
                        )
                      }
                    >
                      {copiedField === "Project ID" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    API Key
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={createdProjectData?.apiKey || ""}
                      readOnly
                      className="font-mono text-sm"
                      type="password"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          createdProjectData?.apiKey || "",
                          "API Key"
                        )
                      }
                    >
                      {copiedField === "API Key" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep this API key secure. You can regenerate it later in
                    project settings.
                  </p>
                </div>
              </div>

              <Card className="bg-data-info/10 border-data-info/30">
                <CardContent className="pt-4">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Next Steps:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Install the Apperio SDK in your application</li>
                      <li>• Configure it with your Project ID and API Key</li>
                      <li>• Start sending logs to monitor your application</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
