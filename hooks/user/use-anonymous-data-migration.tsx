"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGetCurrentUser } from "@/hooks/user/use-user";
import { migrationStorage } from "@/lib/migration/store";
import { IMigrationData } from "@/types/migration.types";

interface AnonymousUser {
  _id: string;
  id: string;
  isAnonymous: boolean;
}

export function useAnonymousUserManager() {
  const { data: user } = useGetCurrentUser();
  const convex = useConvex();
  const queryClient = useQueryClient();
  const [migrationStatus, setMigrationStatus] = useState<
    "idle" | "migrating" | "success" | "error"
  >("idle");

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
      setMigrationStatus("success");
      migrationStorage.clear();
      queryClient.invalidateQueries();

      // Optional: Show success notification (remove alert for better UX)
      if (result.migratedSplitsCount > 0) {
        console.log(
          `Migration completed: ${result.migratedSplitsCount} splits migrated`
        );
      }
    },
    onError: (error) => {
      setMigrationStatus("error");
      migrationStorage.clear();
      console.error("Migration failed:", error);
    },
  });

  // Auto-migration effect
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const migrationData = migrationStorage.retrieve();
    if (!migrationData) return;

    setMigrationStatus("migrating");
    migrationMutation.mutate({
      anonymousUserId: migrationData.anonymousUserId as Id<"users">,
      authenticatedUserId: user._id,
    });
  }, [user, migrationMutation]);

  // Store anonymous data for migration
  const prepareForMigration = (anonymousUser: AnonymousUser) => {
    if (!anonymousUser?.isAnonymous) return;

    const migrationData: IMigrationData = {
      anonymousUserId: anonymousUser._id,
      anonymousUserCustomId: anonymousUser.id,
      timestamp: Date.now(),
    };

    migrationStorage.store(migrationData);
  };

  return {
    prepareForMigration,
    migrationStatus,
    isAnonymous: user?.isAnonymous || false,
  };
}
