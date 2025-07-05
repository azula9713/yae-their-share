"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGetCurrentUser } from "@/hooks/user/use-user";

interface AnonymousUser {
  _id: string;
  id: string;
  isAnonymous: boolean;
}

interface MigrationData {
  anonymousUserId: string;
  anonymousUserCustomId: string;
  timestamp: number;
}

const MIGRATION_STORAGE_KEY = 'anonymousUserMigration';

// Storage utilities
const migrationStorage = {
  store: (data: MigrationData) => {
    try {
      sessionStorage.setItem(MIGRATION_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store migration data:', error);
    }
  },
  
  retrieve: (): MigrationData | null => {
    try {
      const data = sessionStorage.getItem(MIGRATION_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve migration data:', error);
      return null;
    }
  },
  
  clear: () => {
    try {
      sessionStorage.removeItem(MIGRATION_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear migration data:', error);
    }
  }
};

export function useAnonymousUserManager() {
  const { data: user } = useGetCurrentUser();
  const convex = useConvex();
  const queryClient = useQueryClient();
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');

  const migrationMutation = useMutation({
    mutationFn: async ({
      anonymousUserId,
      authenticatedUserId,
    }: {
      anonymousUserId: Id<"users">;
      authenticatedUserId: Id<"users">;
    }) => {
      return await convex.mutation(api.authFunctions.migrateAnonymousUserData, {
        anonymousUserId,
        authenticatedUserId,
      });
    },
    onSuccess: (result) => {
      setMigrationStatus('success');
      migrationStorage.clear();
      queryClient.invalidateQueries();
      
      // Optional: Show success notification (remove alert for better UX)
      if (result.migratedSplitsCount > 0) {
        console.log(`Migration completed: ${result.migratedSplitsCount} splits migrated`);
      }
    },
    onError: (error) => {
      setMigrationStatus('error');
      migrationStorage.clear();
      console.error('Migration failed:', error);
    },
  });

  // Auto-migration effect
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const migrationData = migrationStorage.retrieve();
    if (!migrationData) return;

    setMigrationStatus('migrating');
    migrationMutation.mutate({
      anonymousUserId: migrationData.anonymousUserId as Id<"users">,
      authenticatedUserId: user._id,
    });
  }, [user, migrationMutation]);

  // Store anonymous data for migration
  const prepareForMigration = (anonymousUser: AnonymousUser) => {
    if (!anonymousUser?.isAnonymous) return;

    const migrationData: MigrationData = {
      anonymousUserId: anonymousUser._id,
      anonymousUserCustomId: anonymousUser.id,
      timestamp: Date.now()
    };
    
    migrationStorage.store(migrationData);
  };

  return {
    prepareForMigration,
    migrationStatus,
    isAnonymous: user?.isAnonymous || false,
  };
}
