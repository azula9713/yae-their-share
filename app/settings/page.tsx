"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Download,
  Shield,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect } from "react";

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
  useUpdateUserSettings,
} from "@/hooks/user/use-user";
import { IAppSettings } from "@/types/settings.types";

export default function SettingsPage() {
  const theme = useTheme();

  const { data: user } = useGetCurrentUser();
  const { mutate: updateSettings, error: saveSettingsError } =
    useUpdateUserSettings();

  const defaultSettings: IAppSettings = {
    currency: {
      code: "USD",
      symbol: "$",
      currencyName: "United States Dollar",
      countryName: "United States",
      decimalPlaces: 2,
      displayCents: true,
    },
    privacy: {
      shareAnalytics: false,
      autoBackup: true,
    },
    display: {
      compactMode: false,
      theme: theme.theme ?? "system", // Default to system theme if not set
    },
  };

  const settings = user?.settings || defaultSettings;

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
        settings: defaultSettings,
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-teal-900/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-sm mb-6 hover:underline text-emerald-600 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="size-4 mr-1" />
          Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Customize your expense tracking experience
            </p>
          </div>
        </div>

        {saveSettingsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to save settings. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <CurrencySettings {...{ settings, updateSettings }} />

          {/* Privacy & Security */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
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
                  checked={settings.privacy.shareAnalytics}
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
                  checked={settings.privacy.autoBackup}
                  onCheckedChange={
                    (checked) => {}
                    // updateSetting("privacy.autoBackup", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-yellow-600" />
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
                  className="border-emerald-200 text-emerald-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-red-600">Clear All Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all events and settings
                  </p>
                </div>
                <Button variant="destructive" onClick={clearAllData}>
                  <Trash2 className="h-4 w-4 mr-2" />
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
