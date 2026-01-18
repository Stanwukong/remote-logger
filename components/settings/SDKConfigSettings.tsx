/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Code,
  Shield,
  Activity,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { projectService } from "@/services/project.service";
import {
  SDKConfig,
  DEFAULT_SDK_CONFIG,
  CustomRule,
  LogLevel,
  StrictMode,
  RuleSeverity,
  RuleCategory,
} from "@/types/sdk-config.types";

interface SDKConfigSettingsProps {
  projectId: string;
}

export default function SDKConfigSettings({
  projectId,
}: SDKConfigSettingsProps) {
  const [config, setConfig] = useState<SDKConfig>({
    projectId,
    ...DEFAULT_SDK_CONFIG,
  });

  // Debug: Log config changes
  useEffect(() => {
    console.log("Config state changed:", config);
  }, [config]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newRule, setNewRule] = useState<CustomRule>({
    pattern: "",
    replacement: "",
    description: "",
    severity: "medium",
    category: "pii",
  });

  const [newSensitiveField, setNewSensitiveField] = useState("");

  // Fetch existing configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await projectService.getSDKConfig(projectId);
      console.log("Fetched config from API:", data);
      if (data) {
        // Use API response directly, only ensure projectId is set
        setConfig({
          ...data,
          projectId,
        });
      }
    } catch (error: any) {
      // 404 means no config exists yet, use defaults
      if (error?.response?.status !== 404) {
        console.error("Failed to fetch config:", error);
        toast.error("Failed to load configuration");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (path: string, value: any) => {
    setConfig((prev) => {
      const keys = path.split(".");
      const newConfig = { ...prev };
      let current: any = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const addCustomRule = () => {
    if (!newRule.pattern || !newRule.replacement || !newRule.description) {
      toast.error("Please fill all rule fields");
      return;
    }

    updateConfig("sanitization.customRules", [
      ...config.sanitization.customRules,
      { ...newRule },
    ]);

    setNewRule({
      pattern: "",
      replacement: "",
      description: "",
      severity: "medium",
      category: "pii",
    });
  };

  const removeCustomRule = (index: number) => {
    updateConfig(
      "sanitization.customRules",
      config.sanitization.customRules.filter((_, i) => i !== index)
    );
  };

  const addSensitiveField = () => {
    if (!newSensitiveField.trim()) return;

    const fields = config.sanitization.presetConfig.sensitiveFields || [];
    if (!fields.includes(newSensitiveField.trim())) {
      updateConfig("sanitization.presetConfig.sensitiveFields", [
        ...fields,
        newSensitiveField.trim(),
      ]);
    }
    setNewSensitiveField("");
  };

  const removeSensitiveField = (field: string) => {
    updateConfig(
      "sanitization.presetConfig.sensitiveFields",
      config.sanitization.presetConfig.sensitiveFields.filter(
        (f) => f !== field
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await projectService.updateSDKConfig(projectId, config);
      toast.success(
        "Configuration saved successfully! Changes will apply within 5 minutes."
      );
      // Refresh config to get server timestamps
      setTimeout(() => fetchConfig(), 1000);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to save configuration. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  console.log("Rendering with config:", config);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            SDK Configuration
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure your logging SDK behavior and data sanitization
          </p>
        </div>
        <Button
          onClick={fetchConfig}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Core Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Core Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="minLogLevel">Minimum Log Level</Label>
            <select
              id="minLogLevel"
              value={config.minLogLevel}
              onChange={(e) =>
                updateConfig("minLogLevel", e.target.value as LogLevel)
              }
              className="w-full mt-2 px-4 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="trace">Trace (Most Verbose)</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="fatal">Fatal (Least Verbose)</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Only logs at or above this level will be captured
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label htmlFor="environment">
                Environment{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="environment"
                type="text"
                value={config.environment || ""}
                onChange={(e) => updateConfig("environment", e.target.value)}
                placeholder="production, staging, development"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="serviceName">
                Service Name{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="serviceName"
                type="text"
                value={config.serviceName || ""}
                onChange={(e) => updateConfig("serviceName", e.target.value)}
                placeholder="api-service, frontend-app"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                min="1"
                max="100"
                value={config.batchSize}
                onChange={(e) =>
                  updateConfig("batchSize", parseInt(e.target.value))
                }
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Logs per batch (1-100)
              </p>
            </div>

            <div>
              <Label htmlFor="flushInterval">Flush Interval (ms)</Label>
              <Input
                id="flushInterval"
                type="number"
                min="1000"
                max="60000"
                step="1000"
                value={config.flushIntervalMs}
                onChange={(e) =>
                  updateConfig("flushIntervalMs", parseInt(e.target.value))
                }
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">1000-60000ms</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Capture Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Auto-Capture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(config.autoCapture).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <Switch
                  checked={value}
                  onCheckedChange={() =>
                    updateConfig(`autoCapture.${key}`, !value)
                  }
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sanitization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Sanitization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
            <span className="text-sm font-medium">Enable Sanitization</span>
            <Switch
              checked={config.sanitization.enabled}
              onCheckedChange={() =>
                updateConfig(
                  "sanitization.enabled",
                  !config.sanitization.enabled
                )
              }
            />
          </label>

          {config.sanitization.enabled && (
            <>
              <div>
                <Label>Strict Mode</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {(["LENIENT", "BALANCED", "STRICT"] as StrictMode[]).map(
                    (mode) => (
                      <Button
                        key={mode}
                        type="button"
                        variant={
                          config.sanitization.strictMode === mode
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          updateConfig("sanitization.strictMode", mode)
                        }
                      >
                        {mode}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <span className="text-sm font-medium">Audit Enabled</span>
                  <Switch
                    checked={config.sanitization.presetConfig.auditEnabled}
                    onCheckedChange={() =>
                      updateConfig(
                        "sanitization.presetConfig.auditEnabled",
                        !config.sanitization.presetConfig.auditEnabled
                      )
                    }
                  />
                </label>

                <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <span className="text-sm font-medium">Anonymization</span>
                  <Switch
                    checked={
                      config.sanitization.presetConfig.anonymizationEnabled
                    }
                    onCheckedChange={() =>
                      updateConfig(
                        "sanitization.presetConfig.anonymizationEnabled",
                        !config.sanitization.presetConfig.anonymizationEnabled
                      )
                    }
                  />
                </label>
              </div>

              {/* Sensitive Fields */}
              <div>
                <Label>Sensitive Fields</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    value={newSensitiveField}
                    onChange={(e) => setNewSensitiveField(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSensitiveField()}
                    placeholder="e.g., password, ssn, email"
                  />
                  <Button type="button" onClick={addSensitiveField}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {config.sanitization.presetConfig.sensitiveFields?.map(
                    (field, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {field}
                        <button
                          type="button"
                          onClick={() => removeSensitiveField(field)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Retention Policy */}
              <div className="border-t pt-5">
                <h3 className="text-sm font-semibold mb-4">Retention Policy</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="maxAge">Max Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      min="1"
                      value={
                        config.sanitization.presetConfig.retentionPolicy.maxAge
                      }
                      onChange={(e) =>
                        updateConfig(
                          "sanitization.presetConfig.retentionPolicy.maxAge",
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSize">Max Size (MB)</Label>
                    <Input
                      id="maxSize"
                      type="number"
                      min="1"
                      value={
                        config.sanitization.presetConfig.retentionPolicy.maxSize
                      }
                      onChange={(e) =>
                        updateConfig(
                          "sanitization.presetConfig.retentionPolicy.maxSize",
                          parseInt(e.target.value)
                        )
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <span className="text-sm">Auto Delete</span>
                    <Switch
                      checked={
                        config.sanitization.presetConfig.retentionPolicy
                          .autoDelete
                      }
                      onCheckedChange={() =>
                        updateConfig(
                          "sanitization.presetConfig.retentionPolicy.autoDelete",
                          !config.sanitization.presetConfig.retentionPolicy
                            .autoDelete
                        )
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <span className="text-sm">Archive Before Delete</span>
                    <Switch
                      checked={
                        config.sanitization.presetConfig.retentionPolicy
                          .archiveBeforeDelete
                      }
                      onCheckedChange={() =>
                        updateConfig(
                          "sanitization.presetConfig.retentionPolicy.archiveBeforeDelete",
                          !config.sanitization.presetConfig.retentionPolicy
                            .archiveBeforeDelete
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Custom Rules */}
              <div className="border-t pt-5">
                <h3 className="text-sm font-semibold mb-4">
                  Custom Sanitization Rules
                </h3>
                <div className="space-y-3 mb-4">
                  <Input
                    type="text"
                    value={newRule.pattern}
                    onChange={(e) =>
                      setNewRule({ ...newRule, pattern: e.target.value })
                    }
                    placeholder="RegEx Pattern (e.g., \b\d{3}-\d{2}-\d{4}\b)"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="text"
                      value={newRule.replacement}
                      onChange={(e) =>
                        setNewRule({ ...newRule, replacement: e.target.value })
                      }
                      placeholder="Replacement (e.g., [REDACTED])"
                    />
                    <Input
                      type="text"
                      value={newRule.description}
                      onChange={(e) =>
                        setNewRule({ ...newRule, description: e.target.value })
                      }
                      placeholder="Description"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={newRule.severity}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          severity: e.target.value as RuleSeverity,
                        })
                      }
                      className="px-4 py-2 border border-input rounded-lg bg-background"
                    >
                      <option value="low">Low Severity</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <select
                      value={newRule.category}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          category: e.target.value as RuleCategory,
                        })
                      }
                      className="px-4 py-2 border border-input rounded-lg bg-background"
                    >
                      <option value="pii">PII</option>
                      <option value="financial">Financial</option>
                      <option value="authentication">Authentication</option>
                      <option value="custom">Custom</option>
                    </select>
                    <Button
                      type="button"
                      onClick={addCustomRule}
                      variant="secondary"
                    >
                      Add Rule
                    </Button>
                  </div>
                </div>

                {config.sanitization.customRules.length > 0 && (
                  <div className="space-y-2">
                    {config.sanitization.customRules.map((rule, index) => (
                      <div
                        key={index}
                        className="p-4 bg-secondary rounded-lg border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium">
                              {rule.description}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">
                              {rule.pattern}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomRule(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-background rounded border capitalize">
                            {rule.severity}
                          </span>
                          <span className="px-2 py-1 bg-background rounded border capitalize">
                            {rule.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
