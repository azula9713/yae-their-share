// lib/splits-cache-service.ts
import { api } from "@/convex/_generated/api";
import { splitsCacheDB } from "@/lib/splits-cache-layer";
import { ISplit } from "@/types/split.types";

export class SplitsCacheService {
  static async getCacheAge(userId: string): Promise<number | null> {
    return splitsCacheDB.getCacheAge(userId);
  }

  static async getCachedSplits(
    userId: string,
    includeDeleted: boolean
  ): Promise<ISplit[]> {
    return splitsCacheDB.getCachedSplits(userId, includeDeleted);
  }

  static async updateCache(userId: string, splits: ISplit[]): Promise<void> {
    await splitsCacheDB.clearUserSplits(userId);
    for (const split of splits) {
      await splitsCacheDB.cacheSplit(userId, split);
    }
  }

  static async isCacheValid(userId: string, maxAge: number): Promise<boolean> {
    const cacheAge = await this.getCacheAge(userId);
    return cacheAge !== null && cacheAge < maxAge;
  }
}

export class ConvexSplitsService {
  static async fetchSplits(
    convex: any,
    userId: string,
    includeDeleted: boolean
  ): Promise<ISplit[]> {
    //if includeDeleted is true, we fetch both deleted and non-deleted splits and combine them
    const query = convex.query(api.splits.getSplitsByUserId, { userId });
    if (includeDeleted) {
      const deletedSplits = await convex.query(api.splits.getDeletedSplits, {
        userId,
      });
      const allSplits = await query;
      return [...allSplits, ...deletedSplits];
    }

    return await query;
  }

  static async fetchAndCache(
    convex: any,
    userId: string,
    includeDeleted: boolean
  ): Promise<ISplit[]> {
    const data = await this.fetchSplits(convex, userId, includeDeleted);
    await SplitsCacheService.updateCache(userId, data);
    return data;
  }
}
