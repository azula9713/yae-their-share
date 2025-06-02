import { api } from "@/convex/_generated/api";
import { IAppSettings } from "@/types/settings.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";

export function useGetCurrentUser() {
  const convex = useConvex();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const user = await convex.query(api.authFunctions.currentUser);
        return user;
      } catch (error) {
        console.warn("Convex query failed:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useUpdateUserSettings() {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ settings, userId }: { settings: IAppSettings; userId: string }) => {
      return await convex.mutation(api.users.updateUserSettings, {
        userId,
        settings,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Error updating user settings:", error);
    },
  });
}
