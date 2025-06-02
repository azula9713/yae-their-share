"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Shield,
  Download,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";
import CurrencySettings from "@/components/settings/currency-settings";
import { IAppSettings } from "@/types/settings.types";
import {
  useGetCurrentUser,
  useUpdateUserSettings,
} from "@/hooks/user/use-user";
import { getCurrencyByCode } from "global-currency-list";

export default function SettingsPage() {
  const theme = useTheme();

  const { data: user } = useGetCurrentUser();
  const {
    mutate: saveUserSettings,
    isPending: settingsSaving,
    error: saveSettingsError,
  } = useUpdateUserSettings();

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

  const [settings, setSettings] = useState<IAppSettings>(defaultSettings);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(user?.settings);

  const updateCurrency = (code: string) => {
    const currency = getCurrencyByCode(code);
    const existingCurrency = settings.currency;
    if (currency) {
      updateSetting("currency", {
        ...existingCurrency,
        code: currency.code,
        symbol: currency.symbol,
        currencyName: currency.currency_name,
        countryName: currency.country_name,
        decimalPlaces: Number(currency.decimal_units) || 2,
      });
    }
  };

  const updateSetting = (path: string, value: any) => {
    const newSettings = { ...settings };
    const keys = path.split(".");
    let current: any = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] ??= {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

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

    if (user.settings) {
      setSettings(user.settings);
    } else {
      saveUserSettings({
        settings: defaultSettings,
        userId: user.id,
      });
      setSettings(defaultSettings);
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

          {hasChanges && (
            <Button
              onClick={() => {
                saveUserSettings({
                  settings,
                  userId: user?.id!,
                });
              }}
              disabled={!hasChanges || settingsSaving}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              {settingsSaving && (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                  Saving...
                </>
              )}
              {!settingsSaving && !saveSettingsError && (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
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
          {/* Currency & Formatting */}
          {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Currency & Formatting
              </CardTitle>
              <CardDescription>
                Configure how monetary values are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency.code}
                    onValueChange={(value) => updateSetting("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={`${currency.code + currency.country_name}`}
                          value={currency.code}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {currency.code}
                            </Badge>
                           
                            <span>{currency.currency_name}</span>
                             <span className="font-mono text-sm">
                              {currency.symbol}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Select
                    value={settings.currency.decimalPlaces.toString()}
                    onValueChange={(value) =>
                      updateSetting("decimalPlaces", Number.parseInt(value))
                    }
                  >
                    <SelectTrigger id="decimal-places">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (No decimals)</SelectItem>
                      <SelectItem value="2">2 (Standard)</SelectItem>
                      <SelectItem value="3">3 (Precise)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Cents</Label>
                    <p className="text-sm text-muted-foreground">
                      Display decimal places in amounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.showCents}
                    onCheckedChange={(checked) =>
                      updateSetting("display.showCents", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="round-to">Round to Nearest</Label>
                  <Select
                    value={settings.display.roundToNearest}
                    onValueChange={(value) =>
                      updateSetting("display.roundToNearest", value)
                    }
                  >
                    <SelectTrigger id="round-to">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01 (Penny)</SelectItem>
                      <SelectItem value="0.05">0.05 (Nickel)</SelectItem>
                      <SelectItem value="0.10">0.10 (Dime)</SelectItem>
                      <SelectItem value="0.25">0.25 (Quarter)</SelectItem>
                      <SelectItem value="1.00">1.00 (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                  Preview:
                </p>
                <div className="space-y-1 text-sm">
                  <p>Small amount: {formatCurrencyExample(12.34)}</p>
                  <p>Large amount: {formatCurrencyExample(1234.56)}</p>
                  <p>Round number: {formatCurrencyExample(100)}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          <CurrencySettings {...{ settings, updateCurrency, updateSetting }} />

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
                  onCheckedChange={(checked) =>
                    updateSetting("privacy.shareAnalytics", checked)
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
                  onCheckedChange={(checked) =>
                    updateSetting("privacy.autoBackup", checked)
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
