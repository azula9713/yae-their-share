import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import {
  SplitsCacheService,
  ConvexSplitsService,
} from "@/lib/splits-cache-service";
import { ISplit } from "@/types/split.types";
import { api } from "@/convex/_generated/api";

interface UseCachedSplitsOptions {
  userId: string;
  includeDeleted?: boolean;
  maxAge?: number;
  staleWhileRevalidate?: boolean;
}

export function useCachedSplits(options: UseCachedSplitsOptions) {
  const convex = useConvex();
  const {
    userId,
    includeDeleted = false,
    maxAge = 5 * 60 * 1000,
    staleWhileRevalidate = true,
  } = options;

  return useQuery({
    queryKey: ["splits", userId, includeDeleted],
    queryFn: async (): Promise<ISplit[]> => {
      try {
        const isCacheValid = await SplitsCacheService.isCacheValid(
          userId,
          maxAge
        );

        if (isCacheValid && staleWhileRevalidate) {
          const cachedData = await SplitsCacheService.getCachedSplits(
            userId,
            includeDeleted
          );

          // Background refresh
          ConvexSplitsService.fetchAndCache(
            convex,
            userId,
            includeDeleted
          ).catch(console.error);

          return cachedData;
        }

        return await ConvexSplitsService.fetchAndCache(
          convex,
          userId,
          includeDeleted
        );
      } catch (error) {
        console.warn("Convex query failed, using cached data:", error);
        const cachedData = await SplitsCacheService.getCachedSplits(
          userId,
          includeDeleted
        );

        if (cachedData.length === 0) throw error;
        return cachedData;
      }
    },
    staleTime: staleWhileRevalidate ? maxAge : 0,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useCachedSplit(splitId: string) {
  const convex = useConvex();
  const splitsCacheDB = SplitsCacheService.getCachedSplitById(splitId);

  return useQuery({
    queryKey: ["split", splitId],
    queryFn: async (): Promise<ISplit | null> => {
      try {
        const cachedSplit = await splitsCacheDB;
        if (cachedSplit) return cachedSplit;

        const split = await convex.query(api.splits.getSplitById, {
          splitId,
        });
        if (!split) throw new Error(`Split with ID ${splitId} not found`);

        await SplitsCacheService.updateCache(split.createdBy, [split]);
        return split;
      } catch (error) {
        console.warn("Convex query failed, using cached data:", error);
        return await splitsCacheDB;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
