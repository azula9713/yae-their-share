"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllCurrencies,
  getCurrencyByCode,
  getCurrencyByCountryName,
  getCurrencyByCurrencyName,
} from "global-currency-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  DollarSign,
  Globe,
  Bell,
  Shield,
  Download,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface AppSettings {
  currency: string;
  currencySymbol: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  notifications: {
    expenseAdded: boolean;
    settlementReminders: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    autoBackup: boolean;
  };
  display: {
    compactMode: boolean;
    showCents: boolean;
    roundToNearest: string;
  };
  defaultSplitMethod: string;
  language: string;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    currency: "USD",
    currencySymbol: "$",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    notifications: {
      expenseAdded: true,
      settlementReminders: true,
      weeklyReports: false,
    },
    privacy: {
      shareAnalytics: false,
      autoBackup: true,
    },
    display: {
      compactMode: false,
      showCents: true,
      roundToNearest: "0.01",
    },
    defaultSplitMethod: "equal",
    language: "en",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    // Load currencies dynamically if needed
    // This can be useful if you want to support more currencies in the future
    const loadCurrencies = () => {
      const allCurrencies = getAllCurrencies();
      console.log("Loaded currencies:", allCurrencies);
    };
    loadCurrencies();
  }, []);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("theirShareSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const updateSetting = (path: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      // Update currency symbol when currency changes
      if (path === "currency") {
        const currency = currencies.find((c) => c.code === value);
        if (currency) {
          newSettings.currencySymbol = currency.symbol;
        }
      }

      return newSettings;
    });
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaveStatus("saving");
    try {
      localStorage.setItem("theirShareSettings", JSON.stringify(settings));
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const exportData = () => {
    const events = localStorage.getItem("theirShareEvents") || "[]";
    const userData = localStorage.getItem("theirShareUser") || "{}";
    const settingsData = localStorage.getItem("theirShareSettings") || "{}";

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

  const formatCurrencyExample = (amount: number) => {
    const formatted = amount.toLocaleString("en-US", {
      minimumFractionDigits: settings.display.showCents
        ? settings.decimalPlaces
        : 0,
      maximumFractionDigits: settings.display.showCents
        ? settings.decimalPlaces
        : 0,
    });
    return `${settings.currencySymbol}${formatted}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-teal-900/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-sm mb-6 hover:underline text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
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
              onClick={saveSettings}
              disabled={saveStatus === "saving"}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        {saveStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to save settings. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Currency & Formatting */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20">
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
                    value={settings.currency}
                    onValueChange={(value) => updateSetting("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {currency.symbol}
                            </span>
                            <span>{currency.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {currency.code}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Select
                    value={settings.decimalPlaces.toString()}
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
          </Card>

          {/* Expense Defaults */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Expense Defaults
              </CardTitle>
              <CardDescription>
                Set default behaviors for new expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="split-method">Default Split Method</Label>
                  <Select
                    value={settings.defaultSplitMethod}
                    onValueChange={(value) =>
                      updateSetting("defaultSplitMethod", value)
                    }
                  >
                    <SelectTrigger id="split-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal Split</SelectItem>
                      <SelectItem value="percentage">
                        Percentage Split
                      </SelectItem>
                      <SelectItem value="custom">Custom Amounts</SelectItem>
                      <SelectItem value="shares">By Shares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more information in less space
                  </p>
                </div>
                <Switch
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) =>
                    updateSetting("display.compactMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-teal-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Expense Added</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone adds a new expense
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.expenseAdded}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.expenseAdded", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Settlement Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind you about pending settlements
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.settlementReminders}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.settlementReminders", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly expense summaries
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications.weeklyReports", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

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
