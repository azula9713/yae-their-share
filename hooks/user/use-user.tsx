import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { useTheme } from "next-themes";

import { api } from "@/convex/_generated/api";
import { IAppSettings } from "@/types/settings.types";

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

export function useGetUserSettings() {
  const { data: user } = useGetCurrentUser();
  const theme = useTheme();

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

  if (!user?.settings) {
    return defaultSettings;
  }

  const settings = user.settings;

  return {
    ...defaultSettings,
    ...settings,
    currency: {
      ...defaultSettings.currency,
      ...settings.currency,
    },
    privacy: {
      ...defaultSettings.privacy,
      ...settings.privacy,
    },
    display: {
      ...defaultSettings.display,
      ...settings.display,
    },
  };
}
export function useUpdateUserSettings() {
  const convex = useConvex();
  const queryClient = useQueryClient();
  const { data: user } = useGetCurrentUser();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ settings }: { settings: IAppSettings }) => {
      return await convex.mutation(api.users.updateUserSettings, {
        userId: userId!,
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
