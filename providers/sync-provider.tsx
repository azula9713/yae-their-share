"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SyncEngine, ISyncStatus } from "@/lib/db/sync-engine";
import { useSyncEngine } from "@/hooks/use-sync";
import { useGetCurrentUser } from "@/hooks/user/use-user";

interface SyncContextType {
  syncEngine: SyncEngine | null;
  status: ISyncStatus;
  forceSync: () => Promise<void>;
  isInitialized: boolean;
  currentUser: any;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: React.ReactNode;
  convexUrl: string;
  syncIntervalMs?: number;
  maxRetries?: number;
  batchSize?: number;
  conflictResolution?: "server-wins" | "client-wins" | "manual";
}

export function SyncProvider({
  children,
  convexUrl,
  syncIntervalMs = 5000,
  maxRetries = 3,
  batchSize = 10,
  conflictResolution = "server-wins",
}: SyncProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: currentUser } = useGetCurrentUser();

  const { syncEngine, status, forceSync } = useSyncEngine({
    convexUrl,
    syncIntervalMs,
    maxRetries,
    batchSize,
    conflictResolution,
  });

  // Update sync engine with current user ID
  useEffect(() => {
    if (syncEngine) {
      if (currentUser?.id) {
        syncEngine.setUserId(currentUser.id);
      } else {
        // User logged out, clear their data
        syncEngine.clearUserData();
      }
    }
  }, [syncEngine, currentUser?.id]);

  useEffect(() => {
    if (syncEngine && !isInitialized) {
      setIsInitialized(true);
    }
  }, [syncEngine, isInitialized]);

  return (
    <SyncContext.Provider
      value={{
        syncEngine,
        status,
        forceSync,
        isInitialized,
        currentUser,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}

// HOC for components that need sync functionality
export function withSync<P extends object>(Component: React.ComponentType<P>) {
  return function SyncWrapper(props: P) {
    const sync = useSync();
    return <Component {...props} sync={sync} />;
  };
}
