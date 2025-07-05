"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { SyncStatusPanel } from "@/components/sync/sync-status";
import { dbManagement, devUtils } from "@/lib/db/utils";
import { useSync } from "@/providers/sync-provider";

export function SyncSettings() {
  const { syncEngine, forceSync } = useSync();
  const [isClearing, setIsClearing] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [autoSync, setAutoSync] = useState(true);

  const refreshStats = async () => {
    try {
      const dbStats = await dbManagement.getStats();
      setStats(dbStats);
    } catch (error) {
      console.error("Failed to get stats:", error);
    }
  };

  React.useEffect(() => {
    refreshStats();
  }, []);

  const handleClearData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all local data? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      await dbManagement.clearAllData();
      await refreshStats();
      alert("Local data cleared successfully");
    } catch (error) {
      alert(`Failed to clear data: ${error}`);
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await dbManagement.exportData();
      setExportData(data);

      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `theirshare-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to export data: ${error}`);
    }
  };

  const handleImportData = async () => {
    if (!importFile) return;

    if (
      !confirm(
        "Are you sure you want to import this data? This will replace all existing local data."
      )
    ) {
      return;
    }

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      await dbManagement.importData(data);
      await refreshStats();
      alert("Data imported successfully");
      setImportFile(null);
    } catch (error) {
      alert(`Failed to import data: ${error}`);
    }
  };

  const handleResetPendingSync = async () => {
    try {
      const count = await dbManagement.resetPendingSync();
      alert(`Reset ${count} pending sync operations`);
      await refreshStats();
    } catch (error) {
      alert(`Failed to reset pending sync: ${error}`);
    }
  };

  const handleResolveConflicts = async () => {
    try {
      const count = await dbManagement.resolveConflictsWithServer();
      alert(`Resolved ${count} conflicts`);
      await refreshStats();
    } catch (error) {
      alert(`Failed to resolve conflicts: ${error}`);
    }
  };

  const handleCleanupOldOps = async () => {
    try {
      const count = await dbManagement.cleanupOldSyncOperations();
      alert(`Cleaned up ${count} old sync operations`);
      await refreshStats();
    } catch (error) {
      alert(`Failed to cleanup: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync Status
          </CardTitle>
          <CardDescription>
            Monitor the synchronization between local and cloud data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SyncStatusPanel />
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>Configure how data is synchronized</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-sync">Automatic Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync data in the background
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={forceSync} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Sync Now
            </Button>
            <Button onClick={refreshStats} variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
            <CardDescription>
              Local database usage and sync status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.splits.total}</Badge>
                <span className="text-sm">Total Splits</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    stats.splits.locallyModified > 0 ? "secondary" : "outline"
                  }
                >
                  {stats.splits.locallyModified}
                </Badge>
                <span className="text-sm">Modified Locally</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    stats.syncOperations.pending > 0 ? "destructive" : "outline"
                  }
                >
                  {stats.syncOperations.pending}
                </Badge>
                <span className="text-sm">Pending Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.syncOperations.total}</Badge>
                <span className="text-sm">Total Sync Ops</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.metadata}</Badge>
                <span className="text-sm">Metadata Entries</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, and manage your local data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>

            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="import-file"
              />
              <Label htmlFor="import-file" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </Label>
              {importFile && (
                <Button onClick={handleImportData} size="sm">
                  Import {importFile.name}
                </Button>
              )}
            </div>
          </div>

          {exportData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Data exported successfully! ({exportData.splits.length} splits,
                exported at {new Date(exportData.exportedAt).toLocaleString()})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Tools to resolve sync issues and conflicts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions can help resolve sync issues but should be used
              carefully. Always export your data first as a backup.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleResetPendingSync}
              variant="outline"
              size="sm"
            >
              Reset Pending Sync
            </Button>
            <Button
              onClick={handleResolveConflicts}
              variant="outline"
              size="sm"
            >
              Resolve Conflicts
            </Button>
            <Button onClick={handleCleanupOldOps} variant="outline" size="sm">
              Cleanup Old Operations
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={handleClearData}
              variant="destructive"
              size="sm"
              disabled={isClearing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear All Local Data"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              This will delete all local data. The data will be re-downloaded
              from the server on next sync.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Development Tools */}
      {process.env.NODE_ENV === "development" && (
        <Card>
          <CardHeader>
            <CardTitle>Development Tools</CardTitle>
            <CardDescription>
              Tools for development and testing (only available in development
              mode)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => devUtils.addTestData()}
                variant="outline"
                size="sm"
              >
                Add Test Data
              </Button>
              <Button
                onClick={() => devUtils.debugDatabaseState()}
                variant="outline"
                size="sm"
              >
                Debug Database State
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Open browser console to see debug output. You can also access
                `dbManagement` and `devUtils` objects in the console.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
