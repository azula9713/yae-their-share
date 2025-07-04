import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ISplit } from "@/types/split.types";

export function useFetchAllSplits({ userId }: { userId?: string }) {
  const convex = useConvex();

  return useQuery({
    queryKey: ["splits", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      
      try {
        const splits = await convex.query(api.splits.getSplitsByUserId, {
          userId,
        });
        return splits;
      } catch (error) {
        console.warn("Convex query failed, using cached data:", error);
        return [];
      }
    },
    enabled: !!userId, // Only run the query when userId is available
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useFetchSplit(splitId: string) {
  const convex = useConvex();

  return useQuery({
    queryKey: ["split", splitId],
    queryFn: async (): Promise<ISplit | null> => {
      try {
        const split = await convex.query(api.splits.getSplitById, {
          splitId,
        });
        return split;
      } catch (error) {
        console.warn("Convex query failed, using cached data:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
