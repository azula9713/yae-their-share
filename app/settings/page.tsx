"use client";

import { AlertTriangle, Download, Shield, Trash2 } from "lucide-react";
import { useEffect } from "react";

import SubHeader from "@/components/common/sub-header";
import CurrencySettings from "@/components/settings/currency-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  useGetCurrentUser,
  useGetUserSettings,
  useUpdateUserSettings,
} from "@/hooks/user/use-user";
import { SyncSettings } from "@/components/settings/sync-settings";

export default function SettingsPage() {
  const { data: user } = useGetCurrentUser();
  const { mutate: updateSettings, error: saveSettingsError } =
    useUpdateUserSettings();

  const {
    currency: currencySettings,
    display: displaySettings,
    privacy: privacySettings,
  } = useGetUserSettings();

  const exportData = () => {
    const events = localStorage.getItem("theirShareEvents") ?? "[]";
    const userData = localStorage.getItem("theirShareUser") ?? "{}";
    const settingsData = localStorage.getItem("theirShareSettings") ?? "{}";

    const exportData = {
      events: JSON.parse(events),
      user: JSON.parse(userData),
      settings: JSON.parse(settingsData),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `their-share-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("theirShareEvents");
      localStorage.removeItem("theirShareUser");
      localStorage.removeItem("theirShareSettings");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!user) return;

    if (!user.settings) {
      // Initialize settings if not present
      updateSettings({
        settings: {
          currency: currencySettings,
          display: displaySettings,
          privacy: privacySettings,
        },
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <SubHeader />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your expense tracking experience
            </p>
          </div>
        </div>

        {saveSettingsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              Failed to save settings. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <CurrencySettings {...{ updateSettings }} />

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Anonymous Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app with usage data
                  </p>
                </div>
                <Switch
                  checked={privacySettings.shareAnalytics}
                  onCheckedChange={
                    (checked) => {}
                    // updateSetting("privacy.shareAnalytics", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup data to cloud (when logged in)
                  </p>
                </div>
                <Switch
                  checked={privacySettings.autoBackup}
                  onCheckedChange={
                    (checked) => {}
                    // updateSetting("privacy.autoBackup", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <SyncSettings />

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="size-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Export or clear your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download all your data as JSON
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="border-primary text-primary"
                >
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-destructive">Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all events and settings
                  </p>
                </div>
                <Button variant="destructive" onClick={clearAllData}>
                  <Trash2 className="size-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
