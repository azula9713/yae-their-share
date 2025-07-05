"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  Clock,
  CloudCheck,
  CloudAlert,
  CloudUpload,
} from "lucide-react";
import { useSync } from "@/providers/sync-provider";
import { formatDistanceToNow } from "date-fns";

interface SyncStatusProps {
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export function SyncStatus({
  showDetails = false,
  compact = false,
  className,
}: SyncStatusProps) {
  const { status, forceSync } = useSync();

  const getStatusIcon = () => {
    if (!status.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }

    if (status.isSyncing) {
      return <CloudUpload className="h-4 w-4 text-blue-500 animate-spin" />;
    }

    if (status.pendingOperations > 0) {
      return <CloudUpload className="h-4 w-4 text-yellow-500" />;
    }

    if (status.error) {
      return <CloudAlert className="h-4 w-4 text-red-500" />;
    }

    return <CloudCheck className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!status.isOnline) return "Offline";
    if (status.isSyncing) return "Syncing...";
    if (status.pendingOperations > 0)
      return `${status.pendingOperations} pending`;
    if (status.error) return "Sync error";
    return "Synced";
  };

  const getStatusColor = () => {
    if (!status.isOnline || status.error) return "destructive";
    if (status.isSyncing || status.pendingOperations > 0) return "secondary";
    return "default";
  };

  const formatLastSync = () => {
    if (!status.lastSyncTime) return "Never";
    return formatDistanceToNow(new Date(status.lastSyncTime), {
      addSuffix: true,
    });
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={forceSync}
              disabled={status.isSyncing}
              className={className}
            >
              {getStatusIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{getStatusText()}</div>
              <div className="text-muted-foreground">
                Last sync: {formatLastSync()}
              </div>
              {status.error && (
                <div className="text-red-500 text-xs mt-1">{status.error}</div>
              )}
              <div className="text-xs mt-1">Click to sync now</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={forceSync}
          disabled={status.isSyncing}
          className="flex items-center gap-1"
        >
          <RefreshCw
            className={`h-3 w-3 ${status.isSyncing ? "animate-spin" : ""}`}
          />
          Sync
        </Button>
      </div>

      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Wifi className="h-3 w-3" />
              <span>Connection: {status.isOnline ? "Online" : "Offline"}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              <span>Last sync: {formatLastSync()}</span>
            </div>

            {status.pendingOperations > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{status.pendingOperations} operations pending</span>
              </div>
            )}
          </div>

          {status.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Sync error: {status.error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

export function SyncIndicator({ className }: { className?: string }) {
  return <SyncStatus compact className={className} />;
}

export function SyncStatusPanel({ className }: { className?: string }) {
  return <SyncStatus showDetails className={className} />;
}
