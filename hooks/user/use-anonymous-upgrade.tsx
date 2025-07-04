import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useFindAnonymousUserForUpgrade() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["anonymousUserForUpgrade"],
    queryFn: async () => {
      try {
        return await convex.mutation(api.authFunctions.findAnonymousUserForUpgrade);
      } catch (error) {
        console.warn("Failed to find anonymous user for upgrade:", error);
        return null;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUpgradeAnonymousUser() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ anonymousUserId }: { anonymousUserId: string }) => {
      return await convex.mutation(api.authFunctions.upgradeAnonymousUser, {
        anonymousUserId,
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["anonymousUserForUpgrade"] });
    },
    onError: (error) => {
      console.error("Error upgrading anonymous user:", error);
    },
  });
}

export function useMigrateAnonymousUserData() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
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
    onSuccess: (data) => {
      console.log("Data migration successful:", data);
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["splits"] });
      queryClient.invalidateQueries({ queryKey: ["anonymousUserForUpgrade"] });
    },
    onError: (error) => {
      console.error("Error migrating anonymous user data:", error);
    },
  });
}
